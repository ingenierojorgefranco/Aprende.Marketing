import { GeneratedPageContent, ColorPalette, StructureType, DestinationConfig } from "../types";
// Importamos Type solo para usar las constantes en la definicion del schema, 
// aunque la ejecucion real sucede en el backend.
import { Type } from "@google/genai";

// Obtenemos la URL de la API desde Vite env o usamos relativa por defecto
const API_URL = (import.meta as any).env?.VITE_API_URL || '';

const generateContentViaBackend = async (
    model: string, 
    contents: string, 
    config?: any
): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/api/gemini/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                contents,
                config
            })
        });

        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("AI Generation Error (Backend)", error);
        throw error;
    }
};

// --- LANDING PAGE GENERATION ---

export const generateLandingPageContent = async (
  niche: string,
  goal: string,
  targetAudience: string,
  offerType: string,
  palette: ColorPalette,
  structure: StructureType,
  destination: DestinationConfig
): Promise<GeneratedPageContent> => {
  
  // Contexto específico para el prompt
  let ctaContext = "";
  if (destination.type === 'whatsapp') {
    ctaContext = "El objetivo es que contacten por WhatsApp. El botón (CTA) debe invitar a chatear.";
  } else if (destination.type === 'form') {
    ctaContext = "El objetivo es capturar leads con un formulario.";
  } else {
    ctaContext = "El objetivo es redirigir a una página de ventas externa o checkout.";
  }

  const prompt = `Actúa como un experto en copywriting, diseño y marketing digital. Genera el contenido COMPLETO para una Landing Page de alta conversión en ESPAÑOL para el nicho "${niche}".
  El objetivo es "${goal}". La audiencia objetivo es "${targetAudience}".
  La oferta es de tipo "${offerType}".
  ${ctaContext}
  
  IMPORTANTE: Independientemente de la estructura visual elegida, DEBES generar contenido rico y detallado para TODAS las secciones. No omitas ninguna sección.
  
  Genera campos específicos:
  - brandName: Nombre corto y pegadizo para la marca del sitio (ej: "NicheMaster").
  - topTagline: Una frase corta y llamativa para la parte superior (ej: "🔥 Clase Gratuita Online - [Tema]").
  - navCta: Un texto MUY corto (máximo 3 palabras) para el botón del menú superior (ej: "Reservar Cupo", "Ingresar Ahora").
  - navLinks: Genera 3 enlaces de navegación estándar (ej: Label: "Beneficios", href: "#seccion-beneficios").
  - testimonialTitle: Un título persuasivo para los testimonios (ej: "Ellas ya cambiaron su historia:", "Resultados reales de alumnos:").
  - logoSvg: Genera el código crudo string de un elemento <svg> completo. El diseño debe ser PREMIUM, ESTILIZADO y COLORIDO (usa <defs> con <linearGradient> para dar profundidad y profesionalismo). Debe relacionarse visualmente con el nicho "${niche}". NO uses 'currentColor' ni 'fill="none"', usa colores hex o gradientes que contrasten bien sobre fondo oscuro o claro. viewBox="0 0 64 64".
  
  Estructura requerida del JSON:
  1. Hero: Título impactante (H1), subtítulo persuasivo y texto del botón principal (CTA). IMPORTANTE: En el campo 'headline', encierra la parte más importante o emocional de la frase entre etiquetas <b> y </b> (ejemplo: "¿Tu perro rompe cosas o <b>se porta mal?</b>").
  2. Testimonios: Genera 3 testimonios muy cortos (máximo 15 palabras) de clientes satisfechos, nombre y rating (5).
  3. Intro: Explicación clara de qué es el producto/servicio ("Qué es").
  4. Beneficios: Lista de 4 a 6 beneficios clave con títulos y descripciones cortas.
  5. Lo que aprenderás: Lista de 4 a 6 puntos clave (bullet points) de lo que obtendrá el usuario.
  6. FAQ: Genera 4 preguntas frecuentes con respuestas persuasivas que derriben objeciones de compra.
  7. Instructor/Experto: Nombre, título profesional y una biografía breve que genere autoridad (ficticia pero realista).
  8. Footer: Copyright y datos de contacto genéricos.
  
  Devuelve JSON.`;

  const config = {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
            brandName: { type: Type.STRING },
            topTagline: { type: Type.STRING },
            navCta: { type: Type.STRING },
            navLinks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        label: { type: Type.STRING },
                        href: { type: Type.STRING }
                    }
                }
            },
            testimonialTitle: { type: Type.STRING },
            logoSvg: { type: Type.STRING, description: "Raw SVG string for a premium, colorful, niche-related icon" },
            hero: {
                type: Type.OBJECT,
                properties: {
                headline: { type: Type.STRING, description: "Headline with <b> tags around key phrase" },
                subheadline: { type: Type.STRING },
                ctaText: { type: Type.STRING },
                },
                required: ["headline", "subheadline", "ctaText"],
            },
            testimonials: {
                type: Type.ARRAY,
                items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    text: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                },
                },
            },
            intro: {
                type: Type.OBJECT,
                properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                },
                required: ["title", "description"],
            },
            benefits: {
                type: Type.OBJECT,
                properties: {
                title: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                    },
                    },
                },
                },
            },
            whatYouWillLearn: {
                type: Type.OBJECT,
                properties: {
                title: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
                },
            },
            faq: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        answer: { type: Type.STRING }
                    }
                }
            },
            instructor: {
                type: Type.OBJECT,
                properties: {
                name: { type: Type.STRING },
                bio: { type: Type.STRING },
                },
            },
            footer: {
                type: Type.OBJECT,
                properties: {
                copyright: { type: Type.STRING },
                contact: { type: Type.STRING },
                },
            },
            thankYouMessage: { type: Type.STRING },
            redirectUrl: { type: Type.STRING },
            },
            required: ["hero", "testimonials", "intro", "benefits", "whatYouWillLearn", "instructor", "footer", "thankYouMessage", "redirectUrl"],
        },
    };

  try {
    const textResponse = await generateContentViaBackend("gemini-2.5-flash", prompt, config);
    
    if (textResponse) {
        const content = JSON.parse(textResponse) as GeneratedPageContent;
        content.palette = palette;
        content.structure = structure;
        content.destination = destination;
        content.targetAudience = targetAudience;
        return content;
    }
  } catch (error) {
      console.error("Content Gen Error", error);
      throw new Error("Failed to generate content");
  }
  throw new Error("Failed to generate content");
};

