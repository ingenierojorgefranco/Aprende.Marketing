
import React from 'react';
import { FileText, Sparkles, Check, Target, Search, PenTool, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlanLimits, Plan } from '../../../../types';

interface ProjectStrategy_ContentProps {
    contentData: any[];
    activeArticle: number;
    setActiveArticle: (idx: number) => void;
    selectedArticles: number[];
    toggleArticleSelection: (idx: number) => void;
    handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
    handleTooltipLeave: () => void;
    onUpgrade: () => void;
    
    // Props nuevos
    articleCount?: number;
    planLimits?: PlanLimits;
    nextPlan?: Plan | null;
}

export const ProjectStrategy_Content: React.FC<ProjectStrategy_ContentProps> = ({
    contentData, activeArticle, setActiveArticle, selectedArticles, toggleArticleSelection, handleTooltipHover, handleTooltipLeave, onUpgrade,
    articleCount = 0, planLimits, nextPlan
}) => {
    const navigate = useNavigate();

    // Lógica de Límites
    const maxArticles = planLimits?.maxArticles || 2;
    const isLimitReached = articleCount >= maxArticles;
    const currentPlanName = planLimits?.planName || 'Starter';
    const nextPlanName = nextPlan?.name || 'Superior';

    return (
        <div id="psd-content-section" className="pt-8">
            <div id="psd-content-header-container" className="w-[80%] mx-auto py-6">
                <h3 id="psd-content-title" className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-purple-500" /> Contenido SEO que crearemos automáticamente
                </h3>
                <div id="psd-content-desc" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mb-8 space-y-4">
                    <p>
                        Los activos digitales son la clave de la libertad financiera. No basta con pagar anuncios; necesitas crear una red de contenidos que trabajen por ti 24/7. Como tu estratega, he diseñado este plan de contenidos SEO para posicionarte como la única autoridad lógica en tu nicho.
                    </p>
                    <p>
                        Hemos analizado miles de palabras clave y seleccionado únicamente las que tienen una intención de compra real. Cada artículo está optimizado no solo para Google, sino para persuadir al lector de que tú eres la solución que busca hoy mismo.
                    </p>
                </div>
                
                {/* DYNAMIC LIMITS BANNER */}
                {!isLimitReached ? (
                    <div id="psd-content-included-banner" className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl flex items-center gap-4 mb-8 shadow-lg shadow-green-900/10">
                        <div className="p-3 bg-green-500 text-white rounded-lg shadow-lg shadow-green-500/20">
                            <Check className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-green-300 font-bold text-xl mb-1">
                                Funcionalidad Incluida
                            </p>
                            <p className="text-gray-300 text-lg">
                                Tienes <span className="text-white font-bold">{articleCount} de {maxArticles}</span> artículos disponibles. Tu plan actual "{currentPlanName.toUpperCase()}" permite máximo crear {maxArticles} artículos de contenido.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div id="psd-content-upsell-banner" className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8 shadow-lg shadow-purple-900/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500 text-white rounded-lg shadow-lg shadow-purple-500/20">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-purple-300 font-bold text-xl mb-1 flex items-center gap-2">
                                    Límite Alcanzado
                                </h4>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Actualmente tienes activo el plan <span className="text-white font-bold uppercase">{currentPlanName}</span>, actualiza tu Plan a <span className="text-white font-bold uppercase">{nextPlanName}</span> para eliminar límites y seguir creando.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onUpgrade}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold text-lg shadow-lg transform hover:scale-105 transition-all whitespace-nowrap"
                        >
                            Actualizar a {nextPlanName} 🚀
                        </button>
                    </div>
                )}
            </div>

            <div id="psd-content-grid" className="grid lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN: ARTICLES LIST & OBJECTIVES */}
                <div id="psd-content-list-col" className="space-y-6">
                    <div id="psd-content-list-card" className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400 border border-purple-900/50">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Blog & SEO</h4>
                                <p className="text-sm text-gray-400">Tráfico orgánico a largo plazo.</p>
                            </div>
                        </div>
                        
                        <div id="psd-content-items-list" className="space-y-4 flex-1">
                            {contentData.map((art: any, idx: number) => {
                                const isSelected = selectedArticles.includes(idx);
                                const isActive = activeArticle === idx;
                                return (
                                    <div 
                                        key={art.id}
                                        id={`psd-content-item-${idx}`}
                                        onClick={() => toggleArticleSelection(idx)}
                                        onMouseEnter={() => setActiveArticle(idx)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isSelected ? 'bg-blue-600 border-blue-500 text-white' : isActive ? 'bg-purple-900/20 border-purple-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
                                    >
                                        <div className="flex-1">
                                            <h4 className={`font-medium text-lg leading-snug ${isSelected ? 'text-white' : isActive ? 'text-purple-300' : 'text-gray-300 group-hover:text-white'}`}>{art.title}</h4>
                                        </div>
                                        
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-white border-white scale-110' : 'border-gray-600 group-hover:border-purple-400'}`}>
                                            {isSelected && <Check className="w-4 h-4 text-blue-600 font-bold" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedArticles.length >= maxArticles && (
                            <div id="psd-content-limit-msg" className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg text-center animate-in fade-in">
                                <p className="text-purple-300 font-medium text-sm">
                                    ¿Te gustaría crear más artículos? 
                                    <button onClick={onUpgrade} className="block w-full mt-2 text-white font-bold underline hover:text-purple-200">
                                        Actualiza a {nextPlanName}
                                    </button>
                                </p>
                            </div>
                        )}

                        <div id="psd-content-objectives" className="mt-8 pt-6 border-t border-gray-800">
                            <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Objetivos del Contenido</h5>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    "Atraer tráfico cualificado",
                                    "Educar al público",
                                    "Reducir miedos",
                                    "Preparar la venta"
                                ].map((obj, i) => (
                                    <div key={i} className="flex items-center gap-2 text-lg text-gray-300">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {obj}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DYNAMIC DETAIL */}
                <div id="psd-content-detail-card" className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/10 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[500px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Target className="w-40 h-40 text-purple-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-auto">
                            <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-purple-500/10 text-purple-300 border-purple-500/20">
                                Estrategia Seleccionada
                            </span>
                            
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                                {contentData[activeArticle].title}
                            </h3>

                            <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm mb-6">
                                <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-400"/> Estrategia de Atracción
                                </h5>
                                <p className="text-gray-300 text-xl leading-relaxed font-light">
                                    {contentData[activeArticle].strategy}
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div 
                                    id="psd-content-detail-keyword"
                                    className="px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 flex-1 text-center group cursor-help relative"
                                    onMouseEnter={(e) => handleTooltipHover(e, ["Este artículo estará optimizado semánticamente para aparecer en Google cuando tu cliente ideal busque exactamente esta frase."])}
                                    onMouseLeave={handleTooltipLeave}
                                >
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><Search className="w-3 h-3"/> Keyword de Posicionamiento</p>
                                    <p className="text-purple-300 font-bold text-lg leading-tight break-words">{contentData[activeArticle].keyword || "microblading principiantes"}</p>
                                </div>

                                <div 
                                    id="psd-content-detail-difficulty"
                                    className="px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 flex-1 text-center cursor-help"
                                    onMouseEnter={(e) => handleTooltipHover(e, ["Indica qué tan difícil es superar a la competencia en Google. Un número bajo significa que es fácil llegar a la primera página rápido; un número alto significa que requiere más autoridad."])}
                                    onMouseLeave={handleTooltipLeave}
                                >
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dificultad de Posicionamiento</p>
                                    <p className="text-white font-bold text-3xl">{contentData[activeArticle].difficulty}<span className="text-sm text-gray-600">/100</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <p className="text-center text-xl text-gray-300 mb-6 font-medium">
                                Has seleccionado <span className="text-purple-400 font-bold text-2xl">{selectedArticles.length}</span> de <span className="text-white font-bold text-2xl">{maxArticles}</span> artículos disponibles en tu plan.
                            </p>
                            
                            <button onClick={() => navigate('/dashboard/content-creator')} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg shadow-purple-900/20 hover:scale-[1.02]">
                                <PenTool className="w-6 h-6" /> Redactar artículos automáticamente
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-3">
                                La IA usará esta estrategia para escribir el artículo completo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
