import React, { useState } from 'react';
/* Added MessageCircle and BookOpen to the imports */
import { Globe, Check, Layout, CheckCircle2, Wand2, Lightbulb, Info, Sparkles, AlignLeft, Gift, AlertTriangle, ArrowRight, Play, PenTool, ExternalLink, X, Eye, Plus, Lock, Smartphone, Monitor, MessageCircle, BookOpen } from 'lucide-react';
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
            "Has gastado dinero en cursos que solo te dieron teoría aburrida, pero te dejaron sola y con manos temblorosas a la hora de practicar."
        ],
        strategyText: "Hemos identificado los dolores más agudos de tu cliente ideal. Al mencionarlos explícitamente, creamos una conexión empática inmediata ('me leyeron la mente'), lo cual es el primer paso para que confíen en tu solución."
    },
    benefits: {
        label: "3. Beneficios",
        title: "Oferta Irresistible (Lo que obtienes)",
        type: 'benefits',
        items: [
            { title: "Kit Digital Completo", desc: "Plantillas de práctica imprimibles y manuales en PDF." },
            { title: "Certificado Internacional", desc: "Diploma avalado para ejercer tu profesión en cualquier país." },
            { title: "Estrategia Instagram", desc: "Cómo atraer tus primeras clientes sin invertir en publicidad." }
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
            h1: "¡Bienvenida al inicio de tu independencia financiera!",
            h2: "Has tomado la mejor decisión para tu carrera. Tu registro ha sido procesado exitosamente."
        },
        strategyText: "El momento post-compra es crítico. Este mensaje está diseñado para validar la decisión del cliente, reducir el remordimiento del comprador y mantener la dopamina alta."
    },
    action: {
        label: "2. Siguiente Paso",
        title: "Redirección a Comunidad",
        type: 'action',
        content: {
            h1: "Únete al Grupo VIP de WhatsApp",
            h2: "Es obligatorio unirte para recibir las notificaciones de las clases y soporte técnico."
        },
        strategyText: "La confusión mata la conversión. Aquí damos una instrucción única y clara. Moverlos a un canal íntimo como WhatsApp aumenta tu tasa de cierre en un 300% comparado con el email."
    },
    magnet: {
        label: "3. Regalo",
        title: "Lead Magnet",
        type: 'magnet',
        content: {
            h1: "Descarga tu Plan de Negocios 2025",
            h2: "Como regalo de bienvenida, hemos preparado una guía PDF exclusiva para ti. Encuéntrala en el grupo."
        },
        strategyText: "Cumplir la promesa de inmediato genera autoridad. Entregamos el Lead Magnet aquí mismo para activar el principio de reciprocidad."
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
    pageCount?: number;
    domainCount?: number;
    planLimits?: PlanLimits;
    onUpgrade?: () => void;
    nextPlan?: Plan | null;
}

