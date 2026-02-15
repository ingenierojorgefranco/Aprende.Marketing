
import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Check, Target, Loader2, PlayCircle, X, PenTool, Brain, ArrowRight, ChevronLeft, ChevronRight, Video, Megaphone, Layout, Image as ImageIcon, Copy, CheckCircle2, ChevronDown, ChevronUp, Download, Plus, Unlock } from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { ProjectHook } from '../../../../types';

interface ProjectStrategy_HooksProps {
  strategyData: any;
  activeHook: number;
  setActiveHook: (idx: number) => void;
  handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
  handleTooltipLeave: () => void;
}

export const ProjectStrategy_Hooks: React.FC<ProjectStrategy_HooksProps> = ({
  activeHook,
  setActiveHook,
  handleTooltipHover,
  handleTooltipLeave
}) => {
  const { id: projectId } = useParams() as { id: string };
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // --- NUEVA LÓGICA DE PERSISTENCIA REAL ---
  const [hooks, setHooks] = useState<ProjectHook[]>([]);
  const [loadingHooks, setLoadingHooks] = useState(true);
  const [unlockingMore, setUnlockingMore] = useState(false);
  const [isClone, setIsClone] = useState(false);
  
  // Estados para el prototipo del Kit
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeKitTab, setActiveKitTab] = useState<'video' | 'ads' | 'thumbs' | 'publish'>('publish');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const loadingMessages = [
    "Analizando ángulo psicológico...",
    "Redactando guion de alto impacto...",
    "Optimizando copy para anuncios...",
    "Diseñando conceptos visuales..."
  ];

  const loadHooks = async () => {
    if (!projectId) return;
    setLoadingHooks(true);
    try {
        const data = await api.getProjectHooks(projectId);
        setHooks(data);
    } catch (e) {
        console.error("Error cargando ganchos dinámicos:", e);
    } finally {
        setLoadingHooks(false);
    }
  };

  useEffect(() => {
    const checkProject = async () => {
        if (!projectId) return;
        try {
            const p = await api.getProjectById(projectId);
            if (p?.masterParentId) setIsClone(true);
        } catch (e) {}
    };
    checkProject();
    loadHooks();
  }, [projectId]);

  const handleUnlockMore = async () => {
    setUnlockingMore(true);
    try {
        const res = await api.unlockMoreHooks(projectId);
        await loadHooks();
        alert(res.message || "¡10 nuevos ganchos añadidos a tu estrategia!");
    } catch (e: any) {
        alert(e.message || "Error al cargar más ganchos.");
    } finally {
        setUnlockingMore(false);
    }
  };

  const handleUpdateMessage = async (field: string, value: any) => {
    if (!currentHook.id) return;
    try {
        await api.updateProjectHook(currentHook.id, { [field]: value });
        setHooks(prev => prev.map(h => h.id === currentHook.id ? { ...h, [field]: value } : h));
    } catch (e) {
        console.error("Error updating hook:", e);
    }
  };

  const currentHook: ProjectHook = hooks[activeHook] || { 
    id: '', 
    projectId: '', 
    title: "Selecciona un gancho", 
    psychologicalStrategy: "N/A", 
    contentJson: null, 
    isGenerated: false 
  } as ProjectHook;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(hooks.length / itemsPerPage);
  const paginatedHooks = hooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Datos mockeados para el Kit
  const defaultKitContent = {
    script: "Gana más tiempo con tu familia aprendiendo microblading de cejas.\nEs la forma más sencilla de equilibrar tu vida personal y profesional.\n\nOrganizas tus propios horarios sin depender de nadie.\nGeneras ingresos mientras disfruta de tus seres queridos.\nY recuperas momentos que antes no podías tener.\n\nNuestra profesora especialista en microblading dará hoy una clase GRATIS en vivo.\nUna oportunidad perfecta para que descubras cómo iniciar in esta profesión.\n\nEscribe microblading en los comentarios y entra al link de nuestro perfil para unirte a la clase gratuita que daremos hoy.\nHoy puede ser el comienzo de una nueva vida.",
    ads: `🔥 ${currentHook.title}\n\nSé que suena a promesa vacía, pero en este sector la demanda es tan alta que muchas personas están logrando independencia financiera empezando in sus tiempos libres.\n\n✅ Sin jefes.\n✅ A tu ritmo.\n✅ Con una técnica probada.\n\nHe preparado una Masterclass gratuita donde te revelo el mapa exacto para lograrlo este mismo mes. 👇\n\n🔗 [LINK DE TU LANDING]`,
    thumbs: [
      "Genera $1,000 EXTRAS 💰",
      "SIN RENUNCIAR A TU EMPLEO 🚫",
      "El Método de 1 Hora/Día ⏰"
    ]
  };

  const currentKit = currentHook.contentJson || defaultKitContent;

  const handleGenerateKit = async () => {
    const hookId = currentHook.id;
    if (!hookId) return;

    setIsGenerating(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < loadingMessages.length - 1) {
        step++;
        setLoadingStep(step);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
        const generatedKit = { ...currentKit };
        await api.updateProjectHook(hookId, { isGenerated: true, contentJson: generatedKit });
        setHooks(prev => prev.map(h => h.id === hookId ? { ...h, isGenerated: true, contentJson: generatedKit } : h));
        
        setTimeout(() => {
            setIsGenerating(false);
        }, 5000);
    } catch (e) {
        clearInterval(interval);
        setIsGenerating(false);
        alert("Error al generar el kit.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Contenido copiado al portapapeles");
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
                src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400 border border-orange-900/50">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Ganchos Sugeridos</h4>
                </div>
              </div>
              {isClone && (
                <button 
                  onClick={handleUnlockMore}
                  disabled={unlockingMore || loadingHooks}
                  className="p-2 bg-orange-600/10 border border-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-600 hover:text-white transition-all group"
                  title="Cargar 10 ganchos más"
                >
                  {unlockingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                </button>
              )}
            </div>
            
            <div className="space-y-4 flex-1">
              {loadingHooks ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-400" /></div>
              ) : paginatedHooks.length > 0 ? paginatedHooks.map((hook: ProjectHook, idxInPage: number) => {
                const globalIdx = (currentPage - 1) * itemsPerPage + idxInPage;
                const isActive = activeHook === globalIdx;

                return (
                  <div 
                    key={hook.id} 
                    onClick={() => setActiveHook(globalIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isActive ? 'bg-orange-900/20 border-orange-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
                  >
                    <div className="flex-1">
                      <h4 className={`text-white text-[1.2rem] leading-[1.8rem] font-light ${isActive ? 'text-orange-300' : 'text-gray-300 group-hover:text-white'}`}>{hook.title}</h4>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-orange-500 border-orange-500' : 'border-gray-600 group-hover:border-orange-400'}`}>
                      {(isActive || hook.isGenerated) && <Check className={`w-4 h-4 font-bold ${hook.isGenerated ? 'text-white' : 'text-black'}`} />}
                    </div>
                  </div>
                );
              }) : (
                <div className="py-10 text-center text-gray-500 italic">No hay ganchos disponibles.</div>
              )}
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
            {!currentHook.isGenerated && (
                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/10 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Zap className="w-40 h-40 text-orange-500" /></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-orange-500/10 text-orange-300 border-orange-500/20">Ángulo de Venta Seleccionado</span>
                        </div>
                        
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                            {currentHook.title}
                        </h3>

                        <div className="bg-orange-500/5 rounded-[3rem] p-8 border border-orange-500/30 backdrop-blur-sm mb-8 flex gap-4 items-start shadow-inner">
                            <Brain className="w-6 h-6 text-orange-400 shrink-0 mt-1"/>
                            <div>
                                <h5 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Estrategia Psicológica</h5>
                                <p className="text-gray-400 text-lg font-light italic">"{currentHook.psychologicalStrategy}"</p>
                            </div>
                        </div>

                        {!currentHook.isGenerated && !isGenerating && (
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
            {currentHook.isGenerated && (
                <div className="animate-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-[#111] border border-[#FF5A1F]/30 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                        {/* Header del Kit Rediseñado */}
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent flex items-center gap-4">
                            <div className="w-14 h-14 bg-orange-500 text-black rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Sparkles className="w-8 h-8 fill-current" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">{currentHook.title}</h4>
                                    <button 
                                        onClick={() => handleUpdateMessage('isGenerated', false)}
                                        className="text-[10px] font-black text-white uppercase tracking-widest hover:underline transition-all"
                                    >
                                        Refinar Ángulo
                                    </button>
                                </div>
                                <div className="mt-4 bg-orange-500/5 border border-orange-500/20 rounded-[3rem] px-8 py-3 inline-block shadow-inner">
                                    <p className="text-white text-lg font-light italic">
                                        Estrategia Psicológica: "{currentHook.psychologicalStrategy}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Row - Justo debajo de la línea divisoria */}
                        <div className="px-8 py-6 bg-black/20 border-b border-white/5">
                            <div className="w-full flex flex-wrap bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                                <button onClick={() => setActiveKitTab('publish')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'publish' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Instrucciones</button>
                                <button onClick={() => setActiveKitTab('video')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'video' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>GUION</button>
                                <button onClick={() => setActiveKitTab('thumbs')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'thumbs' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Video</button>
                                <button onClick={() => setActiveKitTab('ads')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'ads' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Descripción</button>
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
                                            {currentKit.script}
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => handleCopy(currentKit.script)} 
                                            className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
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
                                        <div className="whitespace-pre-wrap">{currentKit.ads}</div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => handleCopy(currentKit.ads)} 
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
                                            className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
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
                                            ¿Cómo publicar automáticamente in redes sociales?
                                        </h5>
                                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                                            Sigue esta guía paso a paso para configurar tu sistema de publicación automatizada y escalar tu presencia digital sin esfuerzo manual constante.
                                        </p>
                                    </div>

                                    <div className="space-y-4 mt-8">
                                        {[1, 2, 3, 4, 5].map((step, idx) => (
                                            <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                                                <button 
                                                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                                                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left"
                                                >
                                                    <span className="font-bold text-white text-lg flex items-center gap-4">
                                                        <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-black">{idx + 1}</span>
                                                        Paso {idx + 1}
                                                    </span>
                                                    {openAccordion === idx ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                                                </button>
                                                
                                                {openAccordion === idx && (
                                                    <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black mt-4">
                                                            <iframe 
                                                                className="w-full h-full"
                                                                src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
                                                                title={`Tutorial Paso ${idx + 1}`}
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
    );
};
