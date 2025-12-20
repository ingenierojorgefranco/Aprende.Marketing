import React from 'react';
import { Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check } from 'lucide-react';

interface ProjectStrategy_PsychologyProps {
    psychology: {
        pains: string[];
        solutions: string[];
    };
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ psychology }) => {
    return (
        <div id="psd-psychology-section" className="space-y-12 pt-8">
            
            {/* --- ENCABEZADO ESTRATÉGICO --- */}
            <div id="psd-psychology-header-container" className="max-w-[70em] mx-auto text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-widest animate-pulse">
                    <Flame className="w-4 h-4" /> Estrategia Psicológica
                </div>
                <h3 id="psd-psychology-header" className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                    <Flame className="w-12 h-12 text-orange-500"/> “Cómo el sistema va a convencer a tus clientes”
                </h3>
                <p id="psd-psychology-desc" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                    La venta es la consecuencia lógica de una secuencia psicológica bien ejecutada. Usamos gatillos mentales para conectar dolores específicos con soluciones tangibles, eliminando la fricción emocional y generando la confianza necesaria para transformar el interés en una decisión de compra inmediata.
                </p>
            </div>
            
            {/* --- TARJETA DE GATILLOS Y SOLUCIONES --- */}
            <div id="psd-psychology-card" className="max-w-[70em] mx-auto bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 uppercase text-xs font-black tracking-[0.2em] text-gray-500 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-rose-500"/> Los bloqueos del cliente</div>
                    <div className="hidden md:flex items-center gap-3 text-emerald-500"><Rocket className="w-5 h-5"/> Argumentos de venta</div>
                </div>

                <div className="space-y-8 relative">
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2"></div>

                    {psychology.pains.map((pain, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative group">
                            <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-2xl text-rose-100 text-lg font-medium relative group-hover:bg-rose-500/10 transition-colors">
                                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-900 border border-rose-500/20 rounded-full flex items-center justify-center text-xs font-bold text-rose-500 z-10 md:hidden shadow-lg">
                                    ↓
                                </div>
                                {pain}
                            </div>

                            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-900 border border-gray-700 rounded-full items-center justify-center z-10 text-gray-500 group-hover:text-emerald-400 group-hover:border-emerald-500/50 group-hover:scale-110 transition-all duration-300 shadow-xl">
                                <ArrowRight className="w-5 h-5" />
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl text-emerald-100 text-lg font-medium group-hover:bg-emerald-500/10 transition-colors">
                                {psychology.solutions[i] || "Solución específica no definida"}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-black/40 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Brain className="w-24 h-24 text-white" />
                    </div>
                    <h4 className="text-white font-black text-lg mb-6 flex items-center gap-3 relative z-10 uppercase tracking-tight">
                        <Brain className="w-6 h-6 text-purple-500"/> ¿Dónde aplicamos estos argumentos?
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm relative z-10">
                        {[
                            "Headline de la landing",
                            "Bullets principales",
                            "Emails de objeciones",
                            "Mensajes de WhatsApp",
                            "Artículos de blog"
                        ].map((label, i) => (
                            <span key={i} className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition cursor-default">
                                <Check className="w-4 h-4 text-blue-500 shrink-0" /> {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};