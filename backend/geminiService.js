const { GoogleGenAI } = require("@google/genai");

// Fixed: Always use process.env.API_KEY and correct initialization format
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Genera contenido usando Google Gemini
 * @param {string} model - Nombre del modelo (ej. 'gemini-3-flash-preview')
 * @param {string|object} contents - Prompt o contenido
 * @param {object} config - Configuración opcional (schema, mimeType, etc.)
 */
const generateContent = async (model, contents, config = {}) => {
    try {
        // Fixed: Use ai.models.generateContent directly with model name and prompt
        const response = await ai.models.generateContent({
            // Fixed: Select gemini-3-flash-preview for basic text tasks
            model: model || 'gemini-3-flash-preview',
            contents: contents,
            config: config
        });

        // Safe extraction of text, handling cases where it might be undefined/blocked
        if (response) {
            try {
                // Fixed: Accessing .text property directly as per guidelines
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
        // Fixed: Use ai.models.generateContent directly
        const response = await ai.models.generateContent({
            // Fixed: Use gemini-3-pro-preview for complex reasoning/strategy tasks
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        // Parse JSON safely
        let strategyJson = {};
        try {
            // Fixed: Accessing .text property directly as per guidelines
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