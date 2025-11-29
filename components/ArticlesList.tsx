
import React from 'react';
import { Article } from '../types';
import { BookOpen, Calendar, Search, Edit2, BarChart, FileText } from 'lucide-react';

interface ArticlesListProps {
  articles: Article[];
  onCreateNew: () => void;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({ articles, onCreateNew }) => {
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
          {articles.map((article) => (
            <div key={article.id} className="bg-gray-900 rounded-xl border border-gray-800 hover:border-primary/50 transition duration-300 group flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded border ${
                        article.seoScore >= 80 ? 'bg-green-900/30 text-green-400 border-green-900/50' :
                        article.seoScore >= 50 ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50' :
                        'bg-red-900/30 text-red-400 border-red-900/50'
                    }`}>
                        SEO: {article.seoScore}
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                  {article.description}
                </p>
                
                {article.keyword && (
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                       <Search className="w-3 h-3" />
                       Keyword: <span className="text-gray-300">{article.keyword}</span>
                   </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-800 bg-gray-900/50 rounded-b-xl flex justify-between items-center">
                  <button className="text-gray-400 hover:text-white text-sm font-medium transition flex items-center gap-2">
                      <Edit2 className="w-4 h-4" /> Editar
                  </button>
                  <button className="text-primary hover:text-indigo-400 text-sm font-medium transition flex items-center gap-2">
                      <BarChart className="w-4 h-4" /> Ver Análisis
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
