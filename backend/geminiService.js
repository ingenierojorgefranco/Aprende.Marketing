import { GoogleGenAI } from "@google/genai";
import pool from './db.js';
import { EMAIL_BLUEPRINTS, GLOBAL_CONFIG } from './prompts/emails/emailBlueprints.js';

/**
 * Función auxiliar para generar slugs consistentes con el frontend
 */
const slugify = (text) => {
    if (!text) return "";
    return text.toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-');
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
    
    // Buscamos el primer '{' o '[' y el último '}' o ']' para extraer solo el bloque JSON
    const firstBrace = str.indexOf('{');
    const firstBracket = str.indexOf('[');
    const lastBrace = str.lastIndexOf('}');
    const lastBracket = str.lastIndexOf(']');
    
    let start = -1;
    if (firstBrace !== -1 && firstBracket !== -1) start = Math.min(firstBrace, firstBracket);
    else if (firstBrace !== -1) start = firstBrace;
    else if (firstBracket !== -1) start = firstBracket;

    let end = -1;
    if (lastBrace !== -1 && lastBracket !== -1) end = Math.max(lastBrace, lastBracket);
    else if (lastBrace !== -1) end = lastBrace;
    else if (lastBracket !== -1) end = lastBracket;
    
    if (start !== -1 && end !== -1 && end > start) {
        return str.substring(start, end + 1).trim();
    }

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
        "SELECT niche, product_name, brand_tone, full_price, commission_rate, lead_magnet_type, description, master_parent_id FROM projects WHERE id = ?",
        [projectId]
    );

    if (rows.length === 0) {
        process.stdout.write(`❌ [PIPELINE ERROR] Proyecto ${projectId} no encontrado.\n`);
        throw new Error("Project not found in pipeline retrieval.");
    }
    
    const projectData = rows[0];
    const { niche, product_name: productName, brand_tone: brandTone, full_price: fullPrice, commission_rate: commissionRate, lead_magnet_type: leadMagnetType, master_parent_id: masterParentId, description  } = projectData;
    const isCloned = masterParentId !== null;

    let step1Data;

    // 3. GENERACIÓN REAL ETAPA 1 (IA - Fusionada con Psicología)
    process.stdout.write(`⏳ [PIPELINE IA] Llamando a Gemini 3 Flash para Etapa 1 + Psicología: ${productName}...\n`);

        //const step1Prompt = ``;
        
        
        const step1Prompt = `Eres un Experto en Copywriting y Estratega de Marketing de Respuesta Directa con un enfoque psicológico profundo. Tu misión es generar el ADN de marketing, 3 perfiles de Avatar extremadamente detallados y la psicología profunda del consumidor para el producto "${productName}" en el nicho "${niche}". Tono de marca: "${brandTone}".

        Descripción del producto (Extrae de aquí los datos del profesor si están disponibles):
        "${description}"

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
            Etapa 2 (Mes 3): Mes anterior + (1 ventas/mes obligatorio). 
            Etapa 2 (Mes 4): Mes anterior + (1 ventas/mes obligatorio). 
            Etapa 2 (Mes 5): Mes anterior + (3 ventas/mes obligatorio). 
            Etapa 3 (Mes 6): Mes anterior + (2 ventas/mes obligatorio). 
            Etapa 3 (Mes 7): Mes anterior + (1 ventas/mes obligatorio).
            Etapa 3 (Mes 8): Mes anterior + (4 ventas/mes obligatorio).
            Etapa 3 (Mes 9): Mes anterior + (6 ventas/mes obligatorio). 
            Etapa 3 (Mes 10): Mes anterior + (4 ventas/mes obligatorio). 
            Etapa 3 (Mes 11): Mes anterior + (5 ventas/mes obligatorio). 
            Etapa 3 (Mes 12): Mes anterior + (7 ventas/mes obligatorio).


        INSTRUCCIONES PARA LOS 3 AVATARES (OBLIGATORIO):
        Genera perfiles diferenciados y profundos para estos 3 tipos de cliente (Crea nombres para cada avatar completamente diferentes al que te entrego como base):
        1. AVATAR 1 (El Emprendedor Activo): Alguien con energía que busca escalar un negocio o empezar uno nuevo con decisión.
        2. AVATAR 2 (El Escéptico con Miedo): Alguien que ha tenido malas experiencias previas o tiene miedo a perder su inversión.
        3. AVATAR 3 (La Persona en Reinvención): Alguien estancado en un trabajo convencional que busca un cambio total de estilo de vida.

        Genera para cada avatar un 'transformation_title' que sea una frase de enganche altamente persuasiva que describa la transformación principal que el avatar busca según su estado de consciencia actual (Ej: 'Si buscas...', 'Si ya estás...', 'Si tienes miedo a...'). Debe sonar como un titular que conecte inmediatamente con su situación.

        INSTRUCCIONES PARA LA PSICOLOGÍA (OBLIGATORIO):
        Genera un análisis de miedos, objeciones y motivaciones reales para este nicho.

        REGLA CRÍTICA DE CANTIDAD (OBLIGATORIA): El array de miedos/dolores ("pains") de la sección "psychology" debe tener EXACTAMENTE 9 objetos (ni uno más, ni uno menos: 3 objetos para avatarId 1, 3 objetos para avatarId 2, y 3 objetos para avatarId 3).
        REGLA CRÍTICA DE CANTIDAD (OBLIGATORIA): El array de soluciones ("solutions") de la sección "psychology" debe tener EXACTAMENTE 9 objetos (ni uno más, ni uno menos: 3 objetos para avatarId 1, 3 objetos para avatarId 2, y 3 objetos para avatarId 3).
        
        Está TERMINANTEMENTE PROHIBIDO resumir, truncar o enviar un número menor de dolores o soluciones. El orden debe ser estrictamente secuencial y correlacionado con el avatar correspondiente. No dejes campos con puntos suspensivos ("..."), genera contenido real de alto impacto persuasivo para cada uno.

        Instrucciones para Pains (Agitación del Dolor) los cuales estaran en psychology > pains:
        NO uses descripciones técnicas o de gestión. Genera dolores ALTAMENTE PERSUASIVOS que "toquen el nervio" emocional. Enfócate en la frustración, el miedo o la invisibilidad. Usa verbos de acción emocional (frustra, agota, aterra, duele) y describe una consecuencia visual o mental real (ej: Si estás cansada de ver tu agenda vacía, Si sientes un nudo en el estómago, Si te sientes invisible frente a competidores con menos talento). Escribe en SEGUNDA persona y CADA DOLOR DEBE EMPEZAR CON LA PALABRA "Si" seguido del sentimiento (ej: "Si te frustra...", "Si te duele...", "Si te agota..."). El usuario debe sentir que conoces su situación mejor que él mismo. Cada dolor debe ser un objeto con { "text": "...", "avatarId": number }.

        Instrucciones para solutions:
        Es importante personalizar los contenidos al usuario, haz que cada solucion sea una respuesta al dolor puntual que esta intentando resolver. REGLA ESTRICTA DE TRANSFORMACIÓN HUMANA: Prohibido usar tecnicismos, nombres de herramientas, software o procesos técnicos del nicho. Enfócate exclusivamente en la TRANSFORMACIÓN de la persona y su realidad (ej: paz mental, libertad, orgullo, reconocimiento, familia). Cada solución debe ser un objeto con { "title": "...", "description": "...", "avatarId": number }.

        Instrucciones para learningModules (Transformaciones de Valor):
        Genera exactamente 9 bloques de transformación (3 por cada avatar) que respondan directamente a los dolores (pains) generados. 
        REGLA CRÍTICA DE COHERENCIA Y TRANSFORMACIÓN: Prohibido inventar temas técnicos, capítulos de un curso o módulos educativos. Cada título y descripción debe ser el BENEFICIO VITAL o la TRANSFORMACIÓN HUMANA que el usuario "descubrirá" para resolver su dolor. 
        Ejemplo de enfoque correcto: "Aprenderás a construir la libertad que tus hijos merecen" en lugar de "Aprenderás técnica de marketing".
        Usa un lenguaje de descubrimiento y promesa (ej: "Descubrirás el camino hacia...", "El mapa exacto para recuperar tu...", "La clave definitiva para dejar de sentir..."). Cada módulo debe tener la siguiente estructura: 
        { "title": "...", "description": "...", "icon": "Brain|Target|Users|TrendingUp|Zap|Star|Shield", "color": "text-blue-400|text-emerald-400|text-purple-400", "bg": "from-[#0f172a] via-[#0b1120] to-[#090e1a]|from-[#061a14] via-[#04120e] to-[#030d0a]|from-[#1a0b2e] via-[#12061d] to-[#0f041d]", "border": "border-white/10", "glow": "hover:shadow-blue-500/20|hover:shadow-emerald-500/20|hover:shadow-purple-500/20", "avatarId": number }.
        Reglas de estilo (OBLIGATORIO - USAR DEGRADADOS SÓLIDOS Y OSCUROS):
        - Avatar 1: Usa tonos Blue/Cyan (color: text-blue-400, bg: from-[#0f172a] via-[#0b1120] to-[#090e1a], border: border-white/10, glow: hover:shadow-blue-500/20).
        - Avatar 2: Usa tonos Emerald/Green (color: text-emerald-400, bg: from-[#061a14] via-[#04120e] to-[#030d0a], border: border-white/10, glow: hover:shadow-emerald-500/20).
        - Avatar 3: Usa tonos Purple/Pink (color: text-purple-400, bg: from-[#1a0b2e] via-[#12061d] to-[#0f041d], border: border-white/10, glow: hover:shadow-purple-500/20).

        INSTRUCCIONES PARA CONTENIDOS DE BLOG content (OBLIGATORIO):
        ${isCloned 
            ? "NO GENERES ARTÍCULOS. Devuelve estrictamente un array vacío [] en la clave 'content' del JSON final." 
            : "Genera 7 articulos de blog optimizados para SEO que tenga que ver con el producto especificamente, usa un volumen de keyword de entre 100 a 1000, añade palabras claves realistas con intension de busqueda informativa, titulos que no superen los 60 caracteres, dirigidos a ser informativos en forma de pregunta y optimizados para generar el maximo ctr posible y atraer audiencia cualificada, 3 articulos iniciales enfocados en el primer avatar definido, 2 articulos enfocados en el segundo avatar definido, 2 ultimos articulos enfocados en el tercer avatar definido"
        }
        

        INSTRUCCIONES PARA CONTENIDOS DE EMAIL emails (OBLIGATORIO):
       Actúa como un Copywriter Senior experto en Marketing de Respuesta Directa. Tu misión es redactar una secuencia de titulos y contenidos de 7 correos electrónicos (Día 1 al Día 7) diseñada para convertir prospectos en compradores del producto.
        
        ESTRATEGIA DE ENLACES (CRÍTICA):
        - Días 1, 2 y 3: El objetivo es la ENTREGA DE VALOR. Los correos deben dirigir al Lead Magnet (Clase Gratuita/Regalo). Los títulos y el cuerpo deben generar deseo de consumo del regalo.
        - Días 4, 5, 6 y 7: El objetivo es la CONVERSIÓN/VENTA. Los correos deben dirigir al Hotlink (Página de Ventas/Checkout). Los títulos y el cuerpo deben enfocarse en la oferta, beneficios del producto de pago, escasez y urgencia.
        
        REGLA DE COHERENCIA DE VERBOS:
        Si el Lead Magnet es un PDF, Guía o Ebook, utiliza verbos como "Descargar", "Leer", "Revisar el archivo".
        Si el Lead Magnet es una Clase, Webinar o VSL, utiliza verbos como "Ver ahora", "Asistir", "Reproducir", "Mirar".
        El correo del Día 1 y los recordatorios posteriores deben ser consistentes con esta acción.
        
        para ello el sistema tendra el siguiente enfoque segun los dias de envio.

        Día 1: Bienvenida + entrega de valor. Cumple la promesa inicial. Entrega al usuario el acceso a su Lead Magnet con entusiasmo. Establece autoridad y reciprocidad inmediata.
        Día 2: Romper creencias. Ataca el "No puedo" o "Esto no es para mí" antes de que el cliente lo piense. Limpia el camino mental del prospecto.
        Día 3: Historia / conexión emocional. El cerebro humano ama las historias. Crea empatía y hace que el problema sea "humano", no técnico, conectando con las emociones del avatar.
        Día 4: Educación + autoridad. Demuestras que sabes de lo que hablas. Aquí es donde el usuario confía en tu solución y te posicionas como el experto definitivo.
        Día 5: Objeciones. Respondes al "Es muy caro", "No tengo tiempo", etc. Es una venta preventiva que elimina las barreras finales.
        Día 6: Caso de éxito. Prueba social. "Si a él le funcionó, a mí también". Es el gatillo mental más potente para generar deseo y credibilidad.
        Día 7: Cierre / oferta. Escasez y Urgencia. El empujón final para tomar la decisión. Llamado a la acción agresivo pero profesional.

        ten en cuenta la siguiente estructura para generar el json
        
                id: identificador del correo,
                day: dia del correo electronico,
                subject: titulo experto que incremente el CTR usa iconos atractivos un lenguaje cercano y que sea enfocado a entregar el valor del leadmagnet y que este en relacion con el usuario,
                type: tipo de objetivo del correo entrega de valor agitacion del dolor etc,
                objective: establece el objetivo del correo (Con base en la explicacion anterior que te di de cada tipo de correo) hazlo bien explicado como instruccion para que luego la ia sepa como construir el correo electronico completo,

        INSTRUCCIONES PARA TESTIMONIOS testimonials (OBLIGATORIO):
        Genera exactamente 3 testimonios enfocados ÚNICAMENTE en el valor recibido por el regalo (Lead Magnet) (Tipo: "${leadMagnetType}").
        REGLAS DE ORO:
        - PROHIBIDO usar la palabra "Curso" o dar a entender que es un producto de pago. El testimonio debe validar el material gratuito que acaban de recibir/ver.
        - Si el Lead Magnet es "Clase/Webinar/Video": El testimonio debe mencionar lo reveladora que fue la sesión y lo que aprendió al verla.
        - Si el Lead Magnet es "PDF/Guía/Ebook": El testimonio debe mencionar lo práctico que fue leer el documento y los puntos clave que descubrió.
        - Debes usar los nombres exactos de los 3 AVATARES generados arriba.
        - El texto de cada testimonio debe narrar en primera persona cómo el material gratuito empezó a solucionar el "pain" (dolor) específico de ese avatar.
        - Lenguaje natural, co rto (máximo 50 palabras) y con tono de mensaje de agradecimiento espontáneo.



Instrucciones para landingPageTabs (Copywriting de Alta Conversión):

Tu misión es crear el Titular (h1) y Subtitular (h2) más persuasivos posibles para el Lead Magnet (${leadMagnetType}) del nicho (${niche}).

OBJETIVO PRINCIPAL:
El copy debe hacer que el usuario sienta:
"Esto fue hecho exactamente para mí".

Debe sentirse:
- humano
- específico
- creíble
- emocionalmente preciso
- naturalmente persuasivo

--------------------------------------------------
REGLAS DE ORO (LO QUE NO DEBES HACER)
--------------------------------------------------

- PROHIBIDO: Usar años (2025, 2026, etc.).
- PROHIBIDO: Usar palabras como "Curso", "Venta", "Producto de pago", "Libertad financiera", "Fácil", "Rápido".
- PROHIBIDO: Usar clichés vacíos o frases típicas de marketing.
- PROHIBIDO: Usar verbos de esfuerzo pesado como "Estudia", "Aprende", "Trabaja duro".
- PROHIBIDO: Sonar como un anuncio genérico de internet.
- PROHIBIDO: Usar frases que parezcan escritas por IA.
- PROHIBIDO: Estructuras repetitivas, robóticas o demasiado perfectas.
- PROHIBIDO: Copiar, parafrasear o imitar los ejemplos de referencia.
- PROHIBIDO: Imitar estructura, ritmo o composición de los ejemplos.
- PROHIBIDO: Promesas exageradas o poco creíbles.
- PROHIBIDO: Frases demasiado abstractas, confusas o sobrecargadas.

--------------------------------------------------
PSICOLOGÍA DEL MENSAJE
--------------------------------------------------

Antes de escribir:

- Identifica el deseo principal del avatar.
- Identifica la frustración que quiere eliminar.
- Identifica cómo quiere sentirse después de lograr el resultado.
- Detecta automáticamente la emoción dominante del nicho (${niche}).
- Detecta el nivel de sofisticación del mercado.
- Construye el mensaje alrededor de UNA emoción principal, no varias al mismo tiempo.

--------------------------------------------------
MECANISMO DE PERSUASIÓN
--------------------------------------------------

Elige automáticamente el mecanismo de persuasión más efectivo según el nicho:

- Estatus
- Identidad
- Validación
- Exclusividad
- Ventaja competitiva
- Autoridad
- Deseo aspiracional
- Pertenencia
- Seguridad
- Alivio emocional

--------------------------------------------------
DIRECCIONES CREATIVAS (LO QUE SÍ DEBES HACER)
--------------------------------------------------

- Céntrate en la transformación REAL del usuario.
- Habla de resultados tangibles y nueva realidad.
- Usa lenguaje emocional y específico del nicho (${niche}).
- Genera curiosidad natural sin sonar artificial.
- Busca un ángulo fresco y diferenciador sin perder claridad.
- Haz que el mensaje se entienda instantáneamente al primer vistazo.
- Prioriza claridad y credibilidad antes que creatividad excesiva.
- El resultado debe sentirse ambicioso pero alcanzable.
- El texto debe sentirse humano, natural y creíble.

--------------------------------------------------
REFERENCIAS DE ESTILO
--------------------------------------------------

Usa estas referencias SOLO para entender el nivel emocional y persuasivo esperado.

NO copies frases.
NO imites estructuras.
NO reutilices ritmos.

Referencias de estilo:
- Autoridad + Resultado tangible
- Curiosidad técnica
- Estatus profesional
- Transformación aspiracional
- Deseo oculto del avatar

--------------------------------------------------
PROCESO INTERNO OBLIGATORIO
--------------------------------------------------

Antes de generar el resultado final:

- Crea mentalmente 3 ángulos distintos.
- Evalúa cuál es el más fuerte, específico y menos genérico.
- Entrega únicamente la mejor versión.

--------------------------------------------------
PRIORIDADES
--------------------------------------------------

1. Deseo principal del avatar.
2. Transformación concreta.
3. Claridad instantánea.
4. Credibilidad.
5. Curiosidad natural.
6. Originalidad estratégica.

--------------------------------------------------
LO MÁS IMPORTANTE
--------------------------------------------------

- Usa imágenes mentales concretas y situaciones reales del nicho.
- Evita frases aspiracionales vacías.
- El resultado debe sentirse visible, social y tangible.
- Prioriza escenas reales sobre promesas abstractas.

El copy debe parecer escrito por alguien que trabaja dentro del nicho, no por un marketer.


--------------------------------------------------
OUTPUT
--------------------------------------------------

Genera para:
landingPageTabs -> hero

h1:
- Debe capturar atención inmediata.
- Debe activar el deseo principal del avatar.
- Debe generar curiosidad natural.
- Máximo ideal: 115 caracteres.
- Puede superar ligeramente el límite si el impacto lo justifica.
- debe tener una longitud de 100 caracteres

h2:
- debe tener una longitud de Entre 200 y 240 caracteres.
- Debe hacer la promesa más creíble.
- Debe reducir dudas internas y miedo al fracaso.
- Debe explicar cómo el Lead Magnet (${leadMagnetType}) transforma la situación actual del usuario.
- Debe aumentar el deseo inmediato por acceder al regalo.
- Debes incluir el nombre exacto del nicho, por ejemplo si es Microblading de Cejas ponerlo igual no microblading pelo a pelo, si es Resina Epoxica en Suelos ponerlo asi y no ponerlo Resina para pisos espejo etc







        En thankYouPageTabs, genera copy persuasivo para 3 momentos:
            header: Un titular de confirmación inmediata (ej: '¡Lugar Reservado!').
            action: Una instrucción directa para unirse al grupo de WhatsApp (ej: 'Únete a la comunidad para recibir soporte').
            magnet: Copy específico para la entrega del Lead Magnet (PDF o Clase) que resuelva un dolor de la audiencia con un titular que genere deseo de consumo inmediato.



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
            "brandName": "Genera un nombre de negocio creativo de 2 a 3 palabras relacionado con el nicho (ej: 'MicroBrows Academy', 'Beauty Pro Studio'). REGLA CRÍTICA: NO uses solo el nombre de la profesora (ej: 'Ariana Zamora'). Debe sonar como una marca o empresa profesional.",
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
                        { "label": "Producto", "value": "${productName}", "icon": "BookOpen", "color": "text-pink-400", "bg": "from-[#2e0b1a] via-[#1d0612] to-[#1d0412]", "border": "border-white/10" },
                        { "label": "Nicho", "value": "${niche}", "icon": "Sparkles", "color": "text-purple-400", "bg": "from-[#1a0b2e] via-[#12061d] to-[#0f041d]", "border": "border-white/10" }
                    ] 
                }
            }
          },
          "teacher": {
            "name": "Nombre real del profesor/a extraído de la descripción. REGLA CRÍTICA: Si no encuentras un nombre real en la descripción, escribe estrictamente 'Tu Profesor' o 'Tu Profesora'. PROHIBIDO INVENTAR NOMBRES.",
            "title": "Título profesional extraído (ej: Especialista en Microblading). Si no hay, usa uno genérico profesional acorde al nicho.",
            "bio": "Breve biografía persuasiva de 2-3 líneas extraída de su experiencia. Si no hay, crea una basada en su autoridad como experto en el nicho.",
            "image": "URL de imagen de perfil del instructor (randomuser.me)",
            "transformation_tip": "Un consejo de vida poderoso relacionado con el nicho"
          },
          "avatars": [
            {
              "id": 1,
              "name": "Nombre Realista Latino del Avatar 1 (Inventa un Nombre Nuevo)",
              "image": "URL de imagen de perfil (randomuser.me)",
              "archetype": "Emprendedor Activo",
              "age": "Rango de edad",
              "quote": "Frase que define su mentalidad",
              "pain": "Dolor principal",
              "transformation_title": "Título de transformación altamente persuasivo (Ej: 'Si buscas crear tu propio negocio...')",
              "daily_manifestation": "Cómo experimenta el dolor en su día a día",
              "desire": "Deseo profundo",
              "emotional_reason": "Para qué emocional de su deseo",
              "objection": "Miedo principal al éxito o al fallo",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "motivations": { "dinero": "Una sola frase persuasiva de beneficio adaptado acerca de cómo el dinero/retorno de inversión impulsa la decisión de este avatar (ej: 'Retorno de inversión garantizado con su primer set de clientas.')", "tiempo": "Una sola frase persuasiva de beneficio adaptado sobre cómo el ahorro de tiempo le impulsa (ej: 'Establecer un flujo de trabajo optimizado para atender en menos de 90 minutos.')", "estatus": "Una sola frase persuasiva sobre cómo el estatus/prestigio o reconocimiento le motiva (ej: 'Certificación oficial de alta gama para destacar de la competencia convencional.')", "seguridad": "Una sola frase persuasiva sobre la base de acompañamiento o soporte técnico para reducir riesgos (ej: 'Soporte uno a uno para resolver problemas reales en el inicio del negocio.')" }
            },
            {
              "id": 2,
              "name": "Nombre Realista Latino del Avatar 2  (Inventa un Nombre Nuevo)",
              "image": "URL de imagen de perfil (randomuser.me)",
              "archetype": "Escéptico con Miedo",
              "age": "Rango de edad",
              "quote": "Frase de duda o desconfianza",
              "pain": "Dolor principal",
              "transformation_title": "Título de transformación altamente persuasivo (Ej: 'Si buscas crear tu propio negocio...')",
              "daily_manifestation": "Cómo experimenta el dolor en su día a día",
              "desire": "Deseo profundo",
              "emotional_reason": "Para qué emocional de su deseo",
              "objection": "Miedo al fraude o mala inversión",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "motivations": { "dinero": "Una sola frase persuasiva de beneficio mitigando el miedo a perder dinero o garantizando retorno (ej: 'Garantía de reembolso o método blindado para proteger su capital.')", "tiempo": "Una sola frase persuasiva sobre cómo evitar perder tiempo en métodos que no sirven (ej: 'Ir al grano con un sistema probado sin rodeos teóricos innecesarios.')", "estatus": "Una sola frase persuasiva sobre el estatus de tener un negocio seguro y validado (ej: 'Validación por expertos que te posiciona como un profesional serio.')", "seguridad": "Una sola frase persuasiva sobre blindar su seguridad y reducir la vulnerabilidad (ej: 'Acompañamiento cercano anticaídas para asegurar tus primeros pasos prácticos.')" }
            },
            {
              "id": 3,
              "name": "Nombre Realista Latino del Avatar 3 (Inventa un Nombre Nuevo)",
              "image": "URL de imagen de perfil (randomuser.me)",
              "archetype": "Persona buscando Reinvención",
              "age": "Rango de edad",
              "quote": "Frase de cansancio y esperanza",
              "pain": "Dolor principal",
              "transformation_title": "Título de transformación altamente persuasivo (Ej: 'Si buscas crear tu propio negocio...')",
              "daily_manifestation": "Cómo experimenta el dolor en su día a día",
              "desire": "Deseo profundo",
              "emotional_reason": "Para qué emocional de su deseo",
              "objection": "Miedo a empezar de cero",
              "interests": "Intereses específicos",
              "behavior": "Comportamiento en canales digitales",
              "motivations": { "dinero": "Una sola frase impulsora sobre generar ingresos extras estables (ej: 'Generar ingresos estables desde casa para lograr libertad financiera real.')", "tiempo": "Una sola frase impulsora sobre flexibilidad de tiempo para su vida o familia (ej: 'Flexibilidad horaria absoluta para pasar más tiempo con tus hijos o seres queridos.')", "estatus": "Una sola frase impulsora de satisfacción, orgullo y crecimiento personal (ej: 'Sentir la satisfacción y el orgullo de transicionar hacia una profesión propia.')", "seguridad": "Una sola frase impulsora sobre la seguridad de empezar un nuevo camino con guía clara (ej: 'Guía paso a paso adaptada para principiantes absolutos sin experiencia previa.')" }
            }
          ],



          psychology: {
            pains: [
                { "text": "Dolor 1 específico para Avatar 1", "avatarId": 1 },
                { "text": "Dolor 2 específico para Avatar 1", "avatarId": 1 },
                { "text": "Dolor 3 específico para Avatar 1", "avatarId": 1 },
                { "text": "Dolor 1 específico para Avatar 2", "avatarId": 2 },
                { "text": "Dolor 2 específico para Avatar 2", "avatarId": 2 },
                { "text": "Dolor 3 específico para Avatar 2", "avatarId": 2 },
                { "text": "Dolor 1 específico para Avatar 3", "avatarId": 3 },
                { "text": "Dolor 2 específico para Avatar 3", "avatarId": 3 },
                { "text": "Dolor 3 específico para Avatar 3", "avatarId": 3 }
            ],
            "solutions": [
                { "title": "Solución 1 para Avatar 1", "description": "...", "avatarId": 1 },
                { "title": "Solución 2 para Avatar 1", "description": "...", "avatarId": 1 },
                { "title": "Solución 3 para Avatar 1", "description": "...", "avatarId": 1 },
                { "title": "Solución 1 para Avatar 2", "description": "...", "avatarId": 2 },
                { "title": "Solución 2 para Avatar 2", "description": "...", "avatarId": 2 },
                { "title": "Solución 3 para Avatar 2", "description": "...", "avatarId": 2 },
                { "title": "Solución 1 para Avatar 3", "description": "...", "avatarId": 3 },
                { "title": "Solución 2 para Avatar 3", "description": "...", "avatarId": 3 },
                { "title": "Solución 3 para Avatar 3", "description": "...", "avatarId": 3 }
            ],
            awarenessStages: {
                stage1_pain: "Analiza el nivel de consciencia del avatar sobre su dolor principal en este nicho específico.",
                stage2_solution: "Analiza la percepción del avatar sobre las soluciones existentes y por qué esta es la ideal.",
                stage3_barrier: "Analiza la barrera mental o duda técnica específica que impide al avatar comprar ahora mismo."
            },
            learningModules: [
                { "title": "Módulo 1 para Avatar 1", "description": "...", "icon": "Brain", "color": "text-blue-400", "bg": "from-[#0f172a] via-[#0b1120] to-[#090e1a]", "border": "border-white/10", "glow": "hover:shadow-blue-500/20", "avatarId": 1 },
                { "title": "Módulo 2 para Avatar 1", "description": "...", "icon": "Target", "color": "text-blue-400", "bg": "from-[#0f172a] via-[#0b1120] to-[#090e1a]", "border": "border-white/10", "glow": "hover:shadow-blue-500/20", "avatarId": 1 },
                { "title": "Módulo 3 para Avatar 1", "description": "...", "icon": "Zap", "color": "text-blue-400", "bg": "from-[#0f172a] via-[#0b1120] to-[#090e1a]", "border": "border-white/10", "glow": "hover:shadow-blue-500/20", "avatarId": 1 },
                { "title": "Módulo 1 para Avatar 2", "description": "...", "icon": "Shield", "color": "text-emerald-400", "bg": "from-[#061a14] via-[#04120e] to-[#030d0a]", "border": "border-white/10", "glow": "hover:shadow-emerald-500/20", "avatarId": 2 },
                { "title": "Módulo 2 para Avatar 2", "description": "...", "icon": "Star", "color": "text-emerald-400", "bg": "from-[#061a14] via-[#04120e] to-[#030d0a]", "border": "border-white/10", "glow": "hover:shadow-emerald-500/20", "avatarId": 2 },
                { "title": "Módulo 3 para Avatar 2", "description": "...", "icon": "Users", "color": "text-emerald-400", "bg": "from-[#061a14] via-[#04120e] to-[#030d0a]", "border": "border-white/10", "glow": "hover:shadow-emerald-500/20", "avatarId": 2 },
                { "title": "Módulo 1 para Avatar 3", "description": "...", "icon": "TrendingUp", "color": "text-purple-400", "bg": "from-[#1a0b2e] via-[#12061d] to-[#0f041d]", "border": "border-white/10", "glow": "hover:shadow-purple-500/20", "avatarId": 3 },
                { "title": "Módulo 2 para Avatar 3", "description": "...", "icon": "Sparkles", "color": "text-purple-400", "bg": "from-[#1a0b2e] via-[#12061d] to-[#0f041d]", "border": "border-white/10", "glow": "hover:shadow-purple-500/20", "avatarId": 3 },
                { "title": "Módulo 3 para Avatar 3", "description": "...", "icon": "Lightbulb", "color": "text-purple-400", "bg": "from-[#1a0b2e] via-[#12061d] to-[#0f041d]", "border": "border-white/10", "glow": "hover:shadow-purple-500/20", "avatarId": 3 }
            ]
        },



        landingPageTabs: {
            hero: {
                label: "1. Encabezado",
                title: "Promesa de Valor (Hero Section)",
                type: 'hero',
                topTagline: "Genera una línea de impacto superior (badge) de 3 a 5 palabras. REGLA CRÍTICA: Debe usar emojis y ganchos de alta conversión: 🔥 Urgencia, 🚀 Resultados, 💎 Exclusividad, 🎯 Curiosidad o ⚠️ Escasez. Ejemplos: '🔥 ACCESO 100% GRATIS', '🚀 MÉTODO REVELADO', '💎 SOLO PARA MIEMBROS'.",
                h1: "Genera el titular h1 de impacto bajo las directrices de Alta Conversión.",
                h2: "Genera el subtítulo h2 que refuerce la promesa de valor."
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








    "content": ${isCloned ? "[]" : `[
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
    ]`},





    "emails": {
      "nurture": [
        {
                id: 1,
                day: "Día 1",
                subject: "🎁 ¡Aquí tienes lo prometido! (Y una sorpresa especial)",
                type: "Bienvenida + Valor",
                objective: "Entrega del Lead Magnet y bienvenida calurosa. Establecer autoridad y reciprocidad inmediata."
            },
            {
                id: 2,
                day: "Día 2",
                subject: "🤔 La verdad que nadie te cuenta sobre [Nicho]",
                type: "Romper Creencias",
                objective: "Atacar mitos comunes y barreras mentales que impiden al avatar tomar acción."
            },
            {
                id: 3,
                day: "Día 3",
                subject: "✨ Mi historia personal con [Problema]",
                type: "Historia / Conexión",
                objective: "Conectar emocionalmente mediante una historia vulnerable que humanice la marca."
            },
            {
                id: 4,
                day: "Día 4",
                subject: "🎓 Cómo dominar [Habilidad] sin morir en el intento",
                type: "Educación + Autoridad",
                objective: "Entregar contenido educativo de alto valor que posicione al experto como la autoridad."
            },
            {
                id: 5,
                day: "Día 5",
                subject: "🛑 ¿Es esto para ti? (Respondemos tus dudas)",
                type: "Objeciones",
                objective: "Rebatir las objeciones más comunes (precio, tiempo, capacidad) de forma preventiva."
            },
            {
                id: 6,
                day: "Día 6",
                subject: "🔥 Resultados reales: Cómo [Nombre] logró [Resultado]",
                type: "Caso de éxito",
                objective: "Presentar un caso de éxito potente como prueba social definitiva."
            },
            {
                id: 7,
                day: "Día 7",
                subject: "⚠️ ÚLTIMA LLAMADA: Tu transformación empieza ahora",
                type: "Cierre / Oferta",
                objective: "Llamado a la acción final con escasez y urgencia real para cerrar la venta."
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
        { "name": "Nombre de la persona", "image": "URL de imagen de perfil (randomuser.me)", "text": "Texto del testimonio" }
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

        // Post-procesamiento de Imágenes (Garantizar randomuser.me para todos)
        process.stdout.write(`🖼️ [PIPELINE IA] Post-procesando imágenes de avatares, testimonios e instructor...\n`);
        
        // 1. Instructor
        if (!step1Data.teacher.image || !step1Data.teacher.image.includes('randomuser.me')) {
            const gender = Math.random() > 0.5 ? 'women' : 'men';
            const id = Math.floor(Math.random() * 99);
            step1Data.teacher.image = `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
        }

        // 2. Avatares 
        if (step1Data.avatars && Array.isArray(step1Data.avatars)) {
            step1Data.avatars.forEach((avatar, index) => {
                const gender = index === 0 ? 'women' : (index === 1 ? 'men' : 'women');
                const id = 10 + index + Math.floor(Math.random() * 5); // Diferenciar por index
                if (!avatar.image || !avatar.image.includes('randomuser.me')) {
                    avatar.image = `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
                }
            });
        }

        // 3. Testimonios
        if (step1Data.testimonials && Array.isArray(step1Data.testimonials)) {
            step1Data.testimonials.forEach((t, index) => {
                // Si existe el avatar en la misma posición, copiamos su foto
                if (step1Data.avatars && step1Data.avatars[index] && step1Data.avatars[index].image) {
                    t.image = step1Data.avatars[index].image;
                } else {
                    // Fallback por si acaso
                    const gender = Math.random() > 0.5 ? 'women' : 'men';
                    const id = 30 + index + Math.floor(Math.random() * 10);
                    if (!t.image || !t.image.includes('randomuser.me')) {
                        t.image = `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
                    }
                }
            });
        }

        process.stdout.write(`✅ [PIPELINE IA] Etapa 1 + Psicología (con imágenes) finalizada con éxito para ${productName}.\n`);

    } catch (err) {
        process.stdout.write(`❌ [PIPELINE ERROR ETAPA 1 IA]: ${err.message}\n`);
        throw err;
    }

    try {
        // 5. CONSOLIDACIÓN FINAL
        process.stdout.write(`[PIPELINE DEBUG] Ensamblando JSON final...\n`);
        let copiedCommercial = null;

        // Inyectar / Preservar Perfil Demográfico
        try {
            let demogSource = null;
            if (masterParentId) {
                const [masterRows] = await pool.query("SELECT strategy_json FROM projects WHERE id = ?", [masterParentId]);
                if (masterRows.length > 0 && masterRows[0].strategy_json) {
                    demogSource = typeof masterRows[0].strategy_json === 'string' ? JSON.parse(masterRows[0].strategy_json) : masterRows[0].strategy_json;
                }
            } else {
                const [existingRows] = await pool.query("SELECT strategy_json FROM projects WHERE id = ?", [projectId]);
                if (existingRows.length > 0 && existingRows[0].strategy_json) {
                    demogSource = typeof existingRows[0].strategy_json === 'string' ? JSON.parse(existingRows[0].strategy_json) : existingRows[0].strategy_json;
                }
            }

            // SI EXISTE UNA ESTRATEGIA PREVIA (Misma o del Master), COPIAMOS AVATARES Y PSICOLOGÍA DIRECTAMENTE SIN PASAR POR IA
            if (demogSource) {
                if (demogSource.avatars && Array.isArray(demogSource.avatars) && demogSource.avatars.length > 0) {
                    process.stdout.write(`🧬 [PIPELINE] Copiando directamente avatares originales guardados/maestros sin intervención de IA.\n`);
                    step1Data.avatars = demogSource.avatars;
                }
                if (demogSource.psychology) {
                    process.stdout.write(`🧬 [PIPELINE] Copiando psicología guardada/maestra, pero preservando dolores y soluciones nuevos de la IA.\n`);
                    
                    // Almacenamos dolores y soluciones frescos generados de forma única por la IA para este subproyecto
                    const freshPains = step1Data.psychology?.pains;
                    const freshSolutions = step1Data.psychology?.solutions;
                    
                    // Copiamos la psicología guardada
                    step1Data.psychology = demogSource.psychology;
                    
                    // Reestablecemos con carácter obligatorio los nuevos dolores y soluciones generados por la IA
                    if (freshPains && Array.isArray(freshPains) && freshPains.length > 0) {
                        step1Data.psychology.pains = freshPains;
                    }
                    if (freshSolutions && Array.isArray(freshSolutions) && freshSolutions.length > 0) {
                        step1Data.psychology.solutions = freshSolutions;
                    }
                }
                if (demogSource.commercial) {
                    process.stdout.write(`🧬 [PIPELINE] Copiando directamente datos comerciales guardados/maestros sin intervención de IA.\n`);
                    copiedCommercial = demogSource.commercial;
                }
            }
        } catch (dbErr) {
            console.error("Error bypassing AI for avatars and psychology:", dbErr);
        }
        
        const finalJson = { 
            meta: step1Data.meta,
            teacher: step1Data.teacher,
            avatars: step1Data.avatars,
            psychology: step1Data.psychology, // Sincronizado: Usando datos de Step 1 (IA)
            commercial: copiedCommercial,
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
};

/**
 * Genera el contenido de una secuencia de correos electrónicos de forma masiva
 */
export const generateEmailSequenceContent = async (projectId, sequenceData, type = 'conversion') => {
    const [rows] = await pool.query(
        "SELECT niche, product_name, description, brand_tone, strategy_json FROM projects WHERE id = ?",
        [projectId]
    );

    if (rows.length === 0) throw new Error("Proyecto no encontrado.");
    const project = rows[0];
    
    let teacherInfo = { name: "la profesora", transformation_tip: "Enfócate en tu crecimiento personal hoy." };
    let avatarInfo = "";
    if (project.strategy_json) {
        try {
            const strategy = typeof project.strategy_json === 'string' ? JSON.parse(project.strategy_json) : project.strategy_json;
            if (strategy.teacher) {
                teacherInfo = strategy.teacher;
            }
            if (strategy.avatars && Array.isArray(strategy.avatars)) {
                avatarInfo = strategy.avatars.map(a => `- ${a.name} (${a.archetype}): ${a.pain}`).join('\n');
            }
        } catch (e) {
            console.error("Error parseando strategy_json para teacherInfo/avatarInfo:", e);
        }
    }

    let articlesInfo = "";
    if (type === 'nurturing') {
        try {
            const [articles] = await pool.query(
                "SELECT title, content_json FROM blog_articles WHERE project_id = ? LIMIT 3",
                [projectId]
            );
            if (articles.length > 0) {
                articlesInfo = "\nARTÍCULOS DE BLOG PARA NUTRICIÓN:\n" + articles.map(a => `- ${a.title}`).join('\n');
            }
        } catch (e) {
            console.error("Error obteniendo artículos para nutrición:", e);
        }
    }

    const prompt = `Eres un Copywriter experto en Email Marketing y Ventas de Respuesta Directa. 
    Tu tarea es generar el contenido de una secuencia de correos electrónicos de tipo "${type === 'conversion' ? 'CONVERSIÓN (VENTA DIRECTA)' : 'NUTRICIÓN (VALOR Y CONFIANZA)'}" para el producto "${project.product_name}" en el nicho "${project.niche}".
    Descripción del producto: "${project.description}".
    Tono de marca: "${project.brand_tone}".
    Información de la profesora: "${teacherInfo.name}" (${teacherInfo.title || 'Especialista'}).
    
    REGLAS GLOBALES DE COPYWRITING (OBLIGATORIAS):
    - Tono: ${GLOBAL_CONFIG.tone}
    - Formato: ${GLOBAL_CONFIG.formatting}
    - Evitar: ${GLOBAL_CONFIG.avoid}

    AVATARES OBJETIVO:
    ${avatarInfo || 'Público general interesado en el nicho.'}
    ${articlesInfo}

    ESTRUCTURA ESTRATÉGICA POR DÍA (BLUEPRINTS):
    ${sequenceData.map((s, i) => {
        const blueprint = EMAIL_BLUEPRINTS[s.pilarType] || EMAIL_BLUEPRINTS['default'];
        return `
        DÍA ${s.dayIndex} - PILAR: ${s.pilarType}
        - Objetivo Psicológico: ${blueprint.goal}
        - Estructura Obligatoria: ${blueprint.structure}
        - Tips de Copywriting: ${blueprint.copywritingTips}
        - TIPO DE ENLACE: ${s.redirectType === 'lead_magnet' ? 'REGALO / LEAD MAGNET (Clase/PDF)' : 'OFERTA / HOTLINK (Venta)'}
        ${blueprint.constraints ? `- RESTRICCIONES ESPECÍFICAS: ${blueprint.constraints}\n` : ''}
        ${blueprint.example ? `- EJEMPLO DE REFERENCIA (Mimetiza este estilo, ritmo y estructura, pero adáptalo al producto real):\n${blueprint.example}\n` : ''}
        - URL de Redirección: ${s.redirectUrl || '[LINK]'}
        `;
    }).join('\n')}
    
    INSTRUCCIONES DE FORMATO Y ESTILO (OBLIGATORIAS):
    - Retorna un array JSON con los objetos correspondientes a cada día.
    - Cada objeto debe tener: "dayIndex" y "contentHtml" (el cuerpo del correo en formato HTML limpio).
    - SALUDO: Comienza siempre el correo con "Hola [Firstname]," para asegurar la personalización.
    - PÁRRAFOS CORTOS: Todo el contenido debe estar dividido en párrafos cortos de máximo 2 a 3 líneas para facilitar la lectura profesional. Usa etiquetas <p> para cada párrafo.
    - RESALTADO: Usa etiquetas <strong> para poner en negrita conceptos clave, beneficios, promesas y frases de alto impacto. No abuses, pero asegúrate de que lo más importante destaque.
    - BOTÓN CTA: Incluye un botón de llamado a la acción (CTA) llamativo. Usa una etiqueta <a href="[URL_DE_REDIRECCION_DEL_DIA]"> con los siguientes estilos inline: 
      display: inline-block; padding: 15px 30px; background-color: #FF5A1F; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 30px 0;
      IMPORTANTE: Debes reemplazar [URL_DE_REDIRECCION_DEL_DIA] con la "URL de Redirección" proporcionada para el día correspondiente. Si la URL proporcionada es solo un slug (ej: "mi-pagina"), anteponle "${process.env.APP_URL || ''}/".
      TEXTO DEL BOTÓN: El texto debe ser coherente con el TIPO DE ENLACE. 
      Si el enlace es REGALO/LEAD MAGNET: Usa "Ver Clase Ahora", "Descargar Regalo", "Acceder al Contenido".
      Si el enlace es OFERTA/HOTLINK: Usa "Quiero mi acceso ahora", "Unirme al programa", "Aprovechar oferta".
      Prohibido usar textos genéricos como "Haga clic aquí".
    - FIRMA: Al final del cuerpo, añade una despedida cordial con el nombre de la profesora "<strong>${teacherInfo.name}</strong>" y en la línea de abajo su cargo "${teacherInfo.title || 'Especialista'}". No añadas textos adicionales de ayuda.
    - POSDATA (Pdta:): Después de la firma, añade una posdata usando estrictamente el prefijo "<strong>Pdta:</strong>". El contenido debe ser un consejo directo y persuasivo basado en: "${teacherInfo.transformation_tip}". No incluyas el texto "Tip de transformación".
    
    REGLAS ADICIONALES:
    - El contenido debe ser altamente persuasivo, usando técnicas de copywriting (AIDA, PAS).
    - No incluyas el asunto en el contentHtml, solo el cuerpo.
    - Asegúrate de que el JSON sea válido y no incluyas markdown adicional.`;

    const response = await generateContent('gemini-3-flash-preview', prompt, {
        responseMimeType: "application/json"
    });

    try {
        const cleaned = cleanJsonString(response);
        // Log de diagnóstico para depurar el formato de la IA
        process.stdout.write(`[GEMINI EMAIL SEQUENCE] Respuesta limpia: ${cleaned.substring(0, 100)}...\n`);
        const data = JSON.parse(cleaned);
        return data;
    } catch (e) {
        console.error("Error parseando JSON de secuencia de emails:", e);
        throw new Error("Error en el formato de respuesta de la IA.");
    }
};

/**
 * Genera un único correo electrónico de nutrición (Evergreen) basado en un artículo de blog.
 * Utiliza el blueprint de 'Evergreen / Nutrición' para mantener la consistencia estratégica.
 */
export async function generateSingleEvergreenEmail(projectId, articleData) {
    const [projectRows] = await pool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
    if (projectRows.length === 0) throw new Error("Proyecto no encontrado");
    const project = projectRows[0];

    // Obtener la landing page asociada para construir la URL correcta
    const [pageRows] = await pool.query(
        "SELECT id, name, custom_domain FROM landing_pages WHERE project_id = ? LIMIT 1",
        [projectId]
    );
    const page = pageRows[0];
    
    // Construir la URL del artículo siguiendo la lógica de MyPages.tsx
    let articleUrl = "#";
    if (page) {
        const articleSlug = articleData.slug || slugify(articleData.title);
        if (page.custom_domain) {
            articleUrl = `https://${page.custom_domain}/blog/${articleSlug}`;
        } else {
            const pageSlug = slugify(page.name);
            articleUrl = `https://aprende.marketing/admin/lp/${page.id}-${pageSlug}/blog/${articleSlug}`;
        }
    }

    // Obtener info de la profesora/avatar si existe
    let teacherInfo = { name: "Tu Equipo", title: "Especialista", transformation_tip: "Empieza hoy mismo." };
    if (project.strategy_json) {
        try {
            const strategy = typeof project.strategy_json === 'string' ? JSON.parse(project.strategy_json) : project.strategy_json;
            if (strategy.teacher) teacherInfo = strategy.teacher;
        } catch (e) {
            console.error("Error parseando strategy_json para teacherInfo:", e);
        }
    }

    const blueprint = EMAIL_BLUEPRINTS['Evergreen / Nutrición'];
    
    const prompt = `
        Actúa como un experto en Email Marketing y Copywriting de Respuesta Directa.
        Tu objetivo es redactar un correo electrónico persuasivo para invitar a un prospecto a leer el siguiente artículo de blog.
        
        DATOS DEL PROYECTO:
        - Nombre: ${project.name}
        - Producto: ${project.product_name}
        - Descripción: ${project.description}
        - Público Objetivo: ${project.target_audience || 'No especificado'}
        - Nombre del Profesor/Autor: ${teacherInfo.name}
        
        DATOS DEL ARTÍCULO:
        - Título: ${articleData.title}
        - Descripción: ${articleData.description}
        - Contenido (Resumen): ${articleData.contentHtml ? articleData.contentHtml.substring(0, 1500) : 'No disponible'}
        - URL DEL ARTÍCULO (OBLIGATORIA): ${articleUrl}
        
        ESTRATEGIA DEL CORREO (BLUEPRINT):
        - Objetivo: ${blueprint.goal}
        - Estructura: ${blueprint.structure}
        - Tips de Copywriting: ${blueprint.copywritingTips}
        - Restricciones: ${blueprint.constraints}
        
        CONFIGURACIÓN GLOBAL:
        - Tono: ${GLOBAL_CONFIG.tone}
        - Formato: ${GLOBAL_CONFIG.formatting}
        - Evitar: ${GLOBAL_CONFIG.avoid}
        
        INSTRUCCIONES ADICIONALES:
        1. El correo debe ser profesional, empático y generar mucha curiosidad.
        2. Usa [Firstname] para el saludo.
        3. El botón de acción debe decir algo como "Leer artículo completo" o "Ver el post ahora".
        4. DEBES usar la URL DEL ARTÍCULO proporcionada (${articleUrl}) en el atributo href del botón.
        5. Incluye una firma profesional al final con el nombre del autor: <strong>${teacherInfo.name}</strong> y su cargo ${teacherInfo.title}.
        6. Incluye una Posdata (P.S.) persuasiva basada en: ${teacherInfo.transformation_tip}.
        
        Responde estrictamente en formato JSON:
        {
            "subject": "Asunto con emoji",
            "body": "Cuerpo del correo en HTML profesional. Usa <p>, <strong>, <br>. El botón de acción debe estar representado como un enlace con estilo de botón: <a href='${articleUrl}' style='display:inline-block; padding:15px 30px; background-color: #FF5A1F; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 30px 0;'>Texto del Botón</a>"
        }
    `;

    const response = await generateContent('gemini-3-flash-preview', prompt, {
        responseMimeType: "application/json"
    });

    try {
        const cleaned = cleanJsonString(response);
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Error parseando JSON de correo evergreen:", e);
        throw new Error("Error en el formato de respuesta de la IA.");
    }
}
