import React, { useEffect, useRef, useState } from 'react';
import { ArticleTitleIdea } from '../../services/geminiService';
import { LandingPage } from '../../types';
import { FileText, Save, Copy, Download, RefreshCw, Globe, BarChart, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code, Undo, Redo, Type, Palette, Eraser, Heading1, Heading2, Heading3 } from 'lucide-react';

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
  metaDescription: string;
  setMetaDescription: (val: string) => void;
  onSave: () => void;
  saving: boolean;
  onBack: () => void;
  isEditing: boolean; // Nueva prop para saber si es edición
}

export const Step4Editor: React.FC<Step4EditorProps> = ({
  articleContent, setArticleContent, selectedTitle,
  selectedPageId, setSelectedPageId, userPages,
  status, setStatus,
  publishDate, setPublishDate,
  featuredImage, setFeaturedImage,
  keyword, seoScore, setSeoScore,
  metaDescription, setMetaDescription,
  onSave, saving, isEditing
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [keywordDensity, setKeywordDensity] = useState(0);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

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

  // --- EDITOR FUNCTIONALITY ---

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        setArticleContent(editorRef.current.innerHTML);
        checkActiveFormats();
        editorRef.current.focus();
    }
  };

  const checkActiveFormats = () => {
    const formats = ['bold', 'italic', 'underline', 'strikethrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];
    const active = formats.filter(cmd => document.queryCommandState(cmd));
    setActiveFormats(active);
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    setArticleContent(e.currentTarget.innerHTML);
    checkActiveFormats();
  };

  const handleSourceCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticleContent(e.target.value);
    if (editorRef.current) {
        editorRef.current.innerHTML = e.target.value;
    }
  };

  const insertLink = () => {
    const url = prompt("Ingresa la URL del enlace:");
    if (url) execCmd("createLink", url);
  };

  const insertImage = () => {
    const url = prompt("Ingresa la URL de la imagen:");
    if (url) execCmd("insertImage", url);
  };

  const setHeading = (tag: string) => {
      execCmd('formatBlock', tag);
  };

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(articleContent);
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
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* TOP BAR */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{selectedTitle?.title || "Sin título"}</h3>
              <p className="text-xs text-gray-500">{selectedPageId ? 'Vinculado a Landing Page' : 'Borrador sin vincular'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={onSave} 
                disabled={saving} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-bold text-white shadow-md ${saving ? 'bg-gray-400' : isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
              {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Publicar Artículo'}
            </button>
            <div className="h-8 w-px bg-gray-300 mx-1"></div>
            <button onClick={copyToClipboard} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" title="Copiar HTML"><Copy className="w-5 h-5" /></button>
            <button onClick={downloadDoc} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" title="Descargar Word"><Download className="w-5 h-5" /></button>
          </div>
        </div>

        {/* EDITOR TOOLBAR */}
        <div className={`bg-gray-100 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1 ${showSourceCode ? 'opacity-50 pointer-events-none' : ''}`}>
             {/* History */}
             <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
                <button onClick={() => execCmd('undo')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700" title="Deshacer"><Undo className="w-4 h-4"/></button>
                <button onClick={() => execCmd('redo')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700" title="Rehacer"><Redo className="w-4 h-4"/></button>
             </div>

             {/* Headings */}
             <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
                <button onClick={() => setHeading('P')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700 font-serif" title="Párrafo">P</button>
                <button onClick={() => setHeading('H2')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700" title="Título 2"><Heading2 className="w-4 h-4"/></button>
                <button onClick={() => setHeading('H3')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700" title="Título 3"><Heading3 className="w-4 h-4"/></button>
             </div>

             {/* Format */}
             <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
                <button onClick={() => execCmd('bold')} className={`p-1.5 rounded hover:bg-gray-200 ${activeFormats.includes('bold') ? 'bg-gray-300 text-black' : 'text-gray-700'}`} title="Negrita"><Bold className="w-4 h-4"/></button>
                <button onClick={() => execCmd('italic')} className={`p-1.5 rounded hover:bg-gray-200 ${activeFormats.includes('italic') ? 'bg-gray-300 text-black' : 'text-gray-700'}`} title="Cursiva"><Italic className="w-4 h-4"/></button>
                <button onClick={() => execCmd('underline')} className={`p-1.5 rounded hover:bg-gray-200 ${activeFormats.includes('underline') ? 'bg-gray-300 text-black' : 'text-gray-700'}`} title="Subrayado"><Underline className="w-4 h-4"/></button>
                <button onClick={() => execCmd('strikethrough')} className={`p-1.5 rounded hover:bg-gray-200 ${activeFormats.includes('strikethrough') ? 'bg-gray-300 text-black' : 'text-gray-700'}`} title="Tachado"><Strikethrough className="w-4 h-4"/></button>
             </div>

             {/* Alignment */}
             <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
                <button onClick={() => execCmd('justifyLeft')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><AlignLeft className="w-4 h-4"/></button>
                <button onClick={() => execCmd('justifyCenter')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><AlignCenter className="w-4 h-4"/></button>
                <button onClick={() => execCmd('justifyRight')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><AlignRight className="w-4 h-4"/></button>
                <button onClick={() => execCmd('justifyFull')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><AlignJustify className="w-4 h-4"/></button>
             </div>

             {/* Lists */}
             <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
                <button onClick={() => execCmd('insertUnorderedList')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><List className="w-4 h-4"/></button>
                <button onClick={() => execCmd('insertOrderedList')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><ListOrdered className="w-4 h-4"/></button>
             </div>

             {/* Insert */}
             <div className="flex items-center gap-0.5 border-r border-gray-300 pr-2 mr-1">
                <button onClick={insertLink} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><LinkIcon className="w-4 h-4"/></button>
                <button onClick={insertImage} className="p-1.5 rounded hover:bg-gray-200 text-gray-700"><ImageIcon className="w-4 h-4"/></button>
             </div>

             {/* Colors */}
             <div className="flex items-center gap-2 mr-1">
                 <div className="relative group p-1.5 hover:bg-gray-200 rounded cursor-pointer">
                    <Type className="w-4 h-4 text-gray-700" />
                    <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => execCmd('foreColor', e.target.value)} title="Color de Texto" />
                 </div>
                 <div className="relative group p-1.5 hover:bg-gray-200 rounded cursor-pointer">
                    <Palette className="w-4 h-4 text-gray-700" />
                    <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => execCmd('hiliteColor', e.target.value)} title="Color de Fondo" />
                 </div>
             </div>

             <button onClick={() => execCmd('removeFormat')} className="p-1.5 rounded hover:bg-gray-200 text-gray-700 ml-auto" title="Limpiar Formato"><Eraser className="w-4 h-4"/></button>
        </div>

        {/* Source Code Toggle */}
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-1 flex justify-end">
             <button 
                onClick={() => setShowSourceCode(!showSourceCode)}
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition ${showSourceCode ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
             >
                 <Code className="w-3 h-3" /> {showSourceCode ? 'Volver a Visual' : 'Ver Código Fuente'}
             </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white relative">
          {showSourceCode ? (
              <textarea 
                 className="w-full h-full p-6 font-mono text-sm text-gray-800 bg-gray-50 outline-none resize-none"
                 value={articleContent}
                 onChange={handleSourceCodeChange}
              />
          ) : (
              <div
                ref={editorRef}
                className="prose prose-lg max-w-none text-gray-800 focus:outline-none p-8 min-h-full"
                contentEditable
                onInput={handleEditorInput}
                onMouseUp={checkActiveFormats}
                onKeyUp={checkActiveFormats}
                suppressContentEditableWarning={true}
              />
          )}
        </div>
      </div>

      {/* SIDEBAR SETTINGS */}
      <div className="w-full lg:w-80 space-y-4 overflow-y-auto pr-2 pb-10">
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
                className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
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
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
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
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
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
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                />
                {featuredImage && <img src={featuredImage} className="w-8 h-8 rounded object-cover border border-gray-700" alt="Preview" />}
              </div>
            </div>

            {/* Meta Description Input */}
            <div className="pt-2 border-t border-gray-800 mt-2">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-400">Meta Descripción</label>
                    <span className={`text-[10px] ${(metaDescription || '').length > 155 ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                        {(metaDescription || '').length}/155
                    </span>
                </div>
                <textarea
                    value={metaDescription || ''}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={4}
                    className={`w-full bg-black border rounded px-2 py-1.5 text-xs text-white outline-none resize-none ${(metaDescription || '').length > 155 ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'}`}
                    placeholder="Resumen atractivo para Google..."
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">
                    Incluye un llamado a la acción (CTA) para mejorar el CTR.
                </p>
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