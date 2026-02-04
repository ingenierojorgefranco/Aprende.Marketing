import React, { useState } from 'react';
import { TrendingUp, PlayCircle, Calendar, Sparkles, DollarSign, ArrowUpRight, Users, Clock, Zap, Check, AlertTriangle, Cpu, ArrowRight, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ProjectStrategy_BusinessGrowthProps {
    chartData: any[];
    onOpenVideo: () => void;
    commissionValue: number;
    commissionRate: number;
}

const CustomTooltip = ({ active, payload, label, commissionValue, fullData }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const income = data.income;
        const sales = commissionValue > 0 ? Math.floor(income / commissionValue) : 0;
        
        // Lógica de cálculo inverso basada en el 5% de tasa de cierre aprobada
        // Leads = Ganancia / (TasaCierre * ValorComision)
        const leads = (commissionValue > 0) ? Math.ceil(income / (0.05 * commissionValue)) : 0;

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

export const ProjectStrategy_BusinessGrowth: React.FC<ProjectStrategy_BusinessGrowthProps> = ({ chartData, commissionValue, commissionRate }) => {
    const [showVideoModal, setShowVideoModal] = useState(false);

    return (
        <div id="psd-business-growth-section" className="space-y-16 pt-8">
            
            <div id="psd-business-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                    <TrendingUp className="w-5 h-5" /> Proyección de Ingresos a 1 Año
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 leading-tight tracking-tight max-w-4xl">
                    ¿Cuánto podrías ganar con nuestra estrategia?
                </h3>
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-xl leading-relaxed font-light">
                    <p className="flex-1 border-l-4 border-emerald-500 pl-8 py-2">
                        Nuestro sistema está diseñado para ayudarte a construir un negocio digital que te permita generar ingresos progresivos utilizando contenido inteligente y automatización masiva. Sin embargo, no es una fórmula mágica ni resultados inmediatos.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-teal-500/30"></div>
                    <div 
                        onClick={() => setShowVideoModal(true)}
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group cursor-pointer"
                    >
                        <img 
                        src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-10 h-10 text-emerald-400" />
                            </div>
                        </div>
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
                                <h5 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                    Retorno de Inversión Estimado (Año 1)
                                </h5>
                                <p className="text-gray-300 text-sm leading-[1.8] font-light mt-1">Cálculo basado en una tasa de cierre promedio del 5% en WhatsApp.</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="bg-black/40 border border-emerald-500/30 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
                                    <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10"><DollarSign className="w-8 h-8"/></div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Meta de ingresos en 12 meses</p>
                                        <p className="text-white font-black text-3xl md:text-4xl tracking-tighter leading-none">$1.440 USD/MES</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
                        <h4 className="text-2xl font-black text-white mb-10 text-center uppercase tracking-widest opacity-80">Cómo se generan los ingresos (paso a paso)</h4>
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
                                        "Realizarás tus primeros cierres de venta reales gracias a la confianza generada por tu ecosistema de contenidos, el seguimiento persuasivo y nuestra estrategia de Lanzamientos que ejecutaremos vía Whatsapp."
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
                                            {phase.subtitle && <p className="text-gray-500 text-lg font-medium mt-1">{phase.subtitle}</p>}
                                            <h5 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">{phase.title}</h5>
                                        </div>
                                        <div className={`md:ml-auto px-6 py-2 rounded-full border border-white/10 h-fit ${phase.color} text-xl font-light leading-relaxed`}>
                                            {phase.objective}
                                        </div>
                                    </div>
                                    <ul className="flex flex-col gap-6">
                                        {phase.items.map((item, idx) => (
                                            <li key={idx} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-start gap-4 hover:border-gray-700 transition-all duration-300 group/point">
                                                <div className={`p-1.5 rounded-full ${phase.bg} ${phase.color} shrink-0 mt-0.5 group-hover/point:scale-110 transition-transform`}>
                                                    <Check className="w-4 h-4" />
                                                </div>
                                                <span className="text-white text-xl leading-relaxed font-light">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- PROYECCIÓN DE INGRESOS (UNIFICADA DENTRO DE LA TARJETA) --- */}
                    <div className="relative z-10 pt-16 border-t border-white/5 mb-16">
                        <div className="flex flex-col items-center gap-16 max-w-4xl mx-auto">
                            {/* Panel: Configuración Centrado */}
                            <div className="space-y-8 w-full flex flex-col items-center text-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                                        Tu Objetivo principal siempre será atraer Leads Interesados
                                    </div>
                                    <h4 className="text-4xl font-black text-white leading-tight">Proyección de ingresos <br/> (estimación orientativa)</h4>
                                    <div className="space-y-3 mt-8 flex flex-col items-center">
                                        <div className="flex items-center gap-3 text-white text-xl leading-relaxed font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Precio del curso: $200 USD
                                        </div>
                                        <div className="flex items-center gap-3 text-white text-xl leading-relaxed font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Ganancia por venta: $120 USD
                                        </div>
                                        <div className="flex items-center gap-3 text-white text-xl leading-relaxed font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Tasa de cierre estimada: 5% en WhatsApp
                                        </div>
                                        <div className="flex items-center gap-3 text-white text-xl leading-relaxed font-light">
                                            <Check className="w-5 h-5 text-emerald-500" /> Tu comisión por Venta: {Math.round(commissionRate * 100)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full max-md">
                                    <div className="bg-black/40 border border-emerald-500/30 rounded-2xl text-center p-5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Ganancia Neta / Venta</p>
                                        <p className="text-emerald-400 font-black text-3xl">$120.00</p>
                                    </div>
                                    <div className="bg-black/40 border border-gray-700 rounded-2xl text-center p-5">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Tasa de Cierre WA</p>
                                        <p className="text-white font-black text-3xl">5%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Panel: Tabla de Escala Centrado */}
                            <div className="bg-gray-800/40 rounded-[2.5rem] border border-gray-700 p-8 shadow-inner w-full max-w-2xl">
                                <h5 className="text-white font-bold mb-6 flex items-center justify-center gap-2">
                                    <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Mientras más leads tengas en tu sistema, mayor será tu probabilidad de generar altos ingresos.
                                </h5>
                                
                                <div className="space-y-4">
                                    {[
                                        { leads: 50, sales: "1–2", income: "120 - 240" },
                                        { leads: 100, sales: "3", income: "360" },
                                        { leads: 200, sales: "6", income: "720" }
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-black/20 border border-transparent hover:border-emerald-500/30 hover:bg-black/40 transition-all group">
                                            <div className="text-left">
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

                                <div className="mt-8 flex items-center gap-4 p-5 bg-black/60 border-l-4 border-amber-500/30 rounded-r-2xl shadow-xl text-left">
                                    <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
                                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <p className="text-[1.4rem] text-gray-200 leading-relaxed font-medium">
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

            {/* MODAL DE VIDEO */}
            {showVideoModal && (
                <div 
                    onClick={() => setShowVideoModal(false)}
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
                    >
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-emerald-500" /> Tutorial: Proyección de Ingresos
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Tutorial Proyección" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};