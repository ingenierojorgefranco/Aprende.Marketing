require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importar servicios
const pool = require('./db');
const { generateContent } = require('./geminiService');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// --- MIDDLEWARE DB ---
const requireDB = (req, res, next) => {
    if (!pool) return res.status(503).json({ error: 'Base de datos no disponible' });
    next();
};

// --- RUTAS API (DATA) ---

// 1. LANDING PAGES
app.get('/api/pages', requireDB, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM landing_pages ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
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

app.post('/api/leads', requireDB, async (req, res) => {
    const { pageId, name, email } = req.body;
    try {
        await pool.query(
            'INSERT INTO leads (page_id, name, email) VALUES (?, ?, ?)',
            [pageId, name, email]
        );
        await pool.query('UPDATE landing_pages SET conversions = conversions + 1 WHERE id = ?', [pageId]);
        res.json({ message: 'Lead capturado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. ARTÍCULOS
app.get('/api/articles', requireDB, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
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

// --- RUTA API (GEMINI PROXY) ---
app.post('/api/gemini/generate', async (req, res) => {
    const { model, contents, config } = req.body;
    try {
        const text = await generateContent(model, contents, config);
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error generating content" });
    }
});

app.get('/api/test-db', requireDB, async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ message: 'Conexión a DB operativa' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// --- SERVIR FRONTEND (PRODUCCIÓN) ---
// Sirve los archivos estáticos generados por 'npm run build' en el frontend
const frontendDistPath = path.resolve(__dirname, '../dist');
app.use(express.static(frontendDistPath));

// Fallback para React Router (SPA): Cualquier ruta que no sea API devuelve index.html
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});