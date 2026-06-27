import React from 'react';
import { User, Code, Server, Database, Cpu, CreditCard, Cloud, ShieldAlert, RefreshCw, Layers } from 'lucide-react';

const ArrowRight: React.FC = () => (
  <div className="hidden md:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-20">
    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center shadow-lg animate-pulse">
      <svg className="w-4 h-4 text-[#FF5A1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

const ArrowDownRow: React.FC<{ lang?: 'es' | 'en' }> = ({ lang }) => (
  <div className="hidden md:flex items-center justify-center py-4 my-2">
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-black text-[#FFBF00] uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">
        {lang === 'es' ? 'Siguiente Fase' : 'Next Phase'}
      </span>
      <div className="w-0.5 h-12 bg-gradient-to-b from-[#FF5A1F] to-[#FFBF00] relative animate-pulse">
        <svg className="w-4 h-4 text-[#FFBF00] absolute -bottom-3 -left-[7px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

const MobileArrowDown: React.FC = () => (
  <div className="flex md:hidden items-center justify-center py-3">
    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center shadow-lg">
      <svg className="w-4 h-4 text-[#FF5A1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

interface HighLevelArchitectureProps {
  lang?: 'es' | 'en';
}

export const HighLevelArchitecture: React.FC<HighLevelArchitectureProps> = ({ lang = 'es' }) => {
  const steps = [
    {
      title: lang === 'es' ? 'Usuario' : 'User',
      pilar: lang === 'es' ? 'Acceso e interacción' : 'Access & Interaction',
      subtitle: lang === 'es' ? 'Cliente Web' : 'Web Client',
      desc: lang === 'es' 
        ? 'Entrada de los usuarios para interactuar con la plataforma y gestionar campañas.'
        : 'User entry point for interacting with the platform and managing campaigns.',
      icon: <User className="w-6 h-6 text-gray-400" />
    },
    {
      title: 'Frontend',
      pilar: lang === 'es' ? 'Interfaz de usuario' : 'User Interface',
      subtitle: 'React + TS',
      desc: lang === 'es'
        ? 'Aplicación SPA interactiva, optimizada para rendimiento y SEO técnico.'
        : 'Interactive SPA application, optimized for performance and technical SEO.',
      icon: <Code className="w-6 h-6 text-blue-400" />
    },
    {
      title: 'API (Backend)',
      pilar: lang === 'es' ? 'Orquestación & Endpoints' : 'Orchestration & Endpoints',
      subtitle: 'Node.js • Express',
      desc: lang === 'es'
        ? 'Servicio backend para control de lógica, rutas seguras y comunicación externa.'
        : 'Backend service for logic control, secure routing, and external integration.',
      icon: <Server className="w-6 h-6 text-[#FF5A1F]" />
    },
    {
      title: lang === 'es' ? 'Base de datos' : 'Database',
      pilar: lang === 'es' ? 'Consistencia y Persistencia' : 'Consistency & Persistence',
      subtitle: 'MySQL (Cloud SQL)',
      desc: lang === 'es'
        ? 'Base de datos relacional para gestión de cuentas multi-tenant y datos transaccionales.'
        : 'Relational database for multi-tenant accounts management and transactional data.',
      icon: <Database className="w-6 h-6 text-emerald-500" />
    },
    {
      title: 'IA Engine',
      pilar: lang === 'es' ? 'Inteligencia Generativa' : 'Generative Intelligence',
      subtitle: 'Gemini API SDK',
      desc: lang === 'es'
        ? 'Motor inteligente para la automatización y creación de embudos y copys de venta.'
        : 'Intelligent engine for sales funnel automation and copy generation.',
      icon: <Cpu className="w-6 h-6 text-[#FFBF00]" />
    },
    {
      title: lang === 'es' ? 'Pagos & Webhooks' : 'Payments & Webhooks',
      pilar: lang === 'es' ? 'Monetización y Eventos' : 'Monetization & Events',
      subtitle: 'Stripe / Hotmart',
      desc: lang === 'es'
        ? 'Integración de pasarelas de pago y escucha de eventos mediante webhooks seguros.'
        : 'Payment gateway integration and event listening via secure webhooks.',
      icon: <CreditCard className="w-6 h-6 text-purple-400" />
    },
    {
      title: lang === 'es' ? 'Despliegue & Cloud' : 'Deployment & Cloud',
      pilar: lang === 'es' ? 'Infraestructura Cloud' : 'Cloud Infrastructure',
      subtitle: 'Google Cloud Run',
      desc: lang === 'es'
        ? 'Contenedores Docker autogestionados y escalables desplegados en la nube de GCP.'
        : 'Self-managed, scalable Docker containers deployed on GCP Cloud.',
      icon: <Cloud className="w-6 h-6 text-sky-400" />
    }
  ];

  const features = [
    {
      title: 'Multi-tenant',
      desc: lang === 'es'
        ? 'Arquitectura escalable que aísla de forma segura la información y base de datos por cada cuenta de cliente.'
        : 'Scalable architecture that securely isolates data and database per client account.',
      icon: <Layers className="w-5 h-5 text-emerald-500" />
    },
    {
      title: lang === 'es' ? 'Seguridad por roles' : 'Role-based security',
      desc: lang === 'es'
        ? 'Control de acceso basado en roles (RBAC) para limitar funciones administrativas y de usuario.'
        : 'Role-Based Access Control (RBAC) to limit admin and user functions.',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />
    },
    {
      title: lang === 'es' ? 'Webhooks idempotentes' : 'Idempotent webhooks',
      desc: lang === 'es'
        ? 'Mecanismo de reintentos seguro que evita el procesamiento duplicado de transacciones o eventos de pago.'
        : 'Secure retry mechanism that avoids duplicate processing of transactions or payment events.',
      icon: <RefreshCw className="w-5 h-5 text-amber-500" />
    },
    {
      title: lang === 'es' ? 'Escalable' : 'Scalable',
      desc: lang === 'es'
        ? 'Diseñado con procesos asíncronos y cargas optimizadas para soportar un alto volumen de peticiones concurrentes.'
        : 'Designed with asynchronous processing and optimized loads to support high concurrent requests.',
      icon: <Cpu className="w-5 h-5 text-[#FF5A1F]" />
    },
    {
      title: lang === 'es' ? 'Backups automáticos' : 'Automated backups',
      desc: lang === 'es'
        ? 'Respaldo diario programado de la base de datos para garantizar la integridad y recuperación de datos críticos.'
        : 'Scheduled daily database backups to guarantee integrity and critical data recovery.',
      icon: <Database className="w-5 h-5 text-[#FFBF00]" />
    },
    {
      title: lang === 'es' ? 'Monitoreo y logs' : 'Monitoring and logs',
      desc: lang === 'es'
        ? 'Registro centralizado de excepciones y métricas de rendimiento en tiempo real para detección proactiva de fallas.'
        : 'Centralized exception logs and real-time performance metrics for proactive fault detection.',
      icon: <Server className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <section className="mb-24 relative z-10 text-left">
      {/* Title Header */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          {lang === 'es' ? 'ARQUITECTURA PROFESIONAL Y DE ALTO NIVEL' : 'PROFESSIONAL & HIGH-LEVEL ARCHITECTURE'}
        </h2>
      </div>

      {/* Diagram Frame Container */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 md:p-10 space-y-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-[#FFBF00]"></div>
        
        {/* ROW 1 */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Step 1 */}
            <div className="relative group">
              <div className="h-full bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/5 hover:border-[#FF5A1F]/30 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-[#FF5A1F]/10 group-hover:border-[#FF5A1F]/30 transition-all">
                  {steps[0].icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{steps[0].title}</h3>
                  <p className="text-xs font-semibold text-[#FF5A1F] uppercase tracking-wider mt-1">{steps[0].pilar}</p>
                  <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wider">{steps[0].subtitle}</span>
                  <p className="text-sm text-gray-300 font-normal leading-relaxed mt-3">{steps[0].desc}</p>
                </div>
              </div>
              <ArrowRight />
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="h-full bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/5 hover:border-blue-500/30 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                  {steps[1].icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{steps[1].title}</h3>
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mt-1">{steps[1].pilar}</p>
                  <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wider">{steps[1].subtitle}</span>
                  <p className="text-sm text-gray-300 font-normal leading-relaxed mt-3">{steps[1].desc}</p>
                </div>
              </div>
              <ArrowRight />
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="h-full bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/5 hover:border-[#FF5A1F]/30 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-[#FF5A1F]/10 group-hover:border-[#FF5A1F]/30 transition-all">
                  {steps[2].icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{steps[2].title}</h3>
                  <p className="text-xs font-semibold text-[#FF5A1F] uppercase tracking-wider mt-1">{steps[2].pilar}</p>
                  <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wider">{steps[2].subtitle}</span>
                  <p className="text-sm text-gray-300 font-normal leading-relaxed mt-3">{steps[2].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTING FLOW ARROW (Row 1 to Row 2) */}
        <ArrowDownRow lang={lang} />
        <MobileArrowDown />

        {/* ROW 2 */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Step 4 */}
            <div className="relative group">
              <div className="h-full bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/5 hover:border-emerald-500/30 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                  {steps[3].icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{steps[3].title}</h3>
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-1">{steps[3].pilar}</p>
                  <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wider">{steps[3].subtitle}</span>
                  <p className="text-sm text-gray-300 font-normal leading-relaxed mt-3">{steps[3].desc}</p>
                </div>
              </div>
              <ArrowRight />
            </div>

            {/* Step 5 */}
            <div className="relative group">
              <div className="h-full bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/5 hover:border-[#FFBF00]/30 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-[#FFBF00]/10 group-hover:border-[#FFBF00]/30 transition-all">
                  {steps[4].icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{steps[4].title}</h3>
                  <p className="text-xs font-semibold text-[#FFBF00] uppercase tracking-wider mt-1">{steps[4].pilar}</p>
                  <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wider">{steps[4].subtitle}</span>
                  <p className="text-sm text-gray-300 font-normal leading-relaxed mt-3">{steps[4].desc}</p>
                </div>
              </div>
              <ArrowRight />
            </div>

            {/* Step 6 */}
            <div className="relative group">
              <div className="h-full bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/5 hover:border-purple-500/30 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all">
                  {steps[5].icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{steps[5].title}</h3>
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mt-1">{steps[5].pilar}</p>
                  <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wider">{steps[5].subtitle}</span>
                  <p className="text-sm text-gray-300 font-normal leading-relaxed mt-3">{steps[5].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTING FLOW ARROW (Row 2 to Row 3) */}
        <ArrowDownRow lang={lang} />
        <MobileArrowDown />

        {/* ROW 3 (Centered Step 7) */}
        <div className="flex justify-center">
          <div className="w-full md:w-1/3 group relative">
            <div className="h-full bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/5 hover:border-sky-500/30 p-6 rounded-2xl transition-all duration-300 flex flex-col gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-sky-500/10 group-hover:border-sky-500/30 transition-all">
                {steps[6].icon}
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{steps[6].title}</h3>
                <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mt-1">{steps[6].pilar}</p>
                <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-md inline-block mt-2 uppercase tracking-wider">{steps[6].subtitle}</span>
                <p className="text-sm text-gray-300 font-normal leading-relaxed mt-3">{steps[6].desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="pt-10 border-t border-white/5">
          <div className="text-center mb-8">
            <h3 className="text-sm font-black text-[#FFBF00] uppercase tracking-widest">
              {lang === 'es' ? 'Características Clave del Ecosistema' : 'Key Ecosystem Features'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-[#0B0B0B] border border-white/5 hover:border-white/10 rounded-2xl flex flex-col gap-3 text-left transition-all duration-300 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">{feat.title}</h4>
                  <p className="text-xs text-gray-400 font-normal leading-relaxed mt-1.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
