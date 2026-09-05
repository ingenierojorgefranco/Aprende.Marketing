
import React, { useState } from 'react';
import { GeneratedPageContent, ThankYouPageConfig } from '../../types';
import { Navbar, Footer } from './ui/LiveComponents';
import {
    CheckCircle, MessageCircle, Mail,
    Star, ChevronDown, ChevronUp, AlertTriangle,
    BookOpen, Gift, Lock, Clock, ShieldCheck, Check, Download
} from 'lucide-react';

interface LiveThankYouPageProps {
  content: GeneratedPageContent;
  ds: any; // Design System
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  project?: any;
}

export const LiveThankYouPage: React.FC<LiveThankYouPageProps> = ({
  content,
  ds,
  isMobilePreview,
  pageId,
  basePath,
  project
}) => {
  // Use config with fallback to defaults or legacy data
  const tyConfig: ThankYouPageConfig = content.thankYouPage || {
      // General
      showSocials: true,
      ctaLink: "#",
      // Hero
      progressBarText: "¡PERO ESPERA! SÓLO TE FALTA UN ÚLTIMO PASO PARA TERMINAR.",
      greenBadgeText: "",
      headline: "Perfecto, hemos enviado el acceso a la clase gratuita a tu correo electrónico",
      subheadline: content.thankYouMessage || "Únete a nuestro grupo privado de Whatsapp para acceder a nuestras mentorías y recibir tu material de preparación gratuito.",
      // Fallback
      step1Title: "Revisa tu Correo",
      step2Title: "Únete a nuestro grupo de Whatsapp y descarga nuestro libro gratuito",
      ctaButtonText: "UNIRME AL GRUPO"
  };

  const rawHeadline = tyConfig.headline || "";
  const resolvedHeadline = (!rawHeadline || rawHeadline.toUpperCase().includes("PERFECTO, YA TIENES EL ACCESO"))
      ? "Perfecto, hemos enviado el acceso a la clase gratuita a tu correo electrónico"
      : rawHeadline;

  const rawProgressBarText = tyConfig.progressBarText || "";
  const resolvedProgressBarText = (!rawProgressBarText || rawProgressBarText.includes("¡ESPERA! SÓLO TE FALTA"))
      ? "¡PERO ESPERA! SÓLO TE FALTA UN ÚLTIMO PASO PARA TERMINAR."
      : rawProgressBarText;

  const rawSubheadline = tyConfig.subheadline || content.thankYouMessage || "";
  const resolvedSubheadline = (!rawSubheadline || rawSubheadline.includes("Sigue estos 2 pasos sencillos") || rawSubheadline.includes("Sigue los pasos"))
      ? "Únete a nuestro grupo privado de Whatsapp para acceder a nuestras mentorías y recibir tu material de preparación gratuito."
      : rawSubheadline;

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
  };

  const whatsappLink = tyConfig.ctaLink || "#";

  // Obtener lead magnet seleccionado o predeterminado del proyecto
  const projectLeadMagnets = project?.multimedia_json?.leadMagnets || [];
  const defaultLeadMagnet = projectLeadMagnets.length > 0 ? projectLeadMagnets[0] : null;

  const displayLeadMagnetName = tyConfig.leadMagnetName || defaultLeadMagnet?.name || tyConfig.bookTitle || "Libro Digital GRATIS";
  const displayLeadMagnetUrl = tyConfig.leadMagnetUrl || defaultLeadMagnet?.url || project?.leadMagnetUrl || "";

  // Registrar clic en el botón de WhatsApp
  const handleWhatsAppClick = () => {
      if (pageId) {
          fetch(`/api/public/pages/${pageId}/whatsapp-click`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
          }).catch((err) => {
              console.warn('[Analytics] Error al registrar clic de WhatsApp:', err);
          });
      }
  };

  return (
    <div className={`min-h-screen font-sans ${ds.bg} flex flex-col selection:bg-green-200 selection:text-green-900`}>
      <Navbar 
          content={content} 
          ds={ds} 
          isMobilePreview={isMobilePreview} 
          pageId={pageId} 
          basePath={basePath} 
          hasBlogArticles={false} 
          isThankYouPage={true} 
      />

      <main className="flex-1 flex flex-col">

          {/* HERO SECTION & STEPS */}
          <section className={`relative pt-32 pb-20 px-6 ${ds.hero.bgGradient}`}>
              {/* Background Decor from Design System */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none overflow-hidden`}>
                  <div className={`absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] ${ds.blobColor}`}></div>
              </div>

              <div className="relative z-10 max-w-5xl mx-auto text-center">
                  
                      {/* 1. H1 HEADLINE (Placed before progress bar per request) */}
                      <h1 
                          className={`text-4xl md:text-6xl font-black mb-10 pt-4 leading-snug tracking-wide drop-shadow-xl ${ds.hero.titleColor}`}
                          style={{
                              fontSize: '2.75rem',
                              lineHeight: 1.2,
                              width: '80%',
                              margin: '0 auto',
                              paddingBottom: '1em',
                              paddingTop: '1em',
                          }}
                      >
                          {resolvedHeadline}
                      </h1>

                      {/* 2. PROGRESS BAR (Placed after H1 per request) */}
                      <div className="max-w-2xl mx-auto w-full mb-12 bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-yellow-500/30 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-3 gap-2">
                            <span className="text-yellow-400 font-bold flex items-center gap-2 text-sm md:text-base animate-pulse">
                                <AlertTriangle className="w-5 h-5" /> {resolvedProgressBarText}
                            </span>
                            <span className="text-white font-mono font-bold text-lg">80%</span>
                        </div>
                        <div className="w-full bg-gray-700 h-6 rounded-full overflow-hidden border border-gray-600 relative shadow-inner">
                            <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 w-[80%] relative shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-center">
                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_infinite]"></div>
                                {/* Striped effect overlay if supported, otherwise simple gradient */}
                                <div className="absolute inset-0 w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]"></div>
                            </div>
                        </div>
                      </div>

                      <div className="max-w-3xl mx-auto">
                          {/* STEP 2 CARD (Highlight) */}
                          <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl border-4 border-green-500 relative overflow-hidden z-20 group">
                              <div className="absolute top-0 left-0 w-full h-4 bg-green-500"></div>
                              <div className="absolute -right-20 -top-20 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none transition-transform group-hover:scale-110"></div>
                              
                              <div className="mb-8 relative z-10">
                                  <span className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg animate-pulse">
                                      SOLO POR HOY: LIBRO DIGITAL 100% GRATIS
                                  </span>
                              </div>

                              <h3 
                                  className="text-4xl md:text-5xl font-black text-gray-900 mb-8 relative z-10 leading-tight"
                                  style={{ lineHeight: '1.12em' }}
                              >
                                  Únete a nuestro grupo de Whatsapp y descarga nuestro libro gratuito
                              </h3>

                              <p 
                                  className="leading-relaxed text-gray-600" 
                                  style={{
                                      fontSize: '1.3em',
                                      lineHeight: '1.5em',
                                      paddingBottom: '1.5em',
                                  }}
                              >
                                  Únete a nuestro grupo privado de Whatsapp para acceder a nuestras mentorías y recibir tu material de preparación gratuito.
                              </p>

                              {/* Pantallazo del PDF del Lead Magnet */}
                              <div className="w-full flex justify-center pb-6">
                                  <img 
                                      src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" 
                                      alt="Pantallazo Lead Magnet" 
                                      className="rounded-2xl shadow-xl max-h-80 w-auto object-cover border border-slate-200"
                                  />
                              </div>
                              
                              <div className="space-y-8 text-gray-700 text-xl font-medium relative z-10">
                                  
                                  <div className="flex flex-col md:flex-row items-center gap-6 bg-green-50 p-8 rounded-3xl border border-green-200 transition-all group-hover:bg-green-100/50 group-hover:border-green-300">
                                      <div className="bg-white p-5 rounded-2xl shadow-md shrink-0">
                                          <Gift className="w-12 h-12 text-green-600 animate-pulse" />
                                      </div>
                                      <div className="text-center md:text-left flex-1">
                                          <p className="font-black text-gray-900 text-2xl mb-1">{displayLeadMagnetName}</p>
                                          <div 
                                              className="text-red-500 text-lg font-bold line-through decoration-black-500 decoration-2" 
                                              style={{ fontSize: '1.1em' }}
                                          >
                                              Precio Regular: $27 USD
                                          </div>
                                      </div>
                                      <div className="bg-green-600 text-white font-black px-4 py-2 rounded-lg shadow-sm">
                                          HOY GRATIS
                                      </div>
                                  </div>

                                  <div className="pt-4">
                                      <a 
                                          href={whatsappLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={handleWhatsAppClick}
                                          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-6 px-10 rounded-2xl font-black text-2xl shadow-2xl shadow-green-500/40 flex items-center justify-center gap-4 transition-all hover:scale-[1.03] active:scale-95 group relative overflow-hidden cursor-pointer"
                                      >
                                          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                          <MessageCircle className="w-8 h-8 fill-white/20" />
                                          <span className="relative z-10">{tyConfig.ctaButtonText || "UNIRME AL GRUPO VIP"}</span>
                                      </a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

          {/* 4. WHAT YOU WILL LEARN */}
          {(tyConfig.learningItems && tyConfig.learningItems.length > 0) && (
              <section className={`py-20 px-6 ${ds.bg}`}>
                  <div className="max-w-6xl mx-auto">
                      <div className="text-center mb-16">
                          <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-900 tracking-wide leading-tight">{tyConfig.learningTitle}</h2>
                          <p className="text-lg font-medium max-w-2xl mx-auto text-gray-600">{tyConfig.learningSubtitle}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                          {tyConfig.learningItems.map((item, i) => (
                              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-start group">
                                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                      <BookOpen className="w-6 h-6" />
                                  </div>
                                  <h4 className="font-bold text-2xl text-gray-900 mb-3">{item.title}</h4>
                                  <p className="text-gray-600 text-lg font-medium leading-relaxed">{item.description}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>
          )}

          {/* 5. SOCIAL PROOF */}
          {(tyConfig.socialItems && tyConfig.socialItems.length > 0) && (
              <section className="py-20 px-6 bg-gray-900 text-white border-y border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                  
                  <div className="max-w-5xl mx-auto relative z-10">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-gray-800 pb-8">
                          <div>
                              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-wide leading-tight">{tyConfig.socialTitle}</h2>
                              <p className="text-lg font-medium text-gray-400">{tyConfig.socialSubtitle}</p>
                          </div>
                          {tyConfig.socialCountText && (
                              <div className="bg-white/10 px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md border border-white/20">
                                  <div className="flex -space-x-2">
                                      {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-400 border-2 border-gray-800"></div>)}
                                  </div>
                                  <span className="font-bold text-sm">{tyConfig.socialCountText}</span>
                              </div>
                          )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                          {tyConfig.socialItems.map((t, i) => (
                              <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition">
                                  <div className="flex gap-1 mb-4 text-yellow-500">
                                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current"/>)}
                                  </div>
                                  <p className="text-gray-200 italic mb-6 text-lg font-medium leading-relaxed">"{t.text}"</p>
                                  <div className="flex items-center gap-3 pt-4 border-t border-gray-700/50">
                                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                          {t.name.charAt(0)}
                                      </div>
                                      <div>
                                          <p className="text-lg font-bold text-white">{t.name}</p>
                                          <p className="text-sm text-gray-500">{t.location}</p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>
          )}

          {/* 6. FAQ (Collapsible) */}
          {(tyConfig.faqItems && tyConfig.faqItems.length > 0) && (
              <section className={`py-20 px-6 ${ds.bg}`}>
                  <div className="max-w-2xl mx-auto">
                      <h2 className="text-3xl font-black text-center mb-12 text-gray-900 tracking-wide leading-tight">{tyConfig.faqTitle}</h2>
                      <div className="space-y-4">
                          {tyConfig.faqItems.map((item, i) => (
                              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                  <button 
                                      onClick={() => toggleFaq(i)}
                                      className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-50 transition"
                                  >
                                      <span className="text-lg">{item.question}</span>
                                      {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                  </button>
                                  {openFaq === i && (
                                      <div className="px-5 py-6 text-lg text-gray-600 leading-relaxed border-t border-gray-100">
                                          {item.answer}
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </section>
          )}

          {/* 7. FINAL STICKY CTA (Mobile only) */}
          <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom-4">
              <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] text-white py-4 rounded-full font-bold shadow-2xl flex items-center justify-center gap-2 animate-pulse border-2 border-white/20 cursor-pointer"
              >
                  <MessageCircle className="w-6 h-6" /> Unirme al Grupo WhatsApp
              </a>
          </div>

      </main>

      {tyConfig.showSocials !== false && <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />}
    </div>
  );
};