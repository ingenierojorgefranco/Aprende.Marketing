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
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
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
         api.getPublicArticle(articleSlug).then(article => {
             setCurrentArticle(article);
             // Cargar recomendados si tenemos el pageId
             if (pageId && article) {
                 api.getPublicBlogArticles(pageId).then(allArticles => {
                     // Filtrar el actual, mezclar y tomar 3
                     const others = allArticles.filter(a => a.id !== article.id);
                     const shuffled = others.sort(() => 0.5 - Math.random());
                     setRecommendedArticles(shuffled.slice(0, 2));
                 });
             }
         }).finally(() => setBlogLoading(false));
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
              <article className="animate-in fade-in max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                  
                  <div className="p-8 md:p-12">
                      <a href={`${basePath || ''}/blog`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition font-medium">
                          <ArrowLeft className="w-4 h-4" /> Volver al Blog
                      </a>

                      {/* Header Content */}
                      <div className="text-center mb-10">
                          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">{currentArticle.title}</h1>
                      </div>

                      {/* Display Meta Description as Lead Text */}
                      {(currentArticle.metaDescription || currentArticle.description) && (
                          <p className="text-xl text-gray-700 leading-relaxed mb-10 font-serif italic border-l-4 border-gray-800 pl-6 py-2 bg-gray-50 rounded-r-lg">
                              {currentArticle.metaDescription || currentArticle.description}
                          </p>
                      )}

                      {/* Main Image moved below description */}
                      {currentArticle.featuredImage && (
                          <img 
                              src={currentArticle.featuredImage} 
                              alt={currentArticle.title} 
                              className="w-full rounded-2xl shadow-2xl mb-12 object-cover aspect-video" 
                          />
                      )}

                      {/* Article Content */}
                      <div 
                          className="prose prose-lg prose-indigo max-w-none text-gray-800" 
                          style={{ fontSize: '1.3rem', lineHeight: '1.8' }}
                          dangerouslySetInnerHTML={{ __html: currentArticle.contentHtml }} 
                      />


                      {/* RECOMMENDED READING SECTION */}
                      {recommendedArticles.length > 0 && (
                          <div className="mt-20 pt-10 border-t border-gray-200">
                              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Te recomendamos leer también</h3>
                              <div className="grid md:grid-cols-2 gap-8">
                                  {recommendedArticles.map(rec => (
                                      <a key={rec.id} href={`${basePath || ''}/blog/${rec.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                          <div className="h-48 overflow-hidden bg-gray-900 relative">
                                              {rec.featuredImage ? (
                                                  <img src={rec.featuredImage} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100" />
                                              ) : (
                                                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                      <div className="w-12 h-1 bg-orange-500/30 rounded-full"></div>
                                                  </div>
                                              )}
                                          </div>
                                          <div className="p-6 flex flex-col items-center text-center flex-1">
                                              <h4 className="font-black text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">{rec.title}</h4>
                                              <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                                                  {rec.metaDescription || rec.description}
                                              </p>
                                              <span className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:-translate-y-1">
                                                  Leer más <ArrowRight className="ml-2 w-4 h-4"/>
                                              </span>
                                          </div>
                                      </a>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </article>
          ) : (
              <div className="text-center py-20 text-white">Artículo no encontrado.</div>
          )}
      </main>
  );
};