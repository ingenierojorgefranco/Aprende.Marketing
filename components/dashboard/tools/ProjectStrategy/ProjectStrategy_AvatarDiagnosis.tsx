import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { Search, AlertCircle, Sparkles, Target, ShieldCheck, Brain, Zap, Magnet, Shield, Quote, Crown, MessageSquare, Check, Lock, GraduationCap, Flame, AlertTriangle, Rocket, ArrowRight, Users, Clock, Coffee, Heart, Play, ChevronDown, ChevronUp, Calendar, FileText, Globe, ChevronRight } from 'lucide-react';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';
import { EstrategiaComercialDrawer, CommercialOptionId } from '../../wizard/EstrategiaComercialDrawer';

interface ProjectStrategy_AvatarDiagnosisProps {
    avatars: any[];
    benefitsItems?: Array<{ title: string; desc: string }>;
    psychology: {
        pains: string[];
        solutions: any[]; // Se cambia de string[] a any[] para soportar el nuevo formato de objetos
        awarenessStages: {
            stage1_pain: string;
            stage2_solution: string;
            stage3_barrier: string;
        };
        conversionStrategy: {
            mainFocus: Array<{ label: string; description: string }>;
            tacticalNote: string;
        };
        psychographicProfile?: {
            ageRange: string;
            interests: string;
            primaryDesire: string;
            digitalBehavior: string;
            mainBarrier: string;
        };
    };
    strategyData?: any;
    totalSteps?: number;
}

