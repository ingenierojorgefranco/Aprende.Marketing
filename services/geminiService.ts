import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPageContent, ColorPalette, StructureType, DestinationConfig } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. Using Mock Data for AI responses.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
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
  const ai = getAiClient();
  
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

  try {
    if (!ai) throw new Error("No API Key");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
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
        },
    });

    if (response.text) {
        const content = JSON.parse(response.text) as GeneratedPageContent;
        content.palette = palette;
        content.structure = structure;
        content.destination = destination;
        content.targetAudience = targetAudience;
        return content;
    }
  } catch (error) {
      console.error("AI Generation Error", error);
      // Fallback for demo without API Key
      throw new Error("Failed to generate content");
  }
  throw new Error("Failed to generate content");
};

export const generateBotReply = async (
  incomingMessage: string,
  context: string
): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) return "Lo siento, estoy en modo offline. (Configura API KEY)";

  const prompt = `Eres un asistente de CRM inteligente para un negocio.
  Contexto del negocio: ${context}.
  El cliente dijo: "${incomingMessage}".
  Responde brevemente en ESPAÑOL, de forma profesional y persuasiva para cerrar una venta o cita. Máximo 50 palabras.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text || "Lo siento, no entendí eso.";
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
    const ai = getAiClient();
    const prompt = `Actúa como un experto SEO y Content Manager.
    Genera 5 ideas de títulos atractivos y optimizados para SEO para un artículo sobre el tema: "${topic}".
    El objetivo del artículo es: "${objective}".
    ${keyword ? `Palabra clave principal: "${keyword}"` : ''}
    
    Devuelve un JSON array de objetos con:
    - title: El título propuesto (H1).
    - description: Breve explicación del enfoque o ángulo de este artículo (1 frase).
    `;

    try {
        if (!ai) throw new Error("No API Key");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
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
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        // Fallback Mock
        return [
            { title: `Guía Completa de ${topic} para 2024`, description: "Enfoque general y educativo para principiantes." },
            { title: `${topic}: 5 Errores Comunes y Cómo Evitarlos`, description: "Artículo tipo lista para generar curiosidad y autoridad." },
            { title: `Domina ${topic} en 3 Pasos Sencillos`, description: "Tutorial paso a paso enfocado en la acción rápida." },
            { title: `El Secreto de ${topic} que Nadie te Cuenta`, description: "Ángulo de misterio para aumentar el CTR." },
            { title: `¿Vale la pena ${topic}? Análisis de Expertos`, description: "Artículo de opinión y revisión para audiencias dudosas." }
        ];
    }
};

export const generateArticleOutline = async (title: string, objective: string): Promise<string[]> => {
    const ai = getAiClient();
    const prompt = `Crea un esquema (outline) detallado para un artículo de blog titulado: "${title}".
    Objetivo: "${objective}".
    
    Incluye:
    - Introducción (gancho)
    - Títulos H2 y H3 lógicos
    - Conclusión
    
    Devuelve SOLO un JSON array de strings, donde cada string es un encabezado o sección.`;

    try {
        if (!ai) throw new Error("No API Key");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return [
            "Introducción: La importancia del tema",
            "¿Qué es exactamente y por qué importa?",
            "Beneficios Principales",
            "Paso 1: Preparación",
            "Paso 2: Ejecución Correcta",
            "Errores Frecuentes a Evitar",
            "Casos de Éxito",
            "Conclusión y Siguientes Pasos"
        ];
    }
};

export const generateFullArticle = async (title: string, outline: string[], objective: string, ctaLink: string, keyword: string): Promise<string> => {
    const ai = getAiClient();
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
        if (!ai) throw new Error("No API Key");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "<p>Error generando el artículo.</p>";
    } catch (e) {
        return `
            <h1>${title}</h1>
            <p><strong>Nota:</strong> Este es un artículo generado en modo demo (Offline).</p>
            <p>Bienvenido a esta guía completa donde exploraremos todo sobre el tema propuesto. El objetivo principal es ayudarte a lograr ${objective} de la manera más eficiente posible.</p>
            
            <h2>Introducción</h2>
            <p>En el mundo actual, entender los conceptos básicos es fundamental. Si estás buscando mejorar tus habilidades o simplemente aprender algo nuevo, estás en el lugar correcto.</p>
            
            <h2>Puntos Clave</h2>
            <ul>
                <li>Entendiendo los fundamentos.</li>
                <li>Estrategias avanzadas para expertos.</li>
                <li>Herramientas recomendadas.</li>
            </ul>
            
            <h2>¿Por qué esto es importante para ti?</h2>
            <p>La razón principal es el impacto que puede tener en tu carrera o negocio. Al dominar estas técnicas, te posicionas por delante de la competencia.</p>
            
            <h2>Conclusión</h2>
            <p>Esperamos que este artículo te haya sido de utilidad. Recuerda que la práctica hace al maestro.</p>
            
            <p style="text-align: center; margin-top: 20px;">
                <a href="${ctaLink}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Haz clic aquí para saber más
                </a>
            </p>
        `;
    }
};