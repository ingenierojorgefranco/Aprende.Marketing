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
            <div className="grid md:grid-cols-2 gap-8 text-left">
                {(content.whatYouWillLearn.items || []).slice(0, 6).map((item, idx) => (
                    <div key={idx} className={`group relative flex items-center gap-5 p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${ds.features.cardBorder} bg-gradient-to-br from-white via-white to-gray-50/50`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-red-50 border border-red-100/50`}>
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <p className={`relative z-10 text-[1.1rem] md:text-[1.2rem] leading-relaxed font-semibold tracking-tight ${ds.features.descColor}`}>{item}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};