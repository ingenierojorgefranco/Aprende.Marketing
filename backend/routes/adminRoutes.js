
import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { logSystemActivity, DEFAULT_LIMITS } from './authRoutes.js';
import { adminRouter as courseAdminRouter } from './courseRoutes.js';

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
//  MODULARIZACIÓN: CURSOS Y LMS
// ======================================================
router.use('/', courseAdminRouter);

// ======================================================
//  GESTIÓN DE USUARIOS
// ======================================================

router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, name, email, role, is_active, plan_limits, created_at, last_login_at, avatar_url, birth_date, custom_redirect_url, max_hooks 
             FROM users ORDER BY created_at DESC`
        );
        const safeUsers = users.map(u => ({
            ...u,
            planLimits: typeof u.plan_limits === 'string' ? JSON.parse(u.plan_limits) : (u.plan_limits || DEFAULT_LIMITS),
            customRedirectUrl: u.custom_redirect_url,
            maxHooks: u.max_hooks
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
              AND YEAR(CURRENT_DATE()) = YEAR(created_at)
            GROUP BY resource_type
        `, [id]);

        // Nuevo: Conteo de ganchos para el usuario
        const [hooksCount] = await pool.query(`
            SELECT COUNT(*) as count 
            FROM project_hooks h
            JOIN projects p ON h.project_id = p.id
            WHERE p.user_id = ?
        `, [id]);

        const usage = { projects: 0, landings: 0, articles: 0, hooks: hooksCount[0].count || 0 };
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
    const { role, planLimits, isActive, name, email, avatarUrl, birthDate, customRedirectUrl, maxHooks } = req.body;
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
                custom_redirect_url = ?,
                max_hooks = ?
             WHERE id = ?`,
            [role, JSON.stringify(planLimits), isActive, name, email, avatarUrl, birthDate, customRedirectUrl, maxHooks, id]
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
            [rows] = await pool.query('SELECT id, name, niche, main_goal, limits_config, is_active, created_at FROM projects WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'pages') {
            [rows] = await pool.query('SELECT id, name, subdomain, is_published, visits, created_at FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'articles') {
            [rows] = await pool.query('SELECT id, title, slug, status, seo_score, created_at FROM articles WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'emails') {
            [rows] = await pool.query('SELECT id, name, status, created_at FROM email_sequences WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'whatsapp') {
            [rows] = await pool.query('SELECT id, name, status, created_at FROM whatsapp_lanzamientos WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'hooks') {
            [rows] = await pool.query('SELECT ph.id, ph.title, ph.psychological_strategy, ph.created_at, p.name as project_name FROM project_hooks ph JOIN projects p ON ph.project_id = p.id WHERE p.user_id = ? ORDER BY ph.created_at DESC', [userId]);
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
//  SOPORTE Y TICKETS (Admin)
// ======================================================

router.get('/support/tickets', async (req, res) => {
    try {
        const [tickets] = await pool.query(
            `SELECT * FROM support_tickets ORDER BY created_at DESC`
        );
        res.json(tickets.map(t => ({
            ...t,
            id: String(t.id),
            userId: String(t.user_id),
            userName: t.user_name,
            userEmail: t.user_email,
            itemName: t.item_name,
            createdAt: t.created_at
        })));
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
            ////////// Se añade mapeo de hotmartId desde la base de datos - 24/05/2025 10:30 //////////
            hotmartId: p.hotmart_id,
            ////////// Fin de actualización - 24/05/2025 10:30 //////////
            ////////// Se añade mapeo de hotmartOffer desde la base de datos - 25/05/2025 15:30 //////////
            hotmartOffer: p.hotmart_offer,
            ////////// Fin de actualización - 25/05/2025 15:30 //////////
            ////////// Se añade mapeo de hotmartCheckoutMode desde la base de datos - 25/05/2025 18:45 //////////
            hotmartCheckoutMode: p.hotmart_checkout_mode,
            ////////// Fin de actualización - 25/05/2025 18:45 //////////
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
    ////////// Se añade hotmartId, hotmartOffer y hotmartCheckoutMode en la creación de planes - 25/05/2025 18:45 //////////
    const { name, slug, description, priceMonthly, currency, stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `INSERT INTO plans (name, slug, description, price_monthly, currency, stripe_price_id, hotmart_id, hotmart_offer, hotmart_checkout_mode, limits_config, ui_features, is_active, is_recommended) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended]
        );
        ////////// Fin de actualización - 25/05/2025 18:45 //////////
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'CREATE_PLAN', 'plan', null, { name, slug });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/plans/:id', async (req, res) => {
    const { id } = req.params;
    ////////// Se añade hotmartId, hotmartOffer y hotmartCheckoutMode en la actualización de planes - 25/05/2025 18:45 //////////
    const { name, slug, description, priceMonthly, currency, stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `UPDATE plans SET name=?, slug=?, description=?, price_monthly=?, currency=?, stripe_price_id=?, hotmart_id=?, hotmart_offer=?, hotmart_checkout_mode=?, limits_config=?, ui_features=?, is_active=?, is_recommended=? WHERE id=?`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended, id]
        );
        ////////// Fin de actualización - 25/05/2025 18:45 //////////
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

////////// Actualización: Endpoints de gestión de novedades para administradores - 07/06/2025 10:00 //////////
router.get('/news', async (req, res) => {
    try {
        const [news] = await pool.query('SELECT * FROM novedadestips ORDER BY created_at DESC');
        res.json(news);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/news', async (req, res) => {
    const { title, content, icon_type } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO novedadestips (title, content, icon_type, created_at) VALUES (?, ?, ?, NOW())',
            [title, content, icon_type || 'update']
        );
        res.json({ id: result.insertId, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/news/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, icon_type } = req.body;
    try {
        await pool.query(
            'UPDATE novedadestips SET title = ?, content = ?, icon_type = ? WHERE id = ?',
            [title, content, icon_type, id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/news/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM novedadestips WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { limits_config, is_active } = req.body;
    try {
        await pool.query(
            'UPDATE projects SET limits_config = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
            [JSON.stringify(limits_config), is_active ? 1 : 0, id]
        );
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'ADMIN_UPDATE_PROJECT', 'project', id, { limits_config, is_active });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

////////// Fin de actualización - 07/06/2025 10:00 //////////

export default router;
