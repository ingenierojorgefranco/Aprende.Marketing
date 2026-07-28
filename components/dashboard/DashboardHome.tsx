import React, { useEffect, useState } from 'react';
////////// Importación de componentes necesarios para el nuevo Centro de Mando - 27/05/2025 14:15 //////////
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
    TrendingUp, Users, Loader2, 
    Rocket, FileText, Sparkles, Zap, Newspaper, 
    Layout, ChevronRight, ArrowUpRight, Bot, Star, Settings,
    Target, Briefcase, PlusCircle, DollarSign, Info, CreditCard, Calendar, ShieldCheck, Eye,
    CheckCircle2, Play, Clock, ArrowRight, Compass, GraduationCap, Folder, Globe, Award, Activity
} from 'lucide-react';
import { api } from '../../services/api';
import { MOCK_NEWS } from '../../services/mockData';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, DashboardNews } from '../../types';
import { NewsHistoryModal } from './NewsHistoryModal';

interface DashboardContext {
    user: User;
    pageCount: number;
    projectCount: number;
    articleCount: number;
    ////////// Adición de función para abrir el perfil desde el contexto - 27/05/2025 12:35 //////////
    setShowProfileModal: (show: boolean) => void;
    ////////// Fin de actualización - 27/05/2025 12:35 //////////
}
////////// Fin de actualización - 27/05/2025 14:15 /////////

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  ////////// Extracción de setShowProfileModal del contexto - 27/05/2025 12:35 //////////
  const { user, setShowProfileModal, projectCount } = useOutletContext() as DashboardContext;
  ////////// Fin de actualización - 27/05/2025 12:35 //////////

  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState({
      totalVisits: 0,
      totalConversions: 0,
      totalPages: 0,
      conversionRate: '0'
  });
  const [loading, setLoading] = useState(true);
  
  ////////// Actualización: Estado para el feed de novedades real y modal de histórico - 07/06/2025 10:30 //////////
  const [newsFeed, setNewsFeed] = useState<DashboardNews[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  ////////// Fin de actualización - 07/06/2025 10:30 //////////

  const formatTooltipDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        });
  };

  const formatDayName = (dateString: string) => {
      const date = new Date(dateString);
      const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      return days[date.getUTCDay()];
  };

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [weeklyData, summary, news] = await Promise.all([
                api.getWeeklyAnalytics(),
                api.getAnalyticsSummary(),
                api.getNewsFeed()
            ]);

            const formatted = weeklyData.map(item => ({
                name: formatDayName(item.date),
                fullDate: item.date,
                visits: item.visits,
                conversions: item.conversions
            }));
            setAnalyticsData(formatted);
            setNewsFeed(news);

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

  ////////// Componente de Tooltip Estratégico Corregido (Z-Index y visibilidad) - 27/05/2025 14:15 //////////
  const StrategicTooltip = ({ title, content }: { title: string, content: string }) => (
      <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#0D1527] border border-[#FF5A1F]/50 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[100] backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2 text-[#FF5A1F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
          </div>
          <p className="text-xs text-gray-300 font-medium leading-relaxed">{content}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#FF5A1F]/50"></div>
      </div>
  );

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FF5A1F]">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-black uppercase tracking-[0.2em] text-sm">Iniciando Centro de Mando...</p>
          </div>
      );
  }

  return (
    <div className="space-y-10 text-white animate-in fade-in slide-in-from-bottom-6 duration-700 bg-[#030712] min-h-screen pb-12">
      
      {/* ========================================================================= */}
      {/* NUEVO PANEL SUPERIOR (RESUMEN DE TU CUENTA & TUS PROYECTOS - IMAGEN 2)   */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        
        {/* CABECERA: Resumen de tu cuenta & Card de Plan */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Resumen de tu cuenta
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-1 font-normal">
              Gestiona tus proyectos, revisa su avance y continúa donde lo dejaste.
            </p>
          </div>

          {/* Card Plan actual - Estilo Imagen 2 (Ancho prominente con emblema hexágono + estrella) */}
          <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 min-w-[320px] lg:min-w-[620px] xl:min-w-[680px] max-w-2xl xl:max-w-3xl shadow-2xl shrink-0">
            {/* Fondo sutil resplandeciente */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Detalles del Plan */}
            <div className="space-y-3 relative z-10 shrink-0">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-widest">Plan actual</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white capitalize mt-0.5 block">{user?.planLimits?.planName || 'Gratuito'}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{projectCount || 1} proyecto activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>3/3 reels usados este mes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>1 artículo disponible</span>
                </div>
              </div>
            </div>

            {/* Emblema Hexagonal Central con Estrella (Imagen 2) */}
            <div className="hidden md:flex items-center justify-center relative w-24 h-24 mx-2 shrink-0 pointer-events-none">
              <div className="absolute inset-0 bg-[#FF5A1F]/15 blur-2xl rounded-full"></div>
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#FF5A1F] overflow-visible">
                <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
                <polygon points="50,11 84,30 84,70 50,89 16,70 16,30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45" />
                <polygon points="50,18 77,34 77,66 50,82 23,66 23,34" fill="#0D1322" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
                <line x1="50" y1="4" x2="50" y2="18" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="91" y1="27" x2="77" y2="34" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="91" y1="73" x2="77" y2="66" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="50" y1="96" x2="50" y2="82" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="9" y1="73" x2="23" y2="66" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="9" y1="27" x2="23" y2="34" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
              </svg>
              <Star className="w-7 h-7 text-[#FF5A1F] fill-[#FF5A1F]/20 absolute z-10" />
            </div>

            {/* Botón de Acción */}
            <div className="relative z-10 self-stretch md:self-center w-full md:w-auto shrink-0">
              <button 
                onClick={() => setShowProfileModal(true)}
                className="bg-[#FF5A1F] hover:bg-[#E04E1A] text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-xl shadow-[#FF5A1F]/25 transition-all cursor-pointer whitespace-nowrap active:scale-95 w-full md:w-auto text-center"
              >
                Mejorar a Pro
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN: Tus proyectos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Tus proyectos</h2>
            <button 
              onClick={() => navigate('/dashboard/projects')}
              className="text-[#FF5A1F] hover:text-[#E04E1A] font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ver todos los proyectos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Proyecto 1: Curso de Microblading */}
            <div className="bg-[#0B1120] border-2 border-[#FF5A1F] rounded-2xl p-5 shadow-[0_0_25px_rgba(255,90,31,0.15)] relative flex flex-col justify-between space-y-5 transition-all hover:border-[#FF5A1F]">
              <div className="space-y-4">
                {/* Cabecera con imagen a la izquierda y título + detalles a la derecha */}
                <div className="flex items-start gap-3.5">
                  <img 
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80" 
                    alt="Curso de Microblading" 
                    className="w-28 sm:w-32 h-28 sm:h-32 rounded-xl object-cover border border-slate-700/80 shrink-0 shadow-md" 
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base leading-tight truncate">Curso de Microblading</h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Sistema generado</p>
                      </div>
                      <span className="bg-[#0D2818] border border-emerald-500/40 text-[#10B981] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0">
                        Activo
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 font-medium pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                        <span className="truncate">Implementación: 3 de 13 pasos</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Página publicada</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">3 reels disponibles</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">0 registros</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>3 de 13 pasos completados</span>
                    <span className="text-slate-200 font-bold">27%</span>
                  </div>
                  <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF5A1F] h-full rounded-full transition-all duration-500" style={{ width: '27%' }}></div>
                  </div>
                </div>

                <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-center">
                  <div className="border-r border-slate-800/60 pr-2">
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold">12</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">visitas</p>
                  </div>
                  <div className="pl-2">
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold">0</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">registros recientes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button 
                  onClick={() => navigate('/dashboard/projects')}
                  className="w-full bg-[#FF5A1F] hover:bg-[#E04E1A] text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#FF5A1F]/20 active:scale-95"
                >
                  <span>Continuar implementación</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate('/dashboard/projects')}
                  className="w-full bg-slate-900/60 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-bold py-2.5 rounded-xl text-xs sm:text-sm text-center transition-all cursor-pointer"
                >
                  Ver resumen
                </button>
              </div>
            </div>

            {/* Proyecto 2: Curso de Uñas Acrílicas */}
            <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 shadow-xl relative flex flex-col justify-between space-y-5 transition-all hover:border-slate-700">
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <img 
                    src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&auto=format&fit=crop&q=80" 
                    alt="Curso de Uñas Acrílicas" 
                    className="w-28 sm:w-32 h-28 sm:h-32 rounded-xl object-cover border border-slate-700/80 shrink-0 shadow-md" 
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base leading-tight truncate">Curso de Uñas Acrílicas</h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">Completado</p>
                      </div>
                      <span className="bg-[#0D2818] border border-emerald-500/40 text-[#10B981] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0">
                        Completado
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 font-medium pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Guía completada</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Página publicada</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">3 reels disponibles</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">8 registros</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>13 de 13 pasos completados</span>
                    <span className="text-emerald-400 font-bold">100%</span>
                  </div>
                  <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-center">
                  <div className="border-r border-slate-800/60 pr-2">
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold">156</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">visitas</p>
                  </div>
                  <div className="pl-2">
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold">8</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">registros totales</p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button 
                  onClick={() => navigate('/dashboard/projects')}
                  className="w-full bg-slate-900/60 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <span>Abrir proyecto</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Proyecto 3: Curso de Maquillaje Profesional */}
            <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 shadow-xl relative flex flex-col justify-between space-y-5 transition-all hover:border-slate-700">
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <img 
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&auto=format&fit=crop&q=80" 
                    alt="Curso de Maquillaje Profesional" 
                    className="w-28 sm:w-32 h-28 sm:h-32 rounded-xl object-cover border border-slate-700/80 shrink-0 shadow-md" 
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-base leading-tight truncate">Curso de Maquillaje</h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">En preparación</p>
                      </div>
                      <span className="bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0">
                        En prepar.
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 font-medium pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">En generación</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Pendiente revisar</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">0 reels</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">0 registros</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>1 de 13 pasos completados</span>
                    <span className="text-amber-400 font-bold">9%</span>
                  </div>
                  <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF5A1F] h-full rounded-full transition-all duration-500" style={{ width: '9%' }}></div>
                  </div>
                </div>

                <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-center opacity-60">
                  <div className="border-r border-slate-800/60 pr-2">
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold">0</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">visitas</p>
                  </div>
                  <div className="pl-2">
                    <div className="flex items-center justify-center gap-1.5 text-white">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold">0</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">registros</p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button 
                  onClick={() => navigate('/dashboard/projects')}
                  className="w-full bg-[#FF5A1F] hover:bg-[#E04E1A] text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#FF5A1F]/20 active:scale-95"
                >
                  <span>Continuar configuración</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SECCIÓN: Actividad reciente & Visión rápida */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Columna Izquierda: Actividad reciente */}
          <div className="lg:col-span-5 bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#FF5A1F]" />
                <span>Actividad reciente</span>
              </h3>
              <button 
                onClick={() => navigate('/dashboard/projects')}
                className="text-[#FF5A1F] hover:text-[#E04E1A] font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Ver toda la actividad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 relative pl-3 border-l-2 border-slate-800/80 ml-2">
              <div className="relative pl-5">
                <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ring-4 ring-[#0B1120]"></div>
                <p className="text-xs font-semibold text-slate-200">Se generó la página de "Curso de Microblading"</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Hace 1 hora</p>
              </div>

              <div className="relative pl-5">
                <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#0B1120]"></div>
                <p className="text-xs font-semibold text-slate-200">Reels listos para "Curso de Uñas Acrílicas"</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Hace 3 horas</p>
              </div>

              <div className="relative pl-5">
                <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ring-4 ring-[#0B1120]"></div>
                <p className="text-xs font-semibold text-slate-200">Proyecto "Maquillaje Profesional" creado</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Hace 1 día</p>
              </div>

              <div className="relative pl-5">
                <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[#0B1120]"></div>
                <p className="text-xs font-semibold text-slate-200">Actualizaste tu perfil</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Hace 2 días</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Visión rápida */}
          <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FF5A1F]" />
              <span>Visión rápida</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">3</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">proyectos totales</p>
                </div>
              </div>

              <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">2</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">páginas publicadas</p>
                </div>
              </div>

              <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">8</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">registros totales</p>
                </div>
              </div>

              <div className="bg-[#060913] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 w-fit">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-white">1</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">proyecto completado</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BANNER: ¿No sabes qué hacer ahora? */}
        <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3.5 bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] rounded-full shrink-0 shadow-lg shadow-[#FF5A1F]/10">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">¿No sabes qué hacer ahora?</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                Abre un proyecto para continuar su implementación o crea uno nuevo.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button 
              onClick={() => navigate('/dashboard/projects')}
              className="w-full sm:w-auto bg-[#FF5A1F] hover:bg-[#E04E1A] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FF5A1F]/20 active:scale-95"
            >
              <span>Ir a mis proyectos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/dashboard/training')}
              className="w-full sm:w-auto bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-slate-300" />
              <span>Ver academia</span>
            </button>
          </div>
        </div>

      </div>

      <div className="my-10 border-t border-slate-800/80"></div>

      {/* ========================================================================= */}
      {/* PANEL ANTERIOR (IMAGEN 1 - HOLA, ADMIN... CONSERVADO SIN ELIMINAR NADA)  */}
      {/* ========================================================================= */}
      
      {/* Header Dinámico */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-l-4 border-[#FF5A1F] pl-6 py-2">
        <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">HOLA, {user.name.toUpperCase()}</h1>
        </div>
        <div className="flex gap-3">
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: MÉTRICAS Y GRÁFICAS (8 Cols) */}
        <div className="xl:col-span-8 space-y-8">
            
            {/* ////////// Actualización: Reducción de 4 a 3 columnas para optimizar visualización de métricas reales - 01/06/2025 20:45 ////////// */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Visitas Recibidas */}
                <div className="bg-[#0B1120] p-6 rounded-[2rem] border border-slate-800/80 shadow-2xl relative group">
                    <StrategicTooltip 
                        title="Tráfico Total" 
                        content="Cantidad total de personas que han aterrizado en tus páginas. Es el volumen inicial de tu embudo de ventas." 
                    />
                    <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Eye className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Visitas Recibidas</p>
                    <h3 className="text-4xl font-black text-white leading-none">{summaryData.totalVisits}</h3>
                    <p className="text-white text-[1em] leading-[1rem] mt-3 font-medium">Tráfico Bruto</p>
                </div>

                {/* 2. Leads Capturados */}
                <div className="bg-[#0B1120] p-6 rounded-[2rem] border border-slate-800/80 shadow-2xl relative group">
                    <StrategicTooltip 
                        title="Leads (Contactos)" 
                        content="Personas que demostraron interés real dejando su email o iniciando chat. Son la base de tu base de datos." 
                    />
                    <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Users className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-xs font-black text-[#FF5A1F] uppercase tracking-[0.2em] mb-3">Leads Capturados</p>
                    <h3 className="text-4xl font-black text-white leading-none">{summaryData.totalConversions}</h3>
                    <p className="text-white text-[1em] leading-[1rem] mt-3 font-medium flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" /> +5% vs ayer
                    </p>
                </div>

                {/* 3. Tasa Conversión */}
                <div className="bg-[#0B1120] p-6 rounded-[2rem] border border-slate-800/80 shadow-2xl relative group">
                    <StrategicTooltip 
                        title="Efectividad" 
                        content="Mide qué porcentaje de visitas se convierten en leads. Si es bajo, necesitas mejorar el copy de tu landing." 
                    />
                    <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-3">Tasa Conversión</p>
                    <h3 className="text-4xl font-black text-white leading-none">{summaryData.conversionRate}%</h3>
                    <p className="text-white text-[1em] leading-[1rem] mt-3 font-medium">Ratio de Éxito</p>
                </div>

                {/* ////////// Eliminación de la tarjeta "Potencial Facturación" por solicitud del usuario - 01/06/2025 20:45 ////////// */}
            </div>
            {/* ////////// Fin de actualización - 01/06/2025 20:45 ////////// */}

            {/* Bloque de Gráficas */}
            <div className="space-y-6">
                {/* Gráfica 1: Tráfico */}
                <div className="bg-[#0B1120] p-8 rounded-[2rem] border border-slate-800/80 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-3">
                            <Target className="w-5 h-5 text-[#FF5A1F]" /> Tráfico Semanal (Visitas)
                        </h3>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData} margin={{ left: -20, right: 10 }}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF5A1F" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FF5A1F" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#ffffff" strokeOpacity={0.03} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11, fontWeight: 'bold'}} dy={15} />
                                <YAxis hide={false} axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11, fontWeight: 'bold'}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0D1527', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                                    itemStyle={{color: '#FF5A1F', fontWeight: 'black'}}
                                    labelFormatter={(label, payload) => payload && payload.length > 0 ? formatTooltipDate(payload[0].payload.fullDate) : label}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="visits" 
                                    stroke="#FF5A1F" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorVisits)" 
                                    activeDot={{ r: 8, strokeWidth: 4, stroke: '#0B1120', fill: '#FF5A1F' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ////////// Gráfica 2: Leads Capturados (Nueva) - 27/05/2025 14:30 ////////// */}
                <div className="bg-[#0B1120] p-8 rounded-[2rem] border border-slate-800/80 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-3">
                            <Users className="w-5 h-5 text-emerald-500" /> Leads Capturados (Éxito Semanal)
                        </h3>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData} margin={{ left: -20, right: 10 }}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#ffffff" strokeOpacity={0.03} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11, fontWeight: 'bold'}} dy={15} />
                                <YAxis hide={false} axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11, fontWeight: 'bold'}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#0D1527', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                                    itemStyle={{color: '#10b981', fontWeight: 'black'}}
                                    labelFormatter={(label, payload) => payload && payload.length > 0 ? formatTooltipDate(payload[0].payload.fullDate) : label}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="conversions" 
                                    stroke="#10b981" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorLeads)" 
                                    activeDot={{ r: 8, strokeWidth: 4, stroke: '#0B1120', fill: '#10b981' }}
                                    name="Leads"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* ////////// Fin de actualización - 27/05/2025 14:30 ////////// */}
            </div>
        </div>

        {/* COLUMNA DERECHA: CUENTA, ACCIONES Y NOVEDADES (4 Cols) */}
        <div className="xl:col-span-4 space-y-8">
            
            {/* ////////// Actualización: Optimización de legibilidad en Estado de Cuenta - 27/05/2025 17:15 ////////// */}
            <div className="bg-[#0B1120] p-8 rounded-[2rem] border border-slate-800/80 relative group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                    <ShieldCheck className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Estado de Tu Cuenta</h3>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#FF5A1F]/10 rounded-xl">
                            <CreditCard className="w-6 h-6 text-[#FF5A1F]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Plan Actual</p>
                            <p className="text-xl font-bold text-white capitalize">{user?.planLimits?.planName || 'Starter'}</p>
                        </div>
                    </div>

                    {(user?.planLimits?.planName === 'pro' || user?.planLimits?.planName === 'max') ? (
                        <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Suscripción Activa</p>
                                <p className="text-sm font-bold text-white">Próxima Facturación: Automática</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[1em] text-white font-medium leading-[1.5em]">
                            Estás en la versión gratuita. Aumenta tu plan ahora para desbloquear todas las funciones estratégicas.
                        </p>
                    )}

                    {/* ////////// Actualización: Redirección al panel de gestión de usuario en lugar de al Home - 27/05/2025 12:45 ////////// */}
                    <button 
                        onClick={() => setShowProfileModal(true)} 
                        className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#FF5A1F] border border-[#FF5A1F] text-white hover:bg-[#D94A1E] hover:border-[#D94A1E] transition-all flex items-center justify-center gap-2"
                    >
                        <Zap className="w-4 h-4 fill-current" /> Gestionar Suscripción
                    </button>
                    {/* ////////// Fin de actualización - 27/05/2025 12:45 ////////// */}
                </div>
            </div>
            {/* ////////// Fin de actualización - 27/05/2025 17:15 ////////// */}

            {/* ////////// Eliminación de "Top Páginas" y Rediseño de Novedades - 27/05/2025 15:00 ////////// */}
            <div className="bg-[#0B1120] p-8 rounded-[2rem] border border-slate-800/80 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
                    < Newspaper className="w-40 h-40" />
                </div>
                <h3 className="text-sm font-black text-[#FF5A1F] uppercase tracking-[0.2em] mb-8 relative z-10">Novedades y TIPS</h3>
                <div className="space-y-10 relative z-10">
                    {newsFeed.length > 0 ? newsFeed.map(news => (
                        <div key={news.id} className="group cursor-pointer">
                            <div className="flex items-start gap-5">
                                <div className={`p-2.5 rounded-xl shrink-0 ${news.iconType === 'ia' ? 'bg-purple-500/10 text-purple-400' : news.iconType === 'update' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#FF5A1F]/10 text-[#FF5A1F]'}`}>
                                    {news.iconType === 'ia' ? <Bot className="w-6 h-6" /> : news.iconType === 'update' ? <Rocket className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xl font-bold text-white group-hover:text-[#FF5A1F] transition-colors leading-tight">{news.title}</h4>
                                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-tighter shrink-0">{news.date}</span>
                                    </div>
                                    <p className="text-base text-gray-400 leading-relaxed font-light">{news.content}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 italic text-sm">No hay novedades recientes.</p>
                    )}
                </div>
                <button 
                    onClick={() => setShowHistoryModal(true)}
                    className="w-full mt-10 py-4 rounded-xl border border-[#FF5A1F]/30 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 transition-all"
                >
                    Ver más novedades
                </button>
            </div>
            {/* ////////// Fin de actualización - 27/05/2025 15:00 ////////// */}

        </div>
      </div>

      {/* ////////// Actualización: Modal de histórico de novedades - 07/06/2025 10:30 ////////// */}
      {showHistoryModal && (
          <NewsHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
      )}
      {/* ////////// Fin de actualización - 07/06/2025 10:30 ////////// */}

      {/* Footer del Dashboard */}
      <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
      </footer>
    </div>
  );
};