
import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { logSystemActivity, DEFAULT_LIMITS, clearLimitsCache } from './authRoutes.js';
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
            `SELECT id, name, email, role, is_active, plan_limits, created_at, last_login_at, avatar_url, birth_date, custom_redirect_url, max_hooks,
                    survey_json, main_goal, experience_level, budget_range, main_obstacle, niche, urgency_level, createdsurvey_at, updatedsurvey_at 
             FROM users ORDER BY created_at DESC`
        );
        const safeUsers = users.map(u => ({
            ...u,
            planLimits: typeof u.plan_limits === 'string' ? JSON.parse(u.plan_limits) : (u.plan_limits || DEFAULT_LIMITS),
            customRedirectUrl: u.custom_redirect_url,
            maxHooks: u.max_hooks,
            survey_json: typeof u.survey_json === 'string' ? JSON.parse(u.survey_json) : u.survey_json
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
    const { role, planLimits, isActive, name, email, avatarUrl, birthDate, customRedirectUrl, maxHooks, password } = req.body;
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

        if (password && password.trim() !== '') {
            const passwordHash = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
        }

        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_USER', 'user', id, { role, planName: planLimits.planName });
        clearLimitsCache(id);
        clearLimitsCache(String(id));
        clearLimitsCache(Number(id));
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
            [rows] = await pool.query('SELECT id, name, niche, main_goal, limits_config, is_active, strategy_json, created_at FROM projects WHERE user_id = ? ORDER BY created_at DESC', [userId]);
            rows = rows.map(r => ({
                ...r,
                strategy_json: typeof r.strategy_json === 'string' ? JSON.parse(r.strategy_json) : r.strategy_json
            }));
        } else if (type === 'pages') {
            [rows] = await pool.query('SELECT id, name, subdomain, is_published, visits, created_at FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'articles') {
            [rows] = await pool.query('SELECT id, title, slug, status, seo_score, created_at, project_id FROM articles WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'emails') {
            [rows] = await pool.query('SELECT id, name, status, created_at FROM email_sequences WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'whatsapp') {
            [rows] = await pool.query('SELECT id, name, status, created_at FROM whatsapp_lanzamientos WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'hooks') {
            [rows] = await pool.query('SELECT ph.id, ph.title, ph.psychological_strategy, ph.created_at, p.name as project_name, p.id as project_id FROM project_hooks ph JOIN projects p ON ph.project_id = p.id WHERE p.user_id = ? ORDER BY ph.created_at DESC', [userId]);
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
//  GESTIÓN DE SUSCRIPCIONES (NUEVO)
// ======================================================

router.get('/users/:userId/subscriptions', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT 
                us.id, 
                us.user_id as userId, 
                us.plan_slug as planSlug, 
                us.status, 
                us.created_at as createdAt, 
                us.expires_at as nextBillingAt, 
                p.name as planName,
                p.id as planId
            FROM user_subscriptions us
            LEFT JOIN plans p ON us.plan_slug = p.slug
            WHERE us.user_id = ?
            ORDER BY us.created_at DESC
        `, [userId]);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/users/:userId/subscriptions', async (req, res) => {
    const { userId } = req.params;
    const { planId, status } = req.body;
    try {
        // 1. Obtener la información del plan por ID o por Slug
        const [plans] = await pool.query('SELECT slug, name, limits_config FROM plans WHERE id = ? OR slug = ?', [planId, planId]);
        if (plans.length === 0) return res.status(404).json({ error: 'Plan no encontrado' });
        const plan = plans[0];
        const planSlug = plan.slug;
        const limitsConfig = typeof plan.limits_config === 'string' ? JSON.parse(plan.limits_config) : plan.limits_config;

        // 2. Desactivar suscripciones activas anteriores para evitar conflictos de estado
        await pool.query(
            "UPDATE user_subscriptions SET status = 'replaced' WHERE user_id = ? AND status = 'active'",
            [userId]
        );

        // 3. Crear la nueva suscripción activa
        const [result] = await pool.query(
            'INSERT INTO user_subscriptions (user_id, plan_slug, status, created_at) VALUES (?, ?, ?, NOW())',
            [userId, planSlug, status || 'active']
        );

        // 4. Actualizar los límites del usuario inmediatamente
        const newPlanLimits = {
            planName: planSlug,
            planSlug: planSlug,
            planDisplayName: plan.name,
            ...limitsConfig
        };
        
        await pool.query(
            'UPDATE users SET plan_limits = ? WHERE id = ?',
            [JSON.stringify(newPlanLimits), userId]
        );

        // 5. Sincronizar el plan_slug en los proyectos del usuario para desbloquearlos de inmediato
        await pool.query(
            'UPDATE projects SET plan_slug = ? WHERE user_id = ?',
            [planSlug, userId]
        );

        // 6. Limpieza total de caché de límites (claves como string y número)
        clearLimitsCache(userId);
        clearLimitsCache(String(userId));
        clearLimitsCache(Number(userId));

        // 7. Obtener la fila insertada para devolverla
        const [newSub] = await pool.query(`
            SELECT 
                us.id, 
                us.user_id as userId, 
                us.plan_slug as planSlug, 
                us.status, 
                us.created_at as createdAt, 
                us.expires_at as nextBillingAt, 
                p.name as planName,
                p.id as planId
            FROM user_subscriptions us
            LEFT JOIN plans p ON us.plan_slug = p.slug
            WHERE us.id = ?
        `, [result.insertId]);

        // Logging
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'ADMIN_ASSIGN_PLAN', 'subscription', result.insertId, { userId, planSlug });

        res.json(newSub[0]);
    } catch (e) {
        console.error("Error in adminCreateSubscription:", e);
        res.status(500).json({ error: e.message });
    }
});

router.put('/subscriptions/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE user_subscriptions SET status = ? WHERE id = ?', [status, id]);

        // Coordinar y sincronizar con la tabla de users y projects
        const [subs] = await pool.query('SELECT user_id, plan_slug FROM user_subscriptions WHERE id = ?', [id]);
        if (subs.length > 0) {
            const userId = subs[0].user_id;
            const planSlug = subs[0].plan_slug;

            if (status === 'active') {
                // Al activar, actualizamos el campo plan_limits del usuario con los límites del plan correspondiente
                const [plans] = await pool.query('SELECT name, limits_config FROM plans WHERE slug = ?', [planSlug]);
                if (plans.length > 0) {
                    const plan = plans[0];
                    const limitsConfig = typeof plan.limits_config === 'string' ? JSON.parse(plan.limits_config) : plan.limits_config;
                    const newPlanLimits = {
                        planName: planSlug,
                        planSlug: planSlug,
                        planDisplayName: plan.name,
                        ...limitsConfig
                    };
                    await pool.query(
                        'UPDATE users SET plan_limits = ? WHERE id = ?',
                        [JSON.stringify(newPlanLimits), userId]
                    );
                    await pool.query(
                        'UPDATE projects SET plan_slug = ? WHERE user_id = ?',
                        [planSlug, userId]
                    );
                }
            } else if (status === 'inactive' || status === 'canceled') {
                // Al desactivar, restauramos los límites al plan starter por defecto
                await pool.query(
                    'UPDATE users SET plan_limits = ? WHERE id = ?',
                    [JSON.stringify(DEFAULT_LIMITS), userId]
                );
                await pool.query(
                    'UPDATE projects SET plan_slug = "starter" WHERE user_id = ?',
                    [userId]
                );
            }

            // Limpiamos la caché inmediatamente para actualizar en tiempo real
            clearLimitsCache(userId);
            clearLimitsCache(String(userId));
            clearLimitsCache(Number(userId));
        }

        res.json({ success: true });
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
            hotmartOffer: p.hotmart_offer,
            hotmartCheckoutMode: p.hotmart_checkout_mode,
            hotmartIdAnnual: p.hotmart_id_annual,
            hotmartOfferAnnual: p.hotmart_offer_annual,
            hotmartCheckoutModeAnnual: p.hotmart_checkout_mode_annual,
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
    const { name, slug, description, priceMonthly, currency, stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, hotmartIdAnnual, hotmartOfferAnnual, hotmartCheckoutModeAnnual, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `INSERT INTO plans (name, slug, description, price_monthly, currency, stripe_price_id, hotmart_id, hotmart_offer, hotmart_checkout_mode, hotmart_id_annual, hotmart_offer_annual, hotmart_checkout_mode_annual, limits_config, ui_features, is_active, is_recommended) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, hotmartIdAnnual, hotmartOfferAnnual, hotmartCheckoutModeAnnual, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended]
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
    const { name, slug, description, priceMonthly, currency, stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, hotmartIdAnnual, hotmartOfferAnnual, hotmartCheckoutModeAnnual, limitsConfig, uiFeatures, isActive, isRecommended } = req.body;
    try {
        await pool.query(
            `UPDATE plans SET name=?, slug=?, description=?, price_monthly=?, currency=?, stripe_price_id=?, hotmart_id=?, hotmart_offer=?, hotmart_checkout_mode=?, hotmart_id_annual=?, hotmart_offer_annual=?, hotmart_checkout_mode_annual=?, limits_config=?, ui_features=?, is_active=?, is_recommended=? WHERE id=?`,
            [name, slug, description, priceMonthly, currency || 'EUR', stripePriceId, hotmartId, hotmartOffer, hotmartCheckoutMode, hotmartIdAnnual, hotmartOfferAnnual, hotmartCheckoutModeAnnual, JSON.stringify(limitsConfig), JSON.stringify(uiFeatures), isActive, isRecommended, id]
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
    const { limits_config, is_active, strategy_json } = req.body;
    try {
        let updateFields = [];
        let params = [];

        if (limits_config !== undefined) {
            updateFields.push('limits_config = ?');
            params.push(JSON.stringify(limits_config));
        }
        if (is_active !== undefined) {
            updateFields.push('is_active = ?');
            params.push(is_active ? 1 : 0);
        }
        if (strategy_json !== undefined) {
            updateFields.push('strategy_json = ?');
            params.push(typeof strategy_json === 'string' ? strategy_json : JSON.stringify(strategy_json));
        }

        if (updateFields.length === 0) {
            return res.json({ success: true, message: 'No fields to update' });
        }

        const query = `UPDATE projects SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        params.push(id);

        await pool.query(query, params);
        
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'ADMIN_UPDATE_PROJECT', 'project', id, { limits_config, is_active, has_strategy: !!strategy_json });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

////////// Fin de actualización - 07/06/2025 10:00 //////////

// ======================================================
//  SISTEMA DE SEGUIMIENTO Y CONTROL DE COMPRAS HOTMART
// ======================================================

router.get('/hotmart-orders', async (req, res) => {
    try {
        const { search, status, periodicity, page = 1, limit = 50 } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 50;
        const offset = (pageNum - 1) * limitNum;

        let whereClauses = [];
        let params = [];

        if (search && search.trim() !== '') {
            const term = `%${search.trim()}%`;
            whereClauses.push('(o.transaction_id LIKE ? OR o.buyer_name LIKE ? OR o.buyer_email LIKE ? OR o.buyer_phone LIKE ? OR o.affiliate_code LIKE ? OR o.plan_name LIKE ?)');
            params.push(term, term, term, term, term, term);
        }

        if (status && status !== 'all') {
            if (status === 'approved' || status === '1') {
                whereClauses.push('(o.approval_code = "1" OR o.approval_status = "approved")');
            } else if (status === 'pending_cash' || status === '2') {
                whereClauses.push('(o.approval_code = "2" OR o.approval_status = "pending_cash")');
            } else if (status === 'pending_paypal' || status === '3') {
                whereClauses.push('(o.approval_code = "3" OR o.approval_status = "pending_paypal")');
            }
        }

        if (periodicity && periodicity !== 'all') {
            whereClauses.push('o.periodicity = ?');
            params.push(periodicity);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // 1. Obtener métricas agregadas globales
        const [statsRows] = await pool.query(`
            SELECT 
                COUNT(*) as totalOrders,
                COUNT(DISTINCT buyer_email) as totalClients,
                COALESCE(SUM(CASE WHEN approval_code = '1' OR approval_status = 'approved' THEN amount ELSE 0 END), 0) as totalRevenue,
                COUNT(CASE WHEN periodicity = 'mensual' AND (approval_code = '1' OR approval_status = 'approved') THEN 1 END) as monthlyApprovedCount,
                COALESCE(SUM(CASE WHEN periodicity = 'mensual' AND (approval_code = '1' OR approval_status = 'approved') THEN amount ELSE 0 END), 0) as monthlyApprovedRevenue,
                COUNT(CASE WHEN periodicity = 'anual' AND (approval_code = '1' OR approval_status = 'approved') THEN 1 END) as annualApprovedCount,
                COALESCE(SUM(CASE WHEN periodicity = 'anual' AND (approval_code = '1' OR approval_status = 'approved') THEN amount ELSE 0 END), 0) as annualApprovedRevenue,
                COUNT(CASE WHEN approval_code IN ('2', '3') OR approval_status LIKE 'pending%' THEN 1 END) as pendingCount,
                COALESCE(SUM(CASE WHEN approval_code IN ('2', '3') OR approval_status LIKE 'pending%' THEN amount ELSE 0 END), 0) as pendingRevenue
            FROM hotmart_orders_log
        `);

        // 2. Obtener total de registros que coinciden con los filtros actuales
        const [countRows] = await pool.query(`
            SELECT COUNT(*) as totalFiltered
            FROM hotmart_orders_log o
            ${whereSQL}
        `, params);
        const totalFiltered = countRows[0]?.totalFiltered || 0;

        // 3. Obtener listado de órdenes detalladas con usuario vinculado
        const [orders] = await pool.query(`
            SELECT 
                o.*,
                u.id as linked_user_id,
                u.name as linked_user_name,
                u.email as linked_user_email,
                u.role as linked_user_role,
                u.is_active as linked_user_active,
                us.status as subscription_active_status,
                us.starts_at as sub_starts_at,
                us.expires_at as sub_expires_at
            FROM hotmart_orders_log o
            LEFT JOIN users u ON (o.user_id = u.id OR (o.buyer_email IS NOT NULL AND o.buyer_email != '' AND o.buyer_email = u.email))
            LEFT JOIN user_subscriptions us ON (u.id = us.user_id AND us.status = 'active')
            ${whereSQL}
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        `, [...params, limitNum, offset]);

        const mappedOrders = orders.map(ord => ({
            id: ord.id,
            transactionId: ord.transaction_id,
            buyerName: ord.buyer_name,
            buyerEmail: ord.buyer_email,
            buyerPhone: ord.buyer_phone,
            approvalCode: ord.approval_code || '1',
            approvalStatus: ord.approval_status || 'approved',
            affiliateCode: ord.affiliate_code,
            planSlug: ord.plan_slug,
            planName: ord.plan_name || (ord.periodicity === 'anual' ? 'Pro_Ilimitado Anual' : 'Pro_Ilimitado Mensual'),
            periodicity: ord.periodicity || (ord.amount >= 200 ? 'anual' : 'mensual'),
            durationDays: ord.duration_days || (ord.periodicity === 'anual' ? 365 : 30),
            amount: parseFloat(ord.amount || 0),
            currency: ord.currency || 'USD',
            startDate: ord.start_date || ord.created_at,
            renewalDate: ord.renewal_date || ord.sub_expires_at,
            userId: ord.linked_user_id || ord.user_id,
            isUserRegistered: !!ord.linked_user_id,
            userRole: ord.linked_user_role,
            itmSource: ord.itm_source,
            itmMedium: ord.itm_medium,
            itmCampaign: ord.itm_campaign,
            rawParams: typeof ord.raw_query_json === 'string' ? JSON.parse(ord.raw_query_json) : (ord.raw_query_json || {}),
            createdAt: ord.created_at,
            updatedAt: ord.updated_at
        }));

        res.json({
            stats: statsRows[0] || {},
            orders: mappedOrders,
            pagination: {
                total: totalFiltered,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalFiltered / limitNum) || 1
            }
        });
    } catch (e) {
        console.error("[Hotmart Orders Error]", e);
        res.status(500).json({ error: e.message });
    }
});

/**
 * Aprobación manual de un pedido en efectivo o paypal por el administrador
 */
router.post('/hotmart-orders/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
        const [orders] = await pool.query('SELECT * FROM hotmart_orders_log WHERE id = ?', [id]);
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        const order = orders[0];
        const isAnnual = order.periodicity === 'anual' || order.amount >= 200;
        const durationDays = order.duration_days || (isAnnual ? 365 : 30);
        const startDate = new Date();
        const renewalDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

        // 1. Actualizar estado en hotmart_orders_log
        await pool.query(
            `UPDATE hotmart_orders_log 
             SET approval_code = '1', approval_status = 'approved', start_date = ?, renewal_date = ?, updated_at = NOW() 
             WHERE id = ?`,
            [startDate, renewalDate, id]
        );

        // 2. Si el usuario existe en el sistema, activar su suscripción inmediatamente
        let userId = order.user_id;
        if (!userId && order.buyer_email) {
            const [uRows] = await pool.query('SELECT id FROM users WHERE email = ?', [order.buyer_email]);
            if (uRows.length > 0) userId = uRows[0].id;
        }

        if (userId) {
            const planSlug = isAnnual ? 'pro-anual' : 'pro';
            const planName = order.plan_name || (isAnnual ? 'Pro_Ilimitado Anual' : 'Pro_Ilimitado Mensual');

            const [proPlans] = await pool.query(`SELECT limits_config FROM plans WHERE slug = 'pro' LIMIT 1`);
            const proLimits = proPlans.length > 0 
                ? (typeof proPlans[0].limits_config === 'string' ? JSON.parse(proPlans[0].limits_config) : proPlans[0].limits_config)
                : DEFAULT_LIMITS;

            const [existingSub] = await pool.query('SELECT id FROM user_subscriptions WHERE user_id = ? AND status = "active" LIMIT 1', [userId]);
            if (existingSub.length > 0) {
                await pool.query(
                    `UPDATE user_subscriptions 
                     SET plan_slug = ?, plan_name = ?, periodicity = ?, price = ?, duration_days = ?, starts_at = ?, expires_at = ?, status = 'active', updated_at = NOW() 
                     WHERE id = ?`,
                    [planSlug, planName, order.periodicity, order.amount, durationDays, startDate, renewalDate, existingSub[0].id]
                );
            } else {
                await pool.query(
                    `INSERT INTO user_subscriptions (user_id, plan_slug, plan_name, periodicity, price, duration_days, starts_at, expires_at, status, hotmart_purchase_id, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, NOW())`,
                    [userId, planSlug, planName, order.periodicity, order.amount, durationDays, startDate, renewalDate, order.transaction_id]
                );
            }

            await pool.query(
                `UPDATE users SET subscription_status = 'active', plan_limits = ? WHERE id = ?`,
                [JSON.stringify(proLimits), userId]
            );
            await pool.query(`UPDATE projects SET plan_slug = ? WHERE user_id = ?`, [planSlug, userId]);
            clearLimitsCache(userId);

            // Registrar en user_payments
            await pool.query(
                `INSERT INTO user_payments (user_id, transaction_id, amount, currency, status, payment_method, affiliate_code, buyer_name, approval_code) 
                 VALUES (?, ?, ?, ?, 'approved', 'hotmart_manual_approval', ?, ?, '1') 
                 ON DUPLICATE KEY UPDATE status = 'approved', approval_code = '1'`,
                [userId, order.transaction_id, order.amount, order.currency, order.affiliate_code, order.buyer_name]
            );
        }

        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'ADMIN_APPROVE_HOTMART_ORDER', 'order', order.transaction_id, { orderId: id, buyer: order.buyer_email });

        res.json({ success: true, message: 'Orden aprobada y suscripción activada exitosamente' });
    } catch (e) {
        console.error("[Approve Hotmart Order Error]", e);
        res.status(500).json({ error: e.message });
    }
});

export default router;
