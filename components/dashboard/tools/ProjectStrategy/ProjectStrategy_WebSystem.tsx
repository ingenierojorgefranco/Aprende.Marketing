import React, { useState, useEffect } from 'react';
import { Globe, Check, Layout, CheckCircle2, Wand2, Sparkles, AlertTriangle, ArrowRight, PenTool, ExternalLink, X, Plus, Lock, Smartphone, Monitor, MessageCircle, BookOpen, Zap, ArrowDown, XCircle, Crown, Loader2 } from 'lucide-react';
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
    pageCount = 0, planLimits, isSimulating = false
}) => {
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [domainCount, setDomainCount] = useState(0);

    useEffect(() => {
        if (!selectedLpTab && lpTabsData) {
            const firstKey = Object.keys(lpTabsData)[0];
            if (firstKey) setSelectedLpTab(firstKey);
        }
        if (!selectedTyTab && tyTabsData) {
            const firstKey = Object.keys(tyTabsData)[0];
            if (firstKey) setSelectedTyTab(firstKey);
        }
    }, [lpTabsData, tyTabsData, selectedLpTab, selectedTyTab, setSelectedLpTab, setSelectedTyTab]);

    useEffect(() => {
        const loadLocalData = async () => {
            if (!projectId) return;
            setLoadingLocal(true);
            try {
                const pages = await api.getPages();
                const projectPages = pages.filter(p => String(p.projectId) === String(projectId));
                setLinkedPages(projectPages);
                setDomainCount(pages.filter(p => !!p.customDomain).length);
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
        if (!lpTabsData) return null;
        const data = lpTabsData[tabKey];
        if (!data) return null;
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {data.type === 'hero' && (<div className="space-y-6"><div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">Lead Magnet Activo</div><h4 className="text-gray-900 font-black text-3xl leading-tight">{data.h1}</h4><p className="text-gray-600 text-lg leading-relaxed">{data.h2}</p><div className="h-14 w-full bg-primary rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg">RESERVAR MI CUPO</div></div>)}
                {data.type === 'pain' && (<div className="space-y-4"><h4 className="text-gray-900 font-black text-2xl mb-6">¿Te sientes identificada?</h4><div className="space-y-3">{(data.items || []).map((item: string, i: number) => (<div key={i} className="flex gap-4 items-start p-4 bg-red-50 rounded-2xl border border-red-100"><XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /><p className="text-gray-800 text-base leading-snug font-medium">{item}</p></div>))}</div></div>)}
                {data.type === 'benefits' && (<div className="space-y-4"><h4 className="text-gray-900 font-black text-2xl mb-6">Tu transformación incluye:</h4><div className="space-y-4">{(data.items || []).map((item: any, i: number) => (<div key={i} className="flex gap-4 items-center p-4 bg-emerald-50 rounded-[1.5rem] border border-emerald-100"><CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" /><div><p className="text-gray-900 font-bold text-base leading-tight">{item.title}</p>{item.desc && <p className="text-gray-600 text-xs mt-1">{item.desc}</p>}</div></div>))}</div></div>)}
            </div>
        );
    };

    const renderTyContent = (tabKey: string) => {
        if (!tyTabsData) return null;
        const data = tyTabsData[tabKey];
        if (!data) return null;
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {data.type === 'header' && (<div className="text-center flex flex-col items-center"><div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/30"><Check className="w-10 h-10 text-emerald-400" /></div><h4 className="text-white font-black text-3xl mb-4 leading-tight">{data.content?.h1}</h4><p className="text-gray-400 text-lg">{data.content?.h2}</p></div>)}
                {data.type === 'action' && (<div className="text-center"><div className="w-full h-2.5 bg-gray-800 rounded-full mb-10 overflow-hidden shadow-inner"><div className="w-[85%] h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"></div></div><h4 className="text-white font-black text-2xl mb-6">{data.content?.h1}</h4><button className="w-full py-5 bg-[#25D366] rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl shadow-xl shadow-green-900/40">UNIRME AL GRUPO VIP</button></div>)}
            </div>
        );
    };

    return (
        <>
            <div className="space-y-24">
                <div id="psd-web-header-container" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg"><Monitor className="w-5 h-5" /> Web Blueprint</div>
                    <h3 className="text-5xl md:text-6xl font-black text-white leading-tight italic">Plano Maestro de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Sistema</span></h3>
                    <div className="grid md:grid-cols-2 gap-10 text-white text-xl leading-relaxed font-light"><p className="border-l-4 border-blue-500 pl-8 py-2">No diseñamos sitios web, construimos embudos psicológicos.</p><p className="border-l-4 border-cyan-500 pl-8 py-2">Cada bloque visual ha sido redactado por la IA.</p></div>
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
                                {loadingLocal ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : linkedPages.length > 0 && (
                                    <button onClick={() => setShowPagesModal(true)} className="p-2.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl border border-blue-500/20 transition-all flex items-center gap-2 text-xs font-bold">
                                        <Layout className="w-4 h-4" /> Ver Páginas
                                    </button>
                                )}
                            </div>
                            <div className="bg-gray-900/60 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full shadow-2xl relative"><div className="flex-1 space-y-8"><div className="flex flex-wrap gap-2">{lpTabsData && Object.keys(lpTabsData).map(tabKey => (<button key={tabKey} onClick={() => setSelectedLpTab(tabKey)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedLpTab === tabKey ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{lpTabsData[tabKey].label}</button>))}</div>{renderBrowserMockup(renderLpContent(selectedLpTab || ''))}</div></div>
                        </div>

                        <div className="xl:col-span-1 flex flex-col items-center justify-center gap-4 py-8"><div className="hidden xl:flex flex-col items-center gap-4"><div className="h-24 w-px bg-gradient-to-b from-blue-500 to-emerald-500"></div><div className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg"><ArrowRight className="w-8 h-8" /></div><div className="h-24 w-px bg-gradient-to-b from-emerald-500 to-emerald-700"></div></div></div>

                        <div className="xl:col-span-5 space-y-8 flex flex-col h-full">
                            <div className="flex items-center gap-3"><div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400"><CheckCircle2 className="w-6 h-6" /></div><h4 className="text-2xl font-black text-white">Página de Gracias</h4></div>
                            <div className="bg-gray-900/60 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full shadow-2xl relative"><div className="flex-1 space-y-8"><div className="flex flex-wrap gap-2">{tyTabsData && Object.keys(tyTabsData).map(tabKey => (<button key={tabKey} onClick={() => setSelectedTyTab(tabKey)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedTyTab === tabKey ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{tyTabsData[tabKey].label}</button>))}</div>{renderBrowserMockup(renderTyContent(selectedTyTab || ''), true)}</div></div>
                        </div>
                    </div>

                    <div id="web-system-anchor" className="max-w-4xl mx-auto w-full pt-10">
                        {loadingLocal ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                        ) : linkedPages.length > 0 ? (
                            <div className="bg-[#0B0B0B] border border-emerald-500/20 rounded-[3rem] p-10 shadow-xl flex flex-col items-center text-center animate-in zoom-in-95">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                                <h3 className="text-3xl font-black text-white mb-10">¡Página generada correctamente!</h3>
                                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                    <a href={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-black font-black py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3">Ver Página</a>
                                    <button onClick={() => onEditPage(linkedPages[0].id)} className="flex-1 bg-[#FF5A1F] text-white font-black py-4 px-6 rounded-2xl shadow-xl">Editar Diseño</button>
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
        </>
    );
};