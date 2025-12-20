
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

        // Safe extraction of text, handling cases where it might be undefined/blocked
        if (response) {
            try {
                // Accessing .text might throw if the response was blocked by safety filters
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

const generateFullStrategy = async (projectData) => {
    if (!aiClient) {
        throw new Error("Gemini API Key not configured on server.");
    }

    const { name, niche, productName, description, targetAudience, painPoints, keyBenefits } = projectData;

    const prompt = `
    Rol: Motor de Análisis Estratégico de Marketing Digital.
    Tarea: Generar un "Informe Estratégico Maestro" en formato JSON para un proyecto específico.
    
    INFORMACIÓN DEL PROYECTO:
    - Nombre: "${name}"
    - Nicho: "${niche}"
    - Producto: "${productName}"
    - Descripción: "${description}"
    - Audiencia (Input usuario): "${targetAudience || 'General'}"
    - Dolores (Input usuario): "${(painPoints || []).join(', ')}"
    - Beneficios (Input usuario): "${(keyBenefits || []).join(', ')}"

    Debes profundizar y expandir esta información para crear una estrategia completa.
    
    ESTRUCTURA JSON REQUERIDA (NO AÑADAS TEXTO FUERA DEL JSON):
    {
      "avatar": {
        "name": "Nombre ficticio del Avatar (ej. Ana la Emprendedora)",
        "age": "Rango de edad",
        "occupation": "Ocupación probable",
        "story": "Breve historia de su situación actual y por qué necesita esto (Storytelling)",
        "frustrations": ["Frustración 1", "Frustración 2", "Frustración 3"],
        "desires": ["Deseo profundo 1", "Deseo profundo 2", "Deseo profundo 3"]
      },
      "psychology": {
        "emotionalTriggers": ["Gatillo 1 (Miedo/Codicia/Vanidad...)", "Gatillo 2"],
        "objections": ["Objeción 1", "Objeción 2", "Objeción 3"],
        "falseBeliefs": ["Creencia limitante 1", "Creencia limitante 2"]
      },
      "funnel": {
        "leadMagnetIdea": "Idea concreta para un recurso gratuito (PDF/Clase/Quiz)",
        "tripwireIdea": "Idea para un producto de bajo costo (opcional)",
        "coreOfferPitch": "El pitch de venta principal del producto en 1 frase",
        "funnelSteps": ["Paso 1: Anuncio", "Paso 2: Landing", "Paso 3: Gracias..."]
      },
      "assets": {
        "emailSequence": [
           { "subject": "Asunto Email 1 (Bienvenida/Entrega)", "body": "Cuerpo del correo (corto, persuasivo)", "delay": "Inmediato" },
           { "subject": "Asunto Email 2 (Aporte Valor/Historia)", "body": "Cuerpo del correo", "delay": "Día 1" },
           { "subject": "Asunto Email 3 (Venta/Urgencia)", "body": "Cuerpo del correo", "delay": "Día 2" }
        ],
        "whatsappScripts": [
           { "scenario": "Primer Contacto", "script": "Hola [Nombre], vi que te interesaste en..." },
           { "scenario": "Seguimiento", "script": "Hola de nuevo, solo quería asegurarme..." }
        ],
        "adCopies": [
           { "platform": "Facebook/Instagram", "headline": "Gancho principal", "body": "Texto del anuncio..." },
           { "platform": "Google Ads (Search)", "headline": "Título anuncio", "body": "Descripción..." }
        ]
      }
    }
    
    Usa un tono persuasivo, profesional y orientado a la conversión directa.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        // Parse JSON safely
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
