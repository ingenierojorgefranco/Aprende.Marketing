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
 * Función auxiliar para limpiar la respuesta de la IA y asegurar un JSON válido (Elimina Markdown y espacios).
 */
const cleanJsonString = (str) => {
    if (!str) return "";
    return str
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
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
            
            const result = JSON.parse(cleanJsonString(textResponse));
            
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

        //const step1Prompt = ``;
        
        
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

            Etapa 1 (Mes 1): 0 ventas/mes obligatorio). 
            Etapa 2 (Mes 2): Mes anterior + (0 ventas/mes obligatorio). 
            Etapa 2 (Mes 3): Mes anterior + (0 ventas/mes obligatorio). 
            Etapa 2 (Mes 4): Mes anterior + (1 ventas/mes obligatorio). 
            Etapa 2 (Mes 5): Mes anterior + (2 ventas/mes obligatorio). 
            Etapa 3 (Mes 6): Mes anterior + (3 ventas/mes obligatorio). 
            Etapa 3 (Mes 7): Mes anterior + (4 ventas/mes obligatorio).
            Etapa 3 (Mes 8): Mes anterior + (5 ventas/mes obligatorio).
            Etapa 3 (Mes 9): Mes anterior + (6 ventas/mes obligatorio). 
            Etapa 3 (Mes 10): Mes anterior + (7 ventas/mes obligatorio). 
            Etapa 3 (Mes 11): Mes anterior + (8 ventas/mes obligatorio). 
            Etapa 3 (Mes 12): Mes anterior + (9 ventas/mes obligatorio).


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
        Si el Lead Magnet es una Clase, Webinar o VSL, utiliza verbos como "Ver ahora", "Asistir", "Reproducir", "Mirar".
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

            
            "projection": [0 ventas, 0 ventas, 1 ventas, 2 ventas, 3 ventas, 4 ventas, 5 ventas, 6 ventas, 7 ventas, 8 ventas, 9 ventas, 10 ventas],


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
              "name": "Nombre Realista Latino del Avatar 1",
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
              "name": "Nombre Realista Latino del Avatar 2",
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
              "name": "Nombre Realista Latino del Avatar 3",
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
          ],



          psychology: {
            pains: [
                "Identifica un dolor agudo relacionado con la falta de ingresos o estabilidad en este nicho. (Este es el Dolor 1, No muestres el texto Dolor 1, solo el texto normal)",
                "Detecta una frustración técnica o de aprendizaje específica que detiene al avatar.  (Este es el Dolor 2, No muestres el texto Dolor 1, solo el texto normal)",
                "Analiza el miedo al fracaso o a la pérdida de tiempo o dinero en este mercado. (Este es el Dolor 3, No muestres el texto Dolor 1, solo el texto normal)",
                "Describe la sensación de estancamiento profesional o personal del prospecto. (Este es el Dolor 4, No muestres el texto Dolor 1, solo el texto normal)",
                "Identifica la presión social o familiar que siente el avatar por no tener resultados. (Este es el Dolor 5, No muestres el texto Dolor 1, solo el texto normal)",
                "Analiza el agotamiento por métodos tradicionales que no funcionan en este sector. (Este es el Dolor 6, No muestres el texto Dolor 1, solo el texto normal)",
            ],
            "solutions": [
            {
                "title": "Título corto y potente como Solucion al Dolor 1", 
                "description": "Descripción persuasiva que explica la transformación del Dolor 1"
            },
            {
                "title": "Título corto y potente como Solucion al Dolor 2", 
                "description": "Descripción persuasiva que explica la transformación del Dolor 2"
            },
            {
                "title": "Título corto y potente como Solucion al Dolor 3", 
                "description": "Descripción persuasiva que explica la transformación del Dolor 3"
            },
            {
                "title": "Título corto y potente como Solucion al Dolor 4", 
                "description": "Descripción persuasiva que explica la transformación del Dolor 4"
            },
            {
                "title": "Título corto y potente como Solucion al Dolor 5", 
                "description": "Descripción persuasiva que explica la transformación del Dolor 5"
            },
            {
                "title": "Título corto y potente como Solucion al Dolor 6", 
                "description": "Descripción persuasiva que explica la transformación del Dolor 6"
            }
        ],
            awarenessStages: {
                stage1_pain: "Analiza el nivel de consciencia del avatar sobre su dolor principal en este nicho específico.",
                stage2_solution: "Analiza la percepción del avatar sobre las soluciones existentes y por qué esta es la ideal.",
                stage3_barrier: "Analiza la barrera mental o duda técnica específica que impide al avatar comprar ahora mismo."
            },
    }



        landingPageTabs: {
            hero: {
                label: "1. Encabezado",
                title: "Promesa de Valor (Hero Section)",
                type: 'hero',
                h1: "Domina el Arte del Microblading y Genera Ingresos Propios de Alto Valor",
                h2: "La oportunidad perfecta para emprendedoras del sector belleza que buscan independencia financiera sin trucos ni promesas vacías."
            }
        },
        thankYouPageTabs: {
            header: {
                label: "1. Confirmación",
                title: "Mensaje de Éxito",
                type: 'header',
                content: {
                    h1: "string (Titular de éxito)",
                    h2: "string (Subtítulo con frase de felicitación por registrarse)"
                }
            },
            action: {
                label: "2. Siguiente Paso",
                title: "Instrucción WhatsApp",
                type: 'action',
                content: {
                    h1: "string (añade un Llamado a la acción para ingresar al grupo)",
                    h2: "string (añade una frase de Beneficio de estar en el grupo)"
                }
            },
            magnet: {
                label: "3. Lead Magnet",
                title: "Texto de Entrega de un Regalo relacionado con el producto digital y el dolor de la audiencia",
                type: 'magnet',
                content: {
                    h1: "string (Nombre del regalo) relacionado con el producto digital y dolor de la audiencia",
                    h2: "string (Instrucción de descarga o visualización)"
                }
            }
        },








    "content": [
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
            strategy: "Abordamos los retos and cuidados necesarios con honestidad. El objetivo es filtrar a alumnos comprometidos and demostrar que la formación adecuada elimina la mayoría de estos riesgos."
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
        }
    ],





    "emails": {
      "nurture": [
        {
                id: 1,
                day: "Día 0",
                subject: "🎁 Titulo altamente persuasivo y motivador con acceso al LeadMagnet definido en el proyecto",
                type: "Entrega de Valor",
                objective: "texto de minimo 200 caracteres en el que se establece las instrucciones con las que debe ser generado el correo electronico con el que se invita al usuario a ingresar al leadmagnet"
            },
            {
                id: 2,
                day: "Día 1",
                subject: "😫 ¿Cansada de trabajar 10h y no ver frutos reales?",
                type: "Agitación del Dolor",
                objective: "texto de minimo 200 caracteres en el que se establece las instrucciones con las que debe ser generado el correo electronico con el que busca conectar emocionalmente con el cansancio sistémico del avatar y la frustración económica."
            },
            {
                id: 2,
                day: "Día 2",
                subject: "📈 Cómo Maria pasó de 0 a $2,000/mes con cejas",
                type: "Prueba Social",
                objective: "texto de minimo 200 caracteres en el que se establece las instrucciones con las que debe ser generado el correo electronico con el que se demuestra la factibilidad mediante un caso de éxito real que genere deseo y credibilidad."
            },
            {
                id: 3,
                day: "Día 3",
                subject: "💎 La verdad sobre el Microblading (y por qué otros fallan)",
                type: "Mecanismo Único",
                objective: "texto de minimo 200 caracteres en el que se establece las instrucciones con las que debe ser generado el correo electronico con el que se explica la diferenciación del curso digital frrente a otros cursos genericos"
            },
            {
                id: 4,
                day: "Día 4",
                subject: "🚀 ¡INSCRIPCIONES ABIERTAS! Domina la Certificación Pro",
                type: "Lanzamiento / Oferta",
                objective: "texto de minimo 200 caracteres en el que se establece las instrucciones con las que debe ser generado el correo electronico con el que se busca Presentar oficialmente el programa completo con todos los beneficios y abrir inscripciones."
            },
            {
                id: 5,
                day: "Día 5",
                subject: "⏳ Tus 3 Bonos Exclusivos expiran en pocas horas...",
                type: "Escasez / Valor",
                objective: "texto de minimo 200 caracteres en el que se establece las instrucciones con las que debe ser generado el correo electronico con el que Añadir presión positiva mediante la pérdida inminente de los bonos adicionales."
            },
            {
                id: 6,
                day: "Día 6",
                subject: "⚠️ ÚLTIMA LLAMADA: Tu futuro profesional empieza hoy",
                type: "Cierre / Urgencia",
                objective: "texto de minimo 200 caracteres en el que se establece las instrucciones con las que debe ser generado el correo electronico con el que se hace una Llamada final a la acción agresivo pero profesional. Confronta al prospecto con su situación actual vs. su potencial futuro si toma acción hoy."
            }
      ],
      "evergreen": [
        {
                id: 8,
                day: "Día 8",
                subject: "¿Cansada de las promesas vacías en cursos online?",
                type: "Autoridad / Educación",
                objective: "Empatizar con el miedo del cliente y posicionar el curso como la única solución técnica real."
            },
            {
                id: 9,
                day: "Día 15",
                subject: "El checklist definitivo para montar tu estudio en casa",
                type: "Valor / Utilidad",
                objective: "Entregar valor práctico que facilite la visualización del negocio real."
            }
      ]
    },
    "whatsapp": [
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
    ],
    "whatsappLaunch": [
        {
          "id": "wl1",
          "name": "Confirmación de Fecha",
          "moment": "Día -7",
          "objective": "Generar expectativa y agendar al lead.",
          "messages": [{"role": "agent", "text": "¡Hola! 🎉 Soy el encargado de tu formación. Solo paso para confirmarte que ya tenemos fecha oficial para nuestra clase maestra de **[PRODUCT_NAME]**. Será el próximo domingo. ¿Ya lo anotaste en tu calendario?"}]
        }
    ],
    "testimonials": [
        { "name": "Nombre de la persona", "text": "Texto del testimonio" }
    ]
  }
}

        
    `;








    try {
        const step1Res = await generateContent('gemini-3-flash-preview', step1Prompt, { 
            responseMimeType: "application/json",
            thinkingConfig: { thinkingBudget: 0 }
        });

        if (!step1Res) throw new Error("Gemini devolvió vacío en Etapa 1");
        
        step1Data = JSON.parse(cleanJsonString(step1Res));
        process.stdout.write(`✅ [PIPELINE IA] Etapa 1 + Psicología finalizada con éxito para ${productName}.\n`);

    } catch (err) {
        process.stdout.write(`❌ [PIPELINE ERROR ETAPA 1 IA]: ${err.message}\n`);
        throw err;
    }

    // 4. DATOS DUMMY PARA ETAPAS 3-6 (PARA PRUEBAS - SINCRO CON MOCK)
    process.stdout.write(`[PIPELINE DEBUG] Inyectando datos estáticos para etapas 3 a 6...\n`);



    

    try {
        // 5. CONSOLIDACIÓN FINAL
        process.stdout.write(`[PIPELINE DEBUG] Ensamblando JSON final...\n`);
        
        const finalJson = { 
            meta: step1Data.meta,
            avatars: step1Data.avatars,
            psychology: step1Data.psychology, // Sincronizado: Usando datos de Step 1 (IA)
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
            process.stdout.write(`❌ [PIPELINE CRITICAL ERROR]: ${error.message}\n`);
            throw error;
        }
    } catch (globalError) { // Este catch cierra el try de la línea 212
        process.stdout.write(`❌ [PIPELINE GLOBAL FAILURE]: ${globalError.message}\n`);
        throw globalError;
    }
};