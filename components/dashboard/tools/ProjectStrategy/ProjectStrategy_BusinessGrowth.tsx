import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Sparkles, DollarSign, ArrowUpRight, Users, Clock, Zap, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ProjectStrategy_BusinessGrowthProps {
    chartData: any[];
    onOpenVideo: () => void;
    commissionValue: number;
    commissionRate: number;
}

const formatValue = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return "0";
    
    // Si es un número entero, no mostramos decimales
    if (Number.isInteger(num)) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Si tiene decimales, usamos punto para miles y coma para decimales
    const parts = num.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${parts[0]},${parts[1]}`;
};

const CustomTooltip = ({ active, payload, label, commissionValue }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const income = data.income; // Este ya viene procesado como (ventas_reales * comision)
        
        // Ventas reales calculadas previamente en el mapeo
        const sales = data.realSales;
        
        // Cálculo de leads basado estrictamente en las ventas reales (Ventas / 0.05)
        const leads = sales > 0 ? Math.ceil(sales / 0.05) : 0;

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
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Leads Necesarios:</p>
                        <p className="text-blue-400 font-black text-xl flex items-center gap-1">
                            <Users className="w-3 h-3" /> {formatValue(leads)}
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Ventas:</p>
                        <p className="text-white font-black text-xl">{formatValue(sales)}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-800 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Ganancia Estimada:</p>
                            <p className="text-emerald-400 font-black text-2xl leading-none">${formatValue(income)} USD</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const ProjectStrategy_BusinessGrowth: React.FC<ProjectStrategy_BusinessGrowthProps> = ({ chartData, commissionValue, commissionRate }) => {
    // Saneamiento de datos para la gráfica: Convertimos ingresos brutos de IA a ingresos por unidades de venta reales (escalones)
    const adjustedChartData = useMemo(() => {
        return chartData.map(item => {
            const rawIncome = item.income || 0;
            // Unidades enteras = Suelo de (Ingreso / Comisión Fija)
            const realSales = commissionValue > 0 ? Math.floor(rawIncome / commissionValue) : 0;
            // Ingreso ajustado para la línea = Ventas reales * Comisión
            const adjustedIncome = realSales * commissionValue;

            return {
                ...item,
                income: adjustedIncome,
                realSales: realSales
            };
        });
    }, [chartData, commissionValue]);

    // Cálculo dinámico de la meta de ingresos sumando todos los meses de la proyección ajustada
    const totalIncome = adjustedChartData.reduce((acc, curr) => acc + (curr.income || 0), 0);

    // Escenarios de leads solicitados por el usuario
    const leadScenarios = [50, 100, 200, 500, 1000];

    return (
        <div id="psd-business-growth-section" className="space-y-16 pt-8">
            
            <div id="psd-business-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                    <TrendingUp className="w-5 h-5" /> Proyección de Ingresos a 1 Año
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 leading-tight tracking-tight max-w-4xl">
                    ¿Cuánto podrías ganar con nuestra estrategia?
                </h3>
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light pt-[10px]">
                    <div className="flex-1 border-l-4 border-emerald-500 pl-8 py-2">
                        <p>
                            Nuestro sistema está diseñado para ayudarte a construir un negocio digital que te permita generar ingresos progresivos. Sin embargo, no es una fórmula mágica, requiere tiempo y dedicación, si quieres tener resultados plantéate desarrollar tu estrategia por mínimo 1 año.
                        </p>
                    </div>
                    <div className="hidden md:block w-px h-24 bg-teal-500/30"></div>
                    <div 
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                    >
                        <iframe 
                            className="w-full h-full rounded-2xl"
                            src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
            
            <div id="psd-business-chart-wrapper" className="max-w-[85em] mx-auto">
                <div id="psd-business-chart-card" className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-10 md:p-16 rounded-[4rem] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] group">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                        <TrendingUp className="w-[30rem] h-[30rem] text-emerald-500" />
                    </div>
                    
                    <div className="relative z-10 h-[450px] w-full mb-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                            <div>
                                <h4 className="text-[2rem] font-black text-white tracking-tight flex items-center gap-3">
                                    Retorno de Inversión Estimado (Año 1)
                                </h4>
                                <p className="text-gray-300 text-[1.2rem] leading-[1.8] font-light mt-1 pt-[10px]">Cálculo basado en una tasa de cierre promedio del 5% en WhatsApp.</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="bg-black/40 border border-emerald-500/30 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                                    <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10"><DollarSign className="w-8 h-8"/></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Meta de ingresos</p>
                                        <p className="text-white font-black text-3xl md:text-4xl tracking-tighter leading-none">${formatValue(totalIncome)} USD</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={adjustedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
                                    dy={10}
                                />
                                <YAxis 
                                    tickFormatter={(value) => `$${formatValue(value)} USD`}
                                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} 
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                />
                                <Tooltip content={<CustomTooltip commissionValue={commissionValue} />} cursor={{ stroke: '#10b981', strokeWidth: 2 }} />
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

                        {/* --- INDICADORES DE ETAPA EN LA GRÁFICA --- */}
                        <div className="relative z-10 mt-0" style={{ paddingLeft: '56px', paddingRight: '7px', paddingTop: '15px' }}>
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
                    </div>

                    {/* --- ROADMAP DE EJECUCIÓN (PASO A PASO) --- */}
                    <div className="relative z-10 pt-20 border-t border-white/5 mb-16 px-4 mt-80">
                        <h4 className="text-[2rem] font-black text-white mb-10 text-center uppercase tracking-widest opacity-80">Cómo se generan los ingresos (paso a paso)</h4>
                        <div className="flex flex-col gap-10">
                            {[
                                {
                                    title: "Etapa 1 - Preparación",
                                    subtitle: "(Meses 1 - 2)",
                                    icon: Clock,
                                    color: "text-blue-400",
                                    bg: "bg-blue-500/10",
                                    items: [
                                        "Nuestro sistema creará de forma automática tus guiones de videos, páginas de ventas, secuencias de correos y los artículos de blog optimizados para atraer personas interesadas en tu producto digital.",
                                        "Publicas tus contenidos en redes sociales como YouTube, Instagram, Facebook y Tik Tok para atraer a tus primeros visitantes.",
                                        "Personas interesadas empezarán a llegar a tu página de captura, se registrarán para tener acceso a tu LeadMagnet y unirán a tu comunidad de WhatsApp."
                                    ],
                                    objective: "Objetivo: Construir tu activo digital para atraer clientes"
                                },
                                {
                                    title: "Etapa 2 – Primeras Ventas",
                                    subtitle: "(Meses 3 - 5)",
                                    icon: TrendingUp,
                                    color: "text-emerald-400",
                                    bg: "bg-emerald-500/10",
                                    items: [
                                        "Tus artículos de blog y videos en redes sociales ganarán autoridad en los algoritmos con el tiempo, atrayendo nuevo tráfico orgánico cualificado sin costo adicional.",
                                        "La audiencia que ya se ha registrado en tu pagina de captura recibirá correos electrónicos masivos y contenidos de alto valor que compartirás a través de Whatsapp, esto generará confianza e interés por parte de tus comunidad.",
                                        "Realizarás tus primeros cierres de venta reales gracias a la confianza generada por tu ecosistema de contenidos, el seguimiento persuasivo y nuestra estrategia de Lanzamientos que ejecutaremos vía WhatsApp."
                                    ],
                                    objective: "Objetivo: validar que tu estrategia digital funciona y genera resultados"
                                },
                                {
                                    title: "Etapa 3 – Crecimiento acumulativo",
                                    subtitle: "(Meses 6 - 12)",
                                    icon: Zap,
                                    color: "text-amber-400",
                                    bg: "bg-amber-500/10",
                                    items: [
                                        "A Larzo plazo tanto los Reels, como los videos Largos, Articulos de Blog y todos los contenidos educativos que compartas se convertirán en un activo digital que educa, persuade y vende por ti las 24 horas del día de forma incansable.",
                                        "El número de prospectos interesados en obtener más información sobre tu producto digital se estabiliza y crece exponencialmente, permitiéndote predecir tus resultados y comisiones con mayor precisión.",
                                        "Tu sistema alcanza su punto de madurez operativa, generando ingresos recurrentes y permitiéndote escalar tu negocio al siguiente nivel gracias a los contenidos generados y las estrategias de lanzamientos operativas."
                                    ],
                                    objective: "Objetivo: ingresos más predecibles"
                                }
                            ].map((phase, i) => (
                                <div key={i} className="bg-black/30 border border-gray-800/50 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group/phase hover:border-gray-700 transition-all shadow-2xl">
                                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 border-b border-white/5 pb-8">
                                        <div className={`p-4 rounded-2xl ${phase.bg} ${phase.color} shadow-lg`}>
                                            <phase.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            {phase.subtitle && <p className="text-gray-500 text-[1.2rem] font-medium mt-1 pt-[10px]">{phase.subtitle}</p>}
                                            <h5 className="text-[2rem] font-black text-white tracking-tight leading-tight">{phase.title}</h5>
                                        </div>
                                        <div className={`md:ml-auto px-6 py-2 rounded-full border border-white/10 h-fit ${phase.color} text-[1.2rem] font-light leading-relaxed pt-[10px]`}>
                                            {phase.objective}
                                        </div>
                                    </div>
                                    <ul className="flex flex-col gap-6">
                                        {phase.items.map((item, idx) => (
                                            <li key={idx} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-start gap-4 hover:border-gray-700 transition-all duration-300 group/point">
                                                <div className={`p-1.5 rounded-full ${phase.bg} ${phase.color} shrink-0 mt-0.5 group-hover/point:scale-110 transition-transform`}>
                                                    <Check className="w-4 h-4" />
                                                </div>
                                                <span className="text-white text-[1.2rem] leading-relaxed font-light">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- PROYECCIÓN DE INGRESOS (DINÁMICA BASADA EN COMISIÓN REAL) --- */}
                    <div className="relative z-10 pt-16 border-t border-white/5 mb-16">
                        <div className="flex flex-col items-center gap-16 max-w-4xl mx-auto">
                            {/* Panel: Configuración Centrado */}
                            <div className="space-y-8 w-full flex flex-col items-center text-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                                        Tu Objetivo principal siempre será atraer Leads Interesados
                                    </div>
                                    <h4 className="text-[2rem] font-black text-white leading-tight">Proyección de ingresos <br/> (estimación basada en tu comisión)</h4>
                                    <div className="space-y-3 mt-8 flex flex-col items-center text-[1.2rem] pt-[10px]">
                                        <div className="flex items-center gap-3 text-white leading-relaxed font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Tu Ganancia neta por venta: ${formatValue(commissionValue)} USD
                                        </div>
                                        <div className="flex items-center gap-3 text-white leading-relaxed font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Tasa de cierre objetivo: 5% en WhatsApp
                                        </div>
                                        <div className="flex items-center gap-3 text-white leading-relaxed font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Porcentaje de comisión: {formatValue(Math.round(commissionRate * 100))}%
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                    <div className="bg-black/40 border border-emerald-500/30 rounded-2xl text-center p-5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Ganancia Neta / Venta</p>
                                        <p className="text-emerald-400 font-black text-3xl">${formatValue(commissionValue)}</p>
                                    </div>
                                    <div className="bg-black/40 border border-gray-700 rounded-2xl text-center p-5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Tasa de Cierre WA</p>
                                        <p className="text-white font-black text-3xl">5%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Panel: Tabla de Escala Dinámica (AÑADIDOS 500 Y 1000 LEADS) */}
                            <div className="bg-gray-800/40 rounded-[2.5rem] border border-gray-700 p-8 shadow-inner w-full max-w-2xl">
                                <h5 className="text-white text-[1.2rem] font-bold mb-6 flex items-center justify-center gap-2 pt-[10px]">
                                    <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Mientras más leads tengas en tu sistema, mayor será tu probabilidad de generar altos ingresos.
                                </h5>
                                
                                <div className="space-y-4">
                                    {leadScenarios.map((leads, i) => {
                                        const sales = Math.floor(leads * 0.05);
                                        const incomeValue = sales * commissionValue;
                                        
                                        return (
                                            <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-transparent hover:border-emerald-500/30 hover:bg-black/40 transition-all group">
                                                <div className="text-left">
                                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Atrayendo</p>
                                                    <p className="text-white font-black text-xl flex items-center gap-2">
                                                        <Users className="w-5 h-5 text-blue-400" /> {formatValue(leads)} Leads
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <p className="text-[10px] text-gray-500 font-black uppercase mb-1">{formatValue(sales)} {sales === 1 ? 'venta' : 'ventas'}</p>
                                                    <ArrowRight className="w-6 h-6 text-gray-600 group-hover:text-emerald-500 transition-colors" />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Ganancia aprox.</p>
                                                    <p className="text-emerald-400 font-black text-2xl tracking-tighter leading-none">${formatValue(incomeValue)} USD</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 flex items-center gap-4 p-5 bg-black/60 border-l-4 border-amber-500/30 rounded-r-2xl shadow-xl text-left">
                                    <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
                                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <p className="text-[1.4rem] text-gray-200 leading-relaxed font-medium">
                                        Estos números son proyecciones basadas en un cierre conservador del 5%. <span className="text-amber-400">Sirven para entender el potencial de escala</span> de tu activo digital.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CIERRE PERSUASIVO --- */}
                    <div className="flex flex-col items-center justify-center gap-8 pt-10 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-5 text-center">
                            <div className="p-3 bg-white/5 rounded-full shrink-0"><Sparkles className="w-6 h-6 text-yellow-500" /></div>
                            <p className="max-w-3xl leading-relaxed italic text-white text-[1.2rem] font-medium border-l-4 border-emerald-500/30 pl-8 py-2 text-left pt-[10px]">
                                Los ingresos crecen de forma acumulativa a medida que el contenido gana autoridad y visibilidad. Este modelo premia la constancia, no la urgencia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};