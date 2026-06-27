import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AprendeMarketingProjectPage } from '../AprendeMarketingProjectPage';
import { ArrowRight, Sparkles, Terminal, MessageSquare, Code, Cpu, Server, Zap, Check, Eye } from 'lucide-react';

interface MainCaseStudyProps {
  lang: 'es' | 'en';
}

export const MainCaseStudy: React.FC<MainCaseStudyProps> = ({ lang }) => {
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
    <section 
      id="aprende-marketing-case-study" 
      className={`mb-24 relative text-left transition-all ${isDrawerOpen ? 'z-[200]' : 'z-10'}`}
    >
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          {lang === 'es' ? 'PROYECTOS EN DESARROLLO' : 'PROJECTS IN DEVELOPMENT'}
        </h2>
      </div>

      {/* Container Card */}
      <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-6 md:py-8 md:px-10 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient inside card */}
        <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-[#FF5A1F]/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header inside */}
        <div className="space-y-2">
          <span className="inline-block text-[#FF5A1F] text-xs font-black tracking-widest uppercase">
            {lang === 'es' ? 'CASO DE ESTUDIO PRINCIPAL' : 'MAIN CASE STUDY'}
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
                <h4 className="text-base font-black text-white uppercase tracking-wider">
                  {lang === 'es' ? 'Problema' : 'Problem'}
                </h4>
                <p className="text-lg md:text-[1rem] text-white font-normal leading-relaxed max-w-2xl">
                  {lang === 'es'
                    ? 'Los emprendedores y empresas pierden tiempo y dinero creando embudos, páginas y contenido desde cero. El proceso es costoso, lento y complejo.'
                    : 'Entrepreneurs and businesses waste time and money building funnels, pages, and marketing content from scratch. It is costly, slow, and complex.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-black text-white uppercase tracking-wider">
                  {lang === 'es' ? 'Solución' : 'Solution'}
                </h4>
                <p className="text-lg md:text-[1rem] text-white font-normal leading-relaxed max-w-2xl">
                  {lang === 'es'
                    ? 'Plataforma SaaS con IA que genera y gestiona embudos completos en minutos, integrando hosting, dominios, e-commerce, pagos y automatizaciones.'
                    : 'An AI-powered SaaS platform that designs and deploys comprehensive marketing funnels in minutes, bundling hosting, custom domains, e-commerce, payment processing, and automations.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-black text-white uppercase tracking-wider">
                  {lang === 'es' ? 'Mi responsabilidad' : 'My Responsibility'}
                </h4>
                <p className="text-lg md:text-[1rem] text-white font-normal leading-relaxed max-w-2xl">
                  {lang === 'es'
                    ? 'Diseñé y desarrollé la arquitectura completa, frontend, backend, base de datos, pipeline de IA, integraciones de pago y despliegue en la nube. También participé en la definición del producto, UX y estrategia de crecimiento.'
                    : 'Engineered and built the entire core architecture, frontend, backend API, database structure, AI-generation pipelines, secure billing checkouts, and cloud scaling. Actively drove UX design, product roadmap definitions, and growth funnels.'}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="px-8 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 group shadow-lg shadow-[#FF5A1F]/20 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                {lang === 'es' ? 'Ver Detalles del Proyecto' : 'View Project Details'}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">{lang === 'es' ? 'Embudos' : 'Funnels'}</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">{lang === 'es' ? 'Sitios' : 'Sites'}</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">{lang === 'es' ? 'Emails' : 'Emails'}</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">{lang === 'es' ? 'Ventas' : 'Sales'}</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">{lang === 'es' ? 'Contactos' : 'Contacts'}</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">{lang === 'es' ? 'Automatizaciones' : 'Automations'}</div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:text-white cursor-pointer">{lang === 'es' ? 'Ajustes' : 'Settings'}</div>
                  </div>
                </div>

                {/* Mockup Content Area */}
                <div className="col-span-9 bg-[#0E0E0E] p-5 space-y-4">
                  {/* Header Row */}
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h5 className="font-extrabold text-sm text-white">{lang === 'es' ? 'Hola, Jorge 👋' : 'Hi, Jorge 👋'}</h5>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold uppercase tracking-wider">
                      {lang === 'es' ? '● En Vivo' : '● Live'}
                    </span>
                  </div>

                  {/* Top KPIs row */}
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">{lang === 'es' ? 'Embudos' : 'Funnels'}</span>
                      <span className="text-xs font-black text-white">20+</span>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">{lang === 'es' ? 'Sitios' : 'Sites'}</span>
                      <span className="text-xs font-black text-white">15+</span>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">{lang === 'es' ? 'Contactos' : 'Contacts'}</span>
                      <span className="text-xs font-black text-white">1,250</span>
                    </div>
                    <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-left space-y-0.5">
                      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">{lang === 'es' ? 'Ventas' : 'Sales'}</span>
                      <span className="text-xs font-black text-[#FFBF00]">€24,500</span>
                    </div>
                  </div>

                  {/* Bottom details row (splits into Recent Funnels and Conversion Chart) */}
                  <div className="grid grid-cols-12 gap-3.5 pt-1">
                    {/* List of Recent funnels */}
                    <div className="col-span-7 bg-[#111111] border border-white/5 rounded-xl p-3 space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block border-b border-white/5 pb-1 text-left">
                        {lang === 'es' ? 'Embudos Recientes' : 'Recent Funnels'}
                      </span>
                      
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between items-center text-[10px]">
                          <div>
                            <span className="block font-bold text-white">
                              {lang === 'es' ? 'Lanzamiento Curso IA' : 'AI Course Launch'}
                            </span>
                            <span className="text-[8px] text-gray-500 font-normal">
                              {lang === 'es' ? 'Publicado' : 'Published'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 block font-bold">+12%</span>
                            <span className="text-[8px] text-gray-500 font-normal">+15% conversion</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-white/5">
                          <div>
                            <span className="block font-bold text-white">
                              {lang === 'es' ? 'Webinar de Ventas' : 'Sales Webinar'}
                            </span>
                            <span className="text-[8px] text-gray-500 font-normal">
                              {lang === 'es' ? 'Publicado' : 'Published'}
                            </span>
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
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                          {lang === 'es' ? 'Conversiones' : 'Conversions'}
                        </span>
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
                lang={lang}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
