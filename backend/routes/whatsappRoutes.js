import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { generateContent } from '../geminiService.js';

const router = express.Router();

const DEFAULT_LAUNCH_MESSAGES = [
    // FASE 1: Anticipación y Autoridad (Días previos)
    { id: 'wl1', name: 'Bienvenida y Confirmación de Fecha', momentText: 'Día -7', pilarType: 'Seguridad', purpose: 'Confirmar que están en el lugar correcto, dar las gracias y fijar la fecha/hora del evento en el calendario mental del usuario.', objective: 'Confirmar lugar, dar gracias, fijar fecha/hora.', content: '', isGenerated: false },
    { id: 'wl2', name: 'Historia de Autoridad (Storytelling)', momentText: 'Día -5', pilarType: 'Empatía y Confianza', purpose: 'Quién es el experto, sus fracasos iniciales y cómo el método que va a enseñar cambió su vida. Humaniza la marca.', objective: 'Conectar emocionalmente con la experta.', content: '', isGenerated: false },
    { id: 'wl3', name: 'El "Qué" vs el "Cómo" (Curiosidad)', momentText: 'Día -3', pilarType: 'Valor Percibido', purpose: 'Revelar los temas que se verán en la clase. Prometer un secreto o técnica específica que no encontrarán en YouTube.', objective: 'Elevar el valor percibido de la clase.', content: '', isGenerated: false },
    { id: 'wl4', name: 'Los 3 Errores Fatales', momentText: 'Día -1', pilarType: 'Conciencia del Dolor', purpose: 'Identificar qué están haciendo mal los leads hoy. Esto posiciona al experto como la única solución para dejar de perder tiempo/dinero.', objective: 'Entregar valor previo para generar compromiso.', content: '', isGenerated: false },
    
    // FASE 2: El Día del Evento
    { id: 'wl5', name: 'Recordatorio Matutino', momentText: 'Día Clase (AM)', pilarType: 'Entusiasmo', purpose: '¡Llegó el día!. Confirmar horarios por países para evitar confusiones.', objective: 'Recordatorio matutino.', content: '', isGenerated: false },
    { id: 'wl6', name: 'Instrucciones de Preparación (T-4h)', momentText: 'Día Clase (PM)', pilarType: 'Compromiso', purpose: 'Pedir que preparen libreta, café y eliminen distracciones. Crea un ritual en torno a la clase.', objective: 'Instrucciones de preparación.', content: '', isGenerated: false },
    { id: 'wl7', name: '¡Estamos en Vivo! (El Link)', momentText: 'Día Clase (Link)', pilarType: 'Acción Inmediata', purpose: 'Enlace directo a YouTube/Zoom/VSL. Corto, al grano y con muchos emojis de alerta.', objective: 'Acceso directo a la transmisión.', content: '', isGenerated: false },
    
    // FASE 3: Apertura y Conversión
    { id: 'wl8', name: 'Apertura de Carrito y Oferta Irresistible', momentText: 'Post-Clase', pilarType: 'Lanzamiento', purpose: 'Revelar el precio especial de lanzamiento, los bonos y el enlace de Hotmart.', objective: 'Apertura de inscripciones.', content: '', isGenerated: false },
    { id: 'wl9', name: 'Bonos de Acción Rápida (Urgencia)', momentText: 'Urgencia 1', pilarType: 'Beneficio extra', purpose: 'Regalo extra solo para las primeras X personas que compren en las próximas 2 horas.', objective: 'Presión por los regalos exclusivos.', content: '', isGenerated: false },
    { id: 'wl10', name: 'Tutorial de Pago y Soporte', momentText: 'Soporte', pilarType: 'Eliminación de Fricción', purpose: 'Explicar cómo pagar (tarjeta, PayPal, efectivo) y dejar el link de contacto directo para dudas.', objective: 'Eliminar fricción técnica en el checkout.', content: '', isGenerated: false },
    
    // FASE 4: Cierre y Escasez
    { id: 'wl11', name: 'Prueba Social Dinámica', momentText: 'Validación', pilarType: 'Validación', purpose: 'Mostrar capturas de pantalla de nuevos alumnos o testimonios rápidos. "Si ellos pudieron, tú también".', objective: 'Validación de resultados.', content: '', isGenerated: false },
    { id: 'wl12', name: 'Garantía y Seguridad', momentText: 'Garantía', pilarType: 'Riesgo Cero', purpose: 'Recordar los 7 o 15 días de garantía de Hotmart. Derriba el miedo al fraude.', objective: 'Seguridad y aval profesional.', content: '', isGenerated: false },
    { id: 'wl13', name: 'Última Llamada (Faltan 4 horas)', momentText: 'Cierre', pilarType: 'Escasez Real', purpose: 'El contador llega a cero. Los bonos desaparecen y el precio subirá.', objective: 'Escasez máxima y resolución de dudas.', content: '', isGenerated: false },
    { id: 'wl14', name: 'Inscripciones Cerradas y Bienvenida', momentText: 'Bienvenida', pilarType: 'Integridad de Marca', purpose: 'Avisar que ya no se puede comprar. Da la bienvenida oficial a los nuevos alumnos (onboarding).', objective: 'Bienvenida a las nuevas alumnas.', content: '', isGenerated: false }
];

