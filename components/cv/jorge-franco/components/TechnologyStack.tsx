import React from 'react';
import { Code, Cpu, Server, Database, Sparkles, Download } from 'lucide-react';

export const TechnologyStack: React.FC = () => {
  // Technical Stack categories
  const technicalStack = [
    {
      category: 'Lenguajes y Frameworks',
      items: 'React 19, TypeScript, Node.js (Express), PHP (Laravel), JavaScript (ES6+).',
      icon: <Code className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      category: 'Ingeniería de IA',
      items: 'Implementación de pipelines de IA Generativa con Google Gemini SDK y orquestación de LLMs.',
      icon: <Cpu className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      category: 'Infraestructura y DevOps',
      items: 'Google Cloud Platform (Cloud Run, Cloud SQL), Contenerización con Docker.',
      icon: <Server className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      category: 'Bases de Datos',
      items: 'MySQL 8.0 (Diseño de esquemas relacionales y optimización de consultas).',
      icon: <Database className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      category: 'Rendimiento y Herramientas',
      items: 'SEO Técnico (Core Web Vitals), APIs/Webhooks, Stripe API, Git, Metodologías Ágiles.',
      icon: <Sparkles className="w-5 h-5 text-[#FF5A1F]" />
    }
  ];

  return (
    <section id="curriculum" className="space-y-12 mb-24 text-left relative z-10">
      {/* Skills & Cards container (Full Width) */}
      <div className="space-y-8 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative w-full">
        <div className="space-y-2">
          <p className="text-xs font-black text-[#FFBF00] uppercase tracking-widest">HABILIDADES COMO FULLSTACK DEVELOPER</p>
          <h3 className="text-3xl font-black text-white uppercase tracking-tight">Stack Tecnológico</h3>
        </div>

        {/* Grid of technical cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {technicalStack.map((tech, idx) => (
            <div key={idx} className="group p-6 bg-[#0B0B0B] border border-white/5 rounded-2xl hover:border-white/10 transition-all flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white">
                {tech.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-[#FFBF00] uppercase tracking-wider mb-2 text-sm">{tech.category}</h4>
                <p className="text-white text-base md:text-lg font-normal leading-relaxed">
                  {tech.items}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CV Banner underneath */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl font-bold">
            <h4 className="text-2xl font-black text-white uppercase tracking-tight">Curriculum Vitae</h4>
            <p className="text-white font-normal text-lg md:text-xl leading-relaxed">
              Descarga mi CV. Conoce las tecnologías que manejo, mi historial de proyectos y mi visión técnica para escalar aplicaciones web eficientes.
            </p>
          </div>
          <div className="w-full md:w-auto shrink-0">
            <a 
              href="https://drive.google.com/file/d/1neROWIk7FfUgKqkNbTkEAbChTnbeJljI/view?usp=sharing" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-8 py-4 bg-[#FFBF00] hover:bg-[#E5AC00] text-black font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFBF00]/10"
            >
              <Download className="w-4 h-4 text-black stroke-[2.5]" />
              Descargar CV Oficial PDF
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
