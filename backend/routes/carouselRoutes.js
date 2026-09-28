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
 * Obtiene los carruseles asignados a un proyecto
 */
router.get('/project/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const [proj] = await pool.query('SELECT master_parent_id, is_master FROM projects WHERE id = ?', [projectId]);
        const masterParentId = proj[0]?.master_parent_id;
        const isMaster = !!proj[0]?.is_master;
        const isAdmin = req.user && req.user.role === 'admin';

        let carousels = [];
        if (masterParentId) {
            const effectiveLimits = await getEffectiveLimits(req.user.id);
            const isStarter = !isAdmin && effectiveLimits.planName === 'starter';

            // Traer carruseles reales del usuario (clonados o manuales)
            const [userRows] = await pool.query(
                `SELECT * FROM project_carousels WHERE project_id = ? ORDER BY ${isAdmin ? 'id ASC' : 'created_at ASC'}`,
                [projectId]
            );

            // Traer carruseles del maestro que no han sido clonados todavía
            const activeCondition = isAdmin ? '' : 'AND is_active = 1';
            const orderClause = isAdmin ? 'ORDER BY id ASC' : (isStarter ? 'ORDER BY RAND() LIMIT 15' : 'ORDER BY id ASC');
            const masterQuery = `SELECT * FROM project_carousels 
                 WHERE project_id = ? 
                 ${activeCondition}
                 AND id NOT IN (SELECT master_carousel_id FROM project_carousels WHERE project_id = ? AND master_carousel_id IS NOT NULL)
                 ${orderClause}`;

            const [masterRows] = await pool.query(masterQuery, [masterParentId, projectId]);
            
            const userCarousels = userRows.map(c => ({
                id: String(c.id),
                masterCarouselId: c.master_carousel_id ? String(c.master_carousel_id) : undefined,
                projectId: String(projectId),
                title: c.title,
                psychologicalStrategy: c.psychological_strategy,
                contentJson: safeParseJson(c.content_json),
                isUnlocked: true,
                isActive: !!c.is_active,
                isGenerated: !!c.is_generated,
                createdAt: c.created_at,
                updatedAt: c.updated_at
            }));

            const availableCarousels = masterRows.map(c => ({
                id: `available-${c.id}`,
                masterCarouselId: String(c.id),
                projectId: String(projectId),
                title: c.title,
                psychologicalStrategy: c.psychological_strategy,
                contentJson: safeParseJson(c.content_json),
                isUnlocked: false,
                isActive: !!c.is_active,
                isGenerated: false,
                createdAt: c.created_at,
                updatedAt: c.updated_at
            }));

            carousels = [...userCarousels, ...availableCarousels];
        } else {
            const activeCondition = isAdmin ? '' : 'AND is_active = 1';
            const [rows] = await pool.query(
                `SELECT * FROM project_carousels WHERE project_id = ? ${activeCondition} ORDER BY ${isAdmin ? 'id ASC' : 'created_at ASC'}`,
                [projectId]
            );
            carousels = rows.map(c => ({
                ...c,
                id: String(c.id),
                projectId: String(c.project_id),
                masterCarouselId: c.master_carousel_id ? String(c.master_carousel_id) : undefined,
                psychologicalStrategy: c.psychological_strategy,
                landingPageUrl: c.landing_page_url,
                contentJson: safeParseJson(c.content_json),
                isUnlocked: true,
                isActive: !!c.is_active,
                isGenerated: !!c.is_generated,
                createdAt: c.created_at,
                updatedAt: c.updated_at
            }));
        }

        res.json(carousels);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Obtiene la biblioteca de carruseles maestros
 */
router.get('/library', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const masterProjectId = req.query.masterProjectId;
    const projectId = req.query.projectId;
    const offset = (page - 1) * limit;

    try {
        const isAdmin = req.user && req.user.role === 'admin';
        const activeCondition = isAdmin ? '' : 'AND pc.is_active = 1';

        let effectiveMasterProjectId = masterProjectId;

        if (!effectiveMasterProjectId && projectId) {
            const [projRows] = await pool.query('SELECT master_parent_id, is_master FROM projects WHERE id = ?', [projectId]);
            if (projRows.length > 0) {
                if (projRows[0].master_parent_id) {
                    effectiveMasterProjectId = projRows[0].master_parent_id;
                } else if (projRows[0].is_master) {
                    effectiveMasterProjectId = projectId;
                }
            }
        }

        if (!effectiveMasterProjectId && !isAdmin) {
            effectiveMasterProjectId = -1;
        }

        let countQuery = `
            SELECT COUNT(*) as total 
            FROM project_carousels pc
            JOIN projects p ON pc.project_id = p.id
            WHERE p.is_master = 1 ${activeCondition}
        `;
        let dataQuery = `
            SELECT pc.*, p.name as project_name 
            FROM project_carousels pc
            JOIN projects p ON pc.project_id = p.id
            WHERE p.is_master = 1 ${activeCondition}
        `;
        const params = [];

        if (effectiveMasterProjectId) {
            countQuery += ` AND p.id = ?`;
            dataQuery += ` AND p.id = ?`;
            params.push(effectiveMasterProjectId);
        }

        if (projectId && !isAdmin) {
            const filterClause = ` AND pc.id NOT IN (SELECT master_carousel_id FROM project_carousels WHERE project_id = ? AND master_carousel_id IS NOT NULL)`;
            countQuery += filterClause;
            dataQuery += filterClause;
            params.push(projectId);
        }

        const orderClause = isAdmin ? 'ORDER BY pc.id ASC' : 'ORDER BY pc.created_at DESC';
        dataQuery += ` ${orderClause} LIMIT ? OFFSET ?`;
        const dataParams = [...params, limit, offset];

        // Contar total de carruseles maestros filtrados
        const [countRows] = await pool.query(countQuery, params);
        const total = countRows[0].total;

        // Obtener carruseles maestros paginados
        const [rows] = await pool.query(dataQuery, dataParams);

        const carousels = rows.map(c => ({
            id: String(c.id),
            masterCarouselId: String(c.id),
            title: c.title,
            psychologicalStrategy: c.psychological_strategy,
            projectName: c.project_name,
            contentJson: safeParseJson(c.content_json),
            isUnlocked: false,
            isActive: !!c.is_active,
            isGenerated: !!c.is_generated,
            createdAt: c.created_at,
            updatedAt: c.updated_at
        }));

        res.json({ carousels, total, data: carousels });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea un carrusel individual desde la biblioteca maestra (Copia física)
 */
router.post('/unlock-single', async (req, res) => {
    let { projectId, masterCarouselId, isGenerated } = req.body;
    if (!projectId || !masterCarouselId) return res.status(400).json({ error: "Faltan parámetros" });

    if (typeof masterCarouselId === 'string' && masterCarouselId.startsWith('available-')) {
        masterCarouselId = masterCarouselId.replace('available-', '');
    }
    const cleanMasterCarouselId = parseInt(masterCarouselId, 10);
    if (isNaN(cleanMasterCarouselId)) {
        return res.status(400).json({ error: "ID de carrusel maestro inválido" });
    }

    try {
        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxCarousels;
        
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_carousels c
                JOIN projects p ON c.project_id = p.id
                WHERE p.user_id = ?
            `, [req.user.id]);
            
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite global de ${maxAllowed} carruseles de tu plan.` });
            }
        }

        const [masterRows] = await pool.query('SELECT * FROM project_carousels WHERE id = ?', [cleanMasterCarouselId]);
        if (masterRows.length === 0) return res.status(404).json({ error: "Carrusel maestro no encontrado" });
        const master = masterRows[0];

        const clonedContent = master.content_json ? (typeof master.content_json === 'string' ? master.content_json : JSON.stringify(master.content_json)) : null;

        const [result] = await pool.query(
            `INSERT INTO project_carousels (project_id, master_carousel_id, title, psychological_strategy, content_json, is_generated)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [projectId, master.id, master.title, master.psychological_strategy, clonedContent, isGenerated ? 1 : 0]
        );

        res.json({ id: String(result.insertId), success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea múltiples carruseles desde una lista de IDs maestros
 */
router.post('/unlock-multiple', async (req, res) => {
    const { projectId, masterCarouselIds, isGenerated } = req.body;
    if (!projectId || !masterCarouselIds || !Array.isArray(masterCarouselIds)) {
        return res.status(400).json({ error: "Faltan parámetros o formato inválido" });
    }

    const cleanMasterCarouselIds = masterCarouselIds.map(id => {
        if (typeof id === 'string' && id.startsWith('available-')) {
            return parseInt(id.replace('available-', ''), 10);
        }
        return parseInt(id, 10);
    }).filter(id => !isNaN(id));

    if (cleanMasterCarouselIds.length === 0) {
        return res.status(400).json({ error: "No hay IDs válidos para desbloquear" });
    }

    try {
        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxCarousels;
        
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_carousels c
                JOIN projects p ON c.project_id = p.id
                WHERE p.user_id = ?
            `, [req.user.id]);
            
            if (countRows[0].total + cleanMasterCarouselIds.length > maxAllowed) {
                return res.status(403).json({ error: `Esta acción superaría tu límite global de ${maxAllowed} carruseles.` });
            }
        }

        const [masterRows] = await pool.query('SELECT * FROM project_carousels WHERE id IN (?)', [cleanMasterCarouselIds]);
        if (masterRows.length === 0) return res.status(404).json({ error: "Carruseles maestros no encontrados" });

        const results = [];
        for (const master of masterRows) {
            const clonedContent = master.content_json ? (typeof master.content_json === 'string' ? master.content_json : JSON.stringify(master.content_json)) : null;
            const [result] = await pool.query(
                `INSERT INTO project_carousels (project_id, master_carousel_id, title, psychological_strategy, content_json, is_generated)
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
 * Desbloquea carruseles para el usuario desde el proyecto maestro padre (Máximo 10)
 */
router.post('/unlock-more/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const [projectData] = await pool.query('SELECT master_parent_id FROM projects WHERE id = ?', [projectId]);
        if (projectData.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
        
        const masterParentId = projectData[0].master_parent_id;
        if (!masterParentId) return res.status(400).json({ error: "Este proyecto no está vinculado a una biblioteca maestra." });

        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxCarousels;
        
        let maxToLoad = 10;
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_carousels c
                JOIN projects p ON c.project_id = p.id
                WHERE p.user_id = ?
            `, [req.user.id]);
            
            const remaining = maxAllowed - countRows[0].total;
            
            if (remaining <= 0) {
                return res.status(403).json({ error: `Has alcanzado el límite global de ${maxAllowed} carruseles de tu plan.` });
            }
            maxToLoad = Math.min(10, remaining);
        }

        const [availableCarousels] = await pool.query(
            `SELECT * FROM project_carousels 
             WHERE project_id = ? 
             AND id NOT IN (SELECT master_carousel_id FROM project_carousels WHERE project_id = ? AND master_carousel_id IS NOT NULL)
             LIMIT ?`,
            [masterParentId, projectId, maxToLoad]
        );

        if (availableCarousels.length === 0) {
            return res.status(404).json({ error: "No hay más carruseles disponibles en la biblioteca para este nicho." });
        }

        for (const carousel of availableCarousels) {
            const clonedContent = carousel.content_json ? (typeof carousel.content_json === 'string' ? carousel.content_json : JSON.stringify(carousel.content_json)) : null;
            await pool.query(
                `INSERT INTO project_carousels (project_id, master_carousel_id, title, psychological_strategy, content_json, is_generated)
                 VALUES (?, ?, ?, ?, ?, 0)`,
                [projectId, carousel.id, carousel.title, carousel.psychological_strategy, clonedContent]
            );
        }

        res.json({ success: true, count: availableCarousels.length });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Actualiza la información de un carrusel
 */
router.put('/:id', async (req, res) => {
    let { id } = req.params;
    if (typeof id === 'string' && id.startsWith('available-')) {
        id = id.replace('available-', '');
    }
    const cleanId = parseInt(id, 10);
    if (isNaN(cleanId)) {
        return res.status(400).json({ error: "ID de carrusel inválido" });
    }

    const { landingPageUrl, isGenerated, contentJson, title, psychologicalStrategy, psychological_strategy, isActive } = req.body;
    const finalStrategy = psychological_strategy || psychologicalStrategy;
    
    // Normalizar valores booleanos para MySQL
    const normalizedIsActive = typeof isActive === 'boolean' 
        ? (isActive ? 1 : 0) 
        : (isActive !== undefined && isActive !== null ? (Number(isActive) ? 1 : 0) : undefined);

    const normalizedIsGenerated = typeof isGenerated === 'boolean'
        ? (isGenerated ? 1 : 0)
        : (isGenerated !== undefined && isGenerated !== null ? (Number(isGenerated) ? 1 : 0) : undefined);

    try {
        const fields = [];
        const values = [];

        if (landingPageUrl !== undefined) {
            fields.push('landing_page_url = ?');
            values.push(landingPageUrl || null);
        }
        if (normalizedIsGenerated !== undefined) {
            fields.push('is_generated = ?');
            values.push(normalizedIsGenerated);
        }
        if (contentJson !== undefined) {
            fields.push('content_json = ?');
            values.push(contentJson ? (typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson)) : null);
        }
        if (title !== undefined) {
            fields.push('title = ?');
            values.push(title || null);
        }
        if (finalStrategy !== undefined) {
            fields.push('psychological_strategy = ?');
            values.push(finalStrategy || null);
        }
        if (normalizedIsActive !== undefined) {
            fields.push('is_active = ?');
            values.push(normalizedIsActive);
        }

        if (fields.length > 0) {
            let masterCarouselId = null;
            const [existing] = await pool.query('SELECT id, master_carousel_id FROM project_carousels WHERE id = ?', [cleanId]);
            if (existing.length === 0) {
                return res.status(404).json({ error: `Carrusel con ID ${cleanId} no encontrado en la base de datos` });
            }
            if (existing[0].master_carousel_id) {
                masterCarouselId = existing[0].master_carousel_id;
            }

            if (masterCarouselId) {
                // Sincronizar carrusel clonado, carrusel maestro y otros clones del mismo carrusel
                await pool.query(
                    `UPDATE project_carousels SET ${fields.join(', ')} WHERE id = ? OR id = ? OR master_carousel_id = ?`,
                    [...values, cleanId, masterCarouselId, masterCarouselId]
                );
            } else {
                // Sincronizar carrusel maestro y todos los clones que apunten a él
                await pool.query(
                    `UPDATE project_carousels SET ${fields.join(', ')} WHERE id = ? OR master_carousel_id = ?`,
                    [...values, cleanId, cleanId]
                );
            }
        }
        
        res.json({ success: true, id: cleanId, isActive: normalizedIsActive });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Crea un nuevo carrusel manualmente
 */
router.post('/', async (req, res) => {
    const { projectId, title, psychologicalStrategy, contentJson } = req.body;
    try {
        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const maxAllowed = effectiveLimits.maxCarousels;
        
        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query(`
                SELECT COUNT(*) as total 
                FROM project_carousels c
                JOIN projects p ON c.project_id = p.id
                WHERE p.user_id = ?
            `, [req.user.id]);
            
            if (countRows[0].total >= maxAllowed) {
                return res.status(403).json({ error: `Has alcanzado el límite global de ${maxAllowed} carruseles de tu plan.` });
            }
        }

        const [result] = await pool.query(
            `INSERT INTO project_carousels (project_id, title, psychological_strategy, content_json, is_generated)
             VALUES (?, ?, ?, ?, 0)`,
            [projectId, title, psychologicalStrategy, contentJson ? (typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson)) : null]
        );
        res.json({ id: result.insertId, success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Elimina un carrusel
 */
router.delete('/:id', async (req, res) => {
    let { id } = req.params;
    if (typeof id === 'string' && id.startsWith('available-')) {
        id = id.replace('available-', '');
    }
    const cleanId = parseInt(id, 10);
    if (isNaN(cleanId)) {
        return res.status(400).json({ error: "ID de carrusel inválido" });
    }
    try {
        await pool.query('DELETE FROM project_carousels WHERE id = ?', [cleanId]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
