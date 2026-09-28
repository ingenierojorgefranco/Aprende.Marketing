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
  Minimize,
  Clock,
  BookOpen,
  HelpCircle,
  Sparkle,
  ArrowUpRight
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

const PRODUCT_PRICE = 47;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const fullDate = data.fullDateStr;
    const netIncome = data.ventas;
    const cancellations = data.cancelaciones;
    const transactions = data.transacciones;

    return (
      <div className="bg-white rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden w-64 text-left">
        {/* Header con la fecha */}
        <div className="bg-[#F8F9FA] px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-black text-slate-700 tracking-wide">{fullDate}</p>
        </div>
        
        {/* Lista de métricas */}
        <div className="divide-y divide-gray-100/60">
          {/* Facturación neta */}
          <div className="px-4 py-2.5">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Facturación neta</p>
            <p className="text-sm font-black text-[#10B981]">
              {netIncome.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$
            </p>
          </div>
          
          {/* Cancelaciones */}
          <div className="px-4 py-2.5">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Cancelaciones</p>
            <p className="text-sm font-black text-[#EF4444]">
              {cancellations.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$
            </p>
          </div>
          
          {/* Transacciones */}
          <div className="px-4 py-2.5">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Transacciones</p>
            <p className="text-sm font-black text-[#3B82F6]">
              {transactions}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const AdminHotmartPanel: React.FC = () => {
  const { user } = useOutletContext() as { user: User };
  const [showChart, setShowChart] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<'editar' | 'crear' | 'miembros'>('editar');

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
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
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
      
      {/* Saludo Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-light text-[#212529]">
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
        {/* Columna de la Izquierda: Gestión de Ventas y Cartera */}
        <div className="flex-1 space-y-8">
          
          {/* Header de Gestión de Ventas */}
          <div className="flex items-center justify-between border-l-4 border-[#FF5A1F] pl-4 py-1">
            <h2 className="text-xl font-bold text-[#212529] tracking-tight">Gestión de ventas</h2>
            <button className="text-[#3b82f6] font-bold text-sm flex items-center gap-1 hover:underline">
              Mostrar informes <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros de Selección de Productos, Monedas y Tiempos */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="relative">
              <select className="bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-sm appearance-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer text-gray-700 font-medium">
                <option>Todos los productos</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-sm appearance-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer text-gray-700 font-medium">
                <option>Dólar estadounidense</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <Calendar className="w-4 h-4" />
              </span>
              <select className="bg-white border border-gray-300 rounded-lg pl-9 pr-10 py-2.5 text-sm appearance-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer text-gray-700 font-medium">
                <option>Últimos 30 días</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Tarjetas de Métricas de Ventas - Formato Real de Hotmart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Facturación neta</span>
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>
              <p className="text-3xl font-extrabold text-[#212529] tracking-tight">{(last30DaysStats.income).toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Transacciones</span>
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>
              <p className="text-3xl font-extrabold text-[#212529] tracking-tight">{last30DaysStats.transactions}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <span>Cancelaciones</span>
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>
              <p className="text-3xl font-extrabold text-[#212529] tracking-tight">{last30DaysStats.cancellations.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</p>
            </div>
          </div>

          {/* Bloque Gráfico: Arena / Gris de Fondo en Hotmart, Gráfico Blanco interior */}
          <div className="bg-[#F5F6F7] rounded-2xl shadow-sm border border-gray-200 p-5 mt-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/70 mb-4">
              <h3 className="text-sm font-bold text-[#444] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" /> Gráfico de desempeño diario de ventas
              </h3>
              <button 
                onClick={() => setShowChart(!showChart)}
                className="text-gray-500 hover:text-gray-700 text-xs font-bold flex items-center gap-1 transition-colors bg-white px-2.5 py-1 rounded-md border border-gray-200"
              >
                {showChart ? 'Ocultar' : 'Mostrar'} {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            
            {showChart && (
              <div className="bg-white rounded-xl shadow-inner-sm p-6 border border-gray-200/60 animate-in slide-in-from-top duration-300">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-[#212529]">Ventas</h4>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDisplayData} margin={{ top: 10, right: 30, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                      <XAxis 
                        dataKey="dateStr" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#868E96', fontSize: 11, fontWeight: '500' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#868E96', fontSize: 11, fontWeight: '500' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="top" 
                        align="left" 
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ paddingTop: '0px', paddingBottom: '25px', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Line 
                        name="Facturación neta"
                        type="linear" 
                        dataKey="ventas" 
                        stroke="#10B981" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        name="Cancelaciones"
                        type="linear" 
                        dataKey="cancelaciones" 
                        stroke="#EF4444" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }} 
                      />
                      <Line 
                        name="Transacciones"
                        type="linear" 
                        dataKey="transacciones" 
                        stroke="#3B82F6" 
                        strokeWidth={2.5} 
                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Sección: Mi Cartera */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between border-l-4 border-[#FF5A1F] pl-4 py-1">
              <h2 className="text-xl font-bold text-[#212529] tracking-tight">Mi cartera</h2>
              <button className="text-[#3b82f6] font-bold text-sm flex items-center gap-1 hover:underline">
                Acceder a la cartera <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-[#F0F2F5] rounded flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                  <Flag className="w-6 h-6 text-blue-800" />
                </div>
                <span className="text-xl font-black text-[#212529] tracking-tight">USD</span>
              </div>
              
              <div className="flex-1 w-full md:w-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-bold text-sm">Disponible</span>
                  <span className="text-2xl font-black text-[#212529]">{wallet.available.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                </div>
                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-green-600 font-extrabold">
                    <span>por cobrar</span>
                    <span>{wallet.pending.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400 font-bold">
                    <span>total</span>
                    <span>{wallet.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} US$</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner promocional debajo de cartera (Carga de cobro inmediato) */}
            <div className="bg-[#F5F6F7] p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left transition-all hover:bg-gray-100/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5A1F] shrink-0 shadow-sm">
                  <DollarSign className="w-5 h-5 stroke-[2.5]" />
                </div>
                <p className="text-sm text-gray-700 font-semibold leading-snug">
                  Potencia tu saldo activando el plazo de cobro en 2 días.
                </p>
              </div>
              <button className="bg-[#212529] hover:bg-black text-white text-xs font-extrabold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm">
                <span>Quiero cobrar en 2 días</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sección Interactiva: Próximos pasos (0% completo) */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#212529] tracking-tight">Próximos pasos</h2>
              <span className="bg-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                0% completo
              </span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[280px]">
              {/* Sidebar de pestañas */}
              <div className="w-full md:w-64 border-r border-gray-100 bg-gray-50/50 p-4 space-y-2 flex flex-col">
                <button 
                  onClick={() => setActiveStepTab('editar')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeStepTab === 'editar' 
                      ? 'bg-white text-[#212529] shadow-sm border border-gray-200/80 pl-5 border-l-4 border-l-[#FF5A1F]' 
                      : 'text-gray-500 hover:bg-gray-100/50'
                  }`}
                >
                  <span>Editar producto</span>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                </button>
                <button 
                  onClick={() => setActiveStepTab('crear')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeStepTab === 'crear' 
                      ? 'bg-white text-[#212529] shadow-sm border border-gray-200/80 pl-5 border-l-4 border-l-[#FF5A1F]' 
                      : 'text-gray-500 hover:bg-gray-100/50'
                  }`}
                >
                  <span>Crear otro producto</span>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                </button>
                <button 
                  onClick={() => setActiveStepTab('miembros')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                    activeStepTab === 'miembros' 
                      ? 'bg-white text-[#212529] shadow-sm border border-gray-200/80 pl-5 border-l-4 border-l-[#FF5A1F]' 
                      : 'text-gray-500 hover:bg-gray-100/50'
                  }`}
                >
                  <span>Acceder al Área de Miembros</span>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                </button>
              </div>

              {/* Contenido de la pestaña */}
              <div className="flex-1 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="space-y-4 max-w-sm">
                  <h3 className="text-lg font-bold text-[#212529] leading-snug">
                    {activeStepTab === 'editar' && "Ajustar el producto puede ayudarte a vender más"}
                    {activeStepTab === 'crear' && "Expande tu catálogo creando un nuevo infoproducto"}
                    {activeStepTab === 'miembros' && "Mejora la experiencia educativa de tus alumnos"}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {activeStepTab === 'editar' && "Revisa el contenido, el precio y otras configuraciones para captar aún más clientes de forma inmediata."}
                    {activeStepTab === 'crear' && "Crea cursos, ebooks o mentorías adicionales para rentabilizar tu audiencia y diversificar tus fuentes de ingresos."}
                    {activeStepTab === 'miembros' && "Sube nuevos videos, organiza módulos interactivos y habilita el foro de preguntas para disparar la retención de tus alumnos."}
                  </p>
                  <button className="bg-[#212529] hover:bg-black text-white text-xs font-extrabold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                    {activeStepTab === 'editar' && "Editar producto"}
                    {activeStepTab === 'crear' && "Crear nuevo producto"}
                    {activeStepTab === 'miembros' && "Área de Miembros"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden shadow-inner relative group border border-gray-200 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=85" 
                    alt="Emprendedora Hotmart" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Consejos Para Ti (3 Cards con Overlay) */}
          <div className="mt-12 space-y-4">
            <div className="border-l-4 border-[#FF5A1F] pl-4 py-1">
              <h2 className="text-xl font-bold text-[#212529] tracking-tight">Consejos para ti</h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                El 40% de las personas que conquistan $10 mil en ventas usan estas herramientas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tarjeta 1 */}
              <div className="rounded-xl overflow-hidden relative h-52 group shadow-sm border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=350&q=80" 
                  alt="Área de Miembros" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 flex flex-col justify-end p-5" />
                <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5 z-10">
                  <p className="text-[9px] text-orange-400 font-extrabold uppercase tracking-widest">Crear Área de Miembros</p>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Aumenta más el engagement de tus clientes
                  </h4>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div className="rounded-xl overflow-hidden relative h-52 group shadow-sm border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=350&q=80" 
                  alt="Order Bump" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 flex flex-col justify-end p-5" />
                <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5 z-10">
                  <p className="text-[9px] text-orange-400 font-extrabold uppercase tracking-widest">Activa Order Bump</p>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Aumenta el ticket promedio de tu venta
                  </h4>
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div className="rounded-xl overflow-hidden relative h-52 group shadow-sm border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=350&q=80" 
                  alt="Leads cualificados" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 flex flex-col justify-end p-5" />
                <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5 z-10">
                  <p className="text-[9px] text-orange-400 font-extrabold uppercase tracking-widest">Capta leads cualificados</p>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Consigue las informaciones de contacto de posibles compradores
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: ¿Necesitas ayuda? */}
          <div className="mt-12 space-y-4 pb-16">
            <div className="border-l-4 border-[#FF5A1F] pl-4 py-1">
              <h2 className="text-xl font-bold text-[#212529] tracking-tight">¿Necesitas ayuda?</h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Elige el mejor canal para lo que necesitas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between h-44 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <HelpCircle className="w-5 h-5 text-gray-500 stroke-[2.5]" />
                  <h4 className="text-xs font-black text-[#212529] uppercase tracking-wider">Canales de soporte</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    Soporte sobre la plataforma, pagos y configuraciones técnicas. Disponible todos los días.
                  </p>
                </div>
                <button className="text-xs text-[#3b82f6] font-bold text-left hover:underline flex items-center gap-1 mt-2">
                  <span>Acceder al chat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between h-44 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <ListIcon className="w-5 h-5 text-gray-500 stroke-[2.5]" />
                  <h4 className="text-xs font-black text-[#212529] uppercase tracking-wider">Preguntas frecuentes</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    Encuentra respuestas rápidas y guías paso a paso sobre las principales dudas operativas.
                  </p>
                </div>
                <button className="text-xs text-[#3b82f6] font-bold text-left hover:underline flex items-center gap-1 mt-2">
                  <span>Acceder a la Central de Ayuda</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col justify-between h-44 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <BookOpen className="w-5 h-5 text-gray-500 stroke-[2.5]" />
                  <h4 className="text-xs font-black text-[#212529] uppercase tracking-wider">Aprende con Academy</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    Contenidos educativos y tutoriales premium pensados para ayudarte a escalar tu negocio en la práctica.
                  </p>
                </div>
                <button className="text-xs text-[#3b82f6] font-bold text-left hover:underline flex items-center gap-1 mt-2">
                  <span>Acceder al Academy</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha (Sidebar) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Tarjeta Superior: HOTMART LAUNCHPAD (Promoción Negra) */}
          <div className="bg-[#0D111A] rounded-xl p-6 text-white relative overflow-hidden shadow-md group border border-slate-800">
            <div className="absolute top-[-10px] right-[-10px] opacity-10 scale-125 select-none pointer-events-none text-slate-400">
              <Sparkle className="w-32 h-32 text-orange-500" />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="inline-block bg-orange-600/10 text-[#FF5A1F] border border-orange-500/20 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                HOTMART LAUNCHPAD
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Lanzamiento FIRE 2026</p>
                <h4 className="text-sm font-black leading-snug tracking-tight text-white">
                  Aquí, tu idea ya nace lista para venderse
                </h4>
              </div>
              <button className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04F1A] text-white rounded-lg font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <span>Quiero probarlo gratis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tarjeta Mi Evolución */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#212529] text-sm tracking-tight">Mi evolución</h3>
              <div className="flex items-center gap-1 bg-red-50 text-red-500 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-red-100">
                <Crown className="w-3 h-3 fill-current" /> Blueprint
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mb-6 font-black uppercase tracking-widest">Actualizado diariamente</p>
            
            <div className="flex flex-col items-center text-center py-4">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center animate-pulse shadow-inner">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute -inset-2 bg-blue-400/10 blur-xl rounded-full -z-10"></div>
              </div>

              <p className="text-2xl font-black text-orange-500 mb-1">{wallet.total.toLocaleString('es-ES')} US$</p>
              <p className="text-[10px] text-gray-400 font-bold mb-8 uppercase tracking-widest">Facturación Actual</p>

              <div className="w-full space-y-3 mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest justify-center">
                  <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Lo estás logrando!
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner border border-gray-200/40">
                  <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${Math.min(100, (wallet.total / 50000) * 100)}%` }} />
                </div>
                <p className="text-[9px] text-gray-400 font-black uppercase text-center leading-relaxed tracking-wider">
                  Factura US$ 50 mil y desbloquea Spaceship
                </p>
              </div>

              <button className="w-full py-2.5 bg-[#F0F2F5] hover:bg-gray-200 text-[#444] rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" /> 
                <span>Ver próximos logros</span>
              </button>
            </div>
          </div>

          {/* Tarjeta One */}
          <div className="bg-[#052131] rounded-xl p-6 text-white overflow-hidden relative group shadow-sm border border-[#0d2f44]">
            <div className="absolute top-[-10px] right-[-10px] opacity-10 group-hover:scale-110 transition-transform select-none pointer-events-none">
              <Target className="w-24 h-24 text-teal-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span className="font-extrabold text-xs uppercase tracking-wider">one</span>
              </div>
              <h4 className="text-sm font-bold mb-3 leading-snug">Toda transformación empieza con una actitud</h4>
              <p className="text-xs text-orange-400 font-bold leading-relaxed">Forma parte del cambio y apoya una causa social</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
