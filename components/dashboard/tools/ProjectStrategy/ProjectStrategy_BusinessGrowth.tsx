import React, { useMemo } from 'react';
import { TrendingUp, Calendar, Sparkles, DollarSign, ArrowUpRight, Users, Clock, Zap, Check, AlertTriangle, ArrowRight, Target } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

interface ProjectStrategy_BusinessGrowthProps {
    chartData?: any[];
    onOpenVideo?: () => void;
    commissionValue?: number;
    commissionRate?: number;
    hideHeader?: boolean;
}

const formatValue = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return "0";
    
    if (Number.isInteger(num)) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    const parts = num.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${parts[0]},${parts[1]}`;
};

const CustomTooltip = ({ active, payload, commissionValue }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const income = data.income;
        const sales = data.realSales;
        const leads = sales > 0 ? Math.ceil(sales / 0.05) : 0;

        return (
            <div className="bg-[#070D19]/95 backdrop-blur-xl border border-slate-700 p-4 rounded-xl shadow-2xl min-w-[200px] text-left">
                <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{data.fullDate}</span>
                </div>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold">Leads Necesarios:</span>
                        <span className="text-sky-400 font-bold flex items-center gap-1">
                            <Users className="w-3 h-3" /> {formatValue(leads)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold">Ventas Estimadas:</span>
                        <span className="text-white font-bold">{formatValue(sales)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Ganancia Estimada:</p>
                            <p className="text-emerald-400 font-extrabold text-lg leading-none">${formatValue(income)} USD</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const ProjectStrategy_BusinessGrowth: React.FC<ProjectStrategy_BusinessGrowthProps> = ({ 
    chartData, 
    commissionValue = 116, 
    commissionRate = 0.58,
    hideHeader = false
}) => {
    const commissionVal = commissionValue || 116;

    const defaultChartData = useMemo(() => {
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const fullNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const salesPattern = [1, 2, 3, 5, 7, 9, 12, 15, 18, 20, 22, 25];
        return months.map((month, idx) => ({
            month,
            income: salesPattern[idx] * commissionVal,
            realSales: salesPattern[idx],
            fullDate: `${fullNames[idx]} de 2026`
        }));
    }, [commissionVal]);

    const activeChartData = useMemo(() => {
        if (chartData && chartData.length > 0) {
            return chartData.map(item => {
                const rawIncome = item.income || 0;
                const realSales = commissionVal > 0 ? Math.floor(rawIncome / commissionVal) : 0;
                const adjustedIncome = realSales * commissionVal;
                return {
                    ...item,
                    income: adjustedIncome,
                    realSales: realSales
                };
            });
        }
        return defaultChartData;
    }, [chartData, commissionVal, defaultChartData]);

    const totalIncome = activeChartData.reduce((acc, curr) => acc + (curr.income || 0), 0);
    const leadScenarios = [50, 100, 200, 500, 1000];

    return (
        <div className="space-y-6 text-left animate-in fade-in duration-500">
            
            {/* 1. HEADER CARD */}
            {!hideHeader && (
                <StepHeaderCard
                    stepNumber={3}
                    totalSteps={13}
                    categoryTitle="Proyección de tus ganancias"
                    title="Proyección de tus ganancias"
                    description="Nuestro sistema está diseñado para ayudarte a construir un negocio digital con ingresos progresivos. Sin embargo, requiere tiempo y dedicación; plantéate desarrollar tu estrategia por mínimo 1 año."
                />
            )}

            {/* 2. VIDEO TUTORIAL */}
            {!hideHeader && (
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                    <StepVideoContainer 
                        videoUrl="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0"
                        title="Video Tutorial Growth"
                    />
                </div>
            )}

            {/* 3. CONTENIDO DE PROYECCIÓN Y TABLA */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                
                {/* Grid Config + Escala de Leads */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Columna Izquierda: Parámetros */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                                <Target className="w-3.5 h-3.5" /> Generación de Leads
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Proyección de ingresos basada en tu comisión
                            </h3>
                        </div>

                        <div className="space-y-3.5 bg-[#070D19] border border-slate-800 p-6 rounded-2xl text-base text-slate-200 font-medium">
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span>Ganancia neta por venta: <strong className="text-white font-bold">${formatValue(commissionVal)} USD</strong></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span>Tasa de cierre objetivo: <strong className="text-white font-bold">5% en WhatsApp</strong></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span>Porcentaje de comisión: <strong className="text-white font-bold">{formatValue(Math.round(commissionRate * 100))}%</strong></span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#070D19] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 text-center">
                                <p className="text-xs sm:text-sm text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Ganancia / Venta</p>
                                <p className="text-emerald-400 font-black text-3xl sm:text-4xl">${formatValue(commissionVal)}</p>
                            </div>
                            <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-4 sm:p-5 text-center">
                                <p className="text-xs sm:text-sm text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Cierre WA</p>
                                <p className="text-white font-black text-3xl sm:text-4xl">5%</p>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Escala de Leads */}
                    <div className="lg:col-span-7 bg-[#070D19] border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
                        <h4 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                            <ArrowUpRight className="w-5 h-5 text-emerald-400" /> 
                            Escala de ingresos según volumen de Leads
                        </h4>
                        
                        <div className="space-y-3">
                            {leadScenarios.map((leads, i) => {
                                const sales = Math.floor(leads * 0.05);
                                const incomeValue = sales * commissionVal;
                                return (
                                    <div key={i} className="flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-[#0B1120] border border-slate-800 hover:border-emerald-500/30 transition-all">
                                        <div className="text-left">
                                            <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-0.5">Atrayendo</p>
                                            <p className="text-white font-black text-base sm:text-lg flex items-center gap-2">
                                                <Users className="w-4.5 h-4.5 text-sky-400" /> {formatValue(leads)} Leads
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-xs sm:text-sm text-slate-300 font-extrabold uppercase">{formatValue(sales)} {sales === 1 ? 'venta' : 'ventas'}</p>
                                            <ArrowRight className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ganancia aprox.</p>
                                            <p className="text-emerald-400 font-black text-xl sm:text-2xl">${formatValue(incomeValue)} USD</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-[#0B1120] border-l-4 border-amber-500/50 rounded-r-2xl text-left text-xs sm:text-sm text-slate-200 font-medium">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p>Proyecciones basadas en un cierre conservador del 5%. Muestran el potencial de escala de tu activo digital.</p>
                        </div>
                    </div>

                </div>

                {/* Sección Gráfica */}
                <div className="pt-8 border-t border-slate-800 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Retorno de Inversión Estimado (Año 1)
                            </h4>
                            <p className="text-slate-400 text-xs sm:text-sm pt-1">Cálculo basado en una tasa de cierre promedio del 5% en WhatsApp.</p>
                        </div>

                        <div className="bg-[#070D19] border border-emerald-500/30 px-5 py-3 rounded-xl flex items-center gap-4 shadow-lg">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><DollarSign className="w-6 h-6"/></div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Meta de ingresos anual</p>
                                <p className="text-white font-extrabold text-xl sm:text-2xl">${formatValue(totalIncome)} USD</p>
                            </div>
                        </div>
                    </div>

                    {/* AreaChart */}
                    <div className="h-[320px] sm:h-[380px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncomeMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#334155" strokeOpacity={0.5} />
                                <XAxis 
                                    dataKey="month" 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: '600' }} 
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis 
                                    tickFormatter={(value) => `$${formatValue(value)}`}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '600' }} 
                                    axisLine={false}
                                    tickLine={false}
                                    width={70}
                                />
                                <Tooltip content={<CustomTooltip commissionValue={commissionVal} />} cursor={{ stroke: '#10b981', strokeWidth: 1.5 }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorIncomeMain)" 
                                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#0F172A', fill: '#10b981' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Indicadores de Etapa */}
                    <div className="pt-2">
                        <div className="flex w-full h-8 rounded-full overflow-hidden bg-[#070D19] border border-slate-800 p-1 text-xs font-bold text-white uppercase tracking-wider">
                            <div className="h-full bg-sky-500/80 rounded-l-full flex items-center justify-center" style={{ width: '16.6%' }}>
                                Etapa 1
                            </div>
                            <div className="h-full bg-emerald-500/80 flex items-center justify-center" style={{ width: '25%' }}>
                                Etapa 2
                            </div>
                            <div className="h-full bg-amber-500/80 rounded-r-full flex items-center justify-center" style={{ width: '58.4%' }}>
                                Etapa 3
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pasos Roadmap */}
                <div className="pt-8 border-t border-slate-800 space-y-6">
                    <h4 className="text-lg sm:text-xl font-bold text-white text-center uppercase tracking-wider">
                        Cómo se generan los ingresos (paso a paso)
                    </h4>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            {
                                title: "Etapa 1 - Preparación",
                                subtitle: "(Meses 1 - 2)",
                                icon: Clock,
                                color: "text-sky-400",
                                bg: "bg-sky-500/10",
                                borderColor: "border-sky-500/30",
                                items: [
                                    "Nuestro sistema creará de forma automática tus guiones de videos, páginas de ventas, secuencias de correos y artículos de blog optimizados.",
                                    "Publicas tus contenidos en redes sociales (YouTube, Instagram, Facebook, TikTok) para atraer a tus primeros visitantes.",
                                    "Las personas interesadas llegarán a tu página de captura, se registrarán para obtener tu LeadMagnet y se unirán a tu comunidad de WhatsApp."
                                ],
                                objective: "Objetivo: Construir tu activo digital para atraer clientes"
                            },
                            {
                                title: "Etapa 2 – Primeras Ventas",
                                subtitle: "(Meses 3 - 5)",
                                icon: TrendingUp,
                                color: "text-emerald-400",
                                bg: "bg-emerald-500/10",
                                borderColor: "border-emerald-500/30",
                                items: [
                                    "Tus artículos y videos ganarán autoridad en los algoritmos, atrayendo tráfico orgánico cualificado sin costo adicional.",
                                    "La audiencia registrada recibirá secuencias de correos y contenidos de alto valor por WhatsApp, generando confianza e interés.",
                                    "Realizarás tus primeros cierres de venta reales gracias al seguimiento persuasivo y la estrategia de lanzamientos por WhatsApp."
                                ],
                                objective: "Objetivo: Validar que tu estrategia digital funciona y genera resultados"
                            },
                            {
                                title: "Etapa 3 – Crecimiento acumulativo",
                                subtitle: "(Meses 6 - 12)",
                                icon: Zap,
                                color: "text-amber-400",
                                bg: "bg-amber-500/10",
                                borderColor: "border-amber-500/30",
                                items: [
                                    "A largo plazo, tus contenidos se convierten en un activo digital que educa, persuade y vende por ti las 24 horas del día.",
                                    "El número de prospectos interesados se estabiliza y crece de forma exponencial, permitiéndote predecir tus comisiones.",
                                    "Tu sistema alcanza madurez operativa, generando ingresos recurrentes y permitiéndote escalar tu negocio digital."
                                ],
                                objective: "Objetivo: Ingresos más predecibles y escalables"
                            }
                        ].map((phase, i) => (
                            <div key={i} className="bg-[#070D19] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl ${phase.bg} ${phase.color} border ${phase.borderColor}`}>
                                            <phase.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h5 className="text-base sm:text-lg font-bold text-white">{phase.title}</h5>
                                            {phase.subtitle && <p className="text-xs text-slate-400 font-semibold">{phase.subtitle}</p>}
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full bg-[#0B1120] border border-slate-700/80 ${phase.color} text-xs font-bold w-fit`}>
                                        {phase.objective}
                                    </span>
                                </div>

                                <ul className="space-y-3">
                                    {phase.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                                            <div className={`p-1 rounded-full ${phase.bg} ${phase.color} shrink-0 mt-0.5`}>
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cierre persuasivo */}
                <div className="pt-6 border-t border-slate-800 flex items-center gap-4 text-xs sm:text-sm text-slate-300 italic bg-[#070D19] border border-slate-800 p-4 rounded-xl">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <p>Los ingresos crecen de forma acumulativa a medida que el contenido gana autoridad y visibilidad. Este modelo premia la constancia, no la urgencia.</p>
                </div>
            </div>

        </div>
    );
};
