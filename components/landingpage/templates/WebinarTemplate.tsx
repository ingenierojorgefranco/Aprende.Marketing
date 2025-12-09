
import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { User, Target, Zap, CheckCircle, Plus, Minus } from 'lucide-react';
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

export const WebinarTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  const InstructorSection = () => (
    <section id="seccion-instructor" className={`py-24 relative overflow-hidden ${ds.instructor.sectionBg}`}>
         <div className={`absolute top-1/2 left-0 md:left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 ${ds.blobColor}`}></div>
         <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
            <div className={`flex flex-col items-center gap-12 ${isMobilePreview ? '' : 'md:flex-row md:gap-20'}`}>
                <div className="relative group shrink-0">
                     <div className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 ${ds.blobColor}`}></div>
                     <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 shadow-2xl z-10 ${ds.instructor.badgeBorder}`}>
                        <img src={content.instructor.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Instructor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     </div>
                </div>
                <div className={`text-center flex-1 ${isMobilePreview ? '' : 'md:text-left'}`}>
                    <h4 className={`font-bold uppercase tracking-widest text-sm mb-2 opacity-80 ${ds.instructor.textColor}`}>Conoce a tu Mentora</h4>
                    <h2 className={`text-4xl md:text-6xl font-black mb-6 ${ds.instructor.titleColor}`}>{content.instructor.name}</h2>
                    {renderRichText(content.instructor.bio, `text-lg leading-relaxed mb-8 max-w-2xl font-light ${ds.instructor.textColor} ${isMobilePreview ? 'mx-auto' : 'mx-auto md:mx-0'}`)}
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
            </div>
            <div id="grid-beneficios" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
            </div>
        </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section id="seccion-testimonios" className={`py-20 border-b ${ds.testimonials.sectionBg} ${ds.testimonials.sectionBorder}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-12">
                 <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${ds.testimonials.titleColor}`}>{content.testimonialTitle || "Transformaron su pasión en Éxito"}</h2>
            </div>
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
        </div>
    </section>
  );

  const FAQSection = () => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);
    const questions = content.faq || [];
    return (
        <section id="seccion-faq" className={`py-24 ${ds.faq.sectionBg}`}>
            <div className="w-full max-w-4xl mx-auto px-6">
                <div className="text-center mb-16"><h2 className={`text-3xl md:text-4xl font-bold mb-4 ${ds.faq.titleColor}`}>Preguntas Frecuentes</h2></div>
                <div className="space-y-4">
                    {questions.map((q, idx) => (
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
    <section id="seccion-cta-final" className={`py-24 relative overflow-hidden ${ds.cta.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6 text-center relative z-10">
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${ds.hero.titleColor.includes('white') ? 'text-white' : 'text-gray-900'}`}>¿Lista para cambiar tu vida?</h2>
            <div className="max-w-md mx-auto"><SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} /></div>
        </div>
    </section>
  );

  return (
    <div id="layout-webinar" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
         {content.palette !== 'minimal-mono' && <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />}
         
         <header id="cabecera-webinar" className={`relative py-24 lg:py-32 ${ds.hero.bgGradient}`}>
            <div className={`w-full max-w-[75em] mx-auto px-6 grid gap-16 items-center ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
                <div className={`${isMobilePreview ? 'order-2' : 'order-2 lg:order-1'}`}>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold mb-6`}>
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span> EN VIVO
                    </div>
                    {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight mb-6 leading-[1.25] max-w-4xl mx-auto ${ds.hero.titleColor} ${isMobilePreview ? 'text-4xl' : 'text-3xl md:text-5xl lg:text-7xl'}`)}
                    {renderRichText(content.hero.subheadline, `text-xl opacity-90 mb-8 leading-relaxed ${ds.hero.subtitleColor}`)}
                    
                    <div className="space-y-4 mb-8">
                         <div className={`flex items-center gap-3 ${ds.hero.subtitleColor}`}>
                             <User className="w-5 h-5 opacity-70" /> 
                             <span>Impartido por: <strong>{content.instructor.name}</strong></span>
                         </div>
                         <div className={`flex items-center gap-3 ${ds.hero.subtitleColor}`}>
                             <Target className="w-5 h-5 opacity-70" />
                             <span>Para: <strong>{content.targetAudience || "Emprendedores"}</strong></span>
                         </div>
                    </div>

                    <div className={`border rounded-xl p-6 ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${ds.features.titleColor}`}>
                            <Zap className="w-4 h-4 text-yellow-400" /> Lo que aprenderás:
                        </h4>
                        <ul className="grid gap-3">
                            {content.whatYouWillLearn.items.slice(0, 3).map((item, i) => (
                                <li key={i} className={`flex items-start gap-2 text-sm ${ds.features.descColor}`}>
                                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={`${isMobilePreview ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} />
                </div>
            </div>
         </header>

         <InstructorSection />
         <BenefitsSection />
         <TestimonialsSection />
         <FAQSection />
         <FinalCTASection />
         <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />
    </div>
  );
};