export const ProjectStrategy_WebSystem: React.FC<ProjectStrategy_WebSystemProps> = ({ 
    selectedLpTab, setSelectedLpTab, selectedTyTab, setSelectedTyTab, handleTooltipHover, handleTooltipLeave, linkedPages, onEditPage,
    pageCount = 0, domainCount = 0, planLimits, onUpgrade, nextPlan
}) => {
    const navigate = useNavigate();
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [modalMode, setModalMode] = useState<'lp' | 'ty'>('lp');

    // Default to first tabs if null
    React.useEffect(() => {
        if (!selectedLpTab) setSelectedLpTab('hero');
        if (!selectedTyTab) setSelectedTyTab('header');
    }, []);

    const maxPages = planLimits?.maxLandings || 3;
    const maxDomains = planLimits?.maxDomains || 1;
    const isLimitReached = pageCount >= maxPages;
    const currentPlanName = planLimits?.planName || 'Starter';

    const renderLpPreview = (tabKey: string) => {
        const data = LP_TABS_DATA[tabKey as keyof typeof LP_TABS_DATA] as any;
        if (!data) return null;

        return (
            <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-gray-200">
                <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="p-8 text-left">
                    {data.type === 'hero' && (
                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-primary/10 rounded-full animate-pulse"></div>
                            <h4 className="text-gray-900 font-black text-2xl leading-tight">{data.h1}</h4>
                            <p className="text-gray-600 text-base leading-relaxed">{data.h2}</p>
                            <div className="h-12 w-48 bg-primary rounded-lg shadow-lg"></div>
                        </div>
                    )}
                    {data.type === 'pain' && (
                        <div className="space-y-4">
                            <h4 className="text-gray-900 font-black text-xl mb-4">¿Te sientes identificada?</h4>
                            {data.items?.map((item: string, i: number) => (
                                <div key={i} className="flex gap-3 items-start p-3 bg-red-50 rounded-lg border border-red-100">
                                    <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-gray-800 text-sm leading-tight font-medium">{item}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {data.type === 'benefits' && (
                        <div className="grid grid-cols-1 gap-4">
                            <h4 className="text-gray-900 font-black text-xl mb-2">Tu transformación incluye:</h4>
                            {data.items?.map((item: any, i: number) => (
                                <div key={i} className="flex gap-3 items-center p-3 bg-green-50 rounded-xl border border-green-100">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                    <div>
                                        <p className="text-gray-900 font-bold text-sm">{item.title}</p>
                                        <p className="text-gray-600 text-[11px]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderTyPreview = (tabKey: string) => {
        const data = TY_TABS_DATA[tabKey as keyof typeof TY_TABS_DATA];
        if (!data) return null;

        return (
            <div className="w-full bg-[#0f1115] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-gray-800">
                <div className="h-5 bg-gray-900 border-b border-gray-800 flex items-center px-3 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                </div>
                <div className="p-10 text-center flex flex-col items-center">
                    {data.type === 'header' && (
                        <>
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                                <Check className="w-8 h-8 text-green-400" />
                            </div>
                            <h4 className="text-white font-black text-xl mb-3 leading-tight">{data.content.h1}</h4>
                            <p className="text-gray-400 text-sm">{data.content.h2}</p>
                        </>
                    )}
                    {data.type === 'action' && (
                        <>
                            <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
                                <div className="w-[80%] h-full bg-yellow-500"></div>
                            </div>
                            <h4 className="text-white font-black text-xl mb-4">{data.content.h1}</h4>
                            <div className="w-full py-4 bg-green-600 rounded-xl flex items-center justify-center gap-2 text-white font-bold shadow-lg shadow-green-900/50 mb-4">
                                <MessageCircle className="w-5 h-5" /> UNIRME AL GRUPO
                            </div>
                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{data.content.h2}</p>
                        </>
                    )}
                    {data.type === 'magnet' && (
                        <>
                            <div className="w-24 h-32 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-2xl mb-6 flex flex-col items-center justify-center p-3 text-white border-l-4 border-white/20 transform -rotate-3">
                                <BookOpen className="w-8 h-8 mb-2 opacity-50" />
                                <div className="h-1 w-10 bg-white/30 rounded mb-1"></div>
                                <div className="h-1 w-8 bg-white/30 rounded"></div>
                            </div>
                            <h4 className="text-white font-black text-lg mb-2">{data.content.h1}</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">{data.content.h2}</p>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div id="psd-web-section" className="space-y-16">
            <div id="psd-web-header-container" className="max-w-[70em] mx-auto text-left space-y-10 py-12">
                <div className="flex flex-col gap-6">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/5 self-start">
                        <Monitor className="w-5 h-5" /> Arquitectura de Conversión Web
                    </div>
                    <h3 id="psd-web-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                        Tu ecosistema de páginas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">creado automáticamente</span>
                    </h3>
                    <p id="psd-web-desc" className="text-gray-300 text-[1.4rem] leading-[1.8] font-light max-w-4xl border-l-4 border-blue-500/30 pl-8 italic">
                        "Olvídate del diseño y el copy. Nuestra IA utiliza principios de neuro-marketing para redactar cada palabra de tu web, asegurando que tu producto se sienta como la única solución lógica."
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 max-w-[90em] mx-auto">
                {/* 1. LANDING PAGE CARD */}
                <div className="bg-gray-900/50 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 md:p-12 flex flex-col h-full hover:border-blue-500/30 transition-all duration-500 shadow-2xl group">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Layout className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-white tracking-tight">Landing Page</h4>
                                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Fase de Captación</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-10">
                        {/* Selector de Tabs (Bloques) */}
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(LP_TABS_DATA) as Array<keyof typeof LP_TABS_DATA>).map(tabKey => (
                                <button 
                                    key={tabKey}
                                    onClick={() => setSelectedLpTab(tabKey)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${selectedLpTab === tabKey ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/40' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700'}`}
                                >
                                    {LP_TABS_DATA[tabKey].label}
                                </button>
                            ))}
                        </div>

                        {/* Visual Preview */}
                        <div className="relative group/preview">
                            <div className="absolute -inset-4 bg-blue-500/5 blur-3xl opacity-0 group-hover/preview:opacity-100 transition-opacity"></div>
                            {renderLpPreview(selectedLpTab || 'hero')}
                            
                            {/* Strategy Tooltip */}
                            <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/20 rounded-[1.5rem] relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><Lightbulb className="w-10 h-10 text-blue-400" /></div>
                                <div className="flex gap-4 items-start relative z-10">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0"><Info className="w-5 h-5" /></div>
                                    <p className="text-gray-300 text-base leading-relaxed font-medium italic">
                                        {LP_TABS_DATA[selectedLpTab as keyof typeof LP_TABS_DATA]?.strategyText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <button 
                            onClick={() => isLimitReached ? (onUpgrade && onUpgrade()) : navigate('/dashboard/generator')}
                            className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {isLimitReached ? <Lock className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
                            {isLimitReached ? 'Desbloquear Generación PRO' : 'Crear mi Web ahora con IA'}
                        </button>
                    </div>
                </div>

                {/* 2. THANK YOU PAGE CARD */}
                <div className="bg-gray-900/50 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 md:p-12 flex flex-col h-full hover:border-green-500/30 transition-all duration-500 shadow-2xl group">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black text-white tracking-tight">Página de Gracias</h4>
                                <p className="text-green-400 text-xs font-bold uppercase tracking-widest">Fase de Compromiso</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-10">
                        {/* Selector de Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(TY_TABS_DATA) as Array<keyof typeof TY_TABS_DATA>).map(tabKey => (
                                <button 
                                    key={tabKey}
                                    onClick={() => setSelectedTyTab(tabKey)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${selectedTyTab === tabKey ? 'bg-green-600 text-white border-green-400 shadow-lg shadow-green-900/40' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700'}`}
                                >
                                    {TY_TABS_DATA[tabKey].label}
                                </button>
                            ))}
                        </div>

                        {/* Visual Preview */}
                        <div className="relative group/preview">
                            <div className="absolute -inset-4 bg-green-500/5 blur-3xl opacity-0 group-hover/preview:opacity-100 transition-opacity"></div>
                            {renderTyPreview(selectedTyTab || 'header')}
                            
                            {/* Strategy Tooltip */}
                            <div className="mt-8 p-6 bg-green-900/20 border border-green-500/20 rounded-[1.5rem] relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><Gift className="w-10 h-10 text-green-400" /></div>
                                <div className="flex gap-4 items-start relative z-10">
                                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shrink-0"><Info className="w-5 h-5" /></div>
                                    <p className="text-gray-300 text-base leading-relaxed font-medium italic">
                                        {TY_TABS_DATA[selectedTyTab as keyof typeof TY_TABS_DATA]?.strategyText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <button 
                            onClick={() => navigate('/dashboard/pages')}
                            className="w-full py-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-black text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                        >
                            <Monitor className="w-6 h-6 text-green-500" /> Gestionar mi Ecosistema
                        </button>
                    </div>
                </div>
            </div>
            
            {/* --- MULTIPLE PAGES MODAL --- */}
            {showPagesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-black text-white text-xl flex items-center gap-3">
                                <Layout className="w-6 h-6 text-blue-500" /> 
                                {modalMode === 'ty' ? 'Páginas de Gracias' : 'Landing Pages del Proyecto'}
                            </h3>
                            <button onClick={() => setShowPagesModal(false)} className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            {linkedPages.map(page => (
                                <div key={page.id} className="bg-black/40 border border-gray-800 rounded-[1.5rem] p-5 flex items-center justify-between hover:border-blue-500/40 transition group">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-black text-white text-lg group-hover:text-blue-400 transition">{page.name}</h4>
                                        <div className="flex gap-2">
                                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${page.isPublished ? 'bg-green-900/30 text-green-400 border-green-900/50' : 'bg-orange-900/30 text-orange-400 border-orange-900/50'}`}>
                                                {page.isPublished ? 'Publicada' : 'Borrador'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                onEditPage(page.id);
                                                setShowPagesModal(false);
                                            }}
                                            className="p-3 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl transition border border-blue-500/20"
                                            title="Editar Diseño"
                                        >
                                            <PenTool className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-800/50 border-t border-gray-800 flex justify-end">
                            <button onClick={() => setShowPagesModal(false)} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};