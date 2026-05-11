import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { User, Project } from '../../../types';
import { api } from '../../../services/api';
import { generateLandingPageContent } from '../../../services/geminiService';
import { 
    WelcomeStep, 
    ProjectSelectionStep, 
    UnlockProtocolStep,
    GenerationStep, 
    AvatarRevealStep,
    LandingIntroStep,
    HooksRevealStep,
    SuccessStep 
} from './WizardSteps';

interface OnboardingWizardProps {
    user: User;
    onComplete: () => void;
    onLogout?: () => void;
}

type WizardStep = 'welcome' | 'selection' | 'unlock_protocol' | 'generating_strategy' | 'show_avatars' | 'show_landing_prep' | 'creating_web' | 'show_hooks' | 'success';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete, onLogout }) => {
    const [step, setStep] = useState<WizardStep>('welcome');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generationStatus, setGenerationStatus] = useState('Iniciando...');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [unlockedProject, setUnlockedProject] = useState<any>(null);
    const [strategyData, setStrategyData] = useState<any>(null);

    // Cargar proyectos recomendados al inicio o cuando sea necesario
    useEffect(() => {
        if (step === 'selection') {
            loadMasterProjects();
        }
    }, [step]);

    const loadMasterProjects = async () => {
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
        setStep('unlock_protocol');
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
                setStep('show_avatars');
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
            
            setTimeout(() => {
                setStep('show_hooks');
            }, 800);

        } catch (error) {
            console.error("Error en creación de web:", error);
            setStep('success'); // Fallback suave
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            {/* Botón de Salir (Emergencia) */}
            {onLogout && (
                <button 
                    onClick={onLogout}
                    className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                >
                    Cerrar Sesión
                </button>
            )}

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#FF5A1F]/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#FF5A1F]/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="w-full max-w-6xl relative z-10">
                <AnimatePresence mode="wait">
                    {step === 'welcome' && (
                        <WelcomeStep key="welcome" userData={user} onNext={() => setStep('selection')} />
                    )}

                    {step === 'selection' && (
                        <ProjectSelectionStep 
                            key="selection"
                            projects={projects}
                            loading={loadingProjects}
                            userData={user}
                            onNext={handleProjectSelection}
                        />
                    )}

                    {step === 'unlock_protocol' && (
                        <UnlockProtocolStep 
                            key="unlock_protocol"
                            project={selectedProject}
                            userData={user}
                            onNext={handleUnlockConfirm}
                        />
                    )}

                    {(step === 'generating_strategy' || step === 'creating_web') && (
                        <GenerationStep 
                            key="generating"
                            progress={generationProgress}
                            status={generationStatus}
                        />
                    )}

                    {step === 'show_avatars' && (
                        <AvatarRevealStep 
                            key="show_avatars"
                            avatars={strategyData?.avatars || []}
                            userData={user}
                            onNext={() => setStep('show_landing_prep')}
                        />
                    )}

                    {step === 'show_landing_prep' && (
                        <LandingIntroStep 
                            key="landing_prep"
                            userData={user}
                            onNext={handleCreateWeb}
                        />
                    )}

                    {step === 'show_hooks' && (
                        <HooksRevealStep 
                            key="show_hooks"
                            hooks={strategyData?.modules?.hooks || []}
                            userData={user}
                            onNext={() => setStep('success')}
                        />
                    )}

                    {step === 'success' && (
                        <SuccessStep 
                            key="success"
                            onFinish={onComplete}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Stepper indicator */}
            {step !== 'success' && (
                <div className="mt-12 flex items-center gap-3">
                    {(['welcome', 'selection', 'unlock_protocol', 'generating_strategy', 'show_avatars', 'show_landing_prep', 'creating_web', 'show_hooks'] as WizardStep[]).map((s, idx) => {
                        const steps = ['welcome', 'selection', 'unlock_protocol', 'generating_strategy', 'show_avatars', 'show_landing_prep', 'creating_web', 'show_hooks'];
                        const isActive = step === s;
                        const isPast = steps.indexOf(step) > idx;
                        
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