const getProcessedAvatars = (rawAvatars: any[]): any[] => {
  const hasSavedAvatars = !!(rawAvatars && rawAvatars.length > 0);
  
  const defaultAvs = [
    {
      id: "maria-fernanda",
      name: "María Fernanda",
      priority: "PRINCIPAL",
      priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
      audiencePct: "68% DE TU AUDIENCIA",
      audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
      age: "28 - 35 años",
      occupation: "Emprendedora",
      income: "Ingresos variables",
      quote: "Aprende una técnica profesional, con acompañamiento real, para que consigas más clientes, mejores ingresos y la libertad que mereces.",
      pain: "No tiene suficientes clientes estables.",
      daily_manifestation: "Saturación de servicios básicos mal pagados",
      desire: "Tener más clientes y agenda llena.",
      emotional_reason: "Reconocimiento y autoridad",
      objection: "Miedo a gastar dinero en cursos sin saber si podré recuperar la inversión de materiales.",
      dolores_principales: [
        "Saturación de servicios básicos mal pagados",
        "Miedo a gastar dinero en cursos sin saber si podré recuperar la inversión de materiales.",
        "No tiene suficientes clientes estables.",
        "Siente que su trabajo no es valorado como debería."
      ],
      deseos_principales: [
        "Reconocimiento y autoridad",
        "Sentir el orgullo de ser una empresaria reconocida y exitosa.",
        "Tener más clientes y agenda llena.",
        "Ser reconocida como experta en su área."
      ],
      demographics: [
        { label: "Nivel de Estudios", val: "Universitario o Técnico Superior" },
        { label: "Ocupación de Preferencia", val: "Cosmetóloga independiente o Esteticista" },
        { label: "Rango de Ingresos", val: "Ingreso base inestable ($600 - $1,200 USD/mes)" },
        { label: "Ubicación Geográfica", val: "Zonas semi-urbanas y urbanas" },
        { label: "Estado Civil", val: "Soltera o casada con hijos pequeños" },
        { label: "Dispositivos de uso", val: "Smartphone de gama media-alta, Instagram, WhatsApp" }
      ],
      dolores_ocultos: [
                                  { title: "CLIENTELA INESTABLE", text: "No tiene suficientes clientes estables, lo que le genera una alta incertidumbre mensual sobre la facturación de su negocio." },
                                  { title: "TRABAJO DESVALORADO", text: "Siente que su trabajo no es valorado como debería y que las clientas siempre buscan la opción más barata regateando precios." },
                                  { title: "MARKETING INVISIBLE", text: "Le cuesta diferenciarse en un mercado saturado de profesionales independientes ofreciendo lo mismo a precios muy bajos." },
                                  { title: "INVERSIÓN SIN RETORNO", text: "Miedo a invertir en formación y no ver resultados, perdiendo sus recursos en teoría aburrida que no puede aplicar en la práctica real." },
                                  { title: "SÍNDROME DEL IMPOSTOR", text: "Inseguridad constante sobre si sus habilidades técnicas son verdaderamente suficientes para cobrar tarifas de alto valor." },
                                  { title: "AGOTAMIENTO Y SIN HORARIOS", text: "Trabaja jornadas interminables atendiendo citas sin orden, terminando agotada sin ver crecer su rentabilidad neta." }
                                ],
      deseos_motivaciones: [
                                  { title: "AGENDA LLENA Y PREDECIBLE", text: "Tener más clientes y la agenda completamente llena con semanas de anticipación sin tener que regatear tarifas." },
                                  { title: "EXPERTA RECONOCIDA", text: "Ser reconocida formalmente como una de las mejores expertas referentes en su área y ciudad." },
                                  { title: "INDEPENDENCIA FINANCIERA", text: "Lograr verdadera estabilidad e independencia económica para tomar decisiones con libertad y tranquilidad." },
                                  { title: "FLEXIBILIDAD ABSOLUTA", text: "Tener control total de sus propios horarios de atención y la flexibilidad de tiempo y ubicación que siempre soñó." },
                                  { title: "CLIENTELA VIP FIDELIZADA", text: "Construir una base de clientas recurrentes que pagan tarifas premium con gusto y recomiendan su trabajo." },
                                  { title: "ESTUDIO O CABINA PROPIA", text: "Consolidar un espacio profesional propio con acabados de alta gama y proyección de marca respetada." }
                                ],
      comportamientos: [
                                  "Sigue activamente cuentas de referentes del sector y marketing en Instagram y TikTok buscando ideas y tendencias.",
                                  "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos prácticos aplicables de inmediato.",
                                  "Pregunta constantemente en grupos y comunidades digitales qué marcas, herramientas o insumos son mejores.",
                                  "Consume tutoriales prácticos por las noches antes de dormir buscando perfeccionar sus técnicas y detalles.",
                                  "Revisa con frecuencia los perfiles de su competencia local para analizar qué servicios ofrecen y a qué precios.",
                                  "Prefiere comunicarse por WhatsApp de forma ágil y directa para coordinar compras, citas y consultas técnicas."
                                ]
    },
    {
      id: "valeria-mendoza",
      name: "Valeria Mendoza",
      priority: "SECUNDARIO",
      priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
      audiencePct: "22% DE TU AUDIENCIA",
      audienceClass: "bg-amber-500/10 border-amber-500/30 text-amber-550 border",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
      age: "22 - 27 años",
      occupation: "Cosmetóloga Junior",
      income: "Ingreso fijo bajo",
      quote: "Especialízate con un método paso a paso garantizado para que dupliques tus tarifas actuales y obtengas la acreditación que tus clientes valoran.",
      pain: "No saber si podrá conseguir clientas que paguen precios altos.",
      daily_manifestation: "Nivel técnico limitado para cobrar más caro",
      desire: "Especializarse en micropigmentación de cejas premium.",
      emotional_reason: "Validación por expertos y seguridad profesional",
      objection: "Dudar si realmente el curso online le dará la práctica necesaria.",
      dolores_principales: [
        "Nivel técnico limitado para cobrar más caro",
        "No saber si podrá conseguir clientas que paguen precios altos.",
        "Siente estancamiento profesional por falta de especialización.",
        "Falta de contactos y red de clientes para iniciar sola."
      ],
      deseos_principales: [
        "Especializarse en micropigmentación de cejas premium.",
        "Validación por expertos y seguridad profesional.",
        "Abrir su propio centro o cabina privada el próximo año.",
        "Cobrar el dible o triple por hora de servicio certificado."
      ],
      demographics: [
        { label: "Nivel de Estudios", val: "Técnico medio o Curso comercial avanzado" },
        { label: "Ocupación de Preferencia", val: "Ayudante de cabina o Lashista junior" },
        { label: "Rango de Ingresos", val: "Sueldo fijo base ($400 - $700 USD/mes)" },
        { label: "Ubicación Geográfica", val: "Zonas urbanas y residenciales" },
        { label: "Estado Civil", val: "Soltera sin hijos" },
        { label: "Dispositivos de uso", val: "iPhone/Android de última generación, TikTok, Pinterest" }
      ],
      dolores_ocultos: [
                                  { title: "ESTANCAMIENTO PROFESIONAL", text: "Teme quedarse estancada como ayudante o empleada toda su vida sin ver un crecimiento financiero real." },
                                  { title: "FALTA DE CREDIBILIDAD", text: "Le preocupa que los clientes duden de ella por verse joven o no contar con una certificación de prestigio reconocida." },
                                  { title: "INESTABILIDAD EMOCIONAL", text: "La baja remuneración genera que dude de su propia vocación y sienta desánimo al terminar cada jornada." },
                                  { title: "TEMOR A COMETER ERRORES", text: "Miedo a fallar en un procedimiento delicado y arruinar la experiencia de un cliente o su reputación." },
                                  { title: "FALTA DE CONTACTOS", text: "No sabe cómo empezar a captar clientas por su cuenta sin depender de un local o negocio ajeno." },
                                  { title: "PRESUPUESTO LIMITADO", text: "Duda de poder adquirir insumos profesionales y herramientas necesarias sin endeudarse en exceso." }
                                ],
      deseos_motivaciones: [
                                  { title: "RECONOCIMIENTO Y ESTATUS", text: "Ser la especialista de referencia a la que las clientas agendan con semanas de anticipación corporativa." },
                                  { title: "AUMENTAR TARIFAS", text: "Pasar de cobrar servicios básicos de bajo costo a tratamientos premium con márgenes de alta rentabilidad." },
                                  { title: "ESTILO DE VIDA INDEPENDIENTE", text: "Crear una marca personal respetada con identidad visual propia en redes sociales." },
                                  { title: "DOMINIO TÉCNICO TOTAL", text: "Sentir absoluta seguridad en cada trazo, procedimiento y atención al cliente con técnicas de vanguardia." },
                                  { title: "PORTAFOLIO DE IMPACTO", text: "Exhibir resultados antes/después impecables que atraigan miradas de admiración y ventas inmediatas." },
                                  { title: "PRIMERA CABINA PRIVADA", text: "Montar su propio espacio independiente en los próximos 6 a 12 meses con clientela fiel." }
                                ],
      comportamientos: [
                                  "Guarda tableros de fotos estéticas y trabajos de alta calidad en Pinterest e Instagram para inspirarse.",
                                  "Sigue tendencias y técnicas internacionales de creadores en Europa, Brasil y Estados Unidos.",
                                  "Compara activamente los precios y programas de academias en línea para decidir su próxima formación.",
                                  "Practica exhaustivamente en simuladores o modelos de prueba para perfeccionar la precisión de sus resultados.",
                                  "Interactúa frecuentemente en historias y directos haciendo preguntas técnicas a expertos del sector.",
                                  "Usa activamente su smartphone para editar fotos y videos buscando mejorar la presentación de su trabajo."
                                ]
    },
    {
      id: "monica-silva",
      name: "Mónica Silva",
      priority: "COMPLEMENTARIO",
      priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
      audiencePct: "10% DE TU AUDIENCIA",
      audienceClass: "bg-violet-500/10 border-violet-500/30 text-violet-550 border",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
      age: "36 - 45 años",
      occupation: "Emprendedora desde cero",
      income: "Sin ingresos estables",
      quote: "No necesitas experiencia previa para triunfar. Nuestro programa te acompaña desde cero, cuidando tu técnica y enseñándote a vender sin esfuerzo.",
      pain: "Miedo a no tener coordinación o dotes manuales.",
      daily_manifestation: "Incertidumbre absoluta por reinsertarse a su edad",
      desire: "Cambiar de profesión y generar ingresos estables.",
      emotional_reason: "Orgullo de superación y asombro familiar",
      objection: "Sentir que la micropigmentación ya está saturada de jóvenes.",
      dolores_principales: [
        "Incertidumbre absoluta por reinsertarse a su edad",
        "Miedo a no tener coordinación o dotes manuales.",
        "Miedo extremo a comenzar en un rubro totalmente desconocido.",
        "Inseguridad al vender o hacer marketing en su nueva etapa."
      ],
      deseos_principales: [
        "Cambiar de profesión y generar ingresos estables.",
        "Orgullo de superación y asombro familiar.",
        "Reinventarse profesionalmente con un negocio moderno.",
        "Demostrar a su entorno que puede liderar su propio proyecto."
      ],
      demographics: [
        { label: "Nivel de Estudios", val: "Educación técnica o administrativa" },
        { label: "Ocupación de Preferencia", val: "Ama de casa o Ex-empleada administrativa" },
        { label: "Rango de Ingresos", val: "Dependiente de ahorros familiares o pareja" },
        { label: "Ubicación Geográfica", val: "Zonas residenciales y capitales de provincia" },
        { label: "Estado Civil", val: "Casada con hijos adolescentes" },
        { label: "Dispositivos de uso", val: "Tablet, Facebook, canales de YouTube educativos" }
      ],
      dolores_ocultos: [
                                  { title: "BARRERA DEL APRENDIZAJE", text: "Duda de su capacidad para asimilar conceptos modernos o dominar herramientas de alta precisión a su edad." },
                                  { title: "MIEDO AL RECHAZO COMERCIAL", text: "Le aterra el proceso de vender o hablar con clientas desconocidas sobre precios y cotizaciones." },
                                  { title: "SÍNDROME DE IMPOSTORA TARDÍA", text: "Siente que el mercado es solo para jóvenes influencers y le cuesta proyectar seguridad en el medio." },
                                  { title: "RIESGO AL FRACASO FAMILIAR", text: "Teme gastar ahorros familiares en una aventura que no rinda frutos y decepcionar a su círculo cercano." },
                                  { title: "DESORIENTACIÓN DIGITAL", text: "Se siente abrumada por la complejidad de las redes sociales, algoritmos y herramientas tecnológicas." },
                                  { title: "FALTA DE TIEMPO PROPIO", text: "Tiene responsabilidades del hogar que compiten por su tiempo disponible para estudiar y practicar." }
                                ],
      deseos_motivaciones: [
                                  { title: "SEGURIDAD Y TRANQUILIDAD", text: "Construir un activo rentable y duradero que le brinde estabilidad económica a mediano y largo plazo." },
                                  { title: "EMPODERAMIENTO FAMILIAR", text: "Aportar activamente ingresos al hogar disminuyendo la presión financiera sobre su cónyuge o familia." },
                                  { title: "AUTORREALIZACIÓN PERSONAL", text: "Desarrollar un oficio creativo, valioso y respetado que llene sus días de propósito y orgullo." },
                                  { title: "CONTROL DE SUS INGRESOS", text: "No tener que pedir dinero a nadie y disponer de recursos propios para sus proyectos y gustos personales." },
                                  { title: "COMUNIDAD DE APOYO REAL", text: "Pertenecer a una red donde pueda resolver dudas sin sentirse juzgada y celebrar cada logro." },
                                  { title: "REINVENCIÓN EXITOSA", text: "Demostrarse a sí misma y a su entorno que nunca es tarde para emprender y triunfar con excelencia." }
                                ],
      comportamientos: [
                                  "Sigue grupos comunitarios y foros locales de emprendimiento buscando testimonios de personas similares.",
                                  "Prefiere cursos y programas con acompañamiento personalizado, sesiones en vivo y soporte paso a paso.",
                                  "Busca recomendaciones de boca en boca y reseñas reales antes de tomar cualquier decisión de compra.",
                                  "Toma notas detalladas a mano en cuadernos físicos mientras repasa lecciones y capacitaciones.",
                                  "Consume contenido en YouTube en su tablet o televisor con tranquilidad durante sus momentos libres.",
                                  "Aprecia enormemente el trato cercano, cálido y paciente por canales de mensajería como WhatsApp."
                                ]
    }
  ];

  return [0, 1, 2].map((idx) => {
    const defaultAv = defaultAvs[idx];
    const realAv = rawAvatars?.[idx];
    if (!realAv) {
      if (hasSavedAvatars) {
        return {
          ...defaultAv,
          name: "(no definido)",
          age: "(no definido)",
          occupation: "(no definido)",
          income: "(no definido)",
          pain: "(no definido)",
          daily_manifestation: "(no definido)",
          desire: "(no definido)",
          emotional_reason: "(no definido)",
          objection: "(no definido)",
          dolores_principales: [],
          deseos_principales: [],
          demographics: defaultAv.demographics.map(d => ({ label: d.label, val: "(no definido)" })),
          dolores_ocultos: [],
          deseos_motivaciones: [],
          comportamientos: [],
          motivations: {
            dinero: "(no definido)",
            tiempo: "(no definido)",
            estatus: "(no definido)",
            seguridad: "(no definido)"
          }
        };
      }
      return defaultAv;
    }

    const name = realAv.name || (hasSavedAvatars ? "(no definido)" : defaultAv.name);
    const age = realAv.ageRange || realAv.age || realAv.age_range || (hasSavedAvatars ? "(no definido)" : defaultAv.age);
    const occupation = realAv.archetype || realAv.occupation || realAv.profession || realAv.profession_title || realAv.job || realAv.role || (hasSavedAvatars ? "(no definido)" : defaultAv.occupation);
    const income = realAv.incomeRange || realAv.income || (hasSavedAvatars ? "(no definido)" : defaultAv.income);
    const img = realAv.image || realAv.img || defaultAv.img;
    const quote = realAv.quote || realAv.message || (hasSavedAvatars ? "(no definido)" : defaultAv.quote);
    const objection = realAv.objection || realAv.mainBarrier || realAv.barrier || (hasSavedAvatars ? "(no definido)" : defaultAv.objection);

    const rawPriority = (realAv.priority || realAv.role || realAv.type || defaultAv.priority || "").toUpperCase();
    let priority = defaultAv.priority;
    let priorityClass = defaultAv.priorityClass;
    if (rawPriority.includes("PRINCIPAL")) {
      priority = "PRINCIPAL";
      priorityClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border";
    } else if (rawPriority.includes("SECUNDARIO")) {
      priority = "SECUNDARIO";
      priorityClass = "bg-amber-500/10 border-amber-500/30 text-amber-400 border";
    } else if (rawPriority.includes("COMPLEMENTARIO") || rawPriority.includes("APOYO")) {
      priority = "APOYO";
      priorityClass = "bg-violet-500/10 border-violet-500/30 text-violet-400 border";
    }

    const defaultMotivationsForIdx = {
      dinero: idx === 0 ? "Retorno de inversión garantizado con su primer set de clientas." : idx === 1 ? "Garantía de reembolso o método blindado para proteger su capital y no desperdiciar ni un dólar más." : "Generar ingresos estables desde casa para lograr libertad financiera real.",
      tiempo: idx === 0 ? "Establecer un flujo de trabajo optimizado para atender en menos de 90 minutos." : idx === 1 ? "Ir al grano con un sistema probado sin rodeos teóricos innecesarios." : "Flexibilidad horaria absoluta para pasar más tiempo con tus hijos o seres queridos.",
      estatus: idx === 0 ? "Certificación oficial de alta gama para destacar de la competencia convencional." : idx === 1 ? "Validación por expertos que la posiciona como una profesional seria ante sus clientes." : "Sentir la satisfacción y el orgullo de transicionar hacia una profesión propia.",
      seguridad: idx === 0 ? "Soporte uno a uno para resolver problemas reales en el inicio del negocio." : idx === 1 ? "Acompañamiento cercano anticaídas para asegurar sus primeros pasos prácticos." : "Guía paso a paso adaptada para principiantes absolutos sin experiencia previa."
    };

    let dolores_principales = hasSavedAvatars ? [] : defaultAv.dolores_principales;
    if (realAv.dolores_principales && Array.isArray(realAv.dolores_principales)) {
      dolores_principales = realAv.dolores_principales;
    } else if (realAv.pain_points && Array.isArray(realAv.pain_points)) {
      dolores_principales = realAv.pain_points;
    } else if (realAv.pain) {
      dolores_principales = [
        realAv.pain,
        realAv.objection || (hasSavedAvatars ? "(no definido)" : defaultAv.dolores_principales[1]),
        realAv.daily_manifestation || realAv.manifestation || (hasSavedAvatars ? "(no definido)" : defaultAv.dolores_principales[2]),
        hasSavedAvatars ? "(no definido)" : defaultAv.dolores_principales[3]
      ];
    }

    let deseos_principales = hasSavedAvatars ? [] : defaultAv.deseos_principales;
    if (realAv.deseos_principales && Array.isArray(realAv.deseos_principales)) {
      deseos_principales = realAv.deseos_principales;
    } else if (realAv.desires && Array.isArray(realAv.desires)) {
      deseos_principales = realAv.desires;
    } else if (realAv.desire || realAv.transformation_title) {
      deseos_principales = [
        realAv.desire || realAv.transformation_title,
        realAv.emotional_reason || (hasSavedAvatars ? "(no definido)" : defaultAv.deseos_principales[1]),
        hasSavedAvatars ? "(no definido)" : defaultAv.deseos_principales[2],
        hasSavedAvatars ? "(no definido)" : defaultAv.deseos_principales[3]
      ];
    }

    const pain = realAv.pain || dolores_principales?.[0] || (hasSavedAvatars ? "(no definido)" : defaultAv.pain);
    const daily_manifestation = realAv.daily_manifestation || realAv.manifestation || dolores_principales?.[2] || (hasSavedAvatars ? "(no definido)" : defaultAv.daily_manifestation);
    const desire = realAv.desire || deseos_principales?.[0] || (hasSavedAvatars ? "(no definido)" : defaultAv.desire);
    const emotional_reason = realAv.emotional_reason || deseos_principales?.[1] || (hasSavedAvatars ? "(no definido)" : defaultAv.emotional_reason);

    const listDemographics = [
      { label: "Nivel de Estudios", val: realAv.education || realAv.studies || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[0].val) },
      { label: "Ocupación de Preferencia", val: realAv.occupation || realAv.archetype || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[1].val) },
      { label: "Rango de Ingresos", val: realAv.income || realAv.incomeRange || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[2].val) },
      { label: "Ubicación Geográfica", val: realAv.location || realAv.geographic || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[3].val) },
      { label: "Estado Civil", val: realAv.civilStatus || realAv.marital_status || realAv.civil_status || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[4].val) },
      { label: "Dispositivos de uso", val: realAv.devices || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[5].val) },
    ];

    let rawDolores = (realAv.dolores_ocultos && Array.isArray(realAv.dolores_ocultos) && realAv.dolores_ocultos.length > 0)
      ? realAv.dolores_ocultos
      : (realAv.hidden_pains && Array.isArray(realAv.hidden_pains) && realAv.hidden_pains.length > 0)
        ? realAv.hidden_pains
        : (realAv.pains_hidden && Array.isArray(realAv.pains_hidden) && realAv.pains_hidden.length > 0)
          ? realAv.pains_hidden
          : (realAv.detailed_pains && Array.isArray(realAv.detailed_pains) && realAv.detailed_pains.length > 0)
            ? realAv.detailed_pains
            : (realAv.pain)
              ? [{ title: defaultAv.dolores_ocultos[0]?.title || "DOLOR IDENTIFICADO", text: realAv.pain }]
              : [...defaultAv.dolores_ocultos];

    let dolores_ocultos = rawDolores.map((item: any, dIdx: number) => ({
      title: (typeof item === 'string' ? (defaultAv.dolores_ocultos[dIdx % defaultAv.dolores_ocultos.length]?.title || ("FRUSTRACIÓN OCULTA " + (dIdx + 1))) : (item.title || defaultAv.dolores_ocultos[dIdx % defaultAv.dolores_ocultos.length]?.title || ("FRUSTRACIÓN OCULTA " + (dIdx + 1)))).toUpperCase(),
      text: typeof item === 'string' ? item : (item.text || item.title || "")
    }));

    while (dolores_ocultos.length < 6) {
      const fallback = defaultAv.dolores_ocultos[dolores_ocultos.length % defaultAv.dolores_ocultos.length];
      dolores_ocultos.push({
        title: fallback.title.toUpperCase(),
        text: fallback.text
      });
    }
    dolores_ocultos = dolores_ocultos.slice(0, 6);

    let rawDeseos = (realAv.deseos_motivaciones && Array.isArray(realAv.deseos_motivaciones) && realAv.deseos_motivaciones.length > 0)
      ? realAv.deseos_motivaciones
      : (realAv.hidden_desires && Array.isArray(realAv.hidden_desires) && realAv.hidden_desires.length > 0)
        ? realAv.hidden_desires
        : (realAv.motivations_detail && Array.isArray(realAv.motivations_detail) && realAv.motivations_detail.length > 0)
          ? realAv.motivations_detail
          : (realAv.desires && Array.isArray(realAv.desires) && realAv.desires.length > 0)
            ? realAv.desires
            : (realAv.drivers && Array.isArray(realAv.drivers) && realAv.drivers.length > 0)
              ? realAv.drivers
              : (realAv.decisionDrivers && Array.isArray(realAv.decisionDrivers) && realAv.decisionDrivers.length > 0)
                ? realAv.decisionDrivers
                : (realAv.desire || realAv.transformation_title)
                  ? [{ title: defaultAv.deseos_motivaciones[0]?.title || "ANHELO PROFUNDO", text: realAv.desire || realAv.transformation_title }]
                  : [...defaultAv.deseos_motivaciones];

    let deseos_motivaciones = rawDeseos.map((item: any, dIdx: number) => ({
      title: (typeof item === 'string' ? (defaultAv.deseos_motivaciones[dIdx % defaultAv.deseos_motivaciones.length]?.title || ("ANHELO PROFUNDO " + (dIdx + 1))) : (item.title || defaultAv.deseos_motivaciones[dIdx % defaultAv.deseos_motivaciones.length]?.title || ("ANHELO PROFUNDO " + (dIdx + 1)))).toUpperCase(),
      text: typeof item === 'string' ? item : (item.text || item.title || "")
    }));

    while (deseos_motivaciones.length < 6) {
      const fallback = defaultAv.deseos_motivaciones[deseos_motivaciones.length % defaultAv.deseos_motivaciones.length];
      deseos_motivaciones.push({
        title: fallback.title.toUpperCase(),
        text: fallback.text
      });
    }
    deseos_motivaciones = deseos_motivaciones.slice(0, 6);

    let rawComportamientos = (realAv.comportamientos && Array.isArray(realAv.comportamientos) && realAv.comportamientos.length > 0)
      ? realAv.comportamientos
      : (realAv.behaviors_list && Array.isArray(realAv.behaviors_list) && realAv.behaviors_list.length > 0)
        ? realAv.behaviors_list
        : (realAv.behaviors && Array.isArray(realAv.behaviors) && realAv.behaviors.length > 0)
          ? realAv.behaviors
          : [...defaultAv.comportamientos];

    let comportamientos = rawComportamientos.map((b: any) => typeof b === 'string' ? b : (b.text || b.title || String(b)));

    while (comportamientos.length < 6) {
      comportamientos.push(defaultAv.comportamientos[comportamientos.length % defaultAv.comportamientos.length]);
    }
    comportamientos = comportamientos.slice(0, 6);

    let motivations = defaultMotivationsForIdx;
    if (realAv.motivations && typeof realAv.motivations === "object") {
      motivations = { ...defaultMotivationsForIdx, ...realAv.motivations };
    }

    return {
      id: realAv.id || defaultAv.id,
      name,
      img,
      age,
      occupation,
      income,
      priority,
      priorityClass,
      audiencePct: defaultAv.audiencePct,
      audienceClass: defaultAv.audienceClass,
      quote,
      pain,
      daily_manifestation,
      desire,
      emotional_reason,
      objection,
      dolores_principales,
      deseos_principales,
      demographics: listDemographics,
      dolores_ocultos,
      deseos_motivaciones,
      comportamientos,
      motivations
    };
  });
};

