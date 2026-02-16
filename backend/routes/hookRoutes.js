import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

/**
 * Obtiene los ganchos asignados a un proyecto
 */
router.get('/project/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        // Consultar directamente la tabla project_hooks filtrando por project_id
        const [rows] = await pool.query(
            'SELECT * FROM project_hooks WHERE project_id = ? ORDER BY created_at ASC',
            [projectId]
        );

        res.json(rows.map(h => ({
            ...h,
            id: String(h.id),
            projectId: String(h.project_id),
            masterHookId: h.master_hook_id ? String(h.master_hook_id) : undefined,
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
 * Desbloquea 10 nuevos ganchos para el usuario desde el proyecto maestro padre
 * Evita duplicados basándose en master_hook_id
 */
router.post('/unlock-more/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        // 1. Obtener el master_parent_id del proyecto para saber de qué biblioteca (proyecto maestro) sacar los ganchos
        const [projRows] = await pool.query('SELECT master_parent_id FROM projects WHERE id = ?', [projectId]);
        if (projRows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        
        const masterParentId = projRows[0].master_parent_id;
        if (!masterParentId) return res.status(400).json({ error: "Este proyecto no está vinculado a una biblioteca maestra." });

        // 2. Buscar 10 ganchos en el proyecto maestro que el usuario NO tenga ya clonados
        const [availableHooks] = await pool.query(
            `SELECT * FROM project_hooks 
             WHERE project_id = ? 
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
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { landingPageUrl, isGenerated, contentJson } = req.body;
    try {
        await pool.query(
            `UPDATE project_hooks SET 
                landing_page_url = COALESCE(?, landing_page_url),
                is_generated = COALESCE(?, is_generated),
                content_json = COALESCE(?, content_json)
             WHERE id = ?`,
            [landingPageUrl, isGenerated, contentJson ? JSON.stringify(contentJson) : null, id]
        );
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Crea un nuevo gancho manualmente (Admin)
 */
router.post('/', async (req, res) => {
    const { projectId, title, psychologicalStrategy, contentJson } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO project_hooks (project_id, title, psychological_strategy, content_json, is_generated)
             VALUES (?, ?, ?, ?, 1)`,
            [projectId, title, psychologicalStrategy, JSON.stringify(contentJson)]
        );
        res.json({ id: result.insertId, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;