
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { Project, User, AffiliateLink, Plan } from '../../../types';
import { Briefcase, Plus, Loader2, Trash2, Target, Link as LinkIcon, Calendar, Edit2, Zap, Crown, AlertTriangle, PlayCircle, X, Sparkles, Lock, Unlock, Library, CheckCircle2, ArrowRight, PenTool, Layout, Rocket, MessageCircle, Wand2, Check, Gift, ShoppingCart as CartIcon, Info, Crown as CornerCrown, Settings, FileText, Star, Play, Users, Eye, ChevronRight, Clock, Activity, Folder, Globe, Award, Compass, GraduationCap, ShieldCheck, Package } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';
import { DeletionRestrictionModal } from '../DeletionRestrictionModal';
import confetti from 'canvas-confetti';

const getCategoryIcon = (category?: string) => {
    if (!category) return '🏷️';
    const lower = category.toLowerCase().trim();
    if (lower === 'all' || lower === 'todos') return '🌐';
    if (lower.includes('belleza') || lower.includes('estética') || lower.includes('estetica') || lower.includes('maquillaje') || lower.includes('cejas') || lower.includes('uña') || lower.includes('microblading')) return '💄';
    if (lower.includes('manualidad') || lower.includes('resina') || lower.includes('arte') || lower.includes('artesan')) return '🧶';
    if (lower.includes('mascota') || lower.includes('canin') || lower.includes('felin') || lower.includes('perro') || lower.includes('gato')) return '🐾';
    if (lower.includes('negocio') || lower.includes('finanza') || lower.includes('emprend') || lower.includes('marketing') || lower.includes('venta') || lower.includes('construcci') || lower.includes('interior')) return '💼';
    if (lower.includes('salud') || lower.includes('fitness') || lower.includes('deporte') || lower.includes('bienestar') || lower.includes('nutrici')) return '💪';
    if (lower.includes('cocina') || lower.includes('gastronom') || lower.includes('reposter') || lower.includes('pasteler')) return '🍳';
    if (lower.includes('tecnolog') || lower.includes('program') || lower.includes('digital') || lower.includes('software')) return '💻';
    if (lower.includes('educaci') || lower.includes('idioma') || lower.includes('curso') || lower.includes('academia')) return '📚';
    if (lower.includes('musica') || lower.includes('canto') || lower.includes('audio')) return '🎵';
    if (lower.includes('desarrollo personal') || lower.includes('espiritual') || lower.includes('mindfulness')) return '✨';
    return '🏷️';
};

interface DashboardContext {
  user: User;
  isSimulating: boolean;
  setShowProfileModal?: (show: boolean) => void;
  projectCount?: number;
}

