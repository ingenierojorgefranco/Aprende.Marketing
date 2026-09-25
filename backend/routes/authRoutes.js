
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
    if (userId !== undefined && userId !== null) {
        limitsCache.delete(String(userId));
        limitsCache.delete(Number(userId));
        limitsCache.delete(userId);
    } else {
        limitsCache.clear();
    }
};

export const PLAN_ORDER = ['starter', 'free', 'pro', 'max', 'plan-max-1', 'plan-max-2', 'plan-max-3', 'plan-max-4', 'plan-max-5', 'plan-max-6', 'plan-max-7', 'plan-max-8', 'plan-max-9', 'plan-max-10'];

const normalizePlanSlug = (slug) => {
    if (!slug) return 'starter';
    const s = String(slug).toLowerCase().trim().replace(/\s+/g, '-');
    if (s === 'pro' || s === 'plan-pro' || s === 'plan-pro-all-access' || s === 'pro-all-access') return 'pro';
    if (s === 'free' || s === 'starter' || s === 'gratuito' || s === 'gratis' || s === 'plan-gratuito') return 'starter';
    return s;
};

export const getEffectiveLimits = async (userId, bypassCache = false) => {
    try {
        const cacheKey = String(userId);
        // Check cache first (short 10-second TTL to guarantee real-time updates)
        if (!bypassCache && limitsCache.has(cacheKey)) {
            const cached = limitsCache.get(cacheKey);
            if (Date.now() - cached.timestamp < 10000) {
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

        // --- CONSULTAR DIRECTAMENTE DATOS DEL USUARIO ---
        const [userRows] = await pool.query(
            "SELECT plan_limits, max_hooks FROM users WHERE id = ?",
            [userId]
        );
        let directPlanSlug = 'starter';
        let directMaxHooks = null;
        let isUserCustom = false;
        let customLimitsObj = null;
        if (userRows && userRows.length > 0) {
            const row = userRows[0];
            let directLimits = row.plan_limits;
            if (typeof directLimits === 'string') {
                try {
                    directLimits = JSON.parse(directLimits);
                } catch(e) {
                    directLimits = null;
                }
            }
            if (directLimits) {
                if (directLimits.isCustom === true) {
                    isUserCustom = true;
                    customLimitsObj = directLimits;
                }
                const possibleSlug = directLimits.planSlug || directLimits.planName;
                if (possibleSlug) {
                    directPlanSlug = normalizePlanSlug(possibleSlug);
                }
            }
            if (row.max_hooks !== null && row.max_hooks !== undefined) {
                directMaxHooks = row.max_hooks;
            }
        }

        // --- LÓGICA JERÁRQUICA INTELIGENTE (EXPANSIÓN) ---
        let highestIndex = 0; // Por defecto el índice 0: 'starter'
        for (const slug of activeSlugs) {
            const normalized = normalizePlanSlug(slug);
            const idx = PLAN_ORDER.indexOf(normalized);
            if (idx > highestIndex) {
                highestIndex = idx;
            }
        }
        const directIdx = PLAN_ORDER.indexOf(normalizePlanSlug(directPlanSlug));
        if (directIdx > highestIndex) {
            highestIndex = directIdx;
        }

        // Expandir automáticamente para incluir todos los niveles inferiores de forma automática
        const expandedActiveSlugs = ['starter'];
        if (highestIndex > 0) {
            for (let i = 1; i <= highestIndex; i++) {
                expandedActiveSlugs.push(PLAN_ORDER[i]);
            }
        }

        // Sobrescribir listado de slugs activos con la lista expandida
        const finalActiveSlugs = expandedActiveSlugs;

        const [projects] = await pool.query('SELECT id, plan_slug, created_at FROM projects WHERE user_id = ? AND is_master = 0 ORDER BY created_at ASC', [userId]);
        const [allPlans] = await pool.query('SELECT slug, limits_config FROM plans');
        
        const planDefinitions = {};
        allPlans.forEach(p => {
            planDefinitions[p.slug] = p.limits_config ? (typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config) : DEFAULT_LIMITS;
        });

        // Active slugs set for quick lookup
        const activeSlugsSet = new Set(finalActiveSlugs);

        // Project specific limits and dynamic status
        const projectLimits = {};
        const projectStatus = {};

        projects.forEach((proj, index) => {
            const slotNumber = index + 1;
            const slotPlanSlug = `plan-max-${slotNumber}`;
            
            let effectivePlanSlug = 'starter';
            let isBlocked = false;

            if (activeSlugsSet.has('pro') || activeSlugsSet.has('max')) {
                effectivePlanSlug = 'pro';
                isBlocked = false;
            } else if (slotNumber === 1) {
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

            const limits = isUserCustom ? customLimitsObj : (planDefinitions[effectivePlanSlug] || DEFAULT_LIMITS);
            projectLimits[proj.id] = { ...limits, planName: effectivePlanSlug, isBlocked };
            projectStatus[proj.id] = { planName: effectivePlanSlug, isBlocked };
        });

        // Filter out 'starter' if there are other plans for global summary
        const hasPremiumPlans = finalActiveSlugs.some(slug => slug !== 'starter');
        const relevantSlugs = hasPremiumPlans 
            ? finalActiveSlugs.filter(slug => slug !== 'starter')
            : (finalActiveSlugs.length > 0 ? finalActiveSlugs : ['starter']);

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

        if (isUserCustom) {
            summary.maxProjects = customLimitsObj.maxProjects || 0;
            summary.maxLandings = customLimitsObj.maxLandings || 0;
            summary.maxArticles = customLimitsObj.maxArticles || 0;
            summary.maxDomains = customLimitsObj.maxDomains || 0;
            summary.maxEmailSequences = customLimitsObj.maxEmailSequences || 0;
            summary.maxEmailSequencesNurturing = customLimitsObj.maxEmailSequencesNurturing || 15;
            summary.maxWhatsAppLaunches = customLimitsObj.maxWhatsAppLaunches || 0;
            summary.maxHooks = customLimitsObj.maxHooks || 0;
            if (customLimitsObj.features) {
                summary.features = { ...DEFAULT_LIMITS.features, ...customLimitsObj.features };
            }
        } else {
            relevantSlugs.forEach(slug => {
                const limits = planDefinitions[slug] || DEFAULT_LIMITS;
                
                // Sum up global capacities (Inventory based)
                summary.maxProjects += (limits.maxProjects || 0);
                summary.maxLandings += (limits.maxLandings || 0);
                summary.maxArticles += (limits.maxArticles || 0);
                summary.maxDomains += (limits.maxDomains || 0);
                summary.maxEmailSequences += (limits.maxEmailSequences || 0);
                
                let nurtureVal = limits.maxEmailSequencesNurturing;
                if (nurtureVal === undefined || nurtureVal === null || nurtureVal === 0) {
                    nurtureVal = (slug !== 'starter') ? 15 : 0;
                }
                summary.maxEmailSequencesNurturing += nurtureVal;
                
                summary.maxWhatsAppLaunches += (limits.maxWhatsAppLaunches || 0);
                summary.maxHooks += (limits.maxHooks || 0);

                // Merge features
                if (limits.features) {
                    Object.keys(limits.features).forEach(feat => {
                        if (limits.features[feat]) summary.features[feat] = true;
                    });
                }
            });
        }

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
            allActivePlans: finalActiveSlugs,
            inventoryCount: finalActiveSlugs.length
        };

        if (directMaxHooks !== null && directMaxHooks !== undefined) {
            result.maxHooks = directMaxHooks;
        }

        limitsCache.set(cacheKey, { data: result, timestamp: Date.now() });
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
      'SELECT id, name, email, password_hash, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url, max_hooks, survey_json, main_goal, experience_level, budget_range, main_obstacle, createdsurvey_at, updatedsurvey_at, niche, urgency_level FROM users WHERE email = ?',
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
      maxHooks: user.max_hooks,
      survey_json: user.survey_json,
      main_goal: user.main_goal,
      experience_level: user.experience_level,
      budget_range: user.budget_range,
      main_obstacle: user.main_obstacle,
      createdsurvey_at: user.createdsurvey_at,
      updatedsurvey_at: user.updatedsurvey_at,
      niche: user.niche,
      urgency_level: user.urgency_level
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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url, max_hooks, survey_json, main_goal, experience_level, budget_range, main_obstacle, createdsurvey_at, updatedsurvey_at, niche, urgency_level FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    const user = rows[0];
    const planLimits = await getEffectiveLimits(user.id, true);

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
        maxHooks: user.max_hooks,
        survey_json: user.survey_json,
        main_goal: user.main_goal,
        experience_level: user.experience_level,
        budget_range: user.budget_range,
        main_obstacle: user.main_obstacle,
        createdsurvey_at: user.createdsurvey_at,
        updatedsurvey_at: user.updatedsurvey_at,
        niche: user.niche,
        urgency_level: user.urgency_level
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
            'SELECT id, name, email, role, is_active, public_subdomain, plan_limits, avatar_url, birth_date, created_at, custom_redirect_url, max_hooks, survey_json, main_goal, experience_level, budget_range, main_obstacle, createdsurvey_at, updatedsurvey_at, niche, urgency_level FROM users WHERE id = ?',
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
            maxHooks: user.max_hooks,
            survey_json: user.survey_json,
            main_goal: user.main_goal,
            experience_level: user.experience_level,
            budget_range: user.budget_range,
            main_obstacle: user.main_obstacle,
            createdsurvey_at: user.createdsurvey_at,
            updatedsurvey_at: user.updatedsurvey_at,
            niche: user.niche,
            urgency_level: user.urgency_level
        });

    } catch (e) {
        console.error("Error updating profile:", e);
        res.status(500).json({ error: "Error al actualizar perfil" });
    }
});

