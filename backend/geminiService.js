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
                console.warn("⚠️ [GEMINI] Could not access response.text:", textError.message);
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

    const { name, niche, productName, description } = projectData;

    const prompt = `
    Rol: Motor de Análisis Estratégico de Marketing Digital Maestro.
    Tarea: Generar un "Informe Estratégico Maestro" en formato JSON puro.
    
    REGLAS TÉCNICAS CRÍTICAS (OBLIGATORIO):
    1. Respuesta: Devuelve EXCLUSIVAMENTE el JSON. Sin explicaciones ni bloques de markdown.
    2. Comillas: ESCAPA OBLIGATORIAMENTE cualquier comilla doble (") que aparezca DENTRO de un valor de texto usando barra invertida (ej: "Deseo \"independencia\" financiera").
    3. Integridad: El JSON debe estar completo. No lo trunques bajo ninguna circunstancia.
    4. Formato: Mantén estrictamente la jerarquía de campos definida abajo.

    INFORMACIÓN DEL PROYECTO:
    - Nombre: "${name}"
    - Nicho: "${niche}"
    - Producto: "${productName}"
    - Descripción: "${description}"

    REGLAS DE GENERACIÓN PSICOGRÁFICA:
    Para el avatar principal (id: 1), DEBES incluir los siguientes campos basados en este perfil:
    1. age: Un rango entre 22 y 38 años.
    2. interests: Intereses relacionados con estética, belleza y autoempleo.
    3. desire: Deseo de generar ingresos propios ofreciendo servicios de alto valor.
    4. behavior: Canales de consumo Instagram y WhatsApp.
    5. objection: Desconfianza en promesas vacías y cursos online de baja calidad.

    ESTRUCTURA JSON REQUERIDA:
    {
      "meta": {
        "projectName": "${name}",
        "niche": "${niche}",
        "price": number,
        "commissionRate": number,
        "projection": [12 numbers],
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
            "age": "22-38 años",
            "quote": "...",
            "interests": "Estética, belleza y autoempleo",
            "desire": "Generar ingresos propios ofreciendo servicios de alto valor",
            "behavior": "Consume contenido en Instagram y WhatsApp",
            "objection": "Desconfía de promesas vacías en cursos online",
            "pain": "...",
            "motivations": { "dinero": number, "tiempo": number, "estatus": number, "seguridad": number }
          },
          { "id": 2, ... },
          { "id": 3, ... }
      ],
      "psychology": {
        "pains": ["...", "..."],
        "solutions": ["...", "..."],
        "awarenessStages": { "stage1_pain": "...", "stage2_solution": "...", "stage3_barrier": "..." },
        "buyingPsychology": { 
           "notBuyingReasons": [ { "title": "...", "description": "..." } ],
           "buyingReasons": [ { "title": "...", "description": "..." } ],
           "strategistConclusion": "..."
        },
        "conversionStrategy": {
           "mainFocus": [ { "label": "...", "description": "..." } ],
           "prioritizedChannels": [ { "label": "...", "type": "LP" } ],
           "communicationStyle": [ { "label": "...", "description": "..." } ],
           "tacticalNote": "..."
        }
      },
      "modules": {
        "content": [ { "id": 1, "title": "...", "keyword": "...", "difficulty": number, "strategy": "..." } ],
        "emails": {
           "nurture": [ { "day": "Día 0", "subject": "...", "objective": "...", "bodyPreview": "..." } ],
           "evergreen": [ { "day": "Día 8", "subject": "...", "objective": "...", "bodyPreview": "..." } ]
        },
        "whatsapp": [ { "id": 1, "title": "...", "objective": "...", "messages": [...] } ]
      }
    }
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
        if (response.text) {
            try {
                strategyJson = JSON.parse(response.text);
            } catch (pErr) {
                console.error("❌ [GEMINI] JSON Parse failed, attempting fallback cleanup.");
                // Limpieza agresiva de caracteres no imprimibles o decorativos
                const clean = response.text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
                strategyJson = JSON.parse(clean);
            }
        }

        return strategyJson;

    } catch (error) {
        console.error("❌ [GEMINI STRATEGY ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent, generateFullStrategy };