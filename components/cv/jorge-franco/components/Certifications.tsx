import React from 'react';
import { ExternalLink, Award } from 'lucide-react';

interface CertificationsProps {
  lang: 'es' | 'en';
}

export const Certifications: React.FC<CertificationsProps> = ({ lang }) => {
  const certifications = [
    {
      title: 'IT Specialist - JavaScript',
      issuer: lang === 'es' ? 'Certiport, una empresa de Pearson VUE' : 'Certiport, a Pearson VUE business',
      desc: lang === 'es' 
        ? 'Los acreedores de esta insignia demuestran que pueden reconocer, escribir y depurar código JavaScript que resolverá lógicamente un problema.'
        : 'Earners of this badge demonstrate that they can recognize, write, and debug JavaScript code that will logically solve a problem.',
      image: 'https://images.credly.com/size/340x340/images/ef99b79e-fd54-4eb5-b2a4-bf17e92a4837/ITS-Badges_JavaScript_1200px.png',
      link: 'https://www.credly.com/badges/a3b6815b-d84a-4410-9c4d-70452b87ee80'
    },
    {
      title: 'IT Specialist - HTML and CSS',
      issuer: lang === 'es' ? 'Certiport, una empresa de Pearson VUE' : 'Certiport, a Pearson VUE business',
      desc: lang === 'es'
        ? 'Los acreedores de esta insignia demuestran que pueden estructurar una página web utilizando elementos HTML y crear y aplicar estilos utilizando CSS.'
        : 'Earners for this badge demonstrate that they can structure a webpage using HTML elements and create and apply styles using CSS.',
      image: 'https://images.credly.com/size/340x340/images/e2dc688d-de61-44a5-81af-ee96f117a211/ITS-Badges_HTML-and-CSS_1200px.png',
      link: 'https://www.credly.com/badges/51cf4265-8048-45a1-90fd-7f6963c440e8'
    }
  ];

  return (
    <section className="mb-24 relative z-10 text-left">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          {lang === 'es' ? 'CERTIFICACIONES' : 'CERTIFICATIONS'}
        </h2>
      </div>

      {/* Grid containing Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert, idx) => (
          <a 
            key={idx}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:border-white/10 hover:shadow-xl hover:shadow-[#FF5A1F]/5 transition-all duration-300 group relative overflow-hidden cursor-pointer"
          >
            {/* Subtle light effect on card hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5A1F]/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            
            {/* Left: Credly Badge Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 mx-auto sm:mx-0 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-xl p-2 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={cert.image} 
                alt={cert.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right: Info */}
            <div className="flex flex-col justify-between flex-1 space-y-4 text-center sm:text-left">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                    <Award className="w-3 h-3 text-[#FF5A1F]" />
                    {cert.issuer}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white leading-snug tracking-tight group-hover:text-[#FF5A1F] transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm text-gray-400 font-normal leading-relaxed max-w-xl">
                  {cert.desc}
                </p>
              </div>

              <div className="pt-2">
                <span 
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF5A1F] group-hover:text-[#D94A1E] transition-colors"
                >
                  {lang === 'es' ? 'Ver Credencial' : 'Verify Credential'}
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
