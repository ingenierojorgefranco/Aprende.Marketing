import React, { useState } from 'react';
import { GeneratedPageContent, Project } from '../../../types';
import { Navbar, Footer, UrgencyBar, RegistrationModal, HeroMedia } from '../ui/LiveComponents';
import { renderRichText, renderStyledHeadline, getIcon, getProjectStrategy } from '../utils';
import { Check, ArrowRight, Star, MessageCircle, User, Target, HelpCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { WhatsAppTestimonials } from './modules/WhatsAppTestimonials';
import { PainPointsModule } from './modules/PainPointsModule';

interface TemplateProps {
  content: GeneratedPageContent;
  ds: any;
  project?: Project; // Nuevo
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  hasBlogArticles?: boolean;
  isDark?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ content, ds, project, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  const [showModal, setShowModal] = useState(false);
  const strategy = getProjectStrategy(project);
  const pains = strategy?.psychology?.pains || [];
  
  const minimalSteps = [
    { num: 1, title: "Regístrate", text: "Completa tus datos en el formulario." },
    { num: 2, title: "Recibe Acceso", text: "Te enviamos todo a tu correo." },
    { num: 3, title: "Empieza", text: "Inicia tu transformación hoy mismo." }
  ];

  return (
    <div id="minimal-template-root" className="min-h-screen font-sans flex flex-col bg-white text-slate-900 scroll-smooth">
        <UrgencyBar content={content} ds={ds} />
        <div className="sticky top-0 z-[60] bg-slate-900 backdrop-blur-md border-b border-slate-800 shadow-lg">
            <Navbar 
                content={content} 
                ds={{
                    ...ds, 
                    nav: {
                        ...ds.nav, 
                        transparentText: 'text-white', 
                        stickyText: 'text-white',
                        linkHover: 'text-primary'
                    }
                }} 
                isMobilePreview={isMobilePreview} 
                pageId={pageId} 
                basePath={basePath} 
                hasBlogArticles={hasBlogArticles || false} 
                hasUrgencyBar={true} 
                forcePrimaryLinks={false} 
                project={project}
            />
        </div>

        <main className="flex-1 flex flex-col">
             {/* 1. Hero Section */}
             <header className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-8 md:pb-12 text-center">
                  {content.topTagline && (
                      <div className="mb-6 pt-[3em]">
                          <span className="bg-slate-900 text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg inline-block">
                              {content.topTagline}
                          </span>
                      </div>
                  )}
                  {renderStyledHeadline(content.hero.headline, "text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight text-slate-900", "bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary")}
                  <div className="prose prose-lg max-w-none mb-10 text-slate-600">
                      {renderRichText(content.hero.subheadline, "text-xl md:text-2xl leading-relaxed")}
                  </div>

                  {/* Hero Media - Added as requested */}
                  <div className="w-full aspect-video rounded-3xl shadow-2xl overflow-hidden relative border-4 border-white mb-12 bg-slate-100">
                      <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                  </div>
                  
                  <button 
                    onClick={() => setShowModal(true)}
                    className="w-full md:w-auto px-10 py-5 bg-primary text-white rounded-xl font-bold text-xl shadow-xl hover:bg-secondary transition-all transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
                  >
                    ¡QUIERO EMPEZAR AHORA!
                    <ArrowRight className="w-6 h-6" />
                  </button>
             </header>

             <PainPointsModule content={content} ds={ds} project={project} />

             <div className="w-full">
                 {/* 4. Testimonials - WhatsApp Module */}
                 <WhatsAppTestimonials 
                    testimonials={content.testimonials} 
                    title={content.testimonialTitle} 
                    subtitle={content.testimonialSubtitle} 
                    isMobilePreview={isMobilePreview} 
                    ds={ds} 
                    project={project}
                 />
             </div>

             {/* 5. Intro / Detailed Section - Wider and better image */}
             <section className="mb-24 max-w-6xl mx-auto px-6">
                <div className="bg-slate-900 text-white rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 p-10 md:p-14">
                            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Descubre Más</span>
                            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">{content.intro.title}</h2>
                            <div className="prose prose-invert prose-lg max-w-none opacity-90">
                                {renderRichText(content.intro.description, "leading-relaxed")}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative min-h-[500px]">
                            <img 
                                src={content.intro.imageUrl || "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80"} 
                                className="absolute inset-0 w-full h-full object-cover" 
                                alt="Intro" 
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                </div>
             </section>

             <div className="max-w-3xl mx-auto px-6">
                 {/* 6. Instructor */}
                 <section className="mb-24 flex flex-col md:flex-row gap-10 items-center bg-slate-50 p-10 rounded-3xl border border-slate-100">
                    <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-xl">
                        <img src={content.instructor.imageUrl} alt={content.instructor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                        <span className="text-primary font-bold text-sm uppercase tracking-widest mb-2 block">Tu Instructor</span>
                        <h2 className="text-3xl font-bold mb-4 text-slate-900">{content.instructor.name}</h2>
                        <p className="text-slate-600 leading-relaxed italic mb-4">"{content.instructor.bio}"</p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span>{content.instructor.statsRating || "4.9/5 Calificación"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <User className="w-4 h-4 text-primary" />
                                <span>{content.instructor.statsStudents || "+10,000 Alumnos"}</span>
                            </div>
                        </div>
                    </div>
                 </section>
             </div>

             {/* 7. Steps - Wider Section */}
             <section className="bg-slate-50 py-24 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-black mb-16 text-center text-slate-900">¿Cómo funciona?</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {minimalSteps.map((step, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-20 h-20 bg-white text-primary rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-8 shadow-xl border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                                    {step.num}
                                </div>
                                <h3 className="font-bold text-2xl mb-4 text-slate-900">{step.title}</h3>
                                <p className="text-slate-500 text-lg leading-relaxed">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
             </section>

             <div className="max-w-3xl mx-auto px-6">
                 {/* 8. FAQ */}
                 <section className="my-24">
                    <h2 className="text-3xl font-bold mb-10 text-center text-slate-900">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                        {(content.faq || []).map((faq: any, i: number) => (
                            <details key={i} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-primary">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-lg text-slate-900 flex items-center gap-3">
                                        <HelpCircle className="w-5 h-5 text-primary opacity-50" />
                                        {faq.question}
                                    </span>
                                    <span className="transition-transform group-open:rotate-180">
                                        <ArrowRight className="w-5 h-5 rotate-90" />
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                 </section>

                 {/* 9. Final CTA */}
                 <section className="text-center p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-24">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-6 tracking-tight">¿Listo para comenzar tu transformación?</h2>
                        <p className="text-xl opacity-80 mb-10 max-w-xl mx-auto leading-relaxed">
                            No dejes pasar esta oportunidad única de aprender con los mejores y llevar tu carrera al siguiente nivel.
                        </p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="w-full md:w-auto px-12 py-6 bg-primary text-white rounded-2xl font-black text-2xl shadow-2xl hover:bg-secondary transition-all transform hover:scale-105 flex items-center justify-center gap-4 mx-auto"
                        >
                            ¡SÍ, QUIERO EMPEZAR YA!
                            <ArrowRight className="w-8 h-8" />
                        </button>
                        <p className="mt-6 text-sm opacity-50 flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" /> Garantía de satisfacción de 7 días
                        </p>
                    </div>
                 </section>
             </div>
        </main>
        
        <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />

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
    </div>
  );
};