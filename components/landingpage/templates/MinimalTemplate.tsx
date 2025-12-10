
import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { SmartCTA, Navbar, Footer, FeatureCard } from '../ui/LiveComponents';
import { getIcon, renderRichText, renderStyledHeadline } from '../utils';
import { Anchor, Sparkles, Plus, Minus, Star, Users, CheckCircle, BookOpen, Zap } from 'lucide-react';

interface TemplateProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  hasBlogArticles?: boolean;
  isDark?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {

  const IntroSection = () => (
    <section className={`py-24 px-6 ${ds.intro.sectionBg}`}>
        <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-6 ${ds.intro.titleColor}`}>{content.intro.title}</h2>
            <div className={`text-lg leading-relaxed ${ds.intro.textColor} mb-12`}>{renderRichText(content.intro.description)}</div>

            {/* Added Centered Image with Floating Card */}
            <div className="relative max-w-2xl mx-auto mb-16">
                 <div className="relative">
                    <div className={`absolute -inset-1 rounded-2xl blur opacity-20 ${ds.blobColor}`}></div>
                    <img src={content.hero.heroImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Intro" className="relative z-10 rounded-2xl shadow-xl w-full object-cover aspect-[16/9]" />
                 </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                {(content.intro.items || []).map((item, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${ds.features.cardBorder} ${ds.features.cardBg}`}>
                        <h4 className={`font-bold mb-2 ${ds.features.titleColor}`}>{item.title}</h4>
                        {renderRichText(item.description, `text-sm ${ds.features.descColor}`)}
                    </div>
                ))}
            </div>
        </div>
    </section>
  );

  const BenefitsSection = () => (
    <section className={`py-24 ${ds.features.sectionBg}`}>
        <div className="px-6 max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold mb-16 text-center ${ds.features.titleColor}`}>{content.benefits.title}</h2>
            <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
            </div>
        </div>
    </section>
  );

  const StepsSection = () => (
    <section className={`py-24 ${ds.steps.sectionBg}`}>
        <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className={`text-3xl font-bold mb-16 ${ds.steps.titleColor}`}>¿Cómo funciona?</h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
                 {/* Connector Line */}
                 <div className={`hidden md:block absolute top-12 left-0 w-full h-0.5 ${ds.steps.cardBorder} z-0`}></div>

                 {[
                    { num: 1, title: "Regístrate", text: "Completa tus datos en el formulario." },
                    { num: 2, title: "Recibe Acceso", text: "Te enviamos todo a tu correo." },
                    { num: 3, title: "Empieza", text: "Inicia tu transformación hoy mismo." }
                 ].map((step, i) => (
                    <div key={i} className="relative z-10 bg-transparent">
                         <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-6 border-4 ${ds.bg} ${ds.steps.cardBorder} ${ds.steps.numberColor} shadow-lg`}>
                             {step.num}
                         </div>
                         <h3 className={`text-xl font-bold mb-3 ${ds.steps.titleColor}`}>{step.title}</h3>
                         <p className={`text-sm ${ds.steps.textColor}`}>{step.text}</p>
                    </div>
                 ))}
            </div>
        </div>
    </section>
  );

  const InstructorSection = () => (
    <section className={`py-24 px-6 max-w-4xl mx-auto ${ds.instructor.sectionBg} rounded-3xl my-12`}>
        <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative shrink-0">
                <img src={content.instructor.imageUrl} alt={content.instructor.name} className={`w-48 h-48 rounded-full object-cover border-4 ${ds.instructor.badgeBorder}`} />
                <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${ds.instructor.badgeBg} ${ds.instructor.badgeText} ${ds.instructor.badgeBorder}`}>
                    {content.instructor.badgeText || "Expert"}
                </div>
            </div>
            <div className="text-center md:text-left flex-1">
                <h3 className={`text-3xl font-bold mb-4 ${ds.instructor.titleColor}`}>{content.instructor.name}</h3>
                {renderRichText(content.instructor.bio, `text-lg mb-8 leading-relaxed ${ds.instructor.bioColor}`)}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${ds.instructor.statBorder} ${ds.instructor.statBg}`}>
                        <Users className={`w-4 h-4 ${ds.instructor.statLabelColor}`}/> 
                        <span className={`font-bold ${ds.instructor.statValueColor}`}>{content.instructor.statsStudents}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${ds.instructor.statBorder} ${ds.instructor.statBg}`}>
                        <Star className={`w-4 h-4 ${ds.decorations.starColor}`}/> 
                        <span className={`font-bold ${ds.instructor.statValueColor}`}>{content.instructor.statsRating}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section className={`py-24 ${ds.testimonials.sectionBg}`}>
        <div className="px-6 max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold mb-16 text-center ${ds.testimonials.titleColor}`}>{content.testimonialTitle}</h2>
            <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.testimonials || []).map((t, i) => (
                    <div key={i} className={`p-8 rounded-2xl shadow-sm border ${ds.testimonials.cardBg} ${ds.testimonials.cardBorder}`}>
                        <div className={`flex gap-1 mb-4 ${ds.decorations.starColor}`}>
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className={`italic mb-6 text-lg leading-relaxed ${ds.testimonials.textColor}`}>"{t.text}"</p>
                        <div>
                            <p className={`font-bold ${ds.testimonials.nameColor}`}>{t.name}</p>
                            {t.location && <p className={`text-sm ${ds.testimonials.roleColor}`}>{t.location}</p>}
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
        <section className={`py-24 px-6 max-w-3xl mx-auto ${ds.bg}`}>
            <h2 className={`text-3xl font-bold mb-12 text-center ${ds.hero.titleColor}`}>Preguntas Frecuentes</h2>
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div key={idx} className={`border rounded-xl overflow-hidden ${ds.faq.cardBorder} ${ds.faq.cardBg}`}>
                        <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between text-left p-5 hover:bg-black/5 transition">
                            <span className={`font-bold ${ds.faq.questionColor}`}>{q.question}</span>
                            <span className={`${ds.faq.iconColor}`}>{openIndex === idx ? <Minus className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}</span>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`p-5 pt-0 ${ds.faq.answerColor} text-sm leading-relaxed`}>
                                {renderRichText(q.answer)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
  };

  const FinalCTASection = () => (
    <section className={`py-24 px-6 text-center ${ds.cta.sectionBg}`}>
        <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl md:text-5xl font-bold mb-8 ${ds.cta.sectionTitleColor}`}>¿Listo para comenzar?</h2>
            <p className={`text-xl mb-12 max-w-2xl mx-auto ${ds.cta.sectionTextColor}`}>Únete ahora y obtén acceso inmediato a todos los recursos.</p>
            <div className="max-w-md mx-auto">
                <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} />
            </div>
        </div>
    </section>
  );

  return (
    <div id="minimal-template-root" className={`min-h-screen font-sans flex flex-col ${ds.bg}`}>
        <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles || false} />

        <div className="flex-1">
             <header className={`relative py-32 px-6 text-center overflow-hidden ${ds.hero.bgGradient}`}>
                  {/* Background Blobs */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none ${ds.blobColor}`}></div>
                  
                  <div className="relative z-10 max-w-4xl mx-auto">
                      {content.topTagline && (
                          <div className="mb-8 flex justify-center">
                              <span className={`inline-block py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                                  {content.topTagline}
                              </span>
                          </div>
                      )}

                      {renderStyledHeadline(content.hero.headline, `text-5xl md:text-7xl font-black mb-8 tracking-tight ${ds.hero.titleColor}`, ds.hero.highlightGradient)}
                      
                      <div className={`text-xl md:text-2xl mb-12 leading-relaxed opacity-90 max-w-2xl mx-auto ${ds.hero.subtitleColor}`}>
                          {renderRichText(content.hero.subheadline)}
                      </div>

                      <div className="max-w-md mx-auto">
                          <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} />
                          <p className={`mt-4 text-sm opacity-70 ${ds.hero.subtitleColor}`}>{content.hero.spotsLeft}</p>
                      </div>
                  </div>
             </header>

             <IntroSection />
             <BenefitsSection />
             <StepsSection />
             <InstructorSection />
             <TestimonialsSection />
             <FAQSection />
             <FinalCTASection />
        </div>
        
        <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />
    </div>
  );
};
