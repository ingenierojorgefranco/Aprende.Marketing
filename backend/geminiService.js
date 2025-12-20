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

    const { 
        name, niche, productName, mentorName, fullPrice, commissionRate,
        description, targetAudience, brandTone, leadMagnetType, communityChannel,
        keyPainPoint, keyTransformation, painPoints, keyBenefits 
    } = projectData;

    const netCommission = (fullPrice * (commissionRate / 100)).toFixed(2);

    const prompt = `
    Rol: Motor de Análisis Estratégico de Marketing Digital de Elite.
    Tarea: Generar un "Informe Estratégico Maestro" extremadamente detallado y realista en formato JSON.
    
    DATOS REALES DEL PROYECTO (USALOS OBLIGATORIAMENTE):
    - Nombre Proyecto: "${name}"
    - Producto: "${productName}"
    - Mentor/Experto: "${mentorName || 'No definido'}"
    - Precio Venta (PVP): "$${fullPrice} USD"
    - Comisión: "${commissionRate}%" (Ganancia neta: $${netCommission} USD)
    - Nicho: "${niche}"
    - Audiencia Base: "${targetAudience || 'General'}"
    - Tono de Marca: "${brandTone}"
    - Dolor Principal: "${keyPainPoint}"
    - Transformación: "${keyTransformation}"
    - Lead Magnet (Gancho): "${leadMagnetType}"
    - Canal de Comunidad: "${communityChannel}"

    INSTRUCCIONES ESTRATÉGICAS:
    1. Expande el análisis basándote en estos datos REALES. 
    2. En el bloque de 'product', menciona específicamente el precio de $${fullPrice} y la ganancia de $${netCommission}.
    3. En el bloque de 'blueprint', adapta los pasos al Canal de Comunidad (${communityChannel}) y al Lead Magnet (${leadMagnetType}).
    4. Crea 3 avatares psicológicos que coincidan con la Audiencia Base y el Tono de Marca definido.

    ESTRUCTURA JSON REQUERIDA (NO AÑADAS TEXTO FUERA DEL JSON):
    {
      "meta": {
          "projectName": "${productName}",
          "createdAt": "${new Date().toLocaleDateString()}",
          "niche": "${niche}",
          "productType": "Infoproducto / Servicio",
          "objective": "Venta Directa con ${leadMagnetType}",
          "insights": {
              "overview": { 
                  "title": "Visión Estratégica", 
                  "items": [
                      { "label": "Producto", "value": "${productName}", "icon": "BookOpen", "color": "text-pink-400", "bg": "bg-pink-500/10", "border": "border-pink-500/20" },
                      { "label": "Mentor", "value": "${mentorName}", "icon": "Users", "color": "text-blue-400", "bg": "bg-blue-500/10", "border": "border-blue-500/20" },
                      { "label": "Estrategia", "value": "Embudo de ${leadMagnetType} + ${communityChannel}", "icon": "MessageCircle", "color": "text-green-400", "bg": "bg-green-500/10", "border": "border-green-500/20" }
                  ] 
              },
              "niche": { "title": "Potencial del Nicho: ${niche}", "description": "Análisis profundo de por qué este nicho es rentable..." },
              "product": { "title": "Análisis de Rentabilidad", "description": "Venderás a $${fullPrice}. Tu ganancia neta es de $${netCommission}..." },
              "objective": { "title": "Hoja de Ruta", "description": "Cómo escalaremos este producto usando ${brandTone}..." }
          }
      },
      "avatars": [
        {
          "id": 1,
          "name": "Nombre ficticio",
          "archetype": "Perfil",
          "age": "Rango",
          "quote": "Frase que diría",
          "pain": "Su mayor miedo",
          "desire": "Su mayor deseo",
          "objection": "Por qué no compraría",
          "motivations": { "dinero": 0, "tiempo": 0, "estatus": 0, "seguridad": 0 }
        }
      ],
      "psychology": {
        "pains": ["Dolor 1", "Dolor 2", "Dolor 3", "Dolor 4"],
        "solutions": ["Solución 1", "Solución 2", "Solución 3", "Solución 4"],
        "powerWords": ["Palabra 1", "Palabra 2"]
      },
      "modules": {
        "web": {
            "landingPageTabs": {
                "hero": { "label": "Encabezado", "title": "Hero Section", "h1": "Titular con <b>...</b>", "h2": "Subtítulo", "strategyText": "Explicación lógica" },
                "pain": { "label": "Dolores", "items": ["..."], "strategyText": "..." },
                "benefits": { "label": "Beneficios", "items": [{ "title": "...", "desc": "..." }], "strategyText": "..." }
            },
            "thankYouPageTabs": {
                "header": { "content": { "h1": "...", "h2": "..." }, "strategyText": "..." },
                "action": { "content": { "h1": "Unirse a ${communityChannel}", "h2": "..." }, "strategyText": "..." },
                "magnet": { "content": { "h1": "Descarga tu ${leadMagnetType}", "h2": "..." }, "strategyText": "..." }
            }
        },
        "content": [
            { "id": 1, "title": "...", "traffic": 80, "difficulty": 30, "keyword": "...", "objective": "...", "strategy": "..." }
        ],
        "emails": {
            "nurture": [ { "id": 1, "day": "Día 0", "subject": "...", "type": "...", "objective": "...", "bodyPreview": "..." } ],
            "evergreen": [ { "id": 8, "day": "Día 8", "subject": "...", "type": "...", "objective": "...", "bodyPreview": "..." } ]
        },
        "whatsapp": [
            { "id": 1, "title": "👋 Saludo", "objective": "...", "messages": [ { "role": "agent", "text": "..." } ] }
        ]
      }
    }
    
    Responde SOLO en JSON válido. Usa un tono persuasivo y profesional.
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
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