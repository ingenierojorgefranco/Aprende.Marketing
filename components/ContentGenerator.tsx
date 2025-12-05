import React, { useState, useEffect, useRef } from 'react';
import { generateArticleTitles, generateArticleOutline, generateFullArticle, ArticleTitleIdea } from '../services/geminiService';
import { api } from '../services/api';
import { BookOpen, Search, List, FileText, Download, Copy, Check, RefreshCw, ArrowLeft, ArrowRight, Wand2, BarChart, ChevronRight, Type, Link as LinkIcon, Sparkles, Save, Briefcase, Calendar, Image, Globe, Eye, Trash2, GripVertical, Heading1, Heading2, Heading3, Heading4, AlertTriangle, X } from 'lucide-react';
import { Article, Project, LandingPage } from '../types';

interface ContentGeneratorProps {
    onSave?: (article: Omit<Article, 'id' | 'createdAt'>) => Promise<void>;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Error Handling State
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Data State
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [keyword, setKeyword] = useState('');

  // Projects Integration
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  // Landing Pages Integration (Para vincular articulo)
  const [userPages, setUserPages] = useState<LandingPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  const [titleIdeas, setTitleIdeas] = useState<ArticleTitleIdea[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<ArticleTitleIdea | null>(null);
  
  const [outline, setOutline] = useState<string[]>([]);
  const [ctaLink, setCtaLink] = useState('');
  
  const [articleContent, setArticleContent] = useState('');
  // Ref para el editor para evitar re-renders cíclicos que causan pantalla blanca
  const editorRef = useRef<HTMLDivElement>(null);
  
  // SEO & Meta fields
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  
  // SEO Metrics State
  const [seoScore, setSeoScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [keywordDensity, setKeywordDensity] = useState(0);

  // Drag & Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Load projects and pages on mount
  useEffect(() => {
    const fetchContext = async () => {
        try {
            const [projects, pages] = await Promise.all([
                api.getProjects(),
                api.getPages()
            ]);
            setUserProjects(projects || []);
            setUserPages(pages || []);
        } catch (e) {
            console.error("Failed to load context data", e);
        }
    };
    fetchContext();
  }, []);

  // Initialize Editor Content safely when entering Step 4
  useEffect(() => {
    if (step === 4 && editorRef.current) {
        // Solo inyectar HTML si el editor está vacío para no sobrescribir trabajo en curso
        if (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>') {
            editorRef.current.innerHTML = articleContent;
        }
        // Force initial analysis
        analyzeSeo(articleContent);
    }
  }, [step]); // Removed articleContent dependency to avoid loops, explicit analysis triggers only

  // DEBOUNCED SEO ANALYSIS
  useEffect(() => {
    if (step !== 4) return;
    
    const handler = setTimeout(() => {
        analyzeSeo(articleContent);
    }, 800); // 800ms delay to prevent freezing on large texts

    return () => clearTimeout(handler);
  }, [articleContent, keyword, step]);

  const handleProjectSelect = (projectId: string) => {
      setSelectedProject(projectId);
      const proj = userProjects.find(p => p.id === projectId);
      
      if (proj) {
          // Auto-fill context
          setTopic(proj.niche || '');
          setObjective(proj.mainGoal ? `Atraer clientes interesados en ${proj.mainGoal}` : '');
          
          if (proj.affiliateLinks && proj.affiliateLinks.length > 0) {
              setCtaLink(proj.affiliateLinks[0].url);
          }
      }
  };

  const handleTitleSelect = (idea: ArticleTitleIdea) => {
      handleSelectTitle(idea);
      // Auto-generate basic metadata from title
      setMetaTitle(idea.title);
      setMetaDescription(idea.description);
      setSlug(idea.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  // --- ACTIONS ---

  const handleGenerateTitles = async () => {
    if (!topic || !objective) return alert("Por favor completa el tema y el objetivo.");
    setLoading(true);
    try {
        const titles = await generateArticleTitles(topic, objective, keyword);
        if (Array.isArray(titles)) {
            setTitleIdeas(titles);
            setStep(2);
        } else {
            alert("La IA no devolvió el formato esperado. Intenta de nuevo.");
        }
    } catch (e) {
        alert("Error generando títulos.");
    } finally {
        setLoading(false);
    }
  };

  const handleSelectTitle = async (idea: ArticleTitleIdea) => {
      setSelectedTitle(idea);
      setLoading(true);
      try {
          const generatedOutline = await generateArticleOutline(idea.title, objective);
          if (Array.isArray(generatedOutline)) {
              setOutline(generatedOutline);
              setStep(3);
          } else {
              setOutline(["H2: Introducción", "H2: Contenido Principal", "H2: Conclusión"]); // Fallback
              setStep(3);
          }
      } catch (e) {
          alert("Error generando esquema.");
      } finally {
          setLoading(false);
      }
  };

  const handleGenerateArticle = async () => {
      if (!selectedTitle) return;
      setLoading(true);

      // Pass project context to generator if selected
      const projectContext = userProjects.find(p => p.id === selectedProject);

      try {
          const content = await generateFullArticle(selectedTitle.title, outline, objective, ctaLink || '#', keyword, projectContext);
          setArticleContent(content || "<p>Error en la generación. Intenta de nuevo.</p>");
          setStep(4);
      } catch (e) {
          alert("Error escribiendo artículo.");
      } finally {
          setLoading(false);
      }
  };

  const handleSaveArticle = async () => {
      if (!selectedTitle || !onSave) return;
      
      setSaving(true);
      setSaveError(null); // Resetear errores previos

      try {
          // Intentar guardar en base de datos
          await onSave({
              pageId: selectedPageId || undefined,
              title: selectedTitle.title,
              slug: slug || selectedTitle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: selectedTitle.description,
              contentHtml: articleContent,
              featuredImage: featuredImage,
              keyword: keyword,
              seoScore: seoScore,
              metaTitle: metaTitle,
              metaDescription: metaDescription,
              status: status,
              publishedAt: new Date(publishDate)
          });
          
          alert("Artículo guardado correctamente en la Base de Datos.");
      } catch (e: any) {
          console.error("Error Saving Article:", e);
          
          // Capturar el mensaje exacto del error para mostrarlo
          let errorMsg = "Error desconocido.";
          if (typeof e === 'string') errorMsg = e;
          else if (e instanceof Error) errorMsg = e.message;
          else if (e?.error) errorMsg = e.error;
          else errorMsg = JSON.stringify(e);

          setSaveError(errorMsg);
      } finally {
          setSaving(false);
      }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
      // Just update state, analysis is handled by debounce effect
      const newContent = e.currentTarget.innerHTML;
      setArticleContent(newContent);
  };

  // --- HIERARCHY HELPERS ---
  const getHeadingInfo = (text: string) => {
      if (!text || typeof text !== 'string') return { level: 2, content: "Sección sin título", tag: 'H2' };
      
      const match = text.match(/^(H[1-6]):\s*(.*)/i);
      if (match) {
          return {
              level: parseInt(match[1].replace('H', '')),
              content: match[2],
              tag: match[1].toUpperCase()
          };
      }
      // Fallback: Default to H2 if not specified, except if it looks like title
      return { level: 2, content: text, tag: 'H2' };
  };

  // Find how many items belong to the current block (children)
  const getBlockSize = (startIndex: number, items: string[]): number => {
      const parentInfo = getHeadingInfo(items[startIndex]);
      let size = 1; // Includes self

      for (let i = startIndex + 1; i < items.length; i++) {
          const childInfo = getHeadingInfo(items[i]);
          if (childInfo.level > parentInfo.level) {
              size++;
          } else {
              break; // Found a sibling or higher level, block ends
          }
      }
      return size;
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
      // Prevent dragging H1 (index 0)
      if (index === 0) {
          e.preventDefault();
          return;
      }
      setDraggedItemIndex(index);
      e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault(); // Necessary to allow dropping
      
      // H1 (index 0) cannot be dropped onto or above
      if (index === 0) {
          e.dataTransfer.dropEffect = "none";
          setDragOverIndex(null);
          return;
      }

      setDragOverIndex(index);
      e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = () => {
      setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      setDragOverIndex(null);

      if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
      if (targetIndex === 0) return; // Cannot drop above H1

      const newOutline = [...outline];
      
      // Calculate the block to move
      const blockSize = getBlockSize(draggedItemIndex, outline);
      const itemsToMove = newOutline.splice(draggedItemIndex, blockSize);
      
      // Adjust target index if we removed items before it
      let adjustedTargetIndex = targetIndex;
      if (draggedItemIndex < targetIndex) {
          adjustedTargetIndex -= blockSize;
      }

      // Insert the block at the new position
      newOutline.splice(adjustedTargetIndex, 0, ...itemsToMove);
      
      setOutline(newOutline);
      setDraggedItemIndex(null);
  };

  const handleDeleteItem = (index: number) => {
      if (index === 0) return alert("No puedes eliminar el Título Principal (H1).");

      const parentInfo = getHeadingInfo(outline[index]);
      
      // Calculate children count
      let childrenCount = 0;
      for (let i = index + 1; i < outline.length; i++) {
          const childInfo = getHeadingInfo(outline[i]);
          if (childInfo.level > parentInfo.level) {
              childrenCount++;
          } else {
              break;
          }
      }

      if (childrenCount > 0) {
          const confirmDelete = window.confirm(
              `Este bloque contiene ${childrenCount} sub-secciones (H${parentInfo.level + 1}...). ` +
              `¿Estás seguro de que quieres eliminar TODO el bloque de contenidos?`
          );
          if (!confirmDelete) return;
      }

      // Remove item + children
      const newOutline = [...outline];
      newOutline.splice(index, 1 + childrenCount);
      setOutline(newOutline);
  };

  // --- SEO ANALYSIS ---
  const escapeRegExp = (string: string) => {
    return string ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
  };

  const analyzeSeo = (content: string) => {
      if (!content || typeof content !== 'string') return;

      const text = content.replace(/<[^>]*>?/gm, ''); // Strip HTML
      const words = text ? text.split(/\s+/).filter(w => w && w.length > 0).length : 0;
      setWordCount(words);

      let score = 50; // Base score
      
      // Word count factor
      if (words > 600) score += 20;
      else if (words > 300) score += 10;

      // Keyword factor
      let density = 0;
      if (keyword && keyword.trim().length > 0 && words > 0) {
          const escapedKeyword = escapeRegExp(keyword);
          try {
              const regex = new RegExp(escapedKeyword, 'gi');
              const matches = text.match(regex);
              const count = matches ? matches.length : 0;
              density = (count / words) * 100;
              
              if (count > 2) score += 20;
          } catch(e) {
              console.warn("Invalid regex in SEO analysis", e);
          }
          if (content.toLowerCase().includes(`<h1>`)) score += 5; // H1 exists (assumed in content or separate)
      } else {
          score += 10; // Neutral bonus
      }

      // Headers factor
      if (content.includes('<h2>')) score += 5;
      
      // Safety checks
      if (isNaN(density) || !isFinite(density)) density = 0;
      setKeywordDensity(parseFloat(density.toFixed(2)));
      setSeoScore(Math.min(100, Math.max(0, score)));
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

  // --- RENDER STEPS ---

  // STEP 1: INPUT
  const renderStep1 = () => (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Generador de Artículos IA</h2>
              <p className="text-gray-400">Crea contenido optimizado para tu blog en segundos.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
               {/* PROJECT SELECTOR */}
               <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed">
                    <label className="block text-xs font-bold text-white mb-2 flex items-center gap-2">
                        <Briefcase className="w-3 h-3 text-primary" /> Contexto (Proyecto)
                    </label>
                    <select 
                        value={selectedProject}
                        onChange={(e) => handleProjectSelect(e.target.value)}
                        className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white outline-none focus:border-primary text-sm"
                    >
                        <option value="">-- Ninguno --</option>
                        {userProjects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* LANDING PAGE SELECTOR */}
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed">
                    <label className="block text-xs font-bold text-white mb-2 flex items-center gap-2">
                        <Globe className="w-3 h-3 text-green-400" /> Publicar en (Landing Page)
                    </label>
                    <select 
                        value={selectedPageId}
                        onChange={(e) => setSelectedPageId(e.target.value)}
                        className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500 text-sm"
                    >
                        <option value="">-- Sin vincular --</option>
                        {userPages.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tema o Título Tentativo</label>
                  <div className="relative">
                      <BookOpen className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
                      <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition"
                        placeholder="Ej: Tendencias de Microblading 2024"
                      />
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo del Artículo</label>
                  <div className="relative">
                      <Wand2 className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
                      <input 
                        type="text" 
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition"
                        placeholder="Ej: Atraer tráfico para vender mi curso online"
                      />
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Palabra Clave Objetivo (SEO)</label>
                  <div className="relative">
                      <Search className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
                      <input 
                        type="text" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition"
                        placeholder="Ej: curso de microblading online"
                      />
                  </div>
              </div>

              <button 
                onClick={handleGenerateTitles}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generar Ideas de Títulos
              </button>
          </div>
      </div>
  );

  // STEP 2: SELECT TITLE
  const renderStep2 = () => (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
          <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm"><ArrowLeft className="w-4 h-4"/> Volver</button>
          
          <h2 className="text-2xl font-bold text-white mb-6">Selecciona el mejor enfoque</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
              {titleIdeas.map((idea, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleTitleSelect(idea)}
                    className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/50 p-6 rounded-xl cursor-pointer transition group relative overflow-hidden"
                  >
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition"></div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition">{idea.title}</h3>
                      <p className="text-sm text-gray-400">{idea.description}</p>
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

  // STEP 3: OUTLINE
  const renderStep3 = () => (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
          <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm"><ArrowLeft className="w-4 h-4"/> Volver</button>
          
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 bg-gray-800/50">
                  <h2 className="text-xl font-bold text-white mb-1">Estructura del Artículo</h2>
                  <p className="text-sm text-gray-400">Arrastra para reordenar bloques completos. <span className="text-yellow-400">Nota: Al eliminar un título padre, se eliminarán sus hijos.</span></p>
              </div>
              
              <div className="p-6 space-y-1">
                  {outline.map((item, idx) => {
                      const { level, content, tag } = getHeadingInfo(item);
                      
                      // Calculate indentation margin based on heading level
                      const indentClass = level === 1 ? '' : level === 2 ? 'ml-4' : level === 3 ? 'ml-10' : 'ml-16';
                      
                      // Visual drop indicator (Top Border)
                      const isDragOver = dragOverIndex === idx;

                      // Styles for hierarchy
                      const headingStyle = level === 1 ? 'border-l-4 border-blue-500 bg-blue-900/20' : 
                                           level === 2 ? 'border-l-2 border-gray-600 bg-gray-800/50' : 
                                           'border-l border-gray-700 bg-black/20';

                      return (
                        <div 
                            key={idx}
                            draggable={level !== 1} // H1 is locked
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, idx)}
                            className={`
                                relative flex items-center gap-3 p-3 rounded transition-all
                                ${indentClass}
                                ${headingStyle}
                                ${draggedItemIndex === idx ? 'opacity-30' : ''}
                                ${isDragOver ? 'border-t-2 border-t-primary mt-1 pt-3' : 'border-gray-800 border-t border-b-0'}
                            `}
                        >
                            <div className={`cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-300 ${level === 1 ? 'invisible' : ''}`}>
                                <GripVertical className="w-4 h-4" />
                            </div>
                            
                            {/* Heading Badge */}
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[30px] text-center
                                ${level === 1 ? 'bg-blue-600 text-white' : 
                                  level === 2 ? 'bg-gray-700 text-gray-200' : 
                                  level === 3 ? 'bg-gray-800 text-gray-400' : 'bg-transparent text-gray-500 border border-gray-700'}
                            `}>
                                {tag}
                            </div>
                            
                            <input 
                                value={item} // Raw string "H2: Title"
                                onChange={(e) => {
                                    const newOutline = [...outline];
                                    newOutline[idx] = e.target.value;
                                    setOutline(newOutline);
                                }}
                                className={`flex-1 bg-transparent outline-none ${level === 1 ? 'text-lg font-bold text-white' : 'text-sm text-gray-300'}`}
                            />

                            <button 
                                onClick={() => handleDeleteItem(idx)}
                                className={`text-gray-600 hover:text-red-500 p-1 rounded transition ${level === 1 ? 'invisible' : ''}`}
                                title="Eliminar sección"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      );
                  })}
                  
                  <div className="mt-6 flex justify-center gap-4">
                        <button 
                            onClick={() => setOutline([...outline, "H2: Nueva Sección"])}
                            className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition"
                        >
                            + H2
                        </button>
                        <button 
                            onClick={() => setOutline([...outline, "H3: Nuevo Subtítulo"])}
                            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg flex items-center gap-1 transition"
                        >
                            + H3
                        </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-800">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Enlace de Llamado a la Acción (CTA)</label>
                      <div className="flex gap-2">
                          <div className="relative flex-1">
                              <LinkIcon className="absolute top-3 left-3 w-4 h-4 text-gray-500" />
                              <input 
                                type="text" 
                                value={ctaLink}
                                onChange={(e) => setCtaLink(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-blue-500 outline-none"
                                placeholder="https://tu-curso.com/oferta"
                              />
                          </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">La IA insertará este enlace de forma natural en el contenido.</p>
                  </div>
              </div>
              
              <div className="p-6 bg-gray-800/30 border-t border-gray-800 flex justify-end">
                  <button 
                    onClick={handleGenerateArticle}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-900/30"
                  >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Type className="w-5 h-5" />}
                      Redactar Artículo Completo
                  </button>
              </div>
          </div>
      </div>
  );

  // STEP 4: EDITOR & RESULTS
  const renderStep4 = () => {
    // Cálculo seguro del stroke para el SVG del score
    const validSeoScore = isNaN(seoScore) ? 0 : seoScore;
    const strokeColor = validSeoScore > 80 ? '#22c55e' : validSeoScore > 50 ? '#eab308' : '#ef4444';
    
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-500">
          
          {/* Main Editor */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
              {/* Editor Toolbar */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText className="w-5 h-5" /></div>
                      <div>
                          <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{selectedTitle?.title}</h3>
                          <p className="text-xs text-gray-500">{selectedPageId ? 'Vinculado a Landing Page' : 'Borrador sin vincular'}</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      {onSave && (
                        <button onClick={handleSaveArticle} disabled={saving} className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition text-sm font-medium mr-2">
                             {saving ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Publicar
                        </button>
                      )}
                      <button onClick={copyToClipboard} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" title="Copiar HTML"><Copy className="w-5 h-5" /></button>
                      <button onClick={downloadDoc} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition" title="Descargar Word"><Download className="w-5 h-5" /></button>
                  </div>
              </div>
              
              {/* Content Editable Area (Uncontrolled ref-based to prevent crash) */}
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

          {/* Sidebar SEO & Settings */}
          <div className="w-full lg:w-80 space-y-4 overflow-y-auto pr-2">
              
              {/* PUBLICATION SETTINGS */}
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
                                {featuredImage && <img src={featuredImage} className="w-8 h-8 object-cover rounded border border-gray-700" alt="Preview" />}
                            </div>
                      </div>
                  </div>
              </div>

              {/* SEO METADATA */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                      <Search className="w-4 h-4 text-purple-400" /> Metadatos SEO
                  </h3>
                  <div className="space-y-3">
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">Slug (URL)</label>
                          <input 
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white font-mono"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">Meta Title</label>
                          <input 
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-gray-400 block mb-1">Meta Description</label>
                          <textarea 
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-2 py-1.5 text-xs text-white h-16 resize-none"
                          />
                      </div>
                  </div>
              </div>

              {/* SEO SCORE */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <BarChart className="w-5 h-5 text-green-400" /> Score SEO
                  </h3>
                  
                  {/* Score Circle */}
                  <div className="flex flex-col items-center mb-6">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#374151" strokeWidth="3" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={strokeColor} strokeWidth="3" strokeDasharray={`${validSeoScore}, 100`} className="transition-all duration-1000 ease-out" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                              <span className="text-3xl font-bold text-white">{validSeoScore}</span>
                              <span className="text-[10px] text-gray-500 uppercase">Puntos</span>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Palabras</span>
                          <span className="text-white font-bold">{wordCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Densidad Keyword</span>
                          <span className={`font-bold ${keywordDensity > 2.5 ? 'text-red-400' : 'text-white'}`}>{keywordDensity}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 bg-black/20 p-2 rounded">
                          {wordCount > 600 ? <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3"/> Longitud óptima</span> : <span className="text-yellow-500">Intenta escribir más de 600 palabras</span>}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white relative">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {/* --- ERROR MODAL --- */}
        {saveError && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-gray-900 border border-red-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
                    <div className="bg-red-900/30 p-4 border-b border-red-800 flex items-center justify-between">
                        <h3 className="text-red-400 font-bold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Error al Guardar Artículo
                        </h3>
                        <button onClick={() => setSaveError(null)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6">
                         <p className="text-gray-300 mb-4 text-sm">
                            El artículo <strong>no se ha guardado</strong> en la base de datos. Esto puede deberse a un problema de conexión o a un error en el servidor.
                         </p>
                         
                         <div className="bg-black rounded-lg p-4 border border-gray-800 font-mono text-xs text-red-300 overflow-x-auto max-h-40">
                            <strong>Detalle del error:</strong><br/>
                            {saveError}
                         </div>
                    </div>

                    <div className="bg-gray-800 p-4 flex justify-end gap-3">
                         <button 
                             onClick={() => setSaveError(null)}
                             className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition text-sm"
                         >
                             Cancelar
                         </button>
                         <button 
                             onClick={handleSaveArticle}
                             className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition flex items-center gap-2 text-sm shadow-lg shadow-red-900/30"
                         >
                             <RefreshCw className="w-4 h-4" /> Reintentar Guardado
                         </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};