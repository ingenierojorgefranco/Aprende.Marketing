import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { User, Target, Zap, CheckCircle, Plus, Minus, ScanFace, Palette, Feather, Star, AlertTriangle, XCircle } from 'lucide-react';
import { Navbar, Footer, SmartCTA, FeatureCard, HeroMedia } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline, getIcon } from '../utils';

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
  
  const IntroSection = () => (
    <section id="seccion-introduccion" className={`py-20 ${ds.intro.sectionBg} border-b ${ds.intro.badgeBorder}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className={`grid gap-16 items-center ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                {/* Left: Text & Bullets */}
                <div>
                    <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${ds.intro.badgeBg} ${ds.intro.badgeText} ${ds.intro.badgeBorder}`}>Información del Evento</span>
                    <h2 className={`text-3xl font-bold mb-6 ${ds.intro.titleColor}`}>{content.intro.title}</h2>
                    <div className={`text-lg leading-relaxed mb-8 ${ds.intro.textColor}`}>{renderRichText(content.intro.description)}</div>
                    
                    <div className="space-y-4">
                        {(content.intro.items || []).map((item, i) => (
                            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                                <div className={`p-2 rounded-lg flex-shrink-0 ${ds.intro.bulletIconBg} ${ds.intro.bulletIconColor}`}>
                                    {i === 0 ? <ScanFace className="w-5 h-5" /> : i === 1 ? <Palette className="w-5 h-5" /> : <Feather className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-base mb-1 ${ds.features.titleColor}`}>{item.title}</h4>
                                    {renderRichText(item.description, `text-sm leading-snug ${ds.features.descColor}`)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Media with Floating Card */}
                <div className="relative flex justify-center">
                     <div className="relative w-full max-w-md">
                        <div className={`absolute top-4 -right-4 w-full h-full rounded-3xl ${ds.blobColor} opacity-20`}></div>
                        <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden aspect-[4/5]">
                            <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} className="rounded-2xl" />
                        </div>
                        
                        {/* Floating Card */}
                        <div className={`absolute -bottom-6 -left-6 z-20 rounded-xl p-4 shadow-xl max-w-[220px] border bg-white transform rotate-1 hover:rotate-0 transition-transform duration-300 ${ds.intro.floatingCardBg} ${ds.intro.floatingCardBorder}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b from-blue-500 to-purple-600 shrink-0`}></div>
                                <div>
                                    <p className={`text-xs font-bold leading-snug ${ds.intro.floatingCardText}`}>"{content.intro.imageCardText || "Descubre este método exclusivo"}"</p>
                                    <div className={`flex gap-0.5 mt-2 text-yellow-400`}>{[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}</div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    </section>
  );

  const InstructorSection = () => (
    <section id="seccion-instructor" className={`py-24 relative overflow-hidden ${ds.instructor.sectionBg}`}>
         <div className={`absolute top-1/2 left-0 md:left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] ${ds.blobOpacity} ${ds.blobColor}`}></div>
         <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
            <div className={`flex flex-col items-center gap-12 ${isMobilePreview ? '' : 'md:flex-row md:gap-20'}`}>
                <div className="relative group shrink-0">
                     <div className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 ${ds.blobColor}`}></div>
                     <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 shadow-2xl z-10 ${ds.instructor.badgeBorder}`}>
                        <img src={content.instructor.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Instructor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     </div>
                </div>
                <div className={`text-center flex-1 ${isMobilePreview ? '' : 'md:text-left'}`}>
                    <h4 className={`font-bold uppercase tracking-widest text-sm mb-2 opacity-80 ${ds.instructor.textColor}`}>{content.instructor.title || "Conoce a tu Mentor"}</h4>
                    <h2 id="instructor-name" className={`text-4xl md:text-6xl font-black mb-6 ${ds.instructor.titleColor}`}>{content.instructor.name}</h2>
                    {renderRichText(content.instructor.bio, `text-lg leading-relaxed mb-8 max-w-2xl font-light ${ds.instructor.bioColor} ${isMobilePreview ? 'mx-auto' : 'mx-auto md:mx-0'}`)}
                </div>
            </div>
         </div>
    </section>
  );

  const BenefitsSection = () => (
    <section id="seccion-beneficios" className={`py-24 ${ds.features.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${ds.features.titleColor}`}>{content.benefits.title}</h2>
                <p className={`text-lg max-w-2xl mx-auto ${ds.features.descColor}`}>{content.benefits.subtitle}</p>
            </div>
            <div id="benefits-grid" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
            </div>
        </div>
    </section>
  );

  const StepsSection = () => (
    <section id="steps-section" className={`py-20 ${ds.steps.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className={`text-3xl font-bold mb-4 ${ds.steps.titleColor}`}>Asegura tu Cupo en 3 Pasos</h2>
            </div>
            <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                 {[
                    { num: 1, title: "Regístrate Gratis", text: "Usa el formulario para apartar tu lugar." },
                    { num: 2, title: "Revisa tu Correo", text: "Te enviaremos el link de acceso único." },
                    { num: 3, title: "Conéctate en Vivo", text: "Asiste a la hora indicada y aprende." }
                 ].map((step, i) => (
                    <div key={i} className={`flex flex-col items-center text-center p-6 rounded-2xl border transition hover:-translate-y-1 ${ds.steps.cardBg} ${ds.steps.cardBorder}`}>
                         <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-4 ${ds.steps.iconContainer} ${ds.steps.numberColor}`}>{step.num}</div>
                         <h3 className={`text-lg font-bold mb-2 ${ds.steps.titleColor}`}>{step.title}</h3>
                         <p className={`text-sm ${ds.steps.textColor}`}>{step.text}</p>
                    </div>
                 ))}
            </div>
        </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section id="seccion-testimonios" className={`py-20 border-b ${ds.testimonials.sectionBg} ${ds.testimonials.sectionBorder}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-12">
                 <h2 id="testimonials-title" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.testimonials.titleColor}`}>{content.testimonialTitle || "Transformaron su pasión en Éxito"}</h2>
                 <p className={`text-lg max-w-2xl mx-auto ${ds.testimonials.subtitleColor}`}>{content.testimonialSubtitle}</p>
            </div>
            <div className={`grid gap-6 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.testimonials || []).map((t, i) => (
                    <div key={i} className={`p-6 rounded-2xl flex flex-col gap-4 shadow-xl transition hover:-translate-y-1 backdrop-blur-sm border ${ds.testimonials.cardBg} ${ds.testimonials.cardBorder}`}>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={t.image || `https://randomuser.me/api/portraits/thumb/women/${i+30}.jpg`} alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className={`font-bold leading-tight ${ds.testimonials.nameColor}`}>{t.name}</p>
                                    {t.location && <p className={`text-xs mt-1 ${ds.testimonials.roleColor}`}>{t.location}</p>}
                                </div>
                            </div>
                            {renderRichText(t.text, `text-base leading-relaxed italic ${ds.testimonials.textColor}`)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );

  const FAQSection = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);
    const questions = content.faq || [];
    return (
        <section id="faq-section" className={`py-24 ${ds.faq.sectionBg}`}>
            <div className="w-full max-w-4xl mx-auto px-6">
                <div className="text-center mb-16"><h2 id="faq-title" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.faq.titleColor}`}>Preguntas Frecuentes</h2></div>
                <div className="space-y-4">
                    {(questions || []).map((q, idx) => (
                        <div key={idx} className={`rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? `shadow-lg border-opacity-0 ${ds.faq.cardBg}` : `border-transparent ${ds.faq.cardBg} hover:bg-opacity-80`}`}>
                            <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left"><span className={`font-bold text-lg ${ds.faq.questionColor}`}>{q.question}</span><div className={`p-2 rounded-full ${ds.faq.iconBg} ${ds.faq.iconColor}`}>{openIndex === idx ? <Minus className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}</div></button>
                            <div className={`transition-all duration-300 ease-in-out px-6 ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>{renderRichText(q.answer, `leading-relaxed ${ds.faq.answerColor}`)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
  };

  const FinalCTASection = () => (
    <section id="final-cta-section" className={`py-24 relative overflow-hidden ${ds.cta.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6 text-center relative z-10">
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${ds.cta.sectionTitleColor}`}>¿Lista para cambiar tu vida?</h2>
            <p className={`text-lg mb-10 max-w-2xl mx-auto ${ds.cta.sectionTextColor}`}>
                {content.closingOfferText || "No dejes pasar esta oportunidad. Quedan pocos cupos para acceder a todos los beneficios."}
            </p>
            <div className="max-w-md mx-auto"><SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} pageId={pageId} basePath={basePath} /></div>
        </div>
    </section>
  );

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

                {/* 5. CTA (Moved to bottom) */}
                <div id="hero-cta" className="w-full max-w-md mt-4 animate-in slide-in-from-bottom-4 duration-700">
                    <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} centered={true} pageId={pageId} basePath={basePath} />
                </div>
            </div>
         </header>

         <IntroSection />
         <InstructorSection />
         <BenefitsSection />
         <StepsSection />
         <TestimonialsSection />
         <FAQSection />
         <FinalCTASection />
         <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
    </div>
  );
};
