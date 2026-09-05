import React, { useState, useEffect } from 'react';
import { Globe, Check, Layout, CheckCircle2, Wand2, Sparkles, AlertTriangle, ArrowRight, PenTool, ExternalLink, X, Plus, Lock, Smartphone, Monitor, MessageCircle, BookOpen, Zap, ArrowDown, XCircle, Crown, Loader2, Settings, PlayCircle, Gift, Download, ChevronDown, ChevronUp, Save, Play, Copy, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LandingPage, PlanLimits, Plan, Project } from '../../../../types';
import { Generator } from '../Generator';
import { api } from '../../../../services/api';
import { UpgradeModal } from '../../UpgradeModal';
import { ProjectMasterStrategy } from '../../../../services/strategySchema';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

interface ProjectStrategy_WebSystemProps {
    projectId?: string;
    lpTabsData?: any;
    tyTabsData?: any;
    selectedLpTab?: string | null;
    setSelectedLpTab?: (tab: string | null) => void;
    selectedTyTab?: string | null;
    setSelectedTyTab?: (tab: string | null) => void;
    handleTooltipHover?: (e: React.MouseEvent, content: string[]) => void;
    handleTooltipLeave?: () => void;
    onEditPage?: (id: string) => void;
    pageCount?: number;
    planLimits?: PlanLimits;
    userRole?: string;
    onUpgrade?: () => void;
    nextPlan?: Plan | null;
    isSimulating?: boolean;
    totalSteps?: number;
}

