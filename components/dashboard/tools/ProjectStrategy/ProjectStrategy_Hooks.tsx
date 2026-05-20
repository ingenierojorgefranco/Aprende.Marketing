import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Zap, Sparkles, Check, Target, Loader2, PlayCircle, X, PenTool, Brain, ArrowRight, ChevronLeft, ChevronRight, Video, Megaphone, Layout, Image as ImageIcon, Copy, CheckCircle2, ChevronDown, ChevronUp, Download, Plus, Unlock, Save, Trash2, Lock, Shield, AlertTriangle, Wand2, Search, Play } from 'lucide-react';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';
import { DeletionRestrictionModal } from '../../DeletionRestrictionModal';
import { ProjectHook } from '../../../../types';

interface ProjectStrategy_HooksProps {
  strategyData: any;
  activeHook: number;
  setActiveHook: (idx: number) => void;
  handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
  handleTooltipLeave: () => void;
  overrideProjectId?: string;
}

const seededShuffle = (array: any[], seed: number) => {
  const shuffled = [...array];
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const ProjectStrategy_Hooks: React.FC<ProjectStrategy_HooksProps> = ({
  activeHook,
  setActiveHook,
  handleTooltipHover,
  handleTooltipLeave,
  overrideProjectId
}) => {
  const { id: routeProjectId } = useParams() as { id: string };
  const projectId = overrideProjectId || routeProjectId;
  const context = useOutletContext() as any;
  const user = context?.user;
  const isSimulating = context?.isSimulating;
  const hookCount = context?.hookCount;
  const planLimits = user?.planLimits;
  const isRealAdmin = (planLimits?.planName === 'admin' || user?.role === 'admin') && !isSimulating;
  const initialSelectionDone = useRef(false);
  const skipReset = useRef(false);
  const sessionSeed = useRef(Math.random());
  
  const [hooks, setHooks] = useState<ProjectHook[]>([]);
  const [loadingHooks, setLoadingHooks] = useState(true);
  const [unlockingMore, setUnlockingMore] = useState(false);
  const [unlockingSingle, setUnlockingSingle] = useState(false);
  const [isClone, setIsClone] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [masterParentId, setMasterParentId] = useState<string | null>(null);
  const [projectChecked, setProjectChecked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpgradeModalLocal, setShowUpgradeModalLocal] = useState(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  
  const [globalHookCount, setGlobalHookCount] = useState<number | null>(null);

  const fetchGlobalHookCount = async () => {
    try {
      const summary = await api.getAnalyticsSummary();
      if (summary && typeof summary.totalHooks === 'number') {
        setGlobalHookCount(summary.totalHooks);
      }
    } catch (e) {
      console.error("Error fetching global hook count:", e);
    }
  };
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeKitTab, setActiveKitTab] = useState<'video' | 'ads' | 'thumbs' | 'publish'>('video');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'generated'>('library');
  const [libraryHooks, setLibraryHooks] = useState<any[]>([]);
  const [libraryTotal, setLibraryTotal] = useState(0);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [libraryPage, setLibraryPage] = useState(1);
  const [activeLibraryHook, setActiveLibraryHook] = useState(0);

  const [localTitle, setLocalTitle] = useState("");
  const [localStrategy, setLocalStrategy] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [isEditingScript, setIsEditingScript] = useState(false);
  const [tempScript, setTempScript] = useState("");
  const [isEditingAds, setIsEditingAds] = useState(false);
  const [tempAds, setTempAds] = useState("");
  const [tempPinnedComment, setTempPinnedComment] = useState("");
  const [tempReelTitle, setTempReelTitle] = useState("");

  const loadingMessages = [
    "Analizando ángulo psicológico...",
    "Redactando guion de alto impacto...",
    "Optimizando copy para anuncios...",
    "Diseñando conceptos visuales..."
  ];

  const loadHooks = async () => {
    if (!projectId) return [];
    setLoadingHooks(true);
    try {
        const data = await api.getProjectHooks(projectId);
        setHooks(data);
        setLoadingHooks(false);
        return data;
    } catch (e) {
        console.error("Error cargando ganchos dinámicos:", e);
        setLoadingHooks(false);
        return [];
    }
  };

  const formatRelativeTime = (dateInput: any) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `Hace ${diffInSeconds} segundos`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  };

  const loadLibrary = async (page: number, masterId?: string | null) => {
    if (!projectId) return;
    setLoadingLibrary(true);
    try {
        // Pedimos un lote grande (pool) para evitar huecos en la paginación local
        const res = await api.getHooksLibrary(1, 80, masterId || undefined, projectId);
        setLibraryHooks(res.hooks);
        setLibraryTotal(res.total);
    } catch (e) {
        console.error("Error cargando biblioteca:", e);
    } finally {
        setLoadingLibrary(false);
    }
  };

  const displayLibraryHooks = useMemo(() => {
    // 1. Ganchos del proyecto (Manuales + Desbloqueados que no son 'Generated')
    const projectHooks = hooks.filter(h => !h.isGenerated);

    // 2. Ganchos de la biblioteca (Estrategia Maestra) que NO están en el proyecto
    const libraryPool = libraryHooks.filter(lh => {
        // Filtramos cualquier gancho que ya exista en el proyecto (sea manual, desbloqueado o generado)
        const alreadyInProject = hooks.some(h => 
            String(h.id) === String(lh.id) || 
            (h.masterHookId && String(h.masterHookId) === String(lh.id))
        );
        return !alreadyInProject;
    });

    console.log("--- DEBUG: displayLibraryHooks ---");
    console.log("isRealAdmin:", isRealAdmin);
    console.log("sessionSeed:", sessionSeed.current);
    console.log("Total hooks en proyecto (Manuales/Desbloqueados):", projectHooks.length);
    console.log("Total hooks en biblioteca maestra (No desbloqueados):", libraryPool.length);

    if (isRealAdmin) {
        // Admin: Ve solo los ganchos del proyecto en orden cronológico
        console.log("Admin detectado: Mostrando solo ganchos del proyecto.");
        return projectHooks.sort((a, b) => {
            const dateA = new Date((a as any).createdAt || 0).getTime();
            const dateB = new Date((b as any).createdAt || 0).getTime();
            return dateB - dateA;
        });
    }

    // Usuario Normal:
    // A. Prioridad: Manuales y Desbloqueados (Nuevos primero)
    const priorityHooks = projectHooks
        .filter(h => h.isActive !== false)
        .sort((a, b) => {
            const dateA = new Date((a as any).createdAt || 0).getTime();
            const dateB = new Date((b as any).createdAt || 0).getTime();
            return dateB - dateA;
        });

    // B. Biblioteca: Estrategia maestra restante (Aleatorio)
    console.log("IDs antes de aleatorizar:", libraryPool.slice(0, 5).map(h => h.id));
    const shuffled = seededShuffle(libraryPool, sessionSeed.current);
    console.log("IDs después de aleatorizar:", shuffled.slice(0, 5).map(h => h.id));

    const randomLibrary = shuffled.filter(h => h.isActive !== false);

    // Unificamos: Prioridad arriba, Biblioteca aleatoria después
    const unifiedList = [...priorityHooks, ...randomLibrary].slice(0, 60);
    
    console.log("Lista final (primeros 5 IDs):", unifiedList.slice(0, 5).map(h => h.id));
    console.log("--- END DEBUG ---");

    return unifiedList;
  }, [hooks, libraryHooks, isRealAdmin]);

  const displayGeneratedHooks = useMemo(() => {
    return hooks
        .filter(h => h.isGenerated)
        .sort((a, b) => {
            const dateA = new Date((a as any).updatedAt || (a as any).createdAt || 0).getTime();
            const dateB = new Date((b as any).updatedAt || (b as any).createdAt || 0).getTime();
            return dateB - dateA;
        });
  }, [hooks]);

  useEffect(() => {
    const checkProject = async () => {
        if (!projectId) return;
        try {
            const p = await api.getProjectById(projectId);
            let mParentId: string | null = null;
            if (p?.masterParentId) {
                setIsClone(true);
                mParentId = String(p.masterParentId);
                setMasterParentId(mParentId);
            }
            if (p?.isMaster) setIsMaster(true);
            
            // Cargamos el pool de la biblioteca si no lo tenemos
            if (activeTab === 'library' && libraryHooks.length === 0) {
                await loadLibrary(1, mParentId);
            }
        } catch (e) {
            console.error("Error al revisar proyecto para hooks:", e);
        } finally {
            setProjectChecked(true);
        }
    };
    checkProject();
    loadHooks();
    fetchGlobalHookCount();
  }, [projectId, activeTab]);

  const defaultKitContent = {
    script: "Aquí ingresa el guion del video persuasivo...",
    reelTitle: "🎬 Título sugerido para tu Reel...",
    ads: "🔥 Aquí ingresa la descripción para tus anuncios...\n\n✅ Beneficio 1\n✅ Beneficio 2\n\n🔗 [LINK]",
    pinnedComment: "📌 Comentario fijado sugerido para este video...",
    videoUrl: "https://www.youtube.com/embed/vGfXD9VbfXo",
    downloadUrl: "https://www.youtube.com/watch?v=vGfXD9VbfXo",
    thumbs: [
      "Diseño Sugerido 1",
      "Diseño Sugerido 2",
      "Diseño Sugerido 3"
    ]
  };

  const filteredHooks = useMemo(() => {
    const currentData = activeTab === 'library' ? displayLibraryHooks : displayGeneratedHooks;
    if (!searchTerm.trim()) return currentData;
    
    return currentData.filter(hook => 
        (hook.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((hook as any).psychological_strategy || hook.psychologicalStrategy || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, displayLibraryHooks, displayGeneratedHooks, searchTerm]);

  const totalPages = Math.ceil(filteredHooks.length / itemsPerPage);
    
  const paginatedHooks = activeTab === 'library' 
    ? filteredHooks.slice((libraryPage - 1) * itemsPerPage, libraryPage * itemsPerPage) 
    : filteredHooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentHook = useMemo(() => {
    return filteredHooks[activeTab === 'library' ? activeLibraryHook : activeHook] || { 
      id: '', 
      projectId: '', 
      title: "Selecciona un gancho", 
      psychologicalStrategy: "N/A", 
      contentJson: null, 
      isGenerated: false 
    } as ProjectHook;
  }, [filteredHooks, activeTab, activeLibraryHook, activeHook]);

  const isCurrentUnlocked = (currentHook as any).isUnlocked || !(currentHook as any).masterHookId;
  const canGenerate = isCurrentUnlocked && !currentHook.isGenerated && !isRealAdmin;

  useEffect(() => {
    if (currentHook && currentHook.id) {
        setLocalTitle(currentHook.title || "");
        setLocalStrategy((currentHook as any).psychological_strategy || currentHook.psychologicalStrategy || "");
        setIsEditingTitle(false);
        setIsEditingScript(false);
        setIsEditingAds(false);
    }
  }, [currentHook]);

  const [searchParams] = useSearchParams();
  const hookIdFromUrl = searchParams.get('hookId');

  useEffect(() => {
    if (hookIdFromUrl && hooks.length > 0 && !initialSelectionDone.current) {
        // Buscamos específicamente en los ganchos generados
        const index = displayGeneratedHooks.findIndex(h => String(h.id) === String(hookIdFromUrl));
        if (index !== -1) {
            skipReset.current = true;
            setActiveTab('generated');
            setActiveHook(index);
            // Calcular y establecer la página correcta para la lista interna
            const calculatedPage = Math.floor(index / itemsPerPage) + 1;
            setCurrentPage(calculatedPage);
            initialSelectionDone.current = true;
        }
    }
  }, [hookIdFromUrl, hooks, setActiveHook, itemsPerPage, displayGeneratedHooks, setActiveTab]);

  const handleUnlockMore = async () => {
    setUnlockingMore(true);
    try {
        const res = await api.unlockMoreHooks(projectId);
        await loadHooks();
        await fetchGlobalHookCount();
        alert(res.message || "¡10 nuevos ganchos añadidos a tu estrategia!");
    } catch (e: any) {
        alert(e.message || "Error al cargar más ganchos.");
    } finally {
        setUnlockingMore(false);
    }
  };

  const handleUnlockSingle = () => {
    setShowConfirmModal(true);
  };

  const executeUnlock = async () => {
    const hook = currentHook;
    
    if (!hook || !projectId || !(hook as any).masterHookId) return;
    
    if (!isRealAdmin && currentHooksCount >= maxHooks) {
        alert("Límite de ganchos alcanzado. Por favor, actualiza tu plan para desbloquear más.");
        return;
    }

    setShowConfirmModal(false);
    setUnlockingSingle(true);
    setGenerationStatus('generating');
    setProgress(0);
    setSecondsElapsed(0);

    const timerInterval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
    }, 1000);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        if (currentProgress < 99) {
            currentProgress += 1;
            setProgress(currentProgress);
            const msgIdx = Math.min(Math.floor((currentProgress / 100) * loadingMessages.length), loadingMessages.length - 1);
            setLoadingStep(msgIdx);
        }
    }, 909);
    
    try {
        const res = await api.unlockSingleHook(projectId, (hook as any).masterHookId);
        await handleGenerateKit(res.id);
        
        clearInterval(progressInterval);
        clearInterval(timerInterval);
        setProgress(100);

        // Recargar biblioteca para que los huecos se llenen
        loadLibrary(1, masterParentId);
        
        // Cargar los ganchos generados y cambiar a esa pestaña
        const freshHooks = await loadHooks();
        await fetchGlobalHookCount();
        setActiveTab('generated');
        
        // Seleccionar el primer gancho (el más nuevo) en la primera página
        setActiveHook(0);
        setCurrentPage(1);
        
        setGenerationStatus('success');
        
        // Efecto Confeti Total (Cañón Izquierdo, Derecho y Central) - 2 segundos
        const end = Date.now() + (2 * 1000);
        const colors = ['#FF5A1F', '#10B981', '#FFFFFF'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors: colors,
                zIndex: 1000
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors: colors,
                zIndex: 1000
            });
            confetti({
                particleCount: 3,
                angle: 90,
                spread: 100,
                origin: { x: 0.5, y: 0.8 },
                colors: colors,
                zIndex: 1000
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    } catch (e: any) {
        clearInterval(progressInterval);
        clearInterval(timerInterval);
        alert("Error al desbloquear gancho: " + e.message);
        setGenerationStatus('idle');
    } finally {
        setUnlockingSingle(false);
    }
  };

  const handleUpdateMessage = async (field: string, value: any, hookIdOverride?: string) => {
    const targetId = hookIdOverride || currentHook.id;
    if (!targetId) return;
    try {
        await api.updateProjectHook(targetId, { [field]: value });
        
        // Actualizar en el estado de ganchos del proyecto
        setHooks(prev => prev.map(h => {
            if (h.id === targetId) {
                const updated = { ...h, [field]: value };
                if (field === 'psychological_strategy') {
                    (updated as any).psychologicalStrategy = value;
                }
                return updated;
            }
            return h;
        }));

        // También actualizar en el estado de la biblioteca si existe allí
        setLibraryHooks(prev => prev.map(h => {
            if (h.id === targetId) {
                const updated = { ...h, [field]: value };
                if (field === 'psychological_strategy') {
                    (updated as any).psychologicalStrategy = value;
                }
                return updated;
            }
            return h;
        }));
    } catch (e) {
        console.error("Error updating hook:", e);
    }
  };

  // Resetear página al buscar o cambiar pestaña
  useEffect(() => {
    // Si estamos procesando una selección inicial por URL, no reseteamos
    if (skipReset.current) {
        skipReset.current = false;
        return;
    }

    setCurrentPage(1);
    setActiveHook(0);
    setActiveLibraryHook(0);
    if (activeTab === 'library' && projectChecked) {
        setLibraryPage(1);
        loadLibrary(1, masterParentId);
    }
  }, [searchTerm, activeTab, projectChecked, masterParentId]);

  const currentKit = currentHook.contentJson || defaultKitContent;

  const handleUpdateKitJson = async (field: string, value: any) => {
    if (!currentHook.id) return;
    try {
        const updatedKit = { ...currentKit, [field]: value };
        await api.updateProjectHook(currentHook.id, { contentJson: updatedKit });
        setHooks(prev => prev.map(h => h.id === currentHook.id ? { ...h, contentJson: updatedKit } : h));
    } catch (e) {
        console.error("Error updating kit json:", e);
    }
  };

  const handleSaveScript = async () => {
    if (!currentHook.id) return;
    setSaving(true);
    try {
        const updatedKit = { ...currentKit, script: tempScript };
        await api.updateProjectHook(currentHook.id, { contentJson: updatedKit });
        setHooks(prev => prev.map(h => h.id === currentHook.id ? { ...h, contentJson: updatedKit } : h));
        setIsEditingScript(false);
    } catch (e) {
        alert("Error al guardar el guion");
    } finally {
        setSaving(false);
    }
  };

  const handleSaveAds = async () => {
    if (!currentHook.id) return;
    setSaving(true);
    try {
        const updatedKit = { ...currentKit, ads: tempAds, pinnedComment: tempPinnedComment, reelTitle: tempReelTitle };
        await api.updateProjectHook(currentHook.id, { contentJson: updatedKit });
        setHooks(prev => prev.map(h => h.id === currentHook.id ? { ...h, contentJson: updatedKit } : h));
        setIsEditingAds(false);
    } catch (e) {
        alert("Error al guardar los cambios");
    } finally {
        setSaving(false);
    }
  };

  const handleGenerateKit = async (hookIdOverride?: string) => {
    const hookId = hookIdOverride || currentHook.id;
    if (!hookId) return;

    if (!hookIdOverride) {
        setGenerationStatus('generating');
        setProgress(0);
        setSecondsElapsed(0);
    }

    const timerInterval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
    }, 1000);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        if (currentProgress < 99) {
            currentProgress += 1;
            setProgress(currentProgress);
            const msgIdx = Math.min(Math.floor((currentProgress / 100) * loadingMessages.length), loadingMessages.length - 1);
            setLoadingStep(msgIdx);
        }
    }, 909);

    try {
        const now = new Date().toISOString();
        // Guardamos explícitamente el timestamp en la base de datos
        await api.updateProjectHook(hookId, { isGenerated: true, updatedAt: now });
        setHooks(prev => prev.map(h => h.id === hookId ? { ...h, isGenerated: true, updatedAt: now } : h));
        
        // Si no es un override (es decir, viene de executeUnlock), esperamos un poco para simular
        if (!hookIdOverride) {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        clearInterval(progressInterval);
        clearInterval(timerInterval);
        
        if (!hookIdOverride) {
            setProgress(100);
            setGenerationStatus('success');
            
            // Efecto Confeti Total (Cañón Izquierdo, Derecho y Central) - 2 segundos
            const end = Date.now() + (2 * 1000);
            const colors = ['#FF5A1F', '#10B981', '#FFFFFF'];

            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: colors,
                    zIndex: 1000
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: colors,
                    zIndex: 1000
                });
                confetti({
                    particleCount: 3,
                    angle: 90,
                    spread: 100,
                    origin: { x: 0.5, y: 0.8 },
                    colors: colors,
                    zIndex: 1000
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    } catch (e) {
        clearInterval(progressInterval);
        clearInterval(timerInterval);
        if (!hookIdOverride) setGenerationStatus('idle');
        throw e;
    }
  };

  const handleCreateManualHook = async () => {
    if (isLimitReached) {
        setShowUpgradeModalLocal(true);
        return;
    }
    if (window.confirm("¿Deseas crear el hook manualmente?")) {
        setSaving(true);
        try {
            const now = new Date().toISOString();
            const hookData = {
                title: 'Nuevo Gancho Manual',
                psychological_strategy: 'Ingresa aquí el enfoque estratégico...',
                contentJson: defaultKitContent,
                isGenerated: false,
                updatedAt: now
            };
            const res = await api.createProjectHook(projectId, hookData);
            await loadHooks();
            
            // Selección automática en la biblioteca
            setActiveTab('library');
            setActiveLibraryHook(0);
            setLibraryPage(1);
            
            alert("¡Gancho manual creado! Edítalo en la biblioteca y luego genera el kit.");
        } catch (e: any) {
            alert("Error al crear gancho: " + e.message);
        } finally {
            setSaving(false);
        }
    }
  };

  const handleDeleteHook = async () => {
    const isGenerated = currentHook.isGenerated;
    const isAdmin = user?.role === 'admin';

    if (!isAdmin && isGenerated) {
      setShowRestrictionModal(true);
      return;
    }

    if (window.confirm("¿Deseas eliminar este hook? No se puede recuperar")) {
        setSaving(true);
        try {
            await api.deleteProjectHook(currentHook.id);
            await loadHooks();
            setActiveHook(0);
            alert("Gancho eliminado correctamente.");
        } catch (e: any) {
            alert("Error al eliminar: " + e.message);
        } finally {
            setSaving(false);
        }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Contenido copiado al portapapeles");
  };

  const maxHooks = user?.maxHooks || planLimits?.maxHooks || 30;
  const currentHooksCount = typeof globalHookCount === 'number' ? globalHookCount : (hookCount ?? hooks.filter(h => h.isGenerated).length);
  const isLimitReached = !isRealAdmin && currentHooksCount >= maxHooks;
  const usagePercent = maxHooks > 0 ? Math.min(100, (currentHooksCount / maxHooks) * 100) : 0;
  
  let progressColor = "bg-green-500";
  if (usagePercent > 50) progressColor = "bg-yellow-500";
  if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
      <style>{`
        @keyframes loading-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-shine {
          animation: loading-shine 2s infinite;
        }
      `}</style>
      
      {/* Div agrupador para encabezado y video (seccion_encabezado) */}
      {!overrideProjectId && (
        <div className="seccion_encabezado space-y-12 mb-20">
            {/* --- HEADER SECCIÓN --- */}
            <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                {/* Degradado superior sutil */}
                <div className="absolute inset-x-0 -top-24 h-[600px] bg-orange-600/10 blur-[140px] -z-10 rounded-full" />
                
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                    <Zap className="w-4 h-4 fill-current" /> Hooks de Atracción de Audiencia
                </div>
                
                <div className="space-y-4 px-4">
                    <h3 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 tracking-tight leading-none">
                        Hooks de Atracción
                    </h3>
                    <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                      Un Hook no es solo una pregunta; es el puente que detiene el scroll de tu cliente ideal. Hemos diseñado estos ganchos para atacar directamente los deseos de libertad y crecimiento de tu avatar.
                    </p>
                </div>
            </div>

            {/* --- VIDEO EXPLICATIVO --- */}
            <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                <div className="inline-flex items-center gap-3 text-orange-300 font-extrabold uppercase tracking-widest text-sm bg-orange-500/5 px-8 py-4 rounded-2xl border border-orange-500/10 backdrop-blur-sm mx-auto">
                    <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                </div>
                
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                    
                    <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-orange-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/bTV5aFTchJ8?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial Hooks" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
      )}

      {generationStatus === 'generating' && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 !mt-0">
            <div className="bg-[#0B0B0B] border border-white/5 rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in fade-in duration-500 flex flex-col items-center space-y-10">
                {/* Icono de la varita con efecto de brillo */}
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full"></div>
                    <div className="relative w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center border border-orange-500/30 shadow-2xl shadow-orange-500/10">
                        <Wand2 className="w-12 h-12 text-orange-400 animate-pulse" />
                    </div>
                </div>

                {/* Texto de generación en negrita y profesional */}
                <div className="text-center space-y-3">
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
                        Redactando tu Kit de Contenido
                    </h3>
                    <p className="text-orange-400/80 font-bold text-sm uppercase tracking-[0.2em] animate-pulse">
                        {loadingMessages[loadingStep]}
                    </p>
                </div>

                {/* Badge de advertencia */}
                <div className="px-6 py-2 bg-red-600/20 border border-red-600/30 rounded-full shadow-lg">
                    <p className="text-red-500 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> No cierres esta página
                    </p>
                </div>

                {/* Sección de contador con degradado oscuro */}
                <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-center space-y-4">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tu kit estará listo en:</p>
                    <div className="text-white font-mono text-6xl font-black tracking-tighter">
                        {Math.floor(Math.max(0, 90 - secondsElapsed) / 60).toString().padStart(2, '0')}:{(Math.max(0, 90 - secondsElapsed) % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                {/* Barra de progreso profesional */}
                <div className="w-full max-w-xl space-y-4">
                    <div className="flex justify-between text-[11px] font-black text-gray-500 uppercase tracking-widest px-1">
                        <span>Psicología de Atracción</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-8 bg-gray-900 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                        <div 
                            className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(234,88,12,0.3)] relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-loading-shine"></div>
                        </div>
                    </div>
                </div>

                <p className="text-gray-500 font-medium text-[10px] uppercase tracking-widest">Sincronizando con tu estrategia Maestra...</p>
            </div>
        </div>
      )}

      {generationStatus === 'success' && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500 !mt-0">
            <div className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">¡Kit de Contenido Generado!</h3>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg mx-auto">
                        Tu guion, descripción de anuncios y miniatura sugerida están listos para ser utilizados.
                    </p>
                </div>

                <div className="w-full max-w-sm pt-4">
                    <button 
                        onClick={() => setGenerationStatus('idle')}
                        className="w-full py-6 bg-orange-600 hover:bg-orange-500 text-white font-black text-xl uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_20px_50px_rgba(234,88,12,0.3)] transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4 group"
                    >
                        Ver mi Kit de Contenido <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" /> Acceso Instantáneo Desbloqueado
                    </p>
                </div>
            </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* LISTADO DE HOOKS */}
        <div className="lg:col-span-5 space-y-6 sticky top-24 self-start">
          <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400 border border-orange-900/50">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Hooks de Atracción</h4>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={handleCreateManualHook}
                    disabled={saving}
                    className="p-2 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] rounded-xl hover:bg-[#FF5A1F] hover:text-white transition-all group"
                    title="Añadir Manualmente"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Barra de Progreso de Hooks */}
            <div className="w-full mb-6">
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full shadow-inner">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Hooks Desbloqueados</span>
                  <span className="text-white font-bold">{currentHooksCount} / {isRealAdmin ? '∞' : maxHooks}</span>
                </div>
                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full transition-all duration-1000 ease-out shadow-lg bg-orange-500" style={{ width: `${isRealAdmin ? (currentHooksCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* Buscador de Hooks */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar hooks por título o estrategia..."
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
                onClick={() => { setActiveTab('library'); setActiveLibraryHook(0); }}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'library' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Biblioteca de Hooks
              </button>
              <button 
                onClick={() => { setActiveTab('generated'); setActiveHook(0); }}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'generated' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Hooks Generados
              </button>
            </div>
            
            <div className="space-y-4">
              {isRealAdmin && activeTab === 'library' && !loadingLibrary && displayLibraryHooks.length > 0 && (
                <div className="px-1 pb-1">
                  <span className="text-orange-500/70 text-[10px] font-bold uppercase tracking-widest">
                    {displayLibraryHooks.length} Hooks en la biblioteca
                  </span>
                </div>
              )}
              {(activeTab === 'library' ? loadingLibrary : loadingHooks) ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-400" /></div>
              ) : paginatedHooks.length > 0 ? (
                paginatedHooks.map((hook: ProjectHook, idxInPage: number) => {
                  const globalIdx = (activeTab === 'library' ? (libraryPage - 1) * itemsPerPage : (currentPage - 1) * itemsPerPage) + idxInPage;
                  const isActive = activeTab === 'library' ? activeLibraryHook === globalIdx : activeHook === globalIdx;
                  const isUnlocked = (hook as any).isUnlocked || activeTab === 'generated';
                  const isGenerated = hook.isGenerated;

                  return (
                    <div 
                      key={hook.id} 
                      onClick={() => activeTab === 'library' ? setActiveLibraryHook(globalIdx) : setActiveHook(globalIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all group cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${
                        isActive 
                          ? (activeTab === 'library' ? 'bg-orange-900/40 border-orange-500/50' : 'bg-emerald-900/40 border-emerald-500/50') 
                          : 'bg-black/20 border-gray-800 hover:border-gray-700'
                      } ${isActive ? 'translate-x-2' : ''} ${(!isUnlocked && (hook as any).masterHookId) ? 'opacity-60 grayscale' : ''}`}
                    >
                      <div className="flex-1">
                        <h4 className={`text-white text-[1.2rem] leading-[1.8rem] font-light ${
                          isActive 
                            ? (activeTab === 'library' ? 'text-orange-300' : 'text-emerald-300') 
                            : 'text-white group-hover:text-white'
                        } flex items-center gap-2`}>
                            {!isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
                            {isRealAdmin && hook.id && `${hook.id} - `}{hook.title}
                        </h4>
                        {isGenerated && activeTab === 'generated' && (
                          <span className="text-[10px] text-emerald-500/60 font-medium uppercase tracking-wider">
                            Creado: {formatRelativeTime((hook as any).createdAt || (hook as any).updatedAt)}
                          </span>
                        )}
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isRealAdmin) {
                            handleUpdateMessage('isActive', hook.isActive === false ? true : false, hook.id);
                          }
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        hook.isActive !== false
                          ? (isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-emerald-500/20 border-emerald-500/40')
                          : 'border-gray-800 bg-black/40'
                      } ${isRealAdmin ? 'cursor-pointer hover:scale-110' : ''}`}>
                        {hook.isActive !== false && (
                          <Check className={`w-4 h-4 font-bold ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-gray-500 italic">No hay ganchos disponibles.</div>
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
                  Pág. {activeTab === 'library' ? libraryPage : currentPage}
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

        {/* DETALLE Y RESULTADO */}
        <div className="lg:col-span-7 space-y-8">
            {/* VISTA DE GANCHO BLOQUEADO */}
            {!isCurrentUnlocked && currentHook.id && !isRealAdmin && (
                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/10 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Lock className="w-40 h-40 text-orange-500" /></div>
                    
                    <div className="w-full text-left mb-8">
                      <h3 className="text-white mb-6 font-medium tracking-tight" style={{ fontSize: '1.6rem', lineHeight: '2.2rem' }}>{currentHook.title}</h3>
                      
                      <div className="bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20 backdrop-blur-sm mb-8">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="w-5 h-5 text-orange-400" />
                          <span className="text-white font-bold text-xs uppercase tracking-widest">Enfoque Estratégico</span>
                        </div>
                        <p className="text-white text-lg font-light leading-relaxed">
                          {currentHook.psychologicalStrategy}
                        </p>
                      </div>
                    </div>

                    <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-lg animate-pulse">
                        <Lock className="w-10 h-10 text-orange-500" />
                    </div>

                    <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Hooks Disponibles para Desbloquear</h4>
                    <p className="text-white font-medium leading-relaxed max-w-md mx-auto mb-10" style={{ fontSize: '1.1rem' }}>Nuestro sistema ha generado este Hook de Atracción por ti. Haz clic en Desbloquear para ver todo el contenido.</p>

                    <button 
                        onClick={isLimitReached ? () => setShowUpgradeModalLocal(true) : handleUnlockSingle}
                        disabled={unlockingSingle}
                        className={`w-full py-5 rounded-2xl ${isLimitReached ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-orange-600 hover:bg-orange-500'} text-white font-black text-xl uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group disabled:opacity-70`}
                    >
                        {unlockingSingle ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : isLimitReached ? (
                            <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                        ) : (
                            <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        )}
                        {unlockingSingle ? 'Desbloqueando...' : isLimitReached ? 'Actualiza tu Plan' : 'Desbloquear Hook'}
                    </button>
                    
                    <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        <Shield className="w-3 h-3" /> Acceso Instantáneo tras Desbloqueo
                    </div>
                </div>
            )}

            {isCurrentUnlocked && canGenerate && (
                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-900/10 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Zap className="w-40 h-40 text-orange-500" /></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-orange-500/10 text-orange-300 border-orange-500/20">Ángulo de Venta Seleccionado</span>
                            {currentHook.id && (
                                <button onClick={handleDeleteHook} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-6">
                            {/* Edición In-place para el título */}
                            <div className="relative group/edit">
                                {isEditingTitle ? (
                                    <input 
                                        autoFocus
                                        type="text"
                                        value={localTitle}
                                        onChange={(e) => setLocalTitle(e.target.value)}
                                        onBlur={() => { handleUpdateMessage('title', localTitle); setIsEditingTitle(false); }}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget.blur())}
                                        className="w-full bg-black/60 border border-orange-500 rounded-2xl px-6 py-4 text-white font-black text-2xl outline-none transition-all shadow-inner"
                                    />
                                ) : (
                                    <div 
                                        onClick={() => setIsEditingTitle(true)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-2xl cursor-pointer hover:border-orange-500/50 transition-all shadow-inner min-h-[4rem] flex items-center justify-between"
                                    >
                                        <span>{localTitle}</span>
                                        <div className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-[9px] font-black uppercase text-gray-500 bg-gray-800 px-2 py-1 rounded">Haz clic para editar</div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-orange-500/5 rounded-[3rem] p-8 border border-orange-500/30 backdrop-blur-sm mb-8 flex flex-col gap-4 items-start shadow-inner">
                                <div className="flex items-center gap-2 mb-2">
                                    <Brain className="w-6 h-6 text-orange-400 shrink-0"/>
                                    <h5 className="text-white font-bold text-sm uppercase tracking-widest">Estrategia Psicológica</h5>
                                </div>
                                <div className="w-full pl-8">
                                    <textarea 
                                        value={localStrategy}
                                        onChange={(e) => setLocalStrategy(e.target.value)}
                                        onBlur={() => handleUpdateMessage('psychological_strategy', localStrategy)}
                                        className="w-full bg-transparent border-none text-gray-400 text-lg font-light italic outline-none resize-none h-auto min-h-[100px]"
                                        placeholder="Ingresa aquí el ángulo psicológico..."
                                    />
                                </div>
                            </div>
                        </div>

                        {!isGenerating && (
                            <button 
                                onClick={() => handleGenerateKit()}
                                className="w-full py-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-orange-900/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group"
                            >
                                <Sparkles className="w-6 h-6 group-hover:animate-pulse" /> Crear Kit de Contenido con este ángulo
                            </button>
                        )}
                    </div>
                </div>
            )}

            {(isRealAdmin || (isCurrentUnlocked && currentHook.isGenerated)) && currentHook.id && (
                <div className="animate-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-[#111] border border-emerald-500/30 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    {isEditingTitle ? (
                                        <input 
                                            autoFocus
                                            type="text"
                                            value={localTitle}
                                            onChange={(e) => setLocalTitle(e.target.value)}
                                            onBlur={() => { handleUpdateMessage('title', localTitle); setIsEditingTitle(false); }}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget.blur())}
                                            className="w-full bg-black/40 border border-emerald-500 rounded-xl px-4 py-2 text-white font-black text-xl outline-none focus:border-emerald-500"
                                        />
                                    ) : (
                                        <div 
                                            onClick={() => setIsEditingTitle(true)}
                                            className="group/title-edit cursor-pointer w-full flex items-center justify-between"
                                        >
                                            <h3 className="text-white font-medium leading-tight" style={{ fontSize: '1.6rem', lineHeight: '2.2rem', paddingBottom: '1em' }}>{localTitle}</h3>
                                            <div className="opacity-0 group-hover/title-edit:opacity-100 transition-opacity text-[8px] font-black uppercase text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded ml-4 whitespace-nowrap">Editar Título</div>
                                        </div>
                                    )}
                                    <button onClick={handleDeleteHook} className="p-2 text-gray-500 hover:text-red-500 transition-colors ml-4">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="mt-4 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-6 shadow-inner w-full flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-emerald-400" />
                                        <h5 className="text-white font-bold text-xs uppercase tracking-widest">Estrategia Psicológica</h5>
                                    </div>
                                    <textarea 
                                        value={localStrategy}
                                        onChange={(e) => setLocalStrategy(e.target.value)}
                                        onBlur={() => handleUpdateMessage('psychological_strategy', localStrategy)}
                                        className="w-full bg-transparent border-none text-white text-lg font-light outline-none pl-6"
                                        style={{ height: '140px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-black/20 border-b border-white/5">
                            <div className="w-full flex flex-wrap bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                                <button onClick={() => setActiveKitTab('video')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'video' ? 'bg-[#10B981] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>GUION</button>
                                <button onClick={() => setActiveKitTab('thumbs')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'thumbs' ? 'bg-[#10B981] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Video</button>
                                <button onClick={() => setActiveKitTab('ads')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'ads' ? 'bg-[#10B981] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Descripción</button>
                                <button onClick={() => setActiveKitTab('publish')} className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeKitTab === 'publish' ? 'bg-[#10B981] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Publicar</button>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 min-h-[250px]">
                            {activeKitTab === 'video' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 h-full flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-white font-black text-xl flex items-center gap-3 uppercase tracking-tight">
                                            <Video className="w-6 h-6 text-emerald-400" /> Guión de Video
                                        </h5>
                                        {!isEditingScript ? (
                                            <button 
                                                onClick={() => { setTempScript(currentKit.script); setIsEditingScript(true); }}
                                                className="text-xs font-black text-emerald-400 uppercase bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20"
                                            >
                                                Editar Guion
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleSaveScript}
                                                disabled={saving}
                                                className="text-xs font-black text-emerald-400 uppercase bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20 flex items-center gap-1"
                                            >
                                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                Guardar Cambios
                                            </button>
                                        )}
                                    </div>
                                    <div className="bg-white rounded-[2rem] p-10 shadow-2xl text-gray-900 font-medium text-lg leading-relaxed border-4 border-gray-100 relative transition-all">
                                        {isEditingScript ? (
                                            <textarea 
                                                value={tempScript}
                                                onChange={(e) => setTempScript(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[#0B0B0B] font-medium text-lg outline-none focus:ring-2 focus:ring-[#075E54]/20 min-h-[250px] resize-none"
                                            />
                                        ) : (
                                            <div className="text-gray-900 text-[1.3rem] leading-[2.5rem] font-light whitespace-pre-wrap">
                                                {currentKit.script}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-center">
                                        {!isEditingScript && (
                                            <button 
                                                onClick={() => handleCopy(currentKit.script)} 
                                                className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20"
                                            >
                                                <Copy className="w-5 h-5" /> Copiar Guion
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeKitTab === 'ads' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-white font-black text-xl flex items-center gap-3 uppercase tracking-tight">
                                            <Megaphone className="w-6 h-6 text-emerald-400" /> Kit de Texto (Reel)
                                        </h5>
                                        {!isEditingAds ? (
                                            <button 
                                                onClick={() => { 
                                                    setTempAds(currentKit.ads); 
                                                    setTempPinnedComment(currentKit.pinnedComment || ""); 
                                                    setTempReelTitle(currentKit.reelTitle || "");
                                                    setIsEditingAds(true); 
                                                }}
                                                className="text-xs font-black text-emerald-400 uppercase bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20"
                                            >
                                                Editar Contenido
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={handleSaveAds}
                                                disabled={saving}
                                                className="text-xs font-black text-emerald-400 uppercase bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20 flex items-center gap-1"
                                            >
                                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                Guardar Cambios
                                            </button>
                                        )}
                                    </div>
                                    
                                    {isEditingAds ? (
                                        <div className="space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-emerald-400 font-black uppercase tracking-widest ml-1">Título del Reel</label>
                                                <input 
                                                    type="text"
                                                    value={tempReelTitle}
                                                    onChange={(e) => setTempReelTitle(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-medium text-lg outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
                                                    placeholder="Ingresa un título llamativo..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-emerald-400 font-black uppercase tracking-widest ml-1">Descripción (Caption)</label>
                                                <textarea 
                                                    value={tempAds}
                                                    onChange={(e) => setTempAds(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-medium text-lg outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[200px] resize-none shadow-inner"
                                                    placeholder="Escribe la descripción aquí..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-emerald-400 font-black uppercase tracking-widest ml-1">Comentario Fijado</label>
                                                <textarea 
                                                    value={tempPinnedComment}
                                                    onChange={(e) => setTempPinnedComment(e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-medium text-lg outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[100px] resize-none shadow-inner"
                                                    placeholder="Escribe el comentario fijado..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* BLOQUE TÍTULO */}
                                            <div className="bg-white rounded-[2rem] p-10 shadow-2xl text-gray-900 border-4 border-gray-100 relative group transition-all hover:border-emerald-100">
                                                <div className="absolute top-4 right-6 text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                    <Target className="w-3 h-3" /> Título del Reel
                                                </div>
                                                <h6 className="text-[11px] text-emerald-600 font-black uppercase tracking-widest border-b border-emerald-100 pb-2 w-fit mb-4">Título</h6>
                                                <div className="text-2xl font-black tracking-tight text-gray-900 leading-tight">
                                                    {currentKit.reelTitle || "Sin título definido"}
                                                </div>
                                                {currentKit.reelTitle && (
                                                    <button 
                                                        onClick={() => handleCopy(currentKit.reelTitle)}
                                                        className="absolute bottom-4 right-6 p-2 text-gray-300 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Copiar Título"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* BLOQUE DESCRIPCIÓN */}
                                            <div className="bg-white rounded-[2rem] p-10 shadow-2xl text-gray-900 font-medium text-lg leading-relaxed border-4 border-gray-100 relative group transition-all hover:border-emerald-100">
                                                <div className="absolute top-4 right-6 text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                    <Megaphone className="w-3 h-3" /> Descripción Sugerida
                                                </div>
                                                <h6 className="text-[11px] text-emerald-600 font-black uppercase tracking-widest border-b border-emerald-100 pb-2 w-fit mb-4">Caption / Descripción</h6>
                                                <div className="whitespace-pre-wrap text-gray-800 font-normal leading-[1.8rem]">
                                                    {currentKit.ads}
                                                </div>
                                                <button 
                                                    onClick={() => handleCopy(currentKit.ads)}
                                                    className="absolute bottom-4 right-6 p-2 text-gray-300 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Copiar Descripción"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* BLOQUE COMENTARIO FIJADO */}
                                            <div className="bg-[#f8fafc] rounded-[2rem] p-10 shadow-xl text-gray-900 font-medium border-4 border-emerald-50/50 relative group transition-all hover:border-emerald-100">
                                                <div className="absolute top-4 right-6 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Sparkles className="w-3 h-3 text-emerald-400" /> Comentario de Valor
                                                </div>
                                                <h6 className="text-[11px] text-emerald-600 font-black uppercase tracking-widest border-b border-emerald-100 pb-2 w-fit mb-4">Comentario Fijado</h6>
                                                <div className="whitespace-pre-wrap italic text-gray-600 font-light leading-relaxed">
                                                    {currentKit.pinnedComment || "Sin comentario fijado"}
                                                </div>
                                                {currentKit.pinnedComment && (
                                                    <button 
                                                        onClick={() => handleCopy(currentKit.pinnedComment)}
                                                        className="absolute bottom-4 right-6 p-2 text-gray-400 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Copiar Comentario"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!isEditingAds && (
                                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                                            <button 
                                                onClick={() => handleCopy(currentKit.ads)} 
                                                className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transform hover:scale-105 active:scale-95"
                                            >
                                                <Copy className="w-5 h-5" /> Copiar Descripción
                                            </button>
                                            {currentKit.pinnedComment && (
                                                <button 
                                                    onClick={() => handleCopy(currentKit.pinnedComment)} 
                                                    className="px-10 py-5 bg-gray-800 hover:bg-gray-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 active:scale-95"
                                                >
                                                    <Copy className="w-5 h-5" /> Copiar Comentario
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeKitTab === 'thumbs' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <h5 className="text-white font-black text-xl flex items-center gap-3 uppercase tracking-tight">
                                        <Layout className="w-6 h-6 text-emerald-400" /> Video
                                    </h5>

                                    <div className="space-y-6">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                                            <p className="text-white text-lg font-medium leading-relaxed">
                                                ¡Tu video personalizado está listo! A continuación puedes previsualizar el contenido que hemos diseñado para potenciar tu estrategia. No olvides usar el botón de descarga para guardarlo y empezar a usarlo en tus redes.
                                            </p>
                                        </div>
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                                            <iframe 
                                                className="w-full h-full"
                                                src="https://www.youtube.com/embed/vGfXD9VbfXo"
                                                title="Video de YouTube"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>

                                    {/* SECCIÓN DE EDICIÓN DE URL PARA ADMIN */}
                                    {user?.role === 'admin' && (
                                        <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
                                            <h6 className="text-white font-bold text-sm uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-2">
                                                <PenTool className="w-4 h-4 text-[#10B981]" /> Configuración de Enlaces (Admin)
                                            </h6>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">URL de Descarga</label>
                                                    <input 
                                                        type="text"
                                                        value={currentKit.downloadUrl || ''}
                                                        onChange={(e) => handleUpdateKitJson('downloadUrl', e.target.value)}
                                                        className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-emerald-400 font-mono text-xs outline-none focus:border-emerald-500 transition-all shadow-inner"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentKit.downloadUrl && currentKit.downloadUrl !== defaultKitContent.downloadUrl && (
                                        <div className="flex justify-center">
                                            <a 
                                                href={currentKit.downloadUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
                                            >
                                                <Download className="w-5 h-5" /> Ver y Descargar Video
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeKitTab === 'publish' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="space-y-4">
                                        <h5 className="text-white font-black text-3xl leading-tight">
                                            ¿Cómo publicar automáticamente in redes sociales?
                                        </h5>
                                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                                            Sigue esta guía paso a paso para configurar tu sistema de publicación automatizada y escalar tu presencia digital sin esfuerzo manual constante.
                                        </p>
                                    </div>

                                    <div className="space-y-4 mt-8">
                                        {[1, 2, 3, 4, 5].map((s, idx) => (
                                            <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                                                <button 
                                                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                                                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left"
                                                >
                                                    <span className="font-bold text-white text-lg flex items-center gap-4">
                                                        <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black">{idx + 1}</span>
                                                        Paso {idx + 1}
                                                    </span>
                                                    {openAccordion === idx ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                                                </button>
                                                
                                                {openAccordion === idx && (
                                                    <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black mt-4">
                                                            <iframe 
                                                                className="w-full h-full"
                                                                src="https://www.youtube.com/embed/vGfXD9VbfXo"
                                                                title={`Tutorial Paso ${idx + 1}`}
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      {/* --- MODAL DE CONFIRMACIÓN DE LÍMITES TÉCNICOS --- */}
      {showConfirmModal && (
          <div 
              onClick={() => setShowConfirmModal(false)}
              className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" 
          >
              <div className="bg-[#0B0B0B] border border-orange-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                  <div className="p-8 md:p-10 space-y-8 flex-1 text-center">
                      <div className="w-20 h-20 bg-orange-500/10 text-orange-400 rounded-3xl flex items-center justify-center mx-auto border border-orange-500/20 shadow-lg animate-pulse">
                          <Sparkles className="w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirmar Consumo de Créditos</h3>
                      <p className="text-gray-400 text-lg leading-relaxed font-medium">
                        {(!isRealAdmin && currentHooksCount >= maxHooks) 
                          ? "Has alcanzado el límite de ganchos de tu plan actual. Actualiza tu plan para continuar."
                          : "Al desbloquear este gancho estratégico se consumirá 1 crédito de tu plan actual."}
                      </p>
                      <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] shadow-inner text-left">
                          <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Créditos de Ganchos</span>
                              <span className="text-white font-mono font-bold text-sm">{currentHooksCount} / {isRealAdmin ? '∞' : maxHooks}</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                              <div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]`} style={{ width: `${isRealAdmin ? (currentHooksCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                          </div>
                      </div>
                  </div>
                  <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                      <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button>
                      {(!isRealAdmin && currentHooksCount >= maxHooks) ? (
                          <button onClick={() => { setShowConfirmModal(false); setShowUpgradeModalLocal(true); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Actualizar Plan</button>
                      ) : (
                          <button onClick={executeUnlock} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Desbloquear</button>
                      )}
                  </div>
              </div>
          </div>
      )}
      <UpgradeModal isOpen={showUpgradeModalLocal} onClose={() => setShowUpgradeModalLocal(false)} currentPlan={planLimits?.planName} />
      <DeletionRestrictionModal 
        isOpen={showRestrictionModal}
        onClose={() => setShowRestrictionModal(false)}
        itemName={currentHook.title}
        userEmail={user?.email || ''}
        userName={user?.name || ''}
      />
    </div>
  );
};