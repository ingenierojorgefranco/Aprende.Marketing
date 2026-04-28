
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
      const pH1 = pStrategy?.landingPageTabs?.hero?.h1 || pStrategy?.modules?.web?.landingPageTabs?.hero?.h1 || "";
      const pH2 = pStrategy?.landingPageTabs?.hero?.h2 || pStrategy?.modules?.web?.landingPageTabs?.hero?.h2 || "";
      const pBrandName = pStrategy?.meta?.brandName || "";
      
      const mandatoryHeadlines = (pH1 && pH2) 
          ? `- Título Principal OBLIGATORIO (h1): "${pH1}"\n      - Subtítulo OBLIGATORIO (h2): "${pH2}"`
          : "";

      const brandNameContext = pBrandName 
          ? `- Nombre de Marca OBLIGATORIO: "${pBrandName}"` 
          : `- Genera un Nombre de Marca: Debe ser un nombre de negocio creativo de 2 a 3 palabras (ej: 'Nicho Academy', 'Studio X'). NO uses solo el nombre del profesor.`;

      // 2. Extraer Dolores (Pains) - Prioriza strategy_json (Informe Maestro), sino busca en campos básicos - 01/01/2026 13:05
      let extractedPains: string[] = [];
      if (pStrategy?.psychology?.pains && pStrategy.psychology.pains.length > 0) {
          extractedPains = pStrategy.psychology.pains.map((p: any) => typeof p === 'object' ? (p.text || p.title || "") : String(p));
      } else if (Array.isArray(projectContext.painPoints)) {
          extractedPains = projectContext.painPoints.map(p => String(p));
      }
      
      const painsText = (extractedPains.length > 0) 
          ? `- Dolores del Cliente (USA ESTOS PUNTOS PARA EMPATIZAR): ${extractedPains.slice(0, 9).join(", ")}` 
          : "";

      // 3. Extraer Transformaciones (Lo que aprenderás) - REGLA CRÍTICA
      let extractedLearning: string[] = [];
      if (pStrategy?.psychology?.learningModules && pStrategy.psychology.learningModules.length > 0) {
          extractedLearning = pStrategy.psychology.learningModules.map((m: any) => `${m.title}: ${m.description}`);
      }
      const learningContext = (extractedLearning.length > 0)
          ? `- Transformaciones/Lo que aprenderás (COPIA ESTO EXACTAMENTE): ${extractedLearning.join(" | ")}`
          : "";

      // 4. Extraer Beneficios - Prioriza psychology.solutions, sino busca en campos básicos
      let extractedBenefitsData: any[] = [];
      if (pStrategy?.psychology?.solutions && pStrategy.psychology.solutions.length > 0) {
          extractedBenefitsData = pStrategy.psychology.solutions;
      } else if (pStrategy?.modules?.web?.landingPageTabs?.benefits?.items && pStrategy.modules.web.landingPageTabs.benefits.items.length > 0) {
          extractedBenefitsData = pStrategy.modules.web.landingPageTabs.benefits.items;
      } else if (Array.isArray(projectContext.keyBenefits)) {
          extractedBenefitsData = projectContext.keyBenefits;
      }

      const benefitsText = (extractedBenefitsData.length > 0) 
          ? `- Beneficios Clave (USA ESTOS 6 PUNTOS EXACTAMENTE, incluye su descripción): ${extractedBenefitsData.slice(0, 6).map(b => typeof b === 'string' ? b : `${b.title}: ${b.description}`).join(" | ")}` 
          : "";

      // 4. Extraer Testimonios de la Estrategia Maestra - 08/01/2026
      let testimonialsText = "";
      if (pStrategy?.modules?.testimonials && pStrategy.modules.testimonials.length > 0) {
          testimonialsText = `- Testimonios OBLIGATORIOS (USA ESTOS DATOS): ${JSON.stringify(pStrategy.modules.testimonials)}`;
      }

      projectStrategy = `
      --- BASE DE DATOS ESTRATÉGICA (OBLIGATORIO USAR): ---
      - Nombre del Producto: "${pName}"
      - Tono de Voz de Marca: "${pTone}"
      ${mandatoryHeadlines}
      ${brandNameContext}
      ${painsText}
      ${learningContext}
      ${benefitsText}
      ${testimonialsText}
      - Descripción del Proyecto: ${pDesc}.
      
      INSTRUCCIÓN DE CONTROL TOTAL: He proporcionado arriba los Títulos, Dolores, Transformaciones y Beneficios. NO TIENES PERMISO PARA GENERAR NUEVOS. Tu única tarea es insertarlos en los campos correspondientes del JSON ("hero.headline", "hero.subheadline", "benefits.items", "whatYouWillLearn.items", "testimonials") exactamente como aparecen. Prohibido inventar contenido de marketing paralelo.
      `;
  }

  // JSON Template Prompting: Definición compacta de la estructura requerida para reducir tokens - 01/01/2026 14:25
  const jsonStructureTemplate = `{
    "brandName": "string",
    "topTagline": "string",
    "navCta": "string",
    "testimonialTitle": "string",
    "whatYouWillLearn": {
      "title": "string",
      "avatarTitles": ["Si buscas crear tu propio negocio y reinventarte profesionalmente", "Si ya estás en el sector belleza y quieres dominar la técnica más top", "Si te da miedo fallar por falta de experiencia pero buscas respaldo"],
      "items": ["Dolor 1 Avatar 1", "Dolor 2 Avatar 1", "Dolor 3 Avatar 1", "Dolor 1 Avatar 2", "Dolor 2 Avatar 2", "Dolor 3 Avatar 2", "Dolor 1 Avatar 3", "Dolor 2 Avatar 3", "Dolor 3 Avatar 3"]
    },
    "hero": { "headline": "string", "subheadline": "string", "ctaText": "string" },
    "intro": { "title": "string", "description": "string" },
    "faq": [{"question": "string", "answer": "string"}],
    "instructor": { "name": "string", "bio": "string" },
    "footer": { "copyright": "string", "contact": "string" },
    "thankYouMessage": "string",
    "redirectUrl": "string",
    "thankYouPage": {
      "showSocials": boolean,
      "ctaLink": "string",
      "progressBarText": "string",
      "greenBadgeText": "string",
      "headline": "string",
      "subheadline": "string",
      "step1Title": "string",
      "step1Desc": "string",
      "step1Warning": "string",
      "step1Subject": "string",
      "step2Title": "string",
      "step2Desc": "string",
      "step2Badge": "string",
      "step2BonusTitle": "string",
      "step2BonusValue": "string",
      "offerTopTitle": "string",
      "offerHeadline": "string",
      "offerDescription": "string",
      "bookTitle": "string",
      "bookSubtitle": "string",
      "bookFooter": "string",
      "offerPriceRegular": "string",
      "offerPriceFree": "string",
      "offerBadge": "string",
      "offerBullets": ["string"],
      "ctaButtonText": "string",
      "learningTitle": "string",
      "learningSubtitle": "string",
      "learningItems": [{"title": "string", "description": "string"}],
      "socialTitle": "string",
      "socialSubtitle": "string",
      "socialCountText": "string",
      "socialItems": [{"name": "string", "location": "string", "text": "string"}],
      "faqTitle": "string",
      "faqItems": [{"question": "string", "answer": "string"}]
    }
  }`;

  const prompt = `Actúa como un experto en copywriting y marketing digital. Genera el contenido COMPLETO para una Landing Page de alta conversión en ESPAÑOL para el nicho "${niche}".
  El objetivo es "${goal}". 
  
  REGLA PARA EL topTagline (ALTA CONVERSIÓN):
  El campo "topTagline" es el badge que va sobre el título. Debe ser extremadamente corto (2-4 palabras) y usar emojis. 
  REGLA CRÍTICA: Elige ROBUSTAMENTE uno de estos enfoques: 
  - Urgencia: 🔥 ACCESO 100% GRATUITO
  - Resultado: 🚀 MÉTODO REVELADO
  - Exclusividad: 💎 CONTENIDO VIP
  - Curiosidad: 🎯 LO QUE NADIE TE DICE
  - Escasez: ⚠️ ÚLTIMOS CUPOS
  PROHIBIDO usar frases genéricas y aburridas como 'Registro Abierto'.

  REGLA PARA EL brandName (CRÍTICA):
  El campo "brandName" debe ser el nombre del negocio o academia. Debe tener de 2 a 3 palabras y estar directamente relacionado con el negocio (ej: 'Beauty Academy', 'Marketing Pro'). 
  PROHIBIDO usar solo nombres personales (ej: 'Ariana Zamora'). Si recibes un nombre personal en el contexto, adáptalo a un nombre de negocio (ej: 'Ariana Zamora Studio').

  CONTEXTO DE AUDIENCIA (PRIORIDAD ALTA PARA EL COPY):
  "${targetAudience}"
  
  La oferta es de tipo "${offerType}".
  ${ctaContext}
  
  ${projectStrategy}

  INSTRUCCIONES DE CONTROL DE DATOS (MÁXIMA PRIORIDAD):
  1. SECCIONES ELIMINADAS: NO GENERES NI INCLUYAS las secciones "testimonials" ni "benefits" en tu respuesta. Han sido eliminadas del esquema para evitar redundancia. Céntrate únicamente en el Hero, la Intro, el FAQ y la Identificación de Dolores (whatYouWillLearn).
  2. PROHIBIDO incluir años específicos (ej: 2024, 2025). El contenido debe ser atemporal (evergreen).
  3. Los titulares (Hero) y la descripción (Intro) deben tener un enfoque GENERAL que resuene con los 3 perfiles de avatar.
  4. IDENTIFICACIÓN DE AVATARES Y DOLORES (whatYouWillLearn): 
     - "avatarTitles": Genera 3 frases de identificación aspiracional BASADAS EN LA DESCRIPCIÓN DE LA AUDIENCIA. Deben empezar obligatoriamente con "Si..." (ej: "Si buscas...", "Si te sientes...", "Si ya tienes...").
     - ESTÁ PROHIBIDO incluir el nombre del avatar (ej: "La Soñadora") o dolores específicos en el título. El título debe servir para que el usuario se identifique con su situación o deseo actual.
     - "items": Genera 9 puntos de dolor (3 por cada avatar) que sean el problema real que esas personas están viviendo. Estos SÍ deben ser dolores directos y específicos.
  
  INSTRUCCIÓN CRÍTICA: Utiliza los detalles de la audiencia proporcionados arriba para que cada frase, beneficio y dolor resuene directamente con sus necesidades específicas. Si el contexto menciona dolores o deseos específicos, úsalos como base para el Hero y los beneficios.
  
  INSTRUCCIÓN DE CARTA DE VENTAS (SECCIÓN INTRO):
  La sección "intro" NO debe ser un párrafo genérico. Debe ser una CARTA DE VENTAS poderosa y profesional.
  - El campo "intro.title" debe ser un titular de carta de ventas que detenga el scroll (ej: "Lee esto solo si quieres dejar de perder dinero...").
  - Usa etiquetas <mark> en el "intro.title" para resaltar la promesa o el beneficio más impactante del título.
  - El campo "intro.description" debe contener el cuerpo de la carta. Escríbela en primera persona o como una recomendación experta.
  - REGLA DE LEGIBILIDAD: Divide el texto en PÁRRAFOS MUY CORTOS (máximo 2-3 líneas por párrafo). Usa doble salto de línea entre párrafos.
  - Usa etiquetas <mark> para resaltar las frases o palabras más importantes en el cuerpo de la carta (se verán con fondo amarillo).
  - Toca dolores profundos, muestra empatía y presenta la solución como la oportunidad definitiva.
  - Debe ser extensa y persuasiva, llevando al usuario de la mano hacia el deseo.

  REQUERIMIENTO DE VELOCIDAD: No generes código SVG para logos. Solo genera los textos persuasivos.
  
  Estructura JSON requerida (Responde exactamente con esta forma):
  ${jsonStructureTemplate}

  Instrucciones de contenido:
  1. Hero: Título (con etiquetas <b> en la parte emocional), subtítulo y botón.
  2. Intro: Carta de ventas poderosa (descrita arriba).
  3. FAQ: 4 preguntas que maten objeciones.
  4. Instructor: Nombre y biografía.
  5. Footer: Copyright y contacto.
  9. BLUEPRINT DE PÁGINA DE GRACIAS (Usa estos valores como base y adáptalos sutilmente al nicho):
     - headline: "PERFECTO, YA TIENES EL ACCESO A LA CLASE DE ... (Añade aquí la Clase)"
     - subheadline: "Sigue estos 2 pasos sencillos para asegurar tu cupo y recibir tu material de preparación gratuito."
     - progressBarText: "¡ESPERA! SÓLO TE FALTA UN ÚLTIMO PASO PARA TERMINAR."
     - greenBadgeText: "RECIBE TU REGALO 100% GRATIS"
     - step1Title: "Revisa tu Correo Electrónico"
     - step1Desc: "Hemos enviado el enlace de acceso a la clase y tu regalo a tu correo electrónico."
     - step1Warning: "Importante: Si no ves el mensaje en tu correo, verifica tu bandeja de SPAM o Promociones."
     - step2Title: "Únete a nuestro Grupo VIP + Regalo"
     - step2Desc: "Únete al grupo de WhatsApp para recibir la mentoría y tu regalo de bienvenida.."
     - step2Badge: "¡ACCIÓN REQUERIDA!"
     - step2BonusTitle: "Libro Digital GRATIS" 
     - step2BonusValue: "Precio Regular: $27 USD"  
     - offerTopTitle: "UNETE A NUESTRO GRUPO Y DESCARGA EL LIBRO GRATUITO" 
     - offerHeadline: "Descarga: y luego añade aqui el libro digital relacionado con el producto digital en la clase"
     - offerDescription: "Esta guía nace de la experiencia de profesionales del sector. Te compartimos los fallos más frecuentes y cómo prevenirlos paso a paso para resultados perfectos."
     - bookTitle: "Titulo del Libro"
     - bookSubtitle: "Lo que Siempre Quisiste Saber!!!"
     - bookFooter: "¡OFERTA FLASH!"
     - offerPriceRegular: "Precio Regular: $27 USD"
     - offerPriceFree: "HOY: $0.00 GRATIS"
     - ctaButtonText: "UNIRME AL GRUPO Y DESCARGAR"
     - learningTitle: "Lo que aprenderás con esta Guía"
     - learningItems: Genera EXACTAMENTE 6 puntos clave de aprendizaje sobre el libro digital.
     - socialItems: Genera EXACTAMENTE 4 testimonios realistas de personas que ya leyeron la guía/libro.
     - faqItems: Genera EXACTAMENTE 5 preguntas frecuentes con sus respuestas. Cada respuesta debe ser de un párrafo (no corto) y estar relacionada específicamente con el libro digital (formato, acceso, contenido, etc).
  
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
        if (!content.hero.socialProofCount) content.hero.socialProofCount = "+1000";
        if (!content.hero.videoTitle) content.hero.videoTitle = "Clase Exclusiva";
        if (!content.hero.videoDuration) content.hero.videoDuration = "45 Minutos";
        if (!content.hero.videoUrl) content.hero.videoUrl = "";
        if (!content.hero.spotsLeft) content.hero.spotsLeft = "¡Cupos Limitados!";
        if (!content.topTagline) content.topTagline = "🔥 ACCESO GRATUITO POR TIEMPO LIMITADO";
        if (!content.testimonialSubtitle) content.testimonialSubtitle = "Resultados reales de alumnos";
        if (!content.closingOfferText) content.closingOfferText = "No dejes pasar esta oportunidad. Quedan pocos cupos para acceder.";
        
        // Títulos de testimonios dinámicos según el destino
        if (destination.type === 'form') {
            content.testimonialTitle = "Ellos ya se registraron en nuestra clase gratuita";
        } else if (destination.type === 'whatsapp') {
            content.testimonialTitle = "Ellos ya se unieron y están transformando su historia";
        } else {
            content.testimonialTitle = "Ellos ya se registraron y descargaron nuestra guía";
        }

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

            // 1. INYECCIÓN OBLIGATORIA DE TÍTULOS (ESTRATEGIA)
            const pH1 = pStrategy?.landingPageTabs?.hero?.h1 || pStrategy?.modules?.web?.landingPageTabs?.hero?.h1;
            const pH2 = pStrategy?.landingPageTabs?.hero?.h2 || pStrategy?.modules?.web?.landingPageTabs?.hero?.h2;
            if (pH1) content.hero.headline = pH1;
            if (pH2) content.hero.subheadline = pH2;
            
            // Inyectar Brand Name de la estrategia si existe
            const pBrandName = pStrategy?.meta?.brandName;
            if (pBrandName) content.brandName = pBrandName;

            // Inyectar Top Tagline de la estrategia si existe
            const pTopTagline = pStrategy?.landingPageTabs?.hero?.topTagline || pStrategy?.modules?.web?.landingPageTabs?.hero?.topTagline;
            if (pTopTagline) content.topTagline = pTopTagline;

            // 2. INYECCIÓN OBLIGATORIA DE TRANSFORMACIONES (LO QUE APRENDERÁS)
            content.benefits.title = "Lo que aprenderás en nuestra clase";
            content.benefits.subtitle = "";
            let rawLearningModules = (pStrategy?.psychology?.learningModules && pStrategy.psychology.learningModules.length > 0)
                ? pStrategy.psychology.learningModules
                : (pStrategy?.psychology?.solutions && pStrategy.psychology.solutions.length > 0)
                    ? pStrategy.psychology.solutions
                    : (Array.isArray(projectContext.keyBenefits) ? [...projectContext.keyBenefits] : []);

            if (rawLearningModules.length > 0) {
                const defaultColors = ['purple', 'blue', 'green', 'emerald', 'orange', 'red', 'teal'];
                content.benefits.items = rawLearningModules.slice(0, 9).map((b: any, idx: number) => ({
                    title: typeof b === 'object' ? (b.title || "") : String(b),
                    description: typeof b === 'object' ? (b.description || b.desc || "") : "", 
                    icon: b.icon || "Sparkles",
                    color: b.color || defaultColors[idx % defaultColors.length]
                }));
            }

            // 3. INYECCIÓN OBLIGATORIA DE IDENTIFICACIÓN DE AVATARES (ESTA CLASE ES PARA TI)
            content.whatYouWillLearn.title = "Esta clase es para ti si...";
            content.whatYouWillLearn.avatarIcons = ["Sparkles", "TrendingUp", "UserCheck"];

            let rawPains = (pStrategy?.psychology?.pains && pStrategy.psychology.pains.length > 0)
                ? pStrategy.psychology.pains
                : (Array.isArray(projectContext.painPoints) ? [...projectContext.painPoints] : []);

            if (rawPains.length > 0) {
                content.whatYouWillLearn.items = rawPains.slice(0, 9).map((p: any) => typeof p === 'object' ? (p.text || p.title || "") : String(p));
            }

            // 4. INYECCIÓN OBLIGATORIA DE TESTIMONIOS (ESTRATEGIA)
            let rawTestimonials = (pStrategy?.modules?.testimonials && pStrategy.modules.testimonials.length > 0)
                ? pStrategy.modules.testimonials
                : (pStrategy?.modules?.testimonials && pStrategy.modules.testimonials.length > 0)
                    ? pStrategy.modules.testimonials
                    : [];

            if (rawTestimonials.length > 0) {
                content.testimonials = rawTestimonials.slice(0, 3).map((t: any) => ({
                    name: String(t.name || ""),
                    text: String(t.text || ""),
                    rating: 5,
                    image: String(t.image || "")
                }));
            }
        }

        // Aplicar la imagen de persona misteriosa de alta calidad como predeterminada para el instructor
        if (content.instructor && (!content.instructor.imageUrl || content.instructor.imageUrl.includes('unsplash.com'))) {
          content.instructor.imageUrl = "https://ceslava.s3-accelerate.amazonaws.com/2016/04/mistery-man-gravatar-wordpress-avatar-persona-misteriosa-510x510.png";
        }

        return content;
    }
  } catch (error) {
      console.error("AI Generation Error", error);
      throw new Error("Failed to generate content");
  }
  throw new Error("Failed to generate content");
};
