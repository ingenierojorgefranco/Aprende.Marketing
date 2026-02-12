import React, { useState, useEffect } from 'react';
import { Globe, Check, Layout, CheckCircle2, Wand2, Sparkles, AlertTriangle, ArrowRight, PenTool, ExternalLink, X, Plus, Lock, Smartphone, Monitor, MessageCircle, BookOpen, Zap, ArrowDown, XCircle, Crown, Loader2, Settings, PlayCircle, Gift, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingPage, PlanLimits, Plan } from '../../../../types';
import { Generator } from '../Generator';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';
import { ProjectMasterStrategy } from '../../../../services/strategySchema';

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
    onEditPage: (id: string) => void;
    pageCount?: number;
    planLimits?: PlanLimits;
    onUpgrade?: () => void;
    nextPlan?: Plan | null;
    isSimulating?: boolean;
}

export const ProjectStrategy_WebSystem: React.FC<ProjectStrategy_WebSystemProps> = ({ 
    projectId, lpTabsData, tyTabsData,
    selectedLpTab, setSelectedLpTab, selectedTyTab, setSelectedTyTab, onEditPage,
    pageCount = 0, planLimits, isSimulating = false, onUpgrade
}) => {
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [domainCount, setDomainCount] = useState(0);
    const [strategy, setStrategy] = useState<ProjectMasterStrategy | null>(null);
    
    // Estado para el control de acordeón en el modal de dominios
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

    useEffect(() => {
        if (!selectedLpTab) {
            setSelectedLpTab('hero');
        }
        if (!selectedTyTab && tyTabsData) {
            const firstKey = Object.keys(tyTabsData)[0];
            if (firstKey) setSelectedTyTab(firstKey);
        }
    }, [tyTabsData, selectedLpTab, selectedTyTab, setSelectedLpTab, setSelectedTyTab]);

    useEffect(() => {
        const loadLocalData = async () => {
            if (!projectId) return;
            setLoadingLocal(true);
            try {
                const [pages, strategyData] = await Promise.all([
                    api.getPages(),
                    api.getProjectStrategy(projectId)
                ]);
                const projectPages = pages.filter(p => String(p.projectId) === String(projectId));
                setLinkedPages(projectPages);
                setDomainCount(pages.filter(p => !!p.customDomain).length);
                setStrategy(strategyData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingLocal(false);
            }
        };
        loadLocalData();
    }, [projectId]);

    const handlePageGenerated = async (page: LandingPage) => {
        try {
            await api.createPage(page);
            handleCloseAndReload();
        } catch (e: any) {
            alert(`Error guardando la página: ${e.message}`);
        }
    };

    const handleCloseAndReload = () => {
        setShowGeneratorModal(false);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('section', 'web');
        currentUrl.hash = 'web-system-anchor';
        window.location.replace(currentUrl.toString());
        window.location.reload();
    };

    const isRealAdmin = planLimits?.planName === 'admin' && !isSimulating;
    const maxLandings = planLimits?.maxLandings || 3;
    const maxDomains = planLimits?.maxDomains || 1;
    const usagePercent = Math.min(100, (pageCount / maxLandings) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    const renderBrowserMockup = (content: React.ReactNode, isDark = false) => (
        <div className={`w-full ${isDark ? 'bg-[#0b0b0b]' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'} flex flex-col group/mockup transition-all duration-500 hover:shadow-primary/10`}>
            <div className={`h-10 ${isDark ? 'bg-gray-900 border-b border-gray-800' : 'bg-gray-100 border-b border-gray-200'} flex items-center px-4 gap-4 shrink-0`}>
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400/80"></div><div className="w-3 h-3 rounded-full bg-yellow-400/80"></div><div className="w-3 h-3 rounded-full bg-green-400/80"></div></div>
                <div className={`flex-1 max-w-md h-6 ${isDark ? 'bg-black/40' : 'bg-white'} rounded-md border ${isDark ? 'border-white/5' : 'border-gray-200'} flex items-center px-3 gap-2`}><Lock className="w-2.5 h-2.5 text-gray-500" /><div className="h-1.5 w-full bg-gray-500/20 rounded-full"></div></div>
            </div>
            <div className="flex-1 overflow-hidden relative min-h-[350px]"><div className="p-8 h-full overflow-y-auto custom-scrollbar">{content}</div></div>
        </div>
    );

    const renderLpContent = (tabKey: string) => {
        if (tabKey === 'hero') {
            const data = lpTabsData?.hero;
            if (!data) return null;
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">Lead Magnet Activo</div>
                        <h4 className="text-gray-900 font-black text-3xl leading-tight">{data.h1}</h4>
                        <p className="text-gray-600 text-lg leading-relaxed">{data.h2}</p>
                        <div className="h-14 w-full bg-primary rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg">RESERVAR MI CUPO</div>
                    </div>
                </div>
            );
        }

        if (tabKey === 'pain') {
            const items = strategy?.psychology?.pains || [];
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-4">
                        <h4 className="text-gray-900 font-black text-2xl mb-6">¿Te sientes identificada?</h4>
                        <div className="space-y-3">
                            {items.map((item: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start p-4 bg-red-50 rounded-2xl border border-red-100">
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <p className="text-gray-800 text-base leading-snug font-medium">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (tabKey === 'benefits') {
            const items = strategy?.psychology?.solutions || [];
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-4">
                        <h4 className="text-gray-900 font-black text-2xl mb-6">Tu transformación incluye:</h4>
                        <div className="space-y-4">
                            {items.map((item: any, i: number) => {
                                const title = typeof item === 'object' ? item.title : item;
                                const description = typeof item === 'object' ? item.description : null;
                                return (
                                    <div key={i} className="flex gap-4 items-center p-4 bg-emerald-50 rounded-[1.5rem] border border-emerald-100">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="text-gray-900 font-bold text-base leading-tight">{title}</p>
                                            {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderTyContent = (tabKey: string) => {
        if (!tyTabsData) return null;
        const data = tyTabsData[tabKey];
        if (!data) return null;
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {data.type === 'header' && (<div className="text-center flex flex-col items-center"><div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/30"><Check className="w-10 h-10 text-emerald-400" /></div><h4 className="text-white font-black text-3xl mb-4 leading-tight">{data.content?.h1}</h4><p className="text-gray-400 text-lg">{data.content?.h2}</p></div>)}
                {data.type === 'action' && (<div className="text-center"><div className="w-full h-2.5 bg-gray-800 rounded-full mb-10 overflow-hidden shadow-inner"><div className="w-[85%] h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"></div></div><h4 className="text-white font-black text-2xl mb-6">{data.content?.h1}</h4><button className="w-full py-5 bg-[#25D366] rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl shadow-xl shadow-green-900/40">UNIRME AL GRUPO VIP</button></div>)}
                {data.type === 'magnet' && (<div className="text-center flex flex-col items-center"><div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/30"><Gift className="w-10 h-10 text-primary" /></div><h4 className="text-white font-black text-2xl mb-4 leading-tight">{data.content?.h1}</h4><p className="text-gray-400 text-lg mb-8">{data.content?.h2}</p><div className="w-full py-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center gap-2 text-gray-300 font-bold"><Download className="w-5 h-5" /> DESCARGAR AHORA</div></div>)}
            </div>
        );
    };

    const lpTabs = [
        { key: 'hero', label: "1. Encabezado" },
        { key: 'pain', label: "2. Dolores" },
        { key: 'benefits', label: "3. Beneficios" }
    ];

    return (
        <>
            <div className="space-y-24">
                <div id="psd-web-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg"><Monitor className="w-5 h-5" /> Web Blueprint</div>
                    <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl" style={{
                        lineHeight: '1.1em'
                    }}>Activa tu Página de Captura<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> y atrae clientes en automático</span></h3>
                    
                    <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                        <p className="flex-1 border-l-4 border-blue-500 pl-8 py-2">Nuestra Inteligencia Artificial creará por ti, tu página web de Captura Perfecta (LandingPage) para que tus visitantes interesados en tu producto digital sientan la necesidad de registrarse de inmediato</p>
                        <div className="hidden md:block w-px h-24 bg-cyan-500/30"></div>
                        <div 
                            onClick={() => setShowVideoModal(true)}
                            className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group cursor-pointer"
                        >
                            <img 
                            src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                                    <PlayCircle className="w-10 h-10 text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-16 max-w-[85em] mx-auto pb-20">
                    <div className="grid grid-cols-1 xl:grid-cols-11 gap-8 items-stretch relative">
                        <div className="xl:col-span-5 space-y-8 flex flex-col h-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-white">Página de Captura</h4>
                                    </div>
                                </div>
                                {loadingLocal && (
                                    <div className="flex items-center gap-2 px-3 py-1">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-900/60 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full shadow-2xl relative">
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-white text-xl">Estructura de tu Página Web</h5>
                                        <p className="text-white font-light text-[1.3rem] leading-[2.5rem]">Usaremos los siguientes elementos para construir una página web 100% profesional enfocada en los dolores, necesidades y beneficios de tus potenciales clientes. <br/><br/>Haz clic en los elementos para más detalles.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {lpTabs.map(tab => (
                                            <button 
                                                key={tab.key} 
                                                onClick={() => setSelectedLpTab(tab.key)} 
                                                className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest border ${selectedLpTab === tab.key ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-gray-800 text-gray-500 border-gray-700'}`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    {renderBrowserMockup(renderLpContent(selectedLpTab || 'hero'))}
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-1 flex flex-col items-center justify-center gap-4 py-8"><div className="hidden xl:flex flex-col items-center gap-4"><div className="h-24 w-px bg-gradient-to-b from-blue-500 to-emerald-500"></div><div className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg"><ArrowRight className="w-8 h-8" /></div><div className="h-24 w-px bg-gradient-to-b from-emerald-500 to-emerald-700"></div></div></div>

                        <div className="xl:col-span-5 space-y-8 flex flex-col h-full">
                            <div className="flex items-center gap-3"><div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400"><CheckCircle2 className="w-6 h-6" /></div><h4 className="text-2xl font-black text-white">Página de Gracias</h4></div>
                            <div className="bg-gray-900/60 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full shadow-2xl relative">
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-white text-xl">Estructura de tu Página de Gracias</h5>
                                        <p className="text-white font-light text-[1.3rem] leading-[2.5rem]">Usaremos los siguientes elementos para construir una página de gracias persuasiva enfocada en guiar al usuario hacia tu comunidad. <br/><br/>Haz clic en los elementos para más detalles.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">{tyTabsData && Object.keys(tyTabsData).map(tabKey => (<button key={tabKey} onClick={() => setSelectedTyTab(tabKey)} className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest border ${selectedTyTab === tabKey ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{tyTabsData[tabKey].label}</button>))}</div>
                                    {renderBrowserMockup(renderTyContent(selectedTyTab || ''), true)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="web-system-anchor" className="max-w-4xl mx-auto w-full pt-10">
                        {loadingLocal ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                        ) : linkedPages.length > 0 ? (
                            <div className="bg-[#0B0B0B] border border-emerald-500/20 rounded-[3rem] p-10 shadow-xl flex flex-col items-center text-center animate-in zoom-in-95">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                                <h3 className="text-3xl font-black text-white mb-4">¡Tu Sistema de Ventas está 100% Activo!</h3>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-2xl">Todas las configuraciones técnicas, enlaces de seguimiento y formularios de captura han sido verificados. Tu embudo está listo para procesar visitantes y convertirlos en prospectos de alta calidad.</p>
                                
                                <div className="w-full max-w-[41rem] space-y-4">
                                    {/* Fila 1 - Visualización */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a href={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-black font-black py-4 px-10 rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.03] transition-all">Ver Página de Captura</a>
                                        <a href={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}/gracias`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.03] transition-all">Ver Página de Gracias</a>
                                    </div>
                                    {/* Fila 2 - Gestión */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a 
                                            href={window.location.hash.startsWith('#/') ? `#/dashboard/editor/${linkedPages[0].id}` : `/dashboard/editor/${linkedPages[0].id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-[#FF5A1F] text-white font-black py-4 px-10 rounded-2xl shadow-xl transform hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
                                        >
                                            <PenTool className="w-5 h-5" /> Editar Página de Captura
                                        </a>
                                        <button onClick={() => setShowDomainModal(true)} className="flex-1 bg-blue-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl transform hover:scale-[1.03] transition-all flex items-center justify-center gap-2"><Globe className="w-5 h-5" /> Asignar Dominio</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setShowConfirmModal(true)} className="w-full py-6 rounded-[2.5rem] bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl shadow-xl flex items-center justify-center gap-4">Generar mis Páginas ahora con IA <ArrowRight className="w-6 h-6" /></button>
                        )}
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-[#0B0B0B] border border-blue-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center" onClick={e => e.stopPropagation()}>
                        <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-white mb-6">Confirma la generación</h3>
                        <div className="bg-white/5 p-6 rounded-[2rem] mb-8">
                            <div className="flex justify-between text-xs text-gray-500 uppercase font-black mb-2"><span>Consumo</span><span>{pageCount} / {maxLandings}</span></div>
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden"><div className={`h-full ${progressColor}`} style={{ width: `${usagePercent}%` }}></div></div>
                        </div>
                        <div className="flex gap-4"><button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black">No, cancelar</button><button onClick={() => { setShowConfirmModal(false); setShowGeneratorModal(true); }} className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-black">Confirmar</button></div>
                    </div>
                </div>
            )}
            
            {showPagesModal && (
                <div onClick={() => setShowPagesModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div onClick={(e) => e.stopPropagation()} className="bg-gray-900 border border-gray-700 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center"><h3 className="font-black text-white text-2xl">Mis Páginas</h3><button onClick={() => setShowPagesModal(false)} className="text-gray-400"><X className="w-6 h-6"/></button></div>
                        <div className="p-8 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            {linkedPages.map(page => (
                                <div key={page.id} className="bg-black/40 border border-gray-800 rounded-[1.5rem] p-6 flex items-center justify-between transition group">
                                    <h4 className="font-black text-white text-xl">{page.name}</h4>
                                    <button onClick={() => { onEditPage(page.id); setShowPagesModal(false); }} className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl"><PenTool className="w-6 h-6" /></button>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 flex justify-end"><button onClick={() => setShowPagesModal(false)} className="px-8 py-3 bg-gray-800 text-white rounded-xl font-black">Cerrar</button></div>
                    </div>
                </div>
            )}

            {showGeneratorModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in" onClick={handleCloseAndReload}>
                    <div className="w-full max-w-[1200px] h-[95vh] rounded-[3rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <Generator onPageGenerated={handlePageGenerated} embeddedProjectId={projectId} onClose={handleCloseAndReload} />
                    </div>
                </div>
            )}

            {showVideoModal && (
                <div 
                    onClick={() => setShowVideoModal(false)}
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
                    >
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-blue-500" /> Tutorial: Sistema Web
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Tutorial Web" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {showDomainModal && (
                <div 
                    onClick={() => setShowDomainModal(false)}
                    className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        <button onClick={() => setShowDomainModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-gray-800 transition">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                <Globe className="w-10 h-10 text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">Asigna tu Dominio Personalizado</h2>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
                                Conecta tu propio dominio (.com, .net, etc.) para profesionalizar tu marca, aumentar la confianza de tus clientes y disparar tus conversiones.
                            </p>
                        </div>

                        {/* Video Tutorial Integrado */}
                        <div className="mb-8 bg-black/40 border border-white/5 rounded-3xl p-6">
                            <p className="text-white font-bold mb-4 flex items-center justify-center gap-2">
                                <PlayCircle className="w-5 h-5 text-primary" /> Mira el video completo para configurar tu dominio
                            </p>
                            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                                    title="Tutorial Configuración de Dominio" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {/* Sistema de Acordeón */}
                        <div className="space-y-4 mb-8">
                            {/* Nivel 1: Comprar Dominio */}
                            <div className="border border-gray-800 rounded-2xl overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
                                    className="w-full flex items-center justify-between p-5 bg-gray-800 hover:bg-gray-750 transition text-left"
                                >
                                    <span className="font-bold text-white flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">1</div>
                                        Comprar Dominio
                                    </span>
                                    {activeAccordion === 1 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {activeAccordion === 1 && (
                                    <div className="p-6 bg-black/30 border-t border-gray-800 animate-in slide-in-from-top-2 text-center">
                                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                            Si aún no tienes un dominio, te recomendamos comprarlo en <a href="https://name.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Name.com</a>. Es una de las plataformas más estables y fáciles de configurar con nuestro sistema.
                                        </p>
                                        <a 
                                            href="https://www.name.com" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-10 py-4 bg-primary hover:bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/20 transform hover:scale-105 active:scale-95 mb-4"
                                        >
                                            Comprar en Name.com <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Nivel 2: Registros DNS */}
                            <div className="border border-gray-800 rounded-2xl overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 2 ? null : 2)}
                                    className="w-full flex items-center justify-between p-5 bg-gray-800 hover:bg-gray-750 transition text-left"
                                >
                                    <span className="font-bold text-white flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">2</div>
                                        Configurar Registros DNS
                                    </span>
                                    {activeAccordion === 2 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {activeAccordion === 2 && (
                                    <div className="p-6 bg-black/30 border-t border-gray-800 animate-in slide-in-from-top-2">
                                        <p className="text-gray-300 text-lg mb-8 font-bold">Accede al panel de tu proveedor de dominio (Name.com, GoDaddy, etc.) y añade estos registros exactamente:</p>
                                        
                                        <div className="overflow-hidden border border-gray-800 rounded-xl shadow-lg">
                                            <table className="w-full text-base text-left">
                                                <thead className="bg-gray-800 text-gray-300 font-black uppercase tracking-widest">
                                                    <tr>
                                                        <th className="p-4">Tipo</th>
                                                        <th className="p-4">Nombre / Host</th>
                                                        <th className="p-4">Valor / Destino</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800 text-gray-400 font-mono">
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">151.101.1.195</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">151.101.65.195</td>
                                                    </tr>
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">151.101.129.195</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-blue-400">A</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">151.101.193.195</td>
                                                    </tr>
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2a04:4e42::403</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2a04:4e42:200::403</td>
                                                    </tr>
                                                    <tr className="bg-black/40">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2a04:4e42:400::403</td>
                                                    </tr>
                                                    <tr className="bg-black/20">
                                                        <td className="p-4 font-bold text-purple-400">AAAA</td>
                                                        <td className="p-4">@</td>
                                                        <td className="p-4">2a04:4e42:600::403</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Nivel 3: Finalizar */}
                            <div className="border border-gray-800 rounded-2xl overflow-hidden">
                                <button 
                                    onClick={() => setActiveAccordion(activeAccordion === 3 ? null : 3)}
                                    className="w-full flex items-center justify-between p-5 bg-gray-800 hover:bg-gray-750 transition text-left"
                                >
                                    <span className="font-bold text-white flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">3</div>
                                        Finalizar Configuración
                                    </span>
                                    {activeAccordion === 3 ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {activeAccordion === 3 && (
                                    <div className="p-8 bg-black/30 border-t border-gray-800 animate-in slide-in-from-top-2 text-center">
                                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                            Una vez realizados los cambios en tu proveedor, la propagación puede tardar entre 1 y 24 horas. Para finalizar, haz clic en el botón de abajo para que nuestro equipo técnico active tu certificado de seguridad SSL y finalice la vinculación.
                                        </p>
                                        <a 
                                            href={`https://wa.me/573146270784?text=${encodeURIComponent("Hola, me gustaria configurar un nombre de dominio a mi pagina web en www.aprende.marketing")}`}
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-900/20 transition-all transform hover:scale-105 active:scale-95 mb-4"
                                        >
                                            <MessageCircle className="w-6 h-6" /> Quiero configurar mi dominio
                                        </a>
                                        <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-4">
                                            Activación técnica inmediata vía soporte
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botón WhatsApp Final Fuera del Acordeón para Accesibilidad */}
                        <div className="mt-auto">
                            <a 
                                href={`https://wa.me/573146270784?text=${encodeURIComponent("Hola, me gustaria configurar un nombre de dominio a mi pagina web en www.aprende.marketing")}`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg shadow-xl shadow-blue-900/30 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 mb-4"
                            >
                                <MessageCircle className="w-6 h-6" /> Quiero configurar mi dominio
                            </a>
                            <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                                Activación técnica inmediata vía soporte
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};