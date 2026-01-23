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
        process.stdout.write(`⏳ [PIPELINE IA] Llamando a Gemini 3 Flash para Etapa 1: ${productName}...\n`);
        
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
                }
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

        const step1Res = await generateContent('gemini-3-flash-preview', step1Prompt, { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        });

        if (!step1Res) throw new Error("Gemini devolvió vacío en Etapa 1");
        
        step1Data = JSON.parse(step1Res.trim());
        process.stdout.write(`✅ [PIPELINE IA] Etapa 1 finalizada con éxito para ${productName}.\n`);

    } catch (err) {
        process.stdout.write(`❌ [PIPELINE ERROR ETAPA 1 IA]: ${err.message}\n`);
        throw err;
    }

    // 4. DATOS DUMMY PARA ETAPAS 2-6 (PARA PRUEBAS - SINCRO CON MOCK)
    process.stdout.write(`[PIPELINE DEBUG] Inyectando datos estáticos para etapas 2 a 6...\n`);

    step2Data = {
        psychology: {
            pains: [
                "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja tu enorme esfuerzo.",
                "Sientes un nudo en el estómago por el miedo a cometer un error en el rostro de una clienta y arruinar tu reputación.",
                "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola a la hora de practicar.",
                "Ves pasar oportunidades de éxito en Instagram, pero te falta la guía técnica para dar el paso con seguridad.",
                "Te apasiona la estética pero no sabes cómo convertir esa pasión en un negocio de autoempleo rentable.",
                "Estás cansada de trabajar para otros y deseas fervientemente generar tus propios ingresos premium.",
                "Te detiene el miedo a las promesas vacías de internet que no enseñan nada realmente útil para tu futuro."
            ],
            solutions: [
                "Técnica de alta rentabilidad que permite cobrar lo que realmente vales por menos tiempo de trabajo. Maximiza tu tiempo generando servicios de alto impacto económico.",
                "Certificación profesional y acompañamiento que eliminan todo temor a cometer errores técnicos.",
                "Metodología 100% práctica basada en resultados reales, con soporte paso a paso.",
                "Estrategia probada de captación de clientes en Instagram para llenar tu agenda con seguridad.",
                "Plan de negocio detallado para convertir tu talento en una empresa de estética rentable.",
                "Hoja de ruta para el autoempleo de alto valor, dándote la libertad de ser tu propia jefa.",
                "Formación técnica de primer nivel que cumple lo que promete y te prepara para el éxito real."
            ],
            powerWords: ["Ingresos Propios", "Alto Valor", "Confianza Real", "Autoempleo", "Garantizado", "Estética Profesional"],
            unique_mechanism: "Método Brows360: Una técnica patentada que fusiona visajismo digital con pigmentación orgánica para resultados que duran el doble.",
            avoid: ["Gana dinero fácil", "Sin esfuerzo", "Fórmula mágica", "Hazte rico"],
            awarenessStages: {
                stage1_pain: "Frustración por trabajar jornadas agotadoras sin estabilidad económica real.",
                stage2_solution: "Sabe que el Microblading Hiperrealista es la técnica mejor pagada y más demandada.",
                stage3_barrier: "Miedo a no tener acompañamiento práctico y desconfianza en la educación online básica."
            },
            buyingPsychology: {
                notBuyingReasons: [
                    { title: "Duda de la factibilidad", description: "Teme que su falta de experiencia previa sea un impedimento real para aprender una técnica tan compleja.", detail: "Cree que necesita ser dibujante profesional para tener éxito." },
                    { title: "Falta de claridad", description: "No visualiza cómo pasará de su situación actual a generar ingresos reales de forma segura.", detail: "Le preocupa no saber cómo montar el estudio físico." },
                    { title: "Riesgo percibido", description: "Siente que puede perder la inversión en el curso si no logra dominar la pluma manual (tébori).", detail: "Teme arruinar la cara de alguien y enfrentar problemas legales." }
                ],
                buyingReasons: [
                    { title: "Siente Seguridad", description: "Percibe que el acompañamiento paso a paso minimiza cualquier riesgo de error técnico." },
                    { title: "Percibe Autoridad", description: "Nota que la metodología está avalada por years de práctica y miles de alumnas exitosas." },
                    { title: "Visualiza el Éxito", description: "Se ve logrando independencia financiera y manejando su propio estudio de belleza." },
                    { title: "Respaldo Total", description: "Siente que la comunidad and el soporte resolverán cualquier duda en tiempo real." }
                ],
                strategistConclusion: "El mensaje se enfocará en seguridad, respaldo, práctica real y resultados. Evitaremos promesas exageradas para generar confianza genuina atacando su principal miedo: la desconfianza en la formación online tradicional."
            },
            conversionStrategy: {
                mainFocus: [
                    { label: "Mensaje Directo", description: "Empatía sin rodeos sobre la inestabilidad económica y el miedo técnico." },
                    { label: "Autoridad Humana", description: "Liderazgo inspirador basado en resultados reales de alumnas, no solo teoría." },
                    { label: "Énfasis Práctico", description: "Foco total en el acompañamiento y la técnica paso a paso para elminar el miedo." }
                ],
                prioritizedChannels: [
                    { label: "Landing Page (Captación)", type: "LP" },
                    { label: "WhatsApp (Canal de Cierre)", type: "WA" },
                    { label: "Email (Refuerzo & Seguimiento)", type: "EM" }
                ],
                communicationStyle: [
                    { label: "Educativa + Emocional", description: "Enseñamos el potencial del negocio mientras conectamos con su deseo de independencia." },
                    { label: "Lenguaje Cercano", description: "Claridad profesional sin tecnicismos para no intimidar a las principiantes." },
                    { label: "Cercanía Total", description: "Hablar como una mentora que ya recorrió el camino y entiende sus miedos." }
                ],
                tacticalNote: "Este flujo está diseñado para calentar al prospecto en la Landing Page y llevarlo a WhatsApp, donde la tasa de cierre es 10 veces mayor para productos de alto valor. El sistema usará un lenguaje que evite tecnicismos para no intimidar al avatar Laura."
            }
        }
    };

    step3Web = {
        landingPageTabs: {
            hero: {
                label: "1. Encabezado",
                title: "Promesa de Valor (Hero Section)",
                type: 'hero',
                h1: "Domina el Arte del Microblading y Genera Ingresos Propios de Alto Valor",
                h2: "La oportunidad perfecta para emprendedoras del sector belleza que buscan independencia financiera sin trucos ni promesas vacías.",
                strategyText: "Este titular conecta directamente con el deseo de generar ingresos propios, filtrando a las personas que buscan resultados fáciles y atrayendo a las que valoran el autoempleo de calidad."
            },
            pain: {
                label: "2. Dolores",
                title: "Identificación del Problema",
                type: 'pain',
                items: [
                    "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja tu enorme esfuerzo.",
                    "Sientes un nudo en el estómago por el miedo a cometer un error en el rostro de una clienta y arruinar tu reputación.",
                    "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola a la hora de practicar.",
                    "Ves pasar oportunidades de éxito en Instagram, pero te falta la guía técnica para dar el paso con seguridad.",
                    "Te apasiona la estética pero no sabes cómo convertir esa pasión en un negocio de autoempleo rentable.",
                    "Estás cansada de trabajar para otros y deseas fervientemente generar tus propios ingresos premium.",
                    "Te detiene el miedo a las promesas vacías de internet que no enseñan nada realmente útil para tu futuro."
                ],
                strategyText: "Al mencionar detalladamente estos 7 dolores, validamos el sentimiento del usuario y nos diferenciamos como una opción seria que entiende su realidad."
            },
            benefits: {
                label: "3. Beneficios",
                title: "Oferta Irresistible",
                type: 'benefits',
                items: [
                    { title: "Técnica de alta rentabilidad que permite cobrar lo que realmente vales por menos tiempo de trabajo.", desc: "Maximiza tu tiempo generando servicios de alto impacto económico." },
                    { title: "Certificación profesional and acompañamiento que eliminan todo temor a cometer errores técnicos.", desc: "Seguridad absoluta respaldada por expertos en micropigmentación." },
                    { title: "Metodología 100% práctica basada en resultados reales, con soporte paso a paso.", desc: "No más teoría vacía; aprende haciendo con modelos reales." },
                    { title: "Estrategia probada de captación de clientes en Instagram para llenar tu agenda con seguridad.", desc: "Tu agenda llena desde la primera semana gracias a nuestro método de marketing." },
                    { title: "Plan de negocio detallado para convertir tu talento en una empresa de estética rentable.", desc: "Te enseñamos a escalar tu talento y construir un negocio sólido." },
                    { title: "Hoja de ruta para el autoempleo de alto valor, dándote la libertad de ser tu propia jefa.", desc: "Toma el control total de tu carrera profesional y financiera." },
                    { title: "Formación técnica de primer nivel que cumple lo que promete y te prepara para el éxito real.", desc: "Educación de élite diseñada para resultados inmediatos en el mercado." }
                ],
                strategyText: "Enfocamos los beneficios en la libertad y la calidad técnica para satisfacer la necesidad de autoempleo genuino del avatar."
            }
        },
        thankYouPageTabs: {
            header: {
                label: "1. Confirmación",
                title: "Mensaje de Éxito",
                type: 'header',
                content: {
                    h1: "¡Bienvenida al inicio de tu independencia financiera!",
                    h2: "Has tomado la mejor decisión para tu carrera en el sector de la belleza."
                },
                strategyText: "Reforzamos la idea de 'independencia' para mantener la motivación del avatar en su punto más alto."
            },
            action: {
                label: "2. Siguiente Paso",
                title: "Redirección a Comunidad",
                type: 'action',
                content: {
                    h1: "Conéctate a nuestro WhatsApp Estratégico",
                    h2: "Es el canal principal donde resolveremos tus dudas y entregaremos el material de estudio."
                },
                strategyText: "Aprovechamos que el usuario consume contenido en WhatsApp para asegurar la entrada a la comunidad."
            },
            magnet: {
                label: "3. Lead Magnet",
                title: "Guía de Inicio Rápido",
                type: 'magnet',
                content: {
                    h1: "Descarga tu Plan de Negocios en Estética",
                    h2: "El primer paso práctico para empezar a ofrecer servicios de alto valor."
                },
                strategyText: "Entregamos valor inmediato que ataca la parálisis por análisis del avatar principiante."
            }
        }
    };

    step4Content = [
        {
            id: 1,
            title: "¿Qué es el microblading en cejas?",
            traffic: 50,
            difficulty: 20,
            keyword: "que es microblading cejas",
            searchVolume: "500 - 1K",
            objective: "Educación inicial para el futuro artista",
            strategy: "Definimos la técnica desde una perspectiva profesional para que el alumno entienda el potencial del negocio. Posicionamos el microblading como la habilidad mejor pagada en estética actualmente."
        },
        {
            id: 2,
            title: "¿Qué desventajas tiene el microblading?",
            traffic: 40,
            difficulty: 15,
            keyword: "desventajas de microblading",
            searchVolume: "100 - 500",
            objective: "Transparencia and profesionalismo",
            strategy: "Abordamos los retos y cuidados necesarios con honestidad. El objetivo es filtrar a alumnos comprometidos y demostrar que la formación adecuada elimina la mayoría de estos riesgos."
        },
        {
            id: 3,
            title: "Diferencia entre Microblading, Microshading y Micropigmentación",
            traffic: 65,
            difficulty: 30,
            keyword: "diferencia microblading microshading micropigmentacion",
            searchVolume: "800 - 2K",
            objective: "Claridad técnica y autoridad",
            strategy: "Desglosamos las terminologías para que el alumno aprenda a asesorar a sus futuros clientes. Esto establece una base de autoridad técnica indispensable para cobrar precios premium."
        },
        {
            id: 4,
            title: "¿Cuánto dura el microblading? Realidad y retoques",
            traffic: 75,
            difficulty: 40,
            keyword: "cuánto dura el microblading",
            searchVolume: "2K - 5K",
            objective: "Expectativas y rentabilidad",
            strategy: "Explicamos el ciclo de vida del servicio. Esto ayuda al alumno a entender la necesidad de retoques y cómo fidelizar clientes para generar ingresos recurrentes en su negocio."
        },
        {
            id: 5,
            title: "¿Cuánto suele costar el microblading de cejas?",
            traffic: 85,
            difficulty: 50,
            keyword: "microblading cejas precio",
            searchVolume: "1.5K - 3K",
            objective: "Análisis de mercado y viabilidad",
            strategy: "Mostramos el rango de precios del mercado para que el alumno visualice su retorno de inversión. Motivamos la profesionalización como vía para cobrar en el rango más alto."
        },
        {
            id: 6,
            title: "Microblading: El proceso de curación en los primeros 10 días",
            traffic: 30,
            difficulty: 10,
            keyword: "curacion microblading dia a dia",
            searchVolume: "300 - 600",
            objective: "Conocimiento del proceso de curación",
            strategy: "Es fundamental que el artista sepa qué esperar. Educamos sobre la fase de oscurecimiento y regeneración para que el alumno pueda dar seguridad total a sus clientes."
        },
        {
            id: 7,
            title: "¿Cuánto cuesta un microblading para cejas?",
            traffic: 80,
            difficulty: 45,
            keyword: "precio de micropigmentación de cejas",
            searchVolume: "1K - 2.5K",
            objective: "Posicionamiento High Ticket",
            strategy: "Comparamos el costo del servicio vs la rentabilidad para el artista. Enfocamos el contenido en cómo vender el valor del resultado final en lugar de competir por el precio más bajo."
        },
        {
            id: 8,
            title: "Guía de cuidados: ¿Cuántos días proteger el microblading?",
            traffic: 55,
            difficulty: 25,
            keyword: "cuidados microblading cejas",
            searchVolume: "500 - 1.2K",
            objective: "Bioseguridad y éxito del procedimiento",
            strategy: "Un artista profesional se diferencia por su protocolo post-venta. Establecemos los estándares de oro en cuidados para garantizar la máxima retención del pigmento."
        },
        {
            id: 9,
            title: "¿Qué opinan los dermatólogos del microblading?",
            traffic: 25,
            difficulty: 15,
            keyword: "seguridad microblading dermatologos",
            searchVolume: "200 - 400",
            objective: "Derribar miedos de salud",
            strategy: "Aportamos validación médica sobre la seguridad de la técnica cuando se realiza con pigmentos certificados y normas de higiene, calmando las dudas de seguridad del alumno."
        },
        {
            id: 10,
            title: "¿Por qué no deberías hacerte el microblading de cejas?",
            traffic: 20,
            difficulty: 5,
            keyword: "contraindicaciones microblading",
            searchVolume: "400 - 900",
            objective: "Filtro de clientes y ética profesional",
            strategy: "Utilizamos el 'marketing negativo' para explicar contraindicaciones reales. Esto enseña al alumno a ser un profesional ético que sabe cuándo decir 'no', aumentando su prestigio."
        },
        {
            id: 11,
            title: "¿Cuándo no se recomienda el microblading?",
            traffic: 15,
            difficulty: 5,
            keyword: "casos donde no hacer microblading",
            searchVolume: "150 - 300",
            objective: "Prevención y seguridad legal",
            strategy: "Listamos casos clínicos (embarazo, diabetes no controlada, etc.) donde se desaconseja la técnica. Vital para que el alumno opere con seguridad y evite complicaciones legales."
        },
        {
            id: 12,
            title: "¿Cuál es la ceja permanente de aspecto más natural?",
            traffic: 45,
            difficulty: 20,
            keyword: "cejas naturales permanentes",
            searchVolume: "500 - 1K",
            objective: "Venta del beneficio estético",
            strategy: "Enfatizamos el trazo hiperrealista del microblading frente a técnicas más pesadas. Orientamos al alumno a especializarse en la naturalidad, que es lo más demandado hoy."
        },
        {
            id: 13,
            title: "Comparativa: ¿Cejas pelo a pelo o Microblading?",
            traffic: 50,
            difficulty: 20,
            keyword: "cejas pelo a pelo vs microblading",
            searchVolume: "600 - 1.5K",
            objective: "Claridad en la oferta de servicios",
            strategy: "Aclara la confusión común entre extensiones de cejas y microblading. Ayuda al alumno a definir su catálogo de servicios y a educar al mercado sobre la superioridad del microblading."
        }
    ];

    step5Emails = {
        nurture: [
            {
                id: 1,
                day: "Día 0",
                subject: "🎁 Tu regalo: Guía de Inicio Rápido en Microblading",
                type: "Entrega de Valor",
                objective: "Establecer reciprocidad y cumplir la promesa inmediata entregando el Lead Magnet.",
                bodyPreview: "Hola [Nombre], tal como te prometí, aquí tienes el acceso directo a la guía que transformará tu visión sobre el negocio de la belleza. En este PDF encontrarás..."
            },
            {
                id: 2,
                day: "Día 1",
                subject: "😫 ¿Cansada de trabajar 10h y no ver frutos reales?",
                type: "Agitación del Dolor",
                objective: "Conectar emocionalmente con el cansancio sistémico del avatar y la frustración económica.",
                bodyPreview: "Hola [Nombre], entiendo perfectamente esa sensación de darlo todo en el salón y llegar a casa sintiendo que el esfuerzo no se refleja en tu cuenta bancaria. El problema no eres tú, es el modelo..."
            },
            {
                id: 3,
                day: "Día 2",
                subject: "📈 Cómo Maria pasó de 0 a $2,000/mes con cejas",
                type: "Prueba Social",
                objective: "Demostrar factibilidad mediante un caso de éxito real que genere deseo y credibilidad.",
                bodyPreview: "Hola [Nombre], hoy quiero contarte la historia de una de mis alumnas que, como tú, tenía miedo de empezar de cero. Maria aplicó el método Brows360 y en solo 4 semanas logró..."
            },
            {
                id: 4,
                day: "Día 3",
                subject: "💎 La verdad sobre el Microblading (y por qué otros fallan)",
                type: "Mecanismo Único",
                objective: "Explicar la diferenciación del Método Brows360 frente a la competencia genérica.",
                bodyPreview: "Hola [Nombre], ¿sabes por qué muchas esteticistas no logran resultados naturales? La clave está en el visajismo digital. Hoy te revelo el secreto técnico detrás de las cejas perfectas..."
            },
            {
                id: 5,
                day: "Día 4",
                subject: "🚀 ¡INSCRIPCIONES ABIERTAS! Domina la Certificación Pro",
                type: "Lanzamiento / Oferta",
                objective: "Presentar oficialmente el programa completo con todos los beneficios y abrir inscripciones.",
                bodyPreview: "Hola [Nombre], llegó el momento que estabas esperando. Las puertas de la Certificación Expert Microblading están oficialmente abiertas. Esto es todo lo que recibirás al entrar hoy..."
            },
            {
                id: 6,
                day: "Día 5",
                subject: "⏳ Tus 3 Bonos Exclusivos expiran en pocas horas...",
                type: "Escasez / Valor",
                objective: "Añadir presión positiva mediante la pérdida inminente de los bonos adicionales.",
                bodyPreview: "Hola [Nombre], no quiero que te quedes fuera de los beneficios extra. El Kit de Pigmentos Orgánicos y la Asesoría VIP solo estarán disponibles para quienes se inscriban antes de medianoche..."
            },
            {
                id: 7,
                day: "Día 6",
                subject: "⚠️ ÚLTIMA LLAMADA: Tu futuro profesional empieza hoy",
                type: "Cierre / Urgencia",
                objective: "Llamada final a la acción antes del cierre de inscripciones y aumento de precio.",
                bodyPreview: "Hola [Nombre], esta es mi última invitación personal. Mañana el precio subirá y los bonos desaparecerán. ¿Eliges seguir como hasta ahora o decides tomar el control de tus ingresos?..."
            }
        ],
        evergreen: [
            {
                id: 8,
                day: "Día 8",
                subject: "¿Cansada de las promesas vacías en cursos online?",
                type: "Autoridad / Educación",
                objective: "Empatizar con el miedo del cliente y posicionar el curso como la única solución técnica real.",
                bodyPreview: "Hola [Nombre], sé que has visto muchos anuncios prometiendo riqueza rápida. Hoy quiero contarte por qué la formación técnica de alto nivel es el único camino seguro hacia el autoempleo rentable..."
            },
            {
                id: 9,
                day: "Día 15",
                subject: "El checklist definitivo para montar tu estudio en casa",
                type: "Valor / Utilidad",
                objective: "Entregar valor práctico que facilite la visualización del negocio real.",
                bodyPreview: "Hola [Nombre], mucha gente se paraliza pensando que necesita una clínica de lujo. Aquí te comparto la lista mínima de materiales para empezar con seguridad desde tu hogar..."
            }
        ]
    };

    step6WhatsApp = [
        {
            id: 1,
            title: "👋 Bienvenida e Interés",
            objective: "Filtro inicial para conocer la experiencia de la alumna y conectar por su canal preferido.",
            messages: [
                { role: "agent", text: "¡Hola! Qué alegría saludarte. Soy Valentina de MicroBrows Academy. He visto que te interesa nuestra Certificación Expert en Microblading. Cuéntame un poco de ti, ¿ya tienes experiencia en belleza o empiezas totalmente desde cero?" }
            ]
        },
        {
            id: 2,
            title: "🎨 Objeción: 'No sé dibujar'",
            objective: "Guion persuasivo diseñado para calmar el miedo técnico y la parálisis por falta de 'talento artístico'.",
            messages: [
                { role: "agent", text: "¡Esa es la duda más común! Pero te cuento un secreto: para el Microblading profesional no necesitas ser dibujante. Usamos herramientas de visajismo digital y plantillas de simetría que hacen el 90% del trabajo por ti. Lo que realmente importa es la técnica del trazo que te enseñaré paso a paso." }
            ]
        },
        {
            id: 3,
            title: "💎 El Método Brows360",
            objective: "Explicación del mecanismo único de la oferta para diferenciarte de la competencia barata.",
            messages: [
                { role: "agent", text: "Lo que nos hace diferentes es el Método Brows360. No solo enseñamos a hacer cejas, enseñamos a diseñar miradas basándonos en la estructura ósea de cada clienta. Así garantizamos resultados hiperrealistas que duran el doble que el microblading tradicional." }
            ]
        },
        {
            id: 4,
            title: "💰 Rentabilidad del Negocio",
            objective: "Argumentos lógicos y matemáticos sobre el potencial de ingresos y la velocidad del retorno de inversión.",
            messages: [
                { role: "agent", text: "Hablemos de números. Un servicio de Microblading se cobra entre $150 y $300 USD. Si haces solo 2 servicios a la semana, ya estarías facturando más de $1,200 USD al mes. Recuperas el valor de la certificación con tus primeras 2 clientas. Es la habilidad mejor pagada hoy en día." }
            ]
        },
        {
            id: 5,
            title: "🚀 Cierre y Enlace de Pago",
            objective: "Guion final de conversión con gatillos de escasez y urgencia para forzar la toma de decisión.",
            messages: [
                { role: "agent", text: "¡Llegó el momento! Hoy puedes entrar con el 50% de descuento y llevarte el Kit de Pigmentos de regalo. Solo me quedan 3 cupos con este beneficio. ¿Te mando el enlace de pago seguro para que asegures tu lugar y empecemos hoy mismo?" }
            ]
        },
        {
            id: 6,
            title: "⏳ Seguimiento (Follow-up)",
            objective: "Mensaje de reactivación para recuperar interesados que dejaron de responder pero tienen interés latente.",
            messages: [
                { role: "agent", text: "¡Hola de nuevo! Te escribo porque no quería que te perdieras el bono de Asesoría VIP que expira hoy a medianoche. ¿Sigues interesada en iniciar tu propio estudio de cejas este mes? Cuéntame si tienes alguna duda final con el pago." }
            ]
        }
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