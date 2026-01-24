
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
    <section id="seccion-introduccion" className={`py-24 relative overflow-hidden ${ds.intro.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className={`grid gap-12 items-center ${isMobilePreview ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
                <div id="intro-image-container" className="relative">
                     <div id="intro-blob" className={`absolute top-0 left-0 w-2/3 h-2/3 -translate-x-4 -translate-y-4 rounded-3xl ${ds.blobOpacity} ${ds.blobColor}`}></div>
                     <div className="relative">
                        <img id="intro-main-image" src={content.intro.imageUrl || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1471&auto=format&fit=crop"} alt="Intro" className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                     </div>
                </div>
                <div id="intro-text-container" className="relative z-10">
                    <span id="intro-badge" className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${ds.intro.badgeBg} ${ds.intro.badgeText} ${ds.intro.badgeBorder}`}>Descubre Más</span>
                    <h2 id="intro-title" className={`text-3xl md:text-4xl font-black mb-8 leading-tight ${ds.intro.titleColor}`}>{content.intro.title}</h2>
                    <div id="intro-description" className={`space-y-6 text-lg leading-relaxed ${ds.intro.textColor}`}>{renderRichText(content.intro.description)}</div>
                    <div id="intro-bullets" className="mt-10 space-y-4">
                        {(content.intro.items || []).map((item, i) => (
                            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                                <div id={`intro-bullet-icon-${i}`} className={`p-3 rounded-lg flex-shrink-0 ${ds.intro.bulletIconBg} ${ds.intro.bulletIconColor}`}>
                                   {i === 0 ? <ScanFace className="w-6 h-6" /> : i === 1 ? <Palette className="w-6 h-6" /> : <Feather className="w-6 h-6" />}
                                </div>
                                <div><h4 className={`font-bold text-lg mb-1 ${ds.features.titleColor}`}>{item.title}</h4>{renderRichText(item.description, `text-sm leading-snug ${ds.features.descColor}`)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};
