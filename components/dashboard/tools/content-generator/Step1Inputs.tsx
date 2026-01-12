import React, { useState } from 'react';
import { Project, LandingPage } from '../../../../types';
import { Briefcase, Globe, Sparkles, Search, Target, Brain, ArrowLeft, PenTool, Plus, CheckCircle2, Users, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';

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
  /* */ /* Actualización: Implementación de sub-estados para gestionar la fase de vinculación a Landing Page antes de proceder con el método de creación elegido - 06/03/2025 19:45 */
  const [selectionMode, setSelectionMode] = useState<'choice' | 'ia'>('choice');
  const [selectionStage, setSelectionStage] = useState<'method' | 'landing'>('method');
  const [methodChoice, setMethodChoice] = useState<'ia' | 'manual' | null>(null);
  
  const [confirmingRec, setConfirmingRec] = useState<any>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  
  const activeProject = userProjects.find(p => p.id === selectedProject);
  const recommendations = activeProject?.strategy_json?.modules?.content || [];

  const handleConfirmGeneration = () => {
    if (confirmingRec) {
      setIsPreparing(true);
      onSelectRecommendation(confirmingRec);
      setConfirmingRec(null);
    }
  };

  /* */ /* Actualización: Lógica de selección de página para avanzar según el método de creación previamente elegido - 06/03/2025 19:45 */
  const handlePageSelect = (pageId: string) => {
    onSelectPage(pageId);
    if (methodChoice === 'ia') {
      setSelectionMode('ia');
      setSelectionStage('method');
    } else {
      onGenerate();
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
    if (selectionStage === 'landing') {
        return (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
                <div className="flex items-center justify-between">
                    <button onClick={() => setSelectionStage('method')} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
                        <ArrowLeft className="w-4 h-4" /> Volver a elegir método
                    </button>
                    <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-xl border border-white/5">
                        <Briefcase className="w-4 h-4 text-[#FF5A1F]" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Proyecto: {activeProject?.name}</span>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">¿En qué página deseas asignar este artículo?</h2>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto font-medium">
                        Vincular tu contenido a una landing page es un paso estratégico vital. Esto permite que el sistema publique el artículo automáticamente en el blog de tu sitio web, aumentando la autoridad de tu dominio y mejorando significativamente tu posicionamiento en buscadores (SEO).
                    </p>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {userPages.filter(p => p.projectId === selectedProject || !p.projectId).length > 0 ? (
                        userPages.filter(p => p.projectId === selectedProject || !p.projectId).map((page) => (
                            <div 
                                key={page.id}
                                className={`p-10 bg-[#0B0B0B] border rounded-[3rem] transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden ${selectedPageId === page.id ? 'border-[#FF5A1F] bg-[#FF5A1F]/5' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex items-center gap-5 mb-8">
                                    <div className={`p-4 rounded-2xl transition-colors ${selectedPageId === page.id ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F]'}`}>
                                        <Globe className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-2xl truncate">{page.name}</h4>
                                        <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{page.subdomain}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handlePageSelect(page.id)}
                                    className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                >
                                    Seleccionar y Continuar <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="md:col-span-2 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[3rem] text-center">
                            <p className="text-gray-500 mb-6">No tienes páginas creadas para este proyecto.</p>
                            <button 
                                onClick={() => handlePageSelect('')}
                                className="px-8 py-3 bg-white/5 text-gray-300 font-bold rounded-xl border border-white/10"
                            >
                                Continuar sin vincular
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

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
            onClick={() => { setMethodChoice('ia'); setSelectionStage('landing'); }}
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
            onClick={() => { setMethodChoice('manual'); setSelectionStage('landing'); }}
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