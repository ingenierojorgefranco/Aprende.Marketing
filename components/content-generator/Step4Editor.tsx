import React, { useEffect, useRef, useState } from 'react';
import { ArticleTitleIdea } from '../../services/geminiService';
import { LandingPage } from '../../types';
import { FileText, Save, Copy, Download, RefreshCw, Globe, BarChart, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Code, Undo, Redo, Type, Palette, Eraser, Heading2, Heading3, Check, X, Calendar, Search } from 'lucide-react';

interface Step4EditorProps {
  articleContent: string;
  setArticleContent: (content: string) => void;
  selectedTitle: ArticleTitleIdea | null;
  articleTitle: string;
  setArticleTitle: (title: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
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
  setKeyword?: (val: string) => void; // New Prop
  seoScore: number;
  setSeoScore: (score: number) => void;
  metaDescription: string;
  setMetaDescription: (val: string) => void;
  onSave: () => void;
  saving: boolean;
  onBack: () => void;
  isEditing: boolean;
}

interface SeoCheckItem {
    label: string;
    passed: boolean;
}

export const Step4Editor: React.FC<Step4EditorProps> = ({
  articleContent, setArticleContent, selectedTitle,
  articleTitle, setArticleTitle, slug, setSlug,
  selectedPageId, setSelectedPageId, userPages,
  status, setStatus,
  publishDate, setPublishDate,
  featuredImage, setFeaturedImage,
  keyword, setKeyword, seoScore, setSeoScore,
  metaDescription, setMetaDescription,
  onSave, saving, isEditing
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [seoChecklist, setSeoChecklist] = useState<SeoCheckItem[]>([]);

  // Initialize Editor Content
  useEffect(() => {
    if (editorRef.current && (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>')) {
      editorRef.current.innerHTML = articleContent;
      analyzeSeo(articleContent);
    }
  }, []);

  // Sync Content when toggling Visual mode back
  useEffect(() => {
      if (!showSourceCode && editorRef.current) {
          editorRef.current.innerHTML = articleContent;
      }
  }, [showSourceCode]);

  // Debounced SEO Analysis
  useEffect(() => {
    const handler = setTimeout(() => {
      analyzeSeo(articleContent);
    }, 800);
    return () => clearTimeout(handler);
  }, [articleContent, keyword, articleTitle]);

  // --- CLEAN SLUG HELPER (Internal) ---
  const handleSlugBlur = () => {
      const stopWords = new Set(['y', 'la', 'el', 'en', 'de', 'del', 'un', 'una', 'por', 'con', 'los', 'las', 'al', 'a']);
      const cleaned = slug
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .split(/\s+/) // Split on any whitespace first if user pasted spaces
        .join('-')    // Convert spaces to hyphens temporarily
        .split('-')   // Split by hyphen to filter words
        .filter(word => !stopWords.has(word) && word.length > 0)
        .join('-');
      
      setSlug(cleaned);
  };

  // --- FORMATTER ---
  const formatHTML = (html: string) => {
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    const xml = html.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    xml.split('\r\n').forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        let padding = '';
        for (let i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });
    return formatted.trim();
  };

  const toggleSourceCode = () => {
      if (!showSourceCode) {
          // Switch to Source: Format content
          setArticleContent(formatHTML(articleContent));
      }
      setShowSourceCode(!showSourceCode);
  };

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

    let score = 0;
    const checks: SeoCheckItem[] = [];

    // Rule 1: Title Length
    if (articleTitle && articleTitle.length >= 10 && articleTitle.length <= 70) {
        score += 15;
        checks.push({ label: "Longitud del Título (10-70 car.)", passed: true });
    } else {
        checks.push({ label: "Longitud del Título (10-70 car.)", passed: false });
    }

    // Rule 2: Word Count
    if (words > 300) {
        score += 25;
        checks.push({ label: "Contenido extenso (> 300 palabras)", passed: true });
    } else {
        checks.push({ label: "Contenido extenso (> 300 palabras)", passed: false });
    }

    // Rule 3: Keyword in Title
    let keywordInTitle = false;
    if (keyword && articleTitle.toLowerCase().includes(keyword.toLowerCase())) {
        keywordInTitle = true;
        score += 20;
    }
    checks.push({ label: "Palabra clave en el Título", passed: keywordInTitle });

    // Rule 4: Subheadings
    if (content.includes('<h2>')) {
        score += 10;
        checks.push({ label: "Uso de subtítulos (H2)", passed: true });
    } else {
        checks.push({ label: "Uso de subtítulos (H2)", passed: false });
    }

    // Rule 5: Keyword Density (Simplified)
    let densityPassed = false;
    if (keyword && words > 0) {
        const escapedKeyword = escapeRegExp(keyword);
        try {
            const regex = new RegExp(escapedKeyword, 'gi');
            const matches = text.match(regex);
            const count = matches ? matches.length : 0;
            if (count > 0) {
                densityPassed = true;
                score += 20;
            }
        } catch(e) {}
    }
    checks.push({ label: "Palabra clave en el contenido", passed: densityPassed });

    // Rule 6: Image
    if (content.includes('<img') || featuredImage) {
        score += 10;
        checks.push({ label: "Contiene imágenes", passed: true });
    } else {
        checks.push({ label: "Contiene imágenes", passed: false });
    }

    setSeoChecklist(checks);
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
    fileDownload.download = `${articleTitle || 'articulo'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  // SEO Score Color
  const validSeoScore = isNaN(seoScore) ? 0 : seoScore;
  const scoreColor = validSeoScore > 80 ? 'text-green-500' : validSeoScore > 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-500">
      
      {/* MAIN EDITOR */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* TOP BAR */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{articleTitle || "Sin título"}</h3>
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
                onClick={toggleSourceCode}
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
                 spellCheck={false}
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

          <div className="space-y-4">
            
            {/* Title Input */}
            <div>
               <div className="flex justify-between mb-1">
                   <label className="text-xs text-gray-400">Título Artículo (H1)</label>
                   <span className="text-[10px] text-gray-500">{articleTitle.length}/70</span>
               </div>
               <input 
                  type="text" 
                  value={articleTitle} 
                  onChange={(e) => setArticleTitle(e.target.value)} 
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
               />
            </div>

            {/* Slug Input */}
            <div>
               <label className="text-xs text-gray-400 block mb-1">Slug (URL amigable)</label>
               <input 
                  type="text" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)}
                  onBlur={handleSlugBlur}
                  placeholder="mi-titulo-genial"
                  className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 outline-none focus:border-blue-500"
               />
            </div>

            {/* Keyword Input */}
            <div>
                <label className="text-xs text-gray-400 block mb-1">Palabra Clave (SEO)</label>
                <div className="relative">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword && setKeyword(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 pl-7 text-xs text-white outline-none focus:border-green-500"
                        placeholder="ej: marketing digital"
                    />
                    <Search className="absolute top-2 left-2 w-3 h-3 text-gray-500" />
                </div>
            </div>

            {/* Meta Description Input */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-400">Meta Descripción</label>
                    <span className={`text-[10px] ${(metaDescription || '').length > 155 ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                        {(metaDescription || '').length}/155
                    </span>
                </div>
                <textarea
                    value={metaDescription || ''}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className={`w-full bg-black border rounded px-2 py-1.5 text-xs text-white outline-none resize-none ${(metaDescription || '').length > 155 ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'}`}
                    placeholder="Resumen atractivo para Google..."
                />
            </div>

            {/* Publication Date */}
            <div>
                <label className="text-xs text-gray-400 block mb-1">Fecha de Publicación</label>
                <div className="relative group cursor-pointer" onClick={() => dateInputRef.current?.showPicker()}>
                    <Calendar className="absolute top-1.5 left-2 w-4 h-4 text-gray-500 group-hover:text-blue-400 pointer-events-none" />
                    <input
                    ref={dateInputRef}
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 pl-8 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                    />
                </div>
            </div>

            {/* Status & Page Link */}
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
                <label className="text-xs text-gray-400 block mb-1">Vincular a Page</label>
                <select
                    value={selectedPageId}
                    onChange={(e) => setSelectedPageId(e.target.value)}
                    className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                >
                    <option value="">-- Ninguna --</option>
                    {userPages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
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

          </div>
        </div>

        {/* SEO Score Checklist */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                <BarChart className="w-4 h-4 text-green-400" /> SEO Score
             </h3>
             <span className={`text-xl font-bold ${scoreColor}`}>{validSeoScore}/100</span>
          </div>

          <div className="space-y-2">
             {seoChecklist.map((check, idx) => (
                 <div key={idx} className="flex items-center gap-2 text-xs">
                     {check.passed ? (
                         <div className="bg-green-900/50 p-0.5 rounded-full border border-green-500/50">
                             <Check className="w-3 h-3 text-green-400" />
                         </div>
                     ) : (
                         <div className="bg-gray-800 p-0.5 rounded-full border border-gray-600">
                             <X className="w-3 h-3 text-gray-500" />
                         </div>
                     )}
                     <span className={check.passed ? 'text-gray-300' : 'text-gray-500'}>{check.label}</span>
                 </div>
             ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-400">
              <span>Palabras: <b className="text-white">{wordCount}</b></span>
              <span>Keyword: <b className="text-white">{keyword}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
};