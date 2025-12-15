
import React, { useEffect, useState } from 'react';
import { GeneratedPageContent, StructureType } from '../types';
import { api } from '../services/api';
import { SingleBlog } from './landingpage/blog/SingleBlog';
import { LiveThankYouPage } from './landingpage/LiveThankYouPage';
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
  viewMode?: 'home' | 'blog-list' | 'blog-post' | 'thank-you';
  articleSlug?: string;
  basePath?: string;
}

export const LivePage: React.FC<LivePageProps> = ({ 
  content, 
  isMobilePreview = false,
  pageId,
  viewMode = 'home',
  articleSlug,
  basePath
}) => {
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

  // --- THANK YOU PAGE RENDER ---
  if (viewMode === 'thank-you') {
      return <LiveThankYouPage content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} />;
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
                  <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />
              </div>
          </div>
      );
  }

  // --- TEMPLATE RENDERING ---
  const commonProps = {
      content,
      ds,
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
