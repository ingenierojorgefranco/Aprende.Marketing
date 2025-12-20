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
        name, niche, productName, mentorName, fullPrice, commissionAmount, commissionRate,
        description, targetAudience, brandTone, leadMagnetType, communityChannel,
        keyPainPoint, keyTransformation, painPoints, keyBenefits 
    } = projectData;

    const prompt = `
    Actúa como un Director de Estrategia de Marketing Digital de élite.
    Tu tarea es generar una "Estrategia Maestra" completa en formato JSON para un nuevo proyecto de infoproducto.

    DATOS DEL PROYECTO:
    - Nombre Proyecto: "${name}"
    - Producto: "${productName}"
    - Mentor: "${mentorName || 'Experto en el área'}"
    - Precio Venta: "$${fullPrice} USD"
    - Ganancia Neta: "$${commissionAmount} USD" (${commissionRate}%)
    - Nicho: "${niche}"
    - Audiencia Base: "${targetAudience || 'Personas interesadas en mejorar sus ingresos/vida'}"
    - Tono de Marca: "${brandTone}"
    - Dolor Principal: "${keyPainPoint}"
    - Transformación Prometida: "${keyTransformation}"
    - Lead Magnet: "${leadMagnetType}"
    - Canal de Comunidad: "${communityChannel}"

    REQUISITOS DEL JSON (DEBES COMPLETAR TODO):
    1. 'meta': Análisis profundo del potencial del nicho y rentabilidad.
    2. 'avatars': 3 avatares psicológicos (Atracción, Autoridad, Cierre).
    3. 'psychology': 4 dolores agudos y 4 soluciones estratégicas que conecten con los gatillos mentales.
    4. 'modules.web': Estructura de textos persuasivos para Landing Page (Hero, Pain, Benefits) y Thank You Page.
    5. 'modules.content': PLAN DE 5 ARTÍCULOS SEO detallados con keyword y estrategia.
    6. 'modules.emails.nurture': SECUENCIA DE 7 DÍAS (Día 0 al 6) con asuntos y lógica de venta.
    7. 'modules.emails.evergreen': SECUENCIA DE 30 DÍAS (Hitos: Día 8, 9, 10, 29, 30) educativa y de autoridad.
    8. 'modules.whatsapp': 4 SCRIPTS DE WHATSAPP (Apertura, Oferta, Objeciones, Post-Venta).

    FORMATO JSON ESTRICTO:
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
                      { "label": "Nicho", "value": "${niche}", "icon": "Sparkles", "color": "text-purple-400", "bg": "bg-purple-500/10", "border": "border-purple-500/20" },
                      { "label": "Público Objetivo", "value": "${targetAudience}", "icon": "Users", "color": "text-blue-400", "bg": "bg-blue-500/10", "border": "border-blue-500/20" },
                      { "label": "Estrategia", "value": "Embudo de ${leadMagnetType} + ${communityChannel}", "icon": "MessageCircle", "color": "text-green-400", "bg": "bg-green-500/10", "border": "border-green-500/20" },
                      { "label": "Objetivo del Sistema", "value": "Generar leads cualificados y convertirlos en ventas de forma conversacional", "icon": "Target", "color": "text-yellow-400", "bg": "bg-yellow-500/10", "border": "border-yellow-500/20" }
                  ] 
              },
              "niche": { "title": "Potencial del Nicho", "description": "..." },
              "product": { "title": "Análisis de Rentabilidad", "description": "Venderás a $${fullPrice}. Tu ganancia neta es de $${commissionAmount}..." },
              "objective": { "title": "Hoja de Ruta", "description": "..." }
          }
      },
      "avatars": [
        { "id": 1, "name": "...", "archetype": "...", "age": "...", "quote": "...", "pain": "...", "desire": "...", "objection": "...", "motivations": { "dinero": 80, "tiempo": 70, "estatus": 60, "seguridad": 90 } },
        { "id": 2, "name": "...", "archetype": "...", "age": "...", "quote": "...", "pain": "...", "desire": "...", "objection": "...", "motivations": { "dinero": 50, "tiempo": 90, "estatus": 40, "seguridad": 70 } },
        { "id": 3, "name": "...", "archetype": "...", "age": "...", "quote": "...", "pain": "...", "desire": "...", "objection": "...", "motivations": { "dinero": 90, "tiempo": 40, "estatus": 85, "seguridad": 60 } }
      ],
      "psychology": {
        "pains": ["Dolor 1", "Dolor 2", "Dolor 3", "Dolor 4"],
        "solutions": ["Solución 1", "Solución 2", "Solución 3", "Solución 4"],
        "powerWords": ["...", "..."]
      },
      "modules": {
        "web": {
            "landingPageTabs": {
                "hero": { "label": "1. Encabezado", "title": "Hero Section", "h1": "...", "h2": "...", "strategyText": "..." },
                "pain": { "label": "2. Dolores", "title": "Identificación", "items": ["...", "...", "...", "...", "..."], "strategyText": "..." },
                "benefits": { "label": "3. Beneficios", "title": "Oferta", "items": [{ "title": "...", "desc": "..." }, { "title": "...", "desc": "..." }, { "title": "...", "desc": "..." }, { "title": "...", "desc": "..." }], "strategyText": "..." }
            },
            "thankYouPageTabs": {
                "header": { "label": "1. Confirmación", "title": "Éxito", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." },
                "action": { "label": "2. Siguiente Paso", "title": "Redirección", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." },
                "magnet": { "label": "3. Lead Magnet", "title": "Regalo", "content": { "h1": "...", "h2": "..." }, "strategyText": "..." }
            }
        },
        "content": [
            { "id": 1, "title": "...", "traffic": 80, "difficulty": 30, "keyword": "...", "objective": "...", "strategy": "..." },
            { "id": 2, "title": "...", "traffic": 70, "difficulty": 40, "keyword": "...", "objective": "...", "strategy": "..." },
            { "id": 3, "title": "...", "traffic": 90, "difficulty": 50, "keyword": "...", "objective": "...", "strategy": "..." },
            { "id": 4, "title": "...", "traffic": 60, "difficulty": 20, "keyword": "...", "objective": "...", "strategy": "..." },
            { "id": 5, "title": "...", "traffic": 85, "difficulty": 45, "keyword": "...", "objective": "...", "strategy": "..." }
        ],
        "emails": {
            "nurture": [
                { "id": 1, "day": "Día 0", "subject": "...", "type": "Entrega", "objective": "...", "bodyPreview": "..." },
                { "id": 2, "day": "Día 1", "subject": "...", "type": "Adoctrinamiento", "objective": "...", "bodyPreview": "..." },
                { "id": 3, "day": "Día 2", "subject": "...", "type": "Agitación", "objective": "...", "bodyPreview": "..." },
                { "id": 4, "day": "Día 3", "subject": "...", "type": "Venta", "objective": "...", "bodyPreview": "..." },
                { "id": 5, "day": "Día 4", "subject": "...", "type": "Recordatorio", "objective": "...", "bodyPreview": "..." },
                { "id": 6, "day": "Día 5", "subject": "...", "type": "Prueba Social", "objective": "...", "bodyPreview": "..." },
                { "id": 7, "day": "Día 6", "subject": "...", "type": "Oportunidad", "objective": "...", "bodyPreview": "..." }
            ],
            "evergreen": [
                { "id": 8, "day": "Día 8", "subject": "...", "type": "Educativo", "objective": "...", "bodyPreview": "..." },
                { "id": 9, "day": "Día 9", "subject": "...", "type": "Recurso", "objective": "...", "bodyPreview": "..." },
                { "id": 10, "day": "Día 10", "subject": "...", "type": "Empatía", "objective": "...", "bodyPreview": "..." },
                { "id": 29, "day": "Día 29", "subject": "...", "type": "Tendencia", "objective": "...", "bodyPreview": "..." },
                { "id": 30, "day": "Día 30", "subject": "...", "type": "Motivación", "objective": "...", "bodyPreview": "..." }
            ]
        },
        "whatsapp": [
            { "id": 1, "title": "👋 Apertura", "objective": "...", "messages": [{ "role": "agent", "text": "..." }, { "role": "user", "text": "..." }, { "role": "agent", "text": "..." }] },
            { "id": 2, "title": "🔥 Oferta", "objective": "...", "messages": [{ "role": "agent", "text": "..." }] },
            { "id": 3, "title": "💰 Cierre", "objective": "...", "messages": [{ "role": "agent", "text": "..." }] },
            { "id": 4, "title": "📢 Seguimiento", "objective": "...", "messages": [{ "role": "agent", "text": "..." }] }
        ]
      }
    }
    
    Responde SOLO en JSON válido, sin textos introductorios ni bloques de código.
    `;

    try {
        const responseText = await generateContent('gemini-3-flash-preview', prompt, { responseMimeType: "application/json" });
        return JSON.parse(responseText || "{}");
    } catch (error) {
        console.error("❌ [GEMINI STRATEGY ERROR]:", error);
        throw error;
    }
};

module.exports = { generateContent, generateFullStrategy };
