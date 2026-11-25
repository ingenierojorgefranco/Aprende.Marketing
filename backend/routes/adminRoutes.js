
import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { logSystemActivity, DEFAULT_LIMITS, clearLimitsCache } from './authRoutes.js';
import { adminRouter as courseAdminRouter } from './courseRoutes.js';
import * as systemeIoService from '../systemeIoService.js';

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
            `SELECT id, name, email, phone, role, is_active, plan_limits, systemio_registrado, created_at, last_login_at, avatar_url, birth_date, custom_redirect_url, max_hooks,
                    survey_json, main_goal, experience_level, budget_range, main_obstacle, niche, urgency_level, createdsurvey_at, updatedsurvey_at 
             FROM users ORDER BY created_at DESC`
        );
        const safeUsers = users.map(u => ({
            ...u,
            systemio_registrado: u.systemio_registrado === 1 || u.systemio_registrado === true,
            planLimits: typeof u.plan_limits === 'string' ? JSON.parse(u.plan_limits) : (u.plan_limits || DEFAULT_LIMITS),
            customRedirectUrl: u.custom_redirect_url,
            maxHooks: u.max_hooks,
            survey_json: typeof u.survey_json === 'string' ? JSON.parse(u.survey_json) : u.survey_json,
            createdAt: u.created_at,
            lastLoginAt: u.last_login_at
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
    const { role, planLimits, isActive, name, email, phone, avatarUrl, birthDate, customRedirectUrl, maxHooks, password } = req.body;
    const hasPhoneField = Object.prototype.hasOwnProperty.call(req.body, 'phone');
    const sanitizedPhone = hasPhoneField
        ? (typeof phone === 'string' && phone.trim() ? phone.replace(/[^\d+]/g, '').slice(0, 30) : null)
        : undefined;
    try {
        if (hasPhoneField) {
            await pool.query(
                `UPDATE users SET 
                    role = ?, 
                    plan_limits = ?, 
                    is_active = ?,
                    name = COALESCE(?, name),
                    email = COALESCE(?, email),
                    phone = ?,
                    avatar_url = ?,
                    birth_date = ?,
                    custom_redirect_url = ?,
                    max_hooks = ?
                 WHERE id = ?`,
                [role, JSON.stringify(planLimits), isActive, name, email, sanitizedPhone, avatarUrl, birthDate, customRedirectUrl, maxHooks, id]
            );
        } else {
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
        }

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
        } else if (type === 'carousels') {
            [rows] = await pool.query('SELECT pc.id, pc.title, pc.psychological_strategy, pc.created_at, pc.content_json, p.name as project_name, p.id as project_id FROM project_carousels pc JOIN projects p ON pc.project_id = p.id WHERE p.user_id = ? ORDER BY pc.created_at DESC', [userId]);
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
                COALESCE(us.plan_name, p.name) as planName,
                us.periodicity,
                us.price,
                us.plan_days as planDays,
                us.start_date as startDate,
                us.renewal_date as renewalDate,
                us.status, 
                us.created_at as createdAt, 
                COALESCE(us.renewal_date, us.expires_at) as nextBillingAt, 
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

// Helper seguro para convertir fechas de entrada (YYYY-MM-DD o ISO) a formato MySQL DATETIME
const parseDateInput = (input, isEndOfDay = false) => {
    if (!input) return null;
    const str = String(input).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        const [y, m, d] = str.split('-').map(Number);
        return isEndOfDay
            ? new Date(Date.UTC(y, m - 1, d, 23, 59, 59))
            : new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
    }
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
};

const formatMysqlDateTime = (date) => {
    if (!date || isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const buildManualPlanLimits = (plan, { periodicity, price, planDays, startDate, expiresAt, status = 'active' }) => {
    const baseLimits = typeof plan.limits_config === 'string'
        ? JSON.parse(plan.limits_config)
        : (plan.limits_config || {});
    const isFreePlan = ['starter', 'free'].includes(String(plan.slug || '').toLowerCase());
    const isAnnual = !isFreePlan && (
        String(periodicity || '').toLowerCase() === 'anual' ||
        Number(planDays || 0) >= 300 ||
        String(plan.slug || '').toLowerCase().includes('anual')
    );
    const finalPeriodicity = isFreePlan ? 'Gratuito' : (isAnnual ? 'Anual' : 'Mensual');
    const annualOverrides = (isAnnual && baseLimits.annual) ? baseLimits.annual : {};
    const displayName = isFreePlan ? plan.name : `${plan.name} (${finalPeriodicity})`;

    const newPlanLimits = {
        ...baseLimits,
        ...annualOverrides,
        planName: plan.slug,
        planSlug: plan.slug,
        planDisplayName: displayName,
        periodicity: finalPeriodicity,
        price: Number(price || 0),
        planDays: planDays || (isFreePlan ? 0 : (isAnnual ? 365 : 30)),
    };

    if (startDate) newPlanLimits.startDate = startDate.toISOString();
    if (expiresAt) newPlanLimits.renewalDate = expiresAt.toISOString();

    if (!isFreePlan) {
        newPlanLimits.subscriptionDetails = {
            planName: displayName,
            planSlug: plan.slug,
            periodicity: finalPeriodicity,
            price: Number(price || 0),
            planDays: planDays || (isAnnual ? 365 : 30),
            startDate: startDate ? startDate.toISOString() : new Date().toISOString(),
            renewalDate: expiresAt ? expiresAt.toISOString() : '',
            status
        };
    }

    return { newPlanLimits, isFreePlan, isAnnual, finalPeriodicity, displayName };
};

router.post('/users/:userId/subscriptions', async (req, res) => {
    const { userId } = req.params;
    const {
        planId,
        status,
        periodicity,
        price,
        startDate,
        expiresAt,
        paymentMethod,
        recordPayment
    } = req.body;
    try {
        // 1. Obtener la información del plan por ID o por Slug
        const [plans] = await pool.query(
            'SELECT id, slug, name, price_monthly, price_annual, currency, limits_config FROM plans WHERE id = ? OR slug = ?',
            [planId, planId]
        );
        if (plans.length === 0) return res.status(404).json({ error: 'Plan no encontrado' });
        const plan = plans[0];
        const planSlug = plan.slug;
        const isFreePlan = ['starter', 'free'].includes(String(planSlug || '').toLowerCase());
        const isAnnual = !isFreePlan && (
            String(periodicity || '').toLowerCase() === 'anual' ||
            String(planSlug || '').toLowerCase().includes('anual')
        );
        const finalPeriodicity = isFreePlan ? null : (isAnnual ? 'Anual' : 'Mensual');

        // Calcular fechas y duración
        const startObj = parseDateInput(startDate, false) || new Date();
        let expiresObj = null;
        let planDays = 0;

        if (!isFreePlan) {
            expiresObj = parseDateInput(expiresAt, true);
            if (!expiresObj) {
                expiresObj = new Date(startObj.getTime() + (isAnnual ? 365 : 30) * 86400000);
            }
            if (expiresObj <= startObj) {
                return res.status(400).json({ error: 'La fecha de vencimiento debe ser posterior a la fecha de inicio.' });
            }
            planDays = Math.max(1, Math.round((expiresObj.getTime() - startObj.getTime()) / 86400000));
        }

        const defaultPrice = isFreePlan
            ? 0
            : (isAnnual ? Number(plan.price_annual || plan.price_monthly || 0) : Number(plan.price_monthly || 0));
        const finalPrice = (price !== undefined && price !== null && price !== '' && !isNaN(Number(price)))
            ? Number(price)
            : defaultPrice;

        const { newPlanLimits, displayName } = buildManualPlanLimits(plan, {
            periodicity: finalPeriodicity,
            price: finalPrice,
            planDays,
            startDate: startObj,
            expiresAt: expiresObj,
            status: status || 'active'
        });

        const cleanMethod = (paymentMethod || 'Manual').trim();
        const methodTag = cleanMethod.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || 'DIRECTO';
        const manualRef = isFreePlan ? null : `MANUAL-${methodTag}-${Date.now().toString().slice(-6)}`;

        const trackingParameters = {
            source: 'manual',
            paymentMethod: cleanMethod,
            assignedBy: req.user?.id || null,
            assignedAt: new Date().toISOString()
        };

        // 2. Desactivar suscripciones activas anteriores para evitar conflictos de estado
        await pool.query(
            "UPDATE user_subscriptions SET status = 'replaced' WHERE user_id = ? AND status IN ('active', 'pending_cancellation')",
            [userId]
        );

        // 3. Crear la nueva suscripción activa con todos los detalles
        const [result] = await pool.query(
            `INSERT INTO user_subscriptions 
                (user_id, plan_slug, plan_name, periodicity, price, plan_days, start_date, renewal_date, expires_at, status, hotmart_purchase_id, tracking_parameters, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                userId,
                planSlug,
                displayName,
                finalPeriodicity,
                finalPrice,
                planDays || null,
                formatMysqlDateTime(startObj),
                formatMysqlDateTime(expiresObj),
                formatMysqlDateTime(expiresObj),
                status || 'active',
                manualRef,
                JSON.stringify(trackingParameters)
            ]
        );

        // 4. Actualizar los límites y estado del usuario inmediatamente
        await pool.query(
            'UPDATE users SET plan_limits = ?, subscription_status = ? WHERE id = ?',
            [JSON.stringify(newPlanLimits), isFreePlan ? 'free' : (status || 'active'), userId]
        );

        // 5. Sincronizar el plan_slug en los proyectos del usuario para desbloquearlos de inmediato
        await pool.query(
            'UPDATE projects SET plan_slug = ? WHERE user_id = ?',
            [planSlug, userId]
        );

        // 6. Registrar ingreso manual en historial financiero si el admin lo solicitó
        if (recordPayment && !isFreePlan && finalPrice > 0) {
            const paymentMethodLabel = `Manual - ${cleanMethod}`;
            await pool.query(
                `INSERT INTO user_payments (user_id, transaction_id, amount, currency, status, payment_method, created_at)
                 VALUES (?, ?, ?, ?, 'approved', ?, NOW())`,
                [userId, manualRef, finalPrice, plan.currency || 'USD', paymentMethodLabel]
            );
        }

        // 7. Limpieza total de caché de límites (claves como string y número)
        clearLimitsCache(userId);
        clearLimitsCache(String(userId));
        clearLimitsCache(Number(userId));

        // 8. Obtener la fila insertada para devolverla
        const [newSub] = await pool.query(`
            SELECT 
                us.id, 
                us.user_id as userId, 
                us.plan_slug as planSlug, 
                COALESCE(us.plan_name, p.name) as planName,
                us.periodicity,
                us.price,
                us.plan_days as planDays,
                us.start_date as startDate,
                us.renewal_date as renewalDate,
                us.expires_at as expiresAt,
                us.status, 
                us.hotmart_purchase_id as hotmartPurchaseId,
                us.tracking_parameters as trackingParameters,
                us.created_at as createdAt, 
                COALESCE(us.renewal_date, us.expires_at) as nextBillingAt, 
                p.id as planId
            FROM user_subscriptions us
            LEFT JOIN plans p ON us.plan_slug = p.slug
            WHERE us.id = ?
        `, [result.insertId]);

        // Logging
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'ADMIN_ASSIGN_PLAN', 'subscription', result.insertId, {
            userId,
            planSlug,
            periodicity: finalPeriodicity,
            price: finalPrice,
            startDate: formatMysqlDateTime(startObj),
            expiresAt: formatMysqlDateTime(expiresObj),
            paymentMethod: cleanMethod,
            recordPayment: Boolean(recordPayment)
        });

        res.json(newSub[0]);
    } catch (e) {
        console.error("Error in adminCreateSubscription:", e);
        res.status(500).json({ error: e.message });
    }
});

router.put('/subscriptions/:id', async (req, res) => {
    const { id } = req.params;
    const { status, periodicity, price, startDate, expiresAt, paymentMethod } = req.body;
    try {
        const [subs] = await pool.query('SELECT * FROM user_subscriptions WHERE id = ?', [id]);
        if (subs.length === 0) return res.status(404).json({ error: 'Suscripción no encontrada' });

        const currentSub = subs[0];
        const userId = currentSub.user_id;
        const planSlug = currentSub.plan_slug;
        const finalStatus = status || currentSub.status || 'active';

        // Resolver datos actualizados de periodicidad, precio y fechas
        const isFreePlan = ['starter', 'free'].includes(String(planSlug || '').toLowerCase());
        const resolvedPeriodicity = periodicity !== undefined
            ? periodicity
            : (currentSub.periodicity || (String(planSlug).toLowerCase().includes('anual') ? 'Anual' : 'Mensual'));
        const isAnnual = !isFreePlan && String(resolvedPeriodicity || '').toLowerCase() === 'anual';

        const startObj = startDate !== undefined
            ? (parseDateInput(startDate, false) || new Date(currentSub.start_date || currentSub.created_at))
            : (currentSub.start_date ? new Date(currentSub.start_date) : new Date(currentSub.created_at));

        let expiresObj = expiresAt !== undefined
            ? parseDateInput(expiresAt, true)
            : (currentSub.expires_at ? new Date(currentSub.expires_at) : (currentSub.renewal_date ? new Date(currentSub.renewal_date) : null));

        if (!isFreePlan && !expiresObj && periodicity !== undefined) {
            expiresObj = new Date(startObj.getTime() + (isAnnual ? 365 : 30) * 86400000);
        }

        if (!isFreePlan && expiresObj && expiresObj <= startObj) {
            return res.status(400).json({ error: 'La fecha de vencimiento debe ser posterior a la fecha de inicio.' });
        }

        const planDays = (!isFreePlan && expiresObj)
            ? Math.max(1, Math.round((expiresObj.getTime() - startObj.getTime()) / 86400000))
            : (currentSub.plan_days || (isAnnual ? 365 : 30));

        const resolvedPrice = (price !== undefined && price !== null && price !== '' && !isNaN(Number(price)))
            ? Number(price)
            : (currentSub.price !== null && currentSub.price !== undefined ? Number(currentSub.price) : 0);

        let existingTracking = {};
        if (currentSub.tracking_parameters) {
            try {
                existingTracking = typeof currentSub.tracking_parameters === 'string'
                    ? JSON.parse(currentSub.tracking_parameters)
                    : currentSub.tracking_parameters;
            } catch {}
        }
        if (paymentMethod) {
            existingTracking = { ...existingTracking, paymentMethod: String(paymentMethod).trim() };
        }

        // Buscar definición del plan para regenerar nombre y límites
        const [plans] = await pool.query('SELECT id, slug, name, limits_config FROM plans WHERE slug = ?', [planSlug]);
        const plan = plans[0] || { slug: planSlug, name: planSlug, limits_config: DEFAULT_LIMITS };

        const { newPlanLimits, displayName } = buildManualPlanLimits(plan, {
            periodicity: resolvedPeriodicity,
            price: resolvedPrice,
            planDays,
            startDate: startObj,
            expiresAt: expiresObj,
            status: finalStatus
        });

        await pool.query(
            `UPDATE user_subscriptions 
             SET status = ?, 
                 plan_name = ?, 
                 periodicity = ?, 
                 price = ?, 
                 plan_days = ?, 
                 start_date = ?, 
                 renewal_date = ?, 
                 expires_at = ?, 
                 tracking_parameters = ?
             WHERE id = ?`,
            [
                finalStatus,
                displayName,
                isFreePlan ? null : resolvedPeriodicity,
                resolvedPrice,
                isFreePlan ? null : planDays,
                formatMysqlDateTime(startObj),
                formatMysqlDateTime(expiresObj),
                formatMysqlDateTime(expiresObj),
                JSON.stringify(existingTracking),
                id
            ]
        );

        // Coordinar y sincronizar con la tabla de users y projects
        if (finalStatus === 'active') {
            await pool.query(
                'UPDATE users SET plan_limits = ?, subscription_status = ? WHERE id = ?',
                [JSON.stringify(newPlanLimits), isFreePlan ? 'free' : 'active', userId]
            );
            await pool.query(
                'UPDATE projects SET plan_slug = ? WHERE user_id = ?',
                [planSlug, userId]
            );
        } else if (finalStatus === 'inactive' || finalStatus === 'canceled') {
            // Al desactivar, restauramos los límites al plan starter oficial de la DB
            const [starterPlans] = await pool.query("SELECT limits_config FROM plans WHERE slug = 'starter' LIMIT 1");
            const starterLimits = starterPlans.length > 0
                ? (typeof starterPlans[0].limits_config === 'string' ? JSON.parse(starterPlans[0].limits_config) : starterPlans[0].limits_config)
                : DEFAULT_LIMITS;
            await pool.query(
                "UPDATE users SET plan_limits = ?, subscription_status = 'canceled' WHERE id = ?",
                [JSON.stringify({ ...starterLimits, planName: 'starter', planSlug: 'starter' }), userId]
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

        res.json({ success: true });
    } catch (e) {
        console.error("Error in PUT /subscriptions/:id:", e);
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
        clearLimitsCache();
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
        clearLimitsCache();
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

// ======================================================
//  NUEVO: PANEL DE SUSCRIPCIONES Y TRANSACCIONES
// ======================================================
router.get('/all-payments', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                up.*, 
                u.name as userName, 
                u.email as userEmail 
            FROM user_payments up 
            LEFT JOIN users u ON up.user_id = u.id 
            ORDER BY up.created_at DESC
        `);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/all-subscriptions', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                us.id, 
                us.user_id as userId, 
                us.plan_slug as planSlug, 
                us.plan_name as planName,
                us.periodicity,
                us.price,
                us.plan_days as planDays,
                us.start_date as startDate,
                us.renewal_date as renewalDate,
                us.expires_at as expiresAt,
                us.status, 
                us.hotmart_purchase_id as hotmartPurchaseId, 
                us.tracking_parameters as trackingParameters,
                us.created_at as createdAt, 
                u.name as userName, 
                u.email as userEmail 
            FROM user_subscriptions us 
            LEFT JOIN users u ON us.user_id = u.id 
            ORDER BY us.created_at DESC
        `);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

////////// Actualización: Endpoints para la integración global de Systeme.io, Píxeles de seguimiento y sincronización //////////
router.get('/systemeio/global-settings', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('global_systemeio_key', 'global_systemeio_default_tag_id', 'global_systemeio_enabled', 'google_analytics_id', 'facebook_pixel_id')"
        );
        const settingsMap = {};
        rows.forEach(r => settingsMap[r.setting_key] = r.setting_value);

        const globalKey = settingsMap.global_systemeio_key || '';
        const defaultTagId = settingsMap.global_systemeio_default_tag_id || '';
        const enabled = settingsMap.global_systemeio_enabled === 'true';
        const googleAnalyticsId = settingsMap.google_analytics_id || '';
        const facebookPixelId = settingsMap.facebook_pixel_id || '';

        let tags = [];
        if (globalKey) {
            try {
                tags = await systemeIoService.getTags(globalKey);
            } catch (tagErr) {
                console.warn('[Global Systeme.io Tags Warn]:', tagErr.message);
            }
        }

        res.json({ globalKey, defaultTagId, enabled, tags, googleAnalyticsId, facebookPixelId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/systemeio/global-settings', async (req, res) => {
    const { globalKey, defaultTagId, enabled, googleAnalyticsId, facebookPixelId } = req.body;
    try {
        const updates = [
            ['global_systemeio_key', globalKey || ''],
            ['global_systemeio_default_tag_id', defaultTagId ? String(defaultTagId) : ''],
            ['global_systemeio_enabled', enabled ? 'true' : 'false'],
            ['google_analytics_id', googleAnalyticsId || ''],
            ['facebook_pixel_id', facebookPixelId || '']
        ];

        for (const [key, val] of updates) {
            await pool.query(
                `INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?`,
                [key, val, val]
            );
        }

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/systemeio/sync-users', async (req, res) => {
    const { userIds } = req.body || {};
    try {
        const [rows] = await pool.query(
            "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('global_systemeio_key', 'global_systemeio_default_tag_id', 'global_systemeio_enabled')"
        );
        const settingsMap = {};
        rows.forEach(r => settingsMap[r.setting_key] = r.setting_value);

        const globalKey = settingsMap.global_systemeio_key;
        const defaultTagId = settingsMap.global_systemeio_default_tag_id;

        if (!globalKey || !defaultTagId) {
            return res.status(400).json({ error: 'Debes configurar primero la API Key Global y la Etiqueta Predeterminada de Systeme.io.' });
        }

        let targetUsers = [];
        if (Array.isArray(userIds) && userIds.length > 0) {
            const placeholders = userIds.map(() => '?').join(',');
            const [users] = await pool.query(`SELECT id, name, email FROM users WHERE id IN (${placeholders})`, userIds);
            targetUsers = users;
        } else {
            const [users] = await pool.query("SELECT id, name, email FROM users WHERE (systemio_registrado = 0 OR systemio_registrado IS NULL)");
            targetUsers = users;
        }

        if (targetUsers.length === 0) {
            return res.json({ success: true, count: 0, message: 'No hay usuarios pendientes por sincronizar.' });
        }

        let successCount = 0;
        for (const user of targetUsers) {
            try {
                const contactRes = await systemeIoService.addContact(globalKey, user.email, user.name || 'Usuario');
                const contactId = contactRes?.contact?.id || contactRes?.contact?.contact?.id || contactRes?.id;
                
                if (contactId) {
                    await systemeIoService.addTagToContact(globalKey, contactId, defaultTagId);
                    await pool.query('UPDATE users SET systemio_registrado = 1 WHERE id = ?', [user.id]);
                    successCount++;
                }
            } catch (userErr) {
                console.error(`[Admin Systeme.io User Sync Error] User ID ${user.id}:`, userErr.message);
            }
        }

        res.json({ success: true, count: successCount, message: `Se han sincronizado ${successCount} de ${targetUsers.length} usuarios exitosamente en Systeme.io.` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/systemeio/sync-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('global_systemeio_key', 'global_systemeio_default_tag_id', 'global_systemeio_enabled')"
        );
        const settingsMap = {};
        rows.forEach(r => settingsMap[r.setting_key] = r.setting_value);

        const globalKey = settingsMap.global_systemeio_key;
        const defaultTagId = settingsMap.global_systemeio_default_tag_id;

        if (!globalKey || !defaultTagId) {
            return res.status(400).json({ error: 'Configura la API Key y la Etiqueta Predeterminada de Systeme.io en Configuración Global.' });
        }

        const [users] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [id]);
        if (users.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
        const user = users[0];

        const contactRes = await systemeIoService.addContact(globalKey, user.email, user.name || 'Usuario');
        const contactId = contactRes?.contact?.id || contactRes?.contact?.contact?.id || contactRes?.id;

        if (contactId) {
            await systemeIoService.addTagToContact(globalKey, contactId, defaultTagId);
            await pool.query('UPDATE users SET systemio_registrado = 1 WHERE id = ?', [user.id]);
            return res.json({ success: true, message: `Usuario ${user.email} sincronizado y etiquetado correctamente en Systeme.io.` });
        } else {
            return res.status(500).json({ error: 'No se pudo obtener el ID del contacto en Systeme.io.' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - Systeme.io Global //////////

export default router;
