const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { recordVisit, isAdminRequest, logSystemActivity, checkMonthlyQuota, logUsage, logCRMActivity } = require('../utils/helpers');

// --- PUBLIC VIEW ENDPOINTS ---

// Obtener planes públicos (para /api/public/plans)
router.get('/plans', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM plans WHERE is_active = 1 ORDER BY price_monthly ASC');
        res.json(rows.map(p => ({
            ...p,
            id: String(p.id),
            priceMonthly: Number(p.price_monthly),
            isRecommended: !!p.is_recommended,
            isActive: !!p.is_active,
            limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config,
            uiFeatures: typeof p.ui_features === 'string' ? JSON.parse(p.ui_features) : p.ui_features,
            stripePriceId: p.stripe_price_id
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/public/pages/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        // Búsqueda robusta: por ID, subdominio exacto, prefijo de subdominio, dominio personalizado o nombre exacto
        const [rows] = await pool.query(
            `SELECT * FROM landing_pages 
             WHERE id = ? 
                OR subdomain = ? 
                OR subdomain LIKE ? 
                OR custom_domain = ? 
                OR custom_domain = ?
                OR name = ?
             LIMIT 1`, 
            [slug, slug, `${slug}.%`, slug, `www.${slug}`, slug]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'La landing page solicitada no existe.' });
        }

        const page = rows[0];

        // Verificar estado de publicación
        if (!page.is_published) {
            // Si el que solicita es admin, le permitimos verla aunque no esté publicada (vista previa admin)
            if (!isAdminRequest(req)) {
                return res.status(403).json({ error: 'Esta página se encuentra en modo borrador y no es pública todavía.' });
            }
        }

        // Solo registramos visita si no es una solicitud de administrador
        if (!isAdminRequest(req)) recordVisit(page.id);

        // Parsear contenido JSON
        if (typeof page.content === 'string') page.content = JSON.parse(page.content);
        
        // Integrar página de gracias si existe
        if (page.thankyoupage_json) {
            const ty = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
            if (!page.content.thankYouPage) {
                page.content.thankYouPage = ty;
            }
        }
        
        res.json(page);
    } catch (e) { 
        console.error("[Public Page Fetch Error]:", e.message);
        res.status(500).json({ error: 'Error interno al cargar la página.' }); 
    }
});

router.get('/public/pages/:pageId/blog', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, title, slug, description, meta_description, featured_image, published_at FROM articles WHERE page_id = ? AND status = "published" ORDER BY published_at DESC',
            [req.params.pageId]
        );
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/public/articles/:slug', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM articles WHERE slug = ? AND status = "published" LIMIT 1', [req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/public/leads/submit', async (req, res) => {
    const { pageId, name, email, phone } = req.body;
    try {
        const [pageRows] = await pool.query('SELECT user_id, name as pageName, subdomain FROM landing_pages WHERE id = ?', [pageId]);
        if (pageRows.length === 0) return res.status(404).json({ error: 'Página no existe' });
        const { user_id, pageName, subdomain } = pageRows[0];

        await pool.query('INSERT INTO leads (page_id, name, email) VALUES (?, ?, ?)', [pageId, name, email]);
        await pool.query('UPDATE landing_pages SET conversions = conversions + 1 WHERE id = ?', [pageId]);

        const [crmRes] = await pool.query(
            `INSERT INTO crm_contacts (user_id, page_id, name, email, phone, source, status, interest_level) 
             VALUES (?, ?, ?, ?, ?, ?, 'new', 'warm')
             ON DUPLICATE KEY UPDATE updated_at = NOW(), status = 'new'`,
            [user_id, pageId, name, email, phone || null, `Landing: ${pageName}`]
        );

        let contactId;
        if (crmRes.insertId) {
            contactId = crmRes.insertId;
        } else {
            const [existing] = await pool.query('SELECT id FROM crm_contacts WHERE email = ? AND user_id = ?', [email, user_id]);
            contactId = existing[0].id;
        }
        
        const activityDetails = JSON.stringify({ text: "Registro desde la página", slug: subdomain, pageName: pageName });
        await logCRMActivity(contactId, 'lead_submission', activityDetails);

        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- AUTH CRUD ENDPOINTS ---
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows.map(p => {
            const content = typeof p.content === 'string' ? JSON.parse(p.content) : p.content;
            if (p.thankyoupage_json) content.thankYouPage = typeof p.thankyoupage_json === 'string' ? JSON.parse(p.thankyoupage_json) : p.thankyoupage_json;
            return { ...p, content };
        }));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
    const { name, niche, goal, subdomain, content, projectId } = req.body;
    try {
        const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
        const limits = typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits;
        if (!(await checkMonthlyQuota(req.user.id, 'landing', limits.maxLandings))) return res.status(403).json({ error: 'Límite alcanzado.' });

        const tyPage = content.thankYouPage;
        if (tyPage) delete content.thankYouPage;
        const [resDb] = await pool.query(
            'INSERT INTO landing_pages (user_id, project_id, name, niche, goal, subdomain, content, thankyoupage_json, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())',
            [req.user.id, projectId || null, name, niche, goal, subdomain, JSON.stringify(content), tyPage ? JSON.stringify(tyPage) : null]
        );
        await logUsage(req.user.id, 'landing');
        await logSystemActivity(req.user.id, req.user.email, 'CREATE_PAGE', 'page', resDb.insertId, { name });
        res.json({ id: resDb.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { content, isPublished, name, niche, projectId } = req.body;
    try {
        const tyPage = content.thankYouPage;
        if (tyPage) delete content.thankYouPage;
        await pool.query(
            'UPDATE landing_pages SET content = ?, thankyoupage_json = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche), project_id = COALESCE(?, project_id) WHERE id = ? AND user_id = ?',
            [JSON.stringify(content), tyPage ? JSON.stringify(tyPage) : null, isPublished, name, niche, projectId || null, req.params.id, req.user.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;