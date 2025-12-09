
import React from 'react';
import { GeneratedPageContent } from '../../../types';
import { SmartCTA } from '../ui/LiveComponents';
import { getIcon } from '../utils';
import { Anchor, Sparkles } from 'lucide-react';

interface TemplateProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ content, ds, isMobilePreview }) => {
  return (
    <div id="minimal-template-root" className={`min-h-screen font-sans flex flex-col ${ds.bg}`}>
        <div className="flex-1 flex flex-col justify-center py-12 relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-64 h-64 rounded-full ${ds.blobOpacity} blur-[80px] ${ds.blobColor}`}></div>
             
             <div className="w-full max-w-lg mx-auto px-6 relative z-10 text-center">
                  <div id="minimal-logo" className={`w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-lg ${ds.nav.logoBg} ${ds.nav.logoText}`}>
                      {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-8 h-8"/>) : (
                         content.logoSvg ? <div className="w-8 h-8" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-8 h-8"/>
                      )}
                  </div>
                  
                  <h1 id="minimal-headline" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.hero.titleColor}`}>
                      {content.hero.headline.replace(/<\/?[^>]+(>|$)/g, "")}
                  </h1>
                  <p id="minimal-subheadline" className={`mb-8 leading-relaxed ${ds.hero.subtitleColor}`}>
                      {content.hero.subheadline}
                  </p>

                  <div id="minimal-form-container" className={`p-1 rounded-2xl shadow-xl border ${ds.features.cardBg} ${ds.features.cardBorder}`}>
                      <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} />
                  </div>

                  <p id="minimal-copyright" className={`mt-8 text-xs ${ds.footer.copyrightColor}`}>
                      &copy; {new Date().getFullYear()} {content.brandName ? content.brandName.replace(/<\/?[^>]+(>|$)/g, "") : "Company"}.
                  </p>
             </div>
        </div>
        
        <div className={`py-12 border-t ${ds.footer.bg} ${ds.footer.borderTop}`}>
            <div className={`max-w-4xl mx-auto px-6 opacity-70 hover:opacity-100 transition duration-500`}>
                 <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                     <div>
                         <h4 className={`font-bold mb-2 ${ds.footer.titleColor}`}>Sobre Nosotros</h4>
                         <p className={`text-sm ${ds.footer.textColor}`}>{content.footer.copyright}</p>
                     </div>
                     <div>
                         <h4 className={`font-bold mb-2 ${ds.footer.titleColor}`}>Contacto</h4>
                         <p className={`text-sm ${ds.footer.textColor}`}>{content.footer.contact}</p>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};
