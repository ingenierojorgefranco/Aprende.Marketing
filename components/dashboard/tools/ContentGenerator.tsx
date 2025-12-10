
import React, { useState, useEffect } from 'react';
import { generateArticleTitles, generateArticleOutline, generateFullArticle, ArticleTitleIdea } from '../../../services/geminiService';
import { api } from '../../../services/api';
import { Article, Project, LandingPage } from '../../../types';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Importing Sub-Components from relative sibling folder
import { Step1Inputs } from './content-generator/Step1Inputs';
import { Step2Titles } from './content-generator/Step2Titles';
import { Step3Outline } from './content-generator/Step3Outline';
import { Step4Editor } from './content-generator/Step4Editor';
import { SaveLogModal } from './content-generator/SaveLogModal';

interface ContentGeneratorProps {
    onSave?: (article: any) => Promise<void>;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { id: editArticleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  
  const [seoScore, setSeoScore] = useState(0);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [saveLogs, setSaveLogs] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

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
                    setPublishDate(new Date(article.publishedAt).toISOString().split('T')[0]);
                    setSelectedPageId(article.pageId || '');
                    setSeoScore(article.seoScore);
                    
                    setStep(4);
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
  };

  const handleGenerateTitles = async () => {
    if (!topic || !objective) return alert("Por favor completa el tema y el objetivo.");
    setLoading(true);
    try {
      const titles = await generateArticleTitles(topic, objective, keyword);
      if (Array.isArray(titles)) {
        setTitleIdeas(titles);
        setStep(2);
      } else {
        alert("La IA no devolvió el formato esperado.");
      }
    } catch (e) {
      alert("Error generando títulos.");
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
      setStep(3);
    } catch (e) {
      alert("Error generando esquema.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateArticle = async () => {
    if (!selectedTitle) return;
    setLoading(true);
    const projectContext = userProjects.find(p => p.id === selectedProject);

    try {
      const result = await generateFullArticle(selectedTitle.title, outline, objective, ctaLink || '#', keyword, projectContext);
      
      setArticleContent(result.html || "<p>Error en la generación.</p>");
      if (result.metaDescription) {
          setMetaDescription(result.metaDescription);
      } else {
          setMetaDescription('');
      }
      
      setStep(4);
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
    <div className="h-full flex flex-col">
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
          onGenerate={handleGenerateTitles}
          loading={loading}
        />
      )}

      {step === 2 && (
        <Step2Titles 
          titleIdeas={titleIdeas}
          onSelectTitle={handleSelectTitle}
          onBack={() => setStep(1)}
          loading={loading}
        />
      )}

      {step === 3 && (
        <Step3Outline 
          outline={outline}
          setOutline={setOutline}
          ctaLink={ctaLink}
          setCtaLink={setCtaLink}
          onGenerate={handleGenerateArticle}
          onBack={() => setStep(2)}
          loading={loading}
        />
      )}

      {step === 4 && (
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
          onBack={() => editArticleId ? navigate('/dashboard/articles') : setStep(3)}
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
  );
};
