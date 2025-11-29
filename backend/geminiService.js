const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
} else {
    console.warn("⚠️ [GEMINI] No GEMINI_API_KEY found in environment variables.");
}

/**
 * Genera contenido usando Google Gemini
 * @param {string} model - Nombre del modelo (ej. 'gemini-2.5-flash')
 * @param {string|object} contents - Prompt o contenido
 * @param {object} config - Configuración opcional (schema, mimeType, etc.)
 */
const generateContent = async (model, contents, config = {}) => {
    if (!aiClient) {
        throw new Error("Gemini API Key not configured on server.");
    }

    try {
        const response = await aiClient.models.generateContent({
            model: model || 'gemini-2.5-flash',
            contents: contents,
            config: config
        });

        return response.text;
    } catch (error) {
        console.error("❌ [GEMINI SERVICE ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent };