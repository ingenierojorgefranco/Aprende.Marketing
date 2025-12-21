const express = require('express');
const router = express.Router();
const { generateContent } = require('../geminiService');

router.post('/', async (req, res) => {
    try {
        const { model, contents, config } = req.body;
        const generatedText = await generateContent(model, contents, config);
        res.json({ text: generatedText });
    } catch (error) {
        res.status(500).json({ error: 'Error IA', details: error.message, text: '' });
    }
});

module.exports = router;