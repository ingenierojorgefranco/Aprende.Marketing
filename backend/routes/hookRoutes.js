import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { DEFAULT_LIMITS } from './authRoutes.js';

const router = express.Router();
router.use(authMiddleware);

const safeParseJson = (data) => {
    if (!data) return null;
    try {
        let p = typeof data === 'string' ? JSON.parse(data) : data;
        if (typeof p === 'string') p = JSON.parse(p);
        return p;
    } catch (e) {
        return null;
    }
};

/**
 * Obtiene los ganchos asignados a un proyecto
 */
router.get('/project/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const [proj] = await pool.query('SELECT master_parent_id FROM projects WHERE id = ?', [projectId]);
        const masterParentId = proj[0]?.master_parent_id;

        let hooks = [];
        if (masterParentId) {
            // Traer ganchos reales del usuario (clonados o manuales)
            const [userRows] = await pool.query(
                'SELECT * FROM project_hooks WHERE project_id = ? ORDER BY created_at ASC',
                [projectId]
            );

            // Traer ganchos del maestro que no han sido clonados todavía
            const [masterRows] = await pool.query(
                `SELECT * FROM project_hooks 
                 WHERE project_id = ? 
                 AND id NOT IN (SELECT master_hook_id FROM project_hooks WHERE project_id = ? AND master_hook_id IS NOT NULL)
                 ORDER BY created_at ASC`,
                [masterParentId, projectId]
            );
            
            const userHooks = userRows.map(h => ({
                id: String(h.id),
                masterHookId: h.master_hook_id ? String(h.master_hook_id) : undefined,
                projectId: String(projectId),
                title: h.title,
                psychologicalStrategy: h.psychological_strategy,
                contentJson: safeParseJson(h.content_json),
                isUnlocked: true,
                isGenerated: !!h.is_generated
            }));

            const availableHooks = masterRows.map(h => ({
                id: `available-${h.id}`,
                masterHookId: String(h.id),
                projectId: String(projectId),
                title: h.title,
                psychologicalStrategy: h.psychological_strategy,
                contentJson: null,
                isUnlocked: false,
                isGenerated: false
            }));

            hooks = [...userHooks, ...availableHooks];
        } else {
            const [rows] = await pool.query(
                'SELECT * FROM project_hooks WHERE project_id = ? ORDER BY created_at ASC',
                [projectId]
            );
            hooks = rows.map(h => ({
                ...h,
                id: String(h.id),
                projectId: String(h.project_id),
                masterHookId: h.master_hook_id ? String(h.master_hook_id) : undefined,
                psychologicalStrategy: h.psychological_strategy,
                landingPageUrl: h.landing_page_url,
                contentJson: safeParseJson(h.content_json),
                isUnlocked: true,
                isGenerated: !!h.is_generated
            }));
        }

        res.json(hooks);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea un gancho individual desde la biblioteca maestra (Copia física)
 */
router.post('/unlock-single', async (req, res) => {
    const { projectId, masterHookId } = req.body;
    if (!projectId || !masterHookId) return res.status(400).json({ error: "Faltan parámetros" });

    try {
        const [userData] = await pool.query('SELECT plan_limits, role FROM users WHERE id = ?', [req.user.id]);
        const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
        
        if (userData[0]?.role !== 'admin' && limits) {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_hooks h
                JOIN projects p ON h.project_id = p.id
                WHERE p.user_id = ?
            `, [req.user.id]);
            
            const maxAllowed = limits.maxHooks || 10;
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} ganchos de tu plan.` });
            }
        }

        const [masterRows] = await pool.query('SELECT * FROM project_hooks WHERE id = ?', [masterHookId]);
        if (masterRows.length === 0) return res.status(404).json({ error: "Hook maestro no encontrado" });
        const master = masterRows[0];

        const clonedContent = master.content_json ? (typeof master.content_json === 'string' ? master.content_json : JSON.stringify(master.content_json)) : null;

        const [result] = await pool.query(
            `INSERT INTO project_hooks (project_id, master_hook_id, title, psychological_strategy, content_json, is_generated)
             VALUES (?, ?, ?, ?, ?, 0)`,
            [projectId, master.id, master.title, master.psychological_strategy, clonedContent]
        );

        res.json({ id: String(result.insertId), success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea ganchos para el usuario desde el proyecto maestro padre (Máximo 10)
 */
router.post('/unlock-more/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const [projRows] = await pool.query('SELECT master_parent_id FROM projects WHERE id = ?', [projectId]);
        if (projRows.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        
        const masterParentId = projRows[0].master_parent_id;
        if (!masterParentId) return res.status(400).json({ error: "Este proyecto no está vinculado a una biblioteca maestra." });

        const [userData] = await pool.query('SELECT plan_limits, role FROM users WHERE id = ?', [req.user.id]);
        const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
        
        let maxToLoad = 10;
        if (userData[0]?.role !== 'admin' && limits) {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_hooks h
                JOIN projects p ON h.project_id = p.id
                WHERE p.user_id = ?
            `, [req.user.id]);
            
            const maxAllowed = limits.maxHooks || 10;
            const remaining = maxAllowed - countRows[0].total;
            
            if (remaining <= 0) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} ganchos de tu plan.` });
            }
            maxToLoad = Math.min(10, remaining);
        }

        const [availableHooks] = await pool.query(
            `SELECT * FROM project_hooks 
             WHERE project_id = ? 
             AND id NOT IN (SELECT master_hook_id FROM project_hooks WHERE project_id = ? AND master_hook_id IS NOT NULL)
             LIMIT ?`,
            [masterParentId, projectId, maxToLoad]
        );

        if (availableHooks.length === 0) {
            return res.status(404).json({ error: "No hay más ganchos disponibles en la biblioteca para este nicho." });
        }

        for (const hook of availableHooks) {
            const clonedContent = hook.content_json ? (typeof hook.content_json === 'string' ? hook.content_json : JSON.stringify(hook.content_json)) : null;
            await pool.query(
                `INSERT INTO project_hooks (project_id, master_hook_id, title, psychological_strategy, content_json, is_generated)
                 VALUES (?, ?, ?, ?, ?, 0)`,
                [projectId, hook.id, hook.title, hook.psychological_strategy, clonedContent]
            );
        }

        res.json({ success: true, count: availableHooks.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Actualiza la información de un gancho
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { landingPageUrl, isGenerated, contentJson, title, psychologicalStrategy } = req.body;
    try {
        await pool.query(
            `UPDATE project_hooks SET 
                landing_page_url = COALESCE(?, landing_page_url),
                is_generated = COALESCE(?, is_generated),
                content_json = COALESCE(?, content_json),
                title = COALESCE(?, title),
                psychological_strategy = COALESCE(?, psychological_strategy)
             WHERE id = ?`,
            [landingPageUrl, isGenerated, contentJson ? (typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson)) : null, title, psychologicalStrategy, id]
        );
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Crea un nuevo gancho manualmente (Acepta peticiones de usuarios estándar dentro de límites)
 */
router.post('/', async (req, res) => {
    const { projectId, title, psychologicalStrategy, contentJson } = req.body;
    try {
        const [userData] = await pool.query('SELECT plan_limits, role FROM users WHERE id = ?', [req.user.id]);
        const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
        
        if (userData[0]?.role !== 'admin' && limits) {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_hooks h
                JOIN projects p ON h.project_id = p.id
                WHERE p.user_id = ?
            `, [req.user.id]);
            
            const maxAllowed = limits.maxHooks || 10;
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} ganchos de tu plan.` });
            }
        }

        // Se cambia is_generated a 0 para que el usuario pueda editar y generar el kit después
        const [result] = await pool.query(
            `INSERT INTO project_hooks (project_id, title, psychological_strategy, content_json, is_generated)
             VALUES (?, ?, ?, ?, 0)`,
            [projectId, title, psychologicalStrategy, contentJson ? (typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson)) : null]
        );
        res.json({ id: result.insertId, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Elimina un gancho
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM project_hooks WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
