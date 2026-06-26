import React from 'react';
import { User, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

export const AboutAndAvailability: React.FC = () => {
  return (
    <section id="sobre-mi" className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 relative z-10 text-left">
      
      {/* Column Left: About Me */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            SOBRE MÍ
          </h2>
        </div>

        <div className="space-y-4 text-base md:text-[1.05rem] text-white/95 font-normal leading-relaxed">
          <p>
            Apasionado por crear productos digitales que combinan tecnología, diseño y estrategia. Me enfoco en construir soluciones escalables, seguras y centradas en el usuario.
          </p>
          <p>
            Me encanta aprender, automatizar procesos y aplicar IA para resolver problemas reales y generar impacto. Cuando no estoy programando, disfruto el SEO, el marketing digital y los viajes.
          </p>
        </div>
      </div>

      {/* Column Right: Availability */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            DISPONIBILIDAD
          </h2>
        </div>

        {/* Info Grid */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5 text-xs">Posiciones</span>
              <span className="text-white font-normal block leading-relaxed">
                Full-Stack Engineer, Software Engineer, Product Engineer, Tech Lead
              </span>
            </div>

            <div>
              <span className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5 text-xs">Modalidad</span>
              <span className="text-white font-normal block leading-relaxed">
                Remoto (preferente) o híbrido en España
              </span>
            </div>

            <div>
              <span className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5 text-xs">Disponibilidad</span>
              <span className="text-emerald-400 font-normal block leading-relaxed">
                Inmediata
              </span>
            </div>

            <div>
              <span className="block text-gray-400 font-bold uppercase tracking-wider mb-1.5 text-xs">Idiomas</span>
              <span className="text-white font-normal block leading-relaxed">
                Español nativo, Inglés intermedio
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
