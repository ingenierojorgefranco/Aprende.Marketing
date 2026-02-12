
import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';

const router = express.Router();

// ======================================================
//  GESTIÓN DE CONTACTOS (CRUD)
// ======================================================

router.get('/crm/contacts', authMiddleware, async (req, res) => {
    try {
        const [contacts] = await pool.query(
            `SELECT c.*, lp.subdomain as page_slug
             FROM crm_contacts c
             LEFT JOIN landing_pages lp ON c.page_id = lp.id
             WHERE c.user_id = ? ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        res.json(contacts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/crm/contacts', authMiddleware, async (req, res) => {
    const { name, email, phone, address, country, status, interestLevel } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO crm_contacts (user_id, name, email, phone, address, country, source, status, interest_level, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'Manual', ?, ?, NOW(), NOW())`,
            [req.user.id, name, email, phone, address, country, status || 'new', interestLevel || 'cold']
        );
        res.json({ id: result.insertId, message: 'Contacto creado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/crm/contacts/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, country, status, interestLevel } = req.body;
    try {
        const [check] = await pool.query('SELECT id FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (check.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        await pool.query(
            `UPDATE crm_contacts SET name=?, email=?, phone=?, address=?, country=?, status=?, interest_level=?, updated_at=NOW() WHERE id=?`,
            [name, email, phone, address, country, status, interestLevel, id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/crm/contacts/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  HISTORIAL Y NOTAS
// ======================================================

router.get('/crm/contacts/:id/history', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [check] = await pool.query('SELECT id FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (check.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        const [activities] = await pool.query(
            `SELECT * FROM crm_activities WHERE contact_id = ? ORDER BY created_at DESC`,
            [id]
        );
        res.json(activities);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/crm/contacts/:id/notes', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const [check] = await pool.query('SELECT id FROM crm_contacts WHERE id = ? AND user_id = ?', [id, req.user.id]);
        if (check.length === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
        await pool.query(
            `INSERT INTO crm_activities (contact_id, type, content, created_at) VALUES (?, 'note', ?, NOW())`,
            [id, content]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  LEADS CAPTURADOS
// ======================================================

router.get('/leads', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
        `SELECT l.*, p.name as page_name 
         FROM leads l JOIN landing_pages p ON l.page_id = p.id 
         WHERE p.user_id = ? ORDER BY l.captured_at DESC`, 
        [req.user.id]
    );
    res.json(rows);
  } catch (e) { 
      res.status(500).json({ error: e.message }); 
  }
});

export default router;
