import { GeneratedPageContent, ColorPalette, StructureType, DestinationConfig, Project } from "../types";
import { api } from "./api"; // Usamos la configuración centralizada de API

// --- LIBRERÍA DE LOGOS PROFESIONALES PRE-DEFINIDOS ---
// Al usar una lista estática, ahorramos a la IA la tarea pesada de dibujar SVG, reduciendo el tiempo de respuesta.
const PREDEFINED_LOGOS = [
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" /><stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" /></linearGradient></defs><rect x="12" y="12" width="40" height="40" rx="8" fill="url(#g1)"/><path d="M22 32h20M32 22v20" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#ec4899" opacity="0.2"/><circle cx="32" cy="32" r="20" fill="#ec4899"/><path d="M25 32l5 5 10-10" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4L10 16v32l22 12 22-12V16L32 4z" fill="#3b82f6"/><path d="M32 12l14 8v16l-14 8-14-8V20l14-8z" fill="white" opacity="0.3"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" /><stop offset="100%" style="stop-color:#ef4444;stop-opacity:1" /></linearGradient></defs><path d="M32 8l24 40H8L32 8z" fill="url(#g2)"/><circle cx="32" cy="35" r="5" fill="white"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="20" height="20" rx="4" fill="#8b5cf6"/><rect x="34" y="10" width="20" height="20" rx="4" fill="#6366f1" opacity="0.7"/><rect x="10" y="34" width="20" height="20" rx="4" fill="#3b82f6" opacity="0.5"/><rect x="34" y="34" width="20" height="20" rx="4" fill="#06b6d4" opacity="0.3"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 2C15.4 2 2 15.4 2 32s13.4 30 30 30 30-13.4 30-30S48.6 2 32 2zm0 54c-13.3 0-24-10.7-24-24S18.7 8 32 8s24 10.7 24 24-10.7 24-24 24z" fill="#10b981"/><path d="M32 16v32M16 32h32" stroke="#10b981" stroke-width="4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4s-18 12-18 28 18 28 18 28 18-12 18-28S32 4 32 4z" fill="#6366f1"/><circle cx="32" cy="28" r="8" fill="white" opacity="0.3"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M48 16L16 48M16 16l32 32" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/><circle cx="32" cy="32" r="10" fill="white" stroke="#ef4444" stroke-width="2"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 2L2 32l30 30 30-30L32 2z" fill="#f97316"/><path d="M32 15l17 17-17 17-17-17 17-17z" fill="white" opacity="0.4"/></svg>`,
    `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="40" height="40" rx="20" fill="none" stroke="#06b6d4" stroke-width="4"/><path d="M32 20v24M20 32h24" stroke="#06b6d4" stroke-width="4" stroke-linecap="round"/></svg>`
];

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
    targetAudience: string;
    painPoints: string[];
    keyBenefits: string[];
}

