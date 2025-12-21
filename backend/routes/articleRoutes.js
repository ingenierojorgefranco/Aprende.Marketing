const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, checkMonthlyQuota, logUsage } = require('../utils/helpers');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name FROM articles a LEFT JOIN landing_pages lp ON a.page_id = lp.id WHERE a.user_id = ? ORDER BY a.created_at DESC`, [req.user.id]);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
    const { title, description, content_html, keyword, seo_score, page_id, slug, status, published_at } = req.body;
    try {
        const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
        const limits = typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits;
        if (!(await checkMonthlyQuota(req.user.id, 'article', limits.maxArticles || 2))) return res.status(403).json({ error: 'Cupo agotado.' });

        const [resDb] = await pool.query(
            `INSERT INTO articles (user_id, page_id, title, slug, description, content_html, keyword, seo_score, status, published_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [req.user.id, page_id || null, title, slug, description, content_html, keyword, seo_score, status || 'published', published_at ? new Date(published_at) : new Date()]
        );
        await logUsage(req.user.id, 'article');
        await logSystemActivity(req.user.id, req.user.email, 'CREATE_ARTICLE', 'article', resDb.insertId, { title });
        res.json({ id: resDb.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM articles WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;