require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// --- LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.path}`);
  next();
});

// --- CONFIGURACIÓN DE BASE DE DATOS ---
const dbConfig = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'generator_landing_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Lógica de conexión para Google Cloud SQL vs Local
if (process.env.INSTANCE_CONNECTION_NAME) {
  // Conexión vía Socket (Producción en Cloud Run)
  dbConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
  // Conexión TCP (Localhost)
  dbConfig.host = process.env.DB_HOST || 'localhost';
  dbConfig.port = process.env.DB_PORT || 3306;
}

let pool;

async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log(
      `✅ Conexión DB Exitosa [${process.env.INSTANCE_CONNECTION_NAME ? 'Cloud SQL' : 'Local Host'}]`
    );
    connection.release();
  } catch (error) {
    console.error('❌ Error fatal conectando a la Base de Datos:', error.message);
    console.log('⚠️ El servidor iniciará, pero las peticiones fallarán hasta que se arregle la DB.');
  }
}

initDB();

// Middleware para asegurar que hay DB
const requireDB = (req, res, next) => {
  if (!pool) return res.status(503).json({ error: 'Base de datos no disponible' });
  next();
};

// --- RUTAS API ---

// 1. LANDING PAGES
app.get('/api/pages', requireDB, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM landing_pages ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pages', requireDB, async (req, res) => {
  const { name, niche, goal, subdomain, content, userId } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO landing_pages (user_id, name, niche, goal, subdomain, content, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId || 1, name, niche, goal, subdomain, JSON.stringify(content), false]
    );
    res.json({ id: result.insertId, message: 'Página creada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pages/:id', requireDB, async (req, res) => {
  const { id } = req.params;
  const { content, isPublished } = req.body;
  try {
    await pool.query(
      'UPDATE landing_pages SET content = ?, is_published = ? WHERE id = ?',
      [JSON.stringify(content), isPublished, id]
    );
    res.json({ message: 'Página actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LEADS
app.get('/api/leads', requireDB, async (req, res) => {
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

app.post('/api/leads', requireDB, async (req, res) => {
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

// 3. ARTÍCULOS (Content Generator Pro)
app.get('/api/articles', requireDB, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM articles ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/articles', requireDB, async (req, res) => {
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
app.get('/api/test-db', requireDB, async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ message: 'Conexión a DB operativa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check específico para Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// --- SERVIR FRONTEND COMPILADO (dist) ---
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
