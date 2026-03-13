import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Check, Target, Search, PenTool, Lock, PlayCircle, X, Crown, ArrowRight, Eye, BarChart, CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, Loader2, Plus, Save, Unlock, Brain, Shield, Trash2 } from 'lucide-react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { PlanLimits, Plan, LandingPage, Article } from '../../../../types';
import { ContentGenerator } from '../ContentGenerator';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';
import { DeletionRestrictionModal } from '../../DeletionRestrictionModal';

interface ProjectStrategy_ContentProps {
    contentData: any[];
    activeArticle: number;
    setActiveArticle: (idx: number) => void;
    selectedArticles: number[];
    toggleArticleSelection: (idx: number, isSingle?: boolean) => void;
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
    const context = useOutletContext() as any;
    const user = context?.user;
    const { id: projectId } = useParams() as { id: string };
    const [activeTab, setActiveTab] = useState<'library' | 'generated'>('library');
    const [activeLibraryArticle, setActiveLibraryArticle] = useState(0);
    const [activeGeneratedArticle, setActiveGeneratedArticle] = useState(0);
    const [libraryData, setLibraryData] = useState<any[]>([]);
    const [generatedData, setGeneratedData] = useState<any[]>([]);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [localEdit, setLocalEdit] = useState<any>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [unlockingSingle, setUnlockingSingle] = useState(false);

    // Lógica de Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const currentData = activeTab === 'library' ? libraryData : generatedData;
    const activeArticleIdx = activeTab === 'library' ? activeLibraryArticle : activeGeneratedArticle;
    const setActiveArticleIdx = activeTab === 'library' ? setActiveLibraryArticle : setActiveGeneratedArticle;

