import React from 'react';
import { Rocket, FileText, DollarSign, Zap, BookOpen, Sparkles, Users, MessageCircle, Target, Play } from 'lucide-react';

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-16 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
            {/* Div agrupador para encabezado y video (seccion_encabezado) */}
            <div className="seccion_encabezado space-y-12">
                {/* --- HEADER SECCIÓN --- */}
                <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                    {/* Degradado superior sutil */}
                    <div className="absolute inset-x-0 -top-24 h-[600px] bg-blue-600/10 blur-[140px] -z-10 rounded-full" />
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                        <Zap className="w-4 h-4 fill-current" /> Resumen estratégico de tu Proyecto
                    </div>
                    
                    <div className="space-y-4 px-4">
                        <h3 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight leading-none">
                            {strategyData.meta?.projectName}
                        </h3>
                        <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                            Hemos diseñado un sistema estratégico de ventas completo para tu producto digital, el cual se encuentra pensado en atraer personas interesadas, guiarlas paso a paso y convertirlas en tus potenciales clientes.
                        </p>
                    </div>
                </div>

                {/* --- VIDEO EXPLICATIVO --- */}
                <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                    <div className="inline-flex items-center gap-3 text-indigo-300 font-extrabold uppercase tracking-widest text-sm bg-indigo-500/5 px-8 py-4 rounded-2xl border border-indigo-500/10 backdrop-blur-sm mx-auto">
                        <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                    </div>
                    
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                        
                        <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-indigo-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial Summary" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
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