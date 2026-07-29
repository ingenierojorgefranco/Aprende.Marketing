import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Target, X, Check, ChevronRight, Users, Sparkles, MessageSquare, 
  BookOpen, TrendingUp, Shield, Crown, Brain, Calendar, ChevronDown, 
  CheckCircle, Globe, PenTool, FileText
} from 'lucide-react';

export type CommercialOptionId = 
  | "avatar" 
  | "testimonials" 
  | "objections" 
  | "benefits" 
  | "proposition" 
  | "offer" 
  | "funnel" 
  | "cta";

interface EstrategiaComercialDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeOption: CommercialOptionId | null;
  setActiveOption: (opt: CommercialOptionId | null) => void;
  strategyData?: any;
}

const getSystemAvatars = (strategyData: any) => {
  const defaultAvs = [
    {
      name: "María Fernanda",
      priority: "PRINCIPAL",
      priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
      audiencePct: "68% DE TU AUDIENCIA",
      audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
      age: "28 - 35 años",
      occupation: "Emprendedora",
      income: "Ingresos variables",
    },
    {
      name: "Valeria Mendoza",
      priority: "SECUNDARIO",
      priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
      audiencePct: "22% DE TU AUDIENCIA",
      audienceClass: "bg-amber-500/10 border-amber-500/30 text-amber-500 border",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
      age: "22 - 27 años",
      occupation: "Cosmetóloga Junior",
      income: "Ingreso fijo bajo",
    },
    {
      name: "Mónica Silva",
      priority: "COMPLEMENTARIO",
      priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
      audiencePct: "10% DE TU AUDIENCIA",
      audienceClass: "bg-violet-500/10 border-violet-500/30 text-violet-500 border",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
      age: "36 - 45 años",
      occupation: "Emprendedora desde cero",
      income: "Sin ingresos estables",
    },
  ];

  if (!strategyData?.avatars || strategyData.avatars.length === 0) {
    return defaultAvs;
  }

  return defaultAvs.map((def, idx) => {
    const real = strategyData.avatars[idx];
    if (!real) return def;
    return {
      ...def,
      name: real.name || def.name,
      age: real.ageRange || real.age || def.age,
      occupation: real.occupation || real.archetype || real.profession || def.occupation,
      income: real.income || real.incomeRange || def.income,
      img: real.image || real.img || def.img,
    };
  });
};

