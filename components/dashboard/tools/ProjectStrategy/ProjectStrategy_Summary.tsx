import React, { useState } from 'react';
import { Rocket, FileText, DollarSign, Zap, ShieldCheck, BookOpen, Sparkles, Users, MessageCircle, Target, PlayCircle, X } from 'lucide-react';

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
    const [showVideoModal, setShowVideoModal] = useState(false);

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
            {/* BLOQUE: CABECERA ESTRATÉGICA A TRES PARTES */}
            <div id="psd-summary-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/5">
                    <Zap className="w-5 h-5 fill-current" /> Resumen estratégico de tu Proyecto
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 leading-tight tracking-tight max-w-4xl">
                    {strategyData.meta?.projectName}
                </h3>
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-indigo-500 pl-8 py-2">
                        Hemos diseñado un sistema estratégico de ventas completo para tu producto digital, el cual se encuentra pensado en atraer personas interesadas, guiarlas paso a paso y convertirlas en tus potenciales clientes.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-purple-500/30"></div>
                    <div 
                        onClick={() => setShowVideoModal(true)}
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group cursor-pointer"
                    >
                        <img 
                        src="https://img.youtube.com/vi/A_dcakdMBow/maxresdefault.jpg" 
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-10 h-10 text-indigo-400" />
                            </div>
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
                                <PlayCircle className="w-5 h-5 text-indigo-500" /> Tutorial: Resumen Estratégico
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/A_dcakdMBow?autoplay=1" 
                                title="Tutorial Resumen" 
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