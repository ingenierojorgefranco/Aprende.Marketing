import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { Search, AlertCircle, Sparkles, Target, ShieldCheck, Brain, Zap, Magnet, Shield, Quote, Crown, MessageSquare, Check, Lock, GraduationCap, Flame, AlertTriangle, Rocket, ArrowRight, Users, Clock, Coffee, Heart, Play, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

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
        { title: "INVERSIÓN SIN RETORNO", text: "Miedo a invertir en formación y no ver resultados, perdiendo sus recursos en teoría aburrida que no puede aplicar en la práctica real." }
      ],
      deseos_motivaciones: [
        { title: "AGENDA LLENA", text: "Tener más clientes y la agenda completamente llena con meses de anticipación sin tener que regatear tarifas." },
        { title: "EXPERTA RECONOCIDA", text: "Ser reconocida formalmente como una de las mejores expertas referentes en su área y ciudad." },
        { title: "INDEPENDENCIA FINANCIERA", text: "Lograr verdadera estabilidad e independencia económica para tomar decisiones con libertad." },
        { title: "FLEXIBILIDAD ABSOLUTA", text: "Tener control total de sus propios horarios de atención y la flexibilidad de tiempo y ubicación que siempre soñó." }
      ],
      comportamientos: [
        "Sigue activamente cuentas de gurús de belleza y marketing estético en Instagram y TikTok.",
        "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos aplicables.",
        "Pregunta constantemente en grupos de Facebook qué marcas de pigmentos o inductores son mejores.",
        "Consume video tutoriales rápidos por las noches antes de dormir buscando perfeccionar trazo de cejas."
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
        { title: "El miedo al estancamiento profesional", text: "Teme trabajar como empleada toda su vida sin ver su propio crecimiento financiero." },
        { title: "Falta de credibilidad", text: "Le preocupa que las clientas no confíen en ella por verse muy joven o no tener certificación reconocida de alta gama." },
        { title: "Inestabilidad emocional", text: "La baja remuneración genera que dude de su propia pasión por la belleza y estética profesional." }
      ],
      deseos_motivaciones: [
        { title: "Reconocimiento y Estatus", text: "Ser la especialista de referencia a la que las clientas agendan con semanas de anticipación corporativa." },
        { title: "Aumentar Tarifas", text: "Pasar de cobrar servicios baratos de $15 a tratamientos premium de más de $150 de forma segura." },
        { title: "Estilo de Vida Independiente", text: "Crear una marca personal respetada con identidad visual propia en redes sociales." }
      ],
      comportamientos: [
        "Guarda tableros de fotos de cejas perfectas y estética minimalista en Pinterest.",
        "Sigue tendencias de micropigmentación internacionales de Europa y Brasil.",
        "Compara activamente los precios de academias en línea para decidir su inversión.",
        "Práctica exhaustivamente en látex para perfeccionar la precisión de sus trazos."
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
        { title: "La barrera del aprendizaje técnico", text: "Duda de su capacidad para asimilar conceptos modernos o dominar herramientas de alta precisión." },
        { title: "Miedo al rechazo comercial", text: "Le aterra el proceso de vender o hablar con clientas desconocidas sobre precios y retornos." },
        { title: "El síndrome de la impostora tardía", text: "Siente que el mercado es para jóvenes influencers de belleza y le cuesta encajar visualmente." }
      ],
      deseos_motivaciones: [
        { title: "Seguridad Financiera Post-Jubilación", text: "Construir un activo rentable y duradero que le dé tranquilidad a mediano-largo plazo." },
        { title: "Empoderamiento Familiar", text: "Aportar económicamente al hogar disminuyendo la presión financiera sobre su cónyuge." },
        { title: "Autorealización Personal", text: "Desarrollar un oficio creativo e inspirador que llene su tiempo de valor y orgullo propio." }
      ],
      comportamientos: [
        "Sigue grupos comunitarios locales de emprendedores locales y negocios pymes.",
        "Prefiere cursos con soporte personalizado, llamadas en vivo o grupos cerrados de ayuda.",
        "Busca recomendaciones de boca en boca para evaluar la seriedad de una propuesta.",
        "Toma notas escritas detalladas en cuadernos físicos durante las clases teóricas."
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
        ...(hasSavedAvatars ? [] : defaultAv.dolores_principales.slice(1))
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
        ...(hasSavedAvatars ? [] : defaultAv.deseos_principales.slice(1))
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
      { label: "Estado Civil", val: realAv.civilStatus || realAv.marital_status || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[4].val) },
      { label: "Dispositivos de uso", val: realAv.devices || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[5].val) },
    ];

    let dolores_ocultos = hasSavedAvatars ? [] : defaultAv.dolores_ocultos;
    if (realAv.dolores_ocultos && Array.isArray(realAv.dolores_ocultos)) {
      dolores_ocultos = realAv.dolores_ocultos;
    } else if (realAv.pains_hidden && Array.isArray(realAv.pains_hidden)) {
      dolores_ocultos = realAv.pains_hidden;
    }

    let deseos_motivaciones = hasSavedAvatars ? [] : defaultAv.deseos_motivaciones;
    if (realAv.deseos_motivaciones && Array.isArray(realAv.deseos_motivaciones)) {
      deseos_motivaciones = realAv.deseos_motivaciones;
    } else if (realAv.motivations_detail && Array.isArray(realAv.motivations_detail)) {
      deseos_motivaciones = realAv.motivations_detail;
    }

    let comportamientos = hasSavedAvatars ? [] : defaultAv.comportamientos;
    if (realAv.comportamientos && Array.isArray(realAv.comportamientos)) {
      comportamientos = realAv.comportamientos;
    } else if (realAv.behaviors && Array.isArray(realAv.behaviors)) {
      comportamientos = realAv.behaviors;
    }

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
    avatars = [], 
    psychology = { pains: [], solutions: [], awarenessStages: { stage1_pain: '', stage2_solution: '', stage3_barrier: '' }, conversionStrategy: { mainFocus: [], tacticalNote: '' } }, 
    benefitsItems = [] 
}) => {
    const [selectedView, setSelectedView] = useState<'both' | 'advanced' | 'classic'>('both');
    const [activeAvatarIndex, setActiveAvatarIndex] = useState<number | null>(0);
    const [avatarSubTab, setAvatarSubTab] = useState<'resumen' | 'demografico' | 'dolores' | 'deseos' | 'comportamiento'>('resumen');

    const processedAvs = getProcessedAvatars(avatars);

    const getAvatarRoleBadge = (idx: number) => {
        const badges = [
            { label: "Avatar Principal — Perfil de Atracción", gradient: "from-pink-600 to-rose-600" },
            { label: "Avatar Secundario", gradient: "from-purple-600 to-indigo-600" },
            { label: "Avatar de Apoyo", gradient: "from-blue-600 to-cyan-600" }
        ];
        const badge = badges[idx] || badges[0];

        return (
            <div className={`absolute top-0 left-0 bg-gradient-to-r ${badge.gradient} text-white text-[10px] font-black px-6 py-2 rounded-br-2xl uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 z-20`}>
                <Crown className="w-3 h-3" /> {badge.label}
            </div>
        );
    };

    return (
        <div id="psd-avatar-diagnosis-section" className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            
            {/* Div agrupador para encabezado y video (seccion_encabezado) */}
            <div className="seccion_encabezado space-y-12">
                {/* --- HEADER SECCIÓN --- */}
                <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                    {/* Degradado superior sutil */}
                    <div className="absolute inset-x-0 -top-24 h-[600px] bg-pink-600/10 blur-[140px] -z-10 rounded-full" />
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]" />
                        <Users className="w-4 h-4" /> ¿Quién comprará mi producto digital?
                    </div>
                    
                    <div className="space-y-4 px-4">
                        <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
                            Descubriendo el ADN de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">comprador ideal</span>
                        </h3>
                        <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                            El 90% de los embudos fracasan porque el mensaje es demasiado genérico. Aquí tienes los 3 perfiles psicológicos exactos de las personas que realmente comprarán tu producto.
                        </p>
                    </div>
                </div>

                {/* --- VIDEO EXPLICATIVO --- */}
                <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                    <div className="inline-flex items-center gap-3 text-pink-300 font-extrabold uppercase tracking-widest text-sm bg-pink-500/5 px-8 py-4 rounded-2xl border border-pink-500/10 backdrop-blur-sm mx-auto">
                        <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                    </div>
                    
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                        
                        <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-pink-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial Avatar" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SELECTOR DE VISTA DE AVATARES --- */}
            <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    Selecciona el Formato de Visualización
                </p>
                <div className="bg-zinc-950/80 border border-white/5 p-1.5 rounded-2xl flex items-center gap-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <button 
                        onClick={() => setSelectedView('both')}
                        className={`flex-1 py-3 px-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${selectedView === 'both' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'}`}
                    >
                        Ver Ambas Estructuras
                    </button>
                    <button 
                        onClick={() => setSelectedView('advanced')}
                        className={`flex-1 py-3 px-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${selectedView === 'advanced' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'}`}
                    >
                        Nueva Estructura Avanzada
                    </button>
                    <button 
                        onClick={() => setSelectedView('classic')}
                        className={`flex-1 py-3 px-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${selectedView === 'classic' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'}`}
                    >
                        Estructura Clásica
                    </button>
                </div>
            </div>

            {/* CONTENEDORES DE CONTENIDO SEGÚN LA VISTA SELECCIONADA */}
            
            {/* 1. ESTRUCTURA CLÁSICA (IMAGEN 1) */}
            {(selectedView === 'classic' || selectedView === 'both') && (
                <div className="space-y-16 max-w-[85em] mx-auto px-4">
                    {selectedView === 'both' && (
                        <div className="text-left border-b border-white/5 pb-4 mb-4">
                            <h4 className="text-lg font-black uppercase tracking-widest text-[#FF5D1E] flex items-center gap-2">
                                <span>✦</span> ESTRUCTURA CLÁSICA REINTEGRADA
                            </h4>
                        </div>
                    )}
                    <div id="psd-avatars-list-classic" className="space-y-16">
                        {processedAvs.map((avatar: any, idx: number) => {
                            const isMain = idx === 0;

                            return (
                                <div key={avatar.id || idx} className={`group relative bg-gray-900/60 backdrop-blur-md rounded-[3.5rem] border transition-all duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden hover:scale-[1.01] ${isMain ? 'border-pink-500/40' : idx === 1 ? 'border-purple-500/30' : 'border-blue-500/30'}`}>
                                    
                                    <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] opacity-10 pointer-events-none ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>

                                    {getAvatarRoleBadge(idx)}

                                    <div className="p-10 md:p-16">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-8">
                                            {/* Perfil Visual */}
                                            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                                                <div className="relative mb-8">
                                                    <div className={`absolute -inset-2 rounded-3xl blur-2xl opacity-40 animate-pulse ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                                    <div className="w-36 h-36 rounded-[2.5rem] bg-gray-800 border-2 border-white/10 flex items-center justify-center text-6xl shadow-2xl relative z-10 transform group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                                                        <img src={avatar.img} alt={avatar.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    </div>
                                                </div>
                                                <h4 className="text-5xl font-black text-white leading-tight mb-4 tracking-tighter">{avatar.name}</h4>
                                                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                                    <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-gray-200 uppercase tracking-[0.1em]">{avatar.age}</span>
                                                    <span className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-gray-200 uppercase tracking-[0.1em]">{avatar.occupation}</span>
                                                </div>
                                            </div>

                                            {/* Quote Section */}
                                            <div className="lg:col-span-7 flex flex-col justify-center">
                                                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 relative group/quote hover:bg-white/[0.05] transition-all">
                                                    <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5" />
                                                    <p className="text-gray-100 italic text-2xl md:text-3xl leading-relaxed font-serif relative z-10 pl-6 border-l-4 border-amber-500/30 py-1">
                                                        "{avatar.quote}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                            {/* Pains & Solutions List (Now Left) */}
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="bg-rose-500/[0.03] border-l-4 border-rose-500/20 p-8 rounded-r-[2.5rem] hover:bg-rose-500/[0.06] transition-colors group/card">
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-400 shadow-lg group-hover/card:scale-110 transition-transform"><AlertTriangle className="w-6 h-6" /></div>
                                                        <p className="text-sm font-black text-rose-400 uppercase tracking-[0.2em]">Punto de Dolor Agudo</p>
                                                    </div>
                                                    <p className="text-gray-200 text-xl leading-relaxed font-medium mb-4">{avatar.pain}</p>
                                                    
                                                    {avatar.daily_manifestation && (
                                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mt-4 flex gap-3">
                                                            <Clock className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                                                            <p className="text-white text-xl leading-relaxed font-light">
                                                                <span className="font-bold text-rose-200 uppercase text-[10px] tracking-widest block mb-1">Manifestación Diaria</span>
                                                                "{avatar.daily_manifestation}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-emerald-500/[0.03] border-l-4 border-emerald-500/20 p-8 rounded-r-[2.5rem] hover:bg-emerald-500/[0.06] transition-colors group/card">
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-lg group-hover/card:scale-110 transition-transform"><Rocket className="w-6 h-6" /></div>
                                                        <p className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em]">Transformación Deseada</p>
                                                    </div>
                                                    <p className="text-gray-200 text-xl leading-relaxed font-medium mb-4">{avatar.desire}</p>
                                                    
                                                    {avatar.emotional_reason && (
                                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mt-4 flex gap-3">
                                                            <Heart className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                                                            <p className="text-white text-xl leading-relaxed font-light">
                                                                <span className="font-bold text-rose-200 uppercase text-[10px] tracking-widest block mb-1">Para Qué Emocional</span>
                                                                "{avatar.emotional_reason}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Motivations & Strategy (Now Right) */}
                                            <div className="space-y-12">
                                                <div>
                                                    <h5 className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                                                        <Zap className="w-5 h-5 text-yellow-500" /> Drivers de Decisión
                                                    </h5>
                                                    <div className="space-y-4">
                                                        {Object.entries(avatar.motivations).map(([key, value]: any) => {
                                                            const isStringValue = typeof value === 'string';
                                                            if (isStringValue) {
                                                                return (
                                                                    <div key={key} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                                                        <div className="w-8 h-8 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                                                                            <span className="text-yellow-400 font-bold">✦</span>
                                                                        </div>
                                                                        <div className="space-y-0.5">
                                                                            <p className="text-xs text-yellow-500 font-black uppercase tracking-widest">{key}</p>
                                                                            <p className="text-gray-200 text-base leading-relaxed font-normal">{value}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div key={key} className="space-y-3">
                                                                    <div className="flex justify-between items-end">
                                                                        <span className="text-base text-gray-200 font-black uppercase tracking-widest">{key}</span>
                                                                        <span className="text-sm font-mono text-white/40">{value}%</span>
                                                                    </div>
                                                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                                        <div 
                                                                            className={`h-full rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(255,255,255,0.1)] ${idx === 0 ? 'bg-gradient-to-r from-pink-600 to-rose-400' : idx === 1 ? 'bg-gradient-to-r from-purple-600 to-fuchsia-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} 
                                                                            style={{width: `${value}%`}}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="p-8 rounded-[2rem] border-l-4 bg-blue-500/10 border-blue-500/20 flex gap-6 items-start hover:scale-[1.02] transition-transform">
                                                    <div className="p-4 rounded-2xl bg-black/60 text-blue-400 shrink-0 shadow-2xl">
                                                        <Lock className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black uppercase tracking-[0.2em] mb-2 text-blue-400">Barrera de Venta (Objeción)</p>
                                                        <p className="text-white text-xl leading-relaxed font-light">{avatar.objection}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* DIVIDOR ELEGANTE EN MODO "AMBAS ESTRUCTURAS" */}
            {selectedView === 'both' && (
                <div className="max-w-[85em] mx-auto px-4 py-8">
                    <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-black border border-white/10 rounded-full text-[10px] sm:text-xs font-black text-[#FF5D1E] uppercase tracking-[0.35em] whitespace-nowrap">
                            Estructura de Análisis Psicológico Adicional
                        </div>
                    </div>
                </div>
            )}

            {/* 2. NUEVA ESTRUCTURA AVANZADA (IMAGEN 2) */}
            {(selectedView === 'advanced' || selectedView === 'both') && (
                <div className="space-y-8 max-w-[85em] mx-auto px-4">
                    {selectedView === 'both' && (
                        <div className="text-left pb-4">
                            <h4 className="text-lg font-black uppercase tracking-widest text-[#FF5D1E] flex items-center gap-2">
                                <span>✦</span> ESTRUCTURA AVANZADA REINTEGRADA (CON ACORDEÓN EXPANDIBLE)
                            </h4>
                        </div>
                    )}
                    
                    <div className="text-center pb-2">
                        <p className="text-zinc-400 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
                            Haz clic en cualquiera de los avatares para expandir y ver su análisis detallado.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {processedAvs.map((av, idx) => {
                            const isOpen = activeAvatarIndex === idx;

                            return (
                                <div 
                                    key={av.id || idx}
                                    className={`group relative bg-[#090e1a]/80 backdrop-blur-md rounded-[2.5rem] border transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ${
                                        isOpen 
                                            ? (idx === 0 ? 'border-pink-500/40' : idx === 1 ? 'border-amber-500/30' : 'border-violet-500/30') 
                                            : 'border-white/[0.04] hover:border-white/10'
                                    }`}
                                >
                                    {/* Accordion trigger header */}
                                    <div
                                        onClick={() => {
                                            setActiveAvatarIndex(isOpen ? null : idx);
                                        }}
                                        className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer select-none"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-left">
                                            {/* Avatar Picture styled beautifully */}
                                            <div className="relative shrink-0 flex justify-center">
                                                <div className={`w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 p-0.5 bg-zinc-950 shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden transition-transform duration-500 ${isOpen ? 'scale-105 border-pink-500' : 'border-zinc-800'}`}>
                                                    <img
                                                        src={av.img}
                                                        alt={av.name}
                                                        referrerPolicy="no-referrer"
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2.5 flex-wrap">
                                                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-sans tracking-tight">
                                                        {av.name}
                                                    </h3>
                                                    {/* Badge */}
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${av.priorityClass}`}>
                                                        {av.priority}
                                                    </span>
                                                </div>

                                                {/* Demographic description line with vector calendar */}
                                                <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-[13px] font-bold flex-wrap">
                                                    <Calendar className="w-4 h-4 text-pink-500 shrink-0" />
                                                    <span>{av.age}</span>
                                                    <span>•</span>
                                                    <span>{av.occupation}</span>
                                                    <span>•</span>
                                                    <span>{av.income}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chevron status */}
                                        <div className="flex justify-end items-center md:pl-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion body panels */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key="content-panel"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                                className="border-t border-white/[0.04]"
                                            >
                                                <div className="p-6 md:p-10 space-y-8 bg-gradient-to-b from-[#0a0f1d] to-[#04060b]">
                                                    {/* Multitabs Navigation Header */}
                                                    <div className="flex items-center gap-1 border-b border-white/[0.04] overflow-x-auto overflow-y-hidden pb-1 px-1 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                                        {[
                                                            { id: "resumen", label: "Resumen" },
                                                            { id: "demografico", label: "Perfil Demográfico" },
                                                            { id: "dolores", label: "Dolores y Miedos" },
                                                            { id: "deseos", label: "Deseos y Motivaciones" },
                                                            { id: "comportamiento", label: "Comportamientos" },
                                                        ].map((tab) => (
                                                            <button
                                                                key={tab.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setAvatarSubTab(tab.id as any);
                                                                }}
                                                                className={`px-3 sm:px-5 py-2.5 text-[11px] sm:text-[13px] font-bold uppercase transition-all duration-300 relative whitespace-nowrap shrink-0 border-b-2 -mb-[5px] ${
                                                                    avatarSubTab === tab.id
                                                                        ? "text-pink-500 border-pink-500"
                                                                        : "text-zinc-500 border-transparent hover:text-zinc-300"
                                                                }`}
                                                            >
                                                                {tab.label}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* TAB RESUMEN (IMAGEN 2 CARDS) */}
                                                    {avatarSubTab === "resumen" && (
                                                        <div className="space-y-8">
                                                            {/* 2-by-2 visual cards matching layout of psychology avatars */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                                {/* Dolor Crítico */}
                                                                <div className="p-5 bg-red-500/[0.02] border border-red-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-red-500/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                                    <div>
                                                                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wide border border-red-500/20">Dolor Crítico</span>
                                                                    </div>
                                                                    <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                        {av.dolores_principales?.[0] || "(no definido)"}
                                                                    </p>
                                                                </div>

                                                                {/* Transformación Deseada */}
                                                                <div className="p-5 bg-[#10b981]/[0.02] border border-[#10b981]/10 rounded-2xl flex flex-col gap-3.5 hover:border-[#10b981]/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                                    <div>
                                                                        <span className="px-2 py-0.5 rounded bg-[#10b981]/10 text-[#34d399] text-[10px] font-black uppercase tracking-wide border border-[#10b981]/20">Transformación Deseada</span>
                                                                    </div>
                                                                    <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                        {av.deseos_principales?.[0] || "(no definido)"}
                                                                    </p>
                                                                </div>

                                                                {/* Barrera de Venta */}
                                                                <div className="p-5 bg-amber-500/[0.02] border border-amber-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-amber-500/25 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                                    <div>
                                                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-wide border border-amber-500/20">Barrera de Venta</span>
                                                                    </div>
                                                                    <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                        {av.dolores_principales?.[1] || av.objection || "(no definido)"}
                                                                    </p>
                                                                </div>

                                                                {/* Para qué Emocional */}
                                                                <div className="p-5 bg-pink-500/[0.02] border border-pink-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-pink-500/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                                    <div>
                                                                        <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-wide border border-pink-500/20">Para qué Emocional</span>
                                                                    </div>
                                                                    <p className="text-zinc-300 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                        {av.deseos_principales?.[1] || av.emotional_reason || "(no definido)"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Decision Drivers with Stars */}
                                                            <div className="pt-6 border-t border-white/[0.04] text-left">
                                                                <p className="text-[#FFBF00] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    <span className="text-[#FFBF00]">⚡</span> Drilvers De Decisión
                                                                </p>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {Object.entries(av.motivations || {}).map(([key, value]: any) => {
                                                                        const isStringValue = typeof value === 'string';
                                                                        if (!isStringValue) return null;
                                                                        return (
                                                                            <div key={key} className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-yellow-500/10 transition-all shadow-md">
                                                                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 mt-0.5 animate-pulse">
                                                                                    <span className="text-[#FFBF00] font-bold text-sm">✦</span>
                                                                                </div>
                                                                                <div className="space-y-0.5">
                                                                                    <p className="text-[10px] text-[#FFBF00] font-black uppercase tracking-widest">{key.toUpperCase()}</p>
                                                                                    <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed font-normal text-left">{value}</p>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>

                                                            {/* Quote / Hook Callout box */}
                                                            <div className="space-y-3 pt-6 border-t border-white/[0.04] text-left">
                                                                <span className="text-xs font-black uppercase text-[#FFBF00] tracking-widest block font-sans">
                                                                    Mensaje que Más Conecta con Este Avatar
                                                                </span>
                                                                <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl relative overflow-hidden">
                                                                    <span className="absolute top-1 left-2.5 text-5xl font-serif text-[#FFBF00]/15 select-none font-black">“</span>
                                                                    <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-semibold italic pl-4 text-left">
                                                                        {av.quote}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* TAB DE DEMOGRAFÍA */}
                                                    {avatarSubTab === "demografico" && (
                                                        <div className="space-y-5 text-left">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                                                <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                    Perfil demográfico y tecnológico detallado de {av.name}
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                                {av.demographics.map((item: any, dIdx: number) => (
                                                                    <div key={dIdx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex flex-col gap-1 justify-between hover:border-white/10 transition-colors">
                                                                        <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">{item.label}</span>
                                                                        <span className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug">{item.val}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* TAB DE DOLORES Y MIEDOS */}
                                                    {avatarSubTab === "dolores" && (
                                                        <div className="space-y-5 text-left">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                                <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                    Miedos latentes y barreras que frenan su decisión de compra
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                                                {av.dolores_ocultos.map((item: any, dIdx: number) => (
                                                                    <div key={dIdx} className="p-5 bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-rose-500/25 hover:bg-rose-500/[0.04] transition-all duration-300 shadow-lg shadow-black/20 text-left group">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                                                                            <h4 className="text-xs sm:text-sm font-extrabold text-rose-400 leading-snug uppercase tracking-wider">{item.title}</h4>
                                                                        </div>
                                                                        <p className="text-xs sm:text-[13px] text-zinc-300 font-semibold leading-relaxed mt-1">{item.text}</p>
                                                                    </div>
                                                                ))}
                                                                {av.dolores_ocultos.length === 0 && (
                                                                    <p className="text-zinc-500 text-xs italic">Actualmente no hay dolores o miedos específicos cargados.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* TAB DE DESEOS Y MOTIVACIONES */}
                                                    {avatarSubTab === "deseos" && (
                                                        <div className="space-y-5 text-left">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                                <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                    Aspiraciones profundas y disparadores de decisión validados
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                                                {av.deseos_motivaciones.map((item: any, dIdx: number) => (
                                                                    <div key={dIdx} className="p-5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-emerald-500/25 hover:bg-emerald-500/[0.04] transition-all duration-300 shadow-lg shadow-black/20 text-left group">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                                                                            <h4 className="text-xs sm:text-sm font-extrabold text-emerald-400 leading-snug uppercase tracking-wider">{item.title}</h4>
                                                                        </div>
                                                                        <p className="text-xs sm:text-[13px] text-zinc-300 font-semibold leading-relaxed mt-1">{item.text}</p>
                                                                    </div>
                                                                ))}
                                                                {av.deseos_motivaciones.length === 0 && (
                                                                    <p className="text-zinc-500 text-xs italic">Actualmente no hay deseos cargados en esta de sección.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* TAB DE COMPORTAMIENTOS */}
                                                    {avatarSubTab === "comportamiento" && (
                                                        <div className="space-y-4 text-left">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFBB00]"></span>
                                                                <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                                    Hábitos de consumo diario y canales donde captar su atención
                                                                </p>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                                {av.comportamientos.map((item: string, dIdx: number) => (
                                                                    <div key={dIdx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex gap-3 text-xs sm:text-[13px] text-zinc-400 hover:text-zinc-200 transition-colors font-medium font-sans leading-relaxed items-start animate-fade-in">
                                                                        <span className="text-pink-500 font-extrabold shrink-0">✓</span>
                                                                        <span>{item}</span>
                                                                    </div>
                                                                ))}
                                                                {av.comportamientos.length === 0 && (
                                                                    <p className="text-zinc-500 text-xs italic">Actualmente no hay hábitos cargados en esta sección.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
};