export const generateBotReply = async (
  incomingMessage: string,
  context: string
): Promise<string> => {
  const prompt = `Eres un asistente de CRM inteligente para un negocio.
  Contexto del negocio: ${context}.
  El cliente dijo: "${incomingMessage}".
  Responde brevemente en ESPAÑOL, de forma profesional y persuasiva para cerrar una venta o cita. Máximo 50 palabras.`;

  try {
    const text = await generateContentViaBackend("gemini-2.5-flash", prompt);
    return text || "Lo siento, no entendí eso.";
  } catch (e) {
      return "Error de conexión con IA.";
  }
};

// --- CONTENT GENERATOR PRO ---

export interface ArticleTitleIdea {
    title: string;
    description: string;
}

export const generateArticleTitles = async (topic: string, objective: string, keyword: string): Promise<ArticleTitleIdea[]> => {
    const prompt = `Actúa como un experto SEO y Content Manager.
    Genera 5 ideas de títulos atractivos y optimizados para SEO para un artículo sobre el tema: "${topic}".
    El objetivo del artículo es: "${objective}".
    ${keyword ? `Palabra clave principal: "${keyword}"` : ''}
    
    Devuelve un JSON array de objetos con:
    - title: El título propuesto (H1).
    - description: Breve explicación del enfoque o ángulo de este artículo (1 frase).
    `;

    const config = {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                }
            }
        }
    };

    try {
        const text = await generateContentViaBackend("gemini-2.5-flash", prompt, config);
        return JSON.parse(text || "[]");
    } catch (e) {
        throw e;
    }
};

export const generateArticleOutline = async (title: string, objective: string): Promise<string[]> => {
    const prompt = `Crea un esquema (outline) detallado para un artículo de blog titulado: "${title}".
    Objetivo: "${objective}".
    
    Incluye:
    - Introducción (gancho)
    - Títulos H2 y H3 lógicos
    - Conclusión
    
    Devuelve SOLO un JSON array de strings, donde cada string es un encabezado o sección.`;

    const config = {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    };

    try {
        const text = await generateContentViaBackend("gemini-2.5-flash", prompt, config);
        return JSON.parse(text || "[]");
    } catch (e) {
        throw e;
    }
};

export const generateFullArticle = async (title: string, outline: string[], objective: string, ctaLink: string, keyword: string): Promise<string> => {
    const prompt = `Escribe un artículo de blog COMPLETO y optimizado para SEO basado en este título y esquema.
    
    Título: "${title}"
    Esquema: ${JSON.stringify(outline)}
    Objetivo: "${objective}"
    ${keyword ? `Keyword SEO: "${keyword}" (Úsala de forma natural)` : ''}
    CTA Link: "${ctaLink}" (Insértalo de forma persuasiva al final o en un punto clave).
    
    Formato: HTML (usa <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a href="...">).
    Estilo: Profesional, educativo y persuasivo. Párrafos cortos.
    Idioma: Español Neutro.
    
    NO incluyas <html>, <head> o <body>, solo el contenido del artículo.`;

    try {
        const text = await generateContentViaBackend("gemini-2.5-flash", prompt);
        return text || "<p>Error generando el artículo.</p>";
    } catch (e) {
        return "<p>Error generando contenido.</p>";
    }
};