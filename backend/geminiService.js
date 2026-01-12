
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

/* */ /* Actualización: Enriquecimiento del prompt de análisis para extraer Transformación, Temario, Bonos, Instructor y FAQ con estructura HTML - 24/05/2024 19:15 */
/**
 * Analiza el contenido de un sitio web para extraer estrategia
 */
const analyzeWebsiteContent = async (rawText) => {
    if (!aiClient) throw new Error("Gemini API Key not configured.");

    // Validation Guard: Ensure we have actual text to analyze
    if (!rawText || rawText.trim().length < 200) {
        throw new Error("El contenido extraído del sitio web es insuficiente para un análisis de marketing profesional.");
    }

    const prompt = `
    Actúa como un experto en Marketing Digital y Copywriting Senior. 
    Tu objetivo es realizar un análisis exhaustivo y profesional de una página de ventas para extraer su ADN estratégico y construir una descripción maestra completa.
    
    INSTRUCCIONES DE REDACCIÓN:
    1. TONO: Usa un lenguaje natural, persuasivo, cercano y muy fácil de comprender. Evita tecnicismos innecesarios. El texto debe ser descriptivo tanto para un usuario como para una inteligencia artificial que lo usará como contexto.
    2. FORMATO HTML ESTRUCTURAL (REGLAS ESTRICTAS): 
       - Es OBLIGATORIO que el campo "description" contenga código HTML limpio para estructurar la información. 
       - UTILIZA EXCLUSIVAMENTE: <h3>, <p>, <ul>, <li>, <strong>, <em>.
       - PROHIBIDO EL USO DE: etiquetas <span>, etiquetas <div> con estilos, o CUALQUIER atributo "style".
       - PROHIBIDO el uso de CSS en línea o atributos de tamaño de fuente (font-size).
       - NO uses etiquetas <html>, <body> ni <h1>.
    3. ESTRUCTURA REQUERIDA DE LA "DESCRIPTION" (Extrae y expande cada punto si la información existe):
       - INTRODUCCIÓN DE TRANSFORMACIÓN: Un párrafo enfocado en el cambio real, propósito y la promesa de transformación que ofrece el producto.
       - PROPUESTA DE VALOR ÚNICA: Qué hace diferente a este producto.
       - PILARES DEL TEMARIO: Lista detallada de los módulos o lecciones principales.
       - METODOLOGÍA Y FORMATO: Detalles sobre si es online, HD, acceso de por vida, etc.
       - AUTORIDAD Y MENTORÍA: Información detallada sobre el instructor o profesor, su nombre y experiencia.
       - BONOS DE ALTO VALOR: Identifica y lista todos los regalos o extras incluidos.
       - GARANTÍA Y CONFIANZA: Términos de satisfacción, devoluciones y certificaciones.
       - PREGUNTAS FRECUENTES (FAQ): Recopila las dudas comunes respondidas en el sitio.

    TEXTO EXTRAÍDO DEL SITIO:
    ${rawText.substring(0, 15000)}

    Responde EXCLUSIVAMENTE en formato JSON válido:
    {
      "productName": "Nombre comercial del producto",
      "description": "Código HTML estructural detallado aquí (CON H3, P, UL, LI)...",
      "niche": "Nicho o categoría de mercado"
    }
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        if (!response.text) throw new Error("IA returned empty response");
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("❌ [GEMINI ANALYZE ERROR]:", error);
        throw error;
    }
};

/* */ /* Actualización: Mejora del prompt maestro para generateFullStrategy, solicitando campos de profundidad psicológica: manifestación diaria, razón emocional, mecanismo único, lista de términos prohibidos y matriz de objeciones multinivel - 15/06/2024 19:20 */
/**
 * Genera el Informe Estratégico Maestro completo (JSON 100% funcional)
 */
const generateFullStrategy = async (projectData) => {
    if (!aiClient) {
        throw new Error("Gemini API Key not configured on server.");
    }

    const { 
        name, niche, productName, description, 
        brandTone, fullPrice, commissionRate, 
        leadMagnetType, salesPageUrl 
    } = projectData;

    const netCommission = fullPrice * commissionRate;

    const prompt = `
    Actúa como un Director de Marketing y Estratega Senior de Lanzamientos Digitales.
    Tu tarea es generar un "Informe Estratégico Maestro" extremadamente detallado en formato JSON puro para vender el producto "${productName}".
    
    CONTEXTO DEL NEGOCIO:
    - Nombre del Proyecto: "${name}"
    - Nicho de Mercado: "${niche}"
    - Tono de Comunicación: "${brandTone}" (OBLIGATORIO: Redacta todos los textos en este estilo).
    - Descripción: "${description}"
    - Precio de Venta: $${fullPrice} USD
    - Comisión por Venta: $${netCommission.toFixed(2)} USD
    - Regalo de Bienvenida (Lead Magnet): "${leadMagnetType}"

    REGLAS DE COPYWRITING AVANZADO (DIAMANTES DE CONVERSIÓN):
    1. Manifestación Diaria (daily_manifestation): Describe CÓMO se ve el dolor del avatar en su rutina diaria (ej: el estrés de ver el buzón lleno de facturas sin pagar).
    2. Razón Emocional (emotional_reason): Cuál es el verdadero "para qué" profundo del deseo (ej: no es solo ganar dinero, es dejar de sentirse inferior ante su familia).
    3. Mecanismo Único (unique_mechanism): Inventa o identifica un concepto exclusivo para este producto que explique por qué funciona diferente a los demás (ej: El Sistema CEJAS-PRO 360).
    4. Matriz de Objeciones: Define razones por las que NO comprarían, incluyendo una descripción corta para chat y un "detail" más largo para FAQ.
    5. Regrules 'Avoid': Identifica 4 palabras o frases cliché que la IA DEBE EVITAR para sonar profesional and diferente a la competencia.

    REGLAS TÉCNICAS:
    - Devuelve EXCLUSIVAMENTE el JSON válido. Sin markdown.
    - Puntos de Dolor: Exactamente 6 profundos y emocionales.
    - Proyección: 12 números creciendo progresivamente hasta superar los $1000 en el mes 12.

    ESTRUCTURA JSON REQUERIDA (OBLIGATORIA):
    {
      "meta": {
        "projectName": "${productName}",
        "shortDescription": "*/ Actualización: Genera un resumen de máximo 180 caracteres sin HTML ni markdown, altamente persuasivo para ser mostrado en una tarjeta de interfaz - 24/06/2024 16:20",
        "niche": "${niche}",
        "price": ${fullPrice},
        "commissionRate": ${commissionRate},
        "projection": [12 numbers],
        "insights": {
            "overview": { "title": "...", "items": [{ "label": "...", "value": "...", "icon": "...", "color": "...", "border": "..." }] },
            "niche": { "title": "...", "description": "..." },
            "product": { "title": "...", "description": "..." },
            "objective": { "title": "...", "description": "..." }
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
            "daily_manifestation": "Desripción vívida del dolor en el día a día...",
            "desire": "...",
            "emotional_reason": "El para qué profundo y emocional...",
            "objection": "...",
            "motivations": { "dinero": 85, "tiempo": 70, "estatus": 50, "seguridad": 90 }
          }
      ],
      "psychology": {
        "pains": ["..."],
        "solutions": ["..."],
        "powerWords": ["..."],
        "unique_mechanism": "Nombre y breve descripción del método único...",
        "avoid": ["palabra1", "palabra2", "frase3"],
        "awarenessStages": { "stage1_pain": "...", "stage2_solution": "...", "stage3_barrier": "..." },
        "buyingPsychology": { 
           "notBuyingReasons": [ { "title": "...", "description": "...", "detail": "Explicación detallada para FAQ..." } ],
           "buyingReasons": [ { "title": "...", "description": "..." } ],
           "strategistConclusion": "..."
        },
        "conversionStrategy": {
           "mainFocus": [ { "label": "...", "description": "..." } ],
           "prioritizedChannels": [ { "label": "...", "type": "..." } ],
           "communicationStyle": [ { "label": "...", "description": "..." } ],
           "tacticalNote": "..."
        }
      },
      "modules": {
        "web": {
            "landingPageTabs": {
                "hero": { "label": "1. Encabezado", "title": "Promesa", "type": "hero", "h1": "...", "h2": "...", "strategyText": "..." },
                "pain": { "label": "2. Dolores", "title": "Problema", "type": "pain", "items": ["..."], "strategyText": "..." },
                "benefits": { "label": "3. Beneficios", "title": "Oferta", "type": "benefits", "items": [{ "title": "...", "desc": "..." }], "strategyText": "..." }
            },
            "thankYouPageTabs": {
                "header": { "label": "1. Éxito", "title": "...", "type": "header", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." }
            }
        },
        "content": [ { "id": 1, "title": "...", "keyword": "...", "difficulty": 25, "strategy": "..." } ],
        "emails": {
           "nurture": [ { "day": "Día 0", "subject": "...", "objective": "...", "type": "...", "bodyPreview": "..." } ]
        },
        "whatsapp": [ { "id": 1, "title": "...", "objective": "...", "messages": [ { "role": "agent", "text": "..." } ] } ]
      }
    }
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 24576 }
            }
        });

        if (!response.text) throw new Error("IA returned empty response");

        let strategyJson = JSON.parse(response.text.trim());
        return strategyJson;

    } catch (error) {
        console.error("❌ [GEMINI STRATEGY MASTER ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent, analyzeWebsiteContent, generateFullStrategy };
