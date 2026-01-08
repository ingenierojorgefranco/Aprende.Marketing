const express = require('express');
const pool = require('../db');
const { generateContent } = require('../geminiService');
const { authMiddleware } = require('../authMiddleware');
const stripeService = require('../stripeService');

////////// Actualización: Importación de servicio Systeme.io para sincronización manual - 07/06/2025 19:40 //////////
const systemeIoService = require('../systemeIoService');
////////// Fin de actualización - 07/06/2025 19:40 //////////

const router = express.Router();

// ======================================================
//  LEGACY COMPATIBILITY
// ======================================================

/**
 * Redirección de login antiguo para no romper compatibilidad
 */
router.post('/login', (req, res) => {
    res.redirect(307, '/api/auth/login');
});

// ======================================================
//  STRIPE CHECKOUT
// ======================================================

/**
 * Crea una sesión de Checkout para que el usuario inicie el pago de un plan.
 */
router.post('/stripe/create-checkout-session', authMiddleware, async (req, res) => {
    const { planSlug } = req.body;
    if (!planSlug) return res.status(400).json({ error: "Plan no especificado." });

    try {
        const checkoutUrl = await stripeService.createCheckoutSession(req.user.id, req.user.email, planSlug);
        res.json({ url: checkoutUrl });
    } catch (e) {
        console.error("[Stripe Checkout Error]", e);
        res.status(500).json({ error: e.message || "Error al crear sesión de pago." });
    }
});

// ======================================================
//  CONFIGURACIONES Y PLANES PÚBLICOS
// ======================================================

/**
 * Obtiene la URL de redirección global configurada por el admin.
 */
