import React, { useState } from 'react';
import { Globe, Check, Layout, CheckCircle2, Wand2, Lightbulb, Info, Sparkles, AlignLeft, Gift, AlertTriangle, ArrowRight, Play, PenTool, ExternalLink, X, Eye, Plus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingPage, PlanLimits, Plan } from '../../../../types';

// Tabs Data (Keep static data)
const LP_TABS_DATA = {
    hero: {
        label: "1. Encabezado",
        title: "Promesa de Valor (Hero Section)",
        type: 'hero',
        h1: "Domina el Arte del Microblading 3D y Triplica tus Ingresos en 30 Días",
        h2: "Descubre la técnica 'Pelo a Pelo' que está revolucionando la industria de la belleza. Sin experiencia previa y con baja inversión inicial.",
        strategyText: "Nuestra inteligencia artificial ha analizado tu nicho y ha definido este titular como la opción más potente. Está diseñado psicológicamente para detener el scroll, atacar el deseo principal de tu avatar y filtrar a los curiosos, atrayendo solo a compradores potenciales."
    },
    pain: {
        label: "2. Dolores",
        title: "Identificación del Problema",
        type: 'pain',
        items: [
            "Trabajas jornadas agotadoras de más de 10 horas, pero al final del mes tu cuenta bancaria no refleja el enorme esfuerzo que realizas.",
            "Sientes un nudo en el estómago por el miedo a cometer un error en el rostro de una clienta y arruinar tu reputación para siempre.",
            "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola y con manos temblorosas a la hora de practicar.",
            "Eres excelente en lo que haces, pero no sabes cómo atraer clientas nuevas y dependes solo del 'boca a boca' que no paga las facturas.",
            "Te frustra ver cómo otras con menos talento cobran el doble que tú, solo porque tienen más confianza en su diseño y técnica."
        ],
        strategyText: "Hemos identificado los dolores más agudos de tu cliente ideal. Al mencionarlos explícitamente, creamos una conexión empática inmediata ('me leyeron la mente'), lo cual es el primer paso para que confíen en tu solución."
    },
    benefits: {
        label: "3. Beneficios",
        title: "Oferta Irresistible (Lo que obtienes)",
        type: 'benefits',
        items: [
            { title: "Kit Digital Completo", desc: "Acceso a plantillas de práctica imprimibles y manuales en PDF de alta resolución." },
            { title: "Certificado Internacional", desc: "Diploma avalado para ejercer tu profesión en cualquier país de habla hispana." },
            { title: "Comunidad Privada", desc: "Acceso de por vida a nuestro grupo de soporte VIP en Telegram." },
            { title: "Marketing para Esteticistas", desc: "Módulo exclusivo para conseguir tus primeros 10 clientes en Instagram." }
        ],
        strategyText: "No vendemos características, vendemos transformación. Estos beneficios han sido redactados para mostrarle a tu cliente exactamente cómo mejorará su vida tras comprar, eliminando la fricción del precio."
    }
};

const TY_TABS_DATA = {
    header: {
        label: "1. Confirmación",
        title: "Mensaje de Éxito",
        type: 'header',
        content: {
            h1: "¡Felicidades! Ya eres parte del programa.",
            h2: "Tu registro ha sido exitoso. Estás a un paso de acceder a todo el material."
        },
        strategyText: "El momento post-compra es crítico. Este mensaje está diseñado para validar la decisión del cliente, reducir el remordimiento del comprador y mantener la dopamina alta."
    },
    action: {
        label: "2. Siguiente Paso",
        title: "Redirección a Comunidad",
        type: 'action',
        content: {
            h1: "Únete al Grupo VIP de WhatsApp",
            h2: "Es obligatorio unirte para recibir las notificaciones de las clases y soporte."
        },
        strategyText: "La confusión mata la conversión. Aquí damos una instrucción única y clara. Moverlos a un canal íntimo como WhatsApp aumenta tu tasa de cierre en un 300% comparado con el email."
    },
    magnet: {
        label: "3. Lead Magnet",
        title: "Regalo de Bienvenida",
        type: 'magnet',
        content: {
            h1: "Descarga tu Ebook Gratuito",
            h2: "Como regalo de bienvenida, hemos preparado una guía PDF exclusiva para ti. Encuéntrala en el grupo."
        },
        strategyText: "Cumplir la promesa de inmediato genera autoridad. Entregamos el Lead Magnet aquí mismo para activar el principio de reciprocidad: ellos sienten que ya ganaron, por lo que están más abiertos a tu oferta de pago."
    }
};

