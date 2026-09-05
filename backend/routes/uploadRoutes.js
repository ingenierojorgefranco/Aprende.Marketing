import express from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import { authMiddleware } from '../authMiddleware.js';

const router = express.Router();

// Initialize GCS client
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || 'am-multimedia-assets';

// Use memory storage for multer (support up to 50MB for PDFs/documents and images)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

/**
 * Helper para extraer bucketName y blobName desde URLs de GCS
 */
function extractGcsInfo(inputUrl, defaultBucket) {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const clean = inputUrl.trim();

  // Si es un path directo como "Proyect/..." o "images/..."
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    if (clean.startsWith('images/') || clean.startsWith('Proyect/')) {
      return { bucketName: defaultBucket, blobName: clean };
    }
    return { bucketName: defaultBucket, blobName: clean };
  }

  try {
    const parsed = new URL(clean);
    
    // storage.googleapis.com/<bucket>/<blob...> o storage.cloud.google.com/<bucket>/<blob...>
    if (parsed.hostname === 'storage.googleapis.com' || parsed.hostname === 'storage.cloud.google.com') {
      const parts = parsed.pathname.replace(/^\/+/, '').split('/');
      if (parts.length >= 2) {
        const bName = parts[0];
        const blobName = decodeURIComponent(parts.slice(1).join('/'));
        return { bucketName: bName, blobName };
      }
    }

    // <bucket>.storage.googleapis.com/<blob...>
    if (parsed.hostname.endsWith('.storage.googleapis.com')) {
      const bName = parsed.hostname.replace('.storage.googleapis.com', '');
      const blobName = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
      if (blobName) {
        return { bucketName: bName, blobName };
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname) || '';
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 60);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
    const cleanFileName = baseName ? `${uniqueSuffix}-${baseName}${ext}` : `${uniqueSuffix}${ext}`;

    // Estructura: Proyect/{projectId}/{folderType}/{fileName}
    const rawProjectId = req.body?.projectId || req.query?.projectId;
    const projectId = (rawProjectId && String(rawProjectId).trim() !== '' && String(rawProjectId).trim() !== 'undefined')
      ? String(rawProjectId).trim()
      : 'temp';

    const rawFolder = req.body?.folderType || req.query?.folderType || 'images';
    const folderType = String(rawFolder).toLowerCase().includes('leadmagnet') ? 'leadmagnets' : 'images';

    const destinationBlobName = `Proyect/${projectId}/${folderType}/${cleanFileName}`;

    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(destinationBlobName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading to GCS:', err);
      res.status(500).json({ error: 'Failed to upload to Google Cloud Storage' });
    });

    blobStream.on('finish', () => {
      // Return the public URL
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${destinationBlobName}`;
      res.status(200).json({ 
        url: publicUrl, 
        fileName: file.originalname,
        destinationBlobName,
        projectId,
        folderType
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Controlador para eliminar un archivo físicamente de Google Cloud Storage
 */
const handleDeleteGcsFile = async (req, res) => {
  try {
    const url = req.body?.url || req.query?.url;
    if (!url) {
      return res.status(400).json({ error: 'URL del archivo no proporcionada' });
    }

    const gcsInfo = extractGcsInfo(url, bucketName);
    if (!gcsInfo) {
      // Si la URL es externa (ej: jorgefran.co), no se puede borrar de GCS pero no es un error crítico
      return res.json({
        success: true,
        deleted: false,
        isExternal: true,
        message: 'La URL es externa y no reside en Google Cloud Storage'
      });
    }

    const targetBucket = storage.bucket(gcsInfo.bucketName || bucketName);
    const file = targetBucket.file(gcsInfo.blobName);

    const [exists] = await file.exists();
    if (exists) {
      await file.delete();
      console.log(`[GCS] Archivo eliminado físicamente del bucket: ${gcsInfo.blobName} (${gcsInfo.bucketName})`);
      return res.json({
        success: true,
        deleted: true,
        file: gcsInfo.blobName,
        bucket: gcsInfo.bucketName
      });
    } else {
      console.log(`[GCS] El archivo no existe en el bucket: ${gcsInfo.blobName}`);
      return res.json({
        success: true,
        deleted: false,
        message: 'El archivo ya no existía en el bucket'
      });
    }
  } catch (error) {
    console.error('[GCS] Error al eliminar archivo de Cloud Storage:', error);
    return res.status(500).json({
      error: 'Error al eliminar el archivo del bucket: ' + error.message
    });
  }
};

// Soporta tanto DELETE /api/upload como POST /api/upload/delete
router.delete('/', authMiddleware, handleDeleteGcsFile);
router.post('/delete', authMiddleware, handleDeleteGcsFile);

export default router;
