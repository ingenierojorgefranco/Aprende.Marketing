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
                console.log(`[GEMINI RETRY] Intento ${i + 1} fallido (Overloaded). Reintentando en ${Math.round(delay)}ms...`);
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

            // Si response.text falla, buscamos la razón del bloqueo
            try {
                if (response.text) return response.text;
            } catch (textErr) {
                const reason = response.candidates?.[0]?.finishReason || "UNKNOWN";
                console.error(`[GEMINI BLOCKED] Razón: ${reason}`);
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
    - Si el texto parece ser un message de error (ej: '403 Forbidden', 'Access Denied', 'Cloudflare') o está vacío, DEBES RESPONDER EXACTAMENTE: {"productName": "ERROR", "description": "ERROR_ACCESO_DENEGADO", "niche": "ERROR"}.
    - No intentes adivinar ni inventar información si la web está bloqueada.
    
    Instrucciones si el texto es válido:
    - Extrae de forma exhaustiva el contenido sin inventar ningun dato.
    - Usa HTML básico (H3, P, UL, LI) en el campo "description".

    usa la siguiente estructura:

    1. Introducción del Producto donde explicas brevemente el producto.
    2. Objetivos del Producto.
    3. Propuesta de valor y promesa irresistible principal.
    4. Desglose detallado de Beneficios Racionales (lo que obtiene) y Beneficios Emocionales (cómo se sentirá).
    5. Temario del Curso (En caso de existir): temas que incluye el curso.
    6. Perfil de Autoridad del Mentor/Instructor (En caso de existir): Nombre y cualquier tipo de informacion del instructor.
    7. Entregables y Bonos Detallados (En caso de existir): Analiza todos los bonos que se mencionen en el contenido, añade cada bono y una pequeña descripcion.
        
    Responde EXCLUSIVAMENTE en formato JSON válido:
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
                textResponse = response.text;
                // LOG DE DIAGNÓSTICO: Ver qué devuelve Gemini antes de parsear
                process.stdout.write(`[GEMINI RAW ANALYZE] Fragmento: ${textResponse.substring(0, 100)}...\n`);
            } catch (e) {
                const reason = response.candidates?.[0]?.finishReason || "UNKNOWN";
                throw new Error(`Análisis bloqueado por la IA (${reason}). Es posible que la web contenga términos que activan filtros de seguridad.`);
            }

            if (!textResponse) throw new Error("IA returned empty response");
            
            const result = JSON.parse(textResponse.trim());
            
            if (result.description === "ERROR_ACCESO_DENEGADO" || result.productName === "ERROR") {
                throw new Error("No se pudo extraer contenido real. La web podría estar protegida contra bots.");
            }

            return result;
        });
    } catch (error) {
        console.error("❌ [GEMINI ANALYZE ERROR]:", error);
        throw error;
    }
};

/**
 * Función Maestra: Pipeline de Generación Fraccionada en 6 Etapas
 */