export const generateProjectStrategy = async (
    name: string,
    niche: string,
    productName: string,
    description: string
): Promise<ProjectStrategyIdeas> => {
    const prompt = `Actúa como un estratega de marketing digital experto.
    Tengo un nuevo proyecto con los siguientes datos:
    - Nombre del Proyecto: "${name}"
    - Nicho: "${niche}"
    - Producto/Servicio: "${productName}"
    - Descripción: "${description}"

    Necesito que generes una estrategia base en formato JSON.
    1. Define una "targetAudience" (Audiencia Objetivo/Avatar) detallada en 1 párrafo.
    2. Genera 5 "painPoints" (Puntos de Dolor) profundos y emocionales que tenga este avatar.
    3. Genera 5 "keyBenefits" (Beneficios Clave) persuasivos que resuelvan esos dolores.

    Responde SOLO en JSON válido.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            targetAudience: { type: Type.STRING },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyBenefits: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["targetAudience", "painPoints", "keyBenefits"]
    };

    try {
        const response = await callGeminiBackend(prompt, schema);
        if (response.text) {
            return JSON.parse(response.text) as ProjectStrategyIdeas;
        }
        return { targetAudience: '', painPoints: [], keyBenefits: [] };
    } catch (error) {
        console.error("Strategy Generation Error", error);
        throw new Error("Failed to generate strategy");
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
  projectContext?: Project // CONTEXTO DEL PROYECTO
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

  // OPTIMIZACIÓN RADICAL: Si el proyecto tiene dolores y beneficios ya generados,
  // los inyectamos con la instrucción "USA EXACTAMENTE ESTOS". Esto evita que la IA
  // gaste tiempo "pensando" o "alucinando" nueva estrategia.
  let projectStrategy = "";
  if (projectContext) {
      const painsText = (projectContext.painPoints && projectContext.painPoints.length > 0) 
          ? `- Dolores del Cliente (USA ESTOS 6 PUNTOS EXACTAMENTE): ${projectContext.painPoints.slice(0, 6).join(", ")}` 
          : "";
      const benefitsText = (projectContext.keyBenefits && projectContext.keyBenefits.length > 0) 
          ? `- Beneficios Clave (USA ESTOS 6 PUNTOS EXACTAMENTE): ${projectContext.keyBenefits.slice(0, 6).join(", ")}` 
          : "";

      projectStrategy = `
      CONTEXTO ESTRATÉGICO DEL PROYECTO (ORDEN DE PRIORIDAD MÁXIMA):
      - Nombre del Producto: "${projectContext.productName}"
      - Tono de Voz de Marca: "${projectContext.brandTone}" (Usa este tono en TODO el copy).
      ${painsText}
      ${benefitsText}
      - Descripción del Proyecto: ${projectContext.description}.
      
      REGLA OBLIGATORIA: Si te he proporcionado los Dolores y Beneficios arriba, COPIA su sentido exactamente en las secciones correspondientes de la landing. NO inventes unos nuevos para ahorrar tiempo.
      `;
  }

  const prompt = `Actúa como un experto en copywriting y marketing digital. Genera el contenido COMPLETO para una Landing Page de alta conversión en ESPAÑOL para el nicho "${niche}".
  El objetivo es "${goal}". La audiencia objetivo es "${targetAudience}".
  La oferta es de tipo "${offerType}".
  ${ctaContext}
  
  ${projectStrategy}

  REQUERIMIENTO DE VELOCIDAD: No generes código SVG para logos. Solo genera los textos persuasivos.
  
  Genera campos específicos:
  - brandName: Nombre de marca (ej: "MicroMaster").
  - topTagline: Frase corta llamativa (ej: "🔥 Oferta Limitada").
  - navCta: Texto corto botón menú (ej: "Reservar").
  - navLinks: 3 enlaces con estos hrefs estrictos: ["#seccion-beneficios", "#seccion-testimonios", "#seccion-instructor"].
  - testimonialTitle: Título persuasivo para testimonios.
  
  Estructura JSON:
  1. Hero: Título (con etiquetas <b> en la parte emocional), subtítulo y botón.
  2. Testimonios: 3 testimonios cortos y realistas.
  3. Intro: Qué es el producto. Genera 'imageCardText' (frase corta) y 'items' (3 bullets).
  4. Beneficios: Lista detallada (usa los proporcionados en el contexto si existen).
  5. Lo que aprenderás: 4-6 puntos clave.
  6. FAQ: 4 preguntas que maten objeciones.
  7. Instructor: Nombre y biografía.
  8. Footer: Copyright y contacto.
  
  Responde ÚNICAMENTE con el objeto JSON válido.`;

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
            properties: {
                label: { type: Type.STRING },
                href: { type: Type.STRING }
            }
        }
    },
    testimonialTitle: { type: Type.STRING },
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
        imageCardText: { type: Type.STRING },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                }
            }
        }
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
  };

  try {
    const response = await callGeminiBackend(prompt, schema);
    
    if (response.text) {
        const content = JSON.parse(response.text) as GeneratedPageContent;
        
        // --- ASIGNACIÓN DE LOGO DESDE LIBRERÍA (REDUCCIÓN DE TIEMPO IA) ---
        // Al no pedirle a la IA que genere el SVG, el proceso es mucho más rápido.
        content.logoSvg = PREDEFINED_LOGOS[Math.floor(Math.random() * PREDEFINED_LOGOS.length)];

        // --- BLINDAJE DE SEGURIDAD PARA ARRAYS ---
        if (!content.testimonials) content.testimonials = [];
        if (!content.faq) content.faq = [];
        if (!content.navLinks) content.navLinks = [];
        if (!content.intro) content.intro = { title: "", description: "" };
        if (!content.intro.items) content.intro.items = [];
        if (!content.benefits) content.benefits = { title: "", items: [] };
        if (!content.benefits.items) content.benefits.items = [];
        if (!content.whatYouWillLearn) content.whatYouWillLearn = { title: "", items: [] };
        if (!content.whatYouWillLearn.items) content.whatYouWillLearn.items = [];

        // Defaults para campos opcionales que la IA podría omitir por brevedad
        if (!content.benefits.subtitle) content.benefits.subtitle = "Descubre las herramientas exclusivas que acelerarán tus resultados.";
        if (!content.instructor) content.instructor = { name: "", bio: "" };
        if (!content.instructor.title) content.instructor.title = "Conoce a tu Mentor";
        if (!content.instructor.badgeText) content.instructor.badgeText = "Instructor Destacado";
        if (!content.instructor.badgeSubtext) content.instructor.badgeSubtext = "Certificado Oficial";
        if (!content.instructor.statsStudents) content.instructor.statsStudents = "+500 Alumnos";
        if (!content.instructor.statsRating) content.instructor.statsRating = "5.0 Estrellas";
        if (!content.intro.imageCardText) content.intro.imageCardText = "Método Exclusivo";
        if (!content.hero.socialProofCount) content.hero.socialProofCount = "+1000";
        if (!content.hero.videoTitle) content.hero.videoTitle = "Clase Exclusiva";
        if (!content.hero.videoDuration) content.hero.videoDuration = "45 Minutos";
        if (!content.hero.spotsLeft) content.hero.spotsLeft = "¡Cupos Limitados!";
        if (!content.testimonialSubtitle) content.testimonialSubtitle = "Resultados reales de alumnos";
        if (!content.closingOfferText) content.closingOfferText = "No dejes pasar esta oportunidad. Quedan pocos cupos para acceder.";
        
        if (content.testimonials && Array.isArray(content.testimonials)) {
            const randomLocations = ["Bogotá, CO", "CDMX, MX", "Lima, PE", "Santiago, CL", "Madrid, ES", "Quito, EC", "Medellín, CO", "Buenos Aires, AR"];
            content.testimonials.forEach(t => {
                if (!t.location) t.location = randomLocations[Math.floor(Math.random() * randomLocations.length)];
            });
        }
        
        content.palette = palette;
        content.structure = structure;
        content.destination = destination;
        content.targetAudience = targetAudience;
        return content;
    }
  } catch (error) {
      console.error("AI Generation Error", error);
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
    const response = await callGeminiBackend(prompt);
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
    const prompt = `Actúa como un arquitecto de contenido SEO experto.
    Crea una estructura (outline) OBLIGATORIA para un artículo de blog titulado: "${title}".
    Objetivo: "${objective}".
    
    DEBES SEGUIR ESTRICTAMENTE ESTA ESTRUCTURA:
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