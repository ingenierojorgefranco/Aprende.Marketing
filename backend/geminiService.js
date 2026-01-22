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
    // 1. LOG DE INICIO DE PIPELINE
    process.stdout.write(`\n🚀 [PIPELINE START] Generación real (Etapa 1 IA) para Proyecto ID: ${projectId}\n`);

    if (!aiClient) throw new Error("Gemini API Key not configured.");

    // 2. LOG DE ACCESO A BASE DE DATOS
    process.stdout.write(`[PIPELINE DB] Consultando base de datos para ID: ${projectId}...\n`);
    const [rows] = await pool.query(
        "SELECT niche, product_name, brand_tone, full_price, commission_rate, lead_magnet_type, description FROM projects WHERE id = ?",
        [projectId]
    );

    if (rows.length === 0) {
        process.stdout.write(`❌ [PIPELINE ERROR] Proyecto ${projectId} no encontrado.\n`);
        throw new Error("Project not found in pipeline retrieval.");
    }
    
    const projectData = rows[0];
    const { niche, product_name: productName, brand_tone: brandTone, full_price: fullPrice, commission_rate: commissionRate } = projectData;

    let step1Data, step2Data, step3Web, step4Content, step5Emails, step6WhatsApp;

    // 3. GENERACIÓN REAL ETAPA 1 (IA)
    try {
        process.stdout.write(`⏳ [PIPELINE IA] Llamando a Gemini 3 Pro para Etapa 1: ${productName}...\n`);
        
        const step1Prompt = `Eres un Estratega Senior de Marketing Digital. Tu misión es generar el ADN de marketing y 3 perfiles de Avatar extremadamente detallados para el producto "${productName}" en el nicho "${niche}". Tono de marca: "${brandTone}".

        INSTRUCCIONES PARA LOS 3 AVATARES (OBLIGATORIO):
        Genera perfiles diferenciados y profundos para estos 3 tipos de cliente:
        1. AVATAR 1 (El Emprendedor Activo): Alguien con energía que busca escalar un negocio o empezar uno nuevo con decisión.
        2. AVATAR 2 (El Escéptico con Miedo): Alguien que ha tenido malas experiencias previas o tiene miedo a perder su inversión.
        3. AVATAR 3 (La Persona en Reinvención): Alguien estancado en un trabajo convencional que busca un cambio total de estilo de vida.
        
        Responde estrictamente en formato JSON con la siguiente estructura exacta:
        {
          "meta": {
            "projectName": "${productName}",
            "niche": "${niche}",
            "productType": "Digital Product",
            "objective": "Direct Sales",
            "price": ${fullPrice || 0},
            "commissionRate": ${commissionRate || 0},
            "projection": [0, 100, 200, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
            "insights": {
                "overview": { 
                    "title": "Estrategia General", 
                    "items": [
                        { "label": "Producto", "value": "${productName}", "icon": "BookOpen", "color": "text-pink-400", "bg": "bg-pink-500/10", "border": "border-pink-500/20" },
                        { "label": "Nicho", "value": "${niche}", "icon": "Sparkles", "color": "text-purple-400", "bg": "bg-purple-500/10", "border": "border-purple-500/20" }
                    ] 
                },
                "niche": { "title": "Análisis de Nicho", "description": "Análisis profundo del nicho generado por IA." },
                "product": { "title": "Rentabilidad", "description": "Evaluación del potencial de ingresos del producto." },
                "objective": { "title": "Método de Cierre", "description": "Embudo sugerido para maximizar ventas." }
            }
          },
          "avatars": [
            {
              "id": 1,
              "name": "Nombre Realista",
              "archetype": "Emprendedor Activo",
              "age": "Rango de edad",
              "quote": "Frase que define su mentalidad",
              "pain": "Dolor principal",
              "daily_manifestation": "Cómo experimenta el dolor en su día a día",
              "desire": "Deseo profundo",
              "emotional_reason": "Para qué emocional de su deseo",
              "objection": "Miedo principal al éxito o al fallo",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "motivations": { "dinero": 90, "tiempo": 80, "estatus": 70, "seguridad": 60 }
            },
            {
              "id": 2,
              "name": "Nombre Realista",
              "archetype": "Escéptico con Miedo",
              "age": "Rango de edad",
              "quote": "Frase de duda o desconfianza",
              "pain": "Dolor principal",
              "daily_manifestation": "Cómo experimenta el dolor en su día a día",
              "desire": "Deseo profundo",
              "emotional_reason": "Para qué emocional de su deseo",
              "objection": "Miedo al fraude o mala inversión",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "motivations": { "dinero": 70, "tiempo": 60, "estatus": 50, "seguridad": 95 }
            },
            {
              "id": 3,
              "name": "Nombre Realista",
              "archetype": "Persona buscando Reinvención",
              "age": "Rango de edad",
              "quote": "Frase de cansancio y esperanza",
              "pain": "Dolor principal",
              "daily_manifestation": "Cómo experimenta el dolor en su día a día",
              "desire": "Deseo profundo",
              "emotional_reason": "Para qué emocional de su deseo",
              "objection": "Miedo a empezar de cero",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "motivations": { "dinero": 80, "tiempo": 95, "estatus": 60, "seguridad": 70 }
            }
          ]
        }`;

        const step1Res = await generateContent('gemini-3-pro-preview', step1Prompt, { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 24000 }
        });

        if (!step1Res) throw new Error("Gemini devolvió vacío en Etapa 1");
        
        step1Data = JSON.parse(step1Res.trim());
        process.stdout.write(`✅ [PIPELINE IA] Etapa 1 finalizada con éxito para ${productName}.\n`);

    } catch (err) {
        process.stdout.write(`❌ [PIPELINE ERROR ETAPA 1 IA]: ${err.message}\n`);
        throw err;
    }

    // 4. DATOS DUMMY PARA ETAPAS 2-6 (PARA PRUEBAS)
    process.stdout.write(`[PIPELINE DEBUG] Inyectando datos estáticos para etapas 2 a 6...\n`);

    step2Data = {
        psychology: {
            pains: ["Falta de tiempo", "Escasez de clientes"],
            solutions: ["Sistema automático", "Copy persuasivo"],
            unique_mechanism: "Algoritmo IA v2.9",
            avoid: ["Promesas falsas"],
            awarenessStages: {
                stage1_pain: "Consciente del problema",
                stage2_solution: "Buscando solución",
                stage3_barrier: "Miedo a fallar"
            },
            buyingPsychology: {
                notBuyingReasons: [{ title: "Duda", description: "Miedo al riesgo" }],
                buyingReasons: [{ title: "Confianza", description: "Resultados probados" }],
                strategistConclusion: "Enfoque en autoridad y resultados rápidos."
            },
            conversionStrategy: {
                mainFocus: [{ label: "Emocional", description: "Conectar con el deseo de libertad" }],
                prioritizedChannels: [{ label: "WhatsApp", type: "WA" }],
                communicationStyle: [{ label: "Cercano", description: "Tono amigable" }],
                tacticalNote: "Priorizar el seguimiento 1 a 1."
            }
        }
    };

    step3Web = {
        landingPageTabs: {
            hero: { label: "1. Encabezado", type: "hero", h1: `Genera ${productName} hoy`, h2: "Sin complicaciones", strategyText: "Headline de curiosidad." },
            pain: { label: "2. Dolores", type: "pain", items: ["Dolor 1", "Dolor 2"], strategyText: "Agitación de dolores." },
            benefits: { label: "3. Beneficios", type: "benefits", items: [{ title: "Beneficio 1", desc: "Descripción" }], strategyText: "Presentación de cura." }
        },
        thankYouPageTabs: {
            header: { label: "1. Confirmación", type: "header", content: { h1: "¡Listo!", h2: "Bienvenido." }, strategyText: "Paz mental." },
            action: { label: "2. Siguiente Paso", type: "action", content: { h1: "Únete", h2: "Haz clic." }, strategyText: "Compromiso." },
            magnet: { label: "3. Regalo", type: "magnet", content: { h1: "Descarga", h2: "Guía lista." }, strategyText: "Valor." }
        }
    };

    step4Content = [
        { id: 1, title: "Articulo de prueba", keyword: "seo", searchVolume: "1K", objective: "Tráfico", strategy: "Educativo" }
    ];

    step5Emails = {
        nurture: [{ id: 1, day: "Día 0", subject: "Bienvenida", type: "Valor", objective: "Entrega", bodyPreview: "Hola..." }],
        evergreen: [{ id: 8, day: "Día 8", subject: "Oferta", type: "Venta", objective: "Cierre", bodyPreview: "Compra ahora..." }]
    };

    step6WhatsApp = [
        { id: 1, title: "Cierre WA", objective: "Venta", messages: [{ role: "agent", text: "Hola!" }] }
    ];

    try {
        // 5. CONSOLIDACIÓN FINAL
        process.stdout.write(`[PIPELINE DEBUG] Ensamblando JSON final...\n`);
        
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

        process.stdout.write(`✨ [PIPELINE COMPLETE] Retornando datos al cliente.\n`);
        return finalJson;

    } catch (error) {
        process.stdout.write(`❌ [PIPELINE CRITICAL ERROR]: ${error.message}\n`);
        throw error;
    }
};

module.exports = { generateContent, analyzeWebsiteContent, generateFullStrategy };