const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { authMiddleware } = require('../authMiddleware');
const { logSystemActivity, JWT_SECRET } = require('../utils/helpers');

const DEFAULT_LIMITS = {
    planName: 'starter',
    maxProjects: 1,
    maxLandings: 2,
    maxArticles: 2,
    features: {
        whatsappBot: false,
        blogGenerator: false,
        emailMarketing: false,
        removeBranding: false
    }
};

const createToken = (user) => {
    const payload = { id: user.id, email: user.email, role: user.role || 'user' };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(409).json({ error: 'Email ya registrado' });

        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role, is_active, plan_limits) VALUES (?, ?, ?, ?, 1, ?)',
            [name, email, passwordHash, role || 'user', JSON.stringify(DEFAULT_LIMITS)]
        );
        const newUser = { id: result.insertId, name, email, role: role || 'user', planLimits: DEFAULT_LIMITS };
        const token = createToken(newUser);
        await logSystemActivity(newUser.id, newUser.name, 'REGISTER', 'user', newUser.id, { email });
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, password_hash, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
        const user = rows[0];
        if (!user.is_active) return res.status(403).json({ error: 'Usuario inactivo' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

        await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
        await logSystemActivity(user.id, user.name, 'LOGIN', 'user', user.id, { ip: req.ip });

        let planLimits = DEFAULT_LIMITS;
        if (user.plan_limits) {
            planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
        }

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            public_subdomain: user.public_subdomain,
            planLimits: planLimits,
            avatarUrl: user.avatar_url,
            birthDate: user.birth_date,
            createdAt: user.created_at,
            customRedirectUrl: user.custom_redirect_url
        };
        const token = createToken(userResponse);
        res.json({ user: userResponse, token });
    } catch (error) {
        res.status(500).json({ error: 'Error de base de datos' });
    }
});

router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        await logSystemActivity(req.user.id, rows[0]?.name, 'LOGOUT', 'user', req.user.id, { ip: req.ip });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: true });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url FROM users WHERE id = ?',
            [req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        const user = rows[0];
        let planLimits = DEFAULT_LIMITS;
        if (user.plan_limits) {
            planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
        }
        res.json({ ...user, planLimits, id: user.id });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    const { name, email, avatarUrl, birthDate } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Nombre y Email son obligatorios" });
    try {
        await pool.query(
            'UPDATE users SET name = ?, email = ?, avatar_url = ?, birth_date = ? WHERE id = ?',
            [name, email, avatarUrl, birthDate, req.user.id]
        );
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const user = rows[0];
        let planLimits = typeof user.plan_limits === 'string' ? JSON.parse(user.plan_limits) : user.plan_limits;
        res.json({ ...user, planLimits, id: user.id });
    } catch (e) {
        res.status(500).json({ error: "Error al actualizar perfil" });
    }
});

module.exports = router;