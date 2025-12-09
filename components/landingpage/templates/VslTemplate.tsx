
import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { PlayCircle, Plus, Minus } from 'lucide-react';
import { Navbar, Footer, SmartCTA, FeatureCard } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline } from '../utils';

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
  const BenefitsSection = () => (
    <section id="seccion-beneficios" className="py-12">
        <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${ds.features.titleColor}`}>{content.benefits.title}</h2>
        <div id="grid-beneficios" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
            {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
        </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section id="seccion-testimonios" className="py-12">
        <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${ds.testimonials.titleColor}`}>{content.testimonialTitle || "Resultados"}</h2>
        <div className={`grid gap-6 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
            {(content.testimonials || []).map((t, i) => (
                <div key={i} className={`p-6 rounded-2xl flex flex-col gap-4 shadow-xl transition hover:-translate-y-1 backdrop-blur-sm border ${ds.testimonials.cardBg} ${ds.testimonials.cardBorder}`}>
                    <div>
                        <p className={`font-bold leading-tight ${ds.testimonials.nameColor}`}>{t.name}</p>
                        {renderRichText(t.text, `text-base leading-relaxed italic ${ds.testimonials.textColor}`)}
                    </div>
                </div>
            ))}
        </div>
    </section>
  );

  const FAQSection = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);
    const questions = content.faq || [];
    return (
        <section id="seccion-faq" className="py-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${ds.faq.titleColor}`}>Preguntas Frecuentes</h2>
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div key={idx} className={`rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? `shadow-lg border-opacity-0 ${ds.faq.cardBg}` : `border-transparent ${ds.faq.cardBg} hover:bg-opacity-80`}`}>
                        <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left"><span className={`font-bold text-lg ${ds.faq.questionColor}`}>{q.question}</span><div className={`p-2 rounded-full ${ds.faq.iconBg} ${ds.faq.iconColor}`}>{openIndex === idx ? <Minus className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}</div></button>
                        <div className={`transition-all duration-300 ease-in-out px-6 ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>{renderRichText(q.answer, `leading-relaxed ${ds.faq.answerColor}`)}</div>
                    </div>
                ))}
            </div>
        </section>
    );
  };

  const FinalCTASection = () => (
    <section id="seccion-cta-final" className="py-12 text-center">
        <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${ds.hero.titleColor}`}>¿Listo para comenzar?</h2>
        <div className="max-w-md mx-auto"><SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} /></div>
    </section>
  );

  return (
        <div id="layout-vsl" className={`min-h-screen font-sans ${ds.bg}`}>
            {content.palette !== 'minimal-mono' && <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />}
            
            <div className={`py-12 ${ds.hero.bgGradient}`}>
                <div className="w-full max-w-4xl mx-auto px-6 text-center">
                    {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight mb-6 leading-[1.25] max-w-4xl mx-auto ${ds.hero.titleColor} ${isMobilePreview ? 'text-4xl' : 'text-3xl md:text-5xl lg:text-7xl'}`)}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto px-6 -mt-8 mb-16 relative z-10">
                <div className="aspect-video bg-black rounded-xl shadow-2xl border-4 border-gray-800 overflow-hidden relative group">
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                         <PlayCircle className="w-20 h-20 text-white opacity-50 group-hover:opacity-100 transition duration-300 scale-95 group-hover:scale-100 cursor-pointer" />
                         <p className="absolute bottom-4 text-gray-500 text-sm">El video de ventas se cargaría aquí</p>
                     </div>
                </div>
                <div className="mt-8 text-center max-w-2xl mx-auto">
                    <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={false} />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                <BenefitsSection />
                <div className="my-12 h-px bg-gray-200"></div>
                <TestimonialsSection />
                <FAQSection />
                <FinalCTASection />
            </div>
            
            <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />
        </div>
  );
};
