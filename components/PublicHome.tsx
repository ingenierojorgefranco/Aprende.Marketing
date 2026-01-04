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
          
          <div className="hidden md:flex items-center gap-10 text-base font-medium text-white">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Inicio</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Herramientas</button>
            <button onClick={() => scrollToSection('process')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">¿Cómo Funciona?</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Blog</button>
            <button onClick={() => scrollToSection('footer')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Contáctenos</button>
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
          
          {/* ////////// Actualización: Tagline arriba del H1 y H1 sin mb-8 - 26/05/2025 18:00 ////////// */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-lg md:text-xl text-white mb-8 animate-fade-in-up hover:border-[#FF5A1F]/50 transition duration-300 cursor-default font-bold">
            <span className="flex h-3 w-3 rounded-full bg-[#FF5A1F] animate-pulse"></span>
            La plataforma #1 para Afiliados de Hotmart®
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-0 tracking-tight leading-[1.1] max-w-6xl mx-auto text-white">
            Vende tus Infoproductos<br />
            <span className="text-[#FF5A1F]">
              En Piloto Automático
            </span>
          </h1>
          {/* ////////// Fin de actualización - 26/05/2025 18:00 ////////// */}

          {/* ////////// Actualización: Sección de registro sin padding-top y mejoras de espaciado en contenidos - 26/05/2025 18:00 ////////// */}
          <section id="register-now" className="pb-12 relative overflow-hidden mb-16">
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#FF5A1F15_0%,transparent_50%)]" />
            </div>
            
            <div className="container mx-auto">
              <div className="relative">
                <div className="flex flex-col lg:flex-row items-center text-left">
                  {/* Lado Izquierdo: Imagen Mujer Sonriente con botón Play */}
                  <div className="lg:w-1/2 h-[400px] lg:h-[600px] w-full relative group cursor-pointer overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop" 
                      alt="Éxito en Marketing Digital" 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-[#FF5A1F]/90 rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition duration-300 z-20">
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B0B0B] hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0B0B] lg:hidden" />
                  </div>

                  {/* Lado Derecho: Contenido de Registro */}
                  <div className="lg:w-1/2 p-8 md:p-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-sm font-black uppercase tracking-widest mb-4">
                      <Rocket className="w-4 h-4" /> Comienza Gratis Hoy
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 mt-6">
                      Tu imperio digital comienza aquí, <span className="text-[#FF5A1F]">sin letras pequeñas</span>
                    </h2>
                    
                    {/* ////////// Actualización: Descripción blanca y texto prefijado con espaciado superior - 26/05/2025 18:00 ////////// */}
                    <p className="text-xl text-white mb-10 leading-relaxed font-light mt-6">
                      Aprende.Marketing es la plataforma "Todo en Uno" para Productores y Afiliados. Crea Embudos de Venta, Páginas de Alta Conversión generadas por IA en segundos, No necesitas tarjeta de crédito ni conocimientos técnicos.
                    </p>
                    {/* ////////// Fin de actualización - 26/05/2025 18:00 ////////// */}

                    <div className="space-y-6 mb-12">
                       {[
                         "Acceso instantáneo a la Inteligencia Artificial",
                         "Crea tu primera Landing Page en 60 segundos",
                         "Academia de formación gratuita incluida",
                         "Comunidad de soporte en WhatsApp"
                       ].map((benefit, i) => (
                         <div key={i} className="flex items-center gap-4 text-white font-medium text-lg">
                            <div className="w-6 h-6 rounded-full bg-[#FF5A1F] flex items-center justify-center shrink-0">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            {benefit}
                         </div>
                       ))}
                    </div>

                    <button
                      onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                      className="w-full md:w-auto px-12 py-6 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-2xl rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                    >
                      Crear mi cuenta 100% gratis <ArrowRight className="w-7 h-7" />
                    </button>
                    
                    <p className="text-[#B0B0B0] text-sm mt-6 text-center lg:text-left opacity-60">
                      * Sin compromisos. Cancela o mejora tu cuenta cuando quieras desde el panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* ////////// Fin de actualización - 26/05/2025 18:00 ////////// */}

          {/* ////////// Actualización: Eliminación de video hero y botón CTA. Reubicación de prueba social en ese espacio - 26/05/2025 18:00 ////////// */}
          <div className="flex flex-col items-center justify-center gap-8 mb-20">
            <div className="flex flex-col items-center gap-2">
              <p className="text-white text-lg md:text-xl font-bold">
                +500 emprendedores mejoraron su negocio con nuestros productos PLR
              </p>
              <div className="flex items-center gap-2 bg-[#FF5A1F]/10 px-4 py-1.5 rounded-full border border-[#FF5A1F]/20">
                <div className="flex gap-1 text-[#FF5A1F]">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-white font-bold text-sm uppercase tracking-widest">Calificación Perfecta 5/5</span>
              </div>
            </div>
          </div>
          {/* ////////// Fin de actualización - 26/05/2025 18:00 ////////// */}
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

      {/* ////////// Actualización: Sección independiente de testimonios - 26/05/2025 18:00 ////////// */}
      <section id="testimonials" className="py-24 bg-[#F6F6F6] border-t border-gray-200 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0B0B0B]">Historias de Éxito que Inspiran</h2>
            <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed">Descubre cómo nuestra tecnología está transformando la vida de cientos de emprendedores digitales en toda habla hispana.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              { 
                name: "Maria G.", 
                location: "Madrid, España", 
                img: "https://randomuser.me/api/portraits/women/32.jpg", 
                text: "Increíble app, simplificó mi proceso de ventas." 
              },
              { 
                name: "Juan P.", 
                location: "CDMX, México", 
                img: "https://randomuser.me/api/portraits/men/44.jpg", 
                text: "La mejor inversión para mi negocio Hotmart." 
              },
              { 
                name: "Ana S.", 
                location: "Bogotá, Colombia", 
                img: "https://randomuser.me/api/portraits/women/68.jpg", 
                text: "Resultados reales en muy poco tiempo." 
              }
            ].map((testi, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-200 text-left flex flex-col gap-6 shadow-xl hover:border-[#FF5A1F]/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <img src={testi.img} alt={testi.name} className="w-16 h-16 rounded-full border-2 border-[#FF5A1F]/10 object-cover" />
                  <div>
                    <h4 className="text-[#0B0B0B] font-bold text-lg">{testi.name}</h4>
                    <p className="text-[#B0B0B0] text-sm">{testi.location}</p>
                  </div>
                </div>
                <p className="text-[#0B0B0B] text-lg italic font-light leading-relaxed">"{testi.text}"</p>
                <div className="flex gap-1 text-[#FF5A1F]">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ////////// Fin de actualización - 26/05/2025 18:00 ////////// */}

      {/* Footer */}
      <footer id="footer" className="bg-black border-t border-white/10 py-16">
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