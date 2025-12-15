
import React from 'react';
import { GeneratedPageContent, ThankYouPageConfig } from '../../types';
import { Navbar, Footer } from './ui/LiveComponents';
import { CheckCircle, ArrowRight, Facebook, Instagram, Twitter } from 'lucide-react';

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
  // Default Config if not present
  const tyConfig: ThankYouPageConfig = content.thankYouPage || {
      headline: "¡Felicidades! Ya estás dentro.",
      subheadline: content.thankYouMessage || "Revisa tu correo electrónico para acceder al contenido.",
      ctaText: "Unirme al Grupo VIP",
      ctaLink: "#",
      showSocials: true
  };

  return (
    <div className={`min-h-screen font-sans ${ds.hero.bgGradient} flex flex-col`}>
      <Navbar content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} hasBlogArticles={false} />
      
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 lg:p-12 relative overflow-hidden">
          {/* Background Decor */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-30 pointer-events-none ${ds.blobColor}`}></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
              
              {/* Success Icon */}
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center shadow-2xl mb-6 ${ds.decorations.playButtonBg} border-4 ${ds.decorations.playButtonBorder}`}>
                  <CheckCircle className={`w-12 h-12 ${ds.decorations.checkColor}`} />
              </div>

              {/* Headlines */}
              <div>
                  <h1 className={`text-4xl md:text-6xl font-black mb-6 leading-tight ${ds.hero.titleColor}`}>
                      {tyConfig.headline}
                  </h1>
                  <p className={`text-xl md:text-2xl leading-relaxed opacity-90 ${ds.hero.subtitleColor}`}>
                      {tyConfig.subheadline}
                  </p>
              </div>

              {/* Main CTA */}
              <div className="pt-4">
                  <a 
                    href={tyConfig.ctaLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform ${ds.buttons.primary}`}
                  >
                      {tyConfig.ctaText} <ArrowRight className="w-5 h-5" />
                  </a>
              </div>

              {/* Optional Socials */}
              {tyConfig.showSocials && content.footer.socials && (
                  <div className="pt-8 border-t border-gray-200/10 w-full mt-8">
                      <p className={`text-sm font-medium uppercase tracking-wider mb-4 ${ds.hero.subtitleColor}`}>Síguenos en redes</p>
                      <div className="flex justify-center gap-4">
                          {content.footer.socials.facebook && (
                              <a href={content.footer.socials.facebook} className={`p-3 rounded-full transition ${ds.footer.socialBg} hover:${ds.footer.socialHoverBg} ${ds.footer.socialIcon}`}>
                                  <Facebook className="w-5 h-5" />
                              </a>
                          )}
                          {content.footer.socials.instagram && (
                              <a href={content.footer.socials.instagram} className={`p-3 rounded-full transition ${ds.footer.socialBg} hover:${ds.footer.socialHoverBg} ${ds.footer.socialIcon}`}>
                                  <Instagram className="w-5 h-5" />
                              </a>
                          )}
                          {content.footer.socials.twitter && (
                              <a href={content.footer.socials.twitter} className={`p-3 rounded-full transition ${ds.footer.socialBg} hover:${ds.footer.socialHoverBg} ${ds.footer.socialIcon}`}>
                                  <Twitter className="w-5 h-5" />
                              </a>
                          )}
                      </div>
                  </div>
              )}

          </div>
      </main>

      <Footer content={content} ds={ds} isMobilePreview={isMobilePreview} />
    </div>
  );
};
