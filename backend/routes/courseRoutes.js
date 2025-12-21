const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');

// Lista de cursos (prefijo /api/courses)
router.get('/courses', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT id, title, slug FROM courses WHERE is_active = 1 ORDER BY order_index ASC');
        res.json(courses);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Detalle del curso por slug (prefijo /api/courses/:slug)
router.get('/courses/:slug', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT * FROM courses WHERE slug = ?', [req.params.slug]);
        if (courses.length === 0) return res.status(404).json({ error: 'No encontrado' });
        const course = courses[0];
        const [modules] = await pool.query('SELECT id, title, order_index FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [course.id]);
        res.json({ ...course, modules: modules.map(m => ({ ...m, lessons: [] })) });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Lecciones de un módulo (prefijo /api/modules/:moduleId/lessons)
router.get('/modules/:moduleId/lessons', authMiddleware, async (req, res) => {
    try {
        const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [req.params.moduleId]);
        res.json(lessons.map(l => ({ 
            ...l, 
            learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || []) 
        })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Comentarios de una lección (prefijo /api/lessons/:lessonId/comments)
router.get('/lessons/:lessonId/comments', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT lc.*, u.name as user, u.avatar_url as avatar
            FROM lesson_comments lc
            JOIN users u ON lc.user_id = u.id
            WHERE lc.lesson_id = ? AND lc.is_approved = 1
            ORDER BY lc.created_at DESC
        `, [req.params.lessonId]);

        const rootComments = rows.filter(c => !c.parent_id);
        const replies = rows.filter(c => c.parent_id);

        const result = rootComments.map(c => ({
            id: String(c.id),
            user: c.user,
            avatar: c.avatar,
            date: new Date(c.created_at).toLocaleDateString(),
            text: c.content,
            likes: c.likes || 0,
            replies: replies.filter(r => r.parent_id === c.id).map(r => ({
                id: String(r.id),
                user: r.user,
                avatar: r.avatar,
                date: new Date(r.created_at).toLocaleDateString(),
                text: r.content,
                likes: r.likes || 0
            }))
        }));
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Publicar comentario (prefijo /api/comments)
router.post('/comments', authMiddleware, async (req, res) => {
    const { lessonId, content, parentId } = req.body;
    try {
        await pool.query(
            'INSERT INTO lesson_comments (lesson_id, user_id, content, parent_id, created_at, is_approved) VALUES (?, ?, ?, ?, NOW(), 1)',
            [lessonId, req.user.id, content, parentId || null]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Dar like (prefijo /api/comments/:commentId/like)
router.post('/comments/:commentId/like', authMiddleware, async (req, res) => {
    try {
        await pool.query('UPDATE lesson_comments SET likes = likes + 1 WHERE id = ?', [req.params.commentId]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;