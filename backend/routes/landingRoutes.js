const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { recordVisit, isAdminRequest, logSystemActivity, checkMonthlyQuota, logUsage } = require('../utils/helpers');

// Public views logic
router.get('/public/pages/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        let rows = [];
        if (/^\d+$/.test(slug)) [rows] = await pool.query('SELECT * FROM landing_pages WHERE id = ? AND is_published = 1 LIMIT 1', [slug]);
        if (rows.length === 0) [rows] = await pool.query('SELECT * FROM landing_pages WHERE subdomain = ? AND is_published = 1 LIMIT 1', [slug]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const page = rows[0];
        if (!isAdminRequest(req)) recordVisit(page.id);
        if (typeof page.content === 'string') page.content = JSON.parse(page.content);
        if (page.thankyoupage_json) page.content.thankYouPage = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
        res.json(page);
    } catch (e) { res.status(500).json({ error: 'Error' }); }
});

router.get('/public/pages/by-domain', async (req, res) => {
    let host = req.query.domain || req.hostname || '';
    if (host.startsWith('www.')) host = host.slice(4);
    try {
        const [rows] = await pool.query('SELECT * FROM landing_pages WHERE custom_domain = ? AND is_published = 1 LIMIT 1', [host]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const page = rows[0];
        if (!isAdminRequest(req)) recordVisit(page.id);
        if (typeof page.content === 'string') page.content = JSON.parse(page.content);
        res.json(page);
    } catch (e) { res.status(500).json({ error: 'Error' }); }
});

// CRUD Landings
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows.map(p => {
            if (typeof p.content === 'string') p.content = JSON.parse(p.content);
            if (p.thankyoupage_json) p.content.thankYouPage = typeof p.thankyoupage_json === 'string' ? JSON.parse(p.thankyoupage_json) : p.thankyoupage_json;
            return p;
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