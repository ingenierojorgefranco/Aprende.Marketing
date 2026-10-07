
import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowRight, LayoutDashboard, LogOut, Play, 
  Layout, MessageCircle, PenTool, Search, Briefcase, Mail, Users, BarChart, Link as LinkIcon,
  CheckCircle, Zap, Shield, Rocket, Bot, Server, Star, Target, Globe, Gift, ChevronRight, TrendingUp, X, Menu, Smartphone, Cpu, Repeat, Phone, MoreVertical, Send, Smile, BookOpen, GraduationCap,
  List, Facebook, Instagram, Youtube, TrendingUp as ChartIcon, DollarSign, Calendar, ChevronDown, ChevronUp, Box
} from 'lucide-react';
////////// Importación de Recharts para gráfica de ingresos - 27/05/2025 02:15 //////////
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
////////// Fin de actualización - 27/05/2025 02:15 //////////
import { User, Plan } from '../types';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface PublicHomeProps {
  user: User | null;
  onLogout?: () => void;
}

////////// Componente Interno: Terminal IA con activación por visibilidad - 27/05/2025 00:15 //////////
const TerminalBlock: React.FC<{ children: React.ReactNode, bgColor?: string, accentColor?: string }> = ({ children, bgColor = "bg-[#0B0B0B]", accentColor = "bg-gray-200" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.2 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${bgColor} border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl font-mono text-lg md:text-xl w-full max-w-md min-h-[400px] md:min-h-[500px] flex flex-col transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex gap-2 mb-6 md:mb-8 shrink-0">
        <div className={`w-3.5 h-3.5 rounded-full ${accentColor} opacity-30`}></div>
        <div className={`w-3.5 h-3.5 rounded-full ${accentColor} opacity-30`}></div>
        <div className={`w-3.5 h-3.5 rounded-full ${accentColor} opacity-30`}></div>
      </div>
      <div className="space-y-4 md:space-y-5 flex-1 overflow-hidden">
        {isVisible && children}
      </div>
    </div>
  );
};
////////// Fin de componente interno - 27/05/2025 00:15 //////////

////////// Datos para la gráfica de Rentabilidad 2026 - 27/05/2025 02:15 //////////
const profitabilityData = [
  { month: 'Ene', income: 0 },
  { month: 'Feb', income: 50 },
  { month: 'Mar', income: 150 },
  { month: 'Abr', income: 300 },
  { month: 'May', income: 550 },
  { month: 'Jun', income: 800 },
  { month: 'Jul', income: 1100 },
  { month: 'Ago', income: 1350 },
  { month: 'Sep', income: 1550 },
  { month: 'Oct', income: 1750 },
  { month: 'Nov', income: 1900 },
  { month: 'Dic', income: 2000 },
];
////////// Fin de datos - 27/05/2025 02:15 //////////

