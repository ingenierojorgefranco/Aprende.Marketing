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
  
  // Actualización 31/12/2025 18:50 - Log de inicio de preparación
  console.log(`[IA-LOG] ${new Date().toLocaleTimeString()} - Preparando contexto y prompt...`);

  let ctaContext = "";
  if (destination.type === 'whatsapp') {
    ctaContext = "Objetivo: Cierre por WhatsApp. El CTA debe invitar al chat.";
  } else if (destination.type === 'form') {
    ctaContext = "Objetivo: Captura de leads. El CTA debe invitar al registro.";
  } else {
    ctaContext = "Objetivo: Redirección externa/checkout.";
  }

  let projectStrategy = "";
  if (projectContext) {
      const painsText = (projectContext.painPoints && projectContext.painPoints.length > 0) 
          ? `- Dolores (USAR ESTOS 6): ${projectContext.painPoints.slice(0, 6).join(", ")}` 
          : "";
      const benefitsText = (projectContext.keyBenefits && projectContext.keyBenefits.length > 0) 
          ? `- Beneficios (USAR ESTOS 6): ${projectContext.keyBenefits.slice(0, 6).join(", ")}` 
          : "";

      projectStrategy = `
      ESTRATEGIA PROYECTO:
      - Producto: "${projectContext.productName}"
      - Tono: "${projectContext.brandTone}"
      ${painsText}
      ${benefitsText}
      - Contexto: ${projectContext.description}.
      
      REGLA: Sincroniza dolores y beneficios exactamente con los proporcionados.`;
  }

  // Actualización 31/12/2025 18:50 - Prompt optimizado para ser más directo
  const prompt = `Actúa como Copywriter Senior. Genera contenido para una Landing de alta conversión en ESPAÑOL.
  Nicho: "${niche}". Objetivo: "${goal}". Audiencia: "${targetAudience}". Oferta: "${offerType}".
  ${ctaContext}
  ${projectStrategy}

  REQUERIMIENTOS:
  - Sin SVG. Solo texto persuasivo.
  - Usa <b> para resaltar partes clave en el Hero headline.
  - NavLinks: ["#seccion-beneficios", "#seccion-testimonios", "#seccion-instructor"].
  - Genera: brandName, topTagline, navCta, testimonialTitle, hero, testimonials(3), intro(imageCardText + 3 items), benefits, whatYouWillLearn(4-6), faq(4), instructor, footer, thankYouMessage, redirectUrl.

  Responde EXCLUSIVAMENTE con el JSON solicitado.`;

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
    
    // Actualización 31/12/2025 18:50 - Log de inicio de validación
    console.log(`[IA-LOG] ${new Date().toLocaleTimeString()} - Iniciando validación y parseo de estructura...`);

    if (response.text) {
        let content: GeneratedPageContent;
        try {
            content = JSON.parse(response.text) as GeneratedPageContent;
        } catch (e) {
            // Actualización 31/12/2025 18:50 - Intento de reparación de JSON malformado
            console.warn("[IA-LOG] JSON malformado detectado. Intentando reparación de emergencia...");
            const repaired = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
            content = JSON.parse(repaired) as GeneratedPageContent;
        }

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

        // Actualización 31/12/2025 18:50 - Log de sincronización con estrategia
        if (projectContext?.strategy_json) {
            console.log(`[IA-LOG] ${new Date().toLocaleTimeString()} - Sincronizando con Estrategia Maestra del Proyecto...`);
            const strategy = projectContext.strategy_json;
            const strategyBenefits = strategy?.modules?.web?.landingPageTabs?.benefits?.items;
            
            if (Array.isArray(strategyBenefits) && strategyBenefits.length > 0) {
                content.benefits.items = strategyBenefits.map((b: any) => ({
                    title: b.title,
                    description: b.desc || b.description || "", 
                    icon: b.icon,
                    color: b.color
                }));
            }
        }

        console.log(`[IA-LOG] ${new Date().toLocaleTimeString()} - Generación completada con éxito.`);
        return content;
    }
  } catch (error) {
      console.error("[IA-LOG] AI Generation Error:", error);
      throw new Error("Failed to generate content");
  }
  throw new Error("Failed to generate content");
};