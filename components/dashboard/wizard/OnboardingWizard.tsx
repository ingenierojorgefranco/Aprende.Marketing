import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User, Project, ColorPalette } from '../../../types';
import { api } from '../../../services/api';
import { Zap, Target, CheckCircle } from 'lucide-react';
import { generateLandingPageContent } from '../../../services/geminiService';
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

interface OnboardingWizardProps {
    user: User;
    onComplete: () => void;
    onLogout?: () => void;
    onGenerationStateChange?: (isGenerating: boolean) => void;
}

type WizardStep = 'welcome' | 'selection' | 'generating_strategy' | 'strategy_ready' | 'show_avatars' | 'show_landing_prep' | 'creating_web' | 'landing_success' | 'show_hooks' | 'generating_hooks' | 'success';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete, onLogout, onGenerationStateChange }) => {
    const [step, setStep] = useState<WizardStep>('welcome');
    const [projects, setProjects] = useState<Project[]>([]);
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
    
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [revealedSections, setRevealedSections] = useState<WizardStep[]>(['welcome']);
    
    const welcomeRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<HTMLDivElement>(null);
    const unlockRef = useRef<HTMLDivElement>(null);
    const strategyRef = useRef<HTMLDivElement>(null);
    const avatarsRef = useRef<HTMLDivElement>(null);
    const landingPrepRef = useRef<HTMLDivElement>(null);
    const creationRef = useRef<HTMLDivElement>(null);
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
        if (step === 'landing_success') scrollTo(creationRef); // Shared ref
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

        } catch (error) {
            console.error("Error en desbloqueo:", error);
            setGenerationStatus('Error. Reintentando...');
            setTimeout(() => setStep('selection'), 2000);
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

    return (
        <div className="fixed inset-0 bg-[#020202] overflow-y-auto overflow-x-hidden snap-y snap-mandatory z-[45] scroll-smooth selection:bg-[#FF5A1F] selection:text-white">
            {/* Background Decorations - Fixed to viewport to cover everything consistently */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] -left-[10%] w-[70%] h-[70%] bg-[#FF5A1F]/10 blur-[130px] rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-[-10%] -right-[10%] w-[60%] h-[60%] bg-[#FF5A1F]/5 blur-[100px] rounded-full opacity-50"></div>
            </div>

            <div className="w-full relative z-10">
                <div className="flex flex-col">
                    {/* 1. BIENVENIDA */}
                    <div ref={welcomeRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
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
                                <div ref={selectionRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
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
                                        className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden"
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
                            <div ref={strategyRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
                                <GenerationStep 
                                    progress={generationProgress} 
                                    status={generationStatus} 
                                    secondsElapsed={secondsElapsed}
                                />
                            </div>
                        )}

                        {/* 4. AVATARES */}
                        {revealedSections.includes('strategy_ready') && (
                            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
                                <StrategyReadyStep 
                                    userData={user}
                                    project={selectedProject}
                                    onNext={() => setStep('show_landing_prep')}
                                />
                            </div>
                        )}

                        {revealedSections.includes('show_avatars') && (
                            <div ref={avatarsRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
                                <AvatarRevealStep 
                                    userData={user}
                                    avatars={strategyData?.avatars || []}
                                    onNext={() => setStep('show_landing_prep')}
                                />
                            </div>
                        )}

                        {/* 5. LANDING PREP */}
                        {revealedSections.includes('show_landing_prep') && (
                            <div ref={landingPrepRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
                                <LandingIntroStep 
                                    userData={user}
                                    onNext={() => setShowCreateLandingConfirm(true)}
                                    isCreated={isLandingCreated}
                                />
                            </div>
                        )}

                        {/* 6. CREANDO WEB */}
                        {revealedSections.includes('creating_web') && step === 'creating_web' && (
                            <div ref={creationRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
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
                            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
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
                            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
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
                            <div ref={hooksRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
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
                                />
                            </div>
                        )}

                        {/* 8. ÉXITO FINAL */}
                        {revealedSections.includes('success') && (
                            <div ref={successRef} className="w-full max-w-6xl mx-auto px-4 md:px-6 h-screen min-h-screen flex flex-col justify-center snap-start snap-always relative overflow-hidden">
                                <SuccessStep onFinish={onComplete} />
                            </div>
                        )}
                    </div>
                </div>

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
