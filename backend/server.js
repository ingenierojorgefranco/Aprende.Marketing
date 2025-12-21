require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const initDb = require('./initDb');
const { generateContent, generateFullStrategy } = require('./geminiService');
const { authMiddleware } = require('./authMiddleware');
const stripeService = require('./stripeService');

// Import Modules
const { router: authRoutes, logSystemActivity, DEFAULT_LIMITS } = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { studentRouter: courseStudentRouter } = require('./routes/courseRoutes');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v23_modular_lms'; 

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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch (e) {
        return false;
    }
};

// ======================================================
//  ROUTES MOUNTING
// ======================================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', courseStudentRouter);

// Legacy Login Route for compatibility
app.post('/api/login', (req, res) => {
  res.redirect(307, '/api/auth/login');
});

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
//  SYSTEM SETTINGS (PUBLIC REDIRECTS)
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
//  GEMINI AI
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
    const project = rows[0];
    if (typeof project.strategy_json === 'string') {
        try {
            project.strategy_json = JSON.parse(project.strategy_json);
        } catch (e) {
            project.strategy_json = null;
        }
    }
    res.json(project);
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
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    const [count] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxProjects) {
        return res.status(403).json({ error: `Has alcanzado el límite de almacenamiento de ${limits.maxProjects} proyectos.` });
    }
    const hasQuota = await checkMonthlyQuota(req.user.id, 'project', limits.maxProjects);
    if (!hasQuota) {
        return res.status(403).json({ error: `Has alcanzado tu cupo mensual de ${limits.maxProjects} generaciones de proyectos.` });
    }
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
    await logUsage(req.user.id, 'project');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
    res.json({ id: result.insertId, message: 'Proyecto guardado exitosamente' });
  } catch (error) {
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
    const [proj] = await pool.query('SELECT name FROM projects WHERE id = ?', [req.params.id]);
    const [result] = await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    await logSystemActivity(req.user.id, req.user.email, 'DELETE_PROJECT', 'project', req.params.id, { name: proj[0]?.name });
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/generate-strategy', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [projects] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (projects.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado.' });
        const project = projects[0];
        const safeParse = (str) => { try { return JSON.parse(str); } catch(e) { return []; } };
        const projectData = {
            name: project.name,
            niche: project.niche,
            productName: project.product_name,
            description: project.description,
            targetAudience: project.target_audience,
            painPoints: typeof project.pain_points === 'string' ? safeParse(project.pain_points) : project.pain_points,
            keyBenefits: typeof project.key_benefits === 'string' ? safeParse(project.key_benefits) : project.key_benefits,
        };
        const strategyJson = await generateFullStrategy(projectData);
        await pool.query('UPDATE projects SET strategy_json = ? WHERE id = ?', [JSON.stringify(strategyJson), id]);
        res.json(strategyJson);
    } catch (e) {
        res.status(500).json({ error: e.message || 'Error generando la estrategia.' });
    }
});

