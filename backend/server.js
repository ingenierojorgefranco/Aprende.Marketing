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
const SERVER_VERSION = 'v4_db_sync_fix'; 

app.enable('trust proxy');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

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
//  INICIALIZACIÓN DB (Tablas necesarias)
// ======================================================
const initDb = async () => {
  console.log(`[DB] ⏳ Iniciando inicialización de base de datos (Versión: ${SERVER_VERSION})...`);
  const connection = await pool.getConnection();
  try {
    // Desactivar checks de llaves foráneas temporalmente para evitar errores si las tablas se crean en desorden
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // 1. Tabla de Usuarios (Base)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        public_subdomain VARCHAR(255) UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_at DATETIME
      )
    `);
    console.log("✅ [DB] Tabla 'users' verificada.");
    
    // 2. Tabla de Landing Pages
    await connection.query(`
      CREATE TABLE IF NOT EXISTS landing_pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255),
        niche VARCHAR(255),
        goal VARCHAR(255),
        subdomain VARCHAR(255),
        custom_domain VARCHAR(255),
        content JSON,
        is_published BOOLEAN DEFAULT FALSE,
        visits INT DEFAULT 0,
        conversions INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ [DB] Tabla 'landing_pages' verificada.");

    // 3. Tabla para Analíticas Diarias
    await connection.query(`
      CREATE TABLE IF NOT EXISTS daily_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT NOT NULL,
        date DATE NOT NULL,
        visits INT DEFAULT 0,
        conversions INT DEFAULT 0,
        UNIQUE KEY unique_page_date (page_id, date),
        FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
      )
    `);

    // 4. Tabla de Proyectos (Estrategias)
    await connection.query(`
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
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ [DB] Tabla 'projects' verificada.");

    // 5. Tabla de Artículos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255),
        description TEXT,
        content_html LONGTEXT,
        keyword VARCHAR(255),
        seo_score INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 6. Tabla de Leads
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (page_id) REFERENCES landing_pages(id) ON DELETE CASCADE
      )
    `);

    // Reactivar checks de llaves foráneas
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log("🚀 [DB] Inicialización completa. Todas las tablas están listas.");
  } catch (err) {
    console.error("⚠️ [DB] Error CRÍTICO verificando tablas:", err);
    console.error("⚠️ [DB] Detalles:", err.message);
    // No matamos el proceso, pero el servidor podría fallar al consultar
  } finally {
    connection.release();
  }
};

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
    res.status(500).json({ error: 'Error IA', details: error.message });
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

  console.log('[PROJECTS] Creando proyecto:', name);

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
    console.log('[PROJECTS] Proyecto guardado con ID:', result.insertId);
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
    // Verificar propiedad
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
    console.error('[PROJECTS] Error updating:', error);
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

// 1. DIAGNÓSTICO (Nuevo)
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

  console.log(`[PUBLIC] Buscando landing para dominio: ${host}`);

  try {
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages WHERE custom_domain = ? AND is_published = 1 LIMIT 1',
      [host]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
          error: 'API Endpoint Not Found',
          debug_message: 'No landing associated with this domain',
          debug_host: host,
          server_version: SERVER_VERSION
      });
    }

    const page = rows[0];
    // Tracking visita
    pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [page.id]).catch(console.error);
    
    // Parse content
    if (typeof page.content === 'string') {
        try { page.content = JSON.parse(page.content); } catch {}
    }
    
    res.json(page);
  } catch (error) {
    console.error('[PUBLIC] Error:', error);
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
    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// 4. GENERIC SLUG
app.get('/api/public/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages WHERE (subdomain = ? OR subdomain LIKE ?) AND is_published = 1 LIMIT 1',
      [slug, `${slug}.%`]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const page = rows[0];
    if (typeof page.content === 'string') try { page.content = JSON.parse(page.content); } catch {}
    res.json(page);
  } catch (e) {
    res.status(500).json({ error: 'Error interno' });
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
    const [rows] = await pool.query('SELECT * FROM articles WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score } = req.body;
  try {
    const [resDb] = await pool.query(
      'INSERT INTO articles (user_id, title, description, content_html, keyword, seo_score, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [req.user.id, title, description, content_html, keyword, seo_score]
    );
    res.json({ id: resDb.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
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

// IMPORTANTE: Primero inicializar DB, luego escuchar
initDb().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Falló la inicialización del servidor:", err);
    process.exit(1);
});