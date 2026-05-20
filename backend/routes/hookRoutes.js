import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { DEFAULT_LIMITS, getEffectiveLimits } from './authRoutes.js';

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
            const effectiveLimits = await getEffectiveLimits(req.user.id);
            const isStarter = effectiveLimits.planName === 'starter';

            // Traer ganchos reales del usuario (clonados o manuales)
            const [userRows] = await pool.query(
                'SELECT * FROM project_hooks WHERE project_id = ? ORDER BY created_at ASC',
                [projectId]
            );

            // Traer ganchos del maestro que no han sido clonados todavía
            // Si es starter, limitamos a 15 aleatorios
            const masterQuery = `SELECT * FROM project_hooks 
                 WHERE project_id = ? 
                 AND is_active = 1
                 AND id NOT IN (SELECT master_hook_id FROM project_hooks WHERE project_id = ? AND master_hook_id IS NOT NULL)
                 ${isStarter ? 'ORDER BY RAND() LIMIT 15' : 'ORDER BY created_at ASC'}`;

            const [masterRows] = await pool.query(masterQuery, [masterParentId, projectId]);
            
            const userHooks = userRows.map(h => ({
                id: String(h.id),
                masterHookId: h.master_hook_id ? String(h.master_hook_id) : undefined,
                projectId: String(projectId),
                title: h.title,
                psychologicalStrategy: h.psychological_strategy,
                contentJson: safeParseJson(h.content_json),
                isUnlocked: true,
                isActive: !!h.is_active,
                isGenerated: !!h.is_generated,
                createdAt: h.created_at,
                updatedAt: h.updated_at
            }));

            const availableHooks = masterRows.map(h => ({
                id: `available-${h.id}`,
                masterHookId: String(h.id),
                projectId: String(projectId),
                title: h.title,
                psychologicalStrategy: h.psychological_strategy,
                contentJson: null,
                isUnlocked: false,
                isActive: !!h.is_active,
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
                isActive: !!h.is_active,
                isGenerated: !!h.is_generated,
                createdAt: h.created_at,
                updatedAt: h.updated_at
            }));
        }

        res.json(hooks);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Obtiene la biblioteca de ganchos maestros
 */
