
import React, { useState } from 'react';
import { GeneratedPageContent, ThankYouPageConfig } from '../../types';
import { Navbar, Footer } from './ui/LiveComponents';
import {
    CheckCircle, MessageCircle, Mail,
    Star, ChevronDown, ChevronUp, AlertTriangle,
    BookOpen, Gift, Lock, Clock, ShieldCheck, Check
} from 'lucide-react';

interface LiveThankYouPageProps {
  content: GeneratedPageContent;
  ds: any; // Design System
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
}

export const LiveThankYouPage: React.FC<LiveThankYouPageProps> = ({
  content,
  ds,
  isMobilePreview,
  pageId,
  basePath
}) => {
  // Use config with fallback to defaults or legacy data
  const tyConfig: ThankYouPageConfig = content.thankYouPage || {
      // General
      showSocials: true,
      ctaLink: "#",
      // Hero
      progressBarText: "¡ESPERA! SÓLO TE FALTA...",
      greenBadgeText: "RECIBE NUESTRO LIBRO...",
      headline: "PERFECTO, YA TIENES EL ACCESO...",
      subheadline: content.thankYouMessage || "Sigue los pasos...",
      // Fallback
      step1Title: "Revisa tu Correo",
      step2Title: "Grupo VIP",
      ctaButtonText: "UNIRME AL GRUPO"
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
  };

  const whatsappLink = tyConfig.ctaLink || "#";

  return (
    <div className={`min-h-screen font-sans ${ds.bg} flex flex-col selection:bg-green-200 selection:text-green-900`}>
      <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={false} />

      <main className="flex-1 flex flex-col">

          {/* HERO SECTION & STEPS */}
          <section className={`relative pt-32 pb-20 px-6 ${ds.hero.bgGradient}`}>
              {/* Background Decor from Design System */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none overflow-hidden`}>
                  <div className={`absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] ${ds.blobColor}`}></div>
              </div>

              <div className="relative z-10 max-w-5xl mx-auto text-center">
                  
                  {/* 1. PROGRESS BAR */}
                  <div className="max-w-2xl mx-auto w-full mb-6 bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-yellow-500/30 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-3 gap-2">
                            <span className="text-yellow-400 font-bold flex items-center gap-2 text-sm md:text-base animate-pulse">
                                <AlertTriangle className="w-5 h-5" /> {tyConfig.progressBarText || "¡ESPERA! SÓLO TE FALTA UN ÚLTIMO PASO..."}
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

                  {/* 2. GREEN STATUS BADGE */}
                  {tyConfig.greenBadgeText && (
                      <div className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-2 rounded-full text-base font-black uppercase mt-8 mb-10 shadow-lg shadow-green-500/20 transform hover:scale-105 transition-transform animate-bounce">
                          {tyConfig.greenBadgeText}
                      </div>
                  )}

                  <h1 className={`text-4xl md:text-6xl font-black mb-6 leading-snug tracking-wide drop-shadow-xl ${ds.hero.titleColor}`}>
                      {tyConfig.headline}
                  </h1>

                  <p className={`text-xl md:text-2xl font-light max-w-3xl mx-auto mb-16 leading-relaxed ${ds.hero.subtitleColor}`} dangerouslySetInnerHTML={{ __html: tyConfig.subheadline }}>
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
                      {/* STEP 1 CARD */}
                      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border-b-8 border-gray-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                              <Mail className="w-40 h-40 text-gray-900" />
                          </div>
                          
                          <div className="mb-6 relative z-10">
                              <span className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-black text-sm uppercase tracking-wider shadow-sm">
                                  PASO 1
                              </span>
                          </div>

                          <h3 className="text-3xl font-black text-gray-800 mb-6 relative z-10">{tyConfig.step1Title}</h3>
                          
                          <div className="space-y-5 text-gray-600 text-lg relative z-10 font-medium">
                              <div className="flex items-start gap-4">
                                  <div className="bg-gray-100 p-2 rounded-full shrink-0 mt-1">
                                      <CheckCircle className="w-5 h-5 text-gray-500"/>
                                  </div>
                                  <p className="leading-snug">{tyConfig.step1Desc}</p>
                              </div>
                              {tyConfig.step1Warning && (
                                  <div className="flex items-start gap-4">
                                      <div className="bg-yellow-50 p-2 rounded-full shrink-0 mt-1">
                                          <AlertTriangle className="w-5 h-5 text-yellow-600"/>
                                      </div>
                                      <p className="leading-snug text-gray-800">
                                          {tyConfig.step1Warning}
                                      </p>
                                  </div>
                              )}
                              {tyConfig.step1Subject && (
                                  <div className="font-bold text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100 text-center text-base">
                                      {tyConfig.step1Subject}
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* STEP 2 CARD (Highlight) */}
                      <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border-4 border-green-500 relative overflow-hidden transform md:scale-105 z-20 group">
                          <div className="absolute top-0 left-0 w-full h-3 bg-green-500"></div>
                          <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                          
                          {tyConfig.step2Badge && (
                              <div className="absolute top-6 right-6 animate-bounce">
                                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                                      {tyConfig.step2Badge}
                                  </span>
                              </div>
                          )}

                          <div className="mb-6 relative z-10">
                              <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-black text-sm uppercase tracking-wider shadow-md animate-pulse">
                                  PASO 2
                              </span>
                          </div>

                          <h3 className="text-3xl font-black text-gray-900 mb-6 relative z-10">{tyConfig.step2Title}</h3>
                          
                          <div className="space-y-5 text-gray-700 text-lg font-medium relative z-10">
                              <p className="leading-relaxed">{tyConfig.step2Desc}</p>
                              
                              {(tyConfig.step2BonusTitle || tyConfig.step2BonusValue) && (
                                  <div className="flex items-center gap-4 bg-green-50 p-5 rounded-2xl border border-green-100 transition-colors group-hover:bg-green-100/50">
                                      <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                                          <Gift className="w-8 h-8 text-green-600 animate-pulse" />
                                      </div>
                                      <div>
                                          <p className="font-bold text-gray-900 text-base">{tyConfig.step2BonusTitle}</p>
                                          <p className="text-sm text-gray-500 line-through font-bold">{tyConfig.step2BonusValue}</p>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* 3. THE OFFER (BOOK MOCKUP & SALES COPY) */}
          <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black relative border-t border-white/10">
              <div className="max-w-6xl mx-auto">
                  {/* HEADER */}
                  {tyConfig.offerTopTitle && (
                      <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12 tracking-wide leading-tight">
                          {tyConfig.offerTopTitle}
                      </h2>
                  )}

                  <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                      
                      {/* LEFT: VISUAL (Mockup) */}
                      <div className="md:w-2/5 bg-gray-100 relative p-12 flex flex-col items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-400 via-gray-100 to-white"></div>
                          
                          {/* CSS 3D Book */}
                          <div className="relative w-56 aspect-[3/4.2] perspective-1000 group cursor-pointer hover:scale-105 transition-transform duration-500 z-10">
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-r-lg shadow-[20px_20px_40px_rgba(0,0,0,0.4)] transform rotate-y-[-15deg] border-l-8 border-white/10 flex flex-col items-center p-6 text-center text-white">
                                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
                                      <BookOpen className="w-8 h-8 text-white" />
                                  </div>
                                  <h4 className="font-serif font-bold text-2xl uppercase tracking-widest mb-1">{tyConfig.bookTitle || "EBOOK"}</h4>
                                  <div className="h-0.5 w-12 bg-white/50 mb-1"></div>
                                  <p className="text-xs font-light tracking-wide opacity-90">{tyConfig.bookSubtitle || "GUIA GRATIS"}</p>
                                  <div className="mt-auto text-[10px] opacity-60">{tyConfig.bookFooter}</div>
                              </div>
                              {/* Book Pages Effect */}
                              <div className="absolute top-2 bottom-2 left-0 w-4 bg-white rounded-l-sm transform rotate-y-[-15deg] origin-right translate-x-[-1px] translate-z-[-2px] shadow-inner"></div>
                          </div>

                          <div className="mt-12 text-center relative z-10 flex flex-col items-center gap-4">
                              {tyConfig.offerBadge && (
                                  <span className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-black shadow-lg transform -rotate-2 inline-block tracking-wide">
                                      {tyConfig.offerBadge}
                                  </span>
                              )}
                              {tyConfig.offerPriceRegular && (
                                  <div className="text-gray-500 text-lg font-bold line-through decoration-red-500 decoration-4">
                                      {tyConfig.offerPriceRegular}
                                  </div>
                              )}
                              {tyConfig.offerPriceFree && (
                                  <div className="text-green-600 font-black text-4xl tracking-tighter drop-shadow-sm mt-1">
                                      {tyConfig.offerPriceFree}
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* RIGHT: COPY & CTA */}
                      <div className="md:w-3/5 p-8 md:p-16 flex flex-col justify-center bg-white relative">
                          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                              <BookOpen className="w-40 h-40 text-gray-900" />
                          </div>

                          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: tyConfig.offerHeadline || "Descarga tu Guía" }}></h2>
                          
                          <p className="text-lg font-medium text-gray-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: tyConfig.offerDescription || "" }}></p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                              {(tyConfig.offerBullets || []).map((item, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                      <span className="text-lg font-medium text-gray-700">{item}</span>
                                  </div>
                              ))}
                          </div>

                          <a 
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-xl shadow-green-500/30 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] group relative overflow-hidden"
                          >
                              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                              <MessageCircle className="w-7 h-7 fill-white/20" />
                              <span className="relative z-10">{tyConfig.ctaButtonText || "DESCARGAR AHORA"}</span>
                          </a>
                          
                          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> Acceso Seguro</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Oferta Limitada</span>
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
                  className="w-full bg-[#25D366] text-white py-4 rounded-full font-bold shadow-2xl flex items-center justify-center gap-2 animate-pulse border-2 border-white/20"
              >
                  <MessageCircle className="w-6 h-6" /> Unirme al Grupo WhatsApp
              </a>
          </div>

      </main>

      {tyConfig.showSocials !== false && <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />}
    </div>
  );
};