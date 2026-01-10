import React, { useState, useEffect } from 'react';
import { generateLandingPageContent } from '../../../services/geminiService';
import { api } from '../../../services/api'; 
import { GeneratedPageContent, LandingPage, ColorPalette, StructureType, DestinationConfig, DestinationType, Project, User } from '../../../types';
import { Sparkles, Loader2, LayoutTemplate, Palette, Target, Link as LinkIcon, MessageCircle, FileText, Briefcase, Plus, ArrowRight, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import { UpgradeModal } from '../UpgradeModal';

interface GeneratorProps {
  onPageGenerated: (page: LandingPage) => void;
}

interface DashboardContext {
  user: User;
  pageCount: number; // Provided by Layout
  isSimulating: boolean; 
}

export const Generator: React.FC<GeneratorProps> = ({ onPageGenerated }) => {
  const { user, pageCount, isSimulating } = useOutletContext() as DashboardContext; 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedProjectId = searchParams.get('projectId');

  const [loading, setLoading] = useState(false);
  /* Actualización: Ajuste de estado inicial a 0 para forzar la selección estratégica de proyecto antes de la generación - 22/05/2024 16:15 */
  const [step, setStep] = useState(0); // 0: Select Project, 1: Info, 2: Structure/Design
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  
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

  // Sync pre-selected project from URL
  useEffect(() => {
    if (preSelectedProjectId && userProjects.length > 0) {
      handleProjectSelect(preSelectedProjectId);
      setFormData(prev => ({ ...prev, goal: 'Registro a Webinar / Clase' }));
      /* Actualización: Salto automático al paso 1 si el proyecto ya viene definido en la navegación - 22/05/2024 16:15 */
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

  const goals = [
    'Captar Leads (Registro)',
    'Vender Producto/Servicio',
    'Agendar Citas / Consultoría',
    'Registro a Webinar / Clase',
    'Branding / Presencia',
    'Comunidad (WhatsApp/Telegram)'
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    const finalNiche = formData.pageName; 

    if (!finalNiche) {
        setError('Por favor especifica el nombre del proyecto.');
        setLoading(false);
        return;
    }

    const destinationConfig: DestinationConfig = {
        type: formData.destinationType,
        url: formData.destinationUrl,
        whatsappPhone: formData.whatsappPhone,
        whatsappMessage: formData.whatsappMessage
    };

    const projectContext = userProjects.find(p => p.id === selectedProject);

    try {
      const content: GeneratedPageContent = await generateLandingPageContent(
        finalNiche,
        formData.goal,
        formData.targetAudience,
        formData.destinationType === 'form' ? 'Registro' : formData.destinationType === 'whatsapp' ? 'Contacto Directo' : 'Venta Externa',
        formData.palette,
        formData.structure,
        destinationConfig,
        projectContext 
      );

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

      onPageGenerated(newPage);
    } catch (err) {
      console.error(err);
      setError("Error al generar la página. Por favor intenta de nuevo.");
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

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative">
      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => navigate('/dashboard/pages')} 
          reason={`Has alcanzado el límite de ${user.planLimits?.maxLandings} páginas de tu plan ${user.planLimits?.planName}.`}
      />

      <div className={`bg-primary/10 p-8 text-center border-b border-primary/10 ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white">Generador de Landing Pages IA</h2>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
           {/* Actualización: Paso 0 de visualización de progreso */}
           <span className={`px-3 py-1 rounded-full ${step === 0 ? 'bg-primary text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>0. Proyecto</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-primary text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>1. Configuración</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-primary text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>2. Estructura y Diseño</span>
        </div>
      </div>

      <div className={`p-8 flex-1 ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* */ /* Actualización: Rediseño completo del Paso 0 para unificar la estética con el creador de contenidos - 18/06/2024 11:30 */ }
        {step === 0 && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
              <div className="max-w-2xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">
                        Selecciona tu Proyecto
                    </span>
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    Para generar una página que verdaderamente venda, nuestra inteligencia artificial necesita conocer tu estrategia, avatar y producto. Selecciona un proyecto para crear tu página.
                  </p>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {userProjects.length > 0 ? (
                      userProjects.map((project) => (
                          <button 
                            key={project.id}
                            onClick={() => {
                                handleProjectSelect(project.id);
                                setStep(1);
                            }}
                            className="p-8 bg-[#0B0B0B] border border-white/5 rounded-[2rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                          >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold text-lg group-hover:text-[#FF5A1F] transition-colors truncate">{project.name}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">{project.niche}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">{project.description}</p>
                            <div className="flex items-center justify-end">
                                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#FF5A1F] transition-all group-hover:translate-x-1" />
                            </div>
                          </button>
                      ))
                  ) : (
                      <div className="md:col-span-3 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[2rem] text-center">
                          <p className="text-gray-500 mb-6">Aún no tienes proyectos creados para gestionar contenidos.</p>
                          <button 
                            onClick={() => navigate('/dashboard/projects/create')}
                            className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#FF5A1F]/20"
                          >
                            Crear mi primer proyecto
                          </button>
                      </div>
                  )}
                  
                  {userProjects.length > 0 && (
                      <button 
                        onClick={() => navigate('/dashboard/projects/create')}
                        className="p-8 bg-transparent border-2 border-dashed border-gray-800 rounded-[2rem] text-gray-500 hover:text-white hover:border-gray-600 transition-all font-bold flex flex-col items-center justify-center gap-4 h-full group"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <span className="text-sm uppercase tracking-widest">Crear un nuevo proyecto</span>
                      </button>
                  )}
              </div>

              <div className="p-8 bg-blue-900/10 border border-blue-500/20 rounded-[2rem] flex items-start gap-6 max-w-2xl text-left shadow-xl">
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <Info className="w-6 h-6 text-blue-400 shrink-0" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-1 text-lg">Importancia Estratégica</h5>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        Al seleccionar un proyecto, la IA cargará automáticamente el avatar, los dolores y beneficios clave que definiste anteriormente. Esto garantiza que tu página esté 100% alineada con tu estrategia de ventas.
                    </p>
                  </div>
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
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-white font-bold">{userProjects.find(p => p.id === selectedProject)?.name || 'Proyecto'}</span>
                    </div>
                    <button 
                        onClick={() => setStep(0)}
                        className="text-xs text-gray-500 hover:text-white underline transition"
                    >
                        Cambiar Proyecto
                    </button>
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
          <div className="space-y-8 text-gray-200 animate-in fade-in slide-in-from-right-4 duration-300">
             
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

      </div>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
