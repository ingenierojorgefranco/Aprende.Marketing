import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { generateArticleTitles, generateArticleOutline, generateFullArticle, ArticleTitleIdea } from '../../../services/geminiService';
import { api } from '../../../services/api';
import { Article, Project, LandingPage, User, AffiliateLink } from '../../../types';
import { useParams, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { Loader2, Briefcase, ChevronRight, Info, BookOpen, Sparkles, Plus, ArrowLeft, Save, Mail, Globe, Layers, AlertTriangle, Zap, Link as LinkIcon, ExternalLink, MousePointerClick, X, CheckCircle, Target, Wand2, PenTool, Eye } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

// Importing Sub-Components from relative sibling folder
import { Step1Inputs } from './content-generator/Step1Inputs';
import { Step2Titles } from './content-generator/Step2Titles';
import { Step3Outline } from './content-generator/Step3Outline';
import { Step4Editor } from './content-generator/Step4Editor';
import { SaveLogModal } from './content-generator/SaveLogModal';
import { ProjectStrategy_Content } from './ProjectStrategy/ProjectStrategy_Content';

interface ContentGeneratorProps {
    onSave?: (article: any) => Promise<void>;
    preFilledData?: {
        topic: string;
        objective: string;
        keyword: string;
        pageId: string;
        articleId?: string;
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
  
  const { id: editArticleId } = useParams() as { id: string };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedProjectId = embeddedProjectId || searchParams.get('projectId');
  const { user, articleCount, isSimulating } = useOutletContext() as DashboardContext;
  
  // --- ESTADOS DE GENERACIÓN ---
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [savedArticleResult, setSavedArticleResult] = useState<Article | null>(null);
  const [activeArticleId, setActiveArticleId] = useState<string | undefined>(undefined);
  // -----------------------------

  // Limit Check State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeProjectId, setUpgradeProjectId] = useState<string | undefined>(undefined);
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
  const [validationError, setValidationError] = useState(false);

  const [strategyData, setStrategyData] = useState<any>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);

  const [activeArticle, setActiveArticle] = useState(0);
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [tooltipState, setTooltipState] = useState<{ visible: boolean; x: number; y: number; content: string[] }>({
      visible: false,
      x: 0,
      y: 0,
      content: []
  });

  const handleTooltipHover = (e: React.MouseEvent, content: string[]) => {
      setTooltipState({ visible: true, x: e.clientX + 15, y: e.clientY + 15, content });
  };

  const handleTooltipLeave = () => setTooltipState(prev => ({ ...prev, visible: false }));

  const toggleArticleSelection = (index: number, isSingle: boolean = false) => {
      if (isSingle) {
          setSelectedArticles([index]);
          return;
      }
      if (selectedArticles.includes(index)) setSelectedArticles(prev => prev.filter(i => i !== index));
      else if (selectedArticles.length < (user.planLimits?.maxArticles || 2)) setSelectedArticles(prev => [...prev, index]);
      else { alert("Límite de artículos alcanzado."); setShowUpgradeModal(true); }
  };

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [saveLogs, setSaveLogs] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Estados para creación de Hotlinks integrada
  const [projectLinks, setProjectLinks] = useState<AffiliateLink[]>([]);
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [savingNewLink, setSavingNewLink] = useState(false);

  // Filtrado de páginas basado en el proyecto seleccionado
  const filteredUserPages = userPages.filter(p => String(p.projectId) === String(selectedProject));

  // Limit Check Effect
  useEffect(() => {
      const checkLimit = async () => {
          if (editArticleId || !selectedProject || !user.planLimits || isSimulating || user.role === 'admin') return;

          try {
              const allArticles = await api.getArticles();
              const projectArticles = allArticles.filter(a => String(a.projectId) === String(selectedProject));
              
              const proj = userProjects.find(p => p.id === selectedProject);
              const planSlug = proj?.planSlug || 'starter';
              const limit = planSlug === 'starter' ? 2 : 20;

              if (projectArticles.length >= limit) {
                  setUpgradeProjectId(selectedProject);
                  setShowUpgradeModal(true);
              }
          } catch (e) {
              console.error(e);
          }
      };
      checkLimit();
  }, [editArticleId, user, selectedProject, isSimulating, userProjects]);

  useEffect(() => {
    let timer: any;
    if (generationStatus === 'generating') {
      setSecondsElapsed(0);
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [generationStatus]);

  useEffect(() => {
    if (generationStatus === 'success') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999
      });
    }
  }, [generationStatus]);

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

  // Sincronización automática de ctaLink cuando cambia la página seleccionada
  useEffect(() => {
    if (redirectType === 'landing' && selectedPageId) {
      const page = userPages.find(p => String(p.id) === String(selectedPageId));
      if (page) {
        const url = page.customDomain ? `https://${page.customDomain}` : `https://aprende.marketing/admin/lp/${page.subdomain}/`;
        setCtaLink(url);
        setValidationError(false);
      }
    }
  }, [selectedPageId, userPages, redirectType]);

  // Sincronizar links cuando cambia el proyecto seleccionado
  useEffect(() => {
    const fetchStrategy = async () => {
      if (selectedProject) {
        setLoadingStrategy(true);
        try {
          const strategy = await api.getProjectStrategy(selectedProject);
          setStrategyData(strategy);
        } catch (e) {
          console.error("Error fetching strategy:", e);
        } finally {
          setLoadingStrategy(false);
        }
      } else {
        setStrategyData(null);
      }
    };
    fetchStrategy();

    if (selectedProject) {
        const proj = userProjects.find(p => p.id === selectedProject);
        if (proj) {
            setProjectLinks(proj.affiliateLinks || []);
        }
    }
  }, [selectedProject, userProjects]);

  // Pre-fill effect for Modal usage
  useEffect(() => {
    if (preFilledData && step === 0) {
        if (embeddedProjectId) setSelectedProject(embeddedProjectId);
        setTopic(preFilledData.topic || '');
        setObjective(preFilledData.objective || '');
        setKeyword(preFilledData.keyword || '');
        setSelectedPageId(preFilledData.pageId || '');
        setActiveArticleId(preFilledData.articleId);
        setIsAiGeneratedFlow(true);
        setStep(1); 
    }
  }, [preFilledData, step]);

  // Sync pre-selected project from URL or Props
  useEffect(() => {
    if (preSelectedProjectId && userProjects.length > 0 && !selectedProject && step === 0) {
      handleProjectSelect(preSelectedProjectId);
      setStep(1);
    }
  }, [preSelectedProjectId, userProjects, selectedProject, step]);

  useEffect(() => {
    if (editArticleId && !preFilledData) {
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
                    setActiveArticleId(editArticleId);
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
      
      // Auto-select first page if any exist for this project
      const projectPages = userPages.filter(p => String(p.projectId) === String(projectId));
      if (projectPages.length === 1) {
          const firstPage = projectPages[0];
          setSelectedPageId(firstPage.id);
          const url = firstPage.customDomain ? `https://${firstPage.customDomain}` : `https://aprende.marketing/admin/lp/${firstPage.subdomain}/`;
          setCtaLink(url);
      } else {
          setSelectedPageId('');
          setCtaLink('');
      }

      if (proj) {
          // Sync links immediately to prevent overwriting
          setProjectLinks(proj.affiliateLinks || []);
          
          if (!preFilledData) {
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
              
              // Por defecto seleccionamos Landing Page como destino
              setRedirectType('landing');
          }
      }
      setStep(1);
  };

  const handleSelectRecommendation = async (rec: any) => {
      setTopic(rec.title);
      setKeyword(rec.keyword);
      setObjective(rec.strategy);
      setActiveArticleId(rec.id);
      setIsAiGeneratedFlow(true);

      const projectPages = userPages.filter(p => String(p.projectId) === String(selectedProject));
      
      if (projectPages.length === 0) {
          alert("Este proyecto no tiene ninguna Landing Page vinculada. Por favor, crea una página primero para poder publicar contenidos.");
          navigate(`/dashboard/projects/${selectedProject}/strategy?section=web`);
          return;
      }

      if (projectPages.length === 1) {
          if (!selectedPageId) {
              const firstPage = projectPages[0];
              setSelectedPageId(firstPage.id);
              const url = firstPage.customDomain ? `https://${firstPage.customDomain}` : `https://${firstPage.subdomain}`;
              setCtaLink(url);
          }
      } else if (projectPages.length > 1) {
          setSelectedPageId('');
          setCtaLink('');
      } else if (!selectedPageId) {
          setIsPageSelectorOpen(true);
      }

      setStep(2); 
  };

  const handleManualGenerateOutline = () => {
    if (!topic || !objective) return alert("Por favor completa el tema y el objetivo.");
    if (!ctaLink) {
        setValidationError(true);
        return;
    }
    setShowManualConfirm(true);
  };

  const executeManualGenerateOutline = async () => {
    setShowManualConfirm(false);
    setGenerationStatus('generating');
    setLoading(true);
    setProgress(0);

    const messages = [
        "Analizando nicho estratégico...",
        "Escaneando palabras clave de alta oportunidad...",
        "Diseñando estructura SEO (H1, H2, H3)...",
        "Entrenando modelo de redacción persuasiva...",
        "Generando ganchos de lectura hipnóticos...",
        "Redactando contenido de alto valor...",
        "Optimizando densidad de palabras clave...",
        "Sincronizando con la estrategia del proyecto...",
        "Verificando legibilidad y tono de voz...",
        "Insertando llamadas a la acción estratégicas...",
        "Finalizando artículo de alta conversión..."
    ];

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
        if (currentProgress < 95) {
            currentProgress += 1;
            setProgress(currentProgress);
            const msgIdx = Math.min(Math.floor((currentProgress / 100) * messages.length), messages.length - 1);
            setLoadingMessage(messages[msgIdx]);
        }
    }, 947);
    
    const idea: ArticleTitleIdea = { title: topic, description: objective };
    setSelectedTitle(idea);
    setArticleTitle(topic);
    setMetaTitle(topic);
    setMetaDescription(objective);
    const finalSlug = generateCleanSlug(topic);
    setSlug(finalSlug);

    try {
        let generatedOutline: string[] = [];
        if (api.isUsingMockData()) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            generatedOutline = [`H1: ${topic}`, "H2: Introducción Estratégica", "H2: Análisis del Mercado Actual", "H2: Implementación Paso a Paso", "H2: Conclusión"];
        } else {
            const result = await generateArticleOutline(topic, objective);
            generatedOutline = Array.isArray(result) ? result : ["H2: Introducción", "H2: Contenido Principal", "H2: Conclusión"];
        }

        setOutline(generatedOutline);
        const projectContext = userProjects.find(p => p.id === selectedProject);
        let result;
        if (api.isUsingMockData()) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            result = {
                title: topic,
                html: `<p>Contenido de prueba para <strong>${topic}</strong>.</p><h2>Introducción</h2><p>Texto generado.</p><div style="text-align: center;"><a href="${ctaLink || '#'}" style="background-color: #FF5A1F; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold;">ADQUIRIR EL MÉTODO</a></div>`,
                metaDescription: `Descubre los secretos de ${topic}.`
            };
        } else {
            result = await generateFullArticle(idea.title, generatedOutline, objective, ctaLink || '#', keyword, projectContext);
        }

        const finalTitle = result.title || topic;
        setArticleTitle(finalTitle);
        setMetaTitle(finalTitle);
        setArticleContent(result.html || "<p>Error en la generación.</p>");
        setMetaDescription(result.metaDescription || '');

        const articlePayload = {
          projectId: selectedProject || preSelectedProjectId || undefined,
          pageId: selectedPageId || undefined,
          title: finalTitle,
          slug: finalSlug,
          description: result.metaDescription || objective || '',
          contentHtml: result.html || '',
          featuredImage: featuredImage,
          keyword: keyword,
          seoScore: 0,
          metaTitle: finalTitle,
          metaDescription: result.metaDescription || '',
          psychologicalStrategy: { targetUrl: ctaLink },
          status: 'published' as const,
          publishedAt: new Date(),
          isGenerated: true
        };

        let saved;
        const currentId = activeArticleId || preFilledData?.articleId;
        
        if (currentId && !String(currentId).startsWith('json-') && !String(currentId).startsWith('available-')) {
            await api.updateArticle(currentId, articlePayload as any);
            saved = await api.getArticleById(currentId);
        } else {
            saved = await api.saveArticle(articlePayload as any);
        }
        setSavedArticleResult(saved);
        if (saved?.id) setActiveArticleId(saved.id);

        clearInterval(progressInterval);
        setProgress(100);
        setGenerationStatus('success');
    } catch (e) {
      clearInterval(progressInterval);
      setError("Error de conexión con la IA.");
      setGenerationStatus('idle');
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
      setOutline(Array.isArray(generatedOutline) ? generatedOutline : ["H2: Introducción", "H2: Contenido Principal", "H2: Conclusión"]);
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
        setArticleContent(`<p>Demostración para <strong>${articleTitle}</strong>.</p>`);
        setStep(5);
        setLoading(false);
        return;
    }

    const projectContext = userProjects.find(p => p.id === selectedProject);
    try {
      const result = await generateFullArticle(selectedTitle.title, outline, objective, ctaLink || '#', keyword, projectContext);
      const finalTitle = result.title || selectedTitle.title;
      setArticleTitle(finalTitle);
      setMetaTitle(finalTitle);
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
      id: activeArticleId || editArticleId || preFilledData?.articleId,
      projectId: selectedProject || preSelectedProjectId || undefined,
      masterArticleId: (preFilledData?.articleId && String(preFilledData.articleId).startsWith('available-')) 
        ? String(preFilledData.articleId).replace('available-', '') 
        : undefined,
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
      psychologicalStrategy: { targetUrl: ctaLink },
      status: status,
      publishedAt: new Date(publishDate),
      isGenerated: true
    };

    try {
      addLog("Validando datos...");
      await onSave(articlePayload);
      addLog("Guardado exitoso en base de datos.");
      setSaveStatus('success');
      setTimeout(() => {
        setIsLogModalOpen(false);
        if (onClose) onClose();
        else navigate('/dashboard/articles');
      }, 1500);
    } catch (e: any) {
      addLog("❌ ERROR CRÍTICO");
      addLog(`Mensaje: ${e.message}`);
      setSaveStatus('error');
    }
  };

  const handlePageRedirectSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    setValidationError(false);
    const page = userPages.find(p => String(p.id) === String(pageId));
    if (page) {
        const url = page.customDomain ? `https://${page.customDomain}` : `https://aprende.marketing/admin/lp/${page.subdomain}/`;
        setCtaLink(url);
    } else {
        setCtaLink('');
    }
  };

  const handleAddNewHotlink = async () => {
      if (!selectedProject || !newLinkLabel || !newLinkUrl) return;
      setSavingNewLink(true);
      try {
          const proj = userProjects.find(p => p.id === selectedProject);
          if (proj) {
              const updatedLinks = [...(proj.affiliateLinks || []), { label: newLinkLabel, url: newLinkUrl }];
              await api.updateProject(proj.id, { ...proj, affiliateLinks: updatedLinks } as any);
              setUserProjects(prev => prev.map(p => p.id === proj.id ? { ...p, affiliateLinks: updatedLinks } : p));
              setProjectLinks(updatedLinks);
              setCtaLink(newLinkUrl);
              setIsAddingNewLink(false);
              setNewLinkLabel('');
              setNewLinkUrl('');
          }
      } catch (e) {
          alert("Error al guardar el nuevo Hotlink.");
      } finally {
          setSavingNewLink(false);
      }
  };

  const isRealAdmin = user.role === 'admin' && !isSimulating;
  return (
    <div className={`mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative transition-all duration-500 ${step > 0 ? 'max-w-[98%] xl:max-w-[90rem]' : 'max-w-5xl'}`}>
      <style>{`
        @keyframes loading-shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .progress-shine { position: absolute; top: 0; left: 0; height: 100%; width: 50%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: loading-shine 1.5s infinite; }
      `}</style>

      <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => onClose ? onClose() : navigate('/dashboard/articles')} 
          user={user}
          userId={user.id}
          currentPlan={upgradeProjectId ? (userProjects.find(p => p.id === upgradeProjectId)?.planSlug || 'starter') : 'starter'}
          projectId={upgradeProjectId}
          reason="Has alcanzado el límite de artículos para este proyecto. Actualiza para generar más contenido."
      />

      <div className={`bg-purple-600/10 p-8 text-center border-b border-purple-500/10 relative ${showUpgradeModal || (loading && generationStatus !== 'generating') ? 'opacity-30 pointer-events-none' : ''}`}>
        <button onClick={() => onClose ? onClose() : navigate('/dashboard/articles')} className="absolute top-6 left-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-6 h-6" />
        </button>
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

      <div className={`p-8 flex-1 overflow-y-auto relative transition-colors duration-500 ${showUpgradeModal ? 'opacity-30 pointer-events-none' : ''}`}>
        {tooltipState.visible && (
            <div className="fixed z-[300] w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-5 rounded-2xl shadow-2xl pointer-events-none" style={{ top: tooltipState.y, left: tooltipState.x }}>
                {tooltipState.content.map((text, i) => <p key={i} className="text-sm text-gray-300">{text}</p>)}
            </div>
        )}

        {generationStatus === 'generating' && (
            <div className="fixed top-0 left-0 w-full h-full z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 !m-0">
                <div className="bg-[#0B0B0B] border border-white/5 rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in fade-in duration-500 flex flex-col items-center space-y-10">
                    {/* Icono de la varita con efecto de brillo */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                        <div className="relative w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center border border-blue-500/30 shadow-2xl shadow-blue-500/10">
                            < Wand2 className="w-12 h-12 text-blue-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Texto de generación en negrita y profesional */}
                    <div className="text-center space-y-3">
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
                            Nuestra inteligencia artificial está generando tu artículo completo.
                        </h3>
                    </div>

                    {/* Badge de advertencia */}
                    <div className="px-6 py-2 bg-red-600/20 border border-red-600/30 rounded-full shadow-lg">
                        <p className="text-red-500 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> No cierres esta página
                        </p>
                    </div>

                    {/* Sección de contador con degradado oscuro */}
                    <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-center space-y-4">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tu artículo estará lista en:</p>
                        <div className="text-white font-mono text-6xl font-black tracking-tighter">
                            {Math.floor(Math.max(0, 90 - secondsElapsed) / 60).toString().padStart(2, '0')}:{(Math.max(0, 90 - secondsElapsed) % 60).toString().padStart(2, '0')}
                        </div>
                    </div>

                    {/* Barra de progreso verde gruesa y animada */}
                    <div className="w-full max-w-xl space-y-4">
                        <div className="flex justify-between text-[11px] font-black text-gray-500 uppercase tracking-widest px-1">
                            <span>{loadingMessage}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-8 bg-gray-900 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)] relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="progress-shine"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {generationStatus === 'success' && (
            <div className="fixed top-0 left-0 w-full h-full z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500 !m-0">
                <div className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] w-full max-w-xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                    
                    <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-900/10 scale-110 animate-bounce relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                        <CheckCircle className="w-14 h-14 relative z-10" />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 uppercase tracking-tight leading-tight">¡Artículo Generado con Éxito!</h3>
                        <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-md mx-auto">
                            Tu artículo SEO ha sido optimizado y está listo para ser publicado en tu blog.
                        </p>
                    </div>

                    <div className="w-full space-y-4 pt-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => { 
                                    const basePageSlug = selectedPageId ? userPages.find(p => p.id === selectedPageId)?.subdomain?.split('.')[0] : null; 
                                    const articleUrl = basePageSlug ? `/admin/lp/${basePageSlug}/blog/${savedArticleResult?.slug}` : '#'; 
                                    window.open(articleUrl, '_blank'); 
                                }} 
                                className="flex-1 bg-white text-black font-black py-4 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 hover:bg-gray-100 transform hover:scale-[1.03] active:scale-95"
                            >
                                <Eye className="w-5 h-5" /> Ver Artículo
                            </button>
                            <button 
                                onClick={() => { 
                                    const editUrl = window.location.hash.startsWith('#/') ? `#/dashboard/articles/edit/${savedArticleResult?.id}` : `/dashboard/articles/edit/${savedArticleResult?.id}`; 
                                    window.open(editUrl, '_blank'); 
                                }} 
                                className="flex-1 bg-blue-600 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 hover:bg-blue-700 transform hover:scale-[1.03] active:scale-95"
                            >
                                <PenTool className="w-5 h-5" /> Editar Artículo
                            </button>
                        </div>
                        <button 
                            onClick={() => { 
                                setGenerationStatus('idle'); 
                                if (onClose) onClose();
                                else window.location.href = '/dashboard/articles'; 
                            }} 
                            className="w-full py-4 bg-gray-800 text-white font-black rounded-2xl hover:bg-gray-700 transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {generationStatus === 'idle' && (
            <>
                {error && <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-lg mb-6 text-sm">{error}</div>}
                {step === 0 && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
                    <div className="max-w-2xl mx-auto"><h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase"><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">Selecciona tu Proyecto</span></h2><p className="text-gray-400 text-lg leading-relaxed font-medium">Nuestra inteligencia artificial necesita conocer tu estrategia y avatar. Selecciona un proyecto para comenzar.</p></div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {/* CARD: CREAR NUEVO PROYECTO */}
                        <div 
                            className="p-10 bg-[#0B0B0B] border-2 border-dashed border-white/10 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-center group flex flex-col items-center justify-center shadow-2xl relative overflow-hidden h-full cursor-pointer min-h-[400px]" 
                            onClick={() => navigate('/dashboard/projects')}
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all shadow-lg mb-6">
                                <Plus className="w-10 h-10" />
                            </div>
                            <h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors uppercase tracking-tight">Crear Nuevo Proyecto</h4>
                            <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Define un nuevo nicho para generar ganchos</p>
                        </div>

                        {userProjects.map((project) => (
                            <div key={project.id} className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full" onClick={() => handleProjectSelect(project.id)}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-5 mb-8"><div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors shadow-inner"><Briefcase className="w-8 h-8" /></div><div className="flex-1 min-w-0"><h4 className="text-white font-black text-2xl group-hover:text-[#FF5A1F] transition-colors">{project.name}</h4><p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p></div></div>
                                <div className="flex-1 mb-10"><p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p><p className="text-gray-400 text-lg leading-relaxed font-medium">{project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción.")}</p></div>
                                <button className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95" onClick={() => handleProjectSelect(project.id)}>Seleccionar <ChevronRight className="w-5 h-5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {step === 1 && (
                  <>
                    {preFilledData ? (
                      <Step1Inputs 
                          userProjects={userProjects} selectedProject={selectedProject} onSelectProject={handleProjectSelect}
                          userPages={userPages} selectedPageId={selectedPageId} onSelectPage={setSelectedPageId}
                          topic={topic} setTopic={setTopic} objective={objective} setObjective={setObjective}
                          keyword={keyword} setKeyword={setKeyword} onGenerate={() => { setIsAiGeneratedFlow(false); setStep(2); }}
                          onSelectRecommendation={handleSelectRecommendation} loading={loading} onBack={() => setStep(0)}
                          user={user} articleCount={articleCount} setShowUpgradeModal={setShowUpgradeModal} isSimulating={isSimulating} isPreFilled={!!preFilledData}
                          onClose={onClose}
                      />
                    ) : (
                      <div className="space-y-8 animate-in fade-in duration-500">
                        <button onClick={() => setStep(0)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm font-bold"><ChevronRight className="w-4 h-4 rotate-180" /> Volver al selector de proyectos</button>
                        
                        {loadingStrategy ? (
                          <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando Estrategia de Contenidos...</p>
                          </div>
                        ) : (
                          <ProjectStrategy_Content 
                              contentData={strategyData?.modules?.content || []}
                              activeArticle={activeArticle}
                              setActiveArticle={setActiveArticle}
                              selectedArticles={selectedArticles}
                              toggleArticleSelection={toggleArticleSelection}
                              handleTooltipHover={handleTooltipHover}
                              handleTooltipLeave={handleTooltipLeave}
                              onUpgrade={() => setShowUpgradeModal(true)}
                              articleCount={articleCount}
                              planLimits={user.planLimits}
                              isSimulating={isSimulating}
                              hideHeader={true}
                              isEmbedded={true}
                              embeddedProjectId={selectedProject}
                              onArticleSelect={handleSelectRecommendation}
                          />
                        )}
                      </div>
                    )}
                  </>
                )}

                {step === 2 && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {showManualConfirm && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col p-10 text-center space-y-8">
                                <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/30"><AlertTriangle className="w-10 h-10" /></div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">¿Estás seguro de que deseas generar este artículo completo con IA?</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium">Esta acción iniciará el proceso de redacción automática basado en tu configuración.</p>
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button onClick={executeManualGenerateOutline} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-900/20 uppercase text-sm tracking-widest">Sí, Generar Ahora</button>
                                    <button onClick={() => setShowManualConfirm(false)} className="w-full py-5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-2xl transition-all text-xs uppercase tracking-widest">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {!preFilledData && (
                        <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm font-bold"><ChevronRight className="w-4 h-4 rotate-180" /> Volver al selector</button>
                    )}
                    <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 border-dashed mb-6"><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-[#FF5A1F]" /> Proyecto Seleccionado</label><div className="flex items-center justify-between bg-black border border-[#FF5A1F]/20 rounded-xl px-4 py-3"><div className="flex items-center gap-3"><div className="w-5 h-5 text-[#FF5A1F]"><CheckCircle className="w-full h-full"/></div><span className="text-white font-bold">{userProjects.find(p => p.id === selectedProject)?.name || 'Proyecto'}</span></div></div></div>
                    {!preFilledData && (
                        <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 border-dashed mb-6">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-400" /> Landing Page Seleccionada</label>
                            <div className="flex items-center justify-between bg-black border border-blue-500/20 rounded-xl px-4 py-3"><div className="flex items-center gap-3"><div className="w-5 h-5 text-blue-400"><CheckCircle className="w-full h-full"/></div><span className="text-white font-bold">{filteredUserPages.find(p => p.id === selectedPageId)?.name || 'Sin seleccionar'}</span></div><button onClick={() => setIsPageSelectorOpen(true)} className="text-xs text-gray-500 hover:text-white underline transition">Cambiar</button></div>
                        </div>
                    )}
                    {isPageSelectorOpen && (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPageSelectorOpen(false)}>
                            <div className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative" onClick={e => e.stopPropagation()}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-600"></div>
                                <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-start"><div className="space-y-4"><h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500 flex items-center gap-3"><Globe className="w-6 h-6 text-[#FF5A1F]" /> Cambiar Landing Page</h3><p className="text-gray-200 text-sm md:text-base leading-relaxed font-medium mt-4">Selecciona la página a la cual deseas vincular este contenido.</p></div><button onClick={() => setIsPageSelectorOpen(false)} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button></div>
                                <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">{filteredUserPages.map((page) => (<div key={page.id} onClick={() => { setSelectedPageId(page.id); setIsPageSelectorOpen(false); }} className="group w-full flex items-center justify-between p-5 bg-black border border-white/5 rounded-2xl hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all cursor-pointer"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#FF5A1F] group-hover:bg-[#FF5A1F]/10 transition-all shadow-inner"><Globe className="w-5 h-5" /></div><span className="text-white font-bold text-lg group-hover:text-[#FF5A1F] transition-colors">{page.name}</span></div><ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#FF5A1F] transition-all" /></div>))}</div>
                            </div>
                        </div>
                    )}
                    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6"><div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400"><BookOpen className="w-6 h-6" /></div><div><h3 className="text-xl font-bold text-white uppercase tracking-tight">{isAiGeneratedFlow ? 'Creación Automática' : 'Contenido Personalizado'}</h3><p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{isAiGeneratedFlow ? 'Valida la sugerencia de la IA antes de generar' : 'Configura manualmente tu artículo'}</p></div></div>
                        <div className="space-y-6">
                            <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Titulo de tu Artículo de Blog</label><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition" placeholder="Ej: Cómo escalar tu negocio..." /></div>
                            <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Selecciona el Objetivo del Articulo</label><textarea value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition resize-none h-32" placeholder="Describe qué pretendes lograr..." /></div>
                            <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Palabra Clave Objetivo (SEO)</label><input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition" placeholder="Ej: curso de microblading online" /></div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">¿Dónde dirigir a tus visitantes?</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div onClick={() => { setRedirectType('landing'); if (selectedPageId) handlePageRedirectSelect(selectedPageId); }} className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${redirectType === 'landing' ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}><div className={`p-4 rounded-2xl transition-colors ${redirectType === 'landing' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}><Globe className="w-8 h-8" /></div><div><h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${redirectType === 'landing' ? 'text-white' : 'text-gray-400'}`}>Landing Page</h4><p className="text-[10px] text-gray-500 font-medium leading-relaxed">Envía el tráfico a una de tus páginas internas.</p></div></div>
                                    <div onClick={() => { setRedirectType('hotlink'); setCtaLink(''); }} className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${redirectType === 'hotlink' ? 'bg-[#FF5A1F]/10 border-[#FF5A1F] shadow-lg shadow-orange-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}><div className={`p-4 rounded-2xl transition-colors ${redirectType === 'hotlink' ? 'bg-[#FF5A1F] text-white' : 'bg-white/5 text-gray-500'}`}><LinkIcon className="w-8 h-8" /></div><div><h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${redirectType === 'hotlink' ? 'text-white' : 'text-gray-400'}`}>Hotlink Proyecto</h4><p className="text-[10px] text-gray-500 font-medium leading-relaxed">Usa tus enlaces de afiliado de Hotmart.</p></div></div>
                                    <div onClick={() => { setRedirectType('external'); setCtaLink(''); }} className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 group ${redirectType === 'external' ? 'bg-purple-600/10 border-purple-500 shadow-lg shadow-purple-900/20' : 'bg-black border-white/5 hover:border-white/10'}`}><div className={`p-4 rounded-2xl transition-colors ${redirectType === 'external' ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}><ExternalLink className="w-8 h-8" /></div><div><h4 className={`font-black text-sm uppercase tracking-widest mb-1 ${redirectType === 'external' ? 'text-white' : 'text-gray-400'}`}>Link Externo</h4><p className="text-[10px] text-gray-500 font-medium leading-relaxed">Cualquier otra página web externa.</p></div></div>
                                </div>
                                <div className="mt-4">
                                    {redirectType === 'landing' && (
                                        <div className="animate-in fade-in slide-in-from-top-2 relative">
                                            <select 
                                                value={selectedPageId} 
                                                onChange={(e) => handlePageRedirectSelect(e.target.value)} 
                                                className={`w-full bg-black border ${validationError && !selectedPageId ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition appearance-none cursor-pointer`}
                                            >
                                                <option value="" disabled>-- Selecciona una Landing Page --</option>
                                                {filteredUserPages.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                                            </select>
                                            {validationError && !selectedPageId && (
                                                <div className="absolute -bottom-6 left-1 flex items-center gap-1 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                                                    <AlertTriangle className="w-3 h-3" /> Selección de página obligatoria
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {redirectType === 'external' && (
                                        <div className="animate-in fade-in slide-in-from-top-2 relative">
                                            <input 
                                                type="text" 
                                                value={ctaLink} 
                                                onChange={(e) => { setCtaLink(e.target.value); setValidationError(false); }} 
                                                className={`w-full bg-black border ${validationError && !ctaLink ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition`} 
                                                placeholder="https://ejemplo.com/tu-enlace" 
                                            />
                                            {validationError && !ctaLink && (
                                                <div className="absolute -bottom-6 left-1 flex items-center gap-1 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                                                    <AlertTriangle className="w-3 h-3" /> Enlace externo obligatorio
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {redirectType === 'hotlink' && (
                                        <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                                            {isAddingNewLink ? (
                                                <div className="p-6 bg-black border border-white/10 rounded-2xl space-y-4 shadow-xl"><div className="flex justify-between items-center mb-2"><h5 className="text-white font-bold text-sm">Nuevo Hotlink para Proyecto</h5><button onClick={() => setIsAddingNewLink(false)}><X className="w-4 h-4 text-gray-500"/></button></div><div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[10px] text-gray-500 font-black uppercase">Nombre del Enlace</label><input type="text" value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} className="w-full bg-gray-900 border border-white/5 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FF5A1F] outline-none" placeholder="Ej: Checkout Pro" /></div><div className="space-y-1"><label className="text-[10px] text-gray-500 font-black uppercase">URL Hotmart</label><input type="text" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="w-full bg-gray-900 border border-white/5 rounded-xl px-3 py-2 text-emerald-400 text-sm focus:border-[#FF5A1F] outline-none" placeholder="https://go.hotmart.com/..." /></div></div><button onClick={handleAddNewHotlink} disabled={savingNewLink || !newLinkLabel || !newLinkUrl} className="w-full py-3 bg-[#FF5A1F] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#D94A1E] transition flex items-center justify-center gap-2">{savingNewLink ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Guardar en el Proyecto</button></div>
                                            ) : (
                                                <div className={`relative ${validationError && !ctaLink ? 'ring-2 ring-red-500/50 rounded-xl' : ''}`}>
                                                    <select 
                                                        value={ctaLink || ''} 
                                                        className={`w-full bg-black border ${validationError && !ctaLink ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] appearance-none`} 
                                                        onChange={(e) => { 
                                                            if (e.target.value === 'ADD_NEW') { 
                                                                setIsAddingNewLink(true); 
                                                            } else { 
                                                                setCtaLink(e.target.value); 
                                                                setValidationError(false);
                                                            } 
                                                        }}
                                                    >
                                                        <option value="">-- Elige un Hotlink --</option>
                                                        {(projectLinks || []).map((link, i) => (<option key={i} value={link.url}>{link.label}</option>))}
                                                        <option value="ADD_NEW" className="text-[#FF5A1F] font-bold">+ Añadir nuevo Hotlink</option>
                                                    </select>
                                                    {validationError && !ctaLink && (
                                                        <div className="absolute -bottom-6 left-1 flex items-center gap-1 text-red-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                                                            <AlertTriangle className="w-3 h-3" /> Link de destino obligatorio
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={handleManualGenerateOutline} 
                                disabled={loading} 
                                className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 uppercase text-sm tracking-widest ${loading ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />} Generar Artículo Completo con IA
                            </button>
                        </div>
                    </div>
                </div>
                )}

                {step === 3 && <Step2Titles titleIdeas={titleIdeas} onSelectTitle={handleSelectTitle} onBack={() => setStep(2)} loading={loading} />}
                {step === 4 && <Step3Outline outline={outline} setOutline={setOutline} ctaLink={ctaLink} setCtaLink={setCtaLink} onGenerate={handleGenerateArticle} onBack={() => setStep(3)} loading={loading} userPages={filteredUserPages} selectedPageId={selectedPageId} onSelectPage={setSelectedPageId} />}
                {step === 5 && <Step4Editor articleContent={articleContent} setArticleContent={setArticleContent} selectedTitle={selectedTitle} articleTitle={articleTitle} setArticleTitle={setArticleTitle} slug={slug} setSlug={setSlug} selectedPageId={selectedPageId} setSelectedPageId={setSelectedPageId} userPages={filteredUserPages} status={status} setStatus={setStatus} publishDate={publishDate} setPublishDate={setPublishDate} featuredImage={featuredImage} setFeaturedImage={setFeaturedImage} keyword={keyword} setKeyword={setKeyword} seoScore={seoScore} setSeoScore={setSeoScore} metaDescription={metaDescription} setMetaDescription={setMetaDescription} onSave={handleSaveArticle} saving={saveStatus === 'saving'} onBack={() => editArticleId ? navigate('/dashboard/articles') : setStep(4)} isEditing={!!editArticleId} />}
                <SaveLogModal isOpen={isLogModalOpen} saveStatus={saveStatus} saveLogs={saveLogs} onClose={() => setIsLogModalOpen(false)} onRetry={handleSaveArticle} />
            </>
        )}
      </div>
    </div>
  );
};