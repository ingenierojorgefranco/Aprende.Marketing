import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_LIMITS, getEffectiveLimits } from './authRoutes.js';

import { WHATSAPP_BLUEPRINTS, GLOBAL_CONFIG } from '../prompts/whatsapp/whatsappblueprint.js';

const router = express.Router();

/**
 * Inicializador de los 12 momentos estratégicos con pilares y propósitos detallados
 */
const DEFAULT_LAUNCH_MESSAGES = [
    { id: 'wl1', name: 'Bienvenida + Fecha (Día -7)', momentText: 'Día -7', objective: 'Confirmar que está en el lugar correcto y fijar la fecha del evento en su mente.', pilarType: 'Bienvenida y Valor', purpose: 'Este mensaje sirve para reducir la incertidumbre del prospecto al confirmar su ingreso al grupo.\n\nLograrás fijar la fecha del evento en su mente y generar el primer micro-compromiso, asegurando que no se olvide de la cita y aumentando la tasa de retención inicial.', content: '', isGenerated: false },
    { id: 'wl2', name: 'Historia / Autoridad (Día -5)', momentText: 'Día -5', objective: 'Humanizar al experto y generar conexión emocional.', pilarType: 'Autoridad y Conexión', purpose: 'Sirve para humanizar la marca y generar una conexión emocional profunda.\n\nAl compartir tu historia y autoridad, lograrás que el usuario confíe en tu guía, se sienta identificado con tus desafíos y te vea como la persona capaz de llevarlo al resultado que busca.', content: '', isGenerated: false },
    { id: 'wl3', name: 'Curiosidad (Día -3)', momentText: 'Día -3', objective: 'Generar intriga sobre lo que se enseñará en el evento.', pilarType: 'Curiosidad y Deseo', purpose: 'Este mensaje tiene como fin despertar una intriga irresistible sobre el contenido del evento.\n\nLograrás que el usuario anticipe la clase con entusiasmo, elevando el valor percibido de lo que vas a enseñar y manteniendo el interés alto durante la fase de espera.', content: '', isGenerated: false },
    { id: 'wl4', name: 'Errores (Día -1)', momentText: 'Día -1', objective: 'Mostrarle al usuario que está cometiendo errores fatales.', pilarType: 'Conciencia del Problema', purpose: 'Sirve para agitar el problema del prospecto mostrando los errores comunes que lo detienen.\n\nLograrás generar una necesidad urgente de cambio, posicionando tu evento como la solución necesaria para dejar de perder tiempo o dinero.', content: '', isGenerated: false },
    { id: 'wl5', name: 'Recordatorio (Mañana)', momentText: 'Día Clase (AM)', objective: 'Recordar el evento del día de hoy.', pilarType: 'Recordatorio y Logística', purpose: 'Este mensaje asegura que el evento sea la prioridad número uno del usuario en su día.\n\nLograrás reducir drásticamente los olvidos de última hora y maximizar la tasa de asistencia al recordar la importancia de estar presente en vivo.', content: '', isGenerated: false },
    { id: 'wl6', name: 'Preparación (Horas antes)', momentText: 'Día Clase (PM)', objective: 'Preparar al usuario mentalmente para la clase.', pilarType: 'Preparación y Compromiso', purpose: 'Sirve para elevar el nivel de compromiso minutos antes de empezar.\n\nLograrás que el usuario despeje su agenda, prepare papel y lápiz, y entre a la clase con una mentalidad de aprendizaje activo, lo que facilita la posterior conversión.', content: '', isGenerated: false },
    { id: 'wl7', name: 'Link en Vivo', momentText: 'Día Clase (Link)', objective: 'Llevar tráfico directo al evento en vivo.', pilarType: 'Acceso al Evento', purpose: 'Este es el mensaje de acción inmediata. Sirve para eliminar cualquier fricción técnica proporcionando el acceso directo.\n\nLograrás una entrada masiva de asistentes en los primeros minutos, generando el impulso necesario para un lanzamiento exitoso.', content: '', isGenerated: false },
    { id: 'wl8', name: 'Oferta + Link (Post-clase)', momentText: 'Post-Clase', objective: 'Presentar la oferta de forma clara y directa.', pilarType: 'Presentación de Oferta', purpose: 'Sirve para capturar el pico máximo de emoción tras la clase.\n\nAl presentar la oferta con claridad, lograrás convertir a los prospectos más decididos de inmediato, asegurando las primeras ventas y validando la propuesta comercial.', content: '', isGenerated: false },
    { id: 'wl9', name: 'Bonos + Resolución de dudas', momentText: 'Urgencia 1', objective: 'Acelerar la decisión de compra y eliminar fricción técnica.', pilarType: 'Bonos y Objeciones', purpose: 'Este mensaje sirve para derribar las barreras mentales y técnicas que frenan la compra.\n\nAl introducir bonos exclusivos y resolver dudas, lograrás que los indecisos den el paso final, reduciendo el abandono del carrito de compras.', content: '', isGenerated: false },
    { id: 'wl10', name: 'Prueba social', momentText: 'Validación', objective: 'Mostrar que otros ya compraron y están teniendo resultados.', pilarType: 'Prueba Social y Validación', purpose: 'Sirve para activar el disparador mental de la prueba social.\n\nAl mostrar resultados de otros alumnos, lograrás eliminar el miedo al fracaso del prospecto y generar un deseo de pertenencia a una comunidad que ya está teniendo éxito.', content: '', isGenerated: false },
    { id: 'wl11', name: 'Garantía', momentText: 'Garantía', objective: 'Eliminar el riesgo percibido por el comprador.', pilarType: 'Garantía y Seguridad', purpose: 'Este mensaje tiene como fin eliminar el riesgo financiero de la mente del comprador.\n\nAl enfatizar la garantía, lograrás que el usuario sienta que no tiene nada que perder, facilitando un "sí" basado en la seguridad y la confianza total en el producto.', content: '', isGenerated: false },
    { id: 'wl12', name: 'Última llamada', momentText: 'Cierre', objective: 'Forzar la decisión inmediata antes del cierre.', pilarType: 'Urgencia y Cierre', purpose: 'Sirve para activar la urgencia real por escasez de tiempo.\n\nLograrás disparar las ventas de último momento al dejar claro que la oportunidad se cierra definitivamente, forzando a los procrastinadores a tomar una decisión ahora mismo.', content: '', isGenerated: false }
];

