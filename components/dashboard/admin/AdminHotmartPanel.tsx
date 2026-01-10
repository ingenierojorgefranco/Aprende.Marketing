
import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Rocket, 
  CheckCircle,
  Eye,
  Calendar,
  MoreVertical,
  Flag,
  Crown,
  Sparkles,
  Target,
  ShoppingCart as CartIcon,
  List as ListIcon,
  XCircle,
  Maximize,
  Minimize
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { User } from '../../../types';
import { MOCK_HOTMART_HISTORY, BASE_TOTAL_INCOME, BASE_AVAILABLE, BASE_PENDING } from '../../../services/hotmartMockData';

/* Actualización: Sincronización final con array físico hardcodeado, aplicación de multiplicador $47 para ventas y cancelaciones, corrección de visualización dinámica (hoy - 30 días) y cálculo dinámico de cartera por cobrar - 11/06/2024 17:20 */

/* Actualización: Implementación de contadores acumulados dinámicos que suman el historial físico de ventas hasta la fecha actual, sumándolos a los valores base de facturación y cartera - 12/06/2024 10:45 */

/* Actualización: Ajuste de la lógica de acumulados para filtrar datos estrictamente desde el 1 de diciembre de 2025 hasta hoy, sumándolos a los valores base para corregir el total de facturación y disponible. 15/06/2024 19:00 */

/* Actualización: Ajuste de la primera tarjeta de métricas para mostrar la facturación de los últimos 30 días, manteniendo la facturación acumulada total en la sección de evolución derecha. 15/06/2024 20:15 */

const PRODUCT_PRICE = 47;

