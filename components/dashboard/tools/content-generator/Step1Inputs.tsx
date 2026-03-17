import React, { useState, useEffect } from 'react';
import { Project, LandingPage, User } from '../../../../types';
import { Briefcase, Globe, Sparkles, Search, Target, Brain, ArrowLeft, PenTool, Plus, CheckCircle2, Users, ChevronRight, ChevronLeft, Loader2, AlertTriangle, ExternalLink, X, Zap, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Step1InputsProps {
  userProjects: Project[];
  selectedProject: string;
  onSelectProject: (id: string) => void;
  userPages: LandingPage[];
  selectedPageId: string;
  onSelectPage: (id: string) => void;
  topic: string;
  setTopic: (val: string) => void;
  objective: string;
  setObjective: (val: string) => void;
  keyword: string;
  setKeyword: (val: string) => void;
  onGenerate: () => void;
  onSelectRecommendation: (rec: any) => void;
  loading: boolean;
  onBack: () => void;
  user: User;
  articleCount: number;
  setShowUpgradeModal: (show: boolean) => void;
  isSimulating: boolean;
  isPreFilled?: boolean;
  onClose?: () => void;
}

export const Step1Inputs: React.FC<Step1InputsProps> = ({
  userProjects, selectedProject,
  userPages, selectedPageId, onSelectPage,
  topic, objective, keyword,
  onGenerate, onSelectRecommendation, onBack, loading,
  user, articleCount, setShowUpgradeModal, isSimulating,
  isPreFilled = false,
  onClose
}) => {
  const navigate = useNavigate();
  /* Actualización: Implementación del Selector de Página Estratégico interceptando el flujo de creación para forzar la vinculación de activos antes de proceder con la IA - 25/05/2024 10:00 */
  const [selectionMode, setSelectionMode] = useState<'choice' | 'ia'>('choice');
  const [isPreparing, setIsPreparing] = useState(false);
  
  /* Estados para el control de la ventana modal de selección de página estratégica - 25/05/2024 10:05 */
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [pendingAction, setPendingAction] = useState<'ia' | 'manual' | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  
  /* Estados para la paginación de recomendaciones - 07/06/2025 15:45 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrado de páginas basado en el proyecto seleccionado para este componente específico
  const filteredPages = userPages.filter(p => String(p.projectId) === String(selectedProject));
  
  const activeProject = userProjects.find(p => p.id === selectedProject);
  const recommendations = activeProject?.strategy_json?.modules?.content || [];

  // Cálculos de paginación
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const paginatedRecommendations = recommendations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* Actualización: Auto-disparo del selector si es un flujo pre-llenado desde estrategia - 11/03/2025 11:45 */
  useEffect(() => {
    if (isPreFilled && !hasAutoOpened && selectedProject && (filteredPages.length > 0 || userProjects.length > 0)) {
      setHasAutoOpened(true);
      handleInitiateAction('ia');
    }
  }, [isPreFilled, filteredPages, hasAutoOpened, userProjects, selectedProject]);

  /* Actualización: Función para interceptar el inicio de la acción y abrir el selector de página estratégica - 25/05/2024 10:10 */
  const handleInitiateAction = (action: 'ia' | 'manual') => {
    if (selectedPageId || filteredPages.length === 1) {
      const pageId = selectedPageId || filteredPages[0].id;
      onSelectPage(pageId);
      if (action === 'ia') {
        if (isPreFilled) {
          onSelectRecommendation({
              title: topic,
              strategy: objective,
              keyword: keyword
          });
        } else {
          setSelectionMode('ia');
        }
      } else if (action === 'manual') {
        onGenerate();
      }
    } else {
      setPendingAction(action);
      setShowPageSelector(true);
    }
  };

  const handlePageSelect = (pageId: string) => {
    onSelectPage(pageId);
    setShowPageSelector(false);
    
    if (pendingAction === 'ia') {
      if (isPreFilled) {
        // Actualización: Redirección fluida directa al formulario de revisión cuando los datos ya existen sin perder el estado original
        onSelectRecommendation({
            title: topic,
            strategy: objective,
            keyword: keyword
        });
      } else {
        setSelectionMode('ia');
      }
    } else if (pendingAction === 'manual') {
      onGenerate();
    }
    setPendingAction(null);
  };
  /* Fin de actualización - 25/05/2024 10:10 */

  if (isPreparing || loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">generando estructura del articulo</h3>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Nuestra IA está organizando los puntos clave...</p>
        </div>
      </div>
    );
  }

  if (selectionMode === 'choice') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        {!isPreFilled && (
          <>
            <div className="flex items-center justify-between">
              <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
                <ArrowLeft className="w-4 h-4" /> Cambiar Proyecto
              </button>
              <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-xl border border-white/5">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Proyecto: {activeProject?.name}</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">¿Cómo quieres crear tu contenido?</h2>
              <p className="text-gray-400 text-xl font-medium">Selecciona el método que mejor se adapte a tus necesidades actuales.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* OPCIÓN A: RECOMENDACIONES IA */}
              <button 
                /* Actualización: Intercepción del flujo de creación automática para solicitar selección de página estratégica - 25/05/2024 10:15 */
                onClick={() => handleInitiateAction('ia')}
                className="group bg-[#0B0B0B] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-500 shadow-2xl relative overflow-hidden h-[400px] justify-center"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Brain className="w-40 h-40 text-purple-500" />
                </div>
                <div className="w-20 h-20 bg-purple-500/10 rounded-[2rem] flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">CREACION AUTOMATICA</h3>
                <p className="text-gray-400 text-lg leading-relaxed">Nuestra inteligencia artificial creará tu contenido con base en tu nicho y publico objetivo de tu proyecto.</p>
                <div className="mt-8 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-10 transition-all">
                  Clic para Seleccionar <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* OPCIÓN B: MANUAL */}
              <button 
                /* Actualización: Intercepción del flujo de creación manual para solicitar selección de página estratégica - 25/05/2024 10:15 */
                onClick={() => handleInitiateAction('manual')}
                className="group bg-[#0B0B0B] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-500 shadow-2xl relative overflow-hidden h-[400px] justify-center"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <PenTool className="w-40 h-40 text-blue-500" />
                </div>
                <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                  <PenTool className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Creación Manual</h3>
                <p className="text-gray-400 text-lg leading-relaxed">Define tu propio tema, palabra clave y objetivo desde cero sin restricciones.</p>
                <div className="mt-8 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Configurar ahora <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </>
        )}

        {isPreFilled && !showPageSelector && (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-[#FF5A1F]" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Abriendo selector estratégico...</p>
          </div>
        )}

        {/* Actualización: Implementación de la ventana modal prioritaria para la selección de página estratégica con estética Premium Dark y línea de acento naranja - 25/05/2024 10:20 */}
        {showPageSelector && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => { setShowPageSelector(false); if (isPreFilled && onClose) onClose(); }}>
            <div 
              className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Línea de acento naranja superior */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-600"></div>
              
              <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-[#FF5A1F]" /> ¿A cuál de tus páginas deseas asignar el artículo?
                  </h3>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed font-medium mt-4">
                    Selecciona a continuación la página estratégica a la cual te gustaría vincular este nuevo contenido. Al asignar el artículo, este se publicará automáticamente en el blog de dicha página, potenciando su autoridad y atrayendo tráfico orgánico cualificado.
                  </p>
                </div>
                <button onClick={() => { setShowPageSelector(false); if (isPreFilled && onClose) onClose(); }} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredPages.length > 0 ? (
                  filteredPages.map((page) => (
                    <div 
                      key={page.id}
                      onClick={() => handlePageSelect(page.id)}
                      className="group w-full flex items-center justify-between p-5 bg-black border border-white/5 rounded-2xl hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#FF5A1F] group-hover:bg-[#FF5A1F]/10 transition-all shadow-inner">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span className="text-white font-bold text-lg group-hover:text-[#FF5A1F] transition-colors">{page.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <a 
                          href={page.subdomain ? `https://${page.subdomain}` : '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-500 hover:text-white transition-colors"
                          title="Ver Página"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#FF5A1F] transition-all" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 px-8 text-center border border-dashed border-[#FF5A1F]/30 rounded-[2.5rem] bg-[#FF5A1F]/5 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-[#FF5A1F]/10 rounded-2xl flex items-center justify-center text-[#FF5A1F] shadow-lg border border-[#FF5A1F]/20">
                      <Rocket className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-black text-xl uppercase tracking-tight">Aún no tienes una Página de Captura Creada</h4>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">Para crear un artículo de Blog antes tienes que crear tu página de captura, haz clic en crear mi Página de Captura para crearla.</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/projects/${selectedProject}/strategy?section=web`)}
                      className="px-8 py-4 bg-gradient-to-r from-[#FF5A1F] to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#FF5A1F]/20 transform hover:scale-[1.03] active:scale-95 flex items-center gap-3"
                    >
                      <Plus className="w-4 h-4" /> Crear mi Página de Captura
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-8 bg-black/40 border-t border-white/5 flex justify-end">
                <button onClick={() => { setShowPageSelector(false); if (isPreFilled && onClose) onClose(); }} className="px-6 py-2 text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {/* Fin de actualización - 25/05/2024 10:20 */}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12 relative">
      
      <div className="flex items-center justify-between">
          <button onClick={() => setSelectionMode('choice')} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
            <ArrowLeft className="w-4 h-4" /> Volver a opciones
          </button>
          <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-xl border border-white/5">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Proyecto: {activeProject?.name}</span>
          </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight uppercase italic">Recomendaciones de IA</h2>
        <p className="text-gray-400 text-xl font-medium">Contenido diseñado específicamente para tu audiencia.</p>
      </div>

      <div className="space-y-6">
          {recommendations.length > 0 ? (
            <>
              {/* Bloque de items con animación de entrada suave */}
              <div className="space-y-6 animate-in fade-in duration-500" key={`page-${currentPage}`}>
                {paginatedRecommendations.map((rec: any, idx: number) => {
                    const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                    return (
                      <button 
                        key={globalIdx}
                        /* Actualización: Redirección directa al formulario de revisión (Step 2) al hacer clic en una sugerencia, eliminando el modal de confirmación inmediata - 11/03/2025 16:30 */
                        onClick={() => onSelectRecommendation(rec)}
                        className="w-full text-left p-10 bg-[#0B0B0B] border border-white/10 rounded-[3rem] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">Sugerencia #{globalIdx + 1}</span>
                              <h4 className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors leading-tight">{rec.title}</h4>
                            </div>

                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                              <p className="text-white text-xl font-medium leading-relaxed italic">
                                "{rec.strategy}"
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center">
                                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                    <Search className="w-4 h-4 text-purple-400" /> <span className="text-gray-500 mr-1">Palabra clave:</span> <span className="text-white">{rec.keyword}</span>
                                </span>
                            </div>
                        </div>
                        
                        <div className="shrink-0 w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500 shadow-2xl border border-white/5">
                            <Plus className="w-10 h-10" />
                        </div>
                      </button>
                    );
                })}
              </div>

              {/* Controles de Paginación Estilo Premium Dark */}
              <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
                  <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="px-6 py-3 rounded-xl bg-black/40 border border-white/5 text-gray-400 hover:text-white hover:border-purple-500/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest group"
                  >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Anterior
                  </button>
                  
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                      Página <span className="text-white">{currentPage}</span> de <span className="text-white">{totalPages}</span>
                  </span>

                  <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="px-6 py-3 rounded-xl bg-black/40 border border-white/5 text-gray-400 hover:text-white hover:border-purple-500/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest group"
                  >
                      Siguiente <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
            </>
          ) : (
              <div className="py-20 text-center bg-[#0B0B0B] rounded-[3rem] border border-dashed border-white/10 shadow-2xl">
                  <p className="text-gray-500 text-lg font-bold uppercase tracking-widest">No se detectaron sugerencias en la estrategia del proyecto.</p>
                  <button onClick={() => setSelectionMode('choice')} className="mt-6 text-purple-400 font-bold hover:underline">Volver a opciones</button>
              </div>
          )}
      </div>

    </div>
  );
};