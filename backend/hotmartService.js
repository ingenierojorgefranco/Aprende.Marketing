
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
    const userEmail = data.buyer?.email;
    
    ////////// Lógica reforzada para detección de userId - 25/05/2025 11:30 //////////
    // Intentamos obtener el ID del usuario desde el parámetro 'src' que enviamos en el link
    // El formato esperado ahora es "userId-projectId" o simplemente "userId"
    let rawSrc = data.purchase?.src || data.affiliate?.src || null;
    let userId = null;
    let projectId = null;

    if (rawSrc) {
        if (rawSrc.includes('-')) {
            const parts = rawSrc.split('-');
            userId = parts[0];
            projectId = parts[1];
        } else {
            userId = rawSrc;
        }
    }

    if (!userId && userEmail) {
        // Fallback 1: Buscar usuario por email si no viene el SRC o es inválido
        console.log(`[Hotmart Webhook] SRC no encontrado, intentando fallback por email: ${userEmail}`);
        const [uRows] = await pool.query("SELECT id FROM users WHERE email = ?", [userEmail]);
        if (uRows.length > 0) userId = uRows[0].id;
    }
    ////////// Fin de actualización - 25/05/2025 11:30 //////////

    if (!userId) {
        console.warn("[Hotmart Webhook] No se pudo identificar al usuario (ni por SRC ni por Email).");
        return;
    }

    // Lógica de activación si la compra es aprobada o renovación exitosa
    if (status === 'approved' || status === 'complete' || event === 'PURCHASE_APPROVED') {
        console.log(`[Hotmart Webhook] Activando plan para User ${userId} (Producto ${productId})`);

        // 1. Buscar el plan que coincide con este Hotmart ID
        const [planRows] = await pool.query("SELECT limits_config, slug FROM plans WHERE hotmart_id = ?", [productId]);
        
        if (planRows.length === 0) {
            console.error(`[Hotmart Error] No hay ningún plan configurado con el Hotmart ID: ${productId}`);
            return;
        }

        const plan = planRows[0];
        const limitsConfig = typeof plan.limits_config === 'string' 
            ? JSON.parse(plan.limits_config) 
            : plan.limits_config;

        // 2. Actualizar usuario (Lógica Global - Opcional si queremos mantener límites globales)
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
