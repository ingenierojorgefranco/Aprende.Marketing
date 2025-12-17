import React, { useEffect, useState } from 'react';
import { Article, User } from '../../../types';
import { BookOpen, Calendar, Search, Edit2, FileText, Globe, Clock, ExternalLink, Trash2, Loader2, Sparkles, BarChart, PenTool, Zap, AlertTriangle, Crown, PlayCircle, X } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { UpgradeModal } from '../UpgradeModal';

interface DashboardContext {
  user: User;
  articleCount: number;
}

interface ArticlesListProps {
  onCreateNew?: () => void;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({ onCreateNew }) => {
  const navigate = useNavigate();
  const { user, articleCount } = useOutletContext() as DashboardContext; 
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
      const fetchArticles = async () => {
          setLoading(true);
          try {
              const data = await api.getArticles();
              setLocalArticles(data);
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };
      fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.")) {
          try {
              await api.deleteArticle(id);
              setLocalArticles(prev => prev.filter(a => a.id !== id));
          } catch (error) {
              alert("Error eliminando el artículo. Por favor intenta de nuevo.");
          }
      }
  };

  const handleCreate = () => {
      const maxArticles = user.planLimits?.maxArticles || 2;
      
      // Check Limit before creating
      if (articleCount >= maxArticles) {
          setShowUpgradeModal(true);
          return;
      }

      if (onCreateNew) onCreateNew();
      else navigate("/dashboard/content-creator");
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-purple-500" />
              <p>Cargando artículos...</p>
          </div>
      );
  }

  // Plan Logic
  const maxArticles = user.planLimits?.maxArticles || 2;
  const usagePercent = Math.min(100, (articleCount / maxArticles) * 100);
  const isAtLimit = articleCount >= maxArticles;

  // Color logic for bar
  let progressColor = "bg-green-500";
  if (usagePercent > 50) progressColor = "bg-yellow-500";
  if (usagePercent > 85) progressColor = "bg-red-500";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
          currentPlan={user.planLimits?.planName}
          reason="Has alcanzado tu cupo mensual de artículos. Actualiza tu plan para seguir generando contenido SEO."
      />

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-purple-950/20 to-black border border-gray-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-6 text-center md:text-left">
                  <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-800 text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 shadow-sm">
                          <Sparkles className="w-3 h-3 text-purple-400" /> Motor de Contenidos IA
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                          Generador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Artículos SEO</span>
                      </h1>
                      <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                          Genera artículos optimizados para buscadores que atraen tráfico orgánico a tus ofertas las 24 horas.
                      </p>
                  </div>
                  
                  {/* Plan Usage Bar */}
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner">
                      <div className="flex justify-between items-center mb-2 text-sm">
                          <span className="text-gray-300 font-medium">Consumo de Artículos</span>
                          <span className="text-white font-bold">{articleCount} / {maxArticles}</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                      </div>
                      {isAtLimit && (
                          <div className="mt-3 flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded-lg border border-yellow-700/30">
                              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                              <span>Límite mensual alcanzado. Actualiza para generar contenido ilimitado.</span>
                          </div>
                      )}
                  </div>
              </div>

              <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
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
                        onClick={handleCreate}
                        className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20 hover:-translate-y-1"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <PenTool className="w-5 h-5" /> 
                            Redactar Nuevo
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

      {/* CONTENT GRID */}
      {localArticles.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-dashed border-gray-700 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-700">
            <BookOpen className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Tu blog está vacío</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8">Usa la IA para generar tu primer artículo optimizado para SEO y empieza a atraer tráfico.</p>
          <button 
            onClick={handleCreate}
            className="text-purple-400 border border-purple-500/50 hover:bg-purple-600 hover:text-white px-6 py-2.5 rounded-lg transition font-medium"
          >
            Generar Primer Artículo
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localArticles.map((article) => {
             const basePageSlug = article.pageSubdomain ? article.pageSubdomain.split(".")[0] : article.pageId;
             const articleUrl = basePageSlug ? `/admin/lp/${basePageSlug}/blog/${article.slug}` : '#';
             const landingUrl = basePageSlug ? `/admin/lp/${basePageSlug}` : '#';

             return (
                <div key={article.id} className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition duration-300 group flex flex-col h-full overflow-hidden shadow-xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition"></div>

                {article.featuredImage ? (
                    <div className="h-48 w-full bg-gray-800 relative overflow-hidden">
                        <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                             <div className={`text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md uppercase tracking-wider border ${
                                article.seoScore >= 80 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                article.seoScore >= 50 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}>
                                SEO: {article.seoScore}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-24 bg-gray-800 flex items-center justify-center text-gray-600 relative">
                        <FileText className="w-8 h-8" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-gray-800/80 text-gray-400 text-[10px] px-2 py-1 rounded flex items-center gap-1 w-fit border border-gray-700">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                        </div>
                        {article.status === 'scheduled' && (
                            <span className="text-[10px] text-orange-400 bg-orange-900/20 px-2 py-1 rounded border border-orange-900/30 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Prog.
                            </span>
                        )}
                        {article.status === 'published' && (
                            <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900/30 font-bold flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Publicado
                            </span>
                        )}
                        {article.status === 'draft' && (
                            <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700 font-bold">
                                Borrador
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition leading-tight">
                    {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {article.metaDescription || article.description}
                    </p>
                    
                    <div className="space-y-3 mt-auto pt-4 border-t border-gray-800/50">
                        {article.pageId ? (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Globe className="w-3 h-3 text-purple-500" />
                                <span className="opacity-70">En:</span>
                                <a 
                                    href={landingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="text-gray-300 hover:text-purple-400 hover:underline font-medium truncate max-w-[150px] transition"
                                >
                                    {article.pageName || "Landing Page"}
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Globe className="w-3 h-3" /> Sin vincular
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="p-4 bg-black/40 border-t border-gray-800 flex items-center gap-3">
                    <button 
                        onClick={() => navigate(`/dashboard/articles/edit/${article.id}`)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 border border-white/5 hover:border-white/20"
                    >
                        <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                    
                    {article.pageId && basePageSlug && article.status === 'published' && (
                        <a 
                            href={articleUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 bg-purple-900/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg transition border border-purple-900/30 hover:border-purple-500"
                            title="Ver artículo online"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}

                    <button 
                        onClick={() => handleDelete(article.id)}
                        className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                        title="Eliminar artículo"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                </div>
             );
          })}
        </div>
      )}

      {/* VIDEO MODAL */}
      {showVideoModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                      <h3 className="font-bold text-white flex items-center gap-2">
                          <PlayCircle className="w-5 h-5 text-purple-500" /> Tutorial: Estrategia de Contenidos SEO
                      </h3>
                      <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                          <X className="w-6 h-6"/>
                      </button>
                  </div>
                  <div className="aspect-video w-full">
                      <iframe 
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                          title="Cómo generar artículos con IA" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                      ></iframe>
                  </div>
                  <div className="p-6 bg-gray-900">
                      <p className="text-gray-300 text-sm leading-relaxed">
                          Aprende a generar artículos profesionales optimizados para Google. Descubre cómo atraer tráfico orgánico calificado hacia tus ofertas de Hotmart sin gastar en publicidad.
                      </p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};