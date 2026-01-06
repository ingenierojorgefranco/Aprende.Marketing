
import React, { useEffect, useState } from 'react';
import { DashboardNews } from '../../../types';
import { api } from '../../../services/api';
import { 
    Newspaper, Plus, Edit, Trash2, Save, X, 
    Rocket, Bot, Sparkles, Loader2, ArrowLeft, 
    Calendar, CheckCircle, AlertTriangle 
} from 'lucide-react';

////////// Creación del panel de gestión de novedades para administradores - 07/06/2025 10:00 //////////

export const AdminNews: React.FC = () => {
    const [news, setNews] = useState<DashboardNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNews, setEditingNews] = useState<Partial<DashboardNews> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        setLoading(true);
        try {
            const data = await api.getAdminNews();
            setNews(data);
        } catch (e) {
            console.error("Error cargando novedades");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingNews({
            title: '',
            content: '',
            iconType: 'update'
        });
    };

    const handleEdit = (item: DashboardNews) => {
        setEditingNews({ ...item });
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta noticia?")) {
            try {
                await api.deleteNews(id);
                setNews(prev => prev.filter(n => n.id !== id));
            } catch (e) {
                alert("Error al eliminar");
            }
        }
    };

    const handleSave = async () => {
        if (!editingNews?.title || !editingNews?.content) {
            alert("Título y contenido son obligatorios");
            return;
        }
        setSaving(true);
        try {
            await api.saveNews(editingNews);
            await loadNews();
            setEditingNews(null);
        } catch (e) {
            alert("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ia': return <Bot className="w-5 h-5" />;
            case 'update': return <Rocket className="w-5 h-5" />;
            default: return <Sparkles className="w-5 h-5" />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'ia': return 'bg-purple-900/30 text-purple-400 border-purple-900/50';
            case 'update': return 'bg-blue-900/30 text-blue-400 border-blue-900/50';
            default: return 'bg-[#FF5A1F]/30 text-[#FF5A1F] border-[#FF5A1F]/50';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Newspaper className="w-8 h-8 text-[#FF5A1F]" /> Gestionar Novedades y TIPS
                </h1>
                <button 
                    onClick={handleCreateNew}
                    className="bg-[#FF5A1F] hover:bg-[#D94A1E] text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/20"
                >
                    <Plus className="w-5 h-5" /> Nueva Novedad
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-20 text-[#FF5A1F]">
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {news.map((item) => (
                        <div key={item.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-start gap-6 hover:border-white/10 transition-all group">
                            <div className={`p-3 rounded-xl shrink-0 border ${getIconColor(item.iconType)}`}>
                                {getIcon(item.iconType)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF5A1F] transition-colors">{item.title}</h3>
                                    <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">{item.date}</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed max-w-4xl">{item.content}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(item)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {news.length === 0 && (
                        <div className="text-center py-20 bg-[#111] rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-500 font-medium">No hay novedades publicadas aún.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Edición/Creación */}
            {editingNews && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !saving && setEditingNews(null)}>
                    <div className="bg-[#161616] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#FF5A1F]/10 to-transparent">
                            <h3 className="text-2xl font-black text-white tracking-tight">
                                {editingNews.id ? 'Editar Novedad' : 'Nueva Novedad'}
                            </h3>
                            <button onClick={() => setEditingNews(null)} disabled={saving} className="text-gray-500 hover:text-white transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Título</label>
                                <input 
                                    type="text"
                                    value={editingNews.title}
                                    onChange={e => setEditingNews({...editingNews, title: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition"
                                    placeholder="Ej: Nueva función de IA..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contenido (Persuasivo)</label>
                                <textarea 
                                    rows={4}
                                    value={editingNews.content}
                                    onChange={e => setEditingNews({...editingNews, content: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition resize-none"
                                    placeholder="Escribe el detalle de la novedad..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipo de Icono</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'update', label: 'Actualización', icon: Rocket, color: 'text-blue-400' },
                                        { id: 'tip', label: 'Tip Estratégico', icon: Sparkles, color: 'text-[#FF5A1F]' },
                                        { id: 'ia', label: 'Inteligencia IA', icon: Bot, color: 'text-purple-400' }
                                    ].map(type => (
                                        <button 
                                            key={type.id}
                                            onClick={() => setEditingNews({...editingNews, iconType: type.id as any})}
                                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${editingNews.iconType === type.id ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] text-white' : 'bg-black border-white/5 text-gray-500 hover:border-white/10'}`}
                                        >
                                            <type.icon className={`w-6 h-6 ${editingNews.iconType === type.id ? type.color : ''}`} />
                                            <span className="text-[10px] font-bold uppercase">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-black/40 border-t border-white/5 flex justify-end gap-4">
                            <button onClick={() => setEditingNews(null)} disabled={saving} className="px-6 py-3 text-gray-400 font-bold hover:text-white transition">Cancelar</button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-[#FF5A1F] hover:bg-[#D94A1E] text-white px-10 py-3 rounded-xl font-black transition flex items-center gap-2 shadow-lg"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingNews.id ? 'Guardar Cambios' : 'Publicar Ahora'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
////////// Fin de actualización - 07/06/2025 10:00 //////////
