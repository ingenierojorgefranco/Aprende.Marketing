const pool = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';

const logSystemActivity = async (userId, userName, actionType, entityType, entityId, details) => {
    try {
        await pool.query(
            `INSERT INTO system_activity_logs (user_id, user_name, action_type, entity_type, entity_id, details) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId || null, 
                userName || 'Sistema', 
                actionType, 
                entityType || null, 
                entityId ? String(entityId) : null, 
                details ? JSON.stringify(details) : null
            ]
        );
    } catch (e) {
        console.error("[System Log Error] Could not save log:", e.message);
    }
};

const logCRMActivity = async (contactId, type, content) => {
    try {
        await pool.query(
            `INSERT INTO crm_activities (contact_id, type, content, created_at) VALUES (?, ?, ?, NOW())`,
            [contactId, type, content]
        );
    } catch (e) {
        console.error("[CRM Log Error]", e.message);
    }
};

const recordVisit = async (pageId) => {
    try {
        await pool.query('UPDATE landing_pages SET visits = visits + 1 WHERE id = ?', [pageId]);
        const today = new Date().toISOString().split('T')[0];
        await pool.query(
            `INSERT INTO daily_analytics (page_id, date, visits, conversions) 
             VALUES (?, ?, 1, 0) 
             ON DUPLICATE KEY UPDATE visits = visits + 1`,
            [pageId, today]
        );
    } catch (error) {
        console.error(`[Analytics] Error registrando visita para página ${pageId}:`, error.message);
    }
};

const isAdminRequest = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch (e) {
        return false;
    }
};

const checkMonthlyQuota = async (userId, resourceType, limit) => {
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (user[0] && user[0].role === 'admin') return true;

    const [rows] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM usage_logs 
        WHERE user_id = ? 
          AND resource_type = ? 
          AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
          AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `, [userId, resourceType]);

    const used = rows[0].count;
    if (limit > 9000) return true; 
    return used < limit;
};

const logUsage = async (userId, resourceType) => {
    try {
        await pool.query('INSERT INTO usage_logs (user_id, resource_type) VALUES (?, ?)', [userId, resourceType]);
    } catch (e) {
        console.error("Error logging usage:", e);
    }
};

module.exports = {
    logSystemActivity,
    logCRMActivity,
    recordVisit,
    isAdminRequest,
    checkMonthlyQuota,
    logUsage,
    JWT_SECRET
};