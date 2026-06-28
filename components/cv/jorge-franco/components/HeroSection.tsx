import React from 'react';
import { Code, Server, Cpu, Cloud, Zap, Download, Mail, Github, Linkedin, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onScrollTo: (elementId: string) => void;
  lang: 'es' | 'en';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollTo, lang }) => {
  return (
    <section id="inicio" className="grid md:grid-cols-12 gap-8 items-center mb-16 relative z-10 pt-4">
      
      {/* Columna Izquierda: Introducción y CTA */}
      <div className="md:col-span-8 space-y-6 text-left">
        <span className="inline-block text-[#FF5A1F] text-xs font-black tracking-widest uppercase leading-relaxed pt-[2em]">
          Full-Stack Developer & Product Engineer
        </span>
        
        <h1 className="text-4xl md:text-[3.25rem] font-black text-white leading-[1.1] tracking-tight">
          {lang === 'es' 
            ? 'Construyo productos digitales escalables que resuelven problemas reales y generan valor de negocio.'
            : 'I build scalable digital products that solve real-world problems and generate business value.'}
        </h1>
        
        <p className="text-lg md:text-[1.2rem] text-white font-normal leading-relaxed max-w-2xl">
          {lang === 'es'
            ? 'Más de 15 años diseñando, desarrollando y escalando plataformas web, SaaS, marketing pipelines y sistemas de automatización con IA.'
            : 'Over 15 years designing, developing, and scaling web platforms, SaaS, marketing pipelines, and AI automation systems.'}
        </p>

        {/* Pilas de Características */}
        <div className="flex flex-wrap gap-3 pt-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111] border border-white/10 rounded-full text-xs font-normal text-white">
            <Code className="w-3.5 h-3.5 text-[#FF5A1F]" /> Full-Stack Engineering
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111] border border-white/10 rounded-full text-xs font-normal text-white">
            <Server className="w-3.5 h-3.5 text-emerald-500" /> SaaS Products
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111] border border-white/10 rounded-full text-xs font-normal text-white">
            <Cpu className="w-3.5 h-3.5 text-[#FFBF00]" /> Generative AI
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111] border border-white/10 rounded-full text-xs font-normal text-white">
            <Cloud className="w-3.5 h-3.5 text-blue-400" /> Cloud Architecture
          </span>
        </div>

        {/* Botones de Acción y Redes */}
        <div className="space-y-3 pt-4">
          {/* Fila Superior: Descargar CV y Ver proyectos */}
          <div className="grid grid-cols-2 gap-3.5 w-full max-w-[620px]">
            <a 
              href={lang === 'en' ? "https://drive.google.com/file/d/1VCpBth4IoMivaJPCuQyx8QTLYAJyK2dG/view?usp=drive_link" : "https://drive.google.com/file/d/1neROWIk7FfUgKqkNbTkEAbChTnbeJljI/view?usp=sharing"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/15 flex items-center justify-center gap-2 group cursor-pointer w-full text-center"
            >
              <Download className="w-4 h-4 text-white stroke-[2.5] shrink-0" />
              <span>{lang === 'es' ? 'Descargar CV' : 'Download CV'}</span>
            </a>

            <button 
              onClick={() => onScrollTo('proyectos')}
              className="px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer backdrop-blur-md w-full text-center"
            >
              <span>{lang === 'es' ? 'Ver proyectos' : 'View projects'}</span>
              <span className="group-hover:translate-x-1 transition-transform shrink-0">→</span>
            </button>
          </div>

          {/* Fila Inferior: Redes y Contacto en el mismo ancho */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[620px]">
            <a 
              href="https://github.com/ingenierojorgefranco/" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] w-full text-center"
            >
              <Github className="w-4 h-4 text-gray-300 shrink-0" />
              <span>GitHub</span>
            </a>

            <a 
              href="https://www.linkedin.com/in/jorgefrancodev/" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] w-full text-center"
            >
              <Linkedin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>LinkedIn</span>
            </a>

            <a 
              href="https://calendly.com/jorgefranpuntoco/seminariosonline"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] w-full text-center"
            >
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{lang === 'es' ? 'Contactar' : 'Contact'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Tarjeta de Presentación */}
      <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center">
        <div className="relative group w-full max-w-[340px]">
          {/* Glowing Ambient Gradient Background */}
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FF5A1F]/20 to-[#FFBF00]/20 rounded-3xl blur opacity-40 group-hover:opacity-60 transition duration-700"></div>
          
          {/* Card Frame */}
          <div className="relative bg-[#111111] border border-white/10 rounded-3xl p-5 space-y-5 text-center shadow-2xl">
            {/* Foto Container */}
            <div className="w-full aspect-square mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#161616] relative shadow-inner">
              <img 
                src="https://github.com/user-attachments/assets/b6dafd03-8d9c-448e-9981-aa250aee6b78" 
                alt="Jorge Franco" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Header Title */}
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white tracking-wide uppercase">Jorge Alberto Franco</h2>
              <p className="text-xs font-semibold text-[#FFBF00] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A1F]" /> {lang === 'es' ? 'Málaga, España' : 'Málaga, Spain'}
              </p>
            </div>

            {/* Disponibilidad Badge */}
            <div className="pt-2 border-t border-white/5">
              <span className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs font-black text-emerald-400">
                {lang === 'es' ? 'DISPONIBLE PARA TRABAJO REMOTO O PRESENCIAL' : 'AVAILABLE FOR REMOTE OR ON-SITE WORK'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
