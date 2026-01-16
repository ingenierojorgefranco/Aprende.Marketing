import React, { useState, useEffect } from 'react';
import { generateArticleTitles, generateArticleOutline, generateFullArticle, ArticleTitleIdea } from '../../../services/geminiService';
import { api } from '../../../services/api';
import { Article, Project, LandingPage, User } from '../../../types';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Briefcase, ChevronRight, Info, BookOpen, Sparkles, Plus, ArrowLeft, Save, Mail, Globe, Layers, AlertTriangle, Zap, Link as LinkIcon, ExternalLink, MousePointerClick, X, CheckCircle, Target } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

// Importing Sub-Components from relative sibling folder
import { Step1Inputs } from './content-generator/Step1Inputs';
import { Step2Titles } from './content-generator/Step2Titles';
import { Step3Outline } from './content-generator/Step3Outline';
import { Step4Editor } from './content-generator/Step4Editor';
import { SaveLogModal } from './content-generator/SaveLogModal';

interface ContentGeneratorProps {
    onSave?: (article: any) => Promise<void>;
    preFilledData?: {
        topic: string;
        objective: string;
        keyword: string;
        pageId: string;
    };
    embeddedProjectId?: string;
    onClose?: () => void;
}

interface DashboardContext {
  user: User;
  articleCount: number;
  isSimulating: boolean;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onSave, preFilledData, embeddedProjectId, onClose }) => {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const { id: editArticleId } = useParams() as { id: string };
  const navigate = useNavigate();
  const { user, articleCount, isSimulating } = useOutletContext() as DashboardContext;
  
  // Limit Check State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [keyword, setKeyword] = useState('');

  const [isAiGeneratedFlow, setIsAiGeneratedFlow] = useState(false);
  const [redirectType, setRedirectType] = useState<'landing' | 'hotlink' | 'external'>('landing');
  const [showManualConfirm, setShowManualConfirm] = useState(false);

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
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [seoScore, setSeoScore] = useState(0);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [saveLogs, setSaveLogs] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Limit Check Effect
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

        if (landingPages.length === 1 && !selectedPageId) {
            setSelectedPageId(landingPages[0].id);
        }
      } catch (e) {
        console.error("Failed to load context data", e);
      }
    };
    fetchContext();
  }, []);

  // Pre-fill effect for Modal usage
  useEffect(() => {
    if (preFilledData) {
        setTopic(preFilledData.topic || '');
        setObjective(preFilledData.objective || '');
        setKeyword(preFilledData.keyword || '');
        setSelectedPageId(preFilledData.pageId || '');
        setIsAiGeneratedFlow(true);
        setStep(1); 
    }
  }, [preFilledData]);

  // Sync pre-selected project from Props
  useEffect(() => {
    if (embeddedProjectId && userProjects.length > 0) {
      handleProjectSelect(embeddedProjectId);
      setStep(1);
    }
  }, [embeddedProjectId, userProjects]);

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
      
      if (proj && !preFilledData) {
          let audienceInfo = proj.targetAudience || '';
          
          if (proj.strategy_json) {
              const s = proj.strategy_json;
              if (s.avatars && Array.isArray(s.avatars) && s.avatars.length > 0) {
                  const main = s.avatars[0];
                  audienceInfo = `${main.archetype}. Su principal dolor es: ${main.pain}. Su gran deseo: ${main.desire}`;
              } 
              else if (s.avatar && s.avatar.story) {
                  audienceInfo = s.avatar.story;
              }
          }

          setTopic(proj.niche || '');
          setObjective(proj.mainGoal ? `Atraer clientes interesados en ${proj.mainGoal}` : '');
          setFormData(prev => ({
              ...prev,
              pageName: proj.productName || proj.name, 
              targetAudience: audienceInfo,
              destinationType: proj.affiliateLinks && proj.affiliateLinks.length > 0 ? 'external_url' : 'form',
              destinationUrl: proj.affiliateLinks && proj.affiliateLinks.length > 0 ? proj.affiliateLinks[0].url : '',
          }));
      }
      setStep(1);
  };

  const handleSelectRecommendation = async (rec: any) => {
      setTopic(rec.title);
      setKeyword(rec.keyword);
      setObjective(rec.strategy);
      setIsAiGeneratedFlow(true);
      setStep(2); 
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

  const handleManualGenerateOutline = () => {
    if (!topic || !objective) return alert("Por favor completa el tema y el objetivo.");
    setShowManualConfirm(true);
  };

  const executeManualGenerateOutline = async () => {
    setShowManualConfirm(false);
    setLoading(true);
    
    const idea: ArticleTitleIdea = {
      title: topic,
      description: objective
    };
    setSelectedTitle(idea);
    setArticleTitle(topic);
    setMetaTitle(topic);
    setMetaDescription(objective);
    setSlug(generateCleanSlug(topic));

    if (api.isUsingMockData()) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockOutline = [
            `H1: ${topic}`,
            "H2: Introducción Estratégica",
            "H2: Análisis del Mercado Actual",
            "H3: Comportamiento del Consumidor Moderno",
            "H3: Tendencias Tecnológicas 2025",
            "H2: Pilares de una Estrategia de Éxito",
            "H3: Optimización de Procesos Internos",
            "H2: Implementación Paso a Paso",
            "H3: Herramientas de Control y Seguimiento",
            "H2: Casos de Estudio y Resultados Reales",
            "H2: Conclusión y Próximos Pasos"
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
        setStep(4);
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
      setMetaDescription(result.metaDescription || '');
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
            if (onClose) onClose();
            else navigate('/dashboard/articles');
        }
      }, 1500);
    } catch (e: any) {
      addLog("❌ ERROR CRÍTICO");
      addLog(`Mensaje: ${e.message}`);
      setSaveStatus('error');
    }
  };

  const handlePageRedirectSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    const page = userPages.find(p => p.id === pageId);
    if (page) {
        const url = page.customDomain ? `https://${page.customDomain}` : `https://${page.subdomain}`;
        setCtaLink(url);
    }
  };

  const [formData, setFormData] = useState({
    pageName: '',
    targetAudience: '',
    destinationType: 'landing' as 'landing' | 'hotlink' | 'external',
    destinationUrl: ''
  });

  const isRealAdmin = user.role === 'admin' && !isSimulating;
  const maxArticles = user.planLimits?.maxArticles || 2;
  const usagePercent = Math.min(100, (articleCount / maxArticles) * 100);
  const isAtLimit = !isRealAdmin && articleCount >= maxArticles;

  let progressColor = "bg-green-500";
  if (usagePercent > 50) progressColor = "bg-yellow-500";
  if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative transition-all duration-500 ${step === 5 ? 'max-w-[98%] xl:max-w-[1600px]' : 'max-w-5xl'}`}>
      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => onClose ? onClose() : navigate('/dashboard/articles')} 
          reason={`Has alcanzado el límite de ${user.planLimits?.maxArticles} artículos de tu plan ${user.planLimits?.planName}.`}
      />

      <div className={`bg-purple-600/10 p-8 text-center border-b border-purple-500/10 relative ${showUpgradeModal || loadingStatus ? 'opacity-30 pointer-events-none' : ''}`}>
        {onClose && (
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
            </button>
        )}
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

      <div className={`p-8 flex-1 overflow-y-auto ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

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
                      </>
                  ) : null}
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
            onGenerate={() => { setIsAiGeneratedFlow(false); setStep(2); }}
            onSelectRecommendation={handleSelectRecommendation}
            loading={loading}
            onBack={() => setStep(0)}
            user={user}
            articleCount={articleCount}
            setShowUpgradeModal={setShowUpgradeModal}
            isSimulating={isSimulating}
            isPreFilled={!!preFilledData}
          />
        )}

        {step === 2 && (
           <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {showManualConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col p-10 text-center space-y-8">
                        <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/30">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">¿Estás seguro de generar esta estructura?</h3>
                            <p className="text-white text-lg leading-relaxed font-medium">Vas a consumir créditos al momento de crearlo.</p>
                            
                            <div className="mt-8 p-6 bg-black/40 border border-white/10 rounded-[2rem] shadow-inner text-left">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{isRealAdmin ? 'Artículos (Superusuario)' : 'Consumo de Artículos'}</span>
                                    <span className="text-white font-bold">{articleCount} / {isRealAdmin ? '∞' : maxArticles}</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                                    <div className={`h-full transition-all duration-1000 ease-out rounded-full ${progressColor}`} style={{ width: `${isRealAdmin ? (articleCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                            {!isAtLimit ? (
                                <>
                                    <button 
                                        onClick={executeManualGenerateOutline}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-900/20 uppercase text-sm tracking-widest transform active:scale-[0.98]"
                                    >
                                        Sí, Generar Ahora
                                    </button>
                                    <button onClick={() => setShowManualConfirm(false)} className="w-full py-5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest">
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => { setShowManualConfirm(false); setShowUpgradeModal(true); }} className="w-full py-5 bg-gradient-to-r from-[#FF5A1F] to-orange-600 text-white font-black rounded-2xl transition-all shadow-lg uppercase text-sm tracking-widest">
                                    Actualizar Plan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
              )}

              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm font-bold">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Volver al selector
              </button>

              {/* PROJECT INFO BLOCK */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 border-dashed mb-6">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#FF5A1F]" /> Proyecto Seleccionado
                  </label>
                  <div className="flex items-center justify-between bg-black border border-[#FF5A1F]/20 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                          <div className="w-5 h-5 text-[#FF5A1F]"><CheckCircle className="w-full h-full"/></div>
                          <span className="text-white font-bold">{userProjects.find(p => p.id === selectedProject)?.name || 'Proyecto'}</span>
                      </div>
                  </div>
              </div>

              {/* LANDING PAGE SELECTION BLOCK */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 border-dashed mb-6">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-blue-400" /> Landing Page Seleccionada
                  </label>
                  <div className="flex items-center justify-between bg-black border border-blue-500/20 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                          <div className="w-5 h-5 text-blue-400"><CheckCircle className="w-full h-full"/></div>
                          <span className="text-white font-bold">{userPages.find(p => p.id === selectedPageId)?.name || 'Sin seleccionar'}</span>
                      </div>
                      <button 
                          onClick={() => setIsPageSelectorOpen(true)}
                          className="text-xs text-gray-500 hover:text-white underline transition"
                      >
                          Cambiar
                      </button>
                  </div>
              </div>

              {/* LANDING PAGE SELECTOR MODAL */}
              {isPageSelectorOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPageSelectorOpen(false)}>
                  <div 
                    className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-600"></div>
                    <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start">
                      <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500 flex items-center gap-3">
                          <Globe className="w-6 h-6 text-[#FF5A1F]" /> Cambiar Landing Page
                        </h3>
                        <p className="text-gray-200 text-sm md:text-base leading-relaxed font-medium mt-4">
                          Selecciona la página a la cual deseas vincular este contenido.
                        </p>
                      </div>
                      <button onClick={() => setIsPageSelectorOpen(false)} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {userPages.length > 0 ? (
                        userPages.map((page) => (
                          <div 
                            key={page.id}
                            onClick={() => { setSelectedPageId(page.id); setIsPageSelectorOpen(false); }}
                            className="group w-full flex items-center justify-between p-5 bg-black border border-white/5 rounded-2xl hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#FF5A1F] group-hover:bg-[#FF5A1F]/10 transition-all shadow-inner">
                                <Globe className="w-5 h-5" />
                              </div>
                              <span className="text-white font-bold text-lg group-hover:text-[#FF5A1F] transition-colors">{page.name}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#FF5A1F] transition-all" />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No hay páginas disponibles.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                          <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{isAiGeneratedFlow ? 'Creación Automática' : 'Contenido Personalizado'}</h3>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{isAiGeneratedFlow ? 'Valida la sugerencia de la IA antes de generar' : 'Configura manualmente tu artículo'}</p>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Titulo de tu Artículo de Blog</label>
                          <input
                              type="text"
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                              placeholder="Ej: Cómo escalar tu negocio..."
                          />
                      </div>

                      <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Selecciona el Objetivo del Articulo</label>
                          <textarea
                              value={objective}
                              onChange={(e) => setObjective(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition resize-none h-32"
                              placeholder="Describe qué pretendes lograr..."
                          />
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

                      <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">¿Dónde dirigir a tus visitantes?</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div 
                                onClick={() => setRedirectType('landing')}
                                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${redirectType === 'landing' ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}
                              >
                                <div className={`p-4 rounded-2xl transition-colors ${redirectType === 'landing' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                    <Globe className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${redirectType === 'landing' ? 'text-white' : 'text-gray-400'}`}>Landing Page</h4>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Envía el tráfico a una de tus páginas internas creadas.</p>
                                </div>
                              </div>
                              
                              <div 
                                onClick={() => setRedirectType('hotlink')}
                                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${redirectType === 'hotlink' ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] shadow-lg shadow-orange-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}
                              >
                                <div className={`p-4 rounded-2xl transition-colors ${redirectType === 'hotlink' ? 'bg-[#FF5A1F] text-white' : 'bg-white/5 text-gray-500'}`}>
                                    <LinkIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${redirectType === 'hotlink' ? 'text-white' : 'text-gray-400'}`}>Hotlink Proyecto</h4>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Usa directamente tus enlaces de afiliado de Hotmart.</p>
                                </div>
                              </div>

                              <div 
                                onClick={() => setRedirectType('external')}
                                className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${redirectType === 'external' ? 'bg-purple-600/10 border-purple-500 shadow-lg shadow-purple-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}
                              >
                                <div className={`p-4 rounded-2xl transition-colors ${redirectType === 'external' ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                    <ExternalLink className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${redirectType === 'external' ? 'text-white' : 'text-gray-400'}`}>Link Externo</h4>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Cualquier otra página web externa que desees promocionar.</p>
                                </div>
                              </div>
                          </div>
                          
                          <div className="mt-4">
                              {redirectType === 'landing' && (
                                  <div className="animate-in fade-in slide-in-from-top-2">
                                      <select
                                          value={selectedPageId}
                                          onChange={(e) => handlePageRedirectSelect(e.target.value)}
                                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
                                      >
                                          <option value="" disabled>-- Selecciona una Landing Page --</option>
                                          {userPages.map(p => (
                                              <option key={p.id} value={p.id}>{p.name}</option>
                                          ))}
                                      </select>
                                  </div>
                              )}

                              {redirectType === 'external' && (
                                  <div className="animate-in fade-in slide-in-from-top-2">
                                      <input
                                          type="text"
                                          value={ctaLink}
                                          onChange={(e) => setCtaLink(e.target.value)}
                                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition"
                                          placeholder="https://ejemplo.com/tu-enlace"
                                      />
                                  </div>
                              )}
                              
                              {redirectType === 'hotlink' && (
                                  <div className="animate-in fade-in slide-in-from-top-2">
                                      <select
                                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition appearance-none cursor-pointer"
                                          onChange={(e) => setCtaLink(e.target.value)}
                                      >
                                          <option value="">-- Elige un Hotlink --</option>
                                          {userProjects.find(p => p.id === selectedProject)?.affiliateLinks.map((link, i) => (
                                              <option key={i} value={link.url}>{link.label}</option>
                                          ))}
                                      </select>
                                  </div>
                              )}
                          </div>
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
