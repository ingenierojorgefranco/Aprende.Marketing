
import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Comment } from '../../../types';
import { MessageSquare, Check, X, Trash2, Filter, Loader2, Search, Link as LinkIcon, Eye, AlertTriangle, CornerDownRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminComments: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCourse, setFilterCourse] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

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

    const handleAction = async (id: string, action: 'toggle_publish' | 'delete') => {
        try {
            await api.moderateComment(id, action);
            if (action === 'delete') {
                setComments(prev => prev.filter(c => c.id !== id && c.parentId !== id));
            } else {
                // Refresh to ensure cascading logic (parent unpublish -> child unpublish) is reflected
                await loadComments();
            }
        } catch (error) {
            alert("Error al procesar la acción");
        }
    };

    const confirmDelete = () => {
        if (commentToDelete) {
            handleAction(commentToDelete.id, 'delete');
            setCommentToDelete(null);
        }
    };

    // Filter Logic
    const uniqueCourses = Array.from(new Set(comments.map(c => c.courseTitle || 'Sin Curso')));
    
    // 1. First, apply text/course filters
    const filteredRawList = comments.filter(c => {
        const matchesCourse = filterCourse === 'all' || (c.courseTitle || 'Sin Curso') === filterCourse;
        const matchesSearch = c.text.toLowerCase().includes(searchTerm.toLowerCase()) || c.user.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCourse && matchesSearch;
    });

    // 2. Reconstruct Hierarchy from the filtered list (or full list to maintain context?)
    // Note: To properly show hierarchy, we usually need the full list to find parents, but allow filtering.
    // For this specific view, we will structure the *filtered* roots, and find their children from the *full* list 
    // (so if you search for a parent, you see its replies).
    
    // Get all root comments (no parentId) that match filters
    const rootComments = comments.filter(c => !c.parentId && (
        (filterCourse === 'all' || (c.courseTitle || 'Sin Curso') === filterCourse) &&
        (c.text.toLowerCase().includes(searchTerm.toLowerCase()) || c.user.toLowerCase().includes(searchTerm.toLowerCase()))
    ));

    // Helper to render a comment row
    const CommentRow: React.FC<{ comment: Comment, isReply?: boolean, parentApproved?: boolean }> = ({ comment, isReply = false, parentApproved = true }) => {
        const isChildLocked = isReply && !parentApproved;

        return (
            <div className={`relative flex gap-4 p-5 rounded-xl border transition group ${
                isReply 
                    ? 'bg-gray-900/50 border-gray-800 ml-12 mt-2 mb-2' 
                    : `bg-gray-900 ${comment.isApproved ? 'border-gray-800' : 'border-orange-900/50 bg-orange-900/10'}`
            }`}>
                {isReply && (
                    <div className="absolute -left-8 top-8 text-gray-600">
                        <CornerDownRight className="w-6 h-6" />
                    </div>
                )}

                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-primary font-bold shrink-0 ${isReply ? 'w-8 h-8 text-xs bg-gray-800 border-gray-700' : 'bg-gray-800 border-gray-700'}`}>
                    {comment.user.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className={`font-bold ${isReply ? 'text-gray-300' : 'text-white'}`}>
                                {comment.user}
                                {isReply && <span className="ml-2 text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 font-normal">RESPUESTA</span>}
                            </h4>
                            <p className="text-xs text-gray-500">
                                {comment.courseTitle} • {comment.lessonTitle} • {new Date(comment.date).toLocaleDateString()}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {isChildLocked ? (
                                <span className="text-orange-500/70 text-xs font-bold flex items-center gap-1 bg-orange-900/10 px-2 py-1 rounded border border-orange-900/30 cursor-help" title="El comentario padre está despublicado">
                                    <Lock className="w-3 h-3" /> Padre Oculto
                                </span>
                            ) : comment.isApproved ? (
                                <span className="text-green-500 text-xs font-bold bg-green-900/20 px-2 py-1 rounded border border-green-900/50">Publicado</span>
                            ) : (
                                <span className="text-orange-500 text-xs font-bold bg-orange-900/20 px-2 py-1 rounded border border-orange-900/50">Despublicado</span>
                            )}
                        </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed p-3 rounded-lg border ${isReply ? 'bg-black/20 border-gray-800/50 text-gray-400' : 'bg-black/30 border-gray-800 text-gray-300'}`}>
                        {comment.text}
                    </p>
                </div>

                <div className="flex flex-col gap-2 justify-center border-l border-gray-800 pl-4">
                    {comment.courseSlug ? (
                        <Link 
                            to={`/dashboard/training/${comment.courseSlug}`} 
                            className="p-2 bg-blue-900/30 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition text-center"
                            title="Ver Lección"
                            target="_blank"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                    ) : null}
                    
                    <button 
                        onClick={() => handleAction(comment.id, 'toggle_publish')}
                        disabled={isChildLocked}
                        className={`p-2 rounded-lg transition flex items-center justify-center
                            ${isChildLocked 
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' 
                                : comment.isApproved 
                                    ? 'bg-orange-900/30 hover:bg-orange-600 text-orange-500 hover:text-white' 
                                    : 'bg-green-900/30 hover:bg-green-600 text-green-500 hover:text-white'
                            }
                        `}
                        title={isChildLocked ? "Habilita el padre primero" : comment.isApproved ? "Despublicar" : "Publicar"}
                    >
                        {isChildLocked ? <Lock className="w-4 h-4" /> : comment.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                    
                    <button 
                        onClick={() => setCommentToDelete(comment)}
                        className="p-2 bg-red-900/30 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition" 
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

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

            {/* Tree List */}
            <div className="space-y-6">
                {rootComments.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No se encontraron comentarios.</div>
                ) : (
                    rootComments.map(parent => {
                        // Find children for this parent
                        const replies = comments.filter(c => c.parentId === parent.id);
                        
                        return (
                            <div key={parent.id} className="relative">
                                {/* Parent Comment */}
                                <CommentRow comment={parent} />
                                
                                {/* Replies (Indented) */}
                                {replies.length > 0 && (
                                    <div className="relative">
                                        {/* Visual connection line */}
                                        <div className="absolute left-10 top-0 bottom-6 w-px bg-gray-800"></div>
                                        
                                        {replies.map(reply => (
                                            <CommentRow 
                                                key={reply.id} 
                                                comment={reply} 
                                                isReply={true} 
                                                parentApproved={parent.isApproved} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Delete Modal */}
            {commentToDelete && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-red-900/50 p-6 rounded-xl max-w-sm w-full text-center animate-in zoom-in-95">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Comentario?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            ¿Estás seguro de que quieres eliminar este comentario de <b>{commentToDelete.user}</b>?
                            {/* Warning if it has replies */}
                            {comments.some(c => c.parentId === commentToDelete.id) && (
                                <span className="block mt-2 text-red-400 font-bold bg-red-900/20 p-2 rounded">
                                    ¡Atención! Esto eliminará también todas sus respuestas.
                                </span>
                            )}
                        </p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setCommentToDelete(null)} className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:text-white transition">Cancelar</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition">Sí, Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
