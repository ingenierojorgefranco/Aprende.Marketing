
const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, DEFAULT_LIMITS } = require('./authRoutes');
const { generateFullStrategy } = require('../geminiService');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas de proyectos
router.use(authMiddleware);

// ======================================================
//  CRUD DE PROYECTOS
// ======================================================

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error cargando proyectos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (rows.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    
    const project = rows[0];
    
    // Lógica de parseo automático de strategy_json
    if (project.strategy_json) {
        try {
            project.strategy_json = typeof project.strategy_json === 'string' 
                ? JSON.parse(project.strategy_json) 
                : project.strategy_json;
        } catch (e) {
            console.error(`[Project Error] Falló el parseo de strategy_json para el proyecto ${req.params.id}`);
            project.strategy_json = null;
        }
    } else {
        project.strategy_json = null;
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks
  } = req.body;
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    
    const [count] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxProjects) {
        return res.status(403).json({ error: `Límite de ${limits.maxProjects} proyectos alcanzado.` });
    }

    const [result] = await pool.query(
      `INSERT INTO projects 
       (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        req.user.id,
        name,
        niche,
        description,
        targetAudience,
        brandTone,
        productName,
        mainGoal,
        JSON.stringify(painPoints || []),
        JSON.stringify(keyBenefits || []),
        JSON.stringify(affiliateLinks || []),
      ]
    );
    
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
    res.json({ id: result.insertId, message: 'Proyecto creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error guardando proyecto en base de datos' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks, strategy_json
  } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });
    
    await pool.query(
      `UPDATE projects 
       SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?, strategy_json=?, updated_at=NOW()
       WHERE id=? AND user_id=?`,
      [
        name,
        niche,
        description,
        targetAudience,
        brandTone,
        productName,
        mainGoal,
        JSON.stringify(painPoints || []),
        JSON.stringify(keyBenefits || []),
        JSON.stringify(affiliateLinks || []),
        strategy_json ? JSON.stringify(strategy_json) : null,
        id,
        req.user.id,
      ]
    );
    res.json({ message: 'Proyecto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando proyecto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [proj] = await pool.query('SELECT name FROM projects WHERE id = ?', [req.params.id]);
    const [result] = await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    
    await logSystemActivity(req.user.id, req.user.email, 'DELETE_PROJECT', 'project', req.params.id, { name: proj[0]?.name });
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
