
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, DEFAULT_LIMITS } = require('./authRoutes');

////////// Importación de servicio Systeme.io para sincronización - 07/06/2025 19:30 //////////
const systemeIoService = require('../systemeIoService');
////////// Fin de actualización - 07/06/2025 19:30 //////////

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';

// ======================================================
//  HELPERS INTERNOS
// ======================================================

const isAdminRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch (e) {
        return false;
    }
};

const recordVisit = async (pageId) => {
    try {
        await pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [pageId]);
        const today = new Date().toISOString().split('T')[0];
        await pool.query(
            `INSERT INTO daily_analytics (page_id, date, visits, conversions) 
             VALUES (?, ?, 1, 0) 
             ON DUPLICATE KEY UPDATE visits = visits + 1`,
            [pageId, today]
        );
    } catch (error) {
        console.error(`[Analytics] Error registrando visita para página ${pageId}:`, error.message);
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
          AND YEAR(CURRENT_DATE()) = YEAR(created_at)
    `, [userId, resourceType]);

    const used = rows[0].count;
    if (limit > 9000) return true; 
    if (used >= limit) return false;
    return true;
};

const logUsage = async (userId, resourceType) => {
    try {
        await pool.query('INSERT INTO usage_logs (user_id, resource_type) VALUES (?, ?)', [userId, resourceType]);
    } catch (e) {
        console.error("Error logging usage:", e);
    }
};

const logCRMActivity = async (contactId, type, content) => {
    try {
        await pool.query(
            `INSERT INTO crm_activities (contact_id, type, content, created_at) VALUES (?, ?, ?, NOW())`,
            [contactId, type, content]
        );
    } catch (e) {
        console.error("[CRM Log Error]", e.message);
    }
};

// ======================================================
//  RUTAS PRIVADAS (Gestiòn de Páginas)
// ======================================================

router.get('/pages', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT lp.*, lp.thankyoupage_json, pr.name as project_name 
      FROM landing_pages lp 
      LEFT JOIN projects pr ON lp.project_id = pr.id 
      WHERE lp.user_id = ? 
      ORDER BY lp.created_at DESC
    `, [req.user.id]);
    
    rows.forEach(page => {
        if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
        if (page.thankyoupage_json) {
            const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
            if (!page.content) page.content = {};
            page.content.thankYouPage = tyData;
        }
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content, projectId } = req.body;
  try {
    const [userData] = await pool.query('SELECT plan_limits FROM users WHERE id = ?', [req.user.id]);
    const limits = userData[0]?.plan_limits ? (typeof userData[0].plan_limits === 'string' ? JSON.parse(userData[0].plan_limits) : userData[0].plan_limits) : DEFAULT_LIMITS;
    
    const [count] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
    if (count[0].c >= limits.maxLandings) {
        return res.status(403).json({ error: `Has alcanzado el límite de almacenamiento de ${limits.maxLandings} páginas.` });
    }
    
    const hasQuota = await checkMonthlyQuota(req.user.id, 'landing', limits.maxLandings);
    if (!hasQuota) {
        return res.status(403).json({ error: `Has alcanzado tu cupo mensual de ${limits.maxLandings} páginas.` });
    }

    const tyPage = content.thankYouPage;
    if (tyPage) { delete content.thankYouPage; }

    const [resDb] = await pool.query(
      'INSERT INTO landing_pages (user_id, project_id, name, niche, goal, subdomain, content, thankyoupage_json, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())',
      [req.user.id, projectId || null, name, niche, goal, subdomain, JSON.stringify(content), tyPage ? JSON.stringify(tyPage) : null]
    );

    const pageId = resDb.insertId;
    // NUEVA LÓGICA: Anteponer ID al subdominio para evitar conflictos
    const finalSubdomain = `${pageId}-${subdomain}`;
    await pool.query('UPDATE landing_pages SET subdomain = ? WHERE id = ?', [finalSubdomain, pageId]);

    await logUsage(req.user.id, 'landing');
    await logSystemActivity(req.user.id, req.user.email, 'CREATE_PAGE', 'page', pageId, { name, subdomain: finalSubdomain });
    
    res.json({ id: pageId, subdomain: finalSubdomain, message: 'Página creada correctamente con ID único en URL' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/pages/:id', authMiddleware, async (req, res) => {
  const { content, isPublished, name, niche, projectId } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });
    
    const tyPage = content.thankYouPage;
    if (tyPage) { delete content.thankYouPage; }

    await pool.query(
      'UPDATE landing_pages SET content = ?, thankyoupage_json = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche), project_id = COALESCE(?, project_id) WHERE id = ?',
      [JSON.stringify(content), tyPage ? JSON.stringify(tyPage) : null, isPublished, name, niche, projectId !== undefined ? projectId : null, req.params.id]
    );
    res.json({ message: 'Actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/pages/:id', authMiddleware, async (req, res) => {
  try {
    const [page] = await pool.query('SELECT name FROM landing_pages WHERE id = ?', [req.params.id]);
    await pool.query('DELETE FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    await logSystemActivity(req.user.id, req.user.email, 'DELETE_PAGE', 'page', req.params.id, { name: page[0]?.name });
    res.json({ message: 'Eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  ANALYTICS
// ======================================================

router.get('/analytics/weekly', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT da.date, SUM(da.visits) as visits, SUM(da.conversions) as conversions
        FROM daily_analytics da JOIN landing_pages lp ON da.page_id = lp.id
        WHERE lp.user_id = ? AND da.date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY da.date ORDER BY da.date ASC
    `, [req.user.id]);
    const formatted = rows.map(r => ({
        date: new Date(r.date).toISOString().split('T')[0],
        visits: Number(r.visits),
        conversions: Number(r.conversions)
    }));
    res.json(formatted);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/analytics/summary', authMiddleware, async (req, res) => {
  try {
    const [visitsRes] = await pool.query('SELECT SUM(visits) as v, SUM(conversions) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
    const [pagesRes] = await pool.query('SELECT COUNT(*) as c FROM landing_pages WHERE user_id = ?', [req.user.id]);
    const [articlesRes] = await pool.query('SELECT COUNT(*) as c FROM articles WHERE user_id = ?', [req.user.id]);
    const [projectsRes] = await pool.query('SELECT COUNT(*) as c FROM projects WHERE user_id = ?', [req.user.id]);
    res.json({
        totalVisits: visitsRes[0].v || 0,
        totalConversions: visitsRes[0].c || 0,
        totalPages: pagesRes[0].c || 0,
        totalArticles: articlesRes[0].c || 0,
        totalProjects: projectsRes[0].c || 0
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  RUTAS PÚBLICAS
// ======================================================

router.get('/public/pages/by-domain', async (req, res) => {
  let host = req.query.domain || req.hostname || req.headers.host || '';
  if (host.includes(':')) host = host.split(':')[0];
  if (host.startsWith('www.')) host = host.slice(4);
  try {
    const [rows] = await pool.query(
      'SELECT *, thankyoupage_json FROM landing_pages WHERE custom_domain = ? AND is_published = 1 LIMIT 1',
      [host]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Página no encontrada' });
    const page = rows[0];
    if (!isAdminRequest(req)) { await recordVisit(page.id); }
    if (typeof page.content === 'string') { try { page.content = JSON.parse(page.content); } catch {} }
    if (page.thankyoupage_json) {
        const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
        if (!page.content) page.content = {};
        page.content.thankYouPage = tyData;
    }
    res.json(page);
  } catch (error) { res.status(500).json({ error: 'Error interno' }); }
});

router.get('/public/pages/by-user/:userSlug/:slug', async (req, res) => {
  const { userSlug, slug } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT lp.*, lp.thankyoupage_json FROM landing_pages lp
       INNER JOIN users u ON u.id = lp.user_id
       WHERE u.public_subdomain = ? AND lp.subdomain = ? AND lp.is_published = 1 LIMIT 1`,
      [userSlug, slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const page = rows[0];
    if (!isAdminRequest(req)) { await recordVisit(page.id); }
    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    if (page.thankyoupage_json) {
        const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
        if (!page.content) page.content = {};
        page.content.thankYouPage = tyData;
    }
    res.json(page);
  } catch (e) { res.status(500).json({ error: 'Error interno' }); }
});

router.get('/public/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    let rows = [];
    if (/^\d+$/.test(slug)) {
       [rows] = await pool.query('SELECT *, thankyoupage_json FROM landing_pages WHERE id = ? AND is_published = 1 LIMIT 1', [slug]);
    }
    if (rows.length === 0) {
        [rows] = await pool.query('SELECT *, thankyoupage_json FROM landing_pages WHERE (subdomain = ? OR subdomain LIKE ?) AND is_published = 1 LIMIT 1', [slug, `${slug}.%`]);
    }
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const page = rows[0];
    if (!isAdminRequest(req)) { await recordVisit(page.id); }
    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    if (page.thankyoupage_json) {
        const tyData = typeof page.thankyoupage_json === 'string' ? JSON.parse(page.thankyoupage_json) : page.thankyoupage_json;
        if (!page.content) page.content = {};
        page.content.thankYouPage = tyData;
    }
    res.json(page);
  } catch (e) { res.status(500).json({ error: 'Error interno' }); }
});

router.post('/public/leads/submit', async (req, res) => {
    const { pageId, name, email, phone } = req.body;
    if (!pageId || !email) return res.status(400).json({ error: 'Datos incompletos' });
    try {
        const [pageRows] = await pool.query('SELECT user_id, name, subdomain FROM landing_pages WHERE id = ?', [pageId]);
        if (pageRows.length === 0) return res.status(404).json({ error: 'Página no válida' });
        const ownerId = pageRows[0].user_id;
        const pageName = pageRows[0].name;
        const pageSlug = pageRows[0].subdomain;

        await pool.query(
            'INSERT INTO leads (page_id, name, email, captured_at) VALUES (?, ?, ?, NOW())',
            [pageId, name || 'Anónimo', email]
        );
        await pool.query('UPDATE landing_pages SET conversions = conversions + 1 WHERE id = ?', [pageId]);
        const today = new Date().toISOString().split('T')[0];
        await pool.query(
            `INSERT INTO daily_analytics (page_id, date, visits, conversions) 
             VALUES (?, ?, 0, 1) 
             ON DUPLICATE KEY UPDATE conversions = conversions + 1`,
            [pageId, today]
        );

        const [existing] = await pool.query(
            'SELECT id FROM crm_contacts WHERE user_id = ? AND email = ?',
            [ownerId, email]
        );

        const activityPayload = JSON.stringify({ text: "Registro inicial desde:", pageName: pageName, slug: pageSlug });
        const reConversionPayload = JSON.stringify({ text: "Re-conversión en landing:", pageName: pageName, slug: pageSlug });
        
        let contactId;
        if (existing.length > 0) {
            contactId = existing[0].id;
            await pool.query('UPDATE crm_contacts SET updated_at = NOW() WHERE id = ?', [contactId]);
            await logCRMActivity(contactId, 'lead_submission', reConversionPayload);
        } else {
            const [newContact] = await pool.query(
                `INSERT INTO crm_contacts (user_id, page_id, name, email, phone, source, status, interest_level, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, 'new', 'warm', NOW(), NOW())`,
                [ownerId, pageId, name || 'Prospecto', email, phone || '', `Landing: ${pageName}`]
            );
            contactId = newContact.insertId;
            await logCRMActivity(contactId, 'lead_submission', activityPayload);
        }

        ////////// Actualización: Disparador automático para Systeme.io al capturar lead con manejo de errores mejorado - 15/06/2025 16:30 //////////
        try {
            const [intRows] = await pool.query(
                "SELECT setting_value FROM system_settings WHERE setting_key = ?",
                [`integrations_${ownerId}`]
            );
            if (intRows.length > 0) {
                const settings = JSON.parse(intRows[0].setting_value);
                if (settings.systemeIoKey) {
                    // Primero intentamos la comunicación con la API externa
                    try {
                        await systemeIoService.addContact(settings.systemeIoKey, email, name || 'Prospecto');
                        // Si la API tiene éxito, intentamos actualizar el estado de sincronización localmente
                        try {
                            await pool.query('UPDATE leads SET synced = 1 WHERE page_id = ? AND email = ?', [pageId, email]);
                        } catch (dbSyncErr) {
                            console.error("[Systeme.io Local DB Sync Error]:", dbSyncErr.message);
                        }
                    } catch (apiSyncErr) {
                        console.error("[Systeme.io External API Error]:", apiSyncErr.message);
                    }
                }
            }
        } catch (intFetchErr) {
            console.error("[Integration Fetch Error]:", intFetchErr.message);
        }
        ////////// Fin de actualización - 15/06/2025 16:30 //////////

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Error interno al procesar lead' });
    }
});

module.exports = router;