export const AdminHotmartPanel: React.FC = () => {
  const { user } = useOutletContext() as { user: User };
  const [showChart, setShowChart] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Procesamiento de datos centralizado
  const processedData = useMemo(() => {
    return MOCK_HOTMART_HISTORY.map(record => {
      const grossIncome = record.transactions * PRODUCT_PRICE;
      const cancelAmount = record.cancellations * PRODUCT_PRICE;
      const netIncome = grossIncome - cancelAmount;

      return {
        date: record.date,
        dateStr: record.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        fullDateStr: record.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
        ventas: netIncome,
        transacciones: record.transactions,
        cancelaciones: cancelAmount
      };
    });
  }, []);

  // Cálculo de acumulados históricos (Desde Diciembre 2025 -> Hoy)
  const accumulatedStats = useMemo(() => {
    const today = new Date();
    const startDate = new Date(2025, 11, 1); // 1 de Diciembre de 2025
    today.setHours(23, 59, 59, 999);
    
    return processedData
        .filter(d => d.date >= startDate && d.date <= today)
        .reduce((acc, curr) => ({
            income: acc.income + curr.ventas,
            transactions: acc.transactions + curr.transacciones,
            cancellations: acc.cancellations + curr.cancelaciones
        }), { income: 0, transactions: 0, cancellations: 0 });
  }, [processedData]);

  // Cálculo de métricas de los ÚLTIMOS 30 DÍAS
  const last30DaysStats = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    today.setHours(23, 59, 59, 999);
    
    return processedData
        .filter(d => d.date >= thirtyDaysAgo && d.date <= today)
        .reduce((acc, curr) => ({
            income: acc.income + curr.ventas,
            transactions: acc.transactions + curr.transacciones,
            cancellations: acc.cancellations + curr.cancelaciones
        }), { income: 0, transactions: 0, cancellations: 0 });
  }, [processedData]);

  // Filtrado dinámico para la gráfica (Hoy - 30 días)
  const chartDisplayData = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    today.setHours(23, 59, 59, 999);
    return processedData.filter(d => d.date >= thirtyDaysAgo && d.date <= today);
  }, [processedData]);

  // Métricas de Cartera dinámicas basadas en acumulados desde Diciembre 2025
  const wallet = useMemo(() => {
    return {
        available: BASE_AVAILABLE + (accumulatedStats.income * 0.9),
        pending: BASE_PENDING + (accumulatedStats.income * 0.1),
        total: BASE_TOTAL_INCOME + accumulatedStats.income
    };
  }, [accumulatedStats]);

  return (
    <div className={`text-[#333] transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-[9999] overflow-auto bg-[#F8F9FA]' : 'min-h-screen bg-[#F8F9FA]'} p-4 md:p-8 animate-in fade-in duration-500 font-sans`}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-normal text-[#212529]">
          Hola, <span className="font-bold">Jorge Alberto Franco</span>, te damos la bienvenida 👋
        </h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            title={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullScreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <Eye className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4 py-1">
            <h2 className="text-xl font-bold text-[#444] uppercase tracking-wide">Gestión de ventas</h2>
            <button className="text-[#3b82f6] font-bold text-sm flex items-center gap-1 hover:underline">
              Mostrar informes <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="relative group">
              <select className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 appearance-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                <option>Todos los productos</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative group">
              <select className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 appearance-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                <option>Dólar estadounidense</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative group">
              <select className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 appearance-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20">
                <option>Últimos 30 días</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span className="flex items-center gap-1">Facturación (30 días) <Info className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-2xl font-bold text-[#333]">{(last30DaysStats.income).toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span className="flex items-center gap-1">Transacciones (30 días) <Info className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-2xl font-bold text-[#333]">{last30DaysStats.transactions}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span className="flex items-center gap-1">Cancelaciones (30 días) <Info className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-2xl font-bold text-[#333]">{last30DaysStats.cancellations.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-lg font-bold text-[#444] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" /> Gráfico de desempeño diario de ventas
              </h3>
              <button 
                onClick={() => setShowChart(!showChart)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold flex items-center gap-1 transition-colors"
              >
                {showChart ? 'Ocultar' : 'Mostrar'} {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            
            {showChart && (
              <div className="p-6 animate-in slide-in-from-top duration-300">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-[#444]">Ventas (Últimos 30 días)</h4>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDisplayData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="dateStr" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        align="left" 
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }}
                      />
                      <Line 
                        name="Facturación bruta"
                        type="monotone" 
                        dataKey="ventas" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#10B981' }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        name="Cancelaciones"
                        type="monotone" 
                        dataKey="cancelaciones" 
                        stroke="#EF4444" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#EF4444' }} 
                      />
                      <Line 
                        name="Transacciones"
                        type="monotone" 
                        dataKey="transacciones" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#3B82F6' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 space-y-6 pb-20">
            <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4 py-1">
              <h2 className="text-xl font-bold text-[#444] uppercase tracking-wide">Mi cartera</h2>
              <button className="text-[#3b82f6] font-bold text-sm flex items-center gap-1 hover:underline">
                Acceder a la cartera <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-[#F0F2F5] rounded flex items-center justify-center border border-gray-200 overflow-hidden">
                  <Flag className="w-6 h-6 text-blue-800" />
                </div>
                <span className="text-xl font-bold text-[#444] tracking-tight">USD</span>
              </div>
              
              <div className="flex-1 w-full md:w-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-bold">Disponible</span>
                  <span className="text-2xl font-bold text-[#333]">{wallet.available.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-green-600 font-bold">
                    <span>por cobrar</span>
                    <span>{wallet.pending.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>total</span>
                    <span>{wallet.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#444]">Mi evolución</h3>
              <div className="flex items-center gap-1 bg-red-50 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                <Crown className="w-3 h-3 fill-current" /> Build
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-widest">Actualizado diariamente</p>
            
            <div className="flex flex-col items-center text-center py-4">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse shadow-inner">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute -inset-2 bg-blue-400/20 blur-xl rounded-full -z-10"></div>
              </div>

              <p className="text-2xl font-bold text-orange-500 mb-1">{wallet.total.toLocaleString('es-ES')} US$</p>
              <p className="text-xs text-gray-400 font-bold mb-8 uppercase tracking-widest">Facturación Actual</p>

              <div className="w-full space-y-3 mb-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest justify-center">
                  <CheckCircle className="w-3.5 h-3.5" /> Lo estás logrando!
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (wallet.total / 50000) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase text-center leading-relaxed">
                  Factura US$ 50 mil y desbloquea Spaceship
                </p>
              </div>

              <button className="w-full py-2.5 bg-[#F0F2F5] hover:bg-gray-200 text-[#444] rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200">
                <Sparkles className="w-3.5 h-3.5" /> Ver próximos logros
              </button>
            </div>
          </div>

          <div className="bg-[#052131] rounded-2xl p-6 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Target className="w-20 h-20" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1 mb-4">
                <Flag className="w-4 h-4 text-white" /> <span className="font-bold text-sm">one</span>
              </div>
              <h4 className="text-lg font-bold mb-4 leading-tight">Toda transformación empieza con una actitud</h4>
              <p className="text-xs text-orange-400 font-bold leading-relaxed">Forma parte del cambio y apoya una causa social</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
