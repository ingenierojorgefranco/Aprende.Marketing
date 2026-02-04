import React, { useState } from 'react';
import { Zap, Sparkles, Check, Target, Loader2, PlayCircle, X, PenTool, Brain, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [editingText, setEditingText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Ganchos sugeridos orientados a transformación económica y libertad
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

  const startEdit = () => {
    setEditingText(currentHook.question);
    setIsEditing(true);
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LISTADO DE HOOKS */}
        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 h-full flex flex-col shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400 border border-orange-900/50">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Ganchos Sugeridos</h4>
                <p className="text-sm text-gray-400">Selecciona el que desees usar.</p>
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
                      <h4 className={`font-medium text-lg leading-snug ${isActive ? 'text-orange-300' : 'text-gray-300 group-hover:text-white'}`}>{hook.question}</h4>
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
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Página <span className="text-white">{currentPage}</span> de <span className="text-white">{totalPages}</span></span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-orange-400 disabled:opacity-20 transition-all"><ChevronRight className="w-5 h-5" /></button>
              </div>
            )}
          </div>
        </div>

        {/* DETALLE DEL HOOK SELECCIONADO */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/10 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden h-full min-h-[500px] shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Zap className="w-40 h-40 text-orange-500" /></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-orange-500/10 text-orange-300 border-orange-500/20">Psicología de Atracción</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-4 mb-6">
                  <textarea 
                    autoFocus
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded-xl p-4 text-xl text-white outline-none focus:border-orange-500 transition h-32 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500 hover:text-white transition uppercase text-[10px] font-black tracking-widest">Cancelar</button>
                    <button onClick={() => { hooks[activeHook].question = editingText; setIsEditing(false); }} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-black uppercase text-[10px] tracking-widest">Guardar</button>
                  </div>
                </div>
              ) : (
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight group cursor-pointer" onClick={startEdit}>
                  {currentHook.question}
                </h3>
              )}

              <div className="bg-black/40 rounded-[2rem] p-8 border border-gray-700/50 backdrop-blur-sm mb-6">
                <h5 className="text-white font-bold text-sm mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-orange-400"/> Enfoque Estratégico</h5>
                <p className="text-gray-300 text-xl leading-relaxed font-light italic">
                  "{currentHook.strategy}"
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800">
               <button className="w-full py-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-lg uppercase tracking-widest shadow-xl shadow-orange-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3">
                  <PenTool className="w-6 h-6" /> Crear Hook con este ángulo
               </button>
               <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4">La IA preparará la estructura de este gancho para tus anuncios</p>
            </div>
          </div>
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