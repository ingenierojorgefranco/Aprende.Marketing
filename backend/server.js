require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const initDb = require('./initDb');
const { generateContent, generateFullStrategy } = require('./geminiService');
const { authMiddleware } = require('./authMiddleware');
const stripeService = require('./stripeService');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v23_ia_preview_logic'; 

app.enable('trust proxy');
app.use(cors());

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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const logSystemActivity = async (userId, userName, actionType, entityType, entityId, details) => {
    try {
        await pool.query(
            `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId || null, userName || 'Sistema', actionType, entityType || null, entityId ? String(entityId) : null, details ? JSON.stringify(details) : null]
        );
    } catch (e) {
        console.error("[System Log Error]:", e.message);
    }
};

const checkMonthlyQuota = async (userId, resourceType, limit) => {
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (user[0] && user[0].role === 'admin') return true;
    const [rows] = await pool.query(`
        SELECT COUNT(*) as count FROM usage_logs 
        WHERE user_id = ? AND resource_type = ? 
        AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `, [userId, resourceType]);
    const used = rows[0].count;
    if (limit > 9000) return true; 
    return used < limit;
};

const logUsage = async (userId, resourceType) => {
    try {
        await pool.query('INSERT INTO usage_logs (user_id, resource_type) VALUES (?, ?)', [userId, resourceType]);
    } catch (e) {
        console.error("Error logging usage:", e);
    }
};

const createToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role || 'user' };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

const DEFAULT_LIMITS = {
    planName: 'starter',
    maxProjects: 1,
    maxLandings: 2,
    maxArticles: 2,
    features: { whatsappBot: false, blogGenerator: false, emailMarketing: false, removeBranding: false, emailStrategy: false, evergreenStrategy: false }
};

// --- AUTH ROUTES ---

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
    res.status(500).json({ error: 'Error interno' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ error: 'Usuario inactivo' });
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
    await logSystemActivity(user.id, user.name, 'LOGIN', 'user', user.id, { ip: req.ip });
    let planLimits = DEFAULT_LIMITS;
    if (user.plan_limits) planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
    const userResponse = { id: user.id, name: user.name, email: user.email, role: user.role, planLimits };
    const token = createToken(userResponse);
    res.json({ user: userResponse, token });
  } catch (error) { res.status(500).json({ error: 'Error de base de datos' }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    const user = rows[0];
    let planLimits = DEFAULT_LIMITS;
    if (user.plan_limits) planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
    res.json({ ...user, planLimits });
  } catch (error) { res.status(500).json({ error: 'Error interno' }); }
});

// --- PROJECT ROUTES ---

app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id]);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: 'Error cargando proyectos' }); }
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    const project = rows[0];
    if (typeof project.strategy_json === 'string' && project.strategy_json) {
        try { project.strategy_json = JSON.parse(project.strategy_json); } catch { project.strategy_json = null; }
    }
    res.json({
        ...project,
        productName: project.product_name,
        mentorName: project.mentor_name,
        fullPrice: project.full_price,
        commissionRate: project.commission_rate,
        commissionAmount: project.commission_amount,
        leadMagnetType: project.lead_magnet_type,
        communityChannel: project.community_channel,
        keyPainPoint: project.key_pain_point,
        keyTransformation: project.key_transformation,
        targetAudience: project.target_audience,
        brandTone: project.brand_tone,
        mainGoal: project.main_goal,
        affiliateLinks: typeof project.affiliate_links === 'string' ? JSON.parse(project.affiliate_links || '[]') : project.affiliate_links
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const { name, niche, description, targetAudience, brandTone, productName, mentorName, fullPrice, commissionRate, commissionAmount, leadMagnetType, communityChannel, keyPainPoint, keyTransformation, mainGoal, painPoints, keyBenefits, affiliateLinks, strategy_json } = req.body;
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    const [count] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxProjects) return res.status(403).json({ error: `Límite de proyectos alcanzado.` });
    const [result] = await pool.query(
      `INSERT INTO projects (user_id, name, niche, description, target_audience, brand_tone, product_name, mentor_name, full_price, commission_rate, commission_amount, lead_magnet_type, community_channel, key_pain_point, key_transformation, main_goal, pain_points, key_benefits, affiliate_links, strategy_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [req.user.id, name, niche, description, targetAudience, brandTone, productName, mentorName, fullPrice, commissionRate, commissionAmount, leadMagnetType, communityChannel, keyPainPoint, keyTransformation, mainGoal, JSON.stringify(painPoints || []), JSON.stringify(keyBenefits || []), JSON.stringify(affiliateLinks || []), JSON.stringify(strategy_json || null)]
    );
    await logUsage(req.user.id, 'project');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
    res.json({ id: result.insertId, message: 'Proyecto guardado' });
  } catch (error) { res.status(500).json({ error: 'Error guardando proyecto' }); }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, niche, description, targetAudience, brandTone, productName, mentorName, fullPrice, commissionRate, commissionAmount, leadMagnetType, communityChannel, keyPainPoint, keyTransformation, mainGoal, painPoints, keyBenefits, affiliateLinks, strategy_json } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });
    await pool.query(
      `UPDATE projects SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, mentor_name=?, full_price=?, commission_rate=?, commission_amount=?, lead_magnet_type=?, community_channel=?, key_pain_point=?, key_transformation=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?, strategy_json=?, updated_at=NOW()
       WHERE id=? AND user_id=?`,
      [name, niche, description, targetAudience, brandTone, productName, mentorName, fullPrice, commissionRate, commissionAmount, leadMagnetType, communityChannel, keyPainPoint, keyTransformation, mainGoal, JSON.stringify(painPoints || []), JSON.stringify(keyBenefits || []), JSON.stringify(affiliateLinks || []), JSON.stringify(strategy_json || null), id, req.user.id]
    );
    res.json({ message: 'Proyecto actualizado' });
  } catch (error) { res.status(500).json({ error: 'Error actualizando' }); }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// IA STRATEGY PREVIEW (NO DB)
