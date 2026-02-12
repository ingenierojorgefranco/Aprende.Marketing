import express from 'express';
import * as stripeService from '../stripeService.js';
import * as hotmartService from '../hotmartService.js';
////////// Actualización: Importación de servicio Systeme.io para validación de Webhooks - 27/06/2025 11:45 //////////
import * as systemeIoService from '../systemeIoService.js';
import pool from '../db.js';
////////// Fin de actualización - 27/06/2025 11:45 //////////

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

////////// Actualización: Endpoint para recibir Webhooks de Systeme.io con validación HMAC SHA256 - 27/06/2025 11:45 //////////
/**
 * Webhook de Systeme.io
 * Recibe notificaciones de creación de contactos o asignación de etiquetas.
 */
router.post('/systemeio/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-webhook-signature'];
    const webhookSecret = process.env.SYSTEMEIO_WEBHOOK_SECRET;
    const rawBody = req.body.toString();

    // 1. Validar firma por seguridad (Opcional si no hay secreto, pero recomendado)
    if (webhookSecret && !systemeIoService.verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.warn("[Systeme.io Webhook] Firma inválida recibida.");
        return res.status(401).json({ error: "Invalid signature" });
    }

    try {
        const payload = JSON.parse(rawBody);
        const contact = payload.contact || payload;
        const email = contact.email;

        console.log(`[Systeme.io Webhook] Notificación recibida para email: ${email}`);

        // 2. Sincronizar estado en el CRM local si el contacto ya existe
        if (email) {
            await pool.query(
                `UPDATE crm_contacts SET status = 'contacted', updated_at = NOW() 
                 WHERE email = ? AND status = 'new'`,
                [email]
            );
            
            // También marcamos como sincronizado en la tabla de leads
            await pool.query(
                `UPDATE leads SET synced = 1 WHERE email = ?`,
                [email]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error(`[Systeme.io Webhook Error]: ${err.message}`);
        res.status(500).json({ error: "Internal processing error" });
    }
});
////////// Fin de actualización - 27/06/2025 11:45 //////////

////////// Se añade manejador GET para verificación visual del webhook en navegador - 25/05/2025 20:45 //////////
router.get('/hotmart/webhook', (req, res) => {
    res.json({
        status: "active",
        message: "Sistema de Webhooks Hotmart v29: Activo y esperando datos de venta.",
        timestamp: new Date().toISOString()
    });
});
////////// Fin de actualización - 25/05/2025 20:45 //////////

export default router;