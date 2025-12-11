
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, Award, PlayCircle, ChevronDown, ChevronUp, Play, FileText, MessageSquare, Send, User, Reply, ThumbsUp, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';

// Types definition
type Lesson = {
  id: string;
  title: string;
  duration: string;
  video_url: string;
  description: string;
  learning_points: string[];
  isLocked?: boolean;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type CourseData = {
  id: string;
  title: string;
  subtitle: string;
  badge_text?: string;
  description: string;
  learningPoints: string[];
  modules: Module[];
};

type Comment = {
  id: string;
  user: string;
  avatar?: string;
  date: string;
  text: string;
  likes: number;
  replies?: Comment[];
};

export const TrainingViewer: React.FC = () => {
  const { moduleId } = useParams() as { moduleId: string }; // This maps to "slug" in DB
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  // Lazy Loading States
  const [loadedModuleIds, setLoadedModuleIds] = useState<string[]>([]);
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);
  
  // Comments State
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Load Course Data
  useEffect(() => {
      if (moduleId) {
          const loadCourse = async () => {
              setLoading(true);
              try {
                  const data = await api.getCourseBySlug(moduleId);
                  setCourseData(data);
                  
                  // Automatically load and expand the first module
                  if (data && data.modules.length > 0) {
                      const firstMod = data.modules[0];
                      // Fetch lessons for first module immediately
                      const lessons = await api.getModuleLessons(firstMod.id);
                      
                      // Update data with lessons locally
                      firstMod.lessons = lessons; 
                      
                      setCourseData({...data}); 
                      setActiveModuleId(firstMod.id);
                      setLoadedModuleIds([firstMod.id]);
                      
                      if (lessons.length > 0) {
                          setCurrentLesson(lessons[0]);
                      }
                  }
              } catch (error) {
                  console.error("Error loading course:", error);
              } finally {
                  setLoading(false);
              }
          };
          loadCourse();
      }
  }, [moduleId]);

  // Load Comments when Lesson Changes
  useEffect(() => {
      if (currentLesson) {
          const loadComments = async () => {
              setLoadingComments(true);
              try {
                  const data = await api.getComments(currentLesson.id);
                  setComments(data);
              } catch (e) {
                  console.error("Error loading comments:", e);
              } finally {
                  setLoadingComments(false);
              }
          };
          loadComments();
      }
  }, [currentLesson]);

  const toggleModule = async (id: string) => {
      if (activeModuleId === id) {
          setActiveModuleId(null);
          return;
      }

      // Check if module needs loading
      const module = courseData?.modules.find(m => m.id === id);
      const isLoaded = loadedModuleIds.includes(id) || (module && module.lessons.length > 0);

      if (!isLoaded) {
          setLoadingModuleId(id);
          try {
              const lessons = await api.getModuleLessons(id);
              
              setCourseData(prev => {
                  if(!prev) return null;
                  return {
                      ...prev,
                      modules: prev.modules.map(m => m.id === id ? { ...m, lessons } : m)
                  };
              });
              setLoadedModuleIds(prev => [...prev, id]);
          } catch(e) {
              console.error("Error loading module lessons:", e);
          } finally {
              setLoadingModuleId(null);
              setActiveModuleId(id);
          }
      } else {
          setActiveModuleId(id);
      }
  };

  const handlePostComment = async (parentId?: string) => {
    if (!newComment.trim() || !currentLesson) return;
    
    try {
        await api.postComment(currentLesson.id, newComment, parentId);
        
        // Optimistic update or refresh (Note: backend logic may require approval, but user sees 'Pending' or similar in Admin)
        // Here we just refresh to see if it shows (depends on backend query filter)
        // Ideally show a success message if it needs approval
        
        alert("Comentario enviado.");
        setNewComment('');
        setReplyingTo(null);
        
        const refreshedComments = await api.getComments(currentLesson.id);
        setComments(refreshedComments);
    } catch (e) {
        alert("Error al publicar comentario.");
    }
  };

  const handleLike = async (commentId: string) => {
      // 1. Optimistic UI Update (Recursive for nested comments)
      const updateLikesRecursive = (list: Comment[]): Comment[] => {
          return list.map(c => {
              if (c.id === commentId) {
                  return { ...c, likes: (c.likes || 0) + 1 };
              }
              if (c.replies && c.replies.length > 0) {
                  return { ...c, replies: updateLikesRecursive(c.replies) };
              }
              return c;
          });
      };

      setComments(prevComments => updateLikesRecursive(prevComments));

      // 2. API Call (Silent background)
      try {
          await api.likeComment(commentId);
      } catch (error) {
          console.error("Error liking comment:", error);
          // Optional: Revert optimistic update here if needed
      }
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p>Cargando curso...</p>
          </div>
      );
  }

  if (!courseData) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <p className="text-xl">Curso no encontrado.</p>
            <p className="text-sm">Verifica la URL o selecciona un tema del menú.</p>
        </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 p-4 lg:p-8">
      
      {/* Header Course Info */}
      <div className="mb-10 border-b border-gray-800 pb-10">
         <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" /> {courseData.badge_text || 'Certificado'}
            </span>
            <span className="bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {courseData.subtitle || 'Curso Online'}
            </span>
         </div>
         <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {courseData.title}
         </h1>
         <p className="text-lg lg:text-xl text-gray-400 max-w-4xl leading-relaxed">
            {courseData.description}
         </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: MENU (Sticky & Scrollable) - (5 cols) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="sticky top-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden flex flex-col max-h-[calc(100vh-100px)]">
                    <div className="p-5 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-primary" /> Temario del Curso
                        </h3>
                    </div>
                    
                    <div className="overflow-y-auto p-3 space-y-3 custom-scrollbar">
                        {courseData.modules.map((module) => (
                            <div key={module.id} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900 shadow-sm">
                                <button 
                                    onClick={() => toggleModule(module.id)}
                                    className={`w-full flex items-center justify-between p-5 hover:bg-gray-800 transition text-left ${activeModuleId === module.id ? 'bg-gray-800' : ''}`}
                                >
                                    <span className="font-bold text-gray-200 text-lg">{module.title}</span>
                                    {loadingModuleId === module.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    ) : (
                                        activeModuleId === module.id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                
                                {activeModuleId === module.id && (
                                    <div className="bg-black/40 border-t border-gray-800 animate-in slide-in-from-top-2">
                                        {module.lessons.map((lesson) => (
                                            <button 
                                                key={lesson.id}
                                                onClick={() => setCurrentLesson(lesson)}
                                                className={`w-full flex items-center gap-4 p-5 text-base transition text-left border-l-4 group ${currentLesson?.id === lesson.id ? 'bg-primary/10 border-primary text-white' : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition ${currentLesson?.id === lesson.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700'}`}>
                                                    <Play className="w-4 h-4 ml-0.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium line-clamp-2 leading-snug ${currentLesson?.id === lesson.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{lesson.title}</p>
                                                    <span className="text-sm opacity-60 font-mono mt-1.5 block">{lesson.duration}</span>
                                                </div>
                                            </button>
                                        ))}
                                        {module.lessons.length === 0 && (
                                            <div className="p-5 text-sm text-gray-500 italic text-center">No hay lecciones en este módulo.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: VIDEO PLAYER & CONTENT - (7 cols) */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
          
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 ring-1 ring-white/10 group">
             {/* Decorative gradient behind video */}
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-3xl group-hover:opacity-30 transition duration-1000"></div>
             
             {currentLesson ? (
                 <iframe 
                   key={currentLesson.id} // Key forces reload on change
                   src={currentLesson.video_url?.replace('autoplay=1', 'autoplay=0')} 
                   className="absolute inset-0 w-full h-full z-10"
                   title={currentLesson.title}
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen 
                 ></iframe>
             ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900">
                     <div className="text-center">
                        <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium opacity-60">Selecciona una lección para comenzar</p>
                     </div>
                 </div>
             )}
          </div>

          {/* Current Lesson Info */}
          {currentLesson && (
              <div className="animate-in fade-in slide-in-from-top-4">
                  <h2 className="text-3xl font-bold text-white mb-3">{currentLesson.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                      <span className="flex items-center gap-1.5 bg-gray-800 px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> {currentLesson.duration}</span>
                      <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Disponible</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 w-full"></div>
              </div>
          )}

          {/* "Lo que aprenderás" Box */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-8 flex items-center gap-3 text-xl">
              <div className="bg-green-500/20 p-2 rounded-lg"><CheckCircle className="w-6 h-6 text-green-500" /></div>
              Lo que aprenderás en esta clase
            </h3>
            <ul className="grid grid-cols-1 gap-y-4">
              {(currentLesson?.learning_points || []).map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-gray-300 text-lg group">
                  <div className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform"></div>
                  <span className="leading-relaxed group-hover:text-white transition-colors">{point}</span>
                </li>
              ))}
              {(!currentLesson?.learning_points || currentLesson.learning_points.length === 0) && (
                  <li className="text-gray-500 italic">No hay puntos clave definidos para esta lección.</li>
              )}
            </ul>
          </div>

          {/* New: Description Block */}
          {currentLesson && (
              <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-6 flex items-center gap-3 text-xl">
                    <div className="bg-blue-500/20 p-2 rounded-lg"><FileText className="w-6 h-6 text-blue-500" /></div>
                    Descripción de la Clase
                </h3>
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
                    {/* Render HTML Content */}
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.description || "Sin descripción disponible." }} />
                </div>
              </div>
          )}

          {/* New: Comments Section */}
          <div className="space-y-6">
              <h3 className="text-white font-bold text-xl flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-gray-400" /> 
                  Comentarios
                  <span className="text-sm font-normal text-gray-500 ml-2">({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})</span>
              </h3>

              {/* Comment Input */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                          <textarea 
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Escribe tu duda o comentario aquí..."
                              className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none min-h-[100px] transition"
                          />
                          <div className="flex justify-end mt-3">
                              <button 
                                  onClick={() => handlePostComment()}
                                  disabled={!newComment.trim()}
                                  className="bg-primary hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
                              >
                                  Publicar Comentario <Send className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                  {loadingComments ? (
                      <div className="text-center py-8 text-gray-500 flex justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Cargando comentarios...
                      </div>
                  ) : comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-600 italic">Sé el primero en comentar.</div>
                  ) : (
                      comments.map((comment) => (
                      <div key={comment.id} className="animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex gap-4 group">
                              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-700 text-gray-400 font-bold text-sm">
                                  {comment.avatar ? <img src={comment.avatar} alt={comment.user} className="w-full h-full rounded-full" /> : comment.user.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-white text-sm">{comment.user}</span>
                                      <span className="text-xs text-gray-500">• {comment.date}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{comment.text}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <button 
                                        onClick={() => handleLike(comment.id)}
                                        className="flex items-center gap-1 hover:text-white transition group/like"
                                      >
                                          <ThumbsUp className="w-3 h-3 group-hover/like:text-primary transition-colors" /> {comment.likes}
                                      </button>
                                      <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="flex items-center gap-1 hover:text-white transition"><Reply className="w-3 h-3" /> Responder</button>
                                  </div>
                                  
                                  {/* Reply Input */}
                                  {replyingTo === comment.id && (
                                      <div className="mt-4 flex gap-2">
                                          <input 
                                              autoFocus
                                              type="text" 
                                              value={newComment}
                                              onChange={(e) => setNewComment(e.target.value)}
                                              placeholder="Escribe una respuesta..."
                                              className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary outline-none"
                                          />
                                          <button onClick={() => handlePostComment(comment.id)} className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-xs text-white">Enviar</button>
                                      </div>
                                  )}
                              </div>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-14 mt-4 space-y-4 pl-4 border-l-2 border-gray-800">
                                  {comment.replies.map(reply => (
                                      <div key={reply.id} className="flex gap-3">
                                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-700 text-gray-400 font-bold text-xs">
                                              {reply.user.charAt(0).toUpperCase()}
                                          </div>
                                          <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-1">
                                                  <span className="font-bold text-gray-200 text-xs">{reply.user}</span>
                                                  <span className="text-[10px] text-gray-500">• {reply.date}</span>
                                              </div>
                                              <p className="text-gray-400 text-xs leading-relaxed mb-2">{reply.text}</p>
                                              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                                  <button 
                                                    onClick={() => handleLike(reply.id)}
                                                    className="flex items-center gap-1 hover:text-white transition group/like"
                                                  >
                                                      <ThumbsUp className="w-3 h-3 group-hover/like:text-primary transition-colors" /> {reply.likes}
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  )))}
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};
