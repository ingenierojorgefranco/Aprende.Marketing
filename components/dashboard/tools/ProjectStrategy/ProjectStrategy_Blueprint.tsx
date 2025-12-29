import React from 'react';
import { Layers, ArrowRight, ArrowDown, PlayCircle, Clapperboard, Globe, CheckCircle2, Users, MessageCircle, FileText, MonitorPlay, ShoppingCart, Sparkles, Zap, RefreshCw } from 'lucide-react';

const ACQUISITION_STEPS = [
    { 
        icon: Clapperboard, 
        title: "1. Atracción de Audiencia", 
        subtitle: "Reels, Ads (FB/IG/Google)", 
        description: "Captamos la atención con contenido visual impactante o anuncios directos.",
        tooltipContent: [
            "Aquí es donde empieza la magia. No buscamos perseguir clientes, sino atraerlos. Utilizamos contenido magnético como Reels, TikToks o posts en grupos de Facebook para captar la atención de desconocidos.",
            "Nota: En nuestro Plan Max, encontrarás estrategias avanzadas para generar este tráfico de forma masiva y automatizada."
        ]
    },
    { 
        icon: Globe, 
        title: "2. Landing Page", 
        subtitle: "Página de Captura", 
        description: "El tráfico llega aquí para registrarse a la clase gratuita.",
        tooltipContent: [
            "Imagina esto como tu recepción digital privada. Es una página diseñada específicamente para convertir curiosos en interesados reales.",
            "Aquí explicamos tu oferta de forma seductora y la única salida es que nos dejen sus datos para continuar, filtrando a los que realmente tienen interés."
        ]
    },
    { 
        icon: CheckCircle2, 
        title: "3. Thank You Page", 
        subtitle: "Instrucciones", 
        description: "Confirmamos el registro y damos el siguiente paso inmediato.",
        tooltipContent: [
            "Es el apretón de manos digital. Una vez se registran, esta página les confirma que todo salió bien y les da seguridad inmediata.",
            "Su función principal es guiar al usuario al siguiente paso (ir al correo o al WhatsApp), para que no se sienta perdido en ningún momento."
        ]
    },
    { 
        icon: Users, 
        title: "4. Comunidad", 
        subtitle: "Grupo WhatsApp", 
        description: "Llevamos al lead a un entorno controlado y cercano.",
        tooltipContent: [
            "Sacamos a las personas del ruido de las redes sociales y las llevamos a un lugar íntimo y controlado: tu grupo de WhatsApp.",
            "Aquí es donde construimos confianza real, calentamos a la audiencia y generamos autoridad antes de presentar la oferta de venta."
        ]
    },
    { 
        icon: MessageCircle, 
        title: "5. Mensaje Directo", 
        subtitle: "Chat 1 a 1", 
        description: "Interacción personal para resolver dudas específicas.",
        tooltipContent: [
            "El toque personal que cierra ventas. Cuando alguien tiene dudas, un mensaje directo y humano marca la diferencia.",
            "Utilizamos guiones probados para responder objeciones comunes sin que tengas que improvisar, convirtiendo dudas en transacciones."
        ]
    },
    { 
        icon: FileText, 
        title: "6. Lead Magnet", 
        subtitle: "Clase Gratuita", 
        description: "Entrega de valor masivo para generar autoridad y deseo.",
        tooltipContent: [
            "Antes de pedir dinero, damos valor. Esta clase gratuita o recurso demuestra que sabes de lo que hablas.",
            "Al ver la calidad de tu enseñanza gratuita, el cliente asume que tu producto de pago será increíble. Activamos el principio de reciprocidad."
        ]
    },
    { 
        icon: MonitorPlay, 
        title: "7. Carta de Ventas", 
        subtitle: "VSL (Video Sales Letter)", 
        description: "Página de venta con todos los argumentos persuasivos.",
        tooltipContent: [
            "Tu mejor vendedor, trabajando 24/7. Esta página contiene un video y textos persuasivos (Copywriting) diseñados para vender sin que estés presente.",
            "Estructuramos la oferta irresistible, los bonus y la garantía para que decir 'NO' sea casi imposible para el cliente ideal."
        ]
    },
    { 
        icon: RefreshCw, 
        title: "8. Nutrición de Prospectos", 
        subtitle: "Email, Blog & WhatsApp", 
        description: "Mantenemos el interés activo aportando valor constante hasta que el lead esté listo para comprar.",
        tooltipContent: [
            "La mayoría de las ventas no ocurren al primer contacto. Este bloque es el 'motor de seguimiento' que educa y calienta al prospecto.",
            "Nuestra IA genera artículos de blog, secuencias de email y mensajes de WhatsApp coordinados para que tu marca esté siempre presente de forma útil."
        ]
    },
    { 
        icon: ShoppingCart, 
        title: "9. Checkout", 
        subtitle: "Pasarela de Pago", 
        description: "El cliente realiza la transacción segura.",
        tooltipContent: [
            "El paso final. Una página de pago limpia, segura y optimizada para evitar abandonos de carrito.",
            "Aquí es donde se materializa todo el esfuerzo anterior y donde el dinero entra en tu cuenta bancaria."
        ]
    }
];

interface FlowCardProps {
    icon: any;
    title: string;
    subtitle: string;
    description: string;
    step: number;
    tooltipContent: string[];
    onHover: (e: React.MouseEvent, content: string[]) => void;
    onLeave: () => void;
    onOpenVideo: () => void;
}

const FlowCard: React.FC<FlowCardProps> = ({ icon: Icon, title, subtitle, description, step, tooltipContent, onHover, onLeave, onOpenVideo }) => {
    const isLastInRow = step % 3 === 0;
    const isLastItem = step === 9;
    const isEndOfRowDesktop = (step === 3 || step === 6);

    return (
        <div id={`psd-flow-card-${step}-container`} className="group relative flex flex-col h-full">
            <div 
                id={`psd-flow-card-${step}-content`}
                className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 p-7 rounded-[2rem] flex flex-col items-center text-center relative z-10 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)] h-full group-hover:z-50 cursor-help"
                onMouseMove={(e) => onHover(e, tooltipContent)}
                onMouseLeave={onLeave}
            >
                {/* Step Number Badge */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-black rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl z-20 group-hover:rotate-12 transition-transform">
                    {step}
                </div>

                {/* Animated Background Pulse */}
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity duration-700 animate-pulse"></div>

                <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors shadow-inner relative">
                    <Icon className="w-10 h-10 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                    {/* Visual data pulse */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-ping opacity-0 group-hover:opacity-100"></div>
                </div>

                <h4 className="text-white font-black text-xl mb-1 tracking-tight">{title}</h4>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-4 bg-emerald-500/10 px-3 py-1 rounded-full">{subtitle}</p>
                
                <p className="text-gray-300 text-[1.4rem] leading-[1.8] font-light flex-1">
                    {description}
                </p>

                <button 
                    id={`psd-flow-card-${step}-video-btn`}
                    onClick={(e) => { e.stopPropagation(); onOpenVideo(); }}
                    className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-black text-white transition-all z-20 relative px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg hover:scale-[1.02]"
                >
                    <PlayCircle className="w-5 h-5 text-emerald-400" /> Explicación Táctica
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

export const ProjectStrategy_Blueprint: React.FC<ProjectStrategy_BlueprintProps> = ({ handleTooltipHover, handleTooltipLeave, onOpenVideo }) => {
    return (
        <div id="psd-blueprint-container" className="space-y-12">
            <div id="psd-blueprint-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                    <Zap className="w-5 h-5 fill-current" /> ¿Cómo será mi estrategia?
                </div>
                <h3 id="psd-blueprint-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Tu sistema de ventas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Clase Mundial</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-10 text-gray-300 text-[1.4rem] leading-[1.8] font-light">
                    <p className="border-l-4 border-emerald-500/30 pl-8 py-2">
                        No disparamos a ciegas. Hemos diseñado un recorrido psicológico que lleva a tu cliente de la total ignorancia a la compra impulsiva de tu producto digital.
                    </p>
                    <p className="border-l-4 border-teal-500/30 pl-8 py-2">
                        Este mapa es tu activo más valioso. Cada nodo representa una pieza que nuestra IA construirá para que tú solo te preocupes de escalar tu facturación.
                    </p>
                </div>
            </div>
            
            <div id="psd-blueprint-grid-wrapper" className="max-w-[95em] mx-auto rounded-[3.5rem] border border-gray-800 p-12 lg:p-20 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                {/* Enhanced Animated Grid Background */}
                <div className="absolute inset-0 bg-[#050505] z-0">
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent"></div>
                </div>
                
                <div id="psd-blueprint-grid" className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-[12rem]">
                    {ACQUISITION_STEPS.map((step, index) => (
                        <FlowCard 
                            key={index} 
                            icon={step.icon} 
                            title={step.title.split('. ')[1] || step.title} 
                            subtitle={step.subtitle} 
                            description={step.description}
                            step={index + 1}
                            tooltipContent={step.tooltipContent}
                            onHover={handleTooltipHover}
                            onLeave={handleTooltipLeave}
                            onOpenVideo={onOpenVideo}
                        />
                    ))}
                </div>
                
                {/* Animated Scan Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent animate-scan-line pointer-events-none"></div>
            </div>
        </div>
    );
};