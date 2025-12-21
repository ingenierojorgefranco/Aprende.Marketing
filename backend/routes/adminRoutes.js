const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity } = require('../utils/helpers');

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado.' });
    }
    next();
};

// Usuarios
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [users] = await pool.query(`SELECT * FROM users ORDER BY created_at DESC`);
        res.json(users.map(u => ({
            ...u,
            planLimits: typeof u.plan_limits === 'string' ? JSON.parse(u.plan_limits) : (u.plan_limits || {})
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/users/:id/stats', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [usageRows] = await pool.query(`
            SELECT resource_type, COUNT(*) as count 
            FROM usage_logs 
            WHERE user_id = ? 
              AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
              AND YEAR(created_at) = YEAR(CURRENT_DATE())
            GROUP BY resource_type
        `, [id]);
        const usage = { projects: 0, landings: 0, articles: 0 };
        usageRows.forEach(row => { if (usage[row.resource_type + 's'] !== undefined) usage[row.resource_type + 's'] = row.count; });
        res.json(usage);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { role, planLimits, isActive, name, email, avatarUrl, birthDate, customRedirectUrl } = req.body;
    try {
        await pool.query(
            `UPDATE users SET role = ?, plan_limits = ?, is_active = ?, name = COALESCE(?, name), email = COALESCE(?, email), avatar_url = ?, birth_date = ?, custom_redirect_url = ? WHERE id = ?`,
            [role, JSON.stringify(planLimits), isActive, name, email, avatarUrl, birthDate, customRedirectUrl, id]
        );
        await logSystemActivity(req.user.id, 'Admin', 'UPDATE_USER', 'user', id, { role });
        res.json({ message: 'Usuario actualizado' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        await logSystemActivity(req.user.id, 'Admin', 'DELETE_USER', 'user', req.params.id, null);
        res.json({ message: 'Usuario eliminado' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Settings
router.put('/settings', authMiddleware, adminMiddleware, async (req, res) => {
    const { key, value } = req.body;
    try {
        await pool.query(`INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`, [key, value, value]);
        await logSystemActivity(req.user.id, 'Admin', 'UPDATE_SETTINGS', 'setting', key, { value });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Logs
router.get('/logs', authMiddleware, adminMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const { action, search } = req.query;
    try {
        let query = 'SELECT * FROM system_activity_logs WHERE 1=1';
        const params = [];
        if (action && action !== 'all') { query += ' AND action_type = ?'; params.push(action); }
        if (search) { query += ' AND (user_name LIKE ? OR details LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;