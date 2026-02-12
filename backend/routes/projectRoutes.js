const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, DEFAULT_LIMITS } = require('./authRoutes');
const { generateFullStrategy, analyzeWebsiteContent } = require('../geminiService');
const https = require('https');

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
//  BIBLIOTECA MAESTRA
// ======================================================

router.get('/master-library', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.* FROM projects p 
             WHERE p.is_master = 1 
             AND p.user_id != ? 
             AND p.id NOT IN (SELECT project_id FROM unlocked_projects WHERE user_id = ?)
             ORDER BY p.created_at DESC`,
            [req.user.id, req.user.id]
        );
        const projects = rows.map(p => ({
            ...p,
            pain_points: safeParseJson(p.pain_points),
            key_benefits: safeParseJson(p.key_benefits),
            affiliate_links: safeParseJson(p.affiliate_links),
            strategy_json: safeParseJson(p.strategy_json),
            isMaster: !!p.is_master
        }));
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Error cargando biblioteca maestra' });
    }
});

router.post('/unlock/:id', async (req, res) => {
    const projectId = req.params.id;
    try {
        const [projRows] = await pool.query('SELECT is_master, name FROM projects WHERE id = ?', [projectId]);
        if (projRows.length === 0 || !projRows[0].is_master) {
            return res.status(404).json({ error: 'Proyecto maestro no encontrado.' });
        }
        const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
        const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
        const [countRows] = await pool.query(`
            SELECT (SELECT COUNT(*) FROM projects WHERE user_id = ?) + (SELECT COUNT(*) FROM unlocked_projects WHERE user_id = ?) as total
        `, [req.user.id, req.user.id]);
        if (countRows[0].total >= limits.maxProjects && req.user.role !== 'admin') {
            return res.status(403).json({ error: `Has alcanzado el límite de ${limits.maxProjects} proyectos.` });
        }
        await pool.query('INSERT IGNORE INTO unlocked_projects (user_id, project_id) VALUES (?, ?)', [req.user.id, projectId]);
        await logSystemActivity(req.user.id, req.user.email, 'UNLOCK_PROJECT', 'project', projectId, { name: projRows[0].name });
        res.json({ success: true, message: 'Estrategia desbloqueada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al desbloquear el proyecto' });
    }
});

// ======================================================
//  ANALIZADOR INTELIGENTE
// ======================================================

router.post('/analyze-site', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL no proporcionada' });

    try {
        const fetchUrl = (targetUrl) => {
            return new Promise((resolve, reject) => {
                const options = {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                    },
                    timeout: 15000
                };
                https.get(targetUrl, options, (response) => {
                    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                        return fetchUrl(new URL(response.headers.location, targetUrl).href).then(resolve).catch(reject);
                    }
                    if (response.statusCode !== 200) return reject(new Error(`Servidor respondió con código ${response.statusCode}`));
                    let data = '';
                    response.on('data', (chunk) => data += chunk);
                    response.on('end', () => resolve(data));
                }).on('error', (err) => reject(err));
            });
        };

        const html = await fetchUrl(url);
        
        // LIMPIEZA PROFUNDA DE HTML
        let cleanText = html
            .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") // Quitar scripts
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")   // Quitar estilos
            .replace(/<!--[\s\S]*?-->/g, "")                      // Quitar comentarios HTML
            .replace(/<svg\b[^>]*>([\s\S]*?)<\/svg>/gim, "")      // Quitar SVGs
            .replace(/<[^>]+>/g, ' ')                             // Quitar tags pero dejar espacio
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')                                 // Unificar espacios
            .trim();

        console.log(`[SCRAPER AUDIT] Longitud extraída: ${cleanText.length} caracteres.`);

        if (!cleanText || cleanText.length < 200) {
            return res.status(422).json({ error: 'No se pudo extraer contenido suficiente. El sitio podría estar protegido o cargado dinámicamente.' });
        }

        const analysis = await analyzeWebsiteContent(cleanText);
        res.json(analysis);

    } catch (error) {
        console.error("[Analyze Site Error]", error);
        res.status(500).json({ error: error.message || 'Error analizando el sitio web.' });
    }
});

// ======================================================
//  CRUD DE PROYECTOS
// ======================================================

router.get('/', async (req, res) => {
  try {
    let query = `
      SELECT p.*, (p.user_id = ?) as is_owner,
             EXISTS(SELECT 1 FROM unlocked_projects up WHERE up.project_id = p.id AND up.user_id = ?) as is_unlocked
      FROM projects p LEFT JOIN unlocked_projects up ON p.id = up.project_id AND up.user_id = ?
      WHERE p.user_id = ? OR up.user_id = ? ORDER BY p.updated_at DESC
    `;
    let params = [req.user.id, req.user.id, req.user.id, req.user.id, req.user.id];
    if (req.user.role === 'admin') {
        query = 'SELECT *, (user_id = ?) as is_owner, (is_master = 1) as is_master_logic FROM projects ORDER BY updated_at DESC';
        params = [req.user.id];
    }
    const [rows] = await pool.query(query, params);
    const projects = rows.map(p => ({
        ...p,
        pain_points: safeParseJson(p.pain_points),
        key_benefits: safeParseJson(p.key_benefits),
        affiliate_links: safeParseJson(p.affiliate_links),
        strategy_json: safeParseJson(p.strategy_json),
        isMaster: !!p.is_master,
        isUnlocked: !!p.is_unlocked
    }));
    res.json(projects);
  } catch (error) { res.status(500).json({ error: 'Error cargando proyectos' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT p.*, (p.user_id = ?) as is_owner
        FROM projects p LEFT JOIN unlocked_projects up ON p.id = up.project_id AND up.user_id = ?
        WHERE p.id = ? AND (p.user_id = ? OR up.user_id = ? OR ? = 'admin') LIMIT 1
    `, [req.user.id, req.user.id, req.params.id, req.user.id, req.user.id, req.user.role]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    const project = rows[0];
    project.pain_points = safeParseJson(project.pain_points);
    project.key_benefits = safeParseJson(project.key_benefits);
    project.affiliate_links = safeParseJson(project.affiliate_links);
    project.strategy_json = safeParseJson(project.strategy_json);
    project.isMaster = !!project.is_master;
    res.json(project);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', async (req, res) => {
  const { name, niche, description, targetAudience, brandTone, productName, mainGoal, painPoints, keyBenefits, affiliateLinks, strategy_json, fullPrice, commissionRate, leadMagnetType, salesPageUrl, isMaster } = req.body;
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    const [countRows] = await pool.query(`SELECT (SELECT COUNT(*) FROM projects WHERE user_id = ?) + (SELECT COUNT(*) FROM unlocked_projects WHERE user_id = ?) as total`, [req.user.id, req.user.id]);
    if (countRows[0].total >= limits.maxProjects && req.user.role !== 'admin') return res.status(403).json({ error: `Límite alcanzado.` });
    if (!await checkMonthlyQuota(req.user.id, 'project', limits.maxProjects)) return res.status(403).json({ error: `Cupo mensual alcanzado.` });

    const isMasterFinal = (req.user.role === 'admin' && isMaster === true) ? 1 : 0;
    const [result] = await pool.query(
      `INSERT INTO projects (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, strategy_json, full_price, commission_rate, lead_magnet_type, sales_page_url, is_master, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [req.user.id, name, niche, description, targetAudience, brandTone, productName, mainGoal, JSON.stringify(painPoints || []), JSON.stringify(keyBenefits || []), JSON.stringify(affiliateLinks || []), strategy_json ? JSON.stringify(strategy_json) : null, fullPrice || 0, commissionRate || 0, leadMagnetType || '', salesPageUrl || '', isMasterFinal]
    );
    await logUsage(req.user.id, 'project');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PROJECT', 'project', result.insertId, { name });
    res.json({ id: result.insertId });
  } catch (error) { res.status(500).json({ error: 'Error BD' }); }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, niche, description, targetAudience, brandTone, productName, mainGoal, painPoints, keyBenefits, affiliateLinks, strategy_json, fullPrice, commissionRate, leadMagnetType, salesPageUrl, isMaster } = req.body;
  try {
    const [check] = await pool.query('SELECT user_id, is_master FROM projects WHERE id = ?', [id]);
    if (check.length === 0 || (check[0].user_id !== req.user.id && req.user.role !== 'admin')) return res.status(403).json({ error: 'No autorizado' });
    const isMasterFinal = (req.user.role === 'admin' && isMaster !== undefined) ? (isMaster ? 1 : 0) : check[0].is_master;
    await pool.query(
      `UPDATE projects SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?, strategy_json=?, full_price=?, commission_rate=?, lead_magnet_type=?, sales_page_url=?, is_master=?, updated_at=NOW() WHERE id=?`,
      [name, niche, description, targetAudience, brandTone, productName, mainGoal, JSON.stringify(painPoints || []), JSON.stringify(keyBenefits || []), JSON.stringify(affiliateLinks || []), strategy_json ? JSON.stringify(strategy_json) : null, fullPrice || 0, commissionRate || 0, leadMagnetType || '', salesPageUrl || '', isMasterFinal, id]
    );
    res.json({ message: 'Actualizado' });
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const [proj] = await pool.query('SELECT user_id FROM projects WHERE id = ?', [req.params.id]);
    if (proj.length === 0) return res.status(404).json({ error: 'No encontrado' });
    if (proj[0].user_id !== req.user.id && req.user.role !== 'admin') {
        await pool.query('DELETE FROM unlocked_projects WHERE user_id = ? AND project_id = ?', [req.user.id, req.params.id]);
        return res.json({ message: 'Quitado de biblioteca.' });
    }
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    await logSystemActivity(req.user.id, req.user.email, 'DELETE_PROJECT', 'project', req.params.id, {});
    res.json({ message: 'Eliminado.' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/:id/generate-strategy', async (req, res) => {
    try {
        const [projects] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (projects.length === 0 || (projects[0].user_id !== req.user.id && req.user.role !== 'admin')) return res.status(403).json({ error: 'No autorizado' });
        const strategyJson = await generateFullStrategy(projects[0]);
        await pool.query('UPDATE projects SET strategy_json = ? WHERE id = ?', [JSON.stringify(strategyJson), req.params.id]);
        res.json(strategyJson);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;