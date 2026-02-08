
const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');

const router = express.Router();

/**
 * Inicializador de los 14 momentos estratégicos con pilares y propósitos detallados según la nueva estructura de 4 fases.
 */
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

        const [userData] = await pool.query('SELECT plan_limits, role FROM users WHERE id = ?', [req.user.id]);
        const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : null;
        
        if (userData[0]?.role !== 'admin' && limits) {
            const [countRows] = await pool.query('SELECT COUNT(*) as total FROM whatsapp_lanzamientos WHERE user_id = ?', [req.user.id]);
            const maxAllowed = limits.maxWhatsAppLaunches || 1;
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} lanzamientos de tu plan.` });
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

// Actualizar lanzamiento
router.put('/launches/:id', authMiddleware, async (req, res) => {
    const { name, status, data_json, launch_date } = req.body;
    try {
        const [check] = await pool.query('SELECT id FROM whatsapp_lanzamientos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });

        await pool.query(
            `UPDATE whatsapp_lanzamientos SET 
                name = COALESCE(?, name),
                status = COALESCE(?, status),
                data_json = COALESCE(?, data_json),
                launch_date = COALESCE(?, launch_date)
             WHERE id = ?`,
            [name, status, data_json, launch_date, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Eliminar lanzamiento
router.delete('/launches/:id', authMiddleware, async (req, res) => {
    try {
        const [check] = await pool.query('SELECT id FROM whatsapp_lanzamientos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });

        await pool.query('DELETE FROM whatsapp_lanzamientos WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
