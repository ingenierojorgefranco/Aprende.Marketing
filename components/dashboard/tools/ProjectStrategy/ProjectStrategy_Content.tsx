import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Check, Target, Search, PenTool, Lock, PlayCircle, X, Crown, ArrowRight, Eye, BarChart, ChevronLeft, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
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
}

export const ProjectStrategy_Content: React.FC<ProjectStrategy_ContentProps> = ({
    contentData, activeArticle, setActiveArticle, selectedArticles, toggleArticleSelection, handleTooltipHover, handleTooltipLeave, onUpgrade,
    articleCount = 0, planLimits, nextPlan, isSimulating = false
}) => {
    const navigate = useNavigate();
    const { id: projectId } = useParams() as { id: string };
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [linkedArticles, setLinkedArticles] = useState<Article[]>([]);
    const [loadingLocal, setLoadingLocal] = useState(false);

    // Lógica de Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const totalPages = Math.ceil(contentData.length / itemsPerPage);
    const paginatedData = contentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const loadLocalData = async () => {
            if (!projectId) return;
            setLoadingLocal(true);
            try {
                const [pages, articles] = await Promise.all([
                    api.getPages(),
                    api.getArticles()
                ]);
                const projectPages = pages.filter(p => String(p.projectId) === String(projectId));
                setLinkedPages(projectPages);
                const projectArts = articles.filter(a => projectPages.some(p => String(p.id) === String(a.pageId)));
                setLinkedArticles(projectArts);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingLocal(false);
            }
        };
        loadLocalData();
    }, [projectId]);

    const handleSelectOne = (idx: number) => {
        selectedArticles.filter(i => i !== idx).forEach(i => toggleArticleSelection(i));
        if (!selectedArticles.includes(idx)) {
            toggleArticleSelection(idx);
        }
    };

    const handleCloseAndReload = () => {
        setShowGeneratorModal(false);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('section', 'content');
        currentUrl.hash = 'psd-content-anchor';
        window.location.replace(currentUrl.toString());
        window.location.reload();
    };

    const isRealAdmin = planLimits?.planName === 'admin' && !isSimulating;
    const maxArticles = planLimits?.maxArticles || 2;
    const isAtLimit = !isRealAdmin && !api.isUsingMockData() && articleCount >= maxArticles;

    const usagePercent = Math.min(100, (articleCount / maxArticles) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    return (
        <div className="space-y-16">
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

            <div id="psd-content-anchor" className="scroll-mt-24"></div>
            {loadingLocal ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
                <div id="psd-content-grid" className="grid lg:grid-cols-2 gap-8">
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
                                {paginatedData.map((art: any, indexInPage: number) => {
                                    const globalIdx = (currentPage - 1) * itemsPerPage + indexInPage;
                                    const isSelected = selectedArticles.includes(globalIdx);
                                    const isActive = activeArticle === globalIdx;
                                    const isGenerated = linkedArticles.some(a => a.title === art.title);

                                    return (
                                        <div 
                                            key={art.id} 
                                            onClick={() => handleSelectOne(globalIdx)}
                                            onMouseEnter={() => setActiveArticle(globalIdx)}
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

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-purple-400 disabled:opacity-20 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Página <span className="text-white">{currentPage}</span> de <span className="text-white">{totalPages}</span></span>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-purple-400 disabled:opacity-20 transition-all"><ChevronRight className="w-5 h-5" /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div id="psd-content-detail-card" className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/10 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[500px] shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Target className="w-40 h-40 text-purple-500" /></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-auto">
                                <div className="flex justify-between items-center mb-4"><span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-purple-500/10 text-purple-300 border-purple-500/20">Análisis de IA</span>{linkedArticles.some(a => a.title === contentData[activeArticle].title) && (<span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20"><Check className="w-3 h-3" /> Generado</span>)}</div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{contentData[activeArticle].title}</h3>
                                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm mb-6"><h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400"/> Enfoque Estratégico del Artículo</h5><div className="max-h-[180px] overflow-y-auto custom-scrollbar"><p className="text-gray-300 text-xl leading-relaxed font-light">{contentData[activeArticle].strategy}</p></div></div>
                                <div className="space-y-4">
                                    <div className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group cursor-help relative" onMouseEnter={(e) => handleTooltipHover(e, ["Este artículo aparecerá en Google cuando tu cliente busque exactamente esta frase."])} onMouseLeave={handleTooltipLeave}><p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><Search className="w-3 h-3"/> Keyword SEO</p><p className="text-purple-300 font-bold text-lg leading-tight break-words">{contentData[activeArticle].keyword}</p></div>
                                    <div className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group cursor-help relative" onMouseEnter={(e) => handleTooltipHover(e, ["Indica cuántas personas buscan esta frase al mes en promedio."])} onMouseLeave={handleTooltipLeave}><p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1"><BarChart className="w-3 h-3"/> Vol. Búsqueda</p><p className="text-emerald-300 font-bold text-lg leading-tight break-words">{contentData[activeArticle].searchVolume || 'N/A'}</p></div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                                {linkedArticles.find(a => a.title === contentData[activeArticle].title) ? (
                                    <>
                                        <a href={`/admin/lp/${linkedPages[0]?.subdomain?.split('.')[0] || 'page'}/blog/${linkedArticles.find(a => a.title === contentData[activeArticle].title)?.slug}`} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 hover:scale-[1.02]"><Eye className="w-6 h-6" /> Ver Artículo Online</a>
                                        <a href={window.location.hash.startsWith('#/') ? `#/dashboard/articles/edit/${linkedArticles.find(a => a.title === contentData[activeArticle].title)?.id}` : `/dashboard/articles/edit/${linkedArticles.find(a => a.title === contentData[activeArticle].title)?.id}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"><PenTool className="w-4 h-4" /> Editar Contenido Profesional</a>
                                    </>
                                ) : (
                                    isAtLimit ? (
                                        <button onClick={onUpgrade} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02]"><Crown className="w-6 h-6 fill-current" /> Límite Alcanzado: Subir a PRO</button>
                                    ) : (
                                        <button onClick={() => setShowConfirmModal(true)} disabled={selectedArticles.length === 0} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg ${selectedArticles.length === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50 grayscale' : 'bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-orange-900/20 hover:scale-[1.02]'}`}><PenTool className="w-6 h-6" /> Escribir Articulo Seleccionado</button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-purple-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-rose-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-3xl flex items-center justify-center mx-auto border border-purple-500/20 shadow-lg shadow-purple-900/10 animate-pulse"><Sparkles className="w-10 h-10" /></div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirma si deseas generar un nuevo artículo</h3>
                                <p className="text-gray-400 text-lg leading-relaxed font-medium">Redactar un nuevo artículo de blog consumirá créditos de tu plan. Confirma a continuación si deseas generar el articulo de blog que has seleccionado en tu plan <span className="text-purple-400 font-bold capitalize">{planLimits?.planName || 'Starter'}</span>.</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] shadow-inner">
                                <div className="flex justify-between items-center mb-3"><span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Artículos en tu plan <span className="capitalize">{planLimits?.planName || 'Starter'}</span></span><span className="text-white font-bold text-sm">{articleCount} / {isRealAdmin ? '∞' : maxArticles}</span></div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden p-0.5 border border-white/5"><div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]`} style={{ width: `${isRealAdmin ? (articleCount > 0 ? 100 : 0) : usagePercent}%` }}></div></div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button><button onClick={() => { setShowConfirmModal(false); setShowGeneratorModal(true); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-900/20 transform hover:scale-105 active:scale-95 transition-all">Confirmar y Redactar</button></div>
                    </div>
                </div>
            )}

            {showGeneratorModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in" onClick={handleCloseAndReload}>
                    <div className="w-full max-w-[1200px] h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl relative border border-white/10 custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <ContentGenerator 
                            preFilledData={{
                                topic: contentData[selectedArticles[0]]?.title || '',
                                objective: contentData[selectedArticles[0]]?.strategy || '',
                                keyword: contentData[selectedArticles[0]]?.keyword || '',
                                pageId: linkedPages[0]?.id || ''
                            }}
                            embeddedProjectId={projectId}
                            onClose={handleCloseAndReload}
                            onSave={async (article) => {
                                await api.saveArticle(article);
                                handleCloseAndReload();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};