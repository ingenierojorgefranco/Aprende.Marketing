import React, { useState } from 'react';
// FIX: Added missing XCircle to lucide-react imports
import { Globe, Check, Layout, CheckCircle2, Wand2, Lightbulb, Info, Sparkles, AlignLeft, Gift, AlertTriangle, ArrowRight, Play, PenTool, ExternalLink, X, Eye, Plus, Lock, Smartphone, Monitor, MessageCircle, BookOpen, PlayCircle, MousePointer2, Zap, ArrowDown, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingPage, PlanLimits, Plan } from '../../../../types';
import { Generator } from '../Generator';
import { api } from '../../../../services/api';

interface ProjectStrategy_WebSystemProps {
    projectId: string;
    lpTabsData?: any;
    tyTabsData?: any;
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
    projectId, lpTabsData, tyTabsData,
    selectedLpTab, setSelectedLpTab, selectedTyTab, setSelectedTyTab, handleTooltipHover, handleTooltipLeave, linkedPages, onEditPage,
    pageCount = 0, domainCount = 0, planLimits, onUpgrade, nextPlan
}) => {
    const navigate = useNavigate();
    // FIX: Added missing state showPagesModal to control the multiple pages modal visibility
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);

    // Default to first tabs if null
    React.useEffect(() => {
        if (!selectedLpTab && lpTabsData) {
            const firstKey = Object.keys(lpTabsData)[0];
            if (firstKey) setSelectedLpTab(firstKey);
        }
        if (!selectedTyTab && tyTabsData) {
            const firstKey = Object.keys(tyTabsData)[0];
            if (firstKey) setSelectedTyTab(firstKey);
        }
    }, [lpTabsData, tyTabsData]);

    const handlePageGenerated = async (page: LandingPage) => {
        try {
            const savedPage = await api.createPage(page);
            setShowGeneratorModal(false);
            navigate(`/dashboard/editor/${savedPage.id}`);
        } catch (e: any) {
            alert(`Error guardando la página: ${e.message}`);
        }
    };

    const renderBrowserMockup = (content: React.ReactNode, isDark = false) => (
        <div className={`w-full ${isDark ? 'bg-[#0b0b0b]' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'} flex flex-col group/mockup transition-all duration-500 hover:shadow-primary/10`}>
            {/* Browser Bar */}
            <div className={`h-10 ${isDark ? 'bg-gray-900 border-b border-gray-800' : 'bg-gray-100 border-b border-gray-200'} flex items-center px-4 gap-4 shrink-0`}>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                </div>
                <div className={`flex-1 max-w-md h-6 ${isDark ? 'bg-black/40' : 'bg-white'} rounded-md border ${isDark ? 'border-white/5' : 'border-gray-200'} flex items-center px-3 gap-2`}>
                    <Lock className="w-2.5 h-2.5 text-gray-500" />
                    <div className="h-1.5 w-full bg-gray-500/20 rounded-full"></div>
                </div>
            </div>
            {/* Viewport content with simulated scroll */}
            <div className="flex-1 overflow-hidden relative min-h-[350px]">
                <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                    {content}
                </div>
                {/* Scroll track indicator */}
                <div className="absolute right-1 top-2 bottom-2 w-1 bg-gray-500/10 rounded-full opacity-0 group-hover/mockup:opacity-100 transition-opacity"></div>
            </div>
        </div>
    );

    const renderLpContent = (tabKey: string) => {
        if (!lpTabsData) return null;
        const data = lpTabsData[tabKey];
        if (!data) return null;

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {data.type === 'hero' && (
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">Lead Magnet Activo</div>
                        <h4 className="text-gray-900 font-black text-3xl leading-tight">{data.h1}</h4>
                        <p className="text-gray-600 text-lg leading-relaxed">{data.h2}</p>
                        <div className="h-14 w-full bg-primary rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg">RESERVAR MI CUPO</div>
                    </div>
                )}
                {data.type === 'pain' && (
                    <div className="space-y-4">
                        <h4 className="text-gray-900 font-black text-2xl mb-6">¿Te sientes identificada?</h4>
                        <div className="space-y-3">
                            {data.items?.map((item: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start p-4 bg-red-50 rounded-2xl border border-red-100">
                                    {/* FIX: XCircle is now correctly imported */}
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-gray-800 text-base leading-snug font-medium">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data.type === 'benefits' && (
                    <div className="space-y-4">
                        <h4 className="text-gray-900 font-black text-2xl mb-6">Tu transformación incluye:</h4>
                        <div className="space-y-4">
                            {data.items?.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4 items-center p-4 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                                    <div>
                                        <p className="text-gray-900 font-bold text-base leading-tight">{item.title}</p>
                                        {item.desc && <p className="text-gray-600 text-xs mt-1">{item.desc}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderTyContent = (tabKey: string) => {
        if (!tyTabsData) return null;
        const data = tyTabsData[tabKey];
        if (!data) return null;

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {data.type === 'header' && (
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/30">
                            <Check className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-black text-3xl mb-4 leading-tight">{data.content?.h1}</h4>
                        <p className="text-gray-400 text-lg">{data.content?.h2}</p>
                    </div>
                )}
                {data.type === 'action' && (
                    <div className="text-center">
                        <div className="w-full h-2.5 bg-gray-800 rounded-full mb-10 overflow-hidden shadow-inner">
                            <div className="w-[85%] h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"></div>
                        </div>
                        <h4 className="text-white font-black text-2xl mb-6">{data.content?.h1}</h4>
                        <button className="w-full py-5 bg-[#25D366] rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl shadow-xl shadow-green-900/40 hover:scale-[1.02] transition-transform">
                            <MessageCircle className="w-7 h-7" /> UNIRME AL GRUPO VIP
                        </button>
                        <p className="text-gray-500 text-xs mt-4 uppercase font-bold tracking-[0.2em]">{data.content?.h2}</p>
                    </div>
                )}
                {data.type === 'magnet' && (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-44 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-xl shadow-2xl mb-8 flex flex-col items-center justify-center p-4 text-white border-l-8 border-white/10 transform -rotate-2 relative">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><Sparkles className="w-10 h-10" /></div>
                            <BookOpen className="w-12 h-12 mb-4" />
                            <div className="h-1.5 w-16 bg-white/30 rounded-full mb-2"></div>
                            <div className="h-1.5 w-12 bg-white/20 rounded-full"></div>
                        </div>
                        <h4 className="text-white font-black text-2xl mb-4">{data.content?.h1}</h4>
                        <p className="text-gray-400 text-base leading-relaxed">{data.content?.h2}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div id="psd-web-section" className="space-y-24">
                {/* HEADER ESTRATÉGICO */}
                <div id="psd-web-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/5">
                        <Monitor className="w-5 h-5" /> Web Blueprint de Alta Conversión
                    </div>
                    <h3 id="psd-web-title" className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl italic">
                        Plano Maestro de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Sistema de Captación</span>
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light">
                        <p className="border-l-4 border-blue-500 pl-8 py-2">
                            No diseñamos sitios web, construimos embudos psicológicos. Este es el esquema de cómo tu cliente transitará de ser un extraño a ser un lead cualificado.
                        </p>
                        <p className="border-l-4 border-cyan-500 pl-8 py-2">
                            Cada bloque visual ha sido redactado por la IA para eliminar objeciones y potenciar el deseo de transformación inmediata de tu avatar.
                        </p>
                    </div>
                </div>

                {/* BLUEPRINT GRID */}
                <div className="flex flex-col gap-16 max-w-[85em] mx-auto pb-20">
                    
                    <div className="grid grid-cols-1 xl:grid-cols-11 gap-8 items-stretch relative">
                        
                        {/* PILAR 1: LANDING PAGE */}
                        <div className="xl:col-span-5 space-y-8 flex flex-col h-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white">Página de Captura</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">El Imán de Prospectos</p>
                                    </div>
                                </div>
                                {/* FIX: Added button to open showPagesModal when pages are linked, enabling access to the modal logic */}
                                {linkedPages.length > 0 && (
                                    <button 
                                        onClick={() => setShowPagesModal(true)}
                                        className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl border border-blue-500/20 transition-all flex items-center gap-2 text-xs font-bold"
                                    >
                                        <Layout className="w-4 h-4" /> Ver {linkedPages.length} {linkedPages.length === 1 ? 'Página' : 'Páginas'}
                                    </button>
                                )}
                            </div>

                            <div className="bg-gray-900/60 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative">
                                <div className="absolute -top-3 -right-3 px-4 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg z-10 uppercase tracking-widest italic">Misión: Filtrar</div>
                                
                                <div className="flex-1 space-y-8">
                                    {/* Browser Mockup LP */}
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-2">
                                            {lpTabsData && Object.keys(lpTabsData).map(tabKey => (
                                                <button 
                                                    key={tabKey}
                                                    onClick={() => setSelectedLpTab(tabKey)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedLpTab === tabKey ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-white'}`}
                                                >
                                                    {lpTabsData[tabKey].label}
                                                </button>
                                            ))}
                                        </div>
                                        {renderBrowserMockup(renderLpContent(selectedLpTab || ''))}
                                    </div>

                                    {/* ADN de la Página */}
                                    <div className="pt-8 border-t border-white/5">
                                        <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-blue-400" /> ADN de Conversión
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                "Headline Hipnótico de Curiosidad",
                                                "Bloque de Dolores Agudos",
                                                "Mecanismo Único de Solución",
                                                "Prueba Social de Alumnos",
                                                "Botón de Acción Directa",
                                                "Optimización de Carga < 2s"
                                            ].map((feat, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    {feat}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inteligencia de Conversión LP */}
                            <div className="bg-blue-900/10 border border-blue-500/20 rounded-[2rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform"><Lightbulb className="w-12 h-12 text-blue-400" /></div>
                                <div className="flex gap-5 items-start">
                                    <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 shrink-0 shadow-lg"><Info className="w-6 h-6" /></div>
                                    <div>
                                        <h5 className="text-white font-black text-lg mb-2">Estrategia de Captura</h5>
                                        <p className="text-gray-400 text-base leading-relaxed italic">
                                            {lpTabsData && selectedLpTab ? lpTabsData[selectedLpTab].strategyText : 'Analizando inteligencia de mercado...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CONECTOR FLOW (1 Col) */}
                        <div className="xl:col-span-1 flex flex-col items-center justify-center gap-4 py-8">
                            <div className="hidden xl:flex flex-col items-center gap-4">
                                <div className="h-24 w-px bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                                <div className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse">
                                    <ArrowRight className="w-8 h-8" />
                                </div>
                                <div className="h-24 w-px bg-gradient-to-b from-emerald-500 to-emerald-700"></div>
                            </div>
                            <div className="xl:hidden flex flex-col items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                                    <ArrowDown className="w-8 h-8" />
                                </div>
                            </div>
                        </div>

                        {/* PILAR 2: THANK YOU PAGE */}
                        <div className="xl:col-span-5 space-y-8 flex flex-col h-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white">Página de Gracias</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">El Cierre Inicial</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/60 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full hover:border-emerald-500/30 transition-all duration-500 shadow-2xl relative">
                                <div className="absolute -top-3 -right-3 px-4 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-full shadow-lg z-10 uppercase tracking-widest italic">Misión: Mover</div>
                                
                                <div className="flex-1 space-y-8">
                                    {/* Browser Mockup TY */}
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-2">
                                            {tyTabsData && Object.keys(tyTabsData).map(tabKey => (
                                                <button 
                                                    key={tabKey}
                                                    onClick={() => setSelectedTyTab(tabKey)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedTyTab === tabKey ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-white'}`}
                                                >
                                                    {tyTabsData[tabKey].label}
                                                </button>
                                            ))}
                                        </div>
                                        {renderBrowserMockup(renderTyContent(selectedTyTab || ''), true)}
                                    </div>

                                    {/* ADN de la Página */}
                                    <div className="pt-8 border-t border-white/5">
                                        <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                            <Gift className="w-4 h-4 text-emerald-400" /> Ingeniería de Compromiso
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                "Mensaje de Autoridad y Bienvenida",
                                                "Llamado a la Acción para WhatsApp",
                                                "Entrega Inmediata de Lead Magnet",
                                                "Barra de Progreso Psicológica",
                                                "Instrucciones de Revisión de Email",
                                                "Gatillo de Reciprocidad Directo"
                                            ].map((feat, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    {feat}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inteligencia de Conversión TY */}
                            <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-[2rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform"><Sparkles className="w-12 h-12 text-emerald-400" /></div>
                                <div className="flex gap-5 items-start">
                                    <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 shrink-0 shadow-lg"><Info className="w-6 h-6" /></div>
                                    <div>
                                        <h5 className="text-white font-black text-lg mb-2">Estrategia de Retención</h5>
                                        <p className="text-gray-400 text-base leading-relaxed italic">
                                            {tyTabsData && selectedTyTab ? tyTabsData[selectedTyTab].strategyText : 'Calculando ruta de conversión...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* BOTÓN DE ACCIÓN O BLOQUE DE ÉXITO FINAL */}
                    <div className="max-w-4xl mx-auto w-full pt-10">
                        {linkedPages.length > 0 ? (
                            <div className="bg-[#0B0B0B] border border-emerald-500/20 rounded-[3rem] p-10 md:p-12 shadow-[0_20px_50px_rgba(16,185,129,0.1)] flex flex-col items-center text-center animate-in zoom-in-95 duration-700 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-400 opacity-50"></div>
                                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8 animate-bounce">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                                    ¡Tu Página de Captura ha sido generada correctamente!
                                </h3>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mb-10">
                                    Tu nuevo activo digital está optimizado para convertir visitas en leads de alta calidad de forma automática.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                    <a 
                                        href={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white text-black font-black py-4 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 hover:bg-gray-100 transform hover:scale-[1.03] active:scale-95"
                                    >
                                        <ExternalLink className="w-5 h-5" /> Ver Página
                                    </a>
                                    <button 
                                        onClick={() => onEditPage(linkedPages[0].id)}
                                        className="flex-1 bg-[#FF5A1F] text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-[#FF5A1F]/20 flex items-center justify-center gap-3 hover:bg-[#D94A1E] transform hover:scale-[1.03] active:scale-95"
                                    >
                                        <PenTool className="w-5 h-5" /> Editar Diseño
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setShowGeneratorModal(true)}
                                    className="w-full py-6 rounded-[2.5rem] bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl shadow-[0_20px_50px_rgba(255,90,31,0.3)] flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 group"
                                >
                                    <PenTool className="w-8 h-8 group-hover:rotate-12 transition-transform" /> 
                                    Generar mis Páginas ahora con IA
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                                <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-8">Arquitectura semántica garantizada para Hotmart®</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* --- MULTIPLE PAGES MODAL (Para edición rápida) --- */}
            {/* FIX: showPagesModal is now correctly defined via useState */}
            {showPagesModal && (
                <div 
                    onClick={() => setShowPagesModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-gray-700 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95"
                    >
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-850 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                    <Layout className="w-6 h-6" />
                                </div>
                                <h3 className="font-black text-white text-2xl uppercase tracking-tight italic">
                                    Mis Páginas
                                </h3>
                            </div>
                            <button onClick={() => setShowPagesModal(false)} className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="p-8 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            {linkedPages.map(page => (
                                <div key={page.id} className="bg-black/40 border border-gray-800 rounded-[1.5rem] p-6 flex items-center justify-between hover:border-blue-500/40 transition group">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-black text-white text-xl group-hover:text-blue-400 transition">{page.name}</h4>
                                        <div className="flex gap-2">
                                            <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${page.isPublished ? 'bg-green-900/30 text-emerald-400 border-emerald-500/30' : 'bg-orange-900/30 text-orange-400 border-orange-500/30'}`}>
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
                                            className="p-4 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-2xl transition border border-blue-500/20 shadow-lg"
                                            title="Editar Diseño"
                                        >
                                            <PenTool className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex justify-end">
                            <button onClick={() => setShowPagesModal(false)} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-black uppercase text-xs tracking-widest transition shadow-lg">
                                Cerrar Ventana
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GENERATOR MODAL OVERLAY */}
            {showGeneratorModal && (
                <div 
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300"
                    onClick={() => setShowGeneratorModal(false)}
                >
                    <div 
                        className="w-full max-w-[1200px] h-[95vh] overflow-hidden rounded-[3rem] shadow-2xl relative border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Generator 
                            onPageGenerated={handlePageGenerated} 
                            embeddedProjectId={projectId} 
                            onClose={() => setShowGeneratorModal(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};