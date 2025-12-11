import React from 'react';
import { 
  ArrowRight, LayoutDashboard, LogOut, Play, 
  Layout, MessageCircle, PenTool, Search, Briefcase, Mail, Users, BarChart, Link as LinkIcon,
  CheckCircle, Zap, Shield, Rocket, Bot, Server, Star, Target, Globe, Gift, ChevronRight, TrendingUp, X
} from 'lucide-react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface PublicHomeProps {
  user: User | null;
  onLogout?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-orange-500/20">A</div>
            <span className="text-2xl font-bold tracking-tight">Aprende.<span className="text-gray-400 font-normal">Marketing</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-base font-medium text-gray-400">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition hover:scale-105 transform">Herramientas</button>
            <button onClick={() => scrollToSection('process')} className="hover:text-white transition hover:scale-105 transform">Cómo Funciona</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition hover:scale-105 transform">Precios</button>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                 <span className="hidden md:block text-sm text-gray-400">Hola, <span className="text-white font-bold">{user.name}</span></span>
                   <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/10 font-bold hover:bg-white/20 transition text-sm flex items-center gap-2"
                   >
                     <LayoutDashboard className="w-4 h-4" /> Panel
                   </button>
                 {onLogout && (
                   <button onClick={onLogout} className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-white/5 transition" title="Cerrar Sesión">
                     <LogOut className="w-5 h-5" />
                   </button>
                 )}
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-2.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Acceso Usuarios
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 lg:pt-52 lg:pb-40 z-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 backdrop-blur-md text-sm text-gray-300 mb-8 animate-fade-in-up hover:border-orange-500/50 transition duration-300 cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            La plataforma #1 para Afiliados de Hotmart®
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-[1.1] max-w-6xl mx-auto">
            Vende tus Infoproductos<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 animate-gradient-x">
              En Piloto Automático
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            La plataforma "Todo en Uno" para Productores y Afiliados. Crea Embudos de Venta, VSLs y Páginas de Alta Conversión generadas por IA en segundos.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
            <button
              onClick={() => user ? navigate('/dashboard') : navigate('/register')}
              className="group relative px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-full text-xl font-bold transition flex items-center gap-3 shadow-[0_10px_40px_-10px_rgba(234,88,12,0.5)] text-white transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {user ? 'Ir a mi Panel' : 'Activa tu Cuenta Ahora'} <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
            </button>
            
            <a 
              href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-transparent hover:bg-white/5 border border-gray-600 hover:border-green-500 hover:text-green-400 rounded-full text-xl font-bold transition flex items-center gap-3 text-gray-300 group"
            >
              <Users className="w-6 h-6 group-hover:text-green-500 transition-colors" /> Únete a la Comunidad Privada
            </a>
          </div>

          {/* Browser Mockup Video */}
          <div className="relative max-w-5xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              {/* Browser Window Frame */}
              <div className="relative bg-[#0F0F0F] rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                  <div className="h-12 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4 gap-2">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="flex-1 flex justify-center">
                          <div className="bg-black/50 px-4 py-1.5 rounded-lg text-xs text-gray-500 flex items-center gap-2 border border-white/5 font-mono">
                              <Shield className="w-3 h-3" /> aprende.marketing/dashboard
                          </div>
                      </div>
                  </div>
                  
                  {/* Video Content Placeholder */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden flex items-center justify-center group cursor-pointer">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition duration-700 transform group-hover:scale-105"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent"></div>
                      
                      <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition duration-300 z-10 group-hover:bg-white/20">
                          <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </div>
                      <p className="absolute bottom-8 text-gray-300 text-lg font-medium drop-shadow-md">Ver demo en acción (59s)</p>
                  </div>
              </div>
          </div>

        </div>
      </header>

      {/* Sequence Section - La Ruta del Exito */}
      <section id="process" className="py-24 bg-[#050505] border-y border-white/5 relative">
          <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">La Ruta del Éxito</h2>
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                      Deja de improvisar. Sigue un sistema probado paso a paso.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  {/* Connector Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-gray-800 via-orange-900/50 to-gray-800 z-0"></div>

                  {[
                      { icon: Target, title: "1. Proyecto", desc: "La IA define tu nicho y estrategia ganadora.", color: "text-blue-400" },
                      { icon: Layout, title: "2. Construcción", desc: "Genera tu Landing Page y VSL en 1 click.", color: "text-purple-400" },
                      { icon: Rocket, title: "3. Tráfico", desc: "Crea artículos SEO y anuncios virales.", color: "text-orange-400" },
                      { icon: Zap, title: "4. Ventas", desc: "Cierra y automatiza con el CRM de WhatsApp.", color: "text-green-400" },
                  ].map((step, i) => (
                      <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                          <div className={`w-24 h-24 bg-[#0a0a0a] border border-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:-translate-y-2 transition duration-300 group-hover:border-gray-600`}>
                              <step.icon className={`w-10 h-10 ${step.color}`} />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                          <p className="text-gray-400 leading-relaxed px-4">{step.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Benefits Zig-Zag Section */}
      <section className="py-32 container mx-auto px-6 overflow-hidden">
          <div className="space-y-32">
              
              {/* Benefit 1: Velocidad */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 text-sm font-bold mb-6 border border-blue-500/20">
                          <Zap className="w-4 h-4" /> VELOCIDAD EXTREMA
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                          Lanza campañas en <br/><span className="text-blue-500">15 Minutos</span>, no días.
                      </h2>
                      <p className="text-xl text-gray-400 leading-relaxed mb-8">
                          Olvídate de contratar programadores o pelearte con WordPress. Nuestra IA construye toda la estructura de ventas por ti instantáneamente.
                      </p>
                      <ul className="space-y-4">
                          {["Hosting de alta velocidad incluido", "Plantillas probadas de alta conversión", "Optimizado para móviles automáticamente"].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-lg text-gray-300">
                                  <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="order-1 lg:order-2 relative">
                      <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
                      <div className="relative bg-[#0F0F0F] border border-gray-800 rounded-2xl p-2 shadow-2xl transform rotate-1 hover:rotate-0 transition duration-500">
                          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-[4/3] relative group">
                               {/* Abstract UI representation of speed */}
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                                   <div className="inline-block p-4 bg-black/80 backdrop-blur rounded-2xl border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                      <div className="text-5xl font-mono font-bold text-white mb-1">98/100</div>
                                      <div className="text-xs text-blue-400 uppercase tracking-widest">Google PageSpeed</div>
                                   </div>
                               </div>
                               {/* Progress bars */}
                               <div className="absolute bottom-10 left-10 right-10 space-y-3 opacity-50">
                                   <div className="h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full w-[90%] bg-blue-500 rounded-full"></div></div>
                                   <div className="h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-blue-500 rounded-full"></div></div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Benefit 2: Copywriting */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="relative">
                      <div className="absolute inset-0 bg-purple-600/20 blur-[100px] rounded-full"></div>
                      <div className="relative bg-[#0F0F0F] border border-gray-800 rounded-2xl p-2 shadow-2xl transform -rotate-1 hover:rotate-0 transition duration-500">
                          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8">
                               <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
                                   <div className="flex gap-3">
                                       <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center"><Bot className="w-6 h-6 text-white"/></div>
                                       <div className="flex-1 bg-gray-700/50 p-3 rounded-r-xl rounded-bl-xl text-sm text-gray-300">
                                           Generando copy persuasivo para nicho "Yoga Facial"...
                                       </div>
                                   </div>
                                   <div className="flex gap-3">
                                       <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center"><Bot className="w-6 h-6 text-white"/></div>
                                       <div className="flex-1 bg-gray-700/50 p-3 rounded-r-xl rounded-bl-xl text-sm text-white font-medium border-l-2 border-purple-500">
                                           "Descubre el secreto japonés para rejuvenecer 10 años sin cirugías..."
                                       </div>
                                   </div>
                               </div>
                          </div>
                      </div>
                  </div>
                  <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/20 text-purple-400 text-sm font-bold mb-6 border border-purple-500/20">
                          <PenTool className="w-4 h-4" /> COPYWRITING IA
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                          Textos que tocan la <br/><span className="text-purple-500">fibra emocional</span>.
                      </h2>
                      <p className="text-xl text-gray-400 leading-relaxed mb-8">
                          No necesitas ser un experto escritor. Nuestra IA analiza los dolores profundos de tu avatar y escribe guiones que convierten visitas en compradores.
                      </p>
                      <ul className="space-y-4">
                          {["Guiones para VSL y Webinars", "Anuncios para Facebook/TikTok Ads", "Secuencias de Email Marketing"].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-lg text-gray-300">
                                  <CheckCircle className="w-6 h-6 text-purple-500 flex-shrink-0" /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Benefit 3: Automatización CRM */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 text-green-400 text-sm font-bold mb-6 border border-green-500/20">
                          <MessageCircle className="w-4 h-4" /> AUTOMATIZACIÓN TOTAL
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                          Tu máquina de ventas <br/><span className="text-green-500">funciona 24/7</span>.
                      </h2>
                      <p className="text-xl text-gray-400 leading-relaxed mb-8">
                          Centraliza todos tus leads. Usa nuestro CRM integrado para gestionar contactos y deja que el Bot de IA cierre ventas por ti mientras duermes.
                      </p>
                      <ul className="space-y-4">
                          {["Respuestas automáticas inteligentes", "Seguimiento de leads calientes", "Integración directa con WhatsApp"].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-lg text-gray-300">
                                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="order-1 lg:order-2 relative">
                      <div className="absolute inset-0 bg-green-600/20 blur-[100px] rounded-full"></div>
                      <div className="relative bg-[#0F0F0F] border border-gray-800 rounded-2xl p-2 shadow-2xl transform rotate-1 hover:rotate-0 transition duration-500">
                          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-[4/3] flex flex-col p-6">
                               {/* Mock CRM UI */}
                               <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                                   <div className="font-bold text-white">Pipeline de Ventas</div>
                                   <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-bold">+ $1,240 hoy</div>
                               </div>
                               <div className="space-y-3">
                                   <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500 flex justify-between items-center">
                                       <div>
                                           <div className="text-sm font-bold text-white">María González</div>
                                           <div className="text-xs text-gray-400">Interesada en Curso Uñas</div>
                                       </div>
                                       <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">VENDIDO</div>
                                   </div>
                                   <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500 flex justify-between items-center">
                                       <div>
                                           <div className="text-sm font-bold text-white">Carlos Pérez</div>
                                           <div className="text-xs text-gray-400">Preguntando precio...</div>
                                       </div>
                                       <div className="text-xs text-gray-500 flex items-center gap-1"><Bot className="w-3 h-3"/> IA Respondiendo</div>
                                   </div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </section>

      {/* Bonus Section - Course */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black border-y border-yellow-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-6 relative z-10">
              <div className="bg-[#111] border border-yellow-500/50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
                  <div className="w-full md:w-1/3 relative group">
                      <div className="absolute -inset-2 bg-yellow-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                      <div className="relative aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl flex items-center justify-center">
                          {/* Simulated Book Cover */}
                          <div className="text-center p-6">
                              <div className="text-yellow-500 font-black text-4xl mb-2 tracking-tighter">MAESTRÍA</div>
                              <div className="text-white font-bold text-xl tracking-widest mb-8">EN VENTAS DIGITALES</div>
                              <div className="w-16 h-1 bg-yellow-500 mx-auto mb-8"></div>
                              <div className="text-gray-400 text-xs">EDICIÓN EXCLUSIVA</div>
                          </div>
                      </div>
                  </div>
                  <div className="w-full md:w-2/3">
                      <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full font-bold text-sm mb-6 border border-yellow-500/20">
                          <Gift className="w-4 h-4" /> BONUS EXCLUSIVO
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                          No solo te damos la herramienta,<br/> <span className="text-yellow-500">te enseñamos a usarla.</span>
                      </h2>
                      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                          Al activar tu plan <strong>Pro</strong>, desbloqueas acceso inmediato y GRATUITO a mi curso premium <em>"Maestría en Ventas Digitales"</em>. Aprenderás las estrategias exactas que uso para escalar productos en Hotmart.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-xl border border-gray-700">
                              <CheckCircle className="w-5 h-5 text-yellow-500" /> <span>Estrategias de Tráfico</span>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-xl border border-gray-700">
                              <CheckCircle className="w-5 h-5 text-yellow-500" /> <span>Cierre de Ventas</span>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-xl border border-gray-700">
                              <CheckCircle className="w-5 h-5 text-yellow-500" /> <span>Mentalidad</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Arsenal Grid */}
      <section id="features" className="py-24 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">El Arsenal del Afiliado Moderno</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">9 Herramientas poderosas integradas en un solo lugar.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Layout, title: "Constructor Landing Pages", desc: "Plantillas probadas (VSL, Webinars, Crash) editables en segundos." },
            { icon: PenTool, title: "Redactor Copywriting IA", desc: "Guiones persuasivos para anuncios y páginas que tocan los dolores reales." },
            { icon: MessageCircle, title: "CRM de WhatsApp", desc: "Gestión de leads y cierre de ventas manual o con bots automatizados." },
            { icon: Search, title: "Generador Artículos SEO", desc: "Atrae tráfico orgánico gratuito con contenido optimizado para Google." },
            { icon: Briefcase, title: "Estrategia de Proyectos", desc: "La IA define tu avatar, dolores y transformación por ti." },
            { icon: Mail, title: "Email Marketing Lite", desc: "Captura leads y sincroniza con tu autorespondedor favorito." },
            { icon: Users, title: "Prueba Social Real/Falsa", desc: "Widgets personalizables para mostrar 'Alumnos registrados' en tiempo real." },
            { icon: BarChart, title: "Analíticas de Conversión", desc: "Mide visitas vs. ventas sin complicaciones técnicas." },
            { icon: LinkIcon, title: "Link en Bio / Bio Page", desc: "Tu propio árbol de enlaces optimizado para Instagram y TikTok." }
          ].map((item, idx) => (
            <div key={idx} className="group bg-[#0a0a0a] p-8 rounded-3xl border border-gray-800 hover:border-orange-500/50 transition duration-300 hover:bg-gray-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
              
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300 border border-gray-700 group-hover:border-orange-500 text-gray-300 group-hover:text-orange-400 shadow-lg">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Elige tu Plan de Batalla</h2>
                  <p className="text-xl text-gray-400">Comienza gratis o escala con herramientas profesionales.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Starter Plan */}
                  <div className="bg-[#0f0f0f] border border-gray-800 rounded-3xl p-8 md:p-12 flex flex-col hover:border-gray-600 transition duration-300">
                      <div className="mb-8">
                          <h3 className="text-2xl font-bold text-white mb-2">Plan Starter</h3>
                          <div className="flex items-baseline gap-1 mb-4">
                              <span className="text-5xl font-extrabold text-white">$0</span>
                              <span className="text-xl text-gray-500">/mes</span>
                          </div>
                          <p className="text-gray-400">Ideal para empezar sin riesgo.</p>
                      </div>
                      <ul className="space-y-5 mb-10 flex-1">
                          <li className="flex items-center gap-3 text-gray-300"><div className="bg-gray-800 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-white"/></div> 1 Proyecto / Nicho</li>
                          <li className="flex items-center gap-3 text-gray-300"><div className="bg-gray-800 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-white"/></div> 3 Landing Pages publicadas</li>
                          <li className="flex items-center gap-3 text-gray-300"><div className="bg-gray-800 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-white"/></div> IA Básica (Textos cortos)</li>
                          <li className="flex items-center gap-3 text-gray-500 line-through decoration-gray-600"><div className="bg-gray-900 p-1 rounded-full"><X className="w-4 h-4"/></div> Sin Bot de WhatsApp</li>
                          <li className="flex items-center gap-3 text-gray-500 line-through decoration-gray-600"><div className="bg-gray-900 p-1 rounded-full"><X className="w-4 h-4"/></div> Sin Curso Premium</li>
                      </ul>
                      <button 
                        onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                        className="w-full py-4 rounded-xl border border-gray-600 text-white font-bold hover:bg-white hover:text-black transition text-lg"
                      >
                          Comenzar Gratis
                      </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="relative bg-[#0f0f0f] border-2 border-orange-600 rounded-3xl p-8 md:p-12 flex flex-col shadow-2xl shadow-orange-900/20 transform md:-translate-y-6">
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-bold px-6 py-2 rounded-bl-xl rounded-tr-2xl shadow-lg">
                          RECOMENDADO
                      </div>
                      <div className="mb-8">
                          <h3 className="text-2xl font-bold text-orange-500 mb-2">Plan Pro</h3>
                          <div className="flex items-baseline gap-1 mb-4">
                              <span className="text-6xl font-extrabold text-white">$19.99</span>
                              <span className="text-xl text-gray-500">/mes</span>
                          </div>
                          <p className="text-gray-300">Para Productores y Afiliados que van en serio.</p>
                      </div>
                      <ul className="space-y-5 mb-10 flex-1">
                          <li className="flex items-center gap-3 text-white font-medium"><div className="bg-orange-900/50 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-orange-500"/></div> 5 Proyectos Activos</li>
                          <li className="flex items-center gap-3 text-white font-medium"><div className="bg-orange-900/50 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-orange-500"/></div> 20 Landing Pages</li>
                          <li className="flex items-center gap-3 text-white font-medium"><div className="bg-orange-900/50 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-orange-500"/></div> IA Avanzada (Artículos SEO + Estrategia)</li>
                          <li className="flex items-center gap-3 text-white font-medium"><div className="bg-orange-900/50 p-1 rounded-full"><CheckCircle className="w-4 h-4 text-orange-500"/></div> <strong>Bot de WhatsApp Incluido</strong></li>
                          <li className="flex items-center gap-3 text-yellow-400 font-bold"><div className="bg-yellow-900/30 p-1 rounded-full border border-yellow-600/50"><Gift className="w-4 h-4 text-yellow-500"/></div> GRATIS: Curso Maestría en Ventas</li>
                      </ul>
                      <button className="w-full py-5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:scale-[1.02] transition text-lg border-t border-white/20">
                          Obtener Plan Pro Ahora
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">A</div>
                <span className="text-2xl font-bold text-white tracking-tight">Aprende.Marketing</span>
             </div>
             <div className="flex gap-8 text-sm text-gray-400 font-medium">
                  <a href="#" className="hover:text-white transition">Términos de Servicio</a>
                  <a href="#" className="hover:text-white transition">Política de Privacidad</a>
                  <a href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1" className="hover:text-white transition">Soporte</a>
             </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Aprende.Marketing. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};