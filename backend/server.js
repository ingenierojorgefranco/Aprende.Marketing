
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const initDb = require('./initDb'); // Módulo dedicado
const { generateContent, generateFullStrategy } = require('./geminiService');
const { authMiddleware } = require('./authMiddleware');
const stripeService = require('./stripeService'); // Nuevo Servicio Stripe

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v20_ty_json_integration_final'; 

app.enable('trust proxy');

app.use(cors());

// ======================================================
//  STRIPE WEBHOOK (MUST BE BEFORE BODY PARSERS)
// ======================================================
// Stripe requiere el cuerpo "raw" para validar la firma del webhook.
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Si tenemos el secreto de firma, validamos. Si no (dev mode), parseamos manual.
        if (endpointSecret) {
            event = stripeService.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            // Fallback inseguro solo para desarrollo si no se configuró secreto
            event = JSON.parse(req.body.toString());
        }
        
        await stripeService.handleWebhook(event);
        res.json({ received: true });

    } catch (err) {
        console.error(`[Stripe Webhook Error]: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// ======================================================
//  GLOBAL MIDDLEWARE (Body Parsers)
// ======================================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ======================================================
//  LOGGING
// ======================================================
app.use((req, res, next) => {
  if (req.path.includes('webhook')) return next(); // Skip logging body for webhook
  console.log(
    `[API] ${req.method} ${req.path} (host: ${req.hostname || req.headers.host})`
  );
  next();
});

// ======================================================
//  REDIRECCIÓN WWW → DOMINIO RAÍZ
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  if (host === `www.${BASE_DOMAIN}`) {
    const targetUrl = `https://${BASE_DOMAIN}${req.originalUrl || ''}`;
    return res.redirect(301, targetUrl);
  }
  next();
});

// ======================================================
//  MULTI-TENANT: DETECTAR SUBDOMINIO
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  let tenant = null;

  try {
    if (host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}`) {
      tenant = null;
    } else if (host.endsWith(`.${BASE_DOMAIN}`)) {
      const sub = host.replace(`.${BASE_DOMAIN}`, '');
      tenant = sub.split('.')[0];
    }
  } catch (e) {
    tenant = null;
  }

  req.tenantSubdomain = tenant;
  next();
});

// ======================================================
//  SYSTEM LOGGING HELPER
// ======================================================
const logSystemActivity = async (userId, userName, actionType, entityType, entityId, details) => {
    try {
        await pool.query(
            `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId || null, 
                userName || 'Sistema', 
                actionType, 
                entityType || null, 
                entityId ? String(entityId) : null, 
                details ? JSON.stringify(details) : null
            ]
        );
    } catch (e) {
        console.error("[System Log Error] Could not save log:", e.message);
        // No throw to prevent API failure
    }
};

// ======================================================
//  CRM LOGGING HELPER
// ======================================================
const logCRMActivity = async (contactId, type, content, createdBy = null) => {
    try {
        await pool.query(
            `INSERT INTO crm_activities (contact_id, type, content, created_at) VALUES (?, ?, ?, NOW())`,
            [contactId, type, content]
        );
    } catch (e) {
        console.error("[CRM Log Error]", e.message);
    }
};

// ======================================================
//  HELPERS ANALYTICS
// ======================================================
const recordVisit = async (pageId) => {
    try {
        // 1. Actualizar contador total (Histórico)
        await pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [pageId]);
        
        // 2. Insertar/Actualizar en historial diario (YYYY-MM-DD) para la gráfica
        const today = new Date().toISOString().split('T')[0];
        await pool.query(
            `INSERT INTO daily_analytics (page_id, date, visits, conversions) 
             VALUES (?, ?, 1, 0) 
             ON DUPLICATE KEY UPDATE visits = visits + 1`,
            [pageId, today]
        );
    } catch (error) {
        // No bloqueamos la respuesta si falla el analytics
        console.error(`[Analytics] Error registrando visita para página ${pageId}:`, error.message);
    }
};

/**
 * Verifica si la petición viene de un usuario logueado (Admin/Dueño).
 * Si tiene token válido, retorna TRUE.
 */
const isAdminRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false; // No hay token -> Es visitante
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        jwt.verify(token, JWT_SECRET);
        return true; // Token válido -> Es admin
    } catch (e) {
        return false; // Token inválido -> Es visitante
    }
};

// ======================================================
//  HELPERS AUTH & PLANS & QUOTAS
// ======================================================
const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Default limits for new users (Starter Plan)
const DEFAULT_LIMITS = {
    planName: 'starter',
    maxProjects: 1,
    maxLandings: 2,
    maxArticles: 2,
    maxDomains: 1,
    features: {
        whatsappBot: false,
        blogGenerator: false,
        emailMarketing: false,
        removeBranding: false,
        emailStrategy: false,
        evergreenStrategy: false
    }
};

