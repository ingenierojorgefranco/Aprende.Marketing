
import pool from './db.js';

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
    
    // Datos adicionales para el historial (Enfoque Híbrido)
    const buyerPhone = data.buyer?.checkout_phone;
    const buyerCountry = data.buyer?.address?.country_iso;
    const transactionId = data.purchase?.transaction;
    const amount = data.purchase?.price?.value;
    const currency = data.purchase?.price?.currency_value;
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
        
        // 1. Identificar el plan por el ID de producto
        const [planRows] = await pool.query("SELECT slug FROM plans WHERE hotmart_id = ? LIMIT 1", [productId]);
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

        // 1. Buscar el plan que coincide con este Hotmart ID y Oferta
        // Priorizamos la coincidencia exacta de la oferta si existe
        const [planRows] = await pool.query(
            `SELECT id, limits_config, slug FROM plans 
             WHERE hotmart_id = ? 
             AND (hotmart_offer = ? OR hotmart_offer IS NULL OR hotmart_offer = '')
             ORDER BY (hotmart_offer = ?) DESC LIMIT 1`, 
            [productId, offerCode, offerCode]
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
            // Reactivamos la suscripción existente
            console.log(`[Hotmart Webhook] Reactivando suscripción existente ${existingSub[0].id} para el plan ${plan.slug}`);
            await pool.query(
                `UPDATE user_subscriptions 
                 SET status = 'active', expires_at = NULL, hotmart_purchase_id = ?, subscriber_code = ?, offer_code = ?, updated_at = NOW() 
                 WHERE id = ?`,
                [data.purchase?.transaction || null, subscriberCode, offerCode, existingSub[0].id]
            );
        } else {
            // Insertar una nueva suscripción
            console.log(`[Hotmart Webhook] Creando nueva suscripción para el plan ${plan.slug}`);
            await pool.query(
                `INSERT INTO user_subscriptions (user_id, plan_slug, status, hotmart_purchase_id, subscriber_code, offer_code) 
                 VALUES (?, ?, 'active', ?, ?, ?)`,
                [userId, plan.slug, data.purchase?.transaction || null, subscriberCode, offerCode]
            );
        }

        // 3. Actualizar usuario (Lógica Global + CRM Data)
        await pool.query(
            `UPDATE users SET 
                subscription_status = 'active',
                plan_limits = ?,
                phone = ?,
                country = ?,
                hotmart_metadata = ?
             WHERE id = ?`,
            [JSON.stringify(limitsConfig), buyerPhone, buyerCountry, JSON.stringify(buyerData), userId]
        );

        // 4. Registrar el pago en el historial financiero
        if (transactionId) {
            await pool.query(
                `INSERT INTO user_payments (user_id, transaction_id, amount, currency, status, payment_method) 
                 VALUES (?, ?, ?, ?, 'approved', ?)`,
                [userId, transactionId, amount, currency, paymentType]
            );
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
