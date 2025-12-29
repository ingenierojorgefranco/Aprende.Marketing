import React from 'react';
import { TrendingUp, PlayCircle, Calendar, Sparkles, DollarSign, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ProjectStrategy_BusinessGrowthProps {
    chartData: any[];
    onOpenVideo: () => void;
    commissionValue: number;
}

const CustomTooltip = ({ active, payload, label, commissionValue }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const income = data.income;
        const sales = commissionValue > 0 ? Math.floor(income / commissionValue) : 0;

        return (
            <div id="psd-tooltip-chart" className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-6 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[240px] animate-in fade-in zoom-in-95 duration-200">
                <div id="psd-tooltip-chart-header" className="flex items-center gap-3 mb-4 border-b border-gray-700/50 pb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-blue-100">{data.fullDate}</span>
                </div>
                <div id="psd-tooltip-chart-content" className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Ganancia Est.:</p>
                            <p className="text-emerald-400 font-black text-2xl leading-none">${income.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Ventas:</p>
                            <p className="text-white font-black text-2xl leading-none">{sales}</p>
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
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Tu camino hacia la <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">libertad financiera</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-emerald-500/30 pl-8 py-2">
                        Nuestro sistema no es magia, es estrategia. Como cualquier negocio requiere de tiempo y dedicación. Nuestro sistema se encuentra optimizado para darte grandes resultados en 1 año.
                    </p>
                    <p className="border-l-4 border-teal-500/30 pl-8 py-2">
                        Durante los primeros meses "sembramos" autoridad. A partir del cuarto mes, la bola de nieve empieza a rodar y el interés compuesto de tu contenido SEO genera ingresos predecibles.
                    </p>
                </div>
            </div>
            
            <div id="psd-business-chart-wrapper" className="max-w-[85em] mx-auto">
                <div id="psd-business-chart-card" className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-10 md:p-16 rounded-[4rem] relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] group">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                        <TrendingUp className="w-[30rem] h-[30rem] text-emerald-500" />
                    </div>
                    
                    <div className="relative z-10 h-[450px] w-full mb-16">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                            <div>
                                <h5 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                    Retorno de Inversión Estimado (Año 1)
                                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30">ROI Optimizando</div>
                                </h5>
                                <p className="text-gray-300 text-[1.4rem] leading-[1.8] font-light mt-1">Cálculo basado en una tasa de cierre promedio del 3% en WhatsApp.</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="bg-black/40 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><DollarSign className="w-6 h-6"/></div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Meta Mes 12</p>
                                        <p className="text-white font-black text-xl leading-none mt-1">${chartData[11]?.income?.toFixed(0)} USD</p>
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
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <div className="p-3 bg-white/5 rounded-full"><Sparkles className="w-5 h-5 text-yellow-500" /></div>
                            <p className="max-w-xs leading-relaxed italic">"Los resultados mostrados son proyecciones basadas en un trabajo constante en la generación de activos."</p>
                        </div>
                        
                        <button 
                            id="psd-business-video-btn"
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
        </div>
    );
};