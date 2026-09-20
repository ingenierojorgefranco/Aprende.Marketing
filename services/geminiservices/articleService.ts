// Refactorización: Creación de servicio para artículos SEO - 22/05/2024 14:30
import { callGeminiBackend, Type } from "./base";
import { Project } from "../../types";

export interface ArticleTitleIdea {
    title: string;
    description: string;
}

export const generateArticleTitles = async (topic: string, objective: string, keyword: string): Promise<ArticleTitleIdea[]> => {
    const prompt = `Genera 4 títulos virales y optimizados para SEO para un artículo sobre: "${topic}".
    Objetivo: "${objective}".
    ${keyword ? `Keyword SEO: "${keyword}"` : ''}

    REGLAS ESTRICTAS DE COPYWRITING:
    1. APLICA ESTEROIDES: Actúa como un experto en copywriting y SEO. Los títulos deben tener un altísimo CTR, ser provocativos pero profesionales, y cumplir con las mejores prácticas SEO.
    2. CONTEXTO: No pierdas el contexto del tema original, pero mejóralo para que sea irresistible.
    3. LONGITUD: Máximo 60 caracteres por título para evitar recortes en Google.
    4. En el campo 'title' devuelve SOLO el texto del título.
    5. NO generes descripciones. Deja el campo 'description' como una cadena vacía "".
    
    Devuelve JSON Array: [{ "title": "...", "description": "" }]`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
            }
        }
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        if (!response.text) throw new Error("No response text");
        return JSON.parse(response.text);
    } catch (e) {
        console.warn("Fallo IA en títulos, usando fallback local.", e);
        return [
            { title: `Guía esencial sobre ${topic}`, description: "" },
            { title: `${topic}: Estrategias probadas`, description: "" },
            { title: `5 secretos de ${topic}`, description: "" },
            { title: `Cómo dominar ${topic}`, description: "" }
        ];
    }
};

export const generateArticleOutline = async (title: string, objective: string): Promise<string[]> => {
    const prompt = `Actúa como un REDACTOR SEO EXPERTO, EDITOR y ANALISTA DE INTENCIÓN DE BÚSQUEDA.
    Analiza internamente el título "${title}" y el objetivo "${objective}" para determinar su intención de búsqueda principal (informativa, cómo hacer, comparativa, cuantitativa/precio, errores, beneficios, etc.).
    Diseña una estructura (outline) OBLIGATORIA de altísima calidad editorial que resuelva de forma óptima esa intención de búsqueda.

    REGLAS ESTRUCTURALES ESTRICTAS:
    1. Genera obligatoriamente entre 5 y 7 encabezados H2 que actúen como pilares estratégicos y lógicos de contenido.
    2. Genera un mínimo de 3 encabezados H3 distribuidos estratégicamente dentro de los H2 para profundizar y desglosar subtemas técnicos o prácticos.
    3. La estructura debe estar pensada para que un lector resuelva su duda por completo, sin repetir conceptos en diferentes encabezados.
    4. Cada encabezado en el array devuelto debe comenzar estrictamente con el nivel correspondiente ("H2: [Texto]" o "H3: [Texto]"). No incluyas "H1: " ya que el título principal se maneja de forma independiente.

    FORMATO DE RESPUESTA:
    Devuelve estrictamente un JSON Array de strings, donde cada string representa un encabezado estructurado, por ejemplo:
    ["H2: ¿Qué es...?", "H2: Cómo funciona...", "H3: Paso 1...", "H3: Paso 2...", "H2: Errores comunes...", "H2: Alternativas..."]
    No agregues introducciones, explicaciones, ni comentarios adicionales fuera del JSON Array.`;

    const schema = {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return [];
    }
};