export const ProjectStrategy_AvatarDiagnosis: React.FC<ProjectStrategy_AvatarDiagnosisProps> = ({ 
    strategyData,
    totalSteps
}) => {
    const [isCommercialDrawerOpen, setIsCommercialDrawerOpen] = useState<boolean>(false);
    const [selectedCommercialOption, setSelectedCommercialOption] = useState<CommercialOptionId | null>(null);

    return (
        <div id="psd-avatar-diagnosis-section" className="space-y-6 text-left animate-in fade-in duration-500">
            
            {/* 1. HEADER CARD */}
            <StepHeaderCard
                stepNumber={2}
                totalSteps={totalSteps}
                stageNumber={1}
                categoryTitle="Conoce a tu Comprador Ideal"
                title="Conoce a tu Comprador Ideal"
                description="El 90% de los embudos fracasan porque el mensaje es demasiado genérico. Aquí tienes los perfiles psicológicos exactos de las personas que realmente comprarán tu producto."
            />

            {/* 2. VIDEO TUTORIAL */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                <StepVideoContainer 
                    stepNumber={2}
                    videoUrl="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0"
                    title="Video Tutorial Avatar"
                />
            </div>

            {/* SECCIÓN ESTRATEGIA COMERCIAL CARDS */}
            <div className="mt-8 space-y-6 text-left">
                {/* Header */}
                <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#FF5D1E]" />
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight font-sans">
                            Esto hemos generado <span className="text-[#FF5D1E]">para ti</span>
                        </h3>
                    </div>
                    <p className="text-zinc-400 font-light text-xs sm:text-sm leading-relaxed font-sans">
                        Previsualiza cada parte de tu sistema. Haz clic en cualquier tarjeta para ver el contenido completo.
                    </p>
                </div>

                {/* Cards Grid: 2 tarjetas horizontales por fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            id: "avatar" as CommercialOptionId,
                            title: "Avatares Psicológicos",
                            badge: "PLAN DE ATRACCIÓN",
                            desc: "Tus compradores ideales totalmente perfilados con sus dolores, deseos y motivaciones.",
                            icon: Users,
                        },
                        {
                            id: "testimonials" as CommercialOptionId,
                            title: "Testimonios Persuasivos",
                            badge: "PRUEBA SOCIAL",
                            desc: "Historias de éxito realistas y testimonios diseñados para derribar el escepticismo.",
                            icon: Sparkles,
                        },
                        {
                            id: "objections" as CommercialOptionId,
                            title: "Frustraciones del Avatar",
                            badge: "BARRERAS Y OBJETIVOS",
                            desc: "Análisis de las barreras de compra más comunes y cómo resolverlas eficazmente.",
                            icon: MessageSquare,
                        },
                        {
                            id: "benefits" as CommercialOptionId,
                            title: "Beneficios Magnéticos",
                            badge: "TRANSFORMACIÓN",
                            desc: "Los ganchos de transformación que conectan las características con las emociones.",
                            icon: Zap,
                        },
                    ].map((card) => {
                        const CardIcon = card.icon;
                        return (
                            <div
                                key={card.id}
                                onClick={() => {
                                    setSelectedCommercialOption(card.id);
                                    setIsCommercialDrawerOpen(true);
                                }}
                                className="bg-[#0B1120] border border-slate-800 hover:border-[#FF5D1E]/50 rounded-2xl p-6 flex flex-col justify-between space-y-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#FF5D1E]/10 hover:-translate-y-0.5 group text-left"
                            >
                                <div className="space-y-4">
                                    {/* Top Row: Icon + Badge */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="w-11 h-11 rounded-xl bg-[#FF5D1E]/10 border border-[#FF5D1E]/20 text-[#FF5D1E] flex items-center justify-center shrink-0">
                                            <CardIcon className="w-5 h-5 text-[#FF5D1E]" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#FF5D1E]/10 border border-[#FF5D1E]/25 text-[#FF5D1E] leading-none">
                                            {card.badge}
                                        </span>
                                    </div>

                                    {/* Title & Desc */}
                                    <div className="space-y-2 text-left">
                                        <h4 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#FF5D1E] transition-colors leading-snug font-sans">
                                            {card.title}
                                        </h4>
                                        <p className="text-slate-300 font-normal text-xs sm:text-sm leading-relaxed font-sans">
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Footer */}
                                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
                                    <button className="px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-[#FF5D1E]/15 cursor-pointer uppercase bg-[#FF5D1E] hover:bg-[#e04e17] text-white">
                                        Ver Detalles <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* DRAWER SLIDE-OVER */}
            <EstrategiaComercialDrawer
                isOpen={isCommercialDrawerOpen}
                onClose={() => setIsCommercialDrawerOpen(false)}
                activeOption={selectedCommercialOption}
                setActiveOption={setSelectedCommercialOption}
                strategyData={strategyData}
            />
        </div>
    );
};
