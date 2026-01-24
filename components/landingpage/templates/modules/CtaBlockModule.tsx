
import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { SmartCTA } from '../../ui/LiveComponents';
import { CheckCircle } from 'lucide-react';

interface CtaBlockModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  sticky?: boolean;
}

export const CtaBlockModule: React.FC<CtaBlockModuleProps> = ({ content, ds, isMobilePreview, pageId, basePath, sticky = true }) => {
  const capture = content.capture || {};
  
  return (
    <div className={`${!isMobilePreview && sticky ? 'lg:sticky lg:top-24' : ''} w-full`}>
      <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} pageId={pageId} basePath={basePath} />
      
      {/* Bloque de Prueba Social Solicitado */}
      <div className="mt-8 flex items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="flex -space-x-4">
              {[1,2,3].map(i => (
                <img key={i} src={`https://randomuser.me/api/portraits/thumb/women/${i+20}.jpg`} alt="User" className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-xl" />
              ))}
          </div>
          <div className="text-left">
              <div id="smart-cta-social-proof" className="flex items-center gap-2 font-black text-2xl text-white">
                  <CheckCircle className={`w-6 h-6 ${ds.decorations.checkColor} fill-current`} /> {content.hero.socialProofCount || "2,458 Alumnas"}
              </div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none mt-1">{capture.socialProofLabel || "Alumnos registrados"}</p>
          </div>
      </div>
      
      {/* Aviso de Escasez Solicitado */}
      <p className={`mt-4 text-center text-sm font-black uppercase tracking-widest animate-pulse ${ds.badges.spotsText}`}>
        {content.hero.spotsLeft || "¡Solo 5 cupos disponibles!"}
      </p>
    </div>
  );
};
