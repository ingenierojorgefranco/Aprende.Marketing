import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
    Layers, Sparkles, Check, Target, Loader2, PlayCircle, X, PenTool, Brain, ArrowRight, 
    ChevronLeft, ChevronRight, Image as ImageIcon, Copy, CheckCircle2, ChevronDown, ChevronUp, 
    Download, Plus, Unlock, Save, Trash2, Lock, Shield, AlertTriangle, Search, Crown, FileText
} from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';
import { ProjectCarousel } from '../../../../types';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

// Default/Fallback carousels for mock mode or empty library
const DEFAULT_CAROUSELS_MOCK: ProjectCarousel[] = [
    {
        id: 'carousel-1',
        projectId: 'mock-proj',
        title: "Cómo generar $1.000 extras al mes en estética",
        psychologicalStrategy: "Apela al deseo de ingresos extras en tiempo libre sin abandonar la seguridad actual.",
        isGenerated: true,
        contentJson: {
            slides: [
                {
                    slideNumber: 1,
                    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800",
                    title: "¿Te gustaría generar $1.000 extras al mes?",
                    description: "Desliza para ver el método paso a paso que puedes iniciar en tus tiempos libres."
                },
                {
                    slideNumber: 2,
                    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
                    title: "Paso 1: Domina la técnica correcta",
                    description: "El microblading de cejas es el sector mejor pagado de la belleza."
                },
                {
                    slideNumber: 3,
                    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
                    title: "Paso 2: Consigue tus primeros clientes",
                    description: "Usa nuestra plantilla de mensajes de WhatsApp para agendar tu primera cita."
                },
                {
                    slideNumber: 4,
                    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
                    title: "Paso 3: Escala tu negocio",
                    description: "Únete a nuestra Masterclass Gratuita para aprender a escalar de 0 a $1.000 extras."
                }
            ],
            feedCopy: "🔥 ¿Te gustaría generar $1.000 extras al mes sin dejar tu trabajo actual?\n\nAquí tienes el paso a paso detallado para lograrlo. Desliza las imágenes y descubre cómo puedes empezar hoy mismo en tu tiempo libre.\n\n🔗 Regístrate gratis en el enlace de mi perfil para acceder a la formación completa."
        }
    },
    {
        id: 'carousel-2',
        projectId: 'mock-proj',
        title: "3 Errores fatales al diseñar cejas perfectas",
        psychologicalStrategy: "Apela al temor de cometer errores comunes que arruinan la reputación.",
        isGenerated: true,
        contentJson: {
            slides: [
                {
                    slideNumber: 1,
                    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
                    title: "3 Errores fatales al diseñar cejas",
                    description: "Si cometes uno de estos, podrías estar perdiendo clientes sin darte cuenta. ¡Desliza!"
                },
                {
                    slideNumber: 2,
                    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
                    title: "1. No medir la simetría facial",
                    description: "Cada rostro es único. Usar una plantilla genérica arruina la armonía natural."
                },
                {
                    slideNumber: 3,
                    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800",
                    title: "2. Excederse con el grosor inicial",
                    description: "Siempre es más fácil rellenar que remover. Empieza con trazos suaves."
                },
                {
                    slideNumber: 4,
                    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
                    title: "3. Usar pigmentos inadecuados",
                    description: "La subtonalidad de la piel determina el color. Evita los tonos grisáceos."
                }
            ],
            feedCopy: "❌ ¿Estás cometiendo alguno de estos 3 errores al diseñar cejas?\n\nLa ceja perfecta no es una plantilla, es una obra de arte simétrica diseñada para cada tipo de rostro.\n\nDesliza para ver la explicación detallada y evítalos hoy mismo.\n\n🔗 Únete a mi clase gratis en vivo pulsando el enlace de mi biografía."
        }
    }
];

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
    const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
    const [activeLibraryIdx, setActiveLibraryIdx] = useState(0);
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

    const [activeKitTab, setActiveKitTab] = useState<'slides' | 'caption'>('slides');
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [localTitle, setLocalTitle] = useState('');
    const [localStrategy, setLocalStrategy] = useState('');
    const [saving, setSaving] = useState(false);

    const activeCarousel = carousels[activeCarouselIdx];
    const activeLibraryCarousel = libraryCarousels[activeLibraryIdx];

    // Check project context
    useEffect(() => {
        if (!projectId) return;
        const checkProject = async () => {
            try {
                const proj = await api.getProjectById(projectId);
                if (proj) {
                    setIsClone(!!proj.masterParentId);
                    setIsMaster(!!proj.isMaster);
                    setMasterParentId(proj.masterParentId || null);
                }
            } catch (e) {
                console.error("Error checking project:", e);
            } finally {
                setProjectChecked(true);
            }
        };
        checkProject();
    }, [projectId]);

    // Fetch user's unlocked carousels
    const fetchCarousels = async () => {
        if (!projectId) return;
        setLoadingHooks(true);
        try {
            const data = await api.getProjectCarousels(projectId);
            if (data && data.length > 0) {
                setCarousels(data);
            } else {
                setCarousels(DEFAULT_CAROUSELS_MOCK);
            }
        } catch (e) {
            console.error("Error fetching carousels:", e);
            setCarousels(DEFAULT_CAROUSELS_MOCK);
        } finally {
            setLoadingHooks(false);
        }
    };

    // Fetch library carousels
    const fetchLibrary = async (page: number) => {
        if (!projectId) return;
        setLoadingLibrary(true);
        try {
            const data = await api.getCarouselsLibrary(page, 4, masterParentId || undefined, projectId);
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

    useEffect(() => {
        if (projectChecked) {
            fetchCarousels();
        }
    }, [projectId, projectChecked]);

    useEffect(() => {
        if (activeTab === 'library' && projectChecked) {
            fetchLibrary(libraryPage);
        }
    }, [activeTab, libraryPage, projectChecked]);

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

            {/* Limits and Progress bar */}
            {!isRealAdmin && (
                <div className="bg-[#0f172a]/40 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl backdrop-blur-sm">
                    <div className="space-y-2 flex-1">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                            <span>Consumo de Carruseles Desbloqueados</span>
                            <span className="text-orange-500 font-extrabold">{unlockedCount} / {isStarter ? 0 : maxCarousels} Desbloqueados</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${isStarter ? 'w-0 bg-red-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}
                                style={{ width: `${isStarter ? 0 : usagePercent}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                            {isStarter 
                                ? "Tu plan Starter no incluye carruseles magnéticos listos para usar." 
                                : `Cada carrusel cuenta para tu límite global de plan (${maxCarousels} carruseles de marca).`}
                        </p>
                    </div>

                    {isStarter ? (
                        <button 
                            onClick={() => setShowUpgradeModalLocal(true)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl flex items-center gap-2 hover:scale-[1.03] transition-all shadow-lg shrink-0"
                        >
                            <Crown className="w-4 h-4 fill-current animate-pulse" />
                            Actualizar a PRO 👑
                        </button>
                    ) : (
                        isClone && (
                            <button
                                onClick={handleUnlockMore}
                                disabled={unlockingMore || unlockedCount >= maxCarousels}
                                className="bg-slate-800 border border-slate-700 hover:border-orange-500 hover:text-orange-400 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-2xl flex items-center gap-2 transition shadow-md"
                            >
                                {unlockingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                        Desbloqueando lote...
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="w-4 h-4 text-orange-400" />
                                        Desbloquear 10 nuevos
                                    </>
                                )}
                            </button>
                        )
                    )}
                </div>
            )}

            {/* TAB SELECTOR: Generated vs Library */}
            <div className="flex border-b border-slate-800">
                <button
                    onClick={() => {
                        setActiveTab('generated');
                        setCurrentSlideIdx(0);
                    }}
                    className={`py-4 px-6 font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${activeTab === 'generated' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Mis Carruseles ({carousels.length})
                </button>
                {isClone && (
                    <button
                        onClick={() => {
                            setActiveTab('library');
                            setCurrentSlideIdx(0);
                        }}
                        className={`py-4 px-6 font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${activeTab === 'library' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        <Layers className="w-4 h-4" />
                        Explorar Biblioteca Maestra ({libraryTotal})
                    </button>
                )}
            </div>

            {/* MAIN INTERFACE: Tab Generated */}
            {activeTab === 'generated' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left column list (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-3">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1 mb-2">Lista de Carruseles</h3>
                        <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                            {loadingCarousels ? (
                                <div className="p-8 text-center bg-slate-900/30 border border-slate-800 rounded-3xl">
                                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
                                    <span className="text-xs font-bold text-slate-500 uppercase">Cargando carruseles...</span>
                                </div>
                            ) : carousels.length === 0 ? (
                                <div className="p-8 text-center bg-slate-900/30 border border-slate-800 rounded-3xl text-slate-500">
                                    No tienes carruseles desbloqueados todavía.
                                </div>
                            ) : (
                                carousels.map((carousel, i) => {
                                    const isActive = activeCarouselIdx === i;
                                    return (
                                        <div
                                            key={carousel.id || i}
                                            onClick={() => setActiveCarouselIdx(i)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 group ${isActive ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] ring-4 ring-[#FF5A1F]/5' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
                                        >
                                            <h4 className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                {carousel.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {carousel.psychologicalStrategy || "Aprende de forma visual y rápida."}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right column detailed viewer (lg:col-span-8) */}
                    <div className="lg:col-span-8">
                        {activeCarousel ? (
                            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl backdrop-blur-sm">
                                {/* Title and Edit */}
                                <div className="space-y-4 border-b border-slate-800 pb-6">
                                    {isEditingTitle ? (
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Título del Carrusel</label>
                                                <input
                                                    type="text"
                                                    value={localTitle}
                                                    onChange={e => setLocalTitle(e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Estrategia Detrás del Copy</label>
                                                <textarea
                                                    value={localStrategy}
                                                    onChange={e => setLocalStrategy(e.target.value)}
                                                    rows={2}
                                                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none"
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
                                                    Guardar Cambios
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1 flex-1">
                                                <h3 className="text-xl font-black text-white leading-tight">{activeCarousel.title}</h3>
                                                <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 leading-relaxed">
                                                    <Brain className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                                    Estrategia: <span className="font-normal text-slate-400">{activeCarousel.psychologicalStrategy || "Visual y educativo."}</span>
                                                </p>
                                            </div>
                                            {!isStarter && (
                                                <button
                                                    onClick={() => {
                                                        setLocalTitle(activeCarousel.title);
                                                        setLocalStrategy(activeCarousel.psychologicalStrategy || '');
                                                        setIsEditingTitle(true);
                                                    }}
                                                    className="p-3 bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition shadow-sm border border-slate-800/60"
                                                    title="Editar Información"
                                                >
                                                    <PenTool className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* CAROUSEL TABS */}
                                <div className="flex gap-2 border-b border-slate-800/40 pb-px">
                                    <button
                                        onClick={() => setActiveKitTab('slides')}
                                        className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition ${activeKitTab === 'slides' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        Visualizar Slides ({activeCarousel.contentJson?.slides?.length || 0})
                                    </button>
                                    <button
                                        onClick={() => setActiveKitTab('caption')}
                                        className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition ${activeKitTab === 'caption' ? 'border-[#FF5A1F] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Texto de Publicación (Caption)
                                    </button>
                                </div>

                                {/* TAB PANEL 1: Slides Slider */}
                                {activeKitTab === 'slides' && (
                                    <div className="space-y-6">
                                        {activeCarousel.contentJson?.slides && activeCarousel.contentJson.slides.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
                                                            src={activeCarousel.contentJson.slides[currentSlideIdx].image}
                                                            alt={`Slide ${currentSlideIdx + 1}`}
                                                            className="w-full h-full object-cover select-none"
                                                        />
                                                        {/* Dark Overlay for Copy */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-left space-y-1">
                                                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-950/40 border border-orange-900/30 px-1.5 py-0.5 rounded-md self-start">Slide {currentSlideIdx + 1}</span>
                                                            <h4 className="text-xs font-black text-white leading-tight">
                                                                {activeCarousel.contentJson.slides[currentSlideIdx].title}
                                                            </h4>
                                                            <p className="text-[9px] text-slate-300 font-normal leading-normal line-clamp-2">
                                                                {activeCarousel.contentJson.slides[currentSlideIdx].description}
                                                            </p>
                                                        </div>

                                                        {/* Step Dots Indicators */}
                                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[9px] font-black text-white px-2 py-0.5 rounded-full select-none">
                                                            {currentSlideIdx + 1}/{activeCarousel.contentJson.slides.length}
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
                                                            {activeCarousel.contentJson.slides.map((_: any, idx: number) => (
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
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-2 py-1 rounded-lg">CONTENIDO DEL SLIDE ACTUAL</span>
                                                        <h4 className="text-lg font-black text-white leading-tight mt-1">
                                                            Slide {currentSlideIdx + 1}: {activeCarousel.contentJson.slides[currentSlideIdx].title}
                                                        </h4>
                                                        <p className="text-sm text-slate-400 font-normal leading-relaxed">
                                                            {activeCarousel.contentJson.slides[currentSlideIdx].description}
                                                        </p>
                                                    </div>

                                                    {/* Slider Buttons */}
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
                                                            disabled={currentSlideIdx === 0}
                                                            className="p-3 bg-slate-800 border border-slate-700 hover:border-orange-500 rounded-xl disabled:opacity-40 disabled:hover:border-slate-700 transition"
                                                        >
                                                            <ChevronLeft className="w-5 h-5 text-white" />
                                                        </button>
                                                        <button
                                                            onClick={() => setCurrentSlideIdx(prev => Math.min(activeCarousel.contentJson.slides.length - 1, prev + 1))}
                                                            disabled={currentSlideIdx === activeCarousel.contentJson.slides.length - 1}
                                                            className="p-3 bg-slate-800 border border-slate-700 hover:border-orange-500 rounded-xl disabled:opacity-40 disabled:hover:border-slate-700 transition"
                                                        >
                                                            <ChevronRight className="w-5 h-5 text-white" />
                                                        </button>
                                                        <span className="text-xs font-bold text-slate-500 uppercase">Haz clic para avanzar</span>
                                                    </div>

                                                    <div className="pt-4 border-t border-slate-800/60">
                                                        <a
                                                            href={activeCarousel.contentJson.slides[currentSlideIdx].image}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-widest flex items-center gap-1.5"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Descargar Imagen de Alta Calidad (Slide {currentSlideIdx + 1})
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
                                                onClick={() => handleCopyText(activeCarousel.contentJson?.feedCopy || '', 0)}
                                                className="text-xs font-black text-orange-400 hover:text-orange-300 uppercase tracking-widest flex items-center gap-1.5"
                                            >
                                                {copiedIndex === 0 ? (
                                                    <>
                                                        <Check className="w-4 h-4 text-emerald-500" />
                                                        Copiado
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copiar texto completo
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto">
                                            {activeCarousel.contentJson?.feedCopy || "No hay copia de feed disponible."}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl text-slate-500">
                                Selecciona un carrusel de la lista para ver su detalle.
                             </div>
                        )}
                    </div>
                </div>
            )}

            {/* MAIN INTERFACE: Tab Library */}
            {activeTab === 'library' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Colección Maestra de Plantillas</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Mostrando {libraryCarousels.length} de {libraryTotal} disponibles</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loadingLibrary ? (
                            <div className="col-span-2 p-12 text-center bg-slate-900/30 border border-slate-800 rounded-3xl">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
                                <span className="text-xs font-bold text-slate-500 uppercase">Cargando biblioteca maestra...</span>
                            </div>
                        ) : libraryCarousels.length === 0 ? (
                            <div className="col-span-2 p-12 text-center bg-slate-900/30 border border-slate-800 rounded-3xl text-slate-500">
                                No hay más carruseles disponibles en la biblioteca para desbloquear en este momento.
                            </div>
                        ) : (
                            libraryCarousels.map((carousel, i) => {
                                const previewImage = carousel.contentJson?.slides?.[0]?.image || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800";
                                return (
                                    <div 
                                        key={carousel.id || i}
                                        className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col md:flex-row group"
                                    >
                                        {/* Cover Image Preview */}
                                        <div className="w-full md:w-2/5 aspect-square md:aspect-auto bg-slate-950 relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
                                            <img
                                                src={previewImage}
                                                alt={carousel.title}
                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                            />
                                            {/* Slides count badge */}
                                            <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[9px] font-black uppercase text-white px-2 py-0.5 rounded-full">
                                                {carousel.contentJson?.slides?.length || 0} Slides
                                            </span>
                                        </div>

                                        {/* Meta Information */}
                                        <div className="p-5 flex flex-col justify-between flex-1 gap-4 text-left">
                                            <div className="space-y-2">
                                                <h4 className="font-extrabold text-base text-white line-clamp-1 leading-snug">{carousel.title}</h4>
                                                <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                                                    {carousel.psychologicalStrategy || "Visual y educativo."}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estado</span>
                                                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                                                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                                                        Bloqueado
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleUnlockSingle(carousel.id)}
                                                    disabled={unlockingSingle || unlockedCount >= maxCarousels || isStarter}
                                                    className="bg-orange-500 hover:bg-orange-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800 border border-transparent text-white font-extrabold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
                                                >
                                                    {unlockingSingle ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            Procesando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Unlock className="w-3 h-3" />
                                                            Desbloquear
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {libraryTotal > itemsPerPage && (
                        <div className="flex justify-center items-center gap-4 pt-4">
                            <button
                                onClick={() => setLibraryPage(prev => Math.max(1, prev - 1))}
                                disabled={libraryPage === 1}
                                className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                            >
                                Anterior
                            </button>
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Página {libraryPage} de {Math.ceil(libraryTotal / itemsPerPage)}</span>
                            <button
                                onClick={() => setLibraryPage(prev => Math.min(Math.ceil(libraryTotal / itemsPerPage), prev + 1))}
                                disabled={libraryPage === Math.ceil(libraryTotal / itemsPerPage)}
                                className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Upgrade Plan Modal dialog */}
            <UpgradeModal
                isOpen={showUpgradeModalLocal}
                onClose={() => setShowUpgradeModalLocal(false)}
                reason="Las plantillas completas de Carruseles de Instagram y Facebook diseñadas profesionalmente por nuestro equipo de expertos están reservadas para usuarios del Plan PRO."
            />
        </div>
    );
};
