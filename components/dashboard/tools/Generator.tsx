
import React, { useState, useEffect } from 'react';
import { generateLandingPageContent } from '../../../services/geminiService';
import { api } from '../../../services/api'; 
import { GeneratedPageContent, LandingPage, ColorPalette, StructureType, DestinationConfig, DestinationType, Project, User } from '../../../types';
import { Sparkles, Loader2, LayoutTemplate, Palette, Target, Link as LinkIcon, MessageCircle, FileText, Briefcase, Plus, ArrowRight, ChevronRight, Info, AlertTriangle, X, CheckCircle, PenTool } from 'lucide-react';
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
  const [step, setStep] = useState(0); 
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  // Magic Flow States
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [finalPage, setFinalPage] = useState<LandingPage | null>(null);

  const progressMessages = [
    "Iniciando motor de Inteligencia Artificial",
    "Analizando estrategia del proyecto",
    "Redactando titulares magnéticos",
    "Diseñando bloques de miedos y objeciones",
    "Optimizando estructura para móviles",
    "Finalizando configuración de conversión"
  ];

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

  // Sequencer for messages
  useEffect(() => {
    let interval: any;
    if (loading && !generationComplete) {
      interval = setInterval(() => {
        setCurrentMsgIndex((prev) => (prev + 1) % progressMessages.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading, generationComplete]);

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
              destinationType: 'form' as DestinationType,
              destinationUrl: proj.affiliateLinks && proj.affiliateLinks.length > 0 ? proj.affiliateLinks[0].url : '',
          }));
      }
  };

  const goals = [
    'Captar Leads (Registro)',
    'Vender Producto/Servicio',
    'Agendar Citas / Consultoría',
    'Registro a Webinar / Clase',
    'Branding / Presencia',
    'Comunidad (WhatsApp/Telegram)'
  ];

  const handleGenerate = async () => {
    const finalNiche = formData.pageName; 
    if (!finalNiche) {
        setError('Por favor especifica el nombre del proyecto.');
        return;
    }

    setLoading(true);
    setGenerationProgress(0);
    setError('');

    // Animación de la barra de progreso
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 1;
      });
    }, 200);

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
          await new Promise(resolve => setTimeout(resolve, 5000));
          content = {
            palette: formData.palette,
            structure: formData.structure,
            destination: destinationConfig,
            targetAudience: formData.targetAudience,
            brandName: "Marca Demo",
            brandIcon: "Sparkles",
            topTagline: "🔥 Oferta Exclusiva",
            navCta: "Reservar Cupo",
            navLinks: [
                { label: "Beneficios", href: "#seccion-beneficios" },
                { label: "Instructor", href: "#seccion-instructor" }
            ],
            hero: {
                headline: `Domina el Éxito con <b>${formData.pageName}</b>`,
                subheadline: "Contenido de prueba generado con éxito.",
                ctaText: formData.destinationType === 'form' ? "Inscribirme Ahora" : "Contactar Asesor",
                heroImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200",
                videoTitle: "Tutorial del Sistema",
                videoDuration: "12 Minutos",
                spotsLeft: "¡Modo Demo Activo!",
                socialProofCount: "500+"
            },
            testimonials: [{ name: "Demo", text: "Excelente.", rating: 5 }],
            intro: { title: "Demo", description: "Demo", items: [] },
            benefits: { title: "Demo", items: [] },
            whatYouWillLearn: { title: "Demo", items: [] },
            faq: [],
            instructor: { name: "Mentor", bio: "Bio" },
            footer: { copyright: "©", contact: "mail" },
            thankYouMessage: "¡Éxito!",
            redirectUrl: "#"
          };
      } else {
          content = await generateLandingPageContent(
            finalNiche,
            formData.goal,
            formData.targetAudience,
            formData.destinationType === 'form' ? 'Registro' : formData.destinationType === 'whatsapp' ? 'Contacto Directo' : 'Venta Externa',
            formData.palette,
            formData.structure,
            destinationConfig,
            projectContext 
          );
      }

      const newPage: LandingPage = {
        id: Date.now().toString(),
        name: formData.pageName,
        niche: finalNiche,
        goal: formData.goal,
        isPublished: false,
        subdomain: `${formData.pageName.toLowerCase().replace(/\s+/g, '-')}.generatorlanding.com`,
        content: content,
        createdAt: new Date(),
        visits: 0,
        conversions: 0,
        projectId: selectedProject || undefined 
      };

      // Guardado real en API para obtener ID y slug final
      const savedPage = await api.createPage(newPage);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setFinalPage(savedPage);
      setGenerationComplete(true);
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      setError("Error al generar la página. Por favor intenta de nuevo.");
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

  return (
    <div className={`max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative ${onClose ? 'max-h-[90vh]' : ''}`}>
      
      {/* MODAL BLANCO DE GENERACIÓN MÁGICA */}
      {loading && (
        <div className="fixed inset-0 z-[300] bg-white animate-in fade-in duration-300 flex items-center justify-center p-6 overflow-hidden">
          {!generationComplete ? (
            <div className="max-w-xl w-full text-center space-y-12">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full border-4 border-gray-100 flex items-center justify-center mx-auto">
                   <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Generando tu Ecosistema</h2>
                <div className="h-8 relative">
                   <p className="text-primary font-bold text-lg animate-in slide-in-from-bottom-2 duration-500 absolute inset-0 text-center">
                      {progressMessages[currentMsgIndex]}
                   </p>
                </div>
              </div>

              <div className="space-y-3">
                 <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-[#8b5cf6] transition-all duration-300 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                 </div>
                 <p className="text-gray-400 font-bold text-sm tracking-widest">{generationProgress}% completado</p>
              </div>
            </div>
          ) : (
            <div className="max-w-xl w-full text-center space-y-10 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200 scale-110">
                  <CheckCircle className="w-14 h-14 text-white" />
               </div>
               
               <div className="space-y-4">
                 <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">¡Perfecto!</h2>
                 <p className="text-gray-500 text-xl font-medium">Tu página ha sido diseñada con éxito.</p>
               </div>

               <div className="grid grid-cols-1 gap-4 pt-6">
                  <button 
                    onClick={() => {
                      const baseSlug = finalPage?.subdomain.split('.')[0];
                      window.open(`/admin/lp/${baseSlug}`, '_blank');
                    }}
                    className="w-full py-5 bg-gray-900 hover:bg-black text-white font-black text-lg rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                     Ver mi Página <ArrowRight className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => {
                      setLoading(false);
                      onPageGenerated(finalPage!);
                    }}
                    className="w-full py-5 bg-primary hover:bg-secondary text-white font-black text-lg rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                     Editar con Pro Editor <PenTool className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => {
                        setLoading(false);
                    }}
                    className="text-gray-400 font-bold hover:text-gray-600 transition pt-4"
                  >
                    Volver al Panel
                  </button>
               </div>
            </div>
          )}
        </div>
      )}

      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => onClose ? onClose() : navigate('/dashboard/pages')} 
          reason={`Has alcanzado el límite de ${user.planLimits?.maxLandings} páginas de tu plan ${user.planLimits?.planName}.`}
      />

      {/* VISTA DE PÁGINA LISTA (PERSISTENCIA TRAS GENERAR) */}
      {generationComplete && !loading ? (
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/20">
                <CheckCircle className="w-10 h-10" />
             </div>
             <h2 className="text-4xl font-black text-white mb-4 italic uppercase">Página Lista para Lanzar</h2>
             <p className="text-gray-400 text-lg max-w-md mb-12">Ya puedes visualizar tu nueva landing page o entrar al editor para realizar ajustes finos.</p>
             
             <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <button 
                   onClick={() => window.open(`/admin/lp/${finalPage?.subdomain.split('.')[0]}`, '_blank')}
                   className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition"
                >
                   <ArrowRight className="w-4 h-4" /> Ver Online
                </button>
                <button 
                   onClick={() => onPageGenerated(finalPage!)}
                   className="flex-1 py-4 bg-primary hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-lg"
                >
                   <PenTool className="w-4 h-4" /> Abrir Editor Pro
                </button>
             </div>
             <button 
                onClick={() => {
                    setGenerationComplete(false);
                    setStep(0);
                }}
                className="mt-12 text-gray-500 font-bold hover:text-white transition uppercase text-[10px] tracking-[0.3em]"
             >
                Generar otra página
             </button>
          </div>
      ) : (
          <>
            <div className={`bg-primary/10 p-8 text-center border-b border-primary/10 relative ${showUpgradeModal || loading ? 'opacity-30 pointer-events-none' : ''}`}>
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

            <div className={`p-8 flex-1 overflow-y-auto ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
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
                    
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed">
                        <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" /> Proyecto Seleccionado
                        </label>
                        <div className="flex items-center justify-between bg-black border border-[#FF5A1F]/30 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
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
                <div className="space-y-8 text-gray-200 animate-in fade-in slide-in-from-right-4 duration-300">
                    
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
                        className="flex-1 py-4 bg-primary hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" /> Generar tu Página de Captura
                    </button>
                    </div>
                </div>
                )}
            </div>
          </>
      )}
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
