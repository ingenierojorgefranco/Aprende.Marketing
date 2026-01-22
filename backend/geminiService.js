const { GoogleGenAI } = require("@google/genai");
const pool = require('./db');

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
} else {
    console.warn("⚠️ [GEMINI] No GEMINI_API_KEY found in environment variables.");
}

/**
 * Helper para limpiar y reparar respuestas JSON de la IA (comas finales, bloques markdown, etc)
 */
const cleanAIPromptResponse = (text) => {
    if (!text) return "";
    let cleaned = text.trim();
    // Remover bloques de código markdown si existen
    cleaned = cleaned.replace(/^```json/g, "").replace(/```$/g, "").trim();
    // Reparar comas finales antes de cierres de array o llave (error común de la IA)
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
    return cleaned;
};

/**
 * Configuración de seguridad relajada para evitar bloqueos por contenido de marketing o palabras clave sensibles
 */
const safetySettings = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
];

/**
 * Función auxiliar para gestionar reintentos automáticos ante errores de saturación (503/504)
 */
const withRetries = async (fn, maxRetries = 3) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const isRetryable = error.message?.includes('503') || 
                                error.message?.includes('504') || 
                                error.message?.toLowerCase().includes('overloaded') ||
                                error.message?.toLowerCase().includes('deadline exceeded');
            
            if (isRetryable && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
                process.stdout.write(`[GEMINI RETRY] Intento ${i + 1} fallido. Reintentando...\n`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
    throw lastError;
};

/**
 * Genera contenido usando Google Gemini con manejo de errores mejorado y settings de seguridad relajados
 */
const generateContent = async (model, contents, config = {}) => {
    if (!aiClient) {
        throw new Error("Gemini API Key not configured on server.");
    }

    try {
        return await withRetries(async () => {
            const response = await aiClient.models.generateContent({
                model: model || 'gemini-3-flash-preview',
                contents: contents,
                config: {
                    ...config,
                    safetySettings: safetySettings
                }
            });

            if (!response) throw new Error("IA no respondió.");

            try {
                if (response.text) return response.text;
            } catch (textErr) {
                const reason = response.candidates?.[0]?.finishReason || "UNKNOWN";
                process.stdout.write(`[GEMINI BLOCKED] Razón: ${reason}\n`);
                throw new Error(`La IA bloqueó la respuesta por seguridad (${reason}). Intenta con otra URL o texto.`);
            }
            
            return "";
        });
    } catch (error) {
        console.error("❌ [GEMINI SERVICE ERROR]:", error);
        throw error;
    }
};

/**
 * Analiza el contenido de un sitio web para extraer estrategia
 */
const analyzeWebsiteContent = async (rawText) => {
    if (!aiClient) throw new Error("Gemini API Key not configured.");

    if (!rawText || rawText.trim().length < 150) {
        throw new Error("El contenido extraído del sitio web es insuficiente para un análisis profesional.");
    }

    const prompt = `
    Actúa como un experto en Ingeniería Inversa de Marketing y Copywriting Senior. Tu misión es desglosar por completo una página de ventas.
    
    REGLA DE ORO DE VERACIDAD (CRÍTICA): 
    - Analiza el "TEXTO EXTRAÍDO DEL SITIO" al final de este prompt.
    - Si el texto parece ser un mensaje de error o está vacío, RESPONDE: {"productName": "ERROR", "description": "ERROR_ACCESO_DENEGADO", "niche": "ERROR"}.
    
    Instrucciones si el texto es válido:
    - Extrae el contenido sin inventar datos. Usa HTML básico en "description".
    - Estructura: Introducción, Objetivos, Propuesta de valor, Beneficios, Temario, Perfil Autoridad, Entregables.
        
    Responde EXCLUSIVAMENTE en formato JSON:
    {
      "productName": "Nombre del producto",
      "description": "Informe estratégico en HTML",
      "niche": "Nicho de mercado"
    }

    TEXTO EXTRAÍDO DEL SITIO:
    ${rawText.substring(0, 8000)}
    `;

    try {
        return await withRetries(async () => {
            const response = await aiClient.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { 
                    responseMimeType: "application/json",
                    safetySettings: safetySettings
                }
            });

            let textResponse = "";
            try {
                textResponse = cleanAIPromptResponse(response.text);
                process.stdout.write(`[GEMINI RAW ANALYZE] Fragmento: ${textResponse.substring(0, 100)}...\n`);
            } catch (e) {
                const reason = response.candidates?.[0]?.finishReason || "UNKNOWN";
                throw new Error(`Análisis bloqueado por la IA (${reason}).`);
            }

            if (!textResponse) throw new Error("IA returned empty response");
            const result = JSON.parse(textResponse);
            if (result.description === "ERROR_ACCESO_DENEGADO") throw new Error("Acceso denegado a la web.");

            return result;
        });
    } catch (error) {
        console.error("❌ [GEMINI ANALYZE ERROR]:", error);
        throw error;
    }
};

/**
 * Función Maestra: Pipeline de Generación Fraccionada en 7 Etapas
 */
