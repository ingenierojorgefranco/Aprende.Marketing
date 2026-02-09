import React, { useState, useEffect } from 'react';
import { generateLandingPageContent } from '../../../services/geminiService';
import { api } from '../../../services/api'; 
import { GeneratedPageContent, LandingPage, ColorPalette, StructureType, DestinationConfig, DestinationType, Project, User } from '../../../types';
import { Sparkles, Loader2, LayoutTemplate, Palette, Target, Link as LinkIcon, MessageCircle, FileText, Briefcase, Plus, ArrowRight, ChevronRight, Info, AlertTriangle, X, CheckCircle, ExternalLink, PenTool, Wand2 } from 'lucide-react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import { UpgradeModal } from '../UpgradeModal';

interface GeneratorProps {
  onPageGenerated: (page: LandingPage) => void;
  embeddedProjectId?: string;
  onClose?: () => void;
}

interface DashboardContext {
  user: User;
  pageCount: number; // Provided by Layout
  isSimulating: boolean; 
}

export const Generator: React.FC<GeneratorProps> = ({ onPageGenerated, embeddedProjectId, onClose }) => {
  const { user, pageCount, isSimulating } = useOutletContext() as DashboardContext; 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedProjectId = embeddedProjectId || searchParams.get('projectId');

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: Select Project, 1: Info, 2: Structure/Design
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  // --- ESTADOS DE GENERACIÓN ---
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [generatedPageResult, setGeneratedPageResult] = useState<LandingPage | null>(null);
  // -----------------------------

  // Limit Check
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [formData, setFormData] = useState({
    goal: 'Captar Leads',
    targetAudience: '',
    pageName: '',
    destinationType: 'form' as DestinationType,
    destinationUrl: '',
    whatsappPhone: '',
    whatsappMessage: 'Hola, quiero más información sobre...',
    palette: 'modern-blue' as ColorPalette,
    structure: 'classic-sales' as StructureType
  });
  const [error, setError] = useState('');

  // Load projects & check limits
  useEffect(() => {
    const isRealAdmin = user.role === 'admin' && !isSimulating;
    if (user.planLimits && !isRealAdmin) {
        const max = user.planLimits.maxLandings;
        if (pageCount >= max) {
            setShowUpgradeModal(true);
        }
    }

    const fetchProjects = async () => {
        try {
            const projects = await api.getProjects();
            setUserProjects(projects);
        } catch (e) {
            console.error("Failed to load projects", e);
        }
    };
    fetchProjects();
  }, [user, pageCount, isSimulating]);

  // Sync pre-selected project from URL or Props
  useEffect(() => {
    if (preSelectedProjectId && userProjects.length > 0) {
      handleProjectSelect(preSelectedProjectId);
      setFormData(prev => ({ ...prev, goal: 'Registro a Webinar / Clase' }));
      setStep(1);
    }
  }, [preSelectedProjectId, userProjects]);

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
      setSelectedProject(projectId);
      const proj = userProjects.find(p => p.id === projectId);
      
      if (proj) {
          let audienceInfo = proj.targetAudience || '';
          
          if (proj.strategy_json) {
              const s = proj.strategy_json;
              if (s.avatars && Array.isArray(s.avatars) && s.avatars.length > 0) {
                  const main = s.avatars[0];
                  audienceInfo = `${main.archetype}. Su principal dolor es: ${main.pain}. Su gran deseo: ${main.desire}`;
              } 
              else if (s.avatar && s.avatar.story) {
                  audienceInfo = s.avatar.story;
              }
          }

          setFormData(prev => ({
              ...prev,
              pageName: proj.productName || proj.name, 
              targetAudience: audienceInfo,
              destinationType: proj.affiliateLinks && proj.affiliateLinks.length > 0 ? 'external_url' : 'form',
              destinationUrl: proj.affiliateLinks && proj.affiliateLinks.length > 0 ? proj.affiliateLinks[0].url : '',
          }));
      }
  };

  const handleGenerate = async () => {
    setGenerationStatus('generating');
    setLoading(true);
    setError('');
    setProgress(0);

    const messages = [
        "Analizando nicho estratégico...",
        "Redactando encabezados hipnóticos...",
        "Estructurando bloques de persuasión...",
        "Optimizando para dispositivos móviles...",
        "Sincronizando con Hotmart®...",
        "Finalizando arquitectura SEO..."
    ];

    // Lógica de simulación de progreso lineal de 7 segundos (70ms * 100)
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        if (currentProgress < 100) {
            currentProgress += 1;
            setProgress(currentProgress);
            
            const msgIdx = Math.min(Math.floor((currentProgress / 100) * messages.length), messages.length - 1);
            setLoadingMessage(messages[msgIdx]);
        } else {
            clearInterval(progressInterval);
        }
    }, 70);

    const destinationConfig: DestinationConfig = {
        type: formData.destinationType,
        url: formData.destinationUrl,
        whatsappPhone: formData.whatsappPhone,
        whatsappMessage: formData.whatsappMessage
    };

    const projectContext = userProjects.find(p => p.id === selectedProject);

    try {
      let content: GeneratedPageContent;

      if (api.isUsingMockData()) {
          // Local/Mock
          await new Promise(resolve => setTimeout(resolve, 2000));
          content = {
              palette: formData.palette,
              structure: formData.structure,
              destination: destinationConfig,
              targetAudience: formData.targetAudience,
              brandName: formData.pageName,
              brandIcon: "Sparkles",
              topTagline: "🔥 Oferta Exclusiva de Lanzamiento",
              navCta: "Reservar Cupo",
              testimonialTitle: "Ellas ya cambiaron su historia:",
              hero: {
                  headline: `Domina <b>${formData.pageName}</b> con Inteligencia Artificial`,
                  subheadline: "Descubre el método exacto para escalar tus ventas y automatizar tu negocio en tiempo récord sin complicaciones técnicas.",
                  ctaText: "¡Sí! Quiero Empezar Ahora",
                  socialProofCount: "2,450+",
                  spotsLeft: "¡Solo quedan 5 cupos!"
              },
              testimonials: [
                  { name: "Carla M.", location: "Madrid, ES", text: "Excelente herramienta, me ahorró semanas de trabajo en el diseño.", rating: 5 },
                  { name: "Lucía F.", location: "CDMX, MX", text: "El copy generado es increíblemente persuasivo, mis ventas subieron un 30%.", rating: 5 },
                  { name: "Andrés G.", location: "Bogotá, CO", text: "Ya recuperé mi inversión con la primera landing que publiqué.", rating: 5 }
              ],
              intro: {
                  title: `¿Qué es ${formData.pageName}?`,
                  description: `Es un sistema integral diseñado para emprendedores que buscan dominar el mercado de ${formData.pageName} utilizando el poder de la automatización estratégica.`,
                  items: [
                      { title: "Escalabilidad Global", description: "Llega a miles de clientes en todo el mundo sin límites." },
                      { title: "Automatización Total", description: "Vende tus productos incluso mientras duermes." },
                      { title: "Copywriting Ganador", description: "Textos diseñados para conectar emocionalmente." }
                  ]
              },
              benefits: {
                  title: "Tu Arsenal para el Éxito",
                  subtitle: "Todo lo que necesitas para construir un imperio digital rentable.",
                  items: [
                      { title: "Acceso de por vida", description: "Estudia a tu propio ritmo sin presiones.", icon: "Zap", color: "blue" },
                      { title: "Certificado Oficial", description: "Avalamos tus conocimientos profesionalmente.", icon: "Award", color: "purple" },
                      { title: "Soporte VIP 24/7", description: "Nunca estarás solo en tu proceso de crecimiento.", icon: "MessageCircle", color: "green" },
                      { title: "Plantillas Listas", description: "Solo copia y pega estructuras que ya facturan.", icon: "LayoutTemplate", color: "orange" },
                      { title: "IA de Vanguardia", description: "Usa la tecnología más avanzada a tu favor.", icon: "Sparkles", color: "indigo" },
                      { title: "Comunidad Privada", description: "Haz networking con otros emprendedores exitosos.", icon: "Users", color: "pink" }
                  ]
              },
              whatYouWillLearn: {
                  title: "¿Te sientes identificada con alguna de estas situaciones?",
                  icon: "AlertTriangle",
                  items: [
                      "Trabajas jornadas agotadoras pero tus ingresos no aumentan.",
                      "Te sientes perdida entre tantas herramientas técnicas complejas.",
                      "No sabes cómo captar leads cualificados de forma constante.",
                      "Tus páginas actuales reciben visitas pero nadie compra.",
                      "Dependes de una sola fuente de ingresos y buscas seguridad.",
                      "Sientes que la competencia te está dejando atrás."
                  ]
              },
              faq: [
                  { question: "¿Necesito conocimientos técnicos?", answer: "No, el sistema está diseñado para principiantes." },
                  { question: "¿Cómo recibo el acceso?", answer: "Inmediatamente después de tu registro por correo electrónico." },
                  { question: "¿Funciona en móviles?", answer: "Sí, todas las páginas están 100% optimizadas para celulares." },
                  { question: "¿Hay garantía?", answer: "Tienes 7 días de garantía total de satisfacción." }
              ],
              instructor: { 
                  name: "Mentor Estratégico", 
                  bio: "Experto en lanzamientos digitales con más de $1M facturados en la industria de infoproductos.",
                  badgeText: "Top Rated",
                  badgeSubtext: "IA Expert 2025",
                  statsStudents: "+10k Alumnos",
                  statsRating: "4.9/5"
              },
              footer: { 
                  copyright: `© ${new Date().getFullYear()} ${formData.pageName}. Todos los derechos reservados.`, 
                  contact: "soporte@sistema-ia.com" 
              },
              thankYouMessage: "¡Felicidades! Tu acceso ha sido generado correctamente.",
              redirectUrl: "https://aprende.marketing",
              thankYouPage: {
                  showSocials: true,
                  ctaLink: "https://chat.whatsapp.com/demo",
                  progressBarText: "¡ESPERA! SÓLO TE FALTA UN ÚLTIMO PASO...",
                  greenBadgeText: "RECIBE TU REGALO 100% GRATIS",
                  headline: "¡REGISTRO EXITOSO! YA TIENES TU LUGAR ASEGURADO",
                  subheadline: "Sigue los pasos a continuación para acceder al material exclusivo y unirte a la comunidad.",
                  step1Title: "Revisa tu Bandeja de Entrada",
                  step1Desc: "Hemos enviado el enlace de acceso y tus bonos a tu correo electrónico.",
                  step1Warning: "Nota: Si no lo ves, revisa tu carpeta de Correo No Deseado (SPAM).",
                  step1Subject: "Asunto: [ACCESO] Tu material de entrenamiento está listo",
                  step2Title: "Únete a la Comunidad VIP",
                  step2Desc: "Accede a nuestro grupo de WhatsApp para recibir mentoría en vivo y soporte prioritario.",
                  step2Badge: "¡ACCIÓN REQUERIDA!",
                  step2BonusTitle: "Manual de Implementación Rápida",
                  step2BonusValue: "Valor $27 USD - GRATIS",
                  offerTopTitle: "SÓLO PARA NUEVOS MIEMBROS",
                  offerHeadline: "Descarga: \"El Mapa Maestro para Escalar Ventas con IA\"",
                  offerDescription: "En esta guía te revelamos los 7 pasos exactos para automatizar tu facturación.",
                  bookTitle: "Mapa Maestro",
                  bookSubtitle: "SISTEMA IA 2025",
                  bookFooter: "RECURSO EXCLUSIVO",
                  offerPriceRegular: "$27.00",
                  offerPriceFree: "GRATIS",
                  offerBadge: "OFERTA DE BIENVENIDA",
                  offerBullets: ["Estrategias probadas", "Gatillos mentales", "Scripts listos"],
                  ctaButtonText: "UNIRME Y DESCARGAR REGALO",
                  learningTitle: "Lo que vas a lograr",
                  learningSubtitle: "Dominarás las herramientas que están cambiando el juego.",
                  learningItems: [{ title: "Fase 1", description: "Configuración inicial" }, { title: "Fase 2", description: "Escalamiento" }],
                  socialTitle: "Comunidad Unida",
                  socialSubtitle: "Personas reales logrando resultados extraordinarios.",
                  socialCountText: "+5,000 Miembros",
                  socialItems: [{ name: "Ana P.", location: "CDMX", text: "Excelente soporte." }],
                  faqTitle: "¿Tienes dudas?",
                  faqItems: [{ question: "¿Es gratis?", answer: "Sí, por tiempo limitado." }]
              }
          };
      } else {
          // Producción: Gemini Real
          content = await generateLandingPageContent(
            formData.pageName,
            formData.goal,
            formData.targetAudience,
            formData.destinationType === 'form' ? 'Registro' : formData.destinationType === 'whatsapp' ? 'Contacto Directo' : 'Venta Externa',
            formData.palette,
            formData.structure,
            destinationConfig,
            projectContext 
          );
      }

      const slugify = (text: string) => text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');

      const newPage: LandingPage = {
        id: Date.now().toString(),
        name: formData.pageName,
        niche: formData.pageName,
        goal: formData.goal,
        isPublished: true, // Se genera PUBLICADA directamente
        subdomain: `${slugify(formData.pageName)}.generatorlanding.com`,
        content: content,
        createdAt: new Date(),
        visits: 0,
        conversions: 0,
        projectId: selectedProject || undefined 
      };

      // Guardado automático en el servidor antes de mostrar el éxito para obtener el ID real
      const savedPage = await api.createPage(newPage);

      // Esperamos a que la barra de progreso llegue al 100%
      while (currentProgress < 100) {
          await new Promise(r => setTimeout(r, 50));
      }
      
      setGeneratedPageResult(savedPage);
      setGenerationStatus('success');

    } catch (err) {
      console.error(err);
      clearInterval(progressInterval);
      setError("Error al generar la página. Por favor intenta de nuevo.");
      setGenerationStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (!formData.goal || !formData.pageName) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (formData.destinationType === 'whatsapp' && !formData.whatsappPhone) {
        setError('Por favor ingresa el número de WhatsApp.');
        return;
    }
    if (formData.destinationType === 'external_url' && !formData.destinationUrl) {
        setError('Por favor ingresa la URL de destino.');
        return;
    }

    setError('');
    setStep(2);
  };

  const palettes: { id: ColorPalette; name: string; colors: string }[] = [
    { id: 'modern-blue', name: 'Azul Tech', colors: 'bg-blue-500' },
    { id: 'elegant-purple', name: 'Púrpura', colors: 'bg-purple-600' },
    { id: 'energetic-orange', name: 'Naranja', colors: 'bg-orange-500' },
    { id: 'nature-green', name: 'Naturaleza', colors: 'bg-green-500' },
    { id: 'dark-luxury', name: 'Lujo Dark', colors: 'bg-gray-800' },
    { id: 'ocean-teal', name: 'Océano', colors: 'bg-teal-400' },
    { id: 'crimson-red', name: 'Carmesí', colors: 'bg-red-600' },
    { id: 'corporate-slate', name: 'Corporativo', colors: 'bg-slate-500' },
    { id: 'gold-prestige', name: 'Prestigio', colors: 'bg-yellow-600' },
    { id: 'minimal-mono', name: 'Monocromo', colors: 'bg-white border border-gray-400' },
  ];

  const structures: { id: StructureType; name: string; desc: string; wireframe: React.ReactNode }[] = [
    { 
      id: 'classic-sales', 
      name: 'Carta de Ventas Clásica', 
      desc: 'Estructura larga, completa y persuasiva.',
      wireframe: (
        <div className="w-full h-24 bg-gray-800 rounded border border-gray-700 flex flex-col gap-1 p-1 overflow-hidden opacity-70">
           <div className="w-full h-2 bg-gray-600 rounded-sm"></div>
           <div className="w-2/3 h-2 bg-gray-600 rounded-sm mb-1"></div>
           <div className="w-full flex-1 bg-gray-700 rounded-sm flex items-center justify-center text-[6px] text-gray-400">HERO + IMG</div>
           <div className="flex gap-1 h-6">
              <div className="flex-1 bg-gray-600 rounded-sm"></div>
              <div className="flex-1 bg-gray-600 rounded-sm"></div>
           </div>
        </div>
      )
    },
    { 
      id: 'vsl-focused', 
      name: 'Video Sales Letter (VSL)', 
      desc: 'Foco en video explicativo + contenido detallado abajo.',
      wireframe: (
        <div className="w-full h-24 bg-gray-800 rounded border border-gray-700 flex flex-col gap-1 p-1 overflow-hidden opacity-70">
           <div className="w-3/4 mx-auto h-2 bg-gray-600 rounded-sm mb-1"></div>
           <div className="w-full h-12 bg-red-900/40 border border-red-900 rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
           </div>
           <div className="w-1/2 mx-auto h-3 bg-primary rounded-sm mt-1"></div>
        </div>
      )
    },
    { 
      id: 'webinar-funnel', 
      name: 'Registro a Webinar', 
      desc: 'Diseño a 2 columnas para alta conversión.',
      wireframe: (
        <div className="w-full h-24 bg-gray-800 rounded border border-gray-700 flex gap-1 p-1 overflow-hidden opacity-70">
           <div className="w-1/2 flex flex-col gap-1"><div className="w-full h-2 bg-gray-600 rounded-sm"></div><div className="w-full h-2 bg-gray-600 rounded-sm"></div><div className="w-3/4 h-1 bg-gray-700 rounded-sm"></div></div>
           <div className="w-1/2 bg-gray-700 rounded-sm flex flex-col items-center justify-center gap-1"><div className="w-3/4 h-1 bg-gray-500 rounded-sm"></div><div className="w-3/4 h-2 bg-primary rounded-sm"></div></div>
        </div>
      )
    },
    { 
      id: 'minimal-capture', 
      name: 'Captura Minimalista', 
      desc: 'Hero centrado y limpio + Contenido abajo.',
      wireframe: (
        <div className="w-full h-24 bg-gray-800 rounded border border-gray-700 flex flex-col items-center justify-center gap-1 p-1 overflow-hidden opacity-70">
           <div className="w-3/4 h-2 bg-gray-600 rounded-sm mb-1"></div>
           <div className="w-2/3 h-6 bg-gray-700 rounded-sm border border-dashed border-gray-600 flex items-center justify-center">
              <div className="w-1/2 h-2 bg-primary rounded-sm"></div>
           </div>
        </div>
      )
    }
  ];

  const goals = [
    'Captar Leads (Registro)',
    'Vender Producto/Servicio',
    'Agendar Citas / Consultoría',
    'Registro a Webinar / Clase',
    'Branding / Presencia',
    'Comunidad (WhatsApp/Telegram)'
  ];

  return (
    <div className={`max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative ${onClose ? 'max-h-[90vh]' : ''}`}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          animation: confetti-fall 3s linear forwards;
          top: -10px;
          z-index: 50;
        }
        @keyframes loading-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .progress-shine {
          position: absolute; top: 0; left: 0; height: 100%; width: 50%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: loading-shine 1.5s infinite; }
      `}</style>

      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => onClose ? onClose() : navigate('/dashboard/pages')} 
          reason={`Has alcanzado el límite de ${user.planLimits?.maxLandings} páginas de tu plan ${user.planLimits?.planName}.`}
      />

      <div className={`bg-primary/10 p-8 text-center border-b border-primary/10 relative ${(showUpgradeModal || (loading && generationStatus !== 'generating')) ? 'opacity-30 pointer-events-none' : ''}`}>
        {onClose && (
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
            </button>
        )}
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Generador de Landing Pages IA</h2>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 0 ? 'bg-primary text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>0. Proyecto</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 1 ? 'bg-primary text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>1. Configuración</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 2 ? 'bg-primary text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>2. Estructura y Diseño</span>
        </div>
      </div>

      <div id="generator-main-scroll-container" className={`p-8 flex-1 overflow-y-auto relative transition-colors duration-500 ${generationStatus === 'generating' ? 'bg-white' : ''} ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
        
        {/* --- UI DE GENERACIÓN (LOADING STATE) --- */}
        {generationStatus === 'generating' && (
            <div className="h-full flex flex-col items-center justify-center py-20 space-y-12 animate-in fade-in duration-500">
                <div className="relative mb-4">
                    <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center animate-pulse border border-emerald-100">
                        <Wand2 className="w-12 h-12 text-emerald-600" />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic">Generando tu Página de Captura</h3>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{loadingMessage}</p>
                </div>

                <div className="w-full max-w-md space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                        <span>Inteligencia Estratégica</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner relative">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-300 ease-out shadow-lg relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="progress-shine"></div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- UI DE ÉXITO --- */}
        {generationStatus === 'success' && generatedPageResult && (
            <div className="h-full flex flex-col items-center justify-center py-10 space-y-8 animate-in zoom-in-95 duration-700 relative overflow-hidden">
                {/* Confetti simulation */}
                {[...Array(30)].map((_, i) => (
                    <div 
                        key={i} 
                        className="confetti" 
                        style={{
                            left: `${Math.random() * 100}%`,
                            backgroundColor: ['#10B981', '#34D399', '#4C1D95', '#F59E0B', '#10B981'][Math.floor(Math.random() * 5)],
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}

                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-4 scale-110 animate-bounce">
                    <CheckCircle className="w-14 h-14 text-white" />
                </div>

                <div className="text-center max-w-xl space-y-4">
                    <h3 className="text-4xl font-black text-white leading-tight">¡Tu Página de Captura ha sido generada correctamente!</h3>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">
                        Tu nuevo activo digital está optimizado para convertir visitas en leads de alta calidad de forma automática.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-6">
                    <a 
                        href={`/admin/lp/${generatedPageResult.subdomain.split('.')[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-white text-black font-black py-4 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 hover:bg-gray-100 transform hover:scale-[1.03] active:scale-95"
                    >
                        <ExternalLink className="w-5 h-5" /> Ver Página
                    </a>
                    <a 
                        href={window.location.hash.startsWith('#/') ? `#/dashboard/editor/${generatedPageResult.id}` : `/dashboard/editor/${generatedPageResult.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#FF5A1F] text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 hover:bg-[#D94A1E] transform hover:scale-[1.03] active:scale-95"
                    >
                        <PenTool className="w-5 h-5" /> Editar Página
                    </a>
                </div>

                <button 
                    onClick={() => {
                        setGenerationStatus('idle');
                        if(onClose) onClose();
                        else navigate('/dashboard/pages');
                    }}
                    className="text-gray-500 hover:text-white font-bold text-sm transition-colors pt-4 underline"
                >
                    Cerrar
                </button>
            </div>
        )}

        {/* --- PASOS ORIGINALES (MODO IDLE) --- */}
        {generationStatus === 'idle' && (
            <>
                {error && (
                <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-6 text-sm">
                    {error}
                </div>
                )}

                {step === 0 && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">
                                Selecciona tu Proyecto
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                            Para generar una página que verdaderamente venda, nuestra inteligencia artificial necesita conocer tu estrategia, avatar y producto. Selecciona un proyecto para crear tu página.
                        </p>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {userProjects.length > 0 ? (
                            userProjects.map((project) => (
                                <div 
                                    key={project.id}
                                    className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors shadow-inner">
                                            <Briefcase className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors truncate">{project.name}</h4>
                                            <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 mb-10">
                                        <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p>
                                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                            {project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción.")}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            handleProjectSelect(project.id);
                                            setStep(1);
                                        }}
                                        className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                    >
                                        Seleccionar <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[3rem] text-center w-full">
                                <p className="text-gray-500 mb-6 font-medium">Aún no tienes proyectos creados con estrategia.</p>
                                <button 
                                    onClick={() => navigate('/dashboard/projects/create')}
                                    className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20"
                                >
                                    Crear mi primer proyecto
                                </button>
                            </div>
                        )}
                        
                        {userProjects.length > 0 && (
                            <button 
                                onClick={() => navigate('/dashboard/projects/create')}
                                className="p-10 bg-transparent border-2 border-dashed border-gray-800 rounded-[3rem] hover:border-gray-600 hover:text-white transition-all text-gray-500 group flex flex-col items-center justify-center gap-6 shadow-2xl min-h-[400px]"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center shadow-lg group-hover:bg-gray-700 transition-colors">
                                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-white" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl font-black uppercase tracking-widest">Crear un nuevo proyecto</h4>
                                    <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-60">Define un nuevo nicho o producto</p>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
                )}

                {step === 1 && (
                <div className="space-y-6 text-gray-200 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    {/* PROJECT SELECTOR STRATEGY */}
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed">
                        <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" /> Proyecto Seleccionado
                        </label>
                        <div className="flex items-center justify-between bg-black border border-[#FF5A1F]/30 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 text-emerald-500"><CheckCircle className="w-full h-full"/></div>
                                <span className="text-white font-bold">{userProjects.find(p => p.id === selectedProject)?.name || 'Proyecto'}</span>
                            </div>
                            {!embeddedProjectId && (
                                <button 
                                    onClick={() => setStep(0)}
                                    className="text-xs text-gray-500 hover:text-white underline transition"
                                >
                                    Cambiar Proyecto
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nombre del Sitio / Página</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-white"
                        placeholder="ej. Masterclass de Cripto"
                        value={formData.pageName}
                        onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                    />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Objetivo Principal</label>
                        <select
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-white"
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        >
                            {goals.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Detalles de la Audiencia (Opcional)</label>
                    <textarea
                        className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition h-24 text-white resize-none"
                        placeholder="Describe a quién le estás vendiendo para mejorar el copy..."
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    />
                    </div>

                    {/* Destination Configuration */}
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-800">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" /> Configuración del Llamado a la Acción (CTA)
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">¿Qué debe pasar cuando el usuario hace clic en el botón principal?</p>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                            <button 
                                onClick={() => setFormData({...formData, destinationType: 'form'})}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${formData.destinationType === 'form' ? 'bg-primary text-white border-primary' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                            >
                                <FileText className="w-4 h-4" /> Formulario / Registro
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, destinationType: 'whatsapp'})}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${formData.destinationType === 'whatsapp' ? 'bg-green-600 text-white border-green-600' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                            >
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, destinationType: 'external_url'})}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${formData.destinationType === 'external_url' ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                            >
                                <LinkIcon className="w-4 h-4" /> Página Externa
                            </button>
                        </div>

                        {/* Dynamic Inputs based on Destination */}
                        {formData.destinationType === 'whatsapp' && (
                            <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Número de WhatsApp (con código país)</label>
                                    <input 
                                        type="text" 
                                        placeholder="+57 300 123 4567" 
                                        className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:border-green-500 outline-none"
                                        value={formData.whatsappPhone}
                                        onChange={(e) => setFormData({...formData, whatsappPhone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Mensaje Predeterminado</label>
                                    <input 
                                        type="text" 
                                        placeholder="Hola, quiero información..." 
                                        className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:border-green-500 outline-none"
                                        value={formData.whatsappMessage}
                                        onChange={(e) => setFormData({...formData, whatsappMessage: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        {formData.destinationType === 'external_url' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs text-gray-400 mb-1">URL de Destino (Checkout, Carta de Ventas, etc)</label>
                                <input 
                                    type="text" 
                                    placeholder="https://mi-producto.com/oferta" 
                                    className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:border-purple-500 outline-none"
                                    value={formData.destinationUrl}
                                    onChange={(e) => setFormData({...formData, destinationUrl: e.target.value})}
                                />
                                {userProjects.find(p => p.id === selectedProject)?.affiliateLinks && (
                                    <div className="mt-2 text-xs">
                                        <span className="text-gray-400 mr-2">Sugerencias del proyecto:</span>
                                        {userProjects.find(p => p.id === selectedProject)?.affiliateLinks.map((link, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setFormData({...formData, destinationUrl: link.url})}
                                                className="text-blue-400 hover:underline mr-3"
                                            >
                                                {link.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {formData.destinationType === 'form' && (
                            <div className="text-sm text-gray-500 italic animate-in fade-in slide-in-from-top-2">
                                * Se generará automáticamente un formulario de captura (Nombre y Email) conectado al CRM.
                            </div>
                        )}
                    </div>

                    <button
                    onClick={nextStep}
                    className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition mt-4 flex items-center justify-center gap-2"
                    >
                    Siguiente: Diseño <LayoutTemplate className="w-5 h-5" />
                    </button>
                </div>
                )}

                {step === 2 && (
                <div id="generator-step-2-wrapper" className="space-y-8 text-gray-200 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    {/* Structure Selection */}
                    <div>
                        <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-primary" /> Selecciona la Estructura
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {structures.map(s => (
                            <div 
                                key={s.id}
                                onClick={() => setFormData({...formData, structure: s.id})}
                                className={`cursor-pointer rounded-xl border p-4 transition-all hover:scale-105 ${
                                    formData.structure === s.id 
                                    ? 'bg-gray-800 border-primary ring-1 ring-primary shadow-lg shadow-primary/20' 
                                    : 'bg-black border-gray-800 hover:border-gray-600'
                                }`}
                            >
                                <div className="mb-3 pointer-events-none">
                                    {s.wireframe}
                                </div>
                                <h3 className={`font-bold text-sm mb-1 ${formData.structure === s.id ? 'text-primary' : 'text-white'}`}>{s.name}</h3>
                                <p className="text-xs text-gray-500 leading-snug">{s.desc}</p>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Palette Selection */}
                    <div>
                        <label className="block text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" /> Selecciona los Colores
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {palettes.map(p => (
                            <div 
                            key={p.id}
                            onClick={() => setFormData({...formData, palette: p.id})}
                            className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition ${formData.palette === p.id ? 'border-primary bg-primary/10' : 'border-gray-800 hover:bg-gray-800 bg-black'}`}
                            >
                                <div className={`w-8 h-8 rounded-full shadow-sm ${p.colors}`}></div>
                                <span className="text-xs text-center">{p.name}</span>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => setStep(1)}
                        className="px-6 py-4 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-xl font-bold transition"
                    >
                        Atrás
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex-1 py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Generando Estructura...
                        </>
                        ) : (
                        <>
                            <Sparkles className="w-5 h-5" /> Generar Landing Page
                        </>
                        )}
                    </button>
                    </div>
                </div>
                )}
            </>
        )}

      </div>
    </div>
  );
};
