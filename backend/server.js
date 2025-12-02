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
//  LOGGING BÁSICO
// ======================================================
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.path}`);
  next();
});

// ======================================================
//  MIDDLEWARE PARA DETECTAR SUBDOMINIO (TENANT)
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  let tenant = null;

  try {
    const base = BASE_DOMAIN;

    if (!host) {
      tenant = null;
    } else if (host === base || host === `www.${base}`) {
      tenant = null;
    } else if (host.endsWith(`.${base}`)) {
      const withoutBase = host.slice(0, -(`.${base}`).length);
      tenant = withoutBase.split('.')[0];
    }
  } catch (e) {
    console.error('[TENANT] Error detectando subdominio:', e);
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
//  RUTAS DE AUTH (REGISTRO / LOGIN / ME)
// ======================================================

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Nombre, email y contraseña son obligatorios' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
    }

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

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('[AUTH] Error en /register:', error);
    res.status(500).json({ error: 'Error interno en registro' });
  }
});

// LOGIN (handler reutilizable)
const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [
      user.id,
    ]);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = createToken(userResponse);

    res.json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('[AUTH] Error en login:', error.message);
    res.status(500).json({ error: 'Error de conexión con base de datos' });
  }
};

app.post('/api/auth/login', loginHandler);
app.post('/api/login', loginHandler);

// GET ME
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;

    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, public_subdomain, created_at, last_login_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('[AUTH] Error en /me:', error);
    res.status(500).json({ error: 'Error interno en /me' });
  }
});

// ======================================================
//  RUTA GEMINI AI
// ======================================================

app.post('/api/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error en /api/gemini:', error);
    res.status(500).json({
      error: 'Error procesando solicitud de IA',
      details: error.message,
    });
  }
});

// ======================================================
//  RUTA PÚBLICA PARA LANDING EN SUBDOMINIO
//  GET /api/public/pages/:slug
// ======================================================

app.get('/api/public/pages/:slug', async (req, res) => {
  const tenant = req.tenantSubdomain;
  const slug = req.params.slug;

  if (!tenant) {
    return res.status(400).json({ error: 'No se detectó subdominio' });
  }

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
      [tenant, slug]
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

    res.json(page);
  } catch (error) {
    console.error('[PUBLIC] Error cargando landing:', error);
    res.status(500).json({ error: 'Error interno cargando landing' });
  }
});

// ======================================================
//  RUTAS PRIVADAS (LANDINGS)
// ======================================================

// GET /api/pages (solo las del usuario)
app.get('/api/pages', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear landing
app.post('/api/pages', authMiddleware, async (req, res) => {
  const { name, niche, goal, subdomain, content } = req.body;
  const userId = req.user.id;

  try {
    const contentString = JSON.stringify(content);

    const [result] = await pool.query(
      'INSERT INTO landing_pages (user_id, name, niche, goal, subdomain, content, is_published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [userId, name, niche, goal, subdomain, contentString, false]
    );

    res.json({ id: result.insertId, message: 'Página creada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar landing
app.put('/api/pages/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content, isPublished, name, niche } = req.body;
  const userId = req.user.id;

  try {
    const [check] = await pool.query(
      'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (check.length === 0) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta página' });
    }

    const contentString = JSON.stringify(content);

    await pool.query(
      'UPDATE landing_pages SET content = ?, is_published = ?, name = COALESCE(?, name), niche = COALESCE(?, niche) WHERE id = ?',
      [contentString, isPublished, name, niche, id]
    );

    res.json({ message: 'Página actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar landing
app.delete('/api/pages/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [check] = await pool.query(
      'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (check.length === 0) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta página' });
    }

    await pool.query('DELETE FROM landing_pages WHERE id = ?', [id]);

    res.json({ message: 'Página eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  LEADS (PRIVADO + PÚBLICO PARA CAPTURAR)
// ======================================================

// Leads privados
app.get('/api/leads', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT l.*, p.name AS page_name
      FROM leads l
      JOIN landing_pages p ON l.page_id = p.id
      WHERE p.user_id = ?
      ORDER BY l.captured_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Captura pública de lead
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
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT * FROM articles WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', authMiddleware, async (req, res) => {
  const { title, description, content_html, keyword, seo_score } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO articles (user_id, title, description, content_html, keyword, seo_score, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, title, description, content_html, keyword, seo_score]
    );

    res.json({ id: result.insertId, message: 'Artículo guardado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  ENDPOINT DE TESTEO DE DB
// ======================================================
app.get('/api/test-db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ message: 'Conexión a DB operativa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
//  HEALTH CHECK PARA CLOUD RUN
// ======================================================
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// ======================================================
//  SERVIR FRONTEND COMPILADO (SPA React)
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  // Si es una ruta de API inexistente
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API Endpoint Not Found' });
  }

  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// ======================================================
//  INCIO DEL SERVIDOR
// ======================================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`🌍 Dominio base: ${BASE_DOMAIN}`);
});
