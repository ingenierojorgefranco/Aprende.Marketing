
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { Project } from '../../../types';
import { Briefcase, Plus, Loader2, Trash2, Target, Link as LinkIcon, Calendar, Edit2 } from 'lucide-react';

export const ProjectsList: React.FC = () => {
    const navigate = useNavigate();
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
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-400">Cargando tus proyectos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Mis Proyectos</h2>
                    <p className="text-gray-400 text-sm">Gestiona tus estrategias, enlaces y activos por producto.</p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard/projects/create')}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2 font-medium shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Proyecto
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-24 bg-gray-900 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-white font-bold mb-1">No hay proyectos aún</h3>
                    <p className="text-gray-400 text-sm mb-6">Crea tu primer proyecto para centralizar tu estrategia de marketing.</p>
                    <button 
                        onClick={() => navigate('/dashboard/projects/create')}
                        className="text-primary hover:text-white transition text-sm font-medium border border-primary hover:bg-primary px-4 py-2 rounded-lg"
                    >
                        Comenzar Ahora
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div 
                            key={project.id}
                            onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
                            className="bg-gray-900 rounded-xl border border-gray-800 hover:border-blue-500/50 transition duration-300 group flex flex-col h-full relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition"></div>
                            
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded border border-blue-900/50 font-bold uppercase tracking-wider">
                                        {project.mainGoal || "Proyecto"}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/projects/edit/${project.id}`); }}
                                            className="text-gray-600 hover:text-blue-500 transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(project.id, e)}
                                            className="text-gray-600 hover:text-red-500 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition">{project.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                                    {project.description || "Sin descripción"}
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Target className="w-3 h-3" /> 
                                        <span className="text-gray-300 truncate">{project.niche}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <LinkIcon className="w-3 h-3" /> 
                                        <span className="text-gray-300">{project.affiliateLinks?.length || 0} Enlaces configurados</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" /> 
                                        <span className="text-gray-300">{new Date(project.createdAt).toLocaleDateString()}</span>
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
