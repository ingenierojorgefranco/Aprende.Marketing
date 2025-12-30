
import React from 'react';
import { Layers, ArrowRight, ArrowDown, PlayCircle, Clapperboard, Globe, CheckCircle2, Users, MessageCircle, FileText, MonitorPlay, ShoppingCart, Zap, RefreshCw, Sparkles, Rocket } from 'lucide-react';

const ACQUISITION_STEPS = [
    { 
        icon: Clapperboard, 
        title: "1. Atracción de Audiencia", 
        subtitle: "Canales: Reels, anuncios en Instagram, Facebook o Google", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué hace el sistema:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Define los mensajes clave y sugiere ideas de contenido.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Llamar la atención de personas interesadas y llevarlas a tu página.</p>
                </div>
            </div>
        )
    },
    { 
        icon: Globe, 
        title: "2. Landing Page", 
        subtitle: "Visitante deja sus datos para recibir el contenido gratuito.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Título principal</li>
                        <li>Dolores y beneficios</li>
                        <li>Llamado a la acción</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Convertir visitas en contactos reales (leads).</p>
                </div>
            </div>
        )
    },
    { 
        icon: CheckCircle2, 
        title: "3. Página de Gracias", 
        subtitle: "Instrucciones inmediatas tras el registro.", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Confirmamos el registro y guiamos al usuario al siguiente paso.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Mensaje de confirmación</li>
                        <li>Instrucciones claras</li>
                        <li>Enlace a WhatsApp o contenido</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Evitar que el lead se enfríe.</p>
                </div>
            </div>
        )
    },
    { 
        icon: Users, 
        title: "4. Comunidad", 
        subtitle: "Grupo de WhatsApp", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">El lead entra a un entorno más cercano y controlado.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Mensaje de bienvenida</li>
                        <li>Reglas del grupo</li>
                        <li>Mensajes de valor</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Generar confianza y cercanía.</p>
                </div>
            </div>
        )
    },
    { 
        icon: MessageCircle, 
        title: "5. Mensaje Directo", 
        subtitle: "Conversación 1 a 1", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Se resuelven dudas personales antes de la compra.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Mensajes base</li>
                        <li>Respuestas a objeciones</li>
                        <li>Guiones de cierre</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Acompañar la decisión sin presión.</p>
                </div>
            </div>
        )
    },
    { 
        icon: FileText, 
        title: "6. Lead Magnet", 
        subtitle: "Contenido gratuito (PDF o Clase)", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Estructura del contenido</li>
                        <li>Mensaje de entrega</li>
                        <li>Secuencia de introducción</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Demostrar valor real antes de vender.</p>
                </div>
            </div>
        )
    },
    { 
        icon: MonitorPlay, 
        title: "7. Página de Venta", 
        subtitle: "Carta de ventas (VSL o texto)", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Se presenta la oferta completa al prospecto.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Argumentos de venta</li>
                        <li>Beneficios y Bonus</li>
                        <li>Llamados a la acción</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Convertir interés en compra final.</p>
                </div>
            </div>
        )
    },
    { 
        icon: RefreshCw, 
        title: "8. Nutrición de Prospectos", 
        subtitle: "Email, Blog y WhatsApp", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué crea el sistema:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-base">
                        <li>Correos automáticos</li>
                        <li>Artículos educativos</li>
                        <li>Mensajes de seguimiento</li>
                    </ul>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Vender incluso si no compró al inicio.</p>
                </div>
            </div>
        )
    },
    { 
        icon: ShoppingCart, 
        title: "9. Checkout", 
        subtitle: "Pasarela de Pago", 
        description: (
            <div className="space-y-4">
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Qué ocurre aquí:</p>
                    <p className="text-gray-300 text-base leading-relaxed">El cliente realiza el pago de forma segura.</p>
                </div>
                <div>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">Objetivo:</p>
                    <p className="text-gray-300 text-base leading-relaxed">Cerrar la venta sin fricciones técnicas.</p>
                </div>
            </div>
        )
    }
];

interface FlowCardProps {
    icon: any;
    title: string;
    subtitle: string;
    description: React.ReactNode;
    step: number;
    onOpenVideo: () => void;
}

