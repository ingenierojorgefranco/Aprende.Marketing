
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { Project, User } from '../../../types';
import { Briefcase, Plus, Loader2, Trash2, Target, Link as LinkIcon, Calendar, Edit2, LayoutTemplate, Zap, Crown, AlertTriangle } from 'lucide-react';

interface DashboardContext {
  user: User;
}

export const ProjectsList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useOutletContext() as DashboardContext;
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const data = await api.getProjects();
            setProjects(data);
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                <p>Cargando tus proyectos...</p>
            </div>
        );
    }

    // Plan Logic
    const maxProjects = user.planLimits?.maxProjects || 1;
    const currentCount = projects.length;
    const usagePercent = Math.min(100, (currentCount / maxProjects) * 100);
    const isStarter = user.planLimits?.planName === 'starter';

    // Color logic for bar
    let progressColor = "bg-blue-500";
    if (usagePercent > 50) progressColor = "bg-indigo-500";
    if (usagePercent >= 100) progressColor = "bg-red-500";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            
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
                                <span className="text-gray-300 font-medium">Proyectos Activos</span>
                                <span className="text-white font-bold">{currentCount} / {maxProjects}</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                            </div>
                            {isStarter && currentCount >= maxProjects && (
                                <div className="mt-3 flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded-lg border border-yellow-700/30">
                                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span>Has alcanzado el límite. Actualiza a PRO para gestionar múltiples nichos.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/dashboard/projects/create')}
                            disabled={currentCount >= maxProjects}
                            className={`group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden ${currentCount >= maxProjects ? 'bg-gray-800 cursor-not-allowed text-gray-500 border border-gray-700' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 hover:-translate-y-1'}`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Plus className={`w-5 h-5`} /> 
                                {currentCount >= maxProjects ? 'Límite Alcanzado' : 'Nuevo Proyecto'}
                            </span>
                        </button>
                        
                        {isStarter && (
                            <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] border border-yellow-400/20">
                                <Crown className="w-4 h-4 fill-current" /> Pasar a Plan PRO
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {projects.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-700">
                        <Briefcase className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Comienza tu Estrategia</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">Define tu primer proyecto (Nicho + Producto) para que la IA pueda ayudarte a vender.</p>
                    <button 
                        onClick={() => navigate('/dashboard/projects/create')}
                        className="text-blue-400 border border-blue-500/50 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-lg transition font-medium"
                    >
                        Crear Primer Proyecto
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div 
                            key={project.id}
                            onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
                            className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition duration-300 group flex flex-col h-full relative overflow-hidden cursor-pointer shadow-xl"
                        >
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80"></div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-900/20 text-blue-300 text-[10px] px-2.5 py-1 rounded-full border border-blue-800/30 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <Target className="w-3 h-3" />
                                        {project.mainGoal || "General"}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/projects/edit/${project.id}`); }}
                                            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(project.id, e)}
                                            className="p-2 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-400 transition"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition">{project.name}</h3>
                                <p className="text-sm text-gray-400 mb-6 line-clamp-2 min-h-[40px]">
                                    {project.description || "Sin descripción definida."}
                                </p>

                                <div className="mt-auto space-y-3 pt-4 border-t border-gray-800">
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <div className="w-6 h-6 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                                            <Target className="w-3 h-3 text-gray-500" /> 
                                        </div>
                                        <span className="truncate">{project.niche}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <div className="w-6 h-6 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                                            <LinkIcon className="w-3 h-3 text-gray-500" /> 
                                        </div>
                                        <span>{project.affiliateLinks?.length || 0} Enlaces</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <div className="w-6 h-6 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-3 h-3 text-gray-500" /> 
                                        </div>
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
