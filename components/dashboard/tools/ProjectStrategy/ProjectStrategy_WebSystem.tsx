import React, { useState, useEffect } from 'react';
import { Globe, Check, Layout, CheckCircle2, Wand2, Sparkles, AlertTriangle, ArrowRight, PenTool, ExternalLink, X, Plus, Lock, Smartphone, Monitor, MessageCircle, BookOpen, Zap, ArrowDown, XCircle, Crown, Loader2, Settings, PlayCircle, Gift, Download, ChevronDown, ChevronUp, Save, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingPage, PlanLimits, Plan, Project } from '../../../../types';
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
    userRole?: string;
    onUpgrade?: () => void;
    nextPlan?: Plan | null;
    isSimulating?: boolean;
}

export const ProjectStrategy_WebSystem: React.FC<ProjectStrategy_WebSystemProps> = ({ 
    projectId, lpTabsData, tyTabsData,
    selectedLpTab, setSelectedLpTab, selectedTyTab, setSelectedTyTab, onEditPage,
    pageCount = 0, planLimits, userRole, isSimulating = false, onUpgrade
}) => {
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [domainCount, setDomainCount] = useState(0);
    const [strategy, setStrategy] = useState<ProjectMasterStrategy | null>(null);
    const [projectData, setProjectData] = useState<Project | null>(null);
    
    // Estado para el control de acordeón en el modal de dominios
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

    // Estados para edición en línea
    const [draftLpTabsData, setDraftLpTabsData] = useState<any>(null);
    const [draftTyTabsData, setDraftTyTabsData] = useState<any>(null);
    const [draftStrategy, setDraftStrategy] = useState<ProjectMasterStrategy | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (lpTabsData) setDraftLpTabsData(lpTabsData);
        if (tyTabsData) setDraftTyTabsData(tyTabsData);
    }, [lpTabsData, tyTabsData]);

    useEffect(() => {
        if (strategy) setDraftStrategy(strategy);
    }, [strategy]);

    const performAutoSave = async (updatedLp?: any, updatedTy?: any, updatedStrat?: any) => {
        if (!projectId) return;
        const stratToUse = updatedStrat || draftStrategy;
        if (!stratToUse) return;

        setIsSaving(true);
        try {
            const lpToUse = updatedLp || draftLpTabsData;
            const tyToUse = updatedTy || draftTyTabsData;

            const updatedStrategy = {
                ...stratToUse,
                modules: {
                    ...(stratToUse.modules || {}),
                    web: {
                        ...(stratToUse.modules?.web || {}),
                        landingPageTabs: lpToUse,
                        thankYouPageTabs: tyToUse
                    }
                }
            };
            await api.updateProject(projectId, { strategy_json: updatedStrategy } as any);
            setStrategy(updatedStrategy as any);
        } catch (e) {
            console.error("Error al guardar automáticamente:", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateLpDraft = (tab: string, field: string, value: string) => {
        const updated = {
            ...draftLpTabsData,
            [tab]: {
                ...draftLpTabsData[tab],
                [field]: value
            }
        };
        setDraftLpTabsData(updated);
        performAutoSave(updated, draftTyTabsData, draftStrategy);
    };

    const handleUpdateTyDraft = (tab: string, field: string, value: string) => {
        const updated = {
            ...draftTyTabsData,
            [tab]: {
                ...draftTyTabsData[tab],
                content: {
                    ...draftTyTabsData[tab].content,
                    [field]: value
                }
            }
        };
        setDraftTyTabsData(updated);
        performAutoSave(draftLpTabsData, updated, draftStrategy);
    };

    const handleUpdateStrategyDraft = (section: 'pains' | 'solutions', index: number, value: string, subfield?: 'title' | 'description') => {
        if (!draftStrategy) return;
        const updatedPsychology = { ...draftStrategy.psychology };
        const updatedList = [...updatedPsychology[section]];
        
        if (subfield) {
            updatedList[index] = { ...(updatedList[index] as any), [subfield]: value };
        } else {
            updatedList[index] = value;
        }
        
        updatedPsychology[section] = updatedList;
        const updatedStrat = { ...draftStrategy, psychology: updatedPsychology };
        setDraftStrategy(updatedStrat);
        performAutoSave(draftLpTabsData, draftTyTabsData, updatedStrat);
    };

    const EditableField = ({ value, onSave, multiline = false, className = "" }: { value: string, onSave: (val: string) => void, multiline?: boolean, className?: string }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [localValue, setLocalValue] = useState(value);

        useEffect(() => {
            setLocalValue(value);
        }, [value]);

        if (isEditing) {
            return (
                <div className="relative w-full group/edit">
                    {multiline ? (
                        <textarea
                            autoFocus
                            className={`w-full p-2 bg-white border-2 border-primary rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={() => {
                                setIsEditing(false);
                                if (localValue !== value) onSave(localValue);
                            }}
                        />
                    ) : (
                        <input
                            autoFocus
                            className={`w-full p-2 bg-white border-2 border-primary rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
                            value={localValue}
                            onChange={(e) => setLocalValue(e.target.value)}
                            onBlur={() => {
                                setIsEditing(false);
                                if (localValue !== value) onSave(localValue);
                            }}
                        />
                    )}
                    <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full shadow-lg">
                        <Check className="w-3 h-3" />
                    </div>
                </div>
            );
        }

        return (
            <div 
                onClick={() => setIsEditing(true)}
                className={`group/field cursor-pointer relative hover:bg-primary/5 p-1 rounded-lg transition-colors border border-transparent hover:border-primary/20 ${className}`}
            >
                {value}
                <div className="absolute top-0 right-0 opacity-0 group-hover/field:opacity-100 transition-opacity p-1">
                    <PenTool className="w-3 h-3 text-primary" />
                </div>
            </div>
        );
    };

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
                const [pages, strategyData, project] = await Promise.all([
                    api.getPages(),
                    api.getProjectStrategy(projectId),
                    api.getProjectById(projectId)
                ]);
                const projectPages = pages.filter(p => String(p.projectId) === String(projectId));
                setLinkedPages(projectPages);
                setDomainCount(pages.filter(p => !!p.customDomain).length);
                setStrategy(strategyData);
                setProjectData(project);
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
            await api.createPage(page, projectData || undefined);
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

    const isRealAdmin = (planLimits?.planName === 'admin' || userRole === 'admin') && !isSimulating;
    const maxLandings = planLimits?.maxLandings || 3;
    const maxDomains = planLimits?.maxDomains || 1;
    const usagePercent = Math.min(100, (pageCount / maxLandings) * 100);
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    const domainUsagePercent = Math.min(100, (domainCount / maxDomains) * 100);
    let domainProgressColor = "bg-blue-500";
    if (domainUsagePercent > 50) domainProgressColor = "bg-indigo-500";
    if (domainUsagePercent > 90) domainProgressColor = isRealAdmin ? "bg-blue-500" : "bg-red-500";

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
            const data = draftLpTabsData?.hero;
            if (!data) return null;
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">Lead Magnet Activo</div>
                        <h4 className="text-gray-900 font-black text-3xl leading-tight">
                            <EditableField value={data.h1} onSave={(val) => handleUpdateLpDraft('hero', 'h1', val)} multiline />
                        </h4>
                        <div className="text-gray-600 text-lg leading-relaxed">
                            <EditableField value={data.h2} onSave={(val) => handleUpdateLpDraft('hero', 'h2', val)} multiline />
                        </div>
                        <div className="h-14 w-full bg-primary rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg">RESERVAR MI CUPO</div>
                    </div>
                </div>
            );
        }

        if (tabKey === 'pain') {
            const items = draftStrategy?.psychology?.pains || [];
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-4">
                        <h4 className="text-gray-900 font-black text-2xl mb-6">¿Te sientes identificada?</h4>
                        <div className="space-y-3">
                            {items.map((item: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start p-4 bg-red-50 rounded-2xl border border-red-100">
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <div className="flex-1 text-gray-800 text-base leading-snug font-medium">
                                        <EditableField value={item} onSave={(val) => handleUpdateStrategyDraft('pains', i, val)} multiline />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (tabKey === 'benefits') {
            const items = draftStrategy?.psychology?.solutions || [];
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
                                        <div className="flex-1">
                                            <div className="text-gray-900 font-bold text-base leading-tight">
                                                <EditableField value={title} onSave={(val) => handleUpdateStrategyDraft('solutions', i, val, 'title')} />
                                            </div>
                                            {description && (
                                                <div className="text-gray-600 text-sm mt-1">
                                                    <EditableField value={description} onSave={(val) => handleUpdateStrategyDraft('solutions', i, val, 'description')} multiline />
                                                </div>
                                            )}
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
        if (!draftTyTabsData) return null;
        const data = draftTyTabsData[tabKey];
        if (!data) return null;
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {data.type === 'header' && (
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/30">
                            <Check className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-black text-3xl mb-4 leading-tight">
                            <EditableField value={data.content?.h1} onSave={(val) => handleUpdateTyDraft(tabKey, 'h1', val)} multiline />
                        </h4>
                        <div className="text-gray-400 text-lg">
                            <EditableField value={data.content?.h2} onSave={(val) => handleUpdateTyDraft(tabKey, 'h2', val)} multiline />
                        </div>
                    </div>
                )}
                {data.type === 'action' && (
                    <div className="text-center">
                        <div className="w-full h-2.5 bg-gray-800 rounded-full mb-10 overflow-hidden shadow-inner">
                            <div className="w-[85%] h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"></div>
                        </div>
                        <h4 className="text-white font-black text-2xl mb-6">
                            <EditableField value={data.content?.h1} onSave={(val) => handleUpdateTyDraft(tabKey, 'h1', val)} multiline />
                        </h4>
                        <button className="w-full py-5 bg-[#25D366] rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl shadow-xl shadow-green-900/40">UNIRME AL GRUPO VIP</button>
                    </div>
                )}
                {data.type === 'magnet' && (
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/30">
                            <Gift className="w-10 h-10 text-primary" />
                        </div>
                        <h4 className="text-white font-black text-2xl mb-4 leading-tight">
                            <EditableField value={data.content?.h1} onSave={(val) => handleUpdateTyDraft(tabKey, 'h1', val)} multiline />
                        </h4>
                        <div className="text-gray-400 text-lg mb-8">
                            <EditableField value={data.content?.h2} onSave={(val) => handleUpdateTyDraft(tabKey, 'h2', val)} multiline />
                        </div>
                        <div className="w-full py-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center gap-2 text-gray-300 font-bold">
                            <Download className="w-5 h-5" /> DESCARGAR AHORA
                        </div>
                    </div>
                )}
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-24 pb-24 bg-gradient-to-b from-[#050b18] via-[#02040a] to-black min-h-screen">
                
                {/* Div agrupador para encabezado y video (seccion_encabezado) */}
                <div className="seccion_encabezado space-y-12">
                    {/* --- HEADER SECCIÓN --- */}
                    <div className="relative pt-16 flex flex-col items-center text-center space-y-8">
                        {/* Degradado superior sutil */}
                        <div className="absolute inset-x-0 -top-24 h-[600px] bg-blue-600/10 blur-[140px] -z-10 rounded-full" />
                        
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            <Monitor className="w-4 h-4" /> Crea tu Página Web Profesional en Minutos
                        </div>
                        
                        <div className="space-y-4 px-4">
                            <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none text-center max-w-5xl mx-auto">
                                Activa tu Página Web Profesional<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> y captura clientes en automático</span>
                            </h3>
                            <p className="pt-[1.3em] text-white max-w-[51rem] font-['Verdana'] text-[1.3rem] leading-[2rem] mx-auto font-normal">
                                Imagina que pudieses crear tu propia página web profesional que capture clientes interesados todos los días. Hoy es ese día, nuestra Inteligencia Artificial creará por ti tu propia página web personalizada (Landing Page) en minutos.
                            </p>
                        </div>
                    </div>

                    {/* --- VIDEO EXPLICATIVO --- */}
                    <div className="max-w-4xl mx-auto w-full px-4 space-y-8 text-center pt-8">
                        <div className="inline-flex items-center gap-3 text-blue-300 font-extrabold uppercase tracking-widest text-sm bg-blue-500/5 px-8 py-4 rounded-2xl border border-blue-500/10 backdrop-blur-sm mx-auto">
                            <Play className="w-4 h-4 fill-current" /> 🎥 ¿Dudas de cómo hacerlo? Mira este video de 2 minutos
                        </div>
                        
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-[2.5rem] blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
                            
                            <div className="relative aspect-video bg-[#02040a] rounded-[2.5rem] overflow-hidden border border-blue-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/WUqaWRJG92c?rel=0&controls=1&showinfo=0" 
                                    title="Video Tutorial Web System" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
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
                                        <h4 className="text-2xl font-black text-white flex items-center gap-3">
                                            Página de Captura
                                            {isSaving && (
                                                <span className="flex items-center gap-2 text-blue-400 text-xs font-medium animate-pulse">
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    Guardando...
                                                </span>
                                            )}
                                        </h4>
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
                                        <h5 className="font-bold text-[#FF5A1F] text-xl">Estructura de tu Página Web</h5>
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
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="text-2xl font-black text-white flex items-center gap-3">
                                    Página de Gracias
                                    {isSaving && (
                                        <span className="flex items-center gap-2 text-emerald-400 text-xs font-medium animate-pulse">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Guardando...
                                        </span>
                                    )}
                                </h4>
                            </div>
                            <div className="bg-gray-900/60 backdrop-blur-md rounded-[3rem] border border-gray-800 p-8 flex flex-col h-full shadow-2xl relative">
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-[#FF5A1F] text-xl">Estructura de tu Página de Gracias</h5>
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
                            <div className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] w-full max-w-[47rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center space-y-8 relative overflow-hidden">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">¡Tu página de captura ha sido creada correctamente!</h3>
                                <p className="text-white text-lg font-medium leading-relaxed max-w-2xl">Ya tienes tu página web lista y configurada para atraer y capturar audiencia interesada en el producto digital que deseas promocionar. <br /><br />usa los siguientes botones para visualizar y finalizar la configuración de tu página de captura.</p>
                                
                                <div className="w-full space-y-4">
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
                                            className="flex-1 bg-[#FF5A1F] text-white font-black py-4 px-10 rounded-2xl shadow-xl transform hover:scale-[1.03] transition-all flex items-center justify-center gap-3"
                                        >
                                            <PenTool className="w-5 h-5" /> Editar Página de Captura
                                        </a>
                                        <button 
                                            onClick={() => setShowDomainModal(true)} 
                                            className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition border shadow-xl transform hover:scale-[1.03] ${
                                                linkedPages[0].customDomain 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-white" 
                                                : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white"
                                            }`}
                                        >
                                            {linkedPages[0].customDomain ? <CheckCircle2 className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                            {linkedPages[0].customDomain ? "Ver Dominio" : "Asignar Dominio"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setShowConfirmModal(true)} className="w-full py-6 rounded-[2.5rem] bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl shadow-xl flex items-center justify-center gap-4">Crear Página Web de Captura</button>
                        )}
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div 
                    onClick={() => setShowConfirmModal(false)}
                    className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in" 
                >
                    <div className="bg-[#0B0B0B] border border-blue-500/20 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <div className="p-8 md:p-10 space-y-8 flex-1 text-center">
                            <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-lg animate-pulse">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">Confirmar Consumo de Créditos</h3>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                {(!isRealAdmin && pageCount >= maxLandings) 
                                    ? "Has alcanzado el límite de páginas de tu plan actual. Actualiza tu plan para continuar."
                                    : "Al crear una nueva página web de captura se consumirá 1 crédito de tu plan actual."}
                            </p>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] shadow-inner text-left space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Páginas Web Creadas</span>
                                        <span className="text-white font-mono font-bold text-sm">{pageCount} / {isRealAdmin ? '∞' : maxLandings}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <div className={`h-full ${progressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]`} style={{ width: `${isRealAdmin ? (pageCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Dominios Personalizados</span>
                                        <span className="text-white font-mono font-bold text-sm">{domainCount} / {isRealAdmin ? '∞' : maxDomains}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <div className={`h-full ${domainProgressColor} rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]`} style={{ width: `${isRealAdmin ? (domainCount > 0 ? 100 : 0) : domainUsagePercent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4 shrink-0">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest transition-all">No, cancelar</button>
                            {(!isRealAdmin && pageCount >= maxLandings) ? (
                                <button onClick={() => { setShowConfirmModal(false); onUpgrade?.(); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Actualizar Plan</button>
                            ) : (
                                <button onClick={() => { setShowConfirmModal(false); setShowGeneratorModal(true); }} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-[10px] uppercase shadow-xl transform hover:scale-105 transition-all">Confirmar y Generar</button>
                            )}
                        </div>
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
                                    src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
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
                                    className="w-full flex items-center justify-between p-5 bg-gray-850 hover:bg-gray-800 transition text-left"
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
                                    className="w-full flex items-center justify-between p-5 bg-gray-850 hover:bg-gray-800 transition text-left"
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
                                    className="w-full flex items-center justify-between p-5 bg-gray-850 hover:bg-gray-800 transition text-left"
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