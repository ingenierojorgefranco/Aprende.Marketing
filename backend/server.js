import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import initDb from './initDb.js';

// Import Modules
import { router as authRoutes } from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { studentRouter as courseStudentRouter } from './routes/courseRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import crmRoutes from './routes/crmRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'aprende.marketing';
const SERVER_VERSION = 'v29_clean_modular'; 

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
app.use('/api/whatsapp-launch', whatsappRoutes);

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
//  SERVER STARTUP
// ======================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor ${SERVER_VERSION} escuchando en puerto ${PORT}`);
    
    // Inicializamos la base de datos en segundo plano. 
    // Esto permite que el contenedor responda al "startup probe" de Cloud Run de inmediato,
    // evitando el error de timeout en el puerto 8080.
    initDb().then(() => {
        console.log('✅ Base de datos inicializada correctamente.');
    }).catch(err => {
        console.error("⚠️ Error inicializando base de datos:", err.message);
    });
});