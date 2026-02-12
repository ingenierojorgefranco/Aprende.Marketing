
import React from 'react';
import { GeneratedPageContent } from '../../../../types';

interface Step {
  num: number;
  title: string;
  text: string;
}

interface StepsModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  title?: string;
  description?: string;
  steps: Step[];
}

export const StepsModule: React.FC<StepsModuleProps> = ({ ds, isMobilePreview, title, description, steps }) => {
  return (
    <section id="steps-section" className={`py-24 relative ${ds.steps.sectionBg}`}>
        <div className="w-full max-w-[75em] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 id="steps-title" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.steps.titleColor}`}>{title || "Acceder a tu Transformación es Muy Fácil"}</h2>
                {description && <p id="steps-desc" className={`text-lg max-w-2xl mx-auto ${ds.steps.textColor}`}>{description}</p>}
            </div>
            <div className={`relative grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                 {steps.map((step, i) => (
                    <div key={i} id={`step-card-${i}`} className={`relative z-10 flex flex-col items-center text-center p-8 rounded-2xl transition hover:-translate-y-2 border ${ds.steps.cardBg} ${ds.steps.cardBorder} ${ds.steps.cardShadow}`}>
                         <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 ${ds.steps.iconContainer} ${ds.steps.numberColor}`}>{step.num}</div>
                         <h3 className={`text-xl font-bold mb-3 ${ds.steps.titleColor}`}>{step.title}</h3>
                         <p className={`text-sm leading-relaxed ${ds.steps.textColor}`}>{step.text}</p>
                    </div>
                 ))}
            </div>
        </div>
    </section>
  );
};
