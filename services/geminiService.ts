
import { GeneratedPageContent, ColorPalette, StructureType, DestinationConfig, Project } from "../types";
import { api } from "./api"; // Usamos la configuración centralizada de API

// Mock Type Enum to replace @google/genai SDK dependency on frontend
const Type = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT'
};

// Helper to call backend
const callGeminiBackend = async (prompt: string, responseSchema?: any) => {
    try {
        const baseUrl = api.getBaseUrl();
        const response = await fetch(`${baseUrl}/gemini`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    responseMimeType: responseSchema ? "application/json" : "text/plain",
                    responseSchema: responseSchema
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Backend Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { text: data.text };

    } catch (error) {
        console.error("Gemini Backend Call Failed:", error);
        throw error;
    }
};

// --- PROJECT STRATEGY GENERATION ---
export interface ProjectStrategyIdeas {
    niche: string;
    targetAudience: string;
    painPoints: string[];
    keyBenefits: string[];
    brandTone: string;
    avatarMaster: {
        name: string;
        story: string;
        miedos: string[];
        deseos: string[];
    };
}

export const generateProjectStrategy = async (
    name: string,
    productName: string,
    description: string,
    leadMagnet: string,
    salesPageUrl?: string
): Promise<ProjectStrategyIdeas> => {
    const prompt = `Actúa como un estratega de marketing digital de élite especializado en Hotmart.
    Tengo un nuevo producto digital.
    
    DATOS DEL PRODUCTO:
    - Proyecto Interno: "${name}"
    - Producto Público: "${productName}"
    - Descripción del Producto: "${description}"
    - Regalo Gratuito (Lead Magnet): "${leadMagnet}"
    ${salesPageUrl ? `- Análisis de URL de Ventas: ${salesPageUrl}` : ''}

    TU TAREA:
    Analiza esta información y genera una estrategia de marketing maestra.
    
    Responde en formato JSON siguiendo este esquema:
    1. "niche": Identifica el sub-nicho exacto (ej: "Salud / Dieta Cetogénica para Mujeres").
    2. "targetAudience": Un párrafo potente que defina quién es el comprador ideal y su momento actual.
    3. "painPoints": Una lista de 7 dolores profundos que el cliente siente cada día.
    4. "keyBenefits": Una lista de 5 beneficios que representan la transformación real.
    5. "brandTone": 3 adjetivos que definan la voz de la marca.
    6. "avatarMaster": Perfil máster del cliente ideal:
       - "name": Nombre representativo.
       - "story": Párrafo de storytelling de su situación actual.
       - "miedos": 3 miedos racionales/emocionales.
       - "deseos": 3 deseos aspiracionales.

    Responde SOLO en JSON válido.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            niche: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyBenefits: { type: Type.ARRAY, items: { type: Type.STRING } },
            brandTone: { type: Type.STRING },
            avatarMaster: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    story: { type: Type.STRING },
                    miedos: { type: Type.ARRAY, items: { type: Type.STRING } },
                    deseos: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "story", "miedos", "deseos"]
            }
        },
        required: ["niche", "targetAudience", "painPoints", "keyBenefits", "brandTone", "avatarMaster"]
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        if (response.text) {
            return JSON.parse(response.text) as ProjectStrategyIdeas;
        }
        throw new Error("Respuesta vacía del servidor de IA");
    } catch (error) {
        console.error("Strategy Generation Error", error);
        throw new Error("Fallo al generar la estrategia con IA");
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
  destination: DestinationConfig,
  projectContext?: Project 
): Promise<GeneratedPageContent> => {
  
  let ctaContext = "";
  if (destination.type === 'whatsapp') {
    ctaContext = "El objetivo es contacto por WhatsApp. El CTA debe invitar a chatear.";
  } else if (destination.type === 'form') {
    ctaContext = "El objetivo es captura de leads con formulario.";
  } else {
    ctaContext = "El objetivo es redirección a checkout o ventas externa.";
  }

  let projectStrategy = "";
  if (projectContext) {
      projectStrategy = `
      CONTEXTO ESTRATÉGICO:
      - Producto: "${projectContext.productName}"
      - Voz de Marca: "${projectContext.brandTone}"
      - Dolores Clave: ${projectContext.painPoints?.join(", ")}.
      - Transformación: ${projectContext.keyBenefits?.join(", ")}.
      `;
  }

  const prompt = `Actúa como un experto en copywriting de respuesta directa y diseño web. 
  Genera el contenido COMPLETO para una Landing Page de alta conversión en ESPAÑOL.
  
  DATOS:
  - Nicho: "${niche}"
  - Objetivo: "${goal}"
  - Audiencia: "${targetAudience}"
  - Oferta: "${offerType}"
  ${ctaContext}
  ${projectStrategy}

  REQUISITOS DEL JSON:
  - brandName: Nombre corto (usa <b> para resaltar).
  - topTagline: Frase corta tipo "🔥 Oferta Especial".
  - navCta: Máximo 3 palabras.
  - navLinks: 3 enlaces con hrefs: "#seccion-beneficios", "#seccion-testimonios", "#seccion-instructor".
  - logoSvg: Código SVG premium con gradientes, relacionado al nicho.
  - hero: Headline (usa <b>), subheadline, ctaText.
  - testimonials: 3 items con name, text, rating.
  - intro: title, description, imageCardText, items (3 puntos clave).
  - benefits: title, subtitle, items (4-6 con title, description).
  - whatYouWillLearn: title, items (4-6).
  - faq: 4 Q&A.
  - instructor: name, bio, title, badgeText, badgeSubtext.
  - footer: copyright, contact.
  
  Devuelve JSON válido.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
    brandName: { type: Type.STRING },
    topTagline: { type: Type.STRING },
    navCta: { type: Type.STRING },
    navLinks: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: { label: { type: Type.STRING }, href: { type: Type.STRING } }
        }
    },
    testimonialTitle: { type: Type.STRING },
    logoSvg: { type: Type.STRING },
    hero: {
        type: Type.OBJECT,
        properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            ctaText: { type: Type.STRING },
        },
        required: ["headline", "subheadline", "ctaText"],
    },
    testimonials: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: { name: { type: Type.STRING }, text: { type: Type.STRING }, rating: { type: Type.NUMBER } },
        },
    },
    intro: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            imageCardText: { type: Type.STRING },
            items: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }
                }
            }
        },
        required: ["title", "description"],
    },
    benefits: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            items: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
                },
            },
        },
    },
    whatYouWillLearn: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
    },
    faq: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } }
        }
    },
    instructor: {
        type: Type.OBJECT,
        properties: { name: { type: Type.STRING }, bio: { type: Type.STRING }, title: { type: Type.STRING } },
    },
    footer: {
        type: Type.OBJECT,
        properties: { copyright: { type: Type.STRING }, contact: { type: Type.STRING } },
    },
    thankYouMessage: { type: Type.STRING },
    redirectUrl: { type: Type.STRING },
    },
  };

  try {
    const response = await callGeminiBackend(prompt, schema);
    if (response.text) {
        const content = JSON.parse(response.text) as GeneratedPageContent;
        
        // Defaults
        if (!content.benefits.subtitle) content.benefits.subtitle = "Descubre el arsenal completo...";
        if (!content.instructor.title) content.instructor.title = "Conoce a tu Mentor";
        if (!content.hero.videoTitle) content.hero.videoTitle = "Clase Exclusiva";
        
        content.palette = palette;
        content.structure = structure;
        content.destination = destination;
        content.targetAudience = targetAudience;
        return content;
    }
  } catch (error) {
      console.error("AI Generation Error", error);
      throw new Error("Fallo al generar contenido con IA");
  }
  throw new Error("Fallo al generar contenido con IA");
};

