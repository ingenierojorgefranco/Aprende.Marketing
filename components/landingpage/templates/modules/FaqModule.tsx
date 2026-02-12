
import React, { useState } from 'react';
import { GeneratedPageContent } from '../../../../types';
import { Plus, Minus } from 'lucide-react';
import { renderRichText } from '../../utils';

interface FaqModuleProps {
  content: GeneratedPageContent;
  ds: any;
}

export const FaqModule: React.FC<FaqModuleProps> = ({ content, ds }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const questions = content.faq || [];

  return (
    <section id="faq-section" className={`py-24 ${ds.faq.sectionBg}`}>
        <div className="w-full max-w-4xl mx-auto px-6">
            <div className="text-center mb-16"><h2 id="faq-title" className={`text-3xl md:text-4xl font-bold mb-4 ${ds.faq.titleColor}`}>Preguntas Frecuentes</h2></div>
            <div className="space-y-4">
                {(questions || []).map((q, idx) => (
                    <div key={idx} id={`faq-card-${idx}`} className={`rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? `shadow-lg border-opacity-0 ${ds.faq.cardBg}` : `border-transparent ${ds.faq.cardBg} hover:bg-opacity-80`}`}>
                        <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left"><span className={`font-bold text-lg ${ds.faq.questionColor}`}>{q.question}</span><div className={`p-2 rounded-full ${ds.faq.iconBg} ${ds.faq.iconColor}`}>{openIndex === idx ? <Minus className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}</div></button>
                        <div className={`transition-all duration-300 ease-in-out px-6 ${openIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>{renderRichText(q.answer, `leading-relaxed ${ds.faq.answerColor}`)}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};
