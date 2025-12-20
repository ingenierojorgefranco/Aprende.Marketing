import React from 'react';
import { Layers, ArrowRight, ArrowDown, PlayCircle, Clapperboard, Globe, CheckCircle2, Users, MessageCircle, FileText, MonitorPlay, ShoppingCart, Sparkles } from 'lucide-react';

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
        icon: ShoppingCart, 
        title: "8. Checkout", 
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
    const isLastItem = step === 8;
    const isEndOfRowDesktop = (step === 3 || step === 6);

    return (
        <div id={`psd-flow-card-${step}-container`} className="group relative flex flex-col h-full">
            <div 
                id={`psd-flow-card-${step}-content`}
                className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center relative z-10 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 h-full group-hover:z-50 cursor-help"
                onMouseMove={(e) => onHover(e, tooltipContent)}
                onMouseLeave={onLeave}
            >
                <div className="absolute -top-6 -right-6 w-14 h-14 bg-blue-600 border-4 border-gray-900 rounded-full flex items-center justify-center text-xl font-extrabold text-white shadow-xl z-20 group-hover:animate-bounce">
                    {step}
                </div>
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{subtitle}</p>
                <p className="text-gray-200 mt-2 border-t border-gray-800 pt-2 opacity-100 transition-opacity text-lg leading-relaxed">
                    {description}
                </p>
                <button 
                    id={`psd-flow-card-${step}-video-btn`}
                    onClick={(e) => { e.stopPropagation(); onOpenVideo(); }}
                    className="mt-6 mx-auto flex items-center justify-center gap-2 text-sm font-bold text-white transition-all z-20 relative px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-900/20 hover:scale-105"
                >
                    <PlayCircle className="w-4 h-4" /> Te lo explico en video
                </button>
            </div>

            {!isLastItem && (
                <>
                    {!isLastInRow && (
                        <div id={`psd-flow-card-${step}-arrow-right`} className="hidden lg:flex absolute top-1/2 -right-12 w-12 items-center justify-center z-0 text-gray-700">
                            <ArrowRight className="w-8 h-8" />
                        </div>
                    )}
                    {isEndOfRowDesktop && (
                        <div id={`psd-flow-card-${step}-arrow-snake`} className="hidden lg:block absolute top-full right-1/2 w-[calc(200%+6rem)] h-32 pointer-events-none z-0">
                           <div className="absolute right-[-1px] top-0 h-16 w-0.5 bg-gray-700"></div>
                           <div className="absolute right-0 top-16 left-0 h-0.5 bg-gray-700"></div>
                           <div className="absolute left-[-1px] top-16 h-16 w-0.5 bg-gray-700"></div>
                            <div className="absolute left-[-0.6rem] bottom-[-0.5rem] text-gray-700">
                                <ArrowDown className="w-6 h-6" />
                            </div>
                        </div>
                    )}
                    <div id={`psd-flow-card-${step}-arrow-down`} className="lg:hidden flex justify-center py-4 text-gray-700">
                        <ArrowDown className="w-8 h-8" />
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
        <div id="psd-blueprint-container" className="space-y-6">
            <div id="psd-blueprint-header-container" className="max-w-[70em] mx-auto text-left space-y-6 py-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-widest animate-pulse">
                    <Sparkles className="w-4 h-4" /> Arquitectura de Ventas
                </div>
                <h3 id="psd-blueprint-title" className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                    <Layers className="w-12 h-12 text-blue-500" /> La estrategia que hará que tu negocio digital sea un éxito
                </h3>
                <div className="space-y-6 text-gray-300 text-[1.3rem] leading-[1.8] font-light max-w-4xl">
                    <p>
                        En nuestro entrenamiento aprenderás exactamente cómo funciona esta secuencia lógica. Está diseñado matemáticamente para garantizar ventas. Nuestro sistema te ayudará a construir cada paso para que logres tu objetivo de libertad financiera en 12 meses.
                    </p>
                    <p>
                        El sistema creará por ti la mayor cantidad de elementos posibles para maximizar tu confianza y resultados.
                    </p>
                </div>
            </div>
            
            <div id="psd-blueprint-grid-wrapper" className="max-w-[70em] mx-auto rounded-3xl border border-gray-800 p-8 lg:p-12 relative">
                <div className="absolute inset-0 bg-[#0a0a0a] rounded-3xl overflow-hidden z-0">
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                </div>
                
                <div id="psd-blueprint-grid" className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-[10rem]">
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
            </div>
        </div>
    );
};