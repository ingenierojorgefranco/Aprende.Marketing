import React from 'react';
import { User, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

interface AboutAndAvailabilityProps {
  lang: 'es' | 'en';
}

export const AboutAndAvailability: React.FC<AboutAndAvailabilityProps> = ({ lang }) => {
  return (
    <section id="sobre-mi" className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 relative z-10 text-left">
      
      {/* Column Left: About Me */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            {lang === 'es' ? 'SOBRE MÍ' : 'ABOUT ME'}
          </h2>
        </div>

        <div className="space-y-4 text-base md:text-[1.1rem] text-white font-normal leading-relaxed">
          {lang === 'es' ? (
            <>
              <p>
                Apasionado por crear productos digitales que combinan tecnología, diseño y estrategia. Me enfoco en construir soluciones escalables, seguras y centradas en el usuario.
              </p>
              <p>
                Me encanta aprender, automatizar procesos y aplicar IA para resolver problemas reales y generar impacto. Cuando no estoy programando, disfruto el SEO, el marketing digital y los viajes.
              </p>
            </>
          ) : (
            <>
              <p>
                Passionate about creating digital products that combine technology, design, and strategy. I focus on building scalable, secure, and user-centered solutions.
              </p>
              <p>
                I love learning, automating processes, and applying AI to solve real-world problems and drive impact. When I'm not coding, I enjoy SEO, digital marketing, and traveling.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Column Right: Availability */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            {lang === 'es' ? 'DISPONIBILIDAD' : 'AVAILABILITY'}
          </h2>
        </div>

        {/* Info Grid */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="block text-white/85 font-bold uppercase tracking-wider mb-1.5 text-xs">
                {lang === 'es' ? 'Posiciones' : 'Positions'}
              </span>
              <span className="text-lg md:text-[1rem] text-white font-normal block leading-relaxed max-w-2xl">
                Full-Stack Engineer, Software Engineer, Product Engineer, Tech Lead
              </span>
            </div>

            <div>
              <span className="block text-white/85 font-bold uppercase tracking-wider mb-1.5 text-xs">
                {lang === 'es' ? 'Modalidad' : 'Location / Setting'}
              </span>
              <span className="text-lg md:text-[1rem] text-white font-normal block leading-relaxed max-w-2xl">
                {lang === 'es' ? 'Remoto (preferente) o híbrido en España' : 'Remote (preferred) or hybrid in Spain'}
              </span>
            </div>

            <div>
              <span className="block text-white/85 font-bold uppercase tracking-wider mb-1.5 text-xs">
                {lang === 'es' ? 'Disponibilidad' : 'Availability'}
              </span>
              <span className="text-lg md:text-[1rem] text-emerald-400 font-normal block leading-relaxed max-w-2xl">
                {lang === 'es' ? 'Inmediata' : 'Immediate'}
              </span>
            </div>

            <div>
              <span className="block text-white/85 font-bold uppercase tracking-wider mb-1.5 text-xs">
                {lang === 'es' ? 'Idiomas' : 'Languages'}
              </span>
              <span className="text-lg md:text-[1rem] text-white font-normal block leading-relaxed max-w-2xl">
                {lang === 'es' ? 'Español nativo, Inglés intermedio' : 'Native Spanish, Intermediate English'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
