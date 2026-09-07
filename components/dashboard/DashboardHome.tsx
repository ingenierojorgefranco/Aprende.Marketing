import React, { useEffect, useState } from 'react';
import { 
    ChevronRight, ArrowRight, Play, Users, PlayCircle, Clock, Award, 
    CreditCard, Folder, CheckCircle2, Bot,
    ShieldCheck, Smartphone, Zap, Sparkles, Image as ImageIcon,
    BookOpen, HelpCircle, Video, Compass, Crown
} from 'lucide-react';
import { api } from '../../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, Project } from '../../types';
import { NewsHistoryModal } from './NewsHistoryModal';

interface DashboardContext {
    user: User;
    pageCount: number;
    projectCount: number;
    articleCount: number;
    setShowProfileModal: (show: boolean) => void;
}

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, setShowProfileModal, projectCount } = useOutletContext() as DashboardContext;

  const [summaryData, setSummaryData] = useState({
      totalVisits: 0,
      totalConversions: 0,
      totalPages: 0,
      conversionRate: '0'
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [academyCourses, setAcademyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [summary, userProjects, courses] = await Promise.all([
                api.getAnalyticsSummary(),
                api.getProjects(),
                api.getCoursesList()
            ]);

            setProjects(userProjects || []);
            setAcademyCourses((courses || []).slice(0, 3));

            const rate = summary.totalVisits > 0 
                ? ((summary.totalConversions / summary.totalVisits) * 100).toFixed(1) 
                : '0';
                
            setSummaryData({
                totalVisits: summary.totalVisits,
                totalConversions: summary.totalConversions,
                totalPages: summary.totalPages,
                conversionRate: rate
            });

        } catch (error) {
            console.error("Error cargando dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  const planName = user?.planLimits?.planName || 'Starter';
  const isFree = planName.toLowerCase() === 'starter' || planName.toLowerCase() === 'gratis';
  const maxProjects = user?.planLimits?.maxProjects || 3;
  
  

  return (
    <div className="space-y-8 text-white animate-in fade-in slide-in-from-bottom-6 duration-700 bg-[#030712] min-h-screen pb-12">
      
      {/* 1. HEADER HERO */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#FF5A1F]/20 bg-gradient-to-r from-[#0F172A] via-[#0B1120] to-[#1A0C06] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FF5A1F]/10 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      ¡Hola, {user?.name ? user.name.split(' ')[0] : 'Equipo Aprende.Marketing'}! 👋
                  </h1>
                  <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
                      Aquí tienes un resumen claro de tu cuenta y el estado de tus proyectos.<br className="hidden sm:block"/>
                      Sigue implementando y convirtiendo más visitas en clientes.
                  </p>
              </div>
              
              {/* Star Graphic */}
              <div className="hidden md:flex shrink-0 relative w-32 h-32 items-center justify-center">
                  <div className="absolute inset-0 bg-radial from-[#FF5A1F]/20 via-transparent to-transparent rounded-full blur-xl"></div>
                  <svg width="100" height="100" viewBox="0 0 200 200" fill="none" className="relative z-10">
                      <path d="M100 10 C100 65, 135 100, 190 100 C135 100, 100 135, 100 190 C100 135, 65 100, 10 100 C65 100, 100 65, 100 10 Z" 
                            stroke="#FF5A1F" strokeWidth="3" fill="#FF5A1F" fillOpacity="0.1" />
                      <path d="M100 35 C100 75, 125 100, 165 100 C125 100, 100 125, 100 165 C100 125, 75 100, 35 100 C75 100, 100 75, 100 35 Z" 
                            stroke="#FF5A1F" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  </svg>
              </div>
          </div>
      </div>

      {/* 2. VIDEO INTRODUCTORIO + TU SUSCRIPCIÓN (BLOQUES LADO A LADO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* BLOQUE DE VIDEO (Izquierda / Principal) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl flex flex-col justify-between group">
              <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider">
                          <PlayCircle className="w-4 h-4" />
                          <span>Tour de la Plataforma</span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" /> 4:36 min
                      </span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                      Aprende a dominar tu panel y acelerar tus resultados
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                      Mira este breve recorrido guiado para aprender a estructurar proyectos, generar reels con IA y activar tus páginas de captación.
                  </p>
              </div>

              {/* Video Embed */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative bg-black">
                  <iframe 
                      className="w-full h-full absolute inset-0"
                      src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&modestbranding=1&controls=1" 
                      title="Tour de la Plataforma Aprende.Marketing" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                  ></iframe>
              </div>
          </div>

          {/* BLOQUE DERECHA: TU SUSCRIPCIÓN + COMUNIDAD WHATSAPP APILADOS Y EQUILIBRADOS */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-6">
              
              {/* 1. TU SUSCRIPCIÓN (Espaciado natural y compacto sin huecos vacíos) */}
              <div className="bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#180D06] p-6 sm:p-7 rounded-[2rem] border border-[#FF5A1F]/30 hover:border-[#FF5A1F]/50 transition-all shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF5A1F]/15 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-[#FF5A1F]">
                      <Crown className="w-28 h-28" />
                  </div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30">
                                  <Crown className="w-4 h-4 text-[#FF5A1F]" />
                              </div>
                              <h2 className="text-xs font-black text-white uppercase tracking-widest">Tu Suscripción</h2>
                          </div>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                              Activo
                          </span>
                      </div>
                      
                      <div>
                          <div className="flex items-baseline justify-between mb-3.5">
                              <div>
                                  <h3 className="text-2xl sm:text-3xl font-black text-white capitalize">{planName}</h3>
                                  <p className="text-xs text-gray-400 mt-1">{isFree ? 'Versión gratuita' : 'Plan Premium'}</p>
                              </div>
                              <span className="px-2.5 py-1 rounded-lg bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-bold uppercase tracking-wider">
                                  {planName}
                              </span>
                          </div>
                          
                          {/* CARACTERÍSTICAS DISPONIBLES (Filas con espaciado equilibrado) */}
                          <div className="space-y-2">
                              {/* Proyectos permitidos */}
                              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs sm:text-sm hover:border-[#FF5A1F]/30 transition-colors">
                                  <span className="text-gray-300 font-medium">Proyectos permitidos:</span>
                                  <span className="font-bold text-white">{projects.length} / {maxProjects}</span>
                              </div>

                              {/* Reels disponibles */}
                              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs sm:text-sm hover:border-[#FF5A1F]/30 transition-colors">
                                  <span className="text-gray-300 font-medium">Reels disponibles:</span>
                                  <span className="font-bold text-white">27 / 30</span>
                              </div>

                              {/* Registros generados */}
                              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs sm:text-sm hover:border-[#FF5A1F]/30 transition-colors">
                                  <span className="text-gray-300 font-medium">Registros generados:</span>
                                  <span className="font-bold text-white">{summaryData.totalConversions || 85}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* SECCIÓN INFERIOR: TEXTO MOTIVACIONAL + BOTÓN (Conectado sin gran espacio vacío) */}
                  <div className="relative z-10 mt-4 space-y-3">
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          Mejora tu suscripción y obtén las mejores características para tener mejores resultados
                      </p>

                      <button 
                          onClick={() => setShowProfileModal(true)} 
                          className="w-full py-3.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#FF5A1F] via-[#FF6E2B] to-[#FF853A] text-white hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(255,90,31,0.35)] cursor-pointer uppercase tracking-wider"
                      >
                          <Zap className="w-4 h-4 fill-current" /> Mejorar a Pro
                      </button>
                  </div>
              </div>

              {/* 2. COMUNIDAD DE WHATSAPP (Aumentada en presencia y altura para equilibrio proporcional) */}
              <div className="bg-[#0B1120] p-6 sm:p-7 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between flex-1">
                  <div>
                      <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                                  <Smartphone className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                  <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">Comunidad WhatsApp</h2>
                                  <p className="text-[11px] text-[#25D366] font-bold mt-1">Grupo Exclusivo VIP</p>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                              <div className="flex -space-x-1.5">
                                  {[1,2,3].map(i => (
                                      <div key={i} className="w-5 h-5 rounded-full border border-[#0B1120] bg-slate-700 flex items-center justify-center text-[8px] text-gray-300">
                                          <Users className="w-2.5 h-2.5" />
                                      </div>
                                  ))}
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">+236</span>
                          </div>
                      </div>
                      
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
                          Conecta con otros creadores, comparte tus lanzamientos y recibe soporte directo en tiempo real.
                      </p>
                  </div>

                  <div>
                      <button className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.25)] cursor-pointer">
                          <Smartphone className="w-4 h-4" /> Unirme al grupo VIP
                      </button>
                  </div>
              </div>

          </div>
      </div>

      {/* 3. MAIN CONTENT GRID (8 + 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (Projects & Academy) */}
          <div className="xl:col-span-8 space-y-8">
              
              {/* BIBLIOTECA DE PROYECTOS */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                      <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Folder className="w-4 h-4 text-[#FF5A1F]" /> 
                          Biblioteca <span className="text-gray-500">/ Últimos cursos añadidos</span>
                      </h2>
                      <button onClick={() => navigate('/dashboard/projects')} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:underline">
                          Ver todos mis proyectos <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                  </div>

                  {projects.length === 0 && !loading ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                          <Folder className="w-16 h-16 text-slate-700 mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">Aún no tienes proyectos</h3>
                          <p className="text-gray-500 text-sm mb-6">Crea tu primer proyecto para empezar a generar embudos y reels.</p>
                          <button onClick={() => navigate('/dashboard/projects/new')} className="bg-[#FF5A1F] hover:bg-[#E04D1A] text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors">
                              Crear mi primer proyecto
                          </button>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {projects.slice(0, 3).map((project, idx) => {
                              const progress = idx === 0 ? 85 : idx === 1 ? 62 : 92; // Mock progress for UI
                              const isReview = idx === 1; // Mock status
                              
                              return (
                                  <div key={project.id || idx} className="bg-[#0F172A]/50 rounded-2xl border border-slate-800 overflow-hidden group flex flex-col">
                                      {/* Project Cover */}
                                      <div className="h-32 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                          {project.strategy_json?.visualIdentity?.logoUrl ? (
                                              <img src={project.strategy_json.visualIdentity.logoUrl} alt="Logo" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                          ) : (
                                              <ImageIcon className="w-10 h-10 text-slate-600" />
                                          )}
                                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent"></div>
                                      </div>
                                      
                                      <div className="p-5 flex-1 flex flex-col">
                                          <h3 className="font-bold text-white text-base truncate mb-1">{project.name || project.productName}</h3>
                                          <p className="text-xs text-gray-500 truncate mb-3">{project.niche || 'Marketing'}</p>
                                          
                                          {/* Status Badge */}
                                          <div className="mb-4">
                                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                                  isReview ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                                              }`}>
                                                  {isReview ? 'En revisión' : 'En línea'}
                                              </span>
                                          </div>
                                          
                                          <div className="mt-auto">
                                              <div className="flex justify-between items-end mb-2">
                                                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Progreso de implementación</span>
                                                  <span className="text-xs font-bold text-white">{progress}%</span>
                                              </div>
                                              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                                                  <div className="h-full bg-[#FF5A1F] rounded-full" style={{ width: `${progress}%` }}></div>
                                              </div>
                                              
                                              <div className="flex justify-between items-center mb-4 text-xs">
                                                  <span className="text-gray-500">Estado de página</span>
                                                  <span className="flex items-center gap-1.5 font-medium text-gray-300">
                                                      <span className={`w-2 h-2 rounded-full ${isReview ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                                      {isReview ? 'En revisión' : 'Activa'}
                                                  </span>
                                              </div>
                                              
                                              <button 
                                                  onClick={() => navigate(`/dashboard/projects/${project.id}/strategy`)}
                                                  className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-[#FF5A1F] text-gray-300 hover:text-[#FF5A1F] text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                              >
                                                  Ver proyecto <ArrowRight className="w-3.5 h-3.5" />
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  )}
              </div>

              {/* NOVEDADES DE LA ACADEMIA */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                      <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#FF5A1F]" /> Novedades de la academia
                      </h2>
                      <button onClick={() => navigate('/dashboard/training')} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:underline">
                          Ver todas <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {academyCourses.map((course) => {
                          const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
                          return (
                              <div
                                  key={course.id || course.slug}
                                  onClick={() => navigate(`/dashboard/training/${course.slug}`)}
                                  className="group relative bg-slate-900/80 border border-slate-800 hover:border-[#FF5A1F]/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF5A1F]/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                              >
                                  {/* Image & Badge Header */}
                                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                                      <img
                                          src={thumbnail}
                                          alt={course.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                                      
                                      {/* Badge */}
                                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-[#FF5A1F] flex items-center gap-1.5 uppercase tracking-wider">
                                          <Award className="w-3.5 h-3.5" />
                                          <span>{course.badge_text || course.subtitle || "Curso"}</span>
                                      </div>

                                      {/* Play Overlay Icon */}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                                          <div className="w-14 h-14 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FF5A1F]/40 transform group-hover:scale-110 transition-transform">
                                              <PlayCircle className="w-8 h-8 ml-0.5" />
                                          </div>
                                      </div>
                                  </div>

                                  {/* Content */}
                                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                              <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                              <span>{course.subtitle || "Entrenamiento Paso a Paso"}</span>
                                          </div>
                                          <h2 className="text-xl font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors leading-snug">
                                              {course.title}
                                          </h2>
                                          {course.description && (
                                              <p className="text-slate-400 text-xs md:text-sm line-clamp-3 leading-relaxed font-normal">
                                                  {course.description}
                                              </p>
                                          )}
                                      </div>
                                      {/* Footer Action */}
                                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#FF5A1F] group-hover:text-white transition-colors">
                                          <span className="flex items-center gap-1.5">
                                              <PlayCircle className="w-4 h-4 text-[#FF5A1F]" /> Acceder al Curso
                                          </span>
                                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN (Quick Resources & Support) */}
          <div className="xl:col-span-4 space-y-6">
              
              {/* ACCESOS RÁPIDOS & ACCIONES */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#FF5A1F]" />
                      Accesos Rápidos
                  </h2>

                  <div className="space-y-3">
                      <button 
                          onClick={() => navigate('/dashboard/projects/create')}
                          className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#FF5A1F]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#FF5A1F]/10 text-[#FF5A1F] flex items-center justify-center font-bold">
                                  <Folder className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-white group-hover:text-[#FF5A1F] transition-colors">Crear Proyecto</p>
                                  <p className="text-[11px] text-gray-500">Nuevo embudo y contenidos</p>
                              </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#FF5A1F] group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                          onClick={() => navigate('/dashboard/training')}
                          className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#FF5A1F]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                                  <BookOpen className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Ver Academia</p>
                                  <p className="text-[11px] text-gray-500">Clases y rutas de aprendizaje</p>
                              </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                          onClick={() => setShowProfileModal(true)}
                          className="w-full p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#FF5A1F]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                                  <HelpCircle className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Ayuda y Ajustes</p>
                                  <p className="text-[11px] text-gray-500">Perfil, planes y soporte</p>
                              </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                      </button>
                  </div>
              </div>



          </div>
      </div>

    </div>
  );
};