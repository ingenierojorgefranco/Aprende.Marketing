
import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, LayoutDashboard, LogOut, Play, 
  Layout, MessageCircle, PenTool, Search, Briefcase, Mail, Users, BarChart, Link as LinkIcon,
  CheckCircle, Zap, Shield, Rocket, Bot, Server, Star, Target, Globe, Gift, ChevronRight, TrendingUp, X, Smartphone, Cpu, Repeat
} from 'lucide-react';
import { User, Plan } from '../types';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface PublicHomeProps {
  user: User | null;
  onLogout?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
      api.getPublicPlans()
         .then(setPlans)
         .catch(err => console.error("Error loading plans:", err));
  }, []);

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

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 bg-black relative border-t border-white/5">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Todo lo que necesitas para vender</h2>
                  <p className="text-xl text-gray-400">Reemplaza 5 herramientas costosas con una sola plataforma inteligente.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                      {
                          icon: <Cpu className="w-8 h-8 text-purple-500" />,
                          title: "Generador Web IA",
                          desc: "Crea Landing Pages persuasivas y optimizadas en menos de 60 segundos con Inteligencia Artificial."
                      },
                      {
                          icon: <MessageCircle className="w-8 h-8 text-green-500" />,
                          title: "WhatsApp CRM",
                          desc: "Gestiona tus prospectos, automatiza respuestas y cierra ventas por chat sin perder el control."
                      },
                      {
                          icon: <Mail className="w-8 h-8 text-orange-500" />,
                          title: "Email Marketing",
                          desc: "Envía secuencias de correos automáticas para nutrir a tus leads y recuperar carritos abandonados."
                      },
                      {
                          icon: <Search className="w-8 h-8 text-blue-500" />,
                          title: "Blog SEO Auto",
                          desc: "Redacta artículos optimizados para Google en piloto automático y atrae tráfico gratis."
                      }
                  ].map((feature, i) => (
                      <div key={i} className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:bg-gray-800 transition duration-300 group">
                          <div className="mb-6 p-4 bg-black/50 rounded-xl w-fit border border-gray-700 group-hover:border-gray-600 transition">
                              {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                          <p className="text-gray-400 leading-relaxed text-sm">
                              {feature.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="process" className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Cómo funciona el sistema?</h2>
                  <p className="text-xl text-gray-400">Tres pasos simples para lanzar tu negocio digital.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                  {/* Connector Line (Desktop) */}
                  <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-800 via-orange-900/50 to-gray-800 z-0"></div>

                  {[
                      {
                          step: "01",
                          title: "Define tu Nicho",
                          desc: "Selecciona el producto de Hotmart que quieres vender y describe tu cliente ideal.",
                          icon: <Target className="w-6 h-6 text-white" />
                      },
                      {
                          step: "02",
                          title: "IA Genera Todo",
                          desc: "Nuestra Inteligencia Artificial redacta los textos, diseña la web y crea los emails por ti.",
                          icon: <Bot className="w-6 h-6 text-white" />
                      },
                      {
                          step: "03",
                          title: "Vende en Automático",
                          desc: "Publica tu embudo y deja que el sistema convierta visitantes en comisiones.",
                          icon: <TrendingUp className="w-6 h-6 text-white" />
                      }
                  ].map((item, i) => (
                      <div key={i} className="relative z-10 flex flex-col items-center text-center">
                          <div className="w-24 h-24 bg-[#0f0f0f] border-4 border-gray-800 rounded-full flex items-center justify-center mb-8 shadow-2xl relative group transition-transform hover:scale-110 duration-300">
                              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 opacity-20 rounded-full group-hover:opacity-40 transition"></div>
                              {item.icon}
                              <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-black font-bold rounded-full flex items-center justify-center text-sm border-2 border-gray-900">
                                  {item.step}
                              </div>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                          <p className="text-gray-400 max-w-xs mx-auto leading-relaxed">
                              {item.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- BENEFITS ZIG-ZAG --- */}
      <section className="py-24 bg-black relative overflow-hidden">
          <div className="container mx-auto px-6 space-y-24">
              
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                  <div className="md:w-1/2 relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur-xl opacity-20"></div>
                      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                          {/* Abstract UI Representation */}
                          <div className="space-y-4">
                              <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <div className="ml-auto text-xs text-gray-500 font-mono">AI_Copywriter.exe</div>
                              </div>
                              <div className="space-y-2 animate-pulse">
                                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                              </div>
                              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-mono mt-4">
                                  &gt; Generando textos persuasivos... <br/>
                                  &gt; Optimizando para conversión... <br/>
                                  &gt; ¡Listo!
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="md:w-1/2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-900/30 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
                          <Zap className="w-4 h-4" /> Velocidad Extrema
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                          No necesitas ser experto en <span className="text-orange-500">Copywriting</span>
                      </h3>
                      <p className="text-xl text-gray-400 leading-relaxed mb-8">
                          Olvídate de pasar horas frente a una pantalla en blanco. Nuestra IA ha sido entrenada con las mejores cartas de venta del mercado para escribir textos que persuaden y venden por ti.
                      </p>
                      <ul className="space-y-4">
                          {['Titulares que enganchan', 'Descripciones de productos irresistibles', 'Manejo de objeciones automático'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-gray-300">
                                  <CheckCircle className="w-5 h-5 text-orange-500" /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
                  <div className="md:w-1/2 relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
                      <div className="relative bg-[#0F0F0F] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                          <img 
                              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                              alt="Dashboard Analytics" 
                              className="w-full h-full object-cover opacity-60 hover:opacity-80 transition duration-500"
                          />
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-24"></div>
                          <div className="absolute bottom-6 left-6 right-6">
                              <div className="flex justify-between items-end">
                                  <div>
                                      <p className="text-gray-400 text-xs uppercase font-bold">Ventas Hoy</p>
                                      <p className="text-3xl font-black text-white">$1,240.50</p>
                                  </div>
                                  <div className="text-green-500 text-sm font-bold flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded">
                                      <TrendingUp className="w-4 h-4" /> +15%
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="md:w-1/2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                          <Smartphone className="w-4 h-4" /> Negocio 24/7
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                          Tu negocio abierto mientras <span className="text-blue-500">duermes</span>
                      </h3>
                      <p className="text-xl text-gray-400 leading-relaxed mb-8">
                          Configura tu embudo una sola vez y deja que el sistema trabaje. Desde la captura del lead hasta el cierre de la venta y la entrega del producto, todo está automatizado.
                      </p>
                      <button 
                        onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                        className="text-white border-b-2 border-blue-500 pb-1 hover:text-blue-400 transition"
                      >
                          Comenzar ahora mismo &rarr;
                      </button>
                  </div>
              </div>

          </div>
      </section>

      {/* Pricing Section - DYNAMIC */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Elige tu Plan de Batalla</h2>
                  <p className="text-xl text-gray-400">Comienza gratis o escala con herramientas profesionales.</p>
              </div>

              {plans.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">Cargando planes...</div>
              ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {plans.map((plan) => (
                          <div 
                            key={plan.id} 
                            className={`relative bg-[#0f0f0f] border rounded-3xl p-8 flex flex-col transition duration-300 ${plan.isRecommended ? 'border-orange-600 shadow-2xl shadow-orange-900/20 transform md:-translate-y-4' : 'border-gray-800 hover:border-gray-600'}`}
                          >
                              {plan.isRecommended && (
                                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-bold px-6 py-2 rounded-bl-xl rounded-tr-2xl shadow-lg">
                                      RECOMENDADO
                                  </div>
                              )}
                              
                              <div className="mb-8">
                                  <h3 className={`text-2xl font-bold mb-2 ${plan.isRecommended ? 'text-orange-500' : 'text-white'}`}>{plan.name}</h3>
                                  <div className="flex items-baseline gap-1 mb-4">
                                      <span className="text-5xl font-extrabold text-white">
                                          {plan.priceMonthly === 0 ? '$0' : `$${plan.priceMonthly}`}
                                      </span>
                                      <span className="text-xl text-gray-500">/mes</span>
                                  </div>
                                  <p className="text-gray-400 text-sm min-h-[40px]">{plan.description}</p>
                              </div>

                              <ul className="space-y-4 mb-10 flex-1">
                                  {/* Render Dynamic Features from Admin */}
                                  {(plan.uiFeatures || []).map((feat, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                          <div className={`p-1 rounded-full flex-shrink-0 ${plan.isRecommended ? 'bg-orange-900/50 text-orange-500' : 'bg-gray-800 text-white'}`}>
                                              <CheckCircle className="w-3.5 h-3.5"/>
                                          </div> 
                                          {feat}
                                      </li>
                                  ))}
                              </ul>

                              <button 
                                onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                                className={`w-full py-4 rounded-xl font-bold transition text-lg ${plan.isRecommended 
                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:scale-[1.02]' 
                                    : 'border border-gray-600 text-white hover:bg-white hover:text-black'}`}
                              >
                                  {plan.priceMonthly === 0 ? 'Comenzar Gratis' : `Obtener Plan ${plan.name}`}
                              </button>
                          </div>
                      ))}
                  </div>
              )}
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
