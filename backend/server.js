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

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// ======================================================
//  INICIALIZACIÓN DB (Tablas necesarias)
// ======================================================
const initDb = async () => {
  try {
    // Tabla para analíticas diarias (Histórico)
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

    // Tabla de Proyectos (Nueva Estrategia)
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

    console.log("✅ [DB] Tablas 'daily_analytics' y 'projects' verificadas.");
  } catch (err) {
    console.error("⚠️ [DB] Error verificando tablas:", err.message);
  }
};
initDb();

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
//  REDIRECCIÓN WWW → DOMINIO RAÍZ (solo dominio base)
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  if (host === `www.${BASE_DOMAIN}`) {
    const targetUrl = `https://${BASE_DOMAIN}${req.originalUrl || ''}`;
    console.log(`[REDIRECT] ${host} -> ${targetUrl}`);
    return res.redirect(301, targetUrl);
  }
  next();
});

// ======================================================
//  MULTI-TENANT: DETECTAR SUBDOMINIO (*.aprende.marketing)
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
//  AUTH: REGISTER
// ======================================================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: 'Nombre, email y contraseña son obligatorios' });

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0)
      return res.status(409).json({ error: 'Ya existe un usuario con ese email' });

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)',
      [name, email, passwordHash, role || 'user']
    );

    const newUser = {
      id: result.insertId,
      name,
      email,
      role: role || 'user',
    };

    const token = createToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('[AUTH] Error register:', error);
    res.status(500).json({ error: 'Error interno en registro' });
  }
});

// ======================================================
//  AUTH: LOGIN
// ======================================================
const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ error: 'Email y contraseña son obligatorios' });

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, is_active, public_subdomain FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = rows[0];

    if (!user.is_active)
      return res.status(403).json({ error: 'Usuario inactivo' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [
      user.id,
    ]);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      public_subdomain: user.public_subdomain,
    };

    const token = createToken(userResponse);

    res.json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('[AUTH] Error login:', error.message);
    res.status(500).json({ error: 'Error de conexión con base de datos' });
  }
};

app.post('/api/auth/login', loginHandler);
app.post('/api/login', loginHandler);

// ======================================================
//  AUTH: ME
// ======================================================
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, public_subdomain, created_at, last_login_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(rows[0]);
  } catch (error) {
    console.error('[AUTH] Error me:', error);
    res.status(500).json({ error: 'Error interno en /me' });
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
//  PROYECTOS (NUEVO MODULO)
// ======================================================
app.get('/api/projects', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('[PROJECTS] Error fetching:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const {
    name,
    niche,
    description,
    targetAudience,
    brandTone,
    productName,
    mainGoal,
    painPoints,
    keyBenefits,
    affiliateLinks,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO projects 
       (user_id, name, niche, description, target_audience, brand_tone, product_name, main_goal, pain_points, key_benefits, affiliate_links, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
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
    res.json({ id: result.insertId, message: 'Proyecto creado con éxito' });
  } catch (error) {
    console.error('[PROJECTS] Error creating:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    niche,
    description,
    targetAudience,
    brandTone,
    productName,
    mainGoal,
    painPoints,
    keyBenefits,
    affiliateLinks,
  } = req.body;

  try {
    const [check] = await pool.query(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    if (check.length === 0)
      return res.status(403).json({ error: 'No autorizado' });

    await pool.query(
      `UPDATE projects 
       SET name=?, niche=?, description=?, target_audience=?, brand_tone=?, product_name=?, main_goal=?, pain_points=?, key_benefits=?, affiliate_links=?
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
    res.json({ message: 'Proyecto actualizado con éxito' });
  } catch (error) {
    console.error('[PROJECTS] Error updating:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [
      id,
      req.user.id,
    ]);
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  RUTA PÚBLICA PARA LANDINGS (slug + subdominio / base)
// ======================================================
app.get('/api/public/pages/:slug', async (req, res) => {
  const tenant = req.tenantSubdomain;
  const slug = req.params.slug;

  console.log(
    `[PUBLIC] Buscando página. Slug: "${slug}", Tenant detectado: "${
      tenant || 'N/A'
    }"`
  );

  try {
    let query = '';
    let params = [];

    if (tenant) {
      query = `
        SELECT lp.*
        FROM landing_pages lp
        INNER JOIN users u ON u.id = lp.user_id
        WHERE u.public_subdomain = ?
          AND lp.subdomain LIKE ?
          AND lp.is_published = 1
        LIMIT 1
      `;
      params = [tenant, `${slug}%`];
    } else {
      query = `
        SELECT lp.*
        FROM landing_pages lp
        WHERE (lp.subdomain = ? OR lp.subdomain LIKE ?)
          AND lp.is_published = 1
        LIMIT 1
      `;
      params = [slug, `${slug}.%`];
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'Landing no encontrada o no publicada' });
    }

    const page = rows[0];

    if (typeof page.content === 'string') {
      try {
        page.content = JSON.parse(page.content);
      } catch {}
    }

    // --- LOGICA DE VISITAS ---
    let shouldCountVisit = true;
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.id === page.user_id) {
          shouldCountVisit = false;
        }
      } catch (err) {}
    }

    if (shouldCountVisit) {
      // 1. Contador Total (legacy)
      pool
        .query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [
          page.id,
        ])
        .catch(console.error);

      // 2. Contador Diario
      pool
        .query(
          `
        INSERT INTO daily_analytics (page_id, date, visits, conversions)
        VALUES (?, CURDATE(), 1, 0)
        ON DUPLICATE KEY UPDATE visits = visits + 1
      `,
          [page.id]
        )
        .catch((err) =>
          console.error('[ANALYTICS] Error updating daily visits:', err)
        );
    }

    res.json(page);
  } catch (error) {
    console.error('[PUBLIC] Error landing:', error);
    res.status(500).json({ error: 'Error interno cargando landing' });
  }
});