    const totalPages = Math.ceil(currentData.length / itemsPerPage);
    const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showUnlockConfirmModal, setShowUnlockConfirmModal] = useState(false);
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [linkedArticles, setLinkedArticles] = useState<Article[]>([]);

    const loadLocalData = async () => {
        if (!projectId) return;
        setLoadingLocal(true);
        try {
            const [pages, articles, project] = await Promise.all([
                api.getPages(),
                api.getArticlesByProject(projectId),
                api.getProjectById(projectId)
            ]);

            const projectPages = pages.filter(p => String(p.projectId) === String(projectId));
            setLinkedPages(projectPages);
            
            const projectArts = articles.filter(a => 
                String(a.projectId) === String(projectId) || 
                (project?.masterParentId && String(a.projectId) === String(project.masterParentId)) ||
                projectPages.some(p => String(p.id) === String(a.pageId))
            );
            setLinkedArticles(projectArts);

            const jsonContent = contentData || [];
            
            // 1. Contenidos Generados (isGenerated: true)
            const generated = projectArts
                .filter(a => a.isGenerated)
                .map(a => ({
                    id: a.id,
                    title: a.title,
                    strategy: a.psychologicalStrategy?.focus || a.description || '',
                    keyword: a.keyword || a.psychologicalStrategy?.keyword || '',
                    searchVolume: a.psychologicalStrategy?.searchVolume || '',
                    isFromDb: true,
                    isGenerated: true,
                    isUnlocked: true,
                    slug: a.slug,
                    updatedAt: a.updatedAt,
                    createdAt: a.createdAt
                }))
                .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

            setGeneratedData(generated);

            // 2. Biblioteca (Manuales + Sugerencias del JSON)
            const manualFromDb = projectArts
                .filter(a => !a.isGenerated)
                .map(a => ({
                    id: a.id,
                    title: a.title,
                    strategy: a.psychologicalStrategy?.focus || a.description || '',
                    keyword: a.keyword || a.psychologicalStrategy?.keyword || '',
                    searchVolume: a.psychologicalStrategy?.searchVolume || '',
                    isFromDb: true,
                    isGenerated: false,
                    isUnlocked: !!a.isUnlocked,
                    slug: a.slug,
                    updatedAt: a.updatedAt,
                    createdAt: a.createdAt
                }));

            // Filtrar sugerencias del JSON que ya existen en la DB (por título o keyword)
            const suggestions = jsonContent.filter(j => 
                !manualFromDb.some(m => m.title === j.title || m.keyword === j.keyword)
            ).map(j => ({ ...j, isUnlocked: true }));

            setLibraryData([...manualFromDb, ...suggestions]);

        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLocal(false);
        }
    };

    useEffect(() => {
        loadLocalData();
    }, [projectId, contentData]);

    useEffect(() => {
        const active = currentData[activeArticleIdx];
        // Solo permitimos editar si es de DB, no está generado y está DESBLOQUEADO
        if (active && active.isFromDb && !active.isGenerated && active.isUnlocked !== false) {
            setLocalEdit({
                title: active.title,
                strategy: active.strategy,
                keyword: active.keyword,
                searchVolume: active.searchVolume
            });
        } else {
            setLocalEdit(null);
        }
    }, [activeArticleIdx, activeTab, currentData]);

    const handleBlurSave = async () => {
        const active = currentData[activeArticleIdx];
        if (!localEdit || !active?.id || String(active.id).startsWith('available-') || active.isUnlocked === false) return;

        // Evitar guardado si no hay cambios reales
        if (
            localEdit.title === active.title && 
            localEdit.strategy === active.strategy && 
            localEdit.keyword === (active.keyword || '') && 
            localEdit.searchVolume === (active.searchVolume || 0)
        ) return;

        try {
            await api.updateArticle(active.id, {
                title: localEdit.title,
                psychologicalStrategy: {
                    focus: localEdit.strategy,
                    keyword: localEdit.keyword,
                    searchVolume: localEdit.searchVolume,
                    targetUrl: ""
                }
            } as any);
        } catch (e) {
            console.error("Blur save error:", e);
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        // 1. Actualizar estado de edición local
        const newEdit = { ...localEdit, [field]: value };
        setLocalEdit(newEdit);

        // 2. Actualizar UI inmediatamente para que las pestañas cambien al escribir
        if (activeTab === 'library') {
            const updated = [...libraryData];
            const active = updated[activeLibraryArticle];
            if (active) {
                updated[activeLibraryArticle] = {
                    ...active,
                    [field === 'strategy' ? 'strategy' : field]: value
                };
                setLibraryData(updated);
            }
        } else {
            const updated = [...generatedData];
            const active = updated[activeGeneratedArticle];
            if (active) {
                updated[activeGeneratedArticle] = {
                    ...active,
                    [field === 'strategy' ? 'strategy' : field]: value
                };
                setGeneratedData(updated);
            }
        }
    };

    useEffect(() => {
        const active = currentData[activeArticleIdx];
        // Bloqueo de seguridad: No auto-guardar si no hay edición local, si no hay ID, o si es un ID de biblioteca maestra
        if (!localEdit || !active?.id || String(active.id).startsWith('available-') || active.isUnlocked === false) return;
        
        // Evitar guardado si no hay cambios reales
        if (
            localEdit.title === active.title && 
            localEdit.strategy === active.strategy && 
            localEdit.keyword === (active.keyword || '') && 
            localEdit.searchVolume === (active.searchVolume || 0)
        ) return;

        const timer = setTimeout(async () => {
            try {
                await api.updateArticle(active.id, {
                    title: localEdit.title,
                    psychologicalStrategy: {
                        focus: localEdit.strategy,
                        keyword: localEdit.keyword,
                        searchVolume: localEdit.searchVolume,
                        targetUrl: ""
                    }
                } as any);
                
                // Actualizar localmente los datos
                if (activeTab === 'library') {
                    const updated = [...libraryData];
                    const idx = updated.findIndex(a => a.id === active.id);
                    if (idx !== -1) {
                        updated[idx] = {
                            ...updated[idx],
                            title: localEdit.title,
                            strategy: localEdit.strategy,
                            keyword: localEdit.keyword,
                            searchVolume: localEdit.searchVolume
                        };
                        setLibraryData(updated);
                    }
                } else {
                    const updated = [...generatedData];
                    const idx = updated.findIndex(a => a.id === active.id);
                    if (idx !== -1) {
                        updated[idx] = {
                            ...updated[idx],
                            title: localEdit.title,
                            strategy: localEdit.strategy,
                            keyword: localEdit.keyword,
                            searchVolume: localEdit.searchVolume
                        };
                        setGeneratedData(updated);
                    }
                }
            } catch (e) {
                console.error("Auto-save error:", e);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [localEdit]);

    const handleAddManual = async () => {
        if (!projectId) return;
        if (window.confirm("¿Deseas crear una nueva estrategia de contenido?")) {
            setLoadingLocal(true);
            try {
                const newItem = {
                    projectId: projectId,
                    title: "Nuevo Contenido",
                    isGenerated: false,
                    status: 'draft',
                    psychologicalStrategy: {
                        focus: "Describe el enfoque aquí...",
                        keyword: "Keyword...",
                        searchVolume: "0",
                        targetUrl: ""
                    }
                };
                await api.saveArticle(newItem as any);
                await loadLocalData();
                setActiveArticle(0); // Seleccionar el nuevo (que estará al principio)
            } catch (e: any) {
                alert("Error: " + e.message);
            } finally {
                setLoadingLocal(false);
            }
        }
    };

    const handleSelectOne = (idx: number) => {
        const globalIdx = (currentPage - 1) * itemsPerPage + idx;
        setActiveArticleIdx(globalIdx);
        setActiveArticle(globalIdx);
    };

    const handleCloseAndReload = () => {
        setShowGeneratorModal(false);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('section', 'content');
        currentUrl.hash = 'psd-content-anchor';
        window.location.replace(currentUrl.toString());
        window.location.reload();
    };

    const handleUnlockArticle = async () => {
        const active = currentData[activeArticleIdx];
        if (!active || !active.id || !String(active.id).startsWith('available-')) return;
        
        setShowUnlockConfirmModal(false);
        const masterId = active.id.replace('available-', '');
        setUnlockingSingle(true);
        try {
            await api.unlockArticle(projectId!, masterId);
            await loadLocalData();
            alert("¡Artículo desbloqueado con éxito!");
        } catch (e: any) {
            alert("Error al desbloquear: " + e.message);
        } finally {
            setUnlockingSingle(false);
        }
    };

    const handleDeleteArticle = async () => {
        const active = currentData[activeArticleIdx];
        if (!active || !active.id) return;

        const isGenerated = active.isGenerated;
        const isAdmin = user?.role === 'admin';

        if (!isAdmin && isGenerated) {
            setShowRestrictionModal(true);
            return;
        }

        if (window.confirm("¿Deseas eliminar este artículo? No se puede recuperar")) {
            setLoadingLocal(true);
            try {
                await api.deleteArticle(active.id);
                await loadLocalData();
                setActiveArticleIdx(0);
                alert("Artículo eliminado correctamente.");
            } catch (e: any) {
                alert("Error al eliminar: " + e.message);
            } finally {
                setLoadingLocal(false);
            }
        }
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
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-purple-500 pl-8 py-2">
                        Los activos digitales son la clave de la libertad financiera. No basta con pagar anuncios; necesitas crear una red de contenidos que trabajen por ti 24/7.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-rose-500/30"></div>
                    <div 
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                    >
                        <iframe 
                            className="w-full h-full rounded-2xl"
                            src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            <div id="psd-content-anchor" className="scroll-mt-24"></div>
            {loadingLocal ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
                <div id="psd-content-grid" className="grid lg:grid-cols-12 gap-8">
                    <div id="psd-content-list-col" className="lg:col-span-5 space-y-6">
                        <div id="psd-content-list-card" className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col shadow-xl">
                            <div className="flex items-center justify-between gap-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400 border border-purple-900/50">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white">Estrategias Sugeridas</h4>
                                        <p className="text-sm text-gray-400">Selecciona la que desees redactar.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleAddManual}
                                    className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500 hover:text-white transition-all group"
                                    title="Añadir Manualmente"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Barra de Progreso de Artículos */}
                            <div className="w-full mb-6">
                                <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full shadow-inner">
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Artículos Desbloqueados</span>
                                        <span className="text-white font-bold">{articleCount} / {maxArticles}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full transition-all duration-1000 ease-out shadow-lg bg-purple-500" style={{ width: `${usagePercent}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Selector de Pestañas */}
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-6">
                                <button 
                                    onClick={() => setActiveTab('library')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'library' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Biblioteca de Contenidos
                                </button>
                                <button 
                                    onClick={() => setActiveTab('generated')}
                                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'generated' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Contenidos Generados
                                </button>
                            </div>
                            
                            <div id="psd-content-items-list" className="space-y-4 flex-1">
                                {paginatedData.map((art: any, indexInPage: number) => {
                                    const globalIdx = (currentPage - 1) * itemsPerPage + indexInPage;
                                    const isSelected = selectedArticles.includes(globalIdx);
                                    const isActive = activeArticleIdx === globalIdx;
                                    const isGenerated = art.isGenerated;
                                    const isUnlocked = art.isUnlocked !== false;

                                    return (
                                        <div 
                                            key={art.id || `merged-${indexInPage}`} 
                                            onClick={() => handleSelectOne(globalIdx)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isGenerated ? 'bg-emerald-600 border-emerald-500 text-white' : isSelected ? 'bg-blue-600 border-blue-500 text-white' : isActive ? 'bg-purple-900/20 border-purple-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'} ${!isUnlocked ? 'opacity-60 grayscale' : ''}`}
                                        >
                                            <div className="flex-1">
                                                <h4 className={`font-medium text-lg leading-snug ${isGenerated || isSelected ? 'text-white' : isActive ? 'text-purple-300' : 'text-gray-300 group-hover:text-white'} flex items-center gap-2`}>
                                                    {!isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
                                                    {art.title}
                                                </h4>
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
                    <div id="psd-content-detail-card" className="lg:col-span-7 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/10 border border-gray-800 rounded-2xl p-8 flex flex-col relative overflow-hidden h-full min-h-[500px] shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Target className="w-40 h-40 text-purple-500" /></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            {currentData[activeArticleIdx] ? (
                                currentData[activeArticleIdx].isUnlocked === false && !isRealAdmin ? (
                                    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/10 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Lock className="w-40 h-40 text-purple-500" /></div>
                                        
                                        {/* Barra de Progreso Centrada (Solo en vista bloqueada) */}
                                        <div className="w-full flex justify-center mb-10">
                                            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full max-w-md shadow-inner">
                                                <div className="flex justify-between items-center mb-2 text-sm">
                                                    <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Artículos Desbloqueados</span>
                                                    <span className="text-white font-bold">{articleCount} / {maxArticles}</span>
                                                </div>
                                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                                    <div className="h-full transition-all duration-1000 ease-out shadow-lg bg-purple-500" style={{ width: `${usagePercent}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full text-left mb-8">
                                            <h3 className="text-white mb-6 font-medium tracking-tight" style={{ fontSize: '1.6rem', lineHeight: '2.2rem' }}>{currentData[activeArticleIdx].title}</h3>
                                            
                                            <div className="bg-purple-500/5 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm mb-8">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Brain className="w-5 h-5 text-purple-400" />
                                                    <span className="text-white font-bold text-xs uppercase tracking-widest">Enfoque Estratégico</span>
                                                </div>
                                                <p className="text-white text-lg font-light leading-relaxed">
                                                    {currentData[activeArticleIdx].strategy}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 shadow-lg animate-pulse">
                                            <Lock className="w-10 h-10 text-purple-500" />
                                        </div>

                                        <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Artículos Disponibles para Desbloquear</h4>
                                        <p className="text-white font-medium leading-relaxed max-w-md mx-auto mb-10" style={{ fontSize: '1.1rem' }}>Nuestro sistema ha generado este Artículo Estratégico por ti. Haz clic en Desbloquear para ver todo el contenido.</p>

                                        <button 
                                            onClick={() => setShowUnlockConfirmModal(true)}
                                            disabled={unlockingSingle}
                                            className="w-full py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-purple-900/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-70"
                                        >
                                            {unlockingSingle ? <Loader2 className="w-6 h-6 animate-spin" /> : <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                                            {unlockingSingle ? 'Desbloqueando...' : 'Desbloquear Artículo'}
                                        </button>
                                        
                                        <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                            <Shield className="w-3 h-3" /> Acceso Instantáneo tras Desbloqueo
                                        </div>
                                    </div>
                                ) : (
                                <>
                                <div className="mb-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-purple-500/10 text-purple-300 border-purple-500/20">
                                            {currentData[activeArticleIdx].isFromDb && !currentData[activeArticleIdx].isGenerated ? 'Estrategia Manual' : 'Análisis de IA'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {currentData[activeArticleIdx]?.isGenerated && (
                                                <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                    <Check className="w-3 h-3" /> Generado
                                                </span>
                                            )}
                                            {currentData[activeArticleIdx]?.id && !String(currentData[activeArticleIdx].id).startsWith('available-') && (
                                                <button 
                                                    onClick={handleDeleteArticle}
                                                    className="p-1.5 text-gray-500 hover:text-red-500 transition-colors bg-white/5 hover:bg-red-500/10 rounded-lg border border-white/10 hover:border-red-500/20"
                                                    title="Eliminar Artículo"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {editingField === 'title' ? (
                                        <input 
                                            autoFocus
                                            type="text"
                                            value={localEdit?.title || ''}
                                            onChange={(e) => handleFieldChange('title', e.target.value)}
                                            onBlur={() => { setEditingField(null); handleBlurSave(); }}
                                            className="w-full bg-black/40 border border-purple-500/50 rounded-xl px-4 py-2 text-3xl md:text-4xl font-bold text-white mb-6 outline-none"
                                        />
                                    ) : (
                                        <h3 
                                            onClick={() => setEditingField('title')}
                                            className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight cursor-pointer hover:text-purple-300 transition-colors"
                                        >
                                            {localEdit?.title || currentData[activeArticleIdx]?.title}
                                        </h3>
                                    )}

                                    <div className="bg-black/40 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm mb-6">
                                        <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-purple-400"/> Enfoque Estratégico del Artículo
                                        </h5>
                                        <div className="max-h-[180px] overflow-y-auto custom-scrollbar">
                                            {editingField === 'strategy' ? (
                                                <textarea 
                                                    autoFocus
                                                    value={localEdit?.strategy || ''}
                                                    onChange={(e) => handleFieldChange('strategy', e.target.value)}
                                                    onBlur={() => { setEditingField(null); handleBlurSave(); }}
                                                    className="w-full bg-transparent text-gray-300 text-xl leading-relaxed font-light outline-none resize-none min-h-[100px]"
                                                />
                                            ) : (
                                                <p 
                                                    onClick={() => setEditingField('strategy')}
                                                    className="text-gray-300 text-xl leading-relaxed font-light cursor-pointer hover:text-white transition-colors"
                                                >
                                                    {localEdit?.strategy || currentData[activeArticleIdx]?.strategy}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div 
                                            className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group cursor-help relative" 
                                            onMouseEnter={(e) => handleTooltipHover(e, ["Este artículo aparecerá en Google cuando tu cliente busque exactamente esta frase."])} 
                                            onMouseLeave={handleTooltipLeave}
                                        >
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
                                                <Search className="w-3 h-3"/> Keyword SEO
                                            </p>
                                            {editingField === 'keyword' ? (
                                                <input 
                                                    autoFocus
                                                    type="text"
                                                    value={localEdit?.keyword || ''}
                                                    onChange={(e) => handleFieldChange('keyword', e.target.value)}
                                                    onBlur={() => { setEditingField(null); handleBlurSave(); }}
                                                    className="w-full bg-transparent text-purple-300 font-bold text-lg text-center outline-none"
                                                />
                                            ) : (
                                                <p 
                                                    onClick={() => setEditingField('keyword')}
                                                    className="text-purple-300 font-bold text-lg leading-tight break-words cursor-pointer hover:text-purple-100 transition-colors"
                                                >
                                                    {localEdit?.keyword || currentData[activeArticleIdx]?.keyword}
                                                </p>
                                            )}
                                        </div>

                                        <div 
                                            className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group cursor-help relative" 
                                            onMouseEnter={(e) => handleTooltipHover(e, ["Indica cuántas personas buscan esta frase al mes en promedio."])} 
                                            onMouseLeave={handleTooltipLeave}
                                        >
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
                                                <BarChart className="w-3 h-3"/> Vol. Búsqueda
                                            </p>
                                            {editingField === 'searchVolume' ? (
                                                <input 
                                                    autoFocus
                                                    type="text"
                                                    value={localEdit?.searchVolume || ''}
                                                    onChange={(e) => handleFieldChange('searchVolume', e.target.value)}
                                                    onBlur={() => { setEditingField(null); handleBlurSave(); }}
                                                    className="w-full bg-transparent text-emerald-300 font-bold text-lg text-center outline-none"
                                                />
                                            ) : (
                                                <p 
                                                    onClick={() => setEditingField('searchVolume')}
                                                    className="text-emerald-300 font-bold text-lg leading-tight break-words cursor-pointer hover:text-emerald-100 transition-colors"
                                                >
                                                    {localEdit?.searchVolume || currentData[activeArticleIdx]?.searchVolume || 'N/A'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                                    {currentData[activeArticleIdx]?.isGenerated ? (
                                        <>
                                            <a href={`/admin/lp/${linkedPages[0]?.subdomain?.split('.')[0] || 'page'}/blog/${currentData[activeArticleIdx]?.slug}`} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 hover:scale-[1.02]"><Eye className="w-6 h-6" /> Ver Artículo Online</a>
                                            <a href={window.location.hash.startsWith('#/') ? `#/dashboard/articles/edit/${currentData[activeArticleIdx]?.id}` : `/dashboard/articles/edit/${currentData[activeArticleIdx]?.id}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"><PenTool className="w-4 h-4" /> Editar Contenido Profesional</a>
                                        </>
                                    ) : (
                                        isAtLimit ? (
                                            <button onClick={onUpgrade} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02]"><Crown className="w-6 h-6 fill-current" /> Límite Alcanzado: Subir a PRO</button>
                                        ) : (
                                            <button onClick={() => setShowConfirmModal(true)} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-orange-900/20 hover:scale-[1.02]`}><PenTool className="w-6 h-6" /> Escribir Artículo Seleccionado</button>
                                        )
                                    )}
                                </div>
                                </>
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
                                    <FileText className="w-16 h-16 text-gray-600" />
                                    <p className="text-gray-500 font-medium">Selecciona una estrategia para ver los detalles</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showUnlockConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowUnlockConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-purple-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-rose-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-3xl flex items-center justify-center mx-auto border border-purple-500/20 shadow-lg shadow-purple-900/10 animate-pulse"><Sparkles className="w-10 h-10" /></div>
                                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                    Confirmar Consumo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Créditos</span>
                                </h1>
                                <p className="text-white text-lg leading-relaxed font-normal">
                                    Al desbloquear este artículo estratégico se consumirá 1 crédito de tu plan actual.
                                </p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-inner text-left">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Créditos de Artículos</span>
                                    <span className="text-white font-bold text-sm">{articleCount} / {isRealAdmin ? '∞' : maxArticles}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
                                    <div className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (articleCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                            <button onClick={() => setShowUnlockConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button>
                            <button onClick={handleUnlockArticle} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Desbloquear</button>
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
                                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                    Generador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Artículos SEO</span>
                                </h1>
                                <p className="text-white text-lg leading-relaxed font-normal">
                                    Genera artículos optimizados para buscadores que atraen tráfico orgánico a tus ofertas las 24 horas. Ten en cuenta que esta acción consumirá créditos de generación de tu plan.
                                </p>
                            </div>
                            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-inner text-left">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Consumo de Artículos</span>
                                    <span className="text-white font-bold text-sm">{articleCount} / {isRealAdmin ? '∞' : maxArticles}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
                                    <div className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (articleCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button><button onClick={() => { setShowConfirmModal(false); setShowGeneratorModal(true); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Redactar</button></div>
                    </div>
                </div>
            )}

            {showGeneratorModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in" onClick={handleCloseAndReload}>
                    <div className="w-full max-w-[1200px] h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl relative border border-white/10 custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <ContentGenerator 
                            preFilledData={{
                                topic: currentData[activeArticleIdx]?.title || '',
                                objective: currentData[activeArticleIdx]?.strategy || '',
                                keyword: currentData[activeArticleIdx]?.keyword || '',
                                pageId: linkedPages[0]?.id || '',
                                articleId: currentData[activeArticleIdx]?.id
                            }}
                            embeddedProjectId={projectId}
                            onClose={handleCloseAndReload}
                            onSave={async (article) => {
                                if (article.id) {
                                    await api.updateArticle(article.id, article);
                                } else {
                                    await api.saveArticle(article);
                                }
                                handleCloseAndReload();
                            }}
                        />
                    </div>
                </div>
            )}

            <DeletionRestrictionModal 
                isOpen={showRestrictionModal}
                onClose={() => setShowRestrictionModal(false)}
                itemName={currentData[activeArticleIdx]?.title || 'Artículo'}
                userEmail={user?.email || ''}
                userName={user?.name || ''}
            />
        </div>
    );
};