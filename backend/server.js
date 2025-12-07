require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const initDb = require('./initDb'); // Módulo dedicado
const { generateContent } = require('./geminiService');
const { authMiddleware } = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v11_large_payload_fix_express'; 

app.enable('trust proxy');

app.use(cors());

// INCREASED LIMITS FOR LARGE ARTICLES (Both Express and BodyParser)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ======================================================
//  LOGGING
// ======================================================
app.use((req, res, next) => {
  console.log(
    `[API] ${req.method} ${req.path} (host: ${req.hostname || req.headers.host})`
  );
  next();
});

// ======================================================
//  REDIRECCIÓN WWW → DOMINIO RAÍZ
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  if (host === `www.${BASE_DOMAIN}`) {
    const targetUrl = `https://${BASE_DOMAIN}${req.originalUrl || ''}`;
    return res.redirect(301, targetUrl);
  }
  next();
});

// ======================================================
//  MULTI-TENANT: DETECTAR SUBDOMINIO
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  let tenant = null;

  try {
    if (host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}`) {
      tenant = null;
    } else if (host.endsWith(`.${BASE_DOMAIN}`)) {
      const sub = host.replace(`.${BASE_DOMAIN}`, '');
      tenant = sub.split('.')[0];
    }
  } catch (e) {
    tenant = null;
  }

  req.tenantSubdomain = tenant;
  next();
});

// ======================================================
//  HELPERS ANALYTICS
// ======================================================
const recordVisit = async (pageId) => {
    try {
        // 1. Actualizar contador total (Histórico)
        await pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [pageId]);
        
        // 2. Insertar/Actualizar en historial diario (YYYY-MM-DD) para la gráfica
        const today = new Date().toISOString().split('T')[0];
        await pool.query(
            `INSERT INTO daily_analytics (page_id, date, visits, conversions) 
             VALUES (?, ?, 1, 0) 
             ON DUPLICATE KEY UPDATE visits = visits + 1`,
            [pageId, today]
        );
    } catch (error) {
        // No bloqueamos la respuesta si falla el analytics
        console.error(`[Analytics] Error registrando visita para página ${pageId}:`, error.message);
    }
};

/**
 * Verifica si la petición viene de un usuario logueado (Admin/Dueño).
 * Si tiene token válido, retorna TRUE.
 */
const isAdminRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false; // No hay token -> Es visitante
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        jwt.verify(token, JWT_SECRET);
        return true; // Token válido -> Es admin
    } catch (e) {
        return false; // Token inválido -> Es visitante
    }
};

// ======================================================
//  HELPERS AUTH
// ======================================================
const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// ======================================================
//  AUTH
// ======================================================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ error: 'Email ya registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)',
      [name, email, passwordHash, role || 'user']
    );
    const newUser = { id: result.insertId, name, email, role: role || 'user' };
    const token = createToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('[AUTH] Error register:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, is_active, public_subdomain FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ error: 'Usuario inactivo' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      public_subdomain: user.public_subdomain,
    };
    const token = createToken(userResponse);
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('[AUTH] Error login:', error);
    res.status(500).json({ error: 'Error de base de datos' });
  }
};

app.post('/api/auth/login', loginHandler);
app.post('/api/login', loginHandler);

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, public_subdomain FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// ======================================================
//  GEMINI AI
// ======================================================
app.post('/api/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error AI:', error);
    // Devolvemos JSON válido incluso en error para evitar crash en frontend
    res.status(500).json({ error: 'Error IA', details: error.message, text: '' });
  }
});

// ======================================================
//  PROYECTOS (ESTRATEGIAS) - CRUD COMPLETO
// ======================================================
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('[PROJECTS] Error fetching:', error);
    res.status(500).json({ error: 'Error cargando proyectos' });
  }
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const {
    name, niche, description, targetAudience, brandTone,
    productName, mainGoal, painPoints, keyBenefits, affiliateLinks
  } = req.body;

  try {
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
    res.json({ id: result.insertId, message: 'Proyecto guardado exitosamente' });
  } catch (error) {
    console.error('[PROJECTS] Error creating:', error);
    res.status(500).json({ error: 'Error guardando proyecto en BD' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  RUTAS PÚBLICAS LANDINGS (PRIORIDAD ALTA)
// ======================================================

// 1. DIAGNÓSTICO
app.get('/api/debug/db-status', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT 1 as val');
      res.json({ 
          status: 'online', 
          db_response: rows[0].val, 
          server_version: SERVER_VERSION,
          timestamp: new Date().toISOString()
      });
  } catch (e) {
      res.status(500).json({ status: 'offline', error: e.message, server_version: SERVER_VERSION });
  }
});

// 2. BY DOMAIN
app.get('/api/public/pages/by-domain', async (req, res) => {
  let host = req.query.domain || req.hostname || req.headers.host || '';
  if (host.includes(':')) host = host.split(':')[0];
  if (host.startsWith('www.')) host = host.slice(4);

  try {
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages WHERE custom_domain = ? AND is_published = 1 LIMIT 1',
      [host]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
          error: 'API Endpoint Not Found',
          server_version: SERVER_VERSION
      });
    }

    const page = rows[0];
    
    // REGISTRAR VISITA SOLO SI NO ES ADMIN
    if (!isAdminRequest(req)) {
        recordVisit(page.id);
    }
    
    if (typeof page.content === 'string') {
        try { page.content = JSON.parse(page.content); } catch {}
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Error interno', server_version: SERVER_VERSION });
  }
});

// 3. BY USER+SLUG
app.get('/api/public/pages/by-user/:userSlug/:slug', async (req, res) => {
  const { userSlug, slug } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT lp.* FROM landing_pages lp
       INNER JOIN users u ON u.id = lp.user_id
       WHERE u.public_subdomain = ? AND lp.subdomain = ? AND lp.is_published = 1 LIMIT 1`,
      [userSlug, slug]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const page = rows[0];

    // REGISTRAR VISITA SOLO SI NO ES ADMIN
    if (!isAdminRequest(req)) {
        recordVisit(page.id);
    }

    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// 4. GENERIC SLUG (Modified to support ID lookup fallback)
app.get('/api/public/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    let rows = [];

    // Attempt to lookup by ID if the slug is numeric
    // This solves issues where frontend links use ID as a fallback when subdomain is missing
    if (/^\d+$/.test(slug)) {
       [rows] = await pool.query(
           'SELECT * FROM landing_pages WHERE id = ? AND is_published = 1 LIMIT 1',
           [slug]
       );
    }

    // If not found by ID (or slug wasn't numeric), try by subdomain/slug
    if (rows.length === 0) {
        [rows] = await pool.query(
          'SELECT * FROM landing_pages WHERE (subdomain = ? OR subdomain LIKE ?) AND is_published = 1 LIMIT 1',
          [slug, `${slug}.%`]
        );
    }

    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const page = rows[0];

    // REGISTRAR VISITA SOLO SI NO ES ADMIN
    if (!isAdminRequest(req)) {
        recordVisit(page.id);
    }

    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// 5. BLOG PÚBLICO
app.get('/api/public/pages/:pageId/blog', async (req, res) => {
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

app.get('/api/public/articles/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT * FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`,
            [slug]
        );
        if(rows.length === 0) return res.status(404).json({ error: "Artículo no encontrado" });
        res.json(rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  ANALYTICS (NEW)
// ======================================================
app.get('/api/analytics/weekly', authMiddleware, async (req, res) => {
  try {
    // Obtener datos de los últimos 7 días para todas las páginas del usuario
    const [rows] = await pool.query(`
        SELECT 
            da.date, 
            SUM(da.visits) as visits, 
            SUM(da.conversions) as conversions
        FROM daily_analytics da
        JOIN landing_pages lp ON da.page_id = lp.id
        WHERE lp.user_id = ? 
          AND da.date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY da.date
        ORDER BY da.date ASC
    `, [req.user.id]);

    // Formatear fechas para que el frontend las entienda fácil (YYYY-MM-DD)
    const formatted = rows.map(r => ({
        date: new Date(r.date).toISOString().split('T')[0],
        visits: Number(r.visits),
        conversions: Number(r.conversions)
    }));
    
    res.json(formatted);
  } catch (e) {
    console.error('[Analytics] Error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ======================================================
//  LANDING PAGES CRUD
// ======================================================
app.get('/api/pages', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content } = req.body;
  try {
    const [resDb] = await pool.query(
      'INSERT INTO landing_pages (user_id, name, niche, goal, subdomain, content, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW())',
      [req.user.id, name, niche, goal, subdomain, JSON.stringify(content)]
    );
    res.json({ id: resDb.insertId, message: 'Página creada' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/pages/:id', authMiddleware, async (req, res) => {
  const { content, isPublished, name, niche } = req.body;
  try {
    const [check] = await pool.query('SELECT id FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado' });

    await pool.query(
      'UPDATE landing_pages SET content = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche) WHERE id = ?',
      [JSON.stringify(content), isPublished, name, niche, req.params.id]
    );
    res.json({ message: 'Actualizado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/pages/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Eliminado' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  ARTICULOS & LEADS
// ======================================================
app.get('/api/articles', authMiddleware, async (req, res) => {
  try {
    // JOIN with landing_pages to get subdomain for dashboard links
    // IMPORTANT: Ensure we fetch subdomain. If subdomain is NULL, page_subdomain will be NULL.
    // ADDED: lp.name as page_name
    const [rows] = await pool.query(
        `SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name 
         FROM articles a 
         LEFT JOIN landing_pages lp ON a.page_id = lp.id 
         WHERE a.user_id = ? 
         ORDER BY a.created_at DESC`, 
        [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET Single Article (Private)
app.get('/api/articles/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM articles WHERE id = ? AND user_id = ?`,
            [req.params.id, req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;
  
  // Generar slug si no existe
  let finalSlug = slug;
  if (!finalSlug && title) {
      finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  try {
    const [resDb] = await pool.query(
      `INSERT INTO articles 
      (user_id, page_id, title, slug, description, content_html, keyword, seo_score, featured_image, meta_title, meta_description, status, published_at, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        req.user.id, 
        page_id || null, 
        title, 
        finalSlug, 
        description, 
        content_html, 
        keyword, 
        seo_score, 
        featured_image, 
        meta_title, 
        meta_description, 
        status || 'published', 
        published_at ? new Date(published_at) : new Date() // Fix: Convert string to Date
      ]
    );
    res.json({ id: resDb.insertId });
  } catch (e) { 
      console.error("[DB Insert Error] Falló el guardado del artículo:", e);
      res.status(500).json({ error: e.message }); 
  }
});

// PUT Article
app.put('/api/articles/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, content_html, keyword, seo_score, page_id, slug, featured_image, meta_title, meta_description, status, published_at } = req.body;

  try {
    const [check] = await pool.query('SELECT id FROM articles WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (check.length === 0) return res.status(403).json({ error: 'No autorizado o no encontrado' });

    let finalSlug = slug;
    if (!finalSlug && title) {
        finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await pool.query(
      `UPDATE articles SET 
        page_id=?, title=?, slug=?, description=?, content_html=?, featured_image=?, keyword=?, seo_score=?, meta_title=?, meta_description=?, status=?, published_at=?
       WHERE id=? AND user_id=?`,
      [
        page_id || null, 
        title, 
        finalSlug, 
        description, 
        content_html, 
        featured_image, 
        keyword, 
        seo_score, 
        meta_title, 
        meta_description, 
        status, 
        published_at ? new Date(published_at) : new Date(), // Fix: Convert string to Date
        id, 
        req.user.id
      ]
    );
    res.json({ message: 'Artículo actualizado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, p.name as page_name FROM leads l 
       JOIN landing_pages p ON l.page_id = p.id WHERE p.user_id = ? ORDER BY l.captured_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  START SERVER (Sequential Sync)
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found', server_version: SERVER_VERSION });
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// IMPORTANTE: Ejecutar initDb pero NO matar el proceso si falla para permitir que Cloud Run arranque
initDb().then(() => {
    console.log('✅ Base de datos inicializada correctamente.');
}).catch(err => {
    console.error("⚠️ Error inicializando base de datos (iniciando servidor en modo degradado):", err.message);
}).finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    });
});