// ======================================================
//  RUTA PÚBLICA: POR USUARIO + SLUG EN PATH
//  /api/public/pages/by-user/:userSlug/:slug
// ======================================================
app.get('/api/public/pages/by-user/:userSlug/:slug', async (req, res) => {
  const { userSlug, slug } = req.params;

  console.log(
    `[PUBLIC/by-user] userSlug="${userSlug}", slug="${slug}"`
  );

  try {
    const [rows] = await pool.query(
      `
      SELECT lp.*
      FROM landing_pages lp
      INNER JOIN users u ON u.id = lp.user_id
      WHERE u.public_subdomain = ?
        AND lp.subdomain = ?
        AND lp.is_published = 1
      LIMIT 1
      `,
      [userSlug, slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Landing no encontrada' });
    }

    const page = rows[0];
    if (typeof page.content === 'string') {
      try {
        page.content = JSON.parse(page.content);
      } catch {}
    }

    // NO contamos visita aquí (se puede reutilizar lógica de arriba si quieres)

    res.json(page);
  } catch (error) {
    console.error('[PUBLIC] Error landing by-user:', error);
    res
      .status(500)
      .json({ error: 'Error interno cargando landing por usuario' });
  }
});

// ======================================================
//  RUTA PÚBLICA: POR DOMINIO CUSTOM
//  /api/public/pages/by-domain
// ======================================================
app.get('/api/public/pages/by-domain', async (req, res) => {
  let host = req.hostname || req.headers.host || '';

  if (host.includes(':')) {
    host = host.split(':')[0];
  }
  if (host.startsWith('www.')) {
    host = host.slice(4);
  }

  console.log('[PUBLIC/by-domain] Host normalizado:', host);

  try {
    const [rows] = await pool.query(
      `
      SELECT lp.*
      FROM landing_pages lp
      WHERE lp.custom_domain = ?
        AND lp.is_published = 1
      LIMIT 1
      `,
      [host]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: 'No hay landing asociada a este dominio' });
    }

    const page = rows[0];
    if (typeof page.content === 'string') {
      try {
        page.content = JSON.parse(page.content);
      } catch {}
    }

    // Aquí también podrías contar visitas específicas de dominio si quieres
    res.json(page);
  } catch (error) {
    console.error('[PUBLIC] Error landing by-domain:', error);
    res
      .status(500)
      .json({ error: 'Error interno cargando landing por dominio' });
  }
});

