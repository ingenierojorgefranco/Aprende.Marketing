require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const initDb = require('./initDb');
const { generateContent } = require('./geminiService');
const { authMiddleware } = require('./authMiddleware');
const stripeService = require('./stripeService');

// Import Modules
const { router: authRoutes, logSystemActivity, DEFAULT_LIMITS } = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { studentRouter: courseStudentRouter } = require('./routes/courseRoutes');
const projectRoutes = require('./routes/projectRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v25_modular_pages'; 

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
//  ROUTES MOUNTING
// ======================================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', courseStudentRouter);
app.use('/api/projects', projectRoutes);
app.use('/api', pageRoutes);

// Legacy Login Route for compatibility
app.post('/api/login', (req, res) => {
  res.redirect(307, '/api/auth/login');
});

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
//  CRM & LEADS (LEGACY/BACKUP)
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
        res.json({ id: result.insertId, message: 'Contacto creado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/crm/contacts/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, country, status, interestLevel } = req.body;
    try {
        const [check] = await pool.query('SELECT id FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (check.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        await pool.query(
            `UPDATE crm_contacts SET name=?, email=?, phone=?, address=?, country=?, status=?, interest_level=?, updated_at=NOW() WHERE id=?`,
            [name, email, phone, address, country, status, interestLevel, id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/crm/contacts/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
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
        await pool.query(
            `INSERT INTO crm_activities (contact_id, type, content, created_at) VALUES (?, 'note', ?, NOW())`,
            [id, content]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  DEBUG DB
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

// ======================================================
//  ARTICULOS & LEADS (PRIVATE)
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
    const [resDb] = await pool.query(
      `INSERT INTO articles 
      (user_id, page_id, title, slug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status, published_at, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [req.user.id, page_id || null, title, finalSlug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status || 'published', published_at ? new Date(published_at) : new Date()]
    );
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