export const ProjectsList: React.FC = () => {
    const navigate = useNavigate();
    const { user, isSimulating, setShowProfileModal, projectCount } = useOutletContext() as DashboardContext;
    const [projects, setProjects] = useState<Project[]>([]);
    const [masterLibrary, setMasterLibrary] = useState<Project[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlockingId, setUnlockingId] = useState<string | null>(null);
    
    // Modals State
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeProjectId, setUpgradeProjectId] = useState<string | undefined>(undefined);
    
    // --- Nuevo Estado para Protocolo de Desbloqueo ---
    const [showUnlockProtocol, setShowUnlockProtocol] = useState(false);
    const [selectedMasterProject, setSelectedMasterProject] = useState<Project | null>(null);
    const [unlockStep, setUnlockStep] = useState<'info' | 'confirm'>('info');

    // --- ESTADOS DE GENERACIÓN DINÁMICA ---
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [generatedProjectId, setGeneratedProjectId] = useState<string | null>(null);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [failedProjectId, setFailedProjectId] = useState<string | null>(null);
    const [showCreateOptionsModal, setShowCreateOptionsModal] = useState(false);
    // --------------------------------------

    // --- Nuevo Estado para Restricción de Eliminación ---
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [projectToRestrict, setProjectToRestrict] = useState<Project | null>(null);
    // ----------------------------------------------------

    // Generating state per project ID
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [myProjects, library, allPlans] = await Promise.all([
                api.getProjects(),
                api.getMasterLibrary().catch(() => []),
                api.getPublicPlans().catch(() => [])
            ]);
            setProjects(myProjects);
            setMasterLibrary(library);
            setPlans(allPlans);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [activeOnboardingCategory, setActiveOnboardingCategory] = useState('all');

    const onboardingCategories = useMemo(() => {
        const rawNiches = masterLibrary
            .map(p => (p.niche || '').trim())
            .filter(n => n.length > 0);

        const uniqueNiches: string[] = [];
        rawNiches.forEach(niche => {
            const exists = uniqueNiches.some(n => n.toLowerCase() === niche.toLowerCase());
            if (!exists) {
                uniqueNiches.push(niche);
            }
        });

        const sortedNiches = [...uniqueNiches].sort((a, b) => {
            const aIsBelleza = a.toLowerCase().includes('belleza');
            const bIsBelleza = b.toLowerCase().includes('belleza');
            if (aIsBelleza && !bIsBelleza) return -1;
            if (!aIsBelleza && bIsBelleza) return 1;
            return a.localeCompare(b, 'es', { sensitivity: 'base' });
        });

        const allCategory = {
            id: 'all',
            label: 'Todos',
            icon: getCategoryIcon('all')
        };

        if (sortedNiches.length === 0) {
            return [
                allCategory,
                { id: 'Belleza / Estética y Emprendimiento', label: 'Belleza / Estética y Emprendimiento', icon: '💄' },
                { id: 'Belleza y Estética Profesional', label: 'Belleza y Estética Profesional', icon: '💄' },
                { id: 'Emprendimiento, Construcción y Diseño de Interiores', label: 'Emprendimiento, Construcción y Diseño de Interiores', icon: '💼' },
            ];
        }

        return [
            allCategory,
            ...sortedNiches.map(niche => ({
                id: niche,
                label: niche,
                icon: getCategoryIcon(niche)
            }))
        ];
    }, [masterLibrary]);

    const filteredOnboardingProjects = useMemo(() => {
        let list = masterLibrary;
        if (activeOnboardingCategory !== 'all') {
            const catLower = activeOnboardingCategory.toLowerCase().trim();
            list = masterLibrary.filter(p => {
                const nicheLower = (p.niche || '').toLowerCase().trim();
                return nicheLower === catLower || nicheLower.includes(catLower) || catLower.includes(nicheLower);
            });
        }
        return [...list].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            if (user.role === 'admin') {
                return dateA - dateB;
            } else {
                if (a.isUnlocked && !b.isUnlocked) return -1;
                if (!a.isUnlocked && b.isUnlocked) return 1;
                return dateA - dateB;
            }
        });
    }, [masterLibrary, activeOnboardingCategory, user.role]);

    const getOnboardingCardImage = (project: Project) => {
        let mm: any = project.multimedia_json;
        if (typeof mm === 'string') {
            try { mm = JSON.parse(mm); } catch { mm = null; }
        }
        if (mm?.heroImages?.[0]) return mm.heroImages[0];
        if ((project as any).image) return (project as any).image;
        const lower = (project.name || '').toLowerCase();
        if (lower.includes('microblading') || lower.includes('cejas')) {
            return 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80';
        }
        if (lower.includes('manicurista') || lower.includes('uñas') || lower.includes('maquillaje')) {
            return 'https://images.unsplash.com/photo-1596951053942-862d31980696?auto=format&fit=crop&w=800&q=80';
        }
        if (lower.includes('resina') || lower.includes('pisos')) {
            return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
        }
        return null;
    };

    const getOnboardingCardTitle = (project: Project) => {
        const nameLower = (project.name || '').toLowerCase();
        if (nameLower.includes("microblading")) return "Certificación Expert Microblading";
        if (nameLower.includes("manicurista")) return "Curso de Maquillaje Profesional";
        if (nameLower.includes("pisos") || nameLower.includes("resina")) return "Master en Pisos de Resina Epóxica";
        return project.name || "Producto Digital";
    };

    const getOnboardingCardDesc = (project: Project) => {
        const nameLower = (project.name || '').toLowerCase();
        if (nameLower.includes("microblading") || nameLower.includes("cejas")) {
            return "Domina la técnica de cejas y crea un servicio rentable con alta demanda.";
        }
        if (nameLower.includes("manicurista") || nameLower.includes("maquillaje")) {
            return "Aprende maquillaje, color y técnica profesional para realzar la belleza en cualquier ocasión.";
        }
        if (nameLower.includes("pisos") || nameLower.includes("resina")) {
            return "Aprende acabados profesionales en pisos de resina y conviértelo en un servicio altamente rentable.";
        }
        return project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Aprende una habilidad de alta demanda y conviértela en un negocio rentable.");
    };

    const handleDelete = async (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Si el usuario no tiene el rol admin, se interceptará la acción
        if (user.role !== 'admin') {
            setProjectToRestrict(project);
            setShowRestrictionModal(true);
            return;
        }

        if (confirm(`¿Estás seguro de eliminar el proyecto "${project.name}" y toda su estrategia?`)) {
            await api.deleteProject(project.id);
            setProjects(projects.filter(p => p.id !== project.id));
            setMasterLibrary(masterLibrary.filter(p => p.id !== project.id));
        }
    };

    const handleToggleActive = async (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.toggleProjectActive(project.id, !project.isActive);
            setMasterLibrary(prev => prev.map(p => p.id === project.id ? { ...p, isActive: !p.isActive } : p));
        } catch (error) {
            console.error("Error toggling active status", error);
            alert("Error al cambiar el estado de activación");
        }
    };

    // --- Lógica de Interceptación del Desbloqueo ---
    const handleUnlock = (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedMasterProject(project);
        setUnlockStep('info');
        setShowUnlockProtocol(true);
    };

    const handleNextToConfirm = () => {
        setUnlockStep('confirm');
    };

    const handleFinalGeneration = async () => {
        if (!selectedMasterProject) return;
        
        const isRealAdmin = user.role === 'admin' && !isSimulating;
        const maxProjectsCalculated = user.planLimits?.maxProjects || 1;
        const totalActive = projects.length;

        if (totalActive >= maxProjectsCalculated && !isRealAdmin) {
            setShowUnlockProtocol(false);
            setShowUpgradeModal(true);
            return;
        }

        setShowUnlockProtocol(false);
        setGenerationStatus('generating');
        setProgress(0);
        setSecondsElapsed(0);

        const messages = [
            "Duplicando arquitectura maestra...",
            "Sincronizando avatares psicológicos...",
            "Personalizando ganchos de venta...",
            "Configurando motor de contenidos...",
            "Optimizando secuencias de email...",
            "Escaneando oportunidades de mercado...",
            "Diseñando embudo de conversión...",
            "Entrenando algoritmos de persuasión...",
            "Integrando disparadores psicológicos...",
            "Finalizando Estrategia Maestra única..."
        ];

        const timerInterval = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
        }, 1000);

        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            if (currentProgress < 99) {
                currentProgress += 1;
                setProgress(currentProgress);
                const msgIdx = Math.min(Math.floor((currentProgress / 100) * messages.length), messages.length - 1);
                setLoadingMessage(messages[msgIdx]);
            }
        }, 600); // Simulación de carga fluida (aprox 60s para 100%)

        try {
            // Enviamos valores por defecto ya que la configuración se hará en la pestaña de estrategia
            const res = await api.unlockProject(selectedMasterProject.id, {
                leadMagnetType: '',
                leadMagnetUrl: '',
                affiliateLinks: [],
                planSlug: 'starter'
            });
            
            clearInterval(progressInterval);
            clearInterval(timerInterval);
            setProgress(100);
            setGeneratedProjectId(res.id);
            setGenerationStatus('success');
            
            // Efecto Confeti Total (Cañón Izquierdo, Derecho y Central)
            const end = Date.now() + (2 * 1000);
            const colors = ['#FF5A1F', '#ffffff', '#3b82f6'];

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

            await loadData();
            setSelectedMasterProject(null);
        } catch (error: any) {
            clearInterval(progressInterval);
            clearInterval(timerInterval);
            
            // Si el error contiene un projectId, significa que el proyecto se creó pero la IA falló
            if (error.body?.projectId) {
                setFailedProjectId(error.body.projectId);
                setGenerationError(error.body.error || "La IA tuvo un problema al generar el contenido JSON. Puedes intentar regenerar sin costo adicional.");
                setGenerationStatus('error');
            } else {
                alert(error.message || "Error al desbloquear estrategia.");
                setGenerationStatus('idle');
            }
        } finally {
            // No limpiamos aquí para permitir reintentar si hubo un error
        }
    };

    const handleRegenerate = async () => {
        if (!failedProjectId || !selectedMasterProject) return;

        try {
            setGenerationStatus('generating');
            setProgress(0);
            setSecondsElapsed(0);
            setGenerationError(null);

            // 1. Borramos el proyecto fallido para no consumir créditos/espacio
            await api.deleteProject(failedProjectId);
            setFailedProjectId(null);

            // 2. Reiniciamos la generación
            await handleFinalGeneration();
        } catch (error: any) {
            setGenerationStatus('error');
            setGenerationError("Error al intentar regenerar. Por favor, intenta de nuevo.");
        }
    };

    const handleViewStrategy = async (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        navigate(`/dashboard/projects/${project.id}/strategy`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                <p>Cargando tus proyectos estratégicos...</p>
            </div>
        );
    }

    // Plan Logic
    const isRealAdmin = user.role === 'admin' && !isSimulating;
    const maxProjects = user.planLimits?.maxProjects || 1;
    const currentCount = projects.length;
    const usagePercent = Math.min(100, (currentCount / maxProjects) * 100);
    const isAtLimit = !isRealAdmin && currentCount >= maxProjects;

    // Color logic for bar
    let progressColor = "bg-blue-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent >= 100) progressColor = isRealAdmin ? "bg-blue-500" : "bg-red-500";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-20">
            


            {/* HERO HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950/20 to-black border border-gray-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-xs font-bold text-blue-300 uppercase tracking-wider mb-3 shadow-sm">
                                <Briefcase className="w-3 h-3 text-blue-400" /> Estrategia & Nichos
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                Gestiona tus Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">y Copia Nuestras Estrategias</span>
                            </h1>
                            <p className="text-white pt-[0.8em] pb-[0.6em] text-[1.2rem] max-w-xl leading-relaxed">
                                Los Proyectos son el centro de tu estrategia de Ventas. Define tu nicho, audiencia y enlaces de afiliado. Nuestro sistema usará Inteligencia Artificial para generar contenido que te genere grandes resultados.
                            </p>
                        </div>
                        
                        {/* Plan Usage Bar */}
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">{isRealAdmin ? 'Páginas (Superusuario)' : 'Proyectos Activos/Desbloqueados'}</span>
                                <span className="text-white font-bold">{currentCount} / {isRealAdmin ? '∞' : maxProjects}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (currentCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                            </div>
                            {isAtLimit && (
                                <div 
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="mt-3 flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30 cursor-pointer hover:bg-yellow-900/30 transition-all"
                                >
                                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span className="text-[1rem] leading-[1.5rem]">Has alcanzado el límite de tu plan. Actualiza para gestionar más nichos.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 shrink-0 w-full md:w-[400px]">
                        {/* Contenedor de Video Interactivo (Embebido directamente) */}
                        <div 
                            className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                        >
                            <iframe 
                                className="w-full h-full rounded-2xl"
                                src="https://www.youtube.com/embed/2yez3O8ibzA?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Botones centrados debajo del video */}
                        <div className="flex flex-col gap-3">
                            {isAtLimit ? (
                                <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02] border border-yellow-400/20 w-full"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <CornerCrown className="w-5 h-5 fill-current" /> 
                                        Límite Alcanzado: Actualiza a PRO
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowCreateOptionsModal(true)}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 hover:-translate-y-1 w-full"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Plus className="w-5 h-5" /> 
                                        Nuevo Proyecto
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN REMOVIDA: MIS PROYECTOS (A PETICIÓN DEL USUARIO) */}

            {/* SECCIÓN 2: BIBLIOTECA DE ESTRATEGIAS MAESTRAS (NUEVA) */}
            <div id="biblioteca-maestra" className="space-y-8 pt-12 border-t border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-4 border-l-4 border-yellow-500 pl-4 py-1 pb-5">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                            <Library className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Biblioteca Maestra</h2>
                            <p className="text-white font-medium pt-2.5 text-[1.2em]">Optimiza tu tiempo y gana dinero copiando nuestra estrategia maestra</p>
                        </div>
                    </div>
                </div>

                {masterLibrary.length === 0 ? (
                    <div className="p-12 bg-white/5 rounded-[2.5rem] border border-white/5 text-center">
                        <p className="text-gray-500 italic">No hay nuevas estrategias maestras disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(() => {
                            const sortedMasterLibrary = [...masterLibrary].sort((a, b) => {
                                const dateA = new Date(a.createdAt || 0).getTime();
                                const dateB = new Date(b.createdAt || 0).getTime();

                                if (user.role === 'admin') {
                                    return dateA - dateB;
                                } else {
                                    if (a.isUnlocked && !b.isUnlocked) return -1;
                                    if (!a.isUnlocked && b.isUnlocked) return 1;
                                    return dateA - dateB;
                                }
                            });

                            return sortedMasterLibrary.map((item) => {
                                const isAlreadyUnlocked = item.isUnlocked || user.role === 'admin';

                                return (
                                    <div 
                                        key={item.id}
                                    onClick={(e) => {
                                        if (isAlreadyUnlocked) {
                                            const userClone = projects.find(p => String(p.masterParentId) === String(item.id));
                                            const targetProject = userClone || item;
                                            handleViewStrategy(e, targetProject);
                                        } else {
                                            if (unlockingId !== item.id) {
                                                handleUnlock(item, e);
                                            }
                                        }
                                    }}
                                    className={`bg-[#0B0B0B] border rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col group shadow-2xl relative overflow-hidden cursor-pointer ${isAlreadyUnlocked ? 'border-emerald-500/50 hover:bg-emerald-500/10 bg-emerald-500/5' : 'border-yellow-500/10 hover:border-yellow-500/40 hover:bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.05)]'}`}
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                                        <CornerCrown className="w-32 h-32 text-yellow-500" />
                                    </div>
                                    
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isAlreadyUnlocked ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-900/10' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-yellow-900/10'}`}>
                                            <Sparkles className="w-8 h-8" />
                                        </div>
                                        {user.role === 'admin' ? (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={(e) => handleToggleActive(item, e)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all shadow-lg ${item.isActive ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' : 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'}`}
                                                    title={item.isActive ? "Desactivar" : "Activar"}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-gray-500'} animate-pulse`}></div>
                                                    <span className="text-xs font-bold">{item.isActive ? 'Activo' : 'Inactivo'}</span>
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/projects/edit/${item.id}`); }}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all shadow-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span className="text-xs font-bold">Editar</span>
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(item, e)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-red-900/20 hover:bg-emerald-600 rounded-xl text-red-500 hover:text-white transition-all shadow-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-xs font-bold">Borrar</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                <Target className="w-3 h-3" /> {item.niche}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-4 relative z-10">
                                        <h4 className={`text-2xl font-black tracking-tight leading-tight transition-colors ${isAlreadyUnlocked ? 'text-emerald-400' : 'text-white group-hover:text-yellow-400'}`}>
                                            {item.name}
                                        </h4>
                                        <p className="text-[1.2rem] text-white mb-8 min-h-[56px] leading-relaxed">
                                            {item.shortDescription || (item.description ? item.description.replace(/<[^>]*>?/gm, '') : "Estrategia validada para lanzamientos.")}
                                        </p>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                                        {isAlreadyUnlocked ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center gap-2 text-emerald-400 font-black uppercase text-xs tracking-widest">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {user.role === 'admin' ? 'Acceso Admin' : 'Desbloqueado'}
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const userClone = projects.find(p => String(p.masterParentId) === String(item.id));
                                                        const targetProject = userClone || item;
                                                        handleViewStrategy(e, targetProject);
                                                    }}
                                                    className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 pointer-events-none"
                                                >
                                                    Ver Estrategia
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnlock(item, e);
                                                    }}
                                                    disabled={unlockingId === item.id}
                                                    className="w-full py-5 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-yellow-900/20 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 pointer-events-none"
                                                >
                                                    {unlockingId === item.id ? (
                                                        <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                                                    ) : (
                                                        <><Unlock className="w-4 h-4" /> DESBLOQUEAR PROYECTO</>
                                                    )}
                                                </button>
                                                <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-4">
                                                    Consume 1 cupo de proyecto en tu plan
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })})()}
                    </div>
                )}
            </div>

            {/* --- SECCIÓN 3: SELECTOR DE PRODUCTOS DIGITALES (ESTILO ONBOARDING) --- */}
            <div id="seleccion-productos-onboarding" className="space-y-8 pt-16 border-t border-white/10">
                {/* Header matching Image 2 */}
                <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Selecciona tu <span className="text-[#FF5A1F]">Producto Digital</span>
                    </h2>
                    <p className="text-zinc-300 font-normal text-sm sm:text-base max-w-3xl mx-auto leading-relaxed pt-1">
                        Elige el Producto Digital que mejor se adapte a ti, nuestra inteligencia artificial creará un sistema de ventas completo para este producto digital
                    </p>

                    {/* Glowing Spark Divider */}
                    <div className="relative flex justify-center items-center my-4 max-w-xs mx-auto">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#FF5A1F] blur-[2px] shadow-[0_0_12px_#FF5A1F]"></div>
                    </div>

                    {/* Filter Pills Bar */}
                    <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap pt-2 pb-2">
                        {onboardingCategories.map((cat) => {
                            const isActive = activeOnboardingCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setActiveOnboardingCategory(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                        isActive
                                            ? 'bg-[#121215] border border-[#FF5A1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.25)] scale-105'
                                            : 'bg-[#121215]/80 border border-zinc-800/80 text-zinc-300 hover:text-white hover:border-zinc-700'
                                    }`}
                                >
                                    <span className="text-base">{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#FF5A1F]" />
                        <p className="text-zinc-400 text-sm mt-4 font-medium">Cargando productos de la base de datos...</p>
                    </div>
                ) : filteredOnboardingProjects.length === 0 ? (
                    <div className="p-12 text-center bg-[#121215]/60 border border-zinc-800 rounded-3xl max-w-xl mx-auto">
                        <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-300 font-bold">No hay productos en esta categoría</p>
                        <p className="text-zinc-500 text-xs mt-1">Prueba seleccionando otra categoría o la opción "Todos".</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredOnboardingProjects.map((project) => {
                            const isAlreadyUnlocked = project.isUnlocked || user.role === 'admin';
                            const projectImg = getOnboardingCardImage(project);
                            const title = getOnboardingCardTitle(project);
                            const desc = getOnboardingCardDesc(project);
                            const category = project.niche || "General";
                            const catIcon = getCategoryIcon(category);

                            return (
                                <div
                                    key={`onboarding-card-${project.id}`}
                                    onClick={(e) => {
                                        if (isAlreadyUnlocked) {
                                            const userClone = projects.find(p => String(p.masterParentId) === String(project.id));
                                            handleViewStrategy(e, userClone || project);
                                        } else {
                                            if (unlockingId !== project.id) {
                                                handleUnlock(project, e);
                                            }
                                        }
                                    }}
                                    className={`group rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative w-full cursor-pointer transition-all duration-300 space-y-4 ${
                                        isAlreadyUnlocked
                                            ? 'bg-gradient-to-b from-[#0c1a14]/90 to-[#07130e]/95 border-2 border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:border-emerald-400'
                                            : 'bg-gradient-to-b from-[#181409]/90 to-[#100e06]/95 border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.12)] hover:shadow-[0_0_40px_rgba(234,179,8,0.22)] hover:border-yellow-400'
                                    }`}
                                >
                                    {/* Image Container with Floating Badges */}
                                    <div className="h-44 md:h-48 bg-zinc-900 relative overflow-hidden rounded-2xl shrink-0 border border-zinc-800/60">
                                        {/* Floating Category Badge Top-Left */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className={`px-3 py-1 bg-black/80 backdrop-blur-md text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 border ${isAlreadyUnlocked ? 'border-emerald-500/40' : 'border-yellow-500/40'} shadow-md`}>
                                                <span>{catIcon}</span> Categoría: {category}
                                            </span>
                                        </div>

                                        {/* Floating Status Badge Top-Right */}
                                        <div className="absolute top-3 right-3 z-10">
                                            {isAlreadyUnlocked ? (
                                                <span className="px-3 py-1 bg-emerald-500/25 text-emerald-300 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 border border-emerald-500/60 backdrop-blur-md shadow-lg">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Desbloqueado
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-yellow-500/25 text-yellow-300 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 border border-yellow-500/50 backdrop-blur-md shadow-lg">
                                                    <Lock className="w-3.5 h-3.5 text-yellow-400" /> Bloqueado
                                                </span>
                                            )}
                                        </div>

                                        {/* Cover Image */}
                                        {projectImg ? (
                                            <img
                                                src={projectImg}
                                                alt={title}
                                                referrerPolicy="no-referrer"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                                <Package className="w-10 h-10 text-zinc-700" />
                                            </div>
                                        )}

                                        {/* Dark overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 flex flex-col justify-between space-y-2">
                                        <div>
                                            <h3 className={`text-xl font-bold line-clamp-2 transition-colors duration-200 ${
                                                isAlreadyUnlocked ? 'text-white group-hover:text-emerald-400' : 'text-white group-hover:text-yellow-400'
                                            }`}>
                                                {title}
                                            </h3>
                                            <p className="text-zinc-400 text-sm mt-2 line-clamp-3 leading-relaxed font-light">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2">
                                        {isAlreadyUnlocked ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const userClone = projects.find(p => String(p.masterParentId) === String(project.id));
                                                    handleViewStrategy(e, userClone || project);
                                                }}
                                                className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                                            >
                                                <span>VER PROYECTO</span>
                                                <ArrowRight className="w-4 h-4 shrink-0" />
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUnlock(project, e);
                                                    }}
                                                    disabled={unlockingId === project.id}
                                                    className="w-full py-3.5 px-5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-extrabold text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_20px_rgba(234,179,8,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    {unlockingId === project.id ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                                                            <span>PROCESANDO...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Unlock className="w-4 h-4 shrink-0" />
                                                            <span>DESBLOQUEAR PROYECTO</span>
                                                        </>
                                                    )}
                                                </button>
                                                <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest pt-2">
                                                    Consume 1 cupo de proyecto en tu plan
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom Features Bar matching Image 2 */}
                <div className="pt-8 border-t border-zinc-800/60 max-w-5xl mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center text-left">
                        {/* Feature 1 */}
                        <div className="flex items-center gap-3.5 px-2">
                            <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Productos probados</p>
                                <p className="text-zinc-400 text-xs font-light pt-1">Enfocados en resultados reales</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-center gap-3.5 px-2 md:border-l md:border-zinc-800/80">
                            <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Guía paso a paso</p>
                                <p className="text-zinc-400 text-xs font-light pt-1">Aprende con método y claridad</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-center gap-3.5 px-2 md:border-l md:border-zinc-800/80">
                            <div className="w-10 h-10 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center text-[#FF5A1F] shrink-0">
                                <Rocket className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Escala tu negocio</p>
                                <p className="text-zinc-400 text-xs font-light pt-1">Convierte tu aprendizaje en ingresos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PROTOCOLO DE DESBLOQUEO MAESTRO (MODAL INTERCEPTOR REDISEÑADO) --- */}
            {showUnlockProtocol && selectedMasterProject && (
                <div 
                    onClick={() => setShowUnlockProtocol(false)}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 !mt-0"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] w-full ${unlockStep === 'info' ? 'max-w-[45rem]' : 'max-w-[34rem]'} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative max-h-[90vh]`}
                    >
                        {/* Línea de acento dorada superior */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                        
                        {unlockStep === 'info' && (
                            <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-[2rem] flex items-center justify-center mx-auto border border-yellow-500/20 shadow-lg shadow-yellow-900/10 animate-pulse">
                                        <CornerCrown className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl md:text-4xl font-black text-white leading-none">COPIA NUESTRA ESTRATEGIA Y MEJORA TUS RESULTADOS</h3>
                                        <p className="text-yellow-500 pt-3 text-[1.2em] leading-[1.6em]">Sabemos lo frustrante y dificil que es crear tu propio negocio por Internet</p>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-white text-[1.2rem] leading-[1.6em] font-normal max-w-2xl mx-auto">
                                            ¿Pero que pensarias si te dijese que nuestro equipo de profesionales ha diseñado para ti la mejor estrategia para empieces a recomendar en minutos el producto digital "{selectedMasterProject.name}"?
                                        </p>
                                        <p className="text-white text-[1.2rem] leading-[1.6em] font-normal max-w-2xl mx-auto">
                                            Nuestra estratrategia incluye avatares, guiones de venta, copys para email y estructura web de alta conversión.
                                        </p>
                                    </div>
                                </div>

                                <div className="aspect-video max-w-lg mx-auto w-full bg-black rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group cursor-pointer">
                                    <iframe 
                                        className="w-full h-full rounded-2xl"
                                        src="https://www.youtube.com/embed/2yez3O8ibzA?rel=0&controls=1&showinfo=0" 
                                        title="Video Preview" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>

                                <div className="flex flex-col gap-4 py-2">
                                    {[
                                        { 
                                            label: 'Copywriting', 
                                            icon: PenTool, 
                                            color: 'text-orange-400',
                                            desc: 'Escritura persuasiva de alto nivel diseñada para tocar las fibras emocionales de tu cliente y forzar la decisión de compra sin sonar como un vendedor pesado.'
                                        },
                                        { 
                                            label: 'Diseño Web', 
                                            icon: Layout, 
                                            color: 'text-blue-400',
                                            desc: 'Estructuras de alta conversión probadas y optimizadas para móviles, asegurando que cada visita tenga la mayor probabilidad de convertirse en un registro.'
                                        },
                                        { 
                                            label: 'Estrategia IA', 
                                            icon: Sparkles, 
                                            color: 'text-purple-400',
                                            desc: 'Inteligencia artificial avanzada que analiza tu nicho específico para crear ganchos y ángulos de venta únicos que tu competencia ni siquiera imagina.'
                                        },
                                        { 
                                            label: 'Automatización', 
                                            icon: Rocket, 
                                            color: 'text-emerald-400',
                                            desc: 'Sincronización total de tu embudo para que los prospectos fluyan desde tu página hasta tu WhatsApp sin que tengas que mover un solo dedo.'
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 hover:bg-white/10 transition-all group">
                                            <div className={`p-4 rounded-2xl bg-black/40 ${item.color} shadow-lg shrink-0`}>
                                                <item.icon className="w-8 h-8" />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h5 className="text-white font-black text-xl mb-2 uppercase tracking-tight">{item.label}</h5>
                                                <p className="text-white text-[1.2rem] leading-[1.6em] font-normal opacity-80">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="p-6 md:p-8 bg-black/60 border-t border-white/5 flex flex-col sm:flex-row gap-4 shrink-0">
                                    <button onClick={() => setShowUnlockProtocol(false)} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all border border-white/5">Cancelar</button>
                                    <button onClick={handleNextToConfirm} className="flex-1 py-4 rounded-xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#FF5A1F]/20 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"><Unlock className="w-5 h-5" /> DESBLOQUEAR</button>
                                </div>
                            </div>
                        )}

                        {unlockStep === 'confirm' && (
                            <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto animate-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col items-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                                        <Zap className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirmar Consumo de Créditos</h3>
                                        <p className="text-white text-lg leading-relaxed font-medium max-w-xl">Al crear una nueva estrategia de consumirás 1 cupo de proyecto disponble de tu plan actual.</p>
                                    </div>
                                </div>

                                <div className="bg-black border border-white/5 p-8 rounded-[2.5rem] shadow-inner relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Cupos Disponibles para Proyectos</span>
                                        <span className="text-white font-mono font-bold text-sm">{currentCount} / {isRealAdmin ? '∞' : maxProjects}</span>
                                    </div>
                                    <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                        <div 
                                            className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] ${progressColor}`} 
                                            style={{ width: `${isRealAdmin ? (currentCount > 0 ? 100 : 0) : usagePercent}%` }}
                                        ></div>
                                    </div>
                                    {isAtLimit && (
                                        <div className="mt-6 flex items-center gap-4 p-4 bg-red-950/20 border border-red-900/30 rounded-2xl">
                                            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                                            <p className="text-red-400 text-sm font-bold leading-snug uppercase tracking-tight">Límite alcanzado. Debes subir de plan para continuar.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 md:p-8 bg-black/60 border-t border-white/5 flex flex-col sm:flex-row gap-4 shrink-0">
                                    <button onClick={() => setUnlockStep('info')} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-black text-xs uppercase tracking-widest border border-white/5">Volver</button>
                                    {isAtLimit ? (
                                        <button onClick={() => { setShowUnlockProtocol(false); setShowUpgradeModal(true); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black text-xs uppercase shadow-xl transform hover:scale-[1.02] transition-all">Actualizar Plan Pro <ArrowRight className="w-5 h-5" /></button>
                                    ) : (
                                        <button onClick={handleFinalGeneration} className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 transform hover:scale-[1.02] active:scale-95 transition-all">Aceptar y Continuar</button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- OVERLAY DE GENERACIÓN (IDÉNTICO A GENERATOR) --- */}
            {generationStatus === 'generating' && (
                <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 !mt-0">
                    <div className="bg-[#0B0B0B] border border-white/5 rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in fade-in duration-500 flex flex-col items-center space-y-10">
                        {/* Icono de la varita con efecto de brillo */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
                            <div className="relative w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
                                <Wand2 className="w-12 h-12 text-emerald-400 animate-pulse" />
                            </div>
                        </div>

                        {/* Texto de generación en negrita y profesional */}
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
                                Estamos creando la Estrategia perfecta para vender tu Producto Digital.
                            </h3>
                        </div>

                        {/* Badge de advertencia */}
                        <div className="px-6 py-2 bg-red-600/20 border border-red-600/30 rounded-full shadow-lg">
                            <p className="text-red-500 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> No cierres esta página
                            </p>
                        </div>

                        {/* Sección de contador con degradado oscuro */}
                        <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-center space-y-4">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tu estrategia estará lista en:</p>
                            <div className="text-white font-mono text-6xl font-black tracking-tighter">
                                {Math.floor(Math.max(0, 90 - secondsElapsed) / 60).toString().padStart(2, '0')}:{(Math.max(0, 90 - secondsElapsed) % 60).toString().padStart(2, '0')}
                            </div>
                        </div>

                        {/* Barra de progreso verde gruesa y animada */}
                        <div className="w-full max-w-xl space-y-4">
                            <div className="flex justify-between text-[11px] font-black text-gray-500 uppercase tracking-widest px-1">
                                <span>{loadingMessage}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-8 bg-gray-900 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                                <div 
                                    className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)] relative"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-loading-shine"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PANTALLA DE ÉXITO (MODAL REDISEÑADO) --- */}
            {generationStatus === 'success' && generatedProjectId && (
                <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500 !mt-0">
                    <div className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                        
                        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        
                        <div className="space-y-6">
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 drop-shadow-sm">
                                Hemos creado tu Negocio Digital en menos de 1 minuto
                            </h3>
                            <div className="space-y-4 text-gray-300 text-xl leading-relaxed font-light">
                                <p>¡Felicidades!. Tu Negocio Digital esta listo y completo para usarse. Haz clic a continuación para usar todas las herramientas que te permitirán escalar tu negocio en menos tiempo.</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setGenerationStatus('idle');
                                navigate(`/dashboard/projects/${generatedProjectId}/strategy`);
                            }}
                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-900/20 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            Ver Estrategia Creada <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* --- PANTALLA DE ERROR (MODAL PROFESIONAL) --- */}
            {generationStatus === 'error' && (
                <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500 !mt-0">
                    <div className="bg-[#0B0B0B] border border-red-500/20 rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-red-400 to-red-600"></div>
                        
                        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-900/10">
                            <AlertTriangle className="w-12 h-12" />
                        </div>
                        
                        <div className="space-y-6">
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight text-white">
                                Algo no salió como esperábamos
                            </h3>
                            <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                                <p>{generationError || "Hubo un error técnico al procesar la respuesta de la IA. No te preocupes, no se han consumido créditos adicionales."}</p>
                                <p className="text-sm font-bold text-red-400/80 uppercase tracking-widest">Puedes intentar regenerar la estrategia ahora mismo.</p>
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-4">
                            <button 
                                onClick={handleRegenerate}
                                className="w-full py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <Zap className="w-5 h-5 fill-current" /> Regenerar Estrategia
                            </button>
                            
                            <button 
                                onClick={() => {
                                    setGenerationStatus('idle');
                                    setGenerationError(null);
                                    setFailedProjectId(null);
                                    setSelectedMasterProject(null);
                                    loadData(); // Recargamos por si acaso
                                }}
                                className="w-full py-4 text-gray-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                Cancelar y volver
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ESCRITURA IA */}
            {showUpgradeModal && (
                <UpgradeModal 
                    isOpen={showUpgradeModal} 
                    onClose={() => { setShowUpgradeModal(false); setUpgradeProjectId(undefined); }} 
                    user={user}
                    userId={user.id}
                    currentPlan={upgradeProjectId ? (projects.find(p => p.id === upgradeProjectId)?.planSlug || 'starter') : (projects.reduce((best: string, p) => {
                        const order = ['starter', 'plan-2', 'plan-3', 'plan-4', 'plan-5', 'plan-6', 'plan-7', 'plan-8', 'plan-9', 'plan-10'];
                        const pSlug = p.planSlug || 'starter';
                        return order.indexOf(pSlug) > order.indexOf(best) ? pSlug : best;
                    }, 'starter'))}
                    projectId={upgradeProjectId}
                    reason="Has alcanzado el límite de proyectos de tu plan. Actualiza para crear más estrategias."
                />
            )}

            {/* MODAL RESTRICCIÓN DE ELIMINACIÓN */}
            <DeletionRestrictionModal 
                isOpen={showRestrictionModal} 
                onClose={() => setShowRestrictionModal(false)}
                itemName={projectToRestrict ? `Proyecto: ${projectToRestrict.name}` : ''}
                userEmail={user.email}
                userName={user.name}
            />

            {/* MODAL SELECTOR DE INICIO (EFECTO WOW) */}
            {showCreateOptionsModal && (
                <div 
                    onClick={() => setShowCreateOptionsModal(false)}
                    className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300 !mt-0"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0B0B0B] border border-white/10 rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative"
                    >
                        <button 
                            onClick={() => setShowCreateOptionsModal(false)}
                            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-10 md:p-16 space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                    ¿Cómo quieres <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">empezar hoy?</span>
                                </h2>
                                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                                    Elige el camino que mejor se adapte a tu nivel de experiencia y velocidad deseada.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* OPCIÓN 1: BIBLIOTECA MAESTRA */}
                                <div 
                                    onClick={() => {
                                        setShowCreateOptionsModal(false);
                                        setTimeout(() => {
                                            document.getElementById('biblioteca-maestra')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                    className="group relative bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-[2.5rem] p-8 cursor-pointer hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-yellow-500/10"
                                >
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                        Recomendado
                                    </div>
                                    
                                    <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-yellow-400 transition-colors">Copiar Nuestra Estrategia Maestra</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Ahorra semanas de trabajo usando una de nuestras estructuras validadas de alta conversión. Ideal para lanzamientos rápidos.
                                    </p>
                                    
                                    <div className="mt-8 flex items-center gap-2 text-yellow-500 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Explorar Biblioteca <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* OPCIÓN 2: DESDE CERO */}
                                <div 
                                    onClick={() => {
                                        setShowCreateOptionsModal(false);
                                        navigate('/dashboard/projects/create');
                                    }}
                                    className="group relative bg-gradient-to-br from-gray-900 to-black border border-white/5 rounded-[2.5rem] p-8 cursor-pointer hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-blue-500/5"
                                >
                                    <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <PenTool className="w-8 h-8" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors">Crear Proyecto desde Cero</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        Define tu propio nicho, audiencia y estrategia personalizada desde una hoja en blanco. Control total sobre cada detalle.
                                    </p>
                                    
                                    <div className="mt-8 flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Empezar ahora <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
