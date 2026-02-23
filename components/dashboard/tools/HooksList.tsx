
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { ProjectHook, User, Project } from '../../../types';
import { Zap, Loader2, Trash2, Calendar, Sparkles, Brain, Target, Briefcase, ExternalLink, AlertTriangle, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { DeletionRestrictionModal } from '../DeletionRestrictionModal';
import { ProjectStrategy_Hooks } from './ProjectStrategy/ProjectStrategy_Hooks';

interface DashboardContext {
  user: User;
  hookCount: number;
}

export const HooksList: React.FC = () => {
    const navigate = useNavigate();
    const { user, hookCount } = useOutletContext() as DashboardContext;
    const [hooks, setHooks] = useState<ProjectHook[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Estados para el Wizard de Nuevo Hook ---
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(0);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [activeHookIdx, setActiveHookIdx] = useState(0);
    // --------------------------------------------

    // --- Nuevo Estado para Restricción de Eliminación ---
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [hookToRestrict, setHookToRestrict] = useState<ProjectHook | null>(null);
    // ----------------------------------------------------

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [hooksData, projectsData] = await Promise.all([
                api.getUserResources('hooks'),
                api.getProjects()
            ]);
            setHooks(hooksData);
            setUserProjects(projectsData || []);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSelect = (projectId: string) => {
        setSelectedProjectId(projectId);
        setWizardStep(1);
    };

    const handleOpenWizard = () => {
        setSelectedProjectId(null);
        setWizardStep(0);
        setIsWizardOpen(true);
    };

    const handleDelete = async (hook: ProjectHook, e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Si el usuario no tiene el rol admin, se interceptará la acción
        if (user.role !== 'admin') {
            setHookToRestrict(hook);
            setShowRestrictionModal(true);
            return;
        }

        if (confirm(`¿Estás seguro de eliminar el gancho "${hook.title}"?`)) {
            try {
                await api.deleteProjectHook(hook.id);
                setHooks(hooks.filter(h => h.id !== hook.id));
            } catch (error) {
                alert("Error al eliminar el gancho");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-orange-500" />
                <p>Cargando tus ganchos magnéticos...</p>
            </div>
        );
    }

    const maxHooks = user.planLimits?.maxHooks || 10;
    const usagePercent = Math.min(100, (hookCount / maxHooks) * 100);

    let progressColor = "bg-orange-500";
    if (usagePercent > 80) progressColor = "bg-red-500";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-20">
            
            {/* HERO HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-orange-950/20 to-black border border-gray-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-900/30 border border-orange-800 text-xs font-bold text-orange-300 uppercase tracking-wider mb-3 shadow-sm">
                                <Zap className="w-3 h-3 text-orange-400" /> Atracción & Copywriting
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                Ganchos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Magnéticos</span>
                            </h1>
                            <p className="text-white pt-[0.8em] pb-[0.6em] text-[1.2rem] max-w-xl leading-relaxed">
                                Los Hooks son el primer impacto de tu estrategia. Aquí puedes gestionar todos los ganchos generados para tus diferentes proyectos y optimizar tu comunicación.
                            </p>
                        </div>
                        
                        {/* Plan Usage Bar */}
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Ganchos Desbloqueados</span>
                                <span className="text-white font-bold">{hookCount} / {maxHooks}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 shrink-0 w-full md:w-[400px]">
                        <div 
                            className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                        >
                            <iframe 
                                className="w-full h-full rounded-2xl"
                                src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <button 
                            onClick={handleOpenWizard}
                            className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm group"
                        >
                            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                            Añadir Hook Magnetico
                        </button>
                    </div>
                </div>
            </div>

            {isWizardOpen ? (
                <div className="mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative transition-all duration-500 max-w-5xl animate-in fade-in duration-500">
                    <div className="bg-orange-600/10 p-8 text-center border-b border-orange-500/10 relative">
                        <button onClick={() => wizardStep === 0 ? setIsWizardOpen(false) : setWizardStep(0)} className="absolute top-6 left-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => setIsWizardOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                            <Zap className="w-8 h-8 text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Generador de Hooks Magnéticos</h2>
                        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${wizardStep === 0 ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-500'}`}>0. Proyecto</span>
                            <div className="w-4 h-px bg-gray-700"></div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${wizardStep === 1 ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-500'}`}>1. Ganchos</span>
                        </div>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto relative">
                        {wizardStep === 0 ? (
                            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center py-10">
                                <div className="max-w-2xl mx-auto">
                                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Selecciona tu Proyecto</span>
                                    </h2>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium">Nuestra inteligencia artificial necesita conocer tu estrategia y avatar para generar los mejores ganchos.</p>
                                </div>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                                    {userProjects.map((project) => (
                                        <div 
                                            key={project.id} 
                                            className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full cursor-pointer" 
                                            onClick={() => handleProjectSelect(project.id)}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex items-center gap-5 mb-8">
                                                <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors shadow-inner">
                                                    <Briefcase className="w-8 h-8" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-black text-2xl group-hover:text-orange-500 transition-colors truncate">{project.name}</h4>
                                                    <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 mb-10">
                                                <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p>
                                                <p className="text-gray-400 text-lg leading-relaxed font-medium">{project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción.")}</p>
                                            </div>
                                            <button className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95">
                                                Seleccionar <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-4 duration-500">
                                <ProjectStrategy_Hooks 
                                    overrideProjectId={selectedProjectId!}
                                    strategyData={null}
                                    activeHook={activeHookIdx}
                                    setActiveHook={setActiveHookIdx}
                                    handleTooltipHover={() => {}}
                                    handleTooltipLeave={() => {}}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* SECCIÓN: MIS GANCHOS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-4 border-l-4 border-orange-500 pl-4 py-1 pb-5">
                        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                            <Target className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Mis Ganchos</h2>
                            <p className="text-white font-medium pt-2.5 text-[1.2em]">Biblioteca centralizada de ángulos de venta</p>
                        </div>
                    </div>
                </div>
                
                {hooks.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-700">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-700">
                            <Zap className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No tienes ganchos aún</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">Ve a tus proyectos y desbloquea ganchos desde la sección de estrategia.</p>
                        <button 
                            onClick={() => navigate('/dashboard/projects')}
                            className="text-orange-400 border border-orange-500/50 hover:bg-orange-600 hover:text-white px-6 py-2.5 rounded-lg transition font-medium"
                        >
                            Ir a Mis Proyectos
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <button 
                            onClick={handleOpenWizard}
                            className="bg-gray-900 border-2 border-dashed border-white/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 group hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-500 min-h-[400px]"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <Zap className="w-10 h-10" />
                            </div>
                            <div className="text-center">
                                <h4 className="font-bold transition-colors" style={{ color: 'white', fontSize: '2em' }}>Crear Nuevo Gancho</h4>
                                <p className="mt-2 font-medium" style={{ color: 'gray', paddingTop: '1em', fontSize: '1.2em' }}>Genera ángulos de alto impacto</p>
                            </div>
                        </button>
                        {hooks.map((hook) => (
                            <div 
                                key={hook.id} 
                                onClick={() => navigate(`/dashboard/projects/${(hook as any).project_id || hook.projectId}/strategy?section=hooks&hookId=${hook.id}`)}
                                className="bg-[#111] rounded-[2.5rem] border border-white/5 transition-all duration-300 group flex flex-col h-full relative overflow-hidden cursor-pointer shadow-2xl hover:border-orange-500/30"
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 opacity-80 ${hook.isGenerated ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-orange-400 to-amber-600'}`}></div>
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1"></div>
                                        <button 
                                            onClick={(e) => handleDelete(hook, e)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all shadow-lg text-xs font-black uppercase tracking-widest"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Borrar
                                        </button>
                                    </div>
                                    
                                    <h3 className="text-[1.3rem] leading-[1.6rem] font-black mb-1 text-center group-hover:text-orange-400 transition-colors duration-300 text-white">{hook.title}</h3>
                                    
                                    <a 
                                        href={`/dashboard/projects/${(hook as any).project_id || hook.projectId}/strategy`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-gray-400 text-[0.8rem] font-bold uppercase tracking-widest py-6 flex items-center justify-center gap-2 hover:text-orange-400 transition-colors w-full"
                                    >
                                        <Briefcase className="w-4 h-4 text-gray-500" />
                                        Proyecto: {(hook as any).project_name || (hook as any).projectName || "Sin nombre"}
                                    </a>
                                    
                                    <div className="bg-orange-500/5 rounded-2xl p-4 border border-orange-500/10 mb-6 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Brain className="w-4 h-4 text-orange-400" />
                                            <span className="text-[10px] font-black uppercase text-orange-300 tracking-widest">Estrategia Psicológica</span>
                                        </div>
                                        <p className="text-[1rem] text-gray-400 leading-relaxed italic">
                                            "{(hook as any).psychological_strategy || hook.psychologicalStrategy}"
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <button 
                                            onClick={() => navigate(`/dashboard/projects/${(hook as any).project_id || hook.projectId}/strategy?section=hooks&hookId=${hook.id}`)}
                                            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/20 transform active:scale-[0.98]"
                                        >
                                            <ExternalLink className="w-4 h-4" /> VER DETALLES DEL HOOK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            )}

            {/* MODAL RESTRICCIÓN DE ELIMINACIÓN */}
            <DeletionRestrictionModal 
                isOpen={showRestrictionModal} 
                onClose={() => setShowRestrictionModal(false)}
                itemName={hookToRestrict ? `Gancho: ${hookToRestrict.title}` : ''}
                userEmail={user.email}
                userName={user.name}
            />
        </div>
    );
};
