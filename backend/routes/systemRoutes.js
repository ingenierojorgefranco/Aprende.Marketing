
const express = require('express');
const pool = require('../db');
const { generateContent } = require('../geminiService');
const { authMiddleware } = require('../authMiddleware');
const stripeService = require('../stripeService');

const router = express.Router();

// ======================================================
//  LEGACY COMPATIBILITY
// ======================================================

/**
 * Redirección de login antiguo para no romper compatibilidad
 */
router.post('/login', (req, res) => {
    res.redirect(307, '/api/auth/login');
});

// ======================================================
//  STRIPE CHECKOUT
// ======================================================

/**
 * Crea una sesión de Checkout para que el usuario inicie el pago de un plan.
 */
router.post('/stripe/create-checkout-session', authMiddleware, async (req, res) => {
    const { planSlug } = req.body;
    if (!planSlug) return res.status(400).json({ error: "Plan no especificado." });

    try {
        const checkoutUrl = await stripeService.createCheckoutSession(req.user.id, req.user.email, planSlug);
        res.json({ url: checkoutUrl });
    } catch (e) {
        console.error("[Stripe Checkout Error]", e);
        res.status(500).json({ error: e.message || "Error al crear sesión de pago." });
    }
});

// ======================================================
//  CONFIGURACIONES Y PLANES PÚBLICOS
// ======================================================

/**
 * Obtiene la URL de redirección global configurada por el admin.
 */
router.get('/settings/redirect', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'after_login_url'");
        const url = rows.length > 0 ? rows[0].setting_value : '/dashboard';
        res.json({ url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

////////// Se añade endpoint para obtener el método de pago activo del sistema - 24/05/2025 10:30 //////////
/**
 * Obtiene el método de pago activo configurado globalmente.
 */
router.get('/settings/payment-method', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_value FROM system_settings WHERE setting_key = 'active_payment_method'");
        const method = rows.length > 0 ? rows[0].setting_value : 'stripe';
        res.json({ method });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 24/05/2025 10:30 //////////

/**
 * Lista los planes activos para la landing page pública o modal de upgrade.
 */
router.get('/public/plans', async (req, res) => {
    try {
        const [plans] = await pool.query('SELECT * FROM plans WHERE is_active = 1 ORDER BY price_monthly ASC');
        const formattedPlans = plans.map(p => ({
            id: p.id.toString(),
            name: p.name,
            slug: p.slug,
            description: p.description,
            priceMonthly: parseFloat(p.price_monthly),
            currency: p.currency,
            stripePriceId: p.stripe_price_id,
            ////////// Se incluye hotmartId en la respuesta pública - 24/05/2025 10:30 //////////
            hotmartId: p.hotmart_id,
            ////////// Fin de actualización - 24/05/2025 10:30 //////////
            ////////// Se incluyen hotmartOffer y hotmartCheckoutMode en la respuesta pública - 25/05/2025 19:30 //////////
            hotmartOffer: p.hotmart_offer,
            hotmartCheckoutMode: p.hotmart_checkout_mode,
            ////////// Fin de actualización - 25/05/2025 19:30 //////////
            limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : p.limits_config,
            uiFeatures: typeof p.ui_features === 'string' ? JSON.parse(p.ui_features) : (p.ui_features || []),
            isRecommended: !!p.is_recommended
        }));
        res.json(formattedPlans);
    } catch (e) {
        console.error("[Plans] Error fetching public plans:", e);
        res.status(500).json({ error: e.message });
    }
});

// ======================================================
//  IA & DIAGNÓSTICO
// ======================================================

/**
 * Proxy para el motor de Inteligencia Artificial Gemini.
 */
router.post('/gemini', async (req, res) => {
  try {
    const { model, contents, config } = req.body;
    const generatedText = await generateContent(model, contents, config);
    res.json({ text: generatedText });
  } catch (error) {
    res.status(500).json({ error: 'Error IA', details: error.message, text: '' });
  }
});

/**
 * Endpoint de diagnóstico de salud de la infraestructura.
 */
router.get('/debug/db-status', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT 1 as val');
      res.json({ 
          status: 'online', 
          db_response: rows[0].val, 
          server_version: 'v29_clean_modular',
          timestamp: new Date().toISOString()
      });
  } catch (e) {
      res.status(500).json({ status: 'offline', error: e.message });
  }
});

////////// Actualización: Endpoint público para el feed de novedades - 07/06/2025 10:00 //////////
router.get('/system/news', async (req, res) => {
    try {
        const [news] = await pool.query('SELECT * FROM novedadestips ORDER BY created_at DESC LIMIT 5');
        res.json(news.map(n => ({
            id: n.id.toString(),
            title: n.title,
            content: n.content,
            date: new Date(n.created_at).toLocaleDateString(),
            iconType: n.icon_type
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/system/news/history', async (req, res) => {
    const { month, year } = req.query;
    try {
        let query = 'SELECT * FROM novedadestips WHERE 1=1';
        const params = [];
        if (month) {
            query += ' AND MONTH(created_at) = ?';
            params.push(month);
        }
        if (year) {
            query += ' AND YEAR(created_at) = ?';
            params.push(year);
        }
        query += ' ORDER BY created_at DESC';
        const [news] = await pool.query(query, params);
        res.json(news.map(n => ({
            id: n.id.toString(),
            title: n.title,
            content: n.content,
            date: new Date(n.created_at).toLocaleDateString(),
            iconType: n.icon_type
        })));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
////////// Fin de actualización - 07/06/2025 10:00 //////////

module.exports = router;
