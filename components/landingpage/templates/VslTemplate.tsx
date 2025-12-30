import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { PlayCircle, Plus, Minus, CheckCircle, ScanFace, Palette, Feather, Award, Users, Star, BookOpen } from 'lucide-react';
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

export const VslTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview, pageId, basePath, hasBlogArticles }) => {
  
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
                    <img src={content.hero.heroImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Intro" className="relative z-10 rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]" />
                    
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

  const StudyPlanSection = () => (
      <section id="study-plan-section" className={`py-16 ${ds.features.sectionBg} mx-6 rounded-3xl my-8`}>
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-12">
                  <h2 className={`text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-3 ${ds.features.titleColor}`}>
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                        {content.whatYouWillLearn.icon ? getIcon(content.whatYouWillLearn.icon, <BookOpen className="w-full h-full"/>) : <BookOpen className="w-full h-full"/>}
                      </div>
                      {content.whatYouWillLearn.title || "Lo que aprenderás"}
                  </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  {(content.whatYouWillLearn.items || []).map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-3 p-4 rounded-xl border bg-white/50 backdrop-blur-sm ${ds.features.cardBorder}`}>
                          <div className={`p-1 rounded-full ${ds.decorations.checkColor} bg-current/10`}>
                              <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className={`text-sm font-medium ${ds.features.descColor}`}>{item}</span>
                      </div>
                  ))}
              </div>
          </div>
      </section>
  );

  const BenefitsSection = () => (
    <section id="seccion-beneficios" className={`py-16`}>
        <div className="px-6 md:px-12 max-w-6xl mx-auto">
            <h2 className={`text-2xl md:text-4xl font-bold mb-4 text-center ${ds.features.titleColor}`}>{content.benefits.title}</h2>
            <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${ds.features.descColor}`}>{content.benefits.subtitle}</p>
            <div id="benefits-grid" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.benefits.items || []).map((item, idx) => <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />)}
            </div>
        </div>
    </section>
  );

  const InstructorSection = () => (
    <section id="seccion-instructor" className={`py-16 ${ds.instructor.sectionBg}`}>
         <div className="w-full max-w-4xl mx-auto px-6">
            <div className={`flex flex-col items-center gap-8 ${isMobilePreview ? '' : 'md:flex-row'}`}>
                <div className="shrink-0 relative">
                     <div className={`w-40 h-40 rounded-full overflow-hidden border-4 shadow-xl ${ds.instructor.badgeBorder}`}>
                        <img src={content.instructor.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt="Instructor" className="w-full h-full object-cover" />
                     </div>
                     <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-md whitespace-nowrap ${ds.instructor.badgeBg} ${ds.instructor.badgeText} ${ds.instructor.badgeBorder}`}>
                         {content.instructor.badgeText || "Experto"}
                     </div>
                </div>
                <div className="text-center md:text-left flex-1">
                    <h4 className={`font-bold uppercase tracking-widest text-xs mb-2 opacity-70 ${ds.instructor.textColor}`}>{content.instructor.title || "Conoce a tu Mentor"}</h4>
                    <h3 className={`text-2xl font-bold mb-2 ${ds.instructor.titleColor}`}>{content.instructor.name}</h3>
                    {renderRichText(content.instructor.bio, `text-base leading-relaxed mb-4 ${ds.instructor.bioColor}`)}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                        <span className={`flex items-center gap-1 ${ds.instructor.statLabelColor}`}><Users className="w-4 h-4"/> {content.instructor.statsStudents}</span>
                        <span className={`flex items-center gap-1 ${ds.instructor.statLabelColor}`}><Star className="w-4 h-4 text-yellow-500"/> {content.instructor.statsRating}</span>
                    </div>
                </div>
            </div>
         </div>
    </section>
  );

  const StepsSection = () => (
    <section id="steps-section" className="py-16 max-w-5xl mx-auto px-6">
        <h2 className={`text-2xl md:text-3xl font-bold mb-10 text-center ${ds.features.titleColor}`}>¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-6">
             {[
                { num: 1, title: "Regístrate", text: "Haz clic en el botón y completa tus datos." },
                { num: 2, title: "Recibe Acceso", text: "Te enviaremos todo el material a tu correo." },
                { num: 3, title: "Empieza", text: "Accede a la plataforma y comienza tu transformación." }
             ].map((step, i) => (
                <div key={i} className={`flex flex-col items-center text-center p-6 rounded-xl border border-dashed ${ds.features.cardBorder}`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4 ${ds.steps.numberColor} ${ds.steps.iconContainer}`}>{step.num}</div>
                     <h4 className={`font-bold mb-2 ${ds.features.titleColor}`}>{step.title}</h4>
                     <p className={`text-sm ${ds.features.descColor}`}>{step.text}</p>
                </div>
             ))}
        </div>
    </section>
  );

  const TestimonialsSection = () => (
    <section id="seccion-testimonios" className={`py-16 ${ds.testimonials.sectionBg} border-y ${ds.testimonials.sectionBorder}`}>
        <div className="max-w-6xl mx-auto px-6">
            <h2 className={`text-2xl md:text-4xl font-bold mb-4 text-center ${ds.testimonials.titleColor}`}>{content.testimonialTitle || "Resultados Reales"}</h2>
            <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${ds.testimonials.subtitleColor}`}>{content.testimonialSubtitle}</p>
            <div id="testimonials-grid" className={`grid gap-6 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                {(content.testimonials || []).map((t, i) => (
                    <div key={i} className={`p-8 rounded-2xl flex flex-col gap-4 shadow-lg transition hover:-translate-y-1 backdrop-blur-sm border ${ds.testimonials.cardBg} ${ds.testimonials.cardBorder}`}>
                        <div>
                            <div className="flex gap-1 mb-4 text-yellow-400">
                                {[1,2,3,4,5].map(star => <div key={star} className="w-4 h-4 fill-current">★</div>)}
                            </div>
                            {renderRichText(t.text, `text-base leading-relaxed italic mb-4 ${ds.testimonials.textColor}`)}
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200/20">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    <img src={t.image || `https://randomuser.me/api/portraits/thumb/women/${i+30}.jpg`} alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className={`font-bold leading-tight ${ds.testimonials.nameColor}`}>{t.name}</p>
                                    {t.location && <p className={`text-xs mt-1 ${ds.testimonials.roleColor}`}>{t.location}</p>}
                                </div>
                            </div>
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
            {/* Added closingOfferText paragraph */}
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${ds.cta.sectionTextColor}`}>
                {content.closingOfferText || "No dejes pasar esta oportunidad. Quedan pocos cupos para acceder a todos los beneficios."}
            </p>
            <div className="flex justify-center">
                <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={false} centered={true} pageId={pageId} basePath={basePath} />
            </div>
        </div>
    </section>
  );

  // --- VIDEO COMPONENT HELPER ---
  const VideoPlayer = ({ url, poster }: { url?: string, poster?: string }) => {
      if (!url) {
          // Placeholder Thumbnail Mode
          return (
             <div className={`w-full aspect-video rounded-2xl shadow-2xl overflow-hidden relative group border-4 mb-10 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                 {poster ? (
                     <img src={poster} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                 ) : null}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                     <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center backdrop-blur-md border shadow-2xl group-hover:scale-110 transition-transform cursor-pointer ${ds.decorations.playButtonBg} ${ds.decorations.playButtonBorder}`}>
                        <PlayCircle className={`w-10 h-10 md:w-12 md:h-12 ml-1 ${ds.decorations.playButtonIcon}`} />
                     </div>
                 </div>
                 <div className="absolute bottom-4 left-0 w-full text-center px-4">
                     <p className="text-white/80 text-sm font-medium drop-shadow-md">
                         {content.hero.videoDuration || "Haz clic para ver el video"}
                     </p>
                 </div>
            </div>
          );
      }

      // Check for YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
          let videoId = '';
          if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
          else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1];
          
          const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0`;
          
          return (
              <div className={`w-full aspect-video rounded-2xl shadow-2xl overflow-hidden relative border-4 mb-10 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                  <iframe 
                      src={embedUrl} 
                      className="absolute inset-0 w-full h-full" 
                      title="Video Player" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                  />
              </div>
          );
      }

      // Check for Vimeo
      if (url.includes('vimeo.com')) {
          const videoId = url.split('/').pop();
          const embedUrl = `https://player.vimeo.com/video/${videoId}`;
          return (
              <div className={`w-full aspect-video rounded-2xl shadow-2xl overflow-hidden relative border-4 mb-10 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                  <iframe 
                      src={embedUrl} 
                      className="absolute inset-0 w-full h-full" 
                      title="Video Player" 
                      allow="autoplay; fullscreen; picture-in-picture" 
                      allowFullScreen 
                  />
              </div>
          );
      }

      // Default HTML5 Video (Direct MP4)
      return (
          <div className={`w-full aspect-video rounded-2xl shadow-2xl overflow-hidden relative border-4 mb-10 ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
              <video 
                  src={url} 
                  controls 
                  controlsList="nodownload" 
                  className="w-full h-full object-cover bg-black"
                  poster={poster}
              >
                  Tu navegador no soporta el elemento de video.
              </video>
          </div>
      );
  };

  return (
        <div id="vsl-template-root" className={`min-h-screen font-sans ${ds.bg} scroll-smooth`}>
            <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={hasBlogArticles} />
            
            {/* UNIFIED HERO SECTION */}
            <header className={`pt-32 pb-16 px-6 ${ds.hero.bgGradient} relative overflow-hidden border-b ${ds.nav.stickyBorder}`}>
                
                {/* Background Decor */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full blur-[120px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
                    
                    {/* Badge (Top Tagline) Added Here */}
                    {content.topTagline && (
                        <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
                             <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-md shadow-lg ${ds.hero.badgeBg} ${ds.hero.badgeText} ${ds.hero.badgeBorder}`}>
                                <span className="text-xs md:text-sm font-black uppercase tracking-wider">{content.topTagline}</span>
                            </div>
                        </div>
                    )}

                    {/* 1. Headline & Subheadline */}
                    <div className="mb-10 space-y-6">
                        {renderStyledHeadline(content.hero.headline, `font-extrabold tracking-tight leading-tight ${ds.hero.titleColor} ${isMobilePreview ? 'text-3xl' : 'text-4xl md:text-6xl'}`, ds.hero.highlightGradient)}
                        {renderRichText(content.hero.subheadline, `text-lg md:text-2xl font-light opacity-90 max-w-3xl mx-auto leading-relaxed ${ds.hero.subtitleColor}`)}
                    </div>

                    {/* 2. Video Player Component */}
                    <VideoPlayer url={content.hero.videoUrl} poster={content.hero.heroImage} />

                    {/* 3. CTA / Form Section */}
                    <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} centered={true} pageId={pageId} basePath={basePath} />
                        
                        {/* Security Badge below CTA */}
                        <div className={`mt-6 flex items-center justify-center gap-2 text-xs opacity-70 ${ds.hero.subtitleColor}`}>
                            <CheckCircle className="w-4 h-4" /> 
                            <span>Acceso Inmediato & Garantizado</span>
                        </div>
                    </div>

                </div>
            </header>

            {/* CONTENT BODY */}
            <div className="pb-24">
                <IntroSection />
                <BenefitsSection />
                <StudyPlanSection /> {/* Added Study Plan */}
                <InstructorSection />
                <TestimonialsSection />
                <StepsSection />
                <FAQSection />
                <FinalCTASection />
            </div>
            
            <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} basePath={basePath} />
        </div>
  );
};