// ======================================================
//  ANALYTICS ENDPOINT (NUEVO)
// ======================================================
app.get('/api/analytics/weekly', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        da.date,
        SUM(da.visits) as total_visits,
        SUM(da.conversions) as total_conversions
      FROM daily_analytics da
      JOIN landing_pages lp ON da.page_id = lp.id
      WHERE lp.user_id = ?
        AND da.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY da.date
      ORDER BY da.date ASC
    `,
      [req.user.id]
    );

    const data = rows.map((r) => ({
      date: r.date,
      visits: parseInt(r.total_visits || 0),
      conversions: parseInt(r.total_conversions || 0),
    }));

    res.json(data);
  } catch (error) {
    console.error('[ANALYTICS] Error fetching weekly stats:', error);
    res.status(500).json({ error: 'Error obteniendo analíticas' });
  }
});

// ======================================================
//  CRUD PRIVADO LANDINGS
// ======================================================
app.get('/api/pages', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content } = req.body;

  try {
    const contentString = JSON.stringify(content);

    const [result] = await pool.query(
      `INSERT INTO landing_pages 
       (user_id, name, niche, goal, subdomain, content, is_published, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [req.user.id, name, niche, goal, subdomain, contentString, false]
    );

    res.json({ id: result.insertId, message: 'Página creada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pages/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content, isPublished, name, niche } = req.body;

  try {
    const [check] = await pool.query(
      'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (check.length === 0)
      return res
        .status(403)
        .json({ error: 'No tienes permiso para editar esta página' });

    await pool.query(
      `UPDATE landing_pages
       SET content = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche)
       WHERE id = ?`,
      [JSON.stringify(content), isPublished, name, niche, id]
    );

    res.json({ message: 'Página actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pages/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await pool.query(
      'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (check.length === 0)
      return res
        .status(403)
        .json({ error: 'No tienes permiso para eliminar esta página' });

    await pool.query('DELETE FROM landing_pages WHERE id = ?', [id]);
    res.json({ message: 'Página eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  LEADS
// ======================================================
app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT l.*, p.name AS page_name
      FROM leads l
      JOIN landing_pages p ON l.page_id = p.id
      WHERE p.user_id = ?
      ORDER BY l.captured_at DESC
      `,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/leads', async (req, res) => {
  const { pageId, name, email } = req.body;

  try {
    await pool.query(
      'INSERT INTO leads (page_id, name, email, captured_at) VALUES (?, ?, ?, NOW())',
      [pageId, name, email]
    );

    await pool.query(
      'UPDATE landing_pages SET conversions = conversions + 1 WHERE id = ?',
      [pageId]
    );

    await pool
      .query(
        `
        INSERT INTO daily_analytics (page_id, date, visits, conversions)
        VALUES (?, CURDATE(), 0, 1)
        ON DUPLICATE KEY UPDATE conversions = conversions + 1
      `,
        [pageId]
      )
      .catch((err) =>
        console.error('[ANALYTICS] Error updating daily conversions:', err)
      );

    res.json({ message: 'Lead capturado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  ARTÍCULOS
// ======================================================
app.get('/api/articles', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM articles WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO articles (user_id, title, description, content_html, keyword, seo_score, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [req.user.id, title, description, content_html, keyword, seo_score]
    );

    res.json({ id: result.insertId, message: 'Artículo guardado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  HEALTH + TEST DB
// ======================================================
app.get('/api/test-db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ message: 'Conexión a DB operativa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/healthz', (req, res) => res.status(200).send('OK'));

// ======================================================
//  SERVIR FRONTEND
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api'))
    return res.status(404).json({ error: 'API Not Found' });

  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// ======================================================
//  START SERVER
// ======================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en puerto ${PORT}`);
  console.log(`🌍 Dominio base multi-tenant: ${BASE_DOMAIN}`);
});
