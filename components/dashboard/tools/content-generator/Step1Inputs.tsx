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
  /* Actualización: Implementación del Selector de Página Estratégico interceptando el flujo de creación para forzar la vinculación de activos antes de proceder con la IA - 25/05/2024 10:00 */
  const [selectionMode, setSelectionMode] = useState<'choice' | 'ia'>('ia');
  const [isPreparing, setIsPreparing] = useState(false);
  
  /* Estados para el control de la ventana modal de selección de página estratégica - 25/05/2024 10:05 */
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [pendingAction, setPendingAction] = useState<'ia' | 'manual' | null>(null);
  const [pendingRec, setPendingRec] = useState<any>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  
  /* Estados para la paginación de recomendaciones - 07/06/2025 15:45 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrado de páginas basado en el proyecto seleccionado para este componente específico
  const filteredPages = userPages.filter(p => String(p.projectId) === String(selectedProject));
  
  const activeProject = userProjects.find(p => p.id === selectedProject);
  const recommendations = activeProject?.strategy_json?.modules?.content || [];

  const [activeRecIdx, setActiveRecIdx] = useState<number>(recommendations.length > 0 ? 0 : -1);

  // Sincronizar el índice activo cuando cambian las recomendaciones
  useEffect(() => {
    if (recommendations.length > 0) {
      setActiveRecIdx(0);
    } else {
      setActiveRecIdx(-1);
    }
  }, [selectedProject, recommendations.length]);

  // Cálculos de paginación
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const paginatedRecommendations = recommendations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* Actualización: Auto-disparo del selector si es un flujo pre-llenado desde estrategia - 11/03/2025 11:45 */
  useEffect(() => {
    if (isPreFilled && !hasAutoOpened && (filteredPages.length > 0 || userProjects.length > 0)) {
      setHasAutoOpened(true);
      handleInitiateAction('ia');
    }
  }, [isPreFilled, filteredPages, hasAutoOpened, userProjects]);

  /* Actualización: Función para interceptar el inicio de la acción y abrir el selector de página estratégica - 25/05/2024 10:10 */
  /* Actualización: Función para interceptar el inicio de la acción y abrir el selector de página estratégica - 25/05/2024 10:10 */
  const handleInitiateAction = (action: 'ia' | 'manual', rec?: any) => {
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
          onSelectRecommendation(rec || { title: topic, strategy: objective, keyword: keyword });
        }
      } else if (action === 'manual') {
        onGenerate();
      }
    } else {
      setPendingAction(action);
      setPendingRec(rec || null);
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
        onSelectRecommendation(pendingRec || { title: topic, strategy: objective, keyword: keyword });
      }
    } else if (pendingAction === 'manual') {
      onGenerate();
    }
    setPendingAction(null);
    setPendingRec(null);
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 relative">
      
      {!isPreFilled && (
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
              <ArrowLeft className="w-4 h-4" /> Cambiar Proyecto
            </button>
            <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-xl border border-white/5">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Proyecto: {activeProject?.name}</span>
            </div>
        </div>
      )}

      {!isPreFilled && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-3 tracking-tight uppercase italic">Biblioteca de Contenidos</h2>
          <p className="text-gray-400 text-xl font-medium">Selecciona la estrategia que deseas redactar hoy.</p>
        </div>
      )}

      {isPreFilled && !showPageSelector && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#FF5A1F]" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Abriendo selector estratégico...</p>
        </div>
      )}

      {!isPreFilled && (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* COLUMNA IZQUIERDA: LISTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400 border border-purple-900/50">
                    <FileText className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white">Sugerencias de IA</h4>
                    <p className="text-sm text-gray-400">Estrategias personalizadas</p>
                 </div>
              </div>

              <div className="space-y-4 flex-1">
                 {paginatedRecommendations.length > 0 ? (
                   paginatedRecommendations.map((rec: any, idx: number) => {
                      const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                      const isActive = activeRecIdx === globalIdx;
                      return (
                        <div 
                          key={globalIdx}
                          onClick={() => setActiveRecIdx(globalIdx)}
                          className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isActive ? 'bg-purple-900/20 border-purple-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
                        >
                          <div className="flex-1">
                            <h4 className={`font-medium text-lg leading-snug ${isActive ? 'text-purple-300' : 'text-gray-300'}`}>
                              {rec.title}
                            </h4>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'bg-white border-white' : 'border-gray-600'}`}>
                            {isActive && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                          </div>
                        </div>
                      );
                   })
                 ) : (
                   <div className="p-8 text-center border border-dashed border-gray-800 rounded-xl bg-black/20">
                      <p className="text-gray-500 text-sm italic">No hay sugerencias disponibles para este proyecto.</p>
                   </div>
                 )}

                 {/* Opción Manual */}
                 <div 
                   onClick={() => setActiveRecIdx(-1)}
                   className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${activeRecIdx === -1 ? 'bg-blue-900/20 border-blue-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
                 >
                   <div className="flex-1">
                      <h4 className={`font-medium text-lg leading-snug ${activeRecIdx === -1 ? 'text-blue-300' : 'text-gray-300'}`}>
                        Estrategia Manual
                      </h4>
                   </div>
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${activeRecIdx === -1 ? 'bg-white border-white' : 'border-gray-600'}`}>
                      {activeRecIdx === -1 && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                   </div>
                 </div>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                 <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-purple-400 disabled:opacity-20 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Página <span className="text-white">{currentPage}</span> de <span className="text-white">{totalPages}</span></span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-purple-400 disabled:opacity-20 transition-all"><ChevronRight className="w-5 h-5" /></button>
                 </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: DETALLE */}
          <div className="lg:col-span-7 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/10 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[500px] shadow-2xl">
             <div className="relative z-10 flex flex-col h-full">
                {activeRecIdx === -1 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in zoom-in-95">
                     <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg">
                        <PenTool className="w-12 h-12" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Creación Manual</h3>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">Define tu propio tema, palabra clave y objetivo desde cero sin restricciones.</p>
                     </div>
                     <button 
                       onClick={() => handleInitiateAction('manual')}
                       className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-blue-900/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                     >
                       <PenTool className="w-6 h-6" /> Configurar Ahora
                     </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full animate-in fade-in duration-500">
                     <div className="mb-auto">
                        <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-purple-500/10 text-purple-300 border-purple-500/20 mb-6">
                           Análisis de IA
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                           {recommendations[activeRecIdx]?.title}
                        </h3>

                        <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm mb-8">
                           <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-400"/> Enfoque Estratégico del Artículo
                           </h5>
                           <p className="text-gray-300 text-xl leading-relaxed font-light italic">
                              "{recommendations[activeRecIdx]?.strategy}"
                           </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
                                 <Search className="w-3 h-3"/> Keyword SEO
                              </p>
                              <p className="text-purple-300 font-bold text-lg leading-tight break-words">
                                 {recommendations[activeRecIdx]?.keyword}
                              </p>
                           </div>
                           <div className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
                              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
                                 <BarChart className="w-3 h-3"/> Vol. Búsqueda
                              </p>
                              <p className="text-emerald-300 font-bold text-lg leading-tight">
                                 {recommendations[activeRecIdx]?.searchVolume || '400 - 800'}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-10">
                        <button 
                          onClick={() => handleInitiateAction('ia', recommendations[activeRecIdx])}
                          className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-orange-900/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                        >
                          <PenTool className="w-6 h-6" /> Escribir Artículo Seleccionado
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
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
    </div>
  );
};