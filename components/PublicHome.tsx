
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowRight, LayoutDashboard, LogOut, Play, 
  Layout, MessageCircle, PenTool, Search, Briefcase, Mail, Users, BarChart, Link as LinkIcon,
  CheckCircle, Zap, Shield, Rocket, Bot, Server, Star, Target, Globe, Gift, ChevronRight, TrendingUp, X, Menu, Smartphone, Cpu, Repeat, Phone, MoreVertical, Send, Smile, BookOpen, GraduationCap,
  List, Facebook, Instagram, Youtube, TrendingUp as ChartIcon, DollarSign, Calendar, ChevronDown, ChevronUp, Box, ExternalLink, ThumbsUp
} from 'lucide-react';
////////// Importación de Recharts para gráfica de ingresos - 27/05/2025 02:15 //////////
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
////////// Fin de actualización - 27/05/2025 02:15 //////////
import { User, Plan } from '../types';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import productMicrobladingImg from '../src/assets/images/product_microblading_1794650768316.jpg';
import productResinaImg from '../src/assets/images/product_resina_1794650768769.jpg';
import productCaninoImg from '../src/assets/images/product_canino_1794650768945.jpg';
import productReposteriaImg from '../src/assets/images/product_reposteria_1794650770796.jpg';

interface PublicHomeProps {
  user: User | null;
  onLogout?: () => void;
}

interface MarqueeProductItem {
  id: string;
  name: string;
  niche: string;
  description: string;
  imageUrl: string;
  fallbackImg: string;
  fullPrice: number;
  commissionRate: number;
}

