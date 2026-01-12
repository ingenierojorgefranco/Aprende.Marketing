require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const initDb = require('./initDb');

// Import Modules
const { router: authRoutes } = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { studentRouter: courseStudentRouter } = require('./routes/courseRoutes');
const projectRoutes = require('./routes/projectRoutes');
const pageRoutes = require('./routes/pageRoutes');
const articleRoutes = require('./routes/articleRoutes');
const crmRoutes = require('./routes/crmRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();
const PORT = process.env.PORT || 8080;
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v30_cloudrun_writable_fix'; 

// ======================================================
//  HEALTH CHECK (PARA GOOGLE CLOUD LOAD BALANCER)
// ======================================================
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', version: SERVER_VERSION });
});

app.enable('trust proxy');
app.use(cors());

// ======================================================
//  WEBHOOKS (MUST BE BEFORE GLOBAL BODY PARSERS)
// ======================================================
app.use('/api', webhookRoutes);

// ======================================================
//  GLOBAL MIDDLEWARE
// ======================================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ======================================================
//  CONFIGURACIÓN DE SUBIDAS (UPLOADS) EN /tmp
//  IMPORTANTE: Cloud Run solo permite escritura en /tmp
// ======================================================
const uploadDir = '/tmp/uploads'; 
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`✅ Directorio de subidas creado en: ${uploadDir}`);
    }
} catch (err) {
    console.error(`⚠️ Error crítico creando directorio en /tmp: ${err.message}`);
}
app.use('/uploads', express.static(uploadDir));

// ======================================================
//  MULTI-TENANT & REDIRECCIONES
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  if (host.startsWith('www.')) {
    const newHost = host.slice(4);
    return res.redirect(301, `https://${newHost}${req.originalUrl || ''}`);
  }
  next();
});

app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  let tenant = null;
  if (host !== BASE_DOMAIN && host !== `www.${BASE_DOMAIN}` && host.endsWith(`.${BASE_DOMAIN}`)) {
      const sub = host.replace(`.${BASE_DOMAIN}`, '');
      tenant = sub.split('.')[0];
  }
  req.tenantSubdomain = tenant;
  next();
});

// ======================================================
//  ROUTES
// ======================================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', courseStudentRouter);
app.use('/api/projects', projectRoutes);
app.use('/api', pageRoutes);
app.use('/api', articleRoutes);
app.use('/api', crmRoutes);
app.use('/api', systemRoutes);

// ======================================================
//  STATIC FILES (FRONTEND)
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API Endpoint Not Found' });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// ======================================================
//  SERVER STARTUP
// ======================================================
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    
    // Inicialización asíncrona de la DB para no bloquear el puerto
    initDb().then(() => {
        console.log('✅ Base de datos lista.');
    }).catch(err => {
        console.error("⚠️ Error DB:", err.message);
    });
});

// Optimizaciones de conexión para Cloud Run
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
