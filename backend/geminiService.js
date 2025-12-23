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
 * @param {string} model - Nombre del modelo (ej. 'gemini-3-flash-preview')
 * @param {string|object} contents - Prompt o contenido
 * @param {object} config - Configuración opcional (schema, mimeType, etc.)
 */
const generateContent = async (model, contents, config = {}) => {
    if (!aiClient) {
        throw new Error("Gemini API Key not configured on server.");
    }

    try {
        const response = await aiClient.models.generateContent({
            model: model || 'gemini-3-flash-preview',
            contents: contents,
            config: config
        });

        if (response) {
            try {
                return response.text || "";
            } catch (textError) {
                console.warn("⚠️ [GEMINI] Could not access response.text (possibly blocked):", textError.message);
                return "";
            }
        }
        
        return "";

    } catch (error) {
        console.error("❌ [GEMINI SERVICE ERROR]:", error);
        throw error;
    }
};

/**
 * Genera la Estrategia Maestra Completa (Blueprint)
 * Este método se encarga de la generación pesada y estructurada.
 */
const generateFullStrategy = async (projectData) => {
    if (!aiClient) {
        throw new Error("Gemini API Key not configured on server.");
    }

    const { name, niche, productName, description, targetAudience, painPoints, keyBenefits, brandTone } = projectData;

    const prompt = `
    Rol: Motor de Análisis Estratégico de Marketing Digital de Élite.
    Tarea: Generar un "Informe Estratégico Maestro" en formato JSON para el proyecto "${name}".
    
    INFORMACIÓN DEL PROYECTO:
    - Nicho: "${niche}"
    - Producto: "${productName}"
    - Tono: "${brandTone}"
    - Descripción: "${description}"
    - Audiencia Base: "${targetAudience || 'General'}"
    - Dolores Base: "${(painPoints || []).join(', ')}"
    - Beneficios Base: "${(keyBenefits || []).join(', ')}"

    Debes profundizar y expandir esta información para crear una estrategia coherente que conecte cada pieza del embudo.
    Usa un tono persuasivo, profesional y orientado a la conversión directa.
    
    ESTRUCTURA DE RESPUESTA:
    Debes devolver un objeto JSON que siga exactamente el esquema de 'ProjectMasterStrategy'.
    Incluye Avatares, Psicología, Módulos Web, Contenido SEO, Secuencias de Email y WhatsApp.
    `;

    try {
        // Utilizamos el modelo Pro para la estrategia maestra debido a su complejidad
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
                // El esquema se valida en el frontend para mayor flexibilidad, 
                // pero aquí obligamos al formato JSON.
            }
        });

        let strategyJson = {};
        try {
            if (response.text) {
                strategyJson = JSON.parse(response.text);
            }
        } catch (parseError) {
            console.error("Error parsing strategy JSON:", parseError);
            throw new Error("La IA generó una respuesta inválida.");
        }

        return strategyJson;

    } catch (error) {
        console.error("❌ [GEMINI STRATEGY ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent, generateFullStrategy };
