const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../authMiddleware');
const stripeService = require('../stripeService');

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
    const { planSlug } = req.body;
    if (!planSlug) return res.status(400).json({ error: "Plan no especificado." });
    try {
        const checkoutUrl = await stripeService.createCheckoutSession(req.user.id, req.user.email, planSlug);
        res.json({ url: checkoutUrl });
    } catch (e) {
        res.status(500).json({ error: e.message || "Error al crear sesión." });
    }
});

module.exports = router;