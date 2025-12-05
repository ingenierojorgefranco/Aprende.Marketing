
import React, { useEffect, useRef, useState } from 'react';
import { ArticleTitleIdea } from '../../services/geminiService';
import { LandingPage } from '../../types';
import { FileText, Save, Copy, Download, RefreshCw, Globe, BarChart } from 'lucide-react';

interface Step4EditorProps {
  articleContent: string;
  setArticleContent: (content: string) => void;
  selectedTitle: ArticleTitleIdea | null;
  selectedPageId: string;
  setSelectedPageId: (id: string) => void;
  userPages: LandingPage[];
  status: 'published' | 'draft' | 'scheduled';
  setStatus: (val: any) => void;
  publishDate: string;
  setPublishDate: (val: string) => void;
  featuredImage: string;
  setFeaturedImage: (val: string) => void;
  keyword: string;
  seoScore: number;
  setSeoScore: (score: number) => void;
  onSave: () => void;
  saving: boolean;
  onBack: () => void; // Not used in UI but passed for consistency if needed
}

export const Step4Editor: React.FC<Step4EditorProps> = ({
  articleContent, setArticleContent, selectedTitle,
  selectedPageId, setSelectedPageId, userPages,
  status, setStatus,
  publishDate, setPublishDate,
  featuredImage, setFeaturedImage,
  keyword, seoScore, setSeoScore,
  onSave, saving
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [keywordDensity, setKeywordDensity] = useState(0);

  // Initialize Editor Content
  useEffect(() => {
    if (editorRef.current && (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>')) {
      editorRef.current.innerHTML = articleContent;
      analyzeSeo(articleContent);
    }
  }, []);

  // Debounced SEO Analysis
  useEffect(() => {
    const handler = setTimeout(() => {
      analyzeSeo(articleContent);
    }, 800);
    return () => clearTimeout(handler);
  }, [articleContent, keyword]);

  const escapeRegExp = (string: string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
  };

  const analyzeSeo = (content: string) => {
    if (!content) return;
    const text = content.replace(/<[^>]*>?/gm, '');
    const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
    setWordCount(words);

    let score = 50;
    if (words > 600) score += 20;
    else if (words > 300) score += 10;

    let density = 0;
    if (keyword && keyword.trim().length > 0 && words > 0) {
      const escapedKeyword = escapeRegExp(keyword);
      try {
        const regex = new RegExp(escapedKeyword, 'gi');
        const matches = text.match(regex);
        const count = matches ? matches.length : 0;
        density = (count / words) * 100;
        if (count > 2) score += 20;
      } catch (e) { }
      if (content.toLowerCase().includes(`<h1>`)) score += 5;
    } else {
      score += 10;
    }

    if (content.includes('<h2>')) score += 5;
    
    // Safety
    if (isNaN(density)) density = 0;
    setKeywordDensity(parseFloat(density.toFixed(2)));
    setSeoScore(Math.min(100, Math.max(0, score)));
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    setArticleContent(e.currentTarget.innerHTML);
  };

  const copyToClipboard = () => {
    if (!editorRef.current) return;
    navigator.clipboard.writeText(editorRef.current.innerHTML);
    alert("HTML copiado al portapapeles");
  };

  const downloadDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + articleContent + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${selectedTitle?.title || 'articulo'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  // SEO Visualization
  const validSeoScore = isNaN(seoScore) ? 0 : seoScore;
  const strokeColor = validSeoScore > 80 ? '#22c55e' : validSeoScore > 50 ? '#eab308' : '#ef4444';

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-500">
      
      {/* MAIN EDITOR */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{selectedTitle?.title}</h3>
              <p className="text-xs text-gray-500">{selectedPageId ? 'Vinculado a Landing Page' : 'Borrador sin vincular'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); onSave(); }} 
              disabled={saving} 
              className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition text-sm font-medium mr-2"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publicar
            </button>
            <button onClick={copyToClipboard} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" title="Copiar HTML"><Copy className="w-5 h-5" /></button>
            <button onClick={downloadDoc} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" title="Descargar Word"><Download className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div
            ref={editorRef}
            className="prose prose-lg max-w-none text-gray-800 focus:outline-none"
            contentEditable
            onInput={handleEditorInput}
            suppressContentEditableWarning={true}
          />
        </div>
      </div>

      {/* SIDEBAR SETTINGS */}
      <div className="w-full lg:w-80 space-y-4 overflow-y-auto pr-2">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-blue-400" /> Configuración
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Landing Page Vinculada</label>
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
              >
                <option value="">-- Sin Vincular --</option>
                {userPages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="scheduled">Programado</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Imagen Destacada (URL)</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
                />
                {featuredImage && <img src={featuredImage} className="w-8 h-8 rounded object-cover border border-gray-700" alt="Preview" />}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Score */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
            <BarChart className="w-4 h-4 text-green-400" /> SEO Score
          </h3>

          <div className="flex items-center justify-center mb-4 relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#374151" strokeWidth="8" fill="transparent" />
              <circle cx="48" cy="48" r="40" stroke={strokeColor} strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * validSeoScore) / 100} className="transition-all duration-1000 ease-out" />
            </svg>
            <span className="absolute text-2xl font-bold text-white">{validSeoScore}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Palabras:</span> <span className="text-white font-mono">{wordCount}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Densidad Keyword:</span> <span className="text-white font-mono">{keywordDensity}%</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Legibilidad:</span> <span className="text-green-400">Buena</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