router.get('/settings/redirect', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'after_login_url'");
        const url = rows.length > 0 ? rows[0].setting_value : '/dashboard';
        res.json({ url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

////////// Se añade endpoint para obtener el método de pago activo del sistema - 24/05/2025 10:30 //////////
/**
 * Obtiene el método de pago activo configurado globalmente.
 */
router.get('/settings/payment-method', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'active_payment_method'");
        const method = rows.length > 0 ? rows[0].setting_value : 'stripe';
        res.json({ method });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 24/05/2025 10:30 //////////

////////// Actualización: Endpoints para gestionar integraciones externas (Systeme.io) - 07/06/2025 19:30 //////////
/**
 * Obtiene las claves de integración del usuario
 */
router.get('/system/integrations', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT setting_value FROM system_settings WHERE setting_key = ?", 
            [`integrations_${req.user.id}`]
        );
        if (rows.length > 0) {
            res.json(JSON.parse(rows[0].setting_value));
        } else {
            res.json({});
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Actualiza las claves de integración del usuario
 */
router.put('/system/integrations', authMiddleware, async (req, res) => {
    const settings = req.body;
    try {
        const key = `integrations_${req.user.id}`;
        const val = JSON.stringify(settings);
        await pool.query(
            "INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
            [key, val, val]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 07/06/2025 19:30 //////////

////////// Actualización: Reemplazo de campañas por etiquetas (Tags) en endpoints de integración - 17/06/2025 11:30 //////////
router.get('/system/integrations/systemeio/tags', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT setting_value FROM system_settings WHERE setting_key = ?",
            [`integrations_${req.user.id}`]
        );
        if (rows.length === 0) return res.json([]);
        const settings = JSON.parse(rows[0].setting_value);
        if (!settings.systemeIoKey) return res.json([]);
        
        const tags = await systemeIoService.getTags(settings.systemeIoKey);
        res.json(tags);
    } catch (e) {
        console.error(`[Systeme.io Tags Error] User ${req.user.id}:`, e.message);
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 17/06/2025 11:30 //////////

////////// Actualización: Endpoint para crear etiquetas en Systeme.io - 27/06/2025 12:30 //////////
router.post('/system/integrations/systemeio/tags', authMiddleware, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nombre de etiqueta no proporcionado." });

    try {
        const [rows] = await pool.query(
            "SELECT setting_value FROM system_settings WHERE setting_key = ?",
            [`integrations_${req.user.id}`]
        );
        if (rows.length === 0) return res.status(400).json({ error: "Configuración de integración no encontrada." });
        
        const settings = JSON.parse(rows[0].setting_value);
        if (!settings.systemeIoKey) return res.status(400).json({ error: "API Key de Systeme.io no configurada." });

        const newTag = await systemeIoService.createTag(settings.systemeIoKey, name);
        res.json(newTag);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 27/06/2025 12:30 //////////

////////// Actualización: Endpoint para sincronización manual de leads pendientes con Systeme.io - 07/06/2025 19:40 //////////
router.post('/system/integrations/sync-pending', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Obtener API Key
        const [intRows] = await pool.query(
            "SELECT setting_value FROM system_settings WHERE setting_key = ?",
            [`integrations_${userId}`]
        );
        
        if (intRows.length === 0) return res.status(400).json({ error: "No tienes configurada la API Key de Systeme.io." });
        
        const settings = JSON.parse(intRows[0].setting_value);
        if (!settings.systemeIoKey) return res.status(400).json({ error: "No tienes configurada la API Key de Systeme.io." });

        // 2. Obtener leads pendientes (join con landing_pages para verificar owner)
        const [pendingLeads] = await pool.query(
            `SELECT l.id, l.email, l.name, l.page_id 
             FROM leads l 
             JOIN landing_pages lp ON l.page_id = lp.id 
             WHERE lp.user_id = ? AND (l.synced = 0 OR l.synced IS NULL)`,
            [userId]
        );

        if (pendingLeads.length === 0) {
            return res.json({ success: true, count: 0, message: "No hay leads pendientes por sincronizar." });
        }

        // 3. Sincronizar uno a uno
        let successCount = 0;
        for (const lead of pendingLeads) {
            try {
                await systemeIoService.addContact(settings.systemeIoKey, lead.email, lead.name || 'Prospecto');
                ////////// Actualización: Manejo de error de BD separado de API - 15/06/2025 16:30 //////////
                try {
                    await pool.query('UPDATE leads SET synced = 1 WHERE id = ?', [lead.id]);
                    successCount++;
                } catch (dbErr) {
                    console.error(`[Manual Sync DB Error] Lead ID ${lead.id}:`, dbErr.message);
                }
                ////////// Fin de actualización - 15/06/2025 16:30 //////////
            } catch (e) {
                console.error(`[Manual Sync API Error] Lead ID ${lead.id}:`, e.message);
            }
        }

        res.json({ success: true, count: successCount, message: `Se han sincronizado ${successCount} leads exitosamente.` });
    } catch (e) {
        ////////// Actualización: Log de error detallado para diagnosticar error 500 - 07/06/2025 20:15 //////////
        console.error("[CRITICAL SYNC ERROR 500]:", e);
        ////////// Fin de actualización - 07/06/2025 20:15 //////////
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 07/06/2025 19:40 //////////

////////// Actualización: Mejora de la respuesta ante fallos en la asignación de etiquetas individuales - 17/06/2025 14:30 //////////
router.post('/system/integrations/sync-single', authMiddleware, async (req, res) => {
    const { leadId, tagId } = req.body;
    if (!leadId) return res.status(400).json({ error: "ID de lead no proporcionado." });

    try {
        const userId = req.user.id;
        
        // 1. Obtener API Key
        const [intRows] = await pool.query(
            "SELECT setting_value FROM system_settings WHERE setting_key = ?",
            [`integrations_${userId}`]
        );
        
        if (intRows.length === 0) return res.status(400).json({ error: "Configura la API Key de Systeme.io en Herramientas Pro." });
        
        const settings = JSON.parse(intRows[0].setting_value);
        if (!settings.systemeIoKey) return res.status(400).json({ error: "Configura la API Key de Systeme.io en Herramientas Pro." });

        // 2. Obtener datos del lead verificando pertenencia
        const [leads] = await pool.query(
            `SELECT l.id, l.email, l.name, l.page_id 
             FROM leads l 
             JOIN landing_pages lp ON l.page_id = lp.id 
             WHERE lp.user_id = ? AND l.id = ?`,
            [userId, leadId]
        );

        if (leads.length === 0) return res.status(404).json({ error: "Lead no encontrado o no tienes permisos." });
        const lead = leads[0];

        // 3. Sincronizar Contacto
        let contactResponse;
        try {
            contactResponse = await systemeIoService.addContact(settings.systemeIoKey, lead.email, lead.name || 'Prospecto');
        } catch (apiErr) {
            console.error(`[Systeme.io API Error Details]:`, apiErr);
            return res.status(500).json({ error: `Error de API Systeme.io al añadir contacto: ${apiErr.message}` });
        }

        ////////// Actualización: Implementación de extracción inteligente de ID (buscando en contact.id, contact.contact.id e id directo) para máxima compatibilidad con las variaciones de la API de Systeme.io - 25/06/2025 15:50 //////////
        const finalContactId = contactResponse?.contact?.id || contactResponse?.contact?.contact?.id || contactResponse?.id;
        ////////// Fin de actualización - 25/06/2025 15:50 //////////

        // 4. Asignar Etiqueta si se proporcionó ID
        let tagSuccess = true;
        let tagErrorMessage = "";
        if (tagId && finalContactId) {
            try {
                await systemeIoService.addTagToContact(settings.systemeIoKey, finalContactId, tagId);
            } catch (subErr) {
                console.warn(`[Systeme.io Tag Assignment Warn]: ${subErr.message}`);
                tagSuccess = false;
                tagErrorMessage = subErr.message;
            }
        }

        // 5. Actualizar estado local
        try {
            await pool.query('UPDATE leads SET synced = 1 WHERE id = ?', [leadId]);
            
            // Construimos mensaje de éxito detallado
            let finalMessage = `Lead ${lead.email} sincronizado con éxito.`;
            if (tagId) {
                if (tagSuccess) {
                    finalMessage += " Etiqueta vinculada correctamente.";
                } else {
                    finalMessage += ` ¡AVISO!: El contacto se creó pero no se pudo asignar la etiqueta (${tagErrorMessage}).`;
                }
            }
            
            res.json({ success: true, message: finalMessage });
        } catch (dbErr) {
            console.error(`[Single Sync DB Error]:`, dbErr);
            res.status(500).json({ error: `Error de Base de Datos Local.` });
        }
    } catch (e) {
        console.error("[SINGLE SYNC ERROR 500]:", e);
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 17/06/2025 14:30 //////////

/**
 * Lista los planes activos para la landing page pública o modal de upgrade.
 */
router.get('/public/plans', async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM plans WHERE is_active = 1 ORDER BY price_monthly ASC');
        const formattedPlans = plans.map(p => ({
            id: p.id.toString(),
            name: p.name,
            slug: p.slug,
            description: p.description,
            priceMonthly: parseFloat(p.price_monthly),
            currency: p.currency,
            stripePriceId: p.stripe_price_id,
            ////////// Se incluye hotmartId en la respuesta pública - 24/05/2025 10:30 //////////
            hotmartId: p.hotmart_id,
            ////////// Fin de actualización - 24/05/2025 10:30 //////////
            ////////// Se incluyen hotmartOffer y hotmartCheckoutMode en la respuesta pública - 25/05/2025 19:30 //////////
            hotmartOffer: p.hotmart_offer,
            hotmartCheckoutMode: p.hotmart_checkout_mode,
            ////////// Fin de actualización - 25/05/2025 19:30 //////////
            limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config,
            uiFeatures: typeof p.ui_features === 'string' ? JSON.parse(p.ui_features) : (p.ui_features || []),
            isRecommended: !!p.is_recommended
        }));
        res.json(formattedPlans);
    } catch (e) {
        console.error("[Plans] Error fetching public plans:", e);
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  IA & DIAGNÓSTICO
// ======================================================

/**
 * Proxy para el motor de Inteligencia Artificial Gemini.
 */
router.post('/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    res.status(500).json({ error: 'Error IA', details: error.message, text: '' });
  }
});

/**
 * Endpoint de diagnóstico de salud de la infraestructura.
 */
router.get('/debug/db-status', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT 1 as val');
      res.json({ 
          status: 'online', 
          db_response: rows[0].val, 
          server_version: 'v29_clean_modular',
          timestamp: new Date().toISOString()
      });
  } catch (e) {
      res.status(500).json({ status: 'offline', error: e.message });
  }
});

////////// Actualización: Endpoint público para el feed de novedades - 07/06/2025 10:00 //////////
router.get('/system/news', async (req, res) => {
    try {
        const [news] = await pool.query('SELECT * FROM novedadestips ORDER BY created_at DESC LIMIT 5');
        res.json(news.map(n => ({
            id: n.id.toString(),
            title: n.title,
            content: n.content,
            date: new Date(n.created_at).toLocaleDateString(),
            iconType: n.icon_type
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/system/news/history', async (req, res) => {
    const { month, year } = req.query;
    try {
        let query = 'SELECT * FROM novedadestips WHERE 1=1';
        const params = [];
        if (month) {
            query += ' AND MONTH(created_at) = ?';
            params.push(month);
        }
        if (year) {
            query += ' AND YEAR(created_at) = ?';
            params.push(year);
        }
        query += ' ORDER BY created_at DESC';
        const [news] = await pool.query(query, params);
        res.json(news.map(n => ({
            id: n.id.toString(),
            title: n.title,
            content: n.content,
            date: new Date(n.created_at).toLocaleDateString(),
            iconType: n.icon_type
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 07/06/2025 10:00 //////////

module.exports = router;
