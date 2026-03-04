
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
        console.log(`[Hotmart Webhook] Procesando CANCELACIÓN de suscripción para User ${userId} (Producto ${productId})`);
        
        // 1. Identificar el plan por el ID de producto
        const [planRows] = await pool.query("SELECT slug FROM plans WHERE hotmart_id = ? LIMIT 1", [productId]);
        const planSlug = planRows.length > 0 ? planRows[0].slug : null;

        if (planSlug) {
            // 2. Marcar UNA suscripción activa como cancelada en el inventario
            // Usamos LIMIT 1 para que si tiene varios planes iguales, solo se cancele uno
            await pool.query(
                `UPDATE user_subscriptions 
                 SET status = 'canceled', updated_at = NOW() 
                 WHERE user_id = ? AND plan_slug = ? AND status = 'active' 
                 LIMIT 1`,
                [userId, planSlug]
            );

            // 3. Verificar cuántas suscripciones ACTIVAS le quedan al usuario (excluyendo starter)
            const [activeSubs] = await pool.query(
                "SELECT COUNT(*) as count FROM user_subscriptions WHERE user_id = ? AND status = 'active' AND plan_slug != 'starter'",
                [userId]
            );

            const remainingCount = activeSubs[0].count;
            console.log(`[Hotmart Webhook] Suscripciones activas restantes para User ${userId}: ${remainingCount}`);

            if (remainingCount === 0) {
                // 4. Si no quedan planes activos, degradar a Starter inmediatamente
                console.log(`[Hotmart Webhook] No quedan planes activos. Degradando usuario a Starter.`);
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
            } else {
                console.log(`[Hotmart Webhook] El usuario aún tiene ${remainingCount} suscripciones activas. Se mantiene el nivel actual.`);
            }
            
            // Log de actividad del sistema
            try {
                const [userRows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
                const userName = userRows[0]?.name || 'Usuario Hotmart';
                await pool.query(
                    `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details, created_at) 
                     VALUES (?, ?, 'SUBSCRIPTION_CANCELED_HOTMART', 'plan', ?, ?, NOW())`,
                    [userId, userName, planSlug, JSON.stringify({ hotmart_product_id: productId, event: event })]
                );
            } catch (e) {
                console.error("Error logging cancellation activity:", e.message);
            }
        }
        return; // Finalizar procesamiento para este evento
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

        // 2. Insertar en el "Inventario de Suscripciones" (NUEVO)
        await pool.query(
            `INSERT INTO user_subscriptions (user_id, plan_slug, status, hotmart_purchase_id) 
             VALUES (?, ?, 'active', ?)`,
            [userId, plan.slug, data.purchase?.transaction || null]
        );

        // 3. Actualizar usuario (Lógica Global - Opcional si queremos mantener límites globales)
        await pool.query(
            `UPDATE users SET 
                subscription_status = 'active',
                plan_limits = ?
             WHERE id = ?`,
            [JSON.stringify(limitsConfig), userId]
        );

        // 3. Actualizar Proyecto Específico si se proporcionó projectId
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
