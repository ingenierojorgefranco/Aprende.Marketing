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
const stripeService = require('./stripeService'); 
const hotmartService = require('./hotmartService'); // Nuevo servicio Hotmart

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v21_hotmart_integration'; 

app.enable('trust proxy');

app.use(cors());

// ======================================================
//  STRIPE WEBHOOK (MUST BE BEFORE BODY PARSERS)
// ======================================================
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        if (endpointSecret) {
            event = stripeService.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
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
//  HOTMART WEBHOOK (POSTBACK)
// ======================================================
app.post('/api/hotmart/webhook', async (req, res) => {
    try {
        await hotmartService.handleWebhook(req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(`[Hotmart Webhook Error]: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// ======================================================
//  LOGGING
// ======================================================
app.use((req, res, next) => {
  if (req.path.includes('webhook')) return next(); 
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
        await pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [pageId]);
        const today = new Date().toISOString().split('T')[0];
        await pool.query(
            `INSERT INTO daily_analytics (page_id, date, visits, conversions) 
             VALUES (?, ?, 1, 0) 
             ON DUPLICATE KEY UPDATE visits = visits + 1`,
            [pageId, today]
        );
    } catch (error) {
        console.error(`[Analytics] Error registrando visita para página ${pageId}:`, error.message);
    }
};

const isAdminRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        jwt.verify(token, JWT_SECRET);
        return true; 
    } catch (e) {
        return false;
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

const DEFAULT_LIMITS = {
    planName: 'starter',
    maxProjects: 1,
    maxLandings: 2,
    maxArticles: 2,
    features: {
        whatsappBot: false,
        blogGenerator: false,
        emailMarketing: false,
        removeBranding: false
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
    }
    next();
};

const checkMonthlyQuota = async (userId, resourceType, limit) => {
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (user[0] && user[0].role === 'admin') return true;

    const [rows] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM usage_logs 
        WHERE user_id = ? 
          AND resource_type = ? 
          AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
          AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `, [userId, resourceType]);

    const used = rows[0].count;
    if (limit > 9000) return true; 
    if (used >= limit) return false;
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
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active, plan_limits) VALUES (?, ?, ?, ?, 1, ?)',
      [name, email, passwordHash, role || 'user', JSON.stringify(DEFAULT_LIMITS)]
    );
    const newUser = { id: result.insertId, name, email, role: role || 'user', planLimits: DEFAULT_LIMITS };
    const token = createToken(newUser);
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
    await logSystemActivity(user.id, user.name, 'LOGIN', 'user', user.id, { ip: req.ip });
    let planLimits = DEFAULT_LIMITS;
    if (user.plan_limits) planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
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
    if (user.plan_limits) planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
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
    if (!name || !email) return res.status(400).json({ error: "Nombre y Email son obligatorios" });
    try {
        await pool.query('UPDATE users SET name = ?, email = ?, avatar_url = ?, birth_date = ? WHERE id = ?', [name, email, avatarUrl, birthDate, req.user.id]);
        const [rows] = await pool.query('SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url FROM users WHERE id = ?', [req.user.id]);
        const user = rows[0];
        let planLimits = DEFAULT_LIMITS;
        if (user.plan_limits) planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
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

app.get('/api/settings/payment-provider', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'payment_provider'");
        const provider = rows.length > 0 ? rows[0].setting_value : 'stripe';
        res.json({ provider });
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
//  PUBLIC ROUTES (PLANS & CONTENT)
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
            hotmartUrl: p.hotmart_url,
            hotmartId: p.hotmart_id,
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

// (Omitted other public routes for brevity as they remain identical)

// ======================================================
//  COURSES (LMS) ROUTES
// ======================================================
app.get('/api/courses', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT id, title, slug FROM courses WHERE is_active = 1 ORDER BY order_index ASC, created_at DESC');
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
        if (!course.is_active && req.user.role !== 'admin') return res.status(403).json({ error: 'Este curso no está disponible actualmente.' });
        const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [course.id]);
        const modulesSimple = modules.map(mod => ({ ...mod, id: mod.id.toString(), lessons: [] }));
        res.json({
            id: course.id.toString(),
            title: course.title,
            subtitle: course.subtitle,
            badge_text: course.badge_text,
            description: course.description,
            learningPoints: [],
            modules: modulesSimple
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/modules/:moduleId/lessons', authMiddleware, async (req, res) => {
    const { moduleId } = req.params;
    try {
        const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [moduleId]);
        const lessonsParsed = lessons.map(l => ({
            ...l,
            id: l.id.toString(),
            learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || [])
        }));
        res.json(lessonsParsed);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// (Omitted other courses and admin endpoints for brevity)

// ======================================================
//  ADMIN API ENDPOINTS
// ======================================================
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [users] = await pool.query(`SELECT id, name, email, role, is_active, plan_limits, created_at, last_login_at, avatar_url, birth_date, custom_redirect_url FROM users ORDER BY created_at DESC`);
        const safeUsers = users.map(u => ({
            ...u,
            planLimits: typeof u.plan_limits === 'string' ? JSON.parse(u.plan_limits) : (u.plan_limits || DEFAULT_LIMITS),
            customRedirectUrl: u.custom_redirect_url
        }));
        res.json(safeUsers);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ---------------- PLANS MANAGEMENT (ADMIN) ----------------
app.get('/api/admin/plans', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM plans ORDER BY price_monthly ASC');
        const safePlans = plans.map(p => ({
            ...p,
            id: p.id.toString(),
            priceMonthly: parseFloat(p.price_monthly),
            stripePriceId: p.stripe_price_id,
            hotmartUrl: p.hotmart_url,
            hotmartId: p.hotmart_id,
            limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config,
            uiFeatures: typeof p.ui_features === 'string' ? JSON.parse(p.ui_features) : (p.ui_features || []),
            isActive: !!p.is_active,
            isRecommended: !!p.is_recommended
        }));
        res.json(safePlans);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/admin/plans', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, slug, description, priceMonthly, currency, stripePriceId, hotmartUrl, hotmartId, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `INSERT INTO plans (name, slug, description, price_monthly, currency, stripe_price_id, hotmart_url, hotmart_id, limits_config, ui_features, is_active, is_recommended) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, hotmartUrl, hotmartId, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'CREATE_PLAN', 'plan', null, { name, slug });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/admin/plans/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, priceMonthly, currency, stripePriceId, hotmartUrl, hotmartId, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `UPDATE plans SET name=?, slug=?, description=?, price_monthly=?, currency=?, stripe_price_id=?, hotmart_url=?, hotmart_id=?, limits_config=?, ui_features=?, is_active=?, is_recommended=? WHERE id=?`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, hotmartUrl, hotmartId, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended, id]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_PLAN', 'plan', id, { name });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// (Omitted other admin and logic routes for brevity)

// ======================================================
//  START SERVER
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found', server_version: SERVER_VERSION });
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

initDb().then(() => {
    console.log('✅ Base de datos inicializada correctamente.');
}).catch(err => {
    console.error("⚠️ Error inicializando base de datos:", err.message);
}).finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    });
});
