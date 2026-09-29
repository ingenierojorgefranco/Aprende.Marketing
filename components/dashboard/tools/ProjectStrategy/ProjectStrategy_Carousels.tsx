import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
    Layers, Sparkles, Check, Target, Loader2, PlayCircle, X, PenTool, Brain, ArrowRight, 
    ChevronLeft, ChevronRight, Image as ImageIcon, Copy, CheckCircle2, ChevronDown, ChevronUp, 
    Download, Plus, Unlock, Save, Trash2, Lock, Shield, AlertTriangle, Search, Crown, FileText,
    UploadCloud
} from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';
import { ProjectCarousel } from '../../../../types';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

interface ProjectStrategy_CarouselsProps {
    totalSteps?: number;
    strategyData?: any;
    overrideProjectId?: string;
}

export const ProjectStrategy_Carousels: React.FC<ProjectStrategy_CarouselsProps> = ({
    totalSteps,
    strategyData,
    overrideProjectId
}) => {
    const { id: routeProjectId } = useParams() as { id: string };
    const projectId = overrideProjectId || routeProjectId;
    const context = useOutletContext() as any;
    const user = context?.user;
    const isSimulating = context?.isSimulating;
    const planLimits = user?.planLimits;
    const isRealAdmin = (planLimits?.planName === 'admin' || user?.role === 'admin') && !isSimulating;

    const [carousels, setCarousels] = useState<ProjectCarousel[]>([]);
    const [loadingCarousels, setLoadingHooks] = useState(true);
    const [unlockingMore, setUnlockingMore] = useState(false);
    const [unlockingSingle, setUnlockingSingle] = useState(false);
    const [isClone, setIsClone] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    const [masterParentId, setMasterParentId] = useState<string | null>(null);
    const [projectChecked, setProjectChecked] = useState(false);
    const [showUpgradeModalLocal, setShowUpgradeModalLocal] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const itemsPerPage = 4;

    const [activeTab, setActiveTab] = useState<'library' | 'generated'>('generated');
    const [libraryCarousels, setLibraryCarousels] = useState<any[]>([]);
    const [libraryTotal, setLibraryTotal] = useState(0);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [libraryPage, setLibraryPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
    const [activeLibraryIdx, setActiveLibraryIdx] = useState(0);
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
    const [uploadingImageIdx, setUploadingImageIdx] = useState<number | null>(null);

    const [activeKitTab, setActiveKitTab] = useState<'slides' | 'caption'>('slides');
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [localTitle, setLocalTitle] = useState('');
    const [localStrategy, setLocalStrategy] = useState('');
    const [saving, setSaving] = useState(false);

    const activeCarousel = useMemo(() => {
        return carousels[activeCarouselIdx];
    }, [carousels, activeCarouselIdx]);

    const activeLibraryCarousel = useMemo(() => {
        return libraryCarousels[activeLibraryIdx];
    }, [libraryCarousels, activeLibraryIdx]);

    const filteredCarousels = useMemo(() => {
        let currentData = carousels;
        if (activeTab === 'library') {
            currentData = libraryCarousels;
        } else {
            // For 'generated' (Mis Carruseles) tab:
            // Admin only sees generated items here. Normal users see unlocked templates.
            if (isRealAdmin) {
                currentData = carousels.filter(c => c.isGenerated);
            } else {
                currentData = carousels.filter(c => (c as any).isUnlocked);
            }
        }
        if (!searchTerm.trim()) return currentData;
        return currentData.filter(c => 
            (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            ((c as any).psychological_strategy || c.psychologicalStrategy || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeTab, libraryCarousels, carousels, searchTerm]);

    const totalPages = useMemo(() => {
        return activeTab === 'library' 
            ? Math.ceil(libraryTotal / itemsPerPage) 
            : Math.ceil(filteredCarousels.length / itemsPerPage);
    }, [activeTab, libraryTotal, filteredCarousels, itemsPerPage]);

    const paginatedCarousels = useMemo(() => {
        return activeTab === 'library'
            ? filteredCarousels // library is already paginated by backend
            : filteredCarousels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [activeTab, filteredCarousels, currentPage, itemsPerPage]);

    const currentCarousel = useMemo(() => {
        return activeTab === 'library' 
            ? filteredCarousels[activeLibraryIdx] 
            : filteredCarousels[activeCarouselIdx];
    }, [activeTab, filteredCarousels, activeLibraryIdx, activeCarouselIdx]);

    const isCurrentUnlocked = useMemo(() => {
        return activeTab === 'generated' || (currentCarousel && (currentCarousel as any).isUnlocked) || isRealAdmin;
    }, [activeTab, currentCarousel, isRealAdmin]);

    // Fetch user's unlocked carousels
    const fetchCarousels = async () => {
        if (!projectId) return;
        setLoadingHooks(true);
        try {
            const data = await api.getProjectCarousels(projectId);
            if (data && data.length > 0) {
                setCarousels(data);
            } else {
                setCarousels([]);
            }
        } catch (e) {
            console.error("Error fetching carousels:", e);
            setCarousels([]);
        } finally {
            setLoadingHooks(false);
        }
    };

    // Fetch library carousels
    const fetchLibrary = async (page: number, mParentId?: string | null) => {
        if (!projectId) return;
        setLoadingLibrary(true);
        try {
            const data = await api.getCarouselsLibrary(page, 4, mParentId !== undefined ? (mParentId || undefined) : (masterParentId || undefined), projectId);
            if (data && data.carousels) {
                setLibraryCarousels(data.carousels);
                setLibraryTotal(data.total);
            }
        } catch (e) {
            console.error("Error fetching library:", e);
        } finally {
            setLoadingLibrary(false);
        }
    };

    // Check project context and load carousels
    useEffect(() => {
        const checkProjectAndLoad = async () => {
            if (!projectId) return;
            try {
                const proj = await api.getProjectById(projectId);
                let mParentId: string | null = null;
                if (proj) {
                    setIsClone(!!proj.masterParentId);
                    setIsMaster(!!proj.isMaster);
                    mParentId = proj.masterParentId || null;
                    setMasterParentId(mParentId);
                }
                
                await fetchCarousels();
                
                if (activeTab === 'library') {
                    await fetchLibrary(libraryPage, mParentId);
                }
            } catch (e) {
                console.error("Error checking project:", e);
            } finally {
                setProjectChecked(true);
            }
        };
        checkProjectAndLoad();
    }, [projectId, activeTab, libraryPage]);

    // Reset slide index when active carousel changes
    useEffect(() => {
        setCurrentSlideIdx(0);
        if (activeCarousel) {
            setLocalTitle(activeCarousel.title || '');
            setLocalStrategy(activeCarousel.psychologicalStrategy || '');
        }
    }, [activeCarouselIdx, carousels]);

    // Handle Title and Strategy Update
    const handleSaveChanges = async () => {
        if (!activeCarousel || saving) return;
        setSaving(true);
        try {
            await api.updateProjectCarousel(activeCarousel.id, {
                title: localTitle,
                psychologicalStrategy: localStrategy
            });
            // Update in local state
            setCarousels(prev => prev.map((c, i) => i === activeCarouselIdx ? { ...c, title: localTitle, psychologicalStrategy: localStrategy } : c));
            setIsEditingTitle(false);
            
            // Trigger confetti
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#FF5A1F', '#10B981', '#3B82F6']
            });
        } catch (e) {
            console.error("Error updating carousel:", e);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateSlideField = async (field: 'title' | 'description' | 'image', value: string, slideIdx: number) => {
        if (!activeCarousel) return;
        const updatedSlides = [...(activeCarousel.contentJson?.slides || [])];
        if (updatedSlides[slideIdx]) {
            updatedSlides[slideIdx] = {
                ...updatedSlides[slideIdx],
                [field]: value
            };
        }
        const newContentJson = {
            ...(activeCarousel.contentJson || {}),
            slides: updatedSlides
        };
        try {
            await api.updateProjectCarousel(activeCarousel.id, {
                contentJson: newContentJson
            });
            setCarousels(prev => prev.map((c, i) => i === activeCarouselIdx ? { ...c, contentJson: newContentJson } : c));
        } catch (err) {
            console.error("Error updating slide field:", err);
        }
    };

    const handleAddSlide = async () => {
        if (!activeCarousel) return;
        const currentSlides = activeCarousel.contentJson?.slides || [];
        const newSlide = {
            title: `Slide ${currentSlides.length + 1}: Título llamativo`,
            description: `Descripción del slide ${currentSlides.length + 1} para retener audiencia.`,
            image: ''
        };
        const updatedSlides = [...currentSlides, newSlide];
        const newContentJson = {
            ...(activeCarousel.contentJson || {}),
            slides: updatedSlides
        };
        try {
            await api.updateProjectCarousel(activeCarousel.id, {
                contentJson: newContentJson
            });
            setCarousels(prev => prev.map((c, i) => i === activeCarouselIdx ? { ...c, contentJson: newContentJson } : c));
            setCurrentSlideIdx(updatedSlides.length - 1);
        } catch (err) {
            console.error("Error adding slide:", err);
        }
    };

    // Handle single unlock
    const handleUnlockSingle = async (masterId: string) => {
        if (!projectId || unlockingSingle) return;
        setUnlockingSingle(true);
        try {
            await api.unlockSingleCarousel(projectId, masterId);
            confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 }
            });
            await fetchCarousels();
            setActiveTab('generated');
            // Select the newly unlocked item (usually at the end or beginning depending on server sort)
            setActiveCarouselIdx(0);
        } catch (err: any) {
            console.error("Error unlocking single carousel:", err);
            if (err.message && err.message.includes("límite")) {
                setShowUpgradeModalLocal(true);
            } else {
                alert(err.message || "Error al desbloquear el carrusel.");
            }
        } finally {
            setUnlockingSingle(false);
        }
    };

    // Handle unlock 10 more
    const handleUnlockMore = async () => {
        if (!projectId || unlockingMore) return;
        setUnlockingMore(true);
        try {
            const res = await api.unlockMoreCarousels(projectId);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 }
            });
            await fetchCarousels();
            setActiveTab('generated');
            setActiveCarouselIdx(0);
        } catch (err: any) {
            console.error("Error unlocking carousels batch:", err);
            if (err.message && err.message.includes("límite")) {
                setShowUpgradeModalLocal(true);
            } else {
                alert(err.message || "Error al desbloquear más carruseles.");
            }
        } finally {
            setUnlockingMore(false);
        }
    };

    // Copy caption copy helper
    const handleCopyText = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2500);
    };

    // Delete carousel
    const handleDeleteCarousel = async (carouselId: string) => {
        if (!carouselId) return;
        if (window.confirm("¿Deseas eliminar este carrusel? No se puede recuperar")) {
            setSaving(true);
            try {
                await api.deleteProjectCarousel(carouselId);
                await fetchCarousels();
                setActiveCarouselIdx(0);
                alert("Carrusel eliminado correctamente.");
            } catch (e: any) {
                alert("Error al eliminar: " + e.message);
            } finally {
                setSaving(false);
            }
        }
    };

    // Create manual carousel
    const handleCreateManualCarousel = async () => {
        if (unlockedCount >= maxCarousels && !isRealAdmin) {
            setShowUpgradeModalLocal(true);
            return;
        }
        if (window.confirm("¿Deseas crear el carrusel manualmente?")) {
            setSaving(true);
            try {
                const now = new Date().toISOString();
                const carouselData = {
                    title: 'Nuevo Carrusel Manual',
                    psychological_strategy: 'Aprende de forma visual y rápida.',
                    contentJson: {
                        slides: [
                            {
                                slideNumber: 1,
                                title: "Slide 1: Título llamativo",
                                description: "Descripción del primer slide para retener audiencia.",
                                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=675"
                            }
                        ],
                        caption: "¡Aquí va la descripción o caption para tu post de Instagram/Facebook!"
                    },
                    isGenerated: false,
                    updatedAt: now
                };
                await api.createProjectCarousel(projectId, carouselData);
                await fetchCarousels();
                setActiveCarouselIdx(0);
                alert("¡Carrusel manual creado!");
            } catch (e: any) {
                alert("Error al crear carrusel: " + e.message);
            } finally {
                setSaving(false);
            }
        }
    };

    // Plan limits and counts
    const isStarter = planLimits?.planName === 'starter';
    const unlockedCount = carousels.filter(c => c.masterCarouselId).length;
    const maxCarousels = planLimits?.maxCarousels || 50;
    const usagePercent = Math.min(100, (unlockedCount / maxCarousels) * 100);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header matches Hooks style perfectly */}
            {!overrideProjectId ? (
                <div className="space-y-6">
                    <StepHeaderCard
                        stepNumber={6}
                        totalSteps={totalSteps}
                        stageNumber={2}
                        categoryTitle="Carruseles Magnéticos de Alta Conversión"
                        title={<>Descarga tus <span className="text-[#FF5A1F]">Carruseles Magnéticos</span></>}
                        description="Usa carruseles visuales de Instagram y Facebook diseñados por profesionales para captar la atención de tu audiencia, educar de forma visual rápida y conseguir conversiones automáticas."
                    />

                    {/* --- VIDEO TUTORIAL --- */}
                    <div className="bg-[#0f172a]/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
                        <StepVideoContainer 
                            stepNumber={6}
                            videoUrl="https://www.youtube.com/embed/bTV5aFTchJ8?rel=0&controls=1&showinfo=0"
                            title="Video Tutorial Carruseles"
                        />
                    </div>
                </div>
            ) : (
                <StepHeaderCard
                    stepNumber={6}
                    totalSteps={totalSteps}
                    stageNumber={2}
                    categoryTitle="Carruseles Magnéticos de Alta Conversión"
                    title={<>Descarga tus <span className="text-[#FF5A1F]">Carruseles Magnéticos</span></>}
                    description="Usa carruseles visuales de Instagram y Facebook diseñados por profesionales para captar la atención de tu audiencia, educar de forma visual rápida y conseguir conversiones automáticas."
                />
            )}

            {/* MAIN GRID LAYOUT ALIGNED WITH HOOKS DESIGN */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: LISTADO DE CARRUSELES */}
                <div className="lg:col-span-5 space-y-6 sticky top-24 self-start">
                    <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 flex flex-col shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400 border border-orange-900/50">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">Carruseles Magnéticos</h4>
                                </div>
                            </div>
                            {isRealAdmin && (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleCreateManualCarousel}
                                        disabled={saving}
                                        className="p-2 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] rounded-xl hover:bg-[#FF5A1F] hover:text-white transition-all group"
                                        title="Añadir Manualmente"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Barra de Progreso de Carruseles */}
                        <div className="w-full mb-6">
                            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full shadow-inner">
                                <div className="flex justify-between items-center mb-2 text-sm">
                                    <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Carruseles Disponibles</span>
                                    <span className="text-white font-bold">{unlockedCount} / {isRealAdmin ? '∞' : maxCarousels}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full transition-all duration-1000 ease-out shadow-lg bg-orange-500" style={{ width: `${isRealAdmin ? (unlockedCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Buscador de Carruseles */}
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar Carruseles por titulo"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Selector de Pestañas */}
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-6">
                            <button 
                                onClick={() => { setActiveTab('generated'); setActiveCarouselIdx(0); }}
                                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'generated' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-gray-500 hover:text-white'}`}
                            >
                                Mis Carruseles
                            </button>
                            <button 
                                onClick={() => { setActiveTab('library'); setActiveLibraryIdx(0); }}
                                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'library' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-gray-500 hover:text-white'}`}
                            >
                                Biblioteca
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {(activeTab === 'library' ? loadingLibrary : loadingCarousels) ? (
                                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-400" /></div>
                            ) : paginatedCarousels.length > 0 ? (
                                paginatedCarousels.map((carousel: any, idxInPage: number) => {
                                    const globalIdx = activeTab === 'library' ? idxInPage : (currentPage - 1) * itemsPerPage + idxInPage;
                                    const isCardSelected = activeTab === 'library' ? activeLibraryIdx === globalIdx : activeCarouselIdx === globalIdx;
                                    const isUnlocked = activeTab === 'generated' || (carousel as any).isUnlocked || isRealAdmin;
                                    const isCarouselActive = carousel.isActive !== false && (carousel.isActive as any) !== 0;

                                    return (
                                        <div 
                                            key={carousel.id || idxInPage} 
                                            onClick={() => activeTab === 'library' ? setActiveLibraryIdx(globalIdx) : setActiveCarouselIdx(globalIdx)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${
                                                isCardSelected 
                                                    ? (activeTab === 'library' ? 'bg-orange-900/40 border-orange-500/50' : 'bg-emerald-900/40 border-emerald-500/50') 
                                                    : 'bg-black/20 border-gray-800 hover:border-gray-700'
                                            } ${isCardSelected ? 'translate-x-2' : ''} ${(!isRealAdmin && !isUnlocked && (carousel as any).masterCarouselId) ? 'opacity-60 grayscale' : ''}`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-white text-[1.2rem] leading-[1.8rem] font-light truncate ${
                                                    isCardSelected 
                                                        ? (activeTab === 'library' ? 'text-orange-300' : 'text-emerald-300') 
                                                        : 'text-white group-hover:text-white'
                                                } flex items-center gap-2`}>
                                                    {!isRealAdmin && !isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
                                                    {carousel.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 line-clamp-1">
                                                    {carousel.psychologicalStrategy || "Visual y educativo."}
                                                </p>
                                            </div>
                                            {isRealAdmin && (
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const nextActive = !isCarouselActive;
                                                        api.updateProjectCarousel(carousel.id, { isActive: nextActive })
                                                            .then(() => {
                                                                fetchCarousels();
                                                                fetchLibrary(libraryPage);
                                                            });
                                                    }}
                                                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 grayscale-0 shrink-0 ${
                                                        isCarouselActive
                                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                                            : 'border-zinc-600 bg-zinc-900/80 hover:border-zinc-400 text-transparent'
                                                    }`}
                                                >
                                                    <Check className={`w-4 h-4 font-bold stroke-[3] transition-opacity ${isCarouselActive ? 'text-white opacity-100' : 'opacity-0'}`} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-10 text-center text-gray-500 italic">No hay carruseles disponibles.</div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                                <button 
                                    disabled={activeTab === 'library' ? libraryPage === 1 : currentPage === 1} 
                                    onClick={() => activeTab === 'library' ? setLibraryPage(prev => prev - 1) : setCurrentPage(prev => prev - 1)} 
                                    className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-orange-400 disabled:opacity-20 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Pág. {activeTab === 'library' ? libraryPage : currentPage} de {totalPages}
                                </span>
                                <button 
                                    disabled={activeTab === 'library' ? libraryPage === totalPages : currentPage === totalPages} 
                                    onClick={() => activeTab === 'library' ? setLibraryPage(prev => prev + 1) : setCurrentPage(prev => prev + 1)} 
                                    className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-orange-400 disabled:opacity-20 transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DETALLE Y RESULTADO */}
                <div className="lg:col-span-7 space-y-8">
                    {/* VISTA DE CARRUSEL BLOQUEADO */}
                    {!isCurrentUnlocked && currentCarousel && !isRealAdmin && (
                        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/10 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Lock className="w-40 h-40 text-orange-500" /></div>
                            
                            <div className="w-full text-left mb-8">
                                <h3 className="text-white mb-6 font-bold tracking-tight" style={{ fontSize: '1.6rem', lineHeight: '2.2rem' }}>{currentCarousel.title}</h3>
                                
                                <div className="bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20 backdrop-blur-sm mb-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Brain className="w-5 h-5 text-orange-400" />
                                        <span className="text-white font-bold text-xs uppercase tracking-widest">Estrategia Psicológica</span>
                                    </div>
                                    <div className="text-zinc-200 text-xs md:text-sm leading-relaxed">
                                        {currentCarousel.psychologicalStrategy || "Aprende de forma visual y rápida."}
                                    </div>
                                </div>
                            </div>

                            <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-lg animate-pulse">
                                <Lock className="w-10 h-10 text-orange-500" />
                            </div>

                            <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Carruseles Disponibles para Desbloquear</h4>
                            <p className="text-white font-medium leading-relaxed max-w-md mx-auto mb-10" style={{ fontSize: '1.1rem' }}>Nuestro equipo de marketing ha redactado y diseñado esta plantilla para ti. Haz clic en Desbloquear para añadirla a tu colección.</p>

                            <button 
                                onClick={unlockedCount >= maxCarousels && !isRealAdmin ? () => setShowUpgradeModalLocal(true) : () => handleUnlockSingle(currentCarousel.id)}
                                disabled={unlockingSingle}
                                className={`w-full py-5 rounded-2xl ${unlockedCount >= maxCarousels && !isRealAdmin ? 'bg-gradient-to-r from-yellow-600 to-orange-600' : 'bg-orange-600 hover:bg-orange-500'} text-white font-black text-xl uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-70`}
                            >
                                {unlockingSingle ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : unlockedCount >= maxCarousels && !isRealAdmin ? (
                                    <Crown className="w-6 h-6 fill-current" />
                                ) : (
                                    <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                )}
                                {unlockingSingle ? 'Desbloqueando...' : unlockedCount >= maxCarousels && !isRealAdmin ? 'Actualizar a PRO 👑' : 'Desbloquear Carrusel'}
                            </button>
                            
                            <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                <Shield className="w-3 h-3" /> Acceso Instantáneo tras Desbloqueo
                            </div>
                        </div>
                    )}

                    {/* VISTA DE CARRUSEL DESBLOQUEADO */}
                    {isCurrentUnlocked && currentCarousel && (
                        <div className="bg-[#08080c] border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6 shadow-2xl mb-8 text-left">
                            <div className="bg-[#0c0c11]/80 border border-white/10 p-5 md:p-6 rounded-[20px] flex flex-col justify-between gap-4 shadow-2xl">
                                <div className="space-y-2 text-left">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-[10px] md:text-xs font-black tracking-widest text-[#FF5D1E] uppercase">
                                            CARRUSEL ACTIVO #{currentCarousel.id || (activeTab === 'library' ? activeLibraryIdx : activeCarouselIdx) + 1}
                                        </span>
                                        {isRealAdmin && (
                                            <button
                                                onClick={() => handleDeleteCarousel(currentCarousel.id)}
                                                className="text-[10px] md:text-xs font-black text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5 uppercase shrink-0"
                                                title="Eliminar Carrusel completo"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Eliminar Carrusel</span>
                                            </button>
                                        )}
                                    </div>

                                    {isEditingTitle ? (
                                        <div className="w-full max-w-3xl my-1 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Título del Carrusel</label>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={localTitle}
                                                    onChange={e => setLocalTitle(e.target.value)}
                                                    className="w-full bg-black/80 border border-orange-500 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Estrategia Psicológica</label>
                                                <textarea
                                                    value={localStrategy}
                                                    onChange={e => setLocalStrategy(e.target.value)}
                                                    rows={2}
                                                    className="w-full bg-black/80 border border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none"
                                                />
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => setIsEditingTitle(false)}
                                                    className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleSaveChanges}
                                                    disabled={saving}
                                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                                                >
                                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                                    Guardar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative group/maintitle max-w-3xl">
                                            <h2
                                                onClick={() => !isStarter && setIsEditingTitle(true)}
                                                className={`text-sm sm:text-base md:text-lg font-bold text-white tracking-tight leading-relaxed flex items-center gap-2 ${
                                                    !isStarter ? 'cursor-pointer hover:text-orange-400 transition-colors' : ''
                                                }`}
                                            >
                                                <span>{localTitle || currentCarousel.title || ""}</span>
                                                {!isStarter && (
                                                    <span className="opacity-0 group-hover/maintitle:opacity-100 transition-opacity text-[10px] font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded shrink-0">
                                                        Editar
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-2 leading-relaxed">
                                                <Brain className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                                Estrategia: <span className="font-normal text-slate-400">{currentCarousel.psychologicalStrategy || "Visual y educativo."}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sub-tabs row inside details (same style as Hooks tabs!) */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-white/[0.08]">
                                {[
                                    { id: 'slides', label: 'Visualizar Slides' },
                                    { id: 'caption', label: 'Texto de Publicacion (Caption)' }
                                ].map((tab) => {
                                    const isActive = activeKitTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveKitTab(tab.id as any)}
                                            className={`px-4 py-2 text-xs md:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer duration-200 tracking-wide ${
                                                isActive
                                                    ? "border-[#FF5D1E] text-[#FF5D1E]"
                                                    : "border-transparent text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* TAB PANEL 1: Slides Slider */}
                            {activeKitTab === 'slides' && (
                                <div className="space-y-6">
                                    {currentCarousel.contentJson?.slides && currentCarousel.contentJson.slides.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-black/40 border border-white/5 p-6 rounded-[20px]">
                                            {/* Mobile Device / Post Preview Simulator */}
                                            <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-4 pt-10 pb-6 w-full max-w-[280px] mx-auto shadow-2xl relative overflow-hidden flex flex-col gap-3 group">
                                                {/* Notch */}
                                                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                                                </div>

                                                {/* Simulated Post Header */}
                                                <div className="flex items-center justify-between px-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-white">AM</div>
                                                        <span className="text-[10px] font-black text-white">aprende.marketing</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-500">···</span>
                                                </div>

                                                {/* Simulated Post Image Container */}
                                                <div className="aspect-square bg-slate-900 rounded-3xl relative overflow-hidden border border-slate-800">
                                                    <img
                                                        src={currentCarousel.contentJson.slides[currentSlideIdx]?.image}
                                                        alt={`Slide ${currentSlideIdx + 1}`}
                                                        className="w-full h-full object-cover select-none"
                                                    />
                                                    {/* Dark Overlay for Copy */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-left space-y-1">
                                                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-950/40 border border-orange-900/30 px-1.5 py-0.5 rounded-md self-start">Slide {currentSlideIdx + 1}</span>
                                                        <h4 className="text-xs font-black text-white leading-tight">
                                                            {currentCarousel.contentJson.slides[currentSlideIdx]?.title}
                                                        </h4>
                                                        <p className="text-[9px] text-slate-300 font-normal leading-normal line-clamp-2">
                                                            {currentCarousel.contentJson.slides[currentSlideIdx]?.description}
                                                        </p>
                                                    </div>

                                                    {/* Step Dots Indicators */}
                                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[9px] font-black text-white px-2 py-0.5 rounded-full select-none">
                                                        {currentSlideIdx + 1}/{currentCarousel.contentJson.slides.length}
                                                    </div>
                                                </div>

                                                {/* Simulator controls */}
                                                <div className="flex justify-between items-center px-1">
                                                    <div className="flex gap-2">
                                                        <span className="text-[10px]">❤️</span>
                                                        <span className="text-[10px]">💬</span>
                                                        <span className="text-[10px]">✈️</span>
                                                    </div>
                                                    {/* Indicator dots */}
                                                    <div className="flex gap-1">
                                                        {currentCarousel.contentJson.slides.map((_: any, idx: number) => (
                                                            <span 
                                                                key={idx} 
                                                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentSlideIdx ? 'bg-orange-500 scale-125' : 'bg-slate-800'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px]">🔖</span>
                                                </div>
                                            </div>

                                            {/* Controls and Slide descriptions */}
                                            <div className="space-y-6 text-left flex flex-col justify-center">
                                                <div className="space-y-3">
                                                    <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-2.5 py-1 rounded-lg inline-block self-start">
                                                        Slide {currentSlideIdx + 1}
                                                    </span>

                                                    {/* Display Image if it exists */}
                                                    {currentCarousel.contentJson.slides[currentSlideIdx]?.image && (
                                                        <div className="relative group rounded-xl overflow-hidden border border-white/10 max-w-sm">
                                                            <img
                                                                src={currentCarousel.contentJson.slides[currentSlideIdx].image}
                                                                alt={`Slide ${currentSlideIdx + 1} Preview`}
                                                                className="w-full h-32 object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Admin Controls to edit fields and upload directly to GCS bucket */}
                                                    {isRealAdmin ? (
                                                        <div className="space-y-3 max-w-sm bg-white/5 p-4 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">URL de la Imagen</label>
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={currentCarousel.contentJson.slides[currentSlideIdx]?.image || ''}
                                                                        onChange={e => handleUpdateSlideField('image', e.target.value, currentSlideIdx)}
                                                                        placeholder="Escribe la URL o sube un archivo..."
                                                                        className="flex-1 bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                                                                    />
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        id={`slide-file-input-${currentSlideIdx}`}
                                                                        className="hidden"
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (!file) return;
                                                                            setUploadingImageIdx(currentSlideIdx);
                                                                            try {
                                                                                const res = await api.uploadFile(file, {
                                                                                    projectId: projectId,
                                                                                    folderType: 'carrouseles'
                                                                                });
                                                                                await handleUpdateSlideField('image', res.url, currentSlideIdx);
                                                                            } catch (err: any) {
                                                                                alert('Error al subir: ' + err.message);
                                                                            } finally {
                                                                                setUploadingImageIdx(null);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        disabled={uploadingImageIdx === currentSlideIdx}
                                                                        onClick={() => document.getElementById(`slide-file-input-${currentSlideIdx}`)?.click()}
                                                                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-40"
                                                                        title="Subir archivo"
                                                                    >
                                                                        {uploadingImageIdx === currentSlideIdx ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                                                        ) : (
                                                                            <UploadCloud className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Título del Slide</label>
                                                                <input
                                                                    type="text"
                                                                    value={currentCarousel.contentJson.slides[currentSlideIdx]?.title || ''}
                                                                    onChange={e => handleUpdateSlideField('title', e.target.value, currentSlideIdx)}
                                                                    placeholder="Título de la diapositiva"
                                                                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Descripción del Slide</label>
                                                                <textarea
                                                                    value={currentCarousel.contentJson.slides[currentSlideIdx]?.description || ''}
                                                                    onChange={e => handleUpdateSlideField('description', e.target.value, currentSlideIdx)}
                                                                    placeholder="Descripción de la diapositiva..."
                                                                    rows={2}
                                                                    className="w-full bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500 resize-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <h4 className="text-lg font-black text-white leading-tight mt-1">
                                                                {currentCarousel.contentJson.slides[currentSlideIdx]?.title}
                                                            </h4>
                                                            <p className="text-sm text-slate-400 font-normal leading-relaxed">
                                                                {currentCarousel.contentJson.slides[currentSlideIdx]?.description}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Add and Delete Slide Buttons for Admin */}
                                                    {isRealAdmin && (
                                                        <div className="flex flex-col sm:flex-row gap-2 max-w-sm pt-2">
                                                            <button
                                                                onClick={handleAddSlide}
                                                                className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Añadir Slide
                                                            </button>

                                                            {currentCarousel.contentJson.slides.length > 1 && (
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm('¿Estás seguro de eliminar este slide?')) {
                                                                            const updatedSlides = currentCarousel.contentJson.slides.filter((_: any, idx: number) => idx !== currentSlideIdx);
                                                                            const newContentJson = {
                                                                                ...(currentCarousel.contentJson || {}),
                                                                                slides: updatedSlides
                                                                            };
                                                                            await api.updateProjectCarousel(currentCarousel.id, { contentJson: newContentJson });
                                                                            setCarousels(prev => prev.map((c, i) => i === activeCarouselIdx ? { ...c, contentJson: newContentJson } : c));
                                                                            setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1));
                                                                        }
                                                                    }}
                                                                    className="py-2.5 px-4 bg-red-950/40 hover:bg-red-900/40 border border-red-900/30 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Slider Navigation Buttons */}
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
                                                        disabled={currentSlideIdx === 0}
                                                        className="p-3 bg-zinc-800 border border-white/10 hover:border-orange-500 rounded-xl disabled:opacity-40 disabled:hover:border-zinc-800 transition"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentSlideIdx(prev => Math.min(currentCarousel.contentJson.slides.length - 1, prev + 1))}
                                                        disabled={currentSlideIdx === currentCarousel.contentJson.slides.length - 1}
                                                        className="p-3 bg-zinc-800 border border-white/10 hover:border-orange-500 rounded-xl disabled:opacity-40 disabled:hover:border-zinc-800 transition"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-white" />
                                                    </button>
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Haz clic para avanzar</span>
                                                </div>

                                                {/* Download and Copy Actions footer (Matches Hooks style!) */}
                                                <div className="pt-6 border-t border-white/[0.08] flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const copyText = `${currentCarousel.contentJson.slides[currentSlideIdx]?.title}\n${currentCarousel.contentJson.slides[currentSlideIdx]?.description}`;
                                                            handleCopyText(copyText, currentSlideIdx);
                                                        }}
                                                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                                                            copiedIndex === currentSlideIdx
                                                                ? 'bg-emerald-600 text-white border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                                                                : 'bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 hover:text-white'
                                                        }`}
                                                    >
                                                        {copiedIndex === currentSlideIdx ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                                                        <span>{copiedIndex === currentSlideIdx ? '¡Copiado!' : 'Copiar Texto Slide'}</span>
                                                    </button>

                                                    <a
                                                        href={currentCarousel.contentJson.slides[currentSlideIdx]?.image}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FF5D1E] to-orange-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(255,93,30,0.25)] cursor-pointer"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>Descargar Imagen</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center bg-slate-900/30 rounded-3xl text-slate-500">
                                            No hay slides en este carrusel.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB PANEL 2: Feed caption / Copy */}
                            {activeKitTab === 'caption' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-1">
                                        <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest">Texto Recomendado para el Feed</span>
                                        <button
                                            onClick={() => handleCopyText(currentCarousel.contentJson?.feedCopy || currentCarousel.contentJson?.caption || '', 999)}
                                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                                                copiedIndex === 999
                                                    ? 'bg-emerald-600 text-white border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                                                    : 'bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 hover:text-white'
                                            }`}
                                        >
                                            {copiedIndex === 999 ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                    <span>¡Copiado!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>Copiar texto completo</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto">
                                        {currentCarousel.contentJson?.feedCopy || currentCarousel.contentJson?.caption || "No hay copia de feed disponible."}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Upgrade Plan Modal dialog */}
            <UpgradeModal
                isOpen={showUpgradeModalLocal}
                onClose={() => setShowUpgradeModalLocal(false)}
                reason="Las plantillas completas de Carruseles de Instagram y Facebook diseñadas profesionalmente por nuestro equipo de expertos están reservadas para usuarios del Plan PRO."
            />
        </div>
    );
};
