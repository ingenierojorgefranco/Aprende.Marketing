
import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { logSystemActivity, DEFAULT_LIMITS, getEffectiveLimits } from './authRoutes.js';

const router = express.Router();

// ======================================================
//  RUTAS PRIVADAS (Gestión de Artículos)
// ======================================================

router.get('/articles', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
        `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name, p.name as project_name
         FROM articles a 
         LEFT JOIN landing_pages lp ON a.page_id = lp.id 
         LEFT JOIN projects p ON a.project_id = p.id
         WHERE a.user_id = ? ORDER BY a.created_at DESC`, 
        [req.user.id]
    );
    const mapped = rows.map(a => ({
        ...a,
        projectId: a.project_id ? String(a.project_id) : undefined,
        masterArticleId: a.master_article_id ? String(a.master_article_id) : undefined,
        projectName: a.project_name,
        pageId: a.page_id ? String(a.page_id) : undefined,
        pageName: a.page_name,
        pageSubdomain: a.page_subdomain,
        isGenerated: !!a.is_generated,
        psychologicalStrategy: typeof a.psychological_strategy === 'string' ? JSON.parse(a.psychological_strategy) : a.psychological_strategy
    }));
    res.json(mapped);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/**
 * Obtiene artículos vinculados a un proyecto (incluyendo los del proyecto maestro padre)
 */
