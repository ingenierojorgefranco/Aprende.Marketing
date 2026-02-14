import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Check, Target, Loader2, PlayCircle, X, PenTool, Brain, ArrowRight, ChevronLeft, ChevronRight, Video, Megaphone, Layout, Image as ImageIcon, Copy, CheckCircle2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';

interface ProjectStrategy_HooksProps {
  strategyData: any;
  activeHook: number;
  setActiveHook: (idx: number) => void;
  handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
  handleTooltipLeave: () => void;
}

export const ProjectStrategy_Hooks: React.FC<ProjectStrategy_HooksProps> = ({
  strategyData,
  activeHook,
  setActiveHook,
  handleTooltipHover,
  handleTooltipLeave
}) => {
  const { id: projectId } = useParams() as { id: string };
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Estados para el prototipo del Kit
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // Inicializamos con el índice 0 para que el primer gancho aparezca generado
  const [generatedIndices, setGeneratedIndices] = useState<Set<number>>(new Set([0]));
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeKitTab, setActiveKitTab] = useState<'video' | 'ads' | 'thumbs' | 'publish'>('video');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const loadingMessages = [
    "Analizando ángulo psicológico...",
    "Redactando guion de alto impacto...",
    "Optimizando copy para anuncios...",
    "Diseñando conceptos visuales..."
  ];

  // Ganchos sugeridos
  const fallbackHooks = [
    { id: 1, question: "¿Te gustaría generar $1,000 extras al mes sin dejar tu trabajo actual?", strategy: "Conecta con el deseo de seguridad financiera inmediata y falta de riesgo." },
    { id: 2, question: "¿Has sentido que tu talento no está siendo pagado como realmente merece?", strategy: "Apela al sentimiento de infravaloración profesional y deseo de estatus." },
    { id: 3, question: "¿Qué harías si tuvieras una técnica que te permitiera ser tu propia jefa mañana mismo?", strategy: "Estimula la visualización de independencia y control total del tiempo." },
    { id: 4, question: "¿Estás cansada de ver cómo otros tienen éxito mientras tú sigues estancada?", strategy: "Utiliza el gatillo de la envidia benigna y la urgencia por el cambio." },
    { id: 5, question: "¿Sabías que el microblading es la habilidad mejor pagada en el sector belleza hoy?", strategy: "Autoridad basada en datos de mercado para validar la oportunidad." },
    { id: 6, question: "¿Te imaginas recuperar tu inversión con tan solo tus primeras dos clientas?", strategy: "Neutraliza el miedo a la pérdida económica con un cálculo de retorno rápido." },
    { id: 7, question: "¿Quieres aprender el sistema que automatiza tus ventas mientras tú te enfocas en tu arte?", strategy: "Deseo de simplicidad técnica y enfoque en lo que realmente les apasiona." }
  ];

  const hooks = strategyData?.modules?.hooks && strategyData.modules.hooks.length > 0 
    ? strategyData.modules.hooks 
    : fallbackHooks;

  const currentHook = hooks[activeHook] || hooks[0];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(hooks.length / itemsPerPage);
  const paginatedHooks = hooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Verificamos si el gancho actual está en la lista de generados
  const isCurrentHookGenerated = generatedIndices.has(activeHook);

  // Simulación de generación del Kit
  const handleGenerateKit = () => {
    setIsGenerating(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < loadingMessages.length - 1) {
        step++;
        setLoadingStep(step);
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        // Agregamos el índice actual a los generados
        setGeneratedIndices(prev => new Set(prev).add(activeHook));
      }
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Contenido copiado al portapapeles");
  };

  // Datos mockeados para el Kit (Adaptables según el gancho, pero para el prototipo usamos el del Gancho 1)
  const kitContent = {
    video: {
      script: [
        { text: "Gana más tiempo con tu familia aprendiendo microblading de cejas.\nEs la forma más sencilla de equilibrar tu vida personal y profesional.\n\nOrganizas tus propios horarios sin depender de nadie.\nGeneras ingresos mientras disfruta de tus seres queridos.\nY recuperas momentos que antes no podías tener.\n\nNuestra profesora especialista en microblading dará hoy una clase GRATIS en vivo.\nUna oportunidad perfecta para que descubras cómo iniciar en esta profesión.\n\nEscribe microblading en los comentarios y entra al link de nuestro perfil para unirte a la clase gratuita que daremos hoy.\nHoy puede ser el comienzo de una nueva vida." }
      ]
    },
    ads: `🔥 ${currentHook.question}\n\nSé que suena a promesa vacía, pero en el sector de ${strategyData?.meta?.niche || 'este nicho'} la demanda es tan alta que muchas personas están logrando independencia financiera empezando en sus tiempos libres.\n\n✅ Sin jefes.\n✅ A tu ritmo.\n✅ Con una técnica probada.\n\nHe preparado una Masterclass gratuita donde te revelo el mapa exacto para lograrlo este mismo mes. 👇\n\n🔗 [LINK DE TU LANDING]`,
    thumbs: [
      "Genera $1,000 EXTRAS 💰",
      "SIN RENUNCIAR A TU EMPLEO 🚫",
      "El Método de 1 Hora/Día ⏰"
    ],
    publish: {
      steps: [
        { title: "Paso 1: Descarga el Video y Subelo a Google Drive", videoId: "dQw4w9WgXcQ" },
        { title: "Paso 2: Conecta tu cuenta de Redes Sociales", videoId: "dQw4w9WgXcQ" },
        { title: "Paso 3: Sincroniza la carpeta de Drive con el Publicador", videoId: "dQw4w9WgXcQ" },
        { title: "Paso 4: Programa el calendario de publicaciones", videoId: "dQw4w9WgXcQ" },
        { title: "Paso 5: Verifica el estado de tus videos publicados", videoId: "dQw4w9WgXcQ" }
      ]
    }
  };

  return (
    <div className="space-y-16">
      {/* CABECERA ESTRATÉGICA */}
      <div className="max-w-[70em] mx-auto text-left space-y-8 py-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
          <Zap className="w-5 h-5 fill-current" /> Ganchos Magnéticos de Atracción
        </div>
        
        <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 leading-tight tracking-tight max-w-4xl">
          Hooks de Atracción
        </h3>
        
        <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
          <p className="flex-1 border-l-4 border-orange-500 pl-8 py-2">
            Un Hook no es solo una pregunta; es el puente que detiene el scroll de tu cliente ideal. Hemos diseñado estos ganchos para atacar directamente los deseos de libertad y crecimiento de tu avatar.
          </p>
          <div className="hidden md:block w-px h-24 bg-orange-500/30"></div>
          <div 
            onClick={() => setShowVideoModal(true)}
            className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group cursor-pointer"
          >
              <img 
                src="https://img.youtube.com/vi/dQw4w9XcQ/maxresdefault.jpg" 
                alt="Tutorial Thumbnail"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-10 h-10 text-orange-400" />
                  </div>
              </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* LISTADO DE HOOKS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 h-full flex flex-col shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400 border border-orange-900/50">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Ganchos Sugeridos</h4>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              {paginatedHooks.map((hook: any, idxInPage: number) => {
                const globalIdx = (currentPage - 1) * itemsPerPage + idxInPage;
                const isActive = activeHook === globalIdx;

                return (
                  <div 
                    key={hook.id} 
                    onClick={() => setActiveHook(globalIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isActive ? 'bg-orange-900/20 border-orange-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
                  >
                    <div className="flex-1">
                      <h4 className={`text-white text-[1.2rem] leading-[1.8rem] font-light ${isActive ? 'text-orange-300' : 'text-gray-300 group-hover:text-white'}`}>{hook.question}</h4>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-orange-500 border-orange-500' : 'border-gray-600 group-hover:border-orange-400'}`}>
                      {isActive && <Check className="w-4 h-4 font-bold text-black" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-orange-400 disabled:opacity-20 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pág. {currentPage}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-orange-400 disabled:opacity-20 transition-all"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        </div>

        {/* DETALLE Y RESULTADO */}
        <div className="lg:col-span-7 space-y-8">
            {/* CARD DE DETALLE Y GENERADOR - OCULTA SI YA SE GENERÓ EL KIT */}
            {!isCurrentHookGenerated && (
                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/10 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Zap className="w-40 h-40 text-orange-500" /></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-orange-500/10 text-orange-300 border-orange-500/20">Ángulo de Venta Seleccionado</span>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                            {currentHook.question}
                        </h3>

                        <div className="bg-black/40 rounded-[2rem] p-6 border border-gray-700/50 backdrop-blur-sm mb-8 flex gap-4 items-start">
                            <Brain className="w-6 h-6 text-orange-400 shrink-0 mt-1"/>
                            <div>
                                <h5 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Estrategia Psicológica</h5>
                                <p className="text-gray-400 text-lg font-light italic">"{currentHook.strategy}"</p>
                            </div>
                        </div>

                        {!isCurrentHookGenerated && !isGenerating && (
                            <button 
                                onClick={handleGenerateKit}
                                className="w-full py-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-orange-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group"
                            >
                                <Sparkles className="w-6 h-6 group-hover:animate-pulse" /> Crear Kit de Contenido con este ángulo
                            </button>
                        )}

                        {isGenerating && (
                            <div className="py-10 text-center space-y-6 animate-in fade-in duration-500">
                                <div className="relative inline-block">
                                    <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="w-16 h-16 text-orange-500 animate-spin relative z-10" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-black uppercase tracking-widest text-lg">{loadingMessages[loadingStep]}</p>
                                    <p className="text-gray-500 text-xs uppercase font-bold tracking-[0.3em]">IA procesando estructura...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- KIT DE CONTENIDO GENERADO --- */}
            {isCurrentHookGenerated && (
                <div className="animate-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-[#111] border border-[#FF5A1F]/30 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                        {/* Header del Kit Rediseñado */}
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent flex items-center gap-4">
                            <div className="w-14 h-14 bg-orange-500 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Sparkles className="w-8 h-8 fill-current" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tight">{currentHook.question}</h4>
                                <p className="text-white text-[1.3rem] leading-[2.5rem] font-light py-4">
                                    Estrategia Psicológica: "{currentHook.strategy}"
                                </p>
                            </div>
                        </div>

                        {/* Navigation Row - Justo debajo de la línea divisoria */}
                        <div className="px-8 py-6 bg-black/20 border-b border-white/5">
                            <div className="w-full flex flex-wrap bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                                <button onClick={() => setActiveKitTab('video')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'video' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Guión de Video</button>
                                <button onClick={() => setActiveKitTab('thumbs')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'thumbs' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Video</button>
                                <button onClick={() => setActiveKitTab('ads')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'ads' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Descripción</button>
                                <button onClick={() => setActiveKitTab('publish')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'publish' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Publicar</button>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 min-h-[250px]">
                            {/* VIDEO TAB */}
                            {activeKitTab === 'video' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 h-full flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-white font-black text-xl flex items-center gap-3 uppercase tracking-tight">
                                            <Video className="w-6 h-6 text-orange-400" /> Guión de Video
                                        </h5>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all">
                                        <div className="text-gray-200 text-[1.3rem] leading-[2.5rem] font-light whitespace-pre-wrap">
                                            {kitContent.video.script.map((step, i) => (
                                                <div key={i} className="mb-0 last:mb-0">
                                                    {step.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => handleCopy(kitContent.video.script.map(s => s.text).join('\n\n'))} 
                                            className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-orange-900/20"
                                        >
                                            <Copy className="w-5 h-5" /> Copiar Guion
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ADS TAB */}
                            {activeKitTab === 'ads' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-white font-black text-xl flex items-center gap-3 uppercase tracking-tight">
                                            <Megaphone className="w-6 h-6 text-orange-400" /> Descripción
                                        </h5>
                                    </div>
                                    <div className="bg-white rounded-[2rem] p-10 shadow-2xl text-gray-900 font-medium text-lg leading-relaxed border-4 border-gray-100 relative">
                                        <div className="absolute top-4 right-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Vista Previa Anuncio</div>
                                        <div className="whitespace-pre-wrap">{kitContent.ads}</div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => handleCopy(kitContent.ads)} 
                                            className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
                                        >
                                            <Copy className="w-5 h-5" /> Copiar Descripción
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* THUMBS TAB */}
                            {activeKitTab === 'thumbs' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <h5 className="text-white font-black text-xl flex items-center gap-3 uppercase tracking-tight">
                                        <Layout className="w-6 h-6 text-orange-400" /> Video
                                    </h5>
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                                        <iframe 
                                            className="w-full h-full"
                                            src="https://drive.google.com/file/d/18nIzeigNWVl6T2dhxuf34hlqAQKxHFAf/preview"
                                            allow="autoplay"
                                        ></iframe>
                                    </div>
                                    <div className="flex justify-center">
                                        <a 
                                            href="https://drive.google.com/file/d/18nIzeigNWVl6T2dhxuf34hlqAQKxHFAf/view?usp=drive_link" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-orange-900/20"
                                        >
                                            <Download className="w-5 h-5" /> Descargar Video
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* PUBLISH TAB */}
                            {activeKitTab === 'publish' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-4">
                                        <h5 className="text-white font-black text-3xl leading-tight">
                                            ¿Cómo publicar automáticamente en redes sociales?
                                        </h5>
                                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                                            Sigue esta guía paso a paso para configurar tu sistema de publicación automatizada y escalar tu presencia digital sin esfuerzo manual constante.
                                        </p>
                                    </div>

                                    <div className="space-y-4 mt-8">
                                        {kitContent.publish.steps.map((step, idx) => (
                                            <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                                                <button 
                                                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                                                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left"
                                                >
                                                    <span className="font-bold text-white text-lg flex items-center gap-4">
                                                        <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-black">{idx + 1}</span>
                                                        {step.title}
                                                    </span>
                                                    {openAccordion === idx ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                                                </button>
                                                
                                                {openAccordion === idx && (
                                                    <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black mt-4">
                                                            <iframe 
                                                                className="w-full h-full"
                                                                src={`https://www.youtube.com/embed/${step.videoId}`}
                                                                title={step.title}
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* MODAL DE VIDEO */}
      {showVideoModal && (
          <div 
              onClick={() => setShowVideoModal(false)}
              className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          >
              <div 
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
              >
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                      <h3 className="font-bold text-white flex items-center gap-2">
                          <PlayCircle className="w-5 h-5 text-orange-500" /> Tutorial: Hooks de Atracción
                      </h3>
                      <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                          <X className="w-6 h-6"/>
                      </button>
                  </div>
                  <div className="aspect-video w-full">
                      <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                          title="Tutorial Hooks" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                      ></iframe>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
