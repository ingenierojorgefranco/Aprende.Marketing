

import React, { useEffect, useState } from 'react';
import { LandingPage } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MousePointer, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface DashboardHomeProps {
  pages: LandingPage[];
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ pages }) => {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper para formatear fechas a "Lun", "Mar" etc.
  const formatDayName = (dateString: string) => {
      const date = new Date(dateString);
      // Ajuste para zona horaria si es necesario, o usar UTC
      const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
      // getUTCDay para asegurar consistencia con la fecha del servidor que suele ser YYYY-MM-DD
      return days[date.getUTCDay()];
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const data = await api.getWeeklyAnalytics();
            // Formatear datos para la gráfica
            const formatted = data.map(item => ({
                name: formatDayName(item.date),
                fullDate: item.date,
                visits: item.visits,
                conversions: item.conversions
            }));
            
            // Si la API devuelve pocos datos, rellenamos o mostramos lo que hay
            setAnalyticsData(formatted);
        } catch (error) {
            console.error("Error cargando analíticas", error);
        } finally {
            setLoading(false);
        }
    };

    fetchAnalytics();
  }, []); // Cargar solo al montar

  const totalVisits = pages.reduce((acc, p) => acc + p.visits, 0);
  const totalConversions = pages.reduce((acc, p) => acc + p.conversions, 0);
  const conversionRate = totalVisits > 0 ? ((totalConversions / totalVisits) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
        <p className="text-gray-400">Bienvenido de nuevo. Aquí tienes el rendimiento de tus landing pages.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            {/* Indicador de tendencia estático por ahora */}
            <span className="text-gray-500 text-xs font-medium">Acumulado</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{totalVisits}</h3>
          <p className="text-gray-400 text-sm">Visitas Totales</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-gray-500 text-xs font-medium">Acumulado</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{totalConversions}</h3>
          <p className="text-gray-400 text-sm">Conversiones Totales</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-gray-500 text-xs font-medium">Global</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{conversionRate}%</h3>
          <p className="text-gray-400 text-sm">Tasa de Conversión</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="font-bold text-white mb-6">Tráfico Semanal (Últimos 7 días)</h3>
          {/* Explicit height wrapper to fix Recharts width/height warning */}
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
          {/* Explicit height wrapper to fix Recharts width/height warning */}
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
