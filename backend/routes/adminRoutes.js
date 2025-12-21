const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, DEFAULT_LIMITS } = require('./authRoutes');

const router = express.Router();

/**
 * Middleware para verificar permisos de administrador.
 * Se asume que req.user ha sido inyectado previamente por authMiddleware.
 */
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
    }
    next();
};

// Aplicar seguridad global a todas las rutas de este router
router.use(authMiddleware);
router.use(adminMiddleware);

// ======================================================
//  GESTIÓN DE USUARIOS
// ======================================================

router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, name, email, role, is_active, plan_limits, created_at, last_login_at, avatar_url, birth_date, custom_redirect_url 
             FROM users ORDER BY created_at DESC`
        );
        const safeUsers = users.map(u => ({
            ...u,
            planLimits: typeof u.plan_limits === 'string' ? JSON.parse(u.plan_limits) : (u.plan_limits || DEFAULT_LIMITS),
            customRedirectUrl: u.custom_redirect_url
        }));
        res.json(safeUsers);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/users/:id/stats', async (req, res) => {
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
        usageRows.forEach(row => {
            if (row.resource_type === 'project') usage.projects = row.count;
            if (row.resource_type === 'landing') usage.landings = row.count;
            if (row.resource_type === 'article') usage.articles = row.count;
        });
        res.json(usage);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { role, planLimits, isActive, name, email, avatarUrl, birthDate, customRedirectUrl } = req.body;
    try {
        await pool.query(
            `UPDATE users SET 
                role = ?, 
                plan_limits = ?, 
                is_active = ?,
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                avatar_url = ?,
                birth_date = ?,
                custom_redirect_url = ?
             WHERE id = ?`,
            [role, JSON.stringify(planLimits), isActive, name, email, avatarUrl, birthDate, customRedirectUrl, id]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_USER', 'user', id, { role, planName: planLimits.planName });
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const [targetUser] = await pool.query('SELECT email FROM users WHERE id = ?', [req.params.id]);
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'DELETE_USER', 'user', req.params.id, { email: targetUser[0]?.email });
        res.json({ message: 'Usuario eliminado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/users/:userId/resources', async (req, res) => {
    const { userId } = req.params;
    const { type } = req.query;
    try {
        let rows = [];
        if (type === 'projects') {
            [rows] = await pool.query('SELECT id, name, niche, main_goal, created_at FROM projects WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'pages') {
            [rows] = await pool.query('SELECT id, name, subdomain, is_published, visits, created_at FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'articles') {
            [rows] = await pool.query('SELECT id, title, slug, status, seo_score, created_at FROM articles WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else {
            return res.status(400).json({ error: 'Invalid resource type' });
        }
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/users/:userId/payments', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM user_payments WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  ESTADÍSTICAS GLOBALES Y REGISTROS
// ======================================================

router.get('/stats', async (req, res) => {
    try {
        const [userCount] = await pool.query('SELECT COUNT(*) as c FROM users');
        const [projectsCount] = await pool.query('SELECT COUNT(*) as c FROM projects');
        const [pagesCount] = await pool.query('SELECT COUNT(*) as c FROM landing_pages');
        res.json({
            users: userCount[0].c,
            projects: projectsCount[0].c,
            pages: pagesCount[0].c
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/logs', async (req, res) => {
    const pageNum = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (pageNum - 1) * limit;
    const { action, search } = req.query;
    try {
        let query = 'SELECT * FROM system_activity_logs WHERE 1=1';
        const params = [];
        if (action && action !== 'all') {
            query += ' AND action_type = ?';
            params.push(action);
        }
        if (search) {
            query += ' AND (user_name LIKE ? OR details LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  GESTIÓN DE PLANES
// ======================================================

router.get('/plans', async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM plans ORDER BY price_monthly ASC');
        const safePlans = plans.map(p => ({
            ...p,
            id: p.id.toString(),
            priceMonthly: parseFloat(p.price_monthly),
            stripePriceId: p.stripe_price_id,
            limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config,
            uiFeatures: typeof p.ui_features === 'string' ? JSON.parse(p.ui_features) : (p.ui_features || []),
            isActive: !!p.is_active,
            isRecommended: !!p.is_recommended
        }));
        res.json(safePlans);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/plans', async (req, res) => {
    const { name, slug, description, priceMonthly, currency, stripePriceId, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `INSERT INTO plans (name, slug, description, price_monthly, currency, stripe_price_id, limits_config, ui_features, is_active, is_recommended) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'CREATE_PLAN', 'plan', null, { name, slug });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/plans/:id', async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, priceMonthly, currency, stripePriceId, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `UPDATE plans SET name=?, slug=?, description=?, price_monthly=?, currency=?, stripe_price_id=?, limits_config=?, ui_features=?, is_active=?, is_recommended=? WHERE id=?`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended, id]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_PLAN', 'plan', id, { name });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/plans/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM plans WHERE id = ?', [id]);
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'DELETE_PLAN', 'plan', id, null);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  GESTIÓN DE CURSOS (LMS)
// ======================================================

