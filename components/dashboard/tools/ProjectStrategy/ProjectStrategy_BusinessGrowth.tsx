import React from 'react';
import { TrendingUp, PlayCircle, Calendar, Sparkles, DollarSign, ArrowUpRight, Users, Clock, Zap, Check, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ProjectStrategy_BusinessGrowthProps {
    chartData: any[];
    onOpenVideo: () => void;
    commissionValue: number;
}

const CustomTooltip = ({ active, payload, label, commissionValue, fullData }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const income = data.income;
        const sales = commissionValue > 0 ? Math.floor(income / commissionValue) : 0;
        
        // Buscar el índice del mes actual para la lógica de Leads
        const index = fullData.findIndex((d: any) => d.fullDate === data.fullDate);
        
        let leads = 0;
        if (index === 0) leads = 5;
        else if (index === 1) leads = 30; // Promedio de 15 a 45
        else if (index === 2) leads = 60; // Promedio de 50 a 70
        else leads = sales * 50; // A partir del mes 4: 50 leads por venta

        return (
            <div id="psd-tooltip-chart" className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-6 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[240px] animate-in fade-in zoom-in-95 duration-200">
                <div id="psd-tooltip-chart-header" className="flex items-center gap-3 mb-4 border-b border-gray-700/50 pb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-blue-100">{data.fullDate}</span>
                </div>
                <div id="psd-tooltip-chart-content" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Leads:</p>
                        <p className="text-blue-400 font-black text-xl flex items-center gap-1">
                            <Users className="w-3 h-3" /> {leads}
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ventas:</p>
                        <p className="text-white font-black text-xl">{sales}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-800 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Ganancia Estimada:</p>
                            <p className="text-emerald-400 font-black text-2xl leading-none">${income.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const ProjectStrategy_BusinessGrowth: React.FC<ProjectStrategy_BusinessGrowthProps> = ({ chartData, onOpenVideo, commissionValue }) => {
    return (
        <div id="psd-business-growth-section" className="space-y-16 pt-8">
            
            <div id="psd-business-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                    <TrendingUp className="w-5 h-5" /> ¿Cuánto voy a ganar con esto?
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 leading-tight tracking-tight max-w-4xl">
                    Tu camino de ingresos con este sistema
                </h3>
                
                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-emerald-500/30 pl-8 py-2">
                        Este sistema no promete resultados inmediatos ni dinero fácil. Está diseñado para ayudarte a construir un flujo de ingresos progresivo utilizando contenido, automatización y una estrategia de venta probada.
                    </p>
                    <div className="space-y-8">
                        <p className="border-l-4 border-teal-500/30 pl-8 py-2">
                            Los resultados dependen del trabajo constante, la aplicación del método y el tiempo que le dediques al proyecto.
                        </p>
                        <button 
                            id="psd-business-video-btn-header"
                            onClick={onOpenVideo}
                            className="w-full md:w-auto px-10 py-6 rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 transition-all hover:scale-[1.05] active:scale-95 group"
                        >
                            <PlayCircle className="w-8 h-8 fill-white text-emerald-600 group-hover:scale-110 transition-transform" />
                            ¿Qué quiere decir esto?
                            <ArrowUpRight className="w-5 h-5 opacity-50" />
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="psd-business-chart-wrapper" className="max-w-[85em] mx-auto">
                <div id="psd-business-chart-card" className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-10 md:p-16 rounded-[4rem] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] group">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                        <TrendingUp className="w-[30rem] h-[30rem] text-emerald-500" />
                    </div>
                    
                    <div className="relative z-10 h-[450px] w-full mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                            <div>
                                <h5 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                    Retorno de Inversión Estimado (Año 1)
                                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30">ROI Optimizando</div>
                                </h5>
                                <p className="text-gray-300 text-[1.4rem] leading-[1.8] font-light mt-1">Cálculo basado en una tasa de cierre promedio del 3% en WhatsApp.</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="bg-black/40 border border-emerald-500/30 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                                    <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10"><DollarSign className="w-8 h-8"/></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Meta Mes 12</p>
                                        <p className="text-white font-black text-3xl md:text-4xl tracking-tighter leading-none">$1.440 USD/MES</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <defs>
                                    <linearGradient id="colorIncomeMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
                                <XAxis 
                                    dataKey="month" 
                                    tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 'bold' }} 
                                    axisLine={false}
                                    tickLine={false}
                                    dy={20}
                                />
                                <YAxis 
                                    tickFormatter={(value) => `$${value}`}
                                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} 
                                    axisLine={false}
                                    tickLine={false}
                                    width={70}
                                />
                                <Tooltip content={<CustomTooltip commissionValue={commissionValue} fullData={chartData} />} cursor={{ stroke: '#10b981', strokeWidth: 2 }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#10b981" 
                                    strokeWidth={5}
                                    fillOpacity={1} 
                                    fill="url(#colorIncomeMain)" 
                                    activeDot={{ r: 10, strokeWidth: 4, stroke: '#000', fill: '#10b981' }}
                                    animationDuration={2500}
                                    animationEasing="ease-in-out"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* --- INDICADORES DE ETAPA EN LA GRÁFICA (REDESISEÑADOS) --- */}
                    <div className="relative z-10 px-20 mb-24 mt-[10rem]">
                        <div className="flex w-full h-10 rounded-full overflow-hidden bg-gray-800/50 p-1">
                            <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] rounded-l-full flex items-center justify-center text-[11px] font-black text-white uppercase tracking-[0.2em]" style={{ width: '16.6%' }}>
                                Etapa 1
                            </div>
                            <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center text-[11px] font-black text-white uppercase tracking-[0.2em]" style={{ width: '25%' }}>
                                Etapa 2
                            </div>
                            <div className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] rounded-r-full flex items-center justify-center text-[11px] font-black text-white uppercase tracking-[0.2em]" style={{ width: '58.4%' }}>
                                Etapa 3
                            </div>
                        </div>
                    </div>

                    {/* --- ROADMAP DE EJECUCIÓN (PASO A PASO) --- */}
                    <div className="relative z-10 pt-16 border-t border-white/5 mb-16 px-4">
                        <h4 className="text-2xl font-black text-white mb-10 text-center uppercase tracking-widest opacity-80">Cómo se generan los ingresos (paso a paso)</h4>
                        <div className="grid md:grid-cols-3 gap-10">
                            {[
                                {
                                    title: "Etapa 1 – Preparación (Meses 1–2)",
                                    icon: Clock,
                                    color: "text-blue-400",
                                    bg: "bg-blue-500/10",
                                    items: [
                                        "El sistema crea tu landing, mensajes y contenidos",
                                        "Publicas los primeros activos",
                                        "Empiezas a captar leads"
                                    ],
                                    objective: "Objetivo: poner la maquinaria en marcha"
                                },
                                {
                                    title: "Etapa 2 – Tracción inicial (Meses 3–5)",
                                    icon: TrendingUp,
                                    color: "text-emerald-400",
                                    bg: "bg-emerald-500/10",
                                    items: [
                                        "Los contenidos comienzan a posicionarse",
                                        "WhatsApp empieza a recibir conversaciones reales",
                                        "Se cierran las primeras ventas"
                                    ],
                                    objective: "Objetivo: validar que el sistema funciona"
                                },
                                {
                                    title: "Etapa 3 – Crecimiento acumulativo (Meses 6–12)",
                                    icon: Zap,
                                    color: "text-amber-400",
                                    bg: "bg-amber-500/10",
                                    items: [
                                        "El contenido trabaja 24/7",
                                        "El tráfico se vuelve constante",
                                        "Las ventas se repiten mes a mes"
                                    ],
                                    objective: "Objetivo: ingresos más predecibles"
                                }
                            ].map((phase, i) => (
                                <div key={i} className="bg-black/30 border border-gray-800/50 rounded-[2.5rem] p-10 relative overflow-hidden group/phase hover:border-gray-700 transition-all shadow-2xl">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`p-4 rounded-2xl ${phase.bg} ${phase.color} shadow-lg`}>
                                            <phase.icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h5 className="text-xl md:text-2xl font-black text-white mb-8 tracking-tight leading-tight min-h-[3.5rem]">{phase.title}</h5>
                                    <ul className="space-y-4 mb-8">
                                        {phase.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-300 text-base leading-relaxed">
                                                <Check className={`w-5 h-5 mt-1 shrink-0 ${phase.color}`} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={`pt-6 border-t border-white/5 font-black text-sm uppercase tracking-wider ${phase.color}`}>
                                        {phase.objective}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- PROYECCIÓN DE INGRESOS (UNIFICADA DENTRO DE LA TARJETA) --- */}
                    <div className="relative z-10 pt-16 border-t border-white/5 mb-16">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Panel Izquierdo: Configuración */}
                            <div className="space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                                        Supuesto base
                                    </div>
                                    <h4 className="text-4xl font-black text-white leading-tight">Proyección de ingresos <br/> (estimación orientativa)</h4>
                                    <div className="space-y-3 mt-8">
                                        <div className="flex items-center gap-3 text-gray-300 text-lg font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Precio del curso: $200 USD
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300 text-lg font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Ganancia por venta: $120 USD
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300 text-lg font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Tasa de cierre estimada: 3% en WhatsApp
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 border border-gray-800 p-5 rounded-2xl">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Ganancia Neta / Venta</p>
                                        <p className="text-emerald-400 font-black text-3xl">$120.00</p>
                                    </div>
                                    <div className="bg-black/40 border border-gray-700 p-5 rounded-2xl">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Tasa de Cierre WA</p>
                                        <p className="text-white font-black text-3xl">3%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Panel Derecho: Tabla de Escala */}
                            <div className="bg-gray-800/40 rounded-[2.5rem] border border-gray-700 p-8 shadow-inner">
                                <h5 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Ejemplo práctico de Escala
                                </h5>
                                
                                <div className="space-y-4">
                                    {[
                                        { leads: 50, sales: "1–2", income: "120 - 240" },
                                        { leads: 100, sales: "3", income: "360" },
                                        { leads: 200, sales: "6", income: "720" }
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-transparent hover:border-emerald-500/30 hover:bg-black/40 transition-all group">
                                            <div>
                                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Atrayendo</p>
                                                <p className="text-white font-black text-xl flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-blue-400" /> {row.leads} Leads
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">{row.sales} ventas</p>
                                                <ArrowRight className="w-6 h-6 text-gray-600 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Ganancia aprox.</p>
                                                <p className="text-emerald-400 font-black text-2xl tracking-tighter leading-none">${row.income} USD</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex items-center gap-4 p-5 bg-black/60 border-l-4 border-amber-500/30 rounded-r-2xl shadow-xl">
                                    <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
                                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <p className="text-sm text-gray-200 leading-relaxed font-medium">
                                        Estos números son proyecciones, no garantías. <span className="text-amber-400">Sirven para entender el potencial del sistema</span> cuando se aplica correctamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-8 pt-10 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-5 text-center">
                            <div className="p-3 bg-white/5 rounded-full shrink-0"><Sparkles className="w-6 h-6 text-yellow-500" /></div>
                            <p className="max-w-3xl leading-relaxed italic text-white text-2xl font-medium border-l-4 border-emerald-500/30 pl-8 py-2 text-left">
                                Los ingresos crecen de forma acumulativa a medida que el contenido gana autoridad y visibilidad. Este modelo premia la constancia, no la urgencia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
