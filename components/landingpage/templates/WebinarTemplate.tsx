import React, { useState } from 'react';
import { GeneratedPageContent } from '../../../types';
import { User, Target, ArrowRight } from 'lucide-react';
import { Navbar, Footer, UrgencyBar, HeroMedia, RegistrationModal } from '../ui/LiveComponents';
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
  hasBlogArticles: boolean;
  isDark?: boolean;
}

export const WebinarTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  const [showModal, setShowModal] = useState(false);
  const webinarSteps = [
    { num: 1, title: "Regístrate Gratis", text: "Usa el formulario para apartar tu lugar." },
    { num: 2, title: "Revisa tu Correo", text: "Te enviaremos el link de acceso único." },
    { num: 3, title: "Conéctate en Vivo", text: "Asiste a la hora indicada y aprende." }
  ];

  return (
    <div id="webinar-template-root" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
         <UrgencyBar content={content} ds={ds} />
         <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} hasUrgencyBar={true} />
         
         <header id="webinar-hero" className={`relative py-24 lg:py-32 ${ds.hero.bgGradient}`}>
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-10">
                
                {/* 1. Badges */}
                <div className="flex flex-wrap gap-3 justify-center items-center pt-[3em]">
                    <div id="webinar-live-badge" className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${ds.badges.liveBg} ${ds.badges.liveText} ${ds.badges.liveBorder}`}>
                        <span className="flex h-2 w-2 rounded-full bg-current animate-pulse"></span> EN VIVO
                    </div>
                    {content.topTagline && (
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                            {content.topTagline}
                        </div>
                    )}
                </div>

                {/* 2. Headlines */}
                <div className="space-y-4 max-w-4xl mx-auto">
                    {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight leading-tight ${ds.hero.titleColor} ${isMobilePreview ? 'text-4xl' : 'text-5xl md:text-7xl'}`, ds.hero.highlightGradient)}
                    
                    <div id="subtitulo-principal">
                       {renderRichText(content.hero.subheadline, `text-xl opacity-90 leading-tight max-w-2xl mx-auto ${ds.hero.subtitleColor} ${isMobilePreview ? '' : 'md:text-2xl'}`)}
                    </div>
                </div>
                
                {/* 3. Hero Media */}
                <div className={`w-full max-w-4xl aspect-video rounded-2xl shadow-2xl overflow-hidden relative border-4 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                    <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                </div>

                {/* 4. CTA Button */}
                <div id="hero-cta" className="w-full max-w-md mt-4 animate-in slide-in-from-bottom-4 duration-700">
                    <button 
                        onClick={() => setShowModal(true)}
                        className={`w-full py-5 rounded-2xl font-black text-xl transition transform hover:scale-[1.05] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 animate-bounce-subtle ${ds.buttons.primary}`}
                    >
                        REGÍSTRATE A LA CLASE GRATIS
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
         </header>

         <PainPointsModule content={content} ds={ds} />

         <BenefitsModule 
            content={content} 
            ds={ds} 
            isMobilePreview={isMobilePreview}
         />

         <WhatsAppTestimonials 
            testimonials={content.testimonials} 
            title={content.testimonialTitle} 
            subtitle={content.testimonialSubtitle} 
            isMobilePreview={isMobilePreview} 
            ds={ds} 
        />

         <IntroModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
         <InstructorModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
         
         <StepsModule content={content} ds={ds} isMobilePreview={isMobilePreview} title="Asegura tu Cupo en 3 Pasos" steps={webinarSteps} />
         <FaqModule content={content} ds={ds} />
         <FinalCtaModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} />
         <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />

         {showModal && (
            <RegistrationModal 
                content={content} 
                ds={ds} 
                onClose={() => setShowModal(false)} 
                pageId={pageId} 
                basePath={basePath} 
            />
         )}
    </div>
  );
};