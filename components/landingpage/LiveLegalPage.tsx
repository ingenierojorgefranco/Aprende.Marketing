import React from 'react';
import { GeneratedPageContent } from '../../types';
import { LEGAL_CONTENT } from './LegalContent';

interface LiveLegalPageProps {
  content: GeneratedPageContent;
  ds: any;
  type: 'privacy' | 'terms';
}

export const LiveLegalPage: React.FC<LiveLegalPageProps> = ({ ds, type }) => {
  const legal = type === 'privacy' ? LEGAL_CONTENT.privacy : LEGAL_CONTENT.terms;

  return (
    <main className="pt-32 pb-20 container mx-auto px-6 max-w-4xl min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-6">
                {legal.title}
            </h1>
            <div 
                className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: legal.content }}
            />
        </div>
      </div>
    </main>
  );
};