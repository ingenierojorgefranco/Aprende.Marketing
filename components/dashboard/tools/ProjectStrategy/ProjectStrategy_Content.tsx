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

    // Nuevas props para modo embebido
    hideHeader?: boolean;
    onArticleSelect?: (article: any) => void;
    isEmbedded?: boolean;
    embeddedProjectId?: string;
}

const formatRelativeTime = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace unos segundos';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    return d.toLocaleDateString();
};

export const ProjectStrategy_Content: React.FC<ProjectStrategy_ContentProps> = ({
    contentData, activeArticle, setActiveArticle, selectedArticles, toggleArticleSelection, handleTooltipHover, handleTooltipLeave, onUpgrade,
    articleCount = 0, planLimits, nextPlan, isSimulating = false,
    hideHeader = false, onArticleSelect, isEmbedded = false, embeddedProjectId
}) => {
    const [activeTab, setActiveTab] = useState<'library' | 'generated'>('library');
    const navigate = useNavigate();
    const context = useOutletContext() as any;
    const user = context?.user;
    const { id: routeProjectId } = useParams() as { id: string };
    const projectId = embeddedProjectId || routeProjectId;
    const isRealAdmin = (user?.role === 'admin' || user?.email === 'jackfort@gmail.com') || (planLimits?.planName === 'admin' && !isSimulating);
    
    console.log(">>> ProjectStrategy_Content Rendering", { activeArticle, activeTab, isRealAdmin });
    console.log(">>> Project Info:", { projectId, userEmail: user?.email });
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

    const loadLocalData = async (targetTitle?: string) => {
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
                    searchIntent: a.psychologicalStrategy?.searchIntent || '',
                    isFromDb: true,
                    isGenerated: true,
                    isUnlocked: true,
                    slug: a.slug,
                    updatedAt: a.updatedAt,
                    createdAt: a.createdAt,
                    unlockedAt: a.unlockedAt,
                    publishedAt: a.publishedAt
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
                    searchIntent: a.psychologicalStrategy?.searchIntent || '',
                    isFromDb: true,
                    isGenerated: false,
                    isUnlocked: !!a.isUnlocked,
                    slug: a.slug,
                    updatedAt: a.updatedAt,
                    createdAt: a.createdAt,
                    unlockedAt: a.unlockedAt,
                    publishedAt: a.publishedAt
                }))
                .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

            // Filtrar sugerencias del JSON que ya existen en la DB (por título o keyword)
            // Guardamos el índice original para poder editar/eliminar en el JSON del proyecto
            const suggestions = jsonContent.map((j, originalIdx) => ({
                ...j,
                jsonIndex: originalIdx,
                id: `json-${originalIdx}`,
                isUnlocked: false,
                isFromDb: false,
                isGenerated: false
            })).filter(j => 
                !manualFromDb.some(m => m.title === j.title || m.keyword === j.keyword)
            );

            const newLibrary = [...manualFromDb, ...suggestions];
            setLibraryData(newLibrary);

            if (targetTitle) {
                const newIdx = newLibrary.findIndex(a => a.title === targetTitle);
                if (newIdx !== -1) {
                    setActiveLibraryArticle(newIdx);
                    // Asegurarnos de que estamos en la página correcta
                    const newPage = Math.floor(newIdx / itemsPerPage) + 1;
                    setCurrentPage(newPage);
                }
            }

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
        if (active) {
            setLocalEdit({
                title: active.title,
                strategy: active.strategy,
                keyword: active.keyword,
                searchVolume: active.searchVolume,
                searchIntent: active.searchIntent || ''
            });
        } else {
            setLocalEdit(null);
        }
    }, [activeArticleIdx, activeTab, currentData]);

    const saveJsonArticle = async (jsonIndex: number, updatedData: any) => {
        if (!projectId) return;
        try {
            const project = await api.getProjectById(projectId);
            if (!project || !project.strategy_json) return;

            const strategy = { ...project.strategy_json };
            if (!strategy.modules) strategy.modules = {};
            if (!strategy.modules.content) strategy.modules.content = [];

            // Actualizar el elemento en el índice original
            strategy.modules.content[jsonIndex] = {
                ...strategy.modules.content[jsonIndex],
                title: updatedData.title,
                strategy: updatedData.strategy,
                keyword: updatedData.keyword,
                searchVolume: updatedData.searchVolume,
                searchIntent: updatedData.searchIntent
            };

            await api.updateProject(projectId, { ...project, strategy_json: strategy } as any);
        } catch (e) {
            console.error("Error saving JSON article:", e);
            throw e;
        }
    };

    const handleBlurSave = async (overrideData?: any) => {
        const active = currentData[activeArticleIdx];
        const dataToSave = overrideData || localEdit;
        
        console.log(">>> handleBlurSave Attempt", { 
            id: active?.id, 
            dataToSave, 
            isFromDb: active?.isFromDb,
            activeIntent: active?.searchIntent
        });
        
        if (!dataToSave || !active?.id) {
            console.warn(">>> handleBlurSave: No data or ID", { dataToSave, activeId: active?.id });
            return;
        }
        
        if ((String(active.id).startsWith('available-') && !isRealAdmin) || (active.isUnlocked === false && !isRealAdmin)) {
            console.warn(">>> handleBlurSave: Permissions restriction");
            return;
        }

        // Evitar guardado si no hay cambios reales
        const hasChanges = 
            dataToSave.title !== active.title || 
            dataToSave.strategy !== active.strategy || 
            dataToSave.keyword !== (active.keyword || '') || 
            String(dataToSave.searchVolume) !== String(active.searchVolume || 0) ||
            dataToSave.searchIntent !== (active.searchIntent || '');

        if (!hasChanges) {
            console.log(">>> handleBlurSave: No changes detected");
            return;
        }

        console.log(">>> handleBlurSave: Proceeding to save...");

        try {
            if (active.isFromDb) {
                await api.updateArticle(active.id, {
                    title: dataToSave.title,
                    psychologicalStrategy: {
                        focus: dataToSave.strategy,
                        keyword: dataToSave.keyword,
                        searchVolume: dataToSave.searchVolume,
                        searchIntent: dataToSave.searchIntent,
                        targetUrl: ""
                    }
                } as any);
            } else if (typeof active.jsonIndex === 'number') {
                await saveJsonArticle(active.jsonIndex, dataToSave);
            }

            // Actualizar localmente los datos para que la UI refleje el cambio
            if (activeTab === 'library') {
                const updated = [...libraryData];
                const idx = updated.findIndex(a => String(a.id) === String(active.id));
                if (idx !== -1) {
                    updated[idx] = {
                        ...updated[idx],
                        title: dataToSave.title,
                        strategy: dataToSave.strategy,
                        keyword: dataToSave.keyword,
                        searchVolume: dataToSave.searchVolume,
                        searchIntent: dataToSave.searchIntent
                    };
                    setLibraryData(updated);
                }
            } else {
                const updated = [...generatedData];
                const idx = updated.findIndex(a => String(a.id) === String(active.id));
                if (idx !== -1) {
                    updated[idx] = {
                        ...updated[idx],
                        title: dataToSave.title,
                        strategy: dataToSave.strategy,
                        keyword: dataToSave.keyword,
                        searchVolume: dataToSave.searchVolume,
                        searchIntent: dataToSave.searchIntent
                    };
                    setGeneratedData(updated);
                }
            }
        } catch (e) {
            console.error("Blur save error:", e);
        }
    };

    const handleSearchIntentChange = (val: string) => {
        console.log(">>> handleSearchIntentChange:", val);
        const active = currentData[activeArticleIdx];
        if (!active) {
            console.error(">>> handleSearchIntentChange: No active article");
            return;
        }

        const baseData = localEdit || {
            title: active.title,
            strategy: active.strategy,
            keyword: active.keyword || '',
            searchVolume: active.searchVolume || 0,
            searchIntent: active.searchIntent || ''
        };

        const updatedData = { ...baseData, searchIntent: val };
        setLocalEdit(updatedData);
        handleBlurSave(updatedData);
    };

    const handleFieldChange = (field: string, value: any) => {
        // Actualizar solo el estado de edición local mientras el usuario escribe
        const active = currentData[activeArticleIdx];
        const baseData = localEdit || {
            title: active?.title || '',
            strategy: active?.strategy || '',
            keyword: active?.keyword || '',
            searchVolume: active?.searchVolume || 0,
            searchIntent: active?.searchIntent || ''
        };
        const newEdit = { ...baseData, [field]: value };
        console.log(`>>> handleFieldChange [${field}]:`, value);
        setLocalEdit(newEdit);
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
            localEdit.searchVolume === (active.searchVolume || 0) &&
            localEdit.searchIntent === (active.searchIntent || '')
        ) return;

        const timer = setTimeout(async () => {
            console.log("Auto-saving article data (timer):", { id: active?.id, localEdit });
            try {
                if (active.isFromDb) {
                    await api.updateArticle(active.id, {
                        title: localEdit.title,
                        psychologicalStrategy: {
                            focus: localEdit.strategy,
                            keyword: localEdit.keyword,
                            searchVolume: localEdit.searchVolume,
                            searchIntent: localEdit.searchIntent,
                            targetUrl: ""
                        }
                    } as any);
                } else if (typeof active.jsonIndex === 'number') {
                    await saveJsonArticle(active.jsonIndex, localEdit);
                }
                
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
                            searchVolume: localEdit.searchVolume,
                            searchIntent: localEdit.searchIntent
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
                            searchVolume: localEdit.searchVolume,
                            searchIntent: localEdit.searchIntent
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
                    isUnlocked: true,
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
                setCurrentPage(1);
                setActiveLibraryArticle(0);
                setActiveArticle(0); // Seleccionar el nuevo (que estará al principio)
            } catch (e: any) {
                alert("Error: " + e.message);
            } finally {
                setLoadingLocal(false);
            }
        }
    };

    const handleSelectOne = (globalIdx: number) => {
        setActiveArticleIdx(globalIdx);
        setActiveArticle(globalIdx);
    };

    const handleCloseAndReload = async () => {
        setShowGeneratorModal(false);
        await loadLocalData();
        setActiveTab('generated');
        setActiveGeneratedArticle(0);
        setCurrentPage(1);
        
        // Actualizar URL sin recargar para mantener la posición y estado
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('section', 'content');
        currentUrl.hash = 'psd-content-anchor';
        window.history.pushState({}, '', currentUrl.toString());

        // Scroll suave al ancla de contenido
        setTimeout(() => {
            const anchor = document.getElementById('psd-content-anchor');
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleUnlockArticle = async () => {
        const active = currentData[activeArticleIdx];
        if (!active || !active.id) return;
        
        setShowUnlockConfirmModal(false);
        const targetTitle = active.title;
        setUnlockingSingle(true);
        try {
            if (String(active.id).startsWith('available-')) {
                const masterId = active.id.replace('available-', '');
                await api.unlockArticle(projectId!, masterId);
            } else if (String(active.id).startsWith('json-')) {
                // Para sugerencias del JSON, las "desbloqueamos" guardándolas en la DB
                await api.saveArticle({
                    projectId: projectId!,
                    title: active.title,
                    description: active.strategy || '',
                    keyword: active.keyword || '',
                    isUnlocked: true,
                    isGenerated: false,
                    status: 'draft',
                    psychologicalStrategy: {
                        focus: active.strategy || '',
                        keyword: active.keyword || '',
                        searchVolume: String(active.searchVolume || '0'),
                        targetUrl: ''
                    }
                } as any);
            }
            await loadLocalData(targetTitle);
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
        const isUnlocked = active.isUnlocked;
        const isAdmin = user?.role === 'admin';

        if (!isAdmin && (isGenerated || isUnlocked)) {
            setShowRestrictionModal(true);
            return;
        }

        if (window.confirm("¿Deseas eliminar este artículo? No se puede recuperar")) {
            setLoadingLocal(true);
            try {
                if (active.isFromDb) {
                    await api.deleteArticle(active.id);
                } else if (typeof active.jsonIndex === 'number') {
                    // Lógica para eliminar del JSON del proyecto
                    const project = await api.getProjectById(projectId!);
                    if (project && project.strategy_json) {
                        const strategy = { ...project.strategy_json };
                        if (strategy.modules && strategy.modules.content) {
                            strategy.modules.content.splice(active.jsonIndex, 1);
                            await api.updateProject(projectId!, { ...project, strategy_json: strategy } as any);
                        }
                    }
                }
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

    const maxArticles = planLimits?.maxArticles || 2;
    const currentArticleCount = linkedArticles.filter(a => a.isGenerated || a.isUnlocked).length;
    const isAtLimit = !isRealAdmin && !api.isUsingMockData() && currentArticleCount >= maxArticles;

    const usagePercent = Math.min(100, (currentArticleCount / maxArticles) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    return (
        <div className="space-y-16">
            {!hideHeader && (
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
                                src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            <div id="psd-content-anchor" className={`scroll-mt-24 ${hideHeader ? 'pt-4' : ''}`}></div>
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
                                        <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Artículos Generados/Desbloqueados</span>
                                        <span className="text-white font-bold">{currentArticleCount} / {maxArticles}</span>
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
                                    const isUnlockedButNotGenerated = isUnlocked && !isGenerated;

                                    return (
                                        <div 
                                            key={art.id || `merged-${indexInPage}`} 
                                            onClick={() => handleSelectOne(globalIdx)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${isGenerated ? 'bg-emerald-600 border-emerald-500 text-white' : isSelected ? 'bg-blue-600 border-blue-500 text-white' : isUnlockedButNotGenerated ? (isActive ? 'bg-yellow-500/20 border-yellow-500 translate-x-2' : 'bg-yellow-500/10 border-yellow-500/50') : isActive ? 'bg-purple-900/20 border-purple-500/50 translate-x-2' : 'bg-black/20 border-gray-800 hover:border-gray-700'} ${!isUnlocked ? 'opacity-60 grayscale' : ''}`}
                                        >
                                            <div className="flex-1">
                                                <h4 className={`font-medium text-lg leading-snug ${isGenerated || isSelected ? 'text-white' : isUnlockedButNotGenerated ? (isActive ? 'text-yellow-300' : 'text-yellow-400/80') : isActive ? 'text-purple-300' : 'text-gray-300 group-hover:text-white'} flex items-center gap-2`}>
                                                    {!isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
                                                    {art.title}
                                                </h4>
                                                {art.unlockedAt && (
                                                    <p className="text-[0.9em] font-bold opacity-60 mt-1 pt-[10px]">
                                                        Desbloqueado: {formatRelativeTime(art.unlockedAt)}
                                                    </p>
                                                )}
                                                {isGenerated && (
                                                    <p className="text-[0.9em] font-bold opacity-60 mt-1">
                                                        Redactado: {formatRelativeTime(art.publishedAt || art.updatedAt || art.createdAt)}
                                                    </p>
                                                )}
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
                                    <div className="flex flex-col items-center text-center relative animate-in zoom-in-95 w-full">
                                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Lock className="w-40 h-40 text-purple-500" /></div>
                                        
                                        <div className="w-full text-left mb-8">
                                            <h3 className="text-white mb-6 font-bold transition-colors" style={{ fontSize: '1.6rem', lineHeight: '2rem' }}>{currentData[activeArticleIdx].title}</h3>
                                            
                                            <div className="bg-purple-500/5 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm mb-8">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Brain className="w-5 h-5 text-purple-400" />
                                                    <span className="text-white font-bold text-xs uppercase tracking-widest">Enfoque Estratégico</span>
                                                </div>
                                                <p className="text-white font-light leading-relaxed" style={{ fontSize: '1.1rem' }}>
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
                                            onClick={isAtLimit ? onUpgrade : () => setShowUnlockConfirmModal(true)}
                                            disabled={unlockingSingle}
                                            className={`w-full py-5 rounded-2xl ${isAtLimit ? 'bg-gradient-to-r from-yellow-600 to-orange-600' : 'bg-purple-600 hover:bg-purple-500'} text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-purple-900/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-70`}
                                        >
                                            {unlockingSingle ? <Loader2 className="w-6 h-6 animate-spin" /> : isAtLimit ? <Crown className="w-6 h-6 fill-current" /> : <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                                            {unlockingSingle ? 'Desbloqueando...' : isAtLimit ? 'Límite Alcanzado: Subir a PRO' : 'Desbloquear Artículo'}
                                        </button>
                                        
                                        <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                            <Shield className="w-3 h-3" /> Acceso Instantáneo tras Desbloqueo
                                        </div>
                                    </div>
                                ) : (
                                <>
                                <div className="mb-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        {currentData[activeArticleIdx]?.isGenerated ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                <Check className="w-3 h-3" /> Artículo Generado
                                            </span>
                                        ) : (
                                            <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-purple-500/10 text-purple-300 border-purple-500/20">
                                                Artículos SEO Optimizados
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {/* Removed duplicate badge logic */}
                                        </div>
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
                                        onClick={() => (!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) && setEditingField('title')}
                                        className={`font-bold text-white mb-6 transition-colors ${(!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) ? 'cursor-pointer hover:text-purple-300' : ''}`}
                                        style={{ fontSize: '1.6rem', lineHeight: '2rem' }}
                                    >
                                        {localEdit?.title || currentData[activeArticleIdx]?.title}
                                    </h3>
                                    )}

                                    {localEdit?.strategy && (
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
                                                        onClick={() => (!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) && setEditingField('strategy')}
                                                        className={`text-gray-300 leading-relaxed font-light transition-colors ${(!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) ? 'cursor-pointer hover:text-white' : ''}`}
                                                        style={{ fontSize: '1.1rem' }}
                                                    >
                                                        {localEdit?.strategy || currentData[activeArticleIdx]?.strategy}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div 
                                            className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group" 
                                        >
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
                                                <Brain className="w-3 h-3"/> Intención de Búsqueda
                                            </p>
                                            <select
                                                value={localEdit?.searchIntent || ''}
                                                onChange={(e) => handleSearchIntentChange(e.target.value)}
                                                disabled={currentData[activeArticleIdx]?.isGenerated && !isRealAdmin}
                                                className={`w-full bg-transparent text-purple-300 font-bold text-lg text-center outline-none appearance-none cursor-pointer ${(currentData[activeArticleIdx]?.isGenerated && !isRealAdmin) ? 'disabled:cursor-default' : ''}`}
                                            >
                                                <option value="" className="bg-gray-900 text-gray-400">Seleccionar Intención...</option>
                                                <option value="Inconsciente" className="bg-gray-900 text-white">Inconsciente</option>
                                                <option value="Consciente del Problema" className="bg-gray-900 text-white">Consciente del Problema</option>
                                                <option value="Consciente de la Solución" className="bg-gray-900 text-white">Consciente de la Solución</option>
                                                <option value="Consciente del Producto" className="bg-gray-900 text-white">Consciente del Producto</option>
                                                <option value="Totalmente Consciente" className="bg-gray-900 text-white">Totalmente Consciente</option>
                                            </select>
                                        </div>

                                        {(localEdit?.keyword || isRealAdmin) && (
                                            <div 
                                                className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group" 
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
                                                        onClick={() => (!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) && setEditingField('keyword')}
                                                        className={`text-purple-300 font-bold text-lg leading-tight break-words transition-colors ${(!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) ? 'cursor-pointer hover:text-purple-100' : ''}`}
                                                    >
                                                        {localEdit?.keyword || currentData[activeArticleIdx]?.keyword || (isRealAdmin ? 'Añadir Keyword...' : '')}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {(localEdit?.searchVolume || isRealAdmin) && (
                                            <div 
                                                className="px-4 py-4 bg-gray-800/50 rounded-xl border border-gray-700 w-full text-center group" 
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
                                                        onClick={() => (!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) && setEditingField('searchVolume')}
                                                        className={`text-emerald-300 font-bold text-lg leading-tight break-words transition-colors ${(!currentData[activeArticleIdx]?.isGenerated || isRealAdmin) ? 'cursor-pointer hover:text-emerald-100' : ''}`}
                                                    >
                                                        {localEdit?.searchVolume || currentData[activeArticleIdx]?.searchVolume || (isRealAdmin ? 'Añadir Volumen...' : 'N/A')}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Botón de Acción Reubicado */}
                                        {!currentData[activeArticleIdx]?.isGenerated && (
                                            <div className="pt-2">
                                                {isAtLimit && !currentData[activeArticleIdx]?.isUnlocked ? (
                                                    <button onClick={onUpgrade} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02]"><Crown className="w-6 h-6 fill-current" /> Límite Alcanzado: Subir a PRO</button>
                                                ) : (
                                                    <button 
                                                        onClick={() => {
                                                            if (isEmbedded && onArticleSelect) {
                                                                onArticleSelect(currentData[activeArticleIdx]);
                                                            } else {
                                                                setShowGeneratorModal(true);
                                                            }
                                                        }} 
                                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-orange-900/20 hover:scale-[1.02]`}
                                                    >
                                                        <PenTool className="w-6 h-6" /> Escribir Artículo Seleccionado
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                                    {currentData[activeArticleIdx]?.isGenerated && (
                                        <>
                                            <a href={`/admin/lp/${linkedPages[0]?.subdomain?.split('.')[0] || 'page'}/blog/${currentData[activeArticleIdx]?.slug}`} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 hover:scale-[1.02]"><Eye className="w-6 h-6" /> Ver Artículo de Blog</a>
                                            <a href={window.location.hash.startsWith('#/') ? `#/dashboard/articles/edit/${currentData[activeArticleIdx]?.id}` : `/dashboard/articles/edit/${currentData[activeArticleIdx]?.id}`} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition text-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"><PenTool className="w-6 h-6" /> Editar Artículo de Blog</a>
                                        </>
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
                                    <span className="text-white font-bold text-sm">{currentArticleCount} / {isRealAdmin ? '∞' : maxArticles}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
                                    <div className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (currentArticleCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
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
                                    <span className="text-white font-bold text-sm">{currentArticleCount} / {isRealAdmin ? '∞' : maxArticles}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
                                    <div className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (currentArticleCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button><button onClick={() => { setShowConfirmModal(false); setShowGeneratorModal(true); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Redactar</button></div>
                    </div>
                </div>
            )}

            {showGeneratorModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in !mt-0" onClick={handleCloseAndReload}>
                    <div className="w-full max-w-[90rem] h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl relative border border-white/10 custom-scrollbar !mt-0" onClick={e => e.stopPropagation()}>
                        <ContentGenerator 
                            preFilledData={{
                                topic: currentData[activeArticleIdx]?.title || '',
                                objective: currentData[activeArticleIdx]?.strategy || '',
                                keyword: currentData[activeArticleIdx]?.keyword || '',
                                pageId: linkedPages.length === 1 ? linkedPages[0].id : '',
                                articleId: currentData[activeArticleIdx]?.id
                            }}
                            embeddedProjectId={projectId}
                            onClose={handleCloseAndReload}
                            onSave={async (article) => {
                                const isUpdate = article.id && !String(article.id).startsWith('json-') && !String(article.id).startsWith('available-');
                                
                                if (isUpdate) {
                                    await api.updateArticle(article.id!, article);
                                } else {
                                    const { id, ...dataToSave } = article;
                                    await api.saveArticle(dataToSave);
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