app.post('/api/projects/generate-strategy-preview', authMiddleware, async (req, res) => {
    try {
        const strategyJson = await generateFullStrategy(req.body);
        res.json(strategyJson);
    } catch (e) {
        console.error("Preview generation failed:", e);
        res.status(500).json({ error: "Fallo la generación por IA: " + e.message });
    }
});

// IA STRATEGY PERSIST
app.post('/api/projects/:id/generate-strategy', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [projects] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (projects.length === 0) return res.status(404).json({ error: 'No encontrado' });
        const p = projects[0];
        const strategyJson = await generateFullStrategy({
            name: p.name, niche: p.niche, productName: p.product_name, mentorName: p.mentor_name,
            fullPrice: p.full_price, commissionRate: p.commission_rate, commissionAmount: p.commission_amount, description: p.description,
            targetAudience: p.target_audience, brandTone: p.brand_tone, leadMagnetType: p.lead_magnet_type,
            communityChannel: p.community_channel, keyPainPoint: p.key_pain_point, keyTransformation: p.key_transformation,
            painPoints: JSON.parse(p.pain_points || '[]'), keyBenefits: JSON.parse(p.key_benefits || '[]')
        });
        await pool.query('UPDATE projects SET strategy_json = ? WHERE id = ?', [JSON.stringify(strategyJson), id]);
        res.json(strategyJson);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- PAGES ROUTES ---

app.get('/api/pages', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT *, thankyoupage_json FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    rows.forEach(p => {
        if (typeof p.content === 'string') try { p.content = JSON.parse(p.content); } catch {}
        if (p.thankyoupage_json) p.content.thankYouPage = typeof p.thankyoupage_json === 'string' ? JSON.parse(p.thankyoupage_json) : p.thankyoupage_json;
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
    if (count[0].c >= limits.maxLandings) return res.status(403).json({ error: `Límite de páginas alcanzado.` });
    const tyPage = content.thankYouPage;
    if (tyPage) delete content.thankYouPage;
    const [resDb] = await pool.query(
      'INSERT INTO landing_pages (user_id, project_id, name, niche, goal, subdomain, content, thankyoupage_json, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())',
      [req.user.id, projectId || null, name, niche, goal, subdomain, JSON.stringify(content), tyPage ? JSON.stringify(tyPage) : null]
    );
    await logUsage(req.user.id, 'landing');
    res.json({ id: resDb.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- SETTINGS ---
app.get('/api/settings/redirect', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'after_login_url'");
        res.json({ url: rows.length > 0 ? rows[0].setting_value : '/dashboard' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ${SERVER_VERSION} en puerto ${PORT}`);
    });
});
