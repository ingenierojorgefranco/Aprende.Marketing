
import pool from './db.js';
import bcrypt from 'bcryptjs';
import { resolvePlanTracking } from './planTrackingHelper.js';
import { clearLimitsCache } from './routes/authRoutes.js';

/**
 * Maneja el Webhook de Hotmart (Postback)
 * Formato esperado: POST con JSON de Hotmart
 */
export const handleWebhook = async (payload, query = {}) => {
    console.log(`[Hotmart Webhook] Recibida notificación: ${payload.event || 'desconocida'}`);

    // Campos clave de Hotmart
    const event = payload.event; // "PURCHASE_APPROVED", "SUBSCRIPTION_RENEWAL", etc.
    const data = payload.data || {};
    
    // Status de compra en Hotmart: approved, canceled, billet_printed, etc.
    const status = data.purchase?.status?.toLowerCase();
    const productId = data.product?.id?.toString();
    const userEmail = data.buyer?.email || data.subscriber?.email;
    const offerCode = data.purchase?.offer?.code;
    
    // Datos adicionales para el historial (Enfoque Híbrido)
    const buyerPhone = data.buyer?.checkout_phone;
    const buyerCountry = data.buyer?.address?.country_iso;
    const transactionId = data.purchase?.transaction;
    const amount = data.purchase?.price?.value;
    const currency = data.purchase?.price?.currency_value || 'USD';
    const paymentType = data.purchase?.payment?.type;
    const subscriberCode = data.subscription?.subscriber?.code || data.subscriber?.code;
    const nextChargeDate = data.purchase?.date_next_charge || data.date_next_charge;
    const buyerData = data.buyer || {};

    // 1. Extraer y procesar claves de seguimiento (Mensual vs Anual y cálculo de fechas)
    const trackingInfo = resolvePlanTracking(payload, query, data.purchase?.order_date || data.purchase?.approved_date);
    console.log(`[Hotmart Webhook] Plan Detectado: ${trackingInfo.planNombre} | Periodicidad: ${trackingInfo.periodicity} | Días: ${trackingInfo.planDays} | Precio: ${trackingInfo.planPrice} | Inicio: ${trackingInfo.startDateFormatted} | Renovación: ${trackingInfo.renewalDateFormatted}`);
    
    ////////// Lógica reforzada para detección de userId - 25/05/2025 11:30 //////////
    // Intentamos obtener el ID del usuario desde el parámetro 'src' que enviamos en el link
    // El formato esperado ahora es "userId-projectId" o simplemente "userId"
    // Hotmart puede enviarlo en purchase.src o purchase.origin.src
    let rawSrc = data.purchase?.src || data.purchase?.origin?.src || data.affiliate?.src || null;
    let userId = null;
    let projectId = null;

    if (rawSrc) {
        console.log(`[Hotmart Webhook] SRC detectado: ${rawSrc}`);
        if (String(rawSrc).includes('-')) {
            const parts = String(rawSrc).split('-');
            userId = parts[0];
            projectId = parts[1];
        } else {
            userId = rawSrc;
        }
    }

    if (!userId && userEmail) {
        // Fallback 1: Buscar usuario por email si no viene el SRC o es inválido
        console.log(`[Hotmart Webhook] SRC no encontrado o inválido, intentando fallback por email: ${userEmail}`);
        const [uRows] = await pool.query("SELECT id FROM users WHERE email = ?", [userEmail]);
        if (uRows.length > 0) {
            userId = uRows[0].id;
            console.log(`[Hotmart Webhook] Usuario encontrado por email: ${userId}`);
        } else if (status === 'approved' || status === 'complete' || event === 'PURCHASE_APPROVED') {
            // Auto-crear usuario nuevo que compró directamente en Hotmart para no perder la suscripción
            const buyerName = data.buyer?.name || userEmail.split('@')[0];
            const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
            const passwordHash = await bcrypt.hash(tempPassword, 10);
            const [newUserRes] = await pool.query(
                "INSERT INTO users (name, email, password_hash, role, is_active, plan_limits) VALUES (?, ?, ?, 'user', 1, ?)",
                [buyerName, userEmail, passwordHash, JSON.stringify({ planName: 'starter' })]
            );
            userId = newUserRes.insertId;
            console.log(`[Hotmart Webhook] Nuevo usuario creado para ${userEmail} con ID: ${userId}`);
        }
    }

    console.log(`[Hotmart Webhook] Resultado identificación: UserID=${userId || 'No encontrado'}, ProjectID=${projectId || 'N/A'}`);
    ////////// Fin de actualización - 25/05/2025 11:30 //////////

    if (!userId) {
        console.warn("[Hotmart Webhook] No se pudo identificar al usuario (ni por SRC ni por Email).");
        return;
    }

    // --- Lógica para CANCELACIÓN de suscripción (Evento específico de Hotmart) ---
    if (event === 'SUBSCRIPTION_CANCELLATION') {
        console.log(`[Hotmart Webhook] Procesando CANCELACIÓN PROGRAMADA para User ${userId} (Producto ${productId})`);
        
        // 1. Identificar el plan por el ID de producto (mensual o anual)
        const [planRows] = await pool.query("SELECT slug FROM plans WHERE hotmart_id = ? OR hotmart_id_annual = ? LIMIT 1", [productId, productId]);
        const planSlug = planRows.length > 0 ? planRows[0].slug : null;

        if (planSlug) {
            // Convertir timestamp de Hotmart a formato MySQL DATETIME
            let expiresAt = null;
            if (nextChargeDate) {
                expiresAt = new Date(nextChargeDate).toISOString().slice(0, 19).replace('T', ' ');
            }

            // 2. Marcar la suscripción como 'pending_cancellation' y guardar fecha de expiración
            // Intentamos primero por subscriber_code (precisión total)
            let updateResult;
            if (subscriberCode) {
                console.log(`[Hotmart Webhook] Intentando cancelar por subscriber_code: ${subscriberCode}`);
                [updateResult] = await pool.query(
                    `UPDATE user_subscriptions 
                     SET status = 'pending_cancellation', expires_at = ?, updated_at = NOW() 
                     WHERE user_id = ? AND subscriber_code = ? AND status = 'active' 
                     LIMIT 1`,
                    [expiresAt, userId, subscriberCode]
                );
            }

            // Si no se actualizó nada (o no había code), intentamos por plan_slug (compatibilidad con suscripciones viejas)
            if (!updateResult || updateResult.affectedRows === 0) {
                console.log(`[Hotmart Webhook] No se encontró suscripción por subscriber_code, intentando por plan_slug: ${planSlug}`);
                await pool.query(
                    `UPDATE user_subscriptions 
                     SET status = 'pending_cancellation', expires_at = ?, updated_at = NOW() 
                     WHERE user_id = ? AND plan_slug = ? AND status = 'active' 
                     LIMIT 1`,
                    [expiresAt, userId, planSlug]
                );
            }

            console.log(`[Hotmart Webhook] Suscripción procesada para cancelación programada. Expira el: ${expiresAt}`);
            
            // Log de actividad del sistema
            try {
                const [userRows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
                const userName = userRows[0]?.name || 'Usuario Hotmart';
                await pool.query(
                    `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details, created_at) 
                     VALUES (?, ?, 'SUBSCRIPTION_PENDING_CANCEL_HOTMART', 'plan', ?, ?, NOW())`,
                    [userId, userName, planSlug, JSON.stringify({ hotmart_product_id: productId, expires_at: expiresAt })]
                );
            } catch (e) {
                console.error("Error logging cancellation activity:", e.message);
            }
        }
        return; 
    }

    // Lógica de activación si la compra es aprobada o renovación exitosa
    if (status === 'approved' || status === 'complete' || event === 'PURCHASE_APPROVED') {
        console.log(`[Hotmart Webhook] Activando plan para User ${userId} (Producto ${productId || 'N/A'}, Oferta ${offerCode || 'N/A'}, Slug ${trackingInfo.planSlug})`);

        // 1. Buscar el plan que coincide con Hotmart ID, Oferta o Slug de seguimiento
        let [planRows] = await pool.query(
            `SELECT id, limits_config, slug FROM plans 
             WHERE (hotmart_id = ? OR hotmart_id_annual = ?) 
             AND (
                 hotmart_offer = ? OR hotmart_offer_annual = ? 
                 OR (hotmart_offer IS NULL AND hotmart_offer_annual IS NULL)
                 OR (hotmart_offer = '' AND (hotmart_offer_annual IS NULL OR hotmart_offer_annual = ''))
                 OR ? IS NULL OR ? = ''
             )
             ORDER BY (hotmart_offer = ? OR hotmart_offer_annual = ?) DESC LIMIT 1`, 
            [productId, productId, offerCode, offerCode, offerCode, offerCode, offerCode, offerCode]
        );
        
        // Si no se encontró por ID de producto / oferta, buscar por el slug de seguimiento (pro_mensual, pro_anual o pro)
        if (planRows.length === 0) {
            console.log(`[Hotmart Webhook] Buscando plan por Slug de seguimiento: ${trackingInfo.planSlug}`);
            [planRows] = await pool.query(
                `SELECT id, limits_config, slug FROM plans WHERE slug = ? OR slug = 'pro' ORDER BY (slug = ?) DESC LIMIT 1`,
                [trackingInfo.planSlug, trackingInfo.planSlug]
            );
        }

        console.log(`[Hotmart Webhook] Planes encontrados en DB: ${planRows.length}`);
        
        if (planRows.length === 0) {
            console.error(`[Hotmart Error] No hay ningún plan configurado en la base de datos.`);
            return;
        }

        const plan = planRows[0];
        const assignedSlug = trackingInfo.planSlug || plan.slug;
        console.log(`[Hotmart Webhook] Plan seleccionado: ${assignedSlug} (ID: ${plan.id})`);
        
        const baseLimits = typeof plan.limits_config === 'string' 
            ? JSON.parse(plan.limits_config) 
            : (plan.limits_config || {});

        const limitsConfig = {
            ...baseLimits,
            planName: 'pro',
            planSlug: assignedSlug,
            planDisplayName: trackingInfo.planNombre,
            periodicity: trackingInfo.periodicity,
            price: trackingInfo.planPrice,
            planDays: trackingInfo.planDays,
            startDate: trackingInfo.startDate.toISOString(),
            renewalDate: trackingInfo.renewalDate.toISOString(),
            subscriptionDetails: {
                planName: trackingInfo.planNombre,
                planSlug: assignedSlug,
                periodicity: trackingInfo.periodicity,
                price: trackingInfo.planPrice,
                planDays: trackingInfo.planDays,
                startDate: trackingInfo.startDate.toISOString(),
                renewalDate: trackingInfo.renewalDate.toISOString(),
                status: 'active'
            }
        };

        // 2. Gestionar el "Inventario de Suscripciones" (Reactivación Fair Play)
        // Buscamos si ya tiene una suscripción que esté activa o pendiente de cancelar
        const [existingSub] = await pool.query(
            "SELECT id FROM user_subscriptions WHERE user_id = ? AND (plan_slug IN (?, 'pro', 'pro_mensual', 'pro_anual') OR status IN ('active', 'pending_cancellation')) LIMIT 1",
            [userId, assignedSlug]
        );

        const currentTransaction = data.purchase?.transaction || transactionId || `HP${Date.now()}`;

        if (existingSub.length > 0) {
            // Reactivamos y actualizamos la suscripción existente con los datos exactos del plan (Mensual o Anual)
            console.log(`[Hotmart Webhook] Reactivando/Actualizando suscripción existente ${existingSub[0].id} para ${assignedSlug}`);
            await pool.query(
                `UPDATE user_subscriptions 
                 SET status = 'active', 
                     plan_slug = ?, 
                     plan_name = ?, 
                     periodicity = ?, 
                     price = ?, 
                     plan_days = ?, 
                     start_date = ?, 
                     renewal_date = ?, 
                     expires_at = ?, 
                     hotmart_purchase_id = ?, 
                     subscriber_code = ?, 
                     offer_code = ?, 
                     tracking_parameters = ?, 
                     updated_at = NOW() 
                 WHERE id = ?`,
                [
                    assignedSlug,
                    trackingInfo.planNombre,
                    trackingInfo.periodicity,
                    trackingInfo.planPrice,
                    trackingInfo.planDays,
                    trackingInfo.startDateFormatted,
                    trackingInfo.renewalDateFormatted,
                    trackingInfo.renewalDateFormatted,
                    currentTransaction,
                    subscriberCode || null,
                    offerCode || null,
                    JSON.stringify(trackingInfo.trackingParameters),
                    existingSub[0].id
                ]
            );
        } else {
            // Insertar una nueva suscripción con todos los parámetros
            console.log(`[Hotmart Webhook] Creando nueva suscripción para ${assignedSlug}`);
            await pool.query(
                `INSERT INTO user_subscriptions 
                    (user_id, plan_slug, plan_name, periodicity, price, plan_days, start_date, renewal_date, expires_at, status, hotmart_purchase_id, subscriber_code, offer_code, tracking_parameters, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, NOW())`,
                [
                    userId,
                    assignedSlug,
                    trackingInfo.planNombre,
                    trackingInfo.periodicity,
                    trackingInfo.planPrice,
                    trackingInfo.planDays,
                    trackingInfo.startDateFormatted,
                    trackingInfo.renewalDateFormatted,
                    trackingInfo.renewalDateFormatted,
                    currentTransaction,
                    subscriberCode || null,
                    offerCode || null,
                    JSON.stringify(trackingInfo.trackingParameters)
                ]
            );
        }

        // 3. Actualizar usuario (Lógica Global + CRM Data + Fechas de Suscripción)
        await pool.query(
            `UPDATE users SET 
                subscription_status = 'active',
                plan_limits = ?,
                phone = COALESCE(?, phone),
                country = COALESCE(?, country),
                hotmart_metadata = ?
             WHERE id = ?`,
            [
                JSON.stringify(limitsConfig),
                buyerPhone || null,
                buyerCountry || null,
                JSON.stringify({ ...buyerData, tracking: trackingInfo.trackingParameters }),
                userId
            ]
        );

        // Limpiar caché de límites para reflejo inmediato
        clearLimitsCache(userId);

        // 4. Registrar el pago en el historial financiero
        const finalAmount = amount || trackingInfo.planPrice;
        await pool.query(
            `INSERT INTO user_payments (user_id, transaction_id, amount, currency, status, payment_method) 
             VALUES (?, ?, ?, ?, 'approved', ?)
             ON DUPLICATE KEY UPDATE status = 'approved', amount = VALUES(amount), currency = VALUES(currency)`,
            [userId, currentTransaction, finalAmount, currency, paymentType || 'hotmart']
        );

        // 5. Registrar en hotmart_orders_log para conciliar información
        try {
            await pool.query(
                `INSERT INTO hotmart_orders_log 
                 (transaction_id, buyer_name, buyer_email, approval_code, approval_status, affiliate_code, plan_slug, plan_nombre, plan_periodicidad, plan_precio, plan_dias, start_date, renewal_date, amount, currency, tracking_parameters, raw_query_json) 
                 VALUES (?, ?, ?, '1', 'approved', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE 
                     plan_slug = VALUES(plan_slug),
                     plan_nombre = VALUES(plan_nombre),
                     plan_periodicidad = VALUES(plan_periodicidad),
                     plan_precio = VALUES(plan_precio),
                     plan_dias = VALUES(plan_dias),
                     start_date = VALUES(start_date),
                     renewal_date = VALUES(renewal_date),
                     amount = VALUES(amount),
                     currency = VALUES(currency),
                     tracking_parameters = VALUES(tracking_parameters),
                     updated_at = NOW()`,
                [
                    currentTransaction,
                    data.buyer?.name || userEmail.split('@')[0],
                    userEmail,
                    data.affiliate?.code || null,
                    assignedSlug,
                    trackingInfo.planNombre,
                    trackingInfo.periodicity,
                    trackingInfo.planPrice,
                    trackingInfo.planDays,
                    trackingInfo.startDateFormatted,
                    trackingInfo.renewalDateFormatted,
                    finalAmount,
                    currency,
                    JSON.stringify(trackingInfo.trackingParameters),
                    JSON.stringify(payload)
                ]
            );
        } catch (logErr) {
            console.warn("[Hotmart Orders Log Error]:", logErr.message);
        }

        // 6. Actualizar Proyecto Específico si se proporcionó projectId
        if (projectId) {
            console.log(`[Hotmart Webhook] Actualizando Proyecto ${projectId} con Plan ${assignedSlug}`);
            await pool.query(
                `UPDATE projects SET plan_id = ?, plan_slug = ? WHERE id = ? AND user_id = ?`,
                [plan.id, assignedSlug, projectId, userId]
            );
        }

        // 7. Log System Activity
        try {
            const [userRows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
            const userName = userRows[0]?.name || 'Usuario Hotmart';
            
            await pool.query(
                `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details, created_at) 
                 VALUES (?, ?, 'PURCHASE_PLAN_HOTMART', 'plan', ?, ?, NOW())`,
                [
                    userId, 
                    userName, 
                    assignedSlug, 
                    JSON.stringify({ 
                        hotmart_product_id: productId, 
                        status: status, 
                        plan_nombre: trackingInfo.planNombre,
                        periodicity: trackingInfo.periodicity,
                        price: trackingInfo.planPrice,
                        plan_days: trackingInfo.planDays,
                        start_date: trackingInfo.startDateFormatted,
                        renewal_date: trackingInfo.renewalDateFormatted
                    })
                ]
            );
        } catch (e) {
            console.error("Error logging hotmart activity:", e.message);
        }
    } 
    else if (status === 'refunded' || status === 'canceled' || status === 'expired') {
        // Lógica de degradación si el usuario pide reembolso o cancela
        console.log(`[Hotmart Webhook] Degradando plan para User ${userId} por status: ${status}`);
        
        const [starterPlan] = await pool.query("SELECT limits_config FROM plans WHERE slug = 'starter'");
        if (starterPlan.length > 0) {
            const limits = typeof starterPlan[0].limits_config === 'string'
                ? JSON.parse(starterPlan[0].limits_config)
                : starterPlan[0].limits_config;

            await pool.query(
                `UPDATE users SET subscription_status = 'canceled', plan_limits = ? WHERE id = ?`,
                [JSON.stringify(limits), userId]
            );
        }
    }
};
