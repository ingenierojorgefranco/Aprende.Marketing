
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
const hotmartService = require('./hotmartService'); // Nuevo Servicio Hotmart

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v21_hotmart_stripe_hybrid'; 

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
//  HOTMART WEBHOOK
// ======================================================
app.post('/api/hotmart/webhook', async (req, res) => {
    try {
        // Hotmart suele enviar un token de seguridad en el header h-token (opcional configurarlo)
        const hToken = req.headers['h-token'];
        if (process.env.HOTMART_TOKEN && hToken !== process.env.HOTMART_TOKEN) {
            console.warn("[Hotmart Webhook] Token inválido recibido.");
            return res.status(401).json({ error: "Unauthorized" });
        }

        await hotmartService.handleWebhook(req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(`[Hotmart Webhook Error]: ${err.message}`);
        res.status(500).json({ error: err.message });
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
//  MULTI-TENANT & REDIRECTS
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

const logSystemActivity = async (userId, userName, actionType, entityType, entityId, details) => {
    try {
        await pool.query(
            `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId || null, userName || 'Sistema', actionType, entityType || null, entityId ? String(entityId) : null, details ? JSON.stringify(details) : null]
        );
    } catch (e) {
        console.error("[System Log Error]", e.message);
    }
};

// ======================================================
//  SYSTEM SETTINGS
// ======================================================
app.get('/api/settings/active-provider', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'active_payment_provider'");
        res.json({ provider: rows.length > 0 ? rows[0].setting_value : 'stripe' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
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
//  AUTH
// ======================================================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email ya registrado' });
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password_hash, role, is_active, plan_limits) VALUES (?, ?, ?, ?, 1, ?)', [name, email, passwordHash, role || 'user', JSON.stringify(DEFAULT_LIMITS)]);
    const newUser = { id: result.insertId, name, email, role: role || 'user', planLimits: DEFAULT_LIMITS };
    res.status(201).json({ user: newUser, token: createToken(newUser) });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
    
    let planLimits = DEFAULT_LIMITS;
    if (user.plan_limits) planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
    
    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role, planLimits, customRedirectUrl: user.custom_redirect_url };
    res.json({ user: userResponse, token: createToken(userResponse) });
  } catch (error) {
    res.status(500).json({ error: 'Error de base de datos' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const user = rows[0];
    let planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : (user.plan_limits || DEFAULT_LIMITS);
    res.json({ ...user, planLimits });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
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
            hotmartUrl: p.hotmart_url,
            hotmartId: p.hotmart_id,
            limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config,
            uiFeatures: typeof p.ui_features === 'string' ? JSON.parse(p.ui_features) : (p.ui_features || []),
            isRecommended: !!p.is_recommended
        }));
        res.json(formattedPlans);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  ADMIN API
// ======================================================
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
            isRecommended: !!p.is_recommended,
            hotmartUrl: p.hotmart_url,
            hotmartId: p.hotmart_id
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
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// UPDATE System Settings
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

// ... (El resto de endpoints de Gemini, Proyectos, CRM, Analytics, etc. se mantienen igual)
app.post('/api/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    res.status(500).json({ error: 'Error IA', text: '' });
  }
});

// Landing Pages, Articles, Leads, etc.
app.get('/api/pages', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT *, thankyoupage_json FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    rows.forEach(p => {
        if (typeof p.content === 'string') try { p.content = JSON.parse(p.content); } catch {}
        if (p.thankyoupage_json) {
            const ty = typeof p.thankyoupage_json === 'string' ? JSON.parse(p.thankyoupage_json) : p.thankyoupage_json;
            if (!p.content) p.content = {};
            p.content.thankYouPage = ty;
        }
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  START SERVER
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

initDb().finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
});
