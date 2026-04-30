import React, { useEffect, useState } from 'react';
import { GeneratedPageContent, StructureType, Project } from '../types';
import { api } from '../services/api';
import { SingleBlog } from './landingpage/blog/SingleBlog';
import { LiveThankYouPage } from './landingpage/LiveThankYouPage';
import { LiveLegalPage } from './landingpage/LiveLegalPage';
import { getDesignSystem } from './landingpage/designSystem';
import { Navbar, Footer } from './landingpage/ui/LiveComponents';
import { ClassicSalesTemplate } from './landingpage/templates/ClassicSalesTemplate';
import { WebinarTemplate } from './landingpage/templates/WebinarTemplate';
import { VslTemplate } from './landingpage/templates/VslTemplate';
import { MinimalTemplate } from './landingpage/templates/MinimalTemplate';

interface LivePageProps {
  content: GeneratedPageContent;
  isMobilePreview?: boolean;
  pageId?: string;
  projectId?: string; // Nuevo
  project?: Project;   // Nuevo
  viewMode?: 'home' | 'blog-list' | 'blog-post' | 'thank-you' | 'privacy' | 'terms';
  articleSlug?: string;
  basePath?: string;
}

export const LivePage: React.FC<LivePageProps> = ({ 
  content, 
  isMobilePreview = false,
  pageId,
  projectId,
  project: initialProject,
  viewMode = 'home',
  articleSlug,
  basePath
}) => {
  const [project, setProject] = useState<Project | undefined>(initialProject);

  useEffect(() => {
    // Si ya recibimos el objeto proyecto (precargado o por props)
    if (initialProject) {
        if (project?.id !== initialProject.id) {
          setProject(initialProject);
        }
        return;
    } 
    
    // Si solo tenemos el ID y NO tenemos el objeto cargado aún
    if (projectId && (!project || String(project.id) !== String(projectId))) {
        api.getProjectById(projectId).then(p => {
            if (p) setProject(p);
        }).catch(err => {
            // Silenciamos errores en producción para vistas públicas si falla el fetch adicional
            if (projectId) {
              console.warn("No se pudo cargar el proyecto vía API individual (esperado en dominios públicos).");
            }
        });
    }
  }, [projectId, initialProject]);

  const ds = getDesignSystem(content.palette);
  const structure: StructureType = content.structure || 'classic-sales'; 
  const isDark = content.palette === 'dark-luxury';

  // --- BLOG LOGIC STATE ---
  const [hasBlogArticles, setHasBlogArticles] = useState(false);

  useEffect(() => {
     // Check if there are active articles to show "Blog" in the menu
     if (pageId) {
        api.getPublicBlogArticles(pageId)
           .then(articles => {
               if (articles && articles.length > 0) {
                   setHasBlogArticles(true);
               }
           })
           .catch(() => { /* Ignore error, just don't show link */ });
     }
  }, [pageId]);

  // --- SEO LOGIC (Canonical & Robots) ---
  useEffect(() => {
      // Only run this in browser context and NOT in mobile preview (iframe like)
      if (typeof window !== 'undefined' && !isMobilePreview) {
          const hostname = window.location.hostname;
          
          // Define System Domains that should NOT be indexed (Staging/Dashboard/Preview)
          const systemDomains = [
              'localhost', 
              '127.0.0.1', 
              'generatorlanding.com', 
              'aprende.marketing', 
              'plataformadeventa.com'
          ];
          
          const isSystem = systemDomains.some(d => hostname.includes(d));

          // 1. Robots Meta
          let robotsMeta = document.querySelector('meta[name="robots"]');
          if (!robotsMeta) {
              robotsMeta = document.createElement('meta');
              robotsMeta.setAttribute('name', 'robots');
              document.head.appendChild(robotsMeta);
          }
          
          // System domain -> noindex | Custom domain -> index
          robotsMeta.setAttribute('content', isSystem ? 'noindex, nofollow' : 'index, follow');

          // 2. Canonical Link (Only for production/custom domains)
          if (!isSystem) {
              let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
              if (!canonicalLink) {
                  canonicalLink = document.createElement('link');
                  canonicalLink.setAttribute('rel', 'canonical');
                  document.head.appendChild(canonicalLink);
              }
              // Clean URL (remove query params)
              const canonicalUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
              canonicalLink.setAttribute('href', canonicalUrl);
          } else {
              // If it's a system domain, we might want to remove canonical if it exists or just ensure noindex is enough
              const canonicalLink = document.querySelector('link[rel="canonical"]');
              if (canonicalLink) {
                  canonicalLink.remove();
              }
          }
      }
  }, [isMobilePreview]);

  // --- THANK YOU PAGE RENDER ---
  if (viewMode === 'thank-you') {
      return <LiveThankYouPage content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} />;
  }

  // --- LEGAL PAGES RENDER ---
  if (viewMode === 'privacy' || viewMode === 'terms') {
      return (
          <div className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white ${ds.bg} scroll-smooth relative overflow-hidden`}>
              <div className={`absolute inset-0 ${ds.hero.bgGradient} opacity-100 z-0`}></div>
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>
              
              <div className="relative z-10">
                  <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
                  <LiveLegalPage content={content} ds={ds} type={viewMode} />
                  <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
              </div>
          </div>
      );
  }

  // --- BLOG VIEW RENDER ---
  if (viewMode === 'blog-list' || viewMode === 'blog-post') {
      return (
          <div className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white ${ds.bg} scroll-smooth relative overflow-hidden`}>
              {/* Background Base - Use Landing Page Background Logic */}
              <div className={`absolute inset-0 ${ds.hero.bgGradient} opacity-100 z-0`}></div>
              {/* Decor */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>
              
              <div className="relative z-10">
                  <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
                  <SingleBlog 
                      content={content} 
                      viewMode={viewMode} 
                      pageId={pageId} 
                      articleSlug={articleSlug}
                      basePath={basePath} 
                      designSystem={ds}
                      isDark={isDark}
                  />
                  <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
              </div>
          </div>
      );
  }

  // --- TEMPLATE RENDERING ---
  const commonProps = {
      content,
      ds,
      project, // Nuevo
      isMobilePreview,
      pageId,
      basePath,
      hasBlogArticles,
      isDark
  };

  if (structure === 'classic-sales') {
      return <ClassicSalesTemplate {...commonProps} />;
  }

  if (structure === 'webinar-funnel') {
      return <WebinarTemplate {...commonProps} />;
  }

  if (structure === 'vsl-focused') {
      return <VslTemplate {...commonProps} />;
  }

  // structure === 'minimal-capture'
  return <MinimalTemplate {...commonProps} />;
};