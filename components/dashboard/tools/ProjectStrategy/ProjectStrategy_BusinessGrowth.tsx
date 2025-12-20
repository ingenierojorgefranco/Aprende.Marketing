import React from 'react';
import { TrendingUp, PlayCircle, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ProjectStrategy_BusinessGrowthProps {
    chartData: any[];
    onOpenVideo: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const income = data.income;
        const sales = Math.floor(income / 116.81);

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

export const ProjectStrategy_BusinessGrowth: React.FC<ProjectStrategy_BusinessGrowthProps> = ({ chartData, onOpenVideo }) => {
    return (
        <div id="psd-business-container" className="w-[80%] mx-auto py-6">
            <h3 id="psd-business-title" className="text-3xl font-bold text-white flex items-center gap-2 mb-6">
                <TrendingUp className="w-8 h-8 text-blue-500" /> Negocio a Largo Plazo
            </h3>
            <div id="psd-business-desc" className="text-gray-300 text-lg leading-relaxed font-light mb-8 space-y-4">
                <p>
                    Este es un proceso realista de construcción de negocio, no un esquema de enriquecimiento rápido. En la <b>Fase de Siembra</b> (primeros 3 meses), nuestro único objetivo es atraer una audiencia cualificada y generar confianza. Es el "valle de la muerte" donde muchos renuncian porque no ven resultados inmediatos, pero tú estarás construyendo los cimientos.
                </p>
                <p>
                    Luego entrarás en la <b>Fase de Validación y Crecimiento</b>. Verás tus primeras ventas, seguidas de un crecimiento exponencial. Es normal tener meses donde las ventas bajen (ajustes del mercado o saturación de anuncios), pero esto nos da la data para optimizar y lograr repuntes que dupliquen tu facturación anterior.
                </p>
                <p>
                    Nuestro objetivo final es que, antes de cumplir el año, hayas sistematizado tu embudo para generar de manera predecible más de <b>$2,000 USD mensuales</b>. La constancia en la estrategia de contenidos y la optimización del cierre son las claves que separan a los amateurs de los profesionales.
                </p>
            </div>
            
            <div id="psd-business-chart-card" className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <TrendingUp className="w-32 h-32 text-blue-500" />
                </div>
                
                <div className="relative z-10 h-[400px] w-full mb-8">
                    <h5 id="psd-business-chart-title" className="text-xl font-bold text-blue-400 uppercase mb-6 tracking-wide">Proyección Realista de Ingresos (Año 1)</h5>
                    <ResponsiveContainer width="100%" height="100%" id="psd-business-chart-wrapper">
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                            <defs>
                                <linearGradient id="colorIncomeMain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#4b5563" strokeOpacity={0.3} />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                axisLine={{ stroke: '#4b5563' }}
                                tickLine={false}
                                interval={0}
                                dy={10}
                                label={{ value: 'Meses de Operación', position: 'insideBottom', offset: -20, fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }}
                            />
                            <YAxis 
                                tickFormatter={(value) => `$${value}`}
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                axisLine={{ stroke: '#4b5563' }}
                                tickLine={false}
                                width={80}
                                label={{ value: 'Ingresos Mensuales (USD)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12, fontWeight: 'bold', style: { textAnchor: 'middle' } }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            <Area 
                                type="monotone" 
                                dataKey="income" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorIncomeMain)" 
                                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-center">
                    <button 
                        id="psd-business-video-btn"
                        onClick={onOpenVideo}
                        className="w-full max-w-md py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg shadow-xl shadow-blue-900/30 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                    >
                        <PlayCircle className="w-6 h-6 fill-white text-blue-600" />
                        Te lo explico en video
                    </button>
                </div>
            </div>
        </div>
    );
};