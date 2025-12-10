
import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { PlayCircle, BookOpen, CheckCircle, Star, Award, Users, ScanFace, Palette, Feather, Plus, Minus } from 'lucide-react';
import { Navbar, Footer, SmartCTA, FeatureCard } from '../ui/LiveComponents';
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

export const ClassicSalesTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  const IntroSection = () => (
    <section id="intro-section" className={`py-24 relative overflow-hidden ${ds.intro.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className={`grid gap-12 items-center ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
                <div id="intro-image-container" className="relative">
                     <div id="intro-blob" className={`absolute top-0 left-0 w-2/3 h-2/3 -translate-x-4 -translate-y-4 rounded-3xl ${ds.blobOpacity} ${ds.blobColor}`}></div>
                     <div className="relative">
                        <img id="intro-main-image" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Intro" className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                        <div id="intro-floating-card" className={`absolute -bottom-6 -right-6 z-20 rounded-2xl p-4 shadow-xl max-w-[200px] border hidden md:block transform rotate-2 hover:rotate-0 transition-transform duration-300 ${ds.intro.floatingCardBg} ${ds.intro.floatingCardBorder}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-2 h-12 rounded-full ${content.palette === 'elegant-purple' ? 'bg-purple-500' : 'bg-pink-500'} shrink-0`}></div>
                                <div>
                                    <p className={`text-xs font-bold leading-snug ${ds.intro.floatingCardText}`}>"{content.intro.imageCardText || "Descubre este método exclusivo"}"</p>
                                    <div className={`flex gap-1 mt-2 ${ds.decorations.starColor}`}>{[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}</div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
                <div id="intro-text-container" className="relative z-10">
                    <span id="intro-badge" className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${ds.intro.badgeBg} ${ds.intro.badgeText} ${ds.intro.badgeBorder}`}>Descubre Más</span>
                    <h2 id="intro-title" className={`text-3xl md:text-4xl font-black mb-8 leading-tight ${ds.intro.titleColor}`}>{content.intro.title}</h2>
                    <div id="intro-description" className={`space-y-6 text-lg leading-relaxed ${ds.intro.textColor}`}>{renderRichText(content.intro.description)}</div>
                    <div id="intro-bullets" className="mt-10 space-y-4">
                        {(content.intro.items || []).map((item, i) => (
                            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                                <div id={`intro-bullet-icon-${i}`} className={`p-3 rounded-lg flex-shrink-0 ${ds.intro.bulletIconBg} ${ds.intro.bulletIconColor}`}>
                                   {i === 0 ? <ScanFace className="w-6 h-6" /> : i === 1 ? <Palette className="w-6 h-6" /> : <Feather className="w-6 h-6" />}
                                </div>
                                <div><h4 className={`font-bold text-lg mb-1 ${ds.features.titleColor}`}>{item.title}</h4>{renderRichText(item.description, `text-sm leading-snug ${ds.features.descColor}`)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );

  const BenefitsSection = () => (
    <section id="benefits-section" className={`py-24 ${ds.features.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 id="benefits-title" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.features.titleColor}`}>{content.benefits.title}</h2>
                <p id="benefits-subtitle" className={`text-lg max-w-2xl mx-auto mt-4 leading-relaxed ${ds.features.descColor}`}>{content.benefits.subtitle || "Recibe el arsenal completo de recursos que han llevado a nuestras alumnas a facturar desde su primer mes."}</p>
                <div className={`h-1.5 w-24 rounded-full mx-auto mt-6 ${ds.blobColor}`}></div>
            </div>
            <div id="benefits-grid" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
            </div>
        </div>
    </section>
  );

  const StepsSection = () => (
    <section id="steps-section" className={`py-24 relative ${ds.steps.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 id="steps-title" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.steps.titleColor}`}>Acceder a tu Transformación es Muy Fácil</h2>
                <p id="steps-desc" className={`text-lg max-w-2xl mx-auto ${ds.steps.textColor}`}>En solo 3 simples pasos estarás dentro de la clase que puede cambiar tu carrera.</p>
            </div>
            <div className={`relative grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                 {[
                    { num: 1, title: "Regístrate Ahora", text: "Completa el formulario con tu nombre y correo. Es 100% gratis y seguro." },
                    { num: 2, title: "Confirma tu Correo", text: "Revisa tu bandeja de entrada y haz clic en el enlace para asegurar tu cupo." },
                    { num: 3, title: "Acceso Instantáneo", text: "Recibirás el acceso a la clase y a tu E-book de regalo de inmediato. ¡Aprende a tu ritmo!" }
                 ].map((step, i) => (
                    <div key={i} id={`step-card-${i}`} className={`relative z-10 flex flex-col items-center text-center p-8 rounded-2xl transition hover:-translate-y-2 border ${ds.steps.cardBg} ${ds.steps.cardBorder} ${ds.steps.cardShadow}`}>
                         <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 ${ds.steps.iconContainer} ${ds.steps.numberColor}`}>{step.num}</div>
                         <h3 className={`text-xl font-bold mb-3 ${ds.steps.titleColor}`}>{step.title}</h3>
                         <p className={`text-sm leading-relaxed ${ds.steps.textColor}`}>{step.text}</p>
                    </div>
                 ))}
            </div>
        </div>
    </section>
  );

  const InstructorSection = () => (
    <section id="instructor-section" className={`py-24 relative overflow-hidden ${ds.instructor.sectionBg}`}>
         <div className={`absolute top-1/2 left-0 md:left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] ${ds.blobOpacity} ${ds.blobColor}`}></div>
         <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
            <div className={`flex flex-col items-center gap-12 ${isMobilePreview ? '' : 'md:flex-row md:gap-20'}`}>
                <div className="relative group shrink-0">
                     <div className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 ${ds.blobColor}`}></div>
                     <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 shadow-2xl z-10 ${ds.instructor.badgeBorder}`}>
                        <img id="instructor-image" src={content.instructor.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Instructor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     </div>
                     <div id="instructor-badge" className={`absolute bottom-4 right-4 z-20 backdrop-blur-md border p-3 rounded-2xl shadow-lg flex items-center gap-2 ${ds.instructor.badgeBg} ${ds.instructor.badgeBorder}`}>
                         <Award className={`w-6 h-6 ${ds.decorations.starColor}`} />
                         <div>
                             <p className={`text-[10px] uppercase font-bold tracking-wider ${ds.instructor.badgeText}`}>{content.instructor.badgeText || "Top Rated"}</p>
                             <p className={`text-xs opacity-80 ${ds.instructor.badgeText}`}>{content.instructor.badgeSubtext || "Mentor 2024"}</p>
                         </div>
                     </div>
                </div>
                <div className={`text-center flex-1 ${isMobilePreview ? '' : 'md:text-left'}`}>
                    <h4 id="instructor-subtitle" className={`font-bold uppercase tracking-widest text-sm mb-2 opacity-80 ${ds.instructor.textColor}`}>{content.instructor.title || "Conoce a tu Mentor"}</h4>
                    <h2 id="instructor-name" className={`text-4xl md:text-6xl font-black mb-6 ${ds.instructor.titleColor}`}>{content.instructor.name}</h2>
                    {renderRichText(content.instructor.bio, `text-lg leading-relaxed mb-8 max-w-2xl font-light ${ds.instructor.bioColor} ${isMobilePreview ? 'mx-auto' : 'mx-auto md:mx-0'}`)}
                    <div className={`flex flex-wrap justify-center gap-4 ${isMobilePreview ? '' : 'md:justify-start'}`}>
                        <div className={`border px-6 py-3 rounded-full flex items-center gap-3 ${ds.instructor.statBg} ${ds.instructor.statBorder}`}>
                            <Users className={`w-5 h-5 ${ds.instructor.statLabelColor}`} />
                            <span className={`font-bold ${ds.instructor.statValueColor}`}>{content.instructor.statsStudents || "5k+ Alumnos"}</span>
                        </div>
                        <div className={`border px-6 py-3 rounded-full flex items-center gap-3 ${ds.instructor.statBg} ${ds.instructor.statBorder}`}>
                            <Star className={`w-5 h-5 ${ds.decorations.starColor}`} />
                            <span className={`font-bold ${ds.instructor.statValueColor}`}>{content.instructor.statsRating || "4.9/5 Rating"}</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section id="testimonials-section" className={`py-20 border-b ${ds.testimonials.sectionBg} ${ds.testimonials.sectionBorder}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-12">
                 <h2 id="testimonials-title" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.testimonials.titleColor}`}>{content.testimonialTitle || "Transformaron su pasión en Éxito"}</h2>
                 <p id="testimonials-subtitle" className={`text-lg max-w-2xl mx-auto ${ds.testimonials.subtitleColor}`}>{content.testimonialSubtitle || "Ellas ya dieron el paso. Ahora es tu turno."}</p>
            </div>
            <div id="testimonials-grid" className={`grid gap-6 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.testimonials || []).map((t, i) => (
                    <div key={i} className={`p-6 rounded-2xl flex flex-col gap-4 transition hover:-translate-y-1 backdrop-blur-sm border ${ds.testimonials.cardBg} ${ds.testimonials.cardBorder} ${ds.testimonials.cardShadow}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-white/20">
                                <img src={t.image || `https://randomuser.me/api/portraits/thumb/women/${i+30}.jpg`} alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className={`font-bold leading-tight ${ds.testimonials.nameColor}`}>{t.name}</p>
                                {t.location && <p className={`text-xs ${ds.testimonials.roleColor}`}>{t.location}</p>}
                            </div>
                        </div>
                        <div>
                            {renderRichText(t.text, `text-base leading-relaxed italic ${ds.testimonials.textColor}`)}
                            <div className={`flex mt-3 gap-1 ${ds.decorations.starColor}`}>{[...Array(5)].map((_, starI) => <Star key={starI} className="w-4 h-4" fill={starI < t.rating ? "currentColor" : "none"} stroke="currentColor"/>)}</div>
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
                    {questions.map((q, idx) => (
                        <div key={idx} id={`faq-card-${idx}`} className={`rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? `shadow-lg border-opacity-0 ${ds.faq.cardBg}` : `border-transparent ${ds.faq.cardBg} hover:bg-opacity-80`}`}>
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
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 ${ds.blobOpacity} ${ds.blobColor}`}></div>
        <div className="w-full max-w-[75em] mx-auto px-6 text-center relative z-10">
            <h2 id="final-cta-title" className={`text-3xl md:text-5xl font-bold mb-6 ${ds.cta.sectionTitleColor}`}>¿Lista para cambiar tu vida?</h2>
            <p id="final-cta-desc" className={`text-lg mb-10 max-w-2xl mx-auto ${ds.cta.sectionTextColor}`}>No dejes pasar esta oportunidad. El acceso a la certificación y los bonos exclusivos termina pronto.</p>
            <div className="max-w-md mx-auto"><SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} /></div>
        </div>
    </section>
  );

  return (
    <div id="classic-template-root" className={`min-h-screen font-sans ${ds.selectionColor} ${ds.bg} scroll-smooth`}>
        <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
        
        <header id="hero-section" className={`relative pb-12 overflow-hidden ${ds.hero.bgGradient} ${isMobilePreview ? 'pt-28' : 'pt-24 lg:pt-48 lg:pb-32'}`}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] ${ds.blobOpacity} pointer-events-none ${ds.blobColor}`}></div>
          {content.palette === 'minimal-mono' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>}

          <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
             <div id="hero-headlines" className="text-center max-w-5xl mx-auto mb-10 lg:mb-16">
                 <div id="hero-tagline-wrapper" className="flex justify-center mb-6 lg:mb-8">
                     <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-md shadow-lg ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                          <span className="text-xs md:text-sm font-black uppercase tracking-wider">{content.topTagline || "🔥 Oferta por tiempo limitado"}</span>
                      </div>
                 </div>
                 {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight mb-6 leading-[1.25] max-w-4xl mx-auto ${ds.hero.titleColor} ${isMobilePreview ? 'text-4xl' : 'text-3xl md:text-5xl lg:text-7xl'}`, ds.hero.highlightGradient)}
                 {renderRichText(content.hero.subheadline, `font-light opacity-90 max-w-3xl mx-auto leading-relaxed ${ds.hero.subtitleColor} ${isMobilePreview ? 'text-lg' : 'text-lg md:text-2xl'}`)}
             </div>

             <div className={`grid gap-8 items-start ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-12 lg:gap-12'}`}>
                <div id="hero-content-left" className={`${isMobilePreview ? 'w-full order-2' : 'lg:col-span-7 text-left order-2 lg:order-1'}`}>
                    <div id="hero-video-card" className={`relative w-full aspect-video h-auto rounded-2xl overflow-hidden mb-8 shadow-2xl border cursor-pointer group ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                        <img src={content.hero.heroImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} alt="Clase Gratuita" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                    </div>
                    <div className={`backdrop-blur-sm border rounded-2xl p-6 md:p-8 shadow-lg ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                        <h3 className={`text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 ${ds.features.titleColor}`}>
                             <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${ds.features.iconContainer}`}>{content.whatYouWillLearn.icon ? getIcon(content.whatYouWillLearn.icon, <BookOpen className="w-4 h-4 md:w-5 md:h-5" />) : <BookOpen className="w-4 h-4 md:w-5 md:h-5" />}</div>
                             {content.whatYouWillLearn.title}
                        </h3>
                        <ul className="space-y-4">
                            {content.whatYouWillLearn.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 md:gap-4 p-3 hover:bg-black/5 rounded-lg transition-colors group">
                                    <div className={`mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0 ${ds.blobColor}`}><CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" /></div>
                                    <span className={`text-base md:text-lg leading-snug ${ds.features.descColor}`}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div id="hero-content-right" className={`${isMobilePreview ? 'w-full order-1' : 'lg:col-span-5 lg:sticky lg:top-24 order-1 lg:order-2'}`}>
                     <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} />
                </div>
             </div>
          </div>
        </header>

        <TestimonialsSection />
        <IntroSection />
        <BenefitsSection />
        <StepsSection />
        <InstructorSection />
        <FinalCTASection />
        <FAQSection />
        <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />
    </div>
  );
};