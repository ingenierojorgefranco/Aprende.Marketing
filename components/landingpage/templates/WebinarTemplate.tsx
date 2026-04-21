import React, { useState, useEffect } from 'react';
import { GeneratedPageContent, Project } from '../../../types';
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

export const WebinarTemplate: React.FC<TemplateProps> = ({ content, ds, project, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  const [showModal, setShowModal] = useState(false);
  const capture = content.capture || {};
  const initialMinutes = capture.timerDuration !== undefined ? capture.timerDuration : 15;
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
      const timer = setInterval(() => {
          setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
  }, []);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  const webinarSteps = [
    { num: 1, title: "Regístrate Gratis", text: "Usa el formulario para apartar tu lugar." },
    { num: 2, title: "Revisa tu Correo", text: "Te enviaremos el link de acceso único." },
    { num: 3, title: "Conéctate en Vivo", text: "Asiste a la hora indicada y aprende." }
  ];

  return (
    <div id="webinar-template-root" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
         <UrgencyBar content={content} ds={ds} />
         <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} hasUrgencyBar={true} />
         
         <header id="webinar-hero" className={`relative pt-24 lg:pt-32 pb-12 md:pb-[4rem] ${ds.hero.bgGradient}`}>
            <div className="w-full max-w-5xl mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6 md:gap-10">
                
                 {/* 1. Badges */}
                 <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center pt-[2em] md:pt-[3em]">
                     {content.topTagline && (
                         <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-bold ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder} font-['Verdana'] text-xs md:text-[1.2rem] mt-8 md:mt-[2em]`}>
                             {content.topTagline}
                         </div>
                     )}
                 </div>

                 {/* 2. Headlines */}
                 <div className="space-y-4 max-w-4xl mx-auto px-2">
                     {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight leading-[1.2] font-['Verdana'] ${ds.hero.titleColor} ${isMobilePreview ? 'text-2xl md:text-4xl' : 'text-3xl md:text-[3.8rem]'}`, ds.hero.highlightGradient)}
                     
                     <div id="subtitulo-principal">
                        {renderRichText(content.hero.subheadline, `text-white font-normal mt-4 md:mt-[1.2em] text-lg md:text-[1.6em] leading-relaxed md:leading-[1.4em] max-w-[54rem] mx-auto`)}
                     </div>
                 </div>
                
                {/* 3. Hero Media */}
                <div className={`w-full max-w-[61rem] aspect-video rounded-2xl shadow-2xl overflow-hidden relative border-2 md:border-4 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                    <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                </div>

                {/* 4. CTA Button con Sentido de Urgencia */}
                <div id="hero-cta" className="w-full max-w-2xl mt-4 animate-in slide-in-from-bottom-4 duration-700 flex flex-col items-center gap-6 md:gap-8 text-center text-white">
                    
                    {/* Bloque de Urgencia Quemado con Botón Integrado */}
                    <div className="bg-white/10 border border-white/20 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] w-full shadow-2xl space-y-6 md:space-y-8">
                        
                        <div className="space-y-2">
                            <h3 className="text-xl md:text-5xl font-black text-yellow-400">{content.hero.spotsLeft || "✨ ¡Solo 5 cupos disponibles!"}</h3>
                            <div className="space-y-1">
                                <p className="opacity-70 font-['Verdana'] tracking-normal pt-2 md:pt-[0.8em] text-sm md:text-[1.2em] font-normal">Cerramos inscripciones a la clase gratuita en</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-center items-center gap-3 md:gap-6">
                            {[
                                { val: m, label: "MINUTOS" },
                                { val: s, label: "SEGUNDOS" }
                            ].map((unit, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex flex-col items-center">
                                        <div className="bg-gradient-to-b from-white/20 to-transparent w-16 h-20 md:w-28 md:h-32 rounded-2xl md:rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                                            <span className="text-2xl md:text-6xl font-black text-white font-mono">{unit.val}</span>
                                        </div>
                                        <span className="text-[0.5rem] md:text-[0.7rem] font-bold text-white/50 mt-2 md:mt-3 tracking-[0.2em]">{unit.label}</span>
                                    </div>
                                    {i === 0 && <span className="text-2xl md:text-5xl font-black text-white/30 pt-2">:</span>}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="pt-4 px-4">
                            <button 
                                onClick={() => setShowModal(true)}
                                className={`w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl transition transform hover:scale-[1.05] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 animate-bounce-subtle bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-pink-500/30 shadow-lg text-white`}
                            >
                                REGÍSTRATE A LA CLASE GRATIS
                                <ArrowRight className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="pt-0 md:pt-2">
                            {/* Social Proof Dinámico */}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <div className="flex -space-x-3 md:-space-x-4">
                                    <img alt="User" className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-xl" src="https://randomuser.me/api/portraits/thumb/women/21.jpg" referrerPolicy="no-referrer" />
                                    <img alt="User" className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-xl" src="https://randomuser.me/api/portraits/thumb/women/22.jpg" referrerPolicy="no-referrer" />
                                    <img alt="User" className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-xl" src="https://randomuser.me/api/portraits/thumb/women/23.jpg" referrerPolicy="no-referrer" />
                                </div>
                                <div className="text-center md:text-left">
                                    <div id="smart-cta-social-proof" className="flex items-center justify-center md:justify-start gap-2 font-black text-2xl md:text-3xl text-white leading-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big w-7 h-7 text-purple-600 fill-current" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg> 
                                        +{content.hero.socialProofCount || "1000"}
                                    </div>
                                    <p className="text-[10px] md:text-[11px] text-white/50 font-bold uppercase tracking-[0.2em] leading-none mt-1 md:mt-2">
                                        {content.capture?.socialProofLabel || "Alumnos registrados"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </header>

         <PainPointsModule content={content} ds={ds} project={project} />

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