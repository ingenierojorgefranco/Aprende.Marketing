import React, { useState } from 'react';
import { Project, LandingPage } from '../../../../types';
import { Briefcase, Globe, Sparkles, Search, Target, Brain, ArrowLeft, PenTool, Plus, CheckCircle2, Users, ChevronRight } from 'lucide-react';

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
  /* */ /* Actualización: Implementación de flujo de selección (IA vs Manual) y rediseño de tarjetas de recomendación con jerarquía visual mejorada para títulos, descripciones en blanco y público objetivo - 06/03/2025 18:30 */
  const [selectionMode, setSelectionMode] = useState<'choice' | 'ia'>('choice');
  const activeProject = userProjects.find(p => p.id === selectedProject);
  const recommendations = activeProject?.strategy_json?.modules?.content || [];

  if (selectionMode === 'choice') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
            <ArrowLeft className="w-4 h-4" /> Cambiar Proyecto
          </button>
          <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-xl border border-white/5">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">{activeProject?.name}</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">¿Cómo quieres crear tu contenido?</h2>
          <p className="text-gray-400 text-xl font-medium">Selecciona el método que mejor se adapte a tus necesidades actuales.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* OPCIÓN A: RECOMENDACIONES IA */}
          <button 
            onClick={() => setSelectionMode('ia')}
            className="group bg-[#0B0B0B] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-500 shadow-2xl relative overflow-hidden h-[400px] justify-center"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Brain className="w-40 h-40 text-purple-500" />
            </div>
            <div className="w-20 h-20 bg-purple-500/10 rounded-[2rem] flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
              <Sparkles className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Estrategia de IA</h3>
            <p className="text-gray-400 text-lg leading-relaxed">Usa las recomendaciones generadas por el sistema basadas en tu nicho y avatar.</p>
            <div className="mt-8 flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
              Ver sugerencias <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* OPCIÓN B: MANUAL */}
          <button 
            onClick={onGenerate}
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
            <div className="mt-8 flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
              Configurar ahora <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      
      <div className="flex items-center justify-between">
          <button onClick={() => setSelectionMode('choice')} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
            <ArrowLeft className="w-4 h-4" /> Volver a opciones
          </button>
          <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-xl border border-white/5">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">{activeProject?.name}</span>
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
                onClick={() => onSelectRecommendation(rec)}
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
                            <Search className="w-4 h-4 text-purple-400" /> <span className="text-gray-500 mr-1">Keyword:</span> <span className="text-white">{rec.keyword}</span>
                        </span>
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                            <Users className="w-4 h-4 text-blue-400" /> <span className="text-gray-500 mr-1">Público:</span> <span className="text-white truncate max-w-[200px]">{activeProject?.targetAudience}</span>
                        </span>
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                            <Target className="w-4 h-4 text-emerald-400" /> <span className="text-gray-500 mr-1">Dificultad:</span> <span className="text-white">{rec.difficulty}%</span>
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