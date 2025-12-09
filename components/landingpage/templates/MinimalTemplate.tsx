
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
    <div id="layout-minimalista" className={`min-h-screen font-sans flex flex-col ${ds.bg}`}>
        <div className="flex-1 flex flex-col justify-center py-12 relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-[80px] ${ds.blobColor}`}></div>
             
             <div className="w-full max-w-lg mx-auto px-6 relative z-10 text-center">
                  <div className={`w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-lg ${ds.logoBg}`}>
                      {content.brandIcon ? getIcon(content.brandIcon, <Sparkles className="w-8 h-8"/>) : (
                         content.logoSvg ? <div className="w-8 h-8" dangerouslySetInnerHTML={{ __html: content.logoSvg }} /> : <Anchor className="w-8 h-8"/>
                      )}
                  </div>
                  
                  <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${content.palette === 'minimal-mono' ? 'text-black' : ds.heroText.replace('text-white', 'text-gray-900')}`}>
                      {content.hero.headline.replace(/<\/?[^>]+(>|$)/g, "")}
                  </h1>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                      {content.hero.subheadline}
                  </p>

                  <div className="bg-white p-1 rounded-2xl shadow-xl border border-gray-100">
                      <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} />
                  </div>

                  <p className="mt-8 text-xs text-gray-400">
                      &copy; {new Date().getFullYear()} {content.brandName ? content.brandName.replace(/<\/?[^>]+(>|$)/g, "") : "Company"}.
                  </p>
             </div>
        </div>
        
        <div className="bg-gray-50 py-12 border-t border-gray-200">
            <div className={`max-w-4xl mx-auto px-6 opacity-70 hover:opacity-100 transition duration-500`}>
                 <div className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                     <div>
                         <h4 className="font-bold text-gray-900 mb-2">Sobre Nosotros</h4>
                         <p className="text-sm text-gray-500">{content.footer.copyright}</p>
                     </div>
                     <div>
                         <h4 className="font-bold text-gray-900 mb-2">Contacto</h4>
                         <p className="text-sm text-gray-500">{content.footer.contact}</p>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};
