

import { GeneratedPageContent, ColorPalette, StructureType, DestinationConfig, Project } from "../types";
import { api } from "./api"; // Usamos la configuración centralizada de API

// Mock Type Enum to replace @google/genai SDK dependency on frontend
// This matches the structure expected by the backend logic if needed, 
// though we primarily send raw prompts or simple schemas.
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
                model: "gemini-2.5-flash",
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
  projectContext?: Project // NEW PARAMETER
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

  // ENRICH PROMPT WITH PROJECT DATA IF AVAILABLE
  let projectStrategy = "";
  if (projectContext) {
      projectStrategy = `
      CONTEXTO ESTRATÉGICO DEL PROYECTO (PRIORIDAD ALTA):
      - Nombre del Producto: "${projectContext.productName}"
      - Tono de Voz de Marca: "${projectContext.brandTone}" (Usa este tono en todo el copy).
      - Dolores del Cliente (Pain Points): ${projectContext.painPoints?.join(", ")}.
      - Beneficios Clave (Key Benefits): ${projectContext.keyBenefits?.join(", ")}.
      - Descripción del Proyecto: ${projectContext.description}.
      
      Usa esta información para personalizar profundamente los textos, haciéndolos resonar con la audiencia específica definida.
      `;
  }

  const prompt = `Actúa como un experto en copywriting, diseño y marketing digital. Genera el contenido COMPLETO para una Landing Page de alta conversión en ESPAÑOL para el nicho "${niche}".
  El objetivo es "${goal}". La audiencia objetivo es "${targetAudience}".
  La oferta es de tipo "${offerType}".
  ${ctaContext}
  
  ${projectStrategy}

  IMPORTANTE: Independientemente de la estructura visual elegida, DEBES generar contenido rico y detallado para TODAS las secciones. No omitas ninguna sección.
  
  Genera campos específicos:
  - brandName: Nombre corto y pegadizo para la marca del sitio (ej: "NicheMaster").
  - topTagline: Una frase corta y llamativa para la parte superior (ej: "🔥 Clase Gratuita Online - [Tema]").
  - navCta: Un texto MUY corto (máximo 3 palabras) para el botón del menú superior (ej: "Reservar Cupo", "Ingresar Ahora").
  - navLinks: Genera EXACTAMENTE 3 enlaces de navegación que coincidan con la estructura de la página. USA ESTRICTAMENTE ESTOS 'href' para que funcionen los anclajes del menú (no inventes otros hashtags):
       1. Label: (Algo relacionado a Beneficios/Descubre), href: "#seccion-beneficios"
       2. Label: (Algo relacionado a Testimonios/Resultados), href: "#seccion-testimonios"
       3. Label: (Algo relacionado al Experto/Instructor), href: "#seccion-instructor"
  - testimonialTitle: Un título persuasivo para los testimonios (ej: "Ellas ya cambiaron su historia:", "Resultados reales de alumnos:").
  - logoSvg: Genera el código crudo string de un elemento <svg> completo. El diseño debe ser PREMIUM, ESTILIZADO y COLORIDO (usa <defs> con <linearGradient> para dar profundidad y profesionalismo). Debe relacionarse visualmente con el nicho "${niche}". NO uses 'currentColor' ni 'fill="none"', usa colores hex o gradientes que contrasten bien sobre fondo oscuro o claro. viewBox="0 0 64 64".
  
  Estructura requerida del JSON:
  1. Hero: Título impactante (H1), subtítulo persuasivo y texto del botón principal (CTA). IMPORTANTE: En el campo 'headline', encierra la parte más importante o emocional de la frase entre etiquetas <b> y </b> (ejemplo: "¿Tu perro rompe cosas o <b>se porta mal?</b>").
  2. Testimonios: Genera 3 testimonios muy cortos (máximo 15 palabras) de clientes satisfechos, nombre y rating (5).
  3. Intro: Explicación clara de qué es el producto/servicio ("Qué es"). 
     - Genera 'imageCardText': Una frase corta y persuasiva (máx 12 palabras) que iría sobre una imagen destacada (ej: "El secreto que los expertos no te cuentan").
     - Genera 'items': 3 puntos clave (bullets) específicos de este nicho que expliquen características técnicas o beneficios únicos.
  4. Beneficios: Lista de 4 a 6 beneficios clave con títulos y descripciones cortas.
  5. Lo que aprenderás: Lista de 4 a 6 puntos clave (bullet points) de lo que obtendrá el usuario.
  6. FAQ: Genera 4 preguntas frecuentes con respuestas persuasivas que derriben objeciones de compra.
  7. Instructor/Experto: Nombre, título profesional y una biografía breve que genere autoridad (ficticia pero realista).
  8. Footer: Copyright y datos de contacto genéricos.
  
  Devuelve JSON.`;

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
        imageCardText: { type: Type.STRING, description: "Short persuasive text over image" },
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
        
        // --- LOGIC UPDATE: DEFAULT SUBTITLE FOR BENEFITS ---
        if (!content.benefits.subtitle) {
            content.benefits.subtitle = "Descubre las herramientas exclusivas que acelerarán tus resultados desde el primer día.";
        }
        
        // --- LOGIC UPDATE: DEFAULT TITLE FOR INSTRUCTOR ---
        if (!content.instructor.title) {
            content.instructor.title = "Conoce a tu Mentor";
        }

        // --- NEW DEFAULTS FOR EDITABLE TEXTS ---
        if (!content.instructor.badgeText) content.instructor.badgeText = "Instructor Destacado";
        if (!content.instructor.badgeSubtext) content.instructor.badgeSubtext = "Certificado Oficial";
        if (!content.instructor.statsStudents) content.instructor.statsStudents = "+500 Alumnos";
        if (!content.instructor.statsRating) content.instructor.statsRating = "5.0 Estrellas";
        
        if (!content.intro.imageCardText) content.intro.imageCardText = "Método Exclusivo";
        if (!content.hero.socialProofCount) content.hero.socialProofCount = "+1000";

        // --- NEW DEFAULTS FOR HERO & TESTIMONIALS (User Request) ---
        if (!content.hero.videoTitle) content.hero.videoTitle = "Clase Exclusiva";
        if (!content.hero.videoDuration) content.hero.videoDuration = "45 Minutos";
        if (!content.hero.spotsLeft) content.hero.spotsLeft = "¡Cupos Limitados!";
        if (!content.testimonialSubtitle) content.testimonialSubtitle = "Resultados reales de alumnos";
        
        // --- NEW DEFAULT FOR CLOSING OFFER TEXT ---
        if (!content.closingOfferText) {
            content.closingOfferText = "No dejes pasar esta oportunidad. Quedan pocos cupos para acceder a todos los beneficios.";
        }
        
        if (content.testimonials) {
            const randomLocations = [
                "Bogotá, Colombia", "Ciudad de México, México", "Lima, Perú", 
                "Santiago, Chile", "Buenos Aires, Argentina", "Madrid, España", 
                "Quito, Ecuador", "Medellín, Colombia", "Monterrey, México", 
                "Valencia, España", "Guadalajara, México", "Cali, Colombia"
            ];
            
            content.testimonials.forEach(t => {
                if (!t.location) {
                    t.location = randomLocations[Math.floor(Math.random() * randomLocations.length)];
                }
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
    // Prompt optimizado con restricciones estrictas para evitar texto basura (ej: chars count)
    const prompt = `Genera 4 títulos virales para un artículo sobre: "${topic}".
    Objetivo: "${objective}".
    ${keyword ? `Keyword SEO: "${keyword}"` : ''}

    REGLAS ESTRICTAS:
    1. Longitud máxima: 60 caracteres por título.
    2. En el campo 'title' devuelve SOLO el texto del título. NO escribas la longitud entre paréntesis ni explicaciones.
    3. NO generes descripciones. Deja el campo 'description' como una cadena vacía "". Solo queremos los títulos.
    4. NO devuelvas una lista enumerada dentro de un solo campo string. Cada título debe ser un objeto JSON distinto en el array.
    
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
        console.warn("Fallo IA en títulos, usando fallback local para no bloquear.", e);
        // Fallback rápido si falla la IA
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
    
    DEBES SEGUIR ESTRICTAMENTE ESTA ESTRUCTURA (No añadas ni quites nada fuera de este patrón):
    1. H1: [Título Principal]
    2. H2: [Título de Atención: Gancho fuerte relacionado al problema]
    3. H3: [Título que apoya/expande la Atención]
    4. H3: [Titulo que concluye la sección de Atención]
    5. H2: [Título de Interés: Datos, curiosidades o profundización]
    6. H3: [Título que apoya el Interés]
    7. H3: [Titulo que concluye el Interés]
    8. H2: [Título de Deseo: La solución o transformación]
    9. H3: [Título que apoya el Deseo]
    10. H3: [Titulo que concluye el Deseo]
    11. H4: [Conclusión del Deseo: Beneficio final]
    12. H2: [Título de Acción (CTA): Qué debe hacer ahora]
    13. H3: [Título que apoya la Acción/Urgencia]
    14. H3: [Titulo que concluye la Acción]
    15. H4: [Recomendación Final: Cierre]

    Devuelve SOLO un JSON array de strings.
    Ejemplo de formato de items: "H1: Título...", "H2: Atención...", etc.`;

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
    projectContext?: Project // NEW PARAMETER
): Promise<{ html: string; metaDescription: string }> => {
    
    // Enrich with Project Context
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
    1. Genera también una 'metaDescription' optimizada para SEO.
       - Debe tener MÁXIMO 155 caracteres.
       - Debe ser persuasiva.
       - Debe incluir un llamado a la acción (CTA) al final (ej: "¡Entra aquí!", "Lee más.").
    2. NO incluyas el Título Principal (H1) dentro de la respuesta 'html'. Empieza directamente con la introducción o el primer párrafo del cuerpo. El título se gestiona por separado en el sistema.
    
    Formato de Salida JSON:
    {
      "html": "Código HTML del artículo (usa <h2>, <p>, <ul>, <li>, <strong>, <a href='...'>). NO incluyas <h1>, <html> o <body>.",
      "metaDescription": "Texto plano de la meta descripción."
    }
    
    Idioma: Español Neutro.`;

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
        return { html: `<p>Error de conexión o timeout generando el artículo. Intenta con un tema más corto.</p>`, metaDescription: "" };
    }
};