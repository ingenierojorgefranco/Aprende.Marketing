import React from 'react';
import { Rocket, FileText, DollarSign, Zap, ShieldCheck, BookOpen, Sparkles, Users, MessageCircle, Target, PlayCircle } from 'lucide-react';

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
    description
}) => {
    // Extraemos los datos dinámicos del JSON de estrategia
    const overviewItems = strategyData.meta.insights.overview.items || [];
    const price = strategyData.meta.price || 0;
    const commissionRate = strategyData.meta.commissionRate || 0;
    const netCommission = price * commissionRate;
    const summary = strategyData.meta.summary;
    
    // Lista unificada de 10 puntos en el orden exacto solicitado
    const orderedCards = [
        {
            label: "Producto que vas a vender",
            value: overviewItems[0]?.value || strategyData.meta.projectName,
            icon: BookOpen,
            color: "text-pink-400",
            border: "border-pink-500/20"
        },
        {
            label: "sector",
            value: strategyData.meta.niche || (overviewItems[1]?.value),
            icon: Sparkles,
            color: "text-purple-400",
            border: "border-purple-500/20"
        },
        {
            label: "Objetivo principal",
            value: summary?.primaryObjective || overviewItems[4]?.value || "Maximizar conversiones en automático",
            icon: Target,
            color: "text-indigo-400",
            border: "border-indigo-500/20"
        },
        {
            label: "Qué hace el sistema por ti",
            value: summary?.systemAction || "Crea las páginas, mensajes y contenidos necesarios",
            icon: Rocket,
            color: "text-orange-400",
            border: "border-orange-500/20"
        },
        {
            label: "¿Cómo se vende?",
            value: summary?.salesMethod || "Embudo automático con página + guía PDF + WhatsApp",
            icon: MessageCircle,
            color: "text-green-400",
            border: "border-green-500/20"
        },
        {
            label: "Para quién es",
            value: summary?.targetAudienceSummary || "Mujeres que quieren aprender microblading y generar ingresos",
            icon: Users,
            color: "text-blue-400",
            border: "border-blue-500/20"
        },
        {
            label: "Edades de tu Público objetivo",
            value: summary?.targetAgeRange || "Mujeres entre 22 y 38 años",
            icon: Users,
            color: "text-blue-400",
            border: "border-blue-500/20"
        },
        {
            label: "Porcentaje de Comisión por Venta",
            value: `${Math.round(commissionRate * 100)}%`,
            icon: Zap,
            color: "text-yellow-400",
            border: "border-yellow-500/20"
        },
        {
            label: "precio del curso",
            value: `$${price} USD`,
            icon: DollarSign,
            color: "text-blue-400",
            border: "border-blue-500/20"
        },
        {
            label: "Tu Ganancia por Venta",
            value: `$${netCommission.toFixed(2)} USD`,
            icon: DollarSign,
            color: "text-emerald-400",
            border: "border-emerald-500/20"
        }
    ];

    return (
        <div className="space-y-16">
            {/* BLOQUE: CABECERA ESTRATÉGICA A DOS COLUMNAS */}
            <div id="psd-summary-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/5">
                    <Zap className="w-5 h-5 fill-current" /> Resumen estratégico de tu Proyecto
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 leading-tight tracking-tight max-w-4xl">
                    {strategyData.meta?.projectName}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-10 text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="border-l-4 border-indigo-500 pl-8 py-2">
                        Hemos diseñado un sistema estratégico de ventas completo para tu producto digital, el cual se encuentra pensado en atraer personas interesadas, guiarlas paso a paso y convertirlas en tus potenciales clientes.
                    </p>
                    <p className="border-l-4 border-purple-500 pl-8 py-2">
                        Para lograrlo, nuestra inteligencia artificial ha analizado a fondo tu mercado y oferta, automatizando gran parte del proceso estratégico y ahorrándote tiempo en tareas complejas.
                    </p>
                </div>
            </div>

            {/* BLOQUE DE VIDEO: SOPORTE VISUAL ESTRATÉGICO */}
            <div id="psd-summary-video-block" className="max-w-[70em] mx-auto px-4 md:px-0">
                <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/watch?v=A_dcakdMBow" 
                            title="Explicación Estratégica del Sistema" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
                            <PlayCircle className="w-5 h-5 text-indigo-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Video Explicativo del Análisis</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BLOQUE: TARJETAS DE DATOS */}
            <div className="max-w-[70em] mx-auto bg-gray-900/40 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Rocket className="w-64 h-64 text-indigo-400" />
                </div>

                <div className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Renderizado de las 10 tarjetas unificadas */}
                        {orderedCards.map((card, i) => (
                            <div 
                                key={i} 
                                className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 bg-gray-900/40 backdrop-blur-sm flex flex-col h-full ${card.border} hover:border-indigo-500/40 group`}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4 shrink-0">
                                        <div className={`p-3 rounded-xl bg-black/40 ${card.color} flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <card.icon className="w-6 h-6" />
                                        </div>
                                        <p className={`text-xs md:text-sm font-black uppercase tracking-[0.2em] opacity-80 ${card.color}`}>
                                            {card.label}
                                        </p>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <p className="text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                                            {card.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* SECCIÓN: ANÁLISIS DEL PROYECTO */}
                    {description && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-10">
                            <h4 className="text-xl md:text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-indigo-400" /> Análisis del Producto Digital que vas a promocionar (En base a tu página de ventas)
                            </h4>
                            <div className="relative border-l-4 border-indigo-500/30 pl-8 py-2">
                                <div className="relative z-10">
                                    <div 
                                        className="prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white max-w-none text-[1.4rem] leading-[1.8] font-light"
                                        dangerouslySetInnerHTML={{ __html: description || '' }} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};