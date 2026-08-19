import React, { useEffect, useState } from 'react';
import { 
    ChevronRight, ArrowRight, Play, Users, 
    CreditCard, Folder, CheckCircle2, Bot,
    ShieldCheck, Smartphone, Zap, Sparkles, Image as ImageIcon
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
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [summary, userProjects] = await Promise.all([
                api.getAnalyticsSummary(),
                api.getProjects()
            ]);

            setProjects(userProjects || []);

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
  
  // Mock data for academy
  const academyCourses = [
      { id: 1, title: 'Estrategias de Escalado para E-commerce', level: 'Intermedio', duration: '32 min', isNew: true, isUpdate: false },
      { id: 2, title: 'Automatizaciones con Make para Marketers', level: 'Intermedio', duration: '41 min', isNew: true, isUpdate: false },
      { id: 3, title: 'Creatividades que Venden en Meta Ads', level: 'Básico', duration: '28 min', isNew: true, isUpdate: false },
      { id: 4, title: 'Tracking Avanzado en Google Analytics 4', level: 'Intermedio', duration: '36 min', isNew: false, isUpdate: true }
  ];

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

      {/* 2. STATS ROW (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* PLAN ACTUAL */}
          <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-[#FF5A1F]/30 transition-colors flex flex-col justify-between h-full group">
              <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl text-gray-400 group-hover:text-[#FF5A1F] transition-colors">
                      <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Plan Actual</p>
                      <h3 className="text-xl font-bold text-white capitalize leading-none mb-1">{planName}</h3>
                      <p className="text-xs text-gray-400">{isFree ? 'Versión gratuita' : 'Plan Premium'}</p>
                  </div>
              </div>
              <button onClick={() => setShowProfileModal(true)} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2 w-fit">
                  Ver detalles <ArrowRight className="w-3.5 h-3.5" />
              </button>
          </div>

          {/* PROYECTOS ACTIVOS */}
          <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-[#FF5A1F]/30 transition-colors flex flex-col justify-between h-full group">
              <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl text-gray-400 group-hover:text-[#FF5A1F] transition-colors">
                      <Folder className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Proyectos Activos</p>
                      <h3 className="text-xl font-bold text-white leading-none mb-1">{projects.length}</h3>
                      <p className="text-xs text-gray-400">de {maxProjects} permitidos</p>
                  </div>
              </div>
              <button onClick={() => navigate('/dashboard/projects')} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2 w-fit">
                  Ver mis proyectos <ArrowRight className="w-3.5 h-3.5" />
              </button>
          </div>

          {/* REELS DISPONIBLES */}
          <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-[#FF5A1F]/30 transition-colors flex flex-col justify-between h-full group">
              <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl text-gray-400 group-hover:text-[#FF5A1F] transition-colors">
                      <Play className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Reels Disponibles</p>
                      <h3 className="text-xl font-bold text-white leading-none mb-1">27</h3>
                      <p className="text-xs text-gray-400">de 30 este mes</p>
                  </div>
              </div>
              <button onClick={() => navigate('/dashboard/projects')} className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2 w-fit">
                  Gestionar reels <ArrowRight className="w-3.5 h-3.5" />
              </button>
          </div>

          {/* REGISTROS GENERADOS */}
          <div className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 hover:border-[#FF5A1F]/30 transition-colors flex flex-col justify-between h-full group">
              <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl text-gray-400 group-hover:text-[#FF5A1F] transition-colors">
                      <Users className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Registros Generados</p>
                      <h3 className="text-xl font-bold text-white leading-none mb-1">{summaryData.totalConversions}</h3>
                      <p className="text-xs text-gray-400">este mes</p>
                  </div>
              </div>
              <div className="text-emerald-500 text-xs font-bold flex items-center gap-1 mt-2">
                  +18% <span className="text-gray-500 font-medium">vs mes anterior</span>
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
                      <button className="text-[#FF5A1F] text-xs font-bold flex items-center gap-1 hover:underline">
                          Ver todas <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {academyCourses.map(course => (
                          <div key={course.id} className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800 group cursor-pointer hover:border-slate-600 transition-colors">
                              <div className="h-28 bg-slate-800 relative flex items-center justify-center">
                                  <div className="absolute top-2 left-2 z-10">
                                      {course.isNew && (
                                          <span className="bg-[#FF5A1F] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Nuevo</span>
                                      )}
                                      {course.isUpdate && (
                                          <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Actualizado</span>
                                      )}
                                  </div>
                                  <Play className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
                              </div>
                              <div className="p-4">
                                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-tight">{course.title}</h3>
                                  <p className="text-[11px] text-gray-500">{course.level} · {course.duration}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN (Subscription & Community) */}
          <div className="xl:col-span-4 space-y-6">
              
              {/* TU SUSCRIPCIÓN */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                      <ShieldCheck className="w-24 h-24 text-white" />
                  </div>
                  
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 relative z-10">Tu Suscripción</h2>
                  
                  <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white capitalize mb-1">{planName}</h3>
                      <p className="text-sm text-gray-400 mb-8">{isFree ? 'Versión gratuita' : 'Plan Premium'}</p>
                      
                      <div className="mb-8">
                          <div className="flex justify-between items-end mb-2">
                              <span className="text-xs text-gray-400">Reels restantes: <span className="font-bold text-white">27</span> / 30</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-[#FF5A1F] rounded-full" style={{ width: '90%' }}></div>
                          </div>
                      </div>

                      <button 
                          onClick={() => setShowProfileModal(true)} 
                          className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FF5A1F] to-[#FF7A28] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(255,90,31,0.2)]"
                      >
                          <Zap className="w-4 h-4 fill-current" /> Gestionar suscripción
                      </button>
                  </div>
              </div>

              {/* COMUNIDAD DE WHATSAPP */}
              <div className="bg-[#0B1120] p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                          <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Comunidad de Whatsapp</h2>
                  </div>
                  
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                      Conecta con otros miembros, comparte resultados y recibe soporte en tiempo real.
                  </p>
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="flex -space-x-3">
                          {[1,2,3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B1120] bg-slate-700 flex items-center justify-center overflow-hidden">
                                  <Users className="w-4 h-4 text-slate-400" />
                              </div>
                          ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">+236</span>
                  </div>

                  <button className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 mb-4">
                      Unirme al grupo
                  </button>
                  
                  <div className="text-center">
                      <button className="text-[#FF5A1F] text-xs font-bold hover:underline">Ver más comunidades</button>
                  </div>
              </div>

          </div>
      </div>

    </div>
  );
};