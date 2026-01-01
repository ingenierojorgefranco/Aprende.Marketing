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
////////// Parser JSON configurado explícitamente para compatibilidad con Hotmart - 25/05/2025 11:30 //////////
router.post('/hotmart/webhook', express.json({ limit: '10mb' }), async (req, res) => {
    try {
        // Hotmart envía un JSON estándar que se procesa en el servicio correspondiente
        // Validamos que el body no esté vacío
        if (!req.body || Object.keys(req.body).length === 0) {
            console.warn("[Hotmart Webhook] Recibido body vacío.");
            return res.status(400).json({ error: "Empty body" });
        }
        
        await hotmartService.handleWebhook(req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(`[Hotmart Webhook Error]: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});
////////// Fin de actualización - 25/05/2025 11:30 //////////

////////// Se añade manejador GET para verificación visual del webhook en navegador - 25/05/2025 20:45 //////////
router.get('/hotmart/webhook', (req, res) => {
    res.json({
        status: "active",
        message: "Sistema de Webhooks Hotmart v29: Activo y esperando datos de venta.",
        timestamp: new Date().toISOString()
    });
});
////////// Fin de actualización - 25/05/2025 20:45 //////////

module.exports = router;