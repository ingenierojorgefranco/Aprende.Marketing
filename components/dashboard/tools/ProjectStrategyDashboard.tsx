import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { 
    Users, Target, MessageCircle, FileText,
    MonitorPlay, ShoppingCart, CheckCircle2,
    BookOpen, Sparkles, Globe, Clapperboard, X, Loader2
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
import { ProjectStrategy_Psychology } from './ProjectStrategy/ProjectStrategy_Psychology';

import { UpgradeModal } from '../UpgradeModal';
import { api } from '../../../services/api';
import { ProjectMasterStrategy, LandingPage, User, Plan } from '../../../types';

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
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [globalDomainCount, setGlobalDomainCount] = useState(0); // NUEVO
    
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
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch Strategy, Pages and Plans in parallel
                const [strategy, pages, plansData] = await Promise.all([
                    api.getProjectStrategy(id),
                    api.getPages(),
                    api.getPublicPlans()
                ]);

                // Map icons from strings to components if coming from JSON
                if (strategy.meta.insights.overview.items) {
                    strategy.meta.insights.overview.items = strategy.meta.insights.overview.items.map(item => ({
                        ...item,
                        icon: typeof item.icon === 'string' ? iconMap[item.icon] || Sparkles : item.icon
                    }));
                }
                setStrategyData(strategy);

                // Logic: Find all pages linked to this project (by ID or legacy Name match)
                const projectPages = pages.filter(p => p.projectId === id || p.name === strategy.meta.projectName);
                setLinkedPages(projectPages);

                // NUEVO: Calcular conteo global de dominios
                const domains = pages.filter(p => !!p.customDomain).length;
                setGlobalDomainCount(domains);

                // Logic: Determine Next Plan
                const currentPlanName = user.planLimits?.planName || 'starter';
                const sortedPlans = plansData.sort((a, b) => a.priceMonthly - b.priceMonthly);
                const currentIndex = sortedPlans.findIndex(p => p.slug === currentPlanName);
                
                if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) {
                    setNextPlan(sortedPlans[currentIndex + 1]);
                } else {
                    setNextPlan(null); // Already max or unknown
                }

            } catch (error) {
                console.error("Failed to load strategy or pages", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            loadData();
        }
    }, [id, user.planLimits]);

    // --- CHART DATA GENERATION LOGIC ---
    const chartData = useMemo(() => {
        const monthNamesFull = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const monthNamesShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const today = new Date();
        const currentMonthIdx = today.getMonth(); 
        const currentYear = today.getFullYear();

        const baseData = [0, 0, 0, 116.81, 233.62, 584.05, 817.67, 1168.10, 1401.72, 1752.15, 2102.58, 2336.20];

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
    }, []);

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
            // Check dynamic limit instead of hardcoded 2
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

    if (!strategyData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <p>No se pudo cargar la estrategia. Intenta nuevamente.</p>
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

                <ProjectStrategy_AvatarDiagnosis avatars={strategyData.avatars} psychology={strategyData.psychology} />

                <ProjectStrategy_BusinessGrowth 
                    chartData={chartData} 
                    onOpenVideo={() => setShowVideoModal(true)} 
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
                    // Props para límites
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
                    // Props para límites
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
                    // Updated to use feature flag
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
                    // Updated to use feature flag
                    features={user.planLimits?.features}
                    onUpgrade={() => setShowUpgradeModal(true)}
                    planLimits={user.planLimits}
                    nextPlan={nextPlan}
                />

            </div>
        </div>
    );
};