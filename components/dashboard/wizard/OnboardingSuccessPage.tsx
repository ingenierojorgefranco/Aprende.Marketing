import React, { useState, useEffect, Suspense } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  X, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  Loader2, 
  Smartphone,
  Quote,
  MessageSquare,
  Mail
} from 'lucide-react';
import { api } from '../../../services/api';
import { User, Project } from '../../../types';
import { ProjectMasterStrategy } from '../../../services/strategySchema';
import { UpgradeModal } from '../UpgradeModal';

// Mock de la estrategia por si falla o es nula
const DEFAULT_STRATEGY: ProjectMasterStrategy = {
  avatars: [
    {
      name: "Laura Torres",
      archetype: "Buscadora de Ingresos Rápidos",
      quote: "Deseo emprender seguro pero temo perder mi dinero o fracasar en el intento.",
      pain: "Miedo a gastar dinero en cursos sin saber si podré recuperar la inversión de materiales.",
      desire: "Aprender una técnica pulida para dar servicios premium desde la primera semana.",
      ageRange: "25-34 años",
      salesBarrier: "No saber si podrá conseguir clientas que paguen precios altos.",
      emotionalReason: "Sentir el orgullo de ser una empresaria reconocida y exitosa.",
      decisionDrivers: [
        "Retorno de inversión garantizado con su primer set de clientas.",
        "Soporte uno a uno para resolver problemas reales en cabina.",
        "Certificación oficial de alta gama para destacar de la competencia."
      ]
    },
    {
      name: "Mónica Silva",
      archetype: "Esteticista Tradicional Estancada",
      quote: "Siento que el mercado local está saturado y mis tarifas son cada vez más bajas.",
      pain: "Frustración por trabajar largas horas ofreciendo manicura o depilación básica de baja rentabilidad.",
      desire: "Migrar a servicios de Micropigmentación de cejas de alto valor para triplicar su ticket base.",
      ageRange: "35-44 años",
      salesBarrier: "Incertidumbre sobre si sus clientas actuales aceptarán precios tres veces mayores.",
      emotionalReason: "Recuperar la libertad de tiempo y el prestigio profesional en su zona.",
      decisionDrivers: [
        "Evidencia de otras esteticistas que lograron la transición con éxito.",
        "Plantillas de comunicación para justificar el aumento de valor frente a viejas clientas.",
        "Técnicas de posicionamiento local orgánico."
      ]
    }
  ],
  modules: {
    testimonials: [
      {
        name: "Carlos Mendoza",
        role: "Emprendedor Digital",
        quote: "Pasé de no saber qué vender a facturar mis primeros $1,200 en solo 12 días gracias a este embudo."
      },
      {
        name: "Sofía Aguilar",
        role: "Creadora de Contenido",
        quote: "La automatización del guion de video y los emails de bienvenida me ahorran más de 4 horas diarias."
      }
    ],
    hooks: [
      {
        id: "hook-1",
        title: "El error de los $500",
        hook: "¿Sabías que el 90% de las personas pierde más de $500 al mes simplemente por no tener esta estructura psicológica en su perfil?",
        body: "En este video te enseño cómo revertirlo con 3 cambios simples que puedes hacer hoy mismo.",
        cta: "Haz clic abajo para descargar la guía gratuita y empezar hoy.",
        hashtags: "#marketing #ventas #automatizacion"
      }
    ],
    blog: [],
    emails: [
      {
        subject: "Día 1: Tu mapa de ruta ha llegado 🗺️",
        body: "Hola,\n\nQuiero darte la bienvenida oficial. En este primer correo quiero compartir contigo el mapa de ruta exacto que utilizaremos para levantar tu primer negocio digital desde cero..."
      },
      {
        subject: "Día 2: El secreto oculto de la conversión 🤫",
        body: "Hola de nuevo,\n\nAyer vimos el mapa. Hoy quiero revelarte la única palanca psicológica que determina si un visitante te compra o se va para siempre..."
      }
    ],
    whatsapp: [
      {
        title: "Mensaje de Bienvenida",
        message: "¡Hola! Bienvenido a nuestra comunidad VIP del Lanzamiento. Estoy muy feliz de tenerte aquí. En breve compartiré el enlace exclusivo para la sesión de hoy. ¡Mantente atento!"
      }
    ]
  }
} as any;

