import React, { useState, useEffect } from 'react';
import { generateArticleTitles, generateArticleOutline, generateFullArticle, ArticleTitleIdea } from '../../../services/geminiService';
import { api } from '../../../services/api';
import { Article, Project, LandingPage, User } from '../../../types';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Briefcase, ChevronRight, Info, BookOpen, Sparkles, Plus, ArrowLeft, Save, Mail, Globe, Layers } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

// Importing Sub-Components from relative sibling folder
import { Step1Inputs } from './content-generator/Step1Inputs';
import { Step2Titles } from './content-generator/Step2Titles';
import { Step3Outline } from './content-generator/Step3Outline';
import { Step4Editor } from './content-generator/Step4Editor';
import { SaveLogModal } from './content-generator/SaveLogModal';

interface ContentGeneratorProps {
    onSave?: (article: any) => Promise<void>;
}

interface DashboardContext {
  user: User;
  articleCount: number;
  isSimulating: boolean;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onSave }) => {
  /* */ /* Actualización: Implementación de Header global y barra de progreso unificada (0. Proyecto, 1. Configuración, 2. Selección, 3. Esquema, 4. Redacción) para igualar el flujo de GeneratorLanding - 20/06/2024 10:15 */
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const { id: editArticleId } = useParams() as { id: string };
  const navigate = useNavigate();
  const { user, articleCount, isSimulating } = useOutletContext() as DashboardContext;
  
  // Limit Check State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [keyword, setKeyword] = useState('');

  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [userPages, setUserPages] = useState<LandingPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  const [titleIdeas, setTitleIdeas] = useState<ArticleTitleIdea[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<ArticleTitleIdea | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [outline, setOutline] = useState<string[]>([]);
  const [ctaLink, setCtaLink] = useState('');
  const [articleContent, setArticleContent] = useState('');

  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  // Add publishDate state to sync with Step4Editor
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [seoScore, setSeoScore] = useState(0);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [saveLogs, setSaveLogs] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // LIMIT CHECK EFFECT
  useEffect(() => {
      const isRealAdmin = user.role === 'admin' && !isSimulating;
      if (!editArticleId && user.planLimits && !isRealAdmin) {
          const max = user.planLimits.maxArticles || 2;
          if (articleCount >= max) {
              setShowUpgradeModal(true);
          }
      }
  }, [editArticleId, user, articleCount, isSimulating]);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const [projects, pages] = await Promise.all([
          api.getProjects(),
          api.getPages()
        ]);
        setUserProjects(projects || []);
        const landingPages = pages || [];
        setUserPages(landingPages);

        /* */ /* Actualización: Lógica de pre-selección de landing page para usuarios con un solo activo - 06/03/2025 19:15 */
        if (landingPages.length === 1 && !selectedPageId) {
            setSelectedPageId(landingPages[0].id);
        }
      } catch (e) {
        console.error("Failed to load context data", e);
      }
    };
    fetchContext();
  }, []);

  useEffect(() => {
    if (editArticleId) {
        const loadArticle = async () => {
            setLoading(true);
            try {
                const article = await api.getArticleById(editArticleId);
                if (article) {
                    setArticleContent(article.contentHtml);
                    
                    setSelectedTitle({ title: article.title, description: article.description });
                    setArticleTitle(article.title);
                    
                    setSlug(article.slug);
                    setMetaTitle(article.metaTitle || article.title);
                    setMetaDescription(article.metaDescription || article.description || '');
                    setFeaturedImage(article.featuredImage || '');
                    setKeyword(article.keyword);
                    setStatus(article.status);
                    setSelectedPageId(article.pageId || '');
                    setSeoScore(article.seoScore);
                    // Sync publishDate when loading article
                    if (article.publishedAt) {
                        setPublishDate(new Date(article.publishedAt).toISOString().split('T')[0]);
                    }
                    
                    setStep(5);
                }
            } catch (e) {
                console.error("Error cargando artículo:", e);
            } finally {
                setLoading(false);
            }
        };
        loadArticle();
    }
  }, [editArticleId]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSaveLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const generateCleanSlug = (text: string) => {
      const stopWords = new Set(['y', 'la', 'el', 'en', 'de', 'del', 'un', 'una', 'por', 'con', 'los', 'las', 'al', 'a']);
      return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .split(/\s+/)
        .filter(word => !stopWords.has(word) && word.length > 0)
        .join('-');
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    const proj = userProjects.find(p => p.id === projectId);
    if (proj) {
      setTopic(proj.niche || '');
      setObjective(proj.mainGoal ? `Atraer clientes interesados en ${proj.mainGoal}` : '');
      if (proj.affiliateLinks && proj.affiliateLinks.length > 0) {
        setCtaLink(proj.affiliateLinks[0].url);
      }
    }
    setStep(1);
  };

  const handleSelectRecommendation = async (rec: any) => {
      setTopic(rec.title);
      setKeyword(rec.keyword);
      setObjective(rec.strategy);
      
      const idea: ArticleTitleIdea = {
          title: rec.title,
          description: rec.strategy
      };
      
      setSelectedTitle(idea);
      setArticleTitle(idea.title);
      setMetaTitle(idea.title);
      setMetaDescription(idea.description || '');
      setSlug(generateCleanSlug(idea.title));

      setLoading(true);
      try {
          const generatedOutline = await generateArticleOutline(idea.title, rec.strategy);
          if (Array.isArray(generatedOutline)) {
              setOutline(generatedOutline);
          } else {
              setOutline(["H2: Introducción", "H2: Contenido Principal", "H2: Conclusión"]);
          }
          setStep(4); 
      } catch (e) {
          alert("Error generando esquema.");
      } finally {
          setLoading(false);
      }
  };

  const handleGenerateTitles = async () => {
    if (!topic || !objective) return alert("Por favor completa el tema y el objetivo.");
    setLoading(true);
    try {
      const titles = await generateArticleTitles(topic, objective, keyword);
      if (Array.isArray(titles)) {
        setTitleIdeas(titles);
        setStep(3);
      } else {
        alert("La IA no devolvió el formato esperado.");
      }
    } catch (e) {
      alert("Error generando títulos.");
    } finally {
      setLoading(false);
    }
  };

  /* */ /* Actualización: Implementación de simulación de flujo para entorno local/mock. Se cargan datos de prueba (Esquema y Contenido) automáticamente si api.isUsingMockData() es true - 06/03/2025 22:20 */
  const handleManualGenerateOutline = async () => {
    if (!topic || !objective) return alert("Por favor completa el tema y el objetivo.");
    setLoading(true);
    
    // Preparar metadatos iniciales basados en el título manual
    const idea: ArticleTitleIdea = {
      title: topic,
      description: objective
    };
    setSelectedTitle(idea);
    setArticleTitle(topic);
    setMetaTitle(topic);
    setMetaDescription(objective);
    setSlug(generateCleanSlug(topic));

    // LÓGICA MODO MOCK/LOCAL
    if (api.isUsingMockData()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockOutline = [
            `H1: ${topic}`,
            "H2: Introducción Estratégica",
            "H2: Análisis del Mercado Actual",
            "H3: Comportamiento del Consumidor",
            "H3: Tendencias 2025",
            "H2: Implementación Paso a Paso",
            "H2: Conclusión y Resultados Esperados"
        ];
        setOutline(mockOutline);
        setStep(4);
        setLoading(false);
        return;
    }

    try {
      const generatedOutline = await generateArticleOutline(topic, objective);
      if (Array.isArray(generatedOutline)) {
        setOutline(generatedOutline);
        setStep(4); // Saltar directamente al paso de Esquema
      } else {
        alert("Error generando la estructura.");
      }
    } catch (e) {
      alert("Error de conexión con la IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTitle = async (idea: ArticleTitleIdea) => {
    setSelectedTitle(idea);
    setArticleTitle(idea.title);
    
    setMetaTitle(idea.title);
    setMetaDescription(idea.description || '');
    setSlug(generateCleanSlug(idea.title));

    setLoading(true);
    try {
      const generatedOutline = await generateArticleOutline(idea.title, objective);
      if (Array.isArray(generatedOutline)) {
        setOutline(generatedOutline);
      } else {
        setOutline(["H2: Introducción", "H2: Contenido Principal", "H2: Conclusión"]);
      }
      setStep(4);
    } catch (e) {
      alert("Error generando esquema.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateArticle = async () => {
    if (!selectedTitle) return;
    setLoading(true);

    // LÓGICA MODO MOCK/LOCAL PARA GENERACIÓN DE CONTENIDO
    if (api.isUsingMockData()) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockContent = `
            <p>Este es un artículo de demostración generado automáticamente en modo local. El tema central es <strong>${articleTitle}</strong>.</p>
            <h2>Introducción Estratégica</h2>
            <p>La implementación de un sistema de contenidos optimizado es fundamental para cualquier estrategia de marketing digital que busque resultados a largo plazo.</p>
            <h2>Análisis del Mercado Actual</h2>
            <p>Actualmente, el consumidor busca valor inmediato y soluciones prácticas a sus problemas cotidianos.</p>
            <h3>Comportamiento del Consumidor</h3>
            <p>La atención es el activo más valioso. Los primeros párrafos deben capturar el interés de inmediato.</p>
            <h3>Tendencias 2025</h3>
            <p>La personalización masiva mediante IA será el estándar para la creación de contenido relevante.</p>
            <h2>Implementación Paso a Paso</h2>
            <p>Sigue los procesos definidos en la estructura para asegurar que el mensaje llegue a la audiencia correcta.</p>
            <div style="text-align: center; margin: 40px 0;">
                <a href="${ctaLink || '#'}" style="background-color: #FF5A1F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 10px 20px -5px rgba(255,90,31,0.4);">ADQUIRIR EL MÉTODO COMPLETO</a>
            </div>
            <h2>Conclusión</h2>
            <p>No esperes a que el mercado cambie, sé tú quien lo lidere aplicando estas estrategias hoy mismo.</p>
        `;
        setArticleContent(mockContent);
        setMetaDescription(`Descubre los secretos de ${articleTitle} y cómo aplicarlos en tu negocio para maximizar resultados este año.`);
        setStep(5);
        setLoading(false);
        return;
    }

    const projectContext = userProjects.find(p => p.id === selectedProject);

    try {
      const result = await generateFullArticle(selectedTitle.title, outline, objective, ctaLink || '#', keyword, projectContext);
      
      setArticleContent(result.html || "<p>Error en la generación.</p>");
      if (result.metaDescription) {
          setMetaDescription(result.metaDescription);
      } else {
          setMetaDescription('');
      }
      
      setStep(5);
    } catch (e) {
      alert("Error escribiendo artículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!articleTitle || !onSave) return;
    
    setIsLogModalOpen(true);
    setSaveStatus('saving');
    setSaveLogs([]);
    addLog("Iniciando secuencia de guardado...");

    const articlePayload = {
      id: editArticleId,
      pageId: selectedPageId || undefined,
      title: articleTitle,
      slug: slug || generateCleanSlug(articleTitle),
      description: metaDescription || '',
      contentHtml: articleContent,
      featuredImage: featuredImage,
      keyword: keyword,
      seoScore: seoScore,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      status: status,
      // Use publishDate from state
      publishedAt: new Date(publishDate)
    };

    try {
      addLog("Validando datos...");
      addLog(`Endpoint Objetivo: ${editArticleId ? `/api/articles/${editArticleId}` : '/api/articles'}`);
      
      await onSave(articlePayload);
      
      addLog("Respuesta del Servidor: 200 OK");
      addLog("Guardado exitoso en base de datos.");
      setSaveStatus('success');

      setTimeout(() => {
        if (saveStatus !== 'error') {
            setIsLogModalOpen(false);
            navigate('/dashboard/articles');
        }
      }, 1500);
    } catch (e: any) {
      addLog("❌ ERROR CRÍTICO");
      addLog(`Mensaje: ${e.message}`);
      if (e.response) {
         addLog(`Status: ${e.response.status}`);
         addLog(`Data: ${JSON.stringify(e.response.data)}`);
      }
      setSaveStatus('error');
    }
  };

  if (loading && editArticleId) {
      return (
          <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-white">Cargando artículo...</span>
          </div>
      );
  }

  return (
    /* */ /* Actualización: Expansión dinámica del ancho del contenedor en la fase de Redacción (Step 5) para optimizar el espacio de trabajo del editor y la barra lateral de SEO - 07/06/2025 21:00 */
    <div className={`mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative transition-all duration-500 ${step === 5 ? 'max-w-[98%] xl:max-w-[1600px]' : 'max-w-5xl'}`}>
      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => navigate('/dashboard/articles')} 
          reason={`Has alcanzado el límite de ${user.planLimits?.maxArticles} artículos de tu plan ${user.planLimits?.planName}.`}
      />

      {/* Header Premium y Barra de Progreso unificada para el Generador de Contenidos - 20/06/2024 10:15 */}
      <div className={`bg-purple-600/10 p-8 text-center border-b border-purple-500/10 ${showUpgradeModal || loadingStatus ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
          <BookOpen className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Generador de Contenidos Automáticos</h2>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 0 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>0. Proyecto</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${(step === 1 || step === 2) ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>1. Configuración</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 3 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>2. Selección</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 4 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>3. Esquema</span>
           <div className="w-4 h-px bg-gray-700"></div>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${step === 5 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>4. Redacción</span>
        </div>
      </div>

      <div className={`p-8 flex-1 ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* */ /* Actualización: Rediseño completo del Paso 0 para unificar la estética con el asistente de email, aplicando radios de [3rem], paddings p-10, línea de acento superior y botón de selección - 06/03/2025 10:45 */ }
        {step === 0 && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
              <div className="max-w-2xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">
                        Selecciona tu Proyecto
                    </span>
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    Para generar contenido que conecte con tu audiencia, nuestra inteligencia artificial necesita conocer tu estrategia y avatar. Selecciona un proyecto para comenzar.
                  </p>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                  {userProjects.length > 0 ? (
                      <>
                        {userProjects.map((project) => (
                            <div 
                                key={project.id}
                                className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors shadow-inner">
                                        <Briefcase className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors truncate">{project.name}</h4>
                                        <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                    </div>
                                </div>
                                <div className="flex-1 mb-10">
                                    <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p>
                                    {/* Eliminación de truncamiento en descripción de proyecto para mostrar texto completo - 06/03/2025 15:30 */ }
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium">{project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción.")}</p>
                                </div>
                                <button 
                                    onClick={() => handleProjectSelect(project.id)}
                                    className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                >
                                    Seleccionar <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={() => navigate('/dashboard/projects/create')}
                            className="p-10 bg-transparent border-2 border-dashed border-gray-800 rounded-[3rem] hover:border-gray-600 hover:text-white transition-all text-gray-500 group flex flex-col items-center justify-center gap-6 shadow-2xl min-h-[400px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center shadow-lg group-hover:bg-gray-700 transition-colors">
                                <Plus className="w-8 h-8 text-gray-400 group-hover:text-white" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-black uppercase tracking-widest">Crear un nuevo proyecto</h4>
                                <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-60">Define un nuevo nicho o producto</p>
                            </div>
                        </button>
                      </>
                  ) : (
                      <div className="md:col-span-2 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[2rem] text-center w-full">
                          <p className="text-gray-500 mb-6 font-medium">Aún no tienes proyectos creados para gestionar contenidos.</p>
                          <button 
                            onClick={() => navigate('/dashboard/projects/create')}
                            className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20"
                          >
                            Crear mi primer proyecto
                          </button>
                      </div>
                  )}
              </div>
          </div>
        )}

        {step === 1 && (
          <Step1Inputs 
            userProjects={userProjects}
            selectedProject={selectedProject}
            onSelectProject={handleProjectSelect}
            userPages={userPages}
            selectedPageId={selectedPageId}
            onSelectPage={setSelectedPageId}
            topic={topic}
            setTopic={setTopic}
            objective={objective}
            setObjective={setObjective}
            keyword={keyword}
            setKeyword={setKeyword}
            onGenerate={() => setStep(2)}
            onSelectRecommendation={handleSelectRecommendation}
            loading={loading}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && (
           <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm font-bold">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Volver al selector
              </button>
              <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                          <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Contenido Personalizado</h3>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Configura manualmente tu artículo</p>
                      </div>
                  </div>

                  <div className="space-y-6">
                      {/* */ /* Actualización: Remoción del selector de Landing Page del flujo manual para transferirlo a la fase de estructura unificada - 06/03/2025 21:30 */}
                      <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Tema o Título Tentativo</label>
                          <input
                              type="text"
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                              placeholder="Ej: Tendencias de Microblading 2024"
                          />
                      </div>

                      <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Objetivo del Artículo</label>
                          <select
                              value={objective}
                              onChange={(e) => setObjective(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                          >
                              <option value="" disabled>-- Selecciona un objetivo --</option>
                              <option value="Atraer Tráfico (SEO Informativo)">Atraer Tráfico (SEO Informativo)</option>
                              <option value="Venta Directa (Copy Persuasivo)">Venta Directa (Copy Persuasivo)</option>
                              <option value="Captación de Leads (Lead Magnet)">Captación de Leads (Lead Magnet)</option>
                              <option value="Romper Objeciones (FAQ)">Romper Objeciones (FAQ)</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Palabra Clave Objetivo (SEO)</label>
                          <input
                              type="text"
                              value={keyword}
                              onChange={(e) => setKeyword(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                              placeholder="Ej: curso de microblading online"
                          />
                      </div>

                      <button
                          onClick={handleManualGenerateOutline}
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 uppercase text-sm tracking-widest"
                      >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
                          Generar Estructura del Artículo
                      </button>
                  </div>
              </div>
           </div>
        )}

        {step === 3 && (
          <Step2Titles 
            titleIdeas={titleIdeas}
            onSelectTitle={handleSelectTitle}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}

        {step === 4 && (
          <Step3Outline 
            outline={outline}
            setOutline={setOutline}
            ctaLink={ctaLink}
            setCtaLink={setCtaLink}
            onGenerate={handleGenerateArticle}
            onBack={() => setStep(3)}
            loading={loading}
            userPages={userPages}
            selectedPageId={selectedPageId}
            onSelectPage={setSelectedPageId}
          />
        )}

        {step === 5 && (
          <Step4Editor 
            articleContent={articleContent}
            setArticleContent={setArticleContent}
            selectedTitle={selectedTitle}
            articleTitle={articleTitle}
            setArticleTitle={setArticleTitle}
            slug={slug}
            setSlug={setSlug}
            selectedPageId={selectedPageId}
            setSelectedPageId={setSelectedPageId}
            userPages={userPages}
            status={status}
            setStatus={setStatus}
            publishDate={publishDate}
            setPublishDate={setPublishDate}
            featuredImage={featuredImage}
            setFeaturedImage={setFeaturedImage}
            keyword={keyword}
            setKeyword={setKeyword}
            seoScore={seoScore}
            setSeoScore={setSeoScore}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            onSave={handleSaveArticle}
            saving={saveStatus === 'saving'}
            onBack={() => editArticleId ? navigate('/dashboard/articles') : setStep(4)}
            isEditing={!!editArticleId}
          />
        )}

        <SaveLogModal 
          isOpen={isLogModalOpen}
          saveStatus={saveStatus}
          saveLogs={saveLogs}
          onClose={() => setIsLogModalOpen(false)}
          onRetry={handleSaveArticle}
        />
      </div>
    </div>
  );
};