// Middleware for Admin Check
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
    }
    next();
};

/**
 * CHECK QUOTA LOGIC
 * Checks usage_logs for current month.
 */
const checkMonthlyQuota = async (userId, resourceType, limit) => {
    // Admins bypass quotas
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (user[0] && user[0].role === 'admin') return true;

    // Check usage for current month & year
    const [rows] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM usage_logs 
        WHERE user_id = ? 
          AND resource_type = ? 
          AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
          AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `, [userId, resourceType]);

    const used = rows[0].count;
    // Si el límite es -1 o muy alto, es ilimitado
    if (limit > 9000 || limit < 0) return true; 
    
    if (used >= limit) {
        return false;
    }
    return true;
};

const logUsage = async (userId, resourceType) => {
    try {
        await pool.query('INSERT INTO usage_logs (user_id, resource_type) VALUES (?, ?)', [userId, resourceType]);
    } catch (e) {
        console.error("Error logging usage:", e);
    }
};

// ======================================================
//  STRIPE CHECKOUT ROUTE
// ======================================================
app.post('/api/stripe/create-checkout-session', authMiddleware, async (req, res) => {
    const { planSlug } = req.body;
    
    if (!planSlug) return res.status(400).json({ error: "Plan no especificado." });

    try {
        const checkoutUrl = await stripeService.createCheckoutSession(req.user.id, req.user.email, planSlug);
        res.json({ url: checkoutUrl });
    } catch (e) {
        console.error("[Stripe Checkout Error]", e);
        res.status(500).json({ error: e.message || "Error al crear sesión de pago." });
    }
});

// ======================================================
//  AUTH
// ======================================================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email ya registrado' });

    // Buscar si existe un plan Starter para asignar sus límites reales
    const [starterPlan] = await pool.query("SELECT limits_config FROM plans WHERE slug = 'starter'");
    const planLimits = starterPlan.length > 0 
        ? (typeof starterPlan[0].limits_config === 'string' ? JSON.parse(starterPlan[0].limits_config) : starterPlan[0].limits_config)
        : DEFAULT_LIMITS;

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active, plan_limits) VALUES (?, ?, ?, ?, 1, ?)',
      [name, email, passwordHash, role || 'user', 1, JSON.stringify(planLimits)]
    );
    const newUser = { id: result.insertId, name, email, role: role || 'user', planLimits };
    const token = createToken(newUser);
    
    // Log Activity
    await logSystemActivity(newUser.id, newUser.name, 'REGISTER', 'user', newUser.id, { email });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('[AUTH] Error register:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ error: 'Usuario inactivo' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    // Log Activity
    await logSystemActivity(user.id, user.name, 'LOGIN', 'user', user.id, { ip: req.ip });

    let planLimits = DEFAULT_LIMITS;
    if (user.plan_limits) {
        planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      public_subdomain: user.public_subdomain,
      planLimits: planLimits,
      avatarUrl: user.avatar_url,
      birthDate: user.birth_date,
      createdAt: user.created_at,
      customRedirectUrl: user.custom_redirect_url
    };
    const token = createToken(userResponse);
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('[AUTH] Error login:', error);
    res.status(500).json({ error: 'Error de base de datos' });
  }
};

app.post('/api/auth/login', loginHandler);
app.post('/api/login', loginHandler);

app.post('/api/auth/logout', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        const name = rows[0]?.name || 'Usuario';
        await logSystemActivity(req.user.id, name, 'LOGOUT', 'user', req.user.id, { ip: req.ip });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: true });
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    const user = rows[0];
    let planLimits = DEFAULT_LIMITS;
    if (user.plan_limits) {
        planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        public_subdomain: user.public_subdomain,
        planLimits: planLimits,
        avatarUrl: user.avatar_url,
        birthDate: user.birth_date,
        createdAt: user.created_at,
        customRedirectUrl: user.custom_redirect_url
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
    const { name, email, avatarUrl, birthDate } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Nombre y Email son obligatorios" });
    }

    try {
        await pool.query(
            'UPDATE users SET name = ?, email = ?, avatar_url = ?, birth_date = ? WHERE id = ?',
            [name, email, avatarUrl, birthDate, req.user.id]
        );
        
        const [rows] = await pool.query(
            'SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url FROM users WHERE id = ?',
            [req.user.id]
        );
        
        const user = rows[0];
        let planLimits = DEFAULT_LIMITS;
        if (user.plan_limits) {
            planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            planLimits: planLimits,
            avatarUrl: user.avatar_url,
            birthDate: user.birth_date,
            createdAt: user.created_at,
            customRedirectUrl: user.custom_redirect_url
        });

    } catch (e) {
        console.error("Error updating profile:", e);
        res.status(500).json({ error: "Error al actualizar perfil" });
    }
});

// ======================================================
//  SYSTEM SETTINGS
// ======================================================
app.get('/api/settings/redirect', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'after_login_url'");
        const url = rows.length > 0 ? rows[0].setting_value : '/dashboard';
        res.json({ url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/admin/settings', authMiddleware, adminMiddleware, async (req, res) => {
    const { key, value } = req.body;
    try {
        await pool.query(
            `INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`,
            [key, value, value]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_SETTINGS', 'setting', key, { value });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  PLANS
// ======================================================
app.get('/api/public/plans', async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM plans WHERE is_active = 1 ORDER BY price_monthly ASC');
        const formattedPlans = plans.map(p => ({
            id: p.id.toString(),
            name: p.name,
            slug: p.slug,
            description: p.description,
            priceMonthly: parseFloat(p.price_monthly),
            currency: p.currency,
            stripePriceId: p.stripe_price_id,
            limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config,
            uiFeatures: typeof p.ui_features === 'string' ? JSON.parse(p.ui_features) : (p.ui_features || []),
            isRecommended: !!p.is_recommended
        }));
        res.json(formattedPlans);
    } catch (e) {
        console.error("[Plans] Error fetching public plans:", e);
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  LMS
// ======================================================
app.get('/api/courses', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT id, title, slug FROM courses WHERE is_active = 1 ORDER BY order_index ASC');
        res.json(courses);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/courses/:slug', authMiddleware, async (req, res) => {
    const { slug } = req.params;
    try {
        const [courses] = await pool.query('SELECT * FROM courses WHERE slug = ?', [slug]);
        if (courses.length === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        const course = courses[0];
        if (!course.is_active && req.user.role !== 'admin') {
             return res.status(403).json({ error: 'Este curso no está disponible actualmente.' });
        }
        const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [course.id]);
        const responseData = {
            id: course.id.toString(),
            title: course.title,
            subtitle: course.subtitle,
            badge_text: course.badge_text,
            description: course.description,
            modules: modules.map(mod => ({ ...mod, id: mod.id.toString(), lessons: [] }))
        };
        res.json(responseData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/modules/:moduleId/lessons', authMiddleware, async (req, res) => {
    try {
        const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [req.params.moduleId]);
        res.json(lessons.map(l => ({
            ...l,
            id: l.id.toString(),
            learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || [])
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/lessons/:lessonId/comments', authMiddleware, async (req, res) => {
    try {
        const [comments] = await pool.query(`
            SELECT c.*, u.name as user_name FROM lesson_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.lesson_id = ? AND c.is_approved = 1 ORDER BY c.created_at DESC
        `, [req.params.lessonId]);

        const formatted = comments.map(c => ({
            id: c.id.toString(),
            user: c.user_name,
            date: new Date(c.created_at).toLocaleString(),
            text: c.content,
            likes: c.likes,
            parentId: c.parent_id ? c.parent_id.toString() : null
        }));
        const rootComments = formatted.filter(c => !c.parentId);
        const replies = formatted.filter(c => c.parentId);
        res.json(rootComments.map(root => ({ ...root, replies: replies.filter(r => r.parentId === root.id) })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/comments', authMiddleware, async (req, res) => {
    const { lessonId, content, parentId } = req.body;
    try {
        await pool.query(
            'INSERT INTO lesson_comments (lesson_id, user_id, content, parent_id, created_at, is_approved) VALUES (?, ?, ?, ?, NOW(), 1)',
            [lessonId, req.user.id, content, parentId || null]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/comments/:id/like', authMiddleware, async (req, res) => {
    try {
        await pool.query('UPDATE lesson_comments SET likes = likes + 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  ADMIN ROUTES
// ======================================================
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [users] = await pool.query(`SELECT id, name, email, role, is_active, plan_limits, created_at, last_login_at, avatar_url, birth_date, custom_redirect_url FROM users ORDER BY created_at DESC`);
        res.json(users.map(u => ({ ...u, planLimits: typeof u.plan_limits === 'string' ? JSON.parse(u.plan_limits) : (u.plan_limits || DEFAULT_LIMITS) })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/admin/users/:id/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [usageRows] = await pool.query(`SELECT resource_type, COUNT(*) as count FROM usage_logs WHERE user_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) GROUP BY resource_type`, [req.params.id]);
        const usage = { projects: 0, landings: 0, articles: 0 };
        usageRows.forEach(row => { if (row.resource_type === 'project') usage.projects = row.count; if (row.resource_type === 'landing') usage.landings = row.count; if (row.resource_type === 'article') usage.articles = row.count; });
        res.json(usage);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { role, planLimits, isActive, name, email, avatarUrl, birthDate, customRedirectUrl } = req.body;
    try {
        await pool.query(`UPDATE users SET role = ?, plan_limits = ?, is_active = ?, name = COALESCE(?, name), email = COALESCE(?, email), avatar_url = ?, birth_date = ?, custom_redirect_url = ? WHERE id = ?`, [role, JSON.stringify(planLimits), isActive, name, email, avatarUrl, birthDate, customRedirectUrl, req.params.id]);
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_USER', 'user', req.params.id, { role, planName: planLimits.planName });
        res.json({ message: 'Usuario actualizado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [targetUser] = await pool.query('SELECT email FROM users WHERE id = ?', [req.params.id]);
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'DELETE_USER', 'user', req.params.id, { email: targetUser[0]?.email });
        res.json({ message: 'Usuario eliminado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  AI
// ======================================================
app.post('/api/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    res.status(500).json({ error: 'Error IA', details: error.message, text: '' });
  }
});

// ======================================================
//  PROJECTS
// ======================================================
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id]);
    res.json(rows.map(p => ({ ...p, id: String(p.id), strategy_json: typeof p.strategy_json === 'string' ? JSON.parse(p.strategy_json) : p.strategy_json })));
  } catch (error) {
    res.status(500).json({ error: 'Error cargando proyectos' });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const { name, niche, description, targetAudience, brandTone, productName, mainGoal, painPoints, keyBenefits, affiliateLinks, salesPageUrl, fullPrice, commissionRate, leadMagnetType } = req.body;
  try {
    const [userData] = await pool.query('SELECT role, plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    
    // Check Storage Limit
    if (userData[0].role !== 'admin') {
        const [count] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
        if (count[0].c >= (limits.maxProjects || 1)) {
            return res.status(403).json({ error: `Límite de proyectos alcanzado (${limits.maxProjects}).` });
        }
    }

    const [result] = await pool.query(
      `INSERT INTO projects (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, sales_page_url, full_price, commission_rate, lead_magnet_type, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [req.user.id, name, niche, description, targetAudience, brandTone, productName, mainGoal, JSON.stringify(painPoints || []), JSON.stringify(keyBenefits || []), JSON.stringify(affiliateLinks || []), salesPageUrl, fullPrice || 0, commissionRate || 0, leadMagnetType]
    );

    await logUsage(req.user.id, 'project');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando proyecto' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { name, niche, description, targetAudience, brandTone, productName, mainGoal, painPoints, keyBenefits, affiliateLinks, salesPageUrl, fullPrice, commissionRate, leadMagnetType } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No encontrado' });
    await pool.query(
      `UPDATE projects SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?, sales_page_url=?, full_price=?, commission_rate=?, lead_magnet_type=?, updated_at=NOW() WHERE id=? AND user_id=?`,
      [name, niche, description, targetAudience, brandTone, productName, mainGoal, JSON.stringify(painPoints || []), JSON.stringify(keyBenefits || []), JSON.stringify(affiliateLinks || []), salesPageUrl, fullPrice || 0, commissionRate || 0, leadMagnetType, req.params.id, req.user.id]
    );
    res.json({ message: 'Actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando' });
  }
});