export const OnboardingSuccessPage: React.FC = () => {
  const { user } = useOutletContext() as { user: User };
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [createdPageSubdomain, setCreatedPageSubdomain] = useState<string>("");
  const [activeDetailsDrawer, setActiveDetailsDrawer] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const loadSuccessData = async () => {
      try {
        setLoading(true);

        // 1. Obtener proyectos y buscar el último activo o el más reciente
        const projects = await api.getProjects();
        if (projects && projects.length > 0) {
          // Tomamos el último proyecto activo
          const activeProj = projects.find(p => p.isActive) || projects[projects.length - 1];
          setProject(activeProj);

          // 2. Cargar estrategia para ese proyecto
          const strategy = await api.getProjectStrategy(activeProj.id);
          setStrategyData(strategy || activeProj.strategy_json || DEFAULT_STRATEGY);
        } else {
          setStrategyData(DEFAULT_STRATEGY);
        }

        // 3. Obtener subdominio si hay páginas de captura creadas
        const pages = await api.getPages();
        if (pages && pages.length > 0) {
          const firstPage = pages[0];
          if (firstPage.subdomain) {
            setCreatedPageSubdomain(firstPage.subdomain);
          }
        }
      } catch (err) {
        console.error("Error cargando los datos de la página de éxito:", err);
        setStrategyData(DEFAULT_STRATEGY);
      } finally {
        setLoading(false);
      }
    };

    loadSuccessData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-[#FF5A1F] animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Cargando tu máquina de ventas inteligente...</p>
      </div>
    );
  }

  const activeProjectName = project?.name || "Tu Primer Negocio";
  const activeProjectImage = project?.multimedia_json?.heroImages?.[0] || "";
  const activeProjectNiche = project?.niche || "Afiliado";

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 font-sans relative">
      {/* Background Gradient Sphere decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF5A1F]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Page Title */}
      <div className="text-center max-w-5xl mx-auto mb-12 space-y-6 relative z-10">
        <h1 className="text-4xl md:text-[3.5rem] md:leading-[1.1] font-black text-white tracking-tight uppercase">
          ¡PERFECTO!
          <br />
          <span className="text-white">YA ESTÁS A UN PASO DE </span>
          <span className="text-[#FF5A1F]">ATRAER CLIENTES Y GANAR ALTAS COMISIONES</span>
        </h1>

        {/* 85% Progress Container */}
        <div className="w-full max-w-3xl mx-auto bg-white/[0.02] border border-white/15 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF5A1F]/5 blur-2xl rounded-full"></div>
          <div className="relative z-10 space-y-4">
            <p className="text-gray-200 text-lg leading-relaxed">
              Tu máquina de ventas está actualmente al <span className="text-[#FFBF00] font-bold">85%</span>. Activa tu plan mensual para completar el 15% restante y empezar a facturar hoy mismo.
            </p>
            
            {/* Full-width progress bar with filling animation */}
            <div className="w-full relative space-y-2">
              <div className="w-full h-5 bg-white/5 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F] rounded-full shadow-[0_0_15px_rgba(255,90,31,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-end items-center px-1">
                <span className="text-[#FFBF00] font-mono font-black text-xl tracking-wider">
                  85%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Big Layout (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mb-12 relative z-10">
        {/* Columna Izquierda (El Proyecto) - 60% Width */}
        <div className="lg:col-span-7 flex">
          <div className="bg-[#0B0B0B] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-start space-y-6 shadow-2xl relative overflow-hidden flex-1 w-full">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>

            {/* Bento Header */}
            <div className="mb-2 relative z-10 text-center w-full">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full flex flex-col items-center justify-center py-2">
                  {/* Centered Project Name styled with attractive custom shapes */}
                  <div className="relative inline-flex items-center z-10 mb-6">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F] rounded-2xl blur-md opacity-25"></div>
                    <div className="relative bg-[#141415] border border-white/10 rounded-2xl px-6 py-3 shadow-inner font-sans text-center">
                      <h2 className="text-xl md:text-2xl font-black text-[#FFBF00] tracking-wider uppercase">
                        {activeProjectName}
                      </h2>
                    </div>
                  </div>

                  {/* Onboarding welcome message */}
                  <div className="w-full relative">
                    <p className="text-base text-center text-white/95 font-normal leading-relaxed w-full max-w-2xl mx-auto px-4 tracking-wide">
                      Tienes delante el negocio digital que otros tardan meses en configurar. Tienes los guiones, tienes la web y tienes la estrategia. Revisa tu material en los cajones deslizables de la derecha, activa tu cuenta y dale al botón de encendido para empezar a facturar de inmediato.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Body Container */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 mt-2">
              {/* Mobile iPhone Mockup Preview */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-48 h-[340px] bg-black rounded-[2.2rem] border-[5px] border-zinc-800 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer group hover:border-[#FFBF00]/40 transition-all duration-300">
                  {/* Camera notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full absolute left-3"></span>
                    <span className="w-1 h-1 bg-zinc-900 rounded-full absolute right-4"></span>
                  </div>

                  {/* Signal bar mockups */}
                  <div className="flex justify-between text-[7px] text-gray-500 font-bold px-3 pt-0.5 z-10 font-mono select-none">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span>📶</span>
                      <span>🔋</span>
                    </div>
                  </div>

                  {/* Inner Screen */}
                  <div className="relative h-full w-full rounded-[1.4rem] bg-[#0E0E0F] overflow-hidden flex flex-col mt-0.5 border border-white/5">
                    {/* Mock Browser URL tag */}
                    <div className="w-[90%] mx-auto mt-2 py-0.5 px-2 bg-white/5 rounded-md border border-white/5 text-[6px] text-zinc-500 font-mono flex items-center justify-between">
                      <span className="truncate">
                        🔒 mkt.{activeProjectName.toLowerCase().replace(/\s+/g, "")}.com
                      </span>
                      <span>↻</span>
                    </div>

                    {/* Dynamic Template Content */}
                    <div className="flex-1 flex flex-col p-2.5 space-y-2 mt-1 select-none text-left">
                      {activeProjectImage ? (
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-white/5 relative bg-zinc-900">
                          <img
                            src={activeProjectImage}
                            alt={activeProjectName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-[#111] to-[#FF5A1F]/20 border border-white/5 flex items-center justify-center">
                          <Target className="w-6 h-6 text-[#FF5A1F] opacity-40" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="px-1.5 py-0.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[5px] font-black uppercase text-[#FF5A1F] rounded">
                          {activeProjectNiche}
                        </span>
                        <h3 className="text-[9px] font-black text-white leading-tight uppercase tracking-tight block truncate mt-1">
                          {activeProjectName}
                        </h3>
                        <p className="text-[6px] text-zinc-400 font-medium leading-snug">
                          La estructura psicológica de alta conversión está lista. Generando ingresos pasivos...
                        </p>
                      </div>

                      {/* Simulated Landing elements */}
                      <div className="space-y-1 mt-auto pt-2">
                        <div className="h-1 bg-white/5 rounded-full w-[80%]"></div>
                        <div className="h-1 bg-white/5 rounded-full w-[60%]"></div>
                        <div className="w-full py-1 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] rounded text-white font-black text-[5px] text-center uppercase tracking-wider shadow-sm">
                          ¡EMPEZAR AHORA!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Checklist right side */}
              <div className="md:col-span-7 space-y-4 px-2">
                {/* Check 1 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-zinc-300">
                    <strong className="font-bold text-white">Análisis de Cliente Ideal (Avatar):</strong> Generado con precisión psicológica.
                  </p>
                </div>

                {/* Check 2 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-zinc-300">
                    <strong className="font-bold text-white">Guiones de Venta (Reels, TikTok, Shorts):</strong> Listos para grabar hoy mismo.
                  </p>
                </div>

                {/* Check 3 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-zinc-300">
                    <strong className="font-bold text-white">Estructura de Página de Captura:</strong> Diseñada, estructurada y optimizada.
                  </p>
                </div>

                {/* Warning Lock 1 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-[#FFBF00]" />
                  </div>
                  <p className="text-sm md:text-base text-zinc-400">
                    <strong className="font-bold text-white">Conexión de Dominio Personalizado:</strong> Pendiente de activación 👑
                  </p>
                </div>

                {/* Warning Lock 2 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-[#FFBF00]" />
                  </div>
                  <p className="text-sm md:text-base text-zinc-400">
                    <strong className="font-bold text-white">Activación de Embudos Automatizados:</strong> En pausa hasta upgrade 👑
                  </p>
                </div>

                {/* Warning Lock 3 */}
                <div className="flex items-start gap-3 text-left">
                  <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                    <Lock className="w-3 h-3 text-[#FFBF00]" />
                  </div>
                  <p className="text-sm md:text-base text-zinc-400">
                    <strong className="font-bold text-white">Publicación Directa en Hotmart:</strong> Bloqueado 👑
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (Explora y Desbloquea tu Máquina de Ventas) - 40% Width */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Bento de Navegación de la Estrategia (Acceso rápido a los cajones) */}
          <div className="bg-[#0B0B0B] border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-start">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF5A1F]" /> Revisa la Estrategia Generada
            </h3>
            <p className="text-zinc-400 text-sm mb-4 text-left">
              Tu IA ha diseñado cada uno de estos módulos exclusivamente para tu nicho. Haz clic para visualizar el contenido:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveDetailsDrawer("avatar")}
                className="p-3 bg-white/[0.02] border border-white/5 hover:border-[#FF5A1F]/30 rounded-xl text-left hover:bg-white/5 transition flex flex-col gap-1 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 mb-1">👤</div>
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Cliente Ideal</span>
                <span className="text-gray-500 text-[10px] truncate">Avatares y arquetipos</span>
              </button>
              <button
                onClick={() => setActiveDetailsDrawer("testimonials")}
                className="p-3 bg-white/[0.02] border border-white/5 hover:border-[#FF5A1F]/30 rounded-xl text-left hover:bg-white/5 transition flex flex-col gap-1 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 mb-1">💬</div>
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Testimonios</span>
                <span className="text-gray-500 text-[10px] truncate">Cierre persuasivo</span>
              </button>
              <button
                onClick={() => setActiveDetailsDrawer("hooks")}
                className="p-3 bg-white/[0.02] border border-white/5 hover:border-[#FF5A1F]/30 rounded-xl text-left hover:bg-white/5 transition flex flex-col gap-1 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FF5A1F]/10 flex items-center justify-center text-[#FF5A1F] mb-1">⚡</div>
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Hooks Virales</span>
                <span className="text-gray-500 text-[10px] truncate">Guiones listos</span>
              </button>
              <button
                onClick={() => setActiveDetailsDrawer("email")}
                className="p-3 bg-white/[0.02] border border-white/5 hover:border-[#FF5A1F]/30 rounded-xl text-left hover:bg-white/5 transition flex flex-col gap-1 text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-1">✉️</div>
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Email Seq</span>
                <span className="text-gray-500 text-[10px] truncate">Lote de bienvenida</span>
              </button>
            </div>
          </div>

          {/* Premium Glowing Plan Offer */}
          <div className="bg-[#0B0B0B] border-2 border-[#FFBF00]/30 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between shadow-[0_0_25px_rgba(255,191,0,0.06)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>
            
            <div className="space-y-6 text-left">
              <h4 className="text-base md:text-lg font-black text-[#FFBF00] tracking-tight uppercase leading-snug">
                EL 85% TE TRAERÁ NUEVAS VISITAS. PERO SOLO EL 100% TE CERRARÁ VENTAS.
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">👑</span>
                  <p className="text-sm text-zinc-300">
                    <strong className="text-white">3 Espacios de Negocio Activos:</strong> Mantén hasta 3 proyectos facturando de forma simultánea. Cancela, borra o crea nuevos sin costo extra.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">👑</span>
                  <p className="text-sm text-zinc-300">
                    <strong className="text-white">Contenido en Piloto Automático:</strong> Secuencias de email completas, listados de artículos SEO avanzados y plantillas probadas.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">👑</span>
                  <p className="text-sm text-zinc-300">
                    <strong className="text-white">Soporte Directo para Cierre:</strong> Un canal de WhatsApp directo con expertos listos para ayudarte a optimizar cada embudo.
                  </p>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF5A1F] to-transparent rounded-full shadow-[0_0_8px_rgba(255,90,31,0.6)] opacity-90 my-2"></div>

              <div className="text-center py-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">VALOR ESTIMADO: $1,497</p>
                <p className="text-white text-base font-normal">
                  Actualiza al Plan PRO por solo <span className="text-[#FFBF00] font-black">$39/mes</span>
                </p>
              </div>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(255,90,31,0.22)] hover:shadow-[0_0_30px_rgba(255,90,31,0.42)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>ACTIVAR EMBÚDOS PERSUASIVOS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation button at the bottom of the page */}
      <div className="flex justify-center mb-16 relative z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF5A1F]/30 text-white font-black text-sm tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF5A1F]/5"
        >
          Ir al Panel Principal
        </button>
      </div>

      {/* Sliding Drawer Side Panels (Render logic extracted from OnboardingWizard) */}
      <AnimatePresence>
        {activeDetailsDrawer && (
          <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveDetailsDrawer(null)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl h-full bg-[#111116] border-l border-white/5 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col z-10 overflow-hidden text-left"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#14141c]/80 backdrop-blur-md">
                <div className="text-left">
                  <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block mb-1">
                    {activeDetailsDrawer === "avatar" && "Conectar con tu cliente ideal"}
                    {activeDetailsDrawer === "testimonials" && "Derribar objeciones automáticamente"}
                    {activeDetailsDrawer === "hooks" && "Guion Persuasivo de Video"}
                    {activeDetailsDrawer === "email" && "Ventas sin presión técnica en piloto automático"}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                    {activeDetailsDrawer === "avatar" && "Avatares Psicológicos"}
                    {activeDetailsDrawer === "testimonials" && "Testimonios Persuasivos"}
                    {activeDetailsDrawer === "hooks" && "Detalles del Hook de Atracción"}
                    {activeDetailsDrawer === "email" && "Secuencia Inteligente de Email"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveDetailsDrawer(null)}
                  className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {activeDetailsDrawer === "avatar" && (() => {
                  const rawAvatars = strategyData?.avatars || [];
                  const defaultAvs = DEFAULT_STRATEGY.avatars;
                  const avsToRender = rawAvatars.length > 0 ? rawAvatars : defaultAvs;
                  
                  return (
                    <div className="space-y-8 text-left">
                      <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                        Estos son los arquetipos de cliente ideales generados de forma analítica para tu proyecto. Representan el 80% de tus ventas potenciales sugeridas.
                      </p>
                      {avsToRender.map((av: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden space-y-5"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.02] blur-3xl rounded-full"></div>
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl font-bold text-orange-400 shrink-0">
                              {idx % 2 === 0 ? "👩‍🎨" : "👩‍💼"}
                            </div>
                            <div>
                              <h4 className="text-xl font-extrabold text-white leading-tight font-sans text-left flex items-center flex-wrap gap-2">
                                {av.name || "Avatar Especialista"}
                                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none">
                                  {av.ageRange || av.age || "25-34 años"}
                                </span>
                              </h4>
                              <p className="text-xs md:text-sm text-orange-400 font-extrabold uppercase tracking-widest mt-1 text-left">
                                {av.archetype || "Comprador Ideal"}
                              </p>
                            </div>
                          </div>
                          {av.quote && (
                            <p className="text-base italic text-[#FFBF00] bg-white/5 p-5 rounded-2xl border border-white/5 leading-relaxed text-left font-sans">
                              "{av.quote}"
                            </p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                            <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                              <p className="font-extrabold text-rose-400 uppercase tracking-widest text-xs mb-2">Dolor Crítico</p>
                              <p className="text-sm text-zinc-200 leading-normal font-normal">{av.pain}</p>
                            </div>
                            <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                              <p className="font-extrabold text-emerald-400 uppercase tracking-widest text-xs mb-2">Transformación Deseada</p>
                              <p className="text-sm text-zinc-200 leading-normal font-normal">{av.desire}</p>
                            </div>
                            <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                              <p className="font-extrabold text-amber-400 uppercase tracking-widest text-xs mb-2">Barrera de Venta (Objeción)</p>
                              <p className="text-sm text-zinc-200 leading-normal font-normal">{av.salesBarrier}</p>
                            </div>
                            <div className="p-5 bg-[#FF5A1F]/5 rounded-2xl border border-[#FF5A1F]/10">
                              <p className="font-extrabold text-[#FF5A1F] uppercase tracking-widest text-xs mb-2">Para Qué Emocional</p>
                              <p className="text-sm text-zinc-200 leading-normal font-normal">{av.emotionalReason || av.emotional_reason}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {activeDetailsDrawer === "testimonials" && (() => {
                  const rawTestimonials = strategyData?.modules?.testimonials || DEFAULT_STRATEGY.modules.testimonials;
                  return (
                    <div className="space-y-6 text-left">
                      <p className="text-white text-base font-normal leading-relaxed">
                        Testimonios estructurados psicológicamente para derribar las principales objeciones de tus prospectos de forma indirecta.
                      </p>
                      {rawTestimonials.map((t: any, idx: number) => (
                        <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                          <p className="text-base italic text-[#FFBF00] font-sans">"{t.quote}"</p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FF5A1F]/10 flex items-center justify-center font-bold text-white text-sm">
                              {t.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{t.name}</p>
                              <p className="text-xs text-zinc-500">{t.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {activeDetailsDrawer === "hooks" && (() => {
                  const rawHooks = strategyData?.modules?.hooks || DEFAULT_STRATEGY.modules?.hooks || [];
                  const item = rawHooks[0] || {};
                  return (
                    <div className="space-y-6 text-left">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest block mb-1">Título del Video</span>
                          <h4 className="text-xl font-extrabold text-white">{item.title}</h4>
                        </div>
                        <div className="p-5 bg-white/[0.03] border-l-4 border-[#FF5A1F] rounded-r-2xl">
                          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Hook de entrada (Primeros 3 seg)</span>
                          <p className="text-sm md:text-base text-white font-medium leading-relaxed italic">"{item.hook}"</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Cuerpo explicativo</span>
                          <p className="text-sm md:text-base text-zinc-300 leading-relaxed">{item.body}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Llamado a la Acción (CTA)</span>
                          <p className="text-sm md:text-base text-emerald-400 font-bold">{item.cta}</p>
                        </div>
                        {item.hashtags && (
                          <div className="pt-2">
                            <span className="text-xs text-zinc-500 font-mono">{item.hashtags}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {activeDetailsDrawer === "email" && (() => {
                  const rawEmails = strategyData?.modules?.emails || DEFAULT_STRATEGY.modules.emails;
                  return (
                    <div className="space-y-6 text-left">
                      <p className="text-white text-base font-normal leading-relaxed">
                        Esta secuencia de nutrición inicial se disparará automáticamente al registrarse el usuario en tu landing page.
                      </p>
                      {rawEmails.map((email: any, idx: number) => (
                        <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                          <div className="border-b border-white/5 pb-3">
                            <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest block mb-1">Asunto del Correo</span>
                            <h4 className="text-base font-black text-white">{email.subject}</h4>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Mensaje</span>
                            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{email.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        user={user}
        currentPlan={user.planLimits?.planName || "Gratuito"}
        projectId={project?.id}
      />
    </div>
  );
};