// ======================================================
//  CRM & LEADS ROUTES (PRIVATE)
// ======================================================
app.get('/api/crm/contacts', authMiddleware, async (req, res) => {
    try {
        const [contacts] = await pool.query(
            `SELECT c.*, lp.subdomain as page_slug
             FROM crm_contacts c
             LEFT JOIN landing_pages lp ON c.page_id = lp.id
             WHERE c.user_id = ? ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        res.json(contacts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/crm/contacts', authMiddleware, async (req, res) => {
    const { name, email, phone, address, country, status, interestLevel } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO crm_contacts (user_id, name, email, phone, address, country, source, status, interest_level, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'Manual', ?, ?, NOW(), NOW())`,
            [req.user.id, name, email, phone, address, country, status || 'new', interestLevel || 'cold']
        );
        await logCRMActivity(result.insertId, 'system', `Contacto creado manualmente por ${req.user.email}`);
        res.json({ id: result.insertId, message: 'Contacto creado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/crm/contacts/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, country, status, interestLevel } = req.body;
    const translateInterest = (val) => {
        const map = { 'cold': 'Bajo', 'warm': 'Medio', 'hot': 'Alto' };
        return map[val] || 'Sin definir';
    };
    const translateStatus = (val) => {
        const map = { 'new': 'Nuevo', 'contacted': 'Contactado', 'interested': 'Interesado', 'closed': 'Cliente', 'lost': 'Perdido' };
        return map[val] || val;
    };
    try {
        const [check] = await pool.query('SELECT id, status, interest_level FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (check.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        const oldData = check[0];
        await pool.query(
            `UPDATE crm_contacts SET name=?, email=?, phone=?, address=?, country=?, status=?, interest_level=?, updated_at=NOW() WHERE id=?`,
            [name, email, phone, address, country, status, interestLevel, id]
        );
        if (oldData.status !== status) {
            await logCRMActivity(id, 'status_change', `Estado cambiado de ${translateStatus(oldData.status)} a ${translateStatus(status)}`);
        }
        if (oldData.interest_level !== interestLevel) {
            await logCRMActivity(id, 'status_change', `Interés cambiado de ${translateInterest(oldData.interest_level)} a ${translateInterest(interestLevel)}`);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/crm/contacts/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [contact] = await pool.query('SELECT name FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (contact.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        await pool.query('DELETE FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        await logSystemActivity(req.user.id, req.user.email, 'DELETE_CONTACT', 'crm_contact', id, { name: contact[0].name });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/crm/contacts/:id/history', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [check] = await pool.query('SELECT id FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (check.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        const [activities] = await pool.query(
            `SELECT * FROM crm_activities WHERE contact_id = ? ORDER BY created_at DESC`,
            [id]
        );
        res.json(activities);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/crm/contacts/:id/notes', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const [check] = await pool.query('SELECT id FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (check.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        await logCRMActivity(id, 'note', content);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  PUBLIC LEAD CAPTURE (AUTOMATIC CRM ENTRY)
// ======================================================
app.post('/api/public/leads/submit', async (req, res) => {
    const { pageId, name, email, phone } = req.body;
    if (!pageId || !email) return res.status(400).json({ error: 'Datos incompletos' });
    try {
        const [pageRows] = await pool.query('SELECT user_id, name, subdomain FROM landing_pages WHERE id = ?', [pageId]);
        if (pageRows.length === 0) return res.status(404).json({ error: 'Página no válida' });
        const ownerId = pageRows[0].user_id;
        const pageName = pageRows[0].name;
        const pageSlug = pageRows[0].subdomain;
        await pool.query(
            'INSERT INTO leads (page_id, name, email, captured_at) VALUES (?, ?, ?, NOW())',
            [pageId, name || 'Anónimo', email]
        );
        await pool.query('UPDATE landing_pages SET conversions = conversions + 1 WHERE id = ?', [pageId]);
        const today = new Date().toISOString().split('T')[0];
        await pool.query(
            `INSERT INTO daily_analytics (page_id, date, visits, conversions) 
             VALUES (?, ?, 0, 1) 
             ON DUPLICATE KEY UPDATE conversions = conversions + 1`,
            [pageId, today]
        );
        const [existing] = await pool.query(
            'SELECT id FROM crm_contacts WHERE user_id = ? AND email = ?',
            [ownerId, email]
        );
        const activityPayload = JSON.stringify({ text: "Registro inicial desde:", pageName: pageName, slug: pageSlug });
        const reConversionPayload = JSON.stringify({ text: "Re-conversión en landing:", pageName: pageName, slug: pageSlug });
        let contactId;
        if (existing.length > 0) {
            contactId = existing[0].id;
            await pool.query('UPDATE crm_contacts SET updated_at = NOW() WHERE id = ?', [contactId]);
            await logCRMActivity(contactId, 'lead_submission', reConversionPayload);
        } else {
            const [newContact] = await pool.query(
                `INSERT INTO crm_contacts (user_id, page_id, name, email, phone, source, status, interest_level, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, 'new', 'warm', NOW(), NOW())`,
                [ownerId, pageId, name || 'Prospecto', email, phone || '', `Landing: ${pageName}`]
            );
            contactId = newContact.insertId;
            await logCRMActivity(contactId, 'lead_submission', activityPayload);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Error interno al procesar lead' });
    }
});

// ======================================================
//  RUTAS PÚBLICAS LANDINGS (PRIORIDAD ALTA)
// ======================================================
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

app.get('/api/public/pages/by-domain', async (req, res) => {
  let host = req.query.domain || req.hostname || req.headers.host || '';
  if (host.includes(':')) host = host.split(':')[0];
  if (host.startsWith('www.')) host = host.slice(4);
  try {
    const [rows] = await pool.query(
      'SELECT *, thankyoupage_json FROM landing_pages WHERE custom_domain = ? AND is_published = 1 LIMIT 1',
      [host]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'API Endpoint Not Found', server_version: SERVER_VERSION });
    }
    const page = rows[0];
    if (!isAdminRequest(req)) { recordVisit(page.id); }
    if (typeof page.content === 'string') { try { page.content = JSON.parse(page.content); } catch {} }
    if (page.thankyoupage_json) {
        const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
        if (!page.content) page.content = {};
        page.content.thankYouPage = tyData;
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Error interno', server_version: SERVER_VERSION });
  }
});

app.get('/api/public/pages/by-user/:userSlug/:slug', async (req, res) => {
  const { userSlug, slug } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT lp.*, lp.thankyoupage_json FROM landing_pages lp
       INNER JOIN users u ON u.id = lp.user_id
       WHERE u.public_subdomain = ? AND lp.subdomain = ? AND lp.is_published = 1 LIMIT 1`,
      [userSlug, slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const page = rows[0];
    if (!isAdminRequest(req)) { recordVisit(page.id); }
    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    if (page.thankyoupage_json) {
        const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
        if (!page.content) page.content = {};
        page.content.thankYouPage = tyData;
    }
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
  }
});

app.get('/api/public/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    let rows = [];
    if (/^\d+$/.test(slug)) {
       [rows] = await pool.query('SELECT *, thankyoupage_json FROM landing_pages WHERE id = ? AND is_published = 1 LIMIT 1', [slug]);
    }
    if (rows.length === 0) {
        [rows] = await pool.query('SELECT *, thankyoupage_json FROM landing_pages WHERE (subdomain = ? OR subdomain LIKE ?) AND is_published = 1 LIMIT 1', [slug, `${slug}.%`]);
    }
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const page = rows[0];
    if (!isAdminRequest(req)) { recordVisit(page.id); }
    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    if (page.thankyoupage_json) {
        const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
        if (!page.content) page.content = {};
        page.content.thankYouPage = tyData;
    }
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
  }
});

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
        const [rows] = await pool.query(`SELECT * FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`, [slug]);
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
    const [rows] = await pool.query(`
        SELECT da.date, SUM(da.visits) as visits, SUM(da.conversions) as conversions
        FROM daily_analytics da JOIN landing_pages lp ON da.page_id = lp.id
        WHERE lp.user_id = ? AND da.date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY da.date ORDER BY da.date ASC
    `, [req.user.id]);
    const formatted = rows.map(r => ({
        date: new Date(r.date).toISOString().split('T')[0],
        visits: Number(r.visits),
        conversions: Number(r.conversions)
    }));
    res.json(formatted);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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
    const [rows] = await pool.query('SELECT *, thankyoupage_json FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    rows.forEach(page => {
        if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
        if (page.thankyoupage_json) {
            const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
            if (!page.content) page.content = {};
            page.content.thankYouPage = tyData;
        }
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content, projectId } = req.body;
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    const [count] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxLandings) {
        return res.status(403).json({ error: `Has alcanzado el límite de almacenamiento de ${limits.maxLandings} páginas.` });
    }
    const hasQuota = await checkMonthlyQuota(req.user.id, 'landing', limits.maxLandings);
    if (!hasQuota) {
        return res.status(403).json({ error: `Has alcanzado tu cupo mensual de ${limits.maxLandings} páginas.` });
    }
    const tyPage = content.thankYouPage;
    if (tyPage) { delete content.thankYouPage; }
    const [resDb] = await pool.query(
      'INSERT INTO landing_pages (user_id, project_id, name, niche, goal, subdomain, content, thankyoupage_json, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())',
      [req.user.id, projectId || null, name, niche, goal, subdomain, JSON.stringify(content), tyPage ? JSON.stringify(tyPage) : null]
    );
    await logUsage(req.user.id, 'landing');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PAGE', 'page', resDb.insertId, { name });
    res.json({ id: resDb.insertId, message: 'Página creada' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/pages/:id', authMiddleware, async (req, res) => {
  const { content, isPublished, name, niche, projectId } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });
    const tyPage = content.thankYouPage;
    if (tyPage) { delete content.thankYouPage; }
    await pool.query(
      'UPDATE landing_pages SET content = ?, thankyoupage_json = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche), project_id = COALESCE(?, project_id) WHERE id = ?',
      [JSON.stringify(content), tyPage ? JSON.stringify(tyPage) : null, isPublished, name, niche, projectId !== undefined ? projectId : null, req.params.id]
    );
    res.json({ message: 'Actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/pages/:id', authMiddleware, async (req, res) => {
  try {
    const [page] = await pool.query('SELECT name FROM landing_pages WHERE id = ?', [req.params.id]);
    await pool.query('DELETE FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    await logSystemActivity(req.user.id, req.user.email, 'DELETE_PAGE', 'page', req.params.id, { name: page[0]?.name });
    res.json({ message: 'Eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  ARTICULOS & LEADS
// ======================================================
app.get('/api/articles', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
        `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name 
         FROM articles a LEFT JOIN landing_pages lp ON a.page_id = lp.id 
         WHERE a.user_id = ? ORDER BY a.created_at DESC`, 
        [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/articles/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM articles WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;
  let finalSlug = slug;
  if (!finalSlug && title) { finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    const limit = limits.maxArticles || 2; 
    const hasQuota = await checkMonthlyQuota(req.user.id, 'article', limit);
    if (!hasQuota) { return res.status(403).json({ error: `Has alcanzado tu cupo mensual de ${limit} artículos.` }); }
    const [resDb] = await pool.query(
      `INSERT INTO articles 
      (user_id, page_id, title, slug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status, published_at, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [req.user.id, page_id || null, title, finalSlug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status || 'published', published_at ? new Date(published_at) : new Date()]
    );
    await logUsage(req.user.id, 'article');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_ARTICLE', 'article', resDb.insertId, { title });
    res.json({ id: resDb.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM articles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });
    let finalSlug = slug;
    if (!finalSlug && title) { finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
    await pool.query(
      `UPDATE articles SET 
        page_id=?, title=?, slug=?, description=?, content_html=?, featured_image=?, keyword=?, seo_score=?, meta_title=?, meta_description=?, status=?, published_at=?
       WHERE id=? AND user_id=?`,
      [page_id || null, title, finalSlug, description, content_html, featured_image, keyword, seo_score, meta_title, meta_description, status, published_at ? new Date(published_at) : new Date(), id, req.user.id]
    );
    res.json({ message: 'Artículo actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    const [art] = await pool.query('SELECT title FROM articles WHERE id = ?', [req.params.id]);
    const [result] = await pool.query('DELETE FROM articles WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
    await logSystemActivity(req.user.id, req.user.email, 'DELETE_ARTICLE', 'article', req.params.id, { title: art[0]?.title });
    res.json({ message: 'Artículo eliminado' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT l.*, p.name as page_name FROM leads l JOIN landing_pages p ON l.page_id = p.id WHERE p.user_id = ? ORDER BY l.captured_at DESC`, [req.user.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

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