const generateFullStrategy = async (projectId) => {
    if (!aiClient) throw new Error("Gemini API Key not configured.");

    process.stdout.write(`🚀 [PIPELINE START] Proyecto ID: ${projectId}\n`);

    const [rows] = await pool.query(
        "SELECT niche, product_name, brand_tone, lead_magnet_type FROM projects WHERE id = ?",
        [projectId]
    );

    if (rows.length === 0) throw new Error("Project not found.");
    
    const projectData = rows[0];
    const startTime = Date.now();
    const { niche, product_name: productName, brand_tone: brandTone, lead_magnet_type: leadMagnetType } = projectData;

    let step1Data, step2Data, step3Web, step4Content, step5Nurture, step6Evergreen, step7WhatsApp;

    try {
        // ETAPA 1: ADN y Avatares
        process.stdout.write("⏳ [STEP 1] Avatares...\n");
        const s1Prompt = `Estratega Senior. Genera 3 Avatares detallados para "${productName}" en nicho "${niche}". Tono: "${brandTone}". JSON con meta y avatars.`;
        const s1Res = await generateContent('gemini-3-pro-preview', s1Prompt, { responseMimeType: "application/json" });
        step1Data = JSON.parse(cleanAIPromptResponse(s1Res));

        // ETAPA 2: Psicología de Venta
        process.stdout.write("⏳ [STEP 2] Psicología...\n");
        const s2Prompt = `Genera psicología profunda para "${productName}" basada en: ${JSON.stringify(step1Data.avatars)}. JSON con key "psychology".`;
        const s2Res = await generateContent('gemini-3-pro-preview', s2Prompt, { responseMimeType: "application/json" });
        step2Data = JSON.parse(cleanAIPromptResponse(s2Res));

        // ETAPA 3: Web System
        process.stdout.write("⏳ [STEP 3] Web...\n");
        const s3Prompt = `Estructura Landing y Thank You Page para "${productName}". Lead Magnet: "${leadMagnetType}". Contexto: ${JSON.stringify(step2Data.psychology)}. JSON con key "web".`;
        const s3Res = await generateContent('gemini-3-pro-preview', s3Prompt, { responseMimeType: "application/json" });
        step3Web = JSON.parse(cleanAIPromptResponse(s3Res)).web;

        // ETAPA 4: Content Strategy
        process.stdout.write("⏳ [STEP 4] Artículos SEO...\n");
        const s4Prompt = `Genera 10 títulos de artículos SEO para "${productName}". Nicho: "${niche}". JSON con key "content".`;
        const s4Res = await generateContent('gemini-3-pro-preview', s4Prompt, { responseMimeType: "application/json" });
        step4Content = JSON.parse(cleanAIPromptResponse(s4Res)).content;

        // ETAPA 5: Nutrición (Nurture Emails) - SEPARADO
        process.stdout.write("⏳ [STEP 5] Nutrición (7 correos)...\n");
        const s5Prompt = `Genera secuencia de 7 correos de Nutrición (Día 0 al 6) para "${productName}". Avatar: ${JSON.stringify(step1Data.avatars[0])}. JSON con llave "nurture" (array).`;
        const s5Res = await generateContent('gemini-3-pro-preview', s5Prompt, { responseMimeType: "application/json" });
        step5Nurture = JSON.parse(cleanAIPromptResponse(s5Res)).nurture;

        // ETAPA 6: Evergreen (30 Days Emails) - SEPARADO
        process.stdout.write("⏳ [STEP 6] Evergreen Emails...\n");
        const s6Prompt = `Genera 1 correo Evergreen de alto valor para "${productName}". JSON con llave "evergreen" (array).`;
        const s6Res = await generateContent('gemini-3-pro-preview', s6Prompt, { responseMimeType: "application/json" });
        step6Evergreen = JSON.parse(cleanAIPromptResponse(s6Res)).evergreen;

        // ETAPA 7: WhatsApp Scripts
        process.stdout.write("⏳ [STEP 7] WhatsApp Scripts...\n");
        const s7Prompt = `Guiones de cierre WhatsApp para "${productName}". JSON con key "whatsapp".`;
        const s7Res = await generateContent('gemini-3-pro-preview', s7Prompt, { responseMimeType: "application/json" });
        step7WhatsApp = JSON.parse(cleanAIPromptResponse(s7Res)).whatsapp;

        const finalJson = { 
            meta: step1Data.meta,
            avatars: step1Data.avatars,
            psychology: step2Data.psychology, 
            modules: { 
                web: { landingPageTabs: step3Web.landingPageTabs, thankYouPageTabs: step3Web.thankYouPageTabs },
                content: step4Content,
                emails: { nurture: step5Nurture, evergreen: step6Evergreen },
                whatsapp: step7WhatsApp
            } 
        };

        process.stdout.write(`✨ [PIPELINE COMPLETE] Tiempo: ${(Date.now() - startTime) / 1000}s\n`);
        return finalJson;

    } catch (error) {
        process.stdout.write(`❌ [PIPELINE CRITICAL ERROR]: ${error.message}\n`);
        throw error;
    }
};

module.exports = { generateContent, analyzeWebsiteContent, generateFullStrategy };