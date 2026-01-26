
const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');

const router = express.Router();

/**
 * Inicializador de los 14 momentos estratégicos
 */
const DEFAULT_LAUNCH_MESSAGES = [
    { id: 'wl1', name: 'Confirmación de Fecha', momentText: 'Día -7', objective: 'Generar expectativa y agendar al lead.', content: '', isGenerated: false },
    { id: 'wl2', name: 'Historia de Autoridad', momentText: 'Día -5', objective: 'Crear conexión emocional con la experta.', content: '', isGenerated: false },
    { id: 'wl3', name: 'Temario y Promesa', momentText: 'Día -3', objective: 'Elevar el valor percibido de la clase.', content: '', isGenerated: false },
    { id: 'wl4', name: 'Adelanto (3 Errores)', momentText: 'Día -1', objective: 'Entregar valor previo para generar compromiso.', content: '', isGenerated: false },
    { id: 'wl5', name: '¡Hoy es el gran día!', momentText: 'Día Clase (AM)', objective: 'Recordatorio matutino.', content: '', isGenerated: false },
    { id: 'wl6', name: 'Cuenta Regresiva (T-4h)', momentText: 'Día Clase (PM)', objective: 'Instrucciones de preparación.', content: '', isGenerated: false },
    { id: 'wl7', name: '¡Estamos en Vivo!', momentText: 'Día Clase (Link)', objective: 'Acceso directo a la transmisión.', content: '', isGenerated: false },
    { id: 'wl8', name: 'Oferta Abierta', momentText: 'Post-Clase', objective: 'Apertura de inscripciones.', content: '', isGenerated: false },
    { id: 'wl9', name: 'Bonos de Acción Rápida', momentText: 'Urgencia 1', objective: 'Presión por los regalos exclusivos.', content: '', isGenerated: false },
    { id: 'wl10', name: 'Tutorial de Pago', momentText: 'Soporte', objective: 'Eliminar fricción técnica en el checkout.', content: '', isGenerated: false },
    { id: 'wl11', name: 'Certificado y Garantía', momentText: 'Garantía', objective: 'Seguridad y aval profesional.', content: '', isGenerated: false },
    { id: 'wl12', name: 'Últimos Cupos', momentText: 'Cierre', objective: 'Escasez máxima y resolución de dudas.', content: '', isGenerated: false },
    { id: 'wl13', name: 'Inscripciones Cerradas', momentText: 'Final', objective: 'Mantener la integridad de la oferta.', content: '', isGenerated: false },
    { id: 'wl14', name: 'Bienvenida', momentText: 'Bienvenida', objective: 'Bienvenida a las nuevas alumnas.', content: '', isGenerated: false }
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
        if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Crear lanzamiento
router.post('/launches', authMiddleware, async (req, res) => {
    const { projectId, name } = req.body;
    if (!projectId) return res.status(400).json({ error: "Falta ID de proyecto" });

    try {
        // Verificar existencia previa
        const [existing] = await pool.query(
            'SELECT id FROM whatsapp_lanzamientos WHERE user_id = ? AND project_id = ? LIMIT 1',
            [req.user.id, projectId]
        );

        if (existing.length > 0) {
            return res.json({ id: existing[0].id });
        }

        // Crear registro inicial con JSON por defecto
        const [result] = await pool.query(
            'INSERT INTO whatsapp_lanzamientos (user_id, project_id, name, status, data_json) VALUES (?, ?, ?, "borrador", ?)',
            [req.user.id, projectId, name || 'Lanzamiento WhatsApp', JSON.stringify(DEFAULT_LAUNCH_MESSAGES)]
        );

        res.json({ id: result.insertId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Actualizar lanzamiento (Nombre, Status o JSON de mensajes)
router.put('/launches/:id', authMiddleware, async (req, res) => {
    const { name, status, data_json } = req.body;
    try {
        const [check] = await pool.query('SELECT id FROM whatsapp_lanzamientos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });

        await pool.query(
            `UPDATE whatsapp_lanzamientos SET 
                name = COALESCE(?, name),
                status = COALESCE(?, status),
                data_json = COALESCE(?, data_json)
             WHERE id = ?`,
            [name, status, data_json, req.params.id]
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
