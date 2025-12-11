
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const initDb = require('./initDb'); // Módulo dedicado
const { generateContent } = require('./geminiService');
const { authMiddleware } = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v15_advanced_user_mgmt'; 

app.enable('trust proxy');

app.use(cors());

// INCREASED LIMITS FOR LARGE ARTICLES (Both Express and BodyParser)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ======================================================
//  LOGGING
// ======================================================
app.use((req, res, next) => {
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
//  HELPERS AUTH & PLANS
// ======================================================
const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Default limits for new users
const DEFAULT_LIMITS = {
    planName: 'starter',
    maxProjects: 1,
    maxLandings: 3,
    features: {
        whatsappBot: false,
        blogGenerator: false,
        emailMarketing: false,
        removeBranding: false
    }
};

// Middleware for Admin Check
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
    }
    next();
};

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

    let planLimits = DEFAULT_LIMITS;
    if (user.plan_limits) {
        // Ensure plan_limits is parsed if it's a string
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
      customRedirectUrl: user.custom_redirect_url // Include custom redirect
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

// NEW: Update Profile Endpoint
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
        
        // Fetch updated user to return consistent state
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
//  SYSTEM SETTINGS (REDIRECTS)
// ======================================================

// GET Redirect URL (Public or Authenticated)
app.get('/api/settings/redirect', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'after_login_url'");
        const url = rows.length > 0 ? rows[0].setting_value : '/dashboard';
        res.json({ url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// UPDATE Redirect URL (Admin Only)
app.put('/api/admin/settings', authMiddleware, adminMiddleware, async (req, res) => {
    const { key, value } = req.body;
    try {
        await pool.query(
            `INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`,
            [key, value, value]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  PUBLIC ROUTES (PLANS & CONTENT)
// ======================================================

// GET Active Plans (Public)
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
//  COURSES (LMS) ROUTES (PUBLIC/STUDENT)
// ======================================================

// NEW: List Available Courses (Menu) - ORDER BY order_index
app.get('/api/courses', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT id, title, slug FROM courses ORDER BY order_index ASC, created_at DESC');
        res.json(courses);
    } catch (e) {
        console.error("[Courses] Error fetching list:", e);
        res.status(500).json({ error: e.message });
    }
});

// GET Course Full Structure by Slug (Lazy Load Optimized)
app.get('/api/courses/:slug', authMiddleware, async (req, res) => {
    const { slug } = req.params;
    try {
        // 1. Fetch Course Info
        const [courses] = await pool.query('SELECT * FROM courses WHERE slug = ?', [slug]);
        if (courses.length === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        const course = courses[0];

        // 2. Fetch Modules ONLY (No lessons yet)
        const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [course.id]);

        // Map modules to include empty lessons array for frontend compatibility
        // Lessons will be fetched on demand via /api/modules/:id/lessons
        const modulesSimple = modules.map(mod => ({
            ...mod,
            id: mod.id.toString(),
            lessons: [] 
        }));

        const responseData = {
            id: course.id.toString(),
            title: course.title,
            subtitle: course.subtitle,
            badge_text: course.badge_text, // New Field
            description: course.description,
            learningPoints: [], // Cannot infer without expensive query, can be omitted or fetched if vital
            modules: modulesSimple
        };

        res.json(responseData);

    } catch (e) {
        console.error("[Courses] Error fetching course:", e);
        res.status(500).json({ error: e.message });
    }
});

// NEW: GET Lessons for a specific Module (Lazy Load)
app.get('/api/modules/:moduleId/lessons', authMiddleware, async (req, res) => {
    const { moduleId } = req.params;
    try {
        const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [moduleId]);
        
        // Parse learning_points if stored as JSON string/JSON type
        const lessonsParsed = lessons.map(l => ({
            ...l,
            id: l.id.toString(),
            learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || [])
        }));

        res.json(lessonsParsed);
    } catch (e) {
        console.error("[Courses] Error fetching lessons:", e);
        res.status(500).json({ error: e.message });
    }
});

// GET Comments for a Lesson
app.get('/api/lessons/:lessonId/comments', authMiddleware, async (req, res) => {
    const { lessonId } = req.params;
    try {
        // FILTER BY APPROVED for students
        const [comments] = await pool.query(`
            SELECT c.*, u.name as user_name 
            FROM lesson_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.lesson_id = ? AND c.is_approved = 1
            ORDER BY c.created_at DESC
        `, [lessonId]);

        // Map to frontend structure
        const formatted = comments.map(c => ({
            id: c.id.toString(),
            user: c.user_name,
            avatar: null, // Can add avatar column to users later
            date: new Date(c.created_at).toLocaleString(), // Simple format
            text: c.content,
            likes: c.likes,
            parentId: c.parent_id ? c.parent_id.toString() : null
        }));

        const rootComments = formatted.filter(c => !c.parentId);
        const replies = formatted.filter(c => c.parentId);

        const nested = rootComments.map(root => ({
            ...root,
            replies: replies.filter(r => r.parentId === root.id)
        }));

        res.json(nested);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST Comment
app.post('/api/comments', authMiddleware, async (req, res) => {
    const { lessonId, content, parentId } = req.body;
    if (!lessonId || !content) return res.status(400).json({ error: "Datos incompletos" });

    try {
        // By default comments can be pending (is_approved=0) or approved (1) based on settings. 
        // For now defaulting to 1 (approved) as per initDb, but logic allows moderation.
        await pool.query(
            'INSERT INTO lesson_comments (lesson_id, user_id, content, parent_id, created_at, is_approved) VALUES (?, ?, ?, ?, NOW(), 1)',
            [lessonId, req.user.id, content, parentId || null]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// NEW: Like Comment (Public/Student)
app.post('/api/comments/:id/like', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE lesson_comments SET likes = likes + 1 WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        console.error("Error liking comment:", e);
        res.status(500).json({ error: e.message });
    }
});


// ======================================================
//  ADMIN API ENDPOINTS
// ======================================================

// ---------------- USER MANAGEMENT ----------------

// List Users
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, name, email, role, is_active, plan_limits, created_at, last_login_at, avatar_url, birth_date, custom_redirect_url 
             FROM users ORDER BY created_at DESC`
        );
        
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

// Update User (Role, Plan Limits & Profile Info)
app.put('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { role, planLimits, isActive, name, email, avatarUrl, birthDate, customRedirectUrl } = req.body;
    
    try {
        // Build query dynamically or update all fields
        await pool.query(
            `UPDATE users SET 
                role = ?, 
                plan_limits = ?, 
                is_active = ?,
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                avatar_url = ?,
                birth_date = ?,
                custom_redirect_url = ?
             WHERE id = ?`,
            [role, JSON.stringify(planLimits), isActive, name, email, avatarUrl, birthDate, customRedirectUrl, id]
        );
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete User
app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Usuario eliminado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get User Resources (Lazy Load)
app.get('/api/admin/users/:userId/resources', authMiddleware, adminMiddleware, async (req, res) => {
    const { userId } = req.params;
    const { type } = req.query;

    try {
        let rows = [];
        if (type === 'projects') {
            [rows] = await pool.query('SELECT id, name, niche, main_goal, created_at FROM projects WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'pages') {
            [rows] = await pool.query('SELECT id, name, subdomain, is_published, visits, created_at FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'articles') {
            [rows] = await pool.query('SELECT id, title, slug, status, seo_score, created_at FROM articles WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else {
            return res.status(400).json({ error: 'Invalid resource type' });
        }
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Global Stats
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [userCount] = await pool.query('SELECT COUNT(*) as c FROM users');
        const [projectsCount] = await pool.query('SELECT COUNT(*) as c FROM projects');
        const [pagesCount] = await pool.query('SELECT COUNT(*) as c FROM landing_pages');
        
        res.json({
            users: userCount[0].c,
            projects: projectsCount[0].c,
            pages: pagesCount[0].c
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ---------------- PLANS MANAGEMENT (ADMIN) ----------------

// List Plans
app.get('/api/admin/plans', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM plans ORDER BY price_monthly ASC');
        const safePlans = plans.map(p => ({
            ...p,
            id: p.id.toString(),
            priceMonthly: parseFloat(p.price_monthly),
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

// Create Plan
app.post('/api/admin/plans', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, slug, description, priceMonthly, currency, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `INSERT INTO plans (name, slug, description, price_monthly, currency, limits_config, ui_features, is_active, is_recommended) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, priceMonthly, currency || 'EUR', JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update Plan
app.put('/api/admin/plans/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, priceMonthly, currency, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `UPDATE plans SET name=?, slug=?, description=?, price_monthly=?, currency=?, limits_config=?, ui_features=?, is_active=?, is_recommended=? WHERE id=?`,
            [name, slug, description, priceMonthly, currency || 'EUR', JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended, id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete Plan
app.delete('/api/admin/plans/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM plans WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ---------------- COURSE MANAGEMENT (ADMIN) ----------------

// List Courses (FULL TREE LOAD) with ORDER BY order_index
app.get('/api/admin/courses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // 1. Fetch all courses ordered by order_index
        const [courses] = await pool.query('SELECT * FROM courses ORDER BY order_index ASC, created_at DESC');
        
        // 2. Fetch full details including lessons for editing
        const coursesWithDetails = await Promise.all(courses.map(async (c) => {
            // Fetch modules
            const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [c.id]);
            
            // Fetch lessons for each module
            const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
                const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [mod.id]);
                
                // Parse JSON fields
                const lessonsParsed = lessons.map(l => ({
                    ...l,
                    learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || [])
                }));

                return { ...mod, lessons: lessonsParsed };
            }));

            return {
                ...c,
                modules: modulesWithLessons
            };
        }));
        
        res.json(coursesWithDetails);
    } catch (e) {
        console.error("Error fetching admin courses:", e);
        res.status(500).json({ error: e.message });
    }
});

// NEW: Reorder Courses
app.put('/api/admin/courses/reorder', authMiddleware, adminMiddleware, async (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'Formato inválido' });

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        for (let i = 0; i < orderedIds.length; i++) {
            await connection.query('UPDATE courses SET order_index = ? WHERE id = ?', [i, orderedIds[i]]);
        }
        
        await connection.commit();
        connection.release();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Create Course
app.post('/api/admin/courses', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, subtitle, description, slug, thumbnail, modules, badge_text } = req.body;
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert Course
        const [courseRes] = await connection.query(
            'INSERT INTO courses (title, subtitle, description, slug, thumbnail, badge_text, created_at, order_index) VALUES (?, ?, ?, ?, ?, ?, NOW(), 999)',
            [title, subtitle, description, slug, thumbnail, badge_text || 'Certificado']
        );
        const courseId = courseRes.insertId;

        // 2. Insert Modules & Lessons
        if (modules && modules.length > 0) {
            for (const mod of modules) {
                const [modRes] = await connection.query(
                    'INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)',
                    [courseId, mod.title, mod.order_index]
                );
                const moduleId = modRes.insertId;

                if (mod.lessons && mod.lessons.length > 0) {
                    for (const lesson of mod.lessons) {
                        await connection.query(
                            'INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [moduleId, lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index]
                        );
                    }
                }
            }
        }

        await connection.commit();
        res.json({ success: true, id: courseId });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

// Update Course (Full Sync)
app.put('/api/admin/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, slug, thumbnail, modules, badge_text } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Update Course Info
        await connection.query(
            'UPDATE courses SET title=?, subtitle=?, description=?, slug=?, thumbnail=?, badge_text=? WHERE id=?',
            [title, subtitle, description, slug, thumbnail, badge_text, id]
        );

        // 2. Sync Modules
        // Strategy: 
        // - Track valid Module IDs present in input.
        // - Insert new modules (string ID) -> map temp ID to real ID.
        // - Update existing modules (number ID).
        // - Delete modules NOT in input list.
        
        const validModuleIds = [];

        if (modules && modules.length > 0) {
            for (const mod of modules) {
                let moduleId = mod.id;

                if (typeof moduleId === 'string' && moduleId.startsWith('new-')) {
                    // INSERT new module
                    const [modRes] = await connection.query(
                        'INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)',
                        [id, mod.title, mod.order_index]
                    );
                    moduleId = modRes.insertId;
                } else {
                    // UPDATE existing module
                    await connection.query(
                        'UPDATE course_modules SET title=?, order_index=? WHERE id=?',
                        [mod.title, mod.order_index, moduleId]
                    );
                }
                
                validModuleIds.push(moduleId);

                // 3. Sync Lessons for this Module
                const validLessonIds = [];
                if (mod.lessons && mod.lessons.length > 0) {
                    for (const lesson of mod.lessons) {
                        let lessonId = lesson.id;
                        
                        if (typeof lessonId === 'string' && lessonId.startsWith('new-')) {
                            // INSERT
                            const [lessRes] = await connection.query(
                                'INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                [moduleId, lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index]
                            );
                            lessonId = lessRes.insertId;
                        } else {
                            // UPDATE
                            await connection.query(
                                'UPDATE course_lessons SET title=?, duration=?, video_url=?, description=?, learning_points=?, order_index=?, module_id=? WHERE id=?',
                                [lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index, moduleId, lessonId]
                            );
                        }
                        validLessonIds.push(lessonId);
                    }
                }

                // DELETE orphan lessons for this module
                if (validLessonIds.length > 0) {
                    await connection.query(
                        `DELETE FROM course_lessons WHERE module_id = ? AND id NOT IN (${validLessonIds.join(',')})`, 
                        [moduleId]
                    );
                } else {
                    await connection.query('DELETE FROM course_lessons WHERE module_id = ?', [moduleId]);
                }
            }
        }

        // DELETE orphan modules for this course
        if (validModuleIds.length > 0) {
            await connection.query(
                `DELETE FROM course_modules WHERE course_id = ? AND id NOT IN (${validModuleIds.join(',')})`, 
                [id]
            );
        } else {
            await connection.query('DELETE FROM course_modules WHERE course_id = ?', [id]);
        }

        await connection.commit();
        res.json({ success: true });
    } catch (e) {
        await connection.rollback();
        console.error("Error syncing course:", e);
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

// Delete Course
app.delete('/api/admin/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ---------------- COMMENT MANAGEMENT (ADMIN) ----------------

// List All Comments
app.get('/api/admin/comments', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [comments] = await pool.query(`
            SELECT 
                c.id, c.content as text, c.created_at as date, c.likes, c.is_approved as isApproved,
                c.parent_id as parentId,
                u.name as user, u.id as userId,
                l.title as lessonTitle, l.id as lessonId,
                co.title as courseTitle, co.slug as courseSlug
            FROM lesson_comments c
            JOIN users u ON c.user_id = u.id
            JOIN course_lessons l ON c.lesson_id = l.id
            JOIN course_modules m ON l.module_id = m.id
            JOIN courses co ON m.course_id = co.id
            ORDER BY c.created_at DESC
        `);
        
        // Map fields
        const formatted = comments.map(c => ({
            ...c,
            id: c.id.toString(), // Ensure ID is string for strict comparison with parentId
            isApproved: !!c.isApproved,
            parentId: c.parentId ? c.parentId.toString() : null // Ensure string if coming as number/null
        }));

        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Moderate Comment (Toggle Publish / Delete)
app.post('/api/admin/comments/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; 

    try {
        if (action === 'delete') {
            await pool.query('DELETE FROM lesson_comments WHERE id = ?', [id]);
        } 
        else if (action === 'toggle_publish') {
            const [rows] = await pool.query('SELECT is_approved FROM lesson_comments WHERE id = ?', [id]);
            if (rows.length > 0) {
                const currentStatus = rows[0].is_approved;
                const newStatus = !currentStatus;
                
                // Update parent
                await pool.query('UPDATE lesson_comments SET is_approved = ? WHERE id = ?', [newStatus, id]);
                
                // If unpublishing, cascade to children (replies)
                if (!newStatus) {
                    await pool.query('UPDATE lesson_comments SET is_approved = 0 WHERE parent_id = ?', [id]);
                }
            }
        }
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// ======================================================
//  GEMINI AI
// ======================================================
app.post('/api/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error AI:', error);
    // Devolvemos JSON válido incluso en error para evitar crash en frontend
    res.status(500).json({ error: 'Error IA', details: error.message, text: '' });
  }
});

// ======================================================
//  PROYECTOS (ESTRATEGIAS) - CRUD COMPLETO
// ======================================================
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('[PROJECTS] Error fetching:', error);
    res.status(500).json({ error: 'Error cargando proyectos' });
  }
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks
  } = req.body;

  try {
    // --- LIMIT CHECK ---
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    
    const [count] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxProjects) {
        return res.status(403).json({ error: `Has alcanzado el límite de ${limits.maxProjects} proyectos de tu plan ${limits.planName.toUpperCase()}.` });
    }
    // -------------------

    const [result] = await pool.query(
      `INSERT INTO projects 
       (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        req.user.id,
        name,
        niche,
        description,
        targetAudience,
        brandTone,
        productName,
        mainGoal,
        JSON.stringify(painPoints || []),
        JSON.stringify(keyBenefits || []),
        JSON.stringify(affiliateLinks || []),
      ]
    );
    res.json({ id: result.insertId, message: 'Proyecto guardado exitosamente' });
  } catch (error) {
    console.error('[PROJECTS] Error creating:', error);
    res.status(500).json({ error: 'Error guardando proyecto en BD' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks
  } = req.body;

  try {
    const [check] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado o no encontrado' });

    await pool.query(
      `UPDATE projects 
       SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?, updated_at=NOW()
       WHERE id=? AND user_id=?`,
      [
        name,
        niche,
        description,
        targetAudience,
        brandTone,
        productName,
        mainGoal,
        JSON.stringify(painPoints || []),
        JSON.stringify(keyBenefits || []),
        JSON.stringify(affiliateLinks || []),
        id,
        req.user.id,
      ]
    );
    res.json({ message: 'Proyecto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando proyecto' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  RUTAS PÚBLICAS LANDINGS (PRIORIDAD ALTA)
// ======================================================

// 1. DIAGNÓSTICO
app.get('/api/debug/db-status', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT 1 as val');
      res.json({ 
          status: 'online', 
          db_response: rows[0].val, 
          server_version: SERVER_VERSION,
          timestamp: new Date().toISOString()
      });
  } catch (e) {
      res.status(500).json({ status: 'offline', error: e.message, server_version: SERVER_VERSION });
  }
});

// 2. BY DOMAIN
app.get('/api/public/pages/by-domain', async (req, res) => {
  let host = req.query.domain || req.hostname || req.headers.host || '';
  if (host.includes(':')) host = host.split(':')[0];
  if (host.startsWith('www.')) host = host.slice(4);

  try {
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages WHERE custom_domain = ? AND is_published = 1 LIMIT 1',
      [host]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
          error: 'API Endpoint Not Found',
          server_version: SERVER_VERSION
      });
    }

    const page = rows[0];
    
    // REGISTRAR VISITA SOLO SI NO ES ADMIN
    if (!isAdminRequest(req)) {
        recordVisit(page.id);
    }
    
    if (typeof page.content === 'string') {
        try { page.content = JSON.parse(page.content); } catch {}
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Error interno', server_version: SERVER_VERSION });
  }
});

// 3. BY USER+SLUG
app.get('/api/public/pages/by-user/:userSlug/:slug', async (req, res) => {
  const { userSlug, slug } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT lp.* FROM landing_pages lp
       INNER JOIN users u ON u.id = lp.user_id
       WHERE u.public_subdomain = ? AND lp.subdomain = ? AND lp.is_published = 1 LIMIT 1`,
      [userSlug, slug]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const page = rows[0];

    // REGISTRAR VISITA SOLO SI NO ES ADMIN
    if (!isAdminRequest(req)) {
        recordVisit(page.id);
    }

    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// 4. GENERIC SLUG (Modified to support ID lookup fallback)
app.get('/api/public/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    let rows = [];

    // Attempt to lookup by ID if the slug is numeric
    // This solves issues where frontend links use ID as a fallback when subdomain is missing
    if (/^\d+$/.test(slug)) {
       [rows] = await pool.query(
           'SELECT * FROM landing_pages WHERE id = ? AND is_published = 1 LIMIT 1',
           [slug]
       );
    }

    // If not found by ID (or slug wasn't numeric), try by subdomain/slug
    if (rows.length === 0) {
        [rows] = await pool.query(
          'SELECT * FROM landing_pages WHERE (subdomain = ? OR subdomain LIKE ?) AND is_published = 1 LIMIT 1',
          [slug, `${slug}.%`]
        );
    }

    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const page = rows[0];

    // REGISTRAR VISITA SOLO SI NO ES ADMIN
    if (!isAdminRequest(req)) {
        recordVisit(page.id);
    }

    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// 5. BLOG PÚBLICO
app.get('/api/public/pages/:pageId/blog', async (req, res) => {
    const { pageId } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT id, title, slug, description, meta_description, featured_image, published_at 
             FROM articles 
             WHERE page_id = ? AND status = 'published' AND published_at <= NOW()
             ORDER BY published_at DESC`,
            [pageId]
        );
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/public/articles/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT * FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`,
            [slug]
        );
        if(rows.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  ANALYTICS (NEW)
// ======================================================
app.get('/api/analytics/weekly', authMiddleware, async (req, res) => {
  try {
    // Obtener datos de los últimos 7 días para todas las páginas del usuario
    const [rows] = await pool.query(`
        SELECT 
            da.date, 
            SUM(da.visits) as visits, 
            SUM(da.conversions) as conversions
        FROM daily_analytics da
        JOIN landing_pages lp ON da.page_id = lp.id
        WHERE lp.user_id = ? 
          AND da.date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY da.date
        ORDER BY da.date ASC
    `, [req.user.id]);

    // Formatear fechas para que el frontend las entienda fácil (YYYY-MM-DD)
    const formatted = rows.map(r => ({
        date: new Date(r.date).toISOString().split('T')[0],
        visits: Number(r.visits),
        conversions: Number(r.conversions)
    }));
    
    res.json(formatted);
  } catch (e) {
    console.error('[Analytics] Error:', e);
    res.status(500).json({ error: e.message });
  }
});

// --- NEW ENDPOINT: Analytics Summary (Lazy Loading) ---
app.get('/api/analytics/summary', authMiddleware, async (req, res) => {
  try {
    const [visitsRes] = await pool.query('SELECT SUM(visits) as v, SUM(conversions) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
    const [pagesRes] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
    const [articlesRes] = await pool.query('SELECT COUNT(*) as c FROM articles WHERE user_id = ?', [req.user.id]);
    
    res.json({
        totalVisits: visitsRes[0].v || 0,
        totalConversions: visitsRes[0].c || 0,
        totalPages: pagesRes[0].c || 0,
        totalArticles: articlesRes[0].c || 0
    });
  } catch (e) { 
      res.status(500).json({ error: e.message }); 
  }
});

// ======================================================
//  LANDING PAGES CRUD
// ======================================================
app.get('/api/pages', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content } = req.body;
  try {
    // --- LIMIT CHECK ---
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    
    const [count] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxLandings) {
        return res.status(403).json({ error: `Has alcanzado el límite de ${limits.maxLandings} páginas de tu plan ${limits.planName.toUpperCase()}.` });
    }
    // -------------------

    const [resDb] = await pool.query(
      'INSERT INTO landing_pages (user_id, name, niche, goal, subdomain, content, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW())',
      [req.user.id, name, niche, goal, subdomain, JSON.stringify(content)]
    );
    res.json({ id: resDb.insertId, message: 'Página creada' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/pages/:id', authMiddleware, async (req, res) => {
  const { content, isPublished, name, niche } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });

    await pool.query(
      'UPDATE landing_pages SET content = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche) WHERE id = ?',
      [JSON.stringify(content), isPublished, name, niche, req.params.id]
    );
    res.json({ message: 'Actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/pages/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  ARTICULOS & LEADS
// ======================================================
app.get('/api/articles', authMiddleware, async (req, res) => {
  try {
    // JOIN with landing_pages to get subdomain for dashboard links
    // IMPORTANT: Ensure we fetch subdomain. If subdomain is NULL, page_subdomain will be NULL.
    // ADDED: lp.name as page_name
    const [rows] = await pool.query(
        `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name 
         FROM articles a 
         LEFT JOIN landing_pages lp ON a.page_id = lp.id 
         WHERE a.user_id = ? 
         ORDER BY a.created_at DESC`, 
        [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET Single Article (Private)
app.get('/api/articles/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM articles WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;
  
  // Generar slug si no existe
  let finalSlug = slug;
  if (!finalSlug && title) {
      finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  try {
    const [resDb] = await pool.query(
      `INSERT INTO articles 
      (user_id, page_id, title, slug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status, published_at, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        req.user.id, 
        page_id || null, 
        title, 
        finalSlug, 
        description, 
        content_html, 
        keyword, 
        seo_score, 
        featured_image, 
        meta_title, 
        meta_description, 
        status || 'published', 
        published_at ? new Date(published_at) : new Date() // Fix: Convert string to Date
      ]
    );
    res.json({ id: resDb.insertId });
  } catch (e) { 
      console.error("[DB Insert Error] Falló el guardado del artículo:", e);
      res.status(500).json({ error: e.message }); 
  }
});

// PUT Article
app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;

  try {
    const [check] = await pool.query('SELECT id FROM articles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado o no encontrado' });

    let finalSlug = slug;
    if (!finalSlug && title) {
        finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await pool.query(
      `UPDATE articles SET 
        page_id=?, title=?, slug=?, description=?, content_html=?, featured_image=?, keyword=?, seo_score=?, meta_title=?, meta_description=?, status=?, published_at=?
       WHERE id=? AND user_id=?`,
      [
        page_id || null, 
        title, 
        finalSlug, 
        description, 
        content_html, 
        featured_image, 
        keyword, 
        seo_score, 
        meta_title, 
        meta_description, 
        status, 
        published_at ? new Date(published_at) : new Date(), // Fix: Convert string to Date
        id, 
        req.user.id
      ]
    );
    res.json({ message: 'Artículo actualizado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
    res.json({ message: 'Artículo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, p.name as page_name FROM leads l 
       JOIN landing_pages p ON l.page_id = p.id WHERE p.user_id = ? ORDER BY l.captured_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  START SERVER (Sequential Sync)
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found', server_version: SERVER_VERSION });
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// IMPORTANTE: Ejecutar initDb pero NO matar el proceso si falla para permitir que Cloud Run arranque
initDb().then(() => {
    console.log('✅ Base de datos inicializada correctamente.');
}).catch(err => {
    console.error("⚠️ Error inicializando base de datos (iniciando servidor en modo degradado):", err.message);
}).finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    });
});
