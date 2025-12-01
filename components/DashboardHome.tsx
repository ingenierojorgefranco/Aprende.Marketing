import React from 'react';
import { LandingPage } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, MousePointer } from 'lucide-react';

interface DashboardHomeProps {
  pages: LandingPage[];
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ pages }) => {
  // Mock analytics data
  const data = [
    { name: 'Lun', visits: 400, conversions: 24 },
    { name: 'Mar', visits: 300, conversions: 13 },
    { name: 'Mie', visits: 550, conversions: 48 },
    { name: 'Jue', visits: 450, conversions: 35 },
    { name: 'Vie', visits: 600, conversions: 50 },
    { name: 'Sab', visits: 350, conversions: 20 },
    { name: 'Dom', visits: 420, conversions: 30 },
  ];

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
            <span className="text-green-400 text-sm font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{totalVisits}</h3>
          <p className="text-gray-400 text-sm">Visitas Totales</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-900/30 rounded-lg">
              <MousePointer className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+8.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{totalConversions}</h3>
          <p className="text-gray-400 text-sm">Conversiones Totales</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+2.4%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{conversionRate}%</h3>
          <p className="text-gray-400 text-sm">Tasa de Conversión</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="font-bold text-white mb-6">Tráfico Semanal</h3>
          {/* Explicit height wrapper to fix Recharts width/height warning */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
          <h3 className="font-bold text-white mb-6">Tendencia de Conversión</h3>
          {/* Explicit height wrapper to fix Recharts width/height warning */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', color: '#fff'}} 
                  itemStyle={{color: '#fff'}}
                />
                <Line type="monotone" dataKey="conversions" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};