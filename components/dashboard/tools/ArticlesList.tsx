import React, { useEffect, useState } from 'react';
import { Article, User, Project } from '../../../types';
import { BookOpen, Calendar, Search, Edit2, FileText, Globe, Clock, ExternalLink, Trash2, Loader2, Sparkles, BarChart, PenTool, Zap, AlertTriangle, Crown, PlayCircle, X, Plus, Briefcase } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { UpgradeModal } from '../UpgradeModal';
import { DeletionRestrictionModal } from '../DeletionRestrictionModal';
import { ContentGenerator } from './ContentGenerator';

interface DashboardContext {
  user: User;
  articleCount: number;
  isSimulating: boolean;
}

interface ArticlesListProps {
  onCreateNew?: () => void;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({ onCreateNew }) => {
  const navigate = useNavigate();
  const { user, articleCount, isSimulating } = useOutletContext() as DashboardContext; 
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProjectId, setFilterProjectId] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  
  // Modals States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // --- Nuevo Estado para Restricción de Eliminación ---
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [articleToRestrict, setArticleToRestrict] = useState<Article | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  // ----------------------------------------------------

  useEffect(() => {
      const loadInitialData = async () => {
          try {
              const projectsData = await api.getProjects();
              setProjects(projectsData || []);
          } catch (e) {
              console.error(e);
          }
      };
      loadInitialData();
  }, []);

