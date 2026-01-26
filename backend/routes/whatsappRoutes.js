
const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');

const router = express.Router();

// Obtener secuencias de WhatsApp Lanzamiento del usuario
router.get('/sequences', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT ws.*, p.name as project_name 
             FROM whatsapp_launch_sequences ws 
             JOIN projects p ON ws.project_id = p.id 
             WHERE ws.user_id = ? ORDER BY ws.created_at DESC`,
            [req.user.id]
        );

        const sequencesWithMessages = await Promise.all(rows.map(async (seq) => {
            const [msgRows] = await pool.query(
                `SELECT moment_id FROM whatsapp_launch_messages WHERE sequence_id = ? AND is_generated = 1`,
                [seq.id]
            );
            return {
                ...seq,
                projectName: seq.project_name,
                generatedMessages: msgRows.map(m => m.moment_id)
            };
        }));

        res.json(sequencesWithMessages);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Crear o recuperar secuencia de WhatsApp para un proyecto
router.post('/sequences', authMiddleware, async (req, res) => {
    const { projectId, name } = req.body;
    if (!projectId) return res.status(400).json({ error: "Falta ID de proyecto" });

    try {
        // Verificar si ya existe
        const [existing] = await pool.query(
            'SELECT id FROM whatsapp_launch_sequences WHERE user_id = ? AND project_id = ? LIMIT 1',
            [req.user.id, projectId]
        );

        if (existing.length > 0) {
            return res.json({ id: existing[0].id, isNew: false });
        }

        // Crear nueva
        const [result] = await pool.query(
            'INSERT INTO whatsapp_launch_sequences (user_id, project_id, name, status) VALUES (?, ?, ?, "borrador")',
            [req.user.id, projectId, name || 'Lanzamiento WhatsApp']
        );
        const sequenceId = result.insertId;

        // Momentos predefinidos (wl1 a wl14)
        const moments = [
            { id: 'wl1', name: 'Confirmación de Fecha', moment: 'Día -7', objective: 'Generar expectativa y agendar al lead.' },
            { id: 'wl2', name: 'Historia de Autoridad', moment: 'Día -5', objective: 'Crear conexión emocional con la experta.' },
            { id: 'wl3', name: 'Temario y Promesa', moment: 'Día -3', objective: 'Elevar el valor percibido de la clase.' },
            { id: 'wl4', name: 'Adelanto (3 Errores)', moment: 'Día -1', objective: 'Entregar valor previo para generar compromiso.' },
            { id: 'wl5', name: '¡Hoy es el gran día!', moment: 'Día Clase (AM)', objective: 'Recordatorio matutino.' },
            { id: 'wl6', name: 'Cuenta Regresiva (T-4h)', moment: 'Día Clase (PM)', objective: 'Instrucciones de preparación.' },
            { id: 'wl7', name: '¡Estamos en Vivo!', moment: 'Día Clase (Link)', objective: 'Acceso directo a la transmisión.' },
            { id: 'wl8', name: 'Oferta Abierta', moment: 'Post-Clase', objective: 'Apertura de inscripciones.' },
            { id: 'wl9', name: 'Bonos de Acción Rápida', moment: 'Urgencia 1', objective: 'Presión por los regalos exclusivos.' },
            { id: 'wl10', name: 'Tutorial de Pago', moment: 'Soporte', objective: 'Eliminar fricción técnica en el checkout.' },
            { id: 'wl11', name: 'Certificado y Garantía', moment: 'Garantía', objective: 'Seguridad y aval profesional.' },
            { id: 'wl12', name: 'Últimos Cupos', moment: 'Cierre', objective: 'Escasez máxima y resolución de dudas.' },
            { id: 'wl13', name: 'Inscripciones Cerradas', moment: 'Final', objective: 'Mantener la integridad de la oferta.' },
            { id: 'wl14', name: 'Bienvenida', moment: 'Bienvenida', objective: 'Bienvenida a las nuevas alumnas.' }
        ];

        for (const m of moments) {
            await pool.query(
                `INSERT INTO whatsapp_launch_messages (sequence_id, moment_id, name, moment_text, objective, content, is_generated) 
                 VALUES (?, ?, ?, ?, ?, "", 0)`,
                [sequenceId, m.id, m.name, m.moment, m.objective]
            );
        }

        res.json({ id: sequenceId, isNew: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Eliminar secuencia
router.delete('/sequences/:id', authMiddleware, async (req, res) => {
    try {
        const [check] = await pool.query('SELECT id FROM whatsapp_launch_sequences WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (check.length === 0) return res.status(403).json({ error: 'No autorizado o no encontrado' });

        await pool.query('DELETE FROM whatsapp_launch_sequences WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Obtener mensajes de una secuencia
router.get('/sequences/:id/messages', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM whatsapp_launch_messages WHERE sequence_id = ? ORDER BY id ASC',
            [req.params.id]
        );
        res.json(rows.map(m => ({
            ...m,
            id: String(m.id),
            momentId: m.moment_id,
            momentText: m.moment_text,
            isGenerated: !!m.is_generated
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Actualizar mensaje individual
router.put('/messages/:id', authMiddleware, async (req, res) => {
    const { content, is_generated } = req.body;
    try {
        await pool.query(
            `UPDATE whatsapp_launch_messages SET 
                content = COALESCE(?, content),
                is_generated = COALESCE(?, is_generated)
             WHERE id = ?`,
            [content, is_generated, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