export const PublicHome: React.FC<PublicHomeProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  
  ////////// Estado para el menú móvil y acordeón de FAQ - 27/05/2025 10:00 //////////
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  ////////// Fin de actualización - 27/05/2025 10:00 //////////

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
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0B0B0B] font-sans selection:bg-[#FF5A1F] selection:text-white overflow-x-hidden">
      
      {/* ////////// Actualización: Animación de terminal y marquesina infinita - 03/06/2025 15:45 ////////// */}
      <style>{`
        @keyframes typewriterStep {
          0%, 10% { opacity: 0; transform: translateX(-10px); }
          15%, 90% { opacity: 1; transform: translateX(0); }
          95%, 100% { opacity: 0; }
        }
        .animate-terminal-step {
          animation: typewriterStep 8s infinite;
          opacity: 0;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-scroll {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
      `}</style>
      {/* ////////// Fin de actualización - 03/06/2025 15:45 ////////// */}

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* ////////// Actualización: Logo Header AM - 27/05/2025 02:15 ////////// */}
            <div className="w-12 md:w-14 h-9 md:h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-lg shadow-[#FF5A1F]/20 px-2">AM</div>
            {/* ////////// Fin de actualización - 27/05/2025 02:15 ////////// */}
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">Aprende.<span className="text-[#B0B0B0] font-normal">Marketing</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-base font-medium text-white">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Inicio</button>
            <button onClick={() => scrollToSection('process')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Cómo funciona</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Productos</button>
            <button onClick={() => scrollToSection('academy')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Academia</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Precios</button>
            <button onClick={() => scrollToSection('footer')} className="hover:text-[#FF5A1F] transition hover:scale-105 transform">Blog</button>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                 <span className="hidden lg:block text-sm text-[#B0B0B0]">Hola, <span className="text-white font-bold">{user.name}</span></span>
                   <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/10 text-white border border-white/10 font-bold hover:bg-[#FF5A1F] transition text-sm flex items-center gap-2"
                   >
                     <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Panel</span>
                   </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:block px-8 md:px-12 py-3 md:py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm md:text-[1.1rem] rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-1 active:scale-95"
              >
                Iniciar sesión
              </button>
            )}
            
            {/* ////////// Botón Hamburguesa Móvil - 27/05/2025 15:30 ////////// */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2 text-white hover:text-[#FF5A1F] transition-colors"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            {/* ////////// Fin de actualización - 27/05/2025 15:30 ////////// */}
          </div>
        </div>

        {/* ////////// Menú Lateral Móvil (Overlay) - 27/05/2025 15:30 ////////// */}
        <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-[#0B0B0B] p-8 shadow-2xl border-l border-white/5 transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-12">
              <div className="w-12 h-9 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-lg px-2">AM</div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white hover:text-[#FF5A1F] transition-colors"><X className="w-8 h-8" /></button>
            </div>
            
            <div className="flex flex-col gap-6 text-xl font-bold text-white mb-12">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }} className="text-left py-2 hover:text-[#FF5A1F] transition-colors border-b border-white/5 flex justify-between items-center">Inicio <ChevronRight className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => { scrollToSection('process'); setIsMenuOpen(false); }} className="text-left py-2 hover:text-[#FF5A1F] transition-colors border-b border-white/5 flex justify-between items-center">Cómo funciona <ChevronRight className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => { scrollToSection('features'); setIsMenuOpen(false); }} className="text-left py-2 hover:text-[#FF5A1F] transition-colors border-b border-white/5 flex justify-between items-center">Productos <ChevronRight className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => { scrollToSection('academy'); setIsMenuOpen(false); }} className="text-left py-2 hover:text-[#FF5A1F] transition-colors border-b border-white/5 flex justify-between items-center">Academia <ChevronRight className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => { scrollToSection('testimonials'); setIsMenuOpen(false); }} className="text-left py-2 hover:text-[#FF5A1F] transition-colors border-b border-white/5 flex justify-between items-center">Precios <ChevronRight className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => { scrollToSection('footer'); setIsMenuOpen(false); }} className="text-left py-2 hover:text-[#FF5A1F] transition-colors border-b border-white/5 flex justify-between items-center">Blog <ChevronRight className="w-5 h-5 text-gray-600" /></button>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-5 bg-[#FF5A1F] text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-transform"
            >
              Iniciar sesión
            </button>
            
            <p className="mt-auto text-center text-gray-500 text-xs font-bold uppercase tracking-widest">Aprende.Marketing v2.0</p>
          </div>
        </div>
        {/* ////////// Fin de actualización - 27/05/2025 15:30 ////////// */}
      </nav>

      {/* Hero Section - DARK BACKGROUND */}
      <header className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 z-10 overflow-hidden bg-[#0B0B0B]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF5A1F]/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Columna Izquierda: Mensaje y Acción */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
              {/* Badge superior */}
              <div className="mx-auto lg:mx-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-black uppercase tracking-widest mb-6 w-fit animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-[#FF5A1F] animate-pulse"></span>
                <span>Plataforma para afiliados de Hotmart</span>
              </div>

              {/* Título de Gran Impacto */}
              <h1 className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[3.8rem] font-extrabold tracking-tight text-white leading-[1.1] animate-fade-in-up">
                Lanza tu estrategia de afiliación en <span className="text-[#FF5A1F]">Hotmart</span> <span className="text-[#FF5A1F]">sin empezar desde cero</span>
              </h1>

              {/* Descripción */}
              <p className="text-white font-light text-lg md:text-xl md:leading-relaxed mt-6 animate-fade-in-up">
                Elige un producto analizado, define tu audiencia y crea tu página, contenidos y seguimiento desde una sola plataforma.
              </p>

              {/* Botón CTA y Seguridad */}
              <div className="mt-8 flex flex-col items-center lg:items-start animate-fade-in-up">
                <button
                  onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                  className="w-full sm:w-auto px-10 py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl rounded-2xl transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(255,90,31,0.4)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>Crear mi cuenta gratis</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="mt-4 flex items-center gap-2 text-zinc-500 font-semibold text-sm justify-center lg:justify-start">
                  <CheckCircle className="w-4 h-4 text-[#FF5A1F]" />
                  <span>Sin tarjeta de crédito. Configura tu primer proyecto paso a paso.</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Captura de pantalla de la Plataforma */}
            <div className="w-full lg:w-1/2 flex items-center justify-center animate-fade-in-up relative">
              {/* Resplandor naranja de fondo */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF5A1F] to-indigo-600 rounded-[2rem] blur-2xl opacity-10 pointer-events-none"></div>
              
              {/* Contenedor del Navegador/Applicación simulando marco prémium */}
              <div className="relative w-full rounded-[2rem] border border-white/10 overflow-hidden bg-[#121212]/90 shadow-[0_0_60px_rgba(255,90,31,0.12)] p-2 backdrop-blur-xl group hover:border-[#FF5A1F]/30 transition-all duration-500">
                
                {/* Cabecera del Navegador */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0B0B0B]/80 border-b border-white/5 rounded-t-[1.7rem]">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition duration-300"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition duration-300"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition duration-300"></span>
                  </div>
                  <div className="bg-white/5 rounded-full px-8 py-1 text-[11px] font-mono text-zinc-500 border border-white/5">
                    aprende.marketing/onboarding/wizard
                  </div>
                  <div className="w-6"></div>
                </div>

                {/* Imagen de Captura de pantalla del Producto Real */}
                <div className="relative overflow-hidden rounded-b-[1.7rem]">
                  <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
                    alt="Plataforma de Afiliados Aprende Marketing" 
                    className="w-full h-auto object-cover grayscale-[10%] group-hover:grayscale-0 transition duration-500"
                  />
                  {/* Overlay gradiente suave superior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

            {/* Barra de Características / Pilares en el Pie del Hero */}
          <div className="mt-20 lg:mt-24 bg-[#111111]/90 border border-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <div className="absolute -inset-px bg-gradient-to-r from-zinc-800 via-transparent to-zinc-800 rounded-3xl opacity-20 pointer-events-none"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              
              {/* Pilar 1: Productos Analizados */}
              <div className="flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-[#1A1A1A]/90 hover:shadow-[0_15px_30px_rgba(255,90,31,0.06)] border border-transparent hover:border-white/10 group cursor-pointer">
                <div className="w-14 h-14 bg-[#FF5A1F]/10 rounded-2xl flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20 shadow-lg shadow-[#FF5A1F]/5 group-hover:scale-105 group-hover:bg-[#FF5A1F]/20 group-hover:shadow-[0_0_20px_rgba(255,90,31,0.2)] transition-all duration-300">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight uppercase tracking-wider group-hover:text-[#FF5A1F] transition-colors duration-300">Productos analizados</h3>
                  <p className="text-zinc-500 text-xs md:text-sm font-light mt-1.5 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">Las ofertas más rentables del mercado de afiliados previamente filtradas.</p>
                </div>
              </div>
              
              {/* Pilar 2: Embudos Listos Para Lanzar */}
              <div className="flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-[#1A1A1A]/90 hover:shadow-[0_15px_30px_rgba(99,102,241,0.06)] border border-transparent hover:border-white/10 group cursor-pointer">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/25 shadow-lg shadow-indigo-500/5 group-hover:scale-105 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
                  <Rocket className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight uppercase tracking-wider group-hover:text-indigo-400 transition-colors duration-300">Embudos listos para lanzar</h3>
                  <p className="text-zinc-500 text-xs md:text-sm font-light mt-1.5 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">Embudos de alta conversión listos para instalarse en segundos por IA.</p>
                </div>
              </div>

              {/* Pilar 3: Contenido y Seguimiento */}
              <div className="flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-[#1A1A1A]/90 hover:shadow-[0_15px_30px_rgba(255,90,31,0.06)] border border-transparent hover:border-white/10 group cursor-pointer">
                <div className="w-14 h-14 bg-[#FF5A1F]/10 rounded-2xl flex items-center justify-center text-[#FF5A1F] shrink-0 border border-[#FF5A1F]/20 shadow-lg shadow-[#FF5A1F]/5 group-hover:scale-105 group-hover:bg-[#FF5A1F]/20 group-hover:shadow-[0_0_20px_rgba(255,90,31,0.2)] transition-all duration-300">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight uppercase tracking-wider group-hover:text-[#FF5A1F] transition-colors duration-300">Contenido y seguimiento</h3>
                  <p className="text-zinc-500 text-xs md:text-sm font-light mt-1.5 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">Copia secuencias de email preconfiguradas y guiones de alto impacto.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </header>

      {/* ////////// Secciones Herramientas activadas por visibilidad con mayor altura y animaciones aceleradas - 27/05/2025 10:00 ////////// */}
      <section id="features" className="bg-white">
          {/* Bloque 1: Estrategia de Proyecto */}
          <div className="py-16 md:py-24 border-b border-gray-100 overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 md:gap-16 max-w-[75rem]">
                <div className="lg:w-3/5 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider mb-6">
                        <Target className="w-4 h-4" /> Inteligencia Estratégica
                    </div>
                    <h3 className="text-2xl md:text-5xl font-black text-[#0B0B0B] mb-6 leading-tight">
                        Crea tu <span className="text-[#FF5A1F]">Estrategia Maestra</span> en segundos
                    </h3>
                    <p className="text-lg md:text-[1.3rem] leading-[1.6] md:leading-[1.7] text-[#0B0B0B] mb-8 font-light">
                        No empieces desde cero. Nuestra IA analiza tu nicho y producto para definir tu cliente ideal, sus dolores más profundos y los ganchos de venta que lo harán comprar.
                    </p>
                    <ul className="space-y-4">
                        {['Análisis de Avatar automático', 'Detección de puntos de dolor', 'Propuesta de valor única'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-[#0B0B0B] font-medium text-base md:text-[1.3rem] leading-[1.7]">
                                <CheckCircle className="w-5 h-5 text-[#FF5A1F]" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-2/5 w-full flex justify-center">
                    <TerminalBlock>
                        <p className="text-gray-500 animate-terminal-step" style={{animationDelay: '0s'}}> {">"} Analizando nicho de mercado...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '0.8s'}}> {">"} Detectando dolores del avatar...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '1.6s'}}> {">"} Escaneando competencia...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '2.4s'}}> {">"} Generando ganchos emocionales...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '3.2s'}}> {">"} Estructurando oferta irresistible...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '4s'}}> {">"} Optimizando para conversiones...</p>
                        <p className="text-[#FF5A1F] font-black animate-terminal-step" style={{animationDelay: '4.8s'}}> {">"} ¡ESTRATEGIA MAESTRA LISTA!</p>
                    </TerminalBlock>
                </div>
            </div>
          </div>

          {/* Bloque 2: Landing Page Instantánea (Dark) */}
          <div className="py-16 md:py-24 bg-[#0B0B0B] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,#FF5A1F30_0%,transparent_50%)]"></div>
            <div className="container mx-auto px-6 flex flex-col lg:flex-row-reverse items-center gap-12 md:gap-16 max-w-[75rem] relative z-10">
                <div className="lg:w-3/5 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider mb-6">
                        <Layout className="w-4 h-4" /> Conversión Máxima
                    </div>
                    <h3 className="text-2xl md:text-5xl font-black text-white mb-6 leading-tight">
                        Tu <span className="text-[#FF5A1F]">Landing Page</span> diseñada para vender
                    </h3>
                    <p className="text-lg md:text-[1.3rem] leading-[1.6] md:leading-[1.7] text-white mb-8 font-light">
                        Olvídate de configurar píxeles o pelear con diseños. El sistema genera una web profesional con textos persuasivos que guían al usuario directamente al botón de compra.
                    </p>
                    <ul className="space-y-4">
                        {['Copywriting de nivel experto', 'Optimización para móviles', 'Carga ultra rápida'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white font-medium text-base md:text-[1.3rem] leading-[1.7]">
                                <CheckCircle className="w-5 h-5 text-[#FF5A1F]" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-2/5 w-full flex justify-center">
                    <TerminalBlock bgColor="bg-white" accentColor="bg-gray-800">
                        <p className="text-gray-400 animate-terminal-step" style={{animationDelay: '0s'}}> {">"} Generando arquitectura persuasiva...</p>
                        <p className="text-gray-600 animate-terminal-step" style={{animationDelay: '0.8s'}}> {">"} Escribiendo headlines magnéticos...</p>
                        <p className="text-gray-600 animate-terminal-step" style={{animationDelay: '1.6s'}}> {">"} Diseñando bloques de contenido...</p>
                        <p className="text-gray-600 animate-terminal-step" style={{animationDelay: '2.4s'}}> {">"} Integrando testimonios dinámicos...</p>
                        <p className="text-gray-600 animate-terminal-step" style={{animationDelay: '3.2s'}}> {">"} Optimizando para móviles...</p>
                        <p className="text-gray-600 animate-terminal-step" style={{animationDelay: '4s'}}> {">"} Configurando pixeles de venta...</p>
                        <p className="text-[#FF5A1F] font-black animate-terminal-step" style={{animationDelay: '4.8s'}}> {">"} ¡PÁGINA PUBLICADA EN 45s!</p>
                    </TerminalBlock>
                </div>
            </div>
          </div>

          {/* Bloque 3: Artículos SEO */}
          <div className="py-16 md:py-24 overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 md:gap-16 max-w-[75rem]">
                <div className="lg:w-3/5 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider mb-6">
                        <Search className="w-4 h-4" /> Tráfico Orgánico
                    </div>
                    <h3 className="text-2xl md:text-5xl font-black text-[#0B0B0B] mb-6 leading-tight">
                        Genera <span className="text-[#FF5A1F]">Artículos SEO</span> en automático
                    </h3>
                    <p className="text-lg md:text-[1.3rem] leading-[1.6] md:leading-[1.7] text-[#0B0B0B] mb-8 font-light">
                        Atrae visitas gratis desde Google todos los días. Nuestra IA escribe artículos optimizados con tus palabras clave que posicionan rápido y llevan tráfico a tus ofertas.
                    </p>
                    <ul className="space-y-4">
                        {['Investigación de keywords', 'Estructura SEO perfecta', 'Contenido 100% original'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-[#0B0B0B] font-medium text-base md:text-[1.3rem] leading-[1.7]">
                                <CheckCircle className="w-5 h-5 text-[#FF5A1F]" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:w-2/5 w-full flex justify-center">
                    <TerminalBlock bgColor="bg-[#161616]" accentColor="bg-indigo-500">
                        <p className="text-gray-500 animate-terminal-step" style={{animationDelay: '0s'}}> {">"} Investigando palabras clave...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '0.8s'}}> {">"} Analizando intención de búsqueda...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '1.6s'}}> {">"} Redactando contenido optimizado...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '2.4s'}}> {">"} Generando metaetiquetas SEO...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '3.2s'}}> {">"} Estructurando enlaces internos...</p>
                        <p className="text-gray-300 animate-terminal-step" style={{animationDelay: '4s'}}> {">"} Verificando legibilidad IA...</p>
                        <p className="text-[#FF5A1F] font-black animate-terminal-step" style={{animationDelay: '4.8s'}}> {">"} ¡ARTÍCULO LISTO PARA GOOGLE!</p>
                    </TerminalBlock>
                </div>
            </div>
          </div>
      </section>
      {/* ////////// Fin de actualización - 27/05/2025 10:00 ////////// */}

      <section id="process" className="py-20 md:py-24 bg-[#0B0B0B] border-t border-white/5 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16 md:mb-20">
                  <h2 className="text-2xl md:text-5xl font-black mb-4 text-white">¿Cómo funciona el sistema?</h2>
                  <p className="text-lg md:text-xl text-[#B0B0B0]">Lanza tu negocio digital en tiempo récord siguiendo estos pasos.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                  <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-white/5 z-0"></div>

                  {[
                      {
                          step: "01",
                          title: "Crea tu Proyecto",
                          desc: "Define el nicho y el producto de Hotmart que quieres escalar. La IA entenderá tu mercado de inmediato.",
                          icon: <Briefcase className="w-6 h-6 text-white" />
                      },
                      {
                          step: "02",
                          title: "La I.A Genera Todo",
                          desc: "En segundos tendrás tu Landing Page, textos persuasivos de venta y secuencias de email marketing listas.",
                          icon: <Cpu className="w-6 h-6 text-white" />
                      },
                      {
                          step: "03",
                          title: "Vende en Automático",
                          desc: "Publica tu embudo, atrae tráfico con tus artículos SEO y recibe tus comisiones en piloto automático.",
                          icon: <TrendingUp className="w-6 h-6 text-white" />
                      }
                  ].map((item, i) => (
                      <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                          <div className="w-20 md:w-24 h-20 md:h-24 bg-[#161616] border-2 border-white/5 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 shadow-2xl relative transition-all duration-300 group-hover:scale-110 group-hover:border-[#FF5A1F]/50">
                              <div className="absolute inset-0 bg-[#FF5A1F] opacity-0 group-hover:opacity-10 rounded-[1.5rem] md:rounded-[2rem] transition duration-300"></div>
                              <div className="relative z-10 group-hover:text-[#FF5A1F] transition-colors">{item.icon}</div>
                              <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-7 h-7 md:w-8 md:h-8 bg-[#FF5A1F] text-white font-black rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm border-2 border-[#0B0B0B] shadow-xl">
                                  {item.step}
                              </div>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight">{item.title}</h3>
                          <p className="text-[#B0B0B0] max-w-xs mx-auto text-base md:text-[1.3rem] leading-[1.6] md:leading-[1.7] font-light">
                              {item.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* ////////// Nueva Sección: Rentabilidad 2026 y Libertad Financiera - 27/05/2025 02:15 ////////// */}
      <section id="profitability" className="py-20 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 md:px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs md:text-sm font-black uppercase tracking-[0.2em]">
                <ChartIcon className="w-4 md:w-5 h-4 md:h-5" /> Tu Hoja de Ruta 2026
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0B0B0B] leading-tight tracking-tight">
                Alcanza tu <span className="text-emerald-500">Libertad Financiera</span> este mismo año
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                Con el Sistema Estratégico AM, la escalabilidad es una consecuencia de la automatización y la constancia. Hemos diseñado un plan donde, aplicando nuestras herramientas de IA, puedes proyectar un crecimiento sólido hasta alcanzar los <span className="font-bold text-[#0B0B0B]">$2,000 USD mensuales</span> en menos de 12 meses.
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-4 text-[#0B0B0B] font-bold text-base md:text-lg">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg"><CheckCircle className="w-4 md:w-5 h-4 md:h-5" /></div>
                  Crecimiento Exponencial Automatizado
                </div>
                <div className="flex items-center gap-4 text-[#0B0B0B] font-bold text-base md:text-lg">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg"><CheckCircle className="w-4 md:w-5 h-4 md:h-5" /></div>
                  Sin límites de facturación con Hotmart
                </div>
              </div>
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#0B0B0B] hover:bg-gray-800 text-white font-black text-lg md:text-xl rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 group"
              >
                Empezar mi camino <ArrowRight className="w-5 md:w-6 h-5 md:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative group mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl opacity-50 rounded-full"></div>
              <div className="relative bg-[#0B0B0B] border border-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-1000">
                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Proyección Ingresos Netos</p>
                    <p className="text-white font-black text-2xl md:text-3xl">Año 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-black text-3xl md:text-4xl">$2,000</p>
                    <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase">USD / MES (Meta Dic)</p>
                  </div>
                </div>

                <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={profitabilityData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                      <YAxis hide domain={[0, 2200]} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#161616', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                        itemStyle={{color: '#10b981', fontWeight: 'bold'}}
                        labelStyle={{color: '#9ca3af', marginBottom: '4px'}}
                        formatter={(value: any) => [`$${value} USD`, 'Ingreso']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#10b981" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorIncome)" 
                        activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#10b981' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white font-black text-lg md:text-xl leading-none">1-3</p>
                    <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase mt-1">Meses Aprendizaje</p>
                  </div>
                  <div>
                    <p className="text-emerald-400 font-black text-lg md:text-xl leading-none">4-8</p>
                    <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase mt-1">Escalamiento</p>
                  </div>
                  <div>
                    <p className="text-white font-black text-lg md:text-xl leading-none">9-12</p>
                    <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase mt-1">Libertad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ////////// Fin de sección de rentabilidad - 27/05/2025 02:15 ////////// */}

      <section id="academy" className="py-20 md:py-24 bg-[#F6F6F6] border-t border-gray-200">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 md:gap-16">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
                    <GraduationCap className="w-4 h-4" /> Formación Incluida
                </div>
                <h3 className="text-2xl md:text-5xl font-black text-[#0B0B0B] mb-6 leading-tight">
                    No solo te damos las herramientas, te enseñamos a <span className="text-indigo-600">Dominarlas</span>
                </h3>
                <p className="text-base md:text-[1.3rem] leading-[1.6] md:leading-[1.7] text-[#0B0B0B] mb-8 font-light">
                    Dentro de la plataforma tendrás acceso a nuestra **Academia VIP**. Un curso paso a paso donde aprenderás desde cómo elegir un producto ganador en Hotmart hasta cómo escalar tus ventas a miles de dólares mensuales.
                </p>
                <button
                  onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  Ver temario completo <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
                  <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-200 shadow-2xl p-6 md:p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5"><GraduationCap className="w-32 md:w-48 h-32 md:h-48 text-indigo-600" /></div>
                      <h4 className="text-lg md:text-xl font-black text-[#0B0B0B] mb-6 md:mb-8 flex items-center gap-3">
                          <List className="w-5 md:w-6 h-5 md:h-6 text-indigo-600" /> Temario del Curso
                      </h4>
                      <div className="space-y-3 md:space-y-4 relative z-10">
                          {[
                              { mod: '01', title: 'Mentalidad e Investigación de Nichos' },
                              { mod: '02', title: 'Configuración Estratégica del Sistema' },
                              { mod: '03', title: 'Dominando la IA para el Copywriting' },
                              { mod: '04', title: 'Tráfico de Pago vs Tráfico Orgánico SEO' },
                              { mod: '05', title: 'Cierre de Ventas por WhatsApp (CRM)' }
                          ].map((modulo, i) => (
                              <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-100 transition duration-300 group">
                                  <span className="text-[10px] md:text-xs font-black text-indigo-300 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{modulo.mod}</span>
                                  <span className="text-sm md:text-base font-bold text-[#0B0B0B]">{modulo.title}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ////////// Testimonios WhatsApp Rediseñados (Más altos, sin scroll, subtítulo negro) - 26/05/2025 23:55 ////////// */}
      <section id="testimonials" className="py-20 md:py-24 bg-[#EFEFEF] border-t border-gray-200 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-black mb-4 text-[#0B0B0B]">Historias de Éxito Reales</h2>
            <p className="text-lg md:text-xl text-[#0B0B0B] max-w-3xl mx-auto leading-relaxed font-black">Nuestra comunidad está logrando resultados increíbles interactuando con la IA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
            {[
              { 
                name: "Maria G.", 
                status: "En línea",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", 
                msg: "¡Chicos! No puedo creerlo. Lancé mi primera landing page con la IA ayer y ya tengo 15 registros. El copywriting es brutal, parece escrito por un experto de años.",
                reply: "¡Qué increíble Maria! 🎉 Ese es el poder de la IA cuando tiene la estrategia correcta detrás. ¡A seguir escalando ese proyecto! 🚀"
              },
              { 
                name: "Juan P.", 
                status: "En línea",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", 
                msg: "Por fin una herramienta que entiende lo que necesitamos. He generado mi web de ventas en segundos y los textos son mejores que los que yo hacía en horas.",
                reply: "Exacto Juan, la velocidad es la clave en Hotmart. Me alegra mucho que te esté ahorrando tanto tiempo. ¡A por más ventas! 💰"
              },
              { 
                name: "Ana S.", 
                status: "En línea",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", 
                msg: "Increíble cómo optimizó mis artículos para SEO. Estoy empezando a recibir tráfico orgánico desde Google sin gastar ni un dólar en anuncios.",
                reply: "¡Esa es la meta Ana! El tráfico gratis es el más rentable de todos. Sigue así, el sistema seguirá trabajando para ti. 💎"
              }
            ].map((chat, i) => (
              <div key={i} className="bg-[#E5DDD5] rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-[#0B0B0B] overflow-hidden shadow-2xl relative h-[600px] md:h-[780px] flex flex-col group hover:scale-[1.02] transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                <div className="bg-[#075E54] p-4 md:p-6 flex items-center justify-between text-white shrink-0">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-white/20 overflow-hidden shadow-md">
                      <img src={chat.img} alt={chat.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-base md:text-lg leading-tight">{chat.name}</h4>
                      <p className="text-[10px] md:text-xs opacity-80 font-medium">{chat.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 md:gap-4 opacity-70">
                    <Phone className="w-5 md:w-6 h-5 md:h-6" />
                    <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                </div>

                <div className="flex-1 p-4 md:p-6 space-y-6 md:space-y-8 overflow-hidden bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-10">
                  <div className="flex justify-start animate-in slide-in-from-left-6 duration-700">
                    <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tl-none shadow-sm max-w-[90%] relative border border-gray-100">
                      <p className="text-sm md:text-[1.2rem] text-[#0B0B0B] leading-relaxed font-medium">{chat.msg}</p>
                      <span className="text-[8px] md:text-[10px] text-gray-400 block text-right mt-2 md:mt-3 font-bold uppercase">10:45 AM</span>
                    </div>
                  </div>

                  <div className="flex justify-end animate-in slide-in-from-right-6 duration-1000 delay-500">
                    <div className="bg-[#DCF8C6] p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tr-none shadow-md max-w-[90%] relative border border-green-200">
                      <p className="text-sm md:text-[1.2rem] text-[#0B0B0B] leading-relaxed font-medium">{chat.reply}</p>
                      <span className="text-[8px] md:text-[10px] text-green-700 block text-right mt-2 md:mt-3 font-bold uppercase tracking-wider">10:46 AM ✓✓</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F0F0F0] p-4 md:p-5 flex items-center gap-2 md:gap-3 border-t border-gray-300 shrink-0">
                  <Smile className="w-6 md:w-7 h-6 md:h-7 text-gray-500" />
                  <div className="flex-1 bg-white h-10 md:h-12 rounded-full border border-gray-200 px-4 md:px-6 flex items-center text-xs md:text-sm text-gray-400 italic">Escribe...</div>
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-[#075E54] rounded-full flex items-center justify-center text-white shadow-lg"><Send className="w-5 md:w-6 h-5 md:h-6 fill-current ml-1" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ////////// Fin de actualización - 26/05/2025 23:55 ////////// */}

      {/* ////////// Nueva Sección: Preguntas Frecuentes (FAQ) - 27/05/2025 10:00 ////////// */}
      <section id="faq" className="py-20 md:py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle className="w-4 h-4" /> Despeja tus dudas
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-[#0B0B0B]">Preguntas <span className="text-[#FF5A1F]">Frecuentes</span></h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            {[
              { q: "¿Cómo funciona exactamente la IA para vender en Hotmart?", a: "Nuestra IA analiza los patrones de compra más exitosos en Hotmart para redactar copys persuasivos, estructurar embudos de alta conversión y generar contenido que atrae tráfico cualificado de forma automática." },
              { q: "¿Necesito conocimientos técnicos previos para abrir mi cuenta?", a: "Absolutamente no. Hemos diseñado la interfaz para que sea tan intuitiva como enviar un mensaje por WhatsApp. No necesitas saber programar ni diseñar; la IA hace el trabajo pesado por ti." },
              { q: "¿El sistema garantiza resultados inmediatos?", a: "Ningún sistema serio garantiza resultados de la noche a la mañana. Sin embargo, nuestro sistema reduce drásticamente el tiempo de implementación, permitiéndote lanzar y validar ofertas profesionales en minutos en lugar de semanas." },
              { q: "¿Puedo usar mis propios dominios para las páginas?", a: "Sí, en nuestros planes Pro y Max puedes conectar tus propios dominios personalizados (.com, .net, etc.) para profesionalizar tu marca y aumentar la confianza de tus compradores." },
              { q: "¿Qué tipo de soporte recibo al registrarme gratis?", a: "Incluso con la cuenta gratuita, tienes acceso a nuestra documentación de ayuda y a nuestra comunidad exclusiva en WhatsApp, donde podrás interactuar con otros emprendedores exitosos." }
            ].map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 text-left flex justify-between items-center group transition-all"
                >
                  <span className="text-base md:text-lg font-bold text-[#0B0B0B] group-hover:text-[#FF5A1F] transition-colors pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#FF5A1F] shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 md:px-8 pb-6 md:pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ////////// Fin de actualización - 27/05/2025 10:00 ////////// */}

      {/* ////////// Nueva Sección CTA Final para Registro Gratis - 01/01/2026 00:00 ////////// */}
      <section id="cta-final-register" className="py-24 md:py-32 bg-white relative overflow-hidden border-t border-gray-50">
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-10">
            <Zap className="w-4 md:w-5 h-4 md:w-5" /> Comienza tu Viaje hoy
          </div>
          <h2 className="text-3xl md:text-7xl font-black text-[#0B0B0B] leading-tight mb-8 md:mb-10">
            ¿Listo para construir tu <span className="text-[#FF5A1F]">Imperio Digital?</span>
          </h2>
          <p className="text-lg md:text-[1.5rem] leading-[1.6] md:leading-[1.7] text-gray-600 mb-12 md:mb-14 font-light max-w-3xl mx-auto">
            Únete a cientos de emprendedores que ya están automatizando sus ventas con Aprende.Marketing. El registro es 100% gratuito y sin tarjetas.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button
              onClick={() => user ? navigate('/dashboard') : navigate('/register')}
              className="w-full sm:w-auto px-12 md:px-16 py-6 md:py-8 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl md:text-2xl rounded-[2rem] transition-all shadow-[0_25px_50px_-12px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4"
            >
              Crear mi cuenta gratis <ArrowRight className="w-7 md:w-8 h-7 md:h-8" />
            </button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs opacity-60">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Sin tarjetas</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Acceso IA</span>
            <span className="flex items-center gap-2"><Repeat className="w-4 h-4" /> Cancela cuando quieras</span>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-[40rem] h-[40rem] bg-[#FF5A1F]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
      </section>
      {/* ////////// Fin de actualización - 01/01/2026 00:00 ////////// */}

      {/* ////////// Footer Refinado con textos más grandes y limpieza de enlaces - 27/05/2025 10:00 ////////// */}
      <footer id="footer" className="bg-[#0B0B0B] border-t border-white/5 pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
             <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-4">
                  {/* ////////// Actualización: Logo Footer AM - 27/05/2025 02:15 ////////// */}
                  <div className="w-12 md:w-14 h-10 md:h-12 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-xl md:text-2xl shadow-lg shadow-[#FF5A1F]/20 px-2">AM</div>
                  {/* ////////// Fin de actualización - 27/05/2025 02:15 ////////// */}
                  <span className="text-2xl md:text-3xl font-black text-white tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></span>
                </div>
                <p className="text-[#B0B0B0] leading-relaxed text-base md:text-lg font-light">
                  La plataforma definitiva para afiliados y productores que buscan escalar su facturación utilizando Inteligencia Artificial y Embudos Automatizados de alto impacto.
                </p>
                {/* ////////// Actualización: Iconos Redes Sociales Facebook, Instagram, YouTube - 27/05/2025 01:45 ////////// */}
                <div className="flex gap-4 md:gap-6">
                   <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group shadow-lg">
                      <Facebook className="w-5 md:w-6 h-5 md:h-6 text-[#B0B0B0] group-hover:text-white transition-colors" />
                   </div>
                   <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group shadow-lg">
                      <Instagram className="w-5 md:w-6 h-5 md:h-6 text-[#B0B0B0] group-hover:text-white transition-colors" />
                   </div>
                   <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group shadow-lg">
                      <Youtube className="w-5 md:w-6 h-5 md:h-6 text-[#B0B0B0] group-hover:text-white transition-colors" />
                   </div>
                </div>
                {/* ////////// Fin de actualización - 27/05/2025 01:45 ////////// */}
             </div>

             <div className="mt-8 md:mt-0">
                <h4 className="text-white font-black text-lg md:text-xl mb-6 md:mb-10 uppercase tracking-[0.2em] opacity-60">Producto</h4>
                <ul className="space-y-4 md:space-y-6 text-lg md:text-xl text-[#B0B0B0]">
                  <li><button onClick={() => scrollToSection('features')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Herramientas IA</button></li>
                  <li><button onClick={() => navigate('/register')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Registrate Gratis</button></li>
                  <li><button onClick={() => scrollToSection('process')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> ¿Cómo Funciona?</button></li>
                  <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Casos de Éxito</button></li>
                </ul>
             </div>

             <div className="mt-8 md:mt-0">
                <h4 className="text-white font-black text-lg md:text-xl mb-6 md:mb-10 uppercase tracking-[0.2em] opacity-60">Recursos</h4>
                <ul className="space-y-4 md:space-y-6 text-lg md:text-xl text-[#B0B0B0]">
                  <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Blog de Marketing</a></li>
                  <li><button onClick={() => scrollToSection('academy')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Academia VIP</button></li>
                </ul>
             </div>

             <div className="mt-8 md:mt-0">
                <h4 className="text-white font-black text-lg md:text-xl mb-6 md:mb-10 uppercase tracking-[0.2em] opacity-60">Soporte</h4>
                <ul className="space-y-4 md:space-y-6 text-lg md:text-xl text-[#B0B0B0]">
                  <li><button onClick={() => navigate('/contacto')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Contactar con Ventas</button></li>
                  <li><button onClick={() => navigate('/terminos')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Términos y Condiciones</button></li>
                  <li><button onClick={() => navigate('/privacidad')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Política de Privacidad</button></li>
                </ul>
             </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[#B0B0B0]/50 text-xs md:text-sm text-center md:text-left font-medium max-w-2xl">
                  &copy; {new Date().getFullYear()} Aprende.Marketing. Todos los derechos reservados. Hotmart® es una marca registrada de Launch Pad Tecnologia, S.A. No tenemos relación oficial con Hotmart®.
              </p>
              <div className="flex gap-8 text-[11px] font-black text-[#B0B0B0]/30 uppercase tracking-[0.4em]">
              </div>
          </div>
        </div>
      </footer>
      {/* ////////// Fin de actualización - 27/05/2025 10:00 ////////// */}
    </div>
  );
};

////////// Componente Interno auxiliar: HelpCircle - 27/05/2025 10:00 //////////
const HelpCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
////////// Fin de componente interno - 27/05/2025 10:00 //////////
