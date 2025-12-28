
const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, DEFAULT_LIMITS } = require('./authRoutes');
const { generateFullStrategy, analyzeSalesPageContent } = require('../geminiService');

const router = express.Router();

// ======================================================
//  HELPERS DE PROCESAMIENTO
// ======================================================

const safeParseJson = (str) => {
    if (!str) return null;
    try {
        let parsed = typeof str === 'string' ? JSON.parse(str) : str;
        if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
        }
        return parsed;
    } catch (e) {
        console.error("Error parsing JSON:", e.message);
        return null;
    }
};

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

router.use(authMiddleware);

// ======================================================
//  ANÁLISIS DE URL EXTERNA
// ======================================================

router.post('/analyze-url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL no proporcionada" });

    try {
        // Fetch HTML content from the URL
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        
        if (!response.ok) throw new Error(`Could not fetch the URL: ${response.statusText}`);
        
        const html = await response.text();
        
        // Basic Cleanup: strip scripts and styles to save tokens
        const cleanedText = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmb, '')
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmb, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Call Gemini Service for strategic extraction
        const analysis = await analyzeSalesPageContent(cleanedText);
        
        res.json({ analysis });

    } catch (e) {
        console.error("[Analyze URL Route Error]", e);
        res.status(500).json({ error: "No se pudo extraer información del sitio. Verifica que la URL sea válida y accesible." });
    }
});

// ======================================================
//  CRUD DE PROYECTOS
// ======================================================

router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM projects';
    let params = [];
    
    if (req.user.role !== 'admin') {
        query += ' WHERE user_id = ?';
        params.push(req.user.id);
    }
    
    query += ' ORDER BY updated_at DESC';
    
    const [rows] = await pool.query(query, params);

    const projects = rows.map(p => ({
        ...p,
        pain_points: safeParseJson(p.pain_points),
        key_benefits: safeParseJson(p.key_benefits),
        affiliate_links: safeParseJson(p.affiliate_links),
        strategy_json: safeParseJson(p.strategy_json)
    }));

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error cargando proyectos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let query = 'SELECT * FROM projects WHERE id = ?';
    let params = [req.params.id];
    
    if (req.user.role !== 'admin') {
        query += ' AND user_id = ?';
        params.push(req.user.id);
    }

    const [rows] = await pool.query(query, params);
    
    if (rows.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado o sin permisos' });
    
    const project = rows[0];
    project.pain_points = safeParseJson(project.pain_points);
    project.key_benefits = safeParseJson(project.key_benefits);
    project.affiliate_links = safeParseJson(project.affiliate_links);
    project.strategy_json = safeParseJson(project.strategy_json);

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks, strategy_json,
    fullPrice, commissionRate, leadMagnetType, salesPageUrl
  } = req.body;
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    
    const [count] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxProjects && req.user.role !== 'admin') {
        return res.status(403).json({ error: `Has alcanzado el límite de almacenamiento de ${limits.maxProjects} proyectos.` });
    }
    
    const hasQuota = await checkMonthlyQuota(req.user.id, 'project', limits.maxProjects);
    if (!hasQuota) {
        return res.status(403).json({ error: `Has alcanzado tu cupo mensual de ${limits.maxProjects} generaciones de proyectos.` });
    }

    const [result] = await pool.query(
      `INSERT INTO projects 
       (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, strategy_json, full_price, commission_rate, lead_magnet_type, sales_page_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
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
        strategy_json ? JSON.stringify(strategy_json) : null,
        fullPrice || 0,
        commissionRate || 0,
        leadMagnetType || '',
        salesPageUrl || ''
      ]
    );
    await logUsage(req.user.id, 'project');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
    res.json({ id: result.insertId, message: 'Proyecto guardado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando proyecto en BD' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks, strategy_json,
    fullPrice, commissionRate, leadMagnetType, salesPageUrl
  } = req.body;
  try {
    const [check] = await pool.query('SELECT user_id FROM projects WHERE id = ?', [id]);
    if (check.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    
    if (check[0].user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado' });
    }
    
    await pool.query(
      `UPDATE projects 
       SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?, strategy_json=?, full_price=?, commission_rate=?, lead_magnet_type=?, sales_page_url=?, updated_at=NOW()
       WHERE id=?`,
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
        fullPrice || 0,
        commissionRate || 0,
        leadMagnetType || '',
        salesPageUrl || '',
        id
      ]
    );
    res.json({ message: 'Proyecto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando proyecto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [proj] = await pool.query('SELECT name, user_id FROM projects WHERE id = ?', [req.params.id]);
    if (proj.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    
    if (proj[0].user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado' });
    }

    await pool.query('DELETE FROM landing_pages WHERE project_id = ?', [req.params.id]);
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
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
        let query = 'SELECT * FROM projects WHERE id = ?';
        let params = [id];
        
        if (req.user.role !== 'admin') {
            query += ' AND user_id = ?';
            params.push(req.user.id);
        }

        const [projects] = await pool.query(query, params);
        if (projects.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado o sin permisos.' });
        const project = projects[0];
        
        const strategyJson = await generateFullStrategy({
            name: project.name,
            niche: project.niche || project.name,
            productName: project.product_name,
            description: project.description,
            brandTone: project.brand_tone,
            fullPrice: project.full_price,
            commissionRate: project.commission_rate,
            leadMagnetType: project.lead_magnet_type,
            salesPageUrl: project.sales_page_url
        });

        await pool.query('UPDATE projects SET strategy_json = ? WHERE id = ?', [JSON.stringify(strategyJson), id]);
        res.json(strategyJson);
    } catch (e) {
        console.error("[Project Strategy Error]", e);
        res.status(500).json({ error: e.message || 'Error generando la estrategia.' });
    }
});

module.exports = router;
