
import React, { useEffect, useState } from 'react';
////////// Importación de componentes necesarios para el nuevo Centro de Mando - 24/05/2024 16:45 //////////
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
    TrendingUp, Users, MousePointer, Loader2, 
    Rocket, FileText, Sparkles, Zap, Newspaper, 
    Layout, ChevronRight, ArrowUpRight, Bot, 
    Target, Briefcase, PlusCircle, DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import { MOCK_NEWS, MOCK_TOP_PAGES } from '../../services/mockData';
import { useNavigate } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState({
      totalVisits: 0,
      totalConversions: 0,
      totalPages: 0,
      conversionRate: '0'
  });
  const [loading, setLoading] = useState(true);

  ////////// Lógica para calcular potencial de facturación (leads * 3% conv * $47) - 24/05/2024 16:45 //////////
  const calculatePotential = (leads: number) => {
      const convRate = 0.03;
      const price = 47;
      return (leads * convRate * price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  ////////// Fin de actualización - 24/05/2024 16:45 /////////

  const formatDayName = (dateString: string) => {
      const date = new Date(dateString);
      const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      return days[date.getUTCDay()];
  };

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [weeklyData, summary] = await Promise.all([
                api.getWeeklyAnalytics(),
                api.getAnalyticsSummary()
            ]);

            const formatted = weeklyData.map(item => ({
                name: formatDayName(item.date),
                fullDate: item.date,
                visits: item.visits,
                conversions: item.conversions
            }));
            setAnalyticsData(formatted);

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

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FF5A1F]">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p className="font-black uppercase tracking-[0.2em] text-sm">Iniciando Centro de Mando...</p>
          </div>
      );
  }

  return (
    ////////// Estructura del nuevo Centro de Mando AM (Negro absoluto y Naranja) - 24/05/2024 16:45 //////////
    <div className="space-y-10 text-white animate-in fade-in slide-in-from-bottom-6 duration-700 bg-black min-h-screen">
      
      {/* Header Dinámico */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-l-4 border-[#FF5A1F] pl-6 py-2">
        <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Centro de Mando AM</h1>
            <p className="text-gray-500 font-light text-lg mt-1">Tu ecosistema ha crecido un <span className="text-[#FF5A1F] font-bold">12%</span> esta semana. Mantén el ritmo.</p>
        </div>
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Servidores Online
             </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: MÉTRICAS Y PROYECCIONES (7 Cols) */}
        <div className="xl:col-span-8 space-y-8">
            
            {/* Cards de Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <Users className="w-20 h-20 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.2em] mb-4">Leads Capturados</p>
                    <h3 className="text-5xl font-black text-white leading-none">{summaryData.totalConversions}</h3>
                    <p className="text-gray-500 text-xs mt-4 font-medium flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-500" /> +5% vs ayer
                    </p>
                </div>

                <div className="bg-[#111111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-20 h-20 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.2em] mb-4">Tasa Conversión</p>
                    <h3 className="text-5xl font-black text-white leading-none">{summaryData.conversionRate}%</h3>
                    <p className="text-gray-500 text-xs mt-4 font-medium italic">Optimización Activa</p>
                </div>

                {/* Billing Potential Card */}
                <div className="bg-gradient-to-br from-[#FF5A1F] to-[#D94A1E] p-8 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(255,90,31,0.3)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-20 h-20 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em] mb-4">Potencial Facturación</p>
                    <h3 className="text-4xl font-black text-white leading-none">${calculatePotential(summaryData.totalConversions)}</h3>
                    <p className="text-white/70 text-xs mt-4 font-medium">Estimado basado en leads</p>
                </div>
            </div>

            {/* Gráfica Minimalista */}
            <div className="bg-[#090909] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-3">
                        <Target className="w-5 h-5 text-[#FF5A1F]" /> Evolución de Tráfico
                    </h3>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF5A1F" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#FF5A1F" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#ffffff" strokeOpacity={0.03} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 11, fontWeight: 'bold'}} dy={15} />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#111', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', color: '#fff'}}
                                itemStyle={{color: '#FF5A1F', fontWeight: 'black'}}
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
        </div>

        {/* COLUMNA DERECHA: ACCIONES, TOPS Y NEWS (4 Cols) */}
        <div className="xl:col-span-4 space-y-8">
            
            {/* Quick Launch Section */}
            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Acciones Rápidas</h3>
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/dashboard/generator')}
                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-[#FF5A1F] hover:border-[#FF5A1F] transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                                <Layout className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-lg">Lanzar Landing</span>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                    </button>

                    <button 
                        onClick={() => navigate('/dashboard/content-creator')}
                        className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-indigo-600 hover:border-indigo-500 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-lg">Artículo SEO</span>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                    </button>
                </div>
            </div>

            {/* Top Converting Pages */}
            <div className="bg-[#090909] p-8 rounded-[2rem] border border-white/5">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Top Páginas</h3>
                <div className="space-y-6">
                    {MOCK_TOP_PAGES.map((page, i) => (
                        <div key={page.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4 min-w-0">
                                <span className="text-gray-700 font-black italic text-xl">0{i+1}</span>
                                <div className="truncate">
                                    <p className="font-bold text-white truncate">{page.name}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{page.conversions} Leads</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-500 font-black text-sm">+{((page.conversions || 0)/(page.visits || 1)*100).toFixed(1)}%</div>
                                <p className="text-[10px] text-gray-600 uppercase font-black">Conv.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News Feed / Tips IA */}
            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none">
                    <Newspaper className="w-40 h-40" />
                </div>
                <h3 className="text-sm font-black text-[#FF5A1F] uppercase tracking-[0.2em] mb-8 relative z-10">Novedades & Tips IA</h3>
                <div className="space-y-8 relative z-10">
                    {MOCK_NEWS.map(news => (
                        <div key={news.id} className="group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg shrink-0 ${news.iconType === 'ia' ? 'bg-purple-500/10 text-purple-400' : news.iconType === 'update' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#FF5A1F]/10 text-[#FF5A1F]'}`}>
                                    {news.iconType === 'ia' ? <Bot className="w-5 h-5" /> : news.iconType === 'update' ? <Rocket className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-white group-hover:text-[#FF5A1F] transition-colors">{news.title}</h4>
                                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">{news.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed font-light">{news.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:bg-white/5 transition-all">Ver Histórico</button>
            </div>

        </div>
      </div>

      {/* Footer del Dashboard */}
      <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <p className="text-xs font-medium uppercase tracking-[0.4em]">Aprende.Marketing v2.9 // Sistema Estratégico</p>
          <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/10"></div>
              <div className="w-8 h-8 rounded-lg bg-white/10"></div>
          </div>
      </footer>
    </div>
  );
};
////////// Fin de actualización - 24/05/2024 16:45 /////////
