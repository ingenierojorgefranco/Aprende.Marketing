const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, DEFAULT_LIMITS } = require('./authRoutes');

const router = express.Router();

// ======================================================
//  HELPERS INTERNOS
// ======================================================

// ======================================================
//  RUTAS PRIVADAS (Gestión de Artículos)
// ======================================================

router.get('/articles', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
        `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name 
         FROM articles a LEFT JOIN landing_pages lp ON a.page_id = lp.id 
         WHERE a.user_id = ? ORDER BY a.created_at DESC`, 
        [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/articles/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM articles WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;
  let finalSlug = slug;
  if (!finalSlug && title) { finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
  
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    const limit = limits.maxArticles || 2; 
    
    const [resDb] = await pool.query(
      `INSERT INTO articles 
      (user_id, page_id, title, slug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status, published_at, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [req.user.id, page_id || null, title, finalSlug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status || 'published', published_at ? new Date(published_at) : new Date()]
    );
    
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_ARTICLE', 'article', resDb.insertId, { title });
    res.json({ id: resDb.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/articles/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM articles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });
    let finalSlug = slug;
    if (!finalSlug && title) { finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
    await pool.query(
      `UPDATE articles SET 
        page_id=?, title=?, slug=?, description=?, content_html=?, featured_image=?, keyword=?, seo_score=?, meta_title=?, meta_description=?, status=?, published_at=?
       WHERE id=? AND user_id=?`,
      [page_id || null, title, finalSlug, description, content_html, featured_image, keyword, seo_score, meta_title, meta_description, status, published_at ? new Date(published_at) : new Date(), id, req.user.id]
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

module.exports = router;