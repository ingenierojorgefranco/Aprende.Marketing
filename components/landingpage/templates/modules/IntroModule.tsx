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

  return (
    <section id="introduccion" className={`py-24 relative overflow-hidden ${ds.intro.sectionBg}`}>
        <div className="w-full max-w-[60em] mx-auto px-6">
            <div className="flex flex-col items-center text-center">
                <span id="intro-badge" className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${ds.intro.badgeBg} ${ds.intro.badgeText} ${ds.intro.badgeBorder}`}>¿Qué es esta Oportunidad?</span>
                <h2 id="intro-title" className={`text-3xl md:text-[3.5rem] font-black mb-12 leading-[1.2em] ${ds.intro.titleColor}`}>
                    {renderRichText(content.intro.title)}
                </h2>
                
                <div className={`backdrop-blur-sm border rounded-2xl shadow-xl mb-16 w-full max-w-2xl ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                    <div id="hero-video-card" className={`relative w-full aspect-video h-auto rounded-2xl overflow-hidden shadow-2xl border cursor-pointer group ${ds.hero.videoCardBg} ${ds.hero.videoCardBorder}`}>
                        <HeroMedia url={content.hero.videoUrl} poster={content.hero.heroImage} ds={ds} />
                    </div>
                </div>

                <div id="intro-text-container" className="relative z-10 text-left w-full">
                    <div id="intro-description" className={`space-y-8 text-[1.4em] leading-[1.8em] ${ds.intro.textColor} sales-letter-body`}>
                        {renderRichText(content.intro.description)}
                    </div>
                    
                    <div className="mt-20 flex justify-center">
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
