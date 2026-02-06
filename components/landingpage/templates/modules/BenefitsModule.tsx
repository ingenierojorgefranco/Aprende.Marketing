import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { FeatureCard } from '../../ui/LiveComponents';

interface BenefitsModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  showSeparator?: boolean;
  sectionId?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  fallbackSubtitle?: string;
}

export const BenefitsModule: React.FC<BenefitsModuleProps> = ({ 
  content, 
  ds, 
  isMobilePreview, 
  showSeparator = false,
  sectionId = "beneficios",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  fallbackSubtitle = "Recibe el arsenal completo de recursos que han llevado a nuestras alumnas a facturar desde su primer mes."
}) => {
  const benefits = content?.benefits;
  if (!benefits || !benefits.items) return null;

  return (
    <section id={sectionId} className={`py-24 ${className || ds.features.sectionBg}`}>
      <div className="w-full max-w-[75em] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 id="benefits-title" className={`text-3xl md:text-4xl font-bold mb-4 ${titleClassName || ds.features.titleColor}`}>
            {benefits.title}
          </h2>
          <p id="benefits-subtitle" className={`text-lg max-w-2xl mx-auto mt-4 leading-relaxed ${subtitleClassName || ds.features.descColor}`}>
            {benefits.subtitle || fallbackSubtitle}
          </p>
          {showSeparator && (
            <div className={`h-1.5 w-24 rounded-full mx-auto mt-6 ${ds.blobColor}`}></div>
          )}
        </div>
        <div id="benefits-grid" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          {(benefits.items || []).map((item, idx) => (
            <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />
          ))}
        </div>
      </div>
    </section>
  );
};
