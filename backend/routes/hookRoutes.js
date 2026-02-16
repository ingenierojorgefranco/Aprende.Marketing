import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

/**
 * Obtiene los ganchos asignados a un proyecto de usuario
 */
router.get('/project/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        // Verificar si el proyecto es maestro
        const [projectRows] = await pool.query('SELECT is_master FROM projects WHERE id = ?', [projectId]);
        const isMaster = projectRows.length > 0 && !!projectRows[0].is_master;

        let rows = [];
        if (isMaster) {
            // Si es maestro, consultar la tabla master_hooks
            [rows] = await pool.query(
                'SELECT * FROM master_hooks WHERE master_project_id = ? ORDER BY created_at ASC',
                [projectId]
            );
        } else {
            // Si no es maestro, consultar la tabla project_hooks
            [rows] = await pool.query(
                'SELECT * FROM project_hooks WHERE project_id = ? ORDER BY created_at ASC',
                [projectId]
            );
        }

        res.json(rows.map(h => ({
            ...h,
            id: String(h.id),
            projectId: String(h.project_id || h.master_project_id),
            masterHookId: h.master_hook_id ? String(h.master_hook_id) : (isMaster ? String(h.id) : undefined),
            psychologicalStrategy: h.psychological_strategy,
            landingPageUrl: h.landing_page_url,
            contentJson: typeof h.content_json === 'string' ? JSON.parse(h.content_json) : h.content_json,
            isGenerated: h.is_generated !== undefined ? !!h.is_generated : !!h.content_json
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea 10 nuevos ganchos para el usuario desde la tabla maestra
 * Evita duplicados basándose en master_hook_id
 */
router.post('/unlock-more/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        // 1. Obtener el master_parent_id del proyecto para saber de qué biblioteca sacar los ganchos
        const [projRows] = await pool.query('SELECT master_parent_id FROM projects WHERE id = ?', [projectId]);
        if (projRows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        
        const masterParentId = projRows[0].master_parent_id;
        if (!masterParentId) return res.status(400).json({ error: "Este proyecto no está vinculado a una biblioteca maestra." });

        // 2. Buscar 10 ganchos en la maestra que el usuario NO tenga ya
        const [availableHooks] = await pool.query(
            `SELECT * FROM master_hooks 
             WHERE master_project_id = ? 
             AND id NOT IN (SELECT master_hook_id FROM project_hooks WHERE project_id = ? AND master_hook_id IS NOT NULL)
             LIMIT 10`,
            [masterParentId, projectId]
        );

        if (availableHooks.length === 0) {
            return res.status(404).json({ error: "No hay más ganchos disponibles en la biblioteca para este nicho." });
        }

        // 3. Clonar los ganchos al proyecto del usuario
        for (const hook of availableHooks) {
            await pool.query(
                `INSERT INTO project_hooks (project_id, master_hook_id, title, psychological_strategy, content_json, is_generated)
                 VALUES (?, ?, ?, ?, ?, 0)`,
                [projectId, hook.id, hook.title, hook.psychological_strategy, hook.content_json]
            );
        }

        res.json({ success: true, count: availableHooks.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Actualiza la información de un gancho (ej: marcar como generado o cambiar URL)
 * Soporta actualización en master_hooks si el gancho pertenece a un proyecto maestro.
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { landingPageUrl, isGenerated, contentJson } = req.body;
    try {
        // Intentar actualizar primero en project_hooks
        const [projUpdate] = await pool.query(
            `UPDATE project_hooks SET 
                landing_page_url = COALESCE(?, landing_page_url),
                is_generated = COALESCE(?, is_generated),
                content_json = COALESCE(?, content_json)
             WHERE id = ?`,
            [landingPageUrl, isGenerated, contentJson ? JSON.stringify(contentJson) : null, id]
        );

        // Si no se afectó ninguna fila, es probable que sea un gancho maestro siendo editado por un admin
        if (projUpdate.affectedRows === 0) {
            await pool.query(
                `UPDATE master_hooks SET 
                    is_generated = COALESCE(?, is_generated),
                    content_json = COALESCE(?, content_json)
                 WHERE id = ?`,
                [isGenerated, contentJson ? JSON.stringify(contentJson) : null, id]
            );
        }
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;