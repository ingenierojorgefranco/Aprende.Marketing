import React, { useState, useEffect } from 'react';
import { generateArticleTitles, generateArticleOutline, generateFullArticle, ArticleTitleIdea } from '../services/geminiService';
import { api } from '../services/api';
import { Article, Project, LandingPage } from '../types';
import { useParams } from 'react-router-dom';

// Importing Sub-Components
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
  
  // Data State
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [keyword, setKeyword] = useState('');

  // Context State
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [userPages, setUserPages] = useState<LandingPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  // Content Generation State
  const [titleIdeas, setTitleIdeas] = useState<ArticleTitleIdea[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<ArticleTitleIdea | null>(null);
  const [outline, setOutline] = useState<string[]>([]);
  const [ctaLink, setCtaLink] = useState('');
  const [articleContent, setArticleContent] = useState('');

  // Metadata State
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  
  // SEO Metrics State
  const [seoScore, setSeoScore] = useState(0);

  // LOG MODAL STATE
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [saveLogs, setSaveLogs] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Initial Load
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

  // Load Article if Editing
  useEffect(() => {
    if (editArticleId) {
        const loadArticle = async () => {
            setLoading(true);
            try {
                const article = await api.getArticleById(editArticleId);
                if (article) {
                    setArticleContent(article.contentHtml);
                    setSelectedTitle({ title: article.title, description: article.description });
                    setSlug(article.slug);
                    setMetaTitle(article.metaTitle || article.title);
                    setMetaDescription(article.metaDescription || article.description);
                    setFeaturedImage(article.featuredImage || '');
                    setKeyword(article.keyword);
                    setStatus(article.status);
                    setPublishDate(new Date(article.publishedAt).toISOString().split('T')[0]);
                    setSelectedPageId(article.pageId || '');
                    setSeoScore(article.seoScore);
                    
                    // Si estamos editando, saltamos directo al editor
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

  // --- HANDLERS ---

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
    // Metadata defaults
    setMetaTitle(idea.title);
    setMetaDescription(idea.description);
    setSlug(idea.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

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
      const content = await generateFullArticle(selectedTitle.title, outline, objective, ctaLink || '#', keyword, projectContext);
      setArticleContent(content || "<p>Error en la generación.</p>");
      setStep(4);
    } catch (e) {
      alert("Error escribiendo artículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!selectedTitle || !onSave) return;
    
    setIsLogModalOpen(true);
    setSaveStatus('saving');
    setSaveLogs([]);
    addLog("Iniciando secuencia de guardado...");

    const articlePayload = {
      id: editArticleId, // Incluir ID si es edición
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
    };

    try {
      addLog("Validando datos...");
      addLog(`Endpoint Objetivo: ${editArticleId ? `/api/articles/${editArticleId}` : '/api/articles'}`);
      addLog(`PAYLOAD:\n${JSON.stringify(articlePayload, null, 2)}`);
      
      await onSave(articlePayload);
      
      addLog("Respuesta del Servidor: 200 OK");
      addLog("Guardado exitoso en base de datos.");
      setSaveStatus('success');

      setTimeout(() => {
        if (saveStatus !== 'error') setIsLogModalOpen(false);
      }, 2500);
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
          seoScore={seoScore}
          setSeoScore={setSeoScore}
          onSave={handleSaveArticle}
          saving={saveStatus === 'saving'}
          onBack={() => setStep(3)}
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