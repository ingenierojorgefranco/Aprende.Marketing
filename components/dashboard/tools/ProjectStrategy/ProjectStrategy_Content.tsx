import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Check, Target, Search, PenTool, Lock, PlayCircle, X, Crown, ArrowRight, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlanLimits, Plan, LandingPage, Article } from '../../../../types';
import { ContentGenerator } from '../ContentGenerator';
import { api } from '../../../../services/api';

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
    isSimulating?: boolean;
    linkedArticles?: Article[];
}

export const ProjectStrategy_Content: React.FC<ProjectStrategy_ContentProps> = ({
    contentData, activeArticle, setActiveArticle, selectedArticles, toggleArticleSelection, handleTooltipHover, handleTooltipLeave, onUpgrade,
    articleCount = 0, planLimits, nextPlan, isSimulating = false, linkedArticles = []
}) => {
    const navigate = useNavigate();
    const { id: projectId } = useParams() as { id: string };
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);

    useEffect(() => {
        if (projectId) {
            api.getPages().then(pages => {
                const projectPages = pages.filter(p => String(p.projectId) === String(projectId));
                setLinkedPages(projectPages);
            }).catch(console.error);
        }
    }, [projectId]);

    const handleSelectOne = (idx: number) => {
        // Deseleccionar todos los demás para cumplir con la selección 1 por 1
        selectedArticles.filter(i => i !== idx).forEach(i => toggleArticleSelection(i));
        // Seleccionar el actual si no lo está
        if (!selectedArticles.includes(idx)) {
            toggleArticleSelection(idx);
        }
    };

    // Lógica de límites
    const isRealAdmin = planLimits?.planName === 'admin' && !isSimulating;
    const maxArticles = planLimits?.maxArticles || 2;
    const isAtLimit = !isRealAdmin && articleCount >= maxArticles;

    return (
        <div id="psd-content-section" className="space-y-16">
            {/* --- ENCABEZADO ESTRATÉGICO DE CLASE MUNDIAL --- */}
            <div id="psd-content-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/5">
                    <FileText className="w-5 h-5" /> Contenidos Automáticos para Convertir Clientes
                </div>
                
                <h3 id="psd-content-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Contenido SEO que <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400">crearemos automáticamente</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light">
                    <p className="border-l-4 border-purple-500 pl-8 py-2">
                        Los activos digitales son la clave de la libertad financiera. No basta con pagar anuncios; necesitas crear una red de contenidos que trabajen por ti 24/7.
                    </p>
                    <p className="border-l-4 border-rose-500 pl-8 py-2">
                        Como tu estratega, he diseñado este plan de contenidos SEO para posicionarte como la única autoridad lógica en tu nicho y atraer tráfico gratuito de alta calidad.
                    </p>
                </div>
            </div>

            {/* BLOQUE DE VIDEO: SOPORTE VISUAL ESTRATÉGICO */}
            <div id="psd-content-video-block" className="max-w-[70em] mx-auto px-4 md:px-0">
                <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" 
                            title="Estrategia de Contenidos Automáticos" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
                            <PlayCircle className="w-5 h-5 text-indigo-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Video Explicativo de Contenidos</span>
                        </div>
                    </div>
                </div>
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
                                <p className="text-sm text-gray-400">Selecciona la que desees redactar.</p>
                            </div>
                        </div>
                        
                        <div id="psd-content-items-list" className="space-y-4 flex-1">
                            {contentData.map((art: any, idx: number) => {
                                const isSelected = selectedArticles.includes(idx);
                                const isActive = activeArticle === idx;
                                
                                // Detalle: Cruzar con artículos reales para ver si ya fue generado
                                const existingArticle = linkedArticles.find(a => a.title === art.title);
                                const isGenerated = !!existingArticle;

                                return (
                                    <div 
                                        key={art.id} 
                                        id={`psd-content-item-${idx}`}
                                        onClick={() => handleSelectOne(idx)}
                                        onMouseEnter={() => setActiveArticle(idx)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isGenerated ? 'bg-emerald-600 border-emerald-500 text-white' : isSelected ? 'bg-blue-600 border-blue-500 text-white' : isActive ? 'bg-purple-900/20 border-purple-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
                                    >
                                        <div className="flex-1">
                                            <h4 className={`font-medium text-lg leading-snug ${isGenerated || isSelected ? 'text-white' : isActive ? 'text-purple-300' : 'text-gray-300 group-hover:text-white'}`}>{art.title}</h4>
                                        </div>
                                        
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isGenerated ? 'bg-white border-white' : isSelected ? 'bg-white border-white scale-110' : 'border-gray-600 group-hover:border-purple-400'}`}>
                                            {(isGenerated || isSelected) && <Check className={`w-4 h-4 font-bold ${isGenerated ? 'text-emerald-600' : 'text-blue-600'}`} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DYNAMIC DETAIL */}
                <div id="psd-content-detail-card" className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/10 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[500px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Target className="w-40 h-40 text-purple-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-auto">
                            <div className="flex justify-between items-center mb-4">
                                <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-purple-500/10 text-purple-300 border-purple-500/20">
                                    Análisis de IA
                                </span>
                                {linkedArticles.some(a => a.title === contentData[activeArticle].title) && (
                                    <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        <Check className="w-3 h-3" /> Generado
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                                {contentData[activeArticle].title}
                            </h3>

                            <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm mb-6">
                                <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400"/> Enfoque Estratégico del Artículo
                                </h5>
                                <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                                    <p className="text-gray-300 text-xl leading-relaxed font-light">
                                        {contentData[activeArticle].strategy}
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <div 
                                    className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group cursor-help relative"
                                    onMouseEnter={(e) => handleTooltipHover(e, ["Este artículo aparecerá en Google cuando tu cliente busque exactamente esta frase."])}
                                    onMouseLeave={handleTooltipLeave}
                                >
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><Search className="w-3 h-3"/> Keyword SEO</p>
                                    <p className="text-purple-300 font-bold text-lg leading-tight break-words">{contentData[activeArticle].keyword}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                            {linkedArticles.find(a => a.title === contentData[activeArticle].title) ? (
                                <>
                                    <a 
                                        href={`/admin/lp/${linkedPages[0]?.subdomain?.split('.')[0] || 'page'}/blog/${linkedArticles.find(a => a.title === contentData[activeArticle].title)?.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 hover:scale-[1.02]"
                                    >
                                        <Eye className="w-6 h-6" /> Ver Artículo Online
                                    </a>
                                    <a 
                                        href={window.location.hash ? `#/dashboard/articles/edit/${linkedArticles.find(a => a.title === contentData[activeArticle].title)?.id}` : `/dashboard/articles/edit/${linkedArticles.find(a => a.title === contentData[activeArticle].title)?.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                                    >
                                        <PenTool className="w-4 h-4" /> Editar Contenido Profesional
                                    </a>
                                </>
                            ) : (
                                isAtLimit ? (
                                    <button 
                                        onClick={onUpgrade} 
                                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02]"
                                    >
                                        <Crown className="w-6 h-6 fill-current" /> Límite Alcanzado: Subir a PRO
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setShowGeneratorModal(true)} 
                                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-orange-900/20 hover:scale-[1.02]"
                                    >
                                        <PenTool className="w-6 h-6" /> Escribir Articulo Seleccionado
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL GENERADOR DE CONTENIDOS */}
            {showGeneratorModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowGeneratorModal(false)}>
                    <div className="w-full max-w-[1200px] h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl relative border border-white/10 custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <ContentGenerator 
                            preFilledData={{
                                topic: contentData[activeArticle].title,
                                objective: contentData[activeArticle].strategy,
                                keyword: contentData[activeArticle].keyword,
                                pageId: linkedPages[0]?.id || ''
                            }}
                            embeddedProjectId={projectId}
                            onClose={() => setShowGeneratorModal(false)}
                            onSave={async (article) => {
                                await api.saveArticle(article);
                                setShowGeneratorModal(false);
                                navigate('/dashboard/articles');
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};