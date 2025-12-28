
import React from 'react';
import { Rocket, Sparkles, DollarSign, Zap, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';

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

    // Función para renderizar la descripción (texto plano o Auditoría Estructurada)
    const renderAuditContent = (data: string | undefined) => {
        if (!data) return <p className="text-gray-500 italic">No hay descripción disponible.</p>;

        try {
            // Intentar parsear como JSON si es un string que parece objeto
            let audit: any = null;
            if (data.trim().startsWith('{')) {
                audit = JSON.parse(data);
            } else if (typeof data === 'object') {
                audit = data;
            }

            if (audit && audit.sections && Array.isArray(audit.sections)) {
                return (
                    <div className="space-y-10">
                        {audit.sections.map((section: any, sIdx: number) => (
                            <div key={sIdx} className="animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${sIdx * 100}ms` }}>
                                <h5 className="text-indigo-400 font-bold text-xl mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm">{sIdx + 1}</span>
                                    {section.title}
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.bullets.map((bullet: string, bIdx: number) => (
                                        <div key={bIdx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-500/50 group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors" />
                                            <p className="text-gray-300 text-base md:text-lg leading-relaxed">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }
        } catch (e) {
            // Si falla el parseo, caemos a renderizado de texto plano mejorado
        }

        // Fallback: Texto plano formateado
        return (
            <div className="text-gray-300 text-lg md:text-xl leading-[1.8] font-light">
                {data.split('\n').filter(p => p.trim() !== '').map((para, idx) => (
                    <p key={idx} className="mb-6 last:mb-0">{para}</p>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-16">
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

                        {/* TARJETA DE PRECIO */}
                        <div 
                            onMouseEnter={(e) => handleTooltipHover(e, ["Precio de venta oficial sugerido por la IA para este producto.", "Afecta directamente el cálculo de rentabilidad."])}
                            onMouseLeave={handleTooltipLeave}
                            className="p-6 md:p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm flex flex-col h-full transition-all hover:bg-blue-500/10 cursor-help"
                        >
                            <div className="flex items-center gap-4 mb-4 shrink-0">
                                <div className="p-3 rounded-xl bg-black/40 text-blue-400 flex-shrink-0 shadow-lg border border-blue-500/20">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-blue-400 opacity-80">
                                    Precio Sugerido del Producto
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-black text-2xl md:text-3xl tracking-tight">
                                    ${price} USD
                                </p>
                            </div>
                        </div>

                        {/* TARJETA DE COMISIÓN */}
                        <div 
                            onMouseEnter={(e) => handleTooltipHover(e, ["Porcentaje de ganancia que recibes por cada venta realizada."])}
                            onMouseLeave={handleTooltipLeave}
                            className="p-6 md:p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm flex flex-col h-full transition-all hover:bg-yellow-500/10 cursor-help"
                        >
                            <div className="flex items-center gap-4 mb-4 shrink-0">
                                <div className="p-3 rounded-xl bg-black/40 text-yellow-400 flex-shrink-0 shadow-lg border border-yellow-500/20">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-yellow-400 opacity-80">
                                    Comisión por Venta
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-black text-2xl md:text-3xl tracking-tight">
                                    {Math.round(commissionRate * 100)}%
                                </p>
                            </div>
                        </div>

                        {/* TARJETA DE GANANCIA NETA */}
                        <div 
                            onMouseEnter={(e) => handleTooltipHover(e, ["Dinero real que entra a tu cuenta después de comisiones de plataforma."])}
                            onMouseLeave={handleTooltipLeave}
                            className="p-6 md:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm flex flex-col h-full transition-all hover:bg-emerald-500/10 cursor-help md:col-start-2"
                        >
                            <div className="flex items-center gap-4 mb-4 shrink-0">
                                <div className="p-3 rounded-xl bg-black/40 text-emerald-400 flex-shrink-0 shadow-lg border border-emerald-500/20">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-emerald-400 opacity-80">
                                    Ganancia Neta por Venta
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-black text-2xl md:text-3xl tracking-tight">
                                    ${netCommission.toFixed(2)} <span className="text-sm font-bold opacity-60">USD</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-10 flex items-center justify-center gap-3 text-gray-500 text-sm italic border-b border-white/5 pb-8 mb-12 text-center">
                        <ShieldCheck className="w-4 h-4" />
                        Esta configuración es la base para el cálculo de tu rentabilidad en el año 1.
                    </div>

                    {/* SECCIÓN: AUDITORÍA ESTRATÉGICA ESTRUCTURADA */}
                    <div id="psd-analisis-bloque" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h4 className="text-xl md:text-2xl font-black text-white mb-8 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-indigo-400" /> Auditoría Estratégica del Proyecto
                        </h4>
                        <div className="bg-white/5 rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-inner relative overflow-hidden group/analisis">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover/analisis:opacity-10 transition-opacity">
                                <Sparkles className="w-32 h-32 text-white" />
                            </div>
                            <div className="relative z-10">
                                {renderAuditContent(description)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