  useEffect(() => {
      const loadArticles = async () => {
          setLoading(true);
          try {
              const response = await api.getUserResources('articles', {
                  projectId: filterProjectId === 'all' ? undefined : filterProjectId,
                  page,
                  limit: 5
              });

              if (response && response.data) {
                  const mapped = response.data.map((a: any) => ({
                      id: a.id.toString(),
                      projectId: (a.project_id || a.projectId) ? String(a.project_id || a.projectId) : undefined,
                      projectName: a.project_name || a.projectName,
                      pageId: a.page_id ? a.page_id.toString() : undefined,
                      pageSubdomain: a.page_subdomain,
                      pageName: a.page_name,
                      title: a.title,
                      slug: a.slug,
                      description: a.description || '',
                      contentHtml: a.content_html,
                      featuredImage: a.featured_image,
                      keyword: a.keyword,
                      seoScore: a.seo_score,
                      metaTitle: a.meta_title,
                      metaDescription: a.meta_description || '',
                      emailSubject: a.email_subject,
                      emailBody: a.email_body,
                      status: a.status || 'published',
                      publishedAt: a.published_at ? new Date(a.published_at) : (a.created_at ? new Date(a.created_at) : new Date()),
                      createdAt: a.created_at ? new Date(a.created_at) : new Date()
                  }));
                  setLocalArticles(mapped);
                  setTotalPages(response.pagination.totalPages);
                  setTotalArticles(response.pagination.total);
              } else if (Array.isArray(response)) {
                  setLocalArticles(response);
                  setTotalPages(1);
                  setTotalArticles(response.length);
              }
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      };
      loadArticles();
  }, [page, filterProjectId]);

  const handleDelete = async (article: Article) => {
      if (user.role !== 'admin') {
          setArticleToRestrict(article);
          setShowRestrictionModal(true);
          return;
      }

      if (window.confirm(`¿Estás seguro de eliminar el artículo "${article.title}"? Esta acción no se puede deshacer.`)) {
          try {
              await api.deleteArticle(article.id);
              setLocalArticles(prev => prev.filter(a => a.id !== article.id));
          } catch (error) {
              alert("Error eliminando el artículo. Por favor intenta de nuevo.");
          }
      }
  };

  const handleCreate = () => {
      const isRealAdmin = user.role === 'admin' && !isSimulating;
      const maxArticles = projects.reduce((sum, p) => {
          if (p.limitsConfig?.maxArticles) return sum + p.limitsConfig.maxArticles;
          const slug = p.planSlug || 'starter';
          return sum + (slug === 'starter' ? 2 : 20);
      }, projects.length === 0 ? (user.planLimits?.maxArticles || 2) : 0);
      
      // Check Limit before creating (unless real admin)
      if (!isRealAdmin && articleCount >= maxArticles) {
          setShowUpgradeModal(true);
          return;
      }

      if (onCreateNew) onCreateNew();
      else setIsGeneratorOpen(true);
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
  const isRealAdmin = user.role === 'admin' && !isSimulating;
  const maxArticles = projects.reduce((sum, p) => {
      if (p.limitsConfig?.maxArticles) return sum + p.limitsConfig.maxArticles;
      const slug = p.planSlug || 'starter';
      return sum + (slug === 'starter' ? 2 : 20);
  }, projects.length === 0 ? (user.planLimits?.maxArticles || 2) : 0);
  const usagePercent = Math.min(100, (articleCount / maxArticles) * 100);
  const isAtLimit = !isRealAdmin && articleCount >= maxArticles;

  // Color logic for bar
  let progressColor = "bg-green-500";
  if (usagePercent > 50) progressColor = "bg-yellow-500";
  if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
          user={user}
          userId={user.id}
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
                      <p className="text-white pt-[0.8em] pb-[0.6em] text-[1.2rem] max-w-xl leading-[1.625]">
                          Genera artículos optimizados para buscadores que atraen tráfico orgánico a tus ofertas las 24 horas.
                      </p>
                  </div>
                  
                  {/* Plan Usage Bar */}
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner">
                      <div className="flex justify-between items-center mb-2 text-sm">
                          <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">{isRealAdmin ? 'Artículos (Superusuario)' : 'Consumo de Artículos'}</span>
                          <span className="text-white font-bold">{articleCount} / {isRealAdmin ? '∞' : maxArticles}</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (articleCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                      </div>
                      {isAtLimit && (
                          <div className="mt-3 flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded-lg border border-yellow-700/30">
                              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                              <span className="text-[1rem] leading-[1.5rem]">Límite mensual alcanzado. Actualiza para generar contenido ilimitado.</span>
                          </div>
                      )}
                  </div>
              </div>

              <div className="flex flex-col gap-6 shrink-0 w-full md:w-[400px]">
                  {/* Contenedor de Video Interactivo */}
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
                                <Crown className="w-5 h-5 fill-current" /> 
                                Límite Alcanzado: Subir a PRO
                            </span>
                        </button>
                      ) : (
                        <button
                            onClick={handleCreate}
                            className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20 hover:-translate-y-1 w-full"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <PenTool className="w-5 h-5" /> 
                                Redactar Nuevo
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* SECCIÓN: MIS ARTÍCULOS O GENERADOR */}
      {isGeneratorOpen ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <ContentGenerator 
                  onSave={async (articleData) => {
                      try {
                          if (articleData.id) {
                              await api.updateArticle(articleData.id, articleData);
                          } else {
                              await api.saveArticle(articleData);
                          }
                          setIsGeneratorOpen(false);
                          // El useEffect de ArticlesList recargará la lista automáticamente al desmontar el generador
                          // si forzamos un refresco o si el componente se vuelve a montar.
                          // Para asegurar el refresco, podemos resetear la página a 1.
                          setPage(1);
                      } catch (e) {
                          throw e;
                      }
                  }}
                  onClose={() => setIsGeneratorOpen(false)}
              />
          </div>
      ) : (
          <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-4 py-1 pb-5">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Mis Artículos</h2>
                            <p className="text-white font-medium pt-2.5 text-[1.2em]">Gestiona tu contenido SEO y posicionamiento orgánico</p>
                        </div>
                    </div>
                </div>

                {/* FILTRO POR PROYECTO - CENTRADO Y MÁS GRANDE */}
                <div className="w-full flex justify-center">
                    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
                        <label className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em]">Selecciona un Proyecto para Filtrar</label>
                        <select 
                            value={filterProjectId}
                            onChange={(e) => {
                                setFilterProjectId(e.target.value);
                                setPage(1);
                            }}
                            className="w-full bg-gray-900/50 border-2 border-white/10 rounded-[2rem] px-8 py-5 text-white text-xl font-bold outline-none focus:border-purple-500 transition-all shadow-2xl appearance-none text-center cursor-pointer hover:bg-gray-900"
                        >
                            <option value="all">✨ Todos los Proyectos</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* PAGINACIÓN SUPERIOR */}
                {!isGeneratorOpen && localArticles.length > 0 && (
                    <div className="w-full flex justify-center items-center gap-4">
                        <button 
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="px-6 py-2 bg-gray-900 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-[#FF5A1F] disabled:opacity-30 disabled:hover:bg-gray-900 transition-all"
                        >
                            Anterior
                        </button>
                        <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Página {page} de {totalPages || 1}</span>
                        <button 
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="px-6 py-2 bg-gray-900 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-[#FF5A1F] disabled:opacity-30 disabled:hover:bg-gray-900 transition-all"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            {/* CONTENT GRID */}
            {/* */ /* Actualización: Rediseño Premium Dark con cuadrícula de 3 columnas (LG), bordes redondeados [2.5rem], fondo #111 y línea de acento naranja superior para una estética coherente y profesional - 22/05/2024 19:45 */ }
            {localArticles.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-[2.5rem] border border-dashed border-gray-700 flex flex-col items-center justify-center">
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Empty Card for creation trigger */}
                <button 
                    onClick={handleCreate}
                    className="bg-[#111] border-2 border-dashed border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 group hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/5 transition-all duration-500 min-h-[400px] shadow-2xl"
                >
                    <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all shadow-lg">
                        <Plus className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <h4 className="font-black transition-colors" style={{ color: 'white', fontSize: '2em' }}>Redactar Nuevo Artículo</h4>
                        <p className="mt-2 font-bold opacity-60" style={{ color: 'gray', paddingTop: '1em', fontSize: '1.2em' }}>IA optimizada para posicionamiento Google</p>
                    </div>
                </button>
                {localArticles.map((article) => {
                    const basePageSlug = article.pageSubdomain ? article.pageSubdomain.split(".")[0] : article.pageId;
                    const articleUrl = basePageSlug ? `/admin/lp/${basePageSlug}/blog/${article.slug}` : '#';
                    const landingUrl = basePageSlug ? `/admin/lp/${basePageSlug}` : '#';

                    return (
                        <div key={article.id} className="bg-[#111] rounded-[2.5rem] border border-white/5 hover:border-[#FF5A1F]/30 transition-all duration-300 group flex flex-col h-full overflow-hidden shadow-2xl relative cursor-pointer">
                        {/* Accent Line - Unificado con el diseño global */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-600 opacity-80"></div>

                        {article.featuredImage ? (
                            <div className="h-48 w-full bg-gray-800 relative overflow-hidden">
                                <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <div className={`text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-widest border ${
                                        article.seoScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        article.seoScore >= 50 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        SEO: {article.seoScore}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-48 bg-gray-800 flex items-center justify-center text-gray-600 relative">
                                <FileText className="w-8 h-8" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                            </div>
                        )}
                        
                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/5 text-white text-[0.8em] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit border border-white/5 font-black uppercase tracking-widest">
                                    <Calendar className="w-3 h-3" />
                                    {(() => {
                                        const d = article.publishedAt instanceof Date ? article.publishedAt : new Date(article.publishedAt);
                                        return isNaN(d.getTime()) ? 'Reciente' : d.toLocaleDateString();
                                    })()}
                                </div>
                                {article.status === 'scheduled' && (
                                    <span className="text-[10px] text-orange-400 bg-orange-900/20 px-2 py-1 rounded border border-orange-900/30 font-black uppercase tracking-widest flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Para hoy
                                    </span>
                                )}
                                {article.status === 'published' && (
                                    <span className="text-[10px] text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-900/30 font-black uppercase tracking-widest flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Publicado
                                    </span>
                                )}
                                {article.status === 'draft' && (
                                    <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700 font-black uppercase tracking-widest">
                                        Borrador
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="text-xl font-black text-[#FF5A1F] mb-3 line-clamp-2 group-hover:text-[#FF5A1F] transition-colors duration-300 leading-[1.6]">
                            {article.title}
                            </h3>
                            <p className="text-white text-[1.2rem] line-clamp-3 mb-8 flex-1 leading-relaxed">
                            {article.metaDescription || article.description || "Sin descripción disponible."}
                            </p>
                            
                            <div className="space-y-4 mt-auto pt-6 border-t border-white/5">
                                {article.projectId || article.pageId ? (
                                    <div className="flex flex-col gap-3">
                                        {article.projectId && (
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                </div>
                                                <a 
                                                    href="/dashboard/projects"
                                                    target="_blank"
                                                    rel="noopener noreferrer" 
                                                    className="hover:text-[#FF5A1F] transition-colors"
                                                >
                                                    Proyecto: {article.projectName || projects.find(p => p.id === article.projectId)?.name || "General"}
                                                </a>
                                            </div>
                                        )}
                                        {article.pageId && (
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors">
                                                    <Globe className="w-3.5 h-3.5" />
                                                </div>
                                                <a 
                                                    href={landingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer" 
                                                    className="hover:text-[#FF5A1F] transition-colors"
                                                >
                                                    Web: {article.pageName || "Landing Page"}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                                            <Globe className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Sin vincular</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="p-6 bg-black/20 border-t border-white/5 flex items-center gap-3">
                            <button 
                                onClick={() => navigate(`/dashboard/articles/edit/${article.id}`)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Editar
                            </button>
                            
                            {article.pageId && basePageSlug && article.status === 'published' && (
                                <a 
                                    href={articleUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F] text-[#FF5A1F] hover:text-white rounded-xl transition border border-[#FF5A1F]/20 shadow-lg"
                                    title="Ver artículo online"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}

                            <button 
                                onClick={() => handleDelete(article)}
                                className="flex items-center gap-2 px-3 py-2 text-red-500/40 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition border border-transparent hover:border-red-500/20"
                                title="Eliminar artículo"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Borrar</span>
                            </button>
                        </div>
                        </div>
                    );
                })}
                </div>
            )}

            {/* PAGINACIÓN INFERIOR */}
            {!isGeneratorOpen && localArticles.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button 
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="px-6 py-2 bg-gray-900 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-[#FF5A1F] disabled:opacity-30 disabled:hover:bg-gray-900 transition-all"
                    >
                        Anterior
                    </button>
                    <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Página {page} de {totalPages || 1}</span>
                    <button 
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages || totalPages === 0}
                        className="px-6 py-2 bg-gray-900 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-[#FF5A1F] disabled:opacity-30 disabled:hover:bg-gray-900 transition-all"
                    >
                        Siguiente
                    </button>
                </div>
            )}
          </>
      )}

      {/* VIDEO MODAL */}
      {showVideoModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setShowVideoModal(false)}>
              <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800" onClick={e => e.stopPropagation()}>
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
                          Aprende a generar artículos profesionales optimizados para Google. Descubre cómo atraer tráfico orgánico calificado hacia tus ofertas de Hotmart que venden las 24 horas.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL RESTRICCIÓN DE ELIMINACIÓN */}
      <DeletionRestrictionModal 
          isOpen={showRestrictionModal} 
          onClose={() => setShowRestrictionModal(false)}
          itemName={articleToRestrict ? `Contenido: ${articleToRestrict.title}` : ''}
          userEmail={user.email}
          userName={user.name}
      />
    </div>
  );
};