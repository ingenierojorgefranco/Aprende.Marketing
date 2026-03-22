
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'DEV_ONLY_CHANGE_THIS_IN_PROD';

// Default limits for new users
export const DEFAULT_LIMITS = {
    planName: 'starter',
    maxProjects: 1,
    maxLandings: 1,
    maxArticles: 1,
    maxDomains: 1,
    maxEmailSequences: 1,
    maxWhatsAppLaunches: 1,
    maxHooks: 10,
    features: {
        whatsappBot: false,
        blogGenerator: false,
        emailMarketing: false,
        removeBranding: false,
        emailStrategy: false,
        evergreenStrategy: false
    }
};

const createToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

const limitsCache = new Map();

export const clearLimitsCache = (userId) => {
    if (userId) limitsCache.delete(userId);
    else limitsCache.clear();
};

export const PLAN_ORDER = ['starter', 'plan-max-1', 'plan-max-2', 'plan-max-3', 'plan-max-4', 'plan-max-5', 'plan-max-6', 'plan-max-7', 'plan-max-8', 'plan-max-9', 'plan-max-10'];

export const getEffectiveLimits = async (userId) => {
    try {
        // Check cache first
        if (limitsCache.has(userId)) {
            const cached = limitsCache.get(userId);
            if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
                return { ...cached.data, fromCache: true };
            }
        }

        // --- Lógica de Expiración (Fair Play) ---
        // 1. Buscar suscripciones que están en 'pending_cancellation' o 'active' pero tienen fecha de expiración
        const [subsToCheck] = await pool.query(
            "SELECT id, plan_slug, status, expires_at FROM user_subscriptions WHERE user_id = ? AND status IN ('active', 'pending_cancellation')", 
            [userId]
        );

        const now = new Date();
        const activeSlugs = [];

        for (const sub of subsToCheck) {
            if (sub.expires_at && new Date(sub.expires_at) < now) {
                // Ha expirado realmente. Marcar como cancelado definitivamente.
                console.log(`[Limits] Suscripción ${sub.id} (${sub.plan_slug}) ha expirado. Marcando como canceled.`);
                await pool.query("UPDATE user_subscriptions SET status = 'canceled' WHERE id = ?", [sub.id]);
                // No la añadimos a activeSlugs
            } else {
                // Sigue activa o está pendiente de cancelar pero aún no vence
                activeSlugs.push(sub.plan_slug);
            }
        }

        const [projects] = await pool.query('SELECT id, plan_slug, created_at FROM projects WHERE user_id = ? AND is_master = 0 ORDER BY created_at ASC', [userId]);
        const [allPlans] = await pool.query('SELECT slug, limits_config FROM plans');
        
        const planDefinitions = {};
        allPlans.forEach(p => {
            planDefinitions[p.slug] = p.limits_config ? (typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config) : DEFAULT_LIMITS;
        });

        // Active slugs set for quick lookup
        const activeSlugsSet = new Set(activeSlugs);

        // Project specific limits and dynamic status
        const projectLimits = {};
        const projectStatus = {};

        projects.forEach((proj, index) => {
            const slotNumber = index + 1;
            const slotPlanSlug = `plan-max-${slotNumber}`;
            
            let effectivePlanSlug = 'starter';
            let isBlocked = false;

            if (slotNumber === 1) {
                // Slot 1 is always active. Use plan-max-1 if active, else starter.
                effectivePlanSlug = activeSlugsSet.has('plan-max-1') ? 'plan-max-1' : 'starter';
                isBlocked = false;
            } else {
                // Slots 2+ are tied to their plan-max-N
                if (activeSlugsSet.has(slotPlanSlug)) {
                    effectivePlanSlug = slotPlanSlug;
                    isBlocked = false;
                } else {
                    effectivePlanSlug = slotPlanSlug; // Keep the name but block it
                    isBlocked = true;
                }
            }

            const limits = planDefinitions[effectivePlanSlug] || DEFAULT_LIMITS;
            projectLimits[proj.id] = { ...limits, planName: effectivePlanSlug, isBlocked };
            projectStatus[proj.id] = { planName: effectivePlanSlug, isBlocked };
        });

        // Filter out 'starter' if there are other plans for global summary
        const hasPremiumPlans = activeSlugs.some(slug => slug !== 'starter');
        const relevantSlugs = hasPremiumPlans 
            ? activeSlugs.filter(slug => slug !== 'starter')
            : (activeSlugs.length > 0 ? activeSlugs : ['starter']);

        const summary = {
            maxProjects: 0,
            maxLandings: 0,
            maxArticles: 0,
            maxDomains: 0,
            maxEmailSequences: 0,
            maxEmailSequencesNurturing: 0,
            maxWhatsAppLaunches: 0,
            maxHooks: 0,
            features: { ...DEFAULT_LIMITS.features }
        };

        relevantSlugs.forEach(slug => {
            const limits = planDefinitions[slug] || DEFAULT_LIMITS;
            
            // Sum up global capacities (Inventory based)
            summary.maxProjects += (limits.maxProjects || 0);
            summary.maxLandings += (limits.maxLandings || 0);
            summary.maxArticles += (limits.maxArticles || 0);
            summary.maxDomains += (limits.maxDomains || 0);
            summary.maxEmailSequences += (limits.maxEmailSequences || 0);
            summary.maxEmailSequencesNurturing += (limits.maxEmailSequencesNurturing || 0);
            summary.maxWhatsAppLaunches += (limits.maxWhatsAppLaunches || 0);
            summary.maxHooks += (limits.maxHooks || 0);

            // Merge features
            if (limits.features) {
                Object.keys(limits.features).forEach(feat => {
                    if (limits.features[feat]) summary.features[feat] = true;
                });
            }
        });

        // Determine "Best Plan" for UI display name based on hierarchy
        let bestPlanSlug = 'starter';
        let maxIndex = -1;
        
        relevantSlugs.forEach(slug => {
            const normalizedSlug = String(slug || '').toLowerCase().trim();
            const index = PLAN_ORDER.indexOf(normalizedSlug);
            if (index > maxIndex) {
                maxIndex = index;
                bestPlanSlug = normalizedSlug;
            }
        });

        const result = {
            ...summary,
            planName: bestPlanSlug,
            projectLimits,
            projectStatus,
            allActivePlans: activeSlugs,
            inventoryCount: activeSlugs.length
        };

        limitsCache.set(userId, { data: result, timestamp: Date.now() });
        return { ...result, fromCache: false };
    } catch (error) {
        console.error("Error fetching effective limits:", error);
        return DEFAULT_LIMITS;
    }
};

