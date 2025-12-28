import React from 'react';
import { Rocket, Sparkles, Search, DollarSign, Zap, FileText, ShieldCheck } from 'lucide-react';

interface ProjectStrategy_SummaryProps {
    strategyData: any;
    description?: string;
    activeHeaderItem: string | null;
    setActiveHeaderItem: (item: string | null) => void;
    handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
    handleTooltipLeave: () => void;
}

export const ProjectStrategy_Summary: React.FC<ProjectStrategy_SummaryProps> = ({ 
    strategyData, 
    description,
    handleTooltipHover, 
    handleTooltipLeave 
}) => {
    // Extraemos los items de la visión general
    const overviewItems = [...(strategyData.meta.insights.overview.items || [])];
    
    // Datos dinámicos del JSON
    const price = strategyData.meta.price || 0;
    const commissionRate = strategyData.meta.commissionRate || 0;
    const netCommission = price * commissionRate;

    return (
        <div className="space-y-16">
            {/* --- BLOQUE: DIAGNÓSTICO DEL CLIENTE IDEAL --- */}
            <div id="psd-diagnostico-intro" className="max-w-[70em] mx-auto text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-4 h-4" /> Inteligencia de Mercado
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                    <Search className="w-12 h-12 text-blue-500" /> Diagnóstico del Cliente Ideal
                </h2>
                
                <div className="space-y-6 text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                    <p>
                        Antes de crear cualquier página o contenido, Nuestro Sistema de Inteligencia Artificial ha analizado profundamente a tu público objetivo con base en el mercado del nicho de la belleza.
                    </p>
                    <p>
                        Este diagnóstico garantiza que todo lo que se genere conecte con la realidad de tu cliente final y asegure resultados reales para tu estrategia.
                    </p>
                </div>
            </div>

            {/* BLOQUE: RESUMEN ESTRATÉGICO DE TU PROYECTO */}
            <div className="max-w-[70em] mx-auto bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-black p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                <div id="psd-panel-decorator" className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Rocket className="w-64 h-64 text-indigo-400" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-10 flex items-center gap-4 border-b border-white/5 pb-8">
                        <span className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg">⚡</span> 
                        Resumen estratégico de tu Proyecto
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Renderizado Dinámico de Items de la Estrategia */}
                        {overviewItems.map((item: any, i: number) => {
                            const isProduct = i === 0;

                            return (
                                <div 
                                    key={i} 
                                    onMouseEnter={(e) => handleTooltipHover(e, [`Análisis del pilar: ${item.label}`, "Este punto define la coherencia de toda la secuencia de ventas."])}
                                    onMouseLeave={handleTooltipLeave}
                                    className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 bg-gray-900/40 backdrop-blur-sm cursor-help ${item.border} flex flex-col h-full ${isProduct ? 'md:col-span-2 border-indigo-500/30' : 'hover:border-indigo-500/50'}`}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-4 mb-4 shrink-0">
                                            <div className={`p-3 rounded-xl bg-black/40 ${item.color} flex-shrink-0 shadow-lg`}>
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <p className={`text-xs md:text-sm font-black uppercase tracking-[0.2em] opacity-80 ${item.color}`}>
                                                {item.label}
                                            </p>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <p className={`text-white font-bold leading-relaxed ${isProduct ? 'text-xl md:text-2xl text-indigo-100' : 'text-base md:text-lg'}`}>
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* TARJETAS DE PRECIO Y COMISIÓN DINÁMICAS */}
                        <div 
                            onMouseEnter={(e) => handleTooltipHover(e, ["Precio de venta oficial sugerido por la IA para este producto.", "Afecta directamente el cálculo de rentabilidad."])}
                            onMouseLeave={handleTooltipLeave}
                            className="p-6 md:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm flex flex-col h-full transition-all hover:bg-emerald-500/10 cursor-help"
                        >
                            <div className="flex items-center gap-4 mb-4 shrink-0">
                                <div className="p-3 rounded-xl bg-black/40 text-emerald-400 flex-shrink-0 shadow-lg border border-emerald-500/20">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-emerald-400 opacity-80">
                                    Precio Sugerido del Producto
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-black text-2xl md:text-3xl tracking-tight">
                                    ${price} USD
                                </p>
                            </div>
                        </div>

                        <div 
                            onMouseEnter={(e) => handleTooltipHover(e, ["Desglose de rentabilidad por venta.", "Muestra tu porcentaje de afiliación y la ganancia neta en dólares."])}
                            onMouseLeave={handleTooltipLeave}
                            className="p-6 md:p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm flex flex-col h-full transition-all hover:bg-yellow-500/10 cursor-help"
                        >
                            <div className="flex items-center gap-4 mb-4 shrink-0">
                                <div className="p-3 rounded-xl bg-black/40 text-yellow-400 flex-shrink-0 shadow-lg border border-yellow-500/20">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-yellow-400 opacity-80">
                                    Rentabilidad por Venta
                                </p>
                            </div>
                            <div className="flex-1 flex justify-between items-end">
                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Comisión</p>
                                    <p className="text-white font-black text-2xl md:text-3xl tracking-tight">
                                        {Math.round(commissionRate * 100)}%
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ganancia Neta</p>
                                    <p className="text-white font-black text-2xl md:text-3xl tracking-tight">
                                        ${netCommission.toFixed(2)} <span className="text-sm font-bold opacity-60">USD</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Nota de pie del bloque */}
                    <div className="mt-10 flex items-center gap-3 text-gray-500 text-sm italic border-b border-white/5 pb-8 mb-12">
                        <ShieldCheck className="w-4 h-4" />
                        Esta configuración es la base para el cálculo de tu rentabilidad en el año 1.
                    </div>

                    {/* NUEVA SECCIÓN: ANÁLISIS DEL PROYECTO */}
                    {description && (
                        <div id="psd-analisis-bloque" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h4 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-indigo-400" /> Análisis del proyecto
                            </h4>
                            <div className="bg-white/5 rounded-3xl p-6 md:p-10 border border-white/10 shadow-inner relative overflow-hidden group/analisis">
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover/analisis:opacity-10 transition-opacity">
                                    <Sparkles className="w-24 h-24 text-white" />
                                </div>
                                <p className="text-gray-300 text-lg md:text-xl leading-[1.8] font-light italic relative z-10 whitespace-pre-wrap">
                                    {description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};