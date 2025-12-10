
import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Comment } from '../../../types';
import { MessageSquare, Check, X, Trash2, Filter, Loader2, Search } from 'lucide-react';

export const AdminComments: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCourse, setFilterCourse] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        setLoading(true);
        try {
            const data = await api.getAdminComments();
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'delete') => {
        try {
            await api.moderateComment(id, action);
            if (action === 'delete') {
                setComments(prev => prev.filter(c => c.id !== id));
            } else {
                setComments(prev => prev.map(c => c.id === id ? { ...c, isApproved: true } : c));
            }
        } catch (error) {
            alert("Error al procesar la acción");
        }
    };

    // Filter Logic
    const uniqueCourses = Array.from(new Set(comments.map(c => c.courseTitle || 'Sin Curso')));
    
    const filteredComments = comments.filter(c => {
        const matchesCourse = filterCourse === 'all' || (c.courseTitle || 'Sin Curso') === filterCourse;
        const matchesSearch = c.text.toLowerCase().includes(searchTerm.toLowerCase()) || c.user.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" /> Moderación de Comentarios
            </h1>

            {/* Toolbar */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Filter className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <select 
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className="bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary appearance-none"
                        >
                            <option value="all">Todos los Cursos</option>
                            {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar usuario o texto..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary"
                        />
                    </div>
                </div>
                <button onClick={loadComments} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
                    <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredComments.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No se encontraron comentarios.</div>
                ) : (
                    filteredComments.map(comment => (
                        <div key={comment.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex gap-4 transition hover:border-gray-700">
                            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-primary font-bold shrink-0">
                                {comment.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-white">{comment.user}</h4>
                                        <p className="text-xs text-gray-500">{comment.courseTitle} • {comment.lessonTitle} • {new Date(comment.date).toLocaleDateString()}</p>
                                    </div>
                                    {comment.isApproved ? (
                                        <span className="text-green-500 text-xs font-bold bg-green-900/20 px-2 py-1 rounded border border-green-900/50">Aprobado</span>
                                    ) : (
                                        <span className="text-orange-500 text-xs font-bold bg-orange-900/20 px-2 py-1 rounded border border-orange-900/50">Pendiente</span>
                                    )}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed bg-black/30 p-3 rounded-lg border border-gray-800">
                                    {comment.text}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 justify-center border-l border-gray-800 pl-4">
                                {!comment.isApproved && (
                                    <button 
                                        onClick={() => handleAction(comment.id, 'approve')}
                                        className="p-2 bg-green-900/30 hover:bg-green-600 text-green-500 hover:text-white rounded-lg transition" 
                                        title="Aprobar"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleAction(comment.id, 'delete')}
                                    className="p-2 bg-red-900/30 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition" 
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
