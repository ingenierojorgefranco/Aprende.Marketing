
const Stripe = require('stripe');
const pool = require('./db');

// Initialize Stripe with Secret Key from Environment
// Fallback is just for dev safety to prevent crash if not set
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY);

// IDs DE PRECIO (Configurar con los IDs reales de Stripe Dashboard)
const PLAN_PRO_PRICE_ID = 'price_1SdFBGRJVKdziYWKjz1MXdy1'; 
const PLAN_MAX_PRICE_ID = 'price_PLACEHOLDER_MAX'; // Reemplazar cuando se cree en Stripe

const BASE_URL = process.env.BASE_DOMAIN ? `https://${process.env.BASE_DOMAIN}` : 'http://localhost:5173';

/**
 * Crea una sesión de Checkout para suscripción
 */
const createCheckoutSession = async (userId, userEmail, planSlug) => {
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe API Key no configurada.");

    let priceId;
    if (planSlug === 'pro') priceId = PLAN_PRO_PRICE_ID;
    else if (planSlug === 'max') priceId = PLAN_MAX_PRICE_ID;
    else throw new Error("Plan no válido.");

    // Buscar si el usuario ya tiene un customer_id en la BD
    const [rows] = await pool.query("SELECT stripe_customer_id FROM users WHERE id = ?", [userId]);
    let customerId = rows[0]?.stripe_customer_id;

    // Configurar sesión
    const sessionConfig = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${BASE_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/dashboard?canceled=true`,
        // Metadata para identificar al usuario en el webhook
        metadata: {
            userId: userId.toString(),
            planSlug: planSlug
        }
    };

    // Si ya existe cliente en Stripe, lo usamos. Si no, Stripe creará uno nuevo o usamos customer_email
    if (customerId) {
        sessionConfig.customer = customerId;
    } else {
        sessionConfig.customer_email = userEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return session.url;
};

/**
 * Maneja el Webhook de Stripe
 * Se llama cuando ocurre un evento (pago exitoso, cancelación, etc.)
 */
const handleWebhook = async (event) => {
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const userId = session.metadata.userId;
            const planSlug = session.metadata.planSlug;
            const customerId = session.customer;
            const subscriptionId = session.subscription;

            console.log(`[Stripe Webhook] Pago exitoso para User ${userId} - Plan ${planSlug}`);

            // 1. Obtener límites del plan desde la tabla `plans` para asegurar consistencia
            const [planRows] = await pool.query("SELECT limits_config FROM plans WHERE slug = ?", [planSlug]);
            if (planRows.length === 0) {
                console.error(`[Stripe Error] Plan ${planSlug} no encontrado en base de datos.`);
                break;
            }
            
            const limitsConfig = typeof planRows[0].limits_config === 'string' 
                ? JSON.parse(planRows[0].limits_config) 
                : planRows[0].limits_config;

            // 2. Actualizar usuario
            await pool.query(
                `UPDATE users SET 
                    stripe_customer_id = ?, 
                    subscription_id = ?, 
                    subscription_status = 'active',
                    plan_limits = ?
                 WHERE id = ?`,
                [customerId, subscriptionId, JSON.stringify(limitsConfig), userId]
            );
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            
            console.log(`[Stripe Webhook] Suscripción cancelada para Customer ${customerId}`);

            // Revertir a plan GRATUITO (Starter)
            const [starterPlan] = await pool.query("SELECT limits_config FROM plans WHERE slug = 'starter'");
            if (starterPlan.length > 0) {
                const limits = typeof starterPlan[0].limits_config === 'string'
                    ? JSON.parse(starterPlan[0].limits_config)
                    : starterPlan[0].limits_config;

                await pool.query(
                    `UPDATE users SET subscription_status = 'canceled', plan_limits = ? WHERE stripe_customer_id = ?`,
                    [JSON.stringify(limits), customerId]
                );
            }
            break;
        }
        
        default:
            console.log(`[Stripe Webhook] Evento no manejado: ${event.type}`);
    }
};

module.exports = {
    stripe,
    createCheckoutSession,
    handleWebhook
};
