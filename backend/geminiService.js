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
    process.stdout.write(`\n🚀 [PIPELINE DEBUG] Iniciando pipeline de prueba para Proyecto ID: ${projectId}\n`);

    if (!aiClient) throw new Error("Gemini API Key not configured.");

    // 2. LOG DE ACCESO A BASE DE DATOS
    process.stdout.write(`[PIPELINE DEBUG] Consultando base de datos para ID: ${projectId}...\n`);
    const [rows] = await pool.query(
        "SELECT niche, product_name, brand_tone, full_price, commission_rate, lead_magnet_type, description FROM projects WHERE id = ?",
        [projectId]
    );

    if (rows.length === 0) {
        process.stdout.write(`❌ [PIPELINE DEBUG] ERROR: Proyecto ${projectId} no encontrado.\n`);
        throw new Error("Project not found in pipeline retrieval.");
    }
    
    const projectData = rows[0];
    process.stdout.write(`[PIPELINE DEBUG] Datos recuperados de BD: ${JSON.stringify(projectData)}\n`);

    const { niche, product_name: productName, brand_tone: brandTone, full_price: fullPrice, commission_rate: commissionRate } = projectData;

    let step1Data, step2Data, step3Web, step4Content, step5Emails, step6WhatsApp;

    // 3. INYECCIÓN DE DATOS DUMMY (SALTANDO IA)
    process.stdout.write(`[PIPELINE DEBUG] Saltando llamadas a IA e inyectando datos estáticos de prueba...\n`);

    step1Data = {
        meta: {
            projectName: productName,
            niche: niche,
            productType: "Digital Product",
            objective: "Direct Sales",
            price: fullPrice || 0,
            commissionRate: commissionRate || 0,
            projection: [0, 100, 200, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
            insights: {
                overview: { 
                    title: "Estrategia General", 
                    items: [
                        { label: "Producto", value: productName, icon: "BookOpen", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
                        { label: "Nicho", value: niche, icon: "Sparkles", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
                    ] 
                },
                niche: { title: "Análisis de Nicho", description: `Análisis para el nicho ${niche}.` },
                product: { title: "Rentabilidad", description: "Producto con alta rentabilidad estimada." },
                objective: { title: "Método de Cierre", description: "Cierre automático mediante embudo de ventas." }
            }
        },
        avatars: [
            {
                id: 1,
                name: "Avatar de Prueba",
                archetype: "Emprendedor Digital",
                age: "25-45 años",
                quote: "Necesito escalar mis resultados con IA.",
                pain: "Falta de ventas constantes y procesos manuales lentos.",
                daily_manifestation: "Frustración al revisar el panel de ventas cada mañana.",
                desire: "Automatizar su negocio para tener libertad.",
                emotional_reason: "Sentirse exitoso y proveer a su familia.",
                objection: "No tengo tiempo para aprender cosas técnicas.",
                interests: "Marketing, Tecnología",
                behavior: "Activo en redes sociales",
                motivations: { dinero: 80, tiempo: 95, estatus: 60, seguridad: 75 }
            }
        ]
    };

    step2Data = {
        psychology: {
            pains: ["Miedo al fracaso", "Pérdida de dinero en anuncios"],
            solutions: ["Sistema validado", "Copywriting de alta conversión"],
            unique_mechanism: "Algoritmo de IA Propietario",
            avoid: ["Promesas de riqueza rápida"],
            awarenessStages: {
                stage1_pain: "Sabe que necesita un cambio",
                stage2_solution: "Conoce la automatización",
                stage3_barrier: "Miedo a la inversión"
            },
            buyingPsychology: {
                notBuyingReasons: [{ title: "Costo", description: "Duda sobre el ROI inicial" }],
                buyingReasons: [{ title: "Escalabilidad", description: "Potencial de crecimiento ilimitado" }],
                strategistConclusion: "Enfocar el mensaje en la simplicidad y el retorno rápido."
            },
            conversionStrategy: {
                mainFocus: [{ label: "Emocional", description: "Conectar con el deseo de libertad" }],
                prioritizedChannels: [{ label: "WhatsApp", type: "WA" }],
                communicationStyle: [{ label: "Profesional", description: "Tono serio y experto" }],
                tacticalNote: "Usar testimonios en cada fase del cierre."
            }
        }
    };

    step3Web = {
        landingPageTabs: {
            hero: { label: "1. Encabezado", type: "hero", h1: `Domina ${productName} con IA`, h2: "La solución definitiva", strategyText: "Headline directo al beneficio principal." },
            pain: { label: "2. Dolores", type: "pain", items: ["Dolor 1", "Dolor 2"], strategyText: "Agitación de dolores específicos." },
            benefits: { label: "3. Beneficios", type: "benefits", items: [{ title: "Beneficio 1", desc: "Descripción del beneficio" }], strategyText: "Presentación de la cura." }
        },
        thankYouPageTabs: {
            header: { label: "1. Confirmación", type: "header", content: { h1: "¡Bienvenido!", h2: "Registro completado con éxito." }, strategyText: "Paz mental inmediata." },
            action: { label: "2. Siguiente Paso", type: "action", content: { h1: "Únete a la Comunidad", h2: "Haz clic en el botón de abajo." }, strategyText: "Micro-compromiso." },
            magnet: { label: "3. Regalo", type: "magnet", content: { h1: "Descarga tu Guía", h2: "El PDF está listo." }, strategyText: "Entrega de valor." }
        }
    };

    step4Content = [
        { id: 1, title: "Cómo escalar tu negocio", keyword: "negocio digital", searchVolume: "5K", objective: "Atracción", strategy: "Contenido SEO de valor" }
    ];

    step5Emails = {
        nurture: [{ id: 1, day: "Día 0", subject: "Bienvenida", type: "Valor", objective: "Entrega", bodyPreview: "Hola, aquí tienes lo prometido..." }],
        evergreen: [{ id: 8, day: "Día 8", subject: "Oferta", type: "Venta", objective: "Cierre", bodyPreview: "No dejes pasar esta oportunidad..." }]
    };

    step6WhatsApp = [
        { id: 1, title: "Cierre de Venta", objective: "Cierre", messages: [{ role: "agent", text: "¡Hola! ¿Tienes alguna duda con el pago?" }] }
    ];

    process.stdout.write(`[PIPELINE DEBUG] Datos Dummy inyectados correctamente.\n`);

    try {
        // 4. LOG DE CONSOLIDACIÓN
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

        process.stdout.write(`[PIPELINE DEBUG] JSON Ensamblado: ${JSON.stringify(finalJson).substring(0, 200)}...\n`);
        process.stdout.write(`✨ [PIPELINE DEBUG COMPLETE] Retornando datos al cliente con éxito.\n`);

        return finalJson;

    } catch (error) {
        process.stdout.write(`❌ [PIPELINE DEBUG ERROR CRÍTICO]: ${error.message}\n`);
        console.error(error);
        throw error;
    }
};

module.exports = { generateContent, analyzeWebsiteContent, generateFullStrategy };