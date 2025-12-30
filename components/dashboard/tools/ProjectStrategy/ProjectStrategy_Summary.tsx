import React from 'react';
import { Rocket, FileText, DollarSign, Zap, ShieldCheck, BookOpen, Sparkles, Users, MessageCircle, Target } from 'lucide-react';

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
            value: overviewItems[4]?.value || "Maximizar conversiones en automático",
            icon: Target,
            color: "text-indigo-400",
            border: "border-indigo-500/20"
        },
        {
            label: "Qué hace el sistema por ti",
            value: "Crea las páginas, mensajes y contenidos necesarios",
            icon: Rocket,
            color: "text-orange-400",
            border: "border-orange-500/20"
        },
        {
            label: "¿Cómo se vende?",
            value: "Embudo automático con página + guía PDF + WhatsApp",
            icon: MessageCircle,
            color: "text-green-400",
            border: "border-green-500/20"
        },
        {
            label: "Para quién es",
            value: "Mujeres que quieren aprender microblading y generar ingresos",
            icon: Users,
            color: "text-blue-400",
            border: "border-blue-500/20"
        },
        {
            label: "Edades de tu Público objetivo",
            value: "Mujeres entre 22 y 38 años",
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
            {/* BLOQUE: RESUMEN ESTRATÉGICO DE TU PROYECTO */}
            <div className="max-w-[70em] mx-auto bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-black p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Rocket className="w-64 h-64 text-indigo-400" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-4 flex items-center gap-4">
                        <span className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg">⚡</span> 
                        Resumen estratégico de tu Proyecto
                    </h3>
                    
                    <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10 border-b border-white/5 pb-8">
                        Nuestra inteligencia artificial ha analizado profundamente tu producto elegido y el mercado actual para diseñar un ecosistema de ventas automatizado. Hará todo el trabajo difícil por ti de forma automática.
                    </p>

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
                                        <p className="text-white font-bold text-base md:text-lg leading-relaxed">
                                            {card.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Nota de pie del bloque */}
                    <div className="mt-10 flex items-center justify-center gap-3 text-gray-500 text-sm italic border-b border-white/5 pb-8 mb-12 text-center">
                        <ShieldCheck className="w-4 h-4" />
                        Esta configuración es la base para el cálculo de tu rentabilidad en el año 1.
                    </div>

                    {/* SECCIÓN: ANÁLISIS DEL PROYECTO */}
                    {description && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-10">
                            <h4 className="text-xl md:text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-indigo-400" /> Análisis del Producto Digital que vas a promocionar
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