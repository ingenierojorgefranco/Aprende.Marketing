require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');
const { generateContent } = require('./geminiService');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.path}`);
  next();
});

// --- RUTAS API ---

// 1. GEMINI AI (Proxy Route)
app.post('/api/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    // Llamamos al servicio de backend que sí tiene acceso a la API Key segura
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error en /api/gemini:', error);
    res.status(500).json({ 
        error: 'Error procesando solicitud de IA', 
        details: error.message 
    });
  }
});

// 2. LANDING PAGES
app.get('/api/pages', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM landing_pages ORDER BY created_at DESC');
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
    const [rows] = await pool.query(`
      SELECT l.*, p.name as page_name 
      FROM leads l 
      LEFT JOIN landing_pages p ON l.page_id = p.id 
      ORDER BY l.captured_at DESC
    `);
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
    const [rows] = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
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
// Ajustar ruta: backend/server.js -> ../dist
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  // Si es una ruta de API que no existe, devolver 404 json
  if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API Endpoint Not Found' });
  }
  // Para todo lo demás, devolver index.html (SPA)
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});