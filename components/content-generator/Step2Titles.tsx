import React from 'react';
import { ArticleTitleIdea } from '../../services/geminiService';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

interface Step2TitlesProps {
  titleIdeas: ArticleTitleIdea[];
  onSelectTitle: (idea: ArticleTitleIdea) => void;
  onBack: () => void;
  loading: boolean;
}

export const Step2Titles: React.FC<Step2TitlesProps> = ({ titleIdeas, onSelectTitle, onBack, loading }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <h2 className="text-2xl font-bold text-white mb-2">Selecciona el mejor enfoque</h2>
      <p className="text-gray-400 mb-8 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Hemos analizado tu tema y optimizado estos títulos para maximizar el CTR y las visitas.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {titleIdeas.map((idea, idx) => (
          <div
            key={idx}
            onClick={() => onSelectTitle(idea)}
            className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/50 p-6 rounded-xl cursor-pointer transition group relative overflow-hidden flex flex-col justify-center min-h-[120px]"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition"></div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition leading-snug">{idea.title}</h3>
            {/* Description hidden as requested */}
            {/* <p className="text-sm text-gray-400">{idea.description}</p> */}
            <span className="text-xs text-gray-600 mt-2 block">{idea.title.length} caracteres</span>
          </div>
        ))}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-white font-medium">Generando Estructura...</p>
          </div>
        </div>
      )}
    </div>
  );
};