router.get('/library', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const masterProjectId = req.query.masterProjectId;
    const projectId = req.query.projectId; // Nuevo parámetro para filtrar
    const offset = (page - 1) * limit;

    try {
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM project_hooks ph
            JOIN projects p ON ph.project_id = p.id
            WHERE p.is_master = 1 AND ph.is_active = 1
        `;
        let dataQuery = `
            SELECT ph.*, p.name as project_name 
            FROM project_hooks ph
            JOIN projects p ON ph.project_id = p.id
            WHERE p.is_master = 1 AND ph.is_active = 1
        `;
        const params = [];

        if (masterProjectId) {
            countQuery += ` AND p.id = ?`;
            dataQuery += ` AND p.id = ?`;
            params.push(masterProjectId);
        }

        if (projectId) {
            const filterClause = ` AND ph.id NOT IN (SELECT master_hook_id FROM project_hooks WHERE project_id = ? AND master_hook_id IS NOT NULL)`;
            countQuery += filterClause;
            dataQuery += filterClause;
            params.push(projectId);
        }

        dataQuery += ` ORDER BY ph.created_at DESC LIMIT ? OFFSET ?`;
        const dataParams = [...params, limit, offset];

        // Contar total de ganchos maestros filtrados
        const [countRows] = await pool.query(countQuery, params);
        const total = countRows[0].total;

        // Obtener ganchos maestros paginados
        const [rows] = await pool.query(dataQuery, dataParams);

            const hooks = rows.map(h => ({
            id: String(h.id),
            masterHookId: String(h.id),
            title: h.title,
            psychologicalStrategy: h.psychological_strategy,
            projectName: h.project_name,
            contentJson: safeParseJson(h.content_json),
            isUnlocked: false,
            isActive: !!h.is_active,
            isGenerated: !!h.is_generated,
            createdAt: h.created_at,
            updatedAt: h.updated_at
        }));

        res.json({ hooks, total });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea un gancho individual desde la biblioteca maestra (Copia física)
 */
router.post('/unlock-single', async (req, res) => {
    const { projectId, masterHookId, isGenerated } = req.body;
    if (!projectId || !masterHookId) return res.status(400).json({ error: "Faltan parámetros" });

    try {
        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxHooks;
        
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_hooks
                WHERE project_id = ?
            `, [projectId]);
            
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} ganchos para este proyecto.` });
            }
        }

        const [masterRows] = await pool.query('SELECT * FROM project_hooks WHERE id = ?', [masterHookId]);
        if (masterRows.length === 0) return res.status(404).json({ error: "Hook maestro no encontrado" });
        const master = masterRows[0];

        const clonedContent = master.content_json ? (typeof master.content_json === 'string' ? master.content_json : JSON.stringify(master.content_json)) : null;

        const [result] = await pool.query(
            `INSERT INTO project_hooks (project_id, master_hook_id, title, psychological_strategy, content_json, is_generated)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [projectId, master.id, master.title, master.psychological_strategy, clonedContent, isGenerated ? 1 : 0]
        );

        res.json({ id: String(result.insertId), success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea múltiples ganchos desde una lista de IDs maestros
 */
router.post('/unlock-multiple', async (req, res) => {
    const { projectId, masterHookIds, isGenerated } = req.body;
    if (!projectId || !masterHookIds || !Array.isArray(masterHookIds)) {
        return res.status(400).json({ error: "Faltan parámetros o formato inválido" });
    }

    try {
        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxHooks;
        
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_hooks
                WHERE project_id = ?
            `, [projectId]);
            
            if (countRows[0].total + masterHookIds.length > maxAllowed) {
                return res.status(403).json({ error: `Esta acción superaría el límite de ${maxAllowed} ganchos para este proyecto.` });
            }
        }

        const [masterRows] = await pool.query('SELECT * FROM project_hooks WHERE id IN (?)', [masterHookIds]);
        if (masterRows.length === 0) return res.status(404).json({ error: "Ganchos maestros no encontrados" });

        const results = [];
        for (const master of masterRows) {
            const clonedContent = master.content_json ? (typeof master.content_json === 'string' ? master.content_json : JSON.stringify(master.content_json)) : null;
            const [result] = await pool.query(
                `INSERT INTO project_hooks (project_id, master_hook_id, title, psychological_strategy, content_json, is_generated)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [projectId, master.id, master.title, master.psychological_strategy, clonedContent, isGenerated ? 1 : 0]
            );
            results.push({ masterId: master.id, id: String(result.insertId), newId: result.insertId });
        }

        res.json({ success: true, results });
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
        const [projectData] = await pool.query('SELECT master_parent_id FROM projects WHERE id = ?', [projectId]);
        if (projectData.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        
        const masterParentId = projectData[0].master_parent_id;
        if (!masterParentId) return res.status(400).json({ error: "Este proyecto no está vinculado a una biblioteca maestra." });

        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxHooks;
        
        let maxToLoad = 10;
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_hooks
                WHERE project_id = ?
            `, [projectId]);
            
            const remaining = maxAllowed - countRows[0].total;
            
            if (remaining <= 0) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} ganchos para este proyecto.` });
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
    const { landingPageUrl, isGenerated, contentJson, title, psychologicalStrategy, psychological_strategy, isActive } = req.body;
    const finalStrategy = psychological_strategy || psychologicalStrategy;
    try {
        await pool.query(
            `UPDATE project_hooks SET 
                landing_page_url = COALESCE(?, landing_page_url),
                is_generated = COALESCE(?, is_generated),
                content_json = COALESCE(?, content_json),
                title = COALESCE(?, title),
                psychological_strategy = COALESCE(?, psychological_strategy),
                is_active = COALESCE(?, is_active)
             WHERE id = ?`,
            [landingPageUrl, isGenerated, contentJson ? (typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson)) : null, title, finalStrategy, isActive, id]
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
        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxHooks;
        
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_hooks
                WHERE project_id = ?
            `, [projectId]);
            
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${maxAllowed} ganchos para este proyecto.` });
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
