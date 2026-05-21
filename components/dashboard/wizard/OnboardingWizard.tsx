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
    const [step, setStep] = useState<WizardStep>('welcome');
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

    const activeProjectName = unlockedProject?.name || selectedProject?.name || 'Tu Proyecto MKT';
    const activeProjectImage = unlockedProject?.multimedia_json?.heroImages?.[0] || selectedProject?.multimedia_json?.heroImages?.[0];
    const activeProjectNiche = unlockedProject?.niche || selectedProject?.niche || 'Digital';

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
            <header className="fixed top-0 left-0 right-0 h-20 bg-transparent flex items-center justify-between px-6 md:px-12 z-50">
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
                    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 min-h-screen flex flex-col justify-center pt-28 pb-16 relative z-10 font-sans">
                        
                        {/* Page Title */}
                        <div className="text-center max-w-4xl mx-auto mb-12">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 animate-pulse">
                                ★ Configuración Completada ★
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none mb-4">
                                ¡ TODO <span className="text-[#FF5A1F]">LISTO</span> !
                            </h1>
                            <p className="text-white text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                                Tu primer negocio ha sido configurado con éxito. Ya puedes administrar tu sistema de ventas de afiliados premium.
                            </p>
                        </div>

                        {/* Big Layout (Bento Grid) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-12">
                            {/* Left column: 2 slots (Community Banner & Project Info) */}
                            <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
                                {/* 1. Community WhatsApp Banner */}
                                <div className="bg-gradient-to-r from-[#FF5A1F] to-[#E04812] rounded-[2.5rem] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden flex-1">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                            <span className="text-2xl">🔥</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                                                ¡No te quedes a medias!
                                            </h3>
                                            <p className="text-white/95 text-sm md:text-base font-medium">
                                                Únete al Desafío de 7 Días en WhatsApp y lanza tu primera campaña con el creador de la plataforma.
                                            </p>
                                        </div>
                                    </div>
                                    <a 
                                        href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 bg-white text-[#FF5A1F] hover:bg-white/95 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shrink-0 text-center justify-center font-sans"
                                    >
                                        Entrar al Grupo Privado
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                </div>
                                
                                {/* 2. Project Progress Bento */}
                                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden flex-[2]">
                                    <div className="relative w-36 h-36 rounded-3xl overflow-hidden bg-gray-800 shrink-0 border border-white/10 shadow-lg">
                                        {activeProjectImage ? (
                                            <img 
                                                src={activeProjectImage} 
                                                alt={activeProjectName} 
                                                className="w-full h-full object-cover" 
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                                <Target className="w-12 h-12 text-[#FF5A1F] opacity-30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-40"></div>
                                    </div>
                                    
                                    <div className="flex-1 text-left space-y-4 font-sans">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-3 py-1 bg-[#FF5A1F]/10 border border-[#FF5A1F]/25 text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest rounded-full">
                                                {activeProjectNiche}
                                            </span>
                                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                                Proyecto Reciente
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                                                {activeProjectName}
                                            </h2>
                                            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mt-1">
                                                La estructura psicológica para capturar prospectos y concretar comisiones recurrentes ya fue configurada con éxito.
                                            </p>
                                        </div>

                                        {/* Progress bar info */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-emerald-400 font-bold uppercase tracking-wider">Tu máquina de ventas está encendida en nivel básico</span>
                                                <span className="text-[#FF5A1F] font-black">40% Completado</span>
                                            </div>
                                            {/* Visual Progress Blocks */}
                                            <div className="flex items-center gap-1.5 w-full">
                                                <div className="h-4 flex-1 bg-emerald-500 rounded-md"></div>
                                                <div className="h-4 flex-1 bg-emerald-500 rounded-md"></div>
                                                <div className="h-4 flex-1 bg-emerald-500 rounded-md"></div>
                                                <div className="h-4 flex-1 bg-gray-800 rounded-md"></div>
                                                <div className="h-4 flex-1 bg-gray-800 rounded-md"></div>
                                                <div className="h-4 flex-1 bg-gray-800 rounded-md"></div>
                                                <div className="h-4 flex-1 bg-gray-800 rounded-md"></div>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium">
                                                Completa los siguientes módulos para operar como un Súper Afiliado y rentabilizar tu tráfico.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column: Slots Inventory Reminders */}
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
                                        <span className="text-[11px] text-yellow-501 font-bold uppercase tracking-wide block">
                                            🔒 Capacidad al 100% (Plan Gratuito)
                                        </span>
                                    </div>

                                    <div className="space-y-4 text-left">
                                        <h5 className="text-sm font-black text-white uppercase tracking-wider">¿Deseas vender múltiples productos?</h5>
                                        <p className="text-[#999] text-xs leading-relaxed font-semibold">
                                            Sube al Plan PRO por solo $39 para desbloquear 3 ranuras activas simultáneas, conectar dominios propios y activar todas las herramientas de IA generativa ilimitada.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Rocket className="w-4 h-4 animate-bounce" />
                                        Actualizar a Pro por $39
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section Title for modules */}
                        <div className="text-left mb-6 pl-2">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Módulos de tu Centro de Operaciones</h4>
                        </div>

                        {/* Grid of 4 Modules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
                            {/* Bloque 1 */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between h-full hover:border-[#FF5A1F]/30 transition-all min-h-[350px] text-left">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                            Activo - Nivel Básico
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight uppercase">Landing Page</h3>
                                        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                            Tu embudo de marketing recopila prospectos activamente en su enlace oficial.
                                        </p>
                                    </div>
                                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 select-all text-[11px] text-gray-500 font-mono truncate">
                                        {getPageUrl()}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex gap-3">
                                    <button 
                                        onClick={() => window.open(getPageUrl(), '_blank')}
                                        className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-gray-300 hover:bg-white/10 hover:text-white transition text-center"
                                    >
                                        Ver Página
                                    </button>
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="flex-1 py-3 px-4 bg-[#FF5A1F]/15 border border-[#FF5A1F]/20 rounded-xl text-xs font-black uppercase text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white transition flex items-center justify-center gap-1.5"
                                    >
                                        <Lock className="w-3.5 h-3.5" />
                                        Dominio
                                    </button>
                                </div>
                            </div>

                            {/* Bloque 2 */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between h-full hover:border-[#FF5A1F]/30 transition-all min-h-[350px] text-left">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
                                            <Video className="w-6 h-6 text-yellow-500" />
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/25 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-wider">
                                            En Pausa
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight uppercase">Hooks de Video</h3>
                                        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                            3 de 30 videos generados. Tienes guiones persuasivos listos para captar la atención de tu audiencia en TikTok, Instagram y Shorts.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full py-4 bg-[#FF5A1F] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#D94A1E] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/15"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Calendario Mensual
                                    </button>
                                </div>
                            </div>

                            {/* Bloque 3 */}
                            <div className="bg-[#111]/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between h-full opacity-65 hover:opacity-100 transition-all min-h-[350px] text-left">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="w-12 h-12 bg-gray-500/10 rounded-2xl flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-gray-500" />
                                        </span>
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                            Bloqueado
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white/80 tracking-tight uppercase">Máquina de WhatsApp</h3>
                                        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                            El 80% de las ventas en Hotmart se cierran por WhatsApp. Deja que la IA inteligente escriba tus respuestas persuasivas.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full py-4 bg-white/5 border border-white/10 text-white/80 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Activar WhatsApp
                                    </button>
                                </div>
                            </div>

                            {/* Bloque 4 */}
                            <div className="bg-[#111]/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between h-full opacity-65 hover:opacity-100 transition-all min-h-[350px] text-left">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="w-12 h-12 bg-gray-500/10 rounded-2xl flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-gray-500" />
                                        </span>
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                            Bloqueado
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white/80 tracking-tight uppercase">SEO y Correo</h3>
                                        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                            Recupera carritos abandonados de Hotmart y nutre a tus prospectos en automático con campañas optimizadas.
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full py-4 bg-white/5 border border-white/10 text-white/80 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#FF5A1F] hover:text-white hover:border-[#FF5A1F] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Activar Correo y SEO
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Final Central Call To Action Button to go to Dashboard */}
                        <div className="flex flex-col items-center justify-center gap-4 border-t border-white/5 pt-12">
                            <button 
                                onClick={onComplete}
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
