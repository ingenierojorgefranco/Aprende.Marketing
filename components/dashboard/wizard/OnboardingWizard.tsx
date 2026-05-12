import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User, Project } from '../../../types';
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
    const [isHooksUnlocked, setIsHooksUnlocked] = useState(false);
    const [unlockedHooks, setUnlockedHooks] = useState<any[]>([]);
    
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
        setStep('generating_strategy');
        await processStrategyUnlock();
    };

    const processStrategyUnlock = async () => {
        if (!selectedProject) return;
        
        try {
            setGenerationProgress(10);
            setGenerationStatus('Habilitando acceso maestro...');
            
            // 1. Desbloquear proyecto
            const unlocked = await api.unlockProject(selectedProject.id, { 
                registered_via: 'wizard', 
                initial_setup: true 
            });
            setUnlockedProject(unlocked);
            
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
        setStep('creating_web');
        setGenerationProgress(0);
        setGenerationStatus('Fase 2: Arquitectura Web');
        
        try {
            setGenerationProgress(20);
            setGenerationStatus('Configurando servidor de captación...');
            
            // Obtener datos reales de la estrategia para la landing
            const webModule = strategyData?.modules?.web?.landingPageTabs?.[0] || {};
            const niche = selectedProject?.niche || 'Marketing Digital';
            const targetAudience = strategyData?.avatars?.[0]?.name || 'Emprendedores';

            setGenerationProgress(50);
            setGenerationStatus('Inyectando copys de alta conversión...');

            // Generar contenido pero con el contexto de la estrategia
            // Nota: Aquí pasamos los datos reales de la estrategia como base
            const content = await generateLandingPageContent(
                niche,
                'Ventas y Captación',
                targetAudience,
                selectedProject?.name || 'Producto Digital',
                'modern-blue',
                'classic-sales',
                { 
                    type: 'whatsapp', 
                    whatsappPhone: (user as any).phone || '000000000', 
                    whatsappMessage: 'Hola, quiero más información.' 
                },
                unlockedProject
            );
            
            setGenerationProgress(80);
            setGenerationStatus('Publicando en nube segura...');

            // Crear la página con los títulos de la estrategia si están disponibles
            const newPage = {
                name: `Web Oficial - ${selectedProject?.name}`,
                niche: niche,
                goal: 'Captación de Leads',
                subdomain: `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${selectedProject?.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.floor(Math.random() * 1000)}`,
                content: {
                    ...content,
                    heroTitle: webModule.heroTitle || content.heroTitle,
                    headline: webModule.headline || content.headline,
                    description: webModule.description || content.description,
                },
                projectId: unlockedProject.id,
                isPublished: true
            };

            await api.createPage(newPage as any, unlockedProject as any);

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
        setGenerationStatus('Creando videos de atracción...');
        
        const duration = 15; // 15 segundos
        let current = 0;
        
        const interval = setInterval(() => {
            current += 1;
            const progress = (current / duration) * 100;
            setGenerationProgress(Math.min(progress, 99));
        }, 1000);

        try {
            // 1. Seleccionar 3 ganchos aleatorios de la estrategia
            const allHooks = strategyData?.modules?.hooks || [];
            if (allHooks.length > 0) {
                const shuffled = [...allHooks].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);
                
                // 2. Desbloquear cada uno en el backend (Firestore)
                if (unlockedProject?.id) {
                    for (const hook of selected) {
                        try {
                            // Usamos el ID del hook de la estrategia como masterHookId
                            await api.unlockSingleHook(unlockedProject.id, hook.id || String(Math.random()));
                        } catch (err) {
                            console.warn("Error desbloqueando hook individual:", err);
                        }
                    }
                }
                
                setUnlockedHooks(selected);
            }
            
            // Esperar a que el timer visual termine si es necesario o forzarlo
            setTimeout(() => {
                clearInterval(interval);
                setGenerationProgress(100);
                setGenerationStatus('Videos Generados');
                setIsHooksUnlocked(true);
                setTimeout(() => {
                    setStep('show_hooks');
                }, 800);
            }, duration * 1000);

        } catch (error) {
            console.error("Error en proceso de ganchos:", error);
            clearInterval(interval);
            setIsHooksUnlocked(true); // Fallback
            setStep('show_hooks');
        }
    };

    return (
        <div className="w-full relative selection:bg-[#FF5A1F] selection:text-white">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-[300vh]">
                <div className="absolute top-[5%] -left-[10%] w-[60%] h-[100vh] bg-[#FF5A1F]/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[5%] -right-[10%] w-[50%] h-[100vh] bg-[#FF5A1F]/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="w-full max-w-6xl mx-auto relative z-10 px-4 md:px-6">
                <div className="flex flex-col">
                    {/* 1. BIENVENIDA */}
                    <div ref={welcomeRef} className="min-h-screen flex flex-col justify-center py-20">
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
                            <div className="flex flex-col">
                                <div ref={selectionRef} className="min-h-screen flex flex-col justify-center py-20">
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
                                        className="min-h-screen flex flex-col justify-center py-20"
                                    >
                                        <div className="text-center mb-10">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">
                                                <CheckCircle className="w-4 h-4" />
                                                Tu proyecto está listo para activarse
                                            </div>
                                            <h2 className="text-4xl font-black text-white uppercase italic">Esto es lo que vas a promocionar:</h2>
                                        </div>
                                        
                                        <UnlockProtocolStep 
                                            project={selectedProject}
                                            userData={user}
                                            onNext={handleUnlockConfirm}
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
                            </div>
                        )}

                        {/* 3. GENERANDO ESTRATEGIA */}
                        {revealedSections.includes('generating_strategy') && step === 'generating_strategy' && (
                            <div ref={strategyRef} className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <GenerationStep 
                                    progress={generationProgress} 
                                    status={generationStatus} 
                                    secondsElapsed={secondsElapsed}
                                />
                            </div>
                        )}

                        {/* 4. AVATARES */}
                        {revealedSections.includes('strategy_ready') && step === 'strategy_ready' && (
                            <div className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <StrategyReadyStep 
                                    userData={user}
                                    onNext={() => setStep('show_avatars')}
                                />
                            </div>
                        )}

                        {revealedSections.includes('show_avatars') && (
                            <div ref={avatarsRef} className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <AvatarRevealStep 
                                    userData={user}
                                    avatars={strategyData?.avatars || []}
                                    onNext={() => setStep('show_landing_prep')}
                                />
                            </div>
                        )}

                        {/* 5. LANDING PREP */}
                        {revealedSections.includes('show_landing_prep') && (
                            <div ref={landingPrepRef} className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <LandingIntroStep 
                                    userData={user}
                                    onNext={handleCreateWeb}
                                    isCreated={isLandingCreated}
                                />
                            </div>
                        )}

                        {/* 6. CREANDO WEB */}
                        {revealedSections.includes('creating_web') && step === 'creating_web' && (
                            <div ref={creationRef} className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <h1 className="text-center text-emerald-500 font-black uppercase tracking-widest mb-10">Fase 2: Arquitectura Web en Proceso</h1>
                                <GenerationStep 
                                    progress={generationProgress} 
                                    status={generationStatus} 
                                    secondsElapsed={secondsElapsed}
                                />
                            </div>
                        )}

                        {revealedSections.includes('landing_success') && step === 'landing_success' && (
                            <div className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <LandingSuccessStep 
                                    userData={user}
                                    onNext={() => setStep('show_hooks')}
                                />
                            </div>
                        )}

                        {/* 6.5 GENERANDO HOOKS (LOADING) */}
                        {step === 'generating_hooks' && (
                            <div className="min-h-screen flex flex-col justify-center py-20">
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
                            <div ref={hooksRef} className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <HooksRevealStep 
                                    userData={user}
                                    hooks={unlockedHooks.length > 0 ? unlockedHooks : (strategyData?.modules?.hooks || [])}
                                    isUnlocked={isHooksUnlocked}
                                    projectId={unlockedProject?.id}
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
                            <div ref={successRef} className="min-h-screen flex flex-col justify-center py-20 border-t border-white/5">
                                <SuccessStep onFinish={onComplete} />
                            </div>
                        )}
                    </div>
                </div>

            {/* Stepper indicator */}
            {(step !== 'success' && !isGenerating) && (
                <div className="py-10 flex items-center justify-center gap-3">
                    {(['welcome', 'selection', 'generating_strategy', 'strategy_ready', 'show_avatars', 'show_landing_prep', 'creating_web', 'landing_success', 'show_hooks', 'success'] as string[]).map((s, idx) => {
                        const steps = ['welcome', 'selection', 'generating_strategy', 'strategy_ready', 'show_avatars', 'show_landing_prep', 'creating_web', 'landing_success', 'show_hooks', 'success'];
                        const currentStepStr = step as string;
                        const isActive = (currentStepStr === s) || (currentStepStr === 'generating_hooks' && s === 'show_hooks');
                        const isPast = steps.indexOf(currentStepStr === 'generating_hooks' ? 'show_hooks' : currentStepStr) > idx;
                        
                        return (
                            <div key={idx} className="flex items-center">
                                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-[#FF5A1F] scale-150' : isPast ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                {idx < steps.length - 1 && <div className={`w-4 h-[1px] mx-1 ${isPast ? 'bg-emerald-500/30' : 'bg-white/5'}`} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