export const EstrategiaComercialDrawer: React.FC<EstrategiaComercialDrawerProps> = ({
  isOpen,
  onClose,
  activeOption,
  setActiveOption,
  strategyData,
}) => {
  const [avatarSubTab, setAvatarSubTab] = useState<"resumen" | "demografico" | "dolores" | "deseos" | "comportamientos">("resumen");
  const [activeAvatarIndex, setActiveAvatarIndex] = useState<number | null>(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number>(-1);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number>(-1);
  const [editingTestimonialText, setEditingTestimonialText] = useState<string>("");
  const [isSavingTestimonial, setIsSavingTestimonial] = useState<boolean>(false);

  const handleStartEditTestimonial = (idx: number, currentText: string) => {
    setEditingTestimonialIndex(idx);
    setEditingTestimonialText(currentText);
  };

  const handleCancelEditTestimonial = () => {
    setEditingTestimonialIndex(-1);
    setEditingTestimonialText("");
  };

  const handleSaveTestimonial = (idx: number) => {
    setIsSavingTestimonial(true);
    setTimeout(() => {
      if (strategyData?.modules?.testimonials && strategyData.modules.testimonials[idx]) {
        strategyData.modules.testimonials[idx].text = editingTestimonialText;
        strategyData.modules.testimonials[idx].quote = editingTestimonialText;
      } else if (strategyData?.testimonials && strategyData.testimonials[idx]) {
        strategyData.testimonials[idx].text = editingTestimonialText;
        strategyData.testimonials[idx].quote = editingTestimonialText;
      }
      setIsSavingTestimonial(false);
      setEditingTestimonialIndex(-1);
    }, 400);
  };

  const activeProjectName = strategyData?.meta?.projectName || "Curso Profesional";

  const optionsList: { id: CommercialOptionId; title: string; desc: string }[] = [
    { id: "avatar", title: "Avatares Psicológicos", desc: "Tus compradores ideales totalmente perfilados con sus dolores, deseos y motivaciones." },
    { id: "testimonials", title: "Testimonios Persuasivos", desc: "Historias de éxito realistas y testimonios diseñados para derribar el escepticismo." },
    { id: "objections", title: "Frustraciones del Avatar", desc: "Análisis de las barreras de compra más comunes y cómo resolverlas eficazmente." },
    { id: "benefits", title: "Beneficios Magnéticos", desc: "Los ganchos de transformación que conectan las características con las emociones." },
    { id: "proposition", title: "Propuesta de Valor", desc: "La declaración central que resume por qué tu cliente ideal debe elegirte." },
    { id: "offer", title: "Oferta Principal", desc: "La estructura irresistible de tu producto o servicio con bonos y garantías." },
    { id: "funnel", title: "Embudo de Conversión", desc: "El mapa paso a paso del viaje de tu cliente desde el descubrimiento hasta el cierre." },
    { id: "cta", title: "CTA Principal", desc: "Llamados a la acción directos y persuasivos diseñados para maximizar la conversión." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[155] overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              onClose();
              setActiveOption(null);
            }}
            className="absolute inset-0 bg-black cursor-pointer"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className={`relative h-full bg-[#0b0b0f] border-l border-white/5 shadow-[-15px_0_50px_rgba(0,0,0,0.9)] flex flex-col z-10 overflow-hidden text-left transition-all duration-300 ${
              activeOption ? "w-full max-w-[1300px]" : "w-full max-w-lg md:max-w-xl"
            }`}
          >
            {/* Header */}
            <div className="p-6 pb-5 border-b border-white/[0.04] bg-[#0e0e14]/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-4 text-left">
                <div className="w-11 h-11 rounded-xl bg-[#FF5D1E]/10 border border-[#FF5D1E]/20 flex items-center justify-center text-[#FF5D1E] shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight">Estrategia Comercial</h3>
                  <p className="text-white font-light text-xs sm:text-sm leading-relaxed">
                    Tu plan de ruta estratégico para posicionar tu marca y escalar tus ventas de forma óptima.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveOption(null);
                }}
                className="p-2.5 rounded-full bg-[#FF5D1E]/10 text-[#FF5D1E] hover:bg-[#FF5D1E]/20 transition-colors focus:outline-none shrink-0 cursor-pointer border border-[#FF5D1E]/20 shadow-[0_0_15px_rgba(255,93,30,0.15)]"
                title="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VISTA BÁSICA (Lista si no hay opción activa) */}
            {!activeOption ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-3.5 font-sans">
                    {optionsList.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setActiveOption(opt.id);
                          setAvatarSubTab("resumen");
                        }}
                        className="flex items-start justify-between p-4 bg-white/[0.02] border border-white/[0.04] hover:border-[#FF5D1E]/40 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-[#FF5D1E]/[0.02] group gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-[18px] h-[18px] rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-bold text-white group-hover:text-[#FF5D1E] transition-colors leading-snug">
                              {opt.title}
                            </h4>
                            <span className="text-zinc-400 font-light text-xs mt-1 leading-normal block">
                              {opt.desc}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#FF5D1E] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* VISTA EXPANDIDA COMPLETA (Split Dual) */
              <div className="flex flex-col h-full bg-[#0b0b0f]">
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  {/* Left Column (Sidebar) */}
                  <div className="w-full md:w-[320px] lg:w-[350px] bg-[#0d0d12] border-r border-white/[0.04] p-5 flex flex-col gap-5 overflow-y-auto shrink-0">
                    <div className="space-y-2">
                      {optionsList.map((opt) => {
                        const isActive = activeOption === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              setActiveOption(opt.id);
                              setAvatarSubTab("resumen");
                            }}
                            className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 border font-sans ${
                              isActive
                                ? "bg-[#FF5D1E]/[0.04] border-[#FF5D1E]/40 text-white font-black shadow-sm shadow-[#FF5D1E]/5"
                                : "bg-white/[0.01] border-white/[0.03] text-zinc-400 font-semibold hover:bg-white/[0.03] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                                isActive
                                  ? "bg-emerald-500/10 border-emerald-500/45 text-emerald-400"
                                  : "bg-zinc-800/50 border-zinc-700 text-zinc-500"
                              }`}>
                                <Check className="w-2.5 h-2.5" />
                              </div>
                              <span className={`text-xs sm:text-[13px] tracking-tight ${isActive ? "font-black" : "font-semibold"}`}>{opt.title}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                              isActive ? "text-[#FF5D1E]" : "text-zinc-500"
                            }`} />
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <button
                        onClick={() => {
                          onClose();
                          setActiveOption(null);
                        }}
                        className="w-full py-3 bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(255,90,31,0.25)] cursor-pointer text-center"
                      >
                        Cerrar Vista
                      </button>
                    </div>
                  </div>

                  {/* Right Column (Content Details Pane) */}
                  <div className="flex-1 bg-[#0b0b0f] p-5 md:p-8 overflow-y-auto space-y-6">

                    {/* 1. AVATARES PSICOLÓGICOS */}
                    {activeOption === "avatar" && (
                      <div className="space-y-6 text-left">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/5">
                            <Users className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Avatares Psicológicos</h2>
                            <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1 animate-fade-in-up">
                              Tus compradores ideales totalmente perfilados con sus dolores, deseos y motivaciones de compra. Haz clic en cualquiera de ellos para ver su análisis detallado.
                            </p>
                          </div>
                        </div>

                        {/* Accordion List for 3 Avatars */}
                        <div className="space-y-5 mt-4">
                          {(() => {
                            const defaultAvs = [
                              {
                                name: "María Fernanda",
                                priority: "PRINCIPAL",
                                priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
                                audiencePct: "68% DE TU AUDIENCIA",
                                audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
                                age: "28 - 35 años",
                                occupation: "Emprendedora",
                                income: "Ingresos variables",
                                // Resumen Tab
                                dolores_principales: [
                                  "No tiene suficientes clientes estables.",
                                  "Siente que su trabajo no es valorado como debería.",
                                  "Le cuesta diferenciarse en un mercado saturado.",
                                  "Miedo a invertir en formación y no ver resultados.",
                                ],
                                deseos_principales: [
                                  "Tener más clientes y agenda llena.",
                                  "Ser reconocida como experta en su área.",
                                  "Lograr independencia financiera.",
                                  "Tener flexibilidad de tiempo y ubicación.",
                                ],
                                quote: "Aprende una técnica profesional, con acompañamiento real, para que consigas más clientes, mejores ingresos y la libertad que mereces.",
                                // Demográfico Tab
                                demographics: [
                                  { label: "Nivel de Estudios", val: "Universitario o Técnico Superior" },
                                  { label: "Ocupación de Preferencia", val: "Cosmetóloga independiente o Esteticista" },
                                  { label: "Rango de Ingresos", val: "Ingreso base inestable ($600 - $1,200 USD/mes)" },
                                  { label: "Ubicación Geográfica", val: "Zonas semi-urbanas y urbanas" },
                                  { label: "Estado Civil", val: "Soltera o casada con hijos pequeños" },
                                  { label: "Dispositivos de uso", val: "Smartphone de gama media-alta, Instagram, WhatsApp" },
                                ],
                                // Dolores y miedos ocultos Tab
                                dolores_ocultos: [
                                  { title: "CLIENTELA INESTABLE", text: "No tiene suficientes clientes estables, lo que le genera una alta incertidumbre mensual sobre la facturación de su negocio." },
                                  { title: "TRABAJO DESVALORADO", text: "Siente que su trabajo no es valorado como debería y que las clientas siempre buscan la opción más barata regateando precios." },
                                  { title: "MARKETING INVISIBLE", text: "Le cuesta diferenciarse en un mercado saturado de profesionales independientes ofreciendo lo mismo a precios muy bajos." },
                                  { title: "INVERSIÓN SIN RETORNO", text: "Miedo a invertir en formación y no ver resultados, perdiendo sus recursos en teoría aburrida que no puede aplicar en la práctica real." },
                                ],
                                // Deseos y motivaciones Tab
                                deseos_motivaciones: [
                                  { title: "AGENDA LLENA", text: "Tener más clientes y la agenda completamente llena con meses de anticipación sin tener que regatear tarifas." },
                                  { title: "EXPERTA RECONOCIDA", text: "Ser reconocida formalmente como una de las mejores expertas referentes en su área y ciudad." },
                                  { title: "INDEPENDENCIA FINANCIERA", text: "Lograr verdadera estabilidad e independencia económica para tomar decisiones con libertad." },
                                  { title: "FLEXIBILIDAD ABSOLUTA", text: "Tener control total de sus propios horarios de atención y la flexibilidad de tiempo y ubicación que siempre soñó." },
                                ],
                                // Comportamientos Tab
                                comportamientos: [
                                  "Sigue activamente cuentas de gurús de belleza y marketing estético en Instagram y TikTok.",
                                  "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos aplicables.",
                                  "Pregunta constantemente en grupos de Facebook qué marcas de pigmentos o inductores son mejores.",
                                  "Consume video tutoriales rápidos por las noches antes de dormir buscando perfeccionar trazo de cejas.",
                                ]
                              },
                              {
                                name: "Valeria Mendoza",
                                priority: "SECUNDARIO",
                                priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
                                audiencePct: "22% DE TU AUDIENCIA",
                                audienceClass: "bg-amber-500/10 border-amber-500/30 text-amber-500 border",
                                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
                                age: "22 - 27 años",
                                occupation: "Cosmetóloga Junior",
                                income: "Ingreso fijo bajo",
                                // Resumen Tab
                                dolores_principales: [
                                  "Siente estancamiento profesional por falta de especialización.",
                                  "Su sueldo actual en un centro de estética no compensa su esfuerzo.",
                                  "Temor a estropear el rostro de un cliente con técnicas dudosas.",
                                  "Falta de contactos y red de clientes para iniciar sola.",
                                ],
                                deseos_principales: [
                                  "Especializarse en la técnica más demandada del rubro.",
                                  "Abrir su propio centro o cabina privada el próximo año.",
                                  "Cobrar el dible o triple por hora de servicio certificado.",
                                  "Desarrollar un portafolio de cejas impactante.",
                                ],
                                quote: "Especialízate con un método paso a paso garantizado para que dupliques tus tarifas actuales y obtengas la acreditación que tus clientes valoran.",
                                // Demográfico Tab
                                demographics: [
                                  { label: "Nivel de Estudios", val: "Técnico medio o Curso comercial avanzado" },
                                  { label: "Ocupación de Preferencia", val: "Ayudante de cabina o Lashista junior" },
                                  { label: "Rango de Ingresos", val: "Sueldo fijo base ($400 - $700 USD/mes)" },
                                  { label: "Ubicación Geográfica", val: "Zonas urbanas y residenciales" },
                                  { label: "Estado Civil", val: "Soltera sin hijos" },
                                  { label: "Dispositivos de uso", val: "iPhone/Android de última generación, TikTok, Pinterest" },
                                ],
                                // Dolores y miedos ocultos Tab
                                dolores_ocultos: [
                                  { title: "El miedo al estancamiento profesional", text: "Teme trabajar como empleada toda su vida sin ver su propio crecimiento financiero." },
                                  { title: "Falta de credibilidad", text: "Le preocupa que las clientas no confíen en ella por verse muy joven o no tener certificación reconocida de alta gama." },
                                  { title: "Inestabilidad emocional", text: "La baja remuneración genera que dude de su propia pasión por la belleza y estética profesional." },
                                ],
                                // Deseos y motivaciones Tab
                                deseos_motivaciones: [
                                  { title: "Reconocimiento y Estatus", text: "Ser la especialista de referencia a la que las clientas agendan con semanas de anticipación corporativa." },
                                  { title: "Aumentar Tarifas", text: "Pasar de cobrar servicios baratos de $15 a tratamientos premium de más de $150 de forma segura." },
                                  { title: "Estilo de Vida Independiente", text: "Crear una marca personal respetada con identidad visual propia en redes sociales." },
                                ],
                                // Comportamientos Tab
                                comportamientos: [
                                  "Guarda tableros de fotos de cejas perfectas y estética minimalista en Pinterest.",
                                  "Sigue tendencias de micropigmentación internacionales de Europa y Brasil.",
                                  "Compara activamente los precios de academias en línea para decidir su inversión.",
                                  "Práctica exhaustivamente en látex para perfeccionar la precisión de sus trazos.",
                                ]
                              },
                              {
                                name: "Mónica Silva",
                                priority: "COMPLEMENTARIO",
                                priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
                                audiencePct: "10% DE TU AUDIENCIA",
                                audienceClass: "bg-violet-500/10 border-violet-500/30 text-violet-500 border",
                                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
                                age: "36 - 45 años",
                                occupation: "Emprendedora desde cero",
                                income: "Sin ingresos estables",
                                // Resumen Tab
                                dolores_principales: [
                                  "Miedo extremo a comenzar en un rubro totalmente desconocido.",
                                  "Creer que ya 'pasó su momento' o es muy mayor para aprender tecnologías de belleza.",
                                  "Dudas sobre su pulso y coordinación motora fina.",
                                  "Inseguridad al vender o hacer marketing en su nueva etapa.",
                                ],
                                deseos_principales: [
                                  "Reinventarse profesionalmente con un negocio moderno.",
                                  "Generar una fuente confiable de ingresos para el hogar.",
                                  "Demostrar a su entorno que puede liderar su propio proyecto.",
                                  "Tener el control total de sus finanzas corporativas.",
                                ],
                                quote: "No necesitas experiencia previa para triunfar. Nuestro programa te acompaña desde cero, cuidando tu técnica y enseñándote a vender sin esfuerzo.",
                                // Demográfico Tab
                                demographics: [
                                  { label: "Nivel de Estudios", val: "Educación técnica o administrativa" },
                                  { label: "Ocupación de Preferencia", val: "Ama de casa o Ex-empleada administrativa" },
                                  { label: "Rango de Ingresos", val: "Dependiente de ahorros familiares o pareja" },
                                  { label: "Ubicación Geográfica", val: "Zonas residenciales y capitales de provincia" },
                                  { label: "Estado Civil", val: "Casada con hijos adolescentes" },
                                  { label: "Dispositivos de uso", val: "Tablet, Facebook, canales de YouTube educativos" },
                                ],
                                // Dolores y miedos ocultos Tab
                                dolores_ocultos: [
                                  { title: "La barrera del aprendizaje técnico", text: "Duda de su capacidad para asimilar conceptos modernos o dominar herramientas de alta precisión." },
                                  { title: "Miedo al rechazo comercial", text: "Le aterra el proceso de vender o hablar con clientas desconocidas sobre precios y retornos." },
                                  { title: "El síndrome de la impostora tardía", text: "Siente que el mercado es para jóvenes influencers de belleza y le cuesta encajar visualmente." },
                                ],
                                // Deseos y motivaciones Tab
                                deseos_motivaciones: [
                                  { title: "Seguridad Financiera Post-Jubilación", text: "Construir un activo rentable y duradero que le dé tranquilidad a mediano-largo plazo." },
                                  { title: "Empoderamiento Familiar", text: "Aportar económicamente al hogar disminuyendo la presión financiera sobre su cónyuge." },
                                  { title: "Autorealización Personal", text: "Desarrollar un oficio creativo e inspirador que llene su tiempo de valor y orgullo propio." },
                                ],
                                // Comportamientos Tab
                                comportamientos: [
                                  "Sigue grupos comunitarios locales de emprendedores locales y negocios pymes.",
                                  "Prefiere cursos con soporte personalizado, llamadas en vivo o grupos cerrados de ayuda.",
                                  "Busca recomendaciones de boca en boca para evaluar la seriedad de una propuesta.",
                                  "Toma notas escritas detalladas en cuadernos físicos durante las clases teóricas.",
                                ]
                              }
                            ];

                            const hasSavedAvatars = !!(strategyData?.avatars && strategyData.avatars.length > 0);
                            const baseAvs = getSystemAvatars(strategyData);

                            const avatarsToRender = [0, 1, 2].map((idx) => {
                              const defaultAv = defaultAvs[idx];
                              const baseAv = baseAvs[idx];
                              const realAv = strategyData?.avatars?.[idx];

                              const name = realAv?.name || (hasSavedAvatars ? "(no definido)" : baseAv.name);
                              const age = realAv?.ageRange || realAv?.age || realAv?.age_range || (hasSavedAvatars ? "(no definido)" : baseAv.age);
                              const occupation = realAv?.occupation || realAv?.archetype || realAv?.profession || realAv?.profession_title || realAv?.job || realAv?.role || (hasSavedAvatars ? "(no definido)" : baseAv.occupation);
                              const income = realAv?.income || realAv?.incomeRange || (hasSavedAvatars ? "(no definido)" : baseAv.income);
                              const img = realAv?.image || realAv?.img || baseAv.img;
                              const quote = realAv?.quote || realAv?.message || (hasSavedAvatars ? "(no definido)" : defaultAv.quote);
                              
                              let dolores_principales = hasSavedAvatars ? [] : defaultAv.dolores_principales;
                              if (realAv?.dolores_principales && Array.isArray(realAv.dolores_principales)) {
                                dolores_principales = realAv.dolores_principales;
                              } else if (realAv?.pain_points && Array.isArray(realAv.pain_points)) {
                                dolores_principales = realAv.pain_points;
                              } else if (realAv?.pain) {
                                dolores_principales = [
                                  realAv.pain,
                                  ...(hasSavedAvatars ? [] : defaultAv.dolores_principales.slice(1))
                                ];
                              }

                              let deseos_principales = hasSavedAvatars ? [] : defaultAv.deseos_principales;
                              if (realAv?.deseos_principales && Array.isArray(realAv.deseos_principales)) {
                                deseos_principales = realAv.deseos_principales;
                              } else if (realAv?.desires && Array.isArray(realAv.desires)) {
                                deseos_principales = realAv.desires;
                              } else if (realAv?.desire || realAv?.transformation_title) {
                                deseos_principales = [
                                  realAv.desire || realAv.transformation_title,
                                  ...(hasSavedAvatars ? [] : defaultAv.deseos_principales.slice(1))
                                ];
                              }

                              const demographics = [
                                { label: "Nivel de Estudios", val: realAv?.education || realAv?.studies || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[0].val) },
                                { label: "Ocupación de Preferencia", val: realAv?.occupation || realAv?.archetype || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[1].val) },
                                { label: "Rango de Ingresos", val: realAv?.income || realAv?.incomeRange || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[2].val) },
                                { label: "Ubicación Geográfica", val: realAv?.location || realAv?.geographic || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[3].val) },
                                { label: "Estado Civil", val: realAv?.civilStatus || realAv?.marital_status || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[4].val) },
                                { label: "Dispositivos de uso", val: realAv?.devices || (hasSavedAvatars ? "(no definido)" : defaultAv.demographics[5].val) },
                              ];

                              let dolores_ocultos = hasSavedAvatars ? [] : defaultAv.dolores_ocultos;
                              if (realAv?.dolores_ocultos && Array.isArray(realAv.dolores_ocultos)) {
                                dolores_ocultos = realAv.dolores_ocultos;
                              } else if (realAv?.pain || realAv?.detailed_pains) {
                                const list = Array.isArray(realAv.detailed_pains) ? realAv.detailed_pains : (realAv.pain ? [realAv.pain] : []);
                                if (list.length > 0) {
                                  dolores_ocultos = list.map((p: any, i: number) => ({
                                    title: defaultAv.dolores_ocultos[i % defaultAv.dolores_ocultos.length]?.title || "Dolor Identificado",
                                    text: typeof p === 'string' ? p : p.text || p.title || ""
                                  }));
                                }
                              }

                              let deseos_motivaciones = hasSavedAvatars ? [] : defaultAv.deseos_motivaciones;
                              if (realAv?.deseos_motivaciones && Array.isArray(realAv.deseos_motivaciones)) {
                                deseos_motivaciones = realAv.deseos_motivaciones;
                              } else if (realAv?.desire || realAv?.motivations || realAv?.decisionDrivers || realAv?.drivers) {
                                const list = Array.isArray(realAv.drivers) ? realAv.drivers : (Array.isArray(realAv.decisionDrivers) ? realAv.decisionDrivers : (realAv.desire ? [realAv.desire] : []));
                                if (list.length > 0) {
                                  deseos_motivaciones = list.map((d: any, i: number) => ({
                                    title: defaultAv.deseos_motivaciones[i % defaultAv.deseos_motivaciones.length]?.title || "Motivador Clave",
                                    text: typeof d === 'string' ? d : d.text || d.title || ""
                                  }));
                                }
                              }

                              let comportamientos = hasSavedAvatars ? [] : defaultAv.comportamientos;
                              if (realAv?.comportamientos && Array.isArray(realAv.comportamientos)) {
                                comportamientos = realAv.comportamientos;
                              } else if (realAv?.behaviors && Array.isArray(realAv.behaviors)) {
                                comportamientos = realAv.behaviors;
                              }

                              const defaultMotivationsForIdx = {
                                dinero: idx === 0 ? "Retorno de inversión garantizado con su primer set de clientas." : idx === 1 ? "Garantía de reembolso o método blindado para proteger su capital y no desperdiciar ni un dólar más." : "Generar ingresos estables desde casa para lograr libertad financiera real.",
                                tiempo: idx === 0 ? "Establecer un flujo de trabajo optimizado para atender en menos de 90 minutos." : idx === 1 ? "Ir al grano con un sistema probado sin rodeos teóricos innecesarios." : "Flexibilidad horaria absoluta para pasar más tiempo con tus hijos o seres queridos.",
                                estatus: idx === 0 ? "Certificación oficial de alta gama para destacar de la competencia convencional." : idx === 1 ? "Validación por expertos que la posiciona como una profesional seria ante sus clientes." : "Sentir la satisfacción y el orgullo de transicionar hacia una profesión propia.",
                                seguridad: idx === 0 ? "Soporte uno a uno para resolver problemas reales en el inicio del negocio." : idx === 1 ? "Acompañamiento cercano anticaídas para asegurar sus primeros pasos prácticos." : "Guía paso a paso adaptada para principiantes absolutos sin experiencia previa."
                              };

                              const motivations = {
                                ...defaultMotivationsForIdx,
                                ...(realAv?.motivations || {})
                              };

                              return {
                                ...defaultAv,
                                name,
                                img,
                                age,
                                occupation,
                                income,
                                quote,
                                dolores_principales,
                                deseos_principales,
                                demographics,
                                dolores_ocultos,
                                deseos_motivaciones,
                                comportamientos,
                                motivations
                              };
                            });

                            return (
                              <div className="space-y-4">
                                {/* Banner instructivo elegante */}
                                <div className="flex items-center gap-2 px-1 mb-1 text-zinc-400 font-light text-xs sm:text-sm select-none font-sans">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5D1E]"></span>
                                  <span>Haz clic en cualquiera de los avatares para expandir y ver su análisis detallado.</span>
                                </div>

                                {avatarsToRender.map((av, idx) => {
                                  const isOpen = activeAvatarIndex === idx;
                                  return (
                                    <div
                                      key={idx}
                                      className={`border rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-[#FF5D1E]/60 hover:shadow-[0_0_20px_rgba(255,93,30,0.12)] hover:bg-[#121216]/50 ${
                                        isOpen
                                          ? "bg-[#0c0c11] border-[#FF5D1E]/40 shadow-[0_10px_30px_rgba(255,100,30,0.06)]"
                                          : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                      }`}
                                    >
                                      {/* Header clickable bar */}
                                      <div
                                        onClick={() => {
                                          setActiveAvatarIndex(isOpen ? null : idx);
                                        }}
                                        className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer select-none"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-left">
                                          {/* Avatar Picture with satinized custom border */}
                                          <div className="relative shrink-0 flex justify-center">
                                            <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 border-[#FF5D1E] p-0.5 bg-zinc-950 shadow-[0_0_15px_rgba(255,93,30,0.25)] flex items-center justify-center overflow-hidden">
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
                                              <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-sans">
                                                {av.name}
                                              </h3>
                                              {/* Badges */}
                                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${av.priorityClass}`}>
                                                {av.priority}
                                              </span>
                                            </div>

                                            {/* demographic line with icon */}
                                            <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-[13px] font-medium flex-wrap">
                                              <Calendar className="w-4 h-4 text-[#FF5D1E] shrink-0" />
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

                                      {/* Accordion expandable body */}
                                      <AnimatePresence initial={false}>
                                        {isOpen && (
                                          <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="border-t border-white/[0.04]"
                                          >
                                            <div className="p-5 md:p-8 space-y-6 bg-gradient-to-b from-[#0c0c11]/80 to-[#08080c]/95">
                                              {/* Internal Tab Navigation per Expanded Avatar */}
                                              <div className="flex items-center gap-2 overflow-x-auto pb-2 bg-black/30 p-2 rounded-2xl border border-white/5 custom-scrollbar">
                                                {[
                                                  { id: "resumen", label: "Resumen" },
                                                  { id: "demografico", label: "Perfil Demográfico" },
                                                  { id: "dolores", label: "Dolores y Miedos" },
                                                  { id: "deseos", label: "Deseos y Motivaciones" },
                                                  { id: "comportamientos", label: "Comportamientos" },
                                                ].map((tab) => {
                                                  const isActive = avatarSubTab === tab.id;
                                                  return (
                                                    <button
                                                      key={tab.id}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAvatarSubTab(tab.id as any);
                                                      }}
                                                      className={`px-4 py-2.5 text-[11px] sm:text-xs font-black whitespace-nowrap rounded-xl transition-all cursor-pointer duration-200 uppercase tracking-wider shrink-0 ${
                                                        isActive
                                                          ? "bg-gradient-to-r from-[#FF5D1E] to-[#e04c13] text-white border-2 border-[#FF5D1E] shadow-lg shadow-[#FF5D1E]/20 scale-[1.02] -translate-y-0.5"
                                                          : "bg-[#0c0c11] text-zinc-400 border border-white/5 hover:bg-white/[0.04] hover:text-white hover:border-white/10"
                                                      }`}
                                                    >
                                                      {tab.label}
                                                    </button>
                                                  );
                                                })}
                                              </div>

                                              {/* Tab: Resumen */}
                                              {avatarSubTab === "resumen" && (
                                                <div className="space-y-6 pt-2">
                                                  {/* Tarjetas de la Imagen 2 (Distribución de 2 por Fila) */}
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    {/* Dolor Crítico */}
                                                    <div className="p-5 bg-red-500/[0.02] border border-red-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-red-500/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                      <div>
                                                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-wide border border-red-500/20">Dolor Crítico</span>
                                                      </div>
                                                      <p className="text-white font-light text-sm sm:text-base leading-relaxed animate-fade-in-up">
                                                        {av.dolores_principales?.[0] || "(no definido)"}
                                                      </p>
                                                    </div>

                                                    {/* Transformación Deseada */}
                                                    <div className="p-5 bg-[#10b981]/[0.02] border border-[#10b981]/10 rounded-2xl flex flex-col gap-3.5 hover:border-[#10b981]/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                      <div>
                                                        <span className="px-2 py-0.5 rounded bg-[#10b981]/10 text-[#34d399] text-[10px] font-black uppercase tracking-wide border border-[#10b981]/20">Transformación Deseada</span>
                                                      </div>
                                                      <p className="text-white font-light text-sm sm:text-base leading-relaxed animate-fade-in-up">
                                                        {av.deseos_principales?.[0] || "(no defined)"}
                                                      </p>
                                                    </div>

                                                    {/* Barrera de Venta */}
                                                    <div className="p-5 bg-amber-500/[0.02] border border-amber-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-amber-500/25 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                      <div>
                                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-wide border border-amber-500/20">Barrera de Venta</span>
                                                      </div>
                                                      <p className="text-white font-light text-sm sm:text-base leading-relaxed animate-fade-in-up">
                                                        {av.dolores_principales?.[1] || "(no definido)"}
                                                      </p>
                                                    </div>

                                                    {/* Para qué Emocional */}
                                                    <div className="p-5 bg-pink-500/[0.02] border border-pink-500/10 rounded-2xl flex flex-col gap-3.5 hover:border-pink-500/20 transition-all duration-300 shadow-lg shadow-black/20 text-left">
                                                      <div>
                                                        <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-wide border border-pink-500/20">Para qué Emocional</span>
                                                      </div>
                                                      <p className="text-white font-light text-sm sm:text-base leading-relaxed animate-fade-in-up">
                                                        {av.deseos_principales?.[1] || "(no definido)"}
                                                      </p>
                                                    </div>
                                                  </div>

                                                  {/* Drivers de decisión */}
                                                  <div className="pt-6 border-t border-white/[0.04] text-left">
                                                    <p className="text-[#FFBF00] text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                                      <span className="text-[#FFBF00]">⚡</span> DRIVERS DE DECISIÓN
                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      {Object.entries(av.motivations || {}).map(([key, value]: any) => {
                                                        const isStringValue = typeof value === 'string';
                                                        if (!isStringValue) return null;
                                                        return (
                                                          <div key={key} className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-yellow-500/10 transition-all shadow-md">
                                                            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 mt-0.5">
                                                              <span className="text-[#FFBF00] font-bold text-sm">✦</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                              <p className="text-xs text-[#FFBF00] font-black uppercase tracking-widest">{key.toUpperCase()}</p>
                                                              <p className="text-white font-light text-xs sm:text-sm leading-relaxed text-left mt-1 animate-fade-in-up">{value}</p>
                                                            </div>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>

                                                  {/* Quote / Hook message box (Mensaje que Más Conecta con Este Avatar) */}
                                                  <div className="space-y-3 pt-6 border-t border-white/[0.04] text-left">
                                                    <span className="text-xs font-black uppercase text-[#FFBF00] tracking-widest block font-sans">
                                                      Mensaje que Más Conecta con Este Avatar
                                                    </span>
                                                    <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-2xl relative overflow-hidden">
                                                      <span className="absolute top-1 left-2.5 text-5xl font-serif text-[#FFBF00]/15 select-none">“</span>
                                                      <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-semibold italic pl-4 text-left">
                                                        {av.quote}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}

                                              {/* Tab: Demográfico */}
                                              {avatarSubTab === "demografico" && (
                                                <div className="space-y-5 pt-2 text-left">
                                                  <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5D1E]"></span>
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

                                              {/* Tab: Dolores */}
                                              {avatarSubTab === "dolores" && (
                                                <div className="space-y-5 pt-2 text-left">
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
                                                  </div>
                                                </div>
                                              )}

                                              {/* Tab: Deseos */}
                                              {avatarSubTab === "deseos" && (
                                                <div className="space-y-5 pt-2 text-left">
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
                                                  </div>
                                                </div>
                                              )}

                                              {/* Tab: Comportamientos */}
                                              {(avatarSubTab === "comportamientos" || (avatarSubTab as any) === "comportamiento") && (
                                                <div className="space-y-4 pt-2 text-left">
                                                  <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFBB00]"></span>
                                                    <p className="text-zinc-400 text-xs sm:text-sm font-semibold leading-relaxed">
                                                      Hábitos de consumo diario y canales donde captar su atención
                                                    </p>
                                                  </div>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                    {av.comportamientos.map((item: string, dIdx: number) => (
                                                      <div key={dIdx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl flex gap-3 text-xs sm:text-[13px] text-zinc-400 hover:text-zinc-200 transition-colors font-medium font-sans leading-relaxed items-start">
                                                        <span className="text-[#FF5D1E] font-extrabold shrink-0">✓</span>
                                                        <span>{item}</span>
                                                      </div>
                                                    ))}
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
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* 2. TESTIMONIOS PERSUASIVOS */}
                    {activeOption === "testimonials" && (
                      <div className="space-y-6 text-left">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-lg shadow-amber-500/5">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Testimonios Persuasivos</h2>
                            <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1">
                              Historias optimizadas de conversión que derriban el escepticismo y generan confianza ciega en tu oferta.
                            </p>
                          </div>
                        </div>

                        {(() => {
                          const baseAvs = getSystemAvatars(strategyData);
                          const rawTestimonials =
                            strategyData?.modules?.testimonials ||
                            strategyData?.testimonials ||
                            [
                              { quote: "Antes de tomar el curso dudaba mucho de mis trazos. Hoy en día agendo clientas todas las semanas a $150 USD por sesión. Recuperé la inversión en 15 días.", name: "María Fernanda" },
                              { quote: "Mi sueldo en la estética apenas me alcanzaba. Con el método paso a paso pude independizarme y abrir mi propia cabina privada.", name: "Valeria Mendoza" },
                              { quote: "Pensé que a mis 40 años era difícil aprender desde cero. El soporte 1 a 1 fue clave para perder el miedo y tener mis primeras clientas.", name: "Mónica Silva" }
                            ];

                          return (
                            <div className="space-y-4 pt-2">
                              <div className="flex items-center gap-2 px-1 mb-1 text-xs text-zinc-400 select-none font-sans">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span>Haz clic en cualquiera de los testimonios para expandir y ver sus detalles de conversión.</span>
                              </div>
                              {rawTestimonials.map((t: any, idx: number) => {
                                const textMsg = t.text || t.msg || t.quote || "";
                                const assocAv = baseAvs[idx % 3];

                                const nameToUse = assocAv.name;
                                const imageToUse = assocAv.img;
                                const ageToUse = assocAv.age;
                                const occupationToUse = assocAv.occupation;
                                const incomeToUse = assocAv.income;
                                const badgeTypeToUse = assocAv.priority;

                                const isOpen = activeTestimonialIndex === idx;
                                const isCurrentlyEditing = editingTestimonialIndex === idx;

                                return (
                                  <div
                                    key={idx}
                                    className={`bg-black/40 border rounded-[32px] relative overflow-hidden transition-all text-left shadow-lg ${
                                      isOpen ? "border-[#FF5D1E]/20" : "border-white/5 hover:border-white/10"
                                    }`}
                                  >
                                    <div
                                      onClick={() => {
                                        if (!isCurrentlyEditing) {
                                          setActiveTestimonialIndex(isOpen ? -1 : idx);
                                        }
                                      }}
                                      className="p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                                        <div className="relative shrink-0 flex justify-center">
                                          <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 border-[#FF5D1E] p-0.5 bg-zinc-950 shadow-[0_0_15px_rgba(255,93,30,0.25)] flex items-center justify-center overflow-hidden">
                                            <img
                                              src={imageToUse}
                                              alt={nameToUse}
                                              referrerPolicy="no-referrer"
                                              className="w-full h-full rounded-full object-cover"
                                            />
                                          </div>
                                        </div>
                                        <div className="text-left space-y-2">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-base md:text-lg font-black text-white leading-none">
                                              {nameToUse}
                                            </h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${assocAv.priorityClass}`}>
                                              {badgeTypeToUse}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-[13px] font-medium flex-wrap leading-none">
                                            <div className="flex items-center gap-1">
                                              <Calendar className="w-3.5 h-3.5 text-[#FF5D1E]" />
                                              <span>{ageToUse}</span>
                                            </div>
                                            <span>•</span>
                                            <span>{occupationToUse}</span>
                                            <span>•</span>
                                            <span>{incomeToUse}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0">
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                      </div>
                                    </div>

                                    <AnimatePresence initial={false}>
                                      {isOpen && (
                                        <motion.div
                                          key="content"
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.25, ease: "easeInOut" }}
                                          className="border-t border-white/[0.04]"
                                        >
                                          <div className="p-6 space-y-5 bg-[#0d0d12]/20">
                                            {isCurrentlyEditing ? (
                                              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative">
                                                <textarea
                                                  value={editingTestimonialText}
                                                  onChange={(e) => setEditingTestimonialText(e.target.value)}
                                                  className="w-full text-zinc-200 bg-zinc-950 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FF5D1E] focus:ring-1 focus:ring-[#FF5D1E]"
                                                  rows={4}
                                                  placeholder="Escribe el testimonio aquí..."
                                                />
                                              </div>
                                            ) : (
                                              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative">
                                                <p className="text-sm md:text-base leading-relaxed text-zinc-200 font-sans italic selection:bg-[#FF5D1E]/30">
                                                  "{textMsg}"
                                                </p>
                                              </div>
                                            )}

                                            {isCurrentlyEditing ? (
                                              <div className="flex items-center gap-3 flex-wrap">
                                                <button
                                                  onClick={() => handleSaveTestimonial(idx)}
                                                  disabled={isSavingTestimonial || !editingTestimonialText.trim()}
                                                  className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-white bg-[#FF5D1E] hover:bg-[#ff743c] disabled:opacity-50 border border-transparent rounded-xl transition-all font-bold cursor-pointer"
                                                >
                                                  {isSavingTestimonial ? "Guardando..." : "Guardar"}
                                                </button>
                                                <button
                                                  onClick={handleCancelEditTestimonial}
                                                  disabled={isSavingTestimonial}
                                                  className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-50 border border-white/5 rounded-xl transition-all font-bold cursor-pointer"
                                                >
                                                  Cancelar
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-3 flex-wrap">
                                                <button
                                                  onClick={() => handleStartEditTestimonial(idx, textMsg)}
                                                  className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 rounded-xl transition-all font-bold cursor-pointer"
                                                >
                                                  <PenTool className="w-4 h-4" /> Editar
                                                </button>
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
                          );
                        })()}
                      </div>
                    )}

                    {/* 3. FRUSTRACIONES DEL AVATAR */}
                    {activeOption === "objections" && (
                      <div className="space-y-6 text-left">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/5">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Frustraciones del Avatar</h2>
                            <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1">
                              Retos emocionales, miedos ocultos e insatisfacciones profundas que impulsan a tu cliente a buscar una solución de inmediato.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 mt-4">
                          {(() => {
                            const objectionsAvsData = [
                              {
                                name: "María Fernanda",
                                priority: "PRINCIPAL",
                                priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
                                audiencePct: "68% DE TU AUDIENCIA",
                                audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
                                age: "28 - 35 años",
                                occupation: "Emprendedora",
                                income: "Ingresos variables",
                                transformation_title: "Si buscas escalar tu negocio con el servicio más rentable del sector estética...",
                                detailed_pains: [
                                  "Si te frustra ver tu agenda vacía mientras la competencia cobra fortunas por servicios que tú aún no dominas.",
                                  "Si te agota trabajar largas jornadas por un ingreso que no refleja tu esfuerzo ni tu talento.",
                                  "Si te duele sentirte invisible en un mercado saturado de servicios baratos que nadie valora."
                                ]
                              },
                              {
                                name: "Valeria Mendoza",
                                priority: "SECUNDARIO",
                                priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
                                audiencePct: "22% DE TU AUDIENCIA",
                                audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
                                age: "22 - 27 años",
                                occupation: "Cosmetóloga Junior",
                                income: "Ingreso fijo bajo",
                                transformation_title: "Si buscas escalar tu negocio de belleza con el servicio más lucrativo del mercado actual...",
                                detailed_pains: [
                                  "Si te frustra ver cómo tu agenda se llena de servicios que apenas cubren tus gastos básicos.",
                                  "Si te agota sentirte invisible frente a competidores que cobran el triple que tú.",
                                  "Si te duele sentir que tu talento está estancado por no tener una técnica de alto impacto."
                                ]
                              },
                              {
                                name: "Mónica Silva",
                                priority: "COMPLEMENTARIO",
                                priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
                                audiencePct: "10% DE TU AUDIENCIA",
                                audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
                                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
                                age: "36 - 45 años",
                                occupation: "Emprendedora desde cero",
                                income: "Sin ingresos estables",
                                transformation_title: "Si sueñas con la libertad de manejar tu propio tiempo sin depender de un sueldo fijo...",
                                detailed_pains: [
                                  "Si te frustra trabajar más de 10 horas al día sin ver un crecimiento real en tu cuenta bancaria.",
                                  "Si te agota la inseguridad de depender de que tus clientas agenden citas de bajo costo.",
                                  "Si te duele sentir que no pasas suficiente tiempo de calidad con tu familia por el cansancio."
                                ]
                              }
                            ];

                            const baseAvs = getSystemAvatars(strategyData);

                            const objectionsAvsToRender = [0, 1, 2].map((idx) => {
                              const defaultAv = objectionsAvsData[idx];
                              const baseAv = baseAvs[idx];
                              const realAv = strategyData?.avatars?.[idx];

                              const name = baseAv.name;
                              const img = baseAv.img;
                              const age = baseAv.age;
                              const occupation = baseAv.occupation;
                              const income = baseAv.income;
                              
                              const id = realAv?.id || idx + 1;

                              let transformation_title = realAv?.transformation_title || realAv?.learning_hook || defaultAv.transformation_title;
                              let detailed_pains = defaultAv.detailed_pains;

                              const customPains = strategyData?.psychology?.pains && Array.isArray(strategyData.psychology.pains)
                                ? strategyData.psychology.pains.filter((p: any) => 
                                    p && typeof p !== 'string' && 
                                    (String(p.avatarId) === String(id) || String(p.avatarId) === String(idx + 1))
                                  )
                                : [];

                              if (customPains.length > 0) {
                                detailed_pains = customPains.map((p: any) => typeof p === 'string' ? p : p.text);
                              }

                              return {
                                ...defaultAv,
                                name,
                                img,
                                age,
                                occupation,
                                income,
                                transformation_title,
                                detailed_pains
                              };
                            });

                            return (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1 mb-1 text-zinc-400 font-light text-xs sm:text-sm select-none font-sans">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                  <span>Haz clic en cualquiera de los avatares para expandir y ver sus frustraciones específicas.</span>
                                </div>

                                {objectionsAvsToRender.map((av, idx) => {
                                  const isOpen = activeAvatarIndex === idx;
                                  return (
                                    <div
                                      key={idx}
                                      className={`border rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] hover:bg-[#121216]/50 ${
                                        isOpen
                                          ? "bg-[#0c0c11] border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.06)]"
                                          : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                      }`}
                                    >
                                      <div
                                        onClick={() => {
                                          setActiveAvatarIndex(isOpen ? null : idx);
                                        }}
                                        className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer select-none"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-left">
                                          <div className="relative shrink-0 flex justify-center">
                                            <div className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px] rounded-full border-2 border-blue-500 p-0.5 bg-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.25)] flex items-center justify-center overflow-hidden">
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
                                              <h3 className="text-lg sm:text-xl font-black text-white leading-tight font-sans">
                                                {av.name}
                                              </h3>
                                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none ${av.priorityClass}`}>
                                                {av.priority}
                                              </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-[13px] font-medium flex-wrap">
                                              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                                              <span>{av.age}</span>
                                              <span>•</span>
                                              <span>{av.occupation}</span>
                                              <span>•</span>
                                              <span>{av.income}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex justify-end items-center md:pl-4">
                                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                          </div>
                                        </div>
                                      </div>

                                      <AnimatePresence initial={false}>
                                        {isOpen && (
                                          <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                          >
                                            <div className="p-5 md:p-8 space-y-6 bg-gradient-to-b from-[#0c0c11]/80 to-[#08080c]/95 border-t border-white/[0.04]">
                                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                                                <div className="lg:col-span-5 space-y-6 text-left">
                                                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/5">
                                                    <TrendingUp className="w-6 h-6" />
                                                  </div>
                                                  <h4 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans">
                                                    {av.transformation_title}
                                                  </h4>
                                                </div>

                                                <div className="hidden lg:block lg:col-span-1 h-32 w-px bg-white/[0.06] mx-auto" />

                                                <div className="lg:col-span-6 space-y-5 text-left">
                                                  {av.detailed_pains.map((dolor: string, pIdx: number) => (
                                                    <div key={pIdx} className="flex gap-4 items-start text-left">
                                                      <div className="relative shrink-0 mt-1.5">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping opacity-70" />
                                                      </div>
                                                      <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-semibold">
                                                        {dolor}
                                                      </p>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* 4. BENEFICIOS MAGNÉTICOS */}
                    {activeOption === "benefits" && (
                      <div className="space-y-6 text-left">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-500/5">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Beneficios Magnéticos</h2>
                            <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1">
                              Los argumentos de alto valor presentados en formato de impacto irresistible para enamorar al prospecto.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                          {(() => {
                            const rawLearningModulesSource = (strategyData?.psychology?.learningModules && strategyData.psychology.learningModules.length > 0)
                              ? strategyData.psychology.learningModules
                              : (strategyData?.psychology?.solutions && strategyData.psychology.solutions.length > 0)
                              ? strategyData.psychology.solutions.map((sol: any, idx: number) => ({
                                  title: typeof sol === 'object' ? sol.title : "Módulo de aprendizaje",
                                  description: typeof sol === 'object' ? sol.description : sol,
                                  icon: idx % 3 === 0 ? 'Brain' : idx % 3 === 1 ? 'Target' : 'Zap',
                                  color: idx < 3 ? 'text-blue-400' : idx < 6 ? 'text-emerald-400' : 'text-purple-400',
                                  bgIcon: idx < 3 ? 'bg-blue-500/10 border-blue-500/20' : idx < 6 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-purple-500/10 border-purple-500/20'
                                }))
                              : [];
                            const rawWebBenefits = strategyData?.modules?.web?.landingPageTabs?.benefits?.items || [];
                            const rawBenefits = strategyData?.benefits || [];
                            
                            const defaultBenefitsList = [
                              { title: "EL MAPA DEL ÉXITO PREMIUM", description: "Descubrirás el camino exacto para posicionarte como la opción de lujo que las clientas desean.", icon: "Target", color: "text-blue-400", bgIcon: "bg-blue-500/10 border-blue-500/20" },
                              { title: "ARQUITECTURA DE LA MIRADA", description: "Dominarás el arte de diseñar rostros que generen recomendaciones automáticas y ventas masivas.", icon: "BookOpen", color: "text-purple-400", bgIcon: "bg-purple-500/10 border-purple-500/20" },
                              { title: "INGRESOS DE ALTO IMPACTO", description: "La clave definitiva para dejar de competir por precio y empezar a cobrar por tu maestría.", icon: "TrendingUp", color: "text-emerald-400", bgIcon: "bg-emerald-500/10 border-emerald-500/20" },
                              { title: "EL ESCUDO DE SEGURIDAD", description: "Aprende los protocolos clínicos que protegen tu trabajo y te brindan confianza absoluta.", icon: "Shield", color: "text-rose-400", bgIcon: "bg-rose-500/10 border-rose-500/20" },
                              { title: "PROTOCOLO DE ATENCIÓN ÉLITE", description: "Cómo estructurar citas de alta gama completas que fidelicen a tus clientes desde la primera sesión.", icon: "Crown", color: "text-amber-400", bgIcon: "bg-amber-500/10 border-amber-500/20" },
                              { title: "LA COMUNIDAD PRIVADA VIP", description: "Soporte constante las 24 horas para guiarte en tus prácticas reales con modelos.", icon: "Users", color: "text-indigo-400", bgIcon: "bg-indigo-500/10 border-indigo-500/20" }
                            ];

                            let selectedSourceList = [];
                            if (rawLearningModulesSource.length > 0) {
                              selectedSourceList = rawLearningModulesSource;
                            } else if (rawWebBenefits.length > 0) {
                              selectedSourceList = rawWebBenefits;
                            } else if (rawBenefits.length > 0) {
                              selectedSourceList = rawBenefits;
                            } else {
                              selectedSourceList = defaultBenefitsList;
                            }

                            const renderBenefitIcon = (iconName: string, customColorClass: string) => {
                              const classes = `w-5 h-5 ${customColorClass || 'text-purple-400'}`;
                              switch (iconName) {
                                case "Target": return <Target className={classes} />;
                                case "BookOpen": return <BookOpen className={classes} />;
                                case "TrendingUp": return <TrendingUp className={classes} />;
                                case "Shield": return <Shield className={classes} />;
                                case "Crown": return <Crown className={classes} />;
                                case "Users": return <Users className={classes} />;
                                case "Brain": return <Brain className={classes} />;
                                default: return <Sparkles className={classes} />;
                              }
                            };

                            return selectedSourceList.map((item: any, idx: number) => {
                              const title = item.title || item.name || "Módulo de Valor";
                              const text = item.description || item.desc || item.text || "Módulo estructurado para detonar urgencia y persuasión de compra en tu oferta oficial.";
                              const iconName = item.icon || "Sparkles";
                              const customColor = item.color || "text-purple-400";
                              const bgIconClass = item.bgIcon || "bg-purple-500/10 border-purple-500/20";

                              return (
                                <div key={idx} className="p-6 bg-[#0a0d14]/60 border border-white/[0.04] rounded-3xl relative space-y-4 hover:border-purple-500/25 transition-all duration-300 text-left flex flex-col justify-between">
                                  <div className="space-y-4">
                                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${bgIconClass}`}>
                                      {renderBenefitIcon(iconName, customColor)}
                                    </div>
                                    <div className="space-y-2 text-left">
                                      <h4 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase font-sans text-left">
                                        {title}
                                      </h4>
                                      <p className="text-white font-light text-xs sm:text-sm leading-relaxed text-left mt-1">
                                        {text}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}

                    {/* 5. PROPUESTA DE VALOR */}
                    {activeOption === "proposition" && (() => {
                      const comm = strategyData?.commercial || {};
                      const positioningStatement = comm.proposition?.positioningStatement || "Ayudamos a esteticistas y emprendedoras de belleza a dominar la técnica de micropigmentación hiperrealista en 30 días con certificación oficial, logrando multiplicar por 5 sus ingresos por servicio sin depender de las marcas tradicionales o manuales complejos.";
                      const traditionalMarketDescription = comm.proposition?.traditionalMarketDescription || "Enfoque teórico aburrido, soporte ausente, sin orientación comercial, guerra de precios e insumos genéricos.";
                      const ourAlternativeDescription = comm.proposition?.ourAlternativeDescription || "Trazos hiperrealistas milimétricos garantizados, acompañamiento clínico activo, kit premium y tutoría para captar sus primeras 5 clientas estables.";
                      return (
                        <div className="space-y-6 text-left">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5D1E] shrink-0 shadow-lg shadow-orange-500/5">
                              <Target className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Propuesta de Valor</h2>
                              <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1">
                                Tu factor de diferenciación definitiva para salirte de la competencia destructiva de precios bajos.
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-3xl relative space-y-6 pt-5">
                            <div className="text-left space-y-2">
                              <h3 className="text-base sm:text-lg font-extrabold text-white">Declaración de Posicionamiento Único</h3>
                              <p className="text-[#FFBF00] text-sm md:text-base font-medium leading-relaxed italic border-l-2 border-[#FF5A1F] pl-4 text-left">
                                "{positioningStatement}"
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              <div className="p-5 bg-rose-500/[0.015] border border-rose-500/10 rounded-2xl space-y-2 text-left">
                                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">El mercado tradicional</span>
                                <p className="text-white font-light text-xs sm:text-sm leading-relaxed">
                                  {traditionalMarketDescription}
                                </p>
                              </div>
                              <div className="p-5 bg-emerald-500/[0.015] border border-emerald-500/10 rounded-2xl space-y-2 text-left">
                                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Nuestra Alternativa Única</span>
                                <p className="text-white font-light text-xs sm:text-sm leading-relaxed">
                                  {ourAlternativeDescription}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 6. OFERTA PRINCIPAL */}
                    {activeOption === "offer" && (() => {
                      const comm = strategyData?.commercial || {};
                      const recommendedPrice = comm.offer?.recommendedPrice || "297";
                      const originalPrice = comm.offer?.originalPrice || "597";
                      const packageItems = comm.offer?.packageItems || [
                        { concept: "Acceso Completo al Entrenamiento en Alta Definición", cost: "Valor de $197 USD" },
                        { concept: "Kit Integral de Micropigmentación (Zonas autorizadas)", cost: "Valor de $150 USD" },
                        { concept: "Sesiones de Consultas Clínicas de zoom 1-a-1", cost: "Cupo Limitado ($100 USD)" },
                        { concept: "Acceso Vitalicio + Diploma Especialización", cost: "Bono Exclusivo (Gratuito)" }
                      ];
                      const guaranteeTitle = comm.offer?.guaranteeTitle || "Garantía Incondicional de Satisfacción";
                      const guaranteeDescription = comm.offer?.guaranteeDescription || "Si durante los primeros 7 días aplicas los trazos prácticos iniciales del kit y sientes que no es para ti, te devolvemos el 100% de tu dinero sin preguntas. Riesgo Cero.";
                      
                      return (
                        <div className="space-y-6 text-left">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-lg shadow-amber-500/5">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Oferta Principal</h2>
                              <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1">
                                Estructuración exacta del paquete para que la decisión de compra sea una obviedad irresistible para tu avatar.
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-3xl relative space-y-6 pt-5">
                            <div className="flex justify-between items-center bg-[#FF5D1E]/10 p-5 rounded-2xl border border-[#FF5D1E]/30 flex-wrap gap-4 text-left">
                              <div className="text-left space-y-1">
                                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider block">Producto Recomendado</span>
                                <h3 className="text-base sm:text-lg font-black text-white">{comm.offer?.productName || activeProjectName}</h3>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] text-[#FF5D1E] uppercase font-black tracking-wider block">Precio Recomendado</span>
                                <p className="text-lg sm:text-2xl font-black text-[#FF5D1E]">${recommendedPrice}.00 USD <span className="text-xs text-zinc-300 line-through">${originalPrice}.00</span></p>
                              </div>
                            </div>

                            <div className="space-y-3.5 text-left">
                              <span className="text-xs font-black uppercase text-amber-400 tracking-widest block font-sans">
                                Desglose del Paquete Irresistible
                              </span>
                              <div className="space-y-2.5">
                                {packageItems.map((pack: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center p-3.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-left gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm select-none text-white font-light">
                                      <span className="text-amber-500 font-bold">✦</span>
                                      <span>{pack.concept || pack.item}</span>
                                    </div>
                                    <span className="text-[11px] font-extrabold uppercase text-amber-500 font-mono tracking-tight">{pack.cost || pack.val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-4 bg-emerald-500/[0.01] border border-emerald-500/10 rounded-2xl flex gap-3 text-left">
                              <CheckCircle className="w-5.5 h-5.5 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-emerald-400">{guaranteeTitle}</h4>
                                <p className="text-white font-light text-xs sm:text-sm leading-relaxed font-sans">
                                  {guaranteeDescription}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 7. EMBUDO DE CONVERSIÓN */}
                    {activeOption === "funnel" && (() => {
                      const comm = strategyData?.commercial || {};
                      const funnelSteps = comm.funnel?.funnelSteps || [
                        { stage: "Atracción Orgánica / Pauta", idea: "Anuncios y Reels hipersegmentados basados en el dolor del estancamiento financiero laboral tradicional de las esteticistas." },
                        { stage: "Captura de Datos", idea: "Landing de registro optimizada donde el prospecto se inscribe para ver una clase práctica express de Micropigmentación." },
                        { stage: "Nutrición con Persuasión", idea: "Secuencia automatizada de emails y recordatorios por WhatsApp calentando el escepticismo inicial y demostrando viabilidad." },
                        { stage: "Presentación de la Oferta / Cierre", idea: "Clase definitiva de 25 minutos con simulación guiada donde se abre la inscripción exclusiva al entrenamiento máster con su precio promocional." }
                      ];
                      
                      return (
                        <div className="space-y-6 text-left">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-500/5">
                              <Globe className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Embudo de Conversión</h2>
                              <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1">
                                El recorrido optimizado del usuario para calentar prospectos fríos y convertirlos en clientes calificados de forma predecible.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 pt-2">
                            {funnelSteps.map((fun: any, fIdx: number) => {
                              const stepNum = String(fIdx + 1).padStart(2, '0');
                              return (
                                <div key={fIdx} className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex items-start gap-4 relative">
                                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-extrabold font-mono text-xs shrink-0">{stepNum}</div>
                                  <div className="space-y-1 text-left">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-tight text-left">{fun.stage}</h4>
                                    <p className="text-white font-light text-xs sm:text-sm leading-relaxed text-left mt-1">{fun.idea || fun.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* 8. CTA PRINCIPAL */}
                    {activeOption === "cta" && (() => {
                      const comm = strategyData?.commercial || {};
                      const buttonText = comm.cta?.buttonText || "¡Quiero Especializarme e Incrementar mis Ingresos Ahora!";
                      const safetyMicrocopy = comm.cta?.safetyMicrocopy || "Inscripción 100% segura. Accede de inmediato al kit premium de micropigmentación.";
                      const scarcityTrigger = comm.cta?.scarcityTrigger || "Solo quedan 7 cupos con precio promocional en este lote de soporte.";
                      const urgencyTrigger = comm.cta?.urgencyTrigger || "Oferta válida únicamente por las próximas 48 horas de calentamiento.";
                      
                      return (
                        <div className="space-y-6 text-left">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 shadow-lg shadow-rose-500/5">
                              <Target className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">CTA Principal</h2>
                              <p className="text-white font-light text-sm sm:text-base leading-relaxed mt-1">
                                Los llamados a la acción definitivos de alta conversión configurados para incentivar decisiones de compra impulsivas.
                              </p>
                            </div>
                          </div>

                          <div className="p-6 bg-white/[0.01] border border-white/[0.04] rounded-3xl relative space-y-6 pt-5 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                              <span className="text-[10px] text-[#FF5D1E] font-black uppercase tracking-widest leading-none block">DISEÑO DE BOTÓN DE ALTO IMPACTO</span>
                              
                              <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5 shadow-2xl flex justify-center">
                                <button className="w-full bg-[#FF5D1E] hover:bg-[#FF6E33] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-[#FF5D1E]/20 flex items-center justify-center gap-2 select-none">
                                  {buttonText} <ChevronRight className="w-5 h-5 shrink-0" />
                                </button>
                              </div>

                              <div className="text-white font-light text-xs sm:text-sm leading-relaxed pt-2 flex flex-col gap-1.5 list-none text-left">
                                <li className="text-left">✦ <span className="font-black text-[#FF5D1E]">Microcopia persuasiva inferior:</span> "{safetyMicrocopy}"</li>
                                <li className="text-left">✦ <span className="font-black text-[#FF5D1E]">Gatillo de escasez:</span> "{scarcityTrigger}"</li>
                                <li className="text-left">✦ <span className="font-black text-[#FF5D1E]">Gatillo de urgencia:</span> "{urgencyTrigger}"</li>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
