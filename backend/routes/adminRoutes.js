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

// --- GESTIÓN DE USUARIOS ---
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
    try {
        const [projects] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.params.id]);
        const [pages] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.params.id]);
        const [articles] = await pool.query('SELECT COUNT(*) as c FROM articles WHERE user_id = ?', [req.params.id]);
        res.json({ projects: projects[0].c, landings: pages[0].c, articles: articles[0].c });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/users/:id/resources', authMiddleware, adminMiddleware, async (req, res) => {
    const { type } = req.query;
    try {
        let table = '';
        if (type === 'projects') table = 'projects';
        else if (type === 'pages') table = 'landing_pages';
        else if (type === 'articles') table = 'articles';
        else return res.status(400).json({ error: 'Tipo inválido' });

        const [rows] = await pool.query(`SELECT * FROM ${table} WHERE user_id = ?`, [req.params.id]);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/users/:id/payments', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user_payments WHERE user_id = ? ORDER BY created_at DESC', [req.params.id]);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { role, planLimits, isActive, name, email, avatarUrl, birthDate, customRedirectUrl } = req.body;
    try {
        await pool.query(
            `UPDATE users SET role = ?, plan_limits = ?, is_active = ?, name = COALESCE(?, name), email = COALESCE(?, email), avatar_url = ?, birth_date = ?, custom_redirect_url = ? WHERE id = ?`,
            [role, JSON.stringify(planLimits), isActive, name, email, avatarUrl, birthDate, customRedirectUrl, req.params.id]
        );
        await logSystemActivity(req.user.id, 'Admin', 'UPDATE_USER', 'user', req.params.id, { role });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        await logSystemActivity(req.user.id, 'Admin', 'DELETE_USER', 'user', req.params.id, null);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- GESTIÓN DE PLANES ---
router.get('/plans', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM plans ORDER BY price_monthly ASC');
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

router.post('/plans', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, slug, description, priceMonthly, currency, stripePriceId, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO plans (name, slug, description, price_monthly, currency, stripe_price_id, limits_config, ui_features, is_active, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, priceMonthly, currency, stripePriceId, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended]
        );
        res.json({ id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/plans/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, slug, description, priceMonthly, currency, stripePriceId, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `UPDATE plans SET name = ?, slug = ?, description = ?, price_monthly = ?, currency = ?, stripe_price_id = ?, limits_config = ?, ui_features = ?, is_active = ?, is_recommended = ? WHERE id = ?`,
            [name, slug, description, priceMonthly, currency, stripePriceId, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended, req.params.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/plans/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM plans WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- GESTIÓN DE CURSOS (LMS) ---
router.get('/courses', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM courses ORDER BY order_index ASC');
        const courses = [];
        for (const c of rows) {
            const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [c.id]);
            const fullModules = [];
            for (const m of modules) {
                const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [m.id]);
                fullModules.push({ ...m, lessons });
            }
            courses.push({ ...c, modules: fullModules });
        }
        res.json(courses);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/courses', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, subtitle, description, slug, thumbnail, badge_text, is_active, modules } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [cRes] = await connection.query(
            `INSERT INTO courses (title, subtitle, description, slug, thumbnail, badge_text, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, subtitle, description, slug, thumbnail, badge_text, is_active]
        );
        const courseId = cRes.insertId;
        for (const mod of (modules || [])) {
            const [mRes] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [courseId, mod.title, mod.order_index]);
            for (const les of (mod.lessons || [])) {
                await connection.query(
                    `INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [mRes.insertId, les.title, les.duration, les.video_url, les.description, JSON.stringify(les.learning_points), les.order_index, true]
                );
            }
        }
        await connection.commit();
        res.json({ id: courseId });
    } catch (e) { await connection.rollback(); res.status(500).json({ error: e.message }); }
    finally { connection.release(); }
});

router.put('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, subtitle, description, slug, thumbnail, badge_text, is_active, modules } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            `UPDATE courses SET title = ?, subtitle = ?, description = ?, slug = ?, thumbnail = ?, badge_text = ?, is_active = ? WHERE id = ?`,
            [title, subtitle, description, slug, thumbnail, badge_text, is_active, req.params.id]
        );
        // Simplificado: Borrar módulos y lecciones antiguas y reinsertar
        await connection.query('DELETE FROM course_modules WHERE course_id = ?', [req.params.id]);
        for (const mod of (modules || [])) {
            const [mRes] = await connection.query(`INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)`, [req.params.id, mod.title, mod.order_index]);
            for (const les of (mod.lessons || [])) {
                await connection.query(
                    `INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [mRes.insertId, les.title, les.duration, les.video_url, les.description, JSON.stringify(les.learning_points), les.order_index, true]
                );
            }
        }
        await connection.commit();
        res.json({ success: true });
    } catch (e) { await connection.rollback(); res.status(500).json({ error: e.message }); }
    finally { connection.release(); }
});

router.put('/courses/reorder', authMiddleware, adminMiddleware, async (req, res) => {
    const { orderedIds } = req.body;
    try {
        for (let i = 0; i < orderedIds.length; i++) {
            await pool.query('UPDATE courses SET order_index = ? WHERE id = ?', [i + 1, orderedIds[i]]);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- GESTIÓN DE COMENTARIOS ---
router.get('/comments', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT lc.*, u.name as user, cl.title as lessonTitle, c.title as courseTitle, c.slug as courseSlug
            FROM lesson_comments lc
            JOIN users u ON lc.user_id = u.id
            JOIN course_lessons cl ON lc.lesson_id = cl.id
            JOIN course_modules cm ON cl.module_id = cm.id
            JOIN courses c ON cm.course_id = c.id
            ORDER BY lc.created_at DESC
        `);
        res.json(rows.map(r => ({ 
            ...r, 
            id: String(r.id),
            text: r.content, // Map content from DB to text for frontend
            date: r.created_at, // Map created_at from DB to date for frontend (Fix Invalid Date)
            parentId: r.parent_id ? String(r.parent_id) : undefined, // Map parent_id to parentId (Fix hierarchy)
            isApproved: !!r.is_approved 
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/comments/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { action } = req.body;
    try {
        if (action === 'delete') {
            await pool.query('DELETE FROM lesson_comments WHERE id = ? OR parent_id = ?', [req.params.id, req.params.id]);
        } else if (action === 'toggle_publish') {
            // Get current state to apply cascade logic correctly
            const [current] = await pool.query('SELECT is_approved FROM lesson_comments WHERE id = ?', [req.params.id]);
            if (current.length > 0) {
                const nextStatus = current[0].is_approved ? 0 : 1;
                // Update parent and children in cascade
                await pool.query('UPDATE lesson_comments SET is_approved = ? WHERE id = ? OR parent_id = ?', [nextStatus, req.params.id, req.params.id]);
            }
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- AJUSTES Y LOGS ---
router.put('/settings', authMiddleware, adminMiddleware, async (req, res) => {
    const { key, value } = req.body;
    try {
        await pool.query(`INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`, [key, value, value]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

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