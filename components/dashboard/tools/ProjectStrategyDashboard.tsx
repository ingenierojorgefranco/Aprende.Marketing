import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { 
    Users, Target, MessageCircle, FileText,
    MonitorPlay, ShoppingCart, CheckCircle2,
    BookOpen, Sparkles, Globe, Clapperboard, X, Loader2, Wand2, Rocket
} from 'lucide-react';

import { ProjectStrategy_Header } from './ProjectStrategy/ProjectStrategy_Header';
import { ProjectStrategy_Summary } from './ProjectStrategy/ProjectStrategy_Summary';
import { ProjectStrategy_AvatarDiagnosis } from './ProjectStrategy/ProjectStrategy_AvatarDiagnosis';
import { ProjectStrategy_BusinessGrowth } from './ProjectStrategy/ProjectStrategy_BusinessGrowth';
import { ProjectStrategy_Blueprint } from './ProjectStrategy/ProjectStrategy_Blueprint';
import { ProjectStrategy_WebSystem } from './ProjectStrategy/ProjectStrategy_WebSystem';
import { ProjectStrategy_Content } from './ProjectStrategy/ProjectStrategy_Content';
import { ProjectStrategy_Email } from './ProjectStrategy/ProjectStrategy_Email';
import { ProjectStrategy_Evergreen } from './ProjectStrategy/ProjectStrategy_Evergreen';
import { ProjectStrategy_WhatsApp } from './ProjectStrategy/ProjectStrategy_WhatsApp';

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
        console.debug(`[StrategyDashboard Debug] Iniciando carga de datos para ID: ${id}`);
        setLoading(true);
        try {
            // Fetch Strategy, Pages and Plans in parallel
            console.debug(`[StrategyDashboard Debug] Llamando a APIs en paralelo...`);
            const [strategy, pages, plansData] = await Promise.all([
                api.getProjectStrategy(id),
                api.getPages(),
                api.getPublicPlans()
            ]);

            console.debug(`[StrategyDashboard Debug] Resultado api.getProjectStrategy(${id}):`, strategy);

            if (strategy) {
                console.debug(`[StrategyDashboard Debug] Inspección de estructura strategy:`, {
                    hasMeta: !!strategy.meta,
                    hasInsights: !!strategy.meta?.insights,
                    hasAvatars: !!strategy.avatars,
                    hasModules: !!strategy.modules
                });

                if (strategy.meta && strategy.meta.insights) {
                    console.debug(`[StrategyDashboard Debug] Estructura VÁLIDA detectada. Actualizando estado.`);
                    
                    // Map icons from strings to components if coming from JSON
                    if (strategy.meta.insights.overview && strategy.meta.insights.overview.items) {
                        strategy.meta.insights.overview.items = strategy.meta.insights.overview.items.map(item => ({
                            ...item,
                            icon: typeof item.icon === 'string' ? iconMap[item.icon] || Sparkles : item.icon
                        }));
                    }
                    setStrategyData(strategy);
                } else {
                    console.warn(`[StrategyDashboard Debug] strategy existe pero le falta 'meta' o 'insights'. Estructura incompleta.`);
                    setStrategyData(null);
                }
            } else {
                console.warn(`[StrategyDashboard Debug] api.getProjectStrategy devolvió NULL para el proyecto ${id}`);
                setStrategyData(null);
            }

            // Logic: Find all pages linked to this project
            const projectPages = pages.filter(p => String(p.projectId) === String(id) || (strategy && p.name === strategy.meta.projectName));
            setLinkedPages(projectPages);

            // Calcular conteo global de dominios
            const domains = pages.filter(p => !!p.customDomain).length;
            setGlobalDomainCount(domains);

            // Logic: Determine Next Plan
            const currentPlanName = user.planLimits?.planName || 'starter';
            const sortedPlans = plansData.sort((a, b) => a.priceMonthly - b.priceMonthly);
            const currentIndex = sortedPlans.findIndex(p => p.slug === currentPlanName);
            
            if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) {
                setNextPlan(sortedPlans[currentIndex + 1]);
            } else {
                setNextPlan(null); 
            }

        } catch (error: any) {
            console.error("[StrategyDashboard Error] Error crítico cargando datos:", error.message);
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
        console.debug(`[StrategyDashboard Debug] Solicitando generación completa de estrategia para ID: ${id}`);
        try {
            const result = await api.generateProjectStrategyFull(id);
            console.debug(`[StrategyDashboard Debug] Generación terminada. Resultado:`, result);
            await loadData();
        } catch (e: any) {
            console.error(`[StrategyDashboard Debug] Fallo en generación:`, e.message);
            alert(`Error generando estrategia: ${e.message}`);
        } finally {
            setGenerating(false);
        }
    };

    // --- CHART DATA GENERATION LOGIC ---
    const chartData = useMemo(() => {
        if (!strategyData || !strategyData.meta) return [];
        
        const monthNamesFull = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthNamesShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const today = new Date();
        const currentMonthIdx = today.getMonth(); 
        const currentYear = today.getFullYear();

        // Datos dinámicos de la base de datos
        const baseData = strategyData.meta.projection || Array(12).fill(0);

        return baseData.map((income, i) => {
            const monthIndex = (currentMonthIdx + i) % 12;
            const yearOffset = Math.floor((currentMonthIdx + i) / 12);
            const year = currentYear + yearOffset;
            
            const monthNameShort = monthNamesShort[monthIndex];
            const fullDate = `${monthNamesFull[monthIndex]} de ${year}`;
            
            return {
                month: monthNameShort, 
                income: income,
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

    if (!strategyData || !strategyData.meta) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 animate-in fade-in">
                <div className="w-24 h-24 bg-blue-900/20 rounded-full flex items-center justify-center mb-8 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                    <Rocket className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-center">Estrategia no generada</h2>
                <p className="text-gray-400 text-lg max-w-xl text-center mb-10 leading-relaxed font-light">
                    Tu proyecto aún no cuenta con un **Informe Estratégico Maestro**. Haz clic en el botón de abajo para que la Inteligencia Artificial analice tu nicho y cree tu plan de ventas completo.
                </p>
                
                <button 
                    onClick={handleGenerateStrategy}
                    disabled={generating}
                    className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {generating ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Generando Informe...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-6 h-6" />
                            Generar Estrategia Maestra
                        </>
                    )}
                </button>
                
                <button onClick={() => navigate('/dashboard/projects')} className="mt-8 text-gray-500 hover:text-white transition text-sm font-medium">
                    Volver a Proyectos
                </button>
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
                projectName={strategyData.meta.projectName} 
                onBack={() => navigate('/dashboard/projects')} 
            />

            <div id="psd-main-content" className="max-w-[1400px] mx-auto p-6 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">

                <ProjectStrategy_Summary 
                    strategyData={strategyData} 
                    activeHeaderItem={activeHeaderItem} 
                    setActiveHeaderItem={setActiveHeaderItem}
                    handleTooltipHover={handleTooltipHover}
                    handleTooltipLeave={handleTooltipLeave}
                />

                <ProjectStrategy_AvatarDiagnosis 
                    avatars={strategyData.avatars} 
                    psychology={strategyData.psychology} 
                />

                <ProjectStrategy_BusinessGrowth 
                    chartData={chartData} 
                    onOpenVideo={() => setShowVideoModal(true)} 
                    commissionValue={strategyData.meta.price * strategyData.meta.commissionRate}
                />

                <ProjectStrategy_Blueprint 
                    handleTooltipHover={handleTooltipHover} 
                    handleTooltipLeave={handleTooltipLeave} 
                    onOpenVideo={() => setShowVideoModal(true)} 
                />

                <ProjectStrategy_WebSystem 
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

            </div>
        </div>
    );
};