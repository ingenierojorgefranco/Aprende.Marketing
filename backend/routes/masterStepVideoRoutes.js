import express from 'express';
import pool from '../db.js';

const router = express.Router();

/**
 * Obtener todos los videos maestros de lecciones por paso o de un paso específico
 */
router.get('/', async (req, res) => {
    try {
        const { stepNumber } = req.query;
        let query = 'SELECT * FROM master_step_videos';
        let params = [];

        if (stepNumber) {
            query += ' WHERE step_number = ?';
            params.push(stepNumber);
        }

        query += ' ORDER BY step_number ASC, position_order ASC, created_at ASC';

        const [rows] = await pool.query(query, params);

        const videos = rows.map(v => ({
            id: String(v.id),
            stepNumber: Number(v.step_number),
            type: v.type,
            title: v.title,
            subtitle: v.subtitle || '',
            duration: v.duration || '3:00',
            videoUrl: v.video_url,
            posterImage: v.poster_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=675',
            positionOrder: v.position_order || 0
        }));

        res.json(videos);
    } catch (error) {
        console.error('Error al obtener master_step_videos:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Obtener videos para un número de paso específico
 */
router.get('/step/:stepNumber', async (req, res) => {
    try {
        const { stepNumber } = req.params;
        const [rows] = await pool.query(
            'SELECT * FROM master_step_videos WHERE step_number = ? ORDER BY position_order ASC, created_at ASC',
            [stepNumber]
        );

        const videos = rows.map(v => ({
            id: String(v.id),
            stepNumber: Number(v.step_number),
            type: v.type,
            title: v.title,
            subtitle: v.subtitle || '',
            duration: v.duration || '3:00',
            videoUrl: v.video_url,
            posterImage: v.poster_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=675',
            positionOrder: v.position_order || 0
        }));

        res.json(videos);
    } catch (error) {
        console.error(`Error al obtener videos del paso ${req.params.stepNumber}:`, error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Crear un nuevo video en master_step_videos
 */
router.post('/', async (req, res) => {
    try {
        const {
            id,
            stepNumber = 1,
            type = 'Complementario',
            title,
            subtitle = '',
            duration = '3:00',
            videoUrl,
            posterImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200&h=675',
            positionOrder = 0
        } = req.body;

        if (!title || !videoUrl) {
            return res.status(400).json({ error: 'Título y URL del video son requeridos' });
        }

        const videoId = id || `v_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

        await pool.query(
            `INSERT INTO master_step_videos 
            (id, step_number, type, title, subtitle, duration, video_url, poster_image, position_order) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [videoId, stepNumber, type, title, subtitle, duration, videoUrl, posterImage, positionOrder]
        );

        res.status(201).json({
            id: videoId,
            stepNumber: Number(stepNumber),
            type,
            title,
            subtitle,
            duration,
            videoUrl,
            posterImage,
            positionOrder
        });
    } catch (error) {
        console.error('Error al crear video en master_step_videos:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Actualizar un video existente en master_step_videos
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            type,
            title,
            subtitle,
            duration,
            videoUrl,
            posterImage,
            positionOrder,
            stepNumber
        } = req.body;

        const [existing] = await pool.query('SELECT * FROM master_step_videos WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        const current = existing[0];
        const updatedType = type !== undefined ? type : current.type;
        const updatedTitle = title !== undefined ? title : current.title;
        const updatedSubtitle = subtitle !== undefined ? subtitle : current.subtitle;
        const updatedDuration = duration !== undefined ? duration : current.duration;
        const updatedVideoUrl = videoUrl !== undefined ? videoUrl : current.video_url;
        const updatedPosterImage = posterImage !== undefined ? posterImage : current.poster_image;
        const updatedPositionOrder = positionOrder !== undefined ? positionOrder : current.position_order;
        const updatedStepNumber = stepNumber !== undefined ? stepNumber : current.step_number;

        await pool.query(
            `UPDATE master_step_videos SET 
                type = ?,
                title = ?,
                subtitle = ?,
                duration = ?,
                video_url = ?,
                poster_image = ?,
                position_order = ?,
                step_number = ?
            WHERE id = ?`,
            [updatedType, updatedTitle, updatedSubtitle, updatedDuration, updatedVideoUrl, updatedPosterImage, updatedPositionOrder, updatedStepNumber, id]
        );

        res.json({
            id,
            stepNumber: Number(updatedStepNumber),
            type: updatedType,
            title: updatedTitle,
            subtitle: updatedSubtitle,
            duration: updatedDuration,
            videoUrl: updatedVideoUrl,
            posterImage: updatedPosterImage,
            positionOrder: updatedPositionOrder
        });
    } catch (error) {
        console.error(`Error al actualizar video ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Eliminar un video de master_step_videos
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM master_step_videos WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.json({ success: true, id });
    } catch (error) {
        console.error(`Error al eliminar video ${req.params.id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
