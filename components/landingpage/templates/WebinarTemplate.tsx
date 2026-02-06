import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { User, Target, AlertTriangle, XCircle } from 'lucide-react';
import { Navbar } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline } from '../utils';
import { WhatsAppTestimonials } from './modules/WhatsAppTestimonials';
import { IntroModule } from './modules/IntroModule';
import { InstructorModule } from './modules/InstructorModule';
import { FaqModule } from './modules/FaqModule';
import { FooterModule } from './modules/FooterModule';
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
  const webinarSteps = [
    { num: 1, title: "Regístrate Gratis", text: "Usa el formulario para apartar tu lugar." },
    { num: 2, title: "Revisa tu Correo", text: "Te enviaremos el link de acceso único." },
    { num: 3, title: "Conéctate en Vivo", text: "Asiste a la hora indicada y aprende." }
  ];

  return (
    <div id="webinar-template-root" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
         <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
         
         <header id="webinar-hero" className={`relative py-24 lg:py-32 ${ds.hero.bgGradient}`}>
            <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-10">
                
                {/* 1. Badges */}
                <div className="flex flex-wrap gap-3 justify-center items-center">
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
                
                {/* 3. Details Row */}
                <div id="webinar-details" className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 ${ds.hero.subtitleColor}`}>
                            <User className="w-5 h-5 opacity-70" /> 
                            <span>Por: <strong>{content.instructor.name}</strong></span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 ${ds.hero.subtitleColor}`}>
                            <Target className="w-5 h-5 opacity-70" />
                            <span>Para: <strong>{content.targetAudience || "Emprendedores"}</strong></span>
                        </div>
                </div>

                {/* 4. Problem Identification Card (Centered) */}
                <div id="what-you-will-learn-card" className={`w-full max-w-3xl border rounded-xl p-8 text-left shadow-lg ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                    <h4 className={`font-bold mb-6 flex items-center justify-center gap-2 text-xl ${ds.features.titleColor}`}>
                        <div className={`w-6 h-6 text-orange-500`}>
                            <AlertTriangle className="w-full h-full" />
                        </div>
                        {content.whatYouWillLearn.title || "¿Te sientes identificada con alguna de estas situaciones?"}
                    </h4>
                    <ul className={`grid gap-4 ${isMobilePreview ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {(content.whatYouWillLearn.items || []).map((item, i) => (
                            <li key={i} className={`flex items-start gap-3 text-base ${ds.features.descColor}`}>
                                <XCircle className={`w-5 h-5 shrink-0 mt-0.5 text-red-500`} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 5. CTA Block */}
                <div id="hero-cta" className="w-full max-w-md mt-4 animate-in slide-in-from-bottom-4 duration-700">
                    <CtaBlockModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} sticky={false} />
                </div>
            </div>
         </header>

         <IntroModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
         <InstructorModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
         
         <BenefitsModule 
            content={content} 
            ds={ds} 
            isMobilePreview={isMobilePreview}
         />

         <StepsModule content={content} ds={ds} isMobilePreview={isMobilePreview} title="Asegura tu Cupo en 3 Pasos" steps={webinarSteps} />
         <WhatsAppTestimonials 
            testimonials={content.testimonials} 
            title={content.testimonialTitle} 
            subtitle={content.testimonialSubtitle} 
            isMobilePreview={isMobilePreview} 
            ds={ds} 
        />
         <FaqModule content={content} ds={ds} />
         <FinalCtaModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} />
         <FooterModule content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
    </div>
  );
};