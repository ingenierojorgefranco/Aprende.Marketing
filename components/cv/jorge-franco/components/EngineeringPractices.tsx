import React from 'react';
import { Code, ShieldAlert, Layers, GitPullRequest, Eye, Lock } from 'lucide-react';

interface EngineeringPracticesProps {
  lang: 'es' | 'en';
}

export const EngineeringPractices: React.FC<EngineeringPracticesProps> = ({ lang }) => {
  const practices = lang === 'es' ? [
    {
      title: 'CAMBIOS MÁS RÁPIDOS Y SEGUROS',
      desc: 'Arquitecturas modulares que permiten añadir funcionalidades sin romper las existentes ni aumentar innecesariamente la deuda técnica.',
      tech: 'Arquitectura modular · TypeScript · separación de responsabilidades',
      icon: <Code className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      title: 'DATOS CONSISTENTES Y CONFIABLES',
      desc: 'Evito registros incorrectos, errores entre frontend y backend y fallos provocados por información incompleta o mal estructurada.',
      tech: 'Validación de esquemas · tipado estático · control de endpoints',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'MENOS ERRORES EN PRODUCCIÓN',
      desc: 'Automatizo pruebas sobre los procesos críticos para detectar fallos antes de que afecten a usuarios, pagos o integraciones.',
      tech: 'Tests unitarios · integración · pipelines de IA · pagos',
      icon: <Layers className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      title: 'LANZAMIENTOS SIN INTERRUPCIONES',
      desc: 'Creo procesos automatizados de compilación y despliegue para publicar nuevas versiones de forma repetible y controlada.',
      tech: 'GitHub Actions · Docker · Google Cloud Run · CI/CD',
      icon: <GitPullRequest className="w-5 h-5 text-blue-400" />
    },
    {
      title: 'DETECCIÓN RÁPIDA DE INCIDENTES',
      desc: 'Centralizo errores y eventos críticos para localizar problemas con mayor rapidez y reducir el tiempo de recuperación.',
      tech: 'Logging estructurado · monitoreo · trazabilidad de errores',
      icon: <Eye className="w-5 h-5 text-purple-400" />
    },
    {
      title: 'PROTECCIÓN Y RECUPERACIÓN DE DATOS',
      desc: 'Protejo credenciales y datos transaccionales mediante gestión segura de secretos, migraciones versionadas y copias de recuperación.',
      tech: 'Secret Manager · migraciones SQL · backups automatizados',
      icon: <Lock className="w-5 h-5 text-amber-500" />
    }
  ] : [
    {
      title: 'FASTER AND SAFER RELEASES',
      desc: 'Modular architectures that enable rapid feature releases without breaking current systems or piling up unnecessary technical debt.',
      tech: 'Modular Architecture · TypeScript · Separation of Concerns',
      icon: <Code className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      title: 'CONSISTENT AND SECURE DATA',
      desc: 'I eliminate bad payloads, frontend-backend mismatch errors, and crashes caused by incomplete or poorly modeled information.',
      tech: 'Schema Validation · Static Typing · Strict Endpoint Routing',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'LESS PRODUCTION INCIDENTS',
      desc: 'I build automated tests over critical user journeys to pinpoint glitches before they touch active users, billing, or SDK channels.',
      tech: 'Unit Tests · Integration Tests · AI pipelines · Payment checkouts',
      icon: <Layers className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      title: 'SEAMLESS DEPLOYMENTS',
      desc: 'Continuous integration and deployment pipelines to publish hotfixes and upgrades in a completely deterministic manner.',
      tech: 'GitHub Actions · Docker · Google Cloud Run · CI/CD',
      icon: <GitPullRequest className="w-5 h-5 text-blue-400" />
    },
    {
      title: 'PROACTIVE OBSERVABILITY',
      desc: 'Centralized logging and alerting to map errors immediately, drastically shortening system recovery times (MTTR).',
      tech: 'Structured Logging · APM Monitoring · Sentry / Error Tracing',
      icon: <Eye className="w-5 h-5 text-purple-400" />
    },
    {
      title: 'ROBUST SECURITY & BACKUPS',
      desc: 'Protect API keys and state via safe secrets management, database migrations, and automated nightly cloud backups.',
      tech: 'Secret Manager · SQL Migrations · Automated Backup',
      icon: <Lock className="w-5 h-5 text-amber-500" />
    }
  ];

  return (
    <section className="mb-24 relative z-10 text-left">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            {lang === 'es' ? 'SOLUCIONES DE INGENIERÍA PARA PRODUCTOS ESCALABLES' : 'ENGINEERING SOLUTIONS FOR SCALABLE PRODUCTS'}
          </h2>
        </div>
        <p className="text-lg md:text-[1.1rem] text-white/90 font-normal leading-relaxed max-w-3xl">
          {lang === 'es'
            ? 'Diseño sistemas preparados para crecer, reduciendo errores, riesgos operativos y costes de mantenimiento desde la arquitectura.'
            : 'I architect systems prepared for massive scale, minimizing errors, operational risks, and maintenance expenses directly from the code design.'}
        </p>
      </div>

      {/* Grid of 6 practices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {practices.map((prac, idx) => (
          <div 
            key={idx} 
            className="bg-[#111111] border border-white/5 rounded-2xl p-7 hover:border-white/10 hover:shadow-xl hover:shadow-white/[0.01] transition-all duration-300 space-y-6 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                {prac.icon}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-base font-black text-white uppercase tracking-wider">{prac.title}</h4>
                <p className="text-lg md:text-[1rem] text-white font-normal leading-relaxed max-w-2xl">{prac.desc}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
                {prac.tech}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
