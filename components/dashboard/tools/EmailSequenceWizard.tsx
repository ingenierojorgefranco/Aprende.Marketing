import React, { useState, useEffect } from 'react';
/* */ /* Actualización: Importación de useSearchParams para soporte de Deep Linking - 25/05/2024 18:15 */
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
/* Fin de actualización - 25/05/2024 18:15 */
import { 
    Mail, Briefcase, ChevronRight, ArrowLeft, 
    Loader2, Plus
} from 'lucide-react';
import { api } from '../../../services/api';
import { Project, User, Plan } from '../../../types';
import { UpgradeModal } from '../UpgradeModal';
import { ProjectStrategy_Email } from './ProjectStrategy/ProjectStrategy_Email';

interface DashboardContext {
    user: User;
    pageCount: number;
}

export const EmailSequenceWizard: React.FC<{ onClose?: () => void, type?: 'conversion' | 'nurturing' }> = ({ onClose, type = 'conversion' }) => {
    const navigate = useNavigate();
    const { user } = useOutletContext() as DashboardContext;
    /* */ /* Actualización: Extracción de parámetros de búsqueda para navegación profunda - 25/05/2024 18:15 */
    const [searchParams] = useSearchParams();
    const urlProjectId = searchParams.get('projectId');
    const urlDay = searchParams.get('day');
    /* Fin de actualización - 25/05/2024 18:15 */

    const [step, setStep] = useState(0); // 0: Select Project, 1: Edición
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeEmailIdx, setActiveEmailIdx] = useState(0);
    const [nextPlan, setNextPlan] = useState<Plan | null>(null);

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeProjectId, setUpgradeProjectId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [projectsData, plansData] = await Promise.all([
                    api.getProjects(),
                    api.getPublicPlans().catch(() => [])
                ]);
                setProjects(projectsData);

                const currentPlanName = user.planLimits?.planName || 'starter';
                const sortedPlans = Array.isArray(plansData) ? [...plansData].sort((a, b) => a.priceMonthly - b.priceMonthly) : [];
                const currentIndex = sortedPlans.findIndex(p => p.slug === currentPlanName);
                if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) {
                    setNextPlan(sortedPlans[currentIndex + 1]);
                }
            } catch (e) {
                console.error("Error cargando dador iniciales", e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [user.planLimits]);

    /* */ /* Actualización: Efecto para disparar la selección automática de proyecto si existe en la URL - 25/05/2024 18:15 */
    useEffect(() => {
        if (urlProjectId && projects.length > 0 && !selectedProject) {
            const proj = projects.find(p => p.id === urlProjectId);
            if (proj) {
                handleProjectSelect(proj);
            }
        }
    }, [urlProjectId, urlDay, projects, selectedProject]);
    /* Fin de actualización - 25/05/2024 18:15 */

    const handleProjectSelect = async (project: Project) => {
        setLoading(true);
        try {
            const allSequences = await api.getEmailSequences();
            const existingSeq = allSequences.find(s => String(s.projectId) === String(project.id) && s.type === type);
            
            // Limit check for new sequences
            if (!existingSeq && user.role !== 'admin') {
                const planSlug = project.planSlug || 'starter';
                const limit = planSlug === 'starter' ? 1 : 5;
                const projectSeqCount = allSequences.filter(s => String(s.projectId) === String(project.id)).length;
                
                if (projectSeqCount >= limit) {
                    setUpgradeProjectId(project.id);
                    setShowUpgradeModal(true);
                    setLoading(false);
                    return;
                }
            }

            setSelectedProject(project);
            
            if (urlDay) {
                const dayIdx = parseInt(urlDay);
                if (!isNaN(dayIdx) && dayIdx >= 0 && dayIdx < 7) {
                    setActiveEmailIdx(dayIdx);
                }
            }

            setStep(1);
        } catch (e) {
            console.error("Error cargando secuencia vinculada", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading && step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FF5A1F]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Cargando tus proyectos...</p>
            </div>
        );
    }

    const containerWidth = (step >= 1 && selectedProject) ? 'max-w-[1400px]' : 'max-w-5xl';

    return (
        <div className={`${containerWidth} mx-auto bg-gray-900 rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden min-h-[600px] flex flex-col relative animate-in fade-in duration-500 transition-all`}>
            
            <div className="bg-[#FF5A1F]/10 p-8 text-center border-b border-[#FF5A1F]/10 shrink-0 relative">
                <button 
                    onClick={() => { 
                        if (onClose) {
                            onClose();
                        } else if (step === 0 || urlProjectId) {
                            navigate('/dashboard/email');
                        } else {
                            setStep(0); 
                            setSelectedProject(null); 
                        }
                    }}
                    className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                    {step === 0 ? 'Volver' : (urlProjectId ? 'Ver otra Secuencia' : 'Cambiar Proyecto')}
                </button>
                
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                    <Mail className="w-8 h-8 text-[#FF5A1F]" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Asistente de Secuencias de Email</h2>
                
                {selectedProject && (
                    <p className="text-[10px] text-[#FF5A1F] font-black uppercase tracking-[0.3em] mt-2">Proyecto: {selectedProject.name}</p>
                )}

                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 0 ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500'}`}>0. Proyecto</span>
                   <div className="w-4 h-px bg-gray-700"></div>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 1 ? 'bg-[#FF5A1F] text-white' : 'bg-gray-800 text-gray-500'}`}>1. Configuración y Edición</span>
                </div>
            </div>

            <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                {step === 0 && (
                    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">
                                    Selecciona tu Proyecto
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Para redactar correos que cierren ventas, nuestra IA necesita leer tu estrategia maestra. Selecciona un proyecto para visualizar su secuencia de 7 días.
                            </p>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                            {projects.length > 0 ? (
                                <>
                                    {/* CARD: CREAR NUEVO PROYECTO */}
                                    <div 
                                        className="p-10 bg-[#0B0B0B] border-2 border-dashed border-white/10 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-center group flex flex-col items-center justify-center shadow-2xl relative overflow-hidden h-full cursor-pointer min-h-[400px]" 
                                        onClick={() => navigate('/dashboard/projects')}
                                    >
                                        <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all shadow-lg mb-6">
                                            <Plus className="w-10 h-10" />
                                        </div>
                                        <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors uppercase tracking-tight">Crear Nuevo Proyecto</h4>
                                        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Define un nuevo nicho para generar ganchos</p>
                                    </div>

                                    {projects.map((project) => (
                                        <div 
                                            key={project.id}
                                            className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex items-center gap-5 mb-8">
                                                <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors shadow-inner">
                                                    <Briefcase className="w-8 h-8" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors">{project.name}</h4>
                                                    <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 mb-10">
                                                <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p>
                                                <p className="text-gray-400 text-lg leading-relaxed font-medium">{project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción.")}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleProjectSelect(project)}
                                                className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                            >
                                                Seleccionar <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="md:col-span-3 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[2rem] text-center">
                                    <p className="text-gray-500 mb-6">Aún no tienes proyectos creados con estrategia.</p>
                                    <button 
                                        onClick={() => navigate('/dashboard/projects/create')}
                                        className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20"
                                    >
                                        Crear mi primer proyecto
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 1 && selectedProject && (
                    <div className="animate-in slide-in-from-right-8 duration-700 h-full flex flex-col">
                        <ProjectStrategy_Email 
                            projectId={selectedProject.id}
                            activeEmail={activeEmailIdx}
                            setActiveEmail={setActiveEmailIdx}
                            hideHeader={true}
                            activeType={type}
                            onUpgrade={() => setShowUpgradeModal(true)}
                            features={user.planLimits?.features}
                            planLimits={user.planLimits}
                        />
                    </div>
                )}

            </div>
            {/* MODAL DE UPGRADE */}
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)}
                user={user}
                userId={user.id}
                currentPlan={selectedProject?.planSlug || user.planLimits?.planName || 'starter'}
                projectId={upgradeProjectId}
            />
        </div>
    );
};