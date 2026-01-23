import React from 'react';
import { Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check, Layout, Mail, MessageSquare, FileText, MousePointer2, Sparkles, Zap, ShieldAlert, XCircle, PlayCircle, Target, Users } from 'lucide-react';

interface ProjectStrategy_PsychologyProps {
    psychology: {
        pains: string[];
        solutions: string[];
        buyingPsychology?: {
            notBuyingReasons: Array<{ title: string; description: string; detail?: string }>;
        };
        conversionStrategy?: {
            mainFocus: Array<{ label: string; description: string }>;
            prioritizedChannels: Array<{ label: string; type: 'LP' | 'WA' | 'EM' | string }>;
            tacticalNote: string;
        };
    };
    benefitsItems?: Array<{ title: string; desc: string }>;
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ psychology, benefitsItems }) => {
    return (
        <div id="psd-psychology-section" className="space-y-16">
            
            {/* --- ENCABEZADO ESTRATÉGICO DE CLASE MUNDIAL --- */}
            <div id="psd-psychology-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                    <Flame className="w-5 h-5 fill-current" /> ¿Cómo les convencemos para que compren?
                </div>
                
                <h3 id="psd-psychology-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Ingeniería de Persuasión: <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Miedos y Soluciones</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-orange-500/30 pl-8 py-2">
                        Comprar no es un acto racional, es un acto emocional que luego se justifica con lógica. Por eso, nuestra estrategia no vende características técnicas, vende la solución al dolor que no deja dormir a tu cliente.
                    </p>
                    <p className="border-l-4 border-rose-500/30 pl-8 py-2">
                        Hemos analizado los miedos, inseguridades y objeciones más comunes de tu audiencia para convertirlos en argumentos de venta irrefutables. El objetivo es reducir la fricción mental y que la compra se sienta como el paso más natural y seguro del mundo.
                    </p>
                </div>
            </div>

            {/* BLOQUE DE VIDEO: SOPORTE VISUAL ESTRATÉGICO */}
            <div id="psd-psychology-video-block" className="max-w-[70em] mx-auto px-4 md:px-0">
                <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" 
                            title="Ingeniería de Persuasión" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
                            <PlayCircle className="w-5 h-5 text-indigo-400" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Video Explicativo de Persuasión</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NUEVA SECCIÓN: PILARES DE COMUNICACIÓN ESTRATÉGICA --- */}
            {psychology.conversionStrategy?.mainFocus && (
                <div className="max-w-[70em] mx-auto px-4 md:px-0">
                    <h4 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-indigo-400" /> Pilares de Comunicación Estratégica
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6">
                        {psychology.conversionStrategy.mainFocus.map((pillar, idx) => {
                            const Icon = idx === 0 ? Target : idx === 1 ? Users : Zap;
                            return (
                                <div key={idx} className="bg-gray-900/60 border border-gray-800 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all duration-500 shadow-xl relative group">
                                    <div className="absolute -inset-1 bg-indigo-500/5 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 w-fit shadow-inner">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h5 className="text-xl font-bold text-white tracking-tight">{pillar.label}</h5>
                                        <p className="text-gray-400 text-base leading-relaxed font-light">
                                            {pillar.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- SECCIÓN DE TÍTULO PARA EL ESPEJO --- */}
            <div className="max-w-[70em] mx-auto text-left mb-10 px-4 md:px-0">
                <h4 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                    Dolores vs Beneficios <span className="text-gray-500 font-light">(estructura clara y poderosa)</span>
                </h4>
                <div className="space-y-4">
                    <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed border-l-4 border-orange-500/30 pl-8 py-2">
                        Aquí es donde la persuasión ocurre de verdad. Cada dolor detectado tiene un beneficio específico que lo neutraliza.
                    </p>
                </div>
            </div>
            
            {/* --- SISTEMA DE ESPEJO: DOLOR VS SOLUCIÓN --- */}
            <div id="psd-mirror-container" className="max-w-[85em] mx-auto">
                <div className="space-y-10">
                    
                    {/* Headers del espejo (Grid para mantener alineación) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
                        <div className="flex items-center gap-4 px-8 py-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                            <AlertTriangle className="w-6 h-6 text-rose-500" />
                            <span className="text-rose-400 font-black uppercase tracking-[0.2em] text-sm">Dolores de tu Cliente</span>
                        </div>
                        <div className="hidden md:flex items-center gap-4 px-8 py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                            <Rocket className="w-6 h-6 text-emerald-500" />
                            <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-sm">Beneficios del Producto Digital</span>
                        </div>
                    </div>

                    {/* Mapeo del espejo por filas relativas */}
                    {psychology.pains.map((pain, i) => {
                        const benefit = (benefitsItems && benefitsItems[i]) ? benefitsItems[i] : null;
                        
                        return (
                            <div key={i} className="relative grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 group/row">
                                {/* Flecha Conectora Central (Solo Desktop) */}
                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gray-900 border border-gray-800 items-center justify-center text-gray-500 group-hover/row:text-orange-500 group-hover/row:border-orange-500/50 group-hover/row:scale-110 transition-all duration-500 shadow-2xl">
                                    <ArrowRight className="w-6 h-6" />
                                </div>

                                {/* Bloqueo (Dolor) */}
                                <div className="relative group/mirror">
                                    <div className="bg-gray-900/40 border border-gray-800 group-hover/mirror:border-rose-500/30 p-8 rounded-[2rem] transition-all duration-500 h-full flex items-center shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 opacity-20 group-hover/mirror:opacity-100 transition-opacity"></div>
                                        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-normal italic">
                                            "{pain}"
                                        </p>
                                    </div>
                                </div>

                                {/* Argumento (Cura) */}
                                <div className="relative group/solution">
                                    <div className="bg-gray-900/40 border border-gray-800 group-hover/solution:border-emerald-500/30 p-8 rounded-[2rem] transition-all duration-500 h-full flex items-center shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 opacity-20 group-hover/solution:opacity-100 transition-opacity"></div>
                                        <div className="absolute -left-14 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 rounded-lg hidden md:block opacity-0 group-hover/solution:opacity-100 transition-opacity">
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-emerald-50 text-lg md:text-xl leading-relaxed font-bold">
                                                {benefit ? benefit.title : (psychology.solutions[i] || "Transformación estratégica")}
                                            </p>
                                            {benefit?.desc && (
                                                <p className="text-emerald-200/70 text-base leading-relaxed font-light italic">
                                                    {benefit.desc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* */ /* Actualización: Matriz de objeciones detallada para FAQ y Cierre de Ventas - 15/06/2024 20:05 */ }
            {psychology.buyingPsychology?.notBuyingReasons && (
                <div className="max-w-[85em] mx-auto pt-20">
                    <div className="bg-black/60 rounded-[4rem] p-10 md:p-20 border border-white/5 relative overflow-hidden shadow-2xl">
                        <h5 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-orange-500" /> Matriz de Objeciones Detallada
                        </h5>
                        <div className="grid md:grid-cols-2 gap-8">
                            {psychology.buyingPsychology.notBuyingReasons.map((reason, idx) => (
                                <div key={idx} className="bg-gray-900/80 border border-gray-800 p-8 rounded-[2.5rem] hover:border-orange-500/30 transition-all">
                                    <h6 className="text-orange-400 font-bold text-xl mb-4">{reason.title}</h6>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Respuesta Corta (Chat)</p>
                                            <p className="text-gray-300 text-base leading-relaxed">{reason.description}</p>
                                        </div>
                                        {reason.detail && (
                                            <div className="pt-4 border-t border-white/5">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Explicación Detallada (FAQ)</p>
                                                <p className="text-gray-400 text-sm leading-relaxed italic">"{reason.detail}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Fin de actualización - 15/06/2024 20:05 */}

            <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-center gap-4 text-gray-500 text-sm font-medium tracking-wide relative z-10">
                <Check className="w-5 h-5 text-emerald-500" />
                Sincronización semántica de alta precisión activada.
            </div>
        </div>
    );
};