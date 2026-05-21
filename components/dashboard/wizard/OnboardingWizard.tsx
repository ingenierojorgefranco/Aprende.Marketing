import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { User, Project, ColorPalette } from '../../../types';
import { api } from '../../../services/api';
import { Zap, Target, CheckCircle, LogOut, ChevronRight, Video, MessageSquare, Mail, Lock, Database, Rocket } from 'lucide-react';
import { generateLandingPageContent } from '../../../services/geminiService';
import { UpgradeModal } from '../UpgradeModal';
import { 
    WelcomeStep, 
    ProjectSelectionStep, 
    UnlockProtocolStep,
    GenerationStep, 
    AvatarRevealStep,
    StrategyReadyStep,
    LandingIntroStep,
    LandingSuccessStep,
    HooksRevealStep,
    SuccessStep 
} from './WizardSteps';

const UserProfileModal = React.lazy(() => import('../UserProfileModal'));

interface OnboardingWizardProps {
    user: User;
    onComplete: () => void;
    onLogout?: () => void;
    onGenerationStateChange?: (isGenerating: boolean) => void;
    onUpdateUser?: (updatedUser: User) => void;
}

type WizardStep = 'welcome' | 'selection' | 'generating_strategy' | 'strategy_ready' | 'show_avatars' | 'show_landing_prep' | 'creating_web' | 'landing_success' | 'show_hooks' | 'generating_hooks' | 'success' | 'limit_reached';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete, onLogout, onGenerationStateChange, onUpdateUser }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<WizardStep>(() => {
        if (typeof window !== 'undefined') {
            const forced = localStorage.getItem('force_wizard_step');
            if (forced === 'success') {
                return 'success';
            }
        }
        return 'welcome';
    });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [userActiveProjects, setUserActiveProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generationStatus, setGenerationStatus] = useState('Iniciando...');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [unlockedProject, setUnlockedProject] = useState<any>(null);
    const [strategyData, setStrategyData] = useState<any>(null);
    const [isLandingCreated, setIsLandingCreated] = useState(false);
    const [createdPageSubdomain, setCreatedPageSubdomain] = useState<string>('');
    const [isHooksUnlocked, setIsHooksUnlocked] = useState(false);
    const [unlockedHooks, setUnlockedHooks] = useState<any[]>([]);
    
    // Modals de confirmación
    const [showActivateConfirm, setShowActivateConfirm] = useState(false);
    const [showCreateLandingConfirm, setShowCreateLandingConfirm] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [revealedSections, setRevealedSections] = useState<WizardStep[]>(['welcome']);
    
    const welcomeRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<HTMLDivElement>(null);
    const unlockRef = useRef<HTMLDivElement>(null);
    const strategyRef = useRef<HTMLDivElement>(null);
    const avatarsRef = useRef<HTMLDivElement>(null);
    const landingPrepRef = useRef<HTMLDivElement>(null);
    const creationRef = useRef<HTMLDivElement>(null);
    const landingSuccessRef = useRef<HTMLDivElement>(null);
    const hooksRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    const isGenerating = step === 'generating_strategy' || step === 'creating_web' || step === 'generating_hooks';

    // Notify parent about generation state
    useEffect(() => {
        if (onGenerationStateChange) {
            onGenerationStateChange(isGenerating);
        }
    }, [isGenerating, onGenerationStateChange]);

    // Timer para generación
    useEffect(() => {
        let interval: any;
        if (step === 'generating_strategy' || step === 'creating_web' || step === 'generating_hooks') {
            interval = setInterval(() => {
                setSecondsElapsed(prev => prev + 1);
            }, 1000);
        } else {
            setSecondsElapsed(0);
        }
        return () => clearInterval(interval);
    }, [step]);

    // Gestión de secciones reveladas
    useEffect(() => {
        if (!revealedSections.includes(step)) {
            setRevealedSections(prev => [...prev, step]);
        }
    }, [step]);

    // Cargar proyectos recomendados al inicio o cuando sea necesario
    useEffect(() => {
        loadMasterProjects();
    }, []);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
        setTimeout(() => {
            if (ref.current) {
                ref.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }, 400);
    };

    useEffect(() => {
        if (selectedProject) {
            scrollTo(unlockRef);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (step === 'generating_strategy') scrollTo(strategyRef);
        if (step === 'strategy_ready') scrollTo(avatarsRef); // Shared ref or new one? Let's use avatarRef for ready too
        if (step === 'show_avatars') scrollTo(avatarsRef);
        if (step === 'show_landing_prep') scrollTo(landingPrepRef);
        if (step === 'creating_web') scrollTo(creationRef);
        if (step === 'landing_success') scrollTo(landingSuccessRef);
        if (step === 'show_hooks') scrollTo(hooksRef);
        if (step === 'success') scrollTo(successRef);
    }, [step]);

    const loadMasterProjects = async () => {
        if (projects.length > 0) return;
        setLoadingProjects(true);
        try {
            const masterLibrary = await api.getMasterLibrary();
            setProjects(masterLibrary.slice(0, 6)); 
        } catch (error) {
            console.error("Error cargando libreria maestra:", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleProjectSelection = (project: Project) => {
        setSelectedProject(project);
        if (step !== 'selection') setStep('selection');
    };

    const handleUnlockConfirm = async () => {
        setShowActivateConfirm(false);
        setStep('generating_strategy');
        await processStrategyUnlock();
    };

    const processStrategyUnlock = async () => {
        if (!selectedProject) return;
        
        try {
            setGenerationProgress(10);
            setGenerationStatus('Estoy creando tu estrategia de Ventas');
            
            // 1. Desbloquear proyecto
            const unlocked = await api.unlockProject(selectedProject.id, { 
                registered_via: 'wizard', 
                initial_setup: true 
            });
            const fullUnlockedProject = await api.getProjectById(unlocked.id);
            setUnlockedProject(fullUnlockedProject || { ...unlocked, masterParentId: selectedProject.id });
            
            setGenerationProgress(40);
            setGenerationStatus('Extrayendo arquitectura psicológica...');

            // 2. Obtener estrategia real
            const strategy = await api.getProjectStrategy(unlocked.id);
            setStrategyData(strategy);
            
            setGenerationProgress(100);
            setGenerationStatus('¡Estrategia Lista!');

            setTimeout(() => {
                setStep('strategy_ready');
            }, 800);

        } catch (error: any) {
            console.error("Error en desbloqueo:", error);
            const errorMsg = error?.message || error?.toString() || '';
            const isLimitError = errorMsg.includes('403') || 
                                 errorMsg.includes('límite') || 
                                 errorMsg.includes('limite') || 
                                 errorMsg.includes('proyectos') ||
                                 errorMsg.includes('cupo');
            
            if (isLimitError) {
                try {
                    const myProjects = await api.getProjects();
                    setUserActiveProjects(myProjects);
                } catch (loadErr) {
                    console.error("Error cargando proyectos del usuario:", loadErr);
                }
                setStep('limit_reached');
            } else {
                setGenerationStatus('Error. Reintentando...');
                setTimeout(() => setStep('selection'), 2000);
            }
        }
    };

    const handleCreateWeb = async () => {
        setShowCreateLandingConfirm(false);
        setStep('creating_web');
        setGenerationProgress(0);
        setGenerationStatus('Estoy creando tu Página Web Profesional');
        
        try {
            setGenerationProgress(20);
            setGenerationStatus('Configurando servidor de captación...');
            
            // Obtener datos reales de la estrategia para la landing (Contexto Psicológico Profundo)
            const niche = selectedProject?.niche || 'Marketing Digital';
            
            let targetAudience = strategyData?.avatars?.[0]?.name || 'Emprendedores';
            if (strategyData) {
                const s = strategyData;
                const avatarContext = s.avatars && Array.isArray(s.avatars) && s.avatars.length > 0 
                    ? s.avatars.map((a: any) => `${a.archetype}: ${a.pain}. Deseo: ${a.desire}`).join(" | ")
                    : (s.avatar?.story || "");

                const painsContext = s.psychology?.pains && Array.isArray(s.psychology.pains)
                    ? `Dolores principales: ${s.psychology.pains.map((p: any) => typeof p === 'object' ? (p.text || p.title || p.description || "") : String(p)).join(", ")}`
                    : "";

                const solutionsContext = s.psychology?.solutions && Array.isArray(s.psychology.solutions)
                    ? `Soluciones clave: ${s.psychology.solutions.map((sol: any) => typeof sol === 'object' ? (sol.title || sol.text || "") : String(sol)).join(", ")}`
                    : "";

                targetAudience = [avatarContext, painsContext, solutionsContext].filter(Boolean).join(". ");
            }

            setGenerationProgress(50);
            setGenerationStatus('Estoy creando tu Página Web Profesional');

            // Seleccionar paleta aleatoria profesional
            const palettes: ColorPalette[] = [
                'modern-blue', 'elegant-purple', 'energetic-orange', 'nature-green', 
                'dark-luxury', 'ocean-teal', 'crimson-red', 'corporate-slate', 
                'gold-prestige', 'minimal-mono'
            ];
            const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];

            // Generar contenido con todo el contexto estratégico y multimedia del proyecto maestro
            const projectWithStrategy = {
                ...(unlockedProject || {}),
                productName: selectedProject?.productName || selectedProject?.name,
                brandTone: selectedProject?.brandTone,
                description: selectedProject?.description,
                painPoints: selectedProject?.painPoints,
                keyBenefits: selectedProject?.keyBenefits,
                strategy_json: strategyData,
                multimedia_json: unlockedProject?.multimedia_json?.heroImages?.length > 0 
                    ? unlockedProject.multimedia_json 
                    : (selectedProject?.multimedia_json || { heroImages: [], videoUrls: [], descriptiveImages: [] })
            };

            const content = await generateLandingPageContent(
                selectedProject?.productName || selectedProject?.name || 'Producto Digital',
                'Registro a Webinar / Clase', // Forzamos objetivo de webinar
                targetAudience,
                'Registro', // Para que coincida con la otra sección exactamente
                randomPalette,
                'webinar-funnel', // Forzamos estructura de webinar
                { 
                    type: 'form', 
                    url: '',
                    whatsappPhone: '', 
                    whatsappMessage: '' 
                },
                projectWithStrategy
            );
            
            setGenerationProgress(80);
            setGenerationStatus('Publicando en nube segura...');

            const slugify = (text: string) => text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
            const cleanProjectName = slugify(selectedProject?.productName || selectedProject?.name || 'producto');
            const randomCode = Math.floor(Math.random() * 1000);
            const generatedSubdomain = `${cleanProjectName}-${randomCode}.generatorlanding.com`;

            // Crear la página - Sincronizado exactamente con las especificaciones de generación estándar
            const newPage = {
                name: `Web Oficial - ${selectedProject?.productName || selectedProject?.name}`,
                niche: selectedProject?.productName || selectedProject?.name || niche,
                goal: 'Registro a Webinar / Clase',
                subdomain: generatedSubdomain,
                content: content,
                projectId: unlockedProject.id,
                isPublished: true
            };

            const savedPage = await api.createPage(newPage as any, projectWithStrategy as any);
            if (savedPage && savedPage.subdomain) {
                setCreatedPageSubdomain(savedPage.subdomain);
            } else {
                setCreatedPageSubdomain(newPage.subdomain);
            }

            setGenerationProgress(100);
            setGenerationStatus('Página Publicada');
            setIsLandingCreated(true);
            
            setTimeout(() => {
                setStep('landing_success');
            }, 800);

        } catch (error) {
            console.error("Error en creación de web:", error);
            setStep('show_hooks'); // Fallback a hooks para no romper el flujo
        }
    };

    const handleUnlockHooks = async () => {
        setStep('generating_hooks');
        setGenerationProgress(0);
        setGenerationStatus('Obteniendo biblioteca de ganchos...');
        
        console.log("🚀 Iniciando proceso de desbloqueo de hooks para el proyecto:", unlockedProject?.id);

        try {
            setGenerationProgress(20);
            
            // 1. Obtener ganchos de la estrategia o de la librería maestra
            let allHooks = strategyData?.modules?.hooks || [];
            
            if (allHooks.length === 0 && selectedProject) {
                console.log("📦 Estrategia sin hooks, consultando librería maestra para proyecto:", selectedProject.id);
                const library = await api.getHooksLibrary(1, 50, selectedProject.id);
                allHooks = library.hooks || [];
            }

            // Filtrar para asegurar que solo escogemos ganchos activos (donde isActive !== false e is_active !== 0)
            allHooks = allHooks.filter((h: any) => h.isActive !== false && h.is_active !== 0 && h.is_active !== false);

            console.log(`📊 Ganchos activos encontrados: ${allHooks.length}`);
            
            if (allHooks.length > 0) {
                setGenerationStatus('Seleccionando ganchos estratégicos...');
                setGenerationProgress(40);

                // Mezclar y seleccionar 3 aleatorios
                const shuffled = [...allHooks].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);
                const masterHookIds = selected.map((h: any) => h.id || h.masterHookId);

                console.log("🎯 Ganchos seleccionados para desbloquear:", masterHookIds);

                setGenerationStatus('Desbloqueando ganchos para tu proyecto...');
                setGenerationProgress(60);

                // 2. Desbloquear en lote en el backend (Pasamos true para que ya se creen marcados como generados)
                if (unlockedProject?.id && masterHookIds.length > 0) {
                    const response = await api.unlockMultipleHooks(unlockedProject.id, masterHookIds, true);
                    console.log("✅ Resultado del desbloqueo masivo:", response);

                    if (response && response.results) {
                        // Mapear los resultados unlocked a la estructura que espera HooksRevealStep
                        // El state unlockedHooks debe contener los IDs reales devueltos por el servidor
                        const finalizedHooks = response.results.map((h: any, idx: number) => ({
                            ...selected[idx], // Mantenemos la data visual (título, copy, etc)
                            id: h.id,          // Usamos el ID real generado en DB (ahora retornado por el backend como id)
                            isGenerated: true
                        }));
                        
                        setUnlockedHooks(finalizedHooks);
                    } else {
                        setUnlockedHooks(selected);
                    }
                }
                
                setGenerationProgress(90);
                setGenerationStatus('Configurando activos de video...');
            } else {
                console.warn("⚠️ No se encontraron hooks para desbloquear.");
            }
            
            // Simular un pequeño tiempo de carga para que el usuario perciba "trabajo" (UX)
            setTimeout(() => {
                setGenerationProgress(100);
                setGenerationStatus('¡Ganchos Listos!');
                setIsHooksUnlocked(true);
                setTimeout(() => {
                    setStep('show_hooks');
                }, 800);
            }, 1000);

        } catch (error) {
            console.error("❌ Error en proceso de ganchos:", error);
            setIsHooksUnlocked(true); // Fallback
            setStep('show_hooks');
        }
    };

    const activeProjectName = selectedProject?.name || unlockedProject?.name || 'Tu Proyecto MKT';
    const activeProjectImage = selectedProject?.multimedia_json?.heroImages?.[0] || unlockedProject?.multimedia_json?.heroImages?.[0];
    const activeProjectNiche = selectedProject?.niche || unlockedProject?.niche || 'Digital';

    const getPageUrl = () => {
        const subdomainPart = createdPageSubdomain ? createdPageSubdomain.split('.')[0] : '';
        if (subdomainPart) {
            const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('ais-dev'));
            return isLocal ? `/admin/lp/${subdomainPart}` : `https://aprende.marketing/admin/lp/${subdomainPart}`;
        } else if (unlockedProject) {
            return `/dashboard/projects/${unlockedProject.id}/strategy?section=web`;
        }
        return '#';
    };

    return (
        <div className="fixed inset-0 bg-[#020202] overflow-y-auto overflow-x-hidden snap-y snap-mandatory z-[45] scroll-smooth selection:bg-[#FF5A1F] selection:text-white">
            {/* Header del Wizard */}
            <header className={`fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 md:px-12 z-50 transition-all duration-300 ${
                step === 'success' 
                    ? 'bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/5 shadow-2xl' 
                    : 'bg-transparent'
            }`}>
                {/* Logo a la izquierda */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-[#FF5A1F]/20 px-1">A.MKT</div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></h2>
                </div>

                {/* Perfil y Salir a la derecha (sin fondo, flotando) */}
                <div className="flex items-center gap-2 sm:gap-4 z-10 font-sans">
                    <button 
                        onClick={() => setShowProfileModal(true)} 
                        className="flex items-center gap-2 sm:gap-3 pl-2 pr-3 sm:pr-4 py-1.5 rounded-full bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10 transition shadow-sm"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center font-bold overflow-hidden shadow-lg shadow-[#FF5A1F]/20 flex-shrink-0">
                            {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-[#B0B0B0] hidden sm:block truncate max-w-[124px] hover:text-white transition-colors">{user.name}</span>
                    </button>

                    {onLogout && (
                        <button 
                            onClick={onLogout} 
                            className="flex items-center gap-2 sm:gap-3 pl-2 pr-3 sm:pr-4 py-1.5 rounded-full bg-transparent border border-transparent text-[#B0B0B0] hover:text-red-400 hover:bg-red-900/10 hover:border-red-500/10 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] hover:bg-[#FF5A1F]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider hidden lg:inline">Salir</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Top Alert Bar - Solución Premium de WhatsApp */}
            {step === 'success' && (
                <div className="fixed top-20 left-0 right-0 h-12 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] flex items-center justify-between px-4 md:px-12 z-40 border-b border-white/10 shadow-lg font-sans">
                    <div className="flex-1 text-center flex items-center justify-center gap-2">
                        <span className="text-sm md:text-base">🔥</span>
                        <p className="text-white text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wide">
                            ¡No te quedes a medias! Únete al Desafío de 7 Días en WhatsApp y lanza tu primera campaña con el creador.
                        </p>
                    </div>
                    <a 
                        href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 bg-white text-[#FF5A1F] hover:bg-white/95 font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-md transition transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 leading-none font-sans"
                    >
                        Entrar al Grupo
                        <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            )}

            {/* Background Decorations - Fixed to viewport to cover everything consistently */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] -left-[10%] w-[70%] h-[70%] bg-[#FF5A1F]/10 blur-[130px] rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-[-10%] -right-[10%] w-[60%] h-[60%] bg-[#FF5A1F]/5 blur-[100px] rounded-full opacity-50"></div>
            </div>

            <div className="w-full relative z-10">
                {step === 'limit_reached' ? (
                    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-center pt-28 pb-16 relative z-10 font-sans">
                        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-400 uppercase tracking-widest mb-4 animate-pulse">
                                Plan Completo
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
                                ¡Límite del Plan Alcanzado!
                            </h1>
                            <p className="text-white text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                                Has alcanzado el límite máximo de proyectos disponibles en tu suscripción actual. Para continuar creando nuevas estrategias de marketing, necesitas liberar cupos o actualizar tu plan. Aquí tienes tus proyectos activos:
                            </p>
                        </div>

                        {userActiveProjects.length === 0 ? (
                            <div className="text-center py-10 bg-[#111]/50 rounded-[2.5rem] border border-white/5 max-w-xl mx-auto w-full px-6">
                                <p className="text-gray-400 text-sm animate-pulse">Cargando tus proyectos activos...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] mx-auto w-full mb-20">
                                {userActiveProjects.map((project) => (
                                    <div 
                                        key={project.id}
                                        className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-[#FF5A1F]/50 transition-all flex flex-col h-full shadow-2xl relative min-h-[520px] w-full"
                                    >
                                        {/* Imagen del Proyecto */}
                                        <div className="h-64 bg-gray-800 relative overflow-hidden">
                                            {project.multimedia_json?.heroImages?.[0] ? (
                                                <img 
                                                    src={project.multimedia_json.heroImages[0]} 
                                                    alt={project.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                                    <Target className="w-12 h-12 text-[#FF5A1F] opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-60" />
                                            
                                            {/* Nicho flotante */}
                                            <div className="absolute bottom-4 left-6">
                                                <span className="px-4 py-2 bg-white text-[#FF5A1F] text-[12px] font-black uppercase rounded-full shadow-lg">
                                                    {project.niche || 'Digital'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Contenido (Idéntico a WizardSteps) */}
                                        <div className="p-10 flex flex-col flex-1">
                                            <h3 className="text-3xl font-black mb-4 text-white group-hover:text-[#FF5A1F] transition-colors line-clamp-2">
                                                {project.name}
                                            </h3>
                                            <p className="text-white text-base leading-relaxed mb-8 flex-1 line-clamp-4">
                                                {project.shortDescription || project.description || "Este proyecto no tiene cargada una descripción pero está activo en tu plan."}
                                            </p>

                                            {/* Botón Ver Proyecto */}
                                            <div className="flex items-center justify-center pt-8 border-t border-white/5">
                                                <button
                                                    onClick={() => {
                                                        navigate(`/dashboard/projects/${project.id}/strategy`);
                                                        onComplete?.();
                                                    }}
                                                    className="w-full py-4 bg-[#FF5A1F] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF5A1F]/20 hover:bg-[#D94A1E] transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Target className="w-4 h-4" />
                                                    Ver Proyecto
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Botón de Regresar al Panel de Administración abajo del todo */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={onComplete}
                                className="px-8 py-4 sm:px-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF5A1F]/30 text-white font-black text-sm tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF5A1F]/5"
                            >
                                Regresar al panel de administración
                            </button>
                        </div>
                    </div>
                ) : step === 'success' ? (
                    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-center pt-36 md:pt-40 pb-16 relative z-10 font-sans">
                        
                        {/* Page Title */}
                        <div className="text-center max-w-4xl mx-auto mb-12">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFBF00]/10 border border-[#FFBF00]/30 rounded-full text-xs font-black text-[#FFBF00] uppercase tracking-widest mb-4 animate-pulse">
                                ★ ⚠️ ACCIÓN REQUERIDA PARA FINALIZAR ★
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none mb-4">
                                Tu Centro de <span className="text-[#FF5A1F]">Operaciones</span>
                            </h1>
                            <p className="text-white text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                                Gestiona tu ecosistema de afiliados y escala tus resultados.
                            </p>
                        </div>

                        {/* Big Layout (Bento Grid) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-12">
                            {/* Columna Izquierda (El Proyecto) - 70% width or lg:col-span-2 */}
                            <div className="lg:col-span-2 flex">
                                {/* Project Progress Bento */}
                                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-10 shadow-2xl relative overflow-hidden flex-1 w-full">
                                    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden bg-gray-800 shrink-0 border border-white/10 shadow-xl">
                                        {activeProjectImage ? (
                                            <img 
                                                src={activeProjectImage} 
                                                alt={activeProjectName} 
                                                className="w-full h-full object-cover" 
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#111] to-[#FF5A1F]/20">
                                                <Target className="w-16 h-16 text-[#FF5A1F] opacity-45 animate-pulse" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-40"></div>
                                    </div>
                                    
                                    <div className="flex-1 text-left space-y-5 font-sans">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-3.5 py-1.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/25 text-[10px] sm:text-xs font-black uppercase text-[#FF5A1F] tracking-widest rounded-full">
                                                {activeProjectNiche}
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-none">
                                                Proyecto: {activeProjectName}
                                            </h2>
                                            <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-2 font-medium">
                                                La estructura psicológica de alta conversión para capturar prospectos y concretar comisiones recurrentes ya fue configurada con éxito.
                                            </p>
                                        </div>

                                        {/* Progress bar info */}
                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center text-xs md:text-sm">
                                                <span className="text-emerald-400 font-extrabold uppercase tracking-wider">Tu máquina de ventas está encendida en nivel básico</span>
                                                <span className="text-[#FF5A1F] font-black text-sm md:text-base">40% Completado</span>
                                            </div>
                                            {/* Visual Progress Blocks - Thicker */}
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="h-5 flex-1 bg-emerald-500 rounded-md"></div>
                                                <div className="h-5 flex-1 bg-emerald-500 rounded-md"></div>
                                                <div className="h-5 flex-1 bg-emerald-500 rounded-md"></div>
                                                <div className="h-5 flex-1 bg-gray-800 rounded-md"></div>
                                                <div className="h-5 flex-1 bg-gray-800 rounded-md"></div>
                                                <div className="h-5 flex-1 bg-gray-800 rounded-md"></div>
                                                <div className="h-5 flex-1 bg-gray-800 rounded-md"></div>
                                            </div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">
                                                Completa los siguientes módulos para operar como un Súper Afiliado y rentabilizar tu tráfico.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column: Slots Inventory Reminders (Capacidad del Plan) */}
                            <div className="bg-[#111] border border-[#FF5A1F]/20 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden font-sans">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/10 blur-xl rounded-full"></div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center">
                                            <Database className="w-5 h-5 text-[#FF5A1F]" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest block text-left">Inventario de Negocios</span>
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight text-left">Capacidad del Plan</h4>
                                        </div>
                                    </div>

                                    {/* Progress bar and text */}
                                    <div className="space-y-3 bg-black/40 border border-white/5 rounded-2xl p-5 text-left">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Ranuras Activas</span>
                                            <span className="text-white font-black text-base">1 / 1 Proyectos</span>
                                        </div>
                                        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#FF5A1F] rounded-full w-full"></div>
                                        </div>
                                        <span className="text-[11px] text-yellow-500 font-bold uppercase tracking-wide block">
                                            🔒 Capacidad al 100% (Plan Gratuito)
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-left">
                                        <h5 className="text-sm font-black text-white uppercase tracking-wider">Multiplica tus fuentes de ingresos</h5>
                                        <p className="text-[#999] text-xs leading-relaxed font-semibold">
                                            Sube al Plan PRO por $39 para activar 3 ecosistemas simultáneos y conectar tu dominio.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Rocket className="w-4 h-4 animate-bounce" />
                                        Actualizar al Plan PRO por $39
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section Title for modules */}
                        <div className="text-left mb-6 pl-2">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Módulos de tu Centro de Operaciones</h4>
                        </div>

                        {/* List of 4 Modules (One module per line) */}
                        <div className="flex flex-col gap-6 w-full mb-16">
                            {/* Bloque 1 */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between hover:border-[#FF5A1F]/30 transition-all gap-6 text-left relative overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                                    <span className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                                    </span>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Landing Page Oficial</h3>
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                                Activo - Nivel Básico
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed font-semibold max-w-3xl">
                                            Tu embudo de marketing recopila prospectos activamente en su enlace oficial. Diseñado y optimizado con gatillos psicológicos de alta conversión para enganchar a tus prospectos.
                                        </p>
                                        <div className="inline-flex items-center gap-2 bg-black/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-gray-450 font-mono select-all truncate max-w-full">
                                            <span className="text-[#FF5A1F] font-bold">Enlace:</span> {getPageUrl()}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 lg:pt-0 shrink-0 flex flex-wrap gap-3 w-full lg:w-auto">
                                    <button 
                                        onClick={() => window.open(getPageUrl(), '_blank')}
                                        className="flex-1 lg:flex-none py-4 px-6 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-gray-300 hover:bg-white/10 hover:text-white transition-all text-center min-w-[140px]"
                                    >
                                        Ver Página
                                    </button>
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="flex-1 lg:flex-none py-4 px-6 bg-white/10 border border-white/15 rounded-xl text-xs font-black uppercase text-white/95 hover:bg-white/15 hover:text-white transition-all flex items-center justify-center gap-2 min-w-[140px]"
                                    >
                                        <Lock className="w-4 h-4 text-[#FF5A1F]" />
                                        Dominio PRO
                                    </button>
                                </div>
                            </div>

                            {/* Bloque 2 */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between hover:border-[#FF5A1F]/30 transition-all gap-6 text-left relative overflow-hidden">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                                    <span className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-yellow-500/20">
                                        <Video className="w-8 h-8 text-yellow-500" />
                                    </span>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Hooks de Video Persuasivos</h3>
                                            <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/25 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-wider">
                                                En Pausa (3 de 30 Generados)
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed font-semibold max-w-3xl">
                                            Guiones de video altamente optimizados creados para llamar la atención en TikTok, Instagram y Shorts en los primeros 3 segundos. Ideal para captar leads orgánicos masivamente.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 lg:pt-0 shrink-0 w-full lg:w-auto">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full lg:w-auto py-4 px-8 bg-[#FF5A1F] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#D94A1E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/15 min-w-[220px]"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Calendario Mensual
                                    </button>
                                </div>
                            </div>

                            {/* Bloque 3 */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between hover:border-[#FF5A1F]/30 transition-all gap-6 text-left relative overflow-hidden group">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
                                    <Lock className="w-64 h-64 text-white stroke-[0.3]" />
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 relative z-10">
                                    <span className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                        <MessageSquare className="w-8 h-8 text-[#FF5A1F]/80" />
                                    </span>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Máquina de Respuestas en WhatsApp</h3>
                                            <span className="px-3 py-1 bg-white/[0.08] border border-white/10 rounded-full text-[10px] font-black text-[#FF5A1F] uppercase tracking-wider flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                Módulo PRO
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed font-semibold max-w-3xl">
                                            El 80% de las ventas en Hotmart se concretan en el chat. La IA inteligente escribe respuestas mágicas y maneja objeciones complejas al instante para ti.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 lg:pt-0 shrink-0 w-full lg:w-auto relative z-10">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full lg:w-auto py-4 px-8 bg-white/[0.06] border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all flex items-center justify-center gap-2 shadow-inner min-w-[220px]"
                                    >
                                        <Lock className="w-4 h-4 text-[#FF5A1F]" />
                                        Desbloquear Módulo PRO
                                    </button>
                                </div>
                            </div>

                            {/* Bloque 4 */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between hover:border-[#FF5A1F]/30 transition-all gap-6 text-left relative overflow-hidden group">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
                                    <Lock className="w-64 h-64 text-white stroke-[0.3]" />
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 relative z-10">
                                    <span className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                        <Mail className="w-8 h-8 text-[#FF5A1F]/80" />
                                    </span>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Recuperación de Carritos y Correo</h3>
                                            <span className="px-3 py-1 bg-white/[0.08] border border-white/10 rounded-full text-[10px] font-black text-[#FF5A1F] uppercase tracking-wider flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                Módulo PRO
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed font-semibold max-w-3xl">
                                            Recupera ventas perdidas de Hotmart con campañas de correo de seguimiento ya optimizadas psicológicamente y listas para alimentar a tus prospectos.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 lg:pt-0 shrink-0 w-full lg:w-auto relative z-10">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full lg:w-auto py-4 px-8 bg-white/[0.06] border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all flex items-center justify-center gap-2 shadow-inner min-w-[220px]"
                                    >
                                        <Lock className="w-4 h-4 text-[#FF5A1F]" />
                                        Desbloquear Módulo PRO
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Final Central Call To Action Button to go to Dashboard */}
                        <div className="flex flex-col items-center justify-center gap-4 border-t border-white/5 pt-12">
                            <button 
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.removeItem('force_wizard_step');
                                    }
                                    onComplete();
                                }}
                                className="px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-base md:text-lg uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3"
                            >
                                Finalizar configuración ➔ Ir a mi Panel de Control
                            </button>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                Entrar al administrador completo de mi sistema
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                    {/* 1. BIENVENIDA */}
                    <div ref={welcomeRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                            <WelcomeStep 
                                userData={user} 
                                onNext={() => {
                                    setStep('selection');
                                    scrollTo(selectionRef);
                                }} 
                                disabled={!!strategyData}
                            />
                        </div>

                        {/* 2. SELECCIÓN DE PROYECTO */}
                        {revealedSections.includes('selection') && (
                            <>
                                <div ref={selectionRef} className="w-full max-w-[1400px] mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                    <ProjectSelectionStep 
                                        projects={projects}
                                        loading={loadingProjects}
                                        userData={user}
                                        onNext={handleProjectSelection}
                                        selectedProjectId={selectedProject?.id}
                                        isLocked={!!strategyData}
                                    />
                                </div>

                                {selectedProject && (
                                    <motion.div 
                                        ref={unlockRef}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden"
                                    >
                                        <div className="text-center mb-6">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">
                                                <CheckCircle className="w-4 h-4" />
                                                Tu proyecto está listo para activarse
                                            </div>
                                        </div>
                                        
                                        <UnlockProtocolStep 
                                            project={selectedProject}
                                            userData={user}
                                            onNext={() => setShowActivateConfirm(true)}
                                            isStrategyGenerated={!!strategyData}
                                            onBackToSelection={() => {
                                                setSelectedProject(null);
                                                setStep('selection');
                                                setRevealedSections(['welcome', 'selection']);
                                                scrollTo(selectionRef);
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </>
                        )}

                        {/* Modals de Confirmación */}
                        <AnimatePresence>
                            {showActivateConfirm && (
                                <div 
                                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
                                    onClick={() => setShowActivateConfirm(false)}
                                >
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-[#0B0B0B] border border-emerald-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden relative text-center"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                        <div className="p-10 space-y-8">
                                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg">
                                                <Zap className="w-10 h-10 fill-current" />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">¿Estás seguro?</h3>
                                                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                                    ¿Estás seguro de que deseas desbloquear este proyecto ahora mismo?
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <button 
                                                    onClick={handleUnlockConfirm}
                                                    className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-95"
                                                >
                                                    SÍ, DESBLOQUEAR AHORA
                                                </button>
                                                <button 
                                                    onClick={() => setShowActivateConfirm(false)}
                                                    className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-all"
                                                >
                                                    No, cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {showCreateLandingConfirm && (
                                <div 
                                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
                                    onClick={() => setShowCreateLandingConfirm(false)}
                                >
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-[#0B0B0B] border border-[#FF5A1F]/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden relative text-center"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-500"></div>
                                        <div className="p-10 space-y-8">
                                            <div className="w-20 h-20 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-3xl flex items-center justify-center mx-auto border border-[#FF5A1F]/20 shadow-lg">
                                                <Target className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">¿Estás seguro?</h3>
                                                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                                    ¿Estás seguro de que deseas crear tu página de captura ahora mismo?
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <button 
                                                    onClick={handleCreateWeb}
                                                    className="w-full py-5 rounded-2xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-lg shadow-xl shadow-[#FF5A1F]/20 transition-all transform hover:scale-[1.02] active:scale-95"
                                                >
                                                    SÍ, CREAR MI PÁGINA
                                                </button>
                                                <button 
                                                    onClick={() => setShowCreateLandingConfirm(false)}
                                                    className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-all"
                                                >
                                                    No, cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* 3. GENERANDO ESTRATEGIA */}
                        {revealedSections.includes('generating_strategy') && step === 'generating_strategy' && (
                            <div ref={strategyRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <GenerationStep 
                                    progress={generationProgress} 
                                    status={generationStatus} 
                                    secondsElapsed={secondsElapsed}
                                />
                            </div>
                        )}

                        {/* 4. AVATARES */}
                        {revealedSections.includes('strategy_ready') && (
                            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <StrategyReadyStep 
                                    userData={user}
                                    project={selectedProject}
                                    onNext={() => setStep('show_landing_prep')}
                                />
                            </div>
                        )}

                        {revealedSections.includes('show_avatars') && (
                            <div ref={avatarsRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <AvatarRevealStep 
                                    userData={user}
                                    avatars={strategyData?.avatars || []}
                                    onNext={() => setStep('show_landing_prep')}
                                />
                            </div>
                        )}

                        {/* 5. LANDING PREP */}
                        {revealedSections.includes('show_landing_prep') && (
                            <div ref={landingPrepRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <LandingIntroStep 
                                    userData={user}
                                    onNext={() => setShowCreateLandingConfirm(true)}
                                    isCreated={isLandingCreated}
                                />
                            </div>
                        )}

                        {/* 6. CREANDO WEB */}
                        {revealedSections.includes('creating_web') && step === 'creating_web' && (
                            <div ref={creationRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <h1 className="text-center text-emerald-500 font-black uppercase tracking-widest mb-10">Estoy creando tu Página Web Profesional</h1>
                                <GenerationStep 
                                    progress={generationProgress} 
                                    status={generationStatus} 
                                    secondsElapsed={secondsElapsed}
                                    message="Crearé tu página web profesional para capturar clientes interesados."
                                />
                            </div>
                        )}

                        {revealedSections.includes('landing_success') && (
                            <div ref={landingSuccessRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <LandingSuccessStep 
                                    userData={user}
                                    onNext={() => setStep('show_hooks')}
                                    onView={() => {
                                        const subdomainPart = createdPageSubdomain ? createdPageSubdomain.split('.')[0] : '';
                                        if (subdomainPart) {
                                            const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('ais-dev'));
                                            const url = isLocal ? `/admin/lp/${subdomainPart}` : `https://aprende.marketing/admin/lp/${subdomainPart}`;
                                            window.open(url, '_blank');
                                        } else if (unlockedProject) {
                                            window.open(`/dashboard/projects/${unlockedProject.id}/strategy?section=web`, '_blank');
                                        }
                                    }}
                                    onEdit={() => {
                                        if (unlockedProject) {
                                            window.open(`/dashboard/projects/${unlockedProject.id}/strategy?section=web`, '_blank');
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {/* 6.5 GENERANDO HOOKS (LOADING) */}
                        {step === 'generating_hooks' && (
                            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <h1 className="text-center text-purple-500 font-black uppercase tracking-widest mb-10">Generando Activos de Atracción</h1>
                                <GenerationStep 
                                    progress={generationProgress} 
                                    status={generationStatus} 
                                    secondsElapsed={secondsElapsed}
                                    message="Estamos creando los videos para atraer tus potenciales clientes."
                                />
                            </div>
                        )}

                        {/* 7. HOOKS REVEAL */}
                        {revealedSections.includes('show_hooks') && step !== 'generating_hooks' && (
                            <div className="relative w-full pt-24 pb-12 px-4 md:px-6">
                                <HooksRevealStep 
                                    userData={user}
                                    hooks={unlockedHooks.length > 0 ? unlockedHooks : (strategyData?.modules?.hooks || [])}
                                    isUnlocked={isHooksUnlocked}
                                    projectId={unlockedProject?.id}
                                    project={selectedProject || unlockedProject}
                                    onNext={() => {
                                        if (!isHooksUnlocked) {
                                            handleUnlockHooks();
                                        } else {
                                            if (!revealedSections.includes('success')) {
                                                setStep('success');
                                            }
                                        }
                                    }}
                                    hooksRef={hooksRef}
                                />
                            </div>
                        )}

                        {/* 8. ÉXITO FINAL */}
                        {revealedSections.includes('success') && (
                            <div ref={successRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center pt-24 pb-12 snap-start snap-always relative overflow-hidden">
                                <SuccessStep onFinish={onComplete} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Suspense fallback={null}>
                {showProfileModal && (
                    <UserProfileModal 
                        user={user} 
                        onClose={() => setShowProfileModal(false)} 
                        onUpdateUser={onUpdateUser!} 
                    />
                )}
            </Suspense>

            {showUpgradeModal && (
                <UpgradeModal 
                    isOpen={showUpgradeModal} 
                    onClose={() => setShowUpgradeModal(false)} 
                    user={user}
                    currentPlan={user.planLimits?.planName || 'Gratuito'}
                />
            )}

            {/* Minimalist Top Progress Bar */}
            {(step !== 'success' && !isGenerating) && (() => {
                const steps = ['welcome', 'selection', 'generating_strategy', 'strategy_ready', 'show_landing_prep', 'creating_web', 'landing_success', 'show_hooks', 'success'];
                const currentStepStr = step as string;
                const activeIndex = steps.indexOf(currentStepStr === 'generating_hooks' ? 'show_hooks' : currentStepStr);
                const progressPercent = activeIndex >= 0 ? ((activeIndex + 1) / steps.length) * 100 : 0;
                return (
                    <div 
                        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#FF5A1F] to-emerald-500 z-[55] transition-all duration-500 ease-out shadow-[0_1px_10px_rgba(255,90,31,0.5)]" 
                        style={{ width: `${progressPercent}%` }}
                    />
                );
            })()}
        </div>
    );
};
