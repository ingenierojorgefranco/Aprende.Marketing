
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
  XCircle
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

////////// Actualización de Panel Hotmart: Aleatoriedad de ingresos, Cartera $33k y Evolución Dinámica - 01/06/2025 19:45 //////////

/**
 * Función para generar los datos de ventas solicitados:
 * Rango: 01 dic 2025 - 03 jun 2026
 * Punto de anclaje: 05 ene 2026 = $42.807
 * Rango diario: $47 - $650 (Alta Variabilidad)
 * Precio producto: $47
 * Cancelaciones: 0-2 por semana (restan $47 c/u)
 */
const generateHotmartData = () => {
  const startDate = new Date(2025, 11, 1); // 1 Dic 2025
  const anchorDate = new Date(2026, 0, 5);  // 5 Ene 2026
  const endDate = new Date(2026, 5, 3);    // 3 Jun 2026
  const anchorTotal = 42807;
  const productPrice = 47;
  
  const data: any[] = [];
  
  // Función para obtener ingreso diario base con alta variabilidad ($47 - $650)
  const getDailyBase = (date: Date) => {
    // Usamos una combinación de la fecha y funciones trigonométricas para romper patrones visuales
    const seed = date.getTime();
    const chaos = Math.abs(Math.sin(seed) * Math.cos(seed * 0.5));
    const randomValue = Math.floor(chaos * (650 - 47 + 1)) + 47;
    // Aseguramos que sea múltiplo de 47 aproximadamente o un valor "sucio" realista
    return randomValue;
  };

  const getCancellations = (date: Date) => {
    const dayOfWeek = date.getDay(); 
    const seed = date.getDate() + date.getMonth() * 31;
    if ((dayOfWeek === 3 && seed % 2 === 0) || (dayOfWeek === 6 && seed % 3 === 0)) {
        return 1;
    }
    return 0;
  };

  let tempDate = new Date(startDate);
  const dailyValues: any[] = [];
  
  while (tempDate <= endDate) {
    const baseIncome = getDailyBase(tempDate);
    const cancelCount = getCancellations(tempDate);
    const cancelAmount = cancelCount * productPrice;
    const netDaily = baseIncome - cancelAmount;
    const transactions = Math.round(baseIncome / productPrice);

    dailyValues.push({
      date: new Date(tempDate),
      baseIncome,
      cancelCount,
      cancelAmount,
      netDaily,
      transactions
    });
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const anchorIndex = dailyValues.findIndex(v => v.date.getTime() === anchorDate.getTime());
  
  // Cálculo de acumulados respetando el punto de anclaje de $42.807 al 5 de Enero
  dailyValues[anchorIndex].accumulated = anchorTotal;

  for (let i = anchorIndex - 1; i >= 0; i--) {
    dailyValues[i].accumulated = dailyValues[i+1].accumulated - dailyValues[i+1].netDaily;
  }

  for (let i = anchorIndex + 1; i < dailyValues.length; i++) {
    dailyValues[i].accumulated = dailyValues[i-1].accumulated + dailyValues[i].netDaily;
  }

  return dailyValues.map(v => ({
    date: v.date,
    dateStr: v.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    fullDateStr: v.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    ventas: v.netDaily,
    transacciones: v.transactions,
    cancelaciones: v.cancelAmount,
    totalAccumulated: v.accumulated
  }));
};

const fullHistoryData = generateHotmartData();

// Filtro de 30 días para visualización (06 Dic - 05 Ene)
const getChartData = () => {
    const anchorDate = new Date(2026, 0, 5);
    const thirtyDaysAgo = new Date(anchorDate);
    thirtyDaysAgo.setDate(anchorDate.getDate() - 30);
    return fullHistoryData.filter(d => d.date >= thirtyDaysAgo && d.date <= anchorDate);
};

const chartDisplayData = getChartData();

// Cálculo de métricas de los últimos 30 días para las tarjetas superiores
const periodMetrics = chartDisplayData.reduce((acc, curr) => ({
    gross: acc.gross + (curr.ventas + curr.cancelaciones),
    transactions: acc.transactions + curr.transacciones,
    cancellations: acc.cancellations + curr.cancelaciones
}), { gross: 0, transactions: 0, cancellations: 0 });

////////// Lógica de Cartera: Disponible $33.398 y Por cobrar (Suma últimos 15 días) - 01/06/2025 19:45 //////////
const getWalletMetrics = () => {
    const anchorDate = new Date(2026, 0, 5);
    const fifteenDaysAgo = new Date(anchorDate);
    fifteenDaysAgo.setDate(anchorDate.getDate() - 15);
    
    const last15DaysSum = fullHistoryData
        .filter(d => d.date >= fifteenDaysAgo && d.date <= anchorDate)
        .reduce((sum, curr) => sum + curr.ventas, 0);

    const available = 33398;
    const pending = last15DaysSum;
    
    return {
        available,
        pending,
        total: available + pending
    };
};

const wallet = getWalletMetrics();
////////// Fin de actualización - 01/06/2025 19:45 //////////

export const AdminHotmartPanel: React.FC = () => {
  const { user } = useOutletContext() as { user: User };
  const [showChart, setShowChart] = useState(true);
  // Se mantiene el estado aunque la tabla esté oculta visualmente
  const [showTable, setShowTable] = useState(false);

  // Valor de facturación actual dinámico según el último día de la gráfica (05 de Enero)
  const currentAccumulated = chartDisplayData[chartDisplayData.length - 1].totalAccumulated;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333] p-4 md:p-8 animate-in fade-in duration-500 font-sans">
      
      {/* Header Bienvenida */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-normal text-[#212529]">
          Hola, <span className="font-bold">Jorge Alberto Franco</span>, te damos la bienvenida 👋
        </h1>
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
          <Eye className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="flex-1 space-y-8">
          
          {/* Gestión de Ventas Header */}
          <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4 py-1">
            <h2 className="text-xl font-bold text-[#444] uppercase tracking-wide">Gestión de ventas</h2>
            <button className="text-[#3b82f6] font-bold text-sm flex items-center gap-1 hover:underline">
              Mostrar informes <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros */}
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

          {/* Metric Cards (Sumatorias de los últimos 30 días) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span className="flex items-center gap-1">Facturación bruta <Info className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-2xl font-bold text-[#333]">{periodMetrics.gross.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span className="flex items-center gap-1">Transacciones <Info className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-2xl font-bold text-[#333]">{periodMetrics.transactions}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
                <span className="flex items-center gap-1">Cancelaciones <Info className="w-3.5 h-3.5" /></span>
              </div>
              <p className="text-2xl font-bold text-[#333]">{periodMetrics.cancellations.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</p>
            </div>
          </div>

          {/* Gráfico Section (Multilínea: Bruto, Transacciones, Cancelaciones) */}
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

          {/* ////////// Sección Oculta: Detalle de Ventas Diarias (Histórico Completo) - 01/06/2025 19:45 ////////// */}
          {false && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
              {/* Contenido de la tabla removido visualmente según instrucción */}
            </div>
          )}
          {/* ////////// Fin de actualización - 01/06/2025 19:45 ////////// */}

          {/* Mi Cartera Section (Actualizada con montos $33k) */}
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
                  {/* ////////// Actualización de monto disponible a $33.398 - 01/06/2025 19:45 ////////// */}
                  <span className="text-2xl font-bold text-[#333]">{wallet.available.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-green-600 font-bold">
                    <span>por cobrar</span>
                    {/* ////////// Actualización de monto por cobrar (últimos 15 días) - 01/06/2025 19:45 ////////// */}
                    <span>{wallet.pending.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>total</span>
                    {/* ////////// Actualización de monto total de cartera - 01/06/2025 19:45 ////////// */}
                    <span>{wallet.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Mi Evolución Card (Dinámica) */}
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

              {/* ////////// Facturación Actual dinámica (se suma según pasan los días) - 01/06/2025 19:45 ////////// */}
              <p className="text-2xl font-bold text-orange-500 mb-1">{currentAccumulated.toLocaleString('es-ES')} US$</p>
              <p className="text-xs text-gray-400 font-bold mb-8 uppercase tracking-widest">Facturación Actual</p>
              {/* ////////// Fin de actualización - 01/06/2025 19:45 ////////// */}

              <div className="w-full space-y-3 mb-8">
                <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest justify-center">
                  <CheckCircle className="w-3.5 h-3.5" /> Lo estás logrando!
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  {/* Progreso basado en meta de 50k */}
                  <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (currentAccumulated / 50000) * 100)}%` }} />
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

          {/* Social/One Card */}
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
////////// Fin de actualización - 01/06/2025 19:45 //////////