const generateFullStrategy = async (projectId) => {
    if (!aiClient) throw new Error("Gemini API Key not configured.");

    // Log inmediato al entrar a la función de servicio
    process.stdout.write(`🚀 [PIPELINE START] Solicitud de datos iniciales para Proyecto ID: ${projectId} - ${new Date().toISOString()}\n`);

    process.stdout.write(`[PIPELINE DB] Intentando consulta SELECT bajo demanda para ID: ${projectId}\n`);
    // Carga de datos bajo demanda para minimizar carga en memoria del router
    const [rows] = await pool.query(
        "SELECT niche, product_name, brand_tone, full_price, commission_rate, lead_magnet_type, description FROM projects WHERE id = ?",
        [projectId]
    );
    process.stdout.write(`[PIPELINE DB] Datos recuperados con éxito de la BD para ID: ${projectId}.\n`);

    if (rows.length === 0) {
        console.error(`[PIPELINE ERROR] Proyecto ${projectId} no encontrado en la base de datos.`);
        throw new Error("Project not found in pipeline retrieval.");
    }
    
    const projectData = rows[0];
    const startTime = Date.now();
    const { niche, product_name: productName, brand_tone: brandTone, full_price: fullPrice, commission_rate: commissionRate, lead_magnet_type: leadMagnetType } = projectData;

    let step1Data, step2Data, step3Web, step4Content, step5Emails, step6WhatsApp;

    process.stdout.write(`🚀 [PIPELINE EXECUTION] Iniciando motores de IA para el producto: ${productName}\n`);

    try {
        // ETAPA 1: ADN y Avatares
        try {
            process.stdout.write("⏳ [PIPELINE] Generando Etapa 1: ADN y Avatares...\n");
            const step1Prompt = `Eres un Estratega Senior. Genera el ADN de marketing y 3 Avatares detallados para el producto "${productName}" en el nicho "${niche}". Tono de marca: "${brandTone}". 
            
            Responde estrictamente en formato JSON con la siguiente estructura:
            {
              "meta": { "projectName": "string", "niche": "string", "productType": "string", "objective": "string", "price": number, "commissionRate": number, "projection": [number] },
              "avatars": [ { "id": number, "name": "string", "archetype": "string", "age": "string", "quote": "string", "pain": "string", "daily_manifestation": "string", "desire": "string", "emotional_reason": "string", "objection": "string", "motivations": { "dinero": number, "tiempo": number, "estatus": number, "seguridad": number } } ]
            }`;

            console.log("DEBUG PROMPT ETAPA 1:", step1Prompt);
            
            const step1Res = await generateContent('gemini-3-pro-preview', step1Prompt, { 
                responseMimeType: "application/json"
            });
            if (!step1Res) throw new Error("La etapa 1 devolvió una respuesta vacía.");
            step1Data = JSON.parse(step1Res.trim());
            process.stdout.write("✅ [PIPELINE] Etapa 1 (Avatares) finalizada con éxito\n");
        } catch (err) {
            console.error("❌ [PIPELINE ERROR ETAPA 1]:", err);
            throw new Error(`Error en Etapa 1 (Avatares): ${err.message}`);
        }

        // ETAPA 2: Psicología de Venta
        try {
            process.stdout.write("⏳ [PIPELINE] Generando Etapa 2: Psicología de Venta...\n");
            const step2Prompt = `Genera la psicología profunda de venta para "${productName}" basándote en estos avatares: ${JSON.stringify(step1Data.avatars)}. 
            
            Instrucciones: Identifica miedos, soluciones, el mecanismo único y la estrategia de canales.
            Responde estrictamente en formato JSON con la llave "psychology":
            {
              "psychology": {
                "pains": ["string"],
                "solutions": ["string"],
                "unique_mechanism": "string",
                "avoid": ["string"],
                "awarenessStages": { "stage1_pain": "string", "stage2_solution": "string", "stage3_barrier": "string" },
                "buyingPsychology": { 
                    "notBuyingReasons": [ { "title": "string", "description": "string", "detail": "string" } ],
                    "buyingReasons": [ { "title": "string", "description": "string" } ],
                    "strategistConclusion": "string"
                },
                "conversionStrategy": {
                    "mainFocus": [ { "label": "string", "description": "string" } ],
                    "prioritizedChannels": [ { "label": "string", "type": "string" } ],
                    "communicationStyle": [ { "label": "string", "description": "string" } ],
                    "tacticalNote": "string"
                }
              }
            }`;

            console.log("DEBUG PROMPT ETAPA 2:", step2Prompt);
            
            const step2Res = await generateContent('gemini-3-pro-preview', step2Prompt, { 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 16384 }
            });
            if (!step2Res) throw new Error("La etapa 2 devolvió una respuesta vacía.");
            step2Data = JSON.parse(step2Res.trim());
            process.stdout.write("✅ [PIPELINE] Etapa 2 (Psicología) finalizada con éxito\n");
        } catch (err) {
            console.error("❌ [PIPELINE ERROR ETAPA 2]:", err);
            throw new Error(`Error en Etapa 2 (Psicología): ${err.message}`);
        }

        // ETAPA 3: Web System
        try {
            process.stdout.write("⏳ [PIPELINE] Generando Etapa 3: Web System...\n");
            const step3Prompt = `Genera la estructura de la Landing Page y Thank You Page para "${productName}". 
            Contexto psicológico: ${JSON.stringify(step2Data.psychology)}. Lead Magnet: "${leadMagnetType}".
            
            Responde estrictamente en formato JSON con la llave "web":
            {
              "web": {
                "landingPageTabs": {
                   "hero": { "label": "1. Encabezado", "type": "hero", "h1": "string", "h2": "string", "strategyText": "string" },
                   "pain": { "label": "2. Dolores", "type": "pain", "items": ["string"], "strategyText": "string" },
                   "benefits": { "label": "3. Beneficios", "type": "benefits", "items": [ { "title": "string", "desc": "string" } ], "strategyText": "string" }
                },
                "thankYouPageTabs": {
                   "header": { "label": "1. Confirmación", "type": "header", "content": { "h1": "string", "h2": "string" }, "strategyText": "string" },
                   "action": { "label": "2. Siguiente Paso", "type": "action", "content": { "h1": "string", "h2": "string" }, "strategyText": "string" },
                   "magnet": { "label": "3. Regalo", "type": "magnet", "content": { "h1": "string", "h2": "string" }, "strategyText": "string" }
                }
              }
            }`;

            console.log("DEBUG PROMPT ETAPA 3:", step3Prompt);
            
            const step3Res = await generateContent('gemini-3-pro-preview', step3Prompt, { 
                responseMimeType: "application/json" 
            });
            if (!step3Res) throw new Error("La etapa 3 devolvió una respuesta vacía.");
            step3Web = JSON.parse(step3Res.trim()).web;
            process.stdout.write("✅ [PIPELINE] Etapa 3 (Web) finalizada con éxito\n");
        } catch (err) {
            console.error("❌ [PIPELINE ERROR ETAPA 3]:", err);
            throw new Error(`Error en Etapa 3 (Web): ${err.message}`);
        }

        // ETAPA 4: Content Strategy
        try {
            process.stdout.write("⏳ [PIPELINE] Generando Etapa 4: Content Strategy...\n");
            const step4Prompt = `Genera una lista de 10 artículos SEO para "${productName}". 
            Nicho: "${niche}". Contexto: ${JSON.stringify(step2Data.psychology.conversionStrategy)}.
            
            Responde estrictamente en formato JSON con la llave "content":
            {
              "content": [
                { "id": number, "title": "string", "keyword": "string", "searchVolume": "string", "objective": "string", "strategy": "string" }
              ]
            }`;

            console.log("DEBUG PROMPT ETAPA 4:", step4Prompt);
            
            const step4Res = await generateContent('gemini-3-pro-preview', step4Prompt, { 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 16384 }
            });
            if (!step4Res) throw new Error("La etapa 4 devolvió una respuesta vacía.");
            step4Content = JSON.parse(step4Res.trim()).content;
            process.stdout.write("✅ [PIPELINE] Etapa 4 (Contenido SEO) finalizada con éxito\n");
        } catch (err) {
            console.error("❌ [PIPELINE ERROR ETAPA 4]:", err);
            throw new Error(`Error en Etapa 4 (Contenido): ${err.message}`);
        }

        // ETAPA 5: Email Marketing
        try {
            process.stdout.write("⏳ [PIPELINE] Generando Etapa 5: Email Marketing...\n");
            const step5Prompt = `Genera la secuencia de 7 correos (Nurture) and 1 correo Evergreen para "${productName}". 
            Avatar Principal: ${JSON.stringify(step1Data.avatars[0])}.
            
            Responde estrictamente en formato JSON con la llave "emails":
            {
              "emails": {
                "nurture": [ { "id": number, "day": "Día X", "subject": "string", "type": "string", "objective": "string", "bodyPreview": "string" } ],
                "evergreen": [ { "id": number, "day": "Día 8+", "subject": "string", "type": "string", "objective": "string", "bodyPreview": "string" } ]
              }
            }`;

            console.log("DEBUG PROMPT ETAPA 5:", step5Prompt);
            
            const step5Res = await generateContent('gemini-3-pro-preview', step5Prompt, { 
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 16384 }
            });
            if (!step5Res) throw new Error("La etapa 5 devolvió una respuesta vacía.");
            step5Emails = JSON.parse(step5Res.trim()).emails;
            process.stdout.write("✅ [PIPELINE] Etapa 5 (Emails) finalizada con éxito\n");
        } catch (err) {
            console.error("❌ [PIPELINE ERROR ETAPA 5]:", err);
            throw new Error(`Error en Etapa 5 (Emails): ${err.message}`);
        }

        // ETAPA 6: WhatsApp Scripts
        try {
            process.stdout.write("⏳ [PIPELINE] Generando Etapa 6: WhatsApp Scripts...\n");
            const step6Prompt = `Genera los guiones de cierre por WhatsApp para "${productName}".
            Contexto: ${JSON.stringify(step2Data.psychology.buyingPsychology)}.
            
            Responde estrictamente en formato JSON con la llave "whatsapp":
            {
              "whatsapp": [
                { "id": number, "title": "string", "objective": "string", "messages": [ { "role": "agent|user", "text": "string" } ] }
              ]
            }`;

            console.log("DEBUG PROMPT ETAPA 6:", step6Prompt);
            
            const step6Res = await generateContent('gemini-3-pro-preview', step6Prompt, { 
                responseMimeType: "application/json" 
            });
            if (!step6Res) throw new Error("La etapa 6 devolvió una respuesta vacía.");
            step6WhatsApp = JSON.parse(step6Res.trim()).whatsapp;
            process.stdout.write("✅ [PIPELINE] Etapa 6 (WhatsApp Scripts) finalizada con éxito\n");
        } catch (err) {
            console.error("❌ [PIPELINE ERROR ETAPA 6]:", err);
            throw new Error(`Error en Etapa 6 (WhatsApp): ${err.message}`);
        }

        // Consolidación final
        const finalJson = { 
            meta: step1Data.meta,
            avatars: step1Data.avatars,
            psychology: step2Data.psychology, 
            modules: { 
                web: {
                    landingPageTabs: step3Web.landingPageTabs,
                    thankYouPageTabs: step3Web.thankYouPageTabs
                },
                content: step4Content,
                emails: step5Emails,
                whatsapp: step6WhatsApp
            } 
        };

        process.stdout.write(`✨ [PIPELINE COMPLETE] Estrategia generada exitosamente en ${(Date.now() - startTime) / 1000}s\n`);
        return finalJson;

    } catch (error) {
        console.error("❌ [PIPELINE CRITICAL ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent, analyzeWebsiteContent, generateFullStrategy };