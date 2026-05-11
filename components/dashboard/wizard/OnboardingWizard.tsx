import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Project } from '../../../types';
import { api } from '../../../services/api';
import { generateLandingPageContent } from '../../../services/geminiService';
import { 
    WelcomeStep, 
    ProjectSelectionStep, 
    GenerationStep, 
    SuccessStep 
} from './WizardSteps';

interface OnboardingWizardProps {
    user: User;
    onComplete: () => void;
    onLogout?: () => void;
}

type WizardStep = 'welcome' | 'selection' | 'generating' | 'success';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ user, onComplete, onLogout }) => {
    const [step, setStep] = useState<WizardStep>('welcome');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [generationStatus, setGenerationStatus] = useState('Iniciando...');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            // Filtrar solo activos y tal vez limitar a los más populares o relevantes
            setProjects(masterLibrary.slice(0, 6)); 
        } catch (error) {
            console.error("Error cargando libreria maestra:", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleProjectSelection = async (project: Project) => {
        setSelectedProject(project);
        setStep('generating');
        startGeneration(project);
    };

    const startGeneration = async (project: Project) => {
        try {
            setGenerationProgress(10);
            setGenerationStatus('Desbloqueando infraestructura...');
            
            // 1. Desbloquear proyecto para el usuario
            const unlocked = await api.unlockProject(project.id, { 
                registered_via: 'wizard', 
                initial_setup: true 
            });
            
            setGenerationProgress(30);
            setGenerationStatus('Analizando nicho estratégico...');

            // 2. Obtener estrategia del proyecto (para tener los datos de la IA)
            const strategy = await api.getProjectStrategy(unlocked.id);
            if (!strategy) throw new Error("No se pudo obtener la estrategia");

            setGenerationProgress(50);
            setGenerationStatus('Escribiendo copys persuasivos...');

            // 3. Generar contenido de la landing page con todos los argumentos requeridos
            const content = await generateLandingPageContent(
                project.niche || 'Marketing Digital',
                'Ventas y Captación',
                project.targetAudience || 'Personas interesadas en emprender online',
                'Producto Digital',
                'modern-blue',
                'classic-sales',
                { 
                    type: 'whatsapp', 
                    whatsappPhone: '573000000000', 
                    whatsappMessage: 'Hola, quiero más información.' 
                },
                unlocked as any
            );
            
            setGenerationProgress(80);
            setGenerationStatus('Finalizando construcción visual...');

            // 4. Crear la página oficialmente
            const newPage = {
                name: `Mi Primera Página - ${project.name}`,
                niche: project.niche || '',
                goal: 'Captación de Leads',
                subdomain: `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${project.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.floor(Math.random() * 1000)}`,
                content: content,
                projectId: unlocked.id,
                isPublished: true,
                visits: 0,
                conversions: 0
            };

            await api.createPage(newPage as any, unlocked as any);

            setGenerationProgress(100);
            setGenerationStatus('¡Configuración Exitosa!');
            
            setTimeout(() => {
                setStep('success');
            }, 800);

        } catch (error) {
            console.error("Error en flujo de onboarding:", error);
            setGenerationStatus('Error en la configuración. Reintentando...');
            // En un caso real, podríamos dar opción de reintentar
            setTimeout(() => onComplete(), 3000);
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
                        <WelcomeStep 
                            key="welcome" 
                            userData={user} 
                            onNext={() => setStep('selection')} 
                        />
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

                    {step === 'generating' && (
                        <GenerationStep 
                            key="generating"
                            progress={generationProgress}
                            status={generationStatus}
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
                    {(['welcome', 'selection', 'generating'] as WizardStep[]).map((s, idx) => {
                        const isActive = step === s;
                        const isPast = (['welcome', 'selection', 'generating'] as WizardStep[]).indexOf(step) > idx;
                        
                        return (
                            <div key={s} className="flex items-center">
                                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'bg-[#FF5A1F] scale-150' : isPast ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                {idx < 2 && <div className={`w-10 h-[1px] mx-1 ${isPast ? 'bg-emerald-500/30' : 'bg-white/5'}`} />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
