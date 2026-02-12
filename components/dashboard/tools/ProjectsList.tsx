import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { Project, User } from '../../../types';
import { Briefcase, Plus, Loader2, Trash2, Target, Link as LinkIcon, Calendar, Edit2, Zap, Crown, AlertTriangle, PlayCircle, X, Sparkles, Lock, Unlock, Library, CheckCircle2, ArrowRight, PenTool, Layout, Rocket, MessageCircle, Wand2, Check } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';
import { DeletionRestrictionModal } from '../DeletionRestrictionModal';

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
    
    // --- Nuevo Estado para Protocolo de Desbloqueo ---
    const [showUnlockProtocol, setShowUnlockProtocol] = useState(false);
    const [selectedMasterProject, setSelectedMasterProject] = useState<Project | null>(null);
    
    // --- ESTADOS DE GENERACIÓN DINÁMICA ---
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success'>('idle');
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [generatedProjectId, setGeneratedProjectId] = useState<string | null>(null);
    // --------------------------------------

    // --- Nuevo Estado para Restricción de Eliminación ---
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [projectToRestrict, setProjectToRestrict] = useState<Project | null>(null);
    // ----------------------------------------------------

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

    const handleDelete = async (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Si el usuario no tiene el rol admin, se interceptará la acción
        if (user.role !== 'admin') {
            setProjectToRestrict(project);
            setShowRestrictionModal(true);
            return;
        }

        if (confirm(`¿Estás seguro de eliminar el proyecto "${project.name}" y toda su estrategia?`)) {
            await api.deleteProject(project.id);
            setProjects(projects.filter(p => p.id !== project.id));
        }
    };

    // --- Lógica de Interceptación del Desbloqueo ---
    const handleUnlock = (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedMasterProject(project);
        setShowUnlockProtocol(true);
    };

    const handleConfirmUnlock = async () => {
        if (!selectedMasterProject) return;
        
        const isRealAdmin = user.role === 'admin' && !isSimulating;
        const maxProjects = user.planLimits?.maxProjects || 1;
        const totalActive = projects.length;

        if (totalActive >= maxProjects && !isRealAdmin) {
            setShowUnlockProtocol(false);
            setShowUpgradeModal(true);
            return;
        }

        setShowUnlockProtocol(false);
        setGenerationStatus('generating');
        setProgress(0);
        setSecondsElapsed(0);

        const messages = [
            "Duplicando arquitectura maestra...",
            "Sincronizando avatares psicológicos...",
            "Personalizando ganchos de venta...",
            "Configurando motor de contenidos...",
            "Optimizando secuencias de email...",
            "Finalizando Estrategia Maestra única..."
        ];

        const timerInterval = setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
        }, 1000);

        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            if (currentProgress < 99) {
                currentProgress += 1;
                setProgress(currentProgress);
                const msgIdx = Math.min(Math.floor((currentProgress / 100) * messages.length), messages.length - 1);
                setLoadingMessage(messages[msgIdx]);
            }
        }, 120); // Simulación de carga fluida (aprox 12s para 100%)

        try {
            const res = await api.unlockProject(selectedMasterProject.id);
            
            clearInterval(progressInterval);
            clearInterval(timerInterval);
            setProgress(100);
            setGeneratedProjectId(res.id);
            setGenerationStatus('success');
            await loadData();
        } catch (error: any) {
            clearInterval(progressInterval);
            clearInterval(timerInterval);
            alert(error.message || "Error al desbloquear estrategia.");
            setGenerationStatus('idle');
        } finally {
            setSelectedMasterProject(null);
        }
    };
    // ----------------------------------------------

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
                            <p className="text-white text-lg max-w-xl leading-relaxed">
                                Los Proyectos son el centro de tu estrategia de Ventas. Define tu nicho, audiencia y enlaces de afiliado. Nuestro sistema usará Inteligencia Artificial para generar contenido que te genere grandes resultados.
                            </p>
                        </div>
                        
                        {/* Plan Usage Bar */}
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-300 font-medium">{isRealAdmin ? 'Páginas (Superusuario)' : 'Proyectos Activos'}</span>
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

                    <div className="flex flex-col gap-6 shrink-0 w-full md:w-[400px]">
                        {/* Contenedor de Video Interactivo (Embebido directamente) */}
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

                        {/* Botones centrados debajo del video */}
                        <div className="flex flex-col gap-3">
                            {isAtLimit ? (
                                <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02] border border-yellow-400/20 w-full"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <CornerCrown className="w-5 h-5 fill-current" /> 
                                        Límite Alcanzado: Subir a PRO
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/dashboard/projects/create')}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 hover:-translate-y-1 w-full"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Plus className="w-5 h-5" /> 
                                        Nuevo Proyecto
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 1: MIS PROYECTOS */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-1">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Mis Proyectos</h2>
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
                        {projects.filter(p => user.role === 'admin' || !p.isMaster).map((project) => {
                            const isClonedFromMaster = !!project.masterParentId;
                            
                            return (
                                <div 
                                    key={project.id} 
                                    onClick={() => navigate(`/dashboard/projects/${project.id}/strategy`)}
                                    className={`bg-[#111] rounded-[2.5rem] border transition-all duration-300 group flex flex-col h-full relative overflow-hidden cursor-pointer shadow-2xl ${isClonedFromMaster ? 'border-yellow-500/40 hover:border-yellow-500/60 shadow-yellow-500/10' : 'border-white/5 hover:border-[#FF5A1F]/30'}`}
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 opacity-80 ${isClonedFromMaster ? 'bg-gradient-to-r from-yellow-400 to-amber-600' : 'bg-gradient-to-r from-[#FF5A1F] to-orange-600'}`}></div>
                                    
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            {isClonedFromMaster ? (
                                                <div className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-3 py-1.5 rounded-full border border-yellow-500/20 font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                                    <CornerCrown className="w-3 h-3 fill-current" />
                                                    Estrategia Desbloqueada
                                                </div>
                                            ) : (
                                                <div className="bg-[#FF5A1F]/10 text-[#FF5A1F] text-[10px] px-3 py-1.5 rounded-full border border-[#FF5A1F]/20 font-black uppercase tracking-widest flex items-center gap-1.5">
                                                    <Target className="w-3 h-3" />
                                                    {project.mainGoal || "General"}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/projects/edit/${project.id}`); }}
                                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all shadow-lg"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span className="text-xs font-bold">Editar</span>
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(project, e)}
                                                    className="flex items-center gap-2 px-3 py-2 bg-red-900/20 hover:bg-red-50 rounded-xl text-red-500 hover:text-white transition-all shadow-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-xs font-bold">Borrar</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <h3 className={`text-2xl font-black mb-3 line-clamp-1 group-hover:text-primary transition-colors duration-300 ${isClonedFromMaster ? 'text-yellow-400' : 'text-white'}`}>{project.name}</h3>
                                        <p className="text-lg font-medium text-gray-400 mb-8 min-h-[56px] leading-relaxed line-clamp-2">
                                            {project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción definida.")}
                                        </p>

                                        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                                            <button 
                                                onClick={(e) => handleViewStrategy(e, project)}
                                                disabled={generatingId === project.id}
                                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 transform active:scale-[0.98] ${isClonedFromMaster ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-yellow-900/20' : 'bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-[#FF5A1F]/20'}`}
                                            >
                                                <Zap className="w-4 h-4 fill-current" /> Ver Estrategia de Proyecto
                                            </button>

                                            <div className="flex items-center justify-end pt-2">
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
                            );
                        })}
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
                        {masterLibrary.map((item) => {
                            const isAlreadyUnlocked = item.isUnlocked || user.role === 'admin';

                            return (
                                <div 
                                    key={item.id} 
                                    className={`bg-[#0B0B0B] border rounded-[2.5rem] p-8 transition-all duration-500 flex flex-col group shadow-2xl relative overflow-hidden ${isAlreadyUnlocked ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-yellow-500/10 hover:border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.05)]'}`}
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                                        <CornerCrown className="w-32 h-32 text-yellow-500" />
                                    </div>
                                    
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isAlreadyUnlocked ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-900/10' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-yellow-900/10'}`}>
                                            <Sparkles className="w-8 h-8" />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                            <Target className="w-3 h-3" /> {item.niche}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4 relative z-10">
                                        <h4 className={`text-2xl font-black tracking-tight leading-tight transition-colors ${isAlreadyUnlocked ? 'text-emerald-400' : 'text-white group-hover:text-yellow-400'}`}>
                                            {item.name}
                                        </h4>
                                        <p className="text-gray-400 text-base leading-relaxed line-clamp-3">
                                            {item.shortDescription || (item.description ? item.description.replace(/<[^>]*>?/gm, '') : "Estrategia validada para lanzamientos.")}
                                        </p>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-white/5 relative z-10">
                                        {isAlreadyUnlocked ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center gap-2 text-emerald-400 font-black uppercase text-xs tracking-widest">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {user.role === 'admin' ? 'Acceso Admin' : 'Desbloqueado'}
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        const userClone = projects.find(p => String(p.masterParentId) === String(item.id));
                                                        const targetProject = userClone || item;
                                                        handleViewStrategy(e, targetProject);
                                                    }}
                                                    className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    Ver Estrategia
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={(e) => handleUnlock(item, e)}
                                                    disabled={unlockingId === item.id}
                                                    className="w-full py-5 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-yellow-900/20 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                                >
                                                    {unlockingId === item.id ? (
                                                        <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                                                    ) : (
                                                        <><Unlock className="w-4 h-4" /> DESBLOQUEAR PROYECTO</>
                                                    )}
                                                </button>
                                                <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-4">
                                                    Consume 1 cupo de proyecto en tu plan
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- PROTOCOLO DE DESBLOQUEO MAESTRO (MODAL INTERCEPTOR REDISEÑADO) --- */}
            {showUnlockProtocol && selectedMasterProject && (
                <div 
                    onClick={() => setShowUnlockProtocol(false)}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative max-h-[90vh]"
                    >
                        {/* Línea de acento dorada superior */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                        
                        <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-[2rem] flex items-center justify-center mx-auto border border-yellow-500/20 shadow-lg shadow-yellow-900/10 animate-pulse">
                                    <CornerCrown className="w-10 h-10" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Hemos creado todo el ecosistema por ti.</h3>
                                    <p className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs">Protocolo de Desbloqueo Maestro Activo</p>
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed font-medium max-w-2xl">
                                    Estás a punto de adquirir el ADN estratégico completo para <span className="text-white font-bold">"{selectedMasterProject.name}"</span>. 
                                    Este activo digital incluye avatares, guiones de venta, copys para email y estructura web de alta conversión.
                                </p>
                            </div>

                            {/* Video Informativo Placeholder */}
                            <div className="aspect-video max-w-lg mx-auto w-full bg-black rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group cursor-pointer">
                                <div className="absolute inset-0 flex items-center justify-center bg-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 font-black uppercase text-[8px] tracking-widest">Vista previa estratégica del proyecto</div>
                            </div>

                            {/* MAQUINARIA DE VENTAS VISUAL */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2">
                                {[
                                    { label: 'Copywriting', icon: PenTool, color: 'text-orange-400' },
                                    { label: 'Diseño Web', icon: Layout, color: 'text-blue-400' },
                                    { label: 'Estrategia IA', icon: Sparkles, color: 'text-purple-400' },
                                    { label: 'Automatización', icon: Rocket, color: 'text-emerald-400' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center gap-2 hover:bg-white/10 transition-colors">
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Barra de Consumo de Cupos Estilo Premium */}
                            <div className="bg-black border border-white/5 p-6 rounded-[2rem] shadow-inner relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Cupos de Proyecto en tu Plan <span className="text-white">({user.planLimits?.planName})</span></span>
                                    <span className="text-white font-mono font-bold text-sm">{currentCount} / {isRealAdmin ? '∞' : maxProjects}</span>
                                </div>
                                <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                    <div 
                                        className={`h-full transition-all duration-[1500ms] ease-out rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] ${progressColor}`} 
                                        style={{ width: `${isRealAdmin ? (currentCount > 0 ? 100 : 0) : usagePercent}%` }}
                                    ></div>
                                </div>
                                {isAtLimit && (
                                    <div className="mt-6 flex items-center gap-4 p-4 bg-red-950/20 border border-red-900/30 rounded-2xl">
                                        <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                                        <p className="text-red-400 text-sm font-bold leading-snug uppercase tracking-tight">Has alcanzado tu límite máximo de proyectos activos. Debes subir de plan para desbloquear esta estrategia.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Acciones del Protocolo */}
                        <div className="p-6 md:p-8 bg-black/60 border-t border-white/5 flex flex-col sm:flex-row gap-4 shrink-0">
                            <button 
                                onClick={() => setShowUnlockProtocol(false)}
                                className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all border border-white/5"
                            >
                                No, cancelar
                            </button>
                            {isAtLimit ? (
                                <button 
                                    onClick={() => { setShowUnlockProtocol(false); setShowUpgradeModal(true); }}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-900/40 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    Actualizar Plan Pro <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button 
                                    onClick={handleConfirmUnlock}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-yellow-900/20 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Unlock className="w-5 h-5" /> DESBLOQUEAR PROYECTO
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- OVERLAY DE GENERACIÓN (IDÉNTICO A GENERATOR) --- */}
            {generationStatus === 'generating' && (
                <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-white p-4 animate-in fade-in duration-500">
                    <div className="relative mb-2 flex flex-col items-center">
                        <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center animate-pulse border border-emerald-100">
                            <Wand2 className="w-12 h-12 text-emerald-600" />
                        </div>
                        <p className="text-red-600 font-black uppercase text-sm mt-4 tracking-wider">No cierres esta Página</p>
                        <p className="text-black font-bold text-xs uppercase tracking-widest mt-1">(Tiempo de Espera: 1 Minuto)</p>
                    </div>

                    <div className="flex flex-col items-center bg-black rounded-2xl p-4 px-8 border border-white/10 shadow-2xl mt-4">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1">Tiempo Transcurrido</p>
                        <div className="text-white font-mono text-4xl font-black tracking-tighter">
                            {Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:{(secondsElapsed % 60).toString().padStart(2, '0')}
                        </div>
                    </div>

                    <div className="text-center space-y-4 mt-8">
                        <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic">Generando tu Estrategia Maestra</h3>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{loadingMessage}</p>
                    </div>

                    <div className="w-full max-w-md space-y-4 mt-8">
                        <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
                            <span>Inteligencia Estratégica</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner relative">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-300 ease-out shadow-lg relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute top-0 left-0 h-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[loading-shine_1.5s_infinite]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- UI DE ÉXITO (IDÉNTICO A GENERATOR) --- */}
            {generationStatus === 'success' && generatedProjectId && (
                <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#0B0B0B] p-4 animate-in zoom-in-95 duration-700 overflow-hidden">
                    {/* Confetti simulation */}
                    {[...Array(30)].map((_, i) => (
                        <div 
                            key={i} 
                            className="confetti" 
                            style={{
                                left: `${Math.random() * 100}%`,
                                backgroundColor: ['#10B981', '#34D399', '#4C1D95', '#F59E0B', '#10B981'][Math.floor(Math.random() * 5)],
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        ></div>
                    ))}

                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-4 scale-110 animate-bounce">
                        <Check className="w-14 h-14 text-white" />
                    </div>

                    <div className="text-center max-w-[41rem] space-y-4">
                        <h3 className="text-4xl font-black text-white leading-tight">¡Tu Nueva Estrategia Maestra ha sido generada correctamente!</h3>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Hemos diseñado un ecosistema único y personalizado basado en esta plantilla. Tu nueva estrategia está lista para ser implementada.
                        </p>
                    </div>

                    <div className="w-full max-w-[41rem] pt-10">
                        <button 
                            onClick={() => {
                                setGenerationStatus('idle');
                                navigate(`/dashboard/projects/${generatedProjectId}/strategy`);
                            }}
                            className="w-full py-6 bg-[#FF5A1F] text-white font-black text-xl uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl shadow-[#FF5A1F]/20 transform hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            Ver mi nueva Estrategia Maestra <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    <button 
                        onClick={() => setGenerationStatus('idle')}
                        className="text-gray-500 hover:text-white font-bold text-sm transition-colors pt-8 underline"
                    >
                        Cerrar y volver
                    </button>
                </div>
            )}

            {/* MODAL ESCRITURA IA */}
            {showUpgradeModal && (
                <UpgradeModal 
                    isOpen={showUpgradeModal} 
                    onClose={() => setShowUpgradeModal(false)} 
                    currentPlan={user.planLimits?.planName}
                    reason="Has alcanzado el límite de proyectos de tu plan. Actualiza para crear más estrategias."
                />
            )}

            {/* MODAL RESTRICCIÓN DE ELIMINACIÓN */}
            <DeletionRestrictionModal 
                isOpen={showRestrictionModal} 
                onClose={() => setShowRestrictionModal(false)}
                itemName={projectToRestrict ? `Proyecto: ${projectToRestrict.name}` : ''}
                userEmail={user.email}
                userName={user.name}
            />
        </div>
    );
};

// Se renombra localmente para evitar conflicto con la importación principal de lucide-react si existiera
const CornerCrown = Crown;