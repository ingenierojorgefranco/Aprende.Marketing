import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { PlayCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Navbar, HeroMedia } from '../ui/LiveComponents';
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

export const ClassicSalesTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles, isDark }) => {
  const classicSteps = [
    { num: 1, title: "Regístrate Ahora", text: "Completa el formulario con tu nombre y correo. Es 100% gratis y seguro." },
    { num: 2, title: "Confirma tu Correo", text: "Revisa tu bandeja de entrada y haz clic en el enlace para asegurar tu cupo." },
    { num: 3, title: "Acceso Instantáneo", text: "Recibirás el acceso a la clase y a tu E-book de regalo de inmediato. ¡Aprende a tu ritmo!" }
  ];

  return (
    <div id="classic-template-root" className={`min-h-screen font-sans ${ds.selectionColor} ${ds.bg} scroll-smooth`}>
        <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
        
        <header id="hero-section" className={`relative pb-12 overflow-hidden ${ds.hero.bgGradient} ${isMobilePreview ? 'pt-28' : 'pt-24 lg:pt-36 lg:pb-20'}`}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] ${ds.blobOpacity} pointer-events-none ${ds.blobColor}`}></div>
          {content.palette === 'minimal-mono' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>}

          <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
             <div id="hero-headlines" className="text-center max-w-5xl mx-auto mb-10 lg:mb-16">
                 <div id="hero-tagline-wrapper" className="flex justify-center mb-6 lg:mb-8">
                     <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-md shadow-lg ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                          <span className="text-xs md:text-sm font-black uppercase tracking-wider">{content.topTagline || "🔥 Oferta por tiempo limitado"}</span>
                      </div>
                 </div>
                 {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto ${ds.hero.titleColor} ${isMobilePreview ? 'text-4xl' : 'text-4xl md:text-7xl'}`, ds.hero.highlightGradient)}
                 
                 <div id="subtitulo-principal">
                    {renderRichText(content.hero.subheadline, `font-light opacity-90 max-w-3xl mx-auto leading-tight ${isDark ? 'text-white' : ds.hero.subtitleColor} ${isMobilePreview ? 'text-lg' : 'text-lg md:text-2xl'}`)}
                 </div>
             </div>

             <div className={`grid gap-8 items-start ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-12 lg:gap-12'}`}>
                <div id="hero-content-left" className={`${isMobilePreview ? 'w-full order-2' : 'lg:col-span-7 text-left order-2 lg:order-1'}`}>
                    <div className={`backdrop-blur-sm border rounded-2xl p-6 md:p-8 shadow-lg ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                        <div id="hero-video-card" className={`relative w-full aspect-video h-auto rounded-2xl overflow-hidden shadow-2xl border cursor-pointer group ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                            <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                            {!content.hero.videoUrl && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex items-center gap-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md flex items-center justify-center border group-hover:scale-110 transition-transform ${ds.decorations.playButtonBg} ${ds.decorations.playButtonBorder}`}>
                                            <PlayCircle className={`w-5 h-5 md:w-6 md:h-6 ${ds.decorations.playButtonIcon}`} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-base md:text-lg">{content.hero.videoTitle || "Clase Gratuita: Estrategia Exclusiva"}</p>
                                            <p className="text-gray-300 text-xs md:text-sm">{content.hero.videoDuration || "Duración: 45 Minutos"}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-100/10">
                            <h3 className={`text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 ${ds.features.titleColor}`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${ds.features.iconContainer}`}>
                                    <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                                </div>
                                {content.whatYouWillLearn.title || "¿Te sientes identificada con alguna de estas situaciones?"}
                            </h3>
                            <ul className="space-y-4">
                                {(content.whatYouWillLearn.items || []).map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 md:gap-4 p-3 hover:bg-black/5 rounded-lg transition-colors group">
                                        <div className={`mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0 bg-red-500`}>
                                            <XCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
                                        </div>
                                        <span className={`text-base md:text-lg leading-snug ${ds.features.descColor}`}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="hero-content-right" className={`${isMobilePreview ? 'w-full order-1' : 'lg:col-span-5 lg:sticky lg:top-24 order-1 lg:order-2'}`}>
                     <CtaBlockModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} />
                </div>
             </div>
          </div>
        </header>

        <WhatsAppTestimonials 
            testimonials={content.testimonials} 
            title={content.testimonialTitle} 
            subtitle={content.testimonialSubtitle} 
            isMobilePreview={isMobilePreview} 
            ds={ds} 
        />
        <IntroModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
        
        <BenefitsModule 
            content={content} 
            ds={ds} 
            isMobilePreview={isMobilePreview} 
            showSeparator={true}
        />

        <StepsModule content={content} ds={ds} isMobilePreview={isMobilePreview} description="En solo 3 simples pasos estarás dentro de la clase que puede cambiar tu carrera." steps={classicSteps} />
        <InstructorModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
        <FinalCtaModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} />
        <FaqModule content={content} ds={ds} />
        <FooterModule content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
    </div>
  );
};