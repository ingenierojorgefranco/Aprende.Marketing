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

const forceDownloadImage = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error downloading image directly, falling back to opening in new tab:", error);
        window.open(url, '_blank');
    }
};

const getSessionLibraryCache = (projId: string, usrId?: string): any[] | null => {
    try {
        const key = `session_library_carousels_${projId}_${usrId || 'anon'}`;
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const todayStr = new Date().toISOString().slice(0, 10);
        if (parsed && parsed.date === todayStr && Array.isArray(parsed.carousels)) {
            return parsed.carousels;
        }
        return null;
    } catch {
        return null;
    }
};

const setSessionLibraryCache = (projId: string, usrId: string | undefined, carousels: any[]) => {
    try {
        const key = `session_library_carousels_${projId}_${usrId || 'anon'}`;
        const todayStr = new Date().toISOString().slice(0, 10);
        sessionStorage.setItem(key, JSON.stringify({
            date: todayStr,
            carousels
        }));
    } catch (e) {
        console.warn("Could not save library carousels to sessionStorage:", e);
    }
};

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
    const carouselCount = context?.carouselCount;
    const planLimits = user?.planLimits;
    const isRealAdmin = (planLimits?.planName === 'admin' || user?.role === 'admin') && !isSimulating;

    const [globalCarouselCount, setGlobalCarouselCount] = useState<number | null>(null);
    const [renewalDateStr, setRenewalDateStr] = useState<string | null>(null);
    const [daysUntilRenewal, setDaysUntilRenewal] = useState<number | null>(null);

    const fetchGlobalCarouselCount = async () => {
        try {
            const summary = await api.getAnalyticsSummary();
            if (summary && typeof summary.totalCarousels === 'number') {
                setGlobalCarouselCount(summary.totalCarousels);
            }
            if (summary?.renewalDate) {
                setRenewalDateStr(summary.renewalDate);
            }
            if (typeof summary?.daysUntilRenewal === 'number') {
                setDaysUntilRenewal(summary.daysUntilRenewal);
            }
        } catch (e) {}
    };

    const formattedRenewalDate = useMemo(() => {
        const raw = renewalDateStr || planLimits?.renewalDate || user?.planLimits?.renewalDate;
        if (!raw) return null;
        try {
            const d = new Date(raw);
            if (isNaN(d.getTime())) return null;
            return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
            return null;
        }
    }, [renewalDateStr, planLimits?.renewalDate, user?.planLimits?.renewalDate]);

    const [carousels, setCarousels] = useState<ProjectCarousel[]>([]);
    const [availablePool, setAvailablePool] = useState<any[]>([]);
    const [loadingCarousels, setLoadingHooks] = useState(true);
    const [unlockingMore, setUnlockingMore] = useState(false);
    const [unlockingSingle, setUnlockingSingle] = useState(false);
    const [isClone, setIsClone] = useState(false);
    const [isMaster, setIsMaster] = useState(false);
    const [masterParentId, setMasterParentId] = useState<string | null>(null);
    const [projectChecked, setProjectChecked] = useState(false);
    const [showUpgradeModalLocal, setShowUpgradeModalLocal] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Lógica de 7 elementos por página y 7 aleatorios en biblioteca
    const itemsPerPage = 7;
    const LIBRARY_COUNT = 7;

    const [activeTab, setActiveTab] = useState<'library' | 'generated'>('library');
    const [libraryCarousels, setLibraryCarousels] = useState<any[]>([]);
    const [libraryTotal, setLibraryTotal] = useState(0);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
    const [activeLibraryIdx, setActiveLibraryIdx] = useState(0);
    const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
    const [uploadingImageIdx, setUploadingImageIdx] = useState<number | null>(null);

    const [activeKitTab, setActiveKitTab] = useState<'slides' | 'caption'>('slides');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLibraryCarousels, setSearchLibraryCarousels] = useState<any[]>([]);
    const [isSearchingLibraryCarousels, setIsSearchingLibraryCarousels] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [localTitle, setLocalTitle] = useState('');
    const [localStrategy, setLocalStrategy] = useState('');
    const [saving, setSaving] = useState(false);

    const [strategyItems, setStrategyItems] = useState<string[]>([
        "Atrae atención rápido.",
        "Educa y genera confianza.",
        "Convierte vistas en clientes."
    ]);

    const hasInitializedTab = useRef(false);

    useEffect(() => {
        hasInitializedTab.current = false;
    }, [projectId]);

    const parseStrategyItems = (strategyRaw: any): string[] => {
        if (!strategyRaw) {
            return [
                "Atrae atención rápido.",
                "Educa y genera confianza.",
                "Convierte vistas en clientes."
            ];
        }
        if (Array.isArray(strategyRaw)) {
            const items = strategyRaw.map(s => String(s).trim()).filter(Boolean);
            while (items.length < 3) items.push("");
            return items.slice(0, 3);
        }
        if (typeof strategyRaw === 'string') {
            const trimmed = strategyRaw.trim();
            if (trimmed.startsWith('[')) {
                try {
                    const arr = JSON.parse(trimmed);
                    if (Array.isArray(arr)) {
                        const items = arr.map(s => String(s).trim()).filter(Boolean);
                        while (items.length < 3) items.push("");
                        return items.slice(0, 3);
                    }
                } catch(e) {}
            }
            // Split by semicolon, newlines, bullet points, or dashes
            const separators = [';', '\n', '•', '-'];
            let items: string[] = [];
            for (const sep of separators) {
                if (trimmed.includes(sep)) {
                    items = trimmed.split(sep).map(s => s.trim()).filter(Boolean);
                    break;
                }
            }
            if (items.length === 0) {
                // split by sentence dots
                items = trimmed.split('.').map(s => s.trim()).filter(s => s.length > 2);
            }
            while (items.length < 3) items.push("");
            return items.slice(0, 3);
        }
        return [
            "Atrae atención rápido.",
            "Educa y genera confianza.",
            "Convierte vistas en clientes."
        ];
    };

    const updateStrategyItem = (idx: number, val: string) => {
        setStrategyItems(prev => {
            const copy = [...prev];
            copy[idx] = val;
            return copy;
        });
    };

    const handleBlurStrategyItems = async (updatedItems: string[]) => {
        if (!currentCarousel) return;
        const jsonStr = JSON.stringify(updatedItems);
        try {
            await api.updateProjectCarousel(currentCarousel.id, {
                psychologicalStrategy: jsonStr
            });
            setCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, psychologicalStrategy: jsonStr } : c));
            if (activeTab === 'library') {
                setLibraryCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, psychologicalStrategy: jsonStr } : c));
            }
        } catch (e) {
            console.error("Error updating strategy items:", e);
        }
    };

    const activeCarousel = useMemo(() => {
        return carousels[activeCarouselIdx];
    }, [carousels, activeCarouselIdx]);

    const activeLibraryCarousel = useMemo(() => {
        return libraryCarousels[activeLibraryIdx];
    }, [libraryCarousels, activeLibraryIdx]);

    useEffect(() => {
        const term = searchTerm.trim();
        if (!term || activeTab !== 'library' || !projectId) {
            setSearchLibraryCarousels([]);
            setIsSearchingLibraryCarousels(false);
            return;
        }

        setIsSearchingLibraryCarousels(true);
        const timer = setTimeout(async () => {
            try {
                const rawResults = await api.getProjectCarousels(projectId, { search: term });
                const unlockedIds = new Set(carousels.map(c => String(c.masterCarouselId || c.id).replace('available-', '')));
                const unlockedTitles = new Set(carousels.map(c => (c.title || '').toLowerCase().trim()));

                const filtered = (rawResults || [])
                    .filter((c: any) => !c.isUnlocked && !c.isGenerated)
                    .filter((c: any) => {
                        const cleanId = String(c.masterCarouselId || c.id).replace('available-', '');
                        return !unlockedIds.has(cleanId) && !unlockedTitles.has((c.title || '').toLowerCase().trim());
                    });

                setSearchLibraryCarousels(filtered);
                setActiveLibraryIdx(0);
            } catch (err) {
                console.error("Error searching carousels in DB:", err);
            } finally {
                setIsSearchingLibraryCarousels(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, projectId, activeTab, carousels]);

    const filteredCarousels = useMemo(() => {
        let currentData = activeTab === 'library' 
            ? (searchTerm.trim() !== '' ? searchLibraryCarousels : libraryCarousels) 
            : carousels;
        if (activeTab === 'generated') {
            // For 'generated' (Mis Carruseles) tab:
            if (isRealAdmin) {
                currentData = carousels.filter(c => c.isGenerated || (c as any).isUnlocked);
            } else {
                currentData = carousels.filter(c => (c as any).isUnlocked);
            }
        }
        if (!searchTerm.trim()) return currentData;
        if (activeTab === 'library') {
            return isRealAdmin ? currentData : currentData.filter(c => c.isActive !== false && (c.isActive as any) !== 0);
        }
        const term = searchTerm.toLowerCase();
        return currentData.filter(c => 
            (c.title || '').toLowerCase().includes(term) ||
            ((c as any).psychological_strategy || c.psychologicalStrategy || '').toLowerCase().includes(term)
        );
    }, [activeTab, libraryCarousels, searchLibraryCarousels, carousels, searchTerm, isRealAdmin]);

    useEffect(() => {
        setCurrentPage(1);
        if (activeTab === 'library') {
            setActiveLibraryIdx(0);
        } else {
            setActiveCarouselIdx(0);
        }
    }, [searchTerm, activeTab]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredCarousels.length / itemsPerPage);
    }, [filteredCarousels, itemsPerPage]);

    const paginatedCarousels = useMemo(() => {
        return filteredCarousels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredCarousels, currentPage, itemsPerPage]);

    const currentCarousel = useMemo(() => {
        const list = filteredCarousels;
        if (list.length === 0) return null;
        if (activeTab === 'library') {
            return list[activeLibraryIdx] || list[0] || null;
        } else {
            return list[activeCarouselIdx] || list[0] || null;
        }
    }, [activeTab, filteredCarousels, activeLibraryIdx, activeCarouselIdx]);

    const isCurrentUnlocked = useMemo(() => {
        return activeTab === 'generated' || (currentCarousel && (currentCarousel as any).isUnlocked) || isRealAdmin;
    }, [activeTab, currentCarousel, isRealAdmin]);

    // Carga de carruseles con selección aleatoria de 7 en biblioteca y caché en sessionStorage
    const loadCarouselsData = async (targetCarouselId?: string) => {
        if (!projectId) return [];
        setLoadingHooks(true);
        try {
            const rawData = await api.getProjectCarousels(projectId);
            const userUnlocked = (rawData || []).filter(
                (c: any) => c.isUnlocked || c.isGenerated
            );
            const masterAvailable = (rawData || []).filter(
                (c: any) => !c.isUnlocked && !c.isGenerated
            );

            setCarousels(userUnlocked);
            setAvailablePool(masterAvailable);

            // Mantener lógica de tab inicial:
            // Si el usuario no tiene carruseles desbloqueados -> 'library' (Biblioteca)
            // Si el usuario ya tiene carruseles desbloqueados -> 'generated' (Mis Carruseles)
            if (!hasInitializedTab.current) {
                if (userUnlocked.length > 0) {
                    setActiveTab('generated');
                } else {
                    setActiveTab('library');
                }
                hasInitializedTab.current = true;
            }

            // Gestión de los 7 carruseles aleatorios con caché de sesión
            const cachedLibrary = getSessionLibraryCache(projectId, user?.id);
            const unlockedMasterIds = new Set(userUnlocked.map((u: any) => String(u.masterCarouselId || u.id)));
            const unlockedTitles = new Set(userUnlocked.map((u: any) => (u.title || '').toLowerCase().trim()));

            let newLibrary: any[] = [];
            if (cachedLibrary && cachedLibrary.length > 0) {
                // Filtrar los que ya hayan sido desbloqueados durante la sesión
                const validCached = cachedLibrary.filter(c => {
                    const cleanMasterId = String(c.masterCarouselId || c.id).replace('available-', '');
                    return !unlockedMasterIds.has(cleanMasterId) && !unlockedTitles.has((c.title || '').toLowerCase().trim());
                });

                if (validCached.length >= LIBRARY_COUNT) {
                    newLibrary = validCached.slice(0, LIBRARY_COUNT);
                } else {
                    // Si se desbloqueó alguno, rellenar hasta 7 con los disponibles restantes
                    const usedIds = new Set(validCached.map(c => String(c.id)));
                    const availableRemaining = masterAvailable.filter(c => !usedIds.has(String(c.id)));
                    const needed = LIBRARY_COUNT - validCached.length;
                    const fill = availableRemaining.slice(0, needed);
                    newLibrary = [...validCached, ...fill];
                }
            } else {
                // Primera vez que entra en la sesión de hoy: barajar y seleccionar 7 aleatorios
                const randomized = [...masterAvailable].sort(() => Math.random() - 0.5);
                newLibrary = randomized.slice(0, LIBRARY_COUNT);
            }

            // Guardar en sessionStorage para mantener la misma lista en la sesión activa
            setSessionLibraryCache(projectId, user?.id, newLibrary);
            setLibraryCarousels(newLibrary);
            setLibraryTotal(newLibrary.length);

            if (targetCarouselId) {
                const genIdx = userUnlocked.findIndex((c: any) => String(c.id) === String(targetCarouselId) || String(c.masterCarouselId) === String(targetCarouselId).replace('available-', ''));
                if (genIdx !== -1) {
                    setActiveCarouselIdx(genIdx);
                    setCurrentPage(Math.floor(genIdx / itemsPerPage) + 1);
                }
            }
            return userUnlocked;
        } catch (e) {
            console.error("Error loading carousels:", e);
            setCarousels([]);
            return [];
        } finally {
            setLoadingHooks(false);
            setLoadingLibrary(false);
        }
    };

    // Inicializar datos del proyecto
    useEffect(() => {
        const checkProjectAndLoad = async () => {
            if (!projectId) return;
            try {
                const proj = await api.getProjectById(projectId);
                if (proj) {
                    setIsClone(!!proj.masterParentId);
                    setIsMaster(!!proj.isMaster);
                    setMasterParentId(proj.masterParentId || null);
                }
                await loadCarouselsData();
                await fetchGlobalCarouselCount();
            } catch (e) {
                console.error("Error checking project:", e);
            } finally {
                setProjectChecked(true);
            }
        };
        checkProjectAndLoad();
    }, [projectId]);

    // Reset slide index when active carousel changes
    useEffect(() => {
        setCurrentSlideIdx(0);
        if (currentCarousel) {
            setLocalTitle(currentCarousel.title || '');
            const strat = currentCarousel.psychologicalStrategy || '';
            setLocalStrategy(strat);
            setStrategyItems(parseStrategyItems(strat));
        } else {
            setLocalTitle('');
            setLocalStrategy('');
            setStrategyItems(["Atrae atención rápido.", "Educa y genera confianza.", "Convierte vistas en clientes."]);
        }
    }, [currentCarousel]);

    // Handle Title and Strategy Update
    const handleSaveChanges = async () => {
        if (!currentCarousel || saving) return;
        setSaving(true);
        try {
            await api.updateProjectCarousel(currentCarousel.id, {
                title: localTitle,
                psychologicalStrategy: localStrategy
            });
            // Update in local state
            setCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, title: localTitle, psychologicalStrategy: localStrategy } : c));
            if (activeTab === 'library') {
                setLibraryCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, title: localTitle, psychologicalStrategy: localStrategy } : c));
            }
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
        if (!currentCarousel) return;
        const updatedSlides = [...(currentCarousel.contentJson?.slides || [])];
        if (updatedSlides[slideIdx]) {
            updatedSlides[slideIdx] = {
                ...updatedSlides[slideIdx],
                [field]: value
            };
        }
        const newContentJson = {
            ...(currentCarousel.contentJson || {}),
            slides: updatedSlides
        };
        try {
            await api.updateProjectCarousel(currentCarousel.id, {
                contentJson: newContentJson
            });
            setCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
            if (activeTab === 'library') {
                setLibraryCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
            }
        } catch (err) {
            console.error("Error updating slide field:", err);
        }
    };

    const handleAddSlide = async () => {
        if (!currentCarousel) return;
        const currentSlides = currentCarousel.contentJson?.slides || [];
        const newSlide = {
            title: `Slide ${currentSlides.length + 1}: Título llamativo`,
            description: `Descripción del slide ${currentSlides.length + 1} para retener audiencia.`,
            image: ''
        };
        const updatedSlides = [...currentSlides, newSlide];
        const newContentJson = {
            ...(currentCarousel.contentJson || {}),
            slides: updatedSlides
        };
        try {
            await api.updateProjectCarousel(currentCarousel.id, {
                contentJson: newContentJson
            });
            setCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
            if (activeTab === 'library') {
                setLibraryCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
            }
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
            const res = await api.unlockSingleCarousel(projectId, masterId);
            confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 }
            });
            await fetchGlobalCarouselCount();
            await loadCarouselsData(res?.id || masterId);
            setActiveTab('generated');
            setCurrentPage(1);
        } catch (err: any) {
            console.error("Error unlocking single carousel:", err);
            if (err.message && err.message.includes("límite")) {
                setShowLockModal(true);
            } else {
                alert(err.message || "Error al desbloquear el carrusel.");
            }
        } finally {
            setUnlockingSingle(false);
            setShowConfirmModal(false);
        }
    };

    // Handle unlock 10 more
    const handleUnlockMore = async () => {
        if (!projectId || unlockingMore) return;
        setUnlockingMore(true);
        try {
            await api.unlockMoreCarousels(projectId);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 }
            });
            await fetchGlobalCarouselCount();
            await loadCarouselsData();
            setActiveTab('generated');
            setActiveCarouselIdx(0);
            setCurrentPage(1);
        } catch (err: any) {
            console.error("Error unlocking carousels batch:", err);
            if (err.message && err.message.includes("límite")) {
                setShowLockModal(true);
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
                await loadCarouselsData();
                setActiveCarouselIdx(0);
                setActiveLibraryIdx(0);
                alert("Carrusel eliminado correctamente.");
            } catch (e: any) {
                alert("Error al eliminar: " + e.message);
            } finally {
                setSaving(false);
            }
        }
    };

    // Plan limits and counts (bolsa global compartida entre proyectos)
    const isStarter = planLimits?.planName === 'starter';
    const unlockedCount = carousels.filter(c => (c as any).isUnlocked || c.isGenerated).length;
    const maxCarousels = planLimits?.maxCarousels || 50;
    const totalUsedCarousels = globalCarouselCount !== null 
        ? globalCarouselCount 
        : (typeof carouselCount === 'number' ? carouselCount : unlockedCount);
    const isLimitReached = !isRealAdmin && totalUsedCarousels >= maxCarousels;
    const usagePercent = maxCarousels > 0 ? Math.min(100, (totalUsedCarousels / maxCarousels) * 100) : 0;

    let progressColor = "bg-orange-500";
    if (usagePercent >= 100) progressColor = isRealAdmin ? "bg-orange-500" : "bg-red-500";

    // Create manual carousel
    const handleCreateManualCarousel = async () => {
        if (isLimitReached) {
            setShowLockModal(true);
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
                                image: ""
                            }
                        ],
                        caption: "¡Aquí va la descripción o caption para tu post de Instagram/Facebook!"
                    },
                    isGenerated: false,
                    updatedAt: now
                };
                const created = await api.createProjectCarousel(projectId, carouselData);
                await loadCarouselsData(created?.id);
                setActiveTab('generated');
                alert("¡Carrusel manual creado!");
            } catch (e: any) {
                alert("Error al crear carrusel: " + e.message);
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header matches Hooks style perfectly */}
            {!overrideProjectId ? (
                <div className="space-y-6">
                    <StepHeaderCard
                        stepNumber={8}
                        totalSteps={totalSteps}
                        stageNumber={2}
                        categoryTitle="8. Carruseles Magnéticos"
                        title={<>Descarga tus <span className="text-[#FF5A1F]">Carruseles Magnéticos</span></>}
                        description="Usa carruseles visuales de Instagram y Facebook diseñados por profesionales para captar la atención de tu audiencia, educar de forma visual rápida y conseguir conversiones automáticas."
                    />

                    {/* --- VIDEO TUTORIAL --- */}
                    <div className="bg-[#0f172a]/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
                        <StepVideoContainer 
                            stepNumber={8}
                            videoUrl="https://www.youtube.com/embed/bTV5aFTchJ8?rel=0&controls=1&showinfo=0"
                            title="Video Tutorial Carruseles"
                        />
                    </div>
                </div>
            ) : (
                <StepHeaderCard
                    stepNumber={8}
                    totalSteps={totalSteps}
                    stageNumber={2}
                    categoryTitle="8. Carruseles Magnéticos"
                    title={<>Descarga tus <span className="text-[#FF5A1F]">Carruseles Magnéticos</span></>}
                    description="Usa carruseles visuales de Instagram y Facebook diseñados por profesionales para captar la atención de tu audiencia, educar de forma visual rápida y conseguir conversiones automáticas."
                />
            )}

            {/* MAIN GRID LAYOUT ALIGNED WITH HOOKS DESIGN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: LISTADO DE CARRUSELES */}
                <div id="psd-carousel-list-col" className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:self-start">
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
                                    <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Carruseles Desbloqueados</span>
                                    <span className="text-white font-bold">{isRealAdmin ? '∞' : `${totalUsedCarousels} / ${maxCarousels}`}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (totalUsedCarousels > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                                {!isRealAdmin && formattedRenewalDate && (
                                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5 text-xs text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block animate-pulse"></span>
                                            Renovación de créditos:
                                        </span>
                                        <span className="text-orange-300 font-semibold">{formattedRenewalDate}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Buscador de Carruseles */}
                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                {isSearchingLibraryCarousels ? (
                                    <Loader2 className="h-4 w-4 text-orange-400 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4 text-gray-500" />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder={activeTab === 'library' ? "Buscar Carruseles en toda la base de datos..." : "Buscar Carruseles por título..."}
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

                        {/* Badge informativo de resultados de búsqueda en base de datos */}
                        {searchTerm.trim() !== '' && activeTab === 'library' && !isSearchingLibraryCarousels && (
                            <div className="mb-4 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-between text-xs text-orange-300">
                                <span>Resultados en base de datos: <strong>{filteredCarousels.length}</strong></span>
                                <span className="text-[10px] text-gray-400">Búsqueda global</span>
                            </div>
                        )}

                        {/* Selector de Pestañas */}
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-6">
                            {unlockedCount === 0 ? (
                                <>
                                    <button 
                                        onClick={() => { setActiveTab('library'); setActiveLibraryIdx(0); setCurrentPage(1); }}
                                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'library' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        Biblioteca
                                    </button>
                                    <button 
                                        onClick={() => { setActiveTab('generated'); setActiveCarouselIdx(0); setCurrentPage(1); }}
                                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'generated' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        Mis Carruseles
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => { setActiveTab('generated'); setActiveCarouselIdx(0); setCurrentPage(1); }}
                                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'generated' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        Mis Carruseles
                                    </button>
                                    <button 
                                        onClick={() => { setActiveTab('library'); setActiveLibraryIdx(0); setCurrentPage(1); }}
                                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'library' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        Biblioteca
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            {(activeTab === 'library' ? (loadingLibrary || isSearchingLibraryCarousels) : loadingCarousels) ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-black/20 rounded-xl border border-white/5">
                                    <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                                    <p className="text-xs text-gray-400">Buscando en toda la base de datos...</p>
                                </div>
                            ) : paginatedCarousels.length > 0 ? (
                                paginatedCarousels.map((carousel: any, idxInPage: number) => {
                                    const globalIdx = (currentPage - 1) * itemsPerPage + idxInPage;
                                    const isCardSelected = activeTab === 'library' ? activeLibraryIdx === idxInPage : activeCarouselIdx === globalIdx;
                                    const isUnlocked = activeTab === 'generated' || (carousel as any).isUnlocked || isRealAdmin;
                                    const isCarouselActive = carousel.isActive !== false && (carousel.isActive as any) !== 0;

                                    return (
                                        <div 
                                            key={carousel.id || idxInPage} 
                                            onClick={() => {
                                                if (activeTab === 'library') {
                                                    setActiveLibraryIdx(idxInPage);
                                                } else {
                                                    setActiveCarouselIdx(globalIdx);
                                                }
                                                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                                    document.getElementById('psd-carousel-detail-col')?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${
                                                isCardSelected 
                                                    ? (activeTab === 'library' ? 'bg-orange-900/40 border-orange-500/50' : 'bg-emerald-900/40 border-emerald-500/50') 
                                                    : 'bg-black/20 border-gray-800 hover:border-gray-700'
                                            } ${isCardSelected ? 'translate-x-2' : ''} ${(!isRealAdmin && !isUnlocked && (carousel as any).masterCarouselId) ? 'opacity-60 grayscale' : ''}`}
                                        >
                                            <div className="flex-1">
                                                <h4 className={`text-white text-[1.2rem] leading-[1.8rem] font-light whitespace-normal break-words ${
                                                    isCardSelected 
                                                        ? (activeTab === 'library' ? 'text-orange-300' : 'text-emerald-300') 
                                                        : 'text-white group-hover:text-white'
                                                } flex items-center gap-2`}>
                                                    {!isRealAdmin && !isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
                                                    {carousel.title}
                                                </h4>
                                            </div>
                                            {isRealAdmin && (
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const nextActive = !isCarouselActive;
                                                        api.updateProjectCarousel(carousel.id, { isActive: nextActive })
                                                            .then(() => {
                                                                setCarousels(prev => prev.map(c => c.id === carousel.id ? { ...c, isActive: nextActive } : c));
                                                                setLibraryCarousels(prev => prev.map(c => c.id === carousel.id ? { ...c, isActive: nextActive } : c));
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
                            ) : searchTerm.trim() ? (
                                <div className="text-center py-10 px-4 bg-black/20 rounded-xl border border-white/5 space-y-2">
                                    <Search className="w-8 h-8 text-gray-500 mx-auto opacity-50" />
                                    <p className="text-sm text-gray-300 font-medium">No se encontraron carruseles</p>
                                    <p className="text-xs text-gray-500">No encontramos coincidencias para "{searchTerm}" en la base de datos.</p>
                                </div>
                            ) : (
                                <div className="py-10 text-center text-gray-500 italic">No hay carruseles disponibles.</div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                                <button 
                                    disabled={currentPage === 1} 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                                    className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-orange-400 disabled:opacity-20 transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Pág. <span className="text-white">{currentPage}</span> de <span className="text-white">{totalPages}</span>
                                </span>
                                <button 
                                    disabled={currentPage === totalPages} 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                                    className="p-2 rounded-lg bg-black/40 border border-white/5 text-gray-500 hover:text-orange-400 disabled:opacity-20 transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {activeTab === 'generated' && (
                            <button 
                                onClick={() => { setActiveTab('library'); setActiveLibraryIdx(0); setCurrentPage(1); }}
                                className="w-full mt-6 py-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20 cursor-pointer"
                            >
                                <span>CREAR MÁS CARRUSELES</span>
                                <ArrowRight className="w-4 h-4 stroke-[3]" />
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DETALLE Y RESULTADO */}
                <div id="psd-carousel-detail-col" className="lg:col-span-7 space-y-8 scroll-mt-24">
                    <div className="lg:hidden flex items-center justify-between pb-2">
                        <button 
                            type="button"
                            onClick={() => document.getElementById('psd-carousel-list-col')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-xs text-[#FF5A1F] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a la lista de Carruseles
                        </button>
                    </div>
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
                                    <div className="space-y-2 text-xs md:text-sm">
                                        {parseStrategyItems(currentCarousel.psychologicalStrategy || "").map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-[#FF5D1E] shrink-0" strokeWidth={1.8} />
                                                <span className="text-zinc-200 font-normal">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-lg animate-pulse">
                                <Lock className="w-10 h-10 text-orange-500" />
                            </div>

                            <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Carruseles Disponibles para Desbloquear</h4>
                            <p className="text-white font-medium leading-relaxed max-w-md mx-auto mb-10" style={{ fontSize: '1.1rem' }}>Nuestro equipo de marketing ha redactado y diseñado esta plantilla para ti. Haz clic en Desbloquear para añadirla a tu colección.</p>

                            <button 
                                onClick={isLimitReached ? () => setShowLockModal(true) : () => setShowConfirmModal(true)}
                                disabled={unlockingSingle}
                                className={`w-full py-5 rounded-2xl ${isLimitReached ? 'bg-gradient-to-r from-[#FF5D1E] to-orange-600 hover:brightness-110' : 'bg-orange-600 hover:bg-orange-500'} text-white font-black text-xl uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-70 cursor-pointer`}
                            >
                                {unlockingSingle ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : isLimitReached ? (
                                    <Crown className="w-6 h-6 fill-current text-white animate-pulse" />
                                ) : (
                                    <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                )}
                                {unlockingSingle ? 'Desbloqueando...' : isLimitReached ? 'Actualizar a PRO 👑' : 'Desbloquear Carrusel'}
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
                                        </div>
                                    )}

                                    {/* --- Estrategia Psicológica (como en Hooks) --- */}
                                    <div className="border-t border-white/[0.06] pt-5 mt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-medium text-white">Estrategia Psicológica</h4>
                                            {isRealAdmin && (
                                                <span className="text-[10px] text-orange-400 font-medium bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                                                    Editable por Admin
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-2.5 text-xs md:text-sm">
                                            {[0, 1, 2].map((idx) => {
                                                const parsed = parseStrategyItems(localStrategy || currentCarousel.psychologicalStrategy || "");
                                                const val = strategyItems[idx] !== undefined ? strategyItems[idx] : (parsed[idx] || "");
                                                return (
                                                    <div key={idx} className="flex items-center gap-2.5">
                                                        <CheckCircle2 className="w-4.5 h-4.5 text-[#FF5D1E] shrink-0" strokeWidth={1.8} />
                                                        {isRealAdmin ? (
                                                            <input
                                                                type="text"
                                                                value={val}
                                                                onChange={(e) => updateStrategyItem(idx, e.target.value)}
                                                                onBlur={() => handleBlurStrategyItems(strategyItems)}
                                                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-zinc-100 text-xs md:text-sm font-normal outline-none focus:border-[#FF5D1E] focus:ring-1 focus:ring-[#FF5D1E] transition-all"
                                                                placeholder={`Ítem ${idx + 1} de la estrategia...`}
                                                            />
                                                        ) : (
                                                            <span className="text-zinc-300 font-normal">{val}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
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
                                <div className="space-y-6 text-left">
                                    {currentCarousel.contentJson?.slides && currentCarousel.contentJson.slides.length > 0 ? (
                                        <div className="space-y-8 bg-black/40 border border-white/5 p-6 rounded-[20px] max-w-4xl mx-auto w-full">
                                            {currentCarousel.contentJson.slides.map((slide: any, idx: number) => (
                                                <div key={idx} className="space-y-4 border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
                                                    
                                                    {/* Badge Slide X & Delete button */}
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-2.5 py-1 rounded-lg">
                                                            Slide {idx + 1}
                                                        </span>
                                                        
                                                        {/* Delete Slide Button for Admin */}
                                                        {isRealAdmin && currentCarousel.contentJson.slides.length > 1 && (
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm(`¿Estás seguro de eliminar el Slide ${idx + 1}?`)) {
                                                                        const updatedSlides = currentCarousel.contentJson.slides.filter((_: any, sIdx: number) => sIdx !== idx);
                                                                        const newContentJson = {
                                                                            ...(currentCarousel.contentJson || {}),
                                                                            slides: updatedSlides
                                                                        };
                                                                        await api.updateProjectCarousel(currentCarousel.id, { contentJson: newContentJson });
                                                                        setCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
                                                                        if (activeTab === 'library') {
                                                                            setLibraryCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
                                                                        }
                                                                        setCurrentSlideIdx(0);
                                                                    }
                                                                }}
                                                                className="p-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-900/30 text-red-400 hover:text-red-300 rounded-full transition-all cursor-pointer flex items-center justify-center"
                                                                title="Eliminar Slide"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Display Image if it exists */}
                                                    {slide.image ? (
                                                        <div className="relative group rounded-xl overflow-hidden border border-white/10 w-full max-w-2xl">
                                                            <img
                                                                src={slide.image}
                                                                alt={`Slide ${idx + 1}`}
                                                                className="w-full h-64 object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs w-full max-w-2xl">
                                                            Sin imagen cargada. {isRealAdmin ? 'Sube una o escribe su URL abajo.' : ''}
                                                        </div>
                                                    )}

                                                    {/* Admin Controls to edit image URL and upload directly to GCS bucket */}
                                                    {isRealAdmin && (
                                                        <div className="space-y-3 w-full max-w-2xl bg-white/5 p-4 rounded-xl border border-white/5">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">URL de la Imagen</label>
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={slide.image || ''}
                                                                        onChange={e => handleUpdateSlideField('image', e.target.value, idx)}
                                                                        placeholder="Escribe la URL o sube un archivo..."
                                                                        className="flex-1 bg-black border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                                                                    />
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        id={`slide-file-input-${idx}`}
                                                                        className="hidden"
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (!file) return;
                                                                            setUploadingImageIdx(idx);
                                                                            try {
                                                                                const res = await api.uploadFile(file, {
                                                                                    projectId: projectId,
                                                                                    folderType: 'carrouseles',
                                                                                    carouselId: currentCarousel.id
                                                                                });
                                                                                await handleUpdateSlideField('image', res.url, idx);
                                                                            } catch (err: any) {
                                                                                alert('Error al subir: ' + err.message);
                                                                            } finally {
                                                                                setUploadingImageIdx(null);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        disabled={uploadingImageIdx === idx}
                                                                        onClick={() => document.getElementById(`slide-file-input-${idx}`)?.click()}
                                                                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-40"
                                                                        title="Subir archivo"
                                                                    >
                                                                        {uploadingImageIdx === idx ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                                                        ) : (
                                                                            <UploadCloud className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Download & View Slide buttons if image exists */}
                                                    {slide.image && (
                                                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl px-4">
                                                            {/* Ver Slide Button */}
                                                            <a
                                                                href={slide.image}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white text-zinc-200 text-sm font-bold uppercase tracking-wider transition-all border border-white/5 shadow-md cursor-pointer"
                                                            >
                                                                <ImageIcon className="w-4 h-4 text-orange-400" />
                                                                <span>Ver Slide {idx + 1}</span>
                                                            </a>

                                                            {/* Descargar Slide Button */}
                                                            <button
                                                                onClick={() => {
                                                                    const titleSanitized = (currentCarousel?.title || "slide")
                                                                        .toLowerCase()
                                                                        .replace(/[^a-z0-9]/g, "-")
                                                                        .substring(0, 30);
                                                                    forceDownloadImage(slide.image, `${titleSanitized}-slide-${idx + 1}.png`);
                                                                }}
                                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5D1E] to-orange-600 hover:brightness-110 text-white text-sm font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(255,93,30,0.3)] cursor-pointer"
                                                            >
                                                                <Download className="w-5 h-5" />
                                                                <span>Descargar Slide {idx + 1}</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Add Slide Button at the very bottom for Admin */}
                                            {isRealAdmin && (
                                                <div className="pt-4 border-t border-white/5 flex justify-center w-full">
                                                    <button
                                                        onClick={handleAddSlide}
                                                        className="py-3 px-6 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md mx-auto"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Añadir Slide
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center bg-slate-900/30 rounded-3xl text-slate-500 max-w-4xl mx-auto w-full">
                                            <p className="mb-4">No hay slides en este carrusel.</p>
                                            {isRealAdmin && (
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={handleAddSlide}
                                                        className="py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md mx-auto"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Añadir primer Slide
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB PANEL 2: Feed caption / Copy */}
                            {activeKitTab === 'caption' && (
                                <div className="space-y-4 text-left">
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
                                    {isRealAdmin ? (
                                        <textarea
                                            value={currentCarousel.contentJson?.feedCopy || currentCarousel.contentJson?.caption || ''}
                                            onChange={async (e) => {
                                                const val = e.target.value;
                                                const newContentJson = {
                                                    ...(currentCarousel.contentJson || {}),
                                                    feedCopy: val,
                                                    caption: val
                                                };
                                                try {
                                                    await api.updateProjectCarousel(currentCarousel.id, {
                                                        contentJson: newContentJson
                                                    });
                                                    setCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
                                                    if (activeTab === 'library') {
                                                        setLibraryCarousels(prev => prev.map(c => c.id === currentCarousel.id ? { ...c, contentJson: newContentJson } : c));
                                                    }
                                                } catch (err) {
                                                    console.error("Error saving caption:", err);
                                                }
                                            }}
                                            rows={8}
                                            placeholder="Escribe el texto recomendado para el feed aquí..."
                                            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left font-mono text-xs sm:text-sm text-slate-300 leading-relaxed outline-none focus:border-orange-500"
                                        />
                                    ) : (
                                        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto">
                                            {currentCarousel.contentJson?.feedCopy || currentCarousel.contentJson?.caption || "No hay copia de feed disponible."}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-orange-500/20 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5D1E] to-amber-500"></div>
                        <div className="p-8 md:p-10 space-y-6 flex-1 overflow-y-auto">
                            <div className="flex flex-col items-center text-center space-y-5">
                                <div className="w-16 h-16 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/20 shadow-lg shadow-orange-950/20 animate-pulse"><Sparkles className="w-8 h-8" /></div>
                                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1">
                                    ¿Quieres diseñar este <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Carrusel?</span>
                                </h1>
                                <p className="text-zinc-200 text-base md:text-lg leading-relaxed font-medium">
                                    {isRealAdmin ? (
                                        "Como Administrador tienes acceso ilimitado para diseñar todos los carruseles que desees."
                                    ) : (
                                        <>
                                            Al diseñar este carrusel consumirás 1 crédito mensual de tu plan ({totalUsedCarousels + 1} de {maxCarousels} este mes).
                                            {formattedRenewalDate && (
                                                <span className="block mt-2 text-sm text-orange-400 font-normal">
                                                    Tus créditos se renuevan el {formattedRenewalDate}.
                                                </span>
                                            )}
                                        </>
                                    )}
                                </p>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4 shadow-inner text-left">
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-zinc-300 font-black uppercase tracking-widest text-xs">Carruseles Desbloqueados</span>
                                    <span className="text-orange-400 font-black text-sm sm:text-base">{isRealAdmin ? '∞' : `${totalUsedCarousels} / ${maxCarousels}`}</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-lg`} style={{ width: `${isRealAdmin ? (totalUsedCarousels > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-zinc-300 text-center leading-relaxed font-semibold bg-white/[0.03] p-4 rounded-xl border border-white/5 shadow-inner">
                                Al confirmar, nuestra Inteligencia Artificial comenzará el diseño estratégico de inmediato.
                            </p>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-300 font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer">No, cancelar</button>
                            <button onClick={() => { setShowConfirmModal(false); handleUnlockSingle(currentCarousel.id); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#FF5D1E] to-orange-600 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-orange-900/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">Sí, Diseñar Carrusel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Plan Modal dialog */}
            <UpgradeModal
                isOpen={showUpgradeModalLocal}
                onClose={() => setShowUpgradeModalLocal(false)}
                reason="Las plantillas completas de Carruseles de Instagram y Facebook diseñadas profesionalmente por nuestro equipo de expertos están reservadas para usuarios del Plan PRO."
            />

            {showLockModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowLockModal(false)}>
                    <div className="bg-[#0B0B0B] border border-amber-500/20 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-[#FF5D1E]"></div>
                        <div className="p-8 md:p-10 space-y-6 flex-1 overflow-y-auto text-center">
                            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-lg shadow-amber-950/20 animate-pulse">
                                <Lock className="w-8 h-8" />
                            </div>
                            
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                Característica Exclusiva <span className="text-amber-400">Plan PRO</span>
                            </h2>
                            
                            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed text-left bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                <p className="font-bold text-white text-center text-base mb-2">
                                    ¡Diseña Carruseles que Detengan el Scroll! 🚀
                                </p>
                                <p>
                                    Generar Carruseles Magnéticos interactivos aumentará drásticamente el engagement y la autoridad de tu marca en redes sociales.
                                </p>
                                <p className="border-t border-white/5 pt-3">
                                    Adquiriendo el <strong className="text-amber-400 font-black">Plan PRO</strong> recibirás acceso completo para generar y diseñar carruseles persuasivos completos por IA, optimizados por expertos para convertir seguidores en compradores.
                                </p>
                            </div>
                        </div>
                        
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                            <button 
                                onClick={() => setShowLockModal(false)} 
                                className="flex-1 py-4 rounded-xl bg-white/5 text-gray-300 font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    setShowLockModal(false);
                                    setShowUpgradeModalLocal(true);
                                }} 
                                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF5D1E] text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-amber-900/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse cursor-pointer"
                            >
                                👑 Obtener Plan PRO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
