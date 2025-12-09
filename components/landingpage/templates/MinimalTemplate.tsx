
import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { SmartCTA, Navbar, Footer, FeatureCard } from '../ui/LiveComponents';
import { getIcon, renderRichText, renderStyledHeadline } from '../utils';
import { Anchor, Sparkles, Plus, Minus, ScanFace, Palette, Feather } from 'lucide-react';

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
        <div className={`text-lg leading-relaxed ${ds.hero.subtitleColor}`}>{renderRichText(content.intro.description)}</div>
        
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

  const InstructorSection = () => (
    <section className="py-20 px-6 max-w-4xl mx-auto border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-10">
            <img src={content.instructor.imageUrl} alt={content.instructor.name} className="w-32 h-32 rounded-full object-cover grayscale hover:grayscale-0 transition duration-500" />
            <div className="text-center md:text-left">
                <h3 className={`text-xl font-bold mb-2 ${ds.hero.titleColor}`}>{content.instructor.name}</h3>
                {renderRichText(content.instructor.bio, `text-base ${ds.hero.subtitleColor}`)}
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
