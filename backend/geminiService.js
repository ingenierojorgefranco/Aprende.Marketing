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
    Tu objetivo es realizar un análisis exhaustivo y profesional de una página de ventas para extraer su ADN estratégico.
    
    INSTRUCCIONES DE REDACCIÓN:
    1. TONO: Usa un lenguaje natural, persuasivo, cercano y muy fácil de comprender. Evita tecnicismos innecesarios. El texto debe ser descriptivo tanto para un usuario como para una inteligencia artificial que lo usará como contexto.
    2. PROHIBICIÓN DE HTML: Está terminantemente PROHIBIDO el uso de etiquetas HTML (como <b>, <ul>, <li>, <br>). Utiliza únicamente texto plano y saltos de línea (\n).
    3. ESTRUCTURA DE LA "DESCRIPTION":
       - Empieza con una introducción detallada y completa acerca del producto, su propósito y su gran promesa de transformación.
       - Luego, genera una lista de ítems en forma de bullet points usando el guion (-) seguido de un espacio.
       - Incluye TODO lo que el sistema pueda extraer de la web: propuesta de valor, pilares del temario, autoridad del mentor, metodología, bonos, soporte, comunidad, garantía, certificación y cualquier otro detalle relevante. Extrae el máximo valor posible del texto.

    TEXTO EXTRAÍDO DEL SITIO:
    ${rawText.substring(0, 15000)}

    Responde EXCLUSIVAMENTE en formato JSON válido:
    {
      "productName": "Nombre comercial del producto",
      "description": "[Introducción aquí]\n\n- [Punto extraído 1]\n- [Punto extraído 2]\n...",
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
    4. Proyección: El campo 'projection' debe ser un array de 12 números (USD) representando los ingresos netos esperados por mes (mes 1 a 12), es normal esperar que los primeros 3 meses no se generen ingresos, pero luego se espera que haya un incremento de 1 a 3 o 4 ventas mensuales, las cuales pueden fluctuar segun tu consideracion en los meses, sin embargo la idea es que en el mes 12 la persona pueda estar generando mas de 1500 dolares mensuales. Sé realista (curva de aprendizaje y luego escalado).

    ESTRUCTURA JSON REQUERIDA (OBLIGATORIA):
    {
      "meta": {
        "projectName": "${productName}",
        "niche": "${niche}",
        "price": ${fullPrice},
        "commissionRate": ${commissionRate},
        "projection": [12 numbers starting small and growing],
        "insights": {
            "overview": { 
                "title": "Estrategia para vender en automático", 
                "items": [
                    { "label": "Producto", "value": "${productName}", "icon": "BookOpen", "color": "text-pink-400", "border": "border-pink-500/20" },
                    { "label": "Nicho", "value": "${niche}", "icon": "Sparkles", "color": "text-purple-400", "border": "border-purple-500/20" },
                    { "label": "Estrategia", "value": "Embudo con ${leadMagnetType}", "icon": "MessageCircle", "color": "text-green-400", "border": "border-green-500/20" },
                    { "label": "Objetivo", "value": "Venta Directa de Alto Impacto", "icon": "Target", "color": "text-blue-400", "border": "border-blue-500/20" }
                ] 
            },
            "niche": { "title": "Análisis de Nicho", "description": "..." },
            "product": { "title": "Rentabilidad", "description": "Tu ganancia de $${netCommission.toFixed(2)} permite un margen de inversión de hasta..." },
            "objective": { "title": "Método de Cierre", "description": "..." }
        }
      },
      "avatars": [
          {
            "id": 1,
            "name": "Avatar Principal",
            "archetype": "Perfil de compra masiva",
            "age": "25-45 años",
            "quote": "...",
            "interests": "...",
            "behavior": "Instagram y WhatsApp",
            "desire": "...",
            "pain": "...",
            "objection": "...",
            "motivations": { "dinero": 85, "tiempo": 70, "estatus": 50, "seguridad": 90 }
          },
          { "id": 2, "name": "Avatar Secundario (Escéptico)", "archetype": "...", "age": "...", "quote": "...", "interests": "...", "behavior": "...", "desire": "...", "pain": "...", "objection": "...", "motivations": { "dinero": 95, "tiempo": 60, "estatus": 70, "seguridad": 80 } },
          { "id": 3, "name": "Avatar Terciario (Aspiracional)", "archetype": "...", "age": "...", "quote": "...", "interests": "...", "behavior": "...", "desire": "...", "pain": "...", "objection": "...", "motivations": { "dinero": 70, "tiempo": 100, "estatus": 50, "seguridad": 90 } }
      ],
      "psychology": {
        "pains": ["Dolor 1", "Dolor 2", "Dolor 3", "Dolor 4"],
        "solutions": ["Solución 1", "Solución 2", "Solución 3", "Solución 4"],
        "awarenessStages": { 
            "stage1_pain": "Consciente del problema pero no de la solución...", 
            "stage2_solution": "Busca cursos pero no sabe cuál elegir...", 
            "stage3_barrier": "Miedo a perder su dinero o no tener tiempo..." 
        },
        "buyingPsychology": { 
           "notBuyingReasons": [ { "title": "...", "description": "..." } ],
           "buyingReasons": [ { "title": "...", "description": "..." } ],
           "strategistConclusion": "Estrategia final para el cierre..."
        },
        "conversionStrategy": {
           "mainFocus": [ { "label": "Eje Central", "description": "..." } ],
           "prioritizedChannels": [ { "label": "Landing Page", "type": "LP" }, { "label": "WhatsApp CRM", "type": "WA" } ],
           "communicationStyle": [ { "label": "Tono", "description": "${brandTone}" } ],
           "tacticalNote": "..."
        },
        "psychographicProfile": {
            "ageRange": "...",
            "interests": "...",
            "primaryDesire": "...",
            "digitalBehavior": "...",
            "mainBarrier": "..."
        }
      },
      "modules": {
        "web": {
            "landingPageTabs": {
                "hero": { "label": "1. Encabezado", "title": "Promesa de Valor", "type": "hero", "h1": "...", "h2": "...", "strategyText": "..." },
                "pain": { "label": "2. Dolores", "title": "Identificación del Problema", "type": "pain", "items": ["...", "..."], "strategyText": "..." },
                "benefits": { "label": "3. Beneficios", "title": "Oferta Irresistible", "type": "benefits", "items": [{ "title": "...", "desc": "..." }], "strategyText": "..." }
            },
            "thankYouPageTabs": {
                "header": { "label": "1. Confirmación", "title": "Mensaje de Éxito", "type": "header", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." },
                "action": { "label": "2. Siguiente Paso", "title": "Redirección", "type": "action", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." },
                "magnet": { "label": "3. Regalo", "title": "Lead Magnet", "type": "magnet", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." }
            }
        },
        "content": [ 
            { "id": 1, "title": "...", "keyword": "...", "difficulty": 25, "strategy": "..." },
            { "id": 2, "title": "...", "keyword": "...", "difficulty": 40, "strategy": "..." }
        ],
        "emails": {
           "nurture": [ 
                { "day": "Día 0", "subject": "...", "objective": "...", "type": "Bienvenida", "bodyPreview": "..." },
                { "day": "Día 1", "subject": "...", "objective": "...", "type": "Valor", "bodyPreview": "..." },
                { "day": "Día 3", "subject": "...", "objective": "...", "type": "Prueba Social", "bodyPreview": "..." },
                { "day": "Día 5", "subject": "...", "objective": "...", "type": "Escasez", "bodyPreview": "..." },
                { "day": "Día 7", "subject": "...", "objective": "...", "type": "Cierre", "bodyPreview": "..." }
           ],
           "evergreen": [ 
                { "day": "Día 8", "subject": "...", "objective": "...", "type": "Autoridad", "bodyPreview": "..." } 
           ]
        },
        "whatsapp": [ 
            { "id": 1, "title": "Cierre por WhatsApp", "objective": "Resolver dudas y enviar checkout", "messages": [ { "role": "agent", "text": "..." }, { "role": "user", "text": "..." } ] } 
        ]
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