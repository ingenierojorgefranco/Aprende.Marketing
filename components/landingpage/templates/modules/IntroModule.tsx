import React, { useState } from 'react';
import { GeneratedPageContent } from '../../../../types';
import { ScanFace, Palette, Feather } from 'lucide-react';
import { renderRichText } from '../../utils';
import { RegistrationModal, HeroMedia } from '../../ui/LiveComponents';

interface IntroModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  project?: any;
}

export const IntroModule: React.FC<IntroModuleProps> = ({ content, ds, isMobilePreview, pageId, basePath, project }) => {
  const [showModal, setShowModal] = useState(false);

  const descText = (content.intro?.description || '').toLowerCase();
  const hasButtonCta = descText.includes('siguiente botón') || 
                       descText.includes('botón de abajo') || 
                       descText.includes('haz clic en el botón') ||
                       descText.includes('da clic en el botón') ||
                       descText.includes('haz clic abajo') ||
                       descText.includes('da clic abajo') ||
                       descText.includes('botón que verás');

  return (
    <section id="introduccion" className={`pt-[3rem] pb-24 relative overflow-hidden ${ds.intro.sectionBg}`}>
        <div className="w-full max-w-[60em] mx-auto px-6">
            <div className="flex flex-col items-center text-center">
                <div className={`backdrop-blur-sm border rounded-2xl shadow-xl mb-16 w-full max-w-[50rem] ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                    <div id="hero-video-card" className={`relative w-full aspect-video h-auto rounded-2xl overflow-hidden shadow-2xl border cursor-pointer group ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                        <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                    </div>
                </div>

                <span id="intro-badge" className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${ds.intro.badgeBg} ${ds.intro.badgeText} ${ds.intro.badgeBorder}`}>¿Qué es esta Oportunidad?</span>
                <h2 id="intro-title" className={`text-3xl md:text-[3.5rem] font-black mb-12 leading-[1.2em] ${ds.intro.titleColor}`}>
                    {renderRichText(content.intro.title)}
                </h2>

                <div id="intro-text-container" className="relative z-10 text-left w-full">
                    <div id="intro-description" className={`space-y-8 text-[1.4em] leading-[1.8em] ${ds.intro.textColor} sales-letter-body`}>
                        {renderRichText(content.intro.description)}

                        {!hasButtonCta && (
                            <div className="mt-8 space-y-6 pt-4 border-t border-gray-100/60 dark:border-white/10">
                                <p>
                                    No tienes que recorrer este camino sola ni arriesgar tu dinero sin una guía clara. He preparado una <mark>clase gratuita reveladora</mark> donde te mostraré el método exacto paso a paso para dominar esta técnica y alcanzar tus metas.
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    Tu futuro y tu transformación comienzan hoy: <mark>haz clic en el siguiente botón</mark> para registrarte ahora mismo y asegurar tu cupo gratuito a la clase antes de que se agoten los accesos.
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-12 sm:mt-14 flex justify-center">
                        <button 
                            onClick={() => setShowModal(true)}
                            className={`px-10 py-5 rounded-full text-xl font-black uppercase tracking-wide shadow-xl transition-all hover:scale-105 active:scale-95 text-center ${ds.buttons.primary}`}
                        >
                            {content.hero.ctaText || "¡Quiero mi Acceso Ahora!"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {showModal && <RegistrationModal content={content} ds={ds} onClose={() => setShowModal(false)} pageId={pageId} basePath={basePath} project={project} />}
    </section>
  );
};
