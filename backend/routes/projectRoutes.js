const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, DEFAULT_LIMITS } = require('./authRoutes');
const { generateFullStrategy } = require('../geminiService');

const router = express.Router();

// ======================================================
//  HELPERS DE CUOTA (Específicos para este módulo)
// ======================================================

const checkMonthlyQuota = async (userId, resourceType, limit) => {
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (user[0] && user[0].role === 'admin') return true;

    const [rows] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM usage_logs 
        WHERE user_id = ? 
          AND resource_type = ? 
          AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
          AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `, [userId, resourceType]);

    const used = rows[0].count;
    if (limit > 9000) return true; 
    
    if (used >= limit) {
        return false;
    }
    return true;
};

const logUsage = async (userId, resourceType) => {
    try {
        await pool.query('INSERT INTO usage_logs (user_id, resource_type) VALUES (?, ?)', [userId, resourceType]);
    } catch (e) {
        console.error("Error logging usage:", e);
    }
};

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
    if (typeof project.strategy_json === 'string') {
        try {
            project.strategy_json = JSON.parse(project.strategy_json);
        } catch (e) {
            project.strategy_json = null;
        }
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
        return res.status(403).json({ error: `Has alcanzado el límite de almacenamiento de ${limits.maxProjects} proyectos.` });
    }
    
    const hasQuota = await checkMonthlyQuota(req.user.id, 'project', limits.maxProjects);
    if (!hasQuota) {
        return res.status(403).json({ error: `Has alcanzado tu cupo mensual de ${limits.maxProjects} generaciones de proyectos.` });
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
    await logUsage(req.user.id, 'project');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
    res.json({ id: result.insertId, message: 'Proyecto guardado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error guardando proyecto en BD' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks
  } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado o no encontrado' });
    await pool.query(
      `UPDATE projects 
       SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?, updated_at=NOW()
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

// ======================================================
//  GENERACIÓN DE ESTRATEGIA CON IA
// ======================================================

router.post('/:id/generate-strategy', async (req, res) => {
    const { id } = req.params;
    try {
        const [projects] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (projects.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado.' });
        const project = projects[0];
        
        const safeParse = (str) => { 
            if (!str) return [];
            try { return JSON.parse(str); } catch(e) { return []; } 
        };

        const projectData = {
            name: project.name,
            niche: project.niche,
            productName: project.product_name,
            description: project.description,
            targetAudience: project.target_audience,
            painPoints: typeof project.pain_points === 'string' ? safeParse(project.pain_points) : project.pain_points,
            keyBenefits: typeof project.key_benefits === 'string' ? safeParse(project.key_benefits) : project.key_benefits,
        };

        const strategyJson = await generateFullStrategy(projectData);
        await pool.query('UPDATE projects SET strategy_json = ? WHERE id = ?', [JSON.stringify(strategyJson), id]);
        res.json(strategyJson);
    } catch (e) {
        console.error("[Project Strategy Error]", e);
        res.status(500).json({ error: e.message || 'Error generando la estrategia.' });
    }
});

module.exports = router;