const FlowCard: React.FC<FlowCardProps> = ({ icon: Icon, title, subtitle, description, step, onOpenVideo }) => {
    const isLastInRow = step % 3 === 0;
    const isLastItem = step === 9;
    const isEndOfRowDesktop = (step === 3 || step === 6);

    return (
        <div id={`psd-flow-card-${step}-container`} className="group relative flex flex-col h-full">
            <div 
                id={`psd-flow-card-${step}-content`}
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-8 rounded-[2.5rem] flex flex-col items-center text-center relative z-10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)] h-full"
            >
                {/* Step Number Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-black rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl z-20 group-hover:rotate-12 transition-transform">
                    {step}
                </div>

                <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors shadow-inner relative shrink-0">
                    <Icon className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                </div>

                <h4 className="text-white font-black text-2xl mb-1 tracking-tight">{title}</h4>
                <p className="text-[11px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-8 bg-emerald-500/10 px-5 py-2 rounded-full leading-tight border border-emerald-500/20 w-full">
                    {subtitle}
                </p>
                
                <div className="text-left w-full flex-1">
                    {description}
                </div>

                <button 
                    id={`psd-flow-card-${step}-video-btn`}
                    onClick={(e) => { e.stopPropagation(); onOpenVideo(); }}
                    className="mt-10 w-full flex items-center justify-center gap-2 text-xs font-black text-white transition-all z-20 relative px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg"
                >
                    <PlayCircle className="w-4 h-4 text-emerald-400" /> Explicación Táctica
                </button>
            </div>

            {!isLastItem && (
                <>
                    {!isLastInRow && (
                        <div id={`psd-flow-card-${step}-arrow-right`} className="hidden lg:flex absolute top-1/2 -right-12 w-12 items-center justify-center z-0 text-emerald-500/30 animate-pulse">
                            <ArrowRight className="w-10 h-10" />
                        </div>
                    )}
                    {isEndOfRowDesktop && (
                        <div id={`psd-flow-card-${step}-arrow-snake`} className="hidden lg:block absolute top-full right-1/2 w-[calc(200%+6rem)] h-32 pointer-events-none z-0">
                           <div className="absolute right-[-1px] top-0 h-16 w-0.5 bg-gradient-to-b from-emerald-500/30 to-emerald-500/10 animate-pulse"></div>
                           <div className="absolute right-0 top-16 left-0 h-0.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/30 to-emerald-500/10"></div>
                           <div className="absolute left-[-1px] top-16 h-16 w-0.5 bg-gradient-to-b from-emerald-500/10 to-emerald-500/30 animate-pulse"></div>
                            <div className="absolute left-[-0.65rem] bottom-[-0.6rem] text-emerald-500/40">
                                <ArrowDown className="w-6 h-6" />
                            </div>
                        </div>
                    )}
                    <div id={`psd-flow-card-${step}-arrow-down`} className="lg:hidden flex justify-center py-6 text-emerald-500/30 animate-pulse">
                        <ArrowDown className="w-10 h-10" />
                    </div>
                </>
            )}
        </div>
    );
};

interface ProjectStrategy_BlueprintProps {
    handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
    handleTooltipLeave: () => void;
    onOpenVideo: () => void;
}

export const ProjectStrategy_Blueprint: React.FC<ProjectStrategy_BlueprintProps> = ({ onOpenVideo }) => {
    return (
        <div id="psd-blueprint-container" className="space-y-12">
            <div id="psd-blueprint-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                    <Zap className="w-5 h-5 fill-current" /> ¿Cómo será mi estrategia?
                </div>
                <h3 id="psd-blueprint-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    ¿Cómo funcionará tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">estrategia de ventas?</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-emerald-500/30 pl-8 py-2">
                        No vendemos al azar ni dependemos de la suerte. Tu sistema está diseñado para acompañar al cliente paso a paso, desde que descubre el problema hasta que toma la decisión de compra con confianza.
                    </p>
                    <p className="border-l-4 border-teal-500/30 pl-8 py-2">
                        A continuación, puedes ver el recorrido completo que seguirá cada persona interesada en tu producto. Todas estas piezas son creadas automáticamente por el sistema.
                    </p>
                </div>
            </div>
            
            <div id="psd-blueprint-grid-wrapper" className="max-w-[95em] mx-auto rounded-[3.5rem] border border-gray-800 p-12 lg:p-20 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                {/* Enhanced Animated Grid Background */}
                <div className="absolute inset-0 bg-[#050505] z-0">
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent"></div>
                </div>

                <h4 className="relative z-10 text-center text-white font-black text-2xl uppercase tracking-[0.2em] mb-24 opacity-80">
                    El recorrido completo de tu cliente (de principio a fin)
                </h4>
                
                <div id="psd-blueprint-grid" className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-[12rem]">
                    {ACQUISITION_STEPS.map((step, index) => (
                        <FlowCard 
                            key={index} 
                            icon={step.icon} 
                            title={step.title.split('. ')[1] || step.title} 
                            subtitle={step.subtitle} 
                            description={step.description}
                            step={index + 1}
                            onOpenVideo={onOpenVideo}
                        />
                    ))}
                </div>

                {/* --- STRATEGIC CLOSURE SECTION --- */}
                <div id="psd-blueprint-closure" className="relative z-10 mt-32 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Sparkles className="w-32 h-32 text-emerald-400" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                                <Rocket className="w-8 h-8" />
                            </div>
                            <h4 className="text-3xl font-black text-white leading-tight">Tu Ecosistema de Ventas 24/7</h4>
                            <p className="text-gray-300 text-xl font-light leading-relaxed">
                                Este sistema no depende de una sola acción ni de un solo canal. 
                                Funciona como un <span className="text-emerald-400 font-bold">ecosistema completo</span> que trabaja por ti todos los días.
                            </p>
                            <p className="text-gray-400 text-lg font-light leading-relaxed border-t border-white/5 pt-8">
                                Tú no necesitas dominar marketing, copywriting o automatizaciones. 
                                El sistema se encarga de la estructura. <span className="text-white font-bold">Tú decides cuánto quieres crecer.</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Animated Scan Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-scan-line pointer-events-none"></div>
            </div>
        </div>
    );
};
