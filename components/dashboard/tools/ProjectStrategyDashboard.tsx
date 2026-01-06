import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { 
    Users, Target, MessageCircle, FileText,
    MonitorPlay, ShoppingCart, CheckCircle2,
    BookOpen, Sparkles, Globe, Clapperboard, X, Loader2, Wand2, Rocket, AlertTriangle, RefreshCw
} from 'lucide-react';

import { ProjectStrategy_Header } from './ProjectStrategy/ProjectStrategy_Header';

////////// Actualización: Carga Dinámica (Lazy Load) de Bloques Pesados de Estrategia - 05/06/2025 21:30 //////////
const ProjectStrategy_Summary = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Summary').then(m => ({ default: m.ProjectStrategy_Summary })));
const ProjectStrategy_AvatarDiagnosis = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_AvatarDiagnosis').then(m => ({ default: m.ProjectStrategy_AvatarDiagnosis })));
const ProjectStrategy_BusinessGrowth = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_BusinessGrowth').then(m => ({ default: m.ProjectStrategy_BusinessGrowth })));
const ProjectStrategy_Blueprint = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Blueprint').then(m => ({ default: m.ProjectStrategy_Blueprint })));
const ProjectStrategy_WebSystem = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_WebSystem').then(m => ({ default: m.ProjectStrategy_WebSystem })));
const ProjectStrategy_Content = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Content').then(m => ({ default: m.ProjectStrategy_Content })));
const ProjectStrategy_Email = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Email').then(m => ({ default: m.ProjectStrategy_Email })));
const ProjectStrategy_Evergreen = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Evergreen').then(m => ({ default: m.ProjectStrategy_Evergreen })));
const ProjectStrategy_WhatsApp = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_WhatsApp').then(m => ({ default: m.ProjectStrategy_WhatsApp })));
////////// Fin de actualización - 05/06/2025 21:30 //////////

import { UpgradeModal } from '../UpgradeModal';
import { api } from '../../../services/api';
import { ProjectMasterStrategy } from '../../../services/strategySchema';
import { LandingPage, User, Plan } from '../../../types';

// --- ICONS MAPPING FOR DYNAMIC DATA ---
const iconMap: any = {
    BookOpen, Sparkles, Users, MessageCircle, Target
};

interface DashboardContext {
    user: User;
    pageCount: number;
    articleCount: number;
}

