
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { Project, User } from '../../../types';
import { Briefcase, Plus, Loader2, Trash2, Target, Link as LinkIcon, Calendar, Edit2, Zap, Crown, AlertTriangle, PlayCircle, X, Sparkles, Lock, Unlock, Library } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

interface DashboardContext {
  user: User;
  isSimulating: boolean;
}

export const ProjectsList: React.FC = () => {
    const navigate = useNavigate();
    const { user, isSimulating } = useOutletContext() as DashboardContext;
    const [projects, setProjects] = useState<Project[]>([]);
    const [masterLibrary, setMasterLibrary] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [unlockingId, setUnlockingId] = useState<string | null>(null);
    
    // Modals State
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    
    // Generating state per project ID
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [myProjects, library] = await Promise.all([
                api.getProjects(),
                api.getMasterLibrary().catch(() => [])
            ]);
            setProjects(myProjects);
            setMasterLibrary(library);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de eliminar este proyecto y toda su estrategia?")) {
            await api.deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const handleUnlock = async (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        
        const isRealAdmin = user.role === 'admin' && !isSimulating;
        const maxProjects = user.planLimits?.maxProjects || 1;
        if (projects.length >= maxProjects && !isRealAdmin) {
            setShowUpgradeModal(true);
            return;
        }

        setUnlockingId(projectId);
        try {
            await api.unlockProject(projectId);
            await loadData(); // Refresh everything
        } catch (error: any) {
            alert(error.message || "Error al desbloquear estrategia.");
        } finally {
            setUnlockingId(null);
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
                                Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Proyectos</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                                Centraliza tus nichos, avatares y enlaces de afiliado. La IA usará estos datos para generar contenido coherente y ventas.
                            </p>
                        </div>
                        
                        {/* Plan Usage Bar */}
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-300 font-medium">{isRealAdmin ? 'Proyectos (Superusuario)' : 'Proyectos Activos'}</span>
                                <span className="text-white font-bold">{currentCount} / {isRealAdmin ? '∞' : maxProjects}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (currentCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                            </div>
                            {isAtLimit && (
                                <div className="mt-3 flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded-lg border border-yellow-700/30">
                                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span>Has alcanzado el límite de tu plan. Actualiza para gestionar más nichos.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                        {isAtLimit ? (
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02] border border-yellow-400/20"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Crown className="w-5 h-5 fill-current" /> 
                                    Límite Alcanzado: Subir a PRO
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/dashboard/projects/create')}
                                className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 hover:-translate-y-1"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Plus className="w-5 h-5" /> 
                                    Nuevo Proyecto
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        )}
                        
                        <button 
                            onClick={() => setShowVideoModal(true)}
                            className="px-8 py-3 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            <PlayCircle className="w-4 h-4" /> ¿Cómo funciona?
                        </button>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 1: MIS PROYECTOS */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-1">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Mis Proyectos</h2>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">{projects.length} activos</span>
                </div>
                
                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-700">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-700">
                            <Briefcase className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Comienza tu Estrategia</h3>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">Define tu primer proyecto o desbloquea una estrategia de la biblioteca inferior.</p>
                        <button 
                            onClick={() => navigate('/dashboard/projects/create')}
                            className="text-blue-400 border border-blue-500/50 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-lg transition font-medium"
                        >
                            Crear Primer Proyecto
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div 
                                key={project.id}
                                onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
                                className={`bg-[#111] rounded-[2.5rem] border transition-all duration-300 group flex flex-col h-full relative overflow-hidden cursor-pointer shadow-2xl ${project.isMaster ? 'border-yellow-500/20 hover:border-yellow-500/40 shadow-yellow-500/5' : 'border-white/5 hover:border-[#FF5A1F]/30'}`}
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 opacity-80 ${project.isMaster ? 'bg-gradient-to-r from-yellow-400 to-amber-600' : 'bg-gradient-to-r from-[#FF5A1F] to-orange-600'}`}></div>
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        {project.isMaster ? (
                                            <div className="bg-yellow-500/10 text-yellow-500 text-[10px] px-3 py-1.5 rounded-full border border-yellow-500/20 font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                                <Crown className="w-3 h-3 fill-current" />
                                                Estrategia Maestra
                                            </div>
                                        ) : (
                                            <div className="bg-[#FF5A1F]/10 text-[#FF5A1F] text-[10px] px-3 py-1.5 rounded-full border border-[#FF5A1F]/20 font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Target className="w-3 h-3" />
                                                {project.mainGoal || "General"}
                                            </div>
                                        )}
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {/* Los proyectos maestros NO se editan si no eres dueño, pero permitimos ir a la edición para ver datos */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/projects/edit/${project.id}`); }}
                                                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all shadow-lg"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(project.id, e)}
                                                className="p-2.5 bg-red-900/20 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all shadow-lg"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-black text-white mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300">{project.name}</h3>
                                    <p className="text-lg font-medium text-gray-400 mb-8 min-h-[56px] leading-relaxed line-clamp-2">
                                        {project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción definida.")}
                                    </p>

                                    <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                                        <button 
                                            onClick={(e) => handleViewStrategy(e, project)}
                                            disabled={generatingId === project.id}
                                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 transform active:scale-[0.98] ${project.isMaster ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-yellow-900/20' : 'bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-[#FF5A1F]/20'}`}
                                        >
                                            <Zap className="w-4 h-4 fill-current" /> Abrir Centro de Mando
                                        </button>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                                                    <LinkIcon className="w-3.5 h-3.5" /> 
                                                </div>
                                                <span>{project.affiliateLinks?.length || 0} Enlaces</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                                                    <Calendar className="w-3.5 h-3.5" /> 
                                                </div>
                                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECCIÓN 2: BIBLIOTECA DE ESTRATEGIAS MAESTRAS (NUEVA) */}
            <div className="space-y-8 pt-12 border-t border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-4 border-l-4 border-yellow-500 pl-4 py-1">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                            <Library className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Biblioteca Maestra</h2>
                            <p className="text-gray-400 font-medium">Estrategias ganadoras listas para ser desbloqueadas.</p>
                        </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-black text-yellow-200 uppercase tracking-widest">Contenido exclusivo Nivel PRO</span>
                    </div>
                </div>

                {masterLibrary.length === 0 ? (
                    <div className="p-12 bg-white/5 rounded-[2.5rem] border border-white/5 text-center">
                        <p className="text-gray-500 italic">No hay nuevas estrategias maestras disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {masterLibrary.map((item) => (
                            <div 
                                key={item.id}
                                className="bg-[#0B0B0B] border border-yellow-500/10 rounded-[2.5rem] p-8 hover:border-yellow-500/40 transition-all duration-500 flex flex-col group shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                                    <Crown className="w-32 h-32 text-yellow-500" />
                                </div>
                                
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-lg shadow-yellow-900/10 group-hover:scale-110 transition-transform">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                        <Target className="w-3 h-3" /> {item.niche}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 relative z-10">
                                    <h4 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-yellow-400 transition-colors">
                                        {item.name}
                                    </h4>
                                    <p className="text-gray-400 text-base leading-relaxed line-clamp-3">
                                        {item.shortDescription || (item.description ? item.description.replace(/<[^>]*>?/gm, '') : "Estrategia validada para lanzamientos.")}
                                    </p>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                                    <button 
                                        onClick={(e) => handleUnlock(item.id, e)}
                                        disabled={unlockingId === item.id}
                                        className="w-full py-5 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-yellow-900/20 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        {unlockingId === item.id ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                                        ) : (
                                            <><Unlock className="w-4 h-4" /> Desbloquear Estrategia</>
                                        )}
                                    </button>
                                    <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-4">
                                        Consume 1 cupo de proyecto en tu plan
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODALS */}
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                currentPlan={user.planLimits?.planName}
                reason="Para gestionar más de un proyecto o nicho necesitas ampliar tu capacidad."
            />

            {showVideoModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-blue-500" /> Tutorial: Estrategia de Nichos
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Cómo funciona el gestor de proyectos" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-6 bg-gray-900">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Aprende a organizar tus productos digitales por proyectos para que la Inteligencia Artificial pueda generar estrategias personalizadas para cada nicho de mercado.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
