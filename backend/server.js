require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const { generateContent } = require('./geminiService');
const { authMiddleware } = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = "v2_diagnostic_db_check"; // CAMBIO: Versión actualizada

// Configuración para Cloud Run (Proxy)
app.enable('trust proxy');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// ======================================================
//  INICIALIZACIÓN DB
// ======================================================
const initDb = async () => {
  try {
    // Test de conexión inicial
    const [rows] = await pool.query('SELECT 1 as val');
    console.log(`✅ [DB STARTUP] Conexión exitosa. Test value: ${rows[0].val}`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT NOT NULL,
        date DATE NOT NULL,
        visits INT DEFAULT 0,
        conversions INT DEFAULT 0,
        UNIQUE KEY unique_page_date (page_id, date)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        niche VARCHAR(255),
        description TEXT,
        target_audience TEXT,
        brand_tone VARCHAR(100),
        product_name VARCHAR(255),
        main_goal VARCHAR(255),
        pain_points JSON,
        key_benefits JSON,
        affiliate_links JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ [DB] Tablas verificadas.");
  } catch (err) {
    console.error("⚠️ [DB] Error verificando tablas:", err.message);
  }
};
initDb();

// ======================================================
//  LOGGING & MIDDLEWARE
// ======================================================

app.use((req, res, next) => {
  console.log(`\n⬇️ [REQ ${SERVER_VERSION}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware para detectar subdominio multi-tenant
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  let tenant = null;
  try {
    if (host !== BASE_DOMAIN && host !== `www.${BASE_DOMAIN}` && host.endsWith(`.${BASE_DOMAIN}`)) {
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
//  RUTAS DE DIAGNÓSTICO (PRIORIDAD MÁXIMA)
// ======================================================

// 1. Verificar estado del servidor y DB explícitamente
app.get('/api/debug/db-status', async (req, res) => {
    console.log("🔍 [DEBUG] Ejecutando check de DB...");
    try {
        const [rows] = await pool.query('SELECT 1 as val');
        
        // Verificar si la tabla landing_pages existe y tiene datos
        const [countRows] = await pool.query('SELECT COUNT(*) as count FROM landing_pages');
        
        console.log("✅ [DEBUG] DB OK.");
        res.json({ 
            status: 'online', 
            db_connected: true, 
            server_version: SERVER_VERSION,
            landing_pages_count: countRows[0].count 
        });
    } catch (e) {
        console.error("❌ [DEBUG] DB Error:", e);
        res.status(500).json({ 
            status: 'error', 
            db_connected: false, 
            error: e.message,
            server_version: SERVER_VERSION 
        });
    }
});

// ======================================================
//  RUTAS PÚBLICAS
// ======================================================

// 2. RUTA: POR DOMINIO CUSTOM (Específica)
app.get('/api/public/pages/by-domain', async (req, res) => {
  console.log(`🔍 [ROUTER] MATCHED: /api/public/pages/by-domain`);
  
  let host = req.query.domain || req.hostname || req.headers.host || '';
  if (host.includes(':')) host = host.split(':')[0];
  if (host.startsWith('www.')) host = host.slice(4);

  console.log(`   -> Buscando landing para dominio: '${host}'`);

  try {
    const [rows] = await pool.query(
      `SELECT lp.* FROM landing_pages lp WHERE lp.custom_domain = ? AND lp.is_published = 1 LIMIT 1`,
      [host]
    );

    console.log(`   -> Filas encontradas: ${rows.length}`);

    if (rows.length === 0) {
      return res.status(404).json({ 
        error: 'No hay landing asociada a este dominio en la BD',
        searched_domain: host,
        server_version: SERVER_VERSION
      });
    }

    const page = rows[0];
    if (typeof page.content === 'string') {
      try { page.content = JSON.parse(page.content); } catch {}
    }

    // Registrar visita sin esperar
    pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [page.id]).catch(err => console.error("Error updating visits:", err));
    
    res.json(page);
  } catch (error) {
    console.error('🔥 [ERROR CRÍTICO] /by-domain:', error);
    res.status(500).json({ error: 'Error interno consultando BD', details: error.message, server_version: SERVER_VERSION });
  }
});

// 3. RUTA: POR USUARIO + SLUG
app.get('/api/public/pages/by-user/:userSlug/:slug', async (req, res) => {
  const { userSlug, slug } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT lp.* FROM landing_pages lp
       INNER JOIN users u ON u.id = lp.user_id
       WHERE u.public_subdomain = ? AND lp.subdomain = ? AND lp.is_published = 1 LIMIT 1`,
      [userSlug, slug]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Landing no encontrada' });

    const page = rows[0];
    if (typeof page.content === 'string') {
      try { page.content = JSON.parse(page.content); } catch {}
    }
    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// 4. RUTA: SLUG GENÉRICO / SUBDOMINIO (Catch-all de páginas)
app.get('/api/public/pages/:slug', async (req, res) => {
  const slug = req.params.slug;
  if (slug === 'by-domain') return res.status(404).json({error: "Router conflict: use /by-domain endpoint"});

  const tenant = req.tenantSubdomain;

  try {
    let query = '';
    let params = [];

    if (tenant) {
      query = `SELECT lp.* FROM landing_pages lp INNER JOIN users u ON u.id = lp.user_id WHERE u.public_subdomain = ? AND lp.subdomain LIKE ? AND lp.is_published = 1 LIMIT 1`;
      params = [tenant, `${slug}%`];
    } else {
      query = `SELECT lp.* FROM landing_pages lp WHERE (lp.subdomain = ? OR lp.subdomain LIKE ?) AND lp.is_published = 1 LIMIT 1`;
      params = [slug, `${slug}.%`];
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) return res.status(404).json({ error: 'Landing no encontrada' });

    const page = rows[0];
    if (typeof page.content === 'string') {
      try { page.content = JSON.parse(page.content); } catch {}
    }

    pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [page.id]).catch(console.error);

    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ======================================================
//  RUTAS DE AUTENTICACIÓN
// ======================================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error de servidor' });
  }
});
app.post('/api/login', (req, res) => res.redirect(307, '/api/auth/login'));

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: 'Error' });
  }
});

