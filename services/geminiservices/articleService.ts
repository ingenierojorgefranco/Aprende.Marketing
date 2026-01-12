// Refactorización: Creación de servicio para artículos SEO - 22/05/2024 14:30
import { callGeminiBackend, Type } from "./base";
import { Project } from "../../types";

export interface ArticleTitleIdea {
    title: string;
    description: string;
}

export const generateArticleTitles = async (topic: string, objective: string, keyword: string): Promise<ArticleTitleIdea[]> => {
    const prompt = `Genera 4 títulos virales para un artículo sobre: "${topic}".
    Objetivo: "${objective}".
    ${keyword ? `Keyword SEO: "${keyword}"` : ''}

    REGLAS ESTRICTAS:
    1. Longitud máxima: 60 caracteres por título.
    2. En el campo 'title' devuelve SOLO el texto del título.
    3. NO generes descripciones. Deja el campo 'description' como una cadena vacía "".
    
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
): Promise<{ html: string; metaDescription: string }> => {
    
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

    const prompt = `Escribe un artículo de blog COMPLETO y optimizado para SEO basado en este título y esquema estructural OBLIGATORIO.
    
    Título: "${title}"
    Esquema Estructural: ${JSON.stringify(outline)}
    Objetivo: "${objective}"
    ${keyword ? `Keyword SEO: "${keyword}"` : ''}
    CTA Link: "${ctaLink}"
    
    ${projectStrategy}

    INSTRUCCIONES ADICIONALES:
    1. Genera también una 'metaDescription' optimizada para SEO (Máx 155 car.).
    2. NO incluyas el Título Principal (H1) dentro de la respuesta 'html'.
    
    Formato de Salida JSON: { "html": "...", "metaDescription": "..." }`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            html: { type: Type.STRING },
            metaDescription: { type: Type.STRING }
        },
        required: ["html", "metaDescription"]
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        if (response.text) {
            return JSON.parse(response.text);
        }
        return { html: "<p>Error generando el artículo.</p>", metaDescription: "" };
    } catch (e) {
        return { html: `<p>Error de conexión o timeout. Intenta con un tema más corto.</p>`, metaDescription: "" };
    }
};