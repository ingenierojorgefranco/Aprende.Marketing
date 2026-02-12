
import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { logSystemActivity } from './authRoutes.js';

export const studentRouter = express.Router();
export const adminRouter = express.Router();

// ======================================================
//  STUDENT ROUTES (Rutas para Alumnos)
// ======================================================

studentRouter.get('/courses', authMiddleware, async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT id, title, slug FROM courses WHERE is_active = 1 ORDER BY order_index ASC, created_at DESC');
        res.json(courses);
    } catch (e) {
        console.error("[Courses] Error fetching list:", e);
        res.status(500).json({ error: e.message });
    }
});

studentRouter.get('/courses/:slug', authMiddleware, async (req, res) => {
    const { slug } = req.params;
    try {
        const [courses] = await pool.query('SELECT * FROM courses WHERE slug = ?', [slug]);
        if (courses.length === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        
        const course = courses[0];
        if (!course.is_active && req.user.role !== 'admin') {
             return res.status(403).json({ error: 'Este curso no está disponible actualmente.' });
        }

        const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [course.id]);
        const modulesSimple = modules.map(mod => ({
            ...mod,
            id: mod.id.toString(),
            lessons: [] 
        }));

        res.json({
            id: course.id.toString(),
            title: course.title,
            subtitle: course.subtitle,
            badge_text: course.badge_text,
            description: course.description,
            learningPoints: [],
            modules: modulesSimple
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

studentRouter.get('/modules/:moduleId/lessons', authMiddleware, async (req, res) => {
    const { moduleId } = req.params;
    try {
        const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [moduleId]);
        const lessonsParsed = lessons.map(l => ({
            ...l,
            id: l.id.toString(),
            learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || [])
        }));
        res.json(lessonsParsed);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

studentRouter.get('/lessons/:lessonId/comments', authMiddleware, async (req, res) => {
    const { lessonId } = req.params;
    try {
        const [comments] = await pool.query(`
            SELECT c.*, u.name as user_name 
            FROM lesson_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.lesson_id = ? AND c.is_approved = 1
            ORDER BY c.created_at DESC
        `, [lessonId]);

        const formatted = comments.map(c => ({
            id: c.id.toString(),
            user: c.user_name,
            avatar: null,
            date: new Date(c.created_at).toLocaleString(),
            text: c.content,
            likes: c.likes,
            parentId: c.parent_id ? c.parent_id.toString() : null
        }));

        const rootComments = formatted.filter(c => !c.parentId);
        const replies = formatted.filter(c => c.parentId);
        const nested = rootComments.map(root => ({
            ...root,
            replies: replies.filter(r => r.parentId === root.id)
        }));

        res.json(nested);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

studentRouter.post('/comments', authMiddleware, async (req, res) => {
    const { lessonId, content, parentId } = req.body;
    if (!lessonId || !content) return res.status(400).json({ error: "Datos incompletos" });

    try {
        await pool.query(
            'INSERT INTO lesson_comments (lesson_id, user_id, content, parent_id, created_at, is_approved) VALUES (?, ?, ?, ?, NOW(), 1)',
            [lessonId, req.user.id, content, parentId || null]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

studentRouter.post('/comments/:id/like', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE lesson_comments SET likes = likes + 1 WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  ADMIN ROUTES (Rutas para Gestión)
// ======================================================

adminRouter.get('/courses', async (req, res) => {
    try {
        const [courses] = await pool.query('SELECT * FROM courses ORDER BY order_index ASC, created_at DESC');
        const coursesWithDetails = await Promise.all(courses.map(async (c) => {
            const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [c.id]);
            const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
                const [lessons] = await pool.query('SELECT * FROM course_lessons WHERE module_id = ? ORDER BY order_index ASC', [mod.id]);
                const lessonsParsed = lessons.map(l => ({
                    ...l,
                    learning_points: typeof l.learning_points === 'string' ? JSON.parse(l.learning_points) : (l.learning_points || [])
                }));
                return { ...mod, lessons: lessonsParsed };
            }));
            return {
                ...c,
                is_active: !!c.is_active,
                modules: modulesWithLessons
            };
        }));
        res.json(coursesWithDetails);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.put('/courses/reorder', async (req, res) => {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'Formato inválido' });
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        for (let i = 0; i < orderedIds.length; i++) {
            await connection.query('UPDATE courses SET order_index = ? WHERE id = ?', [i, orderedIds[i]]);
        }
        await connection.commit();
        connection.release();
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.post('/courses', async (req, res) => {
    const { title, subtitle, description, slug, thumbnail, modules, badge_text, is_active } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [courseRes] = await connection.query(
            'INSERT INTO courses (title, subtitle, description, slug, thumbnail, badge_text, is_active, created_at, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 999)',
            [title, subtitle, description, slug, thumbnail, badge_text || 'Certificado', is_active]
        );
        const courseId = courseRes.insertId;
        if (modules && modules.length > 0) {
            for (const mod of modules) {
                const [modRes] = await connection.query(
                    'INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)',
                    [courseId, mod.title, mod.order_index]
                );
                const moduleId = modRes.insertId;
                if (mod.lessons && mod.lessons.length > 0) {
                    for (const lesson of mod.lessons) {
                        await connection.query(
                            'INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [moduleId, lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index]
                        );
                    }
                }
            }
        }
        await connection.commit();
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'CREATE_COURSE', 'course', courseId, { title });
        res.json({ success: true, id: courseId });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

adminRouter.put('/courses/:id', async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, slug, thumbnail, modules, badge_text, is_active } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query(
            'UPDATE courses SET title=?, subtitle=?, description=?, slug=?, thumbnail=?, badge_text=?, is_active=? WHERE id=?',
            [title, subtitle, description, slug, thumbnail, badge_text, is_active, id]
        );
        const validModuleIds = [];
        if (modules && modules.length > 0) {
            for (const mod of modules) {
                let moduleId = mod.id;
                if (typeof moduleId === 'string' && moduleId.startsWith('new-')) {
                    const [modRes] = await connection.query(
                        'INSERT INTO course_modules (course_id, title, order_index) VALUES (?, ?, ?)',
                        [id, mod.title, mod.order_index]
                    );
                    moduleId = modRes.insertId;
                } else {
                    await connection.query(
                        'UPDATE course_modules SET title=?, order_index=? WHERE id=?',
                        [mod.title, mod.order_index, moduleId]
                    );
                }
                validModuleIds.push(moduleId);
                const validLessonIds = [];
                if (mod.lessons && mod.lessons.length > 0) {
                    for (const lesson of mod.lessons) {
                        let lessonId = lesson.id;
                        if (typeof lessonId === 'string' && lessonId.startsWith('new-')) {
                            const [lessRes] = await connection.query(
                                'INSERT INTO course_lessons (module_id, title, duration, video_url, description, learning_points, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                [moduleId, lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index]
                            );
                            lessonId = lessRes.insertId;
                        } else {
                            await connection.query(
                                'UPDATE course_lessons SET title=?, duration=?, video_url=?, description=?, learning_points=?, order_index=?, module_id=? WHERE id=?',
                                [lesson.title, lesson.duration, lesson.video_url, lesson.description, JSON.stringify(lesson.learning_points || []), lesson.order_index, moduleId, lessonId]
                            );
                        }
                        validLessonIds.push(lessonId);
                    }
                }
                if (validLessonIds.length > 0) {
                    await connection.query(`DELETE FROM course_lessons WHERE module_id = ? AND id NOT IN (${validLessonIds.join(',')})`, [moduleId]);
                } else {
                    await connection.query('DELETE FROM course_lessons WHERE module_id = ?', [moduleId]);
                }
            }
        }
        if (validModuleIds.length > 0) {
            await connection.query(`DELETE FROM course_modules WHERE course_id = ? AND id NOT IN (${validModuleIds.join(',')})`, [id]);
        } else {
            await connection.query('DELETE FROM course_modules WHERE course_id = ?', [id]);
        }
        await connection.commit();
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'UPDATE_COURSE', 'course', id, { title });
        res.json({ success: true });
    } catch (e) {
        await connection.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        connection.release();
    }
});

adminRouter.delete('/courses/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        const [admin] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, admin[0]?.name, 'DELETE_COURSE', 'course', req.params.id, null);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.get('/comments', async (req, res) => {
    try {
        const [comments] = await pool.query(`
            SELECT 
                c.id, c.content as text, c.created_at as date, c.likes, c.is_approved as isApproved,
                c.parent_id as parentId,
                u.name as user, u.id as userId,
                l.title as lessonTitle, l.id as lessonId,
                co.title as courseTitle, co.slug as courseSlug
            FROM lesson_comments c
            JOIN users u ON c.user_id = u.id
            JOIN course_lessons l ON c.lesson_id = l.id
            JOIN course_modules m ON l.module_id = m.id
            JOIN courses co ON m.course_id = co.id
            ORDER BY c.created_at DESC
        `);
        const formatted = comments.map(c => ({
            ...c,
            id: c.id.toString(),
            isApproved: !!c.isApproved,
            parentId: c.parentId ? c.parentId.toString() : null
        }));
        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

adminRouter.post('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; 
    try {
        if (action === 'delete') {
            await pool.query('DELETE FROM lesson_comments WHERE id = ?', [id]);
        } 
        else if (action === 'toggle_publish') {
            const [rows] = await pool.query('SELECT is_approved FROM lesson_comments WHERE id = ?', [id]);
            if (rows.length > 0) {
                const currentStatus = rows[0].is_approved;
                const newStatus = !currentStatus;
                await pool.query('UPDATE lesson_comments SET is_approved = ? WHERE id = ?', [newStatus, id]);
                if (!newStatus) {
                    await pool.query('UPDATE lesson_comments SET is_approved = 0 WHERE parent_id = ?', [id]);
                }
            }
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
