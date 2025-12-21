const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');

router.get('/weekly', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT da.date, SUM(da.visits) as visits, SUM(da.conversions) as conversions FROM daily_analytics da JOIN landing_pages lp ON da.page_id = lp.id WHERE lp.user_id = ? AND da.date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) GROUP BY da.date ORDER BY da.date ASC`, [req.user.id]);
        res.json(rows.map(r => ({ date: new Date(r.date).toISOString().split('T')[0], visits: Number(r.visits), conversions: Number(r.conversions) })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/summary', authMiddleware, async (req, res) => {
    try {
        const [visitsRes] = await pool.query('SELECT SUM(visits) as v, SUM(conversions) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
        const [pagesRes] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
        const [articlesRes] = await pool.query('SELECT COUNT(*) as c FROM articles WHERE user_id = ?', [req.user.id]);
        res.json({ totalVisits: visitsRes[0].v || 0, totalConversions: visitsRes[0].c || 0, totalPages: pagesRes[0].c || 0, totalArticles: articlesRes[0].c || 0 });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;