import React from 'react';
import { TrendingUp, PlayCircle, Calendar, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ProjectStrategy_BusinessGrowthProps {
    chartData: any[];
    onOpenVideo: () => void;
    commissionValue: number; // Nuevo prop
}

const CustomTooltip = ({ active, payload, label, commissionValue }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const income = data.income;
        // Calcular ventas basado en el valor de comisión dinámico
        const sales = commissionValue > 0 ? Math.floor(income / commissionValue) : 0;

        return (
            <div id="psd-tooltip-chart" className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-4 rounded-xl shadow-2xl min-w-[200px]">
                <div id="psd-tooltip-chart-header" className="flex items-center gap-2 mb-3 border-b border-gray-700/50 pb-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-100">{data.fullDate}</span>
                </div>
                <div id="psd-tooltip-chart-content" className="space-y-2">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">Ingresos:</p>
                        <p className="text-emerald-400 font-bold text-lg">${income.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">No de Ventas esperadas:</p>
                        <p className="text-white font-bold text-lg">{sales}</p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const ProjectStrategy_BusinessGrowth: React.FC<ProjectStrategy_BusinessGrowthProps> = ({ chartData, onOpenVideo, commissionValue }) => {
    return (
        <div id="psd-business-growth-section" className="space-y-12">
            
            {/* --- CABECERA DE SECCIÓN PREMIUM --- */}
            <div id="psd-business-header" className="max-w-[70em] mx-auto text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-black uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-4 h-4" /> Proyección de Crecimiento
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                    <TrendingUp className="w-12 h-12 text-blue-500" /> Negocio a Largo Plazo
                </h3>
                
                <div className="space-y-6 text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                    <p>
                        Este es un proceso realista de construcción de negocio, no un esquema de enriquecimiento rápido. En la Fase de Siembra (primeros 3 meses), nuestro único objetivo es atraer una audiencia cualificada y generar confianza. Es el "valle de la muerte" donde muchos renuncian porque no ven resultados inmediatos, pero tú estarás construyendo los cimientos.
                    </p>
                    <p>
                        Luego entrarás en la Fase de Validación y Crecimiento. Verás tus primeras ventas, seguidas de un crecimiento exponencial. Es normal tener meses donde las ventas bajen (ajustes del mercado o saturación de anuncios), pero esto nos da la data para optimizar y lograr repuntes que dupliquen tu facturación anterior.
                    </p>
                    <p>
                        Nuestro objetivo final es que, antes de cumplir el año, hayas sistematizado tu embudo para generar de manera predecible más de $2,000 USD mensuales. La constancia en la estrategia de contenidos y la optimización del cierre son las claves que separan a los amateurs de los profesionales.
                    </p>
                </div>
            </div>
            
            {/* --- TARJETA DE GRÁFICA --- */}
            <div id="psd-business-chart-wrapper" className="max-w-[70em] mx-auto">
                <div id="psd-business-chart-card" className="bg-gray-900/50 border border-gray-800 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <TrendingUp className="w-64 h-64 text-blue-500" />
                    </div>
                    
                    <div className="relative z-10 h-[400px] w-full mb-12">
                        <h5 id="psd-business-chart-title" className="text-xl font-black text-blue-400 uppercase mb-8 tracking-[0.2em]">Escalabilidad Estimada (Año 1)</h5>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                                <defs>
                                    <linearGradient id="colorIncomeMain" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#4b5563" strokeOpacity={0.2} />
                                <XAxis 
                                    dataKey="month" 
                                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }} 
                                    axisLine={{ stroke: '#4b5563', strokeOpacity: 0.3 }}
                                    tickLine={false}
                                    interval={0}
                                    dy={10}
                                />
                                <YAxis 
                                    tickFormatter={(value) => `$${value}`}
                                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }} 
                                    axisLine={{ stroke: '#4b5563', strokeOpacity: 0.3 }}
                                    tickLine={false}
                                    width={80}
                                />
                                <Tooltip content={<CustomTooltip commissionValue={commissionValue} />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#10b981" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorIncomeMain)" 
                                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#10b981' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center pt-6 border-t border-white/5">
                        <button 
                            id="psd-business-video-btn"
                            onClick={onOpenVideo}
                            className="w-full max-w-md py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-green-500 hover:to-emerald-500 text-white font-black text-xl shadow-2xl shadow-blue-900/30 flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <PlayCircle className="w-8 h-8 fill-white text-blue-600" />
                            Te lo explico en video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};