router.get('/courses', async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT * FROM courses ORDER BY order_index ASC, created_at DESC');
        const coursesWithDetails = await Promise.all(courses.map(async (c) => {
            const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [c.id]);
            const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
                const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [mod.id]);
                const lessonsParsed = lessons.map(l => ({
                    ...l,
                    learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || [])
                }));
                return { ...mod, lessons: lessonsParsed };
            }));
            return {
                ...c,
                is_active: !!c.is_active,
                modules: modulesWithLessons
            };
        }));
        res.json(coursesWithDetails);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/courses/reorder', async (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'Formato inválido' });
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        for (let i = 0; i < orderedIds.length; i++) {
            await connection.query('UPDATE courses SET order_index = ? WHERE id = ?', [i, orderedIds[i]]);
        }
        await connection.commit();
        connection.release();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/courses', async (req, res) => {
    const { title, subtitle, description, slug, thumbnail, modules, badge_text, is_active } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [courseRes] = await connection.query(
            'INSERT INTO courses (title, subtitle, description, slug, thumbnail, badge_text, is_active, created_at, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 999)',
            [title, subtitle, description, slug, thumbnail, badge_text || 'Certificado', is_active]
        );
        const courseId = courseRes.insertId;
        if (modules && modules.length > 0) {
            for (const mod of modules) {
                const [modRes] = await connection.query(
                    'INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)',
                    [courseId, mod.title, mod.order_index]
                );
                const moduleId = modRes.insertId;
                if (mod.lessons && mod.lessons.length > 0) {
                    for (const lesson of mod.lessons) {
                        await connection.query(
                            'INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [moduleId, lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index]
                        );
                    }
                }
            }
        }
        await connection.commit();
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'CREATE_COURSE', 'course', courseId, { title });
        res.json({ success: true, id: courseId });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

router.put('/courses/:id', async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, slug, thumbnail, modules, badge_text, is_active } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'UPDATE courses SET title=?, subtitle=?, description=?, slug=?, thumbnail=?, badge_text=?, is_active=? WHERE id=?',
            [title, subtitle, description, slug, thumbnail, badge_text, is_active, id]
        );
        const validModuleIds = [];
        if (modules && modules.length > 0) {
            for (const mod of modules) {
                let moduleId = mod.id;
                if (typeof moduleId === 'string' && moduleId.startsWith('new-')) {
                    const [modRes] = await connection.query(
                        'INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)',
                        [id, mod.title, mod.order_index]
                    );
                    moduleId = modRes.insertId;
                } else {
                    await connection.query(
                        'UPDATE course_modules SET title=?, order_index=? WHERE id=?',
                        [mod.title, mod.order_index, moduleId]
                    );
                }
                validModuleIds.push(moduleId);
                const validLessonIds = [];
                if (mod.lessons && mod.lessons.length > 0) {
                    for (const lesson of mod.lessons) {
                        let lessonId = lesson.id;
                        if (typeof lessonId === 'string' && lessonId.startsWith('new-')) {
                            const [lessRes] = await connection.query(
                                'INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                [moduleId, lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index]
                            );
                            lessonId = lessRes.insertId;
                        } else {
                            await connection.query(
                                'UPDATE course_lessons SET title=?, duration=?, video_url=?, description=?, learning_points=?, order_index=?, module_id=? WHERE id=?',
                                [lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index, moduleId, lessonId]
                            );
                        }
                        validLessonIds.push(lessonId);
                    }
                }
                if (validLessonIds.length > 0) {
                    await connection.query(`DELETE FROM course_lessons WHERE module_id = ? AND id NOT IN (${validLessonIds.join(',')})`, [moduleId]);
                } else {
                    await connection.query('DELETE FROM course_lessons WHERE module_id = ?', [moduleId]);
                }
            }
        }
        if (validModuleIds.length > 0) {
            await connection.query(`DELETE FROM course_modules WHERE course_id = ? AND id NOT IN (${validModuleIds.join(',')})`, [id]);
        } else {
            await connection.query('DELETE FROM course_modules WHERE course_id = ?', [id]);
        }
        await connection.commit();
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_COURSE', 'course', id, { title });
        res.json({ success: true });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

router.delete('/courses/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'DELETE_COURSE', 'course', req.params.id, null);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  MODERACIÓN DE COMENTARIOS
// ======================================================

router.get('/comments', async (req, res) => {
    try {
        const [comments] = await pool.query(`
            SELECT 
                c.id, c.content as text, c.created_at as date, c.likes, c.is_approved as isApproved,
                c.parent_id as parentId,
                u.name as user, u.id as userId,
                l.title as lessonTitle, l.id as lessonId,
                co.title as courseTitle, co.slug as courseSlug
            FROM lesson_comments c
            JOIN users u ON c.user_id = u.id
            JOIN course_lessons l ON c.lesson_id = l.id
            JOIN course_modules m ON l.module_id = m.id
            JOIN courses co ON m.course_id = co.id
            ORDER BY c.created_at DESC
        `);
        const formatted = comments.map(c => ({
            ...c,
            id: c.id.toString(),
            isApproved: !!c.isApproved,
            parentId: c.parentId ? c.parentId.toString() : null
        }));
        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; 
    try {
        if (action === 'delete') {
            await pool.query('DELETE FROM lesson_comments WHERE id = ?', [id]);
        } 
        else if (action === 'toggle_publish') {
            const [rows] = await pool.query('SELECT is_approved FROM lesson_comments WHERE id = ?', [id]);
            if (rows.length > 0) {
                const currentStatus = rows[0].is_approved;
                const newStatus = !currentStatus;
                await pool.query('UPDATE lesson_comments SET is_approved = ? WHERE id = ?', [newStatus, id]);
                if (!newStatus) {
                    await pool.query('UPDATE lesson_comments SET is_approved = 0 WHERE parent_id = ?', [id]);
                }
            }
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  AJUSTES DEL SISTEMA
// ======================================================

router.put('/settings', async (req, res) => {
    const { key, value } = req.body;
    try {
        await pool.query(
            `INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`,
            [key, value, value]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_SETTINGS', 'setting', key, { value });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;