const FALLBACK_MARQUEE_PRODUCTS: MarqueeProductItem[] = [
  {
    id: 'cat-microblading',
    name: 'Masterclass Microblading Pro',
    niche: 'Belleza y Estética',
    description: 'Certificación paso a paso en diseño de cejas pelo a pelo con alta demanda y excelente margen de comisión en Hotmart.',
    imageUrl: productMicrobladingImg,
    fallbackImg: productMicrobladingImg,
    fullPrice: 200,
    commissionRate: 0.65
  },
  {
    id: 'cat-resina',
    name: 'Diseño de Joyas con Resina Epóxica',
    niche: 'Manualidades y Arte',
    description: 'Aprende a crear accesorios y piezas decorativas en resina desde casa para convertir una habilidad creativa en negocio rentable.',
    imageUrl: productResinaImg,
    fallbackImg: productResinaImg,
    fullPrice: 79,
    commissionRate: 0.70
  },
  {
    id: 'cat-canino',
    name: 'Educación Canina en Casa VIP',
    niche: 'Mascotas y Bienestar',
    description: 'Programa práctico para corregir conductas difíciles y entrenar perros sin estrés, uno de los nichos evergreen más vendidos.',
    imageUrl: productCaninoImg,
    fallbackImg: productCaninoImg,
    fullPrice: 67,
    commissionRate: 0.60
  },
  {
    id: 'cat-reposteria',
    name: 'Repostería Francesa desde Cero',
    niche: 'Gastronomía y Negocios',
    description: 'Domina postres gourmet, entremets y decoración moderna listos para comercializar por encargo desde tu propia cocina.',
    imageUrl: productReposteriaImg,
    fallbackImg: productReposteriaImg,
    fullPrice: 97,
    commissionRate: 0.65
  },
  {
    id: 'cat-cejas-laminado',
    name: 'Especialista en Cejas y Laminado',
    niche: 'Belleza y Estética',
    description: 'Técnicas actuales de visajismo, perfilado y laminado con embudo optimizado para captar clientes locales o digitales.',
    imageUrl: productMicrobladingImg,
    fallbackImg: productMicrobladingImg,
    fullPrice: 89,
    commissionRate: 0.70
  },
  {
    id: 'cat-mesas-resina',
    name: 'Porcelanato Líquido y Resina Pro',
    niche: 'Oficios Rentables',
    description: 'Capacitación técnica para recubrimientos de alto impacto visual con guiones virales y landing de captura preconfigurada.',
    imageUrl: productResinaImg,
    fallbackImg: productResinaImg,
    fullPrice: 120,
    commissionRate: 0.60
  }
];


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
  const [marqueeProducts, setMarqueeProducts] = useState<MarqueeProductItem[]>(FALLBACK_MARQUEE_PRODUCTS);
  const [failedProductImages, setFailedProductImages] = useState<Record<string, boolean>>({});
  
  ////////// Estado para el menú móvil - 27/05/2025 10:00 //////////
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const socialComments = [
    {
      id: 'c1',
      name: 'Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      comment: 'Al principio dudaba porque no sé nada de programación ni de diseñar páginas web, pero seguí el paso a paso del asistente y en menos de 15 minutos ya tenía mi proyecto y mi página de captura montada. Súper intuitivo todo.',
      likes: 47,
      time: 'Hace 2 h',
      reply: {
        id: 'r1',
        name: 'Jorge Franco',
        avatar: '/assets/aistudio/image_5e33d763.png',
        text: '¡Excelente Carlos! Justamente diseñamos la plataforma para que no pierdas tiempo peleando con código o diseños complicados y te enfoques en lanzar rápido. ¡Éxitos con tu embudo!',
        likes: 84,
        time: 'Hace 1 h'
      }
    },
    {
      id: 'c2',
      name: 'Laura Martínez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      comment: 'Confieso que pensé que al darle al botón me iban a pedir tarjeta de crédito al instante, pero me registré gratis sin problema. Ya revisé la guía de implementación, elegí uno de los productos analizados de belleza y hoy capturé mis primeros 14 prospectos.',
      likes: 39,
      time: 'Hace 4 h',
      reply: {
        id: 'r2',
        name: 'Jorge Franco',
        avatar: '/assets/aistudio/image_5e33d763.png',
        text: '¡Bienvenida Laura! Nos alegra mucho que ya estés viendo tus primeros registros. Sigue el paso a paso de la etapa 2 tal como mostramos en los videos y verás cómo escala.',
        likes: 61,
        time: 'Hace 3 h'
      }
    },
    {
      id: 'c3',
      name: 'Andrés Ramírez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      comment: 'Yo había comprado dos cursos antes donde te explican pura teoría pero te dejan solo frente a la pantalla. Aquí la gran diferencia es que ya está todo en un solo lugar: el producto analizado, los guiones para redes, la página y los mensajes de seguimiento listos para copiar.',
      likes: 52,
      time: 'Hace 6 h',
      reply: {
        id: 'r3',
        name: 'Jorge Franco',
        avatar: '/assets/aistudio/image_5e33d763.png',
        text: 'Totalmente de acuerdo Andrés, la diferencia está en tener las herramientas listas para implementar desde el día uno. ¡A darle con todo!',
        likes: 73,
        time: 'Hace 5 h'
      }
    },
    {
      id: 'c4',
      name: 'Sofía Herrera',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      comment: 'Trabajo todo el día en oficina y tengo dos hijos, así que solo tengo un par de horas libres en la noche. Tener los prompts, los videos cortos y las plantillas ya estructuradas me ahorró semanas de trabajo. Muy recomendada la plataforma.',
      likes: 28,
      time: 'Hace 1 día',
      reply: {
        id: 'r4',
        name: 'Jorge Franco',
        avatar: '/assets/aistudio/image_5e33d763.png',
        text: 'Qué orgullo leer esto Sofía. Con constancia en esas horas libres y el sistema trabajando para ti se logran grandes cosas. ¡Un abrazo y seguimos avanzando!',
        likes: 45,
        time: 'Hace 22 h'
      }
    },
    {
      id: 'c5',
      name: 'Julián Torres',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      comment: 'Llevo tres semanas aplicando la estrategia orgánica con el proyecto que elegí dentro de la plataforma. Esta semana cerré mis primeras comisiones en Hotmart usando la guía de WhatsApp y la secuencia de correos. ¡Gracias por compartir este sistema!',
      likes: 64,
      time: 'Hace 2 días',
      reply: {
        id: 'r5',
        name: 'Jorge Franco',
        avatar: '/assets/aistudio/image_5e33d763.png',
        text: '¡Felicitaciones Julián! Esas primeras ventas son la confirmación de que el método funciona cuando se ejecuta paso a paso. Ahora a seguir alimentando tus canales.',
        likes: 91,
        time: 'Hace 1 día'
      }
    }
  ];
  
  // Estados para el efecto premium interactivo de la sección Hero sin imágenes
  const [heroMousePos, setHeroMousePos] = useState({ x: 0, y: 0 });
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHeroMousePos({ x, y });
  };
  ////////// Fin de actualización - 27/05/2025 10:00 //////////

  useEffect(() => {
      api.getPublicPlans()
         .then(setPlans)
         .catch(err => console.error("Error loading plans:", err));

      api.getPublicMasterProducts()
         .then((serverProducts) => {
            if (Array.isArray(serverProducts) && serverProducts.length > 0) {
              const fallbackCycle = [productMicrobladingImg, productResinaImg, productCaninoImg, productReposteriaImg];
              const mapped: MarqueeProductItem[] = serverProducts.map((p, idx) => {
                const fallbackAsset = fallbackCycle[idx % fallbackCycle.length];
                return {
                  id: p.id,
                  name: p.name,
                  niche: p.niche || 'Producto Digital',
                  description: p.shortDescription || p.description || 'Producto validado con embudo, página de captura y contenido listo para impulsar tus comisiones.',
                  imageUrl: p.imageUrl || fallbackAsset,
                  fallbackImg: fallbackAsset,
                  fullPrice: p.fullPrice || 0,
                  commissionRate: p.commissionRate || 0.6
                };
              });
              // Si hay menos de 6 productos en la BD, completamos con el catálogo curado para que la marquesina se vea fluida
              const combined = mapped.length >= 6
                ? mapped
                : [
                    ...mapped,
                    ...FALLBACK_MARQUEE_PRODUCTS.filter(
                      (fp) => !mapped.some((mp) => mp.name.toLowerCase() === fp.name.toLowerCase())
                    )
                  ];
              setMarqueeProducts(combined);
            }
         })
         .catch(err => console.error("Error loading public master products:", err));
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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
        @keyframes marqueeTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeTrackReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeTrack 48s linear infinite;
        }
        .animate-marquee-track-reverse {
          display: flex;
          width: max-content;
          animation: marqueeTrackReverse 52s linear infinite;
        }
        .marquee-wrapper:hover .animate-marquee-track,
        .marquee-wrapper:hover .animate-marquee-track-reverse {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-track,
          .animate-marquee-track-reverse {
            animation: none;
          }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
      {/* ////////// Fin de actualización - 03/06/2025 15:45 ////////// */}

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 sm:w-12 md:w-14 h-8 sm:h-9 md:h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-bold text-white text-base sm:text-lg md:text-xl shadow-lg shadow-[#FF5A1F]/20 px-2 shrink-0">AM</div>
            <span className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white whitespace-nowrap shrink-0">Aprende.<span className="text-[#B0B0B0] font-normal">Marketing</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-base font-medium text-white">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#FF5A1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Inicio</button>
            <button type="button" onClick={() => scrollToSection('products-marquee')} className="hover:text-[#FF5A1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Productos</button>
            <button type="button" onClick={() => scrollToSection('footer')} className="hover:text-[#FF5A1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer">Blog</button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <>
                 <span className="hidden lg:block text-sm text-[#B0B0B0] whitespace-nowrap">Hola, <span className="text-white font-bold">{user.name}</span></span>
                   <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-white/10 text-white border border-white/10 font-bold hover:bg-[#FF5A1F] transition text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                   >
                     <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Panel</span>
                   </button>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white hover:bg-gray-100 text-[#0B0B0B] font-bold text-xs sm:text-sm rounded-xl transition-all duration-150 shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Acceso
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-150 shadow-lg shadow-[#FF5A1F]/25 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Registro
                </button>
              </div>
            )}
            
            {/* ////////// Botón Hamburguesa Móvil - 27/05/2025 15:30 ////////// */}
            <button 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#FF5A1F] hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="w-7 h-7 text-[#FF5A1F]" /> : <Menu className="w-7 h-7 text-white" />}
            </button>
            {/* ////////// Fin de actualización - 27/05/2025 15:30 ////////// */}
          </div>
        </div>
      </nav>

      {/* ////////// Menú Móvil Pantalla Completa (Renderizado mediante Portal en document.body) ////////// */}
      {isMenuOpen && createPortal(
        <div 
          className="lg:hidden fixed inset-0 z-[999999] bg-[#07090E] text-white flex flex-col w-full h-full min-h-screen overflow-y-auto animate-in fade-in duration-200"
          style={{ backgroundColor: '#07090E', zIndex: 999999 }}
        >
          <div className="w-full min-h-screen bg-[#07090E] p-4 sm:p-6 flex flex-col justify-between">
            {/* Cabecera del menú móvil con logo y botón cerrar */}
            <div className="flex justify-between items-center mb-3 shrink-0 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-bold text-white text-base px-2 shadow-lg shadow-[#FF5A1F]/20">
                  AM
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Aprende.<span className="text-[#FF5A1F]">Marketing</span>
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setIsMenuOpen(false)} 
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-[#FF5A1F] transition-colors border border-white/20 cursor-pointer flex items-center justify-center"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Enlaces de navegación táctiles y compactos */}
            <div className="flex flex-col gap-2.5 my-auto py-2">
              <button 
                type="button"
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }} 
                className="text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-base font-bold text-white hover:text-[#FF5A1F] transition-all border border-white/5 flex justify-between items-center cursor-pointer"
              >
                <span>Inicio</span> 
                <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
              </button>
              <button 
                type="button"
                onClick={() => { scrollToSection('products-marquee'); setIsMenuOpen(false); }} 
                className="text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-base font-bold text-white hover:text-[#FF5A1F] transition-all border border-white/5 flex justify-between items-center cursor-pointer"
              >
                <span>Productos</span> 
                <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
              </button>
              <button 
                type="button"
                onClick={() => { scrollToSection('footer'); setIsMenuOpen(false); }} 
                className="text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-base font-bold text-white hover:text-[#FF5A1F] transition-all border border-white/5 flex justify-between items-center cursor-pointer"
              >
                <span>Blog</span> 
                <ChevronRight className="w-4 h-4 text-[#FF5A1F]" />
              </button>
            </div>

            {/* Acciones principales del menú */}
            <div className="mt-auto pt-3 border-t border-white/10 space-y-2.5 shrink-0">
              {user ? (
                <button
                  type="button"
                  onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-base rounded-xl shadow-xl shadow-[#FF5A1F]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-5 h-5" /> Ir al Panel de Control
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                    className="w-full py-3 bg-white hover:bg-gray-100 text-[#0B0B0B] font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Acceso
                  </button>
                  <button
                    type="button"
                    onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
                    className="w-full py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#FF5A1F]/25 transition-colors cursor-pointer"
                  >
                    Registro
                  </button>
                </div>
              )}
              
              <p className="pt-1 text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                Aprende.Marketing • Aprende | Implementa | Escala
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Hero Section - DARK BACKGROUND WITH COSMIC SUPERNOVA & AI EFFECTS */}
      <header 
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        className="relative pt-36 pb-20 lg:pt-52 lg:pb-36 z-10 overflow-hidden bg-[#020203] transition-all duration-1000"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #150f1e 0%, #08070d 60%, #020203 100%)',
        }}
      >
        {/* Pulsing Supernova - Stellar Explosion Glow Core */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-r from-orange-600 via-[#FF5A1F] to-pink-600 rounded-full blur-[220px] opacity-30 animate-pulse duration-[8000ms] pointer-events-none mix-blend-screen z-0" />
        
        {/* Glow interactivo que sigue el mouse con colores cambiantes y dinámicos */}
        {isHeroHovered && (
          <div 
            className="absolute pointer-events-none transition-all duration-300 ease-out rounded-full blur-[130px] z-0"
            style={{
              left: heroMousePos.x - 300,
              top: heroMousePos.y - 300,
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(255,90,31,0.22) 0%, rgba(139,92,246,0.15) 50%, rgba(236,72,153,0) 100%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Ambient Nebula Light & Stars dust */}
            <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-white rounded-full opacity-60 animate-ping duration-[4000ms]" />
            <div className="absolute top-[40%] right-[20%] w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-40 animate-ping duration-[6000ms]" />
            <div className="absolute bottom-[30%] left-[30%] w-1 h-1 bg-pink-400 rounded-full opacity-50 animate-ping duration-[5000ms]" />
            <div className="absolute top-[10%] right-[40%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse duration-[9000ms]" />
            <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] bg-[#FF5A1F]/5 rounded-full blur-[120px] animate-pulse duration-[11000ms]" />
        </div>

        <div className="container mx-auto px-6 relative max-w-5xl text-center z-10">
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
            
            {/* Badge superior */}
            <div className="mx-auto inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-black uppercase tracking-widest mb-8 w-fit animate-fade-in-up">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF5A1F] animate-pulse"></span>
              <span>Plataforma para afiliados de Hotmart</span>
            </div>

            {/* Título de Gran Impacto Centrado */}
            <h1 className="text-[2.8rem] sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight text-white leading-[1.1] animate-fade-in-up">
              Conoce el sistema paso a paso para construir ingresos reales en <span className="text-[#FF5A1F] bg-gradient-to-r from-[#FF5A1F] via-orange-400 to-[#FF5A1F] bg-clip-text text-transparent animate-gradient-shift">Hotmart sin empezar desde cero</span>
            </h1>

            {/* Descripción Centrada - Blanco, más grande y muy legible */}
            <p className="text-white font-medium text-xl sm:text-2xl leading-relaxed md:leading-relaxed mt-6 max-w-3xl mx-auto animate-fade-in-up drop-shadow-md">
              Elige un producto analizado, crea tu página y automatiza tu contenido y seguimiento desde una sola plataforma.
            </p>

            {/* Micro-llamado directo al video */}
            <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm sm:text-base font-bold text-white animate-fade-in-up">
              <Play className="w-4 h-4 text-[#FF5A1F] fill-[#FF5A1F] shrink-0" />
              <span>
                Mira el paso a paso gratis: <span className="text-[#FF5A1F]">¡Dale Play al video</span> antes de crear tu cuenta!
              </span>
            </div>

            {/* Video Explicativo con youtube-nocookie.com */}
            <div className="mt-6 mb-10 w-full max-w-4xl mx-auto animate-fade-in-up">
              <div className="relative bg-[#0E0E12] border-2 border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/80 aspect-video flex items-center justify-center">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/x4NdPhJTXxM?rel=0&autoplay=0"
                  title="Video de Bienvenida Aprende Marketing"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Botón CTA con el diseño de la página de bienvenida y texto perfectamente centrado */}
            <div className="flex flex-col items-center animate-fade-in-up w-full max-w-xl mx-auto">
              <a
                href={user ? "/dashboard" : "/register"}
                onClick={(e) => {
                  e.preventDefault();
                  if (user) {
                    navigate('/dashboard');
                  } else {
                    navigate('/register');
                  }
                }}
                className="relative w-full py-5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-[#FF5A1F] via-[#FF6D2E] to-[#E04810] hover:brightness-110 text-white font-black text-base sm:text-xl uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#FF5A1F]/40 border border-white/20 flex items-center justify-center group cursor-pointer select-none overflow-hidden"
              >
                {/* Icono Cohete a la izquierda */}
                <div className="absolute left-4 sm:left-6 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner shrink-0">
                  <Rocket className="w-5 h-5 fill-white/20" />
                </div>
                
                {/* Texto centrado en el botón */}
                <span className="leading-snug text-center font-black text-base sm:text-xl uppercase tracking-wider text-white px-12">
                  Crear mi cuenta gratis
                </span>

                {/* Icono Flecha/External a la derecha */}
                <div className="absolute right-4 sm:right-6 hidden sm:flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </div>
              </a>
              
              {/* Opción de Login para usuarios con cuenta (Imagen 4) */}
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-2 text-white font-medium text-sm sm:text-base justify-center bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">
                <span>¿Ya tienes una cuenta registrada?</span>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-[#FF5A1F] hover:text-orange-400 font-extrabold underline underline-offset-4 transition-colors flex items-center gap-1"
                >
                  <span>¡Inicia sesión aquí!</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 text-zinc-400 font-medium text-xs justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Sin tarjeta de crédito. Configura tu primer proyecto paso a paso.</span>
              </div>
            </div>

            {/* Bloque de Comentarios Sociales estilo Facebook */}
            <div id="social-comments" className="mt-12 w-full max-w-3xl mx-auto bg-white text-[#1C1E21] rounded-2xl border border-gray-200 shadow-2xl p-5 sm:p-7 text-left animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#1C1E21]">34 comentarios</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>Comentarios destacados</span>
                </div>
              </div>

              <div className="space-y-6">
                {socialComments.map((item) => {
                  const isCommentLiked = !!likedIds[item.id];
                  const isReplyLiked = !!likedIds[item.reply.id];
                  const commentLikesCount = item.likes + (isCommentLiked ? 1 : 0);
                  const replyLikesCount = item.reply.likes + (isReplyLiked ? 1 : 0);

                  return (
                    <div key={item.id} className="space-y-3">
                      {/* Comentario principal del usuario */}
                      <div className="flex items-start gap-3">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="bg-[#F0F2F5] rounded-2xl px-3.5 py-2.5">
                            <div className="font-bold text-[13px] sm:text-sm text-[#385898] hover:underline cursor-pointer">
                              {item.name}
                            </div>
                            <p className="text-[13px] sm:text-sm text-[#1C1E21] leading-snug mt-0.5 font-normal">
                              {item.comment}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 px-2 text-xs text-[#65676B]">
                            <button
                              type="button"
                              onClick={() => toggleLike(item.id)}
                              className={`font-semibold hover:underline cursor-pointer ${isCommentLiked ? 'text-[#1877F2]' : 'text-[#385898]'}`}
                            >
                              Me gusta
                            </button>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1 text-[#65676B]">
                              <span className="w-4 h-4 rounded-full bg-[#1877F2] inline-flex items-center justify-center text-white">
                                <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                              </span>
                              <span>{commentLikesCount}</span>
                            </span>
                            <span>·</span>
                            <span>{item.time}</span>
                          </div>

                          {/* Respuesta de Jorge Franco */}
                          <div className="mt-3 pl-3 sm:pl-4 border-l-2 border-gray-200 flex items-start gap-2.5">
                            <img
                              src={item.reply.avatar}
                              alt={item.reply.name}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0 border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="bg-[#F0F2F5] rounded-2xl px-3.5 py-2.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-[13px] sm:text-sm text-[#385898]">
                                    {item.reply.name}
                                  </span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1877F2]/10 text-[#1877F2]">
                                    Autor
                                  </span>
                                </div>
                                <p className="text-[13px] sm:text-sm text-[#1C1E21] leading-snug mt-0.5 font-normal">
                                  {item.reply.text}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 px-2 text-xs text-[#65676B]">
                                <button
                                  type="button"
                                  onClick={() => toggleLike(item.reply.id)}
                                  className={`font-semibold hover:underline cursor-pointer ${isReplyLiked ? 'text-[#1877F2]' : 'text-[#385898]'}`}
                                >
                                  Me gusta
                                </button>
                                <span>·</span>
                                <span className="inline-flex items-center gap-1 text-[#65676B]">
                                  <span className="w-4 h-4 rounded-full bg-[#1877F2] inline-flex items-center justify-center text-white">
                                    <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                                  </span>
                                  <span>{replyLikesCount}</span>
                                </span>
                                <span>·</span>
                                <span>{item.reply.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-3.5 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                  Plugin de comentarios sociales
                </span>
                <span>Aprende.Marketing</span>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Sección Marquesina de Productos Disponibles en la Plataforma */}
      <section id="products-marquee" className="py-20 md:py-24 bg-[#07090E] border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl mb-12 md:mb-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#FF5A1F]">
            Catálogo listo para vender
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-3 leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Productos analizados, <span className="text-[#FF5A1F]">listos para elegir hoy.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#B0B0B0] mt-4 leading-relaxed font-normal">
            Cada producto que añadimos a la plataforma viene con su investigación de mercado, página de captura, secuencias de seguimiento y guiones listos para que empieces en minutos.
          </p>
        </div>

        {/* Doble carril de marquesina con pausa al pasar el cursor */}
        <div className="marquee-wrapper relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-28 bg-gradient-to-r from-[#07090E] to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-28 bg-gradient-to-l from-[#07090E] to-transparent z-20" />

          {(() => {
            const half = Math.ceil(marqueeProducts.length / 2);
            const row1 = marqueeProducts.slice(0, half);
            const row2 = marqueeProducts.slice(half).length > 0 ? marqueeProducts.slice(half) : marqueeProducts;

            const renderProductCard = (product: MarqueeProductItem, keyPrefix: string, idx: number) => {
              const imgFailed = !!failedProductImages[`${product.id}-${idx}`];
              const resolvedSrc = imgFailed ? product.fallbackImg : (product.imageUrl || product.fallbackImg);
              const commissionPct = product.commissionRate
                ? Math.round(product.commissionRate <= 1 ? product.commissionRate * 100 : product.commissionRate)
                : 65;

              return (
                <div
                  key={`${keyPrefix}-${product.id}-${idx}`}
                  className="w-[330px] sm:w-[540px] shrink-0 bg-[#111319] border border-white/10 hover:border-[#FF5A1F]/45 rounded-2xl p-4 sm:p-5 transition-colors duration-200 flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch shadow-xl"
                >
                  {/* Imagen del producto */}
                  <div className="w-full sm:w-44 aspect-[4/3] sm:aspect-auto sm:min-h-[196px] shrink-0 rounded-xl overflow-hidden bg-[#191B23] relative">
                    <img
                      src={resolvedSrc}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={() => setFailedProductImages(prev => ({ ...prev, [`${product.id}-${idx}`]: true }))}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Información y sistema incluido */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium whitespace-nowrap overflow-hidden">
                        <span className="truncate">{product.niche}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#FF5A1F] font-semibold tabular-nums shrink-0">{commissionPct}% comisión</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug mt-1 line-clamp-1 whitespace-normal">
                        {product.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-1.5 line-clamp-2 whitespace-normal font-normal">
                        {product.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[11px] font-semibold text-gray-400 mb-2">
                          Sistema listo en la plataforma:
                        </p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-gray-200 font-medium">
                          <div className="flex items-center gap-1.5 truncate">
                            <Cpu className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                            <span className="truncate">Estrategia IA</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Layout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">Página de Captura</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Guiones Reels / TikTok</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span className="truncate">Email & WhatsApp</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(user ? '/dashboard/projects' : '/register')}
                      className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-extrabold text-xs sm:text-sm tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>Quiero este producto</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-5">
                <div className="animate-marquee-track gap-5">
                  {[...row1, ...row1].map((item, i) => renderProductCard(item, 'r1', i))}
                </div>
                <div className="animate-marquee-track-reverse gap-5">
                  {[...row2, ...row2].map((item, i) => renderProductCard(item, 'r2', i))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* CTA debajo de la marquesina */}
        <div className="container mx-auto px-6 mt-12 md:mt-14 text-center relative z-10">
          <button
            type="button"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            className="px-8 sm:px-12 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#E04810] hover:brightness-110 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-2xl shadow-[#FF5A1F]/35 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Crear mi cuenta gratis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-3 text-xs sm:text-sm text-gray-400 font-medium">
            Sin tarjeta de crédito · Elige tu producto ganador y lanza tu proyecto hoy
          </p>
        </div>
      </section>

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
                  <li><button onClick={() => scrollToSection('products-marquee')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Catálogo de Productos</button></li>
                  <li><button onClick={() => navigate('/register')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Regístrate Gratis</button></li>
                  <li><button onClick={() => scrollToSection('process')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> ¿Cómo Funciona?</button></li>
                  <li><button onClick={() => scrollToSection('social-comments')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Testimonios</button></li>
                </ul>
             </div>

             <div className="mt-8 md:mt-0">
                <h4 className="text-white font-black text-lg md:text-xl mb-6 md:mb-10 uppercase tracking-[0.2em] opacity-60">Recursos</h4>
                <ul className="space-y-4 md:space-y-6 text-lg md:text-xl text-[#B0B0B0]">
                  <li><button onClick={() => scrollToSection('profitability')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Hoja de Ruta</button></li>
                  <li><button onClick={() => navigate('/register')} className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 font-bold"><ChevronRight className="w-4 h-4 text-[#FF5A1F]" /> Crear Cuenta Gratis</button></li>
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


