import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { User, Project, ColorPalette } from '../../../types';
import { api } from '../../../services/api';
import { Zap, Target, CheckCircle, LogOut, ChevronRight, Video, MessageSquare, Mail, Lock, Database, Rocket, AlertTriangle, FileText, Globe, Users, ShieldCheck, Crown, Shield, X, Copy, Check, Calendar } from 'lucide-react';
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
    const [activeDetailsDrawer, setActiveDetailsDrawer] = useState<'avatar' | 'testimonials' | 'objections' | 'benefits' | 'hooks' | null>(null);
    const [selectedHookForDrawer, setSelectedHookForDrawer] = useState<any>(null);
    const [copiedUrl, setCopiedUrl] = useState(false);
    
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

    // Lock background scroll when drawer is open
    useEffect(() => {
        if (activeDetailsDrawer) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [activeDetailsDrawer]);

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

    const activeProjectName = selectedProject?.name || unlockedProject?.name || 'Curso de Microblading de Cejas';
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
                        <div className="text-center max-w-5xl mx-auto mb-12">
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 uppercase">
                                ¡PERFECTO!<br />
                                <span className="text-white font-black">YA ESTÁS A UN PASO DE </span>
                                <span className="text-[#FF5A1F] font-black">ATRAER CLIENTES Y GANAR ALTAS COMISIONES</span>
                            </h1>
                            <p className="text-gray-200 text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto tracking-wide">
                                Gestiona tu ecosistema y desbloquea las herramientas para escalar tus resultados.
                            </p>
                        </div>

                        {/* Big Layout (Bento Grid) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mb-12">
                            
                            {/* Columna Izquierda (El Proyecto) - 60% Width */}
                            <div className="lg:col-span-7 flex">
                                {/* Project Progress Bento */}
                                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden flex-1 w-full">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>
                                    
                                    {/* Bento Header */}
                                    <div className="mb-2 relative z-10 text-center w-full">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            
                                            {/* Beautiful Transparent Progress Container - no glassmorphism background or border */}
                                            <div className="w-full mt-4 bg-transparent relative overflow-hidden flex flex-col">
                                                {/* Plain White Text for Progress Head - no badge design */}
                                                <div className="w-full text-white font-black text-sm md:text-base text-center uppercase tracking-wider select-none font-sans z-10 mb-4 leading-normal">
                                                    ¡CASI LISTO! TU PROYECTO ESTÁ AL 85%. SÓLO UNOS PASOS MÁS.
                                                </div>

                                                <div className="p-1 flex flex-col items-center justify-center space-y-5">
                                                    {/* 85% Progress Bar on its own */}
                                                    <div className="w-full z-10 relative space-y-2">
                                                        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
                                                            <div 
                                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F] rounded-full shadow-[0_0_12px_rgba(255,191,0,0.6)] transition-all duration-500" 
                                                                style={{ width: '85%' }}
                                                            ></div>
                                                        </div>
                                                        <div className="flex justify-end items-center px-1">
                                                            <span className="text-[#FFBF00] font-mono font-black text-lg tracking-wider select-none">85%</span>
                                                        </div>
                                                    </div>

                                                    {/* Centered Project Name styled with attractive custom shapes, glowing backgrounds - PLACED UNDERNEATH THE 85% PROGESS AND TEXT */}
                                                    <div className="relative inline-flex items-center z-10">
                                                        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F] rounded-2xl blur-md opacity-25"></div>
                                                        <div className="relative bg-[#141415] border border-white/10 rounded-2xl px-6 py-3 shadow-inner">
                                                            <h2 className="text-xl md:text-2xl font-black text-[#FFBF00] tracking-wider uppercase font-sans text-center">
                                                                {activeProjectName}
                                                            </h2>
                                                        </div>
                                                    </div>

                                                    {/* Onboarding welcome message */}
                                                    <p className="text-sm md:text-base text-center text-white font-sans leading-[1.75rem] max-w-xl mx-auto z-10 relative px-2">
                                                        <span className="font-bold text-white">Hola Admin Microblading.</span>{' '}
                                                        <span className="text-zinc-300">Ya he creado tu Ecosistema Digital para vender productos en automático. Revisa esta página y descubre el trabajo que he adelantado para ti, y cómo puedes potenciarlo actualizando a PRO</span>
                                                    </p>

                                                    {/* Project Image underneath */}
                                                    {activeProjectImage && (
                                                        <div className="w-full h-32 md:h-48 rounded-2xl overflow-hidden border border-white/10 relative bg-[#0E0E0F] shadow-md group z-10">
                                                            <img 
                                                                src={activeProjectImage} 
                                                                alt={activeProjectName} 
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                                                referrerPolicy="no-referrer"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bento Body Container */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                                        
                                        {/* Mobile iPhone Mockup Preview */}
                                        <div className="md:col-span-5 flex justify-center">
                                            <div className="relative w-48 h-[340px] bg-[#000] rounded-[2.2rem] border-[5px] border-zinc-800 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer group hover:border-[#FFBF00]/40 transition-all duration-300">
                                                {/* Camera notch / dynamic island */}
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-20 flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full absolute left-3"></span>
                                                    <span className="w-1 h-1 bg-zinc-900 rounded-full absolute right-4"></span>
                                                </div>

                                                {/* Signal bar mockups */}
                                                <div className="flex justify-between text-[7px] text-gray-500 font-bold px-3 pt-0.5 z-10 font-mono">
                                                    <span>9:41</span>
                                                    <div className="flex items-center gap-1">
                                                        <span>📶</span>
                                                        <span>🔋</span>
                                                    </div>
                                                </div>

                                                {/* Inner Screen */}
                                                <div className="relative h-full w-full rounded-[1.4rem] bg-[#0E0E0F] overflow-hidden flex flex-col mt-0.5 border border-white/5">
                                                    
                                                    {/* Mock Browser URL tag */}
                                                    <div className="w-[90%] mx-auto mt-2 py-0.5 px-2 bg-white/5 rounded-md border border-white/5 text-[6px] text-zinc-500 font-mono flex items-center justify-between">
                                                        <span className="truncate">🔒 mkt.{activeProjectName.toLowerCase().replace(/\s+/g, '')}.com</span>
                                                        <span>↻</span>
                                                    </div>

                                                    {/* Dynamic Template Content */}
                                                    <div className="flex-1 flex flex-col p-2.5 space-y-2 mt-1 select-none text-left">
                                                        {activeProjectImage ? (
                                                            <div className="w-full h-24 rounded-lg overflow-hidden border border-white/5 relative bg-zinc-900">
                                                                <img 
                                                                    src={activeProjectImage} 
                                                                    alt={activeProjectName} 
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                                    referrerPolicy="no-referrer"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-[#111] to-[#FF5A1F]/20 border border-white/5 flex items-center justify-center">
                                                                <Target className="w-6 h-6 text-[#FF5A1F] opacity-40" />
                                                            </div>
                                                        )}

                                                        <div className="space-y-1">
                                                            <span className="px-1.5 py-0.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[5px] font-black uppercase text-[#FF5A1F] rounded">
                                                                {activeProjectNiche}
                                                            </span>
                                                            <h3 className="text-[9px] font-black text-white leading-tight uppercase tracking-tight block truncate mt-1">
                                                                {activeProjectName}
                                                            </h3>
                                                            <p className="text-[6px] text-zinc-400 font-medium leading-snug">
                                                                La estructura psicológica de alta conversión está lista. Generando ingresos pasivos...
                                                            </p>
                                                        </div>

                                                        {/* Simulated Landing elements */}
                                                        <div className="space-y-1 mt-auto pt-2">
                                                            <div className="h-1 bg-white/5 rounded-full w-[80%]"></div>
                                                            <div className="h-1 bg-white/5 rounded-full w-[60%]"></div>
                                                            <div className="w-full py-1 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] rounded text-white font-black text-[5px] text-center uppercase tracking-wider shadow-sm">
                                                                ¡EMPEZAR AHORA!
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Checklist right side */}
                                        <div id="status-checklist-container" className="md:col-span-7 space-y-4 px-2">
                                            {/* Check 1 */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                    <strong className="font-extrabold text-white font-sans">Análisis de Cliente Ideal (Avatar):</strong> <span className="text-zinc-300">¡Generado con precisión!</span>
                                                </p>
                                            </div>

                                            {/* Check 2 */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                    <strong className="font-extrabold text-white font-sans">Guiones de Venta (Reels, TikTok, Shorts):</strong> <span className="text-zinc-300">¡Listos para grabar!</span>
                                                </p>
                                            </div>

                                            {/* Check 3 */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded bg-[#22C55E] flex items-center justify-center text-white shrink-0 mt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                    <strong className="font-extrabold text-white font-sans">Estructura de Página de Captura:</strong> <span className="text-zinc-300">¡Diseñada y optimizada!</span>
                                                </p>
                                            </div>

                                            {/* Warning Lock 1 */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                                                    <Lock className="w-3 h-3 text-[#FFBF00]" />
                                                </div>
                                                <p className="text-sm md:text-base text-left text-white/90 leading-normal font-sans">
                                                    <strong className="font-bold text-white/90 font-sans">Conexión de Dominio Personalizado:</strong> <span className="text-zinc-450">Pendiente 👑</span>
                                                </p>
                                            </div>

                                            {/* Warning Lock 2 */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                                                    <Lock className="w-3 h-3 text-[#FFBF00]" />
                                                </div>
                                                <p className="text-sm md:text-base text-left text-white/90 leading-normal font-sans">
                                                    <strong className="font-bold text-white/90 font-sans">Activación de Embudos Automatizados:</strong> <span className="text-zinc-450">Pausado 👑</span>
                                                </p>
                                            </div>

                                            {/* Warning Lock 3 */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                                                    <Lock className="w-3 h-3 text-[#FFBF00]" />
                                                </div>
                                                <p className="text-sm md:text-base text-left text-white/90 leading-normal font-sans">
                                                    <strong className="font-bold text-white/90 font-sans">Publicación en Hotmart:</strong> <span className="text-zinc-450">Bloqueado 👑</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Columna Derecha (Desbloquea tu Máquina de Ventas - Premium Glowing Plan) - 40% Width */}
                            <div className="lg:col-span-5 flex">
                                <div className="bg-[#111] border-2 border-[#FFBF00]/30 rounded-[2.5rem] p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden font-sans w-full shadow-[0_0_25px_rgba(255,191,0,0.06)]">
                                    {/* Ambient Glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>
                                    
                                    <div className="space-y-6">
                                        {/* Main Heading Text */}
                                        <div className="text-center space-y-3 relative z-10 w-full px-2">
                                            {/* Capacity of the plan stats */}
                                            <div className="space-y-1 py-3 border-t border-b border-white/5">
                                                <p className="text-xs sm:text-sm font-bold text-white tracking-wide text-center leading-normal">
                                                    Actualmente estás usando nuestro <span className="text-[#FFBF00] font-black">Plan Gratuito</span>
                                                </p>
                                            </div>
                                            <h4 className="text-lg md:text-xl font-black text-white tracking-normal leading-tight font-sans text-center pt-[15px]">
                                                ¡Actualiza a PRO Desbloquea todo el potencial de tu negocio Digital!
                                            </h4>
                                        </div>

                                        {/* List of benefits PRO PLAN */}
                                        <div className="space-y-4 relative z-10 text-left font-sans w-full px-2">
                                            <div className="space-y-4">
                                                {/* Benefit 1 */}
                                                <div className="flex items-start gap-2">
                                                    <p className="text-sm md:text-base text-left text-white font-sans leading-[1.75rem]">
                                                        <span className="font-bold text-white font-sans">👑 Ecosistema Multi-Proyecto:</span> <span className="text-zinc-300">Crea hasta 3 ecosistemas completos con sus páginas de captura y dominios propios.</span>
                                                    </p>
                                                </div>

                                                {/* Benefit 2 */}
                                                <div className="flex items-start gap-2">
                                                    <p className="text-sm md:text-base text-left text-white font-sans leading-[1.75rem]">
                                                        <span className="font-bold text-white font-sans">👑 Máquina de Atracción:</span> <span className="text-zinc-300">90 guiones en video y secuencias de email listas para nutrir a tu audiencia.</span>
                                                    </p>
                                                </div>

                                                {/* Benefit 3 */}
                                                <div className="flex items-start gap-2">
                                                    <p className="text-sm md:text-base text-left text-white font-sans leading-[1.75rem]">
                                                        <span className="font-bold text-white font-sans">👑 Lanzamientos por WhatsApp:</span> <span className="text-zinc-300">Embudos preconfigurados para cerrar ventas directas rápidamente.</span>
                                                    </p>
                                                </div>

                                                {/* Benefit 4 */}
                                                <div className="flex items-start gap-2">
                                                    <p className="text-sm md:text-base text-left text-white font-sans leading-[1.75rem]">
                                                        <span className="font-bold text-white font-sans">👑 Mentoría y Soporte VIP:</span> <span className="text-zinc-300">Acceso directo a expertos y grupo de WhatsApp para escalar tus resultados.</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing callout and Action Button at bottom */}
                                        <div className="space-y-4 pt-4 relative z-10 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 pb-1">
                                                {/* Orange highlighted line On Top - with margin bottom to add padding/spacing */}
                                                <div className="w-11/12 h-[2px] bg-gradient-to-r from-transparent via-[#FF5A1F] to-transparent rounded-full shadow-[0_0_8px_rgba(255,90,31,0.6)] opacity-90 mb-4"></div>
                                                <p className="text-white font-black uppercase tracking-wider text-center" style={{ fontSize: '1.2rem', lineHeight: '1.75rem' }}>
                                                    VALOR TOTAL ESTIMADO DE LOS BENEFICIOS PRO: <span className="text-[#FFBF00]">+$1,497</span>
                                                </p>
                                            </div>

                                            <p className="text-white text-sm md:text-base font-normal tracking-wide text-center">
                                                Actualiza al Plan PRO por solo <span className="text-[#FFBF00] font-black">$39/mes</span>
                                            </p>
                                            
                                            {/* Main Premium Red/Orange Button formatted and styled as the hand pointing button in screen */}
                                            <button 
                                                onClick={() => setShowUpgradeModal(true)}
                                                className="w-full py-4 bg-gradient-to-r from-[#FF5A1F] to-[#E04812] hover:from-[#ff6d3c] hover:to-[#f0531c] text-white font-black text-xs sm:text-sm uppercase tracking-wide rounded-2xl shadow-[0_0_20px_rgba(255,90,31,0.22)] hover:shadow-[0_0_30px_rgba(255,90,31,0.42)] transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 font-sans active:translate-y-0 text-center"
                                            >
                                                <span>COMIENZA A VENDER EN AUTOMÁTICO</span>
                                            </button>
                                            
                                            <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                                                <p className="text-sm sm:text-base text-white font-black flex items-center justify-center gap-2 font-sans tracking-wide">
                                                    <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" /> 14 Días de Garantía de Reembolso Total
                                                </p>
                                                <p className="text-xs sm:text-sm text-zinc-300 font-bold tracking-normal text-center leading-normal">
                                                    Suscripción mensual, cancela cuando quieras.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Title for modules */}
                        <div className="text-left mb-6 pl-2">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">Módulos de tu Centro de Operaciones</h4>
                        </div>

                        {/* List of 6 Operation Modules in a robust full-width stack layout */}
                        <div className="flex flex-col gap-6 w-full mb-16">
                            
                            {/* Card 1: Estrategia de Ventas Completada */}
                            <div className="bg-[#111] border border-[#FFBF00]/20 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>
                                
                                {/* Left Column: The Context and the Value */}
                                <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">Estrategia de Ventas</h3>
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider select-none leading-none flex items-center gap-1">
                                                ✔ Completado y Activo
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm md:text-base text-left text-white leading-normal font-sans pt-1">
                                            ¡He diseñado la mejor estrategia de ventas con la que conseguirás altos ingresos recomendando el <strong className="font-extrabold text-[#FFBF00] font-sans">"{activeProjectName}"</strong>.<br /><br />Con la estrategia que he diseñado podrás:
                                        </p>
                                    </div>

                                    {/* Bullets explaining why this is vital for the digital business */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">🎯</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Conectar con tu cliente ideal:</strong> <span className="text-zinc-300">Entendiendo sus miedos más profundos para vender sin fricción.</span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">⚡</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Derribar objeciones automáticamente:</strong> <span className="text-zinc-300">Usando historias y testimonios en el momento exacto.</span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">💎</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Crear una oferta magnética:</strong> <span className="text-zinc-300">Aplicando gatillos mentales que generan urgencia real por comprar.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Resource Cards (Individual buttons) */}
                                <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                                    {/* Resource 1 */}
                                    <div 
                                        onClick={() => {
                                            setActiveDetailsDrawer('avatar');
                                        }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Avatares Psicológicos:</strong> <span className="text-zinc-300">Tu comprador ideal totalmente perfilado con sus dolores y motivaciones de compra.</span>
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <div
                                                className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans"
                                            >
                                                Ver Detalles
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resource 2 */}
                                    <div 
                                        onClick={() => {
                                            setActiveDetailsDrawer('testimonials');
                                        }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Testimonios Persuasivos:</strong> <span className="text-zinc-300">Historias y transformaciones humanas que derriban dudas.</span>
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <div
                                                className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans"
                                            >
                                                Ver Detalles
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resource 3 */}
                                    <div 
                                        onClick={() => {
                                            setActiveDetailsDrawer('objections');
                                        }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Dolores y Objeciones:</strong> <span className="text-zinc-300">Los miedos de tu avatar mapeados para ser neutralizados.</span>
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <div
                                                className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans"
                                            >
                                                Ver Detalles
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resource 4 */}
                                    <div 
                                        onClick={() => {
                                            setActiveDetailsDrawer('benefits');
                                        }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Beneficios Magnéticos:</strong> <span className="text-zinc-300">La oferta irresistible redactada con gatillos psicológicos de conversión.</span>
                                            </p>
                                        </div>
                                        <div className="shrink-0">
                                            <div
                                                className="w-full sm:w-auto px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-1 shadow-sm font-sans"
                                            >
                                                Ver Detalles
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Landing Page Oficial */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>
                                
                                {/* Left Column: The Context and the Value */}
                                <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Página Web de Captura</h3>
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider select-none leading-none flex items-center gap-1">
                                                ✔ Completado y Activo
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm md:text-base text-left text-white leading-normal font-sans pt-1">
                                            ¡Tu página web oficial ya está publicada y lista para recibir visitas!<br /><br />
                                            He creado para ti una página web que no solo se ve increíble, sino que está diseñada estratégicamente para ayudarte a conseguir clientes reales. Esto es lo que hará por tu negocio:
                                        </p>
                                    </div>

                                    {/* Bullets explaining benefits */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">🎯</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Conseguir Contactos:</strong> <span className="text-white">Guarda automáticamente los datos (como el email o WhatsApp) de las personas interesadas, para que puedas escribirles and no pierdas ninguna oportunidad de venta.</span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">⚡</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Generar Confianza Inmediata:</strong> <span className="text-white">Un diseño profesional que hace que tu negocio destaque desde el primer segundo. Tus clientes sentirán que están comprando en el lugar correcto.</span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">💎</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Tecnología Inteligente (Pixel):</strong> <span className="text-white">Tu página está lista para conectar con herramientas de Facebook e Instagram, lo que te permitirá medir quién te visita y hacer que tus futuros anuncios sean mucho más efectivos.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Resource Cards & Links */}
                                <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                                    {/* Resource 1: Capture page */}
                                    <a 
                                        href={getPageUrl()} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                                                <Globe className="w-5 h-5 text-[#FF5A1F]" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm md:text-base font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors text-left">Tu Ecosistema Web</h4>
                                                <p className="text-sm md:text-base text-zinc-300 mt-1 text-left leading-normal font-sans">Ver la landing page optimizada diseñada para el enganche de tu proyecto.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <div className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1">
                                                Ir al Sitio Web
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </a>

                                    {/* Resource 2: Thank you page */}
                                    <a 
                                        href={getPageUrl() + (createdPageSubdomain ? '/gracias' : '')} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)]"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-[#FFBF00]/10 border border-[#FFBF00]/20 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                                                <CheckCircle className="w-5 h-5 text-[#FFBF00]" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm md:text-base font-extrabold text-white group-hover:text-[#FFBF00] transition-colors text-left">Página de Gracias</h4>
                                                <p className="text-sm md:text-base text-zinc-300 mt-1 text-left leading-normal font-sans">Ver la página de agradecimiento donde se deriva a tu prospecto tras registrarse.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <div className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1">
                                                Ver Gracias
                                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </a>

                                    {/* Direct Enlace URL */}
                                    <div className="bg-black/45 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 text-xs">
                                        <span className="text-xs md:text-sm uppercase font-black tracking-wider text-white">Enlace Web Directo (URL Temporal):</span>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                                            <a 
                                                href={getPageUrl()} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-[#FFBF00] font-mono font-bold hover:text-white transition-colors truncate underline block text-left flex-1"
                                            >
                                                {getPageUrl()}
                                            </a>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(getPageUrl());
                                                    setCopiedUrl(true);
                                                    setTimeout(() => setCopiedUrl(false), 2000);
                                                }}
                                                className="shrink-0 px-3 py-1.5 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/20 border border-[#FF5A1F]/30 text-white rounded-xl text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                            >
                                                {copiedUrl ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span className="text-emerald-400 font-extrabold">¡Copiado!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                                        <span>Copiar URL</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Upgrade Opportunities Info Block */}
                                    <div className="mt-2 bg-gradient-to-r from-indigo-500/10 via-[#FF5A1F]/5 to-transparent border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/30 text-[9px] font-black uppercase text-indigo-400 rounded-md tracking-wider">Plan Pro</span>
                                                <h4 className="text-xs font-black text-white uppercase tracking-wide">¿Quieres usar tu propio Dominio?</h4>
                                            </div>
                                            <p className="text-sm md:text-base text-white font-sans leading-normal">
                                                Al activar tu plan a PRO, podrás habilitar tu propio dominio personalizado de forma inmediata. Por ejemplo: <strong className="text-indigo-400">www.mipagina.com</strong> en lugar de usar nuestro subdominio largo.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setShowUpgradeModal(true)}
                                            className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-[#FF5A1F] to-[#FF7843] hover:from-[#D94A1E] hover:to-[#FF5A1F] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(255,90,31,0.2)]"
                                        >
                                            <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                                            ACTUALIZAR A PRO
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {(() => {
                                const isManicurista = selectedProject?.name?.toLowerCase().includes('manicurista') || unlockedProject?.name?.toLowerCase().includes('manicurista') || selectedProject?.name?.toLowerCase().includes('uña') || unlockedProject?.name?.toLowerCase().includes('uña');
                                const isMicroblading = selectedProject?.name?.toLowerCase().includes('microblading') || unlockedProject?.name?.toLowerCase().includes('microblading') || selectedProject?.name?.toLowerCase().includes('ceja') || unlockedProject?.name?.toLowerCase().includes('ceja');

                                const defaultHooksList = isManicurista ? [
                                    {
                                        title: "¿Sabías que dominar la técnica de uñas rusas es el camino más rápido para pasar de cobrar $10 a $50 por servicio?",
                                        psychologicalStrategy: "Conecta con el deseo de aumentar drásticamente los ingresos ofreciendo un servicio de alta especialización y precisión.",
                                        contentJson: {
                                            script: "Gana más tiempo con tu familia y aumenta tus ingresos aprendiendo el sistema definitivo de manicura rusa.\nEs la técnica más demandada en los salones premium.\n\nPodrás agendar clientes de alto valor dispuestas a pagar tarifas de lujo.\n\nEscribe MANICURA en los comentarios y ingresa al link de nuestra biografía para registrarte en la masterclass gratis de hoy.",
                                            ads: "🔥 ¿Sabías que dominar la técnica de uñas rusas es el camino más rápido para pasar de cobrar $10 a $50 por servicio?\n\nHe preparado una sesión en vivo donde te mostraré las bases paso a paso para profesionalizarte. 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["Domina Uñas Rusas 💅", "De Cobrar $10 a $50 💸", "Preparación Profesional 🧪"]
                                        }
                                    },
                                    {
                                        title: "El error secreto de las manicuristas novatas que arruina el set en 3 días y ahuyenta a las mejores clientas.",
                                        psychologicalStrategy: "Apela al temor de dar un mal servicio y perder clientes recurrentes por falta de conocimientos de adherencia.",
                                        contentJson: {
                                            script: "Evita el desprendimiento prematuro con una preparación impecable de la placa de uña.\nLa mayoría usa limas inadecuadas o productos sin nivelar.\n\nAprende a sellar perfectamente la zona de cutícula para que tus sets duren más de 4 semanas intactos.\n\nEntra en el link de nuestro perfil para unirte a la masterclass gratuita de hoy.",
                                            ads: "💅 ¿Estás cansada de que tus clientas se quejen de que sus uñas se rompen a los 3 días?\n\nTe enseño la preparación científica para evitar desprendimientos. Inscríbete a la masterclass sin costo hoy. 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["¿Uñas Rotas a los 3 Días? ⚠️", "El Error que Nadie Te Cuenta 🤫", "Preparación Profesional 🧪"]
                                        }
                                    },
                                    {
                                        title: "Cómo construir una agenda llena de clientas premium dispuestas a pagar tarifas de lujo por tus diseños avanzados.",
                                        psychologicalStrategy: "Estimula la visualización de libertad de negocio y atracción de personas que respetan y valoran las tarifas de arte.",
                                        contentJson: {
                                            script: "Deja de competir por precio publicando fotos genéricas.\nLas mejores clientas buscan atención impecable y arte personalizado sobre la uña.\n\nDescubre el método de posicionamiento en redes sociales para atraer clientas de calidad.\n\nHaz clic en el enlace del perfil para registrarte hoy.",
                                            ads: "🚀 Deja de rebajar tus precios para competir con salones masivos. Las clientas VIP pagan por arte y durabilidad.\n\nÚnete a nuestro taller gratuito donde te revelamos la ruta completa. 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["Agenda Llena VIP 📅", "Deja de Competir por Precio 💸", "Sube Tus Tarifas Hoy 🌟"]
                                        }
                                    }
                                ] : isMicroblading ? [
                                    {
                                        title: "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de microblading de cejas?",
                                        psychologicalStrategy: "Conecta con el deseo de seguridad financiera inmediata y falta de riesgo en el nicho de cejas de alto ticket.",
                                        contentJson: {
                                            script: "Aprende la técnica de microblading con el diseño hiperrealista más demandado del mercado.\nEs el servicio estético más rentable hoy en día.\n\nRecuperas tu inversión de materiales con tan solo tus primeras 2 o 3 clientas.\n\nEscribe CEJAS en los comentarios y entra al link en nuestro perfil para asegurar tu cupo gratis hoy mismo.",
                                            ads: "🔥 ¿Te gustaría generar $1.000 extras al mes sin dejar tu trabajo actual?\n\nHe preparado una Masterclass gratuita donde te revelo el mapa exacto para lograr los mejores trazos. 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["Triplica Tus Ingresos 💰", "Técnica Hiperrealista Cejas 👩‍🎤", "Recupera Inversión Rápido 📈"]
                                        }
                                    },
                                    {
                                        title: "El secreto del diseño de miradas perfectas: El error que comete el 90% de las principiantes al trazar cejas.",
                                        psychologicalStrategy: "Apela al deseo de perfección técnica y el miedo a cometer errores estéticos faciales graves irreversibles.",
                                        contentJson: {
                                            script: "Un trazo incorrecto puede desfigurar la expresión facial de tu clienta por meses.\nEl gran error es no usar el punto de anclaje correcto o presionar demasiado el inductor.\n\nDomina el visajismo simétrico antes de iniciar cualquier sesión real.\n\nÚnete a la capacitación en vivo gratis haciendo clic en nuestro enlace.",
                                            ads: "🤫 El diseño facial requiere precisión milimétrica. Conoce el error que arruina el visajismo.\n\nAccede gratis a la lección en vivo de hoy aquí 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["El Error de Trazado de Cejas ❌", "Diseño Visajista Simétrico 📐", "Trazos más Naturales ✨"]
                                        }
                                    },
                                    {
                                        title: "La estrategia exacta de las artistas de microblading top para atraer clientas de alto valor sin competir por precio.",
                                        psychologicalStrategy: "Posicionamiento de marca y confianza para cobrar montos premium por encima del promedio del mercado.",
                                        contentJson: {
                                            script: "Las profesionales exitosas no venden microblading, venden seguridad y rejuvenecimiento.\nEstablece tu autoridad con una consulta inicial especializada de alto valor percibido.\n\nDescubre el paso a paso terapéutico para conectar con tus prospectos.\n\nRegístrate ahora mismo a través del link en nuestro perfil.",
                                            ads: "💎 Deja de regalar tu trabajo como si fuera un sticker. El microblading premium cura autoestima.\n\nTe enseño los secretos de venta estéticos de élite. Haz clic para unirte gratis. 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["Clientes que pagan de verdad 💳", "Vende Autoestima, no Cejas 💖", "Secretos de Venta de Élite Directa 🚀"]
                                        }
                                    }
                                ] : [
                                    {
                                        title: "¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de belleza de alta demanda?",
                                        psychologicalStrategy: "Estimula el interés sobre el nicho de belleza enseñando rentabilidad y escalabilidad de servicios únicos.",
                                        contentJson: {
                                            script: "El campo estético es el más resistente a las crisis globales.\nDomina una destreza puntual y cobra tres veces más por cada hora de servicio.\n\nToma el control de tu agenda y de tu facturación mensual de inmediato.\n\nEscribe BELLEZA e ingresa al link del perfil para apartar tu lugar en la sesión en vivo.",
                                            ads: "💅 ¿Y si la clave para triplicar tus ingresos mensuales estuviera en dominar una sola técnica de belleza de alta demanda?\n\nTe daremos el mapa exacto de negocio en la clase gratuita de hoy. 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["Triplica tus Ingresos 💸", "Belleza de Alta Demanda 🌟", "Controla Tu Tiempo Mañana ⏰"]
                                        }
                                    },
                                    {
                                        title: "El gran mito de la belleza revelado: Por qué las fórmulas tradicionales ya no funcionan y cómo solucionarlo hoy.",
                                        psychologicalStrategy: "Destruye falsas creencias tradicionales instalando la necesidad de adquirir metodologías modernas aceleradas.",
                                        contentJson: {
                                            script: "No necesitas años de estudios teóricos para dar excelentes resultados.\nLas técnicas modernas buscan personalización y biomasa amigable.\n\nRegístrate gratis a la sesión práctica haciendo clic en nuestro perfil.",
                                            ads: "🤫 Las escuelas tradicionales te ocultan que las técnicas modernas redujeron los tiempos de aprendizaje al 20%.\n\nDescubre cómo adaptarte al mercado digital ahora mismo aquí 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["El Mito del Aprendizaje Lento ❌", "Fórmulas Únicas Modernas ✨", "Resultados en Tiempo Récord ⚡"]
                                        }
                                    },
                                    {
                                        title: "La fórmula exacta que usan los líderes y salones de alta gama para cobrar 5 veces más sin perder un solo cliente.",
                                        psychologicalStrategy: "Apela a la exclusividad, estatus y escalamiento de margen con clientes que pagan de verdad.",
                                        contentJson: {
                                            script: "Los salones de lujo fijan la tarifa según la experiencia, no la hora.\nEstablece protocolos de atención únicos que fidelicen al cliente desde el saludo.\n\nConoce este sistema gratis ingresando al enlace de nuestro perfil hoy.",
                                            ads: "🚀 ¿Cómo cobran los salones más caros del mundo?\n\nNo es el material, es la experiencia presencial guiada por protocolo. Te lo enseñamos paso a paso. 👇\n\n🔗 [LINK DE TU LANDING]",
                                            thumbs: ["Cobra 5 Veces Más 💰", "Secretos de Salones Premium 💎", "Fidelización de Clientes VIP 👑"]
                                        }
                                    }
                                ];

                                const displayHooks = unlockedHooks.length > 0 ? unlockedHooks : (strategyData?.modules?.hooks || []);
                                const hooksToRender = displayHooks.length >= 3 ? displayHooks.slice(0, 3) : defaultHooksList;

                                return (
                                    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full" id="hooks-of-attraction-card">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>
                                        
                                        {/* Left Column: The Context and the Value */}
                                        <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                                                    <div>
                                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">Video Hooks de Atracción</h3>
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider select-none leading-none">
                                                        Completado y Activo
                                                    </span>
                                                </div>
                                                
                                                <p className="text-sm md:text-base text-left text-white leading-[1.75rem] font-bold font-sans">
                                                    ¡Tus videos de atracción y ganchos persuasivos están listos!
                                                </p>
                                                
                                                <p className="text-sm md:text-base text-left text-zinc-300 leading-[1.75rem] font-sans">
                                                    He diseñado para ti guiones de video de alto impacto, creados estratégicamente para retener la atención desde el primer segundo. Esto es lo que hará por tu negocio:
                                                </p>
                                            </div>

                                            {/* Bullets explaining benefits */}
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-start gap-2.5">
                                                    <span className="text-sm md:text-base mt-1 shrink-0">🎯</span>
                                                    <p className="text-sm md:text-base text-left text-zinc-300 leading-[1.75rem] font-sans">
                                                        <strong className="font-extrabold text-white">Ganchos de curiosidad:</strong> Captura la atención de tu cliente ideal en los primeros 3 segundos en Instagram, TikTok o YouTube para que no deslicen el video.
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-2.5">
                                                    <span className="text-sm md:text-base mt-1 shrink-0">⚡</span>
                                                    <p className="text-sm md:text-base text-left text-zinc-300 leading-[1.75rem] font-sans">
                                                        <strong className="font-extrabold text-white">Llamadas a la acción (CTA):</strong> Guía a los espectadores de forma natural para que visiten tu página web o te escriban por WhatsApp para comprar.
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-2.5">
                                                    <span className="text-sm md:text-base mt-1 shrink-0">💎</span>
                                                    <p className="text-sm md:text-base text-left text-zinc-300 leading-[1.75rem] font-sans">
                                                        <strong className="font-extrabold text-white">Estructura Viral Probada:</strong> Guiones secuenciados con gatillos mentales que aumentan la retención, mejoran el alcance orgánico y multiplican los comentarios.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Resource Cards & Links */}
                                        <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                                            <div className="grid grid-cols-1 gap-3 w-full" id="hooks-three-cards-grid">
                                                {hooksToRender.slice(0, 3).map((hook: any, hIdx: number) => {
                                                    const hookTitleStr = hook.title || hook.hookText || hook.text || hook.question || `Video Hook #${hIdx + 1}`;
                                                    return (
                                                        <div 
                                                            key={hIdx}
                                                            className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)] text-left animate-fade-in"
                                                        >
                                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                                {/* Clean White Desk Calendar Sheet */}
                                                                <div className="w-12 h-12 rounded-xl bg-white border border-white/10 flex flex-col overflow-hidden shrink-0 mt-1 shadow-md">
                                                                    {/* Calendar Top binder/header bar in orange */}
                                                                    <div className="bg-[#FF5A1F] text-[8px] font-black text-center text-white py-0.5 uppercase tracking-wider font-sans leading-none select-none">
                                                                        Día
                                                                    </div>
                                                                    {/* Calendar Day number */}
                                                                    <div className="flex-1 flex items-center justify-center bg-white text-zinc-950 font-black text-base leading-none font-sans select-none">
                                                                        {hIdx + 1}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-base md:text-lg font-normal text-white group-hover:text-[#FF5A1F] transition-colors text-left font-sans line-clamp-3 leading-relaxed mt-0.5">
                                                                        {hookTitleStr}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <div className="shrink-0 font-sans">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedHookForDrawer(hook);
                                                                        setActiveDetailsDrawer('hooks');
                                                                    }}
                                                                    className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 font-sans active:scale-95"
                                                                >
                                                                    Ver detalles
                                                                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Plan Pro Block: 27 Pending Hooks */}
                                            <div className="bg-[#14141a] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left w-full mt-2 animate-fade-in">
                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/30 text-[9px] font-black uppercase text-indigo-400 rounded-md tracking-wider">Plan Pro</span>
                                                        <h4 className="text-xs font-black text-white uppercase tracking-wide">¿Quieres desbloquear los 27 Hooks restantes?</h4>
                                                    </div>
                                                    <p className="text-sm md:text-base text-zinc-300 font-sans leading-normal">
                                                        Al activar tu plan a <strong className="text-[#FF5A1F]">PRO</strong>, liberarás de inmediato los 27 ganchos y guiones persuasivos pendientes para seguir publicando contenido de alta retención diaria en tus redes.
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => setShowUpgradeModal(true)}
                                                    className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-[#FF5A1F] to-[#FF7843] hover:from-[#D94A1E] hover:to-[#FF5A1F] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(255,90,31,0.2)] active:scale-95"
                                                >
                                                    <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                                                    ACTUALIZAR A PRO
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Card 4: Artículos de Blog */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FFBF00]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBF00]/5 blur-3xl rounded-full"></div>
                                
                                {/* Left Column: The Context and the Value */}
                                <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-[#FFBF00] tracking-widest block leading-none">SEO & Tráfico</span>
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">Artículos de Blog</h3>
                                            </div>
                                            <span className="px-3 py-1 bg-[#FFBF00]/10 border border-[#FFBF00]/25 rounded-full text-[10px] font-black text-[#FFBF00] uppercase tracking-wider select-none leading-none flex items-center gap-1">
                                                <span>👑</span>
                                                <span>ACTUALIZA A PRO</span>
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm md:text-base text-left text-zinc-400 opacity-45 leading-normal font-sans pt-1">
                                            Estructuras completas de artículos redactados para aportar un valor enorme. Diseñados para educar a tu audiencia, posicionar tus palabras clave en Google y dirigir tráfico cualificado de forma orgánica.
                                        </p>
                                    </div>

                                    {/* Bullets explaining benefits */}
                                    <div className="space-y-3 pt-2 opacity-45">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">🔍</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Intención de Búsqueda:</strong> <span className="text-white">Contenido optimizado para intenciones de búsqueda informativas. (👑 PRO)</span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">📈</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Estructura SEO:</strong> <span className="text-white">Estructuras H1, H2, H3 y llamadas a la acción integradas. (👑 PRO)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Resource Cards & Links */}
                                <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                                    <div 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
                                    >
                                        {/* Blurred Contents */}
                                        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a]/60 border border-white/5 rounded-2xl gap-4 select-none pointer-events-none filter blur-[3px] opacity-25">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-10 h-10 rounded-xl bg-[#FFBF00]/10 border border-[#FFBF00]/20 flex items-center justify-center text-[#FFBF00] shrink-0 mt-0.5">
                                                    <FileText className="w-5 h-5 text-[#FFBF00]" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm md:text-base font-extrabold text-white font-sans text-left">Estructuras de Blog SEO</h4>
                                                    <p className="text-xs md:text-sm text-zinc-400 mt-1 text-left leading-normal font-sans">Contenido optimizado para posicionar palabras clave y atraer visitas orgánicas.</p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 font-sans">
                                                <div className="px-4 py-2 bg-transparent border border-white/10 text-white text-[11px] font-extrabold uppercase rounded-xl">
                                                    Ver Estructura
                                                </div>
                                            </div>
                                        </div>

                                        {/* Glassmorphism Blur overlay with invasive gold/orange button */}
                                        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center p-4">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowUpgradeModal(true);
                                                }}
                                                className="px-5 py-3.5 bg-gradient-to-r from-[#FF5A1F] to-[#FF7843] hover:from-[#D94A1E] hover:to-[#FF5A1F] text-white rounded-xl text-[11px] md:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_25px_rgba(255,90,31,0.35)] hover:shadow-[0_4px_30px_rgba(255,90,31,0.5)] border border-white/10"
                                            >
                                                <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                                                ATRAER TRÁFICO ORGÁNICO (PRO)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Nutrición a través de Email Marketing */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
                                
                                {/* Left Column: The Context and the Value */}
                                <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block leading-none">Automatización</span>
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">Nutrición de Email Marketing</h3>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/25 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-wider select-none leading-none">
                                                👑 ACTUALIZA A PRO
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm md:text-base text-left text-white leading-normal font-sans pt-1">
                                            Secuencias inteligentes de e-mail automatizadas para dar la bienvenida a prospectos, aportar valor educativo estratégico, asentar tu autoridad y recuperar carritos abandonados.
                                        </p>
                                    </div>

                                    {/* Bullets explaining benefits */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">📧</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Tasa de Conversión:</strong> <span className="text-white">Estilos persuasivos orientados a una alta tasa de entregabilidad y apertura. (👑 ACTUALIZA A PRO)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Resource Cards & Links */}
                                <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)] text-left"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                                                <Mail className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm md:text-base font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors text-left font-sans">Nutrición de Email Marketing</h4>
                                                <p className="text-sm md:text-base text-zinc-300 mt-1 text-left leading-normal font-sans">Campañas automatizadas y ganchos de seguimiento por correo.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0 font-sans">
                                            <div className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1">
                                                <Lock className="w-3.5 h-3.5 text-white shrink-0 mr-1" />
                                                Desbloquear
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Card 6: Secuencia de Lanzamientos vía WhatsApp */}
                            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-stretch hover:border-[#FF5A1F]/30 transition-all text-left relative overflow-hidden gap-8 lg:gap-11 w-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full"></div>
                                
                                {/* Left Column: The Context and the Value */}
                                <div className="space-y-6 relative z-10 w-full lg:w-5/12 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-rose-400 tracking-widest block leading-none">Conversión Explosiva</span>
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">Secuencia de Lanzamientos WhatsApp</h3>
                                            </div>
                                            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/25 rounded-full text-[10px] font-black text-rose-400 uppercase tracking-wider select-none leading-none">
                                                👑 ACTUALIZA A PRO
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm md:text-base text-left text-white leading-normal font-sans pt-1">
                                            El canal más rentable para cerrar ventas directas. Guiones minuciosamente orquestados para crear grupos de WhatsApp de alta expectación, calentar leads con disparadores mentales y abrir ventas.
                                        </p>
                                    </div>

                                    {/* Bullets explaining benefits */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-start gap-2.5">
                                            <span className="text-sm md:text-base mt-0.5">💬</span>
                                            <p className="text-sm md:text-base text-left text-white leading-normal font-sans">
                                                <strong className="font-extrabold text-white font-sans">Secuencia de 7 días:</strong> <span className="text-white">Secuencia estratégica de Anticipación, Nutrición, Venta y Cierre. (👑 ACTUALIZA A PRO)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Resource Cards & Links */}
                                <div className="relative z-10 w-full lg:w-7/12 flex flex-col gap-3 justify-center animate-fade-in">
                                    <button 
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#14141a] hover:bg-[#181822] border border-white/5 hover:border-[#FF5A1F]/30 rounded-2xl gap-4 transition-all duration-300 group cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_20px_rgba(255,90,31,0.08)] text-left"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                                                <MessageSquare className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm md:text-base font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors text-left font-sans">Secuencia de Lanzamientos WhatsApp</h4>
                                                <p className="text-sm md:text-base text-zinc-300 mt-1 text-left leading-normal font-sans">Guiones directos para calentar prospectos y disparar tus ventas en canales de chat.</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0 font-sans">
                                            <div className="px-4 py-2 bg-transparent border border-[#FF5A1F]/40 group-hover:border-[#FF5A1F] text-white group-hover:text-[#FF5A1F] text-[11px] font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1">
                                                <Lock className="w-3.5 h-3.5 text-white shrink-0 mr-1" />
                                                Desbloquear
                                            </div>
                                        </div>
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

            {/* Sliding Drawer Side Panel */}
            <AnimatePresence>
                {activeDetailsDrawer && (
                    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setActiveDetailsDrawer(null)}
                            className="absolute inset-0 bg-black cursor-pointer"
                        />

                        {/* Slide-over panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="relative w-full max-w-2xl h-full bg-[#111116] border-l border-white/5 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col z-10 overflow-hidden text-left"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#14141c]/80 backdrop-blur-md">
                                <div className="text-left">
                                    <span className="text-xs font-black uppercase text-[#FF5A1F] tracking-widest block mb-1">
                                        {activeDetailsDrawer === 'avatar' && "Conectar con tu cliente ideal"}
                                        {activeDetailsDrawer === 'testimonials' && "Derribar objeciones automáticamente"}
                                        {activeDetailsDrawer === 'objections' && "Neutralizar dolores y objeciones"}
                                        {activeDetailsDrawer === 'benefits' && "Crear una oferta magnética"}
                                        {activeDetailsDrawer === 'hooks' && "Guion Persuasivo de Video"}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                                        {activeDetailsDrawer === 'avatar' && "Avatares Psicológicos"}
                                        {activeDetailsDrawer === 'testimonials' && "Testimonios Persuasivos"}
                                        {activeDetailsDrawer === 'objections' && "Dolores y Objeciones"}
                                        {activeDetailsDrawer === 'benefits' && "Beneficios Magnéticos"}
                                        {activeDetailsDrawer === 'hooks' && "Detalles del Hook de Atracción"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setActiveDetailsDrawer(null)}
                                    className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drawer Content Area with independent scroll */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                                {activeDetailsDrawer === 'avatar' && (() => {
                                    const rawAvatars = strategyData?.avatars || [];
                                    const defaultAvs = [
                                        {
                                            name: "Laura Torres",
                                            archetype: "Buscadora de Ingresos Rápidos",
                                            quote: "Deseo emprender seguro pero temo perder mi dinero o fracasar en el intento.",
                                            pain: "Miedo a gastar dinero en cursos sin saber si podré recuperar la inversión de materiales.",
                                            desire: "Aprender una técnica pulida para dar servicios premium desde la primera semana."
                                        },
                                        {
                                            name: "Mónica Silva",
                                            archetype: "Esteticista Tradicional Estancada",
                                            quote: "Siento que el mercado local está saturado y mis tarifas son cada vez más bajas.",
                                            pain: "Frustración por trabajar largas horas ofreciendo manicura o depilación básica de baja rentabilidad.",
                                            desire: "Migrar a servicios de Micropigmentación de cejas de alto valor para triplicar su ticket base."
                                        }
                                    ];
                                    const avsToRender = rawAvatars.length > 0 ? rawAvatars : defaultAvs;
                                    return (
                                        <div className="space-y-8 text-left">
                                            <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                                                Estos son los arquetipos de cliente ideales generados de forma analítica para tu proyecto. Representan el 80% de tus ventas potenciales sugeridas.
                                            </p>
                                            {avsToRender.map((av: any, idx: number) => (
                                                <div key={idx} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden space-y-5">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.02] blur-3xl rounded-full"></div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl font-bold text-orange-400 shrink-0">
                                                            {idx % 3 === 0 ? '👩‍🎨' : idx % 3 === 1 ? '👩‍💼' : '👩‍👧'}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-extrabold text-white leading-tight font-sans text-left">{av.name || "Avatar Especialista"}</h4>
                                                            <p className="text-xs md:text-sm text-orange-400 font-extrabold uppercase tracking-widest mt-1 text-left">{av.archetype || "Comprador Ideal"}</p>
                                                        </div>
                                                    </div>
                                                    {av.quote && (
                                                        <p className="text-base md:text-lg italic text-[#FFBF00] bg-white/5 p-5 rounded-2xl border border-white/5 leading-relaxed text-left font-sans">
                                                            "{av.quote}"
                                                        </p>
                                                    )}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                                                        <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                                                            <p className="font-extrabold text-rose-400 uppercase tracking-widest text-xs mb-2">Dolor Crítico</p>
                                                            <p className="text-sm md:text-base text-zinc-200 leading-normal font-normal">{av.pain || "Incertidumbre financiera sobre el retorno"}</p>
                                                        </div>
                                                        <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                                            <p className="font-extrabold text-emerald-400 uppercase tracking-widest text-xs mb-2">Transformación Deseada</p>
                                                            <p className="text-sm md:text-base text-zinc-200 leading-normal font-normal">{av.desire || av.transformation_title || "Lanzar un servicio calificado y rentable"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {activeDetailsDrawer === 'testimonials' && (() => {
                                    const rawTestimonials = strategyData?.modules?.testimonials || strategyData?.testimonials || [];
                                    const defaultTestimonialsList = [
                                        {
                                            name: "Laura Torres",
                                            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
                                            msg: `¡Hola! Solo quería contarles que estoy súper feliz. Con este proyecto logré mis primeras clientes esta semana y recuperé toda la inversión del material y del curso. ¡La metodología es súper clara!`,
                                            reply: "¡Qué increíble resultado Laura! 🎉 Nos alegra muchísimo tu éxito. ¡A seguir escalando tu negocio de belleza! 🚀"
                                        },
                                        {
                                            name: "Carlos Mendoza",
                                            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                                            msg: "Nunca pensé que se pudiera aprender de manera tan fácil y práctica de forma 100% online. Las lecciones de diseño tridimensional y visagismo son oro puro.",
                                            reply: "¡Excelente Carlos! El visagismo y la simetría son la clave para que tus clientas amen su rostro. ¡Felicitaciones! 💎"
                                        },
                                        {
                                            name: "Sofía Medina",
                                            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
                                            msg: "Mis clientas están fascinadas con los resultados y las cejas les quedan súper naturales. ¡Mil gracias por el excelente soporte y paciencia!",
                                            reply: "¡Es lo que buscamos Sofía, que tus clientas vuelvan felices y te recomienden! Todo el éxito en tu zona VIP. 🚀"
                                        }
                                    ];
                                    const testimonialsToRender = rawTestimonials.length > 0 ? rawTestimonials : defaultTestimonialsList;
                                    return (
                                        <div className="space-y-8 font-sans text-left">
                                            <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                                                Testimonios optimizados para el embudo que demuestran resultados contundentes y neutralizan el escepticismo inicial del visitante.
                                            </p>
                                            {testimonialsToRender.map((t: any, idx: number) => {
                                                const textMsg = t.text || t.msg || "";
                                                const imageToUse = t.image || t.img || (idx === 0 ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" : idx === 1 ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop");
                                                return (
                                                    <div key={idx} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl relative overflow-hidden space-y-5 hover:border-white/10 transition-all text-left">
                                                        {/* User Bubble */}
                                                        <div className="flex gap-4 items-start pr-6">
                                                            <img src={imageToUse} alt={t.name} referrerPolicy="no-referrer" className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0" />
                                                            <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none p-5 text-left">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-extrabold text-[#FFBF00] text-sm uppercase tracking-wide">{t.name}</span>
                                                                    <span className="text-xs text-zinc-400 font-semibold">Alumno verificado</span>
                                                                </div>
                                                                <p className="text-sm md:text-base leading-relaxed text-zinc-100 font-normal">{textMsg}</p>
                                                            </div>
                                                        </div>

                                                        {/* Admin Reply */}
                                                        <div className="flex gap-4 items-start justify-end pl-6">
                                                            <div className="flex-1 bg-[#FF5A1F]/5 border border-[#FF5A1F]/10 rounded-2xl rounded-tr-none p-5 text-left">
                                                                <div className="flex justify-between items-center mb-2 flex-row-reverse">
                                                                    <span className="font-extrabold text-[#FF5A1F] text-sm uppercase tracking-wide">Instructor (Tú)</span>
                                                                    <span className="text-xs text-[#FF5A1F]/75 font-semibold">Expert Coach</span>
                                                                </div>
                                                                <p className="text-sm md:text-base leading-relaxed text-zinc-100 font-normal">{t.reply || "¡Espectacular! Sigue aplicando cada paso. ¡Vamos por más!"}</p>
                                                            </div>
                                                            <div className="w-11 h-11 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-orange-400 shrink-0 mt-0.5 text-lg">
                                                                🎓
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}

                                {activeDetailsDrawer === 'objections' && (() => {
                                    const rawPains = strategyData?.psychology?.pains || [];
                                    const testPains = rawPains.slice(0, 3).map((p: any) => typeof p === 'object' ? (p.text || p.title || p.description) : String(p));
                                    const defaultPainsList = [
                                        "Miedo al fracaso y a no poder aprender la destreza de manera 100% online.",
                                        "Incertidumbre sobre qué materiales iniciales adquirir sin desperdiciar presupuesto.",
                                        "Pensar que se requiere un talento innato o virtuosismo artístico para diseñar cejas simétricas."
                                    ];
                                    const painsToRenderList = testPains.length > 0 ? testPains : defaultPainsList;

                                    const rawBarriers = strategyData?.avatars?.map((a: any) => ({
                                        name: a.name || "Avatar",
                                        pain: a.pain,
                                        objection: a.objection || "¿Esto me sirve si no tengo conocimientos previos?"
                                    })) || [];
                                    const defaultBarriersList = [
                                        { name: "Perfil de Ingreso Rápido", objection: "No dispongo de suficiente tiempo libre para estudiar largas horas al día." },
                                        { name: "Perfil de Esteticista Principiante", objection: "Me da miedo dañar el rostro de una clienta o cometer un error irreparable." }
                                    ];
                                    const barriersToRenderList = rawBarriers.length > 0 ? rawBarriers : defaultBarriersList;

                                    return (
                                        <div className="space-y-8 font-sans text-left">
                                            <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                                                Dolores y objeciones frecuentes que frenan la compra de tus prospectos, mapeados detalladamente junto a contraargumentos lógicos.
                                            </p>
                                            
                                            <div>
                                                <h4 className="text-sm font-extrabold text-white/70 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-left">
                                                    <AlertTriangle className="w-5 h-5 text-rose-500" /> Dolores Críticos Mapeados
                                                </h4>
                                                <div className="space-y-4">
                                                    {painsToRenderList.map((p: string, i: number) => (
                                                        <div key={i} className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex gap-4 items-start text-left">
                                                            <div className="w-6 h-6 rounded bg-rose-500/10 text-rose-400 font-mono text-xs flex items-center justify-center font-extrabold shrink-0 mt-0.5">
                                                                {i + 1}
                                                            </div>
                                                            <p className="text-sm md:text-base text-zinc-100 font-normal leading-relaxed">{p}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-white/5 text-left">
                                                <h4 className="text-sm font-extrabold text-white/70 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                    <Lock className="w-5 h-5 text-yellow-500" /> Objeciones y Barreras del Comprador
                                                </h4>
                                                <div className="space-y-5">
                                                    {barriersToRenderList.map((b: any, i: number) => (
                                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 text-left">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm md:text-base font-extrabold text-[#FFBF00] uppercase tracking-wider">{b.name}</span>
                                                                <span className="px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black uppercase text-yellow-500 rounded tracking-widest leading-none">Barrera</span>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="text-base text-zinc-100 font-normal pl-3 border-l-2 border-yellow-500/30 py-0.5 leading-relaxed">
                                                                    <strong className="text-zinc-400 font-extrabold block text-xs uppercase tracking-wider mb-1">Objeción mental:</strong> "{b.objection}"
                                                                </div>
                                                                <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
                                                                    <span className="text-emerald-400 text-lg mt-0.5">🛡️</span>
                                                                    <p className="text-sm md:text-base text-zinc-350 leading-relaxed font-normal">
                                                                        <strong className="text-emerald-400 font-black block uppercase tracking-wider text-[10px] mb-1">Como lo neutralizamos:</strong> Al automatizar tu estrategia de ventas, derribamos esta objeción explicando que las clases duran poco, son totalmente prácticas y se enfocan en la absoluta simplicidad paso a paso estructurada.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {activeDetailsDrawer === 'benefits' && (() => {
                                    const rawBenefits = strategyData?.modules?.web?.landingPageTabs?.benefits?.items || strategyData?.benefits || [];
                                    const defaultBenefitsList = [
                                        { title: "Metodología Visual Paso a Paso", description: "Lecciones paso a paso en ultra-alta definición para dominar la simetría facial y el diseño perfecto sin esfuerzo inicial." },
                                        { title: "Kit de Arranque Optimizado", description: "Guía de abastecimiento de insumos para importar tus tinteros, teboris y plantillas de práctica a los mejores costos locales." },
                                        { title: "Mentoría Semanal Exclusiva", description: "Acceso a un canal privado de mentoría constante para revisar plantillas reales, resolver dudas y certificar tus trazos." }
                                    ];
                                    const benefitsToRenderList = (rawBenefits.length > 0 ? rawBenefits : defaultBenefitsList).map((b: any) => ({
                                        title: b.title || b.name || "Beneficio Destacado",
                                        description: b.description || b.desc || "Beneficio estructurado para detonar urgencia y persuasión de compra en la página web oficial."
                                    }));
                                    return (
                                        <div className="space-y-8 font-sans text-left">
                                            <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                                                La oferta irresistible se crea empaquetando diversos entregables lógicos en ventajas magnéticas para disparar tu tasa de conversión.
                                            </p>

                                            <div className="p-6 bg-gradient-to-r from-emerald-500/5 to-[#FF5A1F]/5 border border-white/5 rounded-3xl mb-4 text-left">
                                                <div className="flex gap-3 items-center mb-3">
                                                    <span className="text-xl">✨</span>
                                                    <h4 className="text-base md:text-lg font-black text-white tracking-tight">Estructuración de Oferta Compuesta</h4>
                                                </div>
                                                <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
                                                    Al combinar estos incentivos lógicos, tus prospectos percibirán un valor enorme en comparación con el precio real del producto, reduciendo la fricción al mínimo.
                                                </p>
                                            </div>

                                            <div className="space-y-5 text-left">
                                                {benefitsToRenderList.map((b: any, i: number) => (
                                                    <div key={i} className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl hover:border-emerald-500/20 transition-all duration-300 text-left">
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 text-sm font-black">
                                                                ✓
                                                            </div>
                                                            <h5 className="text-base md:text-lg font-extrabold text-white uppercase tracking-wider">{b.title}</h5>
                                                        </div>
                                                        <p className="text-sm md:text-base text-zinc-300 pl-12 leading-relaxed font-normal">{b.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {activeDetailsDrawer === 'hooks' && selectedHookForDrawer && (() => {
                                    const hook = selectedHookForDrawer;
                                    const hTitle = hook.title || hook.hookText || hook.text || hook.question || "Video Hook";
                                    const hStrategy = hook.psychologicalStrategy || hook.strategy || "Estrategia de persuasión enfocada en enganchar al avatar en los primeros 3 segundos.";
                                    const cJson = hook.contentJson || {};
                                    const scriptText = cJson.script || "";
                                    const adsText = cJson.ads || "";
                                    const thumbsList = cJson.thumbs || [];

                                    return (
                                        <div className="space-y-8 font-sans text-left">
                                            <p className="text-white text-base md:text-lg font-normal leading-relaxed tracking-wide">
                                                Este es uno de tus guiones optimizados psicológicamente. Úsalo para captar la atención inmediata en tus contenidos orgánicos y anuncios de tráfico pago.
                                            </p>

                                            {/* Section 1: El Gancho (The Hook Quote) */}
                                            <div className="p-6 bg-gradient-to-r from-[#FF5A1F]/10 via-[#FF5A1F]/5 to-transparent border border-[#FF5A1F]/20 rounded-3xl relative overflow-hidden space-y-3">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/5 blur-3xl rounded-full"></div>
                                                <span className="text-[10px] font-black uppercase text-[#FF5A1F] tracking-widest block">Frase Gancho (Primeros 3 Segundos)</span>
                                                <p className="text-lg md:text-xl font-extrabold text-white leading-relaxed font-sans">
                                                    "{hTitle}"
                                                </p>
                                            </div>

                                            {/* Section 2: Estrategia Psicológica */}
                                            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                                                <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block mb-2">Estrategia Psicológica de Fondo</span>
                                                <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                                                    {hStrategy}
                                                </p>
                                            </div>

                                            {/* Section 3: El Guión del Video (The Script) */}
                                            {scriptText && (
                                                <div className="space-y-3">
                                                    <span className="text-xs font-black uppercase text-emerald-400 tracking-widest block">Guión Completo Recomendado</span>
                                                    <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                                                        <pre className="text-sm text-zinc-205 font-sans whitespace-pre-wrap leading-relaxed">
                                                            {scriptText}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Section 4: Copia de Anuncio / Caption */}
                                            {adsText && (
                                                <div className="space-y-3">
                                                    <span className="text-xs font-black uppercase text-indigo-400 tracking-widest block">Copia del Anuncio / Descripción de Redes</span>
                                                    <div className="p-6 bg-[#0c0c10] border border-white/5 rounded-2xl relative">
                                                        <pre className="text-sm text-zinc-205 font-sans whitespace-pre-wrap leading-relaxed">
                                                            {adsText}
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Section 5: Sugerencias de Miniatura (Thumbs) */}
                                            {thumbsList && thumbsList.length > 0 && (
                                                <div className="space-y-3">
                                                    <span className="text-xs font-black uppercase text-pink-400 tracking-widest block">Textos para Portadas / Miniaturas</span>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {thumbsList.map((thumb: string, tIdx: number) => (
                                                            <div key={tIdx} className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                                                                <p className="text-xs font-extrabold text-pink-300">OPCIÓN {tIdx + 1}</p>
                                                                <p className="mt-1.5 text-xs text-white leading-normal font-sans font-medium">{thumb}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 border-t border-white/5 bg-[#14141c]/95 flex justify-between items-center relative z-10">
                                <span className="text-xs font-mono text-zinc-500">Persistencia local activa</span>
                                <button
                                    onClick={() => setActiveDetailsDrawer(null)}
                                    className="px-6 py-3 bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_15px_rgba(255,90,31,0.25)]"
                                >
                                    Cerrar Vista
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
