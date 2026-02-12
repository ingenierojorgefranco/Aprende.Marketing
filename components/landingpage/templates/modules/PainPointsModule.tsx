import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { XCircle } from 'lucide-react';

interface PainPointsModuleProps {
  content: GeneratedPageContent;
  ds: any;
}

export const PainPointsModule: React.FC<PainPointsModuleProps> = ({ content, ds }) => {
  return (
    <section id="dolores" className={`py-16 ${ds.features.sectionBg}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${ds.features.titleColor}`}>{content.whatYouWillLearn.title || "¿Es para ti esta clase?"}</h2>
            <p className={`text-xl font-medium mb-12 ${ds.features.descColor}`}>Si te pasa que…</p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
                {(content.whatYouWillLearn.items || []).slice(0, 6).map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-6 rounded-2xl border bg-white/50 backdrop-blur-sm ${ds.features.cardBorder}`}>
                        <XCircle className="w-8 h-8 text-red-500 shrink-0" />
                        <p className={`text-[1.2rem] leading-relaxed font-medium ${ds.features.descColor}`}>{item}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};