// Obtener todos los lanzamientos del usuario
router.get('/launches', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT wl.*, p.name as project_name 
             FROM whatsapp_lanzamientos wl 
             JOIN projects p ON wl.project_id = p.id 
             WHERE wl.user_id = ? ORDER BY wl.created_at DESC`,
            [req.user.id]
        );
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Obtener lanzamiento por ID de proyecto
router.get('/launches/by-project/:projectId', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT wl.*, p.name as project_name 
             FROM whatsapp_lanzamientos wl 
             JOIN projects p ON wl.project_id = p.id 
             WHERE wl.user_id = ? AND wl.project_id = ? LIMIT 1`,
            [req.user.id, req.params.projectId]
        );
        if (rows.length === 0) return res.json(null);
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Crear lanzamiento con validación de límites
router.post('/launches', authMiddleware, async (req, res) => {
    const { projectId, name } = req.body;
    if (!projectId) return res.status(400).json({ error: "Falta ID de proyecto" });

    try {
        const [existing] = await pool.query(
            'SELECT id FROM whatsapp_lanzamientos WHERE user_id = ? AND project_id = ? LIMIT 1',
            [req.user.id, projectId]
        );

        if (existing.length > 0) {
            return res.json({ id: existing[0].id });
        }

        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxWhatsAppLaunches;
        
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query('SELECT COUNT(*) as total FROM whatsapp_lanzamientos WHERE user_id = ?', [req.user.id]);
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} lanzamientos en tu plan.` });
            }
        }

        const [result] = await pool.query(
            'INSERT INTO whatsapp_lanzamientos (user_id, project_id, name, status, data_json) VALUES (?, ?, ?, "borrador", ?)',
            [req.user.id, projectId, name || 'Lanzamiento WhatsApp', JSON.stringify(DEFAULT_LAUNCH_MESSAGES)]
        );

        res.json({ id: result.insertId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Endpoint de generación con IA
router.post('/launches/generate-message', authMiddleware, async (req, res) => {
    const { projectId, momentId } = req.body;
    if (!projectId || !momentId) return res.status(400).json({ error: "Faltan parámetros" });

    try {
        const [projRows] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
        if (projRows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        const project = projRows[0];
        const strategy = JSON.parse(project.strategy_json || "{}");

        const moment = DEFAULT_LAUNCH_MESSAGES.find(m => m.id === momentId);
        if (!moment) return res.status(404).json({ error: "Momento no válido" });

        const blueprint = WHATSAPP_BLUEPRINTS[moment.pilarType] || WHATSAPP_BLUEPRINTS['default'];

        const ai = new GoogleGenAI({ 
            apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const prompt = `Actúa como un Copywriter Senior experto en Lanzamientos Meteóricos por WhatsApp y Marketing Digital. 
        Tu misión es redactar un mensaje extremadamente persuasivo adaptado 100% al PRODUCTO DIGITAL y PROYECTO específico del usuario, siguiendo estrictamente el siguiente BLUEPRINT ESTRATÉGICO:

        --- BLUEPRINT DEL MENSAJE ---
        OBJETIVO PSICOLÓGICO: ${blueprint.goal}
        ESTRUCTURA RECOMENDADA:
        ${blueprint.structure}
        TIPS DE COPYWRITING:
        ${blueprint.copywritingTips}
        EJEMPLO DE REFERENCIA:
        ${blueprint.example}
        ---------------------------

        INFORMACIÓN DEL PROYECTO Y PRODUCTO DIGITAL:
        - Nombre del Proyecto: ${project.name}
        - Nicho / Mercado: ${project.niche || 'General'}
        - Producto Digital: ${project.product_name || project.name}
        - Tono de Marca: ${project.brand_tone || 'Cercano y persuasivo'}
        - Avatar de Cliente Ideal: ${JSON.stringify(strategy.avatar || strategy.avatars?.[0] || {})}
        - Promesa / Transformación del Producto: ${strategy.promise || strategy.transformation || 'Transformación rápida y efectiva en su nicho'}
        - Dolores / Obstáculos del Avatar: ${JSON.stringify(strategy.pains || strategy.avatar_pains || [])}
        - Mecanismo Único / Método: ${strategy.unique_mechanism || strategy.method || 'Método probado paso a paso'}
        
        DETALLES DEL MOMENTO DE LANZAMIENTO:
        - Momento: ${moment.name} (${moment.momentText})
        - Pilar Estratégico: ${moment.pilarType}
        - Propósito Específico: ${moment.purpose}

        REGLAS GLOBALES DE CONFIGURACIÓN:
        - TONO: ${GLOBAL_CONFIG.tone}
        - FORMATO: ${GLOBAL_CONFIG.formatting}
        - EVITAR: ${GLOBAL_CONFIG.avoid}

        REGLAS CRÍTICAS DE COPYWRITING Y WHATSAPP:
        1. ENFOQUE EXCLUSIVAMENTE GRUPAL Y EN PLURAL: El mensaje se enviará a un GRUPO DE WHATSAPP masivo. Dirígete SIEMPRE a la comunidad o tribu del producto en plural (ejemplo: '¡Hola a todos!', 'equipo', 'comunidad de [Nicho]', 'chicas/chicos', 'para ustedes'). Queda ESTRICTAMENTE PROHIBIDO redactar el mensaje en singular de 'tú a tú' (EVITAR: 'te escribo', 'espero que estés bien', 'para ti', 'te cuento').
        2. ENFOQUE DINÁMICO EN EL PRODUCTO ESPECÍFICO: Adapta el mensaje estrictamente a la temática, dolores y beneficios del producto digital "${project.product_name || project.name}" y su nicho "${project.niche}". NUNCA uses respuestas predeterminadas de otros nichos. Bautiza o nombra a la tribu de forma coherente con su área (ej: Reposteras, Inversionistas, Emprendedores, Atletas, Creadores, etc.).
        3. GANCHO MÓVIL AIDA: Las primeras 5 a 7 palabras del mensaje DEBEN ser un gancho AIDA de alto impacto, intrigante o de alerta, fácil de leer desde la vista previa de notificaciones del celular (ej: '¡LLEGÓ EL GRAN DÍA COMUNIDAD! 🎉', 'CONFESIÓN PARA TODO EL GRUPO... 💔', '¿SABÍAN QUE EL 90% COMETE ESTE ERROR? 😱').
        4. MICRO-INTERACCIONES Y ENGAGEMENT: Cierra o incluye en el mensaje un llamado a la acción interactivo solicitando que los miembros del grupo reaccionen con un emoji específico (ej: 'Reaccionen con 🔥 si ya agendaron', 'Déjenme un 👍 los que estén listos', 'Reaccionen con ⏰').
        5. FORMATO DE TEXTO WHATSAPP: Párrafos súper cortos (1-2 líneas máximo), uso estratégico de *negritas* para resaltar ideas clave, y emojis como viñetas visuales.
        6. REGLA ESTRICTA DE ENLACES [LINK]:
           - Para momentos pre-evento ("wl1", "wl2", "wl3", "wl4", "wl5", "wl6"): ESTRICTAMENTE PROHIBIDO usar el placeholder [LINK] o mencionar URLs. Ninguno de estos 6 mensajes debe incluir enlaces.
           - Para el evento en vivo ("wl7"): DEBES usar el placeholder [LINK] como enlace de la transmisión en vivo.
           - Para momentos post-clase y ventas ("wl8", "wl9", "wl10", "wl11", "wl12"): DEBES incluir el placeholder [LINK] para dirigir al grupo a la página de inscripción / compra / oferta.
        7. PLACEHOLDERS DE FECHA Y HORA: Usa [FECHA_CLASE] si el mensaje confirma o recuerda la fecha de la clase, y [HORA_EVENTO] si especifica el horario.
        8. SIN FIRMAS O PLACEHOLDERS DE NOMBRE: Nunca agregues [TU NOMBRE], [FIRMA] o [NOMBRE DEL EXPERTO] al final del mensaje.
        
        Responde exclusivamente con el texto final del mensaje generado listo para copiar y pegar directamente al grupo de WhatsApp.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        res.json({ 
            message: response.text,
            strategicPurpose: moment.purpose
        });
    } catch (error) {
        console.error("IA WhatsApp Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint de generación de secuencia completa
router.post('/launches/generate-full-sequence', authMiddleware, async (req, res) => {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: "Faltan parámetros" });

    try {
        const [projRows] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
        if (projRows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        const project = projRows[0];
        const strategy = JSON.parse(project.strategy_json || "{}");

        const ai = new GoogleGenAI({ 
            apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const generatedMessages = [];

        // Generamos los 12 mensajes uno por uno usando sus blueprints
        for (const moment of DEFAULT_LAUNCH_MESSAGES) {
            const blueprint = WHATSAPP_BLUEPRINTS[moment.pilarType] || WHATSAPP_BLUEPRINTS['default'];
            
            const prompt = `Actúa como un Copywriter Senior experto en Lanzamientos Meteóricos por WhatsApp y Marketing Digital. 
            Tu misión es redactar un mensaje extremadamente persuasivo adaptado 100% al PRODUCTO DIGITAL y PROYECTO específico del usuario, siguiendo strictly el siguiente BLUEPRINT ESTRATÉGICO:

            --- BLUEPRINT DEL MENSAJE ---
            OBJETIVO PSICOLÓGICO: ${blueprint.goal}
            ESTRUCTURA RECOMENDADA:
            ${blueprint.structure}
            TIPS DE COPYWRITING:
            ${blueprint.copywritingTips}
            EJEMPLO DE REFERENCIA:
            ${blueprint.example}
            ---------------------------

            INFORMACIÓN DEL PROYECTO Y PRODUCTO DIGITAL:
            - Nombre del Proyecto: ${project.name}
            - Nicho / Mercado: ${project.niche || 'General'}
            - Producto Digital: ${project.product_name || project.name}
            - Tono de Marca: ${project.brand_tone || 'Cercano y persuasivo'}
            - Avatar de Cliente Ideal: ${JSON.stringify(strategy.avatar || strategy.avatars?.[0] || {})}
            - Promesa / Transformación del Producto: ${strategy.promise || strategy.transformation || 'Transformación rápida y efectiva en su nicho'}
            - Dolores / Obstáculos del Avatar: ${JSON.stringify(strategy.pains || strategy.avatar_pains || [])}
            - Mecanismo Único / Método: ${strategy.unique_mechanism || strategy.method || 'Método probado paso a paso'}
            
            DETALLES DEL MOMENTO DE LANZAMIENTO:
            - Momento: ${moment.name} (${moment.momentText})
            - Pilar Estratégico: ${moment.pilarType}
            - Propósito Específico: ${moment.purpose}

            REGLAS GLOBALES DE CONFIGURACIÓN:
            - TONO: ${GLOBAL_CONFIG.tone}
            - FORMATO: ${GLOBAL_CONFIG.formatting}
            - EVITAR: ${GLOBAL_CONFIG.avoid}

            REGLAS CRÍTICAS DE COPYWRITING Y WHATSAPP:
            1. ENFOQUE EXCLUSIVAMENTE GRUPAL Y EN PLURAL: El mensaje se enviará a un GRUPO DE WHATSAPP masivo. Dirígete SIEMPRE a la comunidad o tribu del producto en plural (ejemplo: '¡Hola a todos!', 'equipo', 'comunidad de [Nicho]', 'chicas/chicos', 'para ustedes'). Queda ESTRICTAMENTE PROHIBIDO redactar el mensaje en singular de 'tú a tú' (EVITAR: 'te escribo', 'espero que estés bien', 'para ti', 'te cuento').
            2. ENFOQUE DINÁMICO EN EL PRODUCTO ESPECÍFICO: Adapta el mensaje strictly a la temática, dolores y beneficios del producto digital "${project.product_name || project.name}" y su nicho "${project.niche}". NUNCA uses respuestas predeterminadas de otros nichos. Bautiza o nombra a la tribu de forma coherente con su área (ej: Reposteras, Inversionistas, Emprendedores, Atletas, Creadores, etc.).
            3. GANCHO MÓVIL AIDA: Las primeras 5 a 7 palabras del mensaje DEBEN ser un gancho AIDA de alto impacto, intrigante o de alerta, fácil de leer desde la vista previa de notificaciones del celular (ej: '¡LLEGÓ EL GRAN DÍA COMUNIDAD! 🎉', 'CONFESIÓN PARA TODO EL GRUPO... 💔', '¿SABÍAN QUE EL 90% COMETE ESTE ERROR? 😱').
            4. MICRO-INTERACCIONES Y ENGAGEMENT: Cierra o incluye en el mensaje un llamado a la acción interactivo solicitando que los miembros del grupo reaccionen con un emoji específico (ej: 'Reaccionen con 🔥 si ya agendaron', 'Déjenme un 👍 los que estén listos', 'Reaccionen con ⏰').
            5. FORMATO DE TEXTO WHATSAPP: Párrafos súper cortos (1-2 líneas máximo), uso estratégico de *negritas* para resaltar ideas clave, y emojis como viñetas visuales.
            6. REGLA ESTRICTA DE ENLACES [LINK]:
               - Para momentos pre-evento ("wl1", "wl2", "wl3", "wl4", "wl5", "wl6"): ESTRICTAMENTE PROHIBIDO usar el placeholder [LINK] o mencionar URLs. Ninguno de estos 6 mensajes debe incluir enlaces.
               - Para el evento en vivo ("wl7"): DEBES usar el placeholder [LINK] como enlace de la transmisión en vivo.
               - Para momentos post-clase y ventas ("wl8", "wl9", "wl10", "wl11", "wl12"): DEBES incluir el placeholder [LINK] para dirigir al grupo a la página de inscripción / compra / oferta.
            7. PLACEHOLDERS DE FECHA Y HORA: Usa [FECHA_CLASE] si el mensaje confirma o recuerda la fecha de la clase, y [HORA_EVENTO] si especifica el horario.
            8. SIN FIRMAS O PLACEHOLDERS DE NOMBRE: Nunca agregues [TU NOMBRE], [FIRMA] o [NOMBRE DEL EXPERTO] al final del mensaje.
            
            Responde exclusivamente con el texto final del mensaje generado listo para copiar y pegar directamente al grupo de WhatsApp.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            generatedMessages.push({
                ...moment,
                content: response.text,
                purpose: moment.purpose,
                messages: [{ role: 'agent', text: response.text }],
                isGenerated: true
            });
        }

        // Guardar o actualizar en la DB
        const [existing] = await pool.query('SELECT id FROM whatsapp_lanzamientos WHERE user_id = ? AND project_id = ?', [req.user.id, projectId]);
        let launchId;
        if (existing.length > 0) {
            launchId = existing[0].id;
            await pool.query('UPDATE whatsapp_lanzamientos SET data_json = ? WHERE id = ?', [JSON.stringify(generatedMessages), launchId]);
        } else {
            const [result] = await pool.query(
                'INSERT INTO whatsapp_lanzamientos (user_id, project_id, name, status, data_json) VALUES (?, ?, ?, "borrador", ?)',
                [req.user.id, projectId, 'Lanzamiento WhatsApp', JSON.stringify(generatedMessages)]
            );
            launchId = result.insertId;
        }

        res.json({ 
            success: true,
            launchId,
            messages: generatedMessages
        });
    } catch (error) {
        console.error("Full Sequence Generation Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Actualizar lanzamiento
router.put('/launches/:id', authMiddleware, async (req, res) => {
    const { name, status, data_json, launch_date, launch_time } = req.body;
    try {
        const [check] = await pool.query('SELECT id, user_id FROM whatsapp_lanzamientos WHERE id = ?', [req.params.id]);
        if (check.length === 0 || (check[0].user_id !== req.user.id && req.user.role !== 'admin')) return res.status(403).json({ error: 'No autorizado' });

        await pool.query(
            `UPDATE whatsapp_lanzamientos SET 
                name = COALESCE(?, name),
                status = COALESCE(?, status),
                data_json = COALESCE(?, data_json),
                launch_date = COALESCE(?, launch_date),
                launch_time = COALESCE(?, launch_time)
             WHERE id = ?`,
            [name, status, data_json, launch_date, launch_time, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Eliminar lanzamiento
router.delete('/launches/:id', authMiddleware, async (req, res) => {
    try {
        const [check] = await pool.query('SELECT id, user_id FROM whatsapp_lanzamientos WHERE id = ?', [req.params.id]);
        if (check.length === 0 || (check[0].user_id !== req.user.id && req.user.role !== 'admin')) return res.status(403).json({ error: 'No autorizado' });

        await pool.query('DELETE FROM whatsapp_lanzamientos WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;