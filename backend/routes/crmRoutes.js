import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';

const router = express.Router();

// ======================================================
//  GESTIÓN DE CONTACTOS (CRUD)
// ======================================================

router.get('/contacts', authMiddleware, async (req, res) => {
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

router.post('/contacts', authMiddleware, async (req, res) => {
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

router.put('/contacts/:id', authMiddleware, async (req, res) => {
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
