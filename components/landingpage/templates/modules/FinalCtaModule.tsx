
import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { SmartCTA } from '../../ui/LiveComponents';

interface FinalCtaModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  title?: string;
}

export const FinalCtaModule: React.FC<FinalCtaModuleProps> = ({ content, ds, isMobilePreview, pageId, basePath, title }) => {
  return (
    <section id="final-cta-section" className={`py-24 relative overflow-hidden ${ds.cta.sectionBg}`}>
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 ${ds.blobOpacity} ${ds.blobColor}`}></div>
        <div className="w-full max-w-[75em] mx-auto px-6 text-center relative z-10">
            <h2 id="final-cta-title" className={`text-3xl md:text-5xl font-bold mb-6 ${ds.cta.sectionTitleColor}`}>{title || "¿Lista para cambiar tu vida?"}</h2>
            <p id="final-cta-desc" className={`text-lg mb-10 max-w-2xl mx-auto ${ds.cta.sectionTextColor}`}>
                {content.closingOfferText || "No dejes pasar esta oportunidad. Quedan pocos cupos para acceder a todos los beneficios."}
            </p>
            <div className="max-w-md mx-auto">
                <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} centered={true} pageId={pageId} basePath={basePath} />
            </div>
        </div>
    </section>
  );
};
