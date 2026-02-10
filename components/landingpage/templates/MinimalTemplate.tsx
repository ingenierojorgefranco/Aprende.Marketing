import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { Navbar, Footer } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline } from '../utils';
import { WhatsAppTestimonials } from './modules/WhatsAppTestimonials';
import { IntroModule } from './modules/IntroModule';
import { InstructorModule } from './modules/InstructorModule';
import { FaqModule } from './modules/FaqModule';
import { PainPointsModule } from './modules/PainPointsModule';
import { StepsModule } from './modules/StepsModule';
import { FinalCtaModule } from './modules/FinalCtaModule';
import { CtaBlockModule } from './modules/CtaBlockModule';
import { BenefitsModule } from './modules/BenefitsModule';

interface TemplateProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  hasBlogArticles?: boolean;
  isDark?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  const minimalSteps = [
    { num: 1, title: "Regístrate", text: "Completa tus datos en el formulario." },
    { num: 2, title: "Recibe Acceso", text: "Te enviamos todo a tu correo." },
    { num: 3, title: "Empieza", text: "Inicia tu transformación hoy mismo." }
  ];

  return (
    <div id="minimal-template-root" className={`min-h-screen font-sans flex flex-col ${ds.bg}`}>
        <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles || false} />

        <div className="flex-1">
             <header className={`relative py-32 px-6 text-center overflow-hidden ${ds.hero.bgGradient}`}>
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none ${ds.blobColor}`}></div>
                  <div className="relative z-10 max-w-4xl mx-auto">
                      {content.topTagline && (
                          <div className="mb-8 flex justify-center">
                              <span className={`inline-block py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                                  {content.topTagline}
                              </span>
                          </div>
                      )}
                      {renderStyledHeadline(content.hero.headline, `text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight ${ds.hero.titleColor}`, ds.hero.highlightGradient)}
                      <div id="subtitulo-principal">
                          {renderRichText(content.hero.subheadline, `text-xl md:text-2xl leading-tight opacity-90 max-w-2xl mx-auto ${ds.hero.subtitleColor} ${isMobilePreview ? '' : 'md:text-2xl'}`)}
                      </div>
                      <div className="max-w-md mx-auto">
                          <CtaBlockModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} sticky={false} />
                      </div>
                  </div>
             </header>

             <IntroModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
             
             <BenefitsModule 
                content={content} 
                ds={ds} 
                isMobilePreview={isMobilePreview}
             />

             <PainPointsModule content={content} ds={ds} />
             <StepsModule content={content} ds={ds} isMobilePreview={isMobilePreview} title="¿Cómo funciona?" steps={minimalSteps} />
             <InstructorModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
             <WhatsAppTestimonials 
                testimonials={content.testimonials} 
                title={content.testimonialTitle} 
                subtitle={content.testimonialSubtitle} 
                isMobilePreview={isMobilePreview} 
                ds={ds} 
            />
             <FaqModule content={content} ds={ds} />
             <FinalCtaModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} title="¿Listo para comenzar?" />
        </div>
        
        <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
    </div>
  );
};