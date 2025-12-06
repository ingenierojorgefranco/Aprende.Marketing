import React, { useEffect, useState } from 'react';
import { Article, GeneratedPageContent } from '../../../types';
import { api } from '../../../services/api';
import { Loader2, Calendar, ArrowRight, ArrowLeft, Target } from 'lucide-react';

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

  useEffect(() => {
     if (viewMode === 'blog-list' && pageId) {
         setBlogLoading(true);
         api.getPublicBlogArticles(pageId).then(setBlogArticles).finally(() => setBlogLoading(false));
     } else if (viewMode === 'blog-post' && articleSlug) {
         setBlogLoading(true);
         api.getPublicArticle(articleSlug).then(setCurrentArticle).finally(() => setBlogLoading(false));
     }
  }, [viewMode, pageId, articleSlug]);

  return (
      <main className={`pt-32 pb-20 min-h-[80vh] container mx-auto px-6 max-w-5xl`}>
          {blogLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className={`w-10 h-10 animate-spin ${ds.accentText.replace('text-', 'text-')}`} />
                  <p className="mt-4 opacity-70">Cargando contenido...</p>
              </div>
          ) : viewMode === 'blog-list' ? (
              // LISTA DE ARTICULOS
              <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center mb-16">
                      <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog & Novedades</h1>
                      <p className="text-lg opacity-70 max-w-2xl mx-auto">Contenido exclusivo para complementar tu aprendizaje.</p>
                  </div>
                  
                  {blogArticles.length === 0 ? (
                      <div className="text-center py-20 opacity-50">No hay artículos publicados aún.</div>
                  ) : (
                      <div className="grid md:grid-cols-2 gap-8">
                          {blogArticles.map(article => (
                              <a key={article.id} href={`${basePath || ''}/blog/${article.slug}`} className={`group block rounded-2xl overflow-hidden border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                                  {article.featuredImage && (
                                      <div className="h-56 overflow-hidden">
                                          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                      </div>
                                  )}
                                  <div className="p-8">
                                      <div className="flex items-center gap-2 text-xs opacity-60 mb-3">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(article.publishedAt).toLocaleDateString()}
                                      </div>
                                      <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} transition`}>{article.title}</h2>
                                      <p className="opacity-70 line-clamp-3 mb-4">{article.description}</p>
                                      <span className={`text-sm font-bold flex items-center gap-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Leer Artículo <ArrowRight className="w-4 h-4" /></span>
                                  </div>
                              </a>
                          ))}
                      </div>
                  )}
              </div>
          ) : currentArticle ? (
              // DETALLE ARTICULO
              <article className="animate-in fade-in max-w-3xl mx-auto">
                  <a href={`${basePath || ''}/blog`} className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-8 transition"><ArrowLeft className="w-4 h-4" /> Volver al Blog</a>
                  
                  <header className="mb-10 text-center">
                       <div className="flex items-center justify-center gap-4 text-sm opacity-60 mb-4">
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(currentArticle.publishedAt).toLocaleDateString()}</span>
                           {currentArticle.keyword && <span className="flex items-center gap-1"><Target className="w-3 h-3"/> {currentArticle.keyword}</span>}
                       </div>
                       <h1 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentArticle.title}</h1>
                       <p className="text-xl opacity-80 leading-relaxed">{currentArticle.description}</p>
                  </header>

                  {currentArticle.featuredImage && (
                      <div className="rounded-2xl overflow-hidden shadow-2xl mb-12">
                          <img src={currentArticle.featuredImage} alt={currentArticle.title} className="w-full object-cover" />
                      </div>
                  )}

                  <div className={`prose prose-lg ${isDark ? 'prose-invert' : ''} max-w-none`} dangerouslySetInnerHTML={{ __html: currentArticle.contentHtml }} />
                  
                  {/* CTA IN ARTICLE */}
                  <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center shadow-2xl">
                      <h3 className="text-2xl font-bold mb-4">¿Te gustó este artículo?</h3>
                      <p className="mb-6 opacity-90">No te pierdas nuestra oferta exclusiva relacionada con este tema.</p>
                      <a href={basePath || '/'} className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-lg">
                          Ver Oferta Principal
                      </a>
                  </div>
              </article>
          ) : (
              <div className="text-center py-20">Artículo no encontrado.</div>
          )}
      </main>
  );
};