export const generateBotReply = async (
  incomingMessage: string,
  context: string
): Promise<string> => {
  const prompt = `Eres un asistente de ventas experto.
  Contexto: ${context}.
  Cliente dice: "${incomingMessage}".
  Responde en ESPAÑOL, profesional y persuasivo. Máximo 50 palabras.`;

  try {
    const response = await callGeminiBackend(prompt);
    return response.text || "Lo siento, ¿podrías repetir eso?";
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
    const prompt = `Genera 4 títulos virales para un blog sobre: "${topic}".
    Objetivo: "${objective}".
    SEO Keyword: "${keyword}".
    Devuelve un JSON array de objetos con 'title' y 'description' (vacío).`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }
        }
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return [{ title: `Guía sobre ${topic}`, description: "" }];
    }
};

export const generateArticleOutline = async (title: string, objective: string): Promise<string[]> => {
    const prompt = `Crea un esquema SEO (Outline) para el artículo: "${title}".
    Usa formato "H2: Titular", "H3: Subtitular".
    Devuelve JSON Array de strings.`;

    const schema = { type: Type.ARRAY, items: { type: Type.STRING } };

    try {
        const response = await callGeminiBackend(prompt, schema);
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return ["H2: Introducción", "H2: Conclusión"];
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
        CONTEXTO:
        - Tono: "${projectContext.brandTone}"
        - Producto: "${projectContext.productName}"
        `;
    }

    const prompt = `Escribe un artículo SEO completo.
    Título: "${title}"
    Esquema: ${JSON.stringify(outline)}
    CTA: "${ctaLink}"
    ${projectStrategy}
    Devuelve JSON con 'html' y 'metaDescription'.`;

    const schema = {
        type: Type.OBJECT,
        properties: { html: { type: Type.STRING }, metaDescription: { type: Type.STRING } },
        required: ["html", "metaDescription"]
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { html: "<p>Error generando contenido.</p>", metaDescription: "" };
    }
};