router.get('/articles/project/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;
    try {
        // 1. Obtener el master_parent_id del proyecto
        const [proj] = await pool.query('SELECT master_parent_id FROM projects WHERE id = ?', [projectId]);
        const masterParentId = proj[0]?.master_parent_id;

        let articles = [];
        if (masterParentId) {
            // Traer artículos reales del usuario (clonados o manuales)
            const [userRows] = await pool.query(
                `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name, p.name as project_name
                 FROM articles a 
                 LEFT JOIN landing_pages lp ON a.page_id = lp.id 
                 LEFT JOIN projects p ON a.project_id = p.id
                 WHERE a.project_id = ? ORDER BY a.created_at DESC`,
                [projectId]
            );

            // Traer artículos del maestro que no han sido clonados todavía
            const [masterRows] = await pool.query(
                `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name, p.name as project_name
                 FROM articles a
                 LEFT JOIN landing_pages lp ON a.page_id = lp.id
                 LEFT JOIN projects p ON a.project_id = p.id
                 WHERE a.project_id = ? 
                 AND a.id NOT IN (SELECT master_article_id FROM articles WHERE project_id = ? AND master_article_id IS NOT NULL)
                 ORDER BY a.created_at DESC`,
                [masterParentId, projectId]
            );

            const userArticles = userRows.map(a => ({
                ...a,
                id: String(a.id),
                projectId: String(projectId),
                masterArticleId: a.master_article_id ? String(a.master_article_id) : undefined,
                projectName: a.project_name,
                pageId: a.page_id ? String(a.page_id) : undefined,
                pageName: a.page_name,
                pageSubdomain: a.page_subdomain,
                isUnlocked: true,
                isGenerated: !!a.is_generated,
                unlockedAt: a.unlocked_at,
                psychologicalStrategy: typeof a.psychological_strategy === 'string' ? JSON.parse(a.psychological_strategy) : a.psychological_strategy
            }));

            const availableArticles = masterRows.map(a => ({
                ...a,
                id: `available-${a.id}`,
                masterArticleId: String(a.id),
                projectId: String(projectId),
                projectName: a.project_name,
                pageId: undefined,
                pageName: undefined,
                pageSubdomain: undefined,
                isUnlocked: false,
                isGenerated: false,
                unlockedAt: null,
                psychologicalStrategy: typeof a.psychological_strategy === 'string' ? JSON.parse(a.psychological_strategy) : a.psychological_strategy,
                content_html: null // No enviamos el contenido hasta que se desbloquee
            }));

            articles = [...userArticles, ...availableArticles];
        } else {
            const [rows] = await pool.query(
                `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name, p.name as project_name
                 FROM articles a 
                 LEFT JOIN landing_pages lp ON a.page_id = lp.id 
                 LEFT JOIN projects p ON a.project_id = p.id
                 WHERE a.project_id = ? ORDER BY a.created_at DESC`,
                [projectId]
            );
            articles = rows.map(a => ({
                ...a,
                id: String(a.id),
                projectId: String(a.project_id),
                masterArticleId: a.master_article_id ? String(a.master_article_id) : undefined,
                projectName: a.project_name,
                pageId: a.page_id ? String(a.page_id) : undefined,
                pageName: a.page_name,
                pageSubdomain: a.page_subdomain,
                isUnlocked: true,
                isGenerated: !!a.is_generated,
                unlockedAt: a.unlocked_at,
                psychologicalStrategy: typeof a.psychological_strategy === 'string' ? JSON.parse(a.psychological_strategy) : a.psychological_strategy
            }));
        }

        res.json(articles);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Desbloquea un artículo individual desde la biblioteca maestra (Copia física)
 */
router.post('/articles/unlock-article', authMiddleware, async (req, res) => {
    const { projectId, masterArticleId } = req.body;
    if (!projectId || !masterArticleId) return res.status(400).json({ error: "Faltan parámetros" });

    try {
        const effectiveLimits = await getEffectiveLimits(req.user.id);
        const limit = effectiveLimits.maxArticles;

        if (req.user.role !== 'admin') {
            const [countRows] = await pool.query('SELECT COUNT(*) as total FROM articles WHERE user_id = ?', [req.user.id]);
            if (countRows[0].total >= limit) {
                return res.status(403).json({ error: `Has alcanzado el límite de ${limit} artículos en tu plan.` });
            }
        }

        const [masterRows] = await pool.query('SELECT * FROM articles WHERE id = ?', [masterArticleId]);
        if (masterRows.length === 0) return res.status(404).json({ error: "Artículo maestro no encontrado" });
        const master = masterRows[0];

        const fields = ['user_id', 'project_id', 'master_article_id', 'created_at', 'unlocked_at', 'status', 'is_generated'];
        const placeholders = ['?', '?', '?', 'NOW()', 'NOW()', '?', '?'];
        const values = [req.user.id, projectId, master.id, 'draft', 0];

        const allowedFields = [
            'psychological_strategy', 'title', 'slug', 'description', 'content_html', 
            'featured_image', 'keyword', 'seo_score', 'meta_title', 'meta_description', 
            'email_subject', 'email_body'
        ];

        for (const field of allowedFields) {
            if (master[field] !== null && master[field] !== undefined) {
                fields.push(field);
                placeholders.push('?');
                let val = master[field];
                if (field === 'psychological_strategy' && typeof val === 'object') {
                    val = JSON.stringify(val);
                }
                values.push(val);
            }
        }

        const [result] = await pool.query(
            `INSERT INTO articles (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
            values
        );

        await logSystemActivity(req.user.id, req.user.email, 'UNLOCK_ARTICLE', 'article', result.insertId, { title: master.title });
        res.json({ id: String(result.insertId), success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/articles/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, p.name as project_name 
             FROM articles a
             LEFT JOIN projects p ON a.project_id = p.id
             WHERE a.id = ? AND a.user_id = ?`, 
            [req.params.id, req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
        const a = rows[0];
        const mapped = {
            ...a,
            projectId: a.project_id ? String(a.project_id) : undefined,
            masterArticleId: a.master_article_id ? String(a.master_article_id) : undefined,
            projectName: a.project_name,
            pageId: a.page_id ? String(a.page_id) : undefined,
            isGenerated: !!a.is_generated,
            psychologicalStrategy: typeof a.psychological_strategy === 'string' ? JSON.parse(a.psychological_strategy) : a.psychological_strategy
        };
        res.json(mapped);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/articles', authMiddleware, async (req, res) => {
  const body = req.body;
  try {
    const effectiveLimits = await getEffectiveLimits(req.user.id);
    const limit = effectiveLimits.maxArticles;

    if (req.user.role !== 'admin') {
        const [countRows] = await pool.query('SELECT COUNT(*) as total FROM articles WHERE user_id = ?', [req.user.id]);
        if (countRows[0].total >= limit) {
            return res.status(403).json({ error: `Has alcanzado el límite de ${limit} artículos en tu plan.` });
        }
    }

    const fields = ['user_id', 'created_at'];
    const placeholders = ['?', 'NOW()'];
    const values = [req.user.id];

    const allowedFields = [
      'page_id', 'project_id', 'is_generated', 'psychological_strategy', 
      'title', 'slug', 'description', 'content_html', 'featured_image', 
      'keyword', 'seo_score', 'meta_title', 'meta_description', 
      'email_subject', 'email_body', 'status', 'published_at'
    ];

    for (const field of allowedFields) {
      if (body.hasOwnProperty(field)) {
        fields.push(field);
        placeholders.push('?');
        let val = body[field];
        if (field === 'is_generated') val = val ? 1 : 0;
        if (field === 'psychological_strategy' && typeof val === 'object') val = JSON.stringify(val);
        if (field === 'published_at' && val) val = new Date(val);
        values.push(val);
      }
    }

    // Default status if not provided
    if (!body.hasOwnProperty('status')) {
      fields.push('status');
      placeholders.push('?');
      values.push('published');
    }

    const [resDb] = await pool.query(
      `INSERT INTO articles (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
      values
    );
    
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_ARTICLE', 'article', resDb.insertId, { title: body.title || 'Sin título' });
    res.json({ id: resDb.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/articles/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM articles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });

    const updates = [];
    const values = [];

    const allowedFields = [
      'page_id', 'project_id', 'is_generated', 'psychological_strategy', 
      'title', 'slug', 'description', 'content_html', 'featured_image', 
      'keyword', 'seo_score', 'meta_title', 'meta_description', 
      'email_subject', 'email_body', 'status', 'published_at'
    ];

    for (const field of allowedFields) {
      if (body.hasOwnProperty(field)) {
        updates.push(`${field} = ?`);
        let val = body[field];
        if (field === 'is_generated') val = val ? 1 : 0;
        if (field === 'psychological_strategy' && typeof val === 'object') val = JSON.stringify(val);
        if (field === 'published_at' && val) val = new Date(val);
        values.push(val);
      }
    }

    if (updates.length === 0) return res.json({ message: 'Nada que actualizar' });

    values.push(id, req.user.id);
    await pool.query(
      `UPDATE articles SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    res.json({ message: 'Artículo actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/articles/:id', authMiddleware, async (req, res) => {
  try {
    const [art] = await pool.query('SELECT title, user_id FROM articles WHERE id = ?', [req.params.id]);
    if (art.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });

    if (art[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    await logSystemActivity(req.user.id, req.user.email, 'DELETE_ARTICLE', 'article', req.params.id, { title: art[0]?.title });
    res.json({ message: 'Artículo eliminado' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ======================================================
//  RUTAS PÚBLICAS (Blog)
// ======================================================

router.get('/public/pages/:pageId/blog', async (req, res) => {
    const { pageId } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT id, title, slug, description, meta_description, featured_image, published_at 
             FROM articles 
             WHERE page_id = ? AND status = 'published' AND published_at <= NOW()
             ORDER BY published_at DESC`,
            [pageId]
        );
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/public/articles/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await pool.query(`SELECT * FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`, [slug]);
        if(rows.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
