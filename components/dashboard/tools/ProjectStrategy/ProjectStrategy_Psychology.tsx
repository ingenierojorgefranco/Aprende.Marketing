import React from 'react';
/* Added Sparkles to the imports */
import { Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check, Layout, Mail, MessageSquare, FileText, MousePointer2, Sparkles } from 'lucide-react';

interface ProjectStrategy_PsychologyProps {
    psychology: {
        pains: string[];
        solutions: string[];
    };
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ psychology }) => {
    
    // Mapeo de iconos para la matriz de aplicación
    const applicationChannels = [
        { label: "Headline de la landing", icon: MousePointer2, color: "text-blue-400" },
        { label: "Bullets principales", icon: Layout, color: "text-indigo-400" },
        { label: "Emails de objeciones", icon: Mail, color: "text-purple-400" },
        { label: "Mensajes de WhatsApp", icon: MessageSquare, color: "text-green-400" },
        { label: "Artículos de blog", icon: FileText, color: "text-orange-400" }
    ];

    return (
        <div id="psd-psychology-section" className="space-y-16">
            
            {/* --- ENCABEZADO ESTRATÉGICO DE CLASE MUNDIAL --- */}
            <div id="psd-psychology-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                    <Flame className="w-5 h-5 fill-current" /> Estrategia Psicológica
                </div>
                
                <h3 id="psd-psychology-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Ingeniería de Persuasión: <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Miedos y Soluciones</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-orange-500/30 pl-8 py-2">
                        La venta es un proceso emocional justificado por la lógica. Hemos decodificado los bloqueos subconscientes de tu cliente para transformarlos en argumentos de compra irrefutables.
                    </p>
                    <p className="border-l-4 border-rose-500/30 pl-8 py-2">
                        Al exponer el dolor y ofrecer el "antídoto" exacto en el momento preciso, eliminamos la parálisis por análisis y posicionamos tu oferta como la única salida segura.
                    </p>
                </div>
            </div>
            
            {/* --- SISTEMA DE ESPEJO: DOLOR VS SOLUCIÓN --- */}
            <div id="psd-mirror-container" className="max-w-[85em] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 relative">
                    
                    {/* Headers del espejo */}
                    <div className="flex items-center gap-4 px-8 py-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl md:col-start-1">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                        <span className="text-rose-400 font-black uppercase tracking-[0.2em] text-sm">Bloqueos de tu Cliente</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4 px-8 py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl md:col-start-2">
                        <Rocket className="w-6 h-6 text-emerald-500" />
                        <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-sm">Argumentos de Venta</span>
                    </div>

                    {/* El conector central (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-32 bottom-10 w-px bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 -translate-x-1/2"></div>

                    {/* Mapeo del espejo */}
                    {psychology.pains.map((pain, i) => (
                        <React.Fragment key={i}>
                            {/* Bloqueo (Dolor) */}
                            <div className="relative group/mirror">
                                <div className="bg-gray-900/40 border border-gray-800 group-hover/mirror:border-rose-500/30 p-8 rounded-[2rem] transition-all duration-500 h-full flex items-center shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 opacity-20 group-hover/mirror:opacity-100 transition-opacity"></div>
                                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hidden md:flex items-center justify-center z-10 text-gray-600 group-hover/mirror:text-rose-500 group-hover/mirror:border-rose-500/50 transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <p className="text-gray-300 text-xl md:text-2xl leading-relaxed font-medium italic">
                                        "{pain}"
                                    </p>
                                </div>
                            </div>

                            {/* Argumento (Cura) */}
                            <div className="relative group/solution">
                                <div className="bg-gray-900/40 border border-gray-800 group-hover/solution:border-emerald-500/30 p-8 rounded-[2rem] transition-all duration-500 h-full flex items-center shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 opacity-20 group-hover/solution:opacity-100 transition-opacity"></div>
                                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 rounded-lg hidden md:block">
                                        <Check className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <p className="text-emerald-50 text-xl md:text-2xl leading-relaxed font-bold">
                                        {psychology.solutions[i] || "Transformación estratégica definida por IA"}
                                    </p>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* --- MATRIZ DE APLICACIÓN TÁCTICA --- */}
            <div id="psd-tactical-matrix" className="max-w-[70em] mx-auto pt-20">
                <div className="bg-black/40 rounded-[3.5rem] p-10 md:p-16 border border-white/5 relative overflow-hidden shadow-2xl">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                        <Brain className="w-64 h-64 text-indigo-400" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center mb-12">
                        <div className="p-3 bg-purple-500/20 rounded-2xl mb-6">
                            <Brain className="w-10 h-10 text-purple-400" />
                        </div>
                        <h4 className="text-3xl font-black text-white tracking-tight mb-4">
                            Despliegue de Impacto
                        </h4>
                        <p className="text-gray-400 text-lg max-w-2xl font-light">
                            Estos argumentos no son teóricos. Nuestra IA los integra estratégicamente en cada punto de contacto de tu embudo de ventas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                        {applicationChannels.map((channel, i) => (
                            <div 
                                key={i} 
                                className="bg-gray-900/60 border border-gray-800 p-6 rounded-[1.5rem] flex flex-col items-center text-center gap-4 group hover:bg-gray-800 transition-all duration-300 hover:scale-[1.05]"
                            >
                                <div className={`p-3 bg-white/5 rounded-xl ${channel.color} group-hover:scale-110 transition-transform`}>
                                    <channel.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                                    {channel.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-3 text-gray-500 text-sm italic">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        Todo el copy del sistema está alineado para derribar estas barreras psicológicas.
                    </div>
                </div>
            </div>
        </div>
    );
};