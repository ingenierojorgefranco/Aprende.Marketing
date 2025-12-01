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

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.path}`);
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
//  RUTAS DE AUTH (USUARIOS)
// ======================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(`[AUTH] Registro solicitado para: ${email}`);

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Nombre, email y contraseña son obligatorios' });
  }

  try {
    // ¿Ya existe usuario?
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [
      email,
    ]);
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

    console.log(`[AUTH] Usuario creado: ${email} (id=${result.insertId})`);

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error) {
    console.error('[AUTH] Error en /api/auth/register:', error);
    res.status(500).json({ error: 'Error interno en registro' });
  }
});

// handler reutilizable para login
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  console.log(`[AUTH] Intento de login para: ${email}`);

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
      console.log(`[AUTH] Usuario no encontrado: ${email}`);
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log(`[AUTH] Password incorrecto para: ${email}`);
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

    console.log(`[AUTH] Login exitoso para: ${email}`);

    res.json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('[AUTH] Error de base de datos en login:', error.message);
    res.status(500).json({ error: 'Error de conexión con base de datos' });
  }
};

// POST /api/auth/login (ruta nueva principal)
app.post('/api/auth/login', loginHandler);

// Mantener compatibilidad con tu ruta antigua /api/login
app.post('/api/login', loginHandler);

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { id } = req.user;

    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, created_at, last_login_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('[AUTH] Error en /api/auth/me:', error);
    res.status(500).json({ error: 'Error interno en /me' });
  }
});

// ======================================================
//  RUTA DE GEMINI AI (Proxy Route)
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
//  RUTAS API EXISTENTES
// ======================================================

// 2. LANDING PAGES
app.get('/api/pages', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pages', async (req, res) => {
  const { name, niche, goal, subdomain, content, userId } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO landing_pages (user_id, name, niche, goal, subdomain, content, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId || 1, name, niche, goal, subdomain, JSON.stringify(content), false]
    );
    res.json({ id: result.insertId, message: 'Página creada' });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pages/:id', async (req, res) => {
  const { id } = req.params;
  const { content, isPublished } = req.body;
  try {
    await pool.query(
      'UPDATE landing_pages SET content = ?, is_published = ? WHERE id = ?',
      [JSON.stringify(content), isPublished, id]
    );
    res.json({ message: 'Página actualizada' });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. LEADS
app.get('/api/leads', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT l.*, p.name as page_name 
      FROM leads l 
      LEFT JOIN landing_pages p ON l.page_id = p.id 
      ORDER BY l.captured_at DESC
    `
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
      'INSERT INTO leads (page_id, name, email) VALUES (?, ?, ?)',
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

// 4. ARTÍCULOS
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM articles ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', async (req, res) => {
  const { title, description, content_html, keyword, seo_score, user_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO articles (user_id, title, description, content_html, keyword, seo_score) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id || 1, title, description, content_html, keyword, seo_score]
    );
    res.json({ id: result.insertId, message: 'Artículo guardado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DB Test Endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ message: 'Conexión a DB operativa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// --- SERVIR FRONTEND COMPILADO (dist) ---
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API Endpoint Not Found' });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
