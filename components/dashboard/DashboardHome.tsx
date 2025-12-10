import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MousePointer, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface DashboardHomeProps {}

export const DashboardHome: React.FC<DashboardHomeProps> = () => {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState({
      totalVisits: 0,
      totalConversions: 0,
      totalPages: 0,
      conversionRate: '0'
  });
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 text-white animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
        <p className="text-gray-400">Bienvenido. Aquí tienes el rendimiento general de tus {summaryData.totalPages} landing pages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-gray-500 text-xs font-medium">Acumulado</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{loading ? '...' : summaryData.totalVisits}</h3>
          <p className="text-gray-400 text-sm">Visitas Totales</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-gray-500 text-xs font-medium">Acumulado</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{loading ? '...' : summaryData.totalConversions}</h3>
          <p className="text-gray-400 text-sm">Conversiones Totales</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-gray-500 text-xs font-medium">Global</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{loading ? '...' : summaryData.conversionRate}%</h3>
          <p className="text-gray-400 text-sm">Tasa de Conversión</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="font-bold text-white mb-6">Tráfico Semanal (Últimos 7 días)</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
             {loading ? (
                 <div className="flex flex-col items-center text-gray-500">
                     <Loader2 className="w-8 h-8 animate-spin mb-2" />
                     <p>Cargando datos...</p>
                 </div>
             ) : analyticsData.length === 0 ? (
                 <p className="text-gray-500 text-sm">No hay datos de tráfico reciente.</p>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip 
                    contentStyle={{backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', color: '#fff'}}
                    itemStyle={{color: '#fff'}}
                    labelStyle={{color: '#9ca3af', marginBottom: '4px'}}
                    formatter={(value: any) => [value, 'Visitas']}
                    labelFormatter={(label, payload) => {
                        if (payload && payload[0] && payload[0].payload) {
                            return `${label} (${payload[0].payload.fullDate})`;
                        }
                        return label;
                    }}
                    />
                    <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
             )}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="font-bold text-white mb-6">Conversiones Diarias</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
             {loading ? (
                 <div className="flex flex-col items-center text-gray-500">
                     <Loader2 className="w-8 h-8 animate-spin mb-2" />
                     <p>Cargando datos...</p>
                 </div>
             ) : analyticsData.length === 0 ? (
                 <p className="text-gray-500 text-sm">No hay datos de conversiones recientes.</p>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip 
                    contentStyle={{backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', color: '#fff'}} 
                    itemStyle={{color: '#fff'}}
                    formatter={(value: any) => [value, 'Leads']}
                    />
                    <Line type="monotone" dataKey="conversions" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899'}} />
                </LineChart>
                </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};