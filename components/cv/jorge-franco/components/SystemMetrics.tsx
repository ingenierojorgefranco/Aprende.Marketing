import React from 'react';

interface SystemMetricsProps {
  lang?: 'es' | 'en';
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ lang = 'es' }) => {
  return (
    <section className="mb-24 text-left relative">
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#FFBF00]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="space-y-8 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F]"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> {lang === 'es' ? 'Estado del Proyecto' : 'Project Status'}
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              {lang === 'es' ? 'Métricas del Sistema ' : 'System Metrics '}
              <span className="text-[#FFBF00]">({lang === 'es' ? 'Fase Beta' : 'Beta Phase'})</span>
            </h3>
          </div>
          <p className="text-white/90 font-normal leading-loose text-base md:text-lg max-w-md">
            {lang === 'es'
              ? 'Benchmarks internos y métricas de rendimiento reales obtenidas durante las pruebas con usuarios activos en producción.'
              : 'Internal benchmarks and real performance metrics gathered during tests with active production users.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-[#FF5A1F]/20 transition-all group">
            <div className="text-4xl font-black text-[#FF5A1F] mb-1 group-hover:scale-105 transition-transform">20+</div>
            <div className="text-xs font-black text-white uppercase tracking-wider mb-2">
              {lang === 'es' ? 'Embudos Generados' : 'Funnels Generated'}
            </div>
            <p className="text-white/90 font-normal leading-loose text-sm md:text-base">
              {lang === 'es'
                ? 'Sistemas de ventas completos creados desde una sola idea inicial en menos de 2 minutos.'
                : 'Complete sales systems created from a single initial idea in less than 2 minutes.'}
            </p>
          </div>
          
          <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-[#FFBF00]/20 transition-all group">
            <div className="text-4xl font-black text-[#FFBF00] mb-1 group-hover:scale-105 transition-transform">~1.5 Min</div>
            <div className="text-xs font-black text-white uppercase tracking-wider mb-2">
              {lang === 'es' ? 'Tiempo de Procesamiento' : 'Processing Time'}
            </div>
            <p className="text-white/90 font-normal leading-loose text-sm md:text-base">
              {lang === 'es'
                ? 'Pipeline asíncrono optimizado de 6 etapas que integra y formatea todos los activos de venta.'
                : 'Optimized 6-stage asynchronous pipeline that integrates and formats all sales assets.'}
            </p>
          </div>

          <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-[#FF5A1F]/20 transition-all group">
            <div className="text-4xl font-black text-white mb-1 group-hover:scale-105 transition-transform">15+</div>
            <div className="text-xs font-black text-[#FF5A1F] uppercase tracking-wider mb-2">
              {lang === 'es' ? 'Usuarios Beta Activos' : 'Active Beta Users'}
            </div>
            <p className="text-white/90 font-normal leading-loose text-sm md:text-base">
              {lang === 'es'
                ? 'Emprendedores y afiliados validando embudos reales diariamente en la plataforma.'
                : 'Entrepreneurs and affiliates validating real funnels daily on the platform.'}
            </p>
          </div>

          <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-emerald-500/20 transition-all group">
            <div className="text-4xl font-black text-emerald-400 mb-1 group-hover:scale-105 transition-transform">+15%</div>
            <div className="text-xs font-black text-white uppercase tracking-wider mb-2">
              {lang === 'es' ? 'Mejora de Conversión' : 'Conversion Boost'}
            </div>
            <p className="text-white/90 font-normal leading-loose text-sm md:text-base">
              {lang === 'es'
                ? 'Porcentaje de conversión incrementado frente a embudos tradicionales no optimizados.'
                : 'Increased conversion rate compared to non-optimized traditional funnels.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
