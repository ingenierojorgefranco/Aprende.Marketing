
// Refactorización: Creación de servicio para contenido de landing pages - 22/05/2024 14:30
import { callGeminiBackend, PREDEFINED_LOGOS } from "./base";
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

      // 1. Extraer Títulos definidos en la estrategia (Web Blueprint) - 12/03/2025 10:00
      const pH1 = pStrategy?.modules?.web?.landingPageTabs?.hero?.h1 ? String(pStrategy.modules.web.landingPageTabs.hero.h1) : "";
      const pH2 = pStrategy?.modules?.web?.landingPageTabs?.hero?.h2 ? String(pStrategy.modules.web.landingPageTabs.hero.h2) : "";
      const mandatoryHeadlines = (pH1 && pH2) 
          ? `- Título Principal OBLIGATORIO (h1): "${pH1}"\n      - Subtítulo OBLIGATORIO (h2): "${pH2}"`
          : "";

      // 2. Extraer Dolores (Pains) - Prioriza campo directo, sino busca en strategy_json - 01/01/2026 13:05
      let extractedPains: string[] = Array.isArray(projectContext.painPoints) ? projectContext.painPoints.map(p => String(p)) : [];
      if (extractedPains.length === 0 && pStrategy?.psychology?.pains) {
          extractedPains = pStrategy.psychology.pains.map((p: any) => String(p));
      }
      
      const painsText = (extractedPains.length > 0) 
          ? `- Dolores del Cliente (USA ESTOS 6 PUNTOS EXACTAMENTE): ${extractedPains.slice(0, 6).join(", ")}` 
          : "";

      // 3. Extraer Beneficios - Prioriza campo directo, sino busca en strategy_json (títulos de items) - 01/01/2026 13:05
      let extractedBenefits: string[] = Array.isArray(projectContext.keyBenefits) ? projectContext.keyBenefits.map(b => String(b)) : [];
      if (extractedBenefits.length === 0 && pStrategy?.modules?.web?.landingPageTabs?.benefits?.items) {
          extractedBenefits = pStrategy.modules.web.landingPageTabs.benefits.items.map((b: any) => String(b.title));
      }

      const benefitsText = (extractedBenefits.length > 0) 
          ? `- Beneficios Clave (USA ESTOS 6 PUNTOS EXACTAMENTE): ${extractedBenefits.slice(0, 6).join(", ")}` 
          : "";

      projectStrategy = `
      CONTEXTO ESTRATÉGICO DEL PROYECTO (ORDEN DE PRIORIDAD MÁXIMA):
      - Nombre del Producto: "${pName}"
      - Tono de Voz de Marca: "${pTone}" (Usa este tono en TODO el copy).
      ${mandatoryHeadlines}
      ${painsText}
      ${benefitsText}
      - Descripción del Proyecto: ${pDesc}.
      
      REGLA OBLIGATORIA: Si te he proporcionado los Títulos (h1, h2), Dolores y Beneficios arriba, COPIA su sentido exactamente en las secciones correspondientes de la landing. NO inventes unos nuevos para ahorrar tiempo.
      `;
  }

  // JSON Template Prompting: Definición compacta de la estructura requerida para reducir tokens - 01/01/2026 14:25
  const jsonStructureTemplate = `{
    "brandName": "string",
    "topTagline": "string",
    "navCta": "string",
    "navLinks": [{"label": "string", "href": "string"}],
    "testimonialTitle": "string",
    "hero": { "headline": "string", "subheadline": "string", "ctaText": "string" },
    "testimonials": [{"name": "string", "text": "string", "rating": number}],
    "intro": { "title": "string", "description": "string", "imageCardText": "string", "items": [{"title": "string", "description": "string"}] },
    "benefits": { "title": "string", "items": [{"title": "string", "description": "string"}] },
    "whatYouWillLearn": { "title": "string", "items": ["string"] },
    "faq": [{"question": "string", "answer": "string"}],
    "instructor": { "name": "string", "bio": "string" },
    "footer": { "copyright": "string", "contact": "string" },
    "thankYouMessage": "string",
    "redirectUrl": "string"
  }`;

  const prompt = `Actúa como un experto en copywriting y marketing digital. Genera el contenido COMPLETO para una Landing Page de alta conversión en ESPAÑOL para el nicho "${niche}".
  El objetivo es "${goal}". La audiencia objetivo es "${targetAudience}".
  La oferta es de tipo "${offerType}".
  ${ctaContext}
  
  ${projectStrategy}

  REQUERIMIENTO DE VELOCIDAD: No generes código SVG para logos. Solo genera los textos persuasivos.
  
  Estructura JSON requerida (Responde exactamente con esta forma):
  ${jsonStructureTemplate}

  Instrucciones de contenido:
  1. Hero: Título (con etiquetas <b> en la parte emocional), subtítulo y botón.
  2. Testimonios: 3 testimonios cortos y realistas.
  3. Intro: Qué es el producto. Genera 'imageCardText' (frase corta) and 'items' (3 bullets).
  4. Beneficios: Lista detallada (usa los proporcionados en el contexto si existen).
  5. Lo que aprenderás: 4-6 puntos clave (basados en dolores si existen).
  6. FAQ: 4 preguntas que maten objeciones.
  7. Instructor: Nombre y biografía.
  8. Footer: Copyright y contacto.
  
  Responde ÚNICAMENTE con el objeto JSON válido.`;

  try {
    // Se utiliza el modelo Pro con Thinking Config para evitar errores de formato y mejorar la persuasión.
    const response = await callGeminiBackend(prompt, null, true, "gemini-3-pro-preview", 16384);
    
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

        if (projectContext) {
            const pStrategy = projectContext.strategy_json ? JSON.parse(JSON.stringify(projectContext.strategy_json)) : null;

            // SOBRESCRITURA DE SEGURIDAD: Forzar Títulos (Headline/Subheadline) desde la Estrategia Maestra
            const pH1 = pStrategy?.modules?.web?.landingPageTabs?.hero?.h1;
            const pH2 = pStrategy?.modules?.web?.landingPageTabs?.hero?.h2;
            if (pH1) content.hero.headline = pH1;
            if (pH2) content.hero.subheadline = pH2;

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
