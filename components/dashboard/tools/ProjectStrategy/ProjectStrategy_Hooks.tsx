import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Zap, Sparkles, Check, Target, Loader2, PlayCircle, X, PenTool, Brain, ArrowRight, ChevronLeft, ChevronRight, Video, Megaphone, Layout, Image as ImageIcon, Copy, CheckCircle2, ChevronDown, ChevronUp, Download, Plus, Unlock, Save, Trash2, Lock, Shield, AlertTriangle, Wand2, Search, Play } from 'lucide-react';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';
import { DeletionRestrictionModal } from '../../DeletionRestrictionModal';
import { ProjectHook } from '../../../../types';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

interface ProjectStrategy_HooksProps {
  strategyData?: any;
  activeHook?: number;
  setActiveHook?: (idx: number) => void;
  handleTooltipHover?: (e: React.MouseEvent, content: string[]) => void;
  handleTooltipLeave?: () => void;
  overrideProjectId?: string;
  totalSteps?: number;
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
  activeHook: propActiveHook,
  setActiveHook: propSetActiveHook,
  handleTooltipHover = () => {},
  handleTooltipLeave = () => {},
  overrideProjectId,
  totalSteps
}) => {
  const [localActiveHook, setLocalActiveHook] = useState<number>(0);
  const activeHook = propActiveHook !== undefined ? propActiveHook : localActiveHook;
  const setActiveHook = propSetActiveHook || setLocalActiveHook;
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
  const [activeTab, setActiveTab] = useState<'library' | 'generated'>('generated');
  const [libraryHooks, setLibraryHooks] = useState<any[]>([]);
  const [libraryTotal, setLibraryTotal] = useState(0);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [libraryPage, setLibraryPage] = useState(1);
  const [activeLibraryHook, setActiveLibraryHook] = useState(0);

  const [localTitle, setLocalTitle] = useState("");
  const [localStrategy, setLocalStrategy] = useState("");
  const [strategyItems, setStrategyItems] = useState<string[]>(["", "", ""]);
  const [activeHookTabImage1, setActiveHookTabImage1] = useState<"Hook" | "Guion del Hook" | "Publicacion y CTA">("Hook");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const parseStrategyItems = (strategyRaw: any): string[] => {
    if (!strategyRaw) {
      return [
        "Usa voz o texto en pantalla",
        "Mantén el encuadre simple",
        "Continúa con el desarrollo del valor"
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
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            const items = parsed.map(s => String(s).trim()).filter(Boolean);
            while (items.length < 3) items.push("");
            return items.slice(0, 3);
          }
        } catch (e) {
          // fallback
        }
      }
      const lines = trimmed.split(/\r?\n|\|\|/).map(l => l.replace(/^[•\-\*\d+\.\s]+/, '').trim()).filter(Boolean);
      if (lines.length >= 3) {
        return lines.slice(0, 3);
      } else if (lines.length === 2) {
        return [lines[0], lines[1], "Continúa con el desarrollo del valor"];
      } else if (lines.length === 1 && lines[0]) {
        return [lines[0], "Mantén el encuadre simple", "Continúa con el desarrollo del valor"];
      }
    }
    return [
      "Usa voz o texto en pantalla",
      "Mantén el encuadre simple",
      "Continúa con el desarrollo del valor"
    ];
  };

  const updateStrategyItem = (index: number, val: string) => {
    const updated = [...strategyItems];
    updated[index] = val;
    setStrategyItems(updated);
    setLocalStrategy(JSON.stringify(updated));
  };

  const handleBlurStrategyItems = (updatedItems: string[]) => {
    const jsonStr = JSON.stringify(updatedItems);
    handleUpdateMessage('psychological_strategy', jsonStr);
  };

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
        const strat = (currentHook as any).psychological_strategy || currentHook.psychologicalStrategy || "";
        setLocalStrategy(strat);
        setStrategyItems(parseStrategyItems(strat));
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
                psychological_strategy: JSON.stringify([
                    "Usa voz o texto en pantalla",
                    "Mantén el encuadre simple",
                    "Continúa con el desarrollo del valor"
                ]),
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
    <div className="space-y-6 text-left animate-in fade-in duration-500">
      <style>{`
        @keyframes loading-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-shine {
          animation: loading-shine 2s infinite;
        }
      `}</style>
      
      {/* Div agrupador para encabezado y video */}
      {!overrideProjectId && (
        <div className="space-y-6">
            {/* --- HEADER CARD --- */}
            <StepHeaderCard
                stepNumber={5}
                totalSteps={totalSteps}
                stageNumber={2}
                categoryTitle="Tus Ganchos de Venta"
                title={<>Hooks <span className="text-[#FF5A1F]">de Atracción</span></>}
                description="Un Hook no es solo una pregunta; es el puente que detiene el scroll de tu cliente ideal. Hemos diseñado estos ganchos para atacar directamente los deseos de libertad y crecimiento de tu avatar."
            />

            {/* --- VIDEO TUTORIAL --- */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                <StepVideoContainer 
                    videoUrl="https://www.youtube.com/embed/bTV5aFTchJ8?rel=0&controls=1&showinfo=0"
                    title="Video Tutorial Hooks"
                />
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
                  <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Hooks Disponibles este mes</span>
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
                    placeholder="Buscar Hooks por titulo"
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
                onClick={() => { setActiveTab('generated'); setActiveHook(0); }}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'generated' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-gray-500 hover:text-white'}`}
              >
                Hooks Creados
              </button>
              <button 
                onClick={() => { setActiveTab('library'); setActiveLibraryHook(0); }}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'library' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-gray-500 hover:text-white'}`}
              >
                Biblioteca de Hooks
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
                          <span className="text-white font-bold text-xs uppercase tracking-widest">Estrategia Psicológica</span>
                        </div>
                        <div className="space-y-2 text-xs md:text-sm">
                          {parseStrategyItems(currentHook.psychologicalStrategy || (currentHook as any).psychological_strategy).map((item, idx) => (
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

            {/* VISTA COMPLETA IMAGEN 1 (Actualizada según requerimientos) */}
            {isCurrentUnlocked && currentHook.id && (
                <div className="bg-[#08080c] border border-white/10 rounded-[24px] p-6 md:p-8 space-y-6 shadow-2xl mb-8 text-left">
                    {/* Header Card (Ficha de la Imagen 1) */}
                    <div className="bg-[#0c0c11]/80 border border-white/10 p-5 md:p-6 rounded-[20px] flex flex-col justify-between gap-4 shadow-2xl">
                        <div className="space-y-2 text-left">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] md:text-xs font-black tracking-widest text-[#FF5D1E] uppercase">
                                    VIDEO HOOK #{(activeTab === 'library' ? activeLibraryHook : activeHook) + 1}
                                </span>
                                <span className="text-[10px] md:text-xs text-zinc-500 font-bold">•</span>
                                <span className="text-[10px] md:text-xs font-bold tracking-widest text-zinc-300 uppercase">
                                    {currentHook.angle || currentHook.category || "OPORTUNIDAD"}
                                </span>
                            </div>
                            {isRealAdmin && isEditingTitle ? (
                                <div className="w-full max-w-3xl my-1">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={localTitle}
                                        onChange={(e) => setLocalTitle(e.target.value)}
                                        onBlur={() => { handleUpdateMessage('title', localTitle); setIsEditingTitle(false); }}
                                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                        className="w-full bg-black/80 border border-orange-500 rounded-xl px-4 py-2 text-white font-bold text-sm sm:text-base md:text-lg outline-none transition-all shadow-inner"
                                    />
                                </div>
                            ) : (
                                <div className="relative group/maintitle max-w-3xl">
                                    <h2
                                        onClick={() => isRealAdmin && setIsEditingTitle(true)}
                                        className={`text-sm sm:text-base md:text-lg font-bold text-white tracking-tight leading-relaxed flex items-center gap-2 ${
                                            isRealAdmin ? 'cursor-pointer hover:text-orange-400 transition-colors' : ''
                                        }`}
                                    >
                                        <span>¿{(localTitle || currentHook.title || "").replace(/^¿+|^\?+|^"/g, "").replace(/¿+|\?+$/g, "")}?</span>
                                        {isRealAdmin && (
                                            <span className="opacity-0 group-hover/maintitle:opacity-100 transition-opacity text-[10px] font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded shrink-0">
                                                Editar
                                            </span>
                                        )}
                                    </h2>
                                </div>
                            )}
                            <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 w-full">
                                <button
                                    onClick={() => {
                                        const scriptText = currentKit?.script || localTitle || currentHook.title || "";
                                        navigator.clipboard.writeText(scriptText);
                                        alert("¡Guión copiado al portapapeles!");
                                    }}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm ml-auto"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copiar Guion</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const fullCopy = `HOOK: ${localTitle || currentHook.title || ""}\n\nGUIÓN:\n${currentKit?.script || ""}\n\nCOPY PUBLICITARIO:\n${currentKit?.ads || ""}`;
                                        navigator.clipboard.writeText(fullCopy);
                                        const element = document.createElement("a");
                                        const file = new Blob([fullCopy], { type: 'text/plain' });
                                        element.href = URL.createObjectURL(file);
                                        element.download = `video-hook-${(activeTab === 'library' ? activeLibraryHook : activeHook) + 1}.txt`;
                                        document.body.appendChild(element);
                                        element.click();
                                        document.body.removeChild(element);
                                    }}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FF5D1E] to-orange-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(255,93,30,0.25)] cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Descargar video</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Row de Imagen 1 */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-white/[0.08]">
                        {["Hook", "Guion del Hook", "Publicacion y CTA"].map((tab) => {
                            const isActive = activeHookTabImage1 === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveHookTabImage1(tab as any)}
                                    className={`px-4 py-2 text-xs md:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer duration-200 tracking-wide ${
                                        isActive
                                            ? "border-[#FF5D1E] text-[#FF5D1E]"
                                            : "border-transparent text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content Box de Imagen 1 */}
                    <div className="pt-2">
                        {activeHookTabImage1 === "Hook" && (
                            <div className="p-6 md:p-8 bg-[#0c0c11]/90 border border-white/[0.06] rounded-[24px] text-left space-y-6">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Left: Video Thumbnail */}
                                    <div className="w-[140px] h-[190px] md:w-[160px] md:h-[220px] rounded-2xl bg-zinc-900 border border-white/10 relative overflow-hidden shrink-0 shadow-md">
                                        <img
                                            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop"
                                            alt="Hook aesthetic content thumbnail"
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full border border-white bg-black/10 backdrop-blur-sm flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                                                <Play className="w-5 h-5 fill-white stroke-none ml-0.5" />
                                            </div>
                                        </div>
                                        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold text-white bg-black/80 rounded-[4px] tracking-wide">
                                            0:03
                                        </span>
                                    </div>

                                    {/* Right: Info */}
                                    <div className="flex-1 space-y-5">
                                        <div className="pl-4 border-l-2 border-[#FF5D1E] space-y-1 text-left">
                                            <span className="text-xs text-zinc-400 font-medium">Primeros 3 segundos</span>
                                            <p className="italic text-zinc-100 font-medium text-sm md:text-base leading-relaxed">
                                                "¿{(localTitle || currentHook.title || "").replace(/^¿+|^\?+|^"/g, "").replace(/¿+|\?+$/g, "")}?"
                                            </p>
                                        </div>

                                        <div className="border-t border-white/[0.06] pt-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-medium text-white">Estrategia Psicologica</h4>
                                                {isRealAdmin && (
                                                    <span className="text-[10px] text-orange-400 font-medium bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                                                        Editable por Admin
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-2.5 text-xs md:text-sm">
                                                {[0, 1, 2].map((idx) => {
                                                    const parsed = parseStrategyItems(localStrategy || (currentHook as any).psychological_strategy || currentHook.psychologicalStrategy);
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

                                {/* Info Badges/Chips */}
                                <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-white/[0.04]">
                                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/5 bg-white/[0.01]">
                                        <Video className="w-4 h-4 text-zinc-400" />
                                        <span className="text-xs font-bold text-[#FF5D1E]">Canal: <span className="text-white font-normal ml-1">Reels de Instagram</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/5 bg-white/[0.01]">
                                        <Target className="w-4 h-4 text-[#FF5D1E]" />
                                        <span className="text-xs font-bold text-[#FF5D1E]">Destino: <span className="text-white font-normal ml-1">Mensaje Directo al DM</span></span>
                                    </div>
                                </div>

                                {/* Botones Grandes de Acción de Abajo */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-white/[0.08]">
                                    <button
                                        onClick={() => {
                                            const scriptText = currentKit?.script || localTitle || currentHook.title || "";
                                            navigator.clipboard.writeText(scriptText);
                                            alert("¡Guión copiado al portapapeles!");
                                        }}
                                        className="w-full py-3.5 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/15 text-white text-sm md:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
                                    >
                                        <Copy className="w-4 h-4 text-zinc-300" />
                                        <span>Copiar Guion</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const fullCopy = `HOOK: ${localTitle || currentHook.title || ""}\n\nGUIÓN:\n${currentKit?.script || ""}\n\nCOPY PUBLICITARIO:\n${currentKit?.ads || ""}`;
                                            navigator.clipboard.writeText(fullCopy);
                                            const element = document.createElement("a");
                                            const file = new Blob([fullCopy], { type: 'text/plain' });
                                            element.href = URL.createObjectURL(file);
                                            element.download = `video-hook-${(activeTab === 'library' ? activeLibraryHook : activeHook) + 1}.txt`;
                                            document.body.appendChild(element);
                                            element.click();
                                            document.body.removeChild(element);
                                        }}
                                        className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#FF5D1E] to-orange-600 hover:brightness-110 text-white text-sm md:text-base font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,93,30,0.3)] hover:scale-[1.01]"
                                    >
                                        <Download className="w-4.5 h-4.5" />
                                        <span>Descargar video</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeHookTabImage1 === "Guion del Hook" && (
                            <div className="p-6 md:p-8 bg-[#0c0c11]/90 border border-white/[0.06] rounded-[24px] text-left space-y-5">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">GUION DE VIDEO</h4>
                                <div className="bg-black/50 border border-white/10 rounded-xl p-5 md:p-6 text-zinc-200 text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                                    {currentKit?.script || "Aquí ingresa el guion del video persuasivo..."}
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={() => {
                                            const scriptText = currentKit?.script || localTitle || currentHook.title || "";
                                            navigator.clipboard.writeText(scriptText);
                                            alert("¡Guión copiado al portapapeles!");
                                        }}
                                        className="w-full py-3.5 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/15 text-white text-sm md:text-base font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
                                    >
                                        <Copy className="w-4 h-4 text-zinc-300" />
                                        <span>Copiar Guion</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeHookTabImage1 === "Publicacion y CTA" && (
                            <div className="p-6 md:p-8 bg-[#0c0c11]/90 border border-white/[0.06] rounded-[24px] text-left space-y-6">
                                {/* Card 1: Título del Reel */}
                                <div className="bg-black/50 border border-white/10 rounded-xl p-5 md:p-6 space-y-3 text-left">
                                    <div className="flex items-center justify-between text-[11px] font-black tracking-widest uppercase">
                                        <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-bold">TÍTULO</span>
                                        <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                                            TÍTULO DEL REEL
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                                        {currentKit?.reelTitle || localTitle || currentHook.title || "Sin título definido"}
                                    </h3>
                                </div>

                                {/* Card 2: Caption / Descripción Sugerida */}
                                <div className="bg-black/50 border border-white/10 rounded-xl p-5 md:p-6 space-y-4 text-left">
                                    <div className="flex items-center justify-between text-[11px] font-black tracking-widest uppercase">
                                        <span className="text-emerald-400 font-bold">CAPTION / DESCRIPCIÓN</span>
                                        <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                                            <Megaphone className="w-3.5 h-3.5 text-zinc-400" />
                                            DESCRIPCIÓN SUGERIDA
                                        </span>
                                    </div>
                                    <div className="text-zinc-200 text-sm md:text-base font-normal leading-relaxed whitespace-pre-wrap">
                                        {currentKit?.ads || (
                                            `¿Te gustaría generar ingresos extra los fines de semana sin tener que dejar tu empleo actual?\n\n💸 No se trata de un esfuerzo agotador, sino de dominar una habilidad de alta gama que te permite ganar en unas horas lo que a muchos les toma días de oficina.\n\n🎓 CLASE GRATIS DISPONIBLE:\nNuestra instructora experta te enseñará a dar tus primeros pasos en el microblading de cejas, una técnica "pelo a pelo" que te permitirá transformar la autoestima de tus clientas mientras transformas tu propia economía, incluso si empiezas desde cero.\n\n¿CÓMO REGISTRARTE A LA CLASE? 👇\n1️⃣ Haz clic donde dice: "▶️ GRATIS 👉 CLASE Microblading de Cejas" (está justo aquí abajo, arriba de mi nombre)`
                                        )}
                                    </div>
                                </div>

                                {/* Card 3: Comentario Fijado */}
                                <div className="bg-black/50 border border-white/10 rounded-xl p-5 md:p-6 space-y-3 text-left">
                                    <div className="flex items-center justify-between text-[11px] font-black tracking-widest uppercase">
                                        <span className="text-emerald-400 font-bold">COMENTARIO FIJADO</span>
                                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                            COMENTARIO DE VALOR
                                        </span>
                                    </div>
                                    <div className="text-zinc-200 text-sm md:text-base font-normal italic leading-relaxed whitespace-pre-wrap">
                                        {currentKit?.pinnedComment || "Sin comentario fijado"}
                                    </div>
                                </div>

                                {/* Botón Descargar Video */}
                                <div className="pt-2">
                                    <button
                                        onClick={() => {
                                            const fullCopy = `HOOK: ${localTitle || currentHook.title || ""}\n\nGUIÓN:\n${currentKit?.script || ""}\n\nCOPY PUBLICITARIO:\n${currentKit?.ads || ""}`;
                                            navigator.clipboard.writeText(fullCopy);
                                            const element = document.createElement("a");
                                            const file = new Blob([fullCopy], { type: 'text/plain' });
                                            element.href = URL.createObjectURL(file);
                                            element.download = `video-hook-${(activeTab === 'library' ? activeLibraryHook : activeHook) + 1}.txt`;
                                            document.body.appendChild(element);
                                            element.click();
                                            document.body.removeChild(element);
                                        }}
                                        className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#FF5D1E] to-orange-600 hover:brightness-110 text-white text-sm md:text-base font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,93,30,0.3)] hover:scale-[1.01]"
                                    >
                                        <Download className="w-4.5 h-4.5" />
                                        <span>Descargar video</span>
                                    </button>
                                </div>
                            </div>
                        )}
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