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
    
    // Props de límites
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

    // Porcentajes de Uso
    const usagePercent = Math.min(100, (articleCount / maxArticles) * 100);

    // Colores de Progreso
    const getProgressColor = (percent: number) => {
        if (percent > 85) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
        if (percent > 50) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
        return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    };

    const progressColor = getProgressColor(usagePercent);

    return (
        <div id="psd-content-section" className="space-y-16">
            {/* --- ENCABEZADO ESTRATÉGICO DE CLASE MUNDIAL --- */}
            <div id="psd-content-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/5">
                    <FileText className="w-5 h-5" /> Estrategia de Contenidos
                </div>
                
                <h3 id="psd-content-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Contenido SEO que <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400">crearemos automáticamente</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-purple-500/30 pl-8 py-2">
                        Los activos digitales son la clave de la libertad financiera. No basta con pagar anuncios; necesitas crear una red de contenidos que trabajen por ti 24/7.
                    </p>
                    <p className="border-l-4 border-rose-500/30 pl-8 py-2">
                        Como tu estratega, he diseñado este plan de contenidos SEO para posicionarte como la única autoridad lógica en tu nicho y atraer tráfico gratuito de alta calidad.
                    </p>
                </div>
                
                {/* DYNAMIC LIMITS BANNER */}
                {!isLimitReached ? (
                    <div id="psd-content-included-banner" className="bg-green-900/20 border border-green-500/30 p-8 rounded-2xl flex flex-col gap-6 mt-8 shadow-lg shadow-green-900/10 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500 text-white rounded-lg shadow-lg shadow-green-500/20 flex-shrink-0">
                                <Check className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-green-300 font-bold text-xl mb-1">
                                    Funcionalidad Incluida
                                </p>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Tu plan actual "<span className="text-white font-bold">{currentPlanName.toUpperCase()}</span>" te permite generar hasta {maxArticles} artículos optimizados para buscadores.
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-black/30 p-6 rounded-xl border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest">Artículos Generados</span>
                                <span className="text-white font-bold">{articleCount} / {maxArticles}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div id="psd-content-upsell-banner" className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-2xl flex flex-col gap-8 mt-8 shadow-lg shadow-purple-900/10 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500 text-white rounded-lg shadow-lg shadow-purple-500/20 flex-shrink-0">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-purple-300 font-bold text-xl mb-1 flex items-center gap-2">
                                        Límite Alcanzado
                                    </h4>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Actualmente tienes activo el plan <span className="text-white font-bold uppercase">{currentPlanName}</span>. Actualiza a <span className="text-white font-bold uppercase">{nextPlanName}</span> para eliminar límites de redacción.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onUpgrade}
                                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all whitespace-nowrap"
                            >
                                Actualizar a {nextPlanName} 🚀
                            </button>
                        </div>

                        {/* Progress Bar for Limit View */}
                        <div className="bg-black/40 p-6 rounded-xl border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest">Capacidad del Plan</span>
                                <span className="text-white font-bold">{articleCount} / {maxArticles}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out bg-red-500`} style={{ width: `100%` }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div id="psd-content-grid" className="grid lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN: ARTICLES LIST & OBJECTIVES */}
                <div id="psd-content-list-col" className="space-y-6">
                    <div id="psd-content-list-card" className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400 border border-purple-900/50">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Estrategias Sugeridas</h4>
                                <p className="text-sm text-gray-400">Selecciona las que desees redactar.</p>
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
                            <div id="psd-content-limit-msg" className="mt-4 p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl text-center animate-in fade-in">
                                <p className="text-purple-300 font-medium text-sm">
                                    Has alcanzado tu límite de selección.
                                    <button onClick={onUpgrade} className="block w-full mt-2 text-white font-bold underline hover:text-purple-200 transition">
                                        ¿Deseas redactar artículos ilimitados?
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DYNAMIC DETAIL */}
                <div id="psd-content-detail-card" className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/10 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[500px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Target className="w-40 h-40 text-purple-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-auto">
                            <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-purple-500/10 text-purple-300 border-purple-500/20">
                                Análisis de IA
                            </span>
                            
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                                {contentData[activeArticle].title}
                            </h3>

                            <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm mb-6">
                                <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400"/> Por qué esta keyword
                                </h5>
                                <p className="text-gray-300 text-xl leading-relaxed font-light">
                                    {contentData[activeArticle].strategy}
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div 
                                    className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 flex-1 text-center group cursor-help relative"
                                    onMouseEnter={(e) => handleTooltipHover(e, ["Este artículo aparecerá en Google cuando tu cliente busque exactamente esta frase."])}
                                    onMouseLeave={handleTooltipLeave}
                                >
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><Search className="w-3 h-3"/> Keyword SEO</p>
                                    <p className="text-purple-300 font-bold text-lg leading-tight break-words">{contentData[activeArticle].keyword}</p>
                                </div>

                                <div 
                                    className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 flex-1 text-center cursor-help"
                                    onMouseEnter={(e) => handleTooltipHover(e, ["Un número bajo indica que puedes posicionarte rápidamente en la primera página."])}
                                    onMouseLeave={handleTooltipLeave}
                                >
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dificultad</p>
                                    <p className="text-white font-bold text-3xl">{contentData[activeArticle].difficulty}<span className="text-sm text-gray-600">/100</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <button 
                                onClick={() => isLimitReached ? onUpgrade() : navigate('/dashboard/content-creator')} 
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg ${isLimitReached ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20 hover:scale-[1.02]'}`}
                            >
                                {isLimitReached ? <Lock className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
                                {isLimitReached ? 'Límite Alcanzado' : 'Redactar con IA'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};