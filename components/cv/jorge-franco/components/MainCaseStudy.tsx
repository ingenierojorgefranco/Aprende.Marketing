import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AprendeMarketingProjectPage } from '../AprendeMarketingProjectPage';
import { ArrowRight, Sparkles, Terminal, MessageSquare, Code, Cpu, Server, Zap, Check, Eye } from 'lucide-react';

export const MainCaseStudy: React.FC = () => {
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <section id="aprende-marketing-case-study" className="mb-24 relative z-10 text-left">
      {/* Container Card */}
      <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-12 shadow-2xl relative overflow-hidden">
        {/* Glow ambient inside card */}
        <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-[#FF5A1F]/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header inside */}
        <div className="space-y-2">
          <span className="inline-block text-[#FF5A1F] text-xs font-black tracking-widest uppercase">
            CASO DE ESTUDIO PRINCIPAL
          </span>
          <h2 className="text-3xl md:text-[2.5rem] font-black text-white tracking-tight leading-none uppercase">
            Aprende.Marketing
          </h2>
        </div>

        {/* Content & Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Column Left: Case Study details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-base font-black text-white uppercase tracking-wider">Problema</h4>
                <p className="text-base text-white font-normal leading-relaxed">
                  Los emprendedores y empresas pierden tiempo y dinero creando embudos, páginas y contenido desde cero. El proceso es costoso, lento y complejo.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-black text-white uppercase tracking-wider">Solución</h4>
                <p className="text-base text-white font-normal leading-relaxed">
                  Plataforma SaaS con IA que genera y gestiona embudos completos en minutos, integrando hosting, dominios, e-commerce, pagos y automatizaciones.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-black text-white uppercase tracking-wider">Mi responsabilidad</h4>
                <p className="text-base text-white font-normal leading-relaxed">
                  Diseñé y desarrollé la arquitectura completa, frontend, backend, base de datos, pipeline de IA, integraciones de pago y despliegue en la nube. También participé en la definición del producto, UX y estrategia de crecimiento.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="https://aprende.marketing" 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 group"
              >
                Probar demo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="px-5 py-3 bg-[#161616] hover:bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-xs rounded-xl transition-all"
              >
                Ver más detalles →
              </button>
            </div>
          </div>

          {/* Column Right: High fidelity Browser Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative w-full text-xs text-white">
              {/* Window control bar */}
              <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
                <div className="px-6 py-0.5 bg-[#161616] border border-white/5 rounded-md text-[10px] font-mono text-gray-400 w-1/2 text-center truncate">
                  aprende.marketing/dashboard
                </div>
                <div className="w-8"></div>
              </div>

              {/* Inside Layout */}
              <div className="grid grid-cols-12 min-h-[350px]">
                {/* Mockup Sidebar */}
                <div className="col-span-3 bg-[#0B0B0B] border-r border-white/5 p-3 space-y-3 font-semibold text-gray-400 text-[10px]">
                  <div className="flex items-center gap-2 px-2 py-1 bg-white/5 text-white rounded-lg font-bold">
                    <span className="w-4 h-4 rounded-md bg-[#FF5A1F] flex items-center justify-center text-white text-[9px] font-black">AM</span>
                    <span>Dashboard</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">Embudos</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">Sitios</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">Emails</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">Ventas</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">Contactos</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">Automatizaciones</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">Ajustes</div>
                  </div>
                </div>

                {/* Mockup Content Area */}
                <div className="col-span-9 bg-[#0E0E0E] p-5 space-y-4">
                  {/* Header Row */}
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h5 className="font-extrabold text-sm text-white">Hola, Jorge 👋</h5>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold uppercase tracking-wider">● En Vivo</span>
                  </div>

                  {/* Top KPIs row */}
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">Embudos</span>
                      <span className="text-xs font-black text-white">20+</span>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">Sitios</span>
                      <span className="text-xs font-black text-white">15+</span>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">Contactos</span>
                      <span className="text-xs font-black text-white">1,250</span>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">Ventas</span>
                      <span className="text-xs font-black text-[#FFBF00]">€24,500</span>
                    </div>
                  </div>

                  {/* Bottom details row (splits into Recent Funnels and Conversion Chart) */}
                  <div className="grid grid-cols-12 gap-3.5 pt-1">
                    {/* List of Recent funnels */}
                    <div className="col-span-7 bg-[#111111] border border-white/5 rounded-xl p-3 space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-1 text-left">Embudos Recientes</span>
                      
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between items-center text-[10px]">
                          <div>
                            <span className="block font-bold text-white">Lanzamiento Curso IA</span>
                            <span className="text-[8px] text-gray-500 font-normal">Publicado</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 block font-bold">+12%</span>
                            <span className="text-[8px] text-gray-500 font-normal">+15% conversion</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-white/5">
                          <div>
                            <span className="block font-bold text-white">Webinar de Ventas</span>
                            <span className="text-[8px] text-gray-500 font-normal">Publicado</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 block font-bold">+10%</span>
                            <span className="text-[8px] text-gray-500 font-normal">+11% conversion</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conversion Card with SVG Line chart */}
                    <div className="col-span-5 bg-[#111111] border border-white/5 rounded-xl p-3 text-left space-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Conversiones</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-white">15.2%</span>
                          <span className="text-[8px] font-extrabold text-emerald-400">+7.5%</span>
                        </div>
                      </div>

                      {/* SVG Mini Line Chart */}
                      <div className="h-10 w-full pt-1">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                          <defs>
                            <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.3"></stop>
                              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0"></stop>
                            </linearGradient>
                          </defs>
                          {/* Fill */}
                          <path 
                            d="M 0 30 Q 15 15 30 18 T 60 10 T 90 2 Q 95 1 100 0 L 100 30 Z" 
                            fill="url(#chart-glow)"
                          />
                          {/* Stroke line */}
                          <path 
                            d="M 0 30 Q 15 15 30 18 T 60 10 T 90 2 Q 95 1 100 0" 
                            fill="none" 
                            stroke="#FF5A1F" 
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          {/* Circles/Dots */}
                          <circle cx="100" cy="0" r="2.5" fill="#FFBF00" />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video de Presentación Interactiva */}
        <div id="video-presentacion" className="pt-10 border-t border-white/5 space-y-8">
          <div className="max-w-4xl mx-auto space-y-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black text-[#FF5A1F] uppercase tracking-widest">
              <Terminal className="w-4 h-4" /> Presentación en Video
            </span>
            <h2 className="text-3xl md:text-[2.5rem] font-black text-white tracking-tight uppercase leading-none">
              Descubre sobre <span className="text-[#FF5A1F]">Aprende.Marketing</span>
            </h2>
            <p className="text-sm md:text-base text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto">
              Aprende.Marketing elimina la brecha de ejecución en el marketing de productos digitales al automatizar todo el proceso de ventas, creando un embudo de conversión profesional para generar resultados escalables y automatizados.
            </p>
          </div>

          {isPlayingVideo ? (
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl max-w-3xl mx-auto w-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/96xL5jPp4WM?autoplay=1"
                title="Presentación Aprende.Marketing"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div 
              onClick={() => setIsPlayingVideo(true)}
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#0B0B0B] group shadow-2xl max-w-3xl mx-auto w-full flex flex-col items-center justify-center cursor-pointer select-none"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-color-dodge transition-all duration-700 group-hover:scale-105 group-hover:opacity-45" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5A1F]/15 via-transparent to-[#FFBF00]/15"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider text-white rounded-lg flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-pulse" /> Presentación Jorge Franco
                </span>
              </div>
              
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 bg-[#FFBF00]/15 border border-[#FFBF00]/30 text-[10px] font-black uppercase tracking-wider text-[#FFBF00] rounded-lg shadow-lg">
                  4:21 Minutos
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 transition-all duration-500 group-hover:scale-105">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#FF5A1F] to-[#FFBF00] rounded-full flex items-center justify-center shadow-2xl relative">
                  <svg className="w-8 h-8 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Metrics/Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6 border-t border-white/5">
          <div className="p-4 bg-[#0B0B0B] border border-white/5 rounded-2xl space-y-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Cpu className="w-4 h-4 text-[#FF5A1F]" />
            </div>
            <h5 className="font-extrabold text-white text-sm uppercase tracking-wider">Generación con IA</h5>
            <p className="text-sm text-white leading-normal font-normal">Embudos completos en ~1.5 minutos.</p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-white/5 rounded-2xl space-y-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Server className="w-4 h-4 text-[#FFBF00]" />
            </div>
            <h5 className="font-extrabold text-white text-sm uppercase tracking-wider">Multi-tenant</h5>
            <p className="text-sm text-white leading-normal font-normal">Arquitectura escalable por cuentas.</p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-white/5 rounded-2xl space-y-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <h5 className="font-extrabold text-white text-sm uppercase tracking-wider">Pagos integrados</h5>
            <p className="text-sm text-white leading-normal font-normal">Stripe, Hotmart y Systeme.io.</p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-white/5 rounded-2xl space-y-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Check className="w-4 h-4 text-blue-400" />
            </div>
            <h5 className="font-extrabold text-white text-sm uppercase tracking-wider">Alto rendimiento</h5>
            <p className="text-sm text-white leading-normal font-normal">Latencia mediana &lt; 180ms.</p>
          </div>

          <div className="p-4 bg-[#0B0B0B] border border-white/5 rounded-2xl space-y-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
            </div>
            <h5 className="font-extrabold text-white text-sm uppercase tracking-wider">Infraestructura cloud</h5>
            <p className="text-sm text-white leading-normal font-normal">Desplegado en Google Cloud Run.</p>
          </div>
        </div>

      </div>

      {/* Slide-over Drawer for Aprende.Marketing details */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl h-full bg-[#0B0B0B] border-l border-white/5 shadow-2xl overflow-y-auto z-10 flex flex-col"
            >
              <AprendeMarketingProjectPage 
                isDrawer={true} 
                onClose={() => setIsDrawerOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
