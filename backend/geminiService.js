
const { GoogleGenAI } = require("@google/genai");

// Según las directrices, la clave DEBE obtenerse exclusivamente de process.env.API_KEY
const apiKey = process.env.API_KEY;
let aiClient = null;

if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
} else {
    console.warn("⚠️ [GEMINI] No API_KEY found in environment variables.");
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
            // Se accede a .text directamente según las nuevas directrices
            return response.text || "";
        }
        
        return "";

    } catch (error) {
        console.error("❌ [GEMINI SERVICE ERROR]:", error);
        throw error;
    }
};

/**
 * Analiza el contenido crudo de una página de ventas y extrae un informe estratégico.
 */
const analyzeSalesPageContent = async (htmlText) => {
    if (!aiClient) throw new Error("Gemini API Key missing.");

    const prompt = `
    Actúa como un experto en Marketing de Afiliados y Copywriting de alta conversión.
    He extraído el siguiente texto de una página de ventas. Necesito que lo analices exhaustivamente y generes un informe detallado que sirva como descripción del proyecto.

    CONTENIDO EXTRAÍDO:
    ---
    ${htmlText.substring(0, 15000)}
    ---

    INSTRUCCIONES:
    Genera un informe estructurado que incluya:
    1. Resumen ejecutivo del producto (¿Qué es y para qué sirve?).
    2. Promesa principal (¿Cuál es la gran transformación que ofrece?).
    3. Perfil del Cliente Ideal (Edad, miedos, deseos).
    4. Estructura de la oferta (¿Qué incluye? Módulos, bonus, precio sugerido).
    5. Autoridad del Productor (¿Quién lo dicta y por qué es experto?).
    6. Gatillos mentales detectados (Escasez, urgencia, prueba social, etc.).

    Redacta el informe en ESPAÑOL, de forma persuasiva y profesional. Máximo 500 palabras.
    RESPONDE SOLO CON EL TEXTO DEL INFORME, sin saludos ni introducciones.
    `;

    try {
        const result = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return result.text || "No se pudo generar el análisis.";
    } catch (e) {
        console.error("[Gemini Analysis Error]", e);
        throw e;
    }
};

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
    Tu tarea es generar un "Informe Estratégico Maestro" extremadamente detallado en formato JSON puro.
    
    CONTEXTO DEL NEGOCIO:
    - Nombre del Proyecto: "${name}"
    - Nicho de Mercado: "${niche}"
    - Producto a vender: "${productName}"
    - Tono de Comunicación: "${brandTone}" (OBLIGATORIO: Redacta todos los textos en este estilo).
    - Descripción: "${description}"
    - Precio de Venta: $${fullPrice} USD
    - Comisión por Venta: $${netCommission.toFixed(2)} USD (Tasa: ${Math.round(commissionRate * 100)}%)
    - Regalo de Bienvenida (Lead Magnet): "${leadMagnetType}"
    ${salesPageUrl ? `- URL de referencia: ${salesPageUrl}` : ''}

    REGLAS TÉCNICAS CRÍTICAS:
    1. Respuesta: Devuelve EXCLUSIVAMENTE el JSON válido. Sin markdown.
    2. Comillas: ESCAPA comillas dobles DENTRO de los textos.
    3. Idioma: Español Neutro de alta conversión.
    4. Proyección: El campo 'projection' debe ser un array de 12 números (USD).

    ESTRUCTURA JSON REQUERIDA:
    {
      "meta": {
        "projectName": "${productName}",
        "niche": "${niche}",
        "price": ${fullPrice},
        "commissionRate": ${commissionRate},
        "projection": [12 números reales crecientes],
        "insights": {
            "overview": { 
                "title": "Estrategia Maestra", 
                "items": [
                    { "label": "Producto", "value": "${productName}", "icon": "BookOpen", "color": "text-pink-400", "border": "border-pink-500/20" },
                    { "label": "Nicho", "value": "${niche}", "icon": "Sparkles", "color": "text-purple-400", "border": "border-purple-500/20" },
                    { "label": "Estrategia", "value": "Embudo con ${leadMagnetType}", "icon": "MessageCircle", "color": "text-green-400", "border": "border-green-500/20" },
                    { "label": "Objetivo", "value": "Venta Directa", "icon": "Target", "color": "text-blue-400", "border": "border-blue-500/20" }
                ] 
            },
            "niche": { "title": "Análisis de Nicho", "description": "..." },
            "product": { "title": "Rentabilidad", "description": "..." },
            "objective": { "title": "Método de Cierre", "description": "..." }
        }
      },
      "avatars": [
          {
            "id": 1,
            "name": "Avatar Principal",
            "archetype": "Perfil Ideal",
            "age": "25-45",
            "quote": "...",
            "interests": "...",
            "behavior": "...",
            "desire": "...",
            "pain": "...",
            "objection": "...",
            "motivations": { "dinero": 80, "tiempo": 70, "estatus": 50, "seguridad": 90 }
          }
      ],
      "psychology": {
        "pains": ["Dolor 1", "Dolor 2"],
        "solutions": ["Solución 1", "Solución 2"],
        "awarenessStages": { "stage1_pain": "...", "stage2_solution": "...", "stage3_barrier": "..." },
        "buyingPsychology": { "notBuyingReasons": [], "buyingReasons": [], "strategistConclusion": "..." },
        "conversionStrategy": { "mainFocus": [], "prioritizedChannels": [], "communicationStyle": [], "tacticalNote": "..." },
        "psychographicProfile": { "ageRange": "...", "interests": "...", "primaryDesire": "...", "digitalBehavior": "...", "mainBarrier": "..." }
      },
      "modules": {
        "web": {
            "landingPageTabs": {
                "hero": { "label": "1. Encabezado", "title": "Promesa de Valor", "type": "hero", "h1": "...", "h2": "...", "strategyText": "..." },
                "pain": { "label": "2. Dolores", "title": "El Problema", "type": "pain", "items": [], "strategyText": "..." },
                "benefits": { "label": "3. Beneficios", "title": "La Oferta", "type": "benefits", "items": [], "strategyText": "..." }
            }
        },
        "content": [],
        "emails": { "nurture": [], "evergreen": [] },
        "whatsapp": []
      }
    }
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 32768 }
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

module.exports = { generateContent, generateFullStrategy, analyzeSalesPageContent };
