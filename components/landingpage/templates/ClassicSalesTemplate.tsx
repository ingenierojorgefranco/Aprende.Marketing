import React, { useState } from 'react';
import { GeneratedPageContent, Project } from '../../../types';
import { PlayCircle, CheckCircle, Zap, Star, Home, ArrowRight } from 'lucide-react';
import { Navbar, Footer, RegistrationModal } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline, getProjectStrategy } from '../utils';
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
  const [showModal, setShowModal] = useState(false);

  const classicSteps = [
    { num: 1, title: "Regístrate Ahora", text: "Completa el formulario con tu nombre y correo. Es 100% gratis y seguro." },
    { num: 2, title: "Confirma tu Correo", text: "Revisa tu bandeja de entrada y haz clic en el enlace para asegurar tu cupo." },
    { num: 3, title: "Acceso Instantáneo", text: "Recibirás el acceso a la clase y a tu E-book de regalo de inmediato. ¡Aprende a tu ritmo!" }
  ];

  // Sanitizador para evitar nombres de proyectos o copys sobrecargados en el subtítulo
  const cleanSubheadline = (sub?: string): string => {
      if (!sub) return "Accede a la clase gratuita y descubre el paso a paso para dominar técnicas profesionales y crear un negocio rentable desde cero.";
      const lower = sub.toLowerCase();
      if (
          lower.includes('manicurista profesional') || 
          lower.includes('manicurista premium') || 
          lower.includes('acabados de alta gama sin necesidad')
      ) {
          return "Accede a la clase gratuita y descubre el paso a paso para dominar técnicas profesionales y crear un negocio rentable desde cero.";
      }
      return sub;
  };

  const strategy = getProjectStrategy(project);
  const capture = content.capture || {};
  const isLightHero = content.palette === 'minimal-mono' || content.palette === 'energetic-orange';

  const avatarUrls: string[] = (strategy?.modules?.testimonials && strategy.modules.testimonials.length > 0)
    ? strategy.modules.testimonials.slice(0, 3).map((t: any) => t.image)
    : (strategy?.testimonials && strategy.testimonials.length > 0)
      ? strategy.testimonials.slice(0, 3).map((t: any) => t.image)
      : (strategy?.avatars && strategy.avatars.length > 0)
        ? strategy.avatars.slice(0, 3).map((a: any) => a.image)
        : (content.avatarImages && content.avatarImages.length > 0)
          ? content.avatarImages.slice(0, 3)
          : [1, 2, 3].map(i => `https://randomuser.me/api/portraits/thumb/women/${i + 20}.jpg`);

  return (
    <div id="classic-template-root" className={`min-h-screen font-sans ${ds.selectionColor} ${ds.bg} scroll-smooth`}>
        <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} hasUrgencyBar={false} />
        <header id="hero-section" className={`relative pb-14 overflow-hidden ${ds.hero.bgGradient} ${isMobilePreview ? 'pt-28' : 'pt-28 lg:pt-32 lg:pb-20'}`}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] ${ds.blobOpacity} pointer-events-none ${ds.blobColor}`}></div>
          {content.palette === 'minimal-mono' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>}
          <div className="w-full max-w-[81em] mx-auto px-6 relative z-10">
             <div className={`grid gap-10 lg:gap-14 items-center ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-12'}`}>
                {/* COLUMNA IZQUIERDA: Tagline + Titular + Subtítulo + Beneficios + Botón CTA + Prueba Social + Imagen */}
                <div id="hero-content-left" className={`${isMobilePreview ? 'w-full order-1' : 'lg:col-span-7 text-left order-1'}`}>                    
                    <div id="hero-headlines" className="mb-6">
                        <div id="hero-tagline-wrapper" className="flex justify-start mb-5 mt-2 lg:mt-4">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md shadow-sm ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                                <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-wider">{content.topTagline || "CLASE GRATUITA 100% ONLINE"}</span>
                            </div>
                        </div>
                        
                        {renderStyledHeadline(
                            content.hero.headline, 
                            `font-black tracking-tight mb-5 leading-[1.16] max-w-[44rem] ${ds.hero.titleColor} ${isMobilePreview ? 'text-3xl sm:text-4xl' : 'text-4xl lg:text-[2.85rem]'}`, 
                            ds.hero.highlightGradient
                        )}
                        
                        <div id="subtitulo-principal" className="max-w-[39rem]">
                            {renderRichText(
                                cleanSubheadline(content.hero.subheadline), 
                                `font-normal leading-relaxed ${ds.hero.subtitleColor || 'text-white/85'} ${isMobilePreview ? 'text-base sm:text-lg' : 'text-[1.125rem]'}`
                            )}
                        </div>
                    </div>

                    {/* 3 Beneficios en línea horizontal */}
                    <div id="why-join-today-block" className={`flex flex-wrap items-center gap-x-5 gap-y-2.5 mb-7 text-xs sm:text-sm font-medium ${isLightHero ? 'text-gray-800' : 'text-white/90'}`}>
                        <span className="inline-flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${ds.decorations.checkColor} shrink-0`} />
                            <span>Sin experiencia previa</span>
                        </span>
                        <span className={`hidden sm:inline-block h-3.5 w-px ${isLightHero ? 'bg-gray-300' : 'bg-white/20'}`} aria-hidden="true" />
                        <span className="inline-flex items-center gap-2">
                            <Home className={`w-4 h-4 ${ds.decorations.checkColor} shrink-0`} />
                            <span>Desde casa y a tu ritmo</span>
                        </span>
                        <span className={`hidden sm:inline-block h-3.5 w-px ${isLightHero ? 'bg-gray-300' : 'bg-white/20'}`} aria-hidden="true" />
                        <span className="inline-flex items-center gap-2">
                            <Zap className={`w-4 h-4 ${ds.decorations.checkColor} shrink-0`} />
                            <span>Acceso inmediato</span>
                        </span>
                    </div>

                    {/* Botón único que abre la modal de registro */}
                    <div className="mb-7">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className={`${ds.buttons.primary} px-7 sm:px-8 py-4 rounded-xl font-black text-sm sm:text-base uppercase tracking-wide inline-flex items-center justify-center gap-2.5 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer`}
                        >
                            <span>QUIERO MI CLASE GRATIS</span>
                            <ArrowRight className="w-5 h-5 shrink-0" />
                        </button>
                    </div>

                    {/* Prueba social compacta: Avatares + Alumnos registrados + Valoración 4.8/5 */}
                    <div id="hero-social-proof-row" className={`flex flex-wrap items-center gap-5 mb-7 ${isLightHero ? 'text-gray-800' : 'text-white'}`}>
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2.5 shrink-0">
                                {avatarUrls.map((imgUrl, idx) => (
                                    <img
                                        key={idx}
                                        src={imgUrl}
                                        alt="Alumno registrado"
                                        referrerPolicy="no-referrer"
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
                                    />
                                ))}
                            </div>
                            <div className="leading-tight">
                                <div className="font-black text-base sm:text-lg tracking-tight">
                                    {content.hero.socialProofCount || "+1000"}
                                </div>
                                <div className={`text-xs font-medium ${isLightHero ? 'text-gray-600' : 'text-white/75'}`}>
                                    {(capture.socialProofLabel || "alumnos registrados").toLowerCase()}
                                </div>
                            </div>
                        </div>

                        <div className={`h-8 w-px ${isLightHero ? 'bg-gray-300' : 'bg-white/20'}`} aria-hidden="true" />

                        <div className="flex items-center gap-2 leading-tight">
                            <Star className={`w-4 h-4 ${ds.decorations.starColor} fill-current shrink-0`} />
                            <div>
                                <div className="font-black text-base sm:text-lg tracking-tight">4.8/5</div>
                                <div className={`text-xs font-medium ${isLightHero ? 'text-gray-600' : 'text-white/75'}`}>
                                    valoraciones
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Imagen principal de la clase */}
                    <div id="intro-image-container" className="relative w-full max-w-[38rem]">
                        <div id="intro-blob" className={`absolute top-0 left-0 w-2/3 h-2/3 -translate-x-3 -translate-y-3 rounded-3xl opacity-15 ${ds.blobColor}`}></div>
                        <div
                            onClick={() => setShowModal(true)}
                            className={`relative z-10 rounded-2xl overflow-hidden shadow-2xl border ${ds.hero.videoCardBorder || 'border-white/15'} cursor-pointer group`}
                        >
                            <img
                                id="intro-main-image"
                                src={content.intro?.imageUrl || content.hero?.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1471&auto=format&fit=crop"}
                                alt="Clase gratuita"
                                referrerPolicy="no-referrer"
                                className="w-full object-cover aspect-video group-hover:scale-[1.01] transition-transform duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Tarjeta de registro limpia y centrada */}
                <div id="hero-content-right" className={`${isMobilePreview ? 'w-full order-2 mt-4' : 'lg:col-span-5 lg:sticky lg:top-28 order-2'}`}>
                     <CtaBlockModule
                        content={content}
                        ds={ds}
                        isMobilePreview={isMobilePreview}
                        pageId={pageId}
                        basePath={basePath}
                        project={project}
                        sticky={false}
                        hideSocialProof={true}
                        centerBadge={true}
                     />
                </div>
             </div>
          </div>
        </header>

        {showModal && (
            <RegistrationModal
                content={content}
                ds={ds}
                onClose={() => setShowModal(false)}
                pageId={pageId}
                basePath={basePath}
                project={project}
            />
        )}

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