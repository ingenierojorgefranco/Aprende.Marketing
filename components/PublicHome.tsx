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
    <div className="min-h-screen bg-[#FFFFFF] text-[#0B0B0B] font-sans selection:bg-[#FF5A1F] selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#FF5A1F]/20">A</div>
            <span className="text-2xl font-bold tracking-tight text-white">Aprende.<span className="text-[#B0B0B0] font-normal">Marketing</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-base font-medium text-[#B0B0B0]">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition hover:scale-105 transform">Herramientas</button>
            <button onClick={() => scrollToSection('process')} className="hover:text-white transition hover:scale-105 transform">Cómo Funciona</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition hover:scale-105 transform">Precios</button>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                 <span className="hidden md:block text-sm text-[#B0B0B0]">Hola, <span className="text-white font-bold">{user.name}</span></span>
                   <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/10 font-bold hover:bg-[#FF5A1F] transition text-sm flex items-center gap-2"
                   >
                     <LayoutDashboard className="w-4 h-4" /> Panel
                   </button>
                 {onLogout && (
                   <button onClick={onLogout} className="p-2 rounded-full text-[#B0B0B0] hover:text-red-400 hover:bg-white/5 transition" title="Cerrar Sesión">
                     <LogOut className="w-5 h-5" />
                   </button>
                 )}
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-2.5 rounded-full bg-[#FF5A1F] text-white font-bold hover:bg-[#D94A1E] transition text-sm shadow-[0_10px_20px_rgba(255,90,31,0.3)]"
              >
                Acceso Usuarios
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - DARK BACKGROUND */}
      <header className="relative pt-40 pb-24 lg:pt-52 lg:pb-40 z-10 overflow-hidden bg-[#0B0B0B]">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF5A1F]/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 text-center relative">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-[#B0B0B0] mb-8 animate-fade-in-up hover:border-[#FF5A1F]/50 transition duration-300 cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F] animate-pulse"></span>
            La plataforma #1 para Afiliados de Hotmart®
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-[1.1] max-w-6xl mx-auto text-white">
            Vende tus Infoproductos<br />
            <span className="text-[#FF5A1F]">
              En Piloto Automático
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#B0B0B0] mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            La plataforma "Todo en Uno" para Productores y Afiliados. Crea Embudos de Venta, VSLs y Páginas de Alta Conversión generadas por IA en segundos.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
            <button
              onClick={() => user ? navigate('/dashboard') : navigate('/register')}
              className="group relative px-10 py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] rounded-full text-xl font-bold transition flex items-center gap-3 shadow-[0_10px_40px_-10px_rgba(255,90,31,0.5)] text-white transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {user ? 'Ir a mi Panel' : 'Activa tu Cuenta Ahora'} <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <a 
              href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-transparent hover:bg-white/5 border border-white/20 hover:border-[#FF5A1F] hover:text-[#FF5A1F] rounded-full text-xl font-bold transition flex items-center gap-3 text-white group"
            >
              <Users className="w-6 h-6 group-hover:text-[#FF5A1F] transition-colors" /> Únete a la Comunidad
            </a>
          </div>

          <div className="relative max-w-5xl mx-auto group">
              <div className="absolute -inset-1 bg-[#FF5A1F] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-[#161616] rounded-xl border border-white/5 shadow-2xl overflow-hidden">
                  <div className="h-12 bg-black border-b border-white/5 flex items-center px-4 gap-2">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-white/10"></div>
                          <div className="w-3 h-3 rounded-full bg-white/10"></div>
                          <div className="w-3 h-3 rounded-full bg-white/10"></div>
                      </div>
                      <div className="flex-1 flex justify-center">
                          <div className="bg-black/50 px-4 py-1.5 rounded-lg text-xs text-[#B0B0B0] flex items-center gap-2 border border-white/5 font-mono">
                              <Shield className="w-3 h-3" /> aprende.marketing/dashboard
                          </div>
                      </div>
                  </div>
                  <div className="relative aspect-video bg-gray-900 overflow-hidden flex items-center justify-center group cursor-pointer">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                      <div className="w-24 h-24 bg-[#FF5A1F]/90 rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition duration-300 z-10">
                          <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </header>

      {/* Features Grid - LIGHT GRAY BACKGROUND */}
      <section id="features" className="py-24 bg-[#F6F6F6] relative border-t border-gray-200">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0B0B0B]">Todo lo que necesitas para vender</h2>
                  <p className="text-xl text-[#B0B0B0]">Reemplaza 5 herramientas costosas con una sola plataforma inteligente.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                      {
                          icon: <Cpu className="w-8 h-8 text-[#FF5A1F]" />,
                          title: "Generador Web IA",
                          desc: "Crea Landing Pages persuasivas y optimizadas en menos de 60 segundos con Inteligencia Artificial."
                      },
                      {
                          icon: <MessageCircle className="w-8 h-8 text-[#FF5A1F]" />,
                          title: "WhatsApp CRM",
                          desc: "Gestiona tus prospectos, automatiza respuestas y cierra ventas por chat sin perder el control."
                      },
                      {
                          icon: <Mail className="w-8 h-8 text-[#FF5A1F]" />,
                          title: "Email Marketing",
                          desc: "Envía secuencias de correos automáticas para nutrir a tus leads y recuperar carritos abandonados."
                      },
                      {
                          icon: <Search className="w-8 h-8 text-[#FF5A1F]" />,
                          title: "Blog SEO Auto",
                          desc: "Redacta artículos optimizados para Google en piloto automático y atrae tráfico gratis."
                      }
                  ].map((feature, i) => (
                      <div key={i} className="bg-white border border-gray-200 p-8 rounded-2xl hover:border-[#FF5A1F]/50 transition duration-300 group shadow-sm">
                          <div className="mb-6 p-4 bg-[#F6F6F6] rounded-xl w-fit border border-gray-100 group-hover:border-[#FF5A1F]/20 transition">
                              {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold text-[#0B0B0B] mb-3">{feature.title}</h3>
                          <p className="text-[#B0B0B0] leading-relaxed text-sm">
                              {feature.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* How it Works - DARK BACKGROUND */}
      <section id="process" className="py-24 bg-[#0B0B0B] border-t border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">¿Cómo funciona el sistema?</h2>
                  <p className="text-xl text-[#B0B0B0]">Tres pasos simples para lanzar tu negocio digital.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                  <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-white/5 z-0"></div>

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
                          <div className="w-24 h-24 bg-[#161616] border-2 border-white/5 rounded-full flex items-center justify-center mb-8 shadow-2xl relative group transition-transform hover:scale-110 duration-300">
                              <div className="absolute inset-0 bg-[#FF5A1F] opacity-0 group-hover:opacity-100 rounded-full transition duration-300"></div>
                              <div className="relative z-10">{item.icon}</div>
                              <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FF5A1F] text-white font-bold rounded-full flex items-center justify-center text-sm border-2 border-[#0B0B0B]">
                                  {item.step}
                              </div>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                          <p className="text-[#B0B0B0] max-w-xs mx-auto leading-relaxed">
                              {item.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Benefits - WHITE BACKGROUND */}
      <section className="py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 space-y-24">
              <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                  <div className="md:w-1/2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider mb-6">
                          <Zap className="w-4 h-4" /> Velocidad Extrema
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold text-[#0B0B0B] mb-6 leading-tight">
                          No necesitas ser experto en <span className="text-[#FF5A1F]">Copywriting</span>
                      </h3>
                      <p className="text-xl text-[#B0B0B0] leading-relaxed mb-8">
                          Olvídate de pasar horas frente a una pantalla en blanco. Nuestra IA ha sido entrenada con las mejores cartas de venta del mercado para escribir textos que persuaden y venden por ti.
                      </p>
                      <ul className="space-y-4">
                          {['Titulares que enganchan', 'Descripciones irresistibles', 'Manejo de objeciones'].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-[#0B0B0B] font-medium">
                                  <CheckCircle className="w-5 h-5 text-[#FF5A1F]" /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="md:w-1/2 relative">
                      <div className="relative bg-[#F6F6F6] border border-gray-200 rounded-2xl p-6 shadow-xl">
                          <div className="space-y-4">
                              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                              </div>
                              <div className="p-4 bg-white border border-gray-100 rounded-lg text-[#0B0B0B] text-sm font-mono mt-4">
                                  &gt; Generando textos persuasivos... <br/>
                                  &gt; Optimizando para conversión... <br/>
                                  <span className="text-[#FF5A1F] font-bold">&gt; ¡Listo en 45 segundos!</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing - DARK BACKGROUND */}
      <section id="pricing" className="py-24 bg-[#0B0B0B] border-t border-white/5">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Elige tu Plan de Batalla</h2>
                  <p className="text-xl text-[#B0B0B0]">Comienza gratis o escala con herramientas profesionales.</p>
              </div>

              {plans.length === 0 ? (
                  <div className="text-center text-[#B0B0B0] py-10">Cargando planes...</div>
              ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {plans.map((plan) => (
                          <div 
                            key={plan.id} 
                            className={`relative bg-[#161616] border rounded-3xl p-8 flex flex-col transition duration-300 ${plan.isRecommended ? 'border-[#FF5A1F] shadow-2xl shadow-[#FF5A1F]/10 transform md:-translate-y-4' : 'border-white/5 hover:border-[#B0B0B0]'}`}
                          >
                              {plan.isRecommended && (
                                  <div className="absolute top-0 right-0 bg-[#FF5A1F] text-white text-sm font-bold px-6 py-2 rounded-bl-xl rounded-tr-2xl shadow-lg">
                                      RECOMENDADO
                                  </div>
                              )}
                              
                              <div className="mb-8">
                                  <h3 className={`text-2xl font-bold mb-2 ${plan.isRecommended ? 'text-[#FF5A1F]' : 'text-white'}`}>{plan.name}</h3>
                                  <div className="flex items-baseline gap-1 mb-4">
                                      <span className="text-5xl font-extrabold text-white">
                                          {plan.priceMonthly === 0 ? '$0' : `$${plan.priceMonthly}`}
                                      </span>
                                      <span className="text-xl text-[#B0B0B0]">/mes</span>
                                  </div>
                                  <p className="text-[#B0B0B0] text-sm min-h-[40px]">{plan.description}</p>
                              </div>

                              <ul className="space-y-4 mb-10 flex-1">
                                  {(plan.uiFeatures || []).map((feat, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-white text-sm">
                                          <div className={`p-1 rounded-full flex-shrink-0 ${plan.isRecommended ? 'bg-[#FF5A1F]/20 text-[#FF5A1F]' : 'bg-white/10 text-white'}`}>
                                              <CheckCircle className="w-3.5 h-3.5"/>
                                          </div> 
                                          {feat}
                                      </li>
                                  ))}
                              </ul>

                              <button 
                                onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                                className={`w-full py-4 rounded-xl font-bold transition text-lg ${plan.isRecommended 
                                    ? 'bg-[#FF5A1F] text-white hover:bg-[#D94A1E] shadow-lg shadow-[#FF5A1F]/20' 
                                    : 'border border-white/20 text-white hover:bg-white hover:text-black'}`}
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
                <div className="w-10 h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-xl">A</div>
                <span className="text-2xl font-bold text-white tracking-tight">Aprende.Marketing</span>
             </div>
             <div className="flex gap-8 text-sm text-[#B0B0B0] font-medium">
                  <a href="#" className="hover:text-white transition">Soporte</a>
                  <a href="#" className="hover:text-white transition">Privacidad</a>
             </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-[#B0B0B0]/50 text-sm">
              &copy; {new Date().getFullYear()} Aprende.Marketing. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};