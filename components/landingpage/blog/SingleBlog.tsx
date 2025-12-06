import React, { useEffect, useState } from 'react';
import { Article, GeneratedPageContent } from '../../../types';
import { api } from '../../../services/api';
import { Loader2, Calendar, ArrowRight, ArrowLeft, Target, ChevronLeft, ChevronRight } from 'lucide-react';

interface SingleBlogProps {
  content: GeneratedPageContent;
  viewMode: 'blog-list' | 'blog-post';
  pageId?: string;
  articleSlug?: string;
  basePath?: string;
  designSystem: any;
  isDark: boolean;
}

export const SingleBlog: React.FC<SingleBlogProps> = ({ 
  content, 
  viewMode, 
  pageId, 
  articleSlug, 
  basePath,
  designSystem: ds,
  isDark
}) => {
  const [blogArticles, setBlogArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
     if (viewMode === 'blog-list' && pageId) {
         setBlogLoading(true);
         api.getPublicBlogArticles(pageId).then(setBlogArticles).finally(() => setBlogLoading(false));
     } else if (viewMode === 'blog-post' && articleSlug) {
         setBlogLoading(true);
         api.getPublicArticle(articleSlug).then(setCurrentArticle).finally(() => setBlogLoading(false));
     }
  }, [viewMode, pageId, articleSlug]);

  // Pagination Logic
  const totalPages = Math.ceil(blogArticles.length / itemsPerPage);
  const displayedArticles = blogArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
      <main className={`pt-32 pb-20 min-h-[80vh] container mx-auto px-6 max-w-7xl`}>
          {blogLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className={`w-10 h-10 animate-spin text-white`} />
                  <p className="mt-4 opacity-70 text-white">Cargando contenido...</p>
              </div>
          ) : viewMode === 'blog-list' ? (
              // LISTA DE ARTICULOS
              <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center mb-16">
                      <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-white`}>Blog & Novedades</h1>
                      <p className="text-lg opacity-90 max-w-2xl mx-auto text-white">Contenido exclusivo para complementar tu aprendizaje.</p>
                  </div>
                  
                  {blogArticles.length === 0 ? (
                      <div className="text-center py-20 opacity-70 text-white">No hay artículos publicados aún.</div>
                  ) : (
                      <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedArticles.map(article => (
                                <a key={article.id} href={`${basePath || ''}/blog/${article.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                                    <div className="h-56 overflow-hidden bg-gray-200 relative">
                                        {article.featuredImage ? (
                                            <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                {/* Fallback image placeholder in grayscale */}
                                                <img 
                                                    src="https://images.unsplash.com/photo-1499750310159-5b5f22132069?auto=format&fit=crop&q=80&w=600&saturation=-100" 
                                                    alt="Default" 
                                                    className="w-full h-full object-cover grayscale opacity-50"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur px-3 py-1 m-3 rounded-md text-xs font-bold text-gray-800 shadow-sm">
                                            {new Date(article.publishedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2 className={`text-xl font-bold mb-3 leading-tight ${ds.textColor || 'text-gray-900'}`}>{article.title}</h2>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                            {article.metaDescription || article.description}
                                        </p>
                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <span className={`text-sm font-bold flex items-center gap-1 ${ds.textColor || 'text-blue-600'}`}>
                                                Leer Más <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-16">
                                <button 
                                    onClick={handlePrevPage} 
                                    disabled={currentPage === 1}
                                    className={`p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition`}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <span className="text-white font-bold text-lg">
                                    {currentPage} / {totalPages}
                                </span>
                                <button 
                                    onClick={handleNextPage} 
                                    disabled={currentPage === totalPages}
                                    className={`p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition`}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                      </>
                  )}
              </div>
          ) : currentArticle ? (
              // DETALLE ARTICULO
              <article className="animate-in fade-in max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                  
                  {/* Article Header Image */}
                  {currentArticle.featuredImage ? (
                      <div className="h-64 md:h-96 w-full relative">
                          <img src={currentArticle.featuredImage} alt={currentArticle.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="flex items-center gap-4 text-white/80 text-sm mb-2">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(currentArticle.publishedAt).toLocaleDateString()}</span>
                                    {currentArticle.keyword && <span className="bg-white/20 px-2 py-0.5 rounded text-xs backdrop-blur-sm">{currentArticle.keyword}</span>}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 shadow-black drop-shadow-lg">{currentArticle.title}</h1>
                          </div>
                      </div>
                  ) : (
                      <div className="p-8 pb-0">
                          <h1 className={`text-3xl md:text-5xl font-black mb-6 leading-tight text-gray-900`}>{currentArticle.title}</h1>
                          <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 border-b border-gray-100 pb-8">
                               <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(currentArticle.publishedAt).toLocaleDateString()}</span>
                          </div>
                      </div>
                  )}

                  <div className="p-8 md:p-12">
                      <a href={`${basePath || ''}/blog`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition font-medium">
                          <ArrowLeft className="w-4 h-4" /> Volver al Blog
                      </a>

                      {/* Display Meta Description as Lead Text */}
                      {(currentArticle.metaDescription || currentArticle.description) && (
                          <p className="text-xl text-gray-700 leading-relaxed mb-8 font-serif italic border-l-4 border-gray-800 pl-6 py-2 bg-gray-50 rounded-r-lg">
                              {currentArticle.metaDescription || currentArticle.description}
                          </p>
                      )}

                      <div className="prose prose-lg prose-indigo max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: currentArticle.contentHtml }} />
                      
                      {/* CTA IN ARTICLE */}
                      <div className="mt-16 p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                          <h3 className="text-2xl font-bold mb-3 text-gray-900">¿Te gustó este artículo?</h3>
                          <p className="mb-6 text-gray-600">No te pierdas nuestra oferta exclusiva relacionada con este tema.</p>
                          <a href={basePath || '/'} className={`inline-block font-bold px-8 py-4 rounded-full transition shadow-lg text-white ${ds.primaryBtn}`}>
                              Ver Oferta Principal
                          </a>
                      </div>
                  </div>
              </article>
          ) : (
              <div className="text-center py-20 text-white">Artículo no encontrado.</div>
          )}
      </main>
  );
};