import React from 'react';
import { Calendar, Server, Cpu, Zap } from 'lucide-react';

interface MetricsBarProps {
  lang: 'es' | 'en';
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ lang }) => {
  const metrics = lang === 'es' ? [
    {
      value: '15+',
      title: 'Años de experiencia',
      desc: 'en desarrollo, producto y marketing digital',
      icon: <Calendar className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      title: 'Arquitectura Cloud & Backend',
      desc: 'Diseño de infraestructuras escalables y bases de datos relacionales (Node.js, GCP, Cloud SQL).',
      icon: <Server className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Ingeniería de Inteligencia Artificial',
      desc: 'Orquestación de modelos de lenguaje (LLMs) y pipelines generativos (Google Gemini SDK).',
      icon: <Cpu className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      title: 'Desarrollo Full-Stack Avanzado',
      desc: 'Creación de ecosistemas de alto rendimiento orientados a la conversión (React 19, TypeScript).',
      icon: <Zap className="w-5 h-5 text-[#FF5A1F]" />
    }
  ] : [
    {
      value: '15+',
      title: 'Years of Experience',
      desc: 'in development, product strategy, and digital marketing',
      icon: <Calendar className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      title: 'Cloud Architecture & Backend',
      desc: 'Designing scalable infrastructures and relational databases (Node.js, GCP, Cloud SQL).',
      icon: <Server className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Artificial Intelligence Engineering',
      desc: 'Orchestrating large language models (LLMs) and generative pipelines (Google Gemini SDK).',
      icon: <Cpu className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      title: 'Advanced Full-Stack Development',
      desc: 'Building high-performance conversion-oriented ecosystems (React 19, TypeScript).',
      icon: <Zap className="w-5 h-5 text-[#FF5A1F]" />
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 relative z-10 text-center">
      {metrics.map((m, idx) => (
        <div 
          key={idx} 
          className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 flex flex-col items-center space-y-4 hover:shadow-[0_0_30px_rgba(255,90,31,0.01)]"
        >
          {/* Centered Icon Container */}
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
            {m.icon}
          </div>
          
          {/* Label & Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white leading-snug tracking-tight">
              {m.value ? `${m.value} ${m.title}` : m.title}
            </h3>
            <p className="text-lg md:text-[1rem] text-white font-normal leading-relaxed max-w-2xl">
              {m.desc}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};