// ======================================================
//  RUTAS PROTEGIDAS (APP)
// ======================================================
app.post('/api/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const text = await generateContent(model, contents, config);
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API Pages
app.get('/api/pages', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});
app.post('/api/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content } = req.body;
  const [result] = await pool.query(
    `INSERT INTO landing_pages (user_id, name, niche, goal, subdomain, content, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`,
    [req.user.id, name, niche, goal, subdomain, JSON.stringify(content)]
  );
  res.json({ id: result.insertId });
});
app.put('/api/pages/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content, isPublished, name, niche } = req.body;
  await pool.query(
    `UPDATE landing_pages SET content = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche) WHERE id = ? AND user_id = ?`,
    [JSON.stringify(content), isPublished, name, niche, id, req.user.id]
  );
  res.json({ success: true });
});
app.delete('/api/pages/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM landing_pages WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// API Projects
app.get('/api/projects', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});
app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json(rows[0]);
});
app.post('/api/projects', authMiddleware, async (req, res) => {
  const { name, niche, description, targetAudience, brandTone, productName, mainGoal, painPoints, keyBenefits, affiliateLinks } = req.body;
  const [result] = await pool.query(
    `INSERT INTO projects (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [req.user.id, name, niche, description, targetAudience, brandTone, productName, mainGoal, JSON.stringify(painPoints), JSON.stringify(keyBenefits), JSON.stringify(affiliateLinks)]
  );
  res.json({ id: result.insertId });
});
app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { name, niche, description, targetAudience, brandTone, productName, mainGoal, painPoints, keyBenefits, affiliateLinks } = req.body;
  await pool.query(
    `UPDATE projects SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=? WHERE id=? AND user_id=?`,
    [name, niche, description, targetAudience, brandTone, productName, mainGoal, JSON.stringify(painPoints), JSON.stringify(keyBenefits), JSON.stringify(affiliateLinks), req.params.id, req.user.id]
  );
  res.json({ success: true });
});
app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// Analytics & Others
app.get('/api/analytics/weekly', authMiddleware, async (req, res) => {
  const [rows] = await pool.query(`SELECT da.date, SUM(da.visits) as total_visits, SUM(da.conversions) as total_conversions FROM daily_analytics da JOIN landing_pages lp ON da.page_id = lp.id WHERE lp.user_id = ? AND da.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY da.date`, [req.user.id]);
  res.json(rows.map(r => ({ date: r.date, visits: parseInt(r.total_visits), conversions: parseInt(r.total_conversions) })));
});
app.get('/api/articles', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM articles WHERE user_id = ?', [req.user.id]);
  res.json(rows);
});
app.post('/api/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score } = req.body;
  const [result] = await pool.query(`INSERT INTO articles (user_id, title, description, content_html, keyword, seo_score, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`, [req.user.id, title, description, content_html, keyword, seo_score]);
  res.json({ id: result.insertId });
});
app.get('/api/leads', authMiddleware, async (req, res) => {
  const [rows] = await pool.query(`SELECT l.*, p.name as page_name FROM leads l JOIN landing_pages p ON l.page_id = p.id WHERE p.user_id = ? ORDER BY l.captured_at DESC`, [req.user.id]);
  res.json(rows);
});
app.post('/api/leads', async (req, res) => {
  const { pageId, name, email } = req.body;
  await pool.query('INSERT INTO leads (page_id, name, email, captured_at) VALUES (?, ?, ?, NOW())', [pageId, name, email]);
  await pool.query('UPDATE landing_pages SET conversions = conversions + 1 WHERE id = ?', [pageId]);
  res.json({ success: true });
});

app.get('/api/test-db', async (req, res) => {
  try { await pool.query('SELECT 1'); res.json({ message: 'OK' }); } catch(e) { res.status(500).json({ error: e.message }); }
});

// ======================================================
//  SERVIR FRONTEND (CATCH-ALL FINAL)
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    // Si llega aquí es porque NINGUNA ruta anterior hizo match
    console.warn(`⚠️ [404] Ruta API desconocida: ${req.path}`);
    return res.status(404).json({ 
      error: 'API Endpoint Not Found (Backend v2)', 
      server_version: SERVER_VERSION,
      path: req.path
    });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor V2 listo en puerto ${PORT}`);
  console.log(`ℹ️  Versión: ${SERVER_VERSION}`);
});