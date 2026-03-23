import express from 'express';
import pool from '../db.js';
import { generateContent, generateEmailSequenceContent } from '../geminiService.js';
import { authMiddleware } from '../authMiddleware.js';
import * as stripeService from '../stripeService.js';

////////// Actualización: Importación de servicio Systeme.io para sincronización manual - 07/06/2025 19:40 //////////
import * as systemeIoService from '../systemeIoService.js';
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

/* */ /* Actualización: Endpoints para gestión de Email Sequences y Messages con persistencia real - 24/06/2024 16:20 */

// Obtener secuencias del usuario
router.get('/email/sequences', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT es.*, p.name as project_name 
             FROM email_sequences es 
             JOIN projects p ON es.project_id = p.id 
             WHERE es.user_id = ? ORDER BY es.created_at DESC`,
            [req.user.id]
        );

        const sequencesWithDays = await Promise.all(rows.map(async (seq) => {
            const [msgRows] = await pool.query(
                `SELECT day_index, type FROM email_messages WHERE sequence_id = ? AND is_generated = 1`,
                [seq.id]
            );
            return {
                ...seq,
                projectName: seq.project_name,
                tagName: seq.tag_name || 'Sin etiqueta',
                generatedDays: msgRows.map(m => m.day_index),
                // We can still provide a default type for the sequence based on its messages if needed, 
                // but the individual messages will have their own type.
                type: msgRows.length > 0 ? msgRows[0].type : 'conversion'
            };
        }));

        res.json(sequencesWithDays);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Generar secuencia completa de correos con IA
router.post('/email/sequences/generate-full', authMiddleware, async (req, res) => {
    const { projectId, sequenceData, type = 'conversion' } = req.body;
    if (!projectId) return res.status(400).json({ error: "Falta ID de proyecto" });

    try {
        // 1. Verificar si la secuencia existe para este usuario
        const [seqRows] = await pool.query(
            'SELECT id FROM email_sequences WHERE user_id = ? AND project_id = ? LIMIT 1',
            [req.user.id, projectId]
        );

        let sequenceId;

        if (seqRows.length === 0) {
            // Si no existe, la creamos automáticamente
            const [projectRows] = await pool.query('SELECT name FROM projects WHERE id = ?', [projectId]);
            const projectName = projectRows[0]?.name || 'Secuencia Nueva';

            const [result] = await pool.query(
                'INSERT INTO email_sequences (user_id, project_id, name, status) VALUES (?, ?, ?, "borrador")',
                [req.user.id, projectId, projectName]
            );
            sequenceId = result.insertId;
        } else {
            sequenceId = seqRows[0].id;
        }

        // 2. Inicializar o actualizar los mensajes basados en sequenceData (Upsert)
        if (sequenceData && Array.isArray(sequenceData)) {
            for (const p of sequenceData) {
                await pool.query(
                    `INSERT INTO email_messages (sequence_id, day_index, pilar_type, subject, purpose, type, redirect_type, redirect_url, content_html, is_generated) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, "", 0)
                     ON DUPLICATE KEY UPDATE 
                        pilar_type = VALUES(pilar_type),
                        subject = VALUES(subject),
                        purpose = VALUES(purpose),
                        type = VALUES(type),
                        redirect_type = VALUES(redirect_type),
                        redirect_url = VALUES(redirect_url)`,
                    [sequenceId, p.dayIndex, p.pilarType, p.subject, p.purpose, type, p.redirectType || null, p.redirectUrl || null]
                );
            }
        }

        // 3. Generar contenido con IA
        const generatedEmails = await generateEmailSequenceContent(projectId, sequenceData, type);

        // 4. Actualizar los mensajes en la base de datos con el contenido generado
        for (const email of generatedEmails) {
            await pool.query(
                'UPDATE email_messages SET content_html = ?, is_generated = 1 WHERE sequence_id = ? AND day_index = ?',
                [email.contentHtml, sequenceId, email.dayIndex]
            );
        }

        res.json({ success: true, sequenceId });
    } catch (e) {
        console.error("Error en generate-full sequence:", e);
        res.status(500).json({ error: e.message });
    }
});

// Crear o recuperar secuencia para un proyecto
router.post('/email/sequences', authMiddleware, async (req, res) => {
    const { projectId, name, type = 'conversion' } = req.body;
    if (!projectId) return res.status(400).json({ error: "Falta ID de proyecto" });

    try {
        // Verificar si ya existe
        const [existing] = await pool.query(
            'SELECT id FROM email_sequences WHERE user_id = ? AND project_id = ? LIMIT 1',
            [req.user.id, projectId]
        );

        if (existing.length > 0) {
            // Si ya existe la secuencia, verificamos si tiene mensajes de este tipo
            const [existingMsgs] = await pool.query(
                'SELECT id FROM email_messages WHERE sequence_id = ? AND type = ? LIMIT 1',
                [existing[0].id, type]
            );
            if (existingMsgs.length > 0) {
                return res.json({ id: existing[0].id, isNew: false });
            }
            // Si existe la secuencia pero no mensajes de este tipo, devolvemos el ID para que se añadan
            return res.json({ id: existing[0].id, isNew: false });
        }

        // Crear nueva
        const [result] = await pool.query(
            'INSERT INTO email_sequences (user_id, project_id, name, status) VALUES (?, ?, ?, "borrador")',
            [req.user.id, projectId, name || 'Secuencia Nueva']
        );
        const sequenceId = result.insertId;

        // Inicializar correos según el tipo
        if (type === 'conversion') {
            const pillars = [
                { type: 'Bienvenida + Valor', subject: 'Tu regalo está aquí 🎁' },
                { type: 'Romper Creencias', subject: 'La verdad sobre [Nicho] 🤔' },
                { type: 'Historia / Conexión', subject: 'Mi historia personal ✨' },
                { type: 'Educación + Autoridad', subject: 'Cómo dominar [Habilidad] 🎓' },
                { type: 'Objeciones', subject: '¿Es esto para ti? 🛑' },
                { type: 'Caso de éxito', subject: 'Mira estos resultados 🔥' },
                { type: 'Cierre / Oferta', subject: 'Última oportunidad ⚠️' }
            ];

            for (let i = 0; i < pillars.length; i++) {
                const p = pillars[i];
                await pool.query(
                    `INSERT INTO email_messages (sequence_id, day_index, pilar_type, subject, purpose, content_html, is_generated, type) 
                     VALUES (?, ?, ?, ?, ?, "", 0, ?)`,
                    [sequenceId, i + 1, p.type, p.subject, `Objetivo del Día ${i + 1}: ${p.type}`, type]
                );
            }
        } else {
            // Para nutrición, inicializamos 3 correos base (pueden ser más luego)
            for (let i = 0; i < 3; i++) {
                await pool.query(
                    `INSERT INTO email_messages (sequence_id, day_index, pilar_type, subject, purpose, content_html, is_generated, type) 
                     VALUES (?, ?, ?, ?, ?, "", 0, ?)`,
                    [sequenceId, i + 1, 'Nutrición', `Contenido de Valor ${i + 1}`, `Aportar valor basado en artículo de blog`, type]
                );
            }
        }

        res.json({ id: sequenceId, isNew: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/* */ /* Actualización: Endpoint para eliminación de secuencias (incluye mensajes por FK) - 11/12/2024 15:40 */
router.delete('/email/sequences/:id', authMiddleware, async (req, res) => {
    try {
        const [check] = await pool.query('SELECT id, user_id FROM email_sequences WHERE id = ?', [req.params.id]);
        if (check.length === 0 || (check[0].user_id !== req.user.id && req.user.role !== 'admin')) return res.status(403).json({ error: 'No autorizado o no encontrado' });

        await pool.query('DELETE FROM email_sequences WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Upsert mensaje individual por sequence_id y day_index
router.post('/email/messages/upsert', authMiddleware, async (req, res) => {
    const { sequenceId, dayIndex, subject, contentHtml, type, pilarType, purpose, redirectType, redirectUrl } = req.body;
    try {
        await pool.query(
            `INSERT INTO email_messages (sequence_id, day_index, subject, content_html, type, pilar_type, purpose, is_generated, redirect_type, redirect_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
             ON DUPLICATE KEY UPDATE 
                subject = COALESCE(?, subject),
                content_html = COALESCE(?, content_html),
                type = COALESCE(?, type),
                pilar_type = COALESCE(?, pilar_type),
                purpose = COALESCE(?, purpose),
                is_generated = 1,
                redirect_type = COALESCE(?, redirect_type),
                redirect_url = COALESCE(?, redirect_url)`,
            [
                sequenceId, dayIndex, subject, contentHtml, type, pilarType || 'Nutrición', purpose || 'Contenido de Valor', redirectType || null, redirectUrl || null,
                subject, contentHtml, type, pilarType || 'Nutrición', purpose || 'Contenido de Valor', redirectType || null, redirectUrl || null
            ]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Obtener mensajes de una secuencia
router.get('/email/sequences/:id/messages', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM email_messages WHERE sequence_id = ? ORDER BY day_index ASC',
            [req.params.id]
        );
        res.json(rows.map(m => ({
            ...m,
            id: String(m.id),
            dayIndex: m.day_index,
            pilarType: m.pilar_type,
            contentHtml: m.content_html,
            isGenerated: !!m.is_generated,
            redirectType: m.redirect_type,
            redirectUrl: m.redirect_url
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Actualizar mensaje individual
router.put('/email/messages/:id', authMiddleware, async (req, res) => {
    const { subject, pilar_type, purpose, content_html, is_generated, type, redirect_type, redirect_url } = req.body;
    try {
        await pool.query(
            `UPDATE email_messages SET 
                subject = COALESCE(?, subject),
                pilar_type = COALESCE(?, pilar_type),
                purpose = COALESCE(?, purpose),
                content_html = COALESCE(?, content_html),
                is_generated = COALESCE(?, is_generated),
                type = COALESCE(?, type),
                redirect_type = COALESCE(?, redirect_type),
                redirect_url = COALESCE(?, redirect_url)
             WHERE id = ?`,
            [subject, pilar_type, purpose, content_html, is_generated, type, redirect_type, redirect_url, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
/* Fin de actualización - 24/06/2024 16:20 */

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

/**
 * Obtiene el modo del sistema (Producción o Lanzamiento)
 */
router.get('/system/mode', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'system_mode'");
        const mode = rows.length > 0 ? rows[0].setting_value : 'production';
        res.json({ mode });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

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

/* Actualización: El endpoint de sincronización masiva ahora acepta un tagId opcional para vincular a todos los leads seleccionados a esa etiqueta específica durante el envío - 30/06/2025 15:30 */
////////// Actualización: Endpoint para sincronización manual de leads pendientes con Systeme.io - 07/06/2025 19:40 //////////
router.post('/system/integrations/sync-pending', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { tagId } = req.body;
        
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
                const contactResponse = await systemeIoService.addContact(settings.systemeIoKey, lead.email, lead.name || 'Prospecto');
                
                // Si hay tagId, asignamos etiqueta individualmente
                const contactId = contactResponse?.contact?.id || contactResponse?.contact?.contact?.id || contactResponse?.id;
                if (tagId && contactId) {
                    try {
                        await systemeIoService.addTagToContact(settings.systemeIoKey, contactId, tagId);
                    } catch (tagErr) {
                        console.warn(`[Mass Sync Tag Assignment Warn] Lead ID ${lead.id}:`, tagErr.message);
                    }
                }

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

        ////////// Actualización: Implementación de extracción inteligente de ID (buscando en contact.id, contact.contact.id e id directo) para máxima compatibilidad con las variaciones de la API de Systeme.io - 25/05/2025 15:50 //////////
        const finalContactId = contactResponse?.contact?.id || contactResponse?.contact?.contact?.id || contactResponse?.id;
        ////////// Fin de actualización - 25/05/2025 15:50 //////////

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

/**
 * Crea un ticket de soporte para solicitudes de eliminación de activos
 */
router.post('/support/tickets', authMiddleware, async (req, res) => {
    const { itemName, reason } = req.body;
    if (!itemName || !reason) return res.status(400).json({ error: "Faltan datos de la solicitud." });

    try {
        const [userRows] = await pool.query("SELECT name FROM users WHERE id = ?", [req.user.id]);
        const userName = userRows[0]?.name || 'Usuario';
        
        await pool.query(
            "INSERT INTO support_tickets (user_id, user_name, user_email, item_name, reason, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [req.user.id, userName, req.user.email, itemName, reason]
        );
        res.json({ success: true });
    } catch (e) {
        console.error("[Support Ticket Error]", e);
        res.status(500).json({ error: "Error al procesar la solicitud de soporte." });
    }
});

export default router;