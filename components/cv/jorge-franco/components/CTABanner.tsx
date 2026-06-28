import React from 'react';
import { ArrowUpRight, MessageSquare } from 'lucide-react';

interface CTABannerProps {
  lang: 'es' | 'en';
}

export const CTABanner: React.FC<CTABannerProps> = ({ lang }) => {
  return (
    <section className="max-w-4xl mx-auto mb-24 relative z-10 text-center">
      <div className="bg-[#111111] border border-[#FF5A1F]/20 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
        {/* Top glowing orange line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF5A1F] to-[#FFBF00]"></div>
        
        <div className="space-y-6 text-center py-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-full text-xs font-black text-[#FF5A1F] uppercase tracking-widest">
            {lang === 'es' ? '✉ TRABAJEMOS JUNTOS' : '✉ WORK WITH ME'}
          </span>
          
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight max-w-2xl mx-auto leading-tight">
            {lang === 'es' ? '¿Buscas un Senior Full-Stack o Product Engineer?' : 'Looking for a Senior Full-Stack or Product Engineer?'}
          </h3>
          
          <p className="text-white font-normal max-w-xl mx-auto leading-relaxed text-base md:text-lg">
            {lang === 'es'
              ? 'Estoy abierto a oportunidades full-time en equipos que construyan productos SaaS, plataformas digitales y soluciones con inteligencia artificial.'
              : "I'm open to full-time opportunities in teams building SaaS products, digital platforms, and AI-powered solutions."}
          </p>
          
          <div className="pt-4">
            <a 
              href="https://calendly.com/jorgefranpuntoco/seminariosonline" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/15 active:scale-[0.98] group"
            >
              <MessageSquare className="w-4 h-4 text-white" /> 
              <span>{lang === 'es' ? 'Contactarme' : 'Contact Me'}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
