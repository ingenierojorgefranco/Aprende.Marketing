import React from 'react';
import { Project, LandingPage } from '../../../../types';
import { Briefcase, Globe, Sparkles, Search, Target, Brain, ArrowLeft, PenTool, Plus, CheckCircle2 } from 'lucide-react';

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
  onGenerate, onSelectRecommendation, onBack
}) => {
  /* */ /* Extracción de recomendaciones desde la Estrategia Maestra del proyecto seleccionado - 24/05/2024 18:52 */
  const activeProject = userProjects.find(p => p.id === selectedProject);
  const recommendations = activeProject?.strategy_json?.modules?.content || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
            <ArrowLeft className="w-4 h-4" /> Cambiar Proyecto
          </button>
          <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-xl border border-white/5">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">{activeProject?.name}</span>
          </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight uppercase">¿Qué vas a escribir hoy?</h2>
        <p className="text-gray-400 text-lg">Elige una recomendación estratégica o crea tu propio contenido personalizado.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: RECOMENDACIONES INTELIGENTES */}
          <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <Brain className="w-32 h-32 text-purple-500" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                          <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Recomendaciones de IA</h3>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Estrategia SEO personalizada</p>
                      </div>
                  </div>

                  <div className="space-y-4">
                      {recommendations.length > 0 ? recommendations.map((rec: any, idx: number) => (
                          <button 
                            key={idx}
                            onClick={() => onSelectRecommendation(rec)}
                            className="w-full text-left p-6 bg-black border border-white/5 rounded-2xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group flex items-center justify-between gap-6"
                          >
                            <div className="flex-1 space-y-3">
                                <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors leading-snug">{rec.title}</h4>
                                <div className="flex flex-wrap gap-3">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">
                                        <Search className="w-3 h-3" /> {rec.keyword}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">
                                        <Target className="w-3 h-3" /> {rec.difficulty}% Dif.
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-1 italic">"{rec.strategy}"</p>
                            </div>
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-lg">
                                <Plus className="w-6 h-6" />
                            </div>
                          </button>
                      )) : (
                          <div className="py-12 text-center bg-black/40 rounded-2xl border border-dashed border-white/5">
                              <p className="text-gray-500 text-sm font-medium">No se detectaron sugerencias en la estrategia del proyecto.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* COLUMNA DERECHA: OPCIÓN MANUAL */}
          <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all duration-500 h-fit">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                      <PenTool className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Manual</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-8">Elige tu propio tema, palabra clave y objetivo sin usar las recomendaciones de la estrategia.</p>
                  <button 
                    onClick={onGenerate}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-lg"
                  >
                    Crear Personalizado
                  </button>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 border border-white/5 rounded-[2rem] p-8 flex-1">
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    Beneficios SEO
                  </h4>
                  <ul className="space-y-4">
                      {[
                        "Atracción de tráfico orgánico 24/7",
                        "Autoridad en tu nicho de mercado",
                        "Derriba objeciones automáticamente",
                        "Captación de leads cualificados"
                      ].map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                              </div>
                              {benefit}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>

      </div>

      {/* FOOTER SETTINGS (Publicar en Page) */}
      <div className="max-w-xl mx-auto pt-10">
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400">
                      <Globe className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Publicar en</p>
                      <p className="text-white font-bold text-sm truncate max-w-[200px]">
                          {userPages.find(p => p.id === selectedPageId)?.name || 'Selecciona una Landing'}
                      </p>
                  </div>
              </div>
              <select
                value={selectedPageId}
                onChange={(e) => onSelectPage(e.target.value)}
                className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-bold uppercase tracking-widest focus:border-green-500 outline-none cursor-pointer"
              >
                <option value="">-- Sin vincular --</option>
                {userPages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
          </div>
      </div>

    </div>
  );
};