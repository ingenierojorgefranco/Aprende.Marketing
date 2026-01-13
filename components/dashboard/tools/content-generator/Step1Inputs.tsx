import React, { useState } from 'react';
import { Project, LandingPage } from '../../../../types';
import { Briefcase, Globe, Sparkles, Search, Target, Brain, ArrowLeft, PenTool, Plus, CheckCircle2, Users, ChevronRight, Loader2, AlertTriangle, ExternalLink, X } from 'lucide-react';

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
}

export const Step1Inputs: React.FC<Step1InputsProps> = ({
  userProjects, selectedProject,
  userPages, selectedPageId, onSelectPage,
  onGenerate, onSelectRecommendation, onBack, loading
}) => {
  /* */ /* Actualización: Implementación del Selector de Página Estratégico interceptando el flujo de creación para forzar la vinculación de activos antes de proceder con la IA - 25/05/2024 10:00 */
  const [selectionMode, setSelectionMode] = useState<'choice' | 'ia'>('choice');
  const [confirmingRec, setConfirmingRec] = useState<any>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  
  /* */ /* Estados para el control de la ventana modal de selección de página estratégica - 25/05/2024 10:05 */
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [pendingAction, setPendingAction] = useState<'ia' | 'manual' | null>(null);
  
  const activeProject = userProjects.find(p => p.id === selectedProject);
  const recommendations = activeProject?.strategy_json?.modules?.content || [];

  /* */ /* Actualización: Función para interceptar el inicio de la acción y abrir el selector de página estratégica - 25/05/2024 10:10 */
  const handleInitiateAction = (action: 'ia' | 'manual') => {
    setPendingAction(action);
    setShowPageSelector(true);
  };

  const handlePageSelect = (pageId: string) => {
    onSelectPage(pageId);
    setShowPageSelector(false);
    
    if (pendingAction === 'ia') {
      setSelectionMode('ia');
    } else if (pendingAction === 'manual') {
      onGenerate();
    }
    setPendingAction(null);
  };
  /* Fin de actualización - 25/05/2024 10:10 */

  const handleConfirmGeneration = () => {
    if (confirmingRec) {
      setIsPreparing(true);
      onSelectRecommendation(confirmingRec);
      setConfirmingRec(null);
    }
  };

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
            /* */ /* Actualización: Intercepción del flujo de creación automática para solicitar selección de página estratégica - 25/05/2024 10:15 */
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
            <div className="mt-8 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
              Clic para Seleccionar <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* OPCIÓN B: MANUAL */}
          <button 
            /* */ /* Actualización: Intercepción del flujo de creación manual para solicitar selección de página estratégica - 25/05/2024 10:15 */
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

        {/* */ /* Actualización: Implementación de la ventana modal prioritaria para la selección de página estratégica con estética Premium Dark y línea de acento naranja - 25/05/2024 10:20 */ }
        {showPageSelector && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowPageSelector(false)}>
            <div 
              className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Línea de acento naranja superior */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-600"></div>
              
              <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight italic leading-tight">¿A cuál de tus páginas deseas asignar el artículo?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    Selecciona a continuación la página estratégica a la cual te gustaría vincular este nuevo contenido. Al asignar el artículo, este se publicará automáticamente en el blog de dicha página, potenciando su autoridad y atrayendo tráfico orgánico cualificado.
                  </p>
                </div>
                <button onClick={() => setShowPageSelector(false)} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
              </div>

              <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {userPages.length > 0 ? (
                  userPages.map((page) => (
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
                  <div className="py-12 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No tienes páginas creadas para este proyecto.</p>
                  </div>
                )}
              </div>
              
              <div className="p-8 bg-black/40 border-t border-white/5 flex justify-end">
                <button onClick={() => setShowPageSelector(false)} className="px-6 py-2 text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-all">Cancelar</button>
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
      
      {confirmingRec && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">estas seguro de generar este articulo?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Vas a consumir créditos al momento de crearlo. La IA redactará una estructura profesional basada en esta sugerencia.</p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={handleConfirmGeneration}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl transition-all shadow-lg shadow-purple-900/20 uppercase text-xs tracking-widest"
              >
                Sí, Generar Ahora
              </button>
              <button 
                onClick={() => setConfirmingRec(null)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
          {recommendations.length > 0 ? recommendations.map((rec: any, idx: number) => (
              <button 
                key={idx}
                onClick={() => setConfirmingRec(rec)}
                className="w-full text-left p-10 bg-[#0B0B0B] border border-white/10 rounded-[3rem] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">Sugerencia #{idx + 1}</span>
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
          )) : (
              <div className="py-20 text-center bg-[#0B0B0B] rounded-[3rem] border border-dashed border-white/10 shadow-2xl">
                  <p className="text-gray-500 text-lg font-bold uppercase tracking-widest">No se detectaron sugerencias en la estrategia del proyecto.</p>
                  <button onClick={() => setSelectionMode('choice')} className="mt-6 text-purple-400 font-bold hover:underline">Volver a opciones</button>
              </div>
          )}
      </div>

    </div>
  );
};
