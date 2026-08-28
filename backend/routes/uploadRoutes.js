import express from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import path from 'path';

const router = express.Router();

// Initialize GCS client
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || 'am-multimedia-assets';

// Use memory storage for multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const destinationBlobName = `images/${uniqueSuffix}${ext}`;

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
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
