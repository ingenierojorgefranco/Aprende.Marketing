
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

/**
 * Analiza el contenido de un sitio web para extraer una Auditoría Estratégica Estructurada
 */
const analyzeWebsiteContent = async (rawText) => {
    if (!aiClient) throw new Error("Gemini API Key not configured.");

    if (!rawText || rawText.trim().length < 200) {
        throw new Error("El contenido extraído del sitio web es insuficiente para un análisis de marketing profesional.");
    }

    const prompt = `
    Actúa como un experto Analista de Marketing y Copywriter Senior.
    Te proporcionaré el texto extraído de una página de ventas (Landing Page).
    Tu tarea es realizar una "Auditoría Estratégica Estructurada" extremadamente profesional.

    Extrae y organiza la información en los siguientes puntos clave:
    1. Propuesta Única de Valor (USP): Qué hace diferente al producto.
    2. Ejes del Temario (Pilares Técnicos): Qué aprenderá el alumno.
    3. Autoridad y Respaldo: Quién es el experto o academia.
    4. Metodología de Aprendizaje: Formato de las clases, acceso, materiales.
    5. Transformación y Resultados: Qué logrará el estudiante al finalizar.
    6. Factores de Rentabilidad: Por qué es una buena oportunidad de negocio.

    REGLA CRÍTICA: El campo "description" DEBE ser un objeto JSON con un array de "sections". 
    Cada sección debe tener un "title" y un array de "bullets" (mínimo 3-4 viñetas por sección).

    TEXTO EXTRAÍDO:
    ${rawText.substring(0, 15000)}

    Responde EXCLUSIVAMENTE en formato JSON válido:
    {
      "productName": "Nombre del Producto",
      "niche": "Nicho identificado",
      "description": {
         "sections": [
            { "title": "Propuesta Única de Valor", "bullets": ["...", "...", "..."] },
            { "title": "Ejes del Programa", "bullets": ["...", "...", "..."] },
            { "title": "Metodología y Acceso", "bullets": ["...", "...", "..."] },
            { "title": "Transformación Garantizada", "bullets": ["...", "...", "..."] }
         ]
      }
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
    - Tono de Comunicación: "${brandTone}"
    - Descripción: "${description}"
    - Precio de Venta: $${fullPrice} USD
    - Comisión por Venta: $${netCommission.toFixed(2)} USD
    - Regalo de Bienvenida (Lead Magnet): "${leadMagnetType}"

    REGLAS TÉCNICAS:
    1. Respuesta: JSON válido. Sin markdown.
    2. Proyección: Array de 12 números (USD) ingresos netos.

    ESTRUCTURA JSON REQUERIDA:
    {
      "meta": {
        "projectName": "${productName}",
        "niche": "${niche}",
        "price": ${fullPrice},
        "commissionRate": ${commissionRate},
        "projection": [12 numbers],
        "insights": {
            "overview": { 
                "title": "Estrategia de Ventas", 
                "items": [
                    { "label": "Producto", "value": "${productName}", "icon": "BookOpen", "color": "text-pink-400", "border": "border-pink-500/20" },
                    { "label": "Nicho", "value": "${niche}", "icon": "Sparkles", "color": "text-purple-400", "border": "border-purple-500/20" },
                    { "label": "Estrategia", "value": "Embudo con ${leadMagnetType}", "icon": "MessageCircle", "color": "text-green-400", "border": "border-green-500/20" },
                    { "label": "Objetivo", "value": "Conversión Máxima", "icon": "Target", "color": "text-blue-400", "border": "border-blue-500/20" }
                ] 
            },
            "niche": { "title": "Análisis de Nicho", "description": "..." },
            "product": { "title": "Rentabilidad", "description": "..." },
            "objective": { "title": "Método de Cierre", "description": "..." }
        }
      },
      "avatars": [...],
      "psychology": {...},
      "modules": {...}
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
        return JSON.parse(response.text.trim());

    } catch (error) {
        console.error("❌ [GEMINI STRATEGY MASTER ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent, analyzeWebsiteContent, generateFullStrategy };
