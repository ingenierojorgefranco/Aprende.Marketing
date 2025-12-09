
import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { SmartCTA, Navbar, Footer, FeatureCard } from '../ui/LiveComponents';
import { getIcon, renderRichText, renderStyledHeadline } from '../utils';
import { Anchor, Sparkles, Plus, Minus, Star, Users, CheckCircle, BookOpen } from 'lucide-react';

interface TemplateProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  hasBlogArticles?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  
  const IntroSection = () => (
    <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className={`text-2xl font-bold mb-6 ${ds.hero.titleColor}`}>{content.intro.title}</h2>
        <div className={`text-lg leading-relaxed ${ds.hero.subtitleColor} mb-12`}>{renderRichText(content.intro.description)}</div>
        
        {/* Added Centered Image with Floating Card */}
        <div className="relative max-w-md mx-auto mb-16">
             <div className="relative">
                <img src={content.hero.heroImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Intro" className="relative z-10 rounded-2xl shadow-xl w-full object-cover aspect-[4/3] grayscale hover:grayscale-0 transition-all duration-700" />
                
                {/* Floating Card */}
                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-xl p-4 shadow-xl w-64 border bg-white text-left ${ds.intro.floatingCardBorder}`}>
                    <div className="flex items-start gap-3">
                        <div className={`w-1 h-8 rounded-full bg-black shrink-0`}></div>
                        <div>
                            <p className={`text-xs font-bold leading-snug text-black`}>"{content.intro.imageCardText || "Descubre este método exclusivo"}"</p>
                            <div className={`flex gap-0.5 mt-2`}>{[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-black text-black" />)}</div>
                        </div>
                    </div>
                </div>
             </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
            {(content.intro.items || []).map((item, i) => (
                <div key={i} className="border-t pt-4 border-gray-200">
                    <h4 className={`font-bold mb-2 ${ds.hero.titleColor}`}>{item.title}</h4>
                    {renderRichText(item.description, `text-sm ${ds.hero.subtitleColor}`)}
                </div>
            ))}
        </div>
    </section>
  );

  const BenefitsSection = () => (
    <section className={`py-20 ${ds.features.sectionBg}`}>
        <div className="px-6 max-w-6xl mx-auto">
            <h2 className={`text-2xl font-bold mb-12 text-center ${ds.features.titleColor}`}>{content.benefits.title}</h2>
            <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
            </div>
        </div>
    </section>
  );

  const StudyPlanSection = () => (
      <section className="py-20 px-6 max-w-3xl mx-auto border-t border-gray-100">
          <div className="text-center mb-10">
              <BookOpen className="w-8 h-8 mx-auto mb-4 text-black" />
              <h2 className={`text-2xl font-bold ${ds.features.titleColor}`}>{content.whatYouWillLearn.title || "Plan de Estudios"}</h2>
          </div>
          <div className="space-y-4">
              {content.whatYouWillLearn.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                      <span className="text-xs font-mono text-gray-400">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className={`text-base ${ds.features.descColor}`}>{item}</span>
                  </div>
              ))}
          </div>
      </section>
  );

  const InstructorSection = () => (
    <section className="py-20 px-6 max-w-4xl mx-auto border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
                <img src={content.instructor.imageUrl} alt={content.instructor.name} className="w-32 h-32 rounded-full object-cover grayscale" />
                <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white">
                    {content.instructor.badgeText || "Expert"}
                </div>
            </div>
            <div className="text-center md:text-left flex-1">
                <h3 className={`text-xl font-bold mb-2 ${ds.hero.titleColor}`}>{content.instructor.name}</h3>
                {renderRichText(content.instructor.bio, `text-base mb-4 ${ds.hero.subtitleColor}`)}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {content.instructor.statsStudents}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3"/> {content.instructor.statsRating}</span>
                </div>
            </div>
        </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section className={`py-20 ${ds.features.sectionBg}`}>
        <div className="px-6 max-w-5xl mx-auto">
            <h2 className={`text-2xl font-bold mb-12 text-center ${ds.features.titleColor}`}>{content.testimonialTitle}</h2>
            <div className={`grid gap-6 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.testimonials || []).map((t, i) => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <p className={`italic mb-4 text-sm ${ds.hero.subtitleColor}`}>"{t.text}"</p>
                        <p className={`font-bold text-sm ${ds.hero.titleColor}`}>{t.name}</p>
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
        <section className="py-20 px-6 max-w-3xl mx-auto">
            <h2 className={`text-2xl font-bold mb-10 text-center ${ds.hero.titleColor}`}>Preguntas Frecuentes</h2>
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-4">
                        <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between text-left py-2">
                            <span className={`font-medium ${ds.hero.titleColor}`}>{q.question}</span>
                            <span className="text-gray-400">{openIndex === idx ? <Minus className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}</span>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            {renderRichText(q.answer, `text-sm ${ds.hero.subtitleColor}`)}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
  };

  return (
    <div id="minimal-template-root" className={`min-h-screen font-sans flex flex-col ${ds.bg}`}>
        {/* Simple Navbar override */}
        <nav className="py-6 px-6 flex justify-center">
             <div className={`flex items-center gap-2 font-bold ${ds.hero.titleColor}`}>
                {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-5 h-5"/>) : (
                    content.logoSvg ? <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-5 h-5"/>
                )}
                <span>{content.brandName ? content.brandName.replace(/<\/?[^>]+(>|$)/g, "") : "Brand"}</span>
             </div>
        </nav>

        <div className="flex-1">
             <header className="py-20 px-6 text-center max-w-3xl mx-auto">
                  
                  {/* Badge added for Minimal Template */}
                  {content.topTagline && (
                      <div className="mb-6">
                          <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider border bg-gray-100 text-gray-800 border-gray-200">
                              {content.topTagline}
                          </span>
                      </div>
                  )}

                  <h1 id="minimal-headline" className={`text-4xl md:text-6xl font-extrabold mb-6 tracking-tight ${ds.hero.titleColor}`}>
                      {content.hero.headline.replace(/<\/?[^>]+(>|$)/g, "")}
                  </h1>
                  <p id="minimal-subheadline" className={`text-xl mb-10 leading-relaxed ${ds.hero.subtitleColor}`}>
                      {content.hero.subheadline}
                  </p>
                  <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} />
                  </div>
             </header>

             <IntroSection />
             <BenefitsSection />
             <StudyPlanSection /> {/* Added Study Plan */}
             <InstructorSection />
             <TestimonialsSection />
             <FAQSection />
        </div>
        
        <div className={`py-12 border-t ${ds.footer.bg} ${ds.footer.borderTop}`}>
            <div className="max-w-4xl mx-auto px-6 text-center">
                 <p className={`text-sm ${ds.footer.textColor}`}>&copy; {new Date().getFullYear()} {content.brandName ? content.brandName.replace(/<\/?[^>]+(>|$)/g, "") : "Company"}. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>
  );
};
