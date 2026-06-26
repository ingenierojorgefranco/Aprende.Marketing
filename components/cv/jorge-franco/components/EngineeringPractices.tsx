import React from 'react';
import { Code, ShieldAlert, Layers, GitPullRequest, Eye, RefreshCw, Lock, Database } from 'lucide-react';

export const EngineeringPractices: React.FC = () => {
  const practices = [
    {
      title: 'Código limpio y modular',
      desc: 'Separación rigurosa de responsabilidades, componentes autocontenidos y arquitectura modular.',
      icon: <Code className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      title: 'Validación de datos',
      desc: 'Control exhaustivo en cada endpoint API con esquemas estrictos y tipado estático completo.',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'Tests automatizados',
      desc: 'Pruebas de integración para pipelines de IA, pasarelas de pago y middleware multitenant.',
      icon: <Layers className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      title: 'CI/CD automatizado',
      desc: 'Despliegues continuos automatizados con GitHub Actions para compilaciones consistentes.',
      icon: <GitPullRequest className="w-5 h-5 text-blue-400" />
    },
    {
      title: 'Logging y monitoreo',
      desc: 'Registro centralizado de eventos y excepciones críticas para solución rápida de incidentes.',
      icon: <Eye className="w-5 h-5 text-purple-400" />
    },
    {
      title: 'Migraciones relacionales',
      desc: 'Control estricto de esquemas de bases de datos relacionales mediante scripts versionados.',
      icon: <RefreshCw className="w-5 h-5 text-pink-500" />
    },
    {
      title: 'Gestión de secretos',
      desc: 'Seguridad estricta en el almacenamiento de claves API (Gemini, Stripe) mediante gestores seguros.',
      icon: <Lock className="w-5 h-5 text-amber-500" />
    },
    {
      title: 'Backups automáticos',
      desc: 'Estrategias robustas de respaldo y recuperación periódica para bases de datos transaccionales.',
      icon: <Database className="w-5 h-5 text-teal-500" />
    }
  ];

  return (
    <section className="mb-24 relative z-10 text-left">
      {/* Header */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          PRÁCTICAS DE INGENIERÍA
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {practices.map((prac, idx) => (
          <div 
            key={idx} 
            className="bg-[#111111] border border-white/5 rounded-2xl p-7 hover:border-white/10 hover:shadow-xl hover:shadow-white/[0.01] transition-all duration-300 space-y-5 flex flex-col justify-between group"
          >
            <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              {prac.icon}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-base font-black text-white uppercase tracking-wider">{prac.title}</h4>
              <p className="text-sm text-white font-normal leading-relaxed">{prac.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
