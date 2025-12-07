import React from 'react';
import { Article } from '../types';
import { BookOpen, Calendar, Search, Edit2, BarChart, FileText, Globe, Clock, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArticlesListProps {
  articles: Article[];
  onCreateNew: () => void;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({ articles, onCreateNew }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Biblioteca de Artículos</h2>
          <p className="text-gray-400 text-sm">Gestiona todo tu contenido generado por IA en un solo lugar.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2 font-medium"
        >
          <BookOpen className="w-4 h-4" />
          Crear Nuevo
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-24 bg-gray-900 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-white font-bold mb-1">No tienes artículos creados</h3>
          <p className="text-gray-400 text-sm mb-6">Usa el generador IA para crear tu primer post en segundos.</p>
          <button 
            onClick={onCreateNew}
            className="text-primary hover:text-white transition text-sm font-medium border border-primary hover:bg-primary px-4 py-2 rounded-lg"
          >
            Ir al Generador
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
             // Construcción de la URL pública
             // Prioriza el subdominio limpio. Si no existe, usa el pageId como fallback (el backend ahora soporta ID).
             const pageSlug = article.pageSubdomain 
                ? article.pageSubdomain.replace('.generatorlanding.com', '') 
                : article.pageId;
             
             // URL pública del Artículo
             const articleUrl = pageSlug ? `/admin/lp/${pageSlug}/blog/${article.slug}` : '#';
             
             // URL pública de la Landing Page Principal
             const landingUrl = pageSlug ? `/admin/lp/${pageSlug}` : '#';

             return (
                <div key={article.id} className="bg-gray-900 rounded-xl border border-gray-800 hover:border-primary/50 transition duration-300 group flex flex-col h-full overflow-hidden">
                {article.featuredImage && (
                    <div className="h-40 w-full bg-gray-800 relative overflow-hidden">
                        <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col gap-1">
                            <div className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded flex items-center gap-1 w-fit border border-gray-700">
                                <Calendar className="w-3 h-3" />
                                {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                            </div>
                            {article.status === 'scheduled' && (
                                <div className="text-xs text-orange-400 flex items-center gap-1 font-bold">
                                    <Clock className="w-3 h-3" /> Programado
                                </div>
                            )}
                        </div>
                        
                        <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                            article.seoScore >= 80 ? 'bg-green-900/30 text-green-400 border-green-900/50' :
                            article.seoScore >= 50 ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50' :
                            'bg-red-900/30 text-red-400 border-red-900/50'
                        }`}>
                            SEO: {article.seoScore}
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition leading-tight">
                    {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                    {article.metaDescription || article.description}
                    </p>
                    
                    <div className="space-y-2 mt-auto pt-4 border-t border-gray-800/50">
                        {article.pageId ? (
                            <div className="flex items-center gap-2 text-xs text-blue-400">
                                <Globe className="w-3 h-3" />
                                Vinculado a: 
                                <a 
                                    href={landingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="text-blue-400 hover:text-blue-300 hover:underline font-medium truncate max-w-[150px] transition"
                                    title="Ir a Landing Page"
                                >
                                    {article.pageName || article.pageSubdomain || "Landing Page"}
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Globe className="w-3 h-3" /> Sin vincular
                            </div>
                        )}
                        {article.keyword && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Search className="w-3 h-3" />
                            Keyword: <span className="text-gray-300">{article.keyword}</span>
                        </div>
                        )}
                    </div>
                </div>
                
                <div className="p-3 bg-gray-950 border-t border-gray-800 grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => navigate(`/dashboard/articles/edit/${article.id}`)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-2 border border-transparent"
                    >
                        <Edit2 className="w-3.5 h-3.5" /> EDITAR
                    </button>
                    
                    {article.pageId && pageSlug && (
                        <a 
                            href={articleUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-gray-800 hover:bg-primary hover:text-white text-gray-300 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-2 border border-gray-700 hover:border-primary"
                            title="Ver artículo online"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> VER ARTÍCULO
                        </a>
                    )}
                </div>
                </div>
             );
          })}
        </div>
      )}
    </div>
  );
};