export const ProjectStrategy_WebSystem: React.FC<ProjectStrategy_WebSystemProps> = ({ 
    projectId: propProjectId, lpTabsData, tyTabsData,
    selectedLpTab: propSelectedLpTab, setSelectedLpTab: propSetSelectedLpTab, selectedTyTab: propSelectedTyTab, setSelectedTyTab: propSetSelectedTyTab, onEditPage,
    pageCount = 0, planLimits, userRole, isSimulating = false, onUpgrade, totalSteps
}) => {
    const params = useParams() as { id: string };
    const projectId = propProjectId || params?.id || '';
    const navigate = useNavigate();

    const [localLpTab, setLocalLpTab] = useState<string | null>('hero');
    const [localTyTab, setLocalTyTab] = useState<string | null>(null);

    const selectedLpTab = propSelectedLpTab !== undefined ? propSelectedLpTab : localLpTab;
    const setSelectedLpTab = propSetSelectedLpTab || setLocalLpTab;
    const selectedTyTab = propSelectedTyTab !== undefined ? propSelectedTyTab : localTyTab;
    const setSelectedTyTab = propSetSelectedTyTab || setLocalTyTab;

    const handleEditPage = onEditPage || ((pid: string) => navigate(`/dashboard/editor/${pid}`));
    const [showPagesModal, setShowPagesModal] = useState(false);
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [loadingLocal, setLoadingLocal] = useState(false);
    const [domainCount, setDomainCount] = useState(0);
    const [strategy, setStrategy] = useState<ProjectMasterStrategy | null>(null);
    const [projectData, setProjectData] = useState<Project | null>(null);

    // Estados para Lead Magnet de invitación en página de gracias
    const [selectedLeadMagnetIndex, setSelectedLeadMagnetIndex] = useState<number>(0);
    const [isSavingLeadMagnet, setIsSavingLeadMagnet] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const [masterProjectData, setMasterProjectData] = useState<Project | null>(null);

    // Obtener los lead magnets disponibles del proyecto o de su Proyecto Maestro
    const multimedia = typeof projectData?.multimedia_json === 'string'
        ? (() => { try { return JSON.parse(projectData.multimedia_json); } catch { return {}; } })()
        : (projectData?.multimedia_json || {});

    const masterMultimedia = typeof masterProjectData?.multimedia_json === 'string'
        ? (() => { try { return JSON.parse(masterProjectData.multimedia_json); } catch { return {}; } })()
        : (masterProjectData?.multimedia_json || {});

    const projectLMs: { name: string; url: string; imageUrl?: string; description?: string; fromMaster?: boolean }[] =
        Array.isArray(multimedia?.leadMagnets) && multimedia.leadMagnets.length > 0
            ? multimedia.leadMagnets
            : (projectData?.leadMagnetUrl ? [{ name: 'Lead Magnet Principal', url: projectData.leadMagnetUrl }] : []);

    const masterLMs: { name: string; url: string; imageUrl?: string; description?: string; fromMaster?: boolean }[] =
        Array.isArray(masterMultimedia?.leadMagnets) && masterMultimedia.leadMagnets.length > 0
            ? masterMultimedia.leadMagnets.map((lm: any) => ({ ...lm, fromMaster: true }))
            : (masterProjectData?.leadMagnetUrl ? [{ name: 'Lead Magnet Maestro', url: masterProjectData.leadMagnetUrl, fromMaster: true }] : []);

    // Si el proyecto actual tiene lead magnets propios se usan; de lo contrario o combinados, se heredan del maestro
    const availableLeadMagnets: { name: string; url: string; imageUrl?: string; description?: string; fromMaster?: boolean }[] = (() => {
        if (projectLMs.length > 0 && masterLMs.length > 0) {
            const seen = new Set(projectLMs.map(lm => lm.url));
            const merged = [...projectLMs];
            masterLMs.forEach(lm => {
                if (!seen.has(lm.url)) {
                    merged.push(lm);
                }
            });
            return merged;
        }
        if (projectLMs.length > 0) return projectLMs;
        return masterLMs;
    })();

    const isRealAdmin = (planLimits?.planName === 'admin' || userRole === 'admin') && !isSimulating;
    const isPro = isRealAdmin || (planLimits?.planName !== 'starter' && planLimits?.planName !== 'free' && (!projectData?.planSlug || projectData?.planSlug !== 'starter'));

    // Sincronizar selección inicial de lead magnet con la configuración guardada de la página de gracias
    useEffect(() => {
        if (availableLeadMagnets.length > 0) {
            if (linkedPages.length > 0) {
                const ty = linkedPages[0].content?.thankYouPage;
                if (ty?.leadMagnetUrl) {
                    const foundIdx = availableLeadMagnets.findIndex(lm => lm.url === ty.leadMagnetUrl);
                    if (foundIdx !== -1) {
                        setSelectedLeadMagnetIndex(foundIdx);
                        return;
                    }
                }
                if (ty?.leadMagnetName) {
                    const foundIdx = availableLeadMagnets.findIndex(lm => lm.name === ty.leadMagnetName);
                    if (foundIdx !== -1) {
                        setSelectedLeadMagnetIndex(foundIdx);
                        return;
                    }
                }
            }

            // Si es usuario básico y hay más de 1 lead magnet, asignar uno aleatorio y persistirlo
            if (!isPro && availableLeadMagnets.length > 1) {
                const storageKey = `assigned_lm_${projectId}`;
                const savedIndexStr = localStorage.getItem(storageKey);
                if (savedIndexStr !== null && Number(savedIndexStr) < availableLeadMagnets.length) {
                    setSelectedLeadMagnetIndex(Number(savedIndexStr));
                } else {
                    const randIdx = Math.floor(Math.random() * availableLeadMagnets.length);
                    setSelectedLeadMagnetIndex(randIdx);
                    localStorage.setItem(storageKey, String(randIdx));
                }
            }
        }
    }, [linkedPages, availableLeadMagnets.length, isPro, projectId]);

    const handleSelectLeadMagnet = async (index: number) => {
        if (!isPro && index !== selectedLeadMagnetIndex && availableLeadMagnets.length > 1) {
            onUpgrade?.();
            return;
        }

        setSelectedLeadMagnetIndex(index);
        const chosen = availableLeadMagnets[index];
        if (!chosen) return;

        if (linkedPages.length > 0) {
            setIsSavingLeadMagnet(true);
            try {
                const currentPage = linkedPages[0];
                const updatedThankYou = {
                    ...(currentPage.content?.thankYouPage || {}),
                    leadMagnetName: chosen.name,
                    leadMagnetUrl: chosen.url,
                    leadMagnetImageUrl: chosen.imageUrl || '',
                    leadMagnetDescription: chosen.description || '',
                    bookTitle: chosen.name.toUpperCase(),
                    bookSubtitle: "Guía práctica en PDF descargable"
                };
                const updatedPage: LandingPage = {
                    ...currentPage,
                    content: {
                        ...currentPage.content,
                        thankYouPage: updatedThankYou
                    }
                };
                await api.updatePage(updatedPage);
                setLinkedPages(prev => prev.map((p, i) => i === 0 ? updatedPage : p));
                setIframeKey(k => k + 1);
            } catch (err) {
                console.error("Error al actualizar lead magnet de la página de gracias:", err);
            } finally {
                setIsSavingLeadMagnet(false);
            }
        }
    };
    
    // Estado para el control de acordeón en el modal de dominios
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

    // Estados para copiar URLs
    const [copiedLpUrl, setCopiedLpUrl] = useState(false);
    const [copiedTyUrl, setCopiedTyUrl] = useState(false);

    const handleCopyLpUrl = () => {
        const subdomain = linkedPages.length > 0 ? linkedPages[0].subdomain.split('.')[0] : 'microblading-demo';
        const url = `aprende.marketing/admin/lp/${subdomain}`;
        navigator.clipboard.writeText(`https://${url}`);
        setCopiedLpUrl(true);
        setTimeout(() => setCopiedLpUrl(false), 2000);
    };

    const handleCopyTyUrl = () => {
        const subdomain = linkedPages.length > 0 ? linkedPages[0].subdomain.split('.')[0] : 'microblading-demo';
        const url = `aprende.marketing/admin/lp/${subdomain}/gracias`;
        navigator.clipboard.writeText(`https://${url}`);
        setCopiedTyUrl(true);
        setTimeout(() => setCopiedTyUrl(false), 2000);
    };

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

    const handleUpdateStrategyDraft = (section: 'pains' | 'solutions', index: number, value: string, subfield?: 'text' | 'title' | 'description') => {
        if (!draftStrategy) return;
        const updatedPsychology = { ...draftStrategy.psychology };
        const updatedList = [...(updatedPsychology[section] as any[])];
        
        if (subfield) {
            updatedList[index] = { ...updatedList[index], [subfield]: value };
        } else if (section === 'pains') {
            updatedList[index] = { ...updatedList[index], text: value };
        } else {
            updatedList[index] = { ...updatedList[index], title: value };
        }
        
        (updatedPsychology as any)[section] = updatedList;
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

                if (project?.masterParentId) {
                    try {
                        const master = await api.getProjectById(project.masterParentId);
                        if (master) setMasterProjectData(master);
                    } catch (err) {
                        console.warn("No se pudo cargar el proyecto maestro para lead magnets:", err);
                    }
                }
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
                            {items.map((item: any, i: number) => {
                                const painText = typeof item === 'string' ? item : item.text;
                                return (
                                    <div key={i} className="flex gap-4 items-start p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                        <div className="flex-1 text-gray-800 text-base leading-snug font-medium">
                                            <EditableField value={painText} onSave={(val) => handleUpdateStrategyDraft('pains', i, val)} multiline />
                                        </div>
                                    </div>
                                );
                            })}
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

    const renderTyContent = () => {
        if (!draftTyTabsData) return null;
        
        // Unificar contenido de la página de gracias
        const headerData = draftTyTabsData['confirmacion'] || draftTyTabsData[Object.keys(draftTyTabsData)[0]];
        const actionData = draftTyTabsData['siguiente'] || draftTyTabsData[Object.keys(draftTyTabsData)[1]];
        const magnetData = draftTyTabsData['magnet'] || draftTyTabsData[Object.keys(draftTyTabsData)[2]];

        return (
            <div className="space-y-12 animate-in fade-in duration-500">
                {/* Confirmación */}
                {headerData && (
                    <div className="text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-emerald-500/30">
                            <Check className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-black text-2xl mb-3 leading-tight">
                            <EditableField value={headerData.content?.h1} onSave={(val) => handleUpdateTyDraft('confirmacion', 'h1', val)} multiline />
                        </h4>
                        <div className="text-gray-400 text-base">
                            <EditableField value={headerData.content?.h2} onSave={(val) => handleUpdateTyDraft('confirmacion', 'h2', val)} multiline />
                        </div>
                    </div>
                )}

                {/* Siguiente Paso */}
                {actionData && (
                    <div className="text-center bg-white/5 p-6 rounded-3xl border border-white/10">
                        <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden shadow-inner">
                            <div className="w-[85%] h-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"></div>
                        </div>
                        <h4 className="text-white font-black text-xl mb-6">
                            <EditableField value={actionData.content?.h1} onSave={(val) => handleUpdateTyDraft('siguiente', 'h1', val)} multiline />
                        </h4>
                        <button className="w-full py-4 bg-[#25D366] rounded-2xl flex items-center justify-center gap-3 text-white font-black text-lg shadow-xl shadow-green-900/40">
                            <MessageCircle className="w-5 h-5" /> UNIRME AL GRUPO VIP
                        </button>
                    </div>
                )}

                {/* Lead Magnet */}
                {magnetData && (
                    <div className="text-center flex flex-col items-center bg-primary/5 p-6 rounded-3xl border border-primary/10">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
                            <Gift className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-white font-black text-xl mb-2 leading-tight">
                            <EditableField value={magnetData.content?.h1} onSave={(val) => handleUpdateTyDraft('magnet', 'h1', val)} multiline />
                        </h4>
                        <div className="text-gray-400 text-sm mb-6">
                            <EditableField value={magnetData.content?.h2} onSave={(val) => handleUpdateTyDraft('magnet', 'h2', val)} multiline />
                        </div>
                        <button className="w-full py-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center gap-2 text-gray-300 font-bold hover:bg-gray-700 transition-colors">
                            <Download className="w-5 h-5" /> DESCARGAR AHORA
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const lpTabs = [
        { key: 'hero', label: "Encabezado" }
    ];

    return (
        <>
            <div id="psd-websystem-section" className="space-y-6 text-left animate-in fade-in duration-500">
                {/* 1. HEADER CARD */}
                <StepHeaderCard
                    stepNumber={3}
                    totalSteps={totalSteps}
                    stageNumber={1}
                    categoryTitle="Mira tu Página de Captura"
                    title="Activa tu Página Web Profesional y captura clientes en automático"
                    description="Imagina que pudieses crear tu propia página web profesional que capture clientes interesados todos los días. Hoy es ese día, nuestra Inteligencia Artificial creará por ti tu propia página web personalizada (Landing Page) en minutos."
                />

                {/* 2. VIDEO TUTORIAL */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                    <StepVideoContainer 
                        stepNumber={3}
                        videoUrl="https://www.youtube.com/embed/WUqaWRJG92c?rel=0&controls=1&showinfo=0"
                        title="Video Tutorial Web System"
                    />
                </div>

                {/* 2.5. VISTA PREVIA DE TU PÁGINA DE CAPTURA (IMÁGENES 1 Y 2) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-left">
                    {/* Encabezado centrado */}
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
                        {linkedPages.length > 0 ? (
                            <>
                                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight italic">
                                    ¡TU PÁGINA DE CAPTURA HA SIDO CREADA CORRECTAMENTE!
                                </h3>
                                <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                                    Ya tienes tu página web lista y configurada para atraer y capturar audiencia interesada en el producto digital que deseas promocionar.
                                </p>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-16 h-16 text-[#FF5A1F]" />
                                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight italic">
                                    ¡CREA TU PÁGINA DE CAPTURA CON INTELIGENCIA ARTIFICIAL!
                                </h3>
                                <p className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                                    Nuestra IA generará una página web profesional, optimizada y lista para capturar clientes interesados en minutos.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Grid Principal (Iframe/Mockup + Sidebar) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Contenedor Navegador / Iframe de la Landing Page */}
                        <div className="lg:col-span-8 bg-[#0e1628] border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl">
                            
                            {/* Barra superior de pestañas del navegador */}
                            <div className="bg-[#080d18] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <div className="bg-[#040710] border border-slate-800/80 px-4 py-1 rounded-full text-[11px] text-slate-400 font-mono truncate max-w-xs">
                                    aprende.marketing/admin/lp/{linkedPages.length > 0 ? linkedPages[0].subdomain.split('.')[0] : 'microblading-demo'}
                                </div>
                                <div className="w-12"></div>
                            </div>

                            {/* Contenido de la Landing Page en vista previa */}
                            {linkedPages.length > 0 ? (
                                <iframe 
                                    src={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}`} 
                                    className="w-full h-[580px] border-0 bg-white"
                                    title="Vista previa página de captura"
                                />
                            ) : (
                                <div className="relative bg-[#0a0f1d] text-white overflow-hidden">
                                    {/* Header de la página */}
                                    <div className="px-5 sm:px-8 py-4 bg-[#080d1a]/90 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 flex items-center justify-center text-[#FF5A1F] font-black text-xs">
                                                M
                                            </div>
                                            <span className="font-extrabold text-white text-xs sm:text-sm tracking-widest uppercase">
                                                MICROBLADING DE CEJAS
                                            </span>
                                        </div>

                                        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-semibold">
                                            <span className="hover:text-white cursor-pointer transition">¿Qué aprenderás?</span>
                                            <span className="hover:text-white cursor-pointer transition">Beneficios</span>
                                            <span className="hover:text-white cursor-pointer transition">Testimonios</span>
                                        </div>

                                        <button className="bg-[#FF5A1F] hover:bg-[#e04e18] text-white text-[11px] sm:text-xs font-extrabold px-3.5 py-2 rounded-lg transition shadow-md">
                                            Accede a la clase gratis
                                        </button>
                                    </div>

                                    {/* Hero Banner con fondo e imagen */}
                                    <div className="relative p-6 sm:p-10 md:p-12 overflow-hidden bg-gradient-to-r from-black/95 via-black/85 to-slate-950/90">
                                        <img 
                                            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200" 
                                            alt="Microblading" 
                                            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay pointer-events-none"
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                                            <div className="md:col-span-7 text-left space-y-4">
                                                <span className="inline-block text-[#FF5A1F] font-extrabold text-xs tracking-widest uppercase bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-3 py-1 rounded-full">
                                                    CLASE GRATUITA
                                                </span>
                                                
                                                <h2 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl leading-snug tracking-tight">
                                                    Aprende Microblading de Cejas desde cero <span className="text-[#FF5A1F]">y transforma tu futuro</span>
                                                </h2>

                                                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium max-w-xl">
                                                    Descubre la técnica paso a paso y conviértete en una profesional altamente demandada.
                                                </p>

                                                <div className="space-y-2.5 pt-2 text-xs sm:text-sm font-semibold text-slate-200">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                        </div>
                                                        <span>Sin experiencia previa</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                        </div>
                                                        <span>Desde casa y a tu ritmo</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0">
                                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                        </div>
                                                        <span>Certificado incluido</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-5">
                                                <div className="bg-slate-50 text-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-3.5 text-center border border-white">
                                                    <h4 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                                                        Accede ahora a la clase gratuita
                                                    </h4>
                                                    <p className="text-slate-500 text-xs font-medium">
                                                        Completa tus datos y recibe el acceso inmediato.
                                                    </p>

                                                    <div className="space-y-2.5 pt-1">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Tu nombre" 
                                                            disabled 
                                                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 font-medium shadow-sm"
                                                        />
                                                        <input 
                                                            type="email" 
                                                            placeholder="Tu mejor correo" 
                                                            disabled 
                                                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 font-medium shadow-sm"
                                                        />
                                                    </div>

                                                    <button className="w-full bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-md transition">
                                                        Quiero mi clase gratuita
                                                    </button>

                                                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold pt-1">
                                                        <Lock className="w-3 h-3 text-slate-400" />
                                                        <span>Tus datos están 100% protegidos.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Barra Inferior de Métricas */}
                                    <div className="bg-white text-slate-900 px-6 sm:px-10 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-center border-t border-slate-200">
                                        <div className="sm:border-r sm:border-slate-200 pr-2 space-y-0.5">
                                            <div className="font-black text-lg sm:text-xl text-slate-900">+2.000</div>
                                            <div className="text-xs text-slate-500 font-semibold">Alumnos formados</div>
                                        </div>
                                        <div className="sm:border-r sm:border-slate-200 pr-2 space-y-0.5">
                                            <div className="font-black text-lg sm:text-xl text-slate-900">4.8/5</div>
                                            <div className="text-amber-400 text-xs tracking-widest my-0.5 font-bold">★★★★★</div>
                                            <div className="text-xs text-slate-500 font-semibold">Valoración promedio</div>
                                        </div>
                                        <div className="sm:border-r sm:border-slate-200 pr-2 space-y-0.5">
                                            <div className="font-black text-lg sm:text-xl text-slate-900">100%</div>
                                            <div className="text-xs text-slate-500 font-semibold">Online y a tu ritmo</div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="font-black text-lg sm:text-xl text-slate-900">Certificado</div>
                                            <div className="text-xs text-slate-500 font-semibold">Incluido</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Derecha: URL & Acciones + Rendimiento + Personaliza con PRO */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* Tarjeta 1: URL & Botones de Acción */}
                            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 space-y-4 text-left shadow-lg">
                                {linkedPages.length > 0 ? (
                                    <>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            URL DE TU PÁGINA DE CAPTURA
                                        </h4>

                                        {/* Campo de URL con botón copiar */}
                                        <div className="flex items-center bg-[#080d18] border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono gap-2 min-w-0">
                                            <span className="truncate flex-1 select-all">
                                                aprende.marketing/admin/lp/{linkedPages[0].subdomain.split('.')[0]}
                                            </span>
                                            <button 
                                                onClick={handleCopyLpUrl} 
                                                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition shrink-0 cursor-pointer"
                                                title="Copiar enlace"
                                            >
                                                {copiedLpUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Botones de Acción */}
                                        <div className="space-y-3 pt-1">
                                            <a 
                                                href={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full bg-[#00D084] hover:bg-[#00B874] text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer"
                                            >
                                                <span>ABRIR PÁGINA</span>
                                                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                                            </a>

                                            <button 
                                                onClick={() => {
                                                    const url = window.location.hash.startsWith('#/') ? `#/dashboard/editor/${linkedPages[0].id}` : `/dashboard/editor/${linkedPages[0].id}`;
                                                    window.open(url, '_blank');
                                                }}
                                                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/10 cursor-pointer transform hover:scale-[1.01] active:scale-95"
                                            >
                                                <span>EDITAR PÁGINA</span>
                                                <Wand2 className="w-4 h-4 stroke-[2.5]" />
                                            </button>

                                            {!linkedPages[0].customDomain && (
                                                <button 
                                                    onClick={() => setShowDomainModal(true)}
                                                    className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 cursor-pointer transform hover:scale-[1.01] active:scale-95"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    <span>ASIGNAR DOMINIO</span>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            ACCIÓN REQUERIDA
                                        </h4>
                                        <p className="text-xs text-slate-300">
                                            Aún no has generado tu página de captura para este proyecto.
                                        </p>
                                        <button 
                                            onClick={() => setShowConfirmModal(true)}
                                            className="w-full bg-gradient-to-r from-[#FF5A1F] to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer mt-2"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            <span>GENERAR PÁGINA AHORA</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Rendimiento */}
                            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">
                                    RENDIMIENTO
                                </h4>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-[#080d18] p-3 rounded-xl border border-slate-800/80">
                                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">VISITAS</div>
                                        <div className="text-lg font-black text-white mt-1">{linkedPages.length > 0 ? (linkedPages[0].visits || 0) : 0}</div>
                                    </div>
                                    <div className="bg-[#080d18] p-3 rounded-xl border border-slate-800/80">
                                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">REGISTROS</div>
                                        <div className="text-lg font-black text-white mt-1">{linkedPages.length > 0 ? (linkedPages[0].conversions || 0) : 0}</div>
                                    </div>
                                    <div className="bg-[#080d18] p-3 rounded-xl border border-slate-800/80">
                                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">CONVERSIÓN</div>
                                        <div className="text-lg font-black text-white mt-1">
                                            {linkedPages.length > 0 && linkedPages[0].visits > 0 
                                                ? (((linkedPages[0].conversions || 0) / linkedPages[0].visits) * 100).toFixed(2).replace('.', ',') + "%" 
                                                : "0,00%"}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-xs text-left leading-relaxed">
                                    Comparte el enlace o publica tu primer reel para comenzar a recibir actividad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicador de Flujo: Botón verde con flecha hacia abajo entre Captación y Gracias */}
                <div className="flex justify-center py-2 my-1">
                    <div className="w-12 h-12 rounded-full bg-[#00c280] text-slate-950 flex items-center justify-center shadow-lg shadow-[#00c280]/20 hover:scale-105 transition-transform">
                        <ArrowDown className="w-6 h-6 stroke-[3]" />
                    </div>
                </div>

                {/* 2.6. VISTA PREVIA DE TU PÁGINA DE GRACIAS */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-left">
                    {/* Encabezado descriptivo */}
                    <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Vista previa de tu página de gracias
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm font-medium">
                            Esta es la página de agradecimiento que se muestra inmediatamente después de que el usuario se registre.
                        </p>
                    </div>

                    {/* Grid de 2 columnas (Iframe/Mockup 8 cols + Sidebar 4 cols) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Contenedor Navegador / Iframe de la Página de Gracias */}
                        <div className="lg:col-span-8 bg-[#0e1628] border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="bg-[#080d18] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <div className="bg-[#040710] border border-slate-800/80 px-4 py-1 rounded-full text-[11px] text-slate-400 font-mono truncate max-w-xs">
                                    aprende.marketing/admin/lp/{linkedPages.length > 0 ? linkedPages[0].subdomain.split('.')[0] : 'microblading-demo'}/gracias
                                </div>
                                <div className="w-12"></div>
                            </div>

                            {linkedPages.length > 0 ? (
                                <iframe 
                                    key={iframeKey}
                                    src={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}/gracias`} 
                                    className="w-full h-[580px] border-0 bg-white"
                                    title="Vista previa página de gracias"
                                />
                            ) : (
                                <div className="relative bg-[#0a0f1d] text-white p-8 sm:p-12 min-h-[580px] flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
                                        <Check className="w-8 h-8 stroke-[3]" />
                                    </div>

                                    <div className="space-y-2 max-w-md">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                                            REGISTRO CONFIRMADO
                                        </span>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                            ¡Felicidades! Tu acceso ha sido reservado
                                        </h2>
                                        <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                                            Hemos enviado un correo con los detalles. Por favor realiza el siguiente paso obligatorio para asegurar tu cupo:
                                        </p>
                                    </div>

                                    <div className="w-full max-w-sm bg-[#0e182e] border border-emerald-500/30 rounded-2xl p-5 space-y-3.5 shadow-xl">
                                        <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                                            <Sparkles className="w-4 h-4" />
                                            <span>Paso Final Obligatorio</span>
                                        </div>
                                        <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition">
                                            <MessageCircle className="w-4.5 h-4.5 fill-current" />
                                            <span>UNIRME AL GRUPO VIP DE WHATSAPP</span>
                                        </button>
                                    </div>

                                    <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                                <Gift className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="text-xs font-bold text-white truncate">
                                                    {availableLeadMagnets[selectedLeadMagnetIndex]?.name || "Bono de Bienvenida"}
                                                </h5>
                                                <p className="text-[11px] text-slate-400">Guía práctica en PDF</p>
                                            </div>
                                        </div>
                                        {availableLeadMagnets[selectedLeadMagnetIndex]?.url ? (
                                            <a 
                                                href={availableLeadMagnets[selectedLeadMagnetIndex].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3 rounded-lg border border-slate-700 flex items-center gap-1.5 shrink-0 transition"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Descargar</span>
                                            </a>
                                        ) : (
                                            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3 rounded-lg border border-slate-700 flex items-center gap-1.5 shrink-0 transition">
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Descargar</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Derecha: URL & Acciones + Rendimiento + Personaliza con PRO */}
                        <div className="lg:col-span-4 space-y-5">
                            {/* Tarjeta 1: URL & Botones de Acción */}
                            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 space-y-4 text-left shadow-lg">
                                {linkedPages.length > 0 ? (
                                    <>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            URL DE TU PÁGINA DE GRACIAS
                                        </h4>

                                        {/* Campo de URL con botón copiar */}
                                        <div className="flex items-center bg-[#080d18] border border-slate-800/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono gap-2 min-w-0">
                                            <span className="truncate flex-1 select-all">
                                                aprende.marketing/admin/lp/{linkedPages[0].subdomain.split('.')[0]}/gracias
                                            </span>
                                            <button 
                                                onClick={handleCopyTyUrl} 
                                                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition shrink-0 cursor-pointer"
                                                title="Copiar enlace"
                                            >
                                                {copiedTyUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Botones de Acción */}
                                        <div className="space-y-3 pt-1">
                                            <a 
                                                href={`/admin/lp/${linkedPages[0].subdomain.split('.')[0]}/gracias`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full bg-[#00D084] hover:bg-[#00B874] text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer"
                                            >
                                                <span>ABRIR PÁGINA</span>
                                                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                                            </a>

                                            <button 
                                                onClick={() => {
                                                    const url = window.location.hash.startsWith('#/') ? `#/dashboard/editor/${linkedPages[0].id}` : `/dashboard/editor/${linkedPages[0].id}`;
                                                    window.open(url, '_blank');
                                                }}
                                                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/10 cursor-pointer transform hover:scale-[1.01] active:scale-95"
                                            >
                                                <span>EDITAR PÁGINA</span>
                                                <Wand2 className="w-4 h-4 stroke-[2.5]" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            ACCIÓN REQUERIDA
                                        </h4>
                                        <p className="text-xs text-slate-300">
                                            Aún no has generado tu página de gracias para este proyecto.
                                        </p>
                                        <button 
                                            onClick={() => setShowConfirmModal(true)}
                                            className="w-full bg-gradient-to-r from-[#FF5A1F] to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer mt-2"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            <span>GENERAR PÁGINA AHORA</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Rendimiento */}
                            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">
                                    RENDIMIENTO
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="bg-[#080d18] p-3.5 rounded-xl border border-slate-800/80">
                                        <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">VISITAS</div>
                                        <div className="text-xl font-black text-white mt-1">
                                            {linkedPages.length > 0 ? (linkedPages[0].conversions || linkedPages[0].visits || 0) : 0}
                                        </div>
                                    </div>
                                    <div className="bg-[#080d18] p-3.5 rounded-xl border border-slate-800/80">
                                        <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wide flex items-center justify-center gap-1">
                                            <MessageCircle className="w-3 h-3 text-emerald-400" />
                                            <span>CLIC WHATSAPP</span>
                                        </div>
                                        <div className="text-xl font-black text-white mt-1">
                                            {linkedPages.length > 0 ? ((linkedPages[0] as any).whatsapp_clicks ?? (linkedPages[0] as any).whatsappClicks ?? 0) : 0}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-xs text-left leading-relaxed">
                                    Contabiliza los usuarios que llegaron a la página de gracias y los que hicieron clic en el botón de WhatsApp.
                                </p>
                            </div>

                            {/* Lead Magnet de Invitación */}
                            <div className="bg-[#0e1628] border border-slate-800/90 rounded-2xl p-5 space-y-4 text-left shadow-lg">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Gift className="w-4 h-4 text-amber-400" />
                                        <span>LEADMAGNET DE INVITACIÓN</span>
                                    </h4>
                                    {isSavingLeadMagnet && (
                                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Guardando...
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Selecciona cuál de los Lead Magnets subidos al proyecto se mostrará y entregará a los usuarios en esta página de gracias.
                                </p>

                                {availableLeadMagnets.length > 0 ? (
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase">
                                                    Seleccionar Lead Magnet
                                                </label>
                                                {!isPro && availableLeadMagnets.length > 1 && (
                                                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                                        <Lock className="w-3 h-3" /> 1 de {availableLeadMagnets.length} Desbloqueado
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <select
                                                    value={selectedLeadMagnetIndex}
                                                    onChange={(e) => handleSelectLeadMagnet(Number(e.target.value))}
                                                    disabled={isSavingLeadMagnet}
                                                    className="w-full bg-[#080d18] border border-slate-700 hover:border-slate-600 text-white rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-500 appearance-none cursor-pointer pr-9 transition"
                                                >
                                                    {availableLeadMagnets.map((lm, idx) => {
                                                        const isLocked = !isPro && idx !== selectedLeadMagnetIndex && availableLeadMagnets.length > 1;
                                                        return (
                                                            <option key={idx} value={idx} className="bg-slate-900 text-white py-2">
                                                                {`Leadmagnet ${idx + 1}: ${lm.name || 'Sin título'}${lm.fromMaster ? ' (Proyecto Maestro)' : ''}${isLocked ? ' [🔒 Plan PRO]' : ''}`}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Ficha informativa del Lead Magnet seleccionado con portada y descripción */}
                                        {availableLeadMagnets[selectedLeadMagnetIndex] && (
                                            <div className="bg-[#080d18] border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
                                                <div className="flex items-start justify-between gap-3">
                                                    {availableLeadMagnets[selectedLeadMagnetIndex].imageUrl ? (
                                                        <img 
                                                            src={availableLeadMagnets[selectedLeadMagnetIndex].imageUrl} 
                                                            alt="Portada Lead Magnet" 
                                                            className="w-12 h-16 object-cover rounded-lg border border-slate-700 shrink-0 bg-slate-900 shadow" 
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-16 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                                            <Gift className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
                                                                {`Leadmagnet ${selectedLeadMagnetIndex + 1}`}
                                                            </span>
                                                            {availableLeadMagnets[selectedLeadMagnetIndex].fromMaster && (
                                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 inline-block">
                                                                    Proyecto Maestro
                                                                </span>
                                                            )}
                                                            {!isPro && availableLeadMagnets.length > 1 && (
                                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-block">
                                                                    Asignado (Plan Básico)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h5 className="text-xs font-bold text-white line-clamp-1" title={availableLeadMagnets[selectedLeadMagnetIndex].name}>
                                                            {availableLeadMagnets[selectedLeadMagnetIndex].name || "Sin título"}
                                                        </h5>
                                                        {availableLeadMagnets[selectedLeadMagnetIndex].description && (
                                                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                                                                {availableLeadMagnets[selectedLeadMagnetIndex].description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {availableLeadMagnets[selectedLeadMagnetIndex].url && (
                                                        <a
                                                            href={availableLeadMagnets[selectedLeadMagnetIndex].url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition shrink-0 cursor-pointer"
                                                            title="Abrir / Descargar PDF"
                                                        >
                                                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                                                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                    <span className="truncate">Activo en la página de gracias vinculada</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Banner de restricción para Plan Básico */}
                                        {!isPro && availableLeadMagnets.length > 1 && (
                                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                                                    <p className="text-[11px] text-amber-200 leading-tight">
                                                        Como usuario básico tienes 1 Lead Magnet asignado al azar. Desbloquea todos y cámbialos con el <strong className="text-amber-400 font-bold">Plan PRO</strong>.
                                                    </p>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => onUpgrade?.()}
                                                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase shrink-0 transition shadow cursor-pointer"
                                                >
                                                    Mejorar a PRO
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-[#080d18] border border-dashed border-slate-800 rounded-xl p-4 text-center space-y-2">
                                        <FileText className="w-6 h-6 text-slate-500 mx-auto" />
                                        <p className="text-xs text-slate-400">
                                            Aún no has subido Lead Magnets en este proyecto ni en su Proyecto Maestro.
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Sube tus PDFs en "Administrador de Proyectos" para poder seleccionarlos aquí.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estado de la Página (Oculto manteniendo código intacto según solicitud) */}
                <div id="web-system-anchor" className="hidden max-w-4xl mx-auto w-full pt-4">
                    {loadingLocal ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                    ) : (
                        <div className="bg-[#0B0B0B] border border-white/10 rounded-[2.5rem] w-full max-w-[47rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center space-y-8 relative overflow-hidden mx-auto">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight italic">¡Tu página de captura ha sido creada correctamente!</h3>
                            <p className="text-white text-lg font-medium leading-relaxed max-w-2xl">Ya tienes tu página web lista y configurada para atraer y capturar audiencia interesada en el producto digital que deseas promocionar. <br /><br />usa los siguientes botones para visualizar y finalizar la configuración de tu página de captura.</p>
                            
                            <div className="w-full space-y-4">
                                {/* Fila 1 - Visualización */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href={`/admin/lp/${linkedPages.length > 0 ? linkedPages[0].subdomain.split('.')[0] : (projectId || 'microblading-demo')}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white text-black font-black py-4 px-10 rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.03] transition-all">Ver Página de Captura</a>
                                    <a href={`/admin/lp/${linkedPages.length > 0 ? linkedPages[0].subdomain.split('.')[0] : (projectId || 'microblading-demo')}/gracias`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-emerald-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.03] transition-all">Ver Página de Gracias</a>
                                </div>
                                {/* Fila 2 - Gestión */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a 
                                        href={linkedPages.length > 0 ? (window.location.hash.startsWith('#/') ? `#/dashboard/editor/${linkedPages[0].id}` : `/dashboard/editor/${linkedPages[0].id}`) : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-[#FF5A1F] text-white font-black py-4 px-10 rounded-2xl shadow-xl transform hover:scale-[1.03] transition-all flex items-center justify-center gap-3"
                                    >
                                        <PenTool className="w-5 h-5" /> Editar Página de Captura
                                    </a>
                                    <button 
                                        onClick={() => setShowDomainModal(true)} 
                                        className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition border shadow-xl transform hover:scale-[1.03] ${
                                            linkedPages.length > 0 && linkedPages[0].customDomain 
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-white" 
                                            : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white"
                                        }`}
                                    >
                                        {linkedPages.length > 0 && linkedPages[0].customDomain ? <CheckCircle2 className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                        {linkedPages.length > 0 && linkedPages[0].customDomain ? "Ver Dominio" : "Asignar Dominio"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                                    <button onClick={() => { handleEditPage(page.id); setShowPagesModal(false); }} className="p-4 bg-blue-500/10 text-blue-400 rounded-2xl"><PenTool className="w-6 h-6" /></button>
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