export const logSystemActivity = async (userId, userName, actionType, entityType, entityId, details) => {
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

// Register Route
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
    console.error('[AUTH] Error register:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url, max_hooks FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = rows[0];
    if (!user.is_active) return res.status(403).json({ error: 'Usuario inactivo' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    await logSystemActivity(user.id, user.name, 'LOGIN', 'user', user.id, { ip: req.ip });

    const planLimits = await getEffectiveLimits(user.id);

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
      customRedirectUrl: user.custom_redirect_url,
      maxHooks: user.max_hooks
    };
    const token = createToken(userResponse);
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('[AUTH] Error login:', error);
    res.status(500).json({ error: 'Error de base de datos' });
  }
});

// Logout Route
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
        const name = rows[0]?.name || 'Usuario';
        await logSystemActivity(req.user.id, name, 'LOGOUT', 'user', req.user.id, { ip: req.ip });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: true });
    }
});

// Get Me Route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url, max_hooks FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    const user = rows[0];
    const planLimits = await getEffectiveLimits(user.id);

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        public_subdomain: user.public_subdomain,
        planLimits: planLimits,
        avatarUrl: user.avatar_url,
        birthDate: user.birth_date,
        createdAt: user.created_at,
        customRedirectUrl: user.custom_redirect_url,
        maxHooks: user.max_hooks
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// Get user resources for profile accordion
router.get('/me/resources', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { type } = req.query;
    try {
        let rows = [];
        if (type === 'projects') {
            [rows] = await pool.query('SELECT id, name, created_at FROM projects WHERE user_id = ? AND is_master = 0 ORDER BY created_at DESC', [userId]);
        } else if (type === 'pages') {
            [rows] = await pool.query('SELECT id, name, subdomain, created_at FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'articles') {
            const { projectId, page, limit = 5 } = req.query;
            const pNum = parseInt(page);
            const lNum = parseInt(limit);
            const offset = (pNum - 1) * lNum;

            let whereClause = "WHERE a.user_id = ? AND a.is_generated = 1";
            const params = [userId];

            if (projectId && projectId !== 'all' && projectId !== 'null' && projectId !== 'undefined') {
                whereClause += " AND a.project_id = ?";
                params.push(projectId);
            }

            if (page) {
                const [countRows] = await pool.query(`
                    SELECT COUNT(*) as total 
                    FROM articles a
                    ${whereClause}
                `, params);
                const total = countRows[0].total;

                const [articleRows] = await pool.query(`
                    SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name, p.name as project_name
                    FROM articles a
                    LEFT JOIN landing_pages lp ON a.page_id = lp.id
                    LEFT JOIN projects p ON a.project_id = p.id
                    ${whereClause}
                    ORDER BY a.created_at DESC
                    LIMIT ? OFFSET ?
                `, [...params, lNum, offset]);

                return res.json({
                    data: articleRows,
                    pagination: {
                        total,
                        page: pNum,
                        limit: lNum,
                        totalPages: Math.ceil(total / lNum)
                    }
                });
            } else {
                [rows] = await pool.query(`
                    SELECT a.*, lp.subdomain as page_subdomain, lp.name as page_name, p.name as project_name
                    FROM articles a
                    LEFT JOIN landing_pages lp ON a.page_id = lp.id
                    LEFT JOIN projects p ON a.project_id = p.id
                    ${whereClause}
                    ORDER BY a.created_at DESC
                `, params);
            }
        } else if (type === 'emails') {
            [rows] = await pool.query('SELECT id, name, created_at FROM email_sequences WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'whatsapp') {
            [rows] = await pool.query('SELECT id, name, created_at FROM whatsapp_lanzamientos WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        } else if (type === 'hooks') {
            const { projectId, page, limit = 12 } = req.query;
            const pNum = parseInt(page);
            const lNum = parseInt(limit);
            const offset = (pNum - 1) * lNum;

            let whereClause = "WHERE p.user_id = ?";
            const params = [userId];

            if (projectId && projectId !== 'all' && projectId !== 'null' && projectId !== 'undefined') {
                whereClause += " AND ph.project_id = ?";
                params.push(projectId);
            }

            if (page) {
                // Return paginated response
                const [countRows] = await pool.query(`
                    SELECT COUNT(*) as total 
                    FROM project_hooks ph 
                    JOIN projects p ON ph.project_id = p.id 
                    ${whereClause}
                `, params);
                const total = countRows[0].total;

                const [hookRows] = await pool.query(`
                    SELECT ph.id, ph.title, ph.psychological_strategy, ph.created_at, p.name as project_name, ph.project_id, ph.is_generated
                    FROM project_hooks ph 
                    JOIN projects p ON ph.project_id = p.id 
                    ${whereClause}
                    ORDER BY ph.created_at DESC
                    LIMIT ? OFFSET ?
                `, [...params, lNum, offset]);

                return res.json({
                    data: hookRows,
                    pagination: {
                        total,
                        page: pNum,
                        limit: lNum,
                        totalPages: Math.ceil(total / lNum)
                    }
                });
            } else {
                // Backward compatibility: return full array
                [rows] = await pool.query(`
                    SELECT ph.id, ph.title, ph.psychological_strategy, ph.created_at, p.name as project_name, ph.project_id, ph.is_generated
                    FROM project_hooks ph 
                    JOIN projects p ON ph.project_id = p.id 
                    ${whereClause}
                    ORDER BY ph.created_at DESC
                `, params);
            }
        } else {
            return res.status(400).json({ error: 'Tipo de recurso no válido' });
        }
        res.json(rows);
    } catch (e) {
        console.error("[Resources Error]", e.message);
        res.status(500).json({ error: e.message });
    }
});

// Profile Update Route
router.put('/profile', authMiddleware, async (req, res) => {
    const { name, email, avatarUrl, birthDate } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Nombre y Email son obligatorios" });
    }

    try {
        await pool.query(
            'UPDATE users SET name = ?, email = ?, avatar_url = ?, birth_date = ? WHERE id = ?',
            [name, email, avatarUrl, birthDate, req.user.id]
        );
        
        const [rows] = await pool.query(
            'SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url, max_hooks FROM users WHERE id = ?',
            [req.user.id]
        );
        
        const user = rows[0];
        const planLimits = await getEffectiveLimits(user.id);

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            planLimits: planLimits,
            avatarUrl: user.avatar_url,
            birthDate: user.birth_date,
            createdAt: user.created_at,
            customRedirectUrl: user.custom_redirect_url,
            maxHooks: user.max_hooks
        });

    } catch (e) {
        console.error("Error updating profile:", e);
        res.status(500).json({ error: "Error al actualizar perfil" });
    }
});

export { router };
