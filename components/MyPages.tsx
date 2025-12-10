import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LandingPage } from '../types';
import { Loader2, LayoutTemplate, PenTool, Globe, Trash2, AlertTriangle, X } from 'lucide-react';

export const MyPages: React.FC = () => {
    const navigate = useNavigate();
    const [pages, setPages] = useState<LandingPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageToDelete, setPageToDelete] = useState<LandingPage | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        try {
            const data = await api.getPages();
            setPages(data);
        } catch (error) {
            console.error("Failed to load pages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (page: LandingPage) => {
        const newStatus = !page.isPublished;
        const updatedPage = { ...page, isPublished: newStatus };
        try {
            await api.updatePage(updatedPage);
            setPages(prev => prev.map(p => (p.id === page.id ? updatedPage : p)));
        } catch (error) {
            alert("No se pudo cambiar el estado de publicación.");
        }
    };

    const confirmDeletePage = async () => {
        if (!pageToDelete) return;
        setDeleting(true);
        try {
            await api.deletePage(pageToDelete.id);
            setPages(prev => prev.filter(p => p.id !== pageToDelete.id));
            setPageToDelete(null);
        } catch {
            alert("Error eliminando la página.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p>Cargando tus páginas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Mis Páginas</h2>
                <button
                    onClick={() => navigate("/dashboard/generator")}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition font-medium"
                >
                    Crear Nueva
                </button>
            </div>

            {pages.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-xl border border-dashed border-gray-700">
                    <LayoutTemplate className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aún no has creado ninguna página.</p>
                    <button 
                        onClick={() => navigate("/dashboard/generator")}
                        className="mt-4 text-primary border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition"
                    >
                        Empezar
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map((page) => {
                        const baseSlug = page.subdomain ? page.subdomain.split(".")[0] : page.id;
                        const publicUrl = `/admin/lp/${baseSlug}`;

                        return (
                            <div key={page.id} className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800 hover:border-primary transition group relative flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h3 className="font-bold text-lg text-white truncate">{page.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">{page.niche}</p>
                                    </div>
                                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${page.isPublished ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                                        {page.isPublished ? "Publicada" : "En Borrador"}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400 mb-6 space-y-1">
                                    <p>Visitas: {page.visits}</p>
                                    <p>Conversiones: {page.conversions}</p>
                                </div>
                                <div className="flex flex-col gap-2 mt-auto">
                                    <button onClick={() => navigate(`/dashboard/editor/${page.id}`)} className="w-full py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 flex items-center justify-center gap-2 group-hover:border-primary group-hover:text-primary transition">
                                        <PenTool className="w-4 h-4" /> Editar Página
                                    </button>
                                    <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="w-full py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 flex items-center justify-center gap-2 hover:text-white transition text-sm">
                                        <LayoutTemplate className="w-4 h-4" /> Ver Online
                                    </a>
                                    <button onClick={() => handleTogglePublish(page)} className={`w-full py-2 border rounded-lg flex items-center justify-center gap-2 transition text-sm ${page.isPublished ? "border-orange-900/30 text-orange-500/70 hover:bg-orange-900/10 hover:text-orange-500" : "border-green-900/30 text-green-500/70 hover:bg-green-900/10 hover:text-green-500"}`}>
                                        <Globe className="w-4 h-4" /> {page.isPublished ? "Despublicar Página" : "Publicar Página"}
                                    </button>
                                    <button onClick={() => setPageToDelete(page)} className="w-full py-2 border border-red-900/30 rounded-lg text-red-500/70 hover:bg-red-900/10 hover:text-red-500 flex items-center justify-center gap-2 transition text-sm">
                                        <Trash2 className="w-4 h-4" /> Eliminar Página
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* DELETE MODAL */}
            {pageToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 text-red-500 font-bold text-lg">
                                <AlertTriangle className="w-6 h-6" /> Eliminar Página
                            </div>
                            <button onClick={() => setPageToDelete(null)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-300 mb-6">¿Estás seguro de que quieres eliminar <b>"{pageToDelete.name}"</b>? <br /><br />Esta acción es irreversible.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setPageToDelete(null)} disabled={deleting} className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-white transition">Cancelar</button>
                            <button onClick={confirmDeletePage} disabled={deleting} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-2">
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};