
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

    if (!rawText || rawText.trim().length < 200) {
        throw new Error("El contenido extraído del sitio web es insuficiente para un análisis de marketing profesional.");
    }

    const prompt = `
    Actúa como un experto en Marketing Digital y Copywriting Senior. 
    Tu objetivo es realizar un análisis exhaustivo y profesional de una página de ventas para extraer su ADN estratégico.
    
    Responde EXCLUSIVAMENTE en formato JSON válido:
    {
      "productName": "Nombre comercial del producto",
      "description": "Código HTML estructural detallado aquí (CON H3, P, UL, LI)...",
      "niche": "Nicho o categoría de mercado"
    }

    TEXTO EXTRAÍDO DEL SITIO:
    ${rawText.substring(0, 15000)}
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
 * Función Maestra: Pipeline de Generación Fraccionada
 * Optimiza la velocidad y evita timeouts dividiendo el proceso en 3 etapas orquestadas.
 */
const generateFullStrategy = async (projectData) => {
    if (!aiClient) throw new Error("Gemini API Key not configured.");

    const startTime = Date.now();
    console.log(`[PIPELINE] Iniciando generación modular para: ${projectData.productName}`);

    const { 
        name, niche, productName, description, 
        brandTone, fullPrice, commissionRate, 
        leadMagnetType 
    } = projectData;

    const netCommission = fullPrice * commissionRate;

    try {
        // --- ETAPA 1: ADN ESTRATÉGICO Y AVATARES ---
        // Modelo Pro para razonamiento de perfiles
        console.log("[PIPELINE] Etapa 1: Generando ADN y Avatares...");
        const step1Prompt = `
        Actúa como Estratega Senior. Genera el ADN y 3 Avatares para vender "${productName}".
        Nicho: "${niche}". Tono: "${brandTone}".
        Responde EXCLUSIVAMENTE JSON con esta estructura:
        {
          "meta": {
            "projectName": "${productName}",
            "shortDescription": "Resumen persuasivo de 180 car.",
            "niche": "${niche}",
            "price": ${fullPrice},
            "commissionRate": ${commissionRate},
            "projection": [12 números progresivos hasta $2000],
            "insights": {
                "overview": { "title": "Estrategia", "items": [{ "label": "...", "value": "...", "icon": "BookOpen", "color": "text-pink-400" }] },
                "niche": { "title": "Nicho", "description": "..." },
                "product": { "title": "Ganancia", "description": "..." },
                "objective": { "title": "Meta", "description": "..." }
            }
          },
          "avatars": [
              { "id": 1, "name": "...", "archetype": "...", "age": "...", "quote": "...", "pain": "...", "daily_manifestation": "...", "desire": "...", "emotional_reason": "...", "objection": "...", "motivations": { "dinero": 80, "tiempo": 70, "estatus": 50, "seguridad": 90 } }
          ]
        }`;

        const step1Res = await aiClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: step1Prompt,
            config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 8000 } }
        });
        const step1Data = JSON.parse(step1Res.text.trim());

        // --- ETAPA 2: PSICOLOGÍA Y CONVERSIÓN ---
        // Modelo Pro para análisis conductual
        console.log("[PIPELINE] Etapa 2: Analizando Psicología de Venta...");
        const step2Prompt = `
        Basado en estos avatares: ${JSON.stringify(step1Data.avatars)}.
        Genera la psicología de venta y mecanismo único para "${productName}".
        Responde EXCLUSIVAMENTE JSON con esta estructura:
        {
          "psychology": {
            "pains": ["Exactamente 7 dolores emocionales"],
            "solutions": ["7 soluciones espejo"],
            "unique_mechanism": "Nombre y descripción del método único",
            "avoid": ["4 palabras prohibidas"],
            "awarenessStages": { "stage1_pain": "...", "stage2_solution": "...", "stage3_barrier": "..." },
            "buyingPsychology": { 
               "notBuyingReasons": [ { "title": "...", "description": "...", "detail": "..." } ],
               "buyingReasons": [ { "title": "...", "description": "..." } ],
               "strategistConclusion": "..."
            },
            "conversionStrategy": {
               "mainFocus": [ { "label": "...", "description": "..." } ],
               "prioritizedChannels": [ { "label": "...", "type": "LP" } ],
               "communicationStyle": [ { "label": "...", "description": "..." } ],
               "tacticalNote": "..."
            }
          }
        }`;

        const step2Res = await aiClient.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: step2Prompt,
            config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 6000 } }
        });
        const step2Data = JSON.parse(step2Res.text.trim());

        // --- ETAPA 3: ACTIVOS DE MARKETING (COPIES Y WEB) ---
        // Modelo Flash para redacción rápida de alto volumen
        console.log("[PIPELINE] Etapa 3: Redactando Activos y Blueprint...");
        const step3Prompt = `
        Genera los activos finales para "${productName}".
        Contexto Psicológico: ${JSON.stringify(step2Data.psychology)}.
        Lead Magnet: "${leadMagnetType}". Tono: "${brandTone}".
        Responde EXCLUSIVAMENTE JSON con esta estructura:
        {
          "modules": {
            "web": {
                "landingPageTabs": {
                    "hero": { "label": "1. Hero", "title": "Promesa", "type": "hero", "h1": "Título persuasivo con <b>", "h2": "Subtítulo", "strategyText": "..." },
                    "pain": { "label": "2. Dolores", "title": "Problema", "type": "pain", "items": ["7 dolores"], "strategyText": "..." },
                    "benefits": { "label": "3. Beneficios", "title": "Oferta", "type": "benefits", "items": [{ "title": "...", "desc": "..." }], "strategyText": "..." }
                },
                "thankYouPageTabs": {
                    "header": { "label": "1. Éxito", "title": "Gracias", "type": "header", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." },
                    "action": { "label": "2. WhatsApp", "title": "Grupo", "type": "action", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." },
                    "magnet": { "label": "3. Regalo", "title": "Descarga", "type": "magnet", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." }
                }
            },
            "content": [ { "id": 1, "title": "Título SEO", "keyword": "Palabra clave", "strategy": "Enfoque" } ],
            "emails": {
               "nurture": [ { "day": "Día 0", "subject": "...", "type": "Valor", "objective": "...", "bodyPreview": "..." } ]
            },
            "whatsapp": [ { "id": 1, "title": "Bienvenida", "objective": "...", "messages": [ { "role": "agent", "text": "..." } ] } ]
          }
        }`;

        const step3Res = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: step3Prompt,
            config: { responseMimeType: "application/json" }
        });
        const step3Data = JSON.parse(step3Res.text.trim());

        // --- ENSAMBLAJE FINAL ---
        const finalJson = {
            ...step1Data,
            ...step2Data,
            modules: step3Data.modules
        };

        const duration = (Date.now() - startTime) / 1000;
        console.log(`[PIPELINE] Generación completada con éxito en ${duration}s`);
        return finalJson;

    } catch (error) {
        console.error("❌ [PIPELINE ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent, analyzeWebsiteContent, generateFullStrategy };
