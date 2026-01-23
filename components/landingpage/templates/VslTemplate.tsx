
import React, { useState } from 'react';
import { GeneratedPageContent } from '../../../types';
import { PlayCircle, Plus, Minus, CheckCircle, ScanFace, Palette, Feather, Award, Users, Star, BookOpen, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Navbar, Footer, SmartCTA, FeatureCard, HeroMedia, RegistrationModal } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline, getIcon } from '../utils';
import { WhatsAppTestimonials } from './modules/WhatsAppTestimonials';

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

  const PainPointsSection = () => (
    <section id="seccion-dolores" className={`py-16 ${ds.features.sectionBg}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${ds.features.titleColor}`}>¿Es para ti esta clase?</h2>
            <p className={`text-xl font-medium mb-12 ${ds.features.descColor}`}>Si te pasa que…</p>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                {(content.whatYouWillLearn.items || []).slice(0, 4).map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-6 rounded-2xl border bg-white/50 backdrop-blur-sm ${ds.features.cardBorder}`}>
                        <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                        <p className={`text-[1.2rem] leading-relaxed font-medium ${ds.features.descColor}`}>{item}</p>
                    </div>
                ))}
            </div>
            
            {/* CTA Premium solicitado */}
            <div className="flex justify-center">
                <button 
                  onClick={() => setShowModal(true)}
                  className={`group relative px-10 py-5 bg-primary hover:bg-secondary text-white font-black text-xl rounded-full transition-all shadow-[0_20px_40px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 flex items-center gap-3`}
                >
                    {content.hero.ctaText || "QUIERO REGISTRARME AHORA"}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    </section>
  );

  const IntroSection = () => (
    <section id="seccion-introduccion" className="py-20 max-w-6xl mx-auto px-6">
        <div className={`grid gap-12 items-center ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            {/* Left: Text & Bullets */}
            <div className="text-left">
                <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${ds.intro.badgeBg} ${ds.intro.badgeText} ${ds.intro.badgeBorder}`}>Sobre el método</span>
                <h2 className={`text-3xl font-bold mb-6 ${ds.intro.titleColor}`}>{content.intro.title}</h2>
                <div className={`text-lg leading-relaxed opacity-90 mb-8 ${ds.intro.textColor}`}>{renderRichText(content.intro.description)}</div>
                
                <div className="space-y-4">
                    {(content.intro.items || []).map((item, i) => (
                        <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition hover:border-opacity-100 border-opacity-50 ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                            <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${ds.intro.bulletIconBg} ${ds.intro.bulletIconColor}`}>
                                {i === 0 ? <ScanFace className="w-5 h-5" /> : i === 1 ? <Palette className="w-5 h-5" /> : <Feather className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className={`font-bold mb-1 ${ds.features.titleColor}`}>{item.title}</h4>
                                {renderRichText(item.description, `text-sm ${ds.features.descColor}`)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Image with Floating Card */}
            <div className="relative">
                 <div className={`absolute top-0 right-0 w-2/3 h-2/3 translate-x-4 -translate-y-4 rounded-3xl ${ds.blobOpacity} ${ds.blobColor}`}></div>
                 <div className="relative">
                    <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden aspect-[4/5]">
                        <HeroMedia url={content.hero.videoUrl} poster={content.intro.imageUrl || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1471&auto=format&fit=crop"} ds={ds} className="rounded-2xl" />
                    </div>
                    
                    {/* Floating Card */}
                    <div className={`absolute -bottom-6 -left-6 z-20 rounded-xl p-4 shadow-xl max-w-[200px] border transform -rotate-1 hover:rotate-0 transition-transform duration-300 ${ds.intro.floatingCardBg} ${ds.intro.floatingCardBorder}`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-1.5 h-10 rounded-full ${content.palette === 'elegant-purple' ? 'bg-purple-500' : content.palette === 'modern-blue' ? 'bg-blue-500' : 'bg-green-500'} shrink-0`}></div>
                            <div>
                                <p className={`text-xs font-bold leading-snug ${ds.intro.floatingCardText}`}>"{content.intro.imageCardText || "Descubre este método exclusivo"}"</p>
                                <div className={`flex gap-0.5 mt-2 ${ds.decorations.starColor}`}>{[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}</div>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </section>
  );

  const BenefitsSection = () => (
    <section id="seccion-beneficios" className={`py-24 bg-gray-50 border-y border-gray-100`}>
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
            <h2 className={`text-2xl md:text-4xl font-bold mb-4 text-center ${ds.features.titleColor}`}>
                {content.benefits.title || "¿Qué Aprenderás Registrándote?"}
            </h2>
            <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${ds.features.descColor}`}>
                {content.benefits.subtitle || "No pierdas esta gran oportunidad, Regístrate y recibe todos los Beneficios"}
            </p>
            <div id="benefits-grid" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
            </div>
        </div>
    </section>
  );

  const InstructorSection = () => (
    <section id="seccion-instructor" className={`py-32 ${ds.instructor.sectionBg}`}>
         <div className="w-full max-w-5xl mx-auto px-6">
            <div className={`flex flex-col items-center gap-12 ${isMobilePreview ? '' : 'md:flex-row'}`}>
                <div className="shrink-0 relative group">
                     <div className={`absolute -inset-4 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition duration-500 ${ds.blobColor}`}></div>
                     <div className={`w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-8 shadow-2xl relative z-10 ${ds.instructor.badgeBorder}`}>
                        <img src={content.instructor.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Instructor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     </div>
                     <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-black uppercase tracking-widest border border-white/20 shadow-xl whitespace-nowrap z-20`}>
                         {content.instructor.badgeText || "Mentor VIP"}
                     </div>
                </div>
                <div className="text-center md:text-left flex-1 space-y-6">
                    <div>
                        <h4 className={`font-black uppercase tracking-[0.3em] text-sm mb-4 opacity-70 ${ds.instructor.textColor}`}>{content.instructor.title || "Conoce a tu Mentor"}</h4>
                        <h3 className={`text-5xl md:text-6xl font-black leading-tight ${ds.instructor.titleColor}`}>{content.instructor.name}</h3>
                    </div>
                    {renderRichText(content.instructor.bio, `text-xl leading-relaxed font-light ${ds.instructor.bioColor}`)}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className={`flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-lg`}>
                            <Users className={`w-6 h-6 ${ds.instructor.statLabelColor}`} />
                            <span className={`font-black text-lg ${ds.instructor.statValueColor}`}>{content.instructor.statsStudents || "Alumnas"}</span>
                        </div>
                        <div className={`flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-lg`}>
                            <Star className="w-6 h-6 text-yellow-500 fill-current"/>
                            <span className={`font-black text-lg ${ds.instructor.statValueColor}`}>{content.instructor.statsRating || "4.9/5"}</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    </section>
  );

  const StepsSection = () => (
    <section id="steps-section" className="py-24 max-w-6xl mx-auto px-6 overflow-visible">
        <h2 className={`text-3xl md:text-5xl font-black mb-16 text-center ${ds.features.titleColor}`}>¿Cómo acceder al contenido?</h2>
        <div className="grid md:grid-cols-3 gap-10">
             {[
                { num: 1, title: "Regístrate", text: "Haz clic en el botón y completa tus datos." },
                { num: 2, title: "Recibe Acceso", text: "Te enviaremos todo el material a tu correo." },
                { num: 3, title: "Empieza", text: "Accede a la plataforma y comienza tu transformación." }
             ].map((step, i) => (
                <div key={i} className={`relative group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] flex flex-col items-center text-center`}>
                     <div className={`absolute -top-6 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 transform -rotate-3 group-hover:rotate-0 transition-transform`}>{step.num}</div>
                     <h4 className={`text-2xl font-black mb-4 mt-4 ${ds.features.titleColor}`}>{step.title}</h4>
                     <p className={`text-lg leading-relaxed ${ds.features.descColor}`}>{step.text}</p>
                </div>
             ))}
        </div>
    </section>
  );

  const FAQSection = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);
    const questions = content.faq || [];
    return (
        <section id="faq-section" className="py-16 max-w-3xl mx-auto px-6">
            <h2 className={`text-2xl md:text-4xl font-bold mb-12 text-center ${ds.faq.titleColor}`}>Preguntas Frecuentes</h2>
            <div className="space-y-4">
                {(questions || []).map((q, idx) => (
                    <div key={idx} id={`faq-card-${idx}`} className={`rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? `shadow-lg border-opacity-0 ${ds.faq.cardBg}` : `border-transparent ${ds.faq.cardBg} hover:bg-opacity-80`}`}>
                        <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left">
                            <span className={`font-bold text-lg ${ds.faq.questionColor}`}>{q.question}</span>
                            <div className={`p-2 rounded-full flex-shrink-0 ml-4 ${ds.faq.iconBg} ${ds.faq.iconColor}`}>{openIndex === idx ? <Minus className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}</div>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out px-6 ${openIndex === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {renderRichText(q.answer, `leading-relaxed ${ds.faq.answerColor}`)}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
  };

  const FinalCTASection = () => (
    <section id="final-cta-section" className={`py-16 ${ds.cta.sectionBg} mt-8`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className={`text-2xl md:text-4xl font-bold mb-6 ${ds.cta.sectionTitleColor}`}>¿Estás listo para dar el siguiente paso?</h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${ds.cta.sectionTextColor}`}>
                {content.closingOfferText || "No dejes pasar esta oportunidad. Quedan pocos cupos para acceder a todos los beneficios."}
            </p>
            <div className="flex justify-center">
                <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={false} centered={true} pageId={pageId} basePath={basePath} />
            </div>
        </div>
    </section>
  );

  return (
        <div id="vsl-template-root" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
            <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
            
            {/* UNIFIED HERO SECTION */}
            <header className={`pt-32 pb-16 px-6 ${ds.hero.bgGradient} relative overflow-hidden border-b ${ds.nav.stickyBorder}`}>
                
                {/* Background Decor */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full blur-[120px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
                    
                    {/* Badge (Top Tagline) */}
                    {content.topTagline && (
                        <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
                             <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-md shadow-lg ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                                <span className="text-xs md:text-sm font-black uppercase tracking-wider">{content.topTagline}</span>
                            </div>
                        </div>
                    )}

                    {/* 1. Headline & Subheadline */}
                    <div className="mb-10 space-y-6">
                        {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight leading-[1.1] ${ds.hero.titleColor} ${isMobilePreview ? 'text-3xl' : 'text-4xl md:text-[4rem]'}`, ds.hero.highlightGradient)}
                        
                        <div id="subtitulo-principal">
                            {renderRichText(content.hero.subheadline, `text-lg md:text-[1.5rem] font-light opacity-100 max-w-3xl mx-auto leading-[2.2rem] text-white ${isMobilePreview ? '' : 'md:text-[1.5rem]'}`)}
                        </div>
                    </div>

                    {/* 2. Video Player Component Unificado */}
                    <div className={`w-full aspect-video rounded-2xl shadow-2xl overflow-hidden relative border-4 mb-10 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                        <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                    </div>

                    {/* 3. CTA / Form Section */}
                    <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} centered={true} pageId={pageId} basePath={basePath} />
                        
                        {/* Security Badge below CTA */}
                        <div className={`mt-6 flex items-center justify-center gap-2 text-xs opacity-70 ${ds.hero.subtitleColor}`}>
                            <CheckCircle className="w-4 h-4" /> 
                            <span>{content.capture?.securityText || "Acceso Inmediato & Garantizado"}</span>
                        </div>
                    </div>

                </div>
            </header>

            {/* CONTENT BODY - REORDERED FLOW */}
            <div className="pb-24">
                <PainPointsSection />
                <BenefitsSection />
                <WhatsAppTestimonials 
                    testimonials={content.testimonials} 
                    title={content.testimonialTitle} 
                    subtitle={content.testimonialSubtitle} 
                    isMobilePreview={isMobilePreview} 
                    ds={ds} 
                />
                <IntroSection />
                <InstructorSection />
                <StepsSection />
                <FAQSection />
                <FinalCTASection />
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
