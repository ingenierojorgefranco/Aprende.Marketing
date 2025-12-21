const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { generateFullStrategy } = require('../geminiService');
const { logSystemActivity, checkMonthlyQuota, logUsage } = require('../utils/helpers');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC', [req.user.id]);
        res.json(rows);
    } catch (error) { res.status(500).json({ error: 'Error cargando proyectos' }); }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
        const p = rows[0];
        if (typeof p.strategy_json === 'string') { try { p.strategy_json = JSON.parse(p.strategy_json); } catch(e) {} }
        res.json(p);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', authMiddleware, async (req, res) => {
    const { name, niche, description, targetAudience, brandTone, productName, mainGoal, painPoints, keyBenefits, affiliateLinks } = req.body;
    try {
        const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
        const limits = typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits;
        const [count] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
        
        if (count[0].c >= (limits.maxProjects || 1)) return res.status(403).json({ error: 'Límite alcanzado.' });
        if (!(await checkMonthlyQuota(req.user.id, 'project', limits.maxProjects))) return res.status(403).json({ error: 'Cupo mensual agotado.' });

        const [result] = await pool.query(
            `INSERT INTO projects (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [req.user.id, name, niche, description, targetAudience, brandTone, productName, mainGoal, JSON.stringify(painPoints || []), JSON.stringify(keyBenefits || []), JSON.stringify(affiliateLinks || [])]
        );
        await logUsage(req.user.id, 'project');
        await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
        res.json({ id: result.insertId, message: 'Guardado' });
    } catch (error) { res.status(500).json({ error: 'Error BD' }); }
});

router.post('/:id/generate-strategy', authMiddleware, async (req, res) => {
    try {
        const [projects] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (projects.length === 0) return res.status(404).json({ error: 'No encontrado' });
        const p = projects[0];
        const strategyJson = await generateFullStrategy({
            ...p,
            painPoints: typeof p.pain_points === 'string' ? JSON.parse(p.pain_points) : p.pain_points,
            keyBenefits: typeof p.key_benefits === 'string' ? JSON.parse(p.key_benefits) : p.key_benefits,
        });
        await pool.query('UPDATE projects SET strategy_json = ? WHERE id = ?', [JSON.stringify(strategyJson), req.params.id]);
        res.json(strategyJson);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Eliminado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;