export const generateFullArticle = async (
    title: string, 
    outline: string[], 
    objective: string, 
    ctaLink: string, 
    keyword: string,
    projectContext?: Project 
): Promise<{ title: string; html: string; metaDescription: string; strategy?: string }> => {
    
    let projectStrategy = "";
    if (projectContext) {
        projectStrategy = `
        CONTEXTO DEL PROYECTO:
        - Tono de Voz: "${projectContext.brandTone}"
        - Producto a promocionar: "${projectContext.productName}"
        - Puntos de Dolor: ${projectContext.painPoints?.join(", ")}.
        - Beneficios Clave: ${projectContext.keyBenefits?.join(", ")}.
        - Público Objetivo (Cliente Ideal): "${projectContext.targetAudience || ''}"
        
        Usa este contexto para que el artículo no sea genérico, sino enfocado en vender este producto específico.
        `;
    }

    const prompt = `Actúa como un REDACTOR SEO EXPERTO, EDITOR Y ANALISTA DE INTENCIÓN DE BÚSQUEDA altamente experimentado.
    Tu objetivo es redactar un artículo extraordinario, riguroso, natural y sumamente competitivo para Aprende.Marketing, diseñado principalmente para resolver la necesidad real de búsqueda del lector de forma tan completa que no tenga que regresar a Google.

    DATOS DE ENTRADA:
    - Título Base: "${title}"
    - Esquema Estructural OBLIGATORIO (H2 y H3): ${JSON.stringify(outline)}
    - Objetivo: "${objective}"
    - Keyword Principal: "${keyword || ''}"
    - Enlace CTA: "${ctaLink}"
    ${projectStrategy}

    DIRECTRICES DE CONTENIDO DE ALTO VALOR ("INFORMATION GAIN"):
    1. ANALIZA LA INTENCIÓN DE BÚSQUEDA: Determina si la consulta es de tipo cuantitativo (precios/costos), tutorial (cómo hacer), conceptual (qué es), comparativo, beneficios, o basado en errores. No expongas este análisis de forma explícita al lector, pero adecúa la información:
       - Si es CUANTITATIVO (coste, cuánto cuesta, ROI, etc.): Proporciona rangos realistas, factores que influyen, supuestos claros o fórmulas matemáticas simples (ej: "20 m² x 70 € = 1.400 €"). Diferencia claramente Facturación vs. Beneficio Bruto vs. Neto. No inventes números exactos de mercado si no los tienes; preséntalos con prudencia o como escenarios hipotéticos ilustrativos claramente identificados.
       - Si es "CÓMO HACER": Prioriza los requisitos, pasos secuenciales numerados, el porqué de cada paso, errores comunes y cómo verificar que el resultado está bien hecho.
       - Si es COMPARATIVO: Compara objetivamente basándote en criterios definidos (costos, dificultad, duración, casos de uso). Usa una tabla HTML limpia y estilizada para resumir. No declares un ganador absoluto si depende de la situación.
       - Si es CONCEPTUAL / "QUÉ ES": Explica qué es, su funcionamiento real, ventajas, límites y diferencias contra conceptos similares.
       - Si es de ERRORES: Sigue el esquema "ERROR -> POR QUÉ OCURRE -> CONSECUENCIA -> CÓMO SOLUCIONARLO".
       - Si es de BENEFICIOS: Detalla el qué, por qué, limitaciones de cada beneficio. Evita listas insustanciales.
    2. NUNCA INVENTES INFORMACIÓN SENSIBLE: Está terminantemente prohibido inventar estadísticas exactas de estudios no existentes, testimonios falsos, premios, acreditaciones oficiales, años específicos de experiencia del instructor o cifras exactas de alumnos a menos que estén provistos explícitamente en el CONTEXTO DEL PROYECTO. Si no tienes la información, exprésala de forma prudente o como un escenario de ejemplo claramente identificado como hipotético.
    3. VALOR ORIGINAL: Añade explicaciones ricas, checklists prácticos, marcos de decisión o tablas HTML limpias donde el tema lo amerite. Cada sección H2 debe aportar información fresca y sustancial; evita repetir las mismas ideas con sinónimos.
    4. EVITA INTRODUCCIONES CLICHÉ Y RELLENO: El artículo DEBE comenzar de inmediato respondiendo o contextualizando de forma directa la intención de búsqueda principal. PROHIBIDO comenzar con generalidades vacías tipo "En los últimos años...", "Cada vez son más las personas...", "En el mundo actual...". Confirma al lector de inmediato que está en el lugar correcto, responde o introduce la solución de inmediato y explica de forma breve y atractiva qué descubrirá en esta lectura.
    5. SENSIVILIDAD DE TEMAS (YMYL): Si el artículo roza temas de salud, finanzas o empleo, sé sumamente riguroso fácticamente. Evita declaraciones categóricas o promesas de ingresos asegurados.
    6. KEYWORD PRINCIPAL: Debe aparecer de manera natural e integrada en el Título SEO, el primer párrafo de introducción, en el slug si corresponde, y sutilmente en el cuerpo. PROHIBIDO el keyword stuffing o repetir artificialmente la palabra clave.
    7. ELEMENTOS OBLIGATORIOS DE FORMATO Y RIQUEZA VISUAL (VIÑETAS, CAJAS Y EJEMPLOS PRÁCTICOS):
       a) LISTAS Y VIÑETAS (<ul> y <ol>): Incluye obligatoriamente al menos 2 listas con viñetas o listas numeradas en las secciones donde enumeres factores, pasos, recomendaciones o checklists para maximizar la legibilidad y escaneo rápido.
       b) CAJAS DESTACADAS DE "CONSEJO PROFESIONAL" O "DATO CLAVE": Inserta al menos 1 o 2 cajas destacadas estilizadas en HTML dentro del artículo para resaltar tips críticos o advertencias de la industria. Usa exactamente esta estructura HTML con estilo integrado:
          <div style="margin: 2.25rem 0; padding: 1.5rem 1.75rem; border-radius: 1.25rem; background-color: rgba(255, 90, 31, 0.08); border: 1px solid rgba(255, 90, 31, 0.25); border-left: 5px solid #FF5A1F;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.25rem;">💡</span>
              <strong style="color: #FF5A1F; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em;">CONSEJO PROFESIONAL:</strong>
            </div>
            <p style="margin: 0; font-size: 1.05rem; color: #d1d5db; line-height: 1.625; font-weight: 400;">[Explicación práctica del consejo o secreto del profesional con ejemplo real...]</p>
          </div>
       c) PROFUNDIDAD Y EJEMPLOS PRÁCTICOS: Genera un artículo completo y bien nutrido (extensión ideal de 1.000 a 1.500 palabras). Cada H2 y H3 debe incluir escenarios o casos prácticos de la vida real para ilustrar la teoría de forma enriquecedora y sustancial, manteniendo párrafos breves de 1 a 3 líneas.

    REGLAS DE TONO Y ESTILO DE REDACCIÓN (ESTILO PERSUASIVO MAESTRO - GARY HALBERT, ISRA BRAVO, EL MONJE MALO):
    1. TONO DE REDACCIÓN: Escribe el artículo adoptando y variando de forma genial el estilo de los grandes maestros del copywriting en español y marketing directo (Isra Bravo, Gary Halbert, El Monje Malo):
       - Altamente conversacional, directo al grano y magnético. Habla de "tú" a "tú" con total franqueza.
       - Comienza con un gancho demoledor y ganchos de curiosidad a lo largo de la lectura.
       - Di las verdades incómodas de la industria (estilo "El Monje Malo") con firmeza y autoridad intelectual. Rompe con la formalidad aburrida y corporativa, pero mantén un rigor impecable resolviendo la duda del lector.
       - Usa la fuerza de las historias cortas o analogías de la vida real (estilo "Gary Halbert") para ilustrar conceptos técnicos.
    2. REGLA CRÍTICA DE PÁRRAFOS CORTOS Y MÚLTIPLES: No acumules bloques densos de texto. Cada párrafo debe ser extremadamente CORTO, limitándose a un máximo de 1 o 2 frases (o de 1 a 3 líneas de texto).
       - Puedes (y debes) generar múltiples párrafos (3, 4 o más si el tema lo requiere) dentro de cada sección (H2 o H3) para dar toda la información valiosa que solucione la duda. 
       - No intentes empaquetarlo todo en 1 o 2 párrafos gigantescos. Separa las ideas con saltos de línea frecuentes (<p>...</p>) creando un ritmo respirable, ágil, adictivo y aireado para el lector.
    3. VOCABULARIO PROHIBIDO: Elimina términos robóticos de IA como "En conclusión", "Es importante destacar", "Sin duda", "Como hemos visto", "En resumen", "En el dinámico mundo de...". Evita frases cliché de marketing de baja calidad como "libertad financiera" o "cambia tu vida". Haz que se lea genuino, humano, perspicaz y sumamente adictivo.
    4. SIN CONCLUSIÓN: El artículo no debe finalizar con una sección formal de conclusión o resumen. Debe fluir de manera natural hacia la sección educativa final y el llamado a la acción.
    5. FORMATO HTML: Usa etiquetas de estructuración HTML limpias para el cuerpo (p, strong, ul, ol, li, y tablas para comparativas). No uses la etiqueta H1 dentro del contenido html.

    REGLAS ESTRICTAS PARA LOS DOS BANNERS DE LLAMADO A LA ACCIÓN (CTA):
    Debes insertar exactamente DOS banners de CTA en formato HTML real dentro de la propiedad 'html'. Uno posicionado aproximadamente a la mitad del artículo, y el otro al final absoluto.
    - Antes de cada banner, debes colocar un párrafo corto en formato HTML que toque el punto de dolor del lector relacionado con el tema, le plantee una pregunta relevante y lo encamine suavemente al CTA.
    - Cada banner debe poseer un título persuasivo y una descripción motivadora diferente y contextualizada al Lead Magnet u objetivo.
    - El botón debe contener un texto potente escrito en primera persona del singular ("QUIERO...", "SÍ, DESEO...").
    - Usa EXACTAMENTE esta estructura HTML para cada uno de los dos banners (no modifiques sus estilos CSS):

    <div style="margin: 4rem 0; padding: 2.5rem; border-radius: 2.5rem; background: linear-gradient(to bottom right, #111827, #000000); border: 1px solid rgba(255,255,255,0.1); text-align: center; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
      <div style="position: relative; z-index: 10;">
        <h3 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 1rem; color: #ffffff; text-transform: uppercase; letter-spacing: -0.025em; font-style: italic;">[TEXTO PERSUASIVO CONTEXTUALIZADO AQUÍ]</h3>
        <p style="font-size: 1.25rem; color: #d1d5db; margin-bottom: 2rem; max-width: 42rem; margin-left: auto; margin-right: auto; line-height: 1.625;">[DESCRIPCIÓN MOTIVADORA ENFOCADA AL LEAD MAGNET AQUÍ]</p>
        <a href="${ctaLink}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.75rem; font-weight: 900; padding: 1.25rem 2.5rem; border-radius: 1rem; background-color: #FF5A1F; color: #ffffff; text-decoration: none; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.875rem;">
          [TEXTO BOTÓN EN PRIMERA PERSONA AQUÍ]
        </a>
      </div>
    </div>

    AUDITORÍA DE CALIDAD INTERNA:
    Antes de responder, realiza una auditoría interna mental con estas comprobaciones:
    - ¿Responde realmente a la intención principal?
    - ¿La respuesta comienza en los primeros dos párrafos?
    - ¿Cumple la promesa del título?
    - ¿Se evitaron cifras o fuentes inventadas?
    - ¿Los ejemplos inventados se identifican claramente como hipotéticos?
    - ¿Cada H2 aporta información totalmente fresca y diferente?
    - ¿Se integró la keyword de forma natural y sin stuffing?
    - ¿Se respetó el formato JSON y la estructura exacta del banner HTML?

    FORMATO DE SALIDA REQUERIDO (JSON STRICT):
    Debes retornar un objeto JSON válido que cumpla estrictamente con esta estructura:
    {
      "title": "[Título de alto CTR totalmente REESCRITO, persuasivo, magnético e irresistible para blog/SEO basado en la idea/tema original, de máximo 60 caracteres]",
      "html": "[El contenido completo del artículo formateado en HTML limpio, comenzando de inmediato con la introducción empática (H2s y H3s según el esquema provisto, párrafos, tablas, negritas, seguidos de los dos banners de CTA contextuales y sus respectivos párrafos de dolor pre-CTA)]",
      "metaDescription": "[Meta descripción atractiva para los buscadores que resuma el artículo en un máximo de 155 caracteres]",
      "strategy": "[Enfoque Estratégico del artículo de 1 a 2 párrafos breves que explique la idea central del artículo redactado y enfatice el objetivo de guiar a los lectores a registrarse e ingresar a la clase gratuita]"
    }
    No agregues ningún tipo de texto introductorio, explicativo, markdown de bloque para rodear el JSON (por ejemplo, sin triple acento grave), ni comentarios fuera de esta estructura. Solo devuelve el JSON parseable.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            html: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            strategy: { type: Type.STRING }
        },
        required: ["title", "html", "metaDescription", "strategy"]
    };

    try {
        const response = await callGeminiBackend(prompt, schema, true, "gemini-3-flash-preview", 0);
        if (response.text) {
            return JSON.parse(response.text);
        }
        return { title: title, html: "<p>Error generando el artículo.</p>", metaDescription: "", strategy: "" };
    } catch (e) {
        return { title: title, html: `<p>Error de conexión o timeout. Intenta con un tema más corto.</p>`, metaDescription: "", strategy: "" };
    }
};