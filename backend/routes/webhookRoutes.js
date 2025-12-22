const express = require('express');
const stripeService = require('../stripeService');
const hotmartService = require('../hotmartService');

const router = express.Router();

/**
 * Webhook de Stripe
 * Importante: Utiliza express.raw() para obtener el cuerpo exacto 
 * y verificar la firma de seguridad (stripe-signature).
 */
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (endpointSecret) {
            event = stripeService.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            // Modo desarrollo: parseo directo si no hay secreto configurado
            event = JSON.parse(req.body.toString());
        }
        
        await stripeService.handleWebhook(event);
        res.json({ received: true });

    } catch (err) {
        console.error(`[Stripe Webhook Error]: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

/**
 * Webhook de Hotmart (Postback)
 * Recibe notificaciones de ventas aprobadas, cancelaciones o reembolsos.
 */
router.post('/hotmart/webhook', express.json(), async (req, res) => {
    try {
        // Hotmart envía un JSON estándar que se procesa en el servicio correspondiente
        await hotmartService.handleWebhook(req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(`[Hotmart Webhook Error]: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;