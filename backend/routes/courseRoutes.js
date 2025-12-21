const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT id, title, slug FROM courses WHERE is_active = 1 ORDER BY order_index ASC');
        res.json(courses);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:slug', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT * FROM courses WHERE slug = ?', [req.params.slug]);
        if (courses.length === 0) return res.status(404).json({ error: 'No encontrado' });
        const course = courses[0];
        const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [course.id]);
        res.json({ ...course, modules: modules.map(m => ({ ...m, lessons: [] })) });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/modules/:moduleId/lessons', authMiddleware, async (req, res) => {
    try {
        const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [req.params.moduleId]);
        res.json(lessons.map(l => ({ ...l, learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : l.learning_points })));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/comments', authMiddleware, async (req, res) => {
    const { lessonId, content, parentId } = req.body;
    try {
        await pool.query('INSERT INTO lesson_comments (lesson_id, user_id, content, parent_id, created_at, is_approved) VALUES (?, ?, ?, ?, NOW(), 1)', [lessonId, req.user.id, content, parentId || null]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;