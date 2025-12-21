const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logCRMActivity } = require('../utils/helpers');

router.get('/contacts', authMiddleware, async (req, res) => {
    try {
        const [contacts] = await pool.query(
            `SELECT c.*, lp.subdomain as page_slug FROM crm_contacts c LEFT JOIN landing_pages lp ON c.page_id = lp.id WHERE c.user_id = ? ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        res.json(contacts);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/contacts', authMiddleware, async (req, res) => {
    const { name, email, phone, address, country, status, interestLevel } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO crm_contacts (user_id, name, email, phone, address, country, source, status, interest_level, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'Manual', ?, ?, NOW(), NOW())`,
            [req.user.id, name, email, phone, address, country, status || 'new', interestLevel || 'warm']
        );
        await logCRMActivity(result.insertId, 'system', `Creado manualmente por ${req.user.email}`);
        res.json({ id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/contacts/:id/history', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM crm_activities WHERE contact_id = ? ORDER BY created_at DESC', [req.params.id]);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/contacts/:id/notes', authMiddleware, async (req, res) => {
    const { content } = req.body;
    try {
        await logCRMActivity(req.params.id, 'note', content);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/contacts/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM crm_contacts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;