// Rutas privadas para gestión de lanzamientos
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

router.get('/launches/by-project/:projectId', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT wl.*, p.name as project_name 
             FROM whatsapp_lanzamientos wl 
             JOIN projects p ON wl.project_id = p.id 
             WHERE wl.user_id = ? AND wl.project_id = ? LIMIT 1`,
            [req.user.id, req.params.projectId]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/launches', authMiddleware, async (req, res) => {
    const { projectId, name } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO whatsapp_lanzamientos (user_id, project_id, name, status, data_json) VALUES (?, ?, ?, "borrador", ?)',
            [req.user.id, projectId, name || 'Nuevo Lanzamiento', JSON.stringify(DEFAULT_LAUNCH_MESSAGES)]
        );
        res.json({ id: result.insertId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/launches/:id', authMiddleware, async (req, res) => {
    const { messages, launchDate, name, status } = req.body;
    try {
        const fields = [];
        const params = [];

        if (messages) { fields.push('data_json = ?'); params.push(JSON.stringify(messages)); }
        if (launchDate) { fields.push('launch_date = ?'); params.push(launchDate); }
        if (name) { fields.push('name = ?'); params.push(name); }
        if (status) { fields.push('status = ?'); params.push(status); }

        if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });

        params.push(req.params.id, req.user.id);
        await pool.query(
            `UPDATE whatsapp_lanzamientos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
            params
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/launches/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM whatsapp_lanzamientos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Endpoint crítico para generación de mensajes con IA
router.post('/launches/generate-message', authMiddleware, async (req, res) => {
    const { projectId, momentId } = req.body;
    if (!projectId || !momentId) return res.status(400).json({ error: "Datos incompletos" });

    try {
        const [projRows] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
        if (projRows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        const project = projRows[0];

        const moment = DEFAULT_LAUNCH_MESSAGES.find(m => m.id === momentId);
        if (!moment) return res.status(404).json({ error: "Momento no válido" });

        const prompt = `Actúa como un experto en lanzamientos de WhatsApp y copywriting persuasivo.
        Genera un mensaje para el momento: "${moment.name}".
        Pilar estratégico: "${moment.pilarType}".
        Propósito: "${moment.purpose}".
        
        Contexto del Proyecto:
        - Producto: "${project.product_name}"
        - Nicho: "${project.niche}"
        - Tono de marca: "${project.brand_tone}"
        
        REGLAS:
        1. Usa emojis de forma estratégica.
        2. Usa formato de WhatsApp (negritas con *texto*).
        3. Si es un recordatorio de clase, usa el placeholder [FECHA_CLASE].
        4. El mensaje debe ser corto pero muy persuasivo.
        5. Máximo 150 palabras.
        
        Responde SOLO con el texto del mensaje.`;

        const generatedText = await generateContent('gemini-3-flash-preview', prompt);

        res.json({ 
            message: generatedText, 
            strategicPurpose: moment.purpose 
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;