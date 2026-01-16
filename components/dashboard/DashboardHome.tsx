
import React, { useEffect, useState } from 'react';
////////// Importación de componentes necesarios para el nuevo Centro de Mando - 27/05/2025 14:15 //////////
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
    TrendingUp, Users, Loader2, 
    Rocket, FileText, Sparkles, Zap, Newspaper, 
    Layout, ChevronRight, ArrowUpRight, Bot, 
    Target, Briefcase, PlusCircle, DollarSign, Info, CreditCard, Calendar, ShieldCheck, Eye
} from 'lucide-react';
import { api } from '../../services/api';
import { MOCK_NEWS } from '../../services/mockData';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User, DashboardNews } from '../../types';
import { NewsHistoryModal } from './NewsHistoryModal';
import { LaunchPage } from '../LaunchPage';

interface DashboardContext {
    user: User;
    pageCount: number;
    projectCount: number;
    articleCount: number;
    systemMode: string;
    ////////// Adición de función para abrir el perfil desde el contexto - 27/05/2025 12:35 //////////
    setShowProfileModal: (show: boolean) => void;
    ////////// Fin de actualización - 27/05/2025 12:35 //////////
}
////////// Fin de actualización - 27/05/2025 14:15 /////////

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  ////////// Extracción de setShowProfileModal y systemMode del contexto - 27/05/2025 12:35 //////////
  const { user, systemMode, setShowProfileModal } = useOutletContext() as DashboardContext;
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
                ////////// Actualización: Carga de novedades real - 07/06/2025 10:30 //////////
                api.getNewsFeed()
                ////////// Fin de actualización - 07/06/2025 10:30 //////////
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
      <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#111111] border border-[#FF5A1F]/50 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[100] backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2 text-[#FF5A1F]">
              <span className="w-3.5 h-3.5"><Sparkles className="w-full h-full" /></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
          </div>
          <p className="text-xs text-gray-300 font-medium leading-relaxed">{content}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#FF5A1F]/50"></div>
      </div>
  );
  ////////// Fin de actualización - 27/05/2025 14:15 /////////

  // ////////// Lógica de Renderizado por Modo Lanzamiento - 28/05/2024 16:30 //////////
  if (systemMode === 'launch' && user.role !== 'admin') {
      return (
          <div className="animate-in fade-in duration-700">
              <LaunchPage isDashboard={true} />
          </div>
      );
  }

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FF5A1F]">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-black uppercase tracking-[0.2em] text-sm">Iniciando Centro de Mando...</p>
          </div>
      );
  }

  return (
    <div className="space-y-10 text-white animate-in fade-in slide-in-from-bottom-6 duration-700 bg-black min-h-screen">
      
      {/* Header Dinámico */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-l-4 border-[#FF5A1F] pl-6 py-2">
        <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Centro de Mando AM</h1>
            <p className="text-gray-500 font-light text-lg mt-1">Tu ecosistema ha crecido un <span className="text-[#FF5A1F] font-bold">12%</span> esta semana. Mantén el ritmo.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: MÉTRICAS Y GRÁFICAS (8 Cols) */}
        <div className="xl:col-span-8 space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Visitas Recibidas */}
                <div className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-2xl relative group">
                    <StrategicTooltip 
                        title="Tráfico Total" 
                        content="Cantidad total de personas que han aterrizado en tus páginas. Es el volumen inicial de tu embudo de ventas." 
                    />
                    <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:scale-110 transition-transform text-white">
                        <Eye className="w-16 h-16" />
                    </div>
                    <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Visitas Recibidas</p>
                    <h3 className="text-4xl font-black text-white leading-none">{summaryData.totalVisits}</h3>
                    <p className="text-gray-500 text-xs mt-3 font-medium">Tráfico Bruto</p>
                </div>

                {/* 2. Leads Capturados */}
                <div className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-2xl relative group">
                    <StrategicTooltip 
                        title="Leads (Contactos)" 
                        content="Personas que demostraron interés real dejando su email o iniciando chat. Son la base de tu base de datos." 
                    />
                    <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:scale-110 transition-transform text-white">
                        <Users className="w-16 h-16" />
                    </div>
                    <p className="text-xs font-black text-[#FF5A1F] uppercase tracking-[0.2em] mb-3">Leads Capturados</p>
                    <h3 className="text-4xl font-black text-white leading-none">{summaryData.totalConversions}</h3>
                    <p className="text-gray-500 text-xs mt-3 font-medium flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" /> +5% vs ayer
                    </p>
                </div>

                {/* 3. Tasa Conversión */}
                <div className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-2xl relative group">
                    <StrategicTooltip 
                        title="Efectividad" 
                        content="Mide qué porcentaje de visitas se convierten en leads. Si es bajo, necesitas mejorar el copy de tu landing." 
                    />
                    <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:scale-110 transition-transform text-white">
                        <TrendingUp className="w-16 h-16" />
                    </div>
                    <p className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-3">Tasa Conversión</p>
                    <h3 className="text-4xl font-black text-white leading-none">{summaryData.conversionRate}%</h3>
                    <p className="text-gray-500 text-xs mt-3 font-medium italic">Ratio de Éxito</p>
                </div>
            </div>

            {/* Bloque de Gráficas */}
            <div className="space-y-6">
                {/* Gráfica 1: Tráfico */}
                <div className="bg-[#090909] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
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
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 11, fontWeight: 'bold'}} dy={15} />
                                <YAxis hide={false} axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 11, fontWeight: 'bold'}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#111', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', color: '#fff'}}
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
                                    activeDot={{ r: 8, strokeWidth: 4, stroke: '#000', fill: '#FF5A1F' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ////////// Gráfica 2: Leads Capturados (Nueva) - 27/05/2025 14:30 ////////// */}
                <div className="bg-[#090909] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
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
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 11, fontWeight: 'bold'}} dy={15} />
                                <YAxis hide={false} axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 11, fontWeight: 'bold'}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#111', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', color: '#fff'}}
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
                                    activeDot={{ r: 8, strokeWidth: 4, stroke: '#000', fill: '#10b981' }}
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
            <div className="bg-[#111111] p-8 rounded-[2rem] border border-white/5 relative group text-white">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                    <ShieldCheck className="w-16 h-16" />
                </div>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Estado de Tu Cuenta</h3>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#FF5A1F]/10 rounded-xl text-[#FF5A1F]">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Plan Actual</p>
                            <p className="text-xl font-bold text-white capitalize">{user?.planLimits?.planName || 'Starter'}</p>
                        </div>
                    </div>

                    {(user?.planLimits?.planName === 'pro' || user?.planLimits?.planName === 'max') ? (
                        <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">Suscripción Activa</p>
                                <p className="text-sm font-bold text-white">Próxima Facturación: Automática</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                            Estás usando el plan gratuito. Sube de nivel para conectar dominios propios y eliminar marcas de agua.
                        </p>
                    )}

                    <button 
                        onClick={() => setShowProfileModal(true)} 
                        className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-white/5 border border-white/10 text-white hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all flex items-center justify-center gap-2"
                    >
                        <Zap className="w-4 h-4 fill-current" /> Gestionar Suscripción
                    </button>
                </div>
            </div>

            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 text-white">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Acciones Rápidas</h3>
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/dashboard/projects')}
                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-blue-600 hover:border-blue-500 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors text-white">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-lg">Gestionar Proyectos</span>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                    </button>

                    <button 
                        onClick={() => navigate('/dashboard/pages')}
                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors text-white">
                                <Layout className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-lg">Tus Páginas</span>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                    </button>

                    <button 
                        onClick={() => navigate('/dashboard/articles')}
                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-purple-600 hover:border-purple-500 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors text-white">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-lg">Contenidos SEO</span>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                    </button>
                </div>
            </div>

            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden text-white">
                <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none text-white">
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
                    className="w-full mt-10 py-4 rounded-xl border border-white/5 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                >
                    Ver Histórico
                </button>
            </div>
        </div>
      </div>

      {showHistoryModal && (
          <NewsHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
      )}

      <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <p className="text-xs font-medium uppercase tracking-[0.4em]">Aprende.Marketing v2.9 // Sistema Estratégico</p>
      </footer>
    </div>
  );
};
