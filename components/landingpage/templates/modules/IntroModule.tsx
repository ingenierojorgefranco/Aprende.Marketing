import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { ScanFace, Palette, Feather } from 'lucide-react';
import { renderRichText } from '../../utils';

interface IntroModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
}

export const IntroModule: React.FC<IntroModuleProps> = ({ content, ds, isMobilePreview }) => {
  return (
    <section id="introduccion" className={`py-24 relative overflow-hidden ${ds.intro.sectionBg}`}>
        <div className="w-full max-w-[65em] mx-auto px-6">
            <div className="flex flex-col items-center text-center">
                <span id="intro-badge" className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${ds.intro.badgeBg} ${ds.intro.badgeText} ${ds.intro.badgeBorder}`}>Descubre Más</span>
                <h2 id="intro-title" 
                    className={`font-black mb-12 text-center ${ds.intro.titleColor}`}
                    style={{ fontSize: '3.5rem', lineHeight: '1.2em' }}
                    dangerouslySetInnerHTML={{ __html: content.intro.title }}
                ></h2>
                
                <div id="intro-image-container" className="relative mb-16 w-full max-w-2xl">
                     <div id="intro-blob" className={`absolute top-0 left-0 w-2/3 h-2/3 -translate-x-4 -translate-y-4 rounded-3xl ${ds.blobOpacity} ${ds.blobColor}`}></div>
                     <div className="relative">
                        <img id="intro-main-image" src={content.intro.imageUrl || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1471&auto=format&fit=crop"} alt="Intro" className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-video" />
                     </div>
                </div>

                <div id="intro-text-container" className="relative z-10 text-left w-full">
                    <div id="intro-description" className={`space-y-8 ${ds.intro.textColor} sales-letter-body`} style={{ fontSize: '1.4em', lineHeight: '1.8em' }}>
                        {content.intro.description.split('[CTA_BUTTON]').map((part, index, array) => (
                            <React.Fragment key={index}>
                                {renderRichText(part)}
                                {index < array.length - 1 && (
                                    <div className="my-16 flex justify-center">
                                        <a 
                                            href="#captura" 
                                            className={`px-10 py-5 rounded-full text-xl font-black uppercase tracking-wide shadow-xl transition-all hover:scale-105 active:scale-95 text-center ${ds.buttons.primary}`}
                                        >
                                            {content.hero.ctaText || "¡Quiero mi Acceso Ahora!"}
                                        </a>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    
                    <div className="mt-20 flex justify-center">
                        <a 
                            href="#captura" 
                            className={`px-10 py-5 rounded-full text-xl font-black uppercase tracking-wide shadow-xl transition-all hover:scale-105 active:scale-95 text-center ${ds.buttons.primary}`}
                        >
                            {content.hero.ctaText || "¡Quiero mi Acceso Ahora!"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};