export const ProjectStrategyDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams() as { id: string };
    
    // Get Global Context Data (User Limits & Current Usage)
    const { user, pageCount, articleCount } = useOutletContext() as DashboardContext;

    const [strategyData, setStrategyData] = useState<ProjectMasterStrategy | null>(null);
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [globalDomainCount, setGlobalDomainCount] = useState(0); 
    
    // Dynamic Plan Logic
    const [nextPlan, setNextPlan] = useState<Plan | null>(null);

    // INTERACTIVE STATES
    const [activeWaScript, setActiveWaScript] = useState(0);
    const [activeEmail, setActiveEmail] = useState(0);
    const [activeArticle, setActiveArticle] = useState(0);
    const [selectedArticles, setSelectedArticles] = useState<number[]>([]); 
    const [activeHeaderItem, setActiveHeaderItem] = useState<string | null>(null);
    const [activeEvergreenEmail, setActiveEvergreenEmail] = useState(0); 
    
    // LANDING PAGE SELECTION STATE
    const [selectedLpTab, setSelectedLpTab] = useState<string | null>(null);
    const [selectedTyTab, setSelectedTyTab] = useState<string | null>(null);

    // MODAL STATE
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    // FLOATING TOOLTIP STATE
    const [tooltipState, setTooltipState] = useState<{ visible: boolean; x: number; y: number; content: string[] }>({
        visible: false,
        x: 0,
        y: 0,
        content: []
    });

    // --- LOAD STRATEGY, PAGES & PLANS DATA ---
    const loadData = async () => {
        if (!id) return;
        console.debug(`[StrategyDashboard Debug] Iniciando carga de datos para ID: ${id}`);
        setLoading(true);
        try {
            // Fetch Strategy, Project Details, Pages and Plans in parallel
            const [strategy, projectDetails, pages, plansData] = await Promise.all([
                api.getProjectStrategy(id).catch(e => { console.error("Strategy load fail", e); return null; }),
                api.getProjectById(id).catch(e => { console.error("Project details load fail", e); return null; }),
                api.getPages().catch(e => { console.error("Pages load fail", e); return []; }),
                api.getPublicPlans().catch(e => { console.error("Plans load fail", e); return []; })
            ]);

            console.debug(`[StrategyDashboard Debug] Objeto strategy obtenido:`, strategy);

            // Set project description for summary section
            if (projectDetails) {
                setProjectDescription(projectDetails.description || '');
            }

            // Validación extrema de estructura JSON
            const isStrategyValid = strategy && 
                                   strategy.meta && 
                                   strategy.meta.insights && 
                                   strategy.avatars && 
                                   strategy.psychology && 
                                   strategy.modules;

            if (isStrategyValid) {
                console.debug(`[StrategyDashboard Debug] Estructura válida de estrategia detectada.`);
                // Map icons from strings to components if coming from JSON
                if (strategy.meta.insights.overview?.items) {
                    strategy.meta.insights.overview.items = strategy.meta.insights.overview.items.map((item: any) => ({
                        ...item,
                        icon: typeof item.icon === 'string' ? iconMap[item.icon] || Sparkles : (item.icon || Sparkles)
                    }));
                }
                setStrategyData(strategy);
            } else {
                console.warn(`[StrategyDashboard Debug] Estructura de estrategia INVÁLIDA o incompleta detectada.`);
                setStrategyData(null);
            }

            // Logic: Find all pages linked to this project
            const projectPages = Array.isArray(pages) ? pages.filter(p => String(p.projectId) === String(id) || (strategy && p.name === strategy.meta?.projectName)) : [];
            setLinkedPages(projectPages);

            // Calcular conteo global de dominios
            const domains = Array.isArray(pages) ? pages.filter(p => !!p.customDomain).length : 0;
            setGlobalDomainCount(domains);

            // Logic: Determine Next Plan
            const currentPlanName = user.planLimits?.planName || 'starter';
            const sortedPlans = Array.isArray(plansData) ? [...plansData].sort((a, b) => a.priceMonthly - b.priceMonthly) : [];
            const currentIndex = sortedPlans.findIndex(p => p.slug === currentPlanName);
            
            if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) {
                setNextPlan(sortedPlans[currentIndex + 1]);
            } else {
                setNextPlan(null); 
            }

        } catch (error: any) {
            console.error("[StrategyDashboard Error] Fatal load failure:", error.message);
            setStrategyData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id, user.planLimits]);

    const handleGenerateStrategy = async () => {
        setGenerating(true);
        try {
            await api.generateProjectStrategyFull(id);
            await loadData();
        } catch (e: any) {
            alert(`Error generando estrategia: ${e.message}`);
        } finally {
            setGenerating(false);
        }
    };

    // --- CHART DATA GENERATION LOGIC ---
    const chartData = useMemo(() => {
        if (!strategyData || !strategyData.meta || !strategyData.meta.projection) return [];
        
        const monthNamesFull = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthNamesShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const today = new Date();
        const currentMonthIdx = today.getMonth(); 
        const currentYear = today.getFullYear();

        // Datos dinámicos de la base de datos
        const baseData = strategyData.meta.projection;

        return baseData.map((income, i) => {
            const monthIndex = (currentMonthIdx + i) % 12;
            const yearOffset = Math.floor((currentMonthIdx + i) / 12);
            const year = currentYear + yearOffset;
            
            const monthNameShort = monthNamesShort[monthIndex];
            const fullDate = `${monthNamesFull[monthIndex]} de ${year}`;
            
            return {
                month: monthNameShort, 
                income: income || 0,
                fullDate: fullDate 
            };
        });
    }, [strategyData]);

    const handleTooltipHover = (e: React.MouseEvent, content: string[]) => {
        setTooltipState({
            visible: true,
            x: e.clientX + 15,
            y: e.clientY + 15,
            content
        });
    };

    const handleTooltipLeave = () => {
        setTooltipState(prev => ({ ...prev, visible: false }));
    };

    const toggleArticleSelection = (index: number) => {
        if (selectedArticles.includes(index)) {
            setSelectedArticles(prev => prev.filter(i => i !== index));
        } else {
            const maxArticles = user.planLimits?.maxArticles || 2;
            if (selectedArticles.length < maxArticles) {
                setSelectedArticles(prev => [...prev, index]);
            } else {
                alert(`Tu plan permite seleccionar máximo ${maxArticles} artículos. Desmarca uno para agregar otro o actualiza tu plan.`);
                setShowUpgradeModal(true);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-400">Cargando estrategia maestra...</p>
                </div>
            </div>
        );
    }

    // Pantalla de error/regeneración elegante
    if (!strategyData || !strategyData.meta) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 animate-in fade-in">
                <div className="w-24 h-24 bg-blue-900/20 rounded-full flex items-center justify-center mb-8 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                    <Rocket className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-center">Datos incompletos o corruptos</h2>
                <p className="text-gray-400 text-lg max-w-xl text-center mb-10 leading-relaxed font-light">
                    No hemos podido cargar la estrategia de este proyecto correctamente. Esto puede deberse a un error en la generación previa o datos truncados por la IA. 
                    <br/><br/>
                    <span className="text-blue-400 font-bold">La mejor solución es volver a generar la estrategia ahora mismo.</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={handleGenerateStrategy}
                        disabled={generating}
                        className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Generando...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-6 h-6" />
                                Regenerar Estrategia
                            </>
                        )}
                    </button>

                    <button 
                        onClick={() => navigate('/dashboard/projects')}
                        className="px-10 py-5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-2xl font-bold transition-all"
                    >
                        Cancelar
                    </button>
                </div>
                
                <div className="mt-12 flex items-center gap-3 text-gray-500 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span>Esto consumirá un crédito de generación de tu plan actual.</span>
                </div>
            </div>
        );
    }

    return (
        <div id="psd-page-root" className="min-h-screen bg-black text-gray-200 pb-20 font-sans relative">
            
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                reason="Desbloquea la generación ilimitada de contenido y funcionalidades PRO."
            />

            {showVideoModal && (
                <div id="psd-video-modal-overlay" className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div id="psd-video-modal-container" className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <button id="psd-video-modal-close-btn" onClick={() => setShowVideoModal(false)} className="absolute top-4 right-4 text-white z-10 bg-gray-800 p-2 rounded-full hover:bg-gray-700">
                            <X className="w-6 h-6"/>
                        </button>
                        <div id="psd-video-modal-iframe-container" className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Estrategia Explicada" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {tooltipState.visible && (
                <div 
                    id="psd-tooltip-container"
                    className="fixed z-[100] w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-5 rounded-2xl shadow-2xl pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95"
                    style={{ top: tooltipState.y, left: tooltipState.x }}
                >
                    <div id="psd-tooltip-header" className="flex items-center gap-2 mb-3 border-b border-gray-700/50 pb-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Detalle Estratégico</span>
                    </div>
                    <div id="psd-tooltip-content" className="space-y-2 text-sm text-gray-300 leading-relaxed">
                        {tooltipState.content.map((text, i) => (
                            <p key={i}>{text}</p>
                        ))}
                    </div>
                </div>
            )}

            <ProjectStrategy_Header 
                projectName={strategyData.meta?.projectName || "Proyecto"} 
                onBack={() => navigate('/dashboard/projects')} 
            />

            <div id="psd-main-content" className="max-w-[1400px] mx-auto p-6 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">

                {/* ////////// Actualización: Integración de Suspense para carga bajo demanda de bloques pesados - 05/06/2025 21:30 ////////// */}
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-500 italic">Preparando bloque estratégico...</div>}>
                    <ProjectStrategy_Summary 
                        strategyData={strategyData} 
                        description={projectDescription}
                        activeHeaderItem={activeHeaderItem} 
                        setActiveHeaderItem={setActiveHeaderItem}
                        handleTooltipHover={handleTooltipHover}
                        handleTooltipLeave={handleTooltipLeave}
                    />
                </Suspense>

                <Suspense fallback={null}>
                    <ProjectStrategy_BusinessGrowth 
                        chartData={chartData} 
                        onOpenVideo={() => setShowVideoModal(true)} 
                        commissionValue={(strategyData.meta?.price || 0) * (strategyData.meta?.commissionRate || 0)}
                    />
                </Suspense>

                <Suspense fallback={null}>
                    <ProjectStrategy_Blueprint 
                        handleTooltipHover={handleTooltipHover} 
                        handleTooltipLeave={handleTooltipLeave} 
                        onOpenVideo={() => setShowVideoModal(true)} 
                    />
                </Suspense>

                <Suspense fallback={null}>
                    {strategyData.avatars && (
                        <ProjectStrategy_AvatarDiagnosis 
                            avatars={strategyData.avatars} 
                            psychology={strategyData.psychology} 
                            benefitsItems={strategyData.modules.web.landingPageTabs.benefits.items}
                        />
                    )}
                </Suspense>

                {/* --- BLOQUE DE TRANSICIÓN: RESUMEN DEL SISTEMA (DISEÑO IDÉNTICO AL HEADER) --- */}
                <div id="psd-deployment-transition-block" className="relative bg-[#020202] border-y border-white/5 py-20 overflow-hidden mx-[-2rem] md:mx-[-4rem]">
                    {/* Visual Background Layers (Mirroring Header) */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Technical Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:45px_45px] opacity-[0.08]"></div>
                        
                        {/* Radial Deep Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1e2e_0%,transparent_70%)] opacity-40"></div>
                        
                        {/* Focal Light Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                    </div>

                    <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center space-y-10">
                        {/* 1. STRATEGIC BADGE */}
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                <span className="text-indigo-300 font-black text-sm uppercase tracking-[0.25em]">
                                    Estrategia de Ventas Aplicada a tu Producto Digital
                                </span>
                            </div>
                        </div>
                        
                        {/* 2. PROJECT TITLE & VERSION */}
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl lg:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
                                {strategyData.meta?.projectName}
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-indigo-400/60">
                                <span className="text-xs font-bold uppercase tracking-[0.3em]">Estrategia Perfecta para Vender tu Producto Digital</span>
                            </div>
                        </div>
                        
                        {/* 3. EXECUTIVE SUMMARY NARRATIVE */}
                        <p className="text-gray-400 font-light max-w-4xl mx-auto leading-[1.9] text-[1.4rem] md:text-[1.6rem] border-t border-white/5 pt-10">
                            Nuestra inteligencia artificial ha analizado profundamente tu producto elegido y el mercado actual para diseñar un ecosistema de ventas automatizado. Hará todo el trabajo difícil por ti de forma automática.
                        </p>
                    </div>
                </div>

                <Suspense fallback={null}>
                    <ProjectStrategy_WebSystem 
                        projectId={id}
                        lpTabsData={strategyData.modules.web.landingPageTabs}
                        tyTabsData={strategyData.modules.web.thankYouPageTabs}
                        selectedLpTab={selectedLpTab}
                        setSelectedLpTab={setSelectedLpTab}
                        selectedTyTab={selectedTyTab}
                        setSelectedTyTab={setSelectedTyTab}
                        handleTooltipHover={handleTooltipHover}
                        handleTooltipLeave={handleTooltipLeave}
                        linkedPages={linkedPages}
                        onEditPage={(pageId) => navigate(`/dashboard/editor/${pageId}`)}
                        pageCount={pageCount}
                        domainCount={globalDomainCount}
                        planLimits={user.planLimits}
                        onUpgrade={() => setShowUpgradeModal(true)}
                        nextPlan={nextPlan}
                    />
                </Suspense>

                <Suspense fallback={null}>
                    {strategyData.modules?.content && (
                        <ProjectStrategy_Content 
                            contentData={strategyData.modules.content}
                            activeArticle={activeArticle}
                            setActiveArticle={setActiveArticle}
                            selectedArticles={selectedArticles}
                            toggleArticleSelection={toggleArticleSelection}
                            handleTooltipHover={handleTooltipHover}
                            handleTooltipLeave={handleTooltipLeave}
                            articleCount={articleCount}
                            planLimits={user.planLimits}
                            onUpgrade={() => setShowUpgradeModal(true)}
                            nextPlan={nextPlan}
                        />
                    )}
                </Suspense>

                <Suspense fallback={null}>
                    {strategyData.modules?.emails?.nurture && (
                        <ProjectStrategy_Email 
                            emailData={strategyData.modules.emails.nurture}
                            avatars={strategyData.avatars}
                            activeEmail={activeEmail}
                            setActiveEmail={setActiveEmail}
                            features={user.planLimits?.features}
                            onUpgrade={() => setShowUpgradeModal(true)}
                            planLimits={user.planLimits}
                            nextPlan={nextPlan}
                        />
                    )}
                </Suspense>

                <Suspense fallback={null}>
                    {strategyData.modules?.emails?.evergreen && (
                        <ProjectStrategy_Evergreen 
                            evergreenData={strategyData.modules.emails.evergreen}
                            avatars={strategyData.avatars}
                            activeEvergreenEmail={activeEvergreenEmail}
                            setActiveEvergreenEmail={setActiveEvergreenEmail}
                            features={user.planLimits?.features}
                            onUpgrade={() => setShowUpgradeModal(true)}
                            planLimits={user.planLimits}
                            nextPlan={nextPlan}
                        />
                    )}
                </Suspense>

                <Suspense fallback={null}>
                    {strategyData.modules?.whatsapp && (
                        <ProjectStrategy_WhatsApp 
                            whatsappData={strategyData.modules.whatsapp}
                            activeWaScript={activeWaScript}
                            setActiveWaScript={setActiveWaScript}
                            onUpgrade={() => setShowUpgradeModal(true)}
                        />
                    )}
                </Suspense>
                {/* ////////// Fin de actualización - 05/06/2025 21:30 ////////// */}

            </div>
        </div>
    );
};
