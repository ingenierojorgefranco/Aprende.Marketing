import React from 'react';
import { Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check, Layout, Mail, MessageSquare, FileText, MousePointer2, Sparkles, Zap } from 'lucide-react';

interface ProjectStrategy_PsychologyProps {
    psychology: {
        pains: string[];
        solutions: string[];
    };
    benefitsItems?: Array<{ title: string; desc: string }>;
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ psychology, benefitsItems }) => {
    
    // Mapeo extendido con el "Cómo" para cada canal
    const applicationChannels = [
        { 
            label: "Headline de la landing", 
            how: "Impacto inmediato capturando el deseo del avatar.", 
            icon: MousePointer2, 
            color: "text-blue-400", 
            bg: "bg-blue-500/10" 
        },
        { 
            label: "Bullets principales", 
            how: "Transformación tangible que rompe la inercia.", 
            icon: Layout, 
            color: "text-indigo-400", 
            bg: "bg-indigo-500/10" 
        },
        { 
            label: "Emails de objeciones", 
            how: "Lógica y autoridad para eliminar el miedo al riesgo.", 
            icon: Mail, 
            color: "text-purple-400", 
            bg: "bg-purple-500/10" 
        },
        { 
            label: "Mensajes de WhatsApp", 
            how: "Cierre persuasivo en el canal más íntimo.", 
            icon: MessageSquare, 
            color: "text-green-400", 
            bg: "bg-green-500/10" 
        },
        { 
            label: "Artículos de blog", 
            how: "Posicionamiento SEO educando al mercado.", 
            icon: FileText, 
            color: "text-orange-400", 
            bg: "bg-orange-500/10" 
        }
    ];

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

            {/* Texto de alineación reubicado debajo del espejo */}
            <div className="max-w-[70em] mx-auto text-left px-4 md:px-0">
                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed border-l-4 border-orange-500/30 pl-8 py-2">
                    Cada beneficio ha sido alineado meticulosamente con una debilidad emocional de tu comprador para maximizar la efectividad de tu oferta.
                </p>
            </div>

            {/* --- MATRIZ DE DESPLIEGUE: CENTRO DE MANDO --- */}
            <div id="psd-tactical-matrix" className="max-w-[85em] mx-auto pt-20">
                <div className="bg-black/60 rounded-[4rem] p-10 md:p-20 border border-white/5 relative overflow-hidden shadow-2xl">
                    
                    {/* Background decoration & Grid */}
                    <div className="absolute inset-0 z-0">
                         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
                         <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                            <Brain className="w-96 h-96 text-indigo-400" />
                         </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center mb-16">
                        <div className="p-4 bg-indigo-500/20 rounded-[2rem] mb-8 shadow-xl shadow-indigo-500/10">
                            <Zap className="w-12 h-12 text-indigo-400 fill-current" />
                        </div>
                        <h4 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
                            Distribución de Inteligencia en tu Ecosistema
                        </h4>
                        
                        <div className="max-w-[70em] text-gray-300 text-[1.4rem] leading-[1.8] font-light border-l-4 border-indigo-500/30 pl-8 py-2 text-left italic">
                            <p>
                                Nuestra IA no genera textos genéricos; <span className="text-white font-bold">inyecta los dolores y soluciones</span> detectados anteriormente en cada punto de contacto de tu embudo. El resultado es un sistema que "lee la mente" del comprador y derriba sus barreras antes de que siquiera pueda verbalizarlas.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {applicationChannels.map((channel, i) => (
                            <div 
                                key={i} 
                                className="bg-gray-900/80 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] flex flex-col items-start gap-6 group hover:border-indigo-500/40 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                            >
                                <div className={`p-4 rounded-2xl ${channel.bg} ${channel.color} group-hover:scale-110 transition-transform shadow-lg`}>
                                    <channel.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">
                                        {channel.label}
                                    </span>
                                    <p className="text-gray-300 text-lg leading-relaxed font-light">
                                        {channel.how}
                                    </p>
                                </div>
                            </div>
                        ))}
                        
                        {/* Summary / Call to Action inside the grid for visual balance */}
                        <div className="lg:col-span-1 flex flex-col justify-center p-8 bg-gradient-to-br from-indigo-900/20 to-rose-900/10 rounded-[2.5rem] border border-white/5 shadow-inner">
                            <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-widest text-xs mb-4">
                                <Sparkles className="w-5 h-5" /> Alineación Total
                            </div>
                            <p className="text-white text-xl font-bold leading-snug">
                                Cada palabra del sistema está alineada para convertir.
                            </p>
                        </div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-center gap-4 text-gray-500 text-sm font-medium tracking-wide relative z-10">
                        <Check className="w-5 h-5 text-emerald-500" />
                        Sincronización semántica de alta precisión activada.
                    </div>
                </div>
            </div>
        </div>
    );
};