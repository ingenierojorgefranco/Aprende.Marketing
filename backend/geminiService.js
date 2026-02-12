
import { GoogleGenAI } from "@google/genai";
import pool from './db.js';

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
export const generateContent = async (model, contents, config = {}) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        return await withRetries(async () => {
            const response = await ai.models.generateContent({
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
export const analyzeWebsiteContent = async (rawText) => {
   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
            const response = await ai.models.generateContent({
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
export const generateFullStrategy = async (projectId) => {

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // 1. LOG DE INICIO DE PIPELINE
    process.stdout.write(`\n🚀 [PIPELINE START] Generación real (Etapa 1 IA) para Proyecto ID: ${projectId}\n`);


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
    const { niche, product_name: productName, brand_tone: brandTone, full_price: fullPrice, commission_rate: commissionRate, lead_magnet_type: leadMagnetType  } = projectData;

    let step1Data;

    // 3. GENERACIÓN REAL ETAPA 1 (IA - Fusionada con Psicología)
    try {
        process.stdout.write(`⏳ [PIPELINE IA] Llamando a Gemini 3 Flash para Etapa 1 + Psicología: ${productName}...\n`);

        const step1Prompt = `Eres un Estratega Senior de Marketing Digital. Tu misión es generar el ADN de marketing, 3 perfiles de Avatar extremadamente detallados y la psicología profunda del consumidor para el producto "${productName}" en el nicho "${niche}". Tono de marca: "${brandTone}".

        "El regalo (Lead Magnet) que el usuario entrega es de tipo: "${leadMagnetType}"
        
        Genera también un campo 'shortDescription' dentro de 'meta' que sea un resumen persuasivo de 1 a 2 frases destacando la transformación principal del producto para ser mostrado en tarjetas de interfaz.

        Genera un objeto 'summary' dentro de 'meta' con información coherente al nicho:
            primaryObjective: El objetivo final (ej: 'Venta directa', 'Cierre por chat').
            systemAction: Qué automatiza la plataforma para este producto específico.
            salesMethod: El flujo del embudo (ej: 'Anuncios -> Landing -> WhatsApp').
            targetAudienceSummary: Resumen de quién es el comprador ideal.
            targetAgeRange: El rango de edad más probable (ej: '25 a 40 años').

        projection: Genera un array de 12 números (Mes 1 al 12). La IA DEBE calcular cada mes siguiendo esta fórmula: 
    
            REGLA MATEMÁTICA PARA PROYECCIÓN: 1. 
            
            Calcula Ventas Reales = Math.floor(Leads Estimados * 0.05). 
            
            2. Si Ventas Reales es menor a 1, la ganancia de ese mes DEBE ser 0 (no se puede ganar dinero sin una venta completa). 
            
            3. Ganancia Final = Ventas Reales * (Precio * %Comisión).

            Etapa 1 (Mes 1): Leads bajos (1 a 2 Leads /mes obligatorio). 
            Etapa 2 (Mes 2): Mes anterior + (1 a 2 Leads /mes obligatorio). 
            Etapa 2 (Mes 3): Mes anterior + (2 a 5 Leads /mes obligatorio). 
            Etapa 2 (Mes 4): Mes anterior + (5 a 10 Leads /mes obligatorio). 
            Etapa 2 (Mes 5): Mes anterior + (10 a 20 Leads /mes obligatorio). 
            Etapa 3 (Mes 6): Mes anterior + (20 a 30 Leads /mes obligatorio). 
            Etapa 3 (Mes 7): Mes anterior + (30 a 40 Leads /mes obligatorio).
            Etapa 3 (Mes 8): Mes anterior + (40 a 50 Leads /mes obligatorio).
            Etapa 3 (Mes 9): Mes anterior + (50 a 70 Leads /mes obligatorio). 
            Etapa 3 (Mes 10): Mes anterior + (70 a 80 Leads /mes obligatorio). 
            Etapa 3 (Mes 11): Mes anterior + (80 a 90 Leads/mes obligatorio). 
            Etapa 3 (Mes 12): Mes anterior + (90 a 100 Leads /mes obligatorio).

        INSTRUCCIONES PARA LOS 3 AVATARES (OBLIGATORIO):
        Genera perfiles diferenciados y profundos para estos 3 tipos de cliente:
        1. AVATAR 1 (El Emprendedor Activo): Alguien con energía que busca escalar un negocio o empezar uno nuevo con decisión.
        2. AVATAR 2 (El Escéptico con Miedo): Alguien que ha tenido malas experiencias previas o tiene miedo a perder su inversión.
        3. AVATAR 3 (La Persona en Reinvención): Alguien estancado en un trabajo convencional que busca un cambio total de estilo de vida.

        INSTRUCCIONES PARA LA PSICOLOGÍA (OBLIGATORIO):
        Genera un análisis de miedos, objeciones y motivaciones reales para este nicho.

        INSTRUCCIONES PARA CONTENIDOS DE BLOG content (OBLIGATORIO):
        Genera 7 articulos de blog optimizados para SEO que tenga que ver con el producto especificamente, usa un volumen de keyword de entre 100 a 1000, añade palabras claves realistas con intension de busqueda informativa, titulos que no superen los 60 caracteres, dirigidos a ser informativos en forma de pregunta y optimizados para generar el maximo ctr posible y atraer audiencia cualificada, 3 articulos iniciales enfocados en el primer avatar definido, 2 articulos enfocados en el segundo avatar definido, 2 ultimos articulos enfocados en el tercer avatar definido
        

        INSTRUCCIONES PARA CONTENIDOS DE EMAIL emails (OBLIGATORIO):
       Actúa como un Copywriter Senior experto en Marketing de Respuesta Directa. Tu misión es redactar una secuencia de titulos y contenidos de 7 correos electrónicos (Día 0 al Día 6) diseñada para convertir prospectos en compradores del producto
        
        REGLA DE COHERENCIA DE VERBOS:
        Si el Lead Magnet es un PDF, Guía o Ebook, utiliza verbos como "Descargar", "Leer", "Revisar el archivo".
        Si el Lead Magnet es un Clase, Webinar o VSL, utiliza verbos como "Ver ahora", "Asistir", "Reproducir", "Mirar".
        El correo del Día 0 y los recordatorios posteriores deben ser consistentes con esta acción.
        
        para ello el sistema tendra el siguiente enfoque segun los dias de envio.

        Día 0: Entrega de Valor. Cumple la promesa. Entrega al usuario el acceso a su Lead Magnet con entusiasmo. Establece autoridad y reciprocidad.
        Día 1: Agitación del Dolor. Toca la herida. Describe cómo se siente el avatar 1 con sus dolores
        Día 2: Prueba Social. Muestra que es posible. Narra un caso de éxito del avatar 2 (puedes crear un nombre ficticio coherente) que haya superado los mismos miedos.
        Día 3: Mecanismo Único. Explica por qué lo que han intentado antes no funciona y por qué este método es la solución definitiva. Elimina las posibles objeciones del avatar 1.
        Día 4: Lanzamiento de Oferta. Presenta el producto como la mejor opcion para la persona, la que indica la transformacion en su vida.
        Día 5: Escasez y Valor. Añade presión ética. Menciona que los cupos son limitados o que los bonos están por expirar. Refuerza el valor de la inversión.
        Día 6: Cierre Final. Llamado a la acción agresivo pero profesional. Confronta al prospecto con su situación actual vs. su potencial futuro si toma acción hoy.

        ten en cuenta la siguiente estructura para generar el json
        
                id: identificador del correo,
                day: dia del correo electronico,
                subject: titulo experto que incremente el CTR usa iconos atractivos un lenguaje cercano y que sea enfocado a entregar el valor del leadmagnet y que este en relacion con el usuario,
                type: tipo de objetivo del correo entrega de valor agitacion del dolor etc,
                objective: establece el objetivo del correo (Con base en la explicacion anterior que te di de cada tipo de correo) hazlo bien explicado como instruccion para que luego la ia sepa como construir el correo electronico completo,


        INSTRUCCIONES PARA TESTIMONIOS testimonials (OBLIGATORIO):
        Genera exactamente 3 testimonios. 
        - Debes usar los nombres exactos de los 3 AVATARES generados arriba.
        - El texto de cada testimonio debe narrar en primera persona cómo el producto solucionó el "pain" (dolor) específico que definiste para ese avatar.
        - Lenguaje natural, corto (máximo 25 palabras) y con tono de mensaje de agradecimiento.

        En thankYouPageTabs, genera copy persuasivo para 3 momentos:
            header: Un titular de confirmación inmediata (ej: '¡Lugar Reservado!').
            action: Una instrucción directa para unirse al grupo de WhatsApp (ej: 'Únete a la comunidad para recibir soporte').
            magnet: Copy específico para la entrega del Lead Magnet (PDF o Clase) con un titular que genere deseo de consumo inmediato.

        INSTRUCCIONES PARA SECUENCIA DE LANZAMIENTO WHATSAPP whatsappLaunch (OBLIGATORIO):
        Genera una secuencia completa de 3 mensajes para un lanzamiento de WhatsApp Flow / Meteórico. Cada mensaje debe ser persuasivo, usar emojis y formato negrita de WhatsApp.
        Los 3 momentos son:
        1. wl1: Confirmación de Fecha (Día -7).


        Estructura del JSON para whatsappLaunch:
        {
          "id": "string (wl1 a wl14)",
          "name": "Nombre técnico del momento",
          "moment": "Día/Hora",
          "objective": "Objetivo estratégico",
          "messages": [{"role": "agent", "text": "Texto persuasivo con emojis"}]
        }


        Responde estrictamente en formato JSON con la siguiente estructura exacta:
        {
          "meta": {
            "projectName": "${productName}",
            "shortDescription": "Resumen persuasivo de 1-2 frases destacando la transformación",
            "niche": "${niche}",
            "productType": "Digital Product",
            "objective": "Venta directa del Producto Digital con cierre asistido por WhatsApp, email Marketing y Artículos de Blog",
            "price": ${fullPrice || 0},
            "commissionRate": ${commissionRate || 0},
            "projection": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "summary": {
                "primaryObjective": "string",
                "systemAction": "string",
                "salesMethod": "string",
                "targetAudienceSummary": "string",
                "targetAgeRange": "string"
            },
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
              "name": "string",
              "archetype": "string",
              "age": "string",
              "quote": "string",
              "pain": "string",
              "daily_manifestation": "string",
              "desire": "string",
              "emotional_reason": "string",
              "objection": "string",
              "interests": "string",
              "behavior": "string",
              "motivations": { "dinero": 90, "tiempo": 80, "estatus": 70, "seguridad": 60 }
            },
            {
              "id": 2,
              "name": "string",
              "archetype": "string",
              "age": "string",
              "quote": "string",
              "pain": "string",
              "daily_manifestation": "string",
              "desire": "string",
              "emotional_reason": "string",
              "objection": "string",
              "interests": "string",
              "behavior": "string",
              "motivations": { "dinero": 70, "tiempo": 60, "estatus": 50, "seguridad": 95 }
            },
            {
              "id": 3,
              "name": "string",
              "archetype": "string",
              "age": "string",
              "quote": "string",
              "pain": "string",
              "daily_manifestation": "string",
              "desire": "string",
              "emotional_reason": "string",
              "objection": "string",
              "interests": "string",
              "behavior": "string",
              "motivations": { "dinero": 80, "tiempo": 95, "estatus": 60, "seguridad": 70 }
            }
          ],
          "psychology": {
            "pains": ["string"],
            "solutions": [{"title": "string", "description": "string"}],
            "awarenessStages": {
                "stage1_pain": "string",
                "stage2_solution": "string",
                "stage3_barrier": "string"
            }
          },
          "landingPageTabs": {
            "hero": {
                "label": "string",
                "title": "string",
                "type": "hero",
                "h1": "string",
                "h2": "string"
            }
          },
          "thankYouPageTabs": {
            "header": { "label": "string", "title": "string", "type": "header", "content": { "h1": "string", "h2": "string" } },
            "action": { "label": "string", "title": "string", "type": "action", "content": { "h1": "string", "h2": "string" } },
            "magnet": { "label": "string", "title": "string", "type": "magnet", "content": { "h1": "string", "h2": "string" } }
          },
          "content": [
            { "id": 1, "title": "string", "traffic": 50, "difficulty": 20, "keyword": "string", "searchVolume": "string", "objective": "string", "strategy": "string" }
          ],
          "emails": {
            "nurture": [
              { "id": 1, "day": "Día 0", "subject": "string", "type": "string", "objective": "string" }
            ],
            "evergreen": [
              { "id": 8, "day": "Día 8", "subject": "string", "type": "string", "objective": "string" }
            ]
          },
          "whatsapp": [
            { "id": 1, "title": "string", "objective": "string", "messages": [{ "role": "agent", "text": "string" }] }
          ],
          "whatsappLaunch": [
            { "id": "wl1", "name": "string", "moment": "string", "objective": "string", "messages": [{ "role": "agent", "text": "string" }] }
          ],
          "testimonials": [
            { "name": "string", "text": "string" }
          ]
        }
        `;

        const step1Res = await generateContent('gemini-3-flash-preview', step1Prompt, { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        });

        if (!step1Res) throw new Error("Gemini devolvió vacío en Etapa 1");
        
        step1Data = JSON.parse(step1Res.trim());
        process.stdout.write(`✅ [PIPELINE IA] Etapa 1 + Psicología finalizada con éxito para ${productName}.\n`);

    } catch (err) {
        process.stdout.write(`❌ [PIPELINE ERROR ETAPA 1 IA]: ${err.message}\n`);
        throw err;
    }

    try {
        // 5. CONSOLIDACIÓN FINAL
        process.stdout.write(`[PIPELINE DEBUG] Ensamblando JSON final...\n`);
        
        const finalJson = { 
            meta: step1Data.meta,
            avatars: step1Data.avatars,
            psychology: step1Data.psychology,
            modules: { 
                web: {
                    landingPageTabs: step1Data.landingPageTabs,
                    thankYouPageTabs: step1Data.thankYouPageTabs
                },
                content: step1Data.content,
                emails: step1Data.emails,
                whatsapp: step1Data.whatsapp,
                whatsappLaunch: step1Data.whatsappLaunch,
                testimonials: step1Data.testimonials
            } 
        };

        process.stdout.write(`✨ [PIPELINE COMPLETE] Retornando datos al cliente.\n`);
        return finalJson;

    } catch (error) {
        process.stdout.write(`❌ [PIPELINE GLOBAL FAILURE]: ${error.message}\n`);
        throw error;
    }
};
