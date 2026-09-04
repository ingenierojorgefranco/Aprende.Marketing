import React from 'react';
import { GeneratedPageContent, Project } from '../../../types';
import { PlayCircle, CheckCircle, Zap, Star } from 'lucide-react';
import { Navbar, HeroMedia, Footer, UrgencyBar } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline } from '../utils';
import { WhatsAppTestimonials } from './modules/WhatsAppTestimonials';
import { IntroModule } from './modules/IntroModule';
import { InstructorModule } from './modules/InstructorModule';
import { FaqModule } from './modules/FaqModule';
import { PainPointsModule } from './modules/PainPointsModule';
import { StepsModule } from './modules/StepsModule';
import { FinalCtaModule } from './modules/FinalCtaModule';
import { CtaBlockModule } from './modules/CtaBlockModule';

interface TemplateProps {
  content: GeneratedPageContent;
  ds: any;
  project?: Project; // Nuevo
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  hasBlogArticles: boolean;
  isDark?: boolean;
}

export const ClassicSalesTemplate: React.FC<TemplateProps> = ({ content, ds, project, isMobilePreview, pageId, basePath, hasBlogArticles, isDark }) => {
  const classicSteps = [
    { num: 1, title: "Regístrate Ahora", text: "Completa el formulario con tu nombre y correo. Es 100% gratis y seguro." },
    { num: 2, title: "Confirma tu Correo", text: "Revisa tu bandeja de entrada y haz clic en el enlace para asegurar tu cupo." },
    { num: 3, title: "Acceso Instantáneo", text: "Recibirás el acceso a la clase y a tu E-book de regalo de inmediato. ¡Aprende a tu ritmo!" }
  ];

  return (
    <div id="classic-template-root" className={`min-h-screen font-sans ${ds.selectionColor} ${ds.bg} scroll-smooth`}>
        <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} hasUrgencyBar={false} />
             <header id="hero-section" className={`relative pb-12 overflow-hidden ${ds.hero.bgGradient} ${isMobilePreview ? 'pt-28' : 'pt-24 lg:pt-24 lg:pb-20'}`}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] ${ds.blobOpacity} pointer-events-none ${ds.blobColor}`}></div>
          {content.palette === 'minimal-mono' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>}
          <div className="w-full max-w-[81em] mx-auto px-6 relative z-10">
             <div className={`grid gap-10 lg:gap-16 items-start ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-12'}`}>
                <div id="hero-content-left" className={`${isMobilePreview ? 'w-full order-1' : 'lg:col-span-7 text-left order-1'}`}>                    
                    <div id="hero-headlines" className="mb-8">
                        <div id="hero-tagline-wrapper" className="flex justify-start mb-6 mt-[1em] lg:mt-[4em]">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md shadow-sm ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                                <span className="text-xs md:text-sm font-bold uppercase tracking-wider">{content.topTagline || "🔥 Oferta por tiempo limitado"}</span>
                            </div>
                        </div>
                        
                        {renderStyledHeadline(
                            content.hero.headline, 
                            `font-extrabold tracking-tight mb-6 leading-[1.3] max-w-[45rem] ${ds.hero.titleColor} ${isMobilePreview ? 'text-4xl' : 'text-[2.5rem]'}`, 
                            ds.hero.highlightGradient
                        )}
                        
                        <div id="subtitulo-principal" className="max-w-[40rem]">
                            {renderRichText(
                                content.hero.subheadline, 
                                `font-light leading-relaxed ${ds.hero.subtitleColor || 'text-white/80'} ${isMobilePreview ? 'text-lg' : 'text-[1.25rem]'}`
                            )}
                        </div>
                    </div>

                    <div id="intro-image-container" className="relative mt-8 w-full">
                        <div id="intro-blob" className={`absolute top-0 left-0 w-2/3 h-2/3 -translate-x-4 -translate-y-4 rounded-3xl opacity-20 ${ds.blobColor}`}></div>
                        <div className="relative">
                            <img id="intro-main-image" src={content.intro?.imageUrl || content.hero?.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1471&auto=format&fit=crop"} alt="Intro" className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-video" />
                        </div>
                    </div>
                </div>
                <div id="hero-content-right" className={`${isMobilePreview ? 'w-full order-2 mt-4' : 'lg:col-span-4 lg:sticky lg:top-16 order-2'}`}>
                     <CtaBlockModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} project={project} />
                     <div className="mt-8 mb-10 space-y-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                         <h4 className={`font-bold mb-4 flex items-center gap-2 ${ds.hero.titleColor || 'text-white'}`}>
                             <Zap className="w-5 h-5 text-yellow-400" />
                             ¿Por qué unirte hoy?
                         </h4>
                         <ul className="space-y-3">
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Sin experiencia previa
                                 </span>
                             </li>
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Desde casa y a tu ritmo
                                 </span>
                             </li>
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Certificado incluido
                                 </span>
                             </li>
                         </ul>
                     </div>
                </div>
             </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="relative z-20 w-full max-w-[81em] mx-auto px-6 -mt-8 mb-12">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="flex-1 flex flex-col items-center text-center px-4 w-full pt-4 md:pt-0">
                    <span className="text-3xl font-black text-[#0B1120] mb-1">+2.000</span>
                    <span className="text-sm font-medium text-slate-500">Alumnos formados</span>
                </div>
                <div className="flex-1 flex flex-col items-center text-center px-4 w-full pt-4 md:pt-0">
                    <span className="text-3xl font-black text-[#0B1120] mb-2">4.8/5</span>
                    <div className="flex items-center text-yellow-400 mb-1 gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-sm font-medium text-slate-500 mt-1">Valoración promedio</span>
                </div>
                <div className="flex-1 flex flex-col items-center text-center px-4 w-full pt-4 md:pt-0">
                    <span className="text-3xl font-black text-[#0B1120] mb-1">100%</span>
                    <span className="text-sm font-medium text-slate-500">Online y a tu ritmo</span>
                </div>
                <div className="flex-1 flex flex-col items-center text-center px-4 w-full pt-4 md:pt-0">
                    <span className="text-3xl font-black text-[#0B1120] mb-1">Certificado</span>
                    <span className="text-sm font-medium text-slate-500">Incluido</span>
                </div>
            </div>
        </div>

        <IntroModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} project={project} />
        <PainPointsModule content={content} ds={ds} project={project} pageId={pageId} basePath={basePath} />

        <WhatsAppTestimonials 
            testimonials={content.testimonials} 
            title={content.testimonialTitle} 
            subtitle={"Más de 250 Alumnos registrados en los últimos 7 días"} 
            isMobilePreview={isMobilePreview} 
            ds={ds} 
            project={project}
        />
        <InstructorModule content={content} ds={ds} isMobilePreview={isMobilePreview} />
        <StepsModule content={content} ds={ds} isMobilePreview={isMobilePreview} description="En solo 3 simples pasos estarás dentro de la clase que puede cambiar tu carrera." steps={classicSteps} />
        <FinalCtaModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} project={project} />
        <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
    </div>
  );
};