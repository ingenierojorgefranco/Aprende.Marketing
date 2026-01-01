
// Refactorización: Creación de servicio para contenido de landing pages - 22/05/2024 14:30
import { callGeminiBackend, Type, PREDEFINED_LOGOS } from "./base";
import { GeneratedPageContent, ColorPalette, StructureType, DestinationConfig, Project } from "../../types";

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
    ctaContext = "El objetivo es que contacten por WhatsApp. El botón (CTA) debe invitar a chatear.";
  } else if (destination.type === 'form') {
    ctaContext = "El objetivo es capturar leads con un formulario.";
  } else {
    ctaContext = "El objetivo es redirigir a una página de ventas externa o checkout.";
  }

  let projectStrategy = "";
  if (projectContext) {
      // Limpieza de Datos: Extracción de valores puros para eliminar la carga de prototipos y metadatos - 01/01/2026 13:05
      const pName = String(projectContext.productName || "");
      const pTone = String(projectContext.brandTone || "");
      const pDesc = String(projectContext.description || "");
      const pStrategy = projectContext.strategy_json ? JSON.parse(JSON.stringify(projectContext.strategy_json)) : null;

      // 1. Extraer Dolores (Pains) - Prioriza campo directo, sino busca en strategy_json - 01/01/2026 13:05
      let extractedPains = Array.isArray(projectContext.painPoints) ? [...projectContext.painPoints] : [];
      if (extractedPains.length === 0 && pStrategy?.psychology?.pains) {
          extractedPains = pStrategy.psychology.pains;
      }
      
      const painsText = (extractedPains.length > 0) 
          ? `- Dolores del Cliente (USA ESTOS 6 PUNTOS EXACTAMENTE): ${extractedPains.slice(0, 6).join(", ")}` 
          : "";

      // 2. Extraer Beneficios - Prioriza campo directo, sino busca en strategy_json (títulos de items) - 01/01/2026 13:05
      let extractedBenefits = Array.isArray(projectContext.keyBenefits) ? [...projectContext.keyBenefits] : [];
      if (extractedBenefits.length === 0 && pStrategy?.modules?.web?.landingPageTabs?.benefits?.items) {
          extractedBenefits = pStrategy.modules.web.landingPageTabs.benefits.items.map((b: any) => b.title);
      }

      const benefitsText = (extractedBenefits.length > 0) 
          ? `- Beneficios Clave (USA ESTOS 6 PUNTOS EXACTAMENTE): ${extractedBenefits.slice(0, 6).join(", ")}` 
          : "";

      projectStrategy = `
      CONTEXTO ESTRATÉGICO DEL PROYECTO (ORDEN DE PRIORIDAD MÁXIMA):
      - Nombre del Producto: "${pName}"
      - Tono de Voz de Marca: "${pTone}" (Usa este tono en TODO el copy).
      ${painsText}
      ${benefitsText}
      - Descripción del Proyecto: ${pDesc}.
      
      REGLA OBLIGATORIA: Si te he proporcionado los Dolores y Beneficios arriba, COPIA su sentido exactamente en las secciones correspondientes de la landing. NO inventes unos nuevos para ahorrar tiempo.
      `;

      // DEBUG LOG: Se actualiza para verificar la integración con datos limpios - 01/01/2026 13:05
      console.log("[DEBUG LANDING] Integración de Estrategia del Proyecto (Datos Limpios):", {
          pName,
          pTone,
          painsTextFound: painsText.length > 0,
          benefitsTextFound: benefitsText.length > 0
      });
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
  3. Intro: Qué es el producto. Genera 'imageCardText' (frase corta) and 'items' (3 bullets).
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
        content.logoSvg = PREDEFINED_LOGOS[Math.floor(Math.random() * PREDEFINED_LOGOS.length)];

        if (!content.testimonials) content.testimonials = [];
        if (!content.faq) content.faq = [];
        if (!content.navLinks) content.navLinks = [];
        if (!content.intro) content.intro = { title: "", description: "" };
        if (!content.intro.items) content.intro.items = [];
        if (!content.benefits) content.benefits = { title: "", items: [] };
        if (!content.benefits.items) content.benefits.items = [];
        if (!content.whatYouWillLearn) content.whatYouWillLearn = { title: "", items: [] };
        if (!content.whatYouWillLearn.items) content.whatYouWillLearn.items = [];

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

        // Actualización: Persistencia forzada de 6 dolores y beneficios en el JSON - 01/01/2026 13:20
        if (projectContext) {
            const pStrategy = projectContext.strategy_json ? JSON.parse(JSON.stringify(projectContext.strategy_json)) : null;

            // 1. Sincronización Estricta de Beneficios (Exactamente 6) - 01/01/2026 13:20
            let rawBenefits = Array.isArray(projectContext.keyBenefits) ? [...projectContext.keyBenefits] : [];
            if (rawBenefits.length === 0 && pStrategy?.modules?.web?.landingPageTabs?.benefits?.items) {
                rawBenefits = pStrategy.modules.web.landingPageTabs.benefits.items;
            }

            if (rawBenefits.length > 0) {
                content.benefits.items = rawBenefits.slice(0, 6).map((b: any) => ({
                    title: typeof b === 'string' ? b : (b.title || ""),
                    description: typeof b === 'string' ? "" : (b.desc || b.description || ""), 
                    icon: b.icon || "Sparkles",
                    color: b.color || "blue"
                }));
            }

            // 2. Sincronización Estricta de Dolores en "Lo que aprenderás" (Exactamente 6) - 01/01/2026 13:20
            let rawPains = Array.isArray(projectContext.painPoints) ? [...projectContext.painPoints] : [];
            if (rawPains.length === 0 && pStrategy?.psychology?.pains) {
                rawPains = pStrategy.psychology.pains;
            }

            if (rawPains.length > 0) {
                content.whatYouWillLearn.items = rawPains.slice(0, 6).map((p: any) => String(p));
                content.whatYouWillLearn.title = "¿Te sientes identificado con alguna de estas situaciones?";
                content.whatYouWillLearn.icon = "AlertTriangle";
            }
        }

        return content;
    }
  } catch (error) {
      console.error("AI Generation Error", error);
      throw new Error("Failed to generate content");
  }
  throw new Error("Failed to generate content");


};