router.post('/survey', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const surveyData = { ...req.body };
        
        const mainGoal = surveyData.mainGoal || null;
        const experienceLevel = surveyData.experienceLevel || null;
        const budgetRange = surveyData.budgetRange || null;
        const mainObstacle = Array.isArray(surveyData.mainObstacle) ? surveyData.mainObstacle.join(', ') : (surveyData.mainObstacle || null);
        const niche = surveyData.niche || null;
        const urgencyLevel = surveyData.urgencyLevel || null;
        const fullName = surveyData.fullName || null;
        const email = surveyData.email || null;
        
        // Remove sensitive or redundant data from JSON
        delete surveyData.email;

        const surveyJson = JSON.stringify(surveyData);

        // Check if survey already exists to set createdsurvey_at
        const [existing] = await pool.query('SELECT createdsurvey_at FROM users WHERE id = ?', [userId]);
        const createdSurveyAt = existing[0]?.createdsurvey_at || new Date();

        // Update core user data if provided in survey
        if (fullName || email) {
            const updates = [];
            const values = [];
            if (fullName) {
                updates.push('name = ?');
                values.push(fullName);
            }
            if (email) {
                updates.push('email = ?');
                values.push(email);
            }
            if (updates.length > 0) {
                values.push(userId);
                await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
            }
        }

        await pool.query(
            `UPDATE users SET 
                main_goal = ?, 
                experience_level = ?, 
                budget_range = ?, 
                main_obstacle = ?, 
                niche = ?,
                urgency_level = ?,
                survey_json = ?,
                createdsurvey_at = IFNULL(createdsurvey_at, ?),
                updatedsurvey_at = NOW() 
            WHERE id = ?`,
            [mainGoal, experienceLevel, budgetRange, mainObstacle, niche, urgencyLevel, surveyJson, createdSurveyAt, userId]
        );
        
        res.json({ success: true, message: 'Encuesta guardada correctamente' });
    } catch (error) {
        console.error("[Survey Error]", error);
        res.status(500).json({ error: 'Error al guardar la encuesta' });
    }
});

// ======================================================
//  PÁGINA DE GRACIAS / ÉXITO DE SUSCRIPCIÓN HOTMART
// ======================================================

/**
 * Obtiene los detalles de la compra y del plan adquirido tras pagar en Hotmart.
 * Soporta parámetros de consulta (transacción, email, plan, src) y sesión autenticada.
 */
router.get('/subscription-success', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        let tokenUserId = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                tokenUserId = decoded.id;
            } catch (e) {
                // Token inválido o expirado, continuamos como visitante
            }
        }

        // Parámetros devueltos por Hotmart en el redirect
        const rawTransaction = (req.query.transaction || req.query.transacao || req.query.transaction_id || '').trim();
        const rawEmail = (req.query.email || req.query.buyer_email || req.query.c_email || '').trim().toLowerCase();
        // Hotmart envía el nombre del comprador como 'c_name'
        const rawName = (req.query.c_name || req.query.name || req.query.buyer_name || '').trim();
        // Código de afiliado
        const rawAff = (req.query.aff || req.query.affiliate || '').trim();
        // Estado de aprobación definido por el usuario: 1 = aprobado, 2 = efectivo pendiente, 3 = paypal pendiente
        const rawAprobado = String(req.query.aprobado || req.query.status || '1').trim();
        const rawSrc = req.query.src || '';
        const rawPlanSlug = (req.query.plan || req.query.plan_slug || '').trim().toLowerCase();
        const rawProductId = req.query.product || req.query.prod || req.query.product_id || '';
        const rawOffer = req.query.off || req.query.offer || '';

        // Tracking & UTMs
        const itmSource = req.query.itm_source || req.query.utm_source || '';
        const itmMedium = req.query.itm_medium || req.query.utm_medium || '';
        const itmCampaign = req.query.itm_campaign || req.query.utm_campaign || '';

        let targetUserId = tokenUserId;

        // Si no hay token de usuario, intentar resolver userId mediante SRC
        if (!targetUserId && rawSrc) {
            const srcStr = String(rawSrc);
            const candidateId = srcStr.includes('-') ? srcStr.split('-')[0] : srcStr;
            if (/^\d+$/.test(candidateId)) {
                targetUserId = parseInt(candidateId, 10);
            }
        }

        // Buscar registro de pago en DB por transaction_id si fue proporcionado
        let paymentRecord = null;
        if (rawTransaction) {
            const [payRows] = await pool.query(
                `SELECT * FROM user_payments WHERE transaction_id = ? OR stripe_id = ? ORDER BY created_at DESC LIMIT 1`,
                [rawTransaction, rawTransaction]
            );
            if (payRows.length > 0) {
                paymentRecord = payRows[0];
                if (!targetUserId) targetUserId = paymentRecord.user_id;
            }
        }

        // Si aún no tenemos targetUserId pero vino email, buscar el usuario
        let userRecord = null;
        if (targetUserId) {
            const [uRows] = await pool.query(
                `SELECT id, name, email, plan_limits, is_active, created_at FROM users WHERE id = ?`,
                [targetUserId]
            );
            if (uRows.length > 0) userRecord = uRows[0];
        } else if (rawEmail) {
            const [uRows] = await pool.query(
                `SELECT id, name, email, plan_limits, is_active, created_at FROM users WHERE email = ?`,
                [rawEmail]
            );
            if (uRows.length > 0) {
                userRecord = uRows[0];
                targetUserId = userRecord.id;
            }
        }

        // Si hay targetUserId y no teníamos paymentRecord, buscar el último pago aprobado del usuario
        if (targetUserId && !paymentRecord) {
            const [userPayRows] = await pool.query(
                `SELECT * FROM user_payments WHERE user_id = ? AND status = 'approved' ORDER BY created_at DESC LIMIT 1`,
                [targetUserId]
            );
            if (userPayRows.length > 0) {
                paymentRecord = userPayRows[0];
            }
        }

        // Obtener límites efectivos si hay usuario identificado
        let effectiveLimits = null;
        if (targetUserId) {
            effectiveLimits = await getEffectiveLimits(targetUserId, true);
        }

        // Buscar información del plan en la tabla 'plans'
        let matchedPlan = null;

        // 1. Coincidencia por producto u oferta de Hotmart
        if (rawProductId || rawOffer) {
            const [pRows] = await pool.query(
                `SELECT * FROM plans 
                 WHERE (hotmart_id = ? OR hotmart_id_annual = ?) 
                    OR (hotmart_offer = ? OR hotmart_offer_annual = ?) 
                 LIMIT 1`,
                [rawProductId, rawProductId, rawOffer, rawOffer]
            );
            if (pRows.length > 0) matchedPlan = pRows[0];
        }

        // 2. Coincidencia por slug explícito
        if (!matchedPlan && rawPlanSlug) {
            const normalizedSlug = (rawPlanSlug === 'anual' || rawPlanSlug === 'annual' || rawPlanSlug === 'pro-anual' || rawPlanSlug === 'yearly') ? 'pro' : rawPlanSlug;
            const [pRows] = await pool.query(
                `SELECT * FROM plans WHERE slug = ? OR name LIKE ? LIMIT 1`,
                [normalizedSlug, `%${rawPlanSlug}%`]
            );
            if (pRows.length > 0) matchedPlan = pRows[0];
        }

        // 3. Fallback al plan Pro configurado en la base de datos
        if (!matchedPlan) {
            const [fallbackRows] = await pool.query(
                `SELECT * FROM plans WHERE slug = 'pro' OR is_recommended = 1 ORDER BY price_monthly DESC LIMIT 1`
            );
            if (fallbackRows.length > 0) matchedPlan = fallbackRows[0];
        }

        // Determinar si es suscripción ANUAL o MENSUAL
        const isAnnualExplicit = (rawPlanSlug === 'anual' || rawPlanSlug === 'annual' || rawPlanSlug === 'pro-anual' || rawPlanSlug === 'yearly');
        const isAnnualByOffer = matchedPlan && (
            (rawOffer && (rawOffer === matchedPlan.hotmart_offer_annual)) ||
            (rawProductId && (rawProductId === matchedPlan.hotmart_id_annual))
        );
        const isAnnualByPayment = paymentRecord && matchedPlan && (
            parseFloat(paymentRecord.amount) >= (parseFloat(matchedPlan.price_annual || 0) * 0.75) &&
            parseFloat(paymentRecord.amount) > parseFloat(matchedPlan.price_monthly || 0) * 2
        );
        const isAnnual = isAnnualExplicit || isAnnualByOffer || isAnnualByPayment;

        // Configuración dinámica del plan
        const monthlyPrice = matchedPlan ? parseFloat(matchedPlan.price_monthly || 79) : 79;
        const annualPrice = matchedPlan ? parseFloat(matchedPlan.price_annual || (monthlyPrice * 10)) : 470;
        const currency = paymentRecord?.currency || req.query.currency || matchedPlan?.currency || 'USD';

        const finalPlanName = isAnnual 
            ? (matchedPlan?.name ? (matchedPlan.name.includes('Anual') ? matchedPlan.name : `${matchedPlan.name} (Anual)`) : 'Plan Pro Anual')
            : (matchedPlan?.name ? (matchedPlan.name.includes('Mensual') ? matchedPlan.name : `${matchedPlan.name} (Mensual)`) : 'Plan Pro All-Access');

        const finalPlanPrice = isAnnual ? annualPrice : monthlyPrice;

        const planDetails = {
            id: matchedPlan ? matchedPlan.id.toString() : 'pro',
            name: finalPlanName,
            slug: isAnnual ? 'annual' : (matchedPlan?.slug || 'pro'),
            interval: isAnnual ? 'annual' : 'monthly',
            description: matchedPlan?.description || (isAnnual 
                ? 'Acceso total durante 1 año con todas las herramientas de automatización, IA y soporte VIP.' 
                : 'Acceso completo a la suite de automatización con IA y herramientas para escalar en Hotmart.'),
            price: finalPlanPrice,
            priceMonthly: monthlyPrice,
            priceAnnual: annualPrice,
            currency: currency,
            uiFeatures: matchedPlan ? (
                typeof matchedPlan.ui_features === 'string' 
                    ? JSON.parse(matchedPlan.ui_features) 
                    : (matchedPlan.ui_features || [])
            ) : [
                'Generador de Landing Pages con IA de Alta Conversión',
                'Estrategia de Hooks Persuasivos y Guiones Virales',
                'Embudos de Venta Ilimitados y Optimizados',
                'Secuencias Automatizadas de Email Marketing',
                'Lanzamientos Estratégicos por WhatsApp',
                'Conexión de Dominios Personalizados',
                'Acceso VIP a la Academia y Entrenamientos'
            ],
            limitsConfig: matchedPlan ? (
                typeof matchedPlan.limits_config === 'string'
                    ? JSON.parse(matchedPlan.limits_config)
                    : (matchedPlan.limits_config || DEFAULT_LIMITS)
            ) : DEFAULT_LIMITS
        };

        const finalTransaction = rawTransaction 
            || paymentRecord?.transaction_id 
            || `HP${Date.now().toString().slice(-9)}`;

        const finalAmount = paymentRecord?.amount 
            ? parseFloat(paymentRecord.amount)
            : (req.query.price ? parseFloat(req.query.price) : finalPlanPrice);

        // Mapeo detallado de estado según 'aprobado'
        // 1 = Compra aprobada en tiempo real
        // 2 = Pago en efectivo (requiere confirmación)
        // 3 = Pago por PayPal (requiere confirmación)
        let approvalCode = rawAprobado;
        let approvalStatus = 'approved';
        let approvalTitle = '¡Tu Suscripción está 100% Activa!';
        let approvalBadge = 'Pago Aprobado';
        let approvalMessage = 'Hemos procesado tu pedido de Hotmart con éxito. Tu cuenta ya cuenta con todas las herramientas desbloqueadas para que comiences a escalar de inmediato.';

        if (rawAprobado === '2') {
            approvalStatus = 'pending_cash';
            approvalTitle = '¡Orden Registrada! Esperando Pago en Efectivo';
            approvalBadge = 'Pago en Efectivo Pendiente';
            approvalMessage = 'Tu solicitud de pago en efectivo (Baloto, Efecty, OXXO, Boleto, etc.) ha sido generada correctamente en Hotmart. En cuanto realices el pago y el banco lo confirme (suele tardar de 24 a 48 hs), tu suscripción se activará automáticamente.';
        } else if (rawAprobado === '3') {
            approvalStatus = 'pending_paypal';
            approvalTitle = 'Procesando Pago con PayPal';
            approvalBadge = 'Confirmación de PayPal Pendiente';
            approvalMessage = 'Estamos a la espera de la confirmación final por parte de PayPal y Hotmart. Una vez acreditado el pago, tu cuenta se activará de forma inmediata.';
        }

        const buyerName = userRecord?.name || rawName || 'Cliente Hotmart';
        const buyerEmail = userRecord?.email || rawEmail || '';

        // GUARDAR O ACTUALIZAR EN 'hotmart_orders_log' PARA NO PERDER NINGÚN DATO
        if (finalTransaction) {
            try {
                await pool.query(
                    `INSERT INTO hotmart_orders_log 
                     (transaction_id, buyer_name, buyer_email, approval_code, approval_status, affiliate_code, plan_slug, amount, currency, itm_source, itm_medium, itm_campaign, raw_query_json) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                     ON DUPLICATE KEY UPDATE 
                         buyer_name = IF(VALUES(buyer_name) != '' AND VALUES(buyer_name) != 'Cliente Hotmart', VALUES(buyer_name), buyer_name),
                         buyer_email = IF(VALUES(buyer_email) != '', VALUES(buyer_email), buyer_email),
                         approval_code = VALUES(approval_code),
                         approval_status = VALUES(approval_status),
                         affiliate_code = IF(VALUES(affiliate_code) != '', VALUES(affiliate_code), affiliate_code),
                         plan_slug = VALUES(plan_slug),
                         amount = VALUES(amount),
                         currency = VALUES(currency),
                         raw_query_json = VALUES(raw_query_json),
                         updated_at = NOW()`,
                    [
                        finalTransaction,
                        buyerName,
                        buyerEmail,
                        approvalCode,
                        approvalStatus,
                        rawAff,
                        planDetails.slug,
                        finalAmount,
                        currency,
                        itmSource,
                        itmMedium,
                        itmCampaign,
                        JSON.stringify(req.query)
                    ]
                );
            } catch (logErr) {
                console.warn("[Hotmart Orders Log Insert Error]", logErr.message);
            }
        }

        res.json({
            success: true,
            approval: {
                code: approvalCode,
                status: approvalStatus,
                title: approvalTitle,
                badge: approvalBadge,
                message: approvalMessage
            },
            purchase: {
                transactionId: finalTransaction,
                status: approvalStatus,
                amount: finalAmount,
                currency: currency,
                date: paymentRecord?.created_at || new Date().toISOString(),
                paymentMethod: paymentRecord?.payment_method || (rawAprobado === '2' ? 'Efectivo' : (rawAprobado === '3' ? 'PayPal' : 'Hotmart')),
                affiliateCode: rawAff
            },
            plan: planDetails,
            buyer: {
                name: buyerName,
                email: buyerEmail,
                affiliateCode: rawAff,
                isRegistered: !!userRecord,
                isLoggedIn: !!tokenUserId && (tokenUserId === userRecord?.id)
            },
            effectiveLimits: effectiveLimits || planDetails.limitsConfig
        });
    } catch (error) {
        console.error("[Subscription Success Error]", error);
        res.status(500).json({ error: 'Error al procesar los detalles de la compra' });
    }
});

/**
 * Activación de cuenta directa post-compra en Hotmart.
 * Permite a un nuevo comprador definir su contraseña y acceder inmediatamente.
 */
router.post('/activate-hotmart-account', async (req, res) => {
    const { email, password, name, transaction, plan } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'El email y la contraseña son requeridos' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanName = (name || cleanEmail.split('@')[0]).trim();
        const cleanTransaction = (transaction || '').trim();
        const passwordHash = await bcrypt.hash(password, 10);

        // Revisar si existe registro en hotmart_orders_log
        let orderLog = null;
        if (cleanTransaction) {
            try {
                const [logRows] = await pool.query('SELECT * FROM hotmart_orders_log WHERE transaction_id = ? LIMIT 1', [cleanTransaction]);
                if (logRows.length > 0) orderLog = logRows[0];
            } catch (e) {}
        }

        const isAnnual = (plan === 'annual' || plan === 'anual') || (orderLog?.plan_slug === 'annual');

        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);

        let finalUser = null;

        if (existing.length > 0) {
            // Usuario ya registrado: actualizamos contraseña y activamos
            const userId = existing[0].id;
            await pool.query(
                `UPDATE users SET password_hash = ?, is_active = 1, last_login_at = NOW() WHERE id = ?`,
                [passwordHash, userId]
            );
            const limits = await getEffectiveLimits(userId, true);
            finalUser = {
                id: userId.toString(),
                name: existing[0].name || cleanName,
                email: cleanEmail,
                role: existing[0].role || 'user',
                planLimits: limits,
                customRedirectUrl: existing[0].custom_redirect_url
            };
            await logSystemActivity(userId, finalUser.name, 'HOTMART_ACCOUNT_ACTIVATED', 'user', userId, { email: cleanEmail, transaction: cleanTransaction });
        } else {
            // Usuario nuevo creado desde la página de gracias
            const [proPlans] = await pool.query(`SELECT limits_config FROM plans WHERE slug = 'pro' LIMIT 1`);
            const defaultLimits = proPlans.length > 0 
                ? (typeof proPlans[0].limits_config === 'string' ? JSON.parse(proPlans[0].limits_config) : proPlans[0].limits_config)
                : DEFAULT_LIMITS;

            const [insertResult] = await pool.query(
                `INSERT INTO users (name, email, password_hash, role, is_active, plan_limits, created_at, last_login_at) 
                 VALUES (?, ?, ?, 'user', 1, ?, NOW(), NOW())`,
                [cleanName, cleanEmail, passwordHash, JSON.stringify(defaultLimits)]
            );
            const newId = insertResult.insertId;

            // Crear suscripción activa inicial
            const subscriptionSlug = isAnnual ? 'annual' : 'pro';
            await pool.query(
                `INSERT INTO user_subscriptions (user_id, plan_slug, status, hotmart_purchase_id, created_at) 
                 VALUES (?, ?, 'active', ?, NOW())`,
                [newId, subscriptionSlug, cleanTransaction || null]
            );

            // Registrar pago si hay número de transacción
            if (cleanTransaction) {
                const payAmount = orderLog?.amount || (isAnnual ? 470 : 79);
                const payCurrency = orderLog?.currency || 'USD';
                const affCode = orderLog?.affiliate_code || null;
                const approvalCode = orderLog?.approval_code || '1';

                await pool.query(
                    `INSERT INTO user_payments (user_id, transaction_id, amount, currency, status, payment_method, affiliate_code, buyer_name, approval_code) 
                     VALUES (?, ?, ?, ?, 'approved', 'hotmart', ?, ?, ?)`,
                    [newId, cleanTransaction, payAmount, payCurrency, affCode, cleanName, approvalCode]
                );
            }

            finalUser = {
                id: newId.toString(),
                name: cleanName,
                email: cleanEmail,
                role: 'user',
                planLimits: defaultLimits,
                customRedirectUrl: null
            };
            await logSystemActivity(newId, cleanName, 'HOTMART_ACCOUNT_CREATED', 'user', newId, { email: cleanEmail, transaction: cleanTransaction });
        }

        // Actualizar el correo en hotmart_orders_log
        if (cleanTransaction) {
            try {
                await pool.query(
                    `UPDATE hotmart_orders_log SET buyer_email = ?, buyer_name = ? WHERE transaction_id = ?`,
                    [cleanEmail, cleanName, cleanTransaction]
                );
            } catch (e) {}
        }

        const token = createToken(finalUser);
        res.json({ success: true, user: finalUser, token });
    } catch (error) {
        console.error("[Activate Hotmart Account Error]", error);
        res.status(500).json({ error: 'Error al activar la cuenta' });
    }
});

export { router };