app.post('/api/projects/:id/generate-strategy', authMiddleware, async (req, res) => {
    try {
        const [projects] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (projects.length === 0) return res.status(404).json({ error: 'No encontrado' });
        const project = projects[0];
        const strategyJson = await generateFullStrategy({ ...project, painPoints: JSON.parse(project.pain_points), keyBenefits: JSON.parse(project.key_benefits) });
        await pool.query('UPDATE projects SET strategy_json = ? WHERE id = ?', [JSON.stringify(strategyJson), req.params.id]);
        res.json(strategyJson);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  PAGES
// ======================================================
app.post('/api/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content, projectId } = req.body;
  try {
    const [userData] = await pool.query('SELECT role, plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    
    if (userData[0].role !== 'admin') {
        const [count] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
        if (count[0].c >= (limits.maxLandings || 2)) {
            return res.status(403).json({ error: `Límite de páginas alcanzado (${limits.maxLandings}).` });
        }
    }
    const [resDb] = await pool.query('INSERT INTO landing_pages (user_id, project_id, name, niche, goal, subdomain, content, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())', [req.user.id, projectId || null, name, niche, goal, subdomain, JSON.stringify(content)]);
    await logUsage(req.user.id, 'landing');
    res.json({ id: resDb.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  START
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    });
});
