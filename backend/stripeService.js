
import Stripe from 'stripe';
import pool from './db.js';

// Initialize Stripe with Secret Key from Environment
// Fallback is just for dev safety to prevent crash if not set
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY);

const BASE_URL = process.env.BASE_DOMAIN ? `https://${process.env.BASE_DOMAIN}` : 'http://localhost:5173';

/**
 * Crea una sesión de Checkout para suscripción
 */
export const createCheckoutSession = async (userId, userEmail, planSlug) => {
    if (!STRIPE_SECRET_KEY) throw new Error("Stripe API Key no configurada.");

    // 1. Obtener precio dinámicamente de la base de datos
    const [planRows] = await pool.query("SELECT stripe_price_id FROM plans WHERE slug = ?", [planSlug]);
    
    if (planRows.length === 0) throw new Error(`Plan '${planSlug}' no encontrado.`);
    
    const priceId = planRows[0].stripe_price_id;
    if (!priceId) throw new Error(`El plan '${planSlug}' no tiene un ID de precio de Stripe configurado.`);

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
 * Helper para registrar pago en user_payments
 */
const logPayment = async (userId, stripeId, amount, currency, status, method, receipt) => {
    try {
        await pool.query(
            `INSERT INTO user_payments (user_id, stripe_id, amount, currency, status, payment_method, receipt_url, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [userId, stripeId, amount, currency, status, method, receipt]
        );
        console.log(`[Stripe Log] Registered payment for User ${userId}: ${status}`);
    } catch (e) {
        console.error("Error logging payment:", e.message);
    }
};

/**
 * Maneja el Webhook de Stripe
 * Se llama cuando ocurre un evento (pago exitoso, cancelación, etc.)
 */
export const handleWebhook = async (event) => {
    console.log(`[Stripe Webhook] Processing event: ${event.type}`);

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const userId = session.metadata.userId;
            const planSlug = session.metadata.planSlug;
            const customerId = session.customer;
            const subscriptionId = session.subscription;

            // Log Payment
            const amount = session.amount_total ? session.amount_total / 100 : 0;
            const currency = session.currency;
            const paymentStatus = session.payment_status; // 'paid'
            await logPayment(userId, session.id, amount, currency, paymentStatus === 'paid' ? 'succeeded' : paymentStatus, 'card', null);

            console.log(`[Stripe Webhook] Pago exitoso (Checkout) para User ${userId} - Plan ${planSlug}`);

            // 1. Obtener límites del plan
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

            // 3. LOG SYSTEM ACTIVITY (Nueva funcionalidad solicitada)
            try {
                // Obtener nombre del usuario para el log
                const [uRows] = await pool.query("SELECT name FROM users WHERE id = ?", [userId]);
                const userName = uRows[0]?.name || 'Usuario';

                await pool.query(
                    `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details, created_at) 
                     VALUES (?, ?, 'PURCHASE_PLAN', 'plan', ?, ?, NOW())`,
                    [
                        userId, 
                        userName, 
                        planSlug, 
                        JSON.stringify({ amount: amount, currency: currency, stripe_id: session.id })
                    ]
                );
            } catch (logErr) {
                console.error("Error writing system log for purchase:", logErr.message);
            }

            break;
        }

        case 'invoice.payment_succeeded': {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            
            // Find user by customer_id
            const [userRows] = await pool.query("SELECT id FROM users WHERE stripe_customer_id = ?", [customerId]);
            if (userRows.length > 0) {
                const userId = userRows[0].id;
                const amount = invoice.amount_paid ? invoice.amount_paid / 100 : 0;
                await logPayment(userId, invoice.id, amount, invoice.currency, 'succeeded', 'card', invoice.hosted_invoice_url);
            }
            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            
            // Find user
            const [userRows] = await pool.query("SELECT id FROM users WHERE stripe_customer_id = ?", [customerId]);
            if (userRows.length > 0) {
                const userId = userRows[0].id;
                const amount = invoice.amount_due ? invoice.amount_due / 100 : 0;
                await logPayment(userId, invoice.id, amount, invoice.currency, 'failed', 'card', null);
                
                // Optional: Downgrade user here if desired, or let subscription.deleted handle it
                console.warn(`[Stripe Webhook] Payment failed for User ${userId}`);
            }
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

                // Actualizar usuario
                await pool.query(
                    `UPDATE users SET subscription_status = 'canceled', plan_limits = ? WHERE stripe_customer_id = ?`,
                    [JSON.stringify(limits), customerId]
                );

                // Log Cancelación
                try {
                    const [uRows] = await pool.query("SELECT id, name FROM users WHERE stripe_customer_id = ?", [customerId]);
                    if (uRows.length > 0) {
                        await pool.query(
                            `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, details, created_at) 
                             VALUES (?, ?, 'CANCEL_SUBSCRIPTION', 'plan', ?, NOW())`,
                            [uRows[0].id, uRows[0].name, JSON.stringify({ stripe_customer: customerId })]
                        );
                    }
                } catch (e) {}
            }
            break;
        }
        
        default:
            console.log(`[Stripe Webhook] Evento no manejado: ${event.type}`);
    }
};

export { stripe };
