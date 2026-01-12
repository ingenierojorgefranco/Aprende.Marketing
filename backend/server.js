require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
/* */ /* Actualización: Inclusión de fs para gestión de directorios de subida - 28/05/2025 11:30 */
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
const SERVER_VERSION = 'v29_hotfix_cloudrun'; 

app.enable('trust proxy');
app.use(cors());

// ======================================================
//  WEBHOOKS (MUST BE BEFORE GLOBAL BODY PARSERS)
// ======================================================
////////// Actualización: Asegurando la carga de webhooks antes de los parsers globales para soporte de HMAC SHA256 - 27/06/2025 11:45 //////////
app.use('/api', webhookRoutes);
////////// Fin de actualización - 27/06/2025 11:45 //////////

// ======================================================
//  GLOBAL MIDDLEWARE (Body Parsers)
// ======================================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/* */ /* Actualización: Creación y configuración del directorio de subidas (uploads) para almacenamiento persistente de imágenes - 28/05/2025 11:30 */
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));
/* Fin de actualización - 28/05/2025 11:30 */

// ======================================================
//  REDIRECCIÓN WWW → DOMINIO RAÍZ (GENÉRICO)
// ======================================================
app.use((req, res, next) => {
  const host = req.hostname || req.headers.host || '';
  if (host.startsWith('www.')) {
    const newHost = host.slice(4); // Removemos 'www.'
    const targetUrl = `https://${newHost}${req.originalUrl || ''}`;
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
//  ROUTES MOUNTING (MODULAR INFRASTRUCTURE)
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
//  STATIC FILES & SPA FALLBACK
// ======================================================
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  // If it's an API request that wasn't caught, return 404
  if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API Endpoint Not Found', version: SERVER_VERSION });
  }
  // Otherwise serve index.html for React Router
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// ======================================================
//  SERVER STARTUP (OPTIMIZED FOR CLOUD RUN)
// ======================================================
/**
 * Priorizamos app.listen() para que Cloud Run detecte el puerto abierto de inmediato.
 * La base de datos se inicializa de forma asíncrona en segundo plano.
 */
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    
    // Inicialización asíncrona de la DB
    initDb().then(() => {
        console.log('✅ Base de datos inicializada correctamente.');
    }).catch(err => {
        console.error("⚠️ Error inicializando base de datos:", err.message);
    });
});

/**
 * Ajustes de Timeout para Google Cloud Load Balancer.
 * Ayuda a prevenir errores 502/504 en conexiones de larga duración.
 */
server.keepAliveTimeout = 65000; // Un poco más que el timeout del LB (60s)
server.headersTimeout = 66000;
