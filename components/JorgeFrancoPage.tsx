import React from 'react';
import { 
  ArrowLeft, MessageSquare, Globe, Github, Download, Sparkles, Terminal, 
  Code, Database, Server, Cpu, Award, Zap, Heart, BookmarkCheck, Copy, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const JorgeFrancoPage: React.FC = () => {
  const navigate = useNavigate();

  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [copiedUser, setCopiedUser] = React.useState(false);
  const [copiedPass, setCopiedPass] = React.useState(false);

  const handleCopy = (text: string, type: 'url' | 'user' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else if (type === 'user') {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else if (type === 'pass') {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };
  
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

  // System statistics of his development achievements
  const achievements = [
    { count: '100%', label: 'Desplegado en Cloud Run', icon: <Server className="w-6 h-6 text-emerald-500" /> },
    { count: '100%', label: 'Integrado con Gemini A.I', icon: <Cpu className="w-6 h-6 text-[#FFBF00]" /> },
    { count: '100%', label: 'Integración con Cloud SQL', icon: <Zap className="w-6 h-6 text-yellow-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#FF5A1F]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[#FFBF00]/5 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-[#FF5A1F]/5 rounded-full blur-[200px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-center items-center max-w-7xl">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-9 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#FF5A1F]/20 px-1">AM</div>
            <span className="text-xl font-bold tracking-tight text-white">Aprende.<span className="text-gray-400 font-normal">Marketing</span></span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 flex-1">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Hero Portfolio Profile */}
          <section className="grid md:grid-cols-12 gap-12 items-center mb-24 relative z-10">
            {/* Profile Pic / Card Column */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-[340px]">
                {/* Glowing borders */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FF5A1F] to-[#FFBF00] rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-700"></div>
                
                {/* Main Card */}
                <div className="relative bg-[#111] border border-white/10 rounded-3xl p-4 text-center space-y-5">
                  {/* Photo Container */}
                  <div className="w-full aspect-square mx-auto rounded-2xl overflow-hidden border-2 border-[#FF5A1F]/30 bg-gradient-to-tr from-[#151515] to-[#252525] flex items-center justify-center relative shadow-inner">
                    <img 
                      src="https://github.com/user-attachments/assets/223b5bc4-1459-4e54-9cbd-e8216ae1fd6f" 
                      alt="Jorge Franco" 
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-3 left-0 right-0">
                      <span className="px-3 py-1 bg-[#FF5A1F] text-[10px] font-black uppercase text-white rounded-md tracking-wider">
                        Full Stack Dev
                      </span>
                    </div>
                  </div>

                  {/* Header / Brand Title */}
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase">Jorge Franco</h2>
                    <p className="text-sm font-semibold text-[#FFBF00] uppercase tracking-wider">Creador de Aprende<span className="text-[#FF5A1F]">.Marketing</span></p>
                  </div>

                  <p className="text-white text-sm md:text-base leading-relaxed font-semibold px-2">
                    Ingeniero de Sistemas y Desarrollador Full-Stack especializado en el diseño de arquitecturas de alto rendimiento. Integro Inteligencia Artificial y procesos asíncronos para crear ecosistemas de marketing escalables y orientados a la conversión.
                  </p>

                  {/* Badges / Location */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/5">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded-md text-xs md:text-sm font-bold text-white">
                      <Globe className="w-4 h-4 text-[#FF5A1F]" /> Málaga, España
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs md:text-sm font-bold text-emerald-400 animate-pulse">
                      ● Disponible para CTOs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description / Introduction Column */}
            <div className="md:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFBF00]/10 border border-[#FFBF00]/30 rounded-full text-xs font-black text-[#FFBF00] uppercase tracking-widest">
                  ★ EL CONSTRUCTOR DETRÁS DEL SISTEMA ★
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none uppercase">
                  Desglose de tecnologías y <span className="text-[#FF5A1F]">capacidades técnicas</span>
                </h1>
                <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                  Mi nombre es Jorge Franco y he liderado el desarrollo completo de la plataforma de <span className="text-[#FF5A1F]">Aprende.Marketing</span>, llevando la ingeniería de software a un nivel donde la velocidad de ejecución y la psicología de ventas automatizada con Inteligencia Artificial se fusionan perfectamente.
                </p>
              </div>

              {/* Direct Link Action Cards (Moved Above achievements grid) */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('video-presentacion');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#FF5A1F]/20 via-[#FFBF00]/10 to-[#FF5A1F]/15 border border-[#FF5A1F]/40 hover:border-[#FF5A1F]/70 text-[#FFBF00] rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FF5A1F]/5 group"
                  >
                    <Zap className="w-4 h-4 text-[#FF5A1F] animate-pulse" />
                    <span>Ver Presentación</span>
                  </button>

                  <a 
                    href="https://github.com/ingenierojorgefranco/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-white/10"
                  >
                    <Github className="w-4 h-4 text-white" /> GitHub
                  </a>

                  <a 
                    href="https://drive.google.com/file/d/1fhe4nGHvkm3iZ4Pyb-GfoneN5t2g7hLI/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-4 bg-[#FFBF00]/10 border border-[#FFBF00]/30 hover:border-[#FFBF00]/20 text-[#FFBF00] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-[#FFBF00]/20"
                  >
                    <Download className="w-4 h-4" /> Curriculum (CV)
                  </a>

                  <a 
                    href="https://calendly.com/jorgefranpuntoco/seminariosonline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5A1F]/15"
                  >
                    <MessageSquare className="w-4 h-4 text-white" /> Agendar Llamada
                  </a>
                </div>
              </div>

              {/* Achievements Grid (Moved Below, updated styling for 3 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-4 text-center hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                      {ach.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-white leading-none mb-1">{ach.count}</div>
                    <div className="text-xs md:text-sm font-black uppercase text-white tracking-wider leading-tight">{ach.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CV & Interactive Stack Knowledge Section */}
          <section id="curriculum" className="space-y-12 mb-24 text-left">
            {/* Skills & Cards container (Full Width) */}
            <div className="space-y-8 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative w-full">
              <div className="space-y-2">
                <p className="text-xs font-black text-[#FFBF00] uppercase tracking-widest">HABILIDADES CORE</p>
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
                    href="https://drive.google.com/file/d/1fhe4nGHvkm3iZ4Pyb-GfoneN5t2g7hLI/view?usp=sharing" 
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

          {/* Interactive YouTube Video Section */}
          <section id="video-presentacion" className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-24 relative overflow-hidden text-left shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-[#FFBF00]"></div>
            
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div className="space-y-4 text-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs md:text-sm font-black text-[#FF5A1F] uppercase tracking-widest mx-auto">
                  <Terminal className="w-4 h-4" /> Presentación en Video
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                  Descubre sobre <span className="text-[#FF5A1F]">Aprende.Marketing</span>
                </h2>
                <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                  Aprende.Marketing elimina la brecha de ejecución en el marketing de productos digitales al automatizar todo el proceso de ventas, creando un embudo de conversión profesional para generar resultados escalables y automatizados.
                </p>
              </div>

              {/* Centered Video Mockup Preview */}
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#0B0B0B] group shadow-2xl max-w-3xl mx-auto w-full flex flex-col items-center justify-center cursor-pointer select-none">
                {/* Tech grid/glow effects */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-color-dodge transition-all duration-700 group-hover:scale-105 group-hover:opacity-45" 
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(255,90,31,0.15)_0%,transparent_60%)] pointer-events-none group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider text-white rounded-lg flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 bg-[#FF5A1F] rounded-full animate-pulse" /> Caso de Estudio 
                  </span>
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-400 rounded-lg flex items-center gap-1 shadow-lg">
                    <Zap className="w-3 h-3 text-[#FFBF00] animate-pulse" /> 4K UHD
                  </span>
                </div>
                
                <div className="absolute top-4 right-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <span className="px-2.5 py-1 bg-[#FFBF00]/15 border border-[#FFBF00]/30 text-[10px] font-black uppercase tracking-wider text-[#FFBF00] rounded-lg shadow-lg">
                    5:42 Minutos
                  </span>
                </div>

                {/* Center Play Button with rich glowing effects */}
                <div className="relative z-10 flex flex-col items-center gap-4 transition-all duration-500 group-hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-tr from-[#FF5A1F] to-[#FFBF00] rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:shadow-[#FF5A1F]/40 group-hover:shadow-[0_0_40px_rgba(255,90,31,0.6)] relative">
                    <svg className="w-8 h-8 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-white font-extrabold text-lg uppercase tracking-wider group-hover:text-[#FFBF00] transition-colors">Iniciar Caso de Estudio</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Por Jorge Franco · Creador y Desarrollador</p>
                  </div>
                </div>

                {/* Bottom Control Bar Simulation for high-fidelity feel */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3 w-full max-w-md">
                    <span className="text-[10px] font-mono text-gray-400">0:00</span>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-1/4 h-full bg-gradient-to-r from-[#FF5A1F] to-[#FFBF00] rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">5:42</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Listo para reproducir</span>
                  </div>
                </div>
              </div>

              {/* Demo Credentials Box */}
              <div className="bg-[#0B0B0B] border border-[#FF5A1F]/30 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden max-w-xl mx-auto">
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#FFBF00] text-black font-black text-[9px] uppercase rounded-bl-xl tracking-wider">
                  Acceso Demo para Pruebas
                </div>
                <h4 className="text-white font-extrabold text-sm uppercase tracking-wider text-[#FF5A1F] border-b border-white/5 pb-2">Cuenta Demo para Pruebas</h4>
                
                <div className="space-y-3 pt-1">
                  {/* URL */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="block text-gray-400 font-extrabold uppercase text-[10px] tracking-wider mb-0.5">URL</span>
                      <a href="https://aprende.marketing/login" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFBF00] underline font-bold break-all transition-colors text-sm block">
                        https://aprende.marketing/login
                      </a>
                    </div>
                    <button 
                      onClick={() => handleCopy('https://aprende.marketing/login', 'url')}
                      className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-bold text-gray-200 hover:text-white transition-all active:scale-95"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      {copiedUrl ? 'Copiado!' : 'Copiar URL'}
                    </button>
                  </div>
                  
                  {/* Usuario */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="block text-gray-400 font-extrabold uppercase text-[10px] tracking-wider mb-0.5">Usuario</span>
                      <span className="text-white font-mono break-all font-bold text-sm block">demo@aprende.marketing</span>
                    </div>
                    <button 
                      onClick={() => handleCopy('demo@aprende.marketing', 'user')}
                      className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-bold text-gray-200 hover:text-white transition-all active:scale-95"
                    >
                      {copiedUser ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      {copiedUser ? 'Copiado!' : 'Copiar Usuario'}
                    </button>
                  </div>

                  {/* Contraseña */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="block text-gray-400 font-extrabold uppercase text-[10px] tracking-wider mb-0.5">Contraseña</span>
                      <span className="text-white font-mono break-all font-bold text-sm block">Aprende2026!*</span>
                    </div>
                    <button 
                      onClick={() => handleCopy('Aprende2026!*', 'pass')}
                      className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-bold text-gray-200 hover:text-white transition-all active:scale-95"
                    >
                      {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      {copiedPass ? 'Copiado!' : 'Copiar Contraseña'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Especificaciones de Sistema / Arquitectura Box */}
              <div className="bg-[#0B0B0B] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <h4 className="text-sm font-black text-[#FFBF00] uppercase tracking-widest border-b border-white/5 pb-2 text-center">Especificaciones de Sistema / Arquitectura</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-4 hover:border-white/10 transition-colors">
                    <BookmarkCheck className="w-6 h-6 text-[#FF5A1F] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-extrabold text-xs uppercase tracking-wider mb-1">Frontend</span>
                      <span className="text-gray-300 text-base md:text-lg font-normal leading-relaxed">React 19.2 + Vite 7 (Atomic Design & TypeScript)</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-4 hover:border-white/10 transition-colors">
                    <BookmarkCheck className="w-6 h-6 text-[#FF5A1F] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-extrabold text-xs uppercase tracking-wider mb-1">Backend</span>
                      <span className="text-gray-300 text-base md:text-lg font-normal leading-relaxed">Node.js 20 + Express (Modular REST API)</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-4 hover:border-white/10 transition-colors">
                    <BookmarkCheck className="w-6 h-6 text-[#FF5A1F] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-extrabold text-xs uppercase tracking-wider mb-1">AI Engine</span>
                      <span className="text-gray-300 text-base md:text-lg font-normal leading-relaxed">Gemini 1.5 Flash (Fragmented 6-Stage Pipeline)</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-4 hover:border-white/10 transition-colors">
                    <BookmarkCheck className="w-6 h-6 text-[#FFBF00] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-white font-extrabold text-xs uppercase tracking-wider mb-1">Cloud</span>
                      <span className="text-gray-300 text-base md:text-lg font-normal leading-relaxed">Docker + Google Cloud Run (CI/CD Pipelines)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Métricas de Impacto / Snapshot Fase Beta */}
          <section className="mb-24 text-left relative">
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-[#FFBF00]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="space-y-8 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative w-full overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFBF00] to-[#FF5A1F]"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Estado del Proyecto
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                    Métricas de Impacto <span className="text-[#FFBF00]">(Fase Beta)</span>
                  </h3>
                </div>
                <p className="text-white/90 font-normal leading-loose text-base md:text-lg max-w-md">
                  Benchmarks internos y métricas de rendimiento reales obtenidas durante las pruebas con usuarios activos en producción.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-[#FF5A1F]/20 transition-all group">
                  <div className="text-4xl font-black text-[#FF5A1F] mb-1 group-hover:scale-105 transition-transform">20+</div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-2">Embudos Generados</div>
                  <p className="text-white/90 font-normal leading-loose text-base md:text-lg">Sistemas de ventas completos creados desde una sola idea inicial en menos de 2 minutos.</p>
                </div>
                
                <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-[#FFBF00]/20 transition-all group">
                  <div className="text-4xl font-black text-[#FFBF00] mb-1 group-hover:scale-105 transition-transform">~1.5 Min</div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-2">Tiempo de Procesamiento</div>
                  <p className="text-white/90 font-normal leading-loose text-base md:text-lg">Pipeline asíncrono optimizado de 6 etapas que integra y formatea todos los activos de venta.</p>
                </div>

                <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-[#FF5A1F]/20 transition-all group">
                  <div className="text-4xl font-black text-white mb-1 group-hover:scale-105 transition-transform">15+</div>
                  <div className="text-xs font-black text-[#FF5A1F] uppercase tracking-wider mb-2">Usuarios Beta Activos</div>
                  <p className="text-white/90 font-normal leading-loose text-base md:text-lg">Emprendedores y afiliados validando embudos reales diariamente en la plataforma.</p>
                </div>

                <div className="bg-[#0B0B0B] border border-white/5 rounded-2xl p-6 relative hover:border-emerald-500/20 transition-all group">
                  <div className="text-4xl font-black text-emerald-400 mb-1 group-hover:scale-105 transition-transform">+15%</div>
                  <div className="text-xs font-black text-white uppercase tracking-wider mb-2">Mejora de Conversión</div>
                  <p className="text-white/90 font-normal leading-loose text-base md:text-lg">Porcentaje de conversión incrementado frente a embudos tradicionales no optimizados.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Desafíos Técnicos y Decisiones de Arquitectura */}
          <section className="mb-24 text-left relative">
            <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-[#FF5A1F]/5 rounded-full blur-[150px] pointer-events-none"></div>
            
            <div className="space-y-12">
              {/* Header */}
              <div className="space-y-4 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFBF00]/10 border border-[#FFBF00]/30 rounded-full text-xs font-black text-[#FFBF00] uppercase tracking-widest animate-pulse">
                  <Code className="w-3.5 h-3.5" /> FOCO EN INGENIERÍA SÓLIDA
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none text-balance">
                  Desafíos Técnicos y <span className="text-[#FF5A1F]">Soluciones de Arquitectura</span>
                </h2>
                <p className="text-gray-300 font-normal leading-relaxed text-base md:text-lg">
                  Decisiones de diseño e implementaciones reales para resolver problemas complejos de rendimiento, escalabilidad y resiliencia en <span className="text-[#FF5A1F]">Aprende.Marketing</span>.
                </p>
              </div>

              {/* Engineering Accordion/Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Highlight 1: Multi-Tenancy */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FF5A1F]/30 hover:shadow-[0_0_30px_rgba(255,100,50,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        Multi-Tenancy Middleware
                      </span>
                      <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">&lt; 180ms Latency</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      1. Multi-Tenencia de Alto Rendimiento sin Sobrecarga
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          Servir proyectos únicos de múltiples usuarios a través de sus propios dominios personalizados (CNAME) sin añadir sobrecarga en cache de estado global, latencia de sesión o retrasos de base de datos.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF00] font-extrabold uppercase tracking-wider text-sm block mb-1">Solución Aplicada:</strong>
                          Diseñé e implementé un middleware de detección de host personalizado en <span className="text-gray-400 font-mono">pageRoutes.js</span>. Intercepta el hostname de la solicitud entrante, realiza un <span className="text-gray-400 font-mono">LEFT JOIN</span> altamente optimizado en las tablas <span className="text-gray-400 font-mono">landing_pages</span> y <span className="text-gray-400 font-mono">projects</span>, resolviendo y sirviendo el contenido del tenant en menos de 180ms sin comprometer el aislamiento ni requerir balanceadores de carga complejos.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highlight 2: Exponential Backoff Retry Pipeline */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FFBF00]/30 hover:shadow-[0_0_30px_rgba(255,191,0,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        Network Resilience
                      </span>
                      <span className="text-amber-400 text-xs font-black uppercase tracking-wider">6-Stage Retry System</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      2. Resiliencia de APIs de IA con el Pipeline <span className="text-amber-500">withRetries</span>
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          Controlar errores de red, respuestas fallidas de tasa de límite (503/504) e interrupciones del SDK de Gemini durante secuencias pesadas de generación de contenido continuo.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF00] font-extrabold uppercase tracking-wider text-sm block mb-1">Solución Aplicada:</strong>
                          Creé un algoritmo de reintento recursivo con Retroceso Exponencial y Jitter (desviación aleatoria) para todas las llamadas críticas al SDK del modelo. Esto garantiza que las generaciones profundas divididas en 6 fases asínconas consecutivas finalicen de forma robusta e imperceptible para el usuario, recuperándose de caídas de red transitorias automáticamente.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highlight 3: Reactive Rendering Engine */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FF5A1F]/30 hover:shadow-[0_0_30px_rgba(255,100,50,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        Reactive UI Rendering
                      </span>
                      <span className="text-[#FFBF00] text-xs font-black uppercase tracking-wider">Lag-Free UX</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      3. Motor de Renderizado Ultrarrápido (<span className="text-gray-400 font-mono">LivePage.tsx</span>)
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          Las tasas excesivas de actualización de la UI en editores interactivos en tiempo real provocaban bloqueos de renderizado al manipular estructuras complejas de CSS y JSON de páginas de aterrizaje completas.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF00] font-extrabold uppercase tracking-wider text-sm block mb-1">Solución Aplicada:</strong>
                          Desarrollé un motor de render reactive optimizado basado en plantillas dinámicas que desacopla por completo el árbol de edición del lienzo de visualización del iframe. Esto reduce los costes de cómputo en el navegador a O(1) para actualizaciones instantáneas, ofreciendo una experiencia interactiva sin lag al arrastrar, modificar textos o cambiar llamadas a la acción.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highlight 4: Payment Synchronization */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FFBF00]/30 hover:shadow-[0_0_30px_rgba(255,191,0,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        Payment Sync API
                      </span>
                      <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">Sub-Second Provisioning</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      4. Orquestación de Pagos Multi-Plataforma (Stripe & Hotmart)
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          Sincronizar planes de suscripción, asignación de créditos de IA persistentes e inicios de sesión a través de plataformas con estructuras de datos de webhooks radicalmente incompatibles.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF00] font-extrabold uppercase tracking-wider text-sm block mb-1">Solución Aplicada:</strong>
                          Diseñé una Capa de Orquestación y Normalización de Pasarelas de Pago que recibe eventos de Stripe (JSON crudo y firmas HMAC) y Hotmart (eventos cifrados). Convierte de forma asíncrona todos los payloads entrantes en un stream interno estandarizado que actualiza de inmediato las cuotas de uso de los usuarios y activa accesos de seguridad a nivel atómico en tiempo de ejecución.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highlight 5: Automated Handover & CRM */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FF5A1F]/30 hover:shadow-[0_0_30px_rgba(255,100,50,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        Tag-Triggered Architecture
                      </span>
                      <span className="text-blue-400 text-xs font-black uppercase tracking-wider">Real-Time Lead Sync</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      5. Sincronización SaaS-to-CRM e Ingestión en Tiempo Real
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          La sincronización retrasada de leads capturados en páginas generadas por el SaaS hacia flujos de automatización externos (como Systeme.io) generaba una brecha de conversión de hasta varios minutos.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF00] font-extrabold uppercase tracking-wider text-sm block mb-1">Solución Aplicada:</strong>
                          Programé un despachador de eventos integrado que consume directamente leads desde las páginas del cliente. El sistema encapsula los datos y realiza una inserción asíncrona mediante la API de Systeme.io aplicando una arquitectura basada en etiquetas ("Tag-Triggered"). Esto arranca las campañas automáticas de emails al instante exacto de la suscripción, maximizando las tasas de apertura.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highlight 6: Internal Lead Management CRM */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FFBF00]/30 hover:shadow-[0_0_30px_rgba(255,191,0,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        Custom CRM System
                      </span>
                      <span className="text-emerald-400 text-xs font-black uppercase tracking-wider">Single Source of Truth</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      6. CRM de Análisis Interno Integrado en el Panel
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          Los usuarios finales carecían de una forma integrada para verificar el origen, comportamiento histórico y estado de conversión de sus prospectos sin recurrir a software de terceros caro y complejo.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF00] font-extrabold uppercase tracking-wider text-sm block mb-1">Solución Aplicada:</strong>
                          Diseñé un módulo nativo de CRM dentro de la aplicación. Captura de forma segura a través de API webhooks cada registro desde los hooks de las páginas de captura, normaliza los datos con marcas de tiempo precisas y los centraliza en una base de datos relacional para proyectar gráficos en tiempo real sobre el rendimiento del embudo.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highlight 7: Internal LMS Gated */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FF5A1F]/30 hover:shadow-[0_0_30px_rgba(255,100,50,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        LMS Auth Gate
                      </span>
                      <span className="text-purple-400 text-xs font-black uppercase tracking-wider">Low-Churn Onboarding</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      7. Plataforma Educativa Propietaria (LMS) Integrada
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          Pérdida de usuarios activos mensuales debido al síndrome de la "pantalla vacía" y la falta de educación sobre cómo estructurar campañas utilizando la plataforma.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF05]">Solución Aplicada:</strong> El Sistema de Gestión de Aprendizaje (LMS) seguro y privado directamente integrado con el núcleo de autenticación del SaaS protege flujos de streaming de capacitación avanzada e implementa módulos de progreso escalonados según las capacidades contratadas, disminuyendo significativamente la tasa de abandono de nuevos usuarios.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Highlight 8: Inheritance Cloning System */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-[#FFBF00]/30 hover:shadow-[0_0_30px_rgba(255,191,0,0.04)] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400 rounded-md">
                        Data Structure Cloning
                      </span>
                      <span className="text-[#FFBF00] text-xs font-black uppercase tracking-wider">&lt; 50ms Real Execution</span>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FFBF00] transition-colors">
                      8. Herencia de Estrategias Maestras y Clonado de Proyectos
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-white font-extrabold uppercase tracking-wider text-sm block mb-1">El Problema:</strong>
                          Copiar o replicar de forma manual arquitecturas y estrategias ganadoras de un proyecto de marketing a otro requería múltiples peticiones e inserciones anidadas lentas y propensas a errores de formato.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                          <strong className="text-[#FFBF00] font-extrabold uppercase tracking-wider text-sm block mb-1">Solución Aplicada:</strong>
                          Implementé un motor de clonación atómica que hereda de una cuenta clave "Plan Root" todas las relaciones de tablas completas (layouts, avatares, copys, etc.) en un único disparo relacional. El sistema copia la estructura íntegra de forma asíncrona en menos de 50ms, facilitando flujos rápidos de testeo masivo.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Roadmap 2026 */}
          <section className="mb-24 text-left relative">
            <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-[#FF5A1F]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="space-y-8 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative w-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-[#FFBF00]"></div>
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFBF00]/10 border border-[#FFBF00]/30 rounded-full text-xs font-black text-[#FFBF00] uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" /> HOJA DE RUTA FUTURA
                </span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                  Roadmap Estratégico 2026
                </h3>
                <p className="text-white/90 font-normal leading-loose text-base md:text-lg max-w-2xl">
                  Próximos lanzamientos arquitectónicos diseñados para convertir a Aprende.Marketing en la suite líder de automatización con Inteligencia Artificial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-[#0B0B0B]/80 border border-white/5 rounded-2xl p-6 relative hover:border-[#FF5A1F]/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#FF5A1F] rounded-full animate-pulse"></span>
                      <span className="text-xs font-black text-white uppercase tracking-wider">Hito Q1-Q2</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-[#FFBF00] uppercase tracking-tight">Constructor Visual Dinámico</h4>
                    <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                      Lienzo de edición con drag-and-drop completo para reordenar bloques, layouts y hooks dinámicos en tiempo real con JSON persistente.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0B0B0B]/80 border border-white/5 rounded-2xl p-6 relative hover:border-[#FFBF00]/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                      <span className="text-xs font-black text-white uppercase tracking-wider">Hito Q3</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-[#FFBF00] uppercase tracking-tight">Motor de Pruebas A/B</h4>
                    <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                      Distribución dinámica y automática de tráfico aleatorio a múltiples variantes de copys y landings con tracking de KPIs de conversión nativos.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0B0B0B]/80 border border-white/5 rounded-2xl p-6 relative hover:border-[#FF5A1F]/20 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                      <span className="text-xs font-black text-white uppercase tracking-wider">Hito Q4</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-[#FFBF00] uppercase tracking-tight">Conversión por WhatsApp API</h4>
                    <p className="text-white/90 font-normal leading-loose text-base md:text-lg">
                      Integración de chatbot conversacional avanzado con la API de WhatsApp para seguimiento asíncrono y cualificación automática de leads calientes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Contact Section */}
          <section id="contacto" className="max-w-3xl mx-auto">
            <div className="bg-[#111] border border-[#FF5A1F]/20 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FF5A1F]"></div>
              
              <div className="space-y-6 text-center py-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-full text-xs font-black text-[#FF5A1F] uppercase tracking-widest">
                  ✉ Solicita una Reunión para más detalles
                </span>
                <p className="text-white font-semibold max-w-xl mx-auto leading-relaxed text-base md:text-lg">
                  ¿Buscas un desarrollador para integrarse a tu equipo, liderar una iniciativa técnica o simplemente quieres validar una idea brillante? Solicita tu reunión ahora.
                </p>
                <div className="pt-4">
                  <a 
                    href="https://calendly.com/jorgefranpuntoco/seminariosonline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/15 active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 text-white" /> Agendar Llamada
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0B0B] border-t border-white/5 py-12 relative z-10 text-xs font-light text-gray-500">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/30 rounded-lg flex items-center justify-center font-bold text-xs">AM</div>
            <span>&copy; {new Date().getFullYear()} Jorge Franco Portfolio. Hecho con <Heart className="inline-block w-3.5 h-3.5 text-red-500 mx-0.5" /> para el mundo.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/ingenierojorgefranco/" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1.5 font-bold"><Github className="w-4 h-4" /> GitHub</a>
            <span>•</span>
            <span className="font-bold text-gray-400 tracking-wide uppercase">Full Stack Developer</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
