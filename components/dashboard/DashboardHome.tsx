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
import { User, DashboardNews, Project } from '../../types';
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
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
            const [weeklyData, summary, news, userProjects] = await Promise.all([
                api.getWeeklyAnalytics(),
                api.getAnalyticsSummary(),
                api.getNewsFeed(),
                api.getProjects()
            ]);

            const formatted = weeklyData.map(item => ({
                name: formatDayName(item.date),
                fullDate: item.date,
                visits: item.visits,
                conversions: item.conversions
            }));
            setAnalyticsData(formatted);
            setNewsFeed(news);
            setProjects(userProjects || []);
            if (userProjects && userProjects.length > 0) {
              setActiveProject(userProjects[0]);
            }

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

  const currentProject = selectedProjectId === 'all' 
    ? (activeProject || projects[0] || null)
    : projects.find(p => p.id === selectedProjectId) || activeProject || projects[0] || null;

  const projectName = currentProject?.productName || currentProject?.name || "Microblading";
  const fullProjectTitle = currentProject?.name ? `Certificación Expert ${currentProject.name}` : "Certificación Expert Microblading";

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
      {/* NUEVO PANEL PILOTO DE ACCIÓN Y EJECUCIÓN (EN LA PARTE SUPERIOR)           */}
      {/* ========================================================================= */}
      <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Título de Sección Experta y Selector Multiproyecto */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20">
                      <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                          <span>Centro de Acción</span>
                          {selectedProjectId !== 'all' && (
                              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FF5A1F]/20 text-[#FF5A1F] font-bold border border-[#FF5A1F]/30 normal-case">
                                  {projectName}
                              </span>
                          )}
                      </h2>
                      <p className="text-xs text-gray-400 font-medium">Ejecuta las acciones recomendadas para impulsar tráfico a tu embudo</p>
                  </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto">
                  {/* Dropdown de Selección de Proyecto */}
                  <div className="relative flex-1 sm:flex-none">
                      <div className="flex items-center gap-2 bg-[#0D1527] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs hover:border-[#FF5A1F]/50 transition-all shadow-md">
                          <Folder className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                          <select 
                              value={selectedProjectId}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  setSelectedProjectId(val);
                                  if (val !== 'all') {
                                      const found = projects.find(p => p.id === val);
                                      if (found) setActiveProject(found);
                                  }
                              }}
                              className="bg-transparent text-white font-extrabold text-xs focus:outline-none cursor-pointer pr-4 appearance-none"
                          >
                              <option value="all" className="bg-[#0B1120] text-white">
                                  🌐 Vista Global (Todos los proyectos: {projects.length || 1})
                              </option>
                              {projects.map((p) => (
                                  <option key={p.id} value={p.id} className="bg-[#0B1120] text-white">
                                      📁 {p.name || p.productName || "Proyecto sin nombre"}
                                  </option>
                              ))}
                          </select>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-90 pointer-events-none absolute right-3" />
                      </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sistema En Vivo
                  </span>
              </div>
          </div>

          {/* Selector Rápido de Pestañas de Proyectos si hay más de 1 */}
          {projects.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#FF5A1F]" /> Vista:
                  </span>
                  <button
                      onClick={() => setSelectedProjectId('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          selectedProjectId === 'all'
                              ? 'bg-gradient-to-r from-[#FF5A1F] to-[#FF7A28] text-white shadow-lg shadow-[#FF5A1F]/20 border border-[#FF5A1F]'
                              : 'bg-[#0B1120] text-gray-400 hover:text-white border border-slate-800'
                      }`}
                  >
                      <span>Todas ({projects.length})</span>
                  </button>
                  {projects.map((p) => (
                      <button
                          key={p.id}
                          onClick={() => {
                              setSelectedProjectId(p.id);
                              setActiveProject(p);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                              selectedProjectId === p.id
                                  ? 'bg-gradient-to-r from-[#FF5A1F] to-[#FF7A28] text-white shadow-lg shadow-[#FF5A1F]/20 border border-[#FF5A1F]'
                                  : 'bg-[#0B1120] text-gray-400 hover:text-white border border-slate-800'
                          }`}
                      >
                          <Folder className="w-3.5 h-3.5" />
                          <span>{p.name || p.productName}</span>
                      </button>
                  ))}
              </div>
          )}

          {/* 1. TARJETA PRINCIPAL: SIGUIENTE ACCIÓN RECOMENDADA */}
          <div className="relative overflow-hidden rounded-[2rem] border border-[#FF5A1F]/30 bg-gradient-to-r from-[#0F172A] via-[#0B1120] to-[#1A0C06] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              
              {/* Glow de Fondo */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FF5A1F]/15 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                      
                      {/* Badge Naranja */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] text-[11px] font-black uppercase tracking-widest shadow-sm">
                          <Sparkles className="w-3.5 h-3.5" />
                          SIGUIENTE ACCIÓN RECOMENDADA
                      </div>

                      {/* Titular */}
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                          Publica tu primer Reel de {projectName}
                      </h2>

                      {/* Subtítulo */}
                      <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
                          Tu página de captura ya está activa. Utiliza uno de los 3 contenidos que preparamos para empezar a atraer visitas.
                      </p>

                      {/* Botón y Metadatos inferiores */}
                      <div className="pt-2 flex flex-wrap items-center gap-4">
                          <button 
                              onClick={() => navigate(activeProject ? `/dashboard/projects/${activeProject.id}/strategy` : '/dashboard/projects')}
                              className="bg-gradient-to-r from-[#FF5A1F] via-[#FF6A28] to-[#FF5A1F] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_0_25px_rgba(255,90,31,0.4)] hover:shadow-[0_0_35px_rgba(255,90,31,0.6)] transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
                          >
                              <span>VER CONTENIDOS</span>
                              <ArrowRight className="w-4 h-4" />
                          </button>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium">
                              <div className="px-3.5 py-2 rounded-xl bg-[#030712]/80 border border-slate-800/80 text-gray-300 flex items-center gap-2">
                                  <Folder className="w-3.5 h-3.5 text-[#FF5A1F]" />
                                  <span>Proyecto · {fullProjectTitle}</span>
                              </div>
                              <div className="px-3.5 py-2 rounded-xl bg-[#030712]/80 border border-slate-800/80 text-gray-300 flex items-center gap-2">
                                  <Play className="w-3.5 h-3.5 text-[#FF5A1F] fill-[#FF5A1F]" />
                                  <span>3 reels preparados</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Ilustración Vectorial / Estrella 3D de Fondo (Imagen 1) */}
                  <div className="hidden lg:flex items-center justify-center shrink-0 relative w-56 h-56">
                      <div className="absolute inset-0 bg-radial from-[#FF5A1F]/30 via-transparent to-transparent rounded-full blur-2xl"></div>
                      <div className="relative text-[#FF5A1F]/80">
                          <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 10 C100 65, 135 100, 190 100 C135 100, 100 135, 100 190 C100 135, 65 100, 10 100 C65 100, 100 65, 100 10 Z" 
                                    stroke="url(#sparkle_grad)" strokeWidth="3" fill="url(#sparkle_fill)" />
                              <path d="M100 35 C100 75, 125 100, 165 100 C125 100, 100 125, 100 165 C100 125, 75 100, 35 100 C75 100, 100 75, 100 35 Z" 
                                    stroke="#FF5A1F" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                              <defs>
                                  <linearGradient id="sparkle_grad" x1="10" y1="10" x2="190" y2="190" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#FF8B1F" />
                                      <stop offset="0.5" stopColor="#FF5A1F" />
                                      <stop offset="1" stopColor="#7C2D12" />
                                  </linearGradient>
                                  <linearGradient id="sparkle_fill" x1="100" y1="10" x2="100" y2="190" gradientUnits="userSpaceOnUse">
                                      <stop stopColor="#FF5A1F" stopOpacity="0.15" />
                                      <stop offset="1" stopColor="#000000" stopOpacity="0.4" />
                                  </linearGradient>
                              </defs>
                          </svg>
                      </div>
                  </div>
              </div>
          </div>



      </div>



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
            </div>

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

                {/* Gráfica 2: Leads Capturados */}
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
            </div>
        </div>

        {/* COLUMNA DERECHA: CUENTA, ACCIONES Y NOVEDADES (4 Cols) */}
        <div className="xl:col-span-4 space-y-8">
            
            {/* Estado de Tu Cuenta */}
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

                    <button 
                        onClick={() => setShowProfileModal(true)} 
                        className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-[#FF5A1F] border border-[#FF5A1F] text-white hover:bg-[#D94A1E] hover:border-[#D94A1E] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Zap className="w-4 h-4 fill-current" /> Gestionar Suscripción
                    </button>
                </div>
            </div>

            {/* Novedades y TIPS */}
            <div className="bg-[#0B1120] p-8 rounded-[2rem] border border-slate-800/80 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
                    <Newspaper className="w-40 h-40" />
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
                    className="w-full mt-10 py-4 rounded-xl border border-[#FF5A1F]/30 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                    Ver más novedades
                </button>
            </div>

        </div>
      </div>

      {/* Modal de histórico de novedades */}
      {showHistoryModal && (
          <NewsHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
      )}

      {/* Footer del Dashboard */}
      <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
      </footer>
    </div>
  );
};