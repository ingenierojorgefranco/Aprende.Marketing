
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { ProjectHook, User } from '../../../types';
import { Zap, Loader2, Trash2, Calendar, Sparkles, Brain, Target, Briefcase, ExternalLink, AlertTriangle } from 'lucide-react';

interface DashboardContext {
  user: User;
  hookCount: number;
}

export const HooksList: React.FC = () => {
    const navigate = useNavigate();
    const { user, hookCount } = useOutletContext() as DashboardContext;
    const [hooks, setHooks] = useState<ProjectHook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.getUserResources('hooks');
            setHooks(data);
        } catch (error) {
            console.error("Error cargando ganchos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (hook: ProjectHook, e: React.MouseEvent) => {
        e.stopPropagation();
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
                    </div>
                </div>
            </div>

            {/* SECCIÓN: MIS GANCHOS */}
            <div className="space-y-6">
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
                            onClick={() => navigate('/dashboard/projects')}
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
                                onClick={() => navigate(`/dashboard/projects/${hook.projectId || (hook as any).project_id}/strategy?section=hooks&hookId=${hook.id}`)}
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
                                        href={`/dashboard/projects/${hook.projectId || (hook as any).project_id}/strategy`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-gray-400 text-[0.8rem] font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:text-orange-400 transition-colors w-full"
                                    >
                                        <Briefcase className="w-4 h-4 text-gray-500" />
                                        Proyecto: {(hook as any).projectName || (hook as any).project_name || "Sin nombre"}
                                    </a>
                                    
                                    <div className="bg-orange-500/5 rounded-2xl p-4 border border-orange-500/10 mb-6 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Brain className="w-4 h-4 text-orange-400" />
                                            <span className="text-[10px] font-black uppercase text-orange-300 tracking-widest">Estrategia Psicológica</span>
                                        </div>
                                        <p className="text-[1rem] text-gray-400 leading-relaxed italic">
                                            "{hook.psychologicalStrategy || (hook as any).psychological_strategy}"
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <button 
                                            onClick={() => navigate(`/dashboard/projects/${hook.projectId || (hook as any).project_id}/strategy?section=hooks&hookId=${hook.id}`)}
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
        </div>
    );
};
