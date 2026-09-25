
import pool from './db.js';
import bcrypt from 'bcryptjs';

/**
 * Extrae y normaliza las claves de seguimiento de Hotmart (Plan_nombre, Plan_Periodicidad, Plan_Precio, Plan_Dias, Plan_Slug)
 * tanto de la estructura del Webhook como de URLs de redirección.
 */
export const extractHotmartTrackingKeys = (payload = {}, query = {}) => {
    const data = payload?.data || {};
    const purchase = data.purchase || {};
    
    // Fuentes donde Hotmart puede enviar las claves de seguimiento
    const candidates = [
        query,
        purchase.tracking,
        data.tracking,
        purchase.tracking_key,
        purchase.tracking_parameters,
        data.custom_tracking,
        data.custom_fields,
        purchase.custom_fields,
        payload.tracking,
        data.order_tracking,
        purchase.order_bump,
        purchase,
        data,
        payload
    ].filter(Boolean);

    const findKey = (targetName) => {
        const lower = targetName.toLowerCase();
        for (const candidate of candidates) {
            if (typeof candidate !== 'object') continue;
            for (const key of Object.keys(candidate)) {
                if (key.toLowerCase() === lower && candidate[key] !== undefined && candidate[key] !== null && candidate[key] !== '') {
                    return candidate[key];
                }
            }
        }
        return undefined;
    };

    let rawName = findKey('Plan_nombre') || findKey('plan_nombre') || findKey('planName') || '';
    let rawPeriodicity = findKey('Plan_Periodicidad') || findKey('plan_periodicidad') || findKey('periodicity') || '';
    let rawPrice = findKey('Plan_Precio') || findKey('plan_precio') || findKey('price') || purchase.price?.value;
    let rawDays = findKey('Plan_Dias') || findKey('plan_dias') || findKey('days');
    let rawSlug = findKey('Plan_Slug') || findKey('plan_slug') || findKey('slug') || '';

    // Determinar periodicidad: Mensual (30 días, $79) vs Anual (365 días, $708)
    const isAnnual = 
        String(rawSlug).toLowerCase().includes('anual') || 
        String(rawSlug).toLowerCase().includes('annual') ||
        String(rawPeriodicity).toLowerCase().includes('anual') ||
        String(rawPeriodicity).toLowerCase().includes('annual') ||
        parseInt(rawDays, 10) > 60 ||
        parseFloat(rawPrice) > 200;

    const periodicity = isAnnual ? 'Anual' : 'Mensual';
    const planSlug = isAnnual ? 'pro_anual' : 'pro_mensual';
    const planName = rawName || (isAnnual ? 'Pro_Ilimitado' : 'Pro_Ilimitado');
    const planDays = rawDays ? parseInt(rawDays, 10) : (isAnnual ? 365 : 30);
    const planPrice = rawPrice ? parseFloat(rawPrice) : (isAnnual ? 708 : 79);

    // Fechas: Inicio y Renovación automática calculada
    const now = new Date();
    const purchaseDate = purchase.order_date || purchase.approved_date ? new Date(purchase.order_date || purchase.approved_date) : now;
    const startDate = !isNaN(purchaseDate.getTime()) ? purchaseDate : now;
    
    let renewalDate = null;
    if (purchase.date_next_charge || data.date_next_charge) {
        const nextCharge = new Date(purchase.date_next_charge || data.date_next_charge);
        if (!isNaN(nextCharge.getTime())) {
            renewalDate = nextCharge;
        }
    }
    if (!renewalDate) {
        renewalDate = new Date(startDate.getTime() + (planDays * 24 * 60 * 60 * 1000));
    }

    return {
        planName,
        periodicity,
        planPrice,
        planDays,
        planSlug,
        isAnnual,
        startDate,
        renewalDate,
        rawTrackingKeys: {
            Plan_nombre: planName,
            Plan_Periodicidad: periodicity,
            Plan_Precio: planPrice,
            Plan_Dias: planDays,
            Plan_Slug: planSlug
        }
    };
};

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
    
    // Extracción de claves de seguimiento enviadas por Hotmart
    const trackingInfo = extractHotmartTrackingKeys(payload);
    console.log(`[Hotmart Webhook] Parámetros extraídos: Plan=${trackingInfo.planSlug}, Periodicidad=${trackingInfo.periodicity}, Precio=${trackingInfo.planPrice}, Días=${trackingInfo.planDays}`);

    // Datos adicionales para el historial (Enfoque Híbrido)
    const buyerPhone = data.buyer?.checkout_phone;
    const buyerCountry = data.buyer?.address?.country_iso;
    const transactionId = data.purchase?.transaction;
    const amount = trackingInfo.planPrice || data.purchase?.price?.value || (trackingInfo.isAnnual ? 708 : 79);
    const currency = data.purchase?.price?.currency_value || 'USD';
    const paymentType = data.purchase?.payment?.type || 'Hotmart';
    const subscriberCode = data.subscription?.subscriber?.code || data.subscriber?.code;
    const nextChargeDate = data.purchase?.date_next_charge || data.date_next_charge || trackingInfo.renewalDate;
    const buyerData = data.buyer || {};
    const affiliateCode = data.affiliate?.affiliate_code || data.purchase?.affiliate_code || null;
    
    // Identificación de usuario por SRC o Email
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
        console.log(`[Hotmart Webhook] SRC no encontrado o inválido, intentando fallback por email: ${userEmail}`);
        const [uRows] = await pool.query("SELECT id FROM users WHERE email = ?", [userEmail]);
        if (uRows.length > 0) {
            userId = uRows[0].id;
            console.log(`[Hotmart Webhook] Usuario encontrado por email: ${userId}`);
        } else if (status === 'approved' || status === 'complete' || event === 'PURCHASE_APPROVED') {
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

    // Formatear fechas para MySQL
    const formatSqlDate = (d) => {
        if (!d) return null;
        const dateObj = new Date(d);
        if (isNaN(dateObj.getTime())) return null;
        return dateObj.toISOString().slice(0, 19).replace('T', ' ');
    };

    const sqlStartDate = formatSqlDate(trackingInfo.startDate);
    const sqlRenewalDate = formatSqlDate(trackingInfo.renewalDate);

    // Registro siempre en 'hotmart_orders_log' para control total del administrador
    if (transactionId) {
        try {
            await pool.query(
                `INSERT INTO hotmart_orders_log 
                 (transaction_id, buyer_name, buyer_email, buyer_phone, buyer_country, approval_code, approval_status, affiliate_code, plan_slug, plan_name, plan_periodicity, plan_price, plan_days, start_date, renewal_date, amount, currency, tracking_keys_json, raw_query_json) 
                 VALUES (?, ?, ?, ?, ?, '1', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE 
                     buyer_name = IF(VALUES(buyer_name) != '', VALUES(buyer_name), buyer_name),
                     buyer_email = IF(VALUES(buyer_email) != '', VALUES(buyer_email), buyer_email),
                     buyer_phone = IF(VALUES(buyer_phone) != '', VALUES(buyer_phone), buyer_phone),
                     buyer_country = IF(VALUES(buyer_country) != '', VALUES(buyer_country), buyer_country),
                     approval_status = VALUES(approval_status),
                     plan_slug = VALUES(plan_slug),
                     plan_name = VALUES(plan_name),
                     plan_periodicity = VALUES(plan_periodicity),
                     plan_price = VALUES(plan_price),
                     plan_days = VALUES(plan_days),
                     start_date = VALUES(start_date),
                     renewal_date = VALUES(renewal_date),
                     amount = VALUES(amount),
                     tracking_keys_json = VALUES(tracking_keys_json),
                     raw_query_json = VALUES(raw_query_json),
                     updated_at = NOW()`,
                [
                    transactionId,
                    data.buyer?.name || userEmail || 'Cliente Hotmart',
                    userEmail || '',
                    buyerPhone || '',
                    buyerCountry || '',
                    status || 'approved',
                    affiliateCode,
                    trackingInfo.planSlug,
                    trackingInfo.planName,
                    trackingInfo.periodicity,
                    trackingInfo.planPrice,
                    trackingInfo.planDays,
                    sqlStartDate,
                    sqlRenewalDate,
                    amount,
                    currency,
                    JSON.stringify(trackingInfo.rawTrackingKeys),
                    JSON.stringify(payload)
                ]
            );
        } catch (logErr) {
            console.warn("[Hotmart Orders Log Webhook Insert Error]", logErr.message);
        }
    }

    if (!userId) {
        console.warn("[Hotmart Webhook] No se pudo identificar al usuario (ni por SRC ni por Email).");
        return;
    }

    // --- Lógica para CANCELACIÓN de suscripción (Evento específico de Hotmart) ---
    if (event === 'SUBSCRIPTION_CANCELLATION') {
        console.log(`[Hotmart Webhook] Procesando CANCELACIÓN PROGRAMADA para User ${userId} (Producto ${productId})`);
        
        const [planRows] = await pool.query("SELECT slug FROM plans WHERE hotmart_id = ? OR hotmart_id_annual = ? LIMIT 1", [productId, productId]);
        const planSlug = planRows.length > 0 ? planRows[0].slug : trackingInfo.planSlug;

        if (planSlug) {
            let expiresAt = sqlRenewalDate;

            let updateResult;
            if (subscriberCode) {
                [updateResult] = await pool.query(
                    `UPDATE user_subscriptions 
                     SET status = 'pending_cancellation', expires_at = ?, renewal_date = ?, updated_at = NOW() 
                     WHERE user_id = ? AND subscriber_code = ? AND status = 'active' 
                     LIMIT 1`,
                    [expiresAt, expiresAt, userId, subscriberCode]
                );
            }

            if (!updateResult || updateResult.affectedRows === 0) {
                await pool.query(
                    `UPDATE user_subscriptions 
                     SET status = 'pending_cancellation', expires_at = ?, renewal_date = ?, updated_at = NOW() 
                     WHERE user_id = ? AND (plan_slug = ? OR plan_slug = 'pro' OR plan_slug = 'pro_mensual' OR plan_slug = 'pro_anual') AND status = 'active' 
                     LIMIT 1`,
                    [expiresAt, expiresAt, userId, planSlug]
                );
            }

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
        console.log(`[Hotmart Webhook] Activando plan para User ${userId} (${trackingInfo.periodicity}: ${trackingInfo.planSlug})`);

        // 1. Buscar plan en DB (por ID de producto o slug) con fallback inteligente a 'pro'
        let matchedPlan = null;
        if (productId) {
            const [planRows] = await pool.query(
                `SELECT id, limits_config, slug, name FROM plans 
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
            if (planRows.length > 0) matchedPlan = planRows[0];
        }

        if (!matchedPlan) {
            const [proRows] = await pool.query("SELECT id, limits_config, slug, name FROM plans WHERE slug = 'pro' LIMIT 1");
            if (proRows.length > 0) matchedPlan = proRows[0];
        }

        const limitsConfig = matchedPlan?.limits_config 
            ? (typeof matchedPlan.limits_config === 'string' ? JSON.parse(matchedPlan.limits_config) : matchedPlan.limits_config)
            : {
                maxProjects: 9999,
                maxLandings: 9999,
                maxArticles: 9999,
                maxDomains: 9999,
                maxEmailSequences: 9999,
                maxEmailSequencesNurturing: 9999,
                maxWhatsAppLaunches: 9999,
                maxHooks: 9999
            };

        // Enriquecer limits con datos del plan específico (mensual o anual)
        const enrichedLimits = {
            ...limitsConfig,
            planName: 'pro',
            planSlug: trackingInfo.planSlug,
            planDisplayName: trackingInfo.isAnnual ? 'Pro Ilimitado (Anual)' : 'Pro Ilimitado (Mensual)',
            periodicity: trackingInfo.periodicity,
            planPrice: trackingInfo.planPrice,
            planDays: trackingInfo.planDays,
            startDate: trackingInfo.startDate.toISOString(),
            renewalDate: trackingInfo.renewalDate.toISOString()
        };

        // 2. Gestionar el "Inventario de Suscripciones"
        const [existingSub] = await pool.query(
            "SELECT id FROM user_subscriptions WHERE user_id = ? AND (plan_slug = ? OR plan_slug = 'pro' OR plan_slug = 'pro_mensual' OR plan_slug = 'pro_anual') AND status IN ('active', 'pending_cancellation') LIMIT 1",
            [userId, trackingInfo.planSlug]
        );

        if (existingSub.length > 0) {
            console.log(`[Hotmart Webhook] Actualizando suscripción existente ${existingSub[0].id} para ${trackingInfo.planSlug}`);
            await pool.query(
                `UPDATE user_subscriptions 
                 SET status = 'active', plan_slug = ?, periodicity = ?, plan_price = ?, plan_days = ?, start_date = ?, renewal_date = ?, expires_at = ?, hotmart_purchase_id = ?, subscriber_code = ?, offer_code = ?, tracking_keys_json = ?, updated_at = NOW() 
                 WHERE id = ?`,
                [
                    trackingInfo.planSlug,
                    trackingInfo.periodicity,
                    trackingInfo.planPrice,
                    trackingInfo.planDays,
                    sqlStartDate,
                    sqlRenewalDate,
                    sqlRenewalDate,
                    transactionId || null,
                    subscriberCode,
                    offerCode,
                    JSON.stringify(trackingInfo.rawTrackingKeys),
                    existingSub[0].id
                ]
            );
        } else {
            console.log(`[Hotmart Webhook] Creando nueva suscripción para ${trackingInfo.planSlug} (${trackingInfo.periodicity})`);
            await pool.query(
                `INSERT INTO user_subscriptions 
                 (user_id, plan_slug, periodicity, plan_price, plan_days, start_date, renewal_date, expires_at, status, hotmart_purchase_id, subscriber_code, offer_code, tracking_keys_json) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
                [
                    userId,
                    trackingInfo.planSlug,
                    trackingInfo.periodicity,
                    trackingInfo.planPrice,
                    trackingInfo.planDays,
                    sqlStartDate,
                    sqlRenewalDate,
                    sqlRenewalDate,
                    transactionId || null,
                    subscriberCode,
                    offerCode,
                    JSON.stringify(trackingInfo.rawTrackingKeys)
                ]
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
            [JSON.stringify(enrichedLimits), buyerPhone, buyerCountry, JSON.stringify(buyerData), userId]
        );

        // 4. Registrar el pago en el historial financiero
        if (transactionId) {
            await pool.query(
                `INSERT INTO user_payments (user_id, transaction_id, amount, currency, status, payment_method) 
                 VALUES (?, ?, ?, ?, 'approved', ?)
                 ON DUPLICATE KEY UPDATE amount = VALUES(amount), status = 'approved'`,
                [userId, transactionId, amount, currency, paymentType]
            );
        }

        // 5. Actualizar Proyecto Específico si se proporcionó projectId
        if (projectId) {
            console.log(`[Hotmart Webhook] Actualizando Proyecto ${projectId} con Plan ${trackingInfo.planSlug}`);
            await pool.query(
                `UPDATE projects SET plan_id = ?, plan_slug = ? WHERE id = ? AND user_id = ?`,
                [matchedPlan?.id || 1, 'pro', projectId, userId]
            );
        }

        // 6. Log System Activity
        try {
            const [userRows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
            const userName = userRows[0]?.name || 'Usuario Hotmart';
            
            await pool.query(
                `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details, created_at) 
                 VALUES (?, ?, 'PURCHASE_PLAN_HOTMART', 'plan', ?, ?, NOW())`,
                [
                    userId, 
                    userName, 
                    trackingInfo.planSlug, 
                    JSON.stringify({ 
                        hotmart_product_id: productId, 
                        status: status, 
                        periodicity: trackingInfo.periodicity,
                        price: trackingInfo.planPrice,
                        renewal_date: sqlRenewalDate
                    })
                ]
            );
        } catch (e) {
            console.error("Error logging hotmart activity:", e.message);
        }
    } 
    else if (status === 'refunded' || status === 'canceled' || status === 'expired') {
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

            await pool.query(
                `UPDATE user_subscriptions SET status = 'canceled', updated_at = NOW() WHERE user_id = ? AND status = 'active'`,
                [userId]
            );
        }
    }
};

