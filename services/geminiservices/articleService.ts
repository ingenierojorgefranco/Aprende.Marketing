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
    /* */ /* Actualización: Ajuste del prompt para forzar la generación de una estructura SEO robusta con entre 5 y 7 encabezados H2 y al menos 3 encabezados H3 para maximizar el impacto y autoridad del contenido - 24/05/2024 20:30 */
    const prompt = `Actúa como un arquitecto de contenido SEO experto.
    Crea una estructura (outline) OBLIGATORIA para un artículo de blog titulado: "${title}".
    Objetivo: "${objective}".
    
    REGLAS ESTRUCTURALES ESTRICTAS:
    1. Genera obligatoriamente entre 5 y 7 encabezados H2 que actúen como pilares del contenido.
    2. Genera un mínimo de 3 encabezados H3 distribuidos estratégicamente dentro de los H2 más extensos para desglosar subtemas.
    3. La estructura debe ser jerárquica y lógica para facilitar la lectura.

    FORMATO DE RESPUESTA:
    1. H1: [Título Principal]
    2. H2: [Título de Atención]
    3. H3: [Subtítulos]
    ...
    Devuelve SOLO un JSON array de strings.`;

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
): Promise<{ title: string; html: string; metaDescription: string }> => {
    
    let projectStrategy = "";
    if (projectContext) {
        projectStrategy = `
        CONTEXTO DEL PROYECTO:
        - Tono de Voz: "${projectContext.brandTone}"
        - Producto a promocionar: "${projectContext.productName}"
        - Puntos de Dolor: ${projectContext.painPoints?.join(", ")}.
        - Beneficios Clave: ${projectContext.keyBenefits?.join(", ")}.
        
        Usa este contexto para que el artículo no sea genérico, sino enfocado en vender este producto específico.
        `;
    }

    const prompt = `Actúa como un experto cercano y empático que le habla directamente al lector (usa "tú", "te", "tu", "estás"). El texto debe sentirse como si una persona le hablara directamente al usuario final, como un mentor o consejero.
    
    REGLAS DE PERSONA:
    - Actúa como un consejero experto que entiende profundamente al lector.
    - NO menciones nombres propios de personas (ni el tuyo ni de otros).
    - NO cuentas anécdotas personales, historias de vida o detalles privados.
    - Mantén un enfoque 100% informativo, educativo y profesional.
    - Dirígete al lector de forma personal, cercana y empática.

    Escribe un artículo de blog COMPLETO y optimizado para SEO basado en este esquema estructural OBLIGATORIO.
    
    Título Base: "${title}"
    Esquema Estructural: ${JSON.stringify(outline)}
    Objetivo: "${objective}"
    ${keyword ? `Keyword SEO: "${keyword}"` : ''}
    CTA Link: "${ctaLink}"
    
    ${projectStrategy}

    REGLAS DE REDACCIÓN Y ESTRUCTURA:
    1. TÍTULO CON ESTEROIDES: Genera una variación del título base que sea única, viral y altamente atractiva. Debe tener buen contexto, cumplir con las mejores prácticas SEO y obtener el máximo CTR sin perder el contexto del título original. Optimiza longitud y enfoque.
    2. INTRODUCCIÓN EMPÁTICA OBLIGATORIA: El artículo DEBE comenzar con una pregunta directamente relacionada con la necesidad o el problema del lector. Inmediatamente después, habla como un consejero que entiende su dolor, atacando directamente sus frustraciones para conectar emocionalmente. PROHIBIDO usar saludos genéricos.
    3. SIN CONCLUSIÓN: NO incluyas una sección de conclusión o cierre al final del texto. El artículo debe terminar con el contenido informativo y el CTA final.
    4. PÁRRAFOS MUY CORTOS: Cada párrafo debe tener un máximo de 2 a 3 líneas. Divide el contenido en fragmentos cortos y directos para facilitar la lectura rápida.
    5. BANNERS DE LLAMADO A LA ACCIÓN (CTA) CONTEXTUALIZADOS: 
       - Inserta DOS banners de CTA en formato HTML real dentro del contenido (uno aproximadamente en la mitad y otro al final).
       - PÁRRAFO DE DOLOR PRE-CTA: Antes de cada banner de CTA, DEBES incluir un párrafo corto que toque el dolor de la persona, le haga una pregunta y luego enfoque el contenido hacia el CTA.
       - ENFOQUE DEL CTA: Si el objetivo menciona una "clase gratuita", enfoca el CTA a invitar al usuario a mejorar sus habilidades con esa clase. Si es una "guía", enfócalo a descargar la guía. Adapta el contexto del banner al tipo de Lead Magnet.
       - CADA BANNER DEBE TENER UN TEXTO PERSUASIVO DIFERENTE. No los repitas.
       - TONO PERSONALIZADO: El párrafo del CTA debe estar dirigido directamente al usuario que lee (usa "tú", "estás", "quieres", "puedes").
       - BOTÓN EN PRIMERA PERSONA: El texto del botón debe ser un deseo del usuario (ej: "QUIERO INGRESAR A LA CLASE GRATUITA", "SÍ, DESEO EMPEZAR AHORA").
       - Usa EXACTAMENTE esta estructura HTML para los banners:

       <div style="margin: 4rem 0; padding: 2.5rem; border-radius: 2.5rem; background: linear-gradient(to bottom right, #111827, #000000); border: 1px solid rgba(255,255,255,0.1); text-align: center; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
         <div style="position: relative; z-index: 10;">
           <h3 style="font-size: 2.25rem; font-weight: 900; margin-bottom: 1rem; color: #ffffff; text-transform: uppercase; letter-spacing: -0.025em; font-style: italic;">[TEXTO PERSUASIVO CONTEXTUALIZADO AQUÍ]</h3>
           <p style="font-size: 1.25rem; color: #d1d5db; margin-bottom: 2rem; max-width: 42rem; margin-left: auto; margin-right: auto; line-height: 1.625;">[DESCRIPCIÓN MOTIVADORA ENFOCADA AL LEAD MAGNET AQUÍ]</p>
           <a href="${ctaLink}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.75rem; font-weight: 900; padding: 1.25rem 2.5rem; border-radius: 1rem; background-color: #FF5A1F; color: #ffffff; text-decoration: none; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.875rem;">
             [TEXTO BOTÓN EN PRIMERA PERSONA AQUÍ]
           </a>
         </div>
       </div>

    6. META DESCRIPTION: Genera una meta description optimizada para buscadores (Máx 155 car.).
    7. NO incluyas el Título Principal (H1) dentro del campo 'html'.
    8. ASEGÚRATE de que el enlace en el botón sea "${ctaLink}" y tenga target="_blank".

    Formato de Salida JSON: { "title": "Título Optimizado con Esteroides", "html": "Contenido HTML...", "metaDescription": "..." }`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            html: { type: Type.STRING },
            metaDescription: { type: Type.STRING }
        },
        required: ["title", "html", "metaDescription"]
    };

    try {
        const response = await callGeminiBackend(prompt, schema, true, "gemini-3-flash-preview", 0);
        if (response.text) {
            return JSON.parse(response.text);
        }
        return { title: title, html: "<p>Error generando el artículo.</p>", metaDescription: "" };
    } catch (e) {
        return { title: title, html: `<p>Error de conexión o timeout. Intenta con un tema más corto.</p>`, metaDescription: "" };
    }
};