interface ProjectStrategy_WebSystemProps {
    selectedLpTab: string | null;
    setSelectedLpTab: (tab: string | null) => void;
    selectedTyTab: string | null;
    setSelectedTyTab: (tab: string | null) => void;
    handleTooltipHover: (e: React.MouseEvent, content: string[]) => void;
    handleTooltipLeave: () => void;
    linkedPages: LandingPage[];
    onEditPage: (id: string) => void;
    
    // Props para límites
    pageCount?: number;
    domainCount?: number;
    planLimits?: PlanLimits;
    onUpgrade?: () => void;
    nextPlan?: Plan | null; // Dynamic next plan
}

export const ProjectStrategy_WebSystem: React.FC<ProjectStrategy_WebSystemProps> = ({ 
    selectedLpTab, setSelectedLpTab, selectedTyTab, setSelectedTyTab, handleTooltipHover, handleTooltipLeave, linkedPages, onEditPage,
    pageCount = 0, domainCount = 0, planLimits, onUpgrade, nextPlan
}) => {
    const navigate = useNavigate();
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [modalMode, setModalMode] = useState<'lp' | 'ty'>('lp');

    // Lógica de Límites
    const maxPages = planLimits?.maxLandings || 3;
    const maxDomains = planLimits?.maxDomains || 1;
    const isLimitReached = pageCount >= maxPages;
    const currentPlanName = planLimits?.planName || 'Starter';
    const nextPlanName = nextPlan?.name || 'Superior';

    // Porcentajes de Uso
    const pageUsagePercent = Math.min(100, (pageCount / maxPages) * 100);
    const domainUsagePercent = Math.min(100, (domainCount / maxDomains) * 100);

    // Colores de Progreso
    const getProgressColor = (percent: number) => {
        if (percent > 85) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
        if (percent > 50) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
        return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    };

    const getDomainProgressColor = (percent: number) => {
        if (percent > 90) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
        if (percent > 50) return "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]";
        return "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
    };

    const pageProgressColor = getProgressColor(pageUsagePercent);
    const domainProgressColor = getDomainProgressColor(domainUsagePercent);

    const renderTabContent = (tabKey: string) => {
        const data = LP_TABS_DATA[tabKey as keyof typeof LP_TABS_DATA] as any;
        if (!data) return null;
        if (data.type === 'hero') {
            return (
                <div id="psd-lp-tab-content-hero" className="space-y-6 mt-6">
                    <div>
                        <span className="text-yellow-500 font-bold uppercase tracking-wider text-sm mb-4 block flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Título Principal
                        </span>
                        <p className="text-white font-serif text-lg leading-[1.5] font-medium">"{data.h1}"</p>
                    </div>
                    <div className="py-3">
                        <span className="text-yellow-500 font-bold uppercase tracking-wider text-sm mb-4 block flex items-center gap-2">
                            <AlignLeft className="w-5 h-5" /> Subtítulo de tu página web
                        </span>
                        <p className="text-gray-200 text-lg leading-[1.5]">"{data.h2}"</p>
                    </div>
                </div>
            );
        }
        if (data.type === 'pain') {
            return (
                <div id="psd-lp-tab-content-pain" className="space-y-4 mt-6">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Esto es para ti si...</p>
                    {data.items?.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-red-900/10 border border-red-500/20">
                            <span className="text-red-500 text-xl leading-none mt-0.5">⚠️</span>
                            <span className="text-gray-200 text-lg font-medium leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
            );
        }
        if (data.type === 'benefits') {
            return (
                <div id="psd-lp-tab-content-benefits" className="space-y-4 mt-6">
                    {data.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 items-start group p-2 hover:bg-white/5 rounded-lg transition">
                            <div className="mt-1 bg-green-500/10 p-2 rounded-full h-fit text-green-500 border border-green-500/30 group-hover:bg-green-500/20 transition">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="text-white font-bold text-lg mb-1 group-hover:text-green-400 transition">{item.title}</h5>
                                <p className="text-gray-300 text-lg leading-snug">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderTyTabContent = (tabKey: string) => {
        const data = TY_TABS_DATA[tabKey as keyof typeof TY_TABS_DATA];
        if (!data) return null;
        return (
            <div id={`psd-ty-tab-content-${tabKey}`} className="space-y-6 mt-6">
                <div>
                    <span className="text-yellow-500 font-bold uppercase tracking-wider text-sm mb-4 block flex items-center gap-2">
                        {data.type === 'header' ? <Sparkles className="w-4 h-4"/> : data.type === 'action' ? <ArrowRight className="w-4 h-4"/> : <Gift className="w-4 h-4"/>} 
                        {data.title}
                    </span>
                    <p className="text-white font-serif text-lg leading-[1.5] font-medium">"{data.content.h1}"</p>
                </div>
                <div className="py-3">
                    <p className="text-gray-200 text-lg leading-[1.5]">{data.content.h2}</p>
                </div>
            </div>
        );
    };

    const linkedPageCount = linkedPages.length;

    return (
        <div id="psd-system-container" className="space-y-12">
            <div id="psd-system-divider" className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-800"></div>
                </div>
            </div>

            <div id="psd-system-header-section" className="w-full mx-auto py-12 border-b border-gray-800 bg-[#0a0a0a]">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 id="psd-system-title" className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        ¿Qué creará nuestro sistema por ti?
                    </h2>
                    <p id="psd-system-desc" className="text-[1.3rem] leading-[1.8] text-gray-300 font-light max-w-4xl mx-auto">
                        Nuestro sistema redactará, diseñará y conectará cada pieza (Web, Email, Contenido) utilizando la psicología de tu público objetivo para ahorrarte semanas de trabajo manual.
                    </p>
                </div>
            </div>

            <div id="psd-web-section">
                <div id="psd-web-header-container" className="w-[80%] mx-auto py-6">
                    <h3 id="psd-web-title" className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="w-8 h-8 text-blue-500" /> Páginas web que nuestra inteligencia artificial creará por ti
                    </h3>
                    <p id="psd-web-desc" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mb-8">
                        Haremos todo el trabajo difícil por ti. Te ahorraremos cientos de horas de diseño y redacción creando páginas web 100% optimizadas para captar audiencia cualificada y generar ventas en automático.
                    </p>
                    
                    {/* DYNAMIC LIMITS BANNER */}
                    {!isLimitReached ? (
                        <div id="psd-web-included-banner" className="bg-green-900/20 border border-green-500/30 p-8 rounded-2xl flex flex-col gap-6 mb-12 shadow-lg shadow-green-900/10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500 text-white rounded-lg shadow-lg shadow-green-500/20 flex-shrink-0">
                                    <Check className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-green-300 font-bold text-xl mb-1">
                                        Funcionalidad Incluida
                                    </p>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        Tu plan actual "<span className="text-white font-bold">{currentPlanName.toUpperCase()}</span>" te permite crear hasta {maxPages} páginas y {maxDomains} dominio personalizado.
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bars */}
                            <div className="grid md:grid-cols-2 gap-8 bg-black/30 p-6 rounded-xl border border-white/5 shadow-inner">
                                <div>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest">Páginas Creadas</span>
                                        <span className="text-white font-bold">{pageCount} / {maxPages}</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full transition-all duration-1000 ease-out ${pageProgressColor}`} style={{ width: `${pageUsagePercent}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest">Dominios Usados</span>
                                        <span className="text-white font-bold">{domainCount} / {maxDomains}</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full transition-all duration-1000 ease-out ${domainProgressColor}`} style={{ width: `${domainUsagePercent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div id="psd-web-limit-banner" className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-2xl flex flex-col gap-8 mb-12 shadow-lg shadow-purple-900/10 backdrop-blur-md">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-500 text-white rounded-lg shadow-lg shadow-purple-500/20 flex-shrink-0">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-purple-300 font-bold text-xl mb-1">
                                            Límite Alcanzado
                                        </h4>
                                        <p className="text-gray-300 text-lg leading-relaxed">
                                            Actualmente tienes activo el plan <span className="text-white font-bold uppercase">{currentPlanName}</span>. Actualiza a <span className="text-white font-bold uppercase">{nextPlanName}</span> para seguir escalando.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onUpgrade}
                                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all whitespace-nowrap"
                                >
                                    Actualizar a {nextPlanName} 🚀
                                </button>
                            </div>

                            {/* Progress Bars for Limit View */}
                            <div className="grid md:grid-cols-2 gap-8 bg-black/40 p-6 rounded-xl border border-white/5 shadow-inner">
                                <div>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest">Páginas de Venta</span>
                                        <span className="text-white font-bold">{pageCount} / {maxPages}</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full transition-all duration-1000 ease-out bg-red-500`} style={{ width: `100%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest">Dominios Personalizados</span>
                                        <span className="text-white font-bold">{domainCount} / {maxDomains}</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full transition-all duration-1000 ease-out ${domainProgressColor}`} style={{ width: `${domainUsagePercent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Landing Page Block */}
                    <div id="psd-lp-block" className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/30 transition group shadow-lg">
                        <div className="grid md:grid-cols-2">
                            <div id="psd-lp-left-col" className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1 relative">
                                <div id="psd-lp-header" className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
                                        <Layout className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-3xl font-bold text-white">Landing Page de Captación</h4>
                                </div>

                                <p id="psd-lp-desc-1" className="text-[1.3rem] leading-[1.8] text-gray-300 font-light mb-8">
                                    Una Landing Page profesional es vital porque actúa como el filtro y motor de conversión de tu negocio, transformando visitantes desconocidos en clientes reales.
                                </p>
                                <p id="psd-lp-desc-2" className="text-[1.3rem] leading-[1.8] text-gray-300 font-light mb-8">
                                    Con el objetivo de personalizar tu estrategia, usaremos los siguientes elementos para crear una página web profesional que atraiga el público perfecto para maximizar sus ventas.
                                </p>
                                
                                <div id="psd-lp-tabs-container" className="grid grid-cols-3 gap-3 mb-8 w-full">
                                    {(Object.keys(LP_TABS_DATA) as Array<keyof typeof LP_TABS_DATA>).map(tabKey => (
                                        <button 
                                            key={tabKey}
                                            id={`psd-lp-tab-${tabKey}`}
                                            onClick={() => setSelectedLpTab(tabKey)}
                                            onMouseMove={(e) => handleTooltipHover(e, ["Haz clic aquí para revelar la lógica persuasiva detrás de este elemento."])}
                                            onMouseLeave={handleTooltipLeave}
                                            className={`w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border flex items-center justify-center text-center ${selectedLpTab === tabKey ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105 z-10 ring-2 ring-blue-400/50' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700'}`}
                                        >
                                            {LP_TABS_DATA[tabKey].label}
                                        </button>
                                    ))}
                                </div>

                                <div id="psd-lp-logic-box" className="bg-black/80 border border-gray-700 px-6 py-5 rounded-2xl flex gap-4 backdrop-blur-xl shadow-2xl w-full relative overflow-hidden group/box hover:border-yellow-500/30 transition-all mb-8 mx-auto">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                    <div className="p-3 bg-yellow-500/10 rounded-xl h-fit text-yellow-500 border border-yellow-500/20 shrink-0">
                                        <div className="w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></div>
                                    </div>
                                    <div>
                                        <p className="text-yellow-100 font-bold text-base uppercase mb-2 tracking-wide flex items-center gap-2">
                                            💰 Lógica de Conversión
                                        </p>
                                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                                            Hemos analizado miles de páginas exitosas. Nuestra IA creará la estructura lógica perfecta para convertir visitantes fríos en registros, preparándolos para recibir tu contenido de valor.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div id="psd-lp-right-col" className="bg-gray-800/30 relative h-full order-1 md:order-2 border-l border-gray-800 flex flex-col justify-center p-8 gap-6">
                                <div className="w-full relative flex flex-col">
                                    {selectedLpTab ? (
                                        <div id="psd-lp-dynamic-content" className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col justify-center gap-4">
                                            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-10"><Lightbulb className="w-12 h-12 text-blue-400" /></div>
                                                <p className="text-blue-300 text-lg font-medium flex gap-3 relative z-10 leading-relaxed">
                                                    <div className="bg-blue-500/20 p-1.5 rounded-lg h-fit"><Info className="w-5 h-5 text-blue-400"/></div>
                                                    {LP_TABS_DATA[selectedLpTab as keyof typeof LP_TABS_DATA].strategyText}
                                                </p>
                                            </div>
                                            
                                            <div className="w-full bg-gray-800/80 p-6 rounded-2xl border border-gray-700/50 relative overflow-hidden shadow-2xl backdrop-blur-xl flex-1">
                                                 <div className="absolute top-0 right-0 p-4 opacity-5">
                                                    <Sparkles className="w-24 h-24 text-white" />
                                                 </div>
                                                 <div className="relative z-10">
                                                     {renderTabContent(selectedLpTab)}
                                                 </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div id="psd-lp-mockup" className="animate-in fade-in duration-500 flex flex-col items-center justify-center gap-8">
                                            <div className="w-full max-w-sm bg-[#0f1115] rounded-xl border border-gray-700 shadow-2xl overflow-hidden relative opacity-80 hover:opacity-100 transition duration-500">
                                                <div className="h-8 bg-[#1a1b1e] border-b border-gray-700 flex items-center px-4 gap-2">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                                    </div>
                                                    <div className="flex-1 bg-black/30 rounded h-5 ml-4"></div>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex gap-2">
                                                            <div className="h-3 w-8 bg-gray-600 rounded"></div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="h-3 w-12 bg-gray-700 rounded"></div>
                                                            <div className="h-3 w-12 bg-gray-700 rounded"></div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-4">
                                                        <div className="flex-1 space-y-3">
                                                            <div className="h-4 w-full bg-gray-500 rounded"></div>
                                                            <div className="h-4 w-3/4 bg-gray-500 rounded"></div>
                                                            <div className="h-2 w-full bg-gray-700 rounded mt-2"></div>
                                                            <div className="h-2 w-5/6 bg-gray-700 rounded"></div>
                                                            <div className="h-8 w-32 bg-blue-600 rounded mt-4 shadow-lg shadow-blue-500/20"></div>
                                                        </div>
                                                        <div className="w-1/3 h-32 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-600 opacity-50"></div>
                                                            <Play className="w-8 h-8 text-white fill-current opacity-80 relative z-10" />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-800">
                                                        {[1,2,3].map(i => (
                                                            <div key={i} className="bg-gray-800/50 p-2 rounded border border-gray-700/50">
                                                                <div className="w-6 h-6 bg-gray-700 rounded mb-2"></div>
                                                                <div className="h-2 w-16 bg-gray-600 rounded mb-1"></div>
                                                                <div className="h-1.5 w-full bg-gray-700 rounded"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div id="psd-lp-btn-container" className="w-full mt-2">
                                    {linkedPageCount === 0 ? (
                                        <button 
                                            onClick={() => isLimitReached && onUpgrade ? onUpgrade() : navigate('/dashboard/generator')}
                                            className={`w-full max-w-sm mx-auto text-black shadow-xl transition-all flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg ${isLimitReached ? 'bg-gray-600 cursor-not-allowed text-gray-300' : 'bg-gradient-to-r from-yellow-500 to-amber-600 shadow-amber-500/20 hover:from-yellow-400 hover:to-amber-500 hover:scale-[1.02] hover:shadow-amber-500/40'}`}
                                        >
                                            {isLimitReached ? <Lock className="w-6 h-6" /> : <Wand2 className="w-6 h-6" />}
                                            {isLimitReached ? 'Límite Alcanzado (Actualizar)' : 'Crea tu Web Automáticamente'}
                                        </button>
                                    ) : linkedPageCount === 1 ? (
                                        <div className="flex flex-col gap-3">
                                            <button 
                                                onClick={() => navigate(`/dashboard/editor/${linkedPages[0].id}`)}
                                                className="w-full max-w-sm mx-auto bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-xl shadow-amber-500/20 hover:from-yellow-400 hover:to-amber-500 hover:scale-[1.02] hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg"
                                            >
                                                <PenTool className="w-6 h-6" /> Editar Landing Page
                                            </button>
                                            <button 
                                                onClick={() => isLimitReached && onUpgrade ? onUpgrade() : navigate('/dashboard/generator')}
                                                className="w-full max-w-sm mx-auto bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-all flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
                                            >
                                                <Plus className="w-4 h-4" /> {isLimitReached ? 'Límite Alcanzado' : 'Crear Otra Landing Page'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => { setModalMode('lp'); setShowPagesModal(true); }}
                                            className="w-full max-w-sm mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg"
                                        >
                                            <Layout className="w-6 h-6" /> Gestionar Landing Pages ({linkedPageCount})
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thank You Page Block */}
                    <div id="psd-ty-block" className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-green-500/30 transition group shadow-lg">
                        <div className="grid md:grid-cols-2">
                            <div id="psd-ty-left-col" className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-1 relative">
                                <div id="psd-ty-header" className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-green-900/20 rounded-xl flex items-center justify-center text-green-400 border border-green-500/20 shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-3xl font-bold text-white">Página de Gracias</h4>
                                </div>
                                <p id="psd-ty-desc-1" className="text-[1.3rem] leading-[1.8] text-gray-300 font-light mb-4">
                                    La Página de Gracias suele ser subestimada, pero es el primer punto de contacto real tras la conversión. Es el momento psicológico donde el cliente valida si tomó una buena decisión.
                                </p>
                                <p id="psd-ty-desc-2" className="text-[1.3rem] leading-[1.8] text-gray-300 font-light mb-8">
                                    Esta página es crucial. Una vez se registran, debemos mantener la emoción alta. Aquí confirmamos el éxito, entregamos lo prometido inmediatamente y les damos la instrucción clara de unirse a la comunidad para no enfriar la venta.
                                </p>
                                
                                <div id="psd-ty-tabs-container" className="grid grid-cols-3 gap-3 mb-8 w-full">
                                    {(Object.keys(TY_TABS_DATA) as Array<keyof typeof TY_TABS_DATA>).map(tabKey => (
                                        <button 
                                            key={tabKey}
                                            id={`psd-ty-tab-${tabKey}`}
                                            onClick={() => setSelectedTyTab(tabKey)}
                                            onMouseMove={(e) => handleTooltipHover(e, ["Haz clic aquí para revelar la lógica persuasiva detrás de este elemento."])}
                                            onMouseLeave={handleTooltipLeave}
                                            className={`w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border flex items-center justify-center text-center ${selectedTyTab === tabKey ? 'bg-green-600 text-white border-green-500 shadow-lg scale-105 z-10 ring-2 ring-green-400/50' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700'}`}
                                        >
                                            {TY_TABS_DATA[tabKey].label}
                                        </button>
                                    ))}
                                </div>

                                <div id="psd-ty-logic-box" className="bg-black/80 border border-gray-700 px-6 py-5 rounded-2xl flex gap-4 backdrop-blur-xl shadow-2xl w-full relative overflow-hidden group/box hover:border-yellow-500/30 transition-all mb-8 mx-auto">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                    <div className="p-3 bg-yellow-500/10 rounded-xl h-fit text-yellow-500 border border-yellow-500/20 shrink-0">
                                        <div className="w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></div>
                                    </div>
                                    <div>
                                        <p className="text-yellow-100 font-bold text-base uppercase mb-2 tracking-wide flex items-center gap-2">
                                            💰 Lógica de Conversión
                                        </p>
                                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                                            Retención y Compromiso. Aprovechamos la dopamina del registro para moverlos a un canal más íntimo (WhatsApp) donde la conversión es 10x más alta.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div id="psd-ty-right-col" className="bg-gray-800/30 relative h-full order-2 md:order-2 border-l border-gray-800 flex flex-col justify-center p-8 gap-6">
                                <div className="w-full relative flex flex-col">
                                    {selectedTyTab ? (
                                        <div id="psd-ty-dynamic-content" className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col justify-center gap-4">
                                            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-10"><Lightbulb className="w-12 h-12 text-green-400" /></div>
                                                <p className="text-green-300 text-lg font-medium flex gap-3 relative z-10 leading-relaxed">
                                                    <div className="bg-green-500/20 p-1.5 rounded-lg h-fit"><Info className="w-5 h-5 text-green-400"/></div>
                                                    {TY_TABS_DATA[selectedTyTab as keyof typeof TY_TABS_DATA].strategyText}
                                                </p>
                                            </div>
                                            
                                            <div className="w-full bg-gray-800/80 p-6 rounded-2xl border border-gray-700/50 relative overflow-hidden shadow-2xl backdrop-blur-xl flex-1">
                                                 <div className="absolute top-0 right-0 p-4 opacity-5">
                                                    <Gift className="w-24 h-24 text-white" />
                                                 </div>
                                                 <div className="relative z-10">
                                                     {renderTyTabContent(selectedTyTab)}
                                                 </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div id="psd-ty-mockup" className="animate-in fade-in duration-500 flex flex-col items-center justify-center gap-8">
                                            <div className="w-full max-w-sm bg-[#0f1115] rounded-xl border border-gray-700 shadow-2xl overflow-hidden relative opacity-80 hover:opacity-100 transition duration-500">
                                                <div className="h-6 bg-[#1a1b1e] border-b border-gray-700 flex items-center px-3 gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                                                </div>
                                                
                                                <div className="p-8 flex flex-col items-center justify-center gap-6 relative h-full">
                                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-in zoom-in duration-500">
                                                        <Check className="w-10 h-10 text-green-400" />
                                                    </div>

                                                    <div className="w-full max-w-[200px] h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full w-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
                                                    </div>

                                                    <div className="space-y-3 w-full flex flex-col items-center">
                                                        <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                                                        <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                                                    </div>

                                                    <div className="w-full h-12 bg-green-600 rounded-lg shadow-lg shadow-green-900/50 flex items-center justify-center gap-2 mt-2 border-t border-white/10">
                                                        <div className="h-2 w-24 bg-white/20 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div id="psd-ty-btn-container" className="w-full mt-2 text-center">
                                    {linkedPageCount === 0 ? (
                                        <>
                                            <div className="mb-4 flex justify-center items-center gap-2 text-yellow-500 text-base font-bold animate-pulse">
                                                <AlertTriangle className="w-5 h-5" /> 
                                                <span>Para crear tu página de gracias primero debes crear tu Landing Page de Captación</span>
                                            </div>
                                            <button 
                                                className="w-full max-w-sm mx-auto bg-gray-800 text-gray-500 border border-gray-700 shadow-none cursor-not-allowed grayscale opacity-50 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg"
                                                disabled={true}
                                            >
                                                <Wand2 className="w-6 h-6" /> Crear Página Automáticamente
                                            </button>
                                        </>
                                    ) : linkedPageCount === 1 ? (
                                        <button 
                                            onClick={() => navigate(`/dashboard/editor/${linkedPages[0].id}?tab=thankyou`)}
                                            className="w-full max-w-sm mx-auto bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-xl shadow-amber-500/20 hover:from-yellow-400 hover:to-amber-500 hover:scale-[1.02] hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg"
                                        >
                                            <PenTool className="w-6 h-6" /> Editar Página de Gracias
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => { setModalMode('ty'); setShowPagesModal(true); }}
                                            className="w-full max-w-sm mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg"
                                        >
                                            <Layout className="w-6 h-6" /> Seleccionar Página
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MULTIPLE PAGES MODAL --- */}
            {showPagesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <Layout className="w-5 h-5 text-blue-500" /> 
                                {modalMode === 'ty' ? 'Páginas de Gracias' : 'Landing Pages del Proyecto'}
                            </h3>
                            <button onClick={() => setShowPagesModal(false)} className="text-gray-400 hover:text-white transition"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                            {linkedPages.map(page => (
                                <div key={page.id} className="bg-black/40 border border-gray-700 rounded-xl p-4 flex items-center justify-between hover:border-blue-500/30 transition">
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-1">{page.name}</h4>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${page.isPublished ? 'bg-green-900/30 text-green-400 border-green-900/50' : 'bg-orange-900/30 text-orange-400 border-orange-900/50'}`}>
                                            {page.isPublished ? 'Publicada' : 'Borrador'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <a 
                                            href={`/admin/lp/${page.subdomain?.split('.')[0] || page.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition border border-gray-700"
                                            title="Ver Online"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button 
                                            onClick={() => {
                                                onEditPage(page.id);
                                                setShowPagesModal(false);
                                            }}
                                            className="p-2.5 bg-blue-900/30 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition border border-blue-900/50"
                                            title={modalMode === 'ty' ? "Editar Gracias" : "Editar Landing"}
                                        >
                                            <PenTool className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-800/50 border-t border-gray-800 flex justify-end">
                            <button onClick={() => setShowPagesModal(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};