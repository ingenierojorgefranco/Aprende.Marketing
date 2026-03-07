import React, { useState } from 'react';
import { GeneratedPageContent } from '../../../types';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar, HeroMedia, RegistrationModal, Footer } from '../ui/LiveComponents';
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

export const VslTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  const [showModal, setShowModal] = useState(false);
  const vslSteps = [
    { num: 1, title: "Regístrate", text: "Haz clic en el botón y completa tus datos." },
    { num: 2, title: "Recibe Acceso", text: "Te enviaremos todo el material a tu correo." },
    { num: 3, title: "Empieza", text: "Accede a la plataforma y comienza tu transformación." }
  ];

  return (
        <div id="vsl-template-root" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
            <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
            
            <header className={`pt-32 pb-16 px-6 ${ds.hero.bgGradient} relative overflow-hidden border-b ${ds.nav.stickyBorder}`}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full blur-[120px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>
                <div className="w-full max-w-[70rem] mx-auto flex flex-col items-center text-center relative z-10">
                    {content.topTagline && (
                        <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
                             <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-md shadow-lg ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                                <span className="text-xs md:text-sm font-black uppercase tracking-wider">{content.topTagline}</span>
                            </div>
                        </div>
                    )}
                    <div className="mb-10 space-y-6 w-[80%]">
                        {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight leading-[1.1] ${ds.hero.titleColor} ${isMobilePreview ? 'text-3xl' : 'text-4xl md:text-[4rem]'}`, ds.hero.highlightGradient)}
                        <div id="subtitulo-principal">
                            {renderRichText(content.hero.subheadline, `text-lg md:text-[1.5rem] font-light opacity-100 max-w-3xl mx-auto leading-[2.2rem] text-white ${isMobilePreview ? '' : 'md:text-[1.5rem]'}`)}
                        </div>
                    </div>
                    <div className={`w-full aspect-video rounded-2xl shadow-2xl overflow-hidden relative border-4 mb-10 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                        <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                    </div>
                    <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        <CtaBlockModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} sticky={false} />
                        <div className={`mt-6 flex items-center justify-center gap-2 text-xs opacity-70 ${ds.hero.subtitleColor}`}>
                            <CheckCircle className="w-4 h-4" /> 
                            <span>{content.capture?.securityText || "Acceso Inmediato & Garantizado"}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="pb-24">
                <PainPointsModule content={content} ds={ds} />
                
                <div className="flex justify-center py-10">
                    <button 
                      onClick={() => setShowModal(true)}
                      className={`group relative px-10 py-5 bg-primary hover:bg-secondary text-white font-black text-xl rounded-full transition-all shadow-[0_20px_40px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 flex items-center gap-3`}
                    >
                        {content.hero.ctaText || "QUIERO REGISTRARME AHORA"}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <BenefitsModule 
                    content={content} 
                    ds={ds} 
                    isMobilePreview={isMobilePreview} 
                    className="bg-gray-50 border-y border-gray-100"
                    fallbackSubtitle="No pierdas esta gran oportunidad, Regístrate y recibe todos los Beneficios"
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
                <StepsModule content={content} ds={ds} isMobilePreview={isMobilePreview} title="¿Cómo acceder al contenido?" steps={vslSteps} />
                <FaqModule content={content} ds={ds} />
                <FinalCtaModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} title="¿Estás listo para dar el siguiente paso?" />
            </div>
            
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