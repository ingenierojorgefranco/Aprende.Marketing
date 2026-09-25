
import pool from './db.js';
import bcrypt from 'bcryptjs';

/**
 * Maneja el Webhook de Hotmart (Postback)
 * Formato esperado: POST con JSON de Hotmart
 */
export const handleWebhook = async (payload) => {
    console.log(`[Hotmart Webhook] Recibida notificación: ${payload.event || 'desconocida'}`);

    // Campos clave de Hotmart
    const event = payload.event; // "PURCHASE_APPROVED", "SUBSCRIPTION_RENEWAL", etc.
    const data = payload.data || {};
    
    // Status de compra en Hotmart: approved, canceled, billet_printed, etc.
    const status = data.purchase?.status?.toLowerCase();
    const productId = data.product?.id?.toString();
    const userEmail = data.buyer?.email || data.subscriber?.email;
    const offerCode = data.purchase?.offer?.code;
    
    // Extracción de parámetros clave de tracking y planes (Imagen 1 y Imagen 2: Plan Mensual y Plan Anual)
    const rawPlanNombre = payload.Plan_nombre || data.Plan_nombre || data.purchase?.plan_nombre || payload.plan_nombre || '';
    const rawPlanPeriodicidad = (payload.Plan_Periodicidad || data.Plan_Periodicidad || payload.plan_periodicidad || '').toLowerCase();
    const rawPlanPrecio = payload.Plan_Precio || data.Plan_Precio || payload.plan_precio || data.purchase?.price?.value;
    const rawPlanDias = payload.Plan_Dias || data.Plan_Dias || payload.plan_dias;
    
    // Determinar si es anual
    const isAnnual = rawPlanPeriodicidad === 'anual' || 
                     rawPlanPeriodicidad === 'annual' || 
                     (rawPlanDias && parseInt(rawPlanDias) > 100) ||
                     (rawPlanPrecio && parseFloat(rawPlanPrecio) > 200) ||
                     (rawPlanNombre && rawPlanNombre.toLowerCase().includes('anual'));

    const periodicity = isAnnual ? 'anual' : 'mensual';
    const planName = rawPlanNombre || (isAnnual ? 'Pro_Ilimitado Anual' : 'Pro_Ilimitado Mensual');
    const durationDays = rawPlanDias ? parseInt(rawPlanDias, 10) : (isAnnual ? 365 : 30);
    const planPrice = rawPlanPrecio ? parseFloat(rawPlanPrecio) : (isAnnual ? 708.00 : 79.00);

    // Fechas de inicio y renovación calculadas
    const startDate = new Date();
    const renewalDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Datos adicionales para el historial (Enfoque Híbrido)
    const buyerPhone = data.buyer?.checkout_phone || data.buyer?.phone;
    const buyerCountry = data.buyer?.address?.country_iso;
    const transactionId = data.purchase?.transaction;
    const amount = rawPlanPrecio ? parseFloat(rawPlanPrecio) : data.purchase?.price?.value;
    const currency = data.purchase?.price?.currency_value || 'USD';
    const paymentType = data.purchase?.payment?.type;
    const subscriberCode = data.subscription?.subscriber?.code || data.subscriber?.code;
    const nextChargeDate = data.purchase?.date_next_charge || data.date_next_charge;
    const buyerData = data.buyer || {};
    
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
        console.log(`[Hotmart Webhook] Activando plan para User ${userId} (Producto ${productId}, Oferta ${offerCode || 'N/A'})`);

        // 1. Buscar el plan que coincide con este Hotmart ID y Oferta (tanto mensual como anual)
        // Priorizamos la coincidencia exacta de la oferta si existe
        const [planRows] = await pool.query(
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
        
        console.log(`[Hotmart Webhook] Planes encontrados en DB para Producto ${productId}: ${planRows.length}`);
        
        if (planRows.length === 0) {
            console.error(`[Hotmart Error] No hay ningún plan configurado con el Hotmart ID: ${productId} y Oferta: ${offerCode}`);
            return;
        }

        const plan = planRows[0];
        console.log(`[Hotmart Webhook] Plan seleccionado: ${plan.slug} (ID: ${plan.id})`);
        const limitsConfig = typeof plan.limits_config === 'string' 
            ? JSON.parse(plan.limits_config) 
            : plan.limits_config;

        // 2. Gestionar el "Inventario de Suscripciones" (Reactivación Fair Play)
        // Buscamos si ya tiene una suscripción para este plan que esté activa o pendiente de cancelar
        const [existingSub] = await pool.query(
            "SELECT id FROM user_subscriptions WHERE user_id = ? AND plan_slug = ? AND status IN ('active', 'pending_cancellation') LIMIT 1",
            [userId, plan.slug]
        );

        if (existingSub.length > 0) {
            // Reactivamos la suscripción existente con las fechas calculadas
            console.log(`[Hotmart Webhook] Reactivando suscripción existente ${existingSub[0].id} para el plan ${plan.slug} (${periodicity})`);
            await pool.query(
                `UPDATE user_subscriptions 
                 SET status = 'active', 
                     plan_name = ?,
                     periodicity = ?,
                     price = ?,
                     duration_days = ?,
                     starts_at = ?,
                     expires_at = ?, 
                     hotmart_purchase_id = ?, 
                     subscriber_code = ?, 
                     offer_code = ?, 
                     updated_at = NOW() 
                 WHERE id = ?`,
                [planName, periodicity, planPrice, durationDays, startDate, renewalDate, data.purchase?.transaction || null, subscriberCode, offerCode, existingSub[0].id]
            );
        } else {
            // Insertar una nueva suscripción con fechas calculadas de inicio y renovación
            console.log(`[Hotmart Webhook] Creando nueva suscripción para el plan ${plan.slug} (${periodicity}, vence: ${renewalDate})`);
            await pool.query(
                `INSERT INTO user_subscriptions (user_id, plan_slug, plan_name, periodicity, price, duration_days, starts_at, expires_at, status, hotmart_purchase_id, subscriber_code, offer_code) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
                [userId, plan.slug, planName, periodicity, planPrice, durationDays, startDate, renewalDate, data.purchase?.transaction || null, subscriberCode, offerCode]
            );
        }

        // 3. Actualizar usuario (Lógica Global + CRM Data)
        await pool.query(
            `UPDATE users SET 
                subscription_status = 'active',
                plan_limits = ?,
                phone = COALESCE(?, phone),
                country = COALESCE(?, country),
                hotmart_metadata = ?
             WHERE id = ?`,
            [JSON.stringify(limitsConfig), buyerPhone, buyerCountry, JSON.stringify(buyerData), userId]
        );

        // 4. Registrar el pago en el historial financiero
        if (transactionId) {
            await pool.query(
                `INSERT INTO user_payments (user_id, transaction_id, amount, currency, status, payment_method, affiliate_code, buyer_name, approval_code) 
                 VALUES (?, ?, ?, ?, 'approved', ?, ?, ?, '1')`,
                [userId, transactionId, amount, currency, paymentType || 'hotmart', data.affiliate?.code || null, buyerData.name || null]
            );

            // 4.1 Registrar / Actualizar en hotmart_orders_log para total control administrativo
            try {
                const buyerFullName = buyerData.name || userEmail.split('@')[0];
                const affCode = data.affiliate?.code || data.affiliate?.affiliate_code || null;
                const itmSrc = data.purchase?.origin?.src || data.purchase?.src || data.purchase?.tracking?.source || null;
                const itmMed = data.purchase?.tracking?.medium || null;
                const itmCmp = data.purchase?.tracking?.campaign || null;

                await pool.query(
                    `INSERT INTO hotmart_orders_log 
                     (transaction_id, buyer_name, buyer_email, buyer_phone, approval_code, approval_status, affiliate_code, plan_slug, plan_name, periodicity, duration_days, amount, currency, start_date, renewal_date, user_id, itm_source, itm_medium, itm_campaign, raw_query_json) 
                     VALUES (?, ?, ?, ?, '1', 'approved', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                     ON DUPLICATE KEY UPDATE 
                         buyer_name = IF(VALUES(buyer_name) != '', VALUES(buyer_name), buyer_name),
                         buyer_email = IF(VALUES(buyer_email) != '', VALUES(buyer_email), buyer_email),
                         buyer_phone = IF(VALUES(buyer_phone) != '', VALUES(buyer_phone), buyer_phone),
                         approval_code = '1',
                         approval_status = 'approved',
                         plan_name = VALUES(plan_name),
                         periodicity = VALUES(periodicity),
                         duration_days = VALUES(duration_days),
                         amount = VALUES(amount),
                         start_date = VALUES(start_date),
                         renewal_date = VALUES(renewal_date),
                         user_id = IFNULL(VALUES(user_id), user_id),
                         raw_query_json = VALUES(raw_query_json),
                         updated_at = NOW()`,
                    [
                        transactionId,
                        buyerFullName,
                        userEmail,
                        buyerPhone || null,
                        affCode,
                        plan.slug,
                        planName,
                        periodicity,
                        durationDays,
                        amount || planPrice,
                        currency,
                        startDate,
                        renewalDate,
                        userId,
                        itmSrc,
                        itmMed,
                        itmCmp,
                        JSON.stringify(payload)
                    ]
                );
            } catch (logErr) {
                console.warn("[Hotmart Orders Log Error]", logErr.message);
            }
        }

        // 5. Actualizar Proyecto Específico si se proporcionó projectId
        if (projectId) {
            console.log(`[Hotmart Webhook] Actualizando Proyecto ${projectId} con Plan ${plan.slug}`);
            await pool.query(
                `UPDATE projects SET plan_id = ?, plan_slug = ? WHERE id = ? AND user_id = ?`,
                [plan.id, plan.slug, projectId, userId]
            );
        }

        // 4. Log System Activity
        try {
            const [userRows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
            const userName = userRows[0]?.name || 'Usuario Hotmart';
            
            await pool.query(
                `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details, created_at) 
                 VALUES (?, ?, 'PURCHASE_PLAN_HOTMART', 'plan', ?, ?, NOW())`,
                [
                    userId, 
                    userName, 
                    plan.slug, 
                    JSON.stringify({ hotmart_product_id: productId, status: status })
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
