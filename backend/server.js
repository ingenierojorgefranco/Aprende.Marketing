require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');
const initDb = require('./initDb');
const stripeService = require('./stripeService');

// Routers
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const landingRoutes = require('./routes/landingRoutes');
const articleRoutes = require('./routes/articleRoutes');
const crmRoutes = require('./routes/crmRoutes');
const aiRoutes = require('./routes/aiRoutes');
const courseRoutes = require('./routes/courseRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 8080;
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v21_modular_architecture';

app.enable('trust proxy');
app.use(cors());

// Webhook de Stripe (Raw Body requerido)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
        let event;
        if (endpointSecret) {
            event = stripeService.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            event = JSON.parse(req.body.toString());
        }
        await stripeService.handleWebhook(event);
        res.json({ received: true });
    } catch (err) {
        console.error(`[Webhook Error]: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// Parsers Globales
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Multi-Tenant Middleware
app.use((req, res, next) => {
    const host = req.hostname || req.headers.host || '';
    if (host === `www.${BASE_DOMAIN}`) {
        return res.redirect(301, `https://${BASE_DOMAIN}${req.originalUrl || ''}`);
    }
    let tenant = null;
    if (host.endsWith(`.${BASE_DOMAIN}`) && host !== `www.${BASE_DOMAIN}`) {
        tenant = host.replace(`.${BASE_DOMAIN}`, '').split('.')[0];
    }
    req.tenantSubdomain = tenant;
    next();
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/login', authRoutes); // Alias
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/pages', landingRoutes);
app.use('/api/public', landingRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/gemini', aiRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/analytics', analyticsRoutes);

// Otros Endpoints Globales
app.get('/api/debug/db-status', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'online', version: SERVER_VERSION });
    } catch (e) { res.status(500).json({ status: 'offline', error: e.message }); }
});

app.get('/api/settings/redirect', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'after_login_url'");
        res.json({ url: rows[0]?.setting_value || '/dashboard' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Servir Frontend
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Inicio
initDb().then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor ${SERVER_VERSION} en puerto ${PORT}`));
}).catch(err => console.error("Error DB Init:", err));
