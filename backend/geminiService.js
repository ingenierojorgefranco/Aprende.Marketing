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
    Rol: Motor de Análisis Estratégico de Marketing Digital Maestro.
    Tarea: Generar un "Informe Estratégico Maestro" ultra detallado en formato JSON para un proyecto específico.
    
    INFORMACIÓN DEL PROYECTO:
    - Nombre: "${name}"
    - Nicho: "${niche}"
    - Producto: "${productName}"
    - Descripción: "${description}"

    REGLAS DE GENERACIÓN FINANCIERA:
    1. Basado en el nicho y producto, sugiere un "price" (número) realista entre 47 y 997 USD.
    2. Sugiere una "commissionRate" (número entre 0.4 y 0.8).
    3. Genera un array "projection" de EXACTAMENTE 12 números que representen los ingresos mensuales (comisión neta) proyectados para el primer año. Debe seguir una curva de aprendizaje: meses 1-3 bajos/cero, seguidos de crecimiento exponencial hasta el mes 12.

    ESTRUCTURA JSON REQUERIDA (ESTRICTA):
    {
      "meta": {
        "projectName": "${name}",
        "niche": "${niche}",
        "price": number,
        "commissionRate": number,
        "projection": [number, number, ... 12 items],
        "insights": {
            "overview": { "title": "Estrategia General", "items": [...] },
            "niche": { "title": "Análisis de Nicho", "description": "..." },
            "product": { "title": "Rentabilidad", "description": "..." },
            "objective": { "title": "Método de Cierre", "description": "..." }
        }
      },
      "avatars": [
          {
            "id": 1,
            "name": "...",
            "archetype": "...",
            "age": "...",
            "quote": "...",
            "pain": "...",
            "desire": "...",
            "objection": "...",
            "motivations": { "dinero": number, "tiempo": number, "estatus": number, "seguridad": number }
          }
      ],
      "psychology": {
        "pains": ["...", "..."],
        "solutions": ["...", "..."]
      },
      "modules": {
        "content": [
            { "id": 1, "title": "...", "keyword": "...", "difficulty": number, "strategy": "..." }
        ],
        "emails": {
           "nurture": [ { "day": "Día 0", "subject": "...", "objective": "...", "bodyPreview": "..." } ],
           "evergreen": [ { "day": "Día 8", "subject": "...", "objective": "...", "bodyPreview": "..." } ]
        },
        "whatsapp": [
            { "id": 1, "title": "...", "objective": "...", "messages": [ { "role": "agent", "text": "..." } ] }
        ]
      }
    }
    
    Responde SOLO en JSON válido. Sin texto adicional.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
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