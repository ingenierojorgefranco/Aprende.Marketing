import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useNavigate, useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import { 
    Users, Target, MessageCircle, FileText,
    MonitorPlay, ShoppingCart, CheckCircle2,
    BookOpen, Sparkles, Globe, Clapperboard, Loader2, Wand2, Rocket, AlertTriangle, RefreshCw,
    Clock, Award, MessageSquare
} from 'lucide-react';

import { ProjectStrategy_Header } from './ProjectStrategy/ProjectStrategy_Header';
import { ProjectStrategy_Sidebar } from './ProjectStrategy/ProjectStrategy_Sidebar';

// Actualización: Casting de tipos en componentes Lazy para asegurar que acepten props dinámicas sin errores de IntrinsicAttributes - 08/01/2026
const ProjectStrategy_Summary = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Summary').then(m => ({ default: m.ProjectStrategy_Summary }))) as React.FC<any>;
const ProjectStrategy_AvatarDiagnosis = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_AvatarDiagnosis').then(m => ({ default: m.ProjectStrategy_AvatarDiagnosis }))) as React.FC<any>;
const ProjectStrategy_Psychology = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Psychology').then(m => ({ default: m.ProjectStrategy_Psychology }))) as React.FC<any>;
const ProjectStrategy_BusinessGrowth = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_BusinessGrowth').then(m => ({ default: m.ProjectStrategy_BusinessGrowth }))) as React.FC<any>;
const ProjectStrategy_Blueprint = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Blueprint').then(m => ({ default: m.ProjectStrategy_Blueprint }))) as React.FC<any>;
const ProjectStrategy_WebSystem = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_WebSystem').then(m => ({ default: m.ProjectStrategy_WebSystem }))) as React.FC<any>;
const ProjectStrategy_Content = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Content').then(m => ({ default: m.ProjectStrategy_Content }))) as React.FC<any>;
const ProjectStrategy_Hooks = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Hooks').then(m => ({ default: m.ProjectStrategy_Hooks }))) as React.FC<any>;
const ProjectStrategy_Email = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Email').then(m => ({ default: m.ProjectStrategy_Email }))) as React.FC<any>;
const ProjectStrategy_Evergreen = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Evergreen').then(m => ({ default: m.ProjectStrategy_Evergreen }))) as React.FC<any>;
const ProjectStrategy_WhatsApp = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_WhatsApp').then(m => ({ default: m.ProjectStrategy_WhatsApp }))) as React.FC<any>;
const ProjectStrategy_Testimonials = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Testimonials').then(m => ({ default: m.ProjectStrategy_Testimonials }))) as React.FC<any>;

import { UpgradeModal } from '../UpgradeModal';
import { api } from '../../../services/api';
import { ProjectMasterStrategy } from '../../../services/strategySchema';
import { User, Plan, Article } from '../../../types';

const iconMap: any = {
    BookOpen, Sparkles, Users, MessageCircle, Target
};

export const ProjectStrategyDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams() as { id: string };
    const { user, pageCount: globalPageCount, articleCount: globalArticleCount, isSimulating } = useOutletContext() as any;

    const [strategyData, setStrategyData] = useState<ProjectMasterStrategy | null>(null);
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    
    const [searchParams, useSetSearchParams] = useSearchParams();
    const activeSection = searchParams.get('section') || 'summary';
    const setActiveSection = (id: string) => useSetSearchParams({ section: id });

    const [nextPlan, setNextPlan] = useState<Plan | null>(null);
    const [activeWaScript, setActiveWaScript] = useState(0);
    const [activeEmail, setActiveEmail] = useState(0);
    const [activeArticle, setActiveArticle] = useState(0);
    const [activeHook, setActiveHook] = useState(0);
    const [selectedArticles, setSelectedArticles] = useState<number[]>([]); 
    const [activeHeaderItem, setActiveHeaderItem] = useState<string | null>(null);
    const [activeEvergreenEmail, setActiveEvergreenEmail] = useState(0); 
    const [selectedLpTab, setSelectedLpTab] = useState<string | null>(null);
    const [selectedTyTab, setSelectedTyTab] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [linkedArticles, setLinkedArticles] = useState<Article[]>([]);

    const [tooltipState, setTooltipState] = useState<{ visible: boolean; x: number; y: number; content: string[] }>({
        visible: false,
        x: 0,
        y: 0,
        content: []
    });

    // --- CARGA CORE (SÓLO LO ESENCIAL) ---
    const loadCoreData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [strategy, projectDetails, plansData, allPages, allArticles] = await Promise.all([
                api.getProjectStrategy(id).catch(() => null),
                api.getProjectById(id).catch(() => null),
                api.getPublicPlans().catch(() => []),
                api.getPages().catch(() => []),
                api.getArticles().catch(() => [])
            ]);

            if (projectDetails) setProjectDescription(projectDetails.description || '');

            if (strategy && strategy.meta && strategy.meta.insights) {
                if (strategy.meta.insights.overview?.items) {
                    strategy.meta.insights.overview.items = strategy.meta.insights.overview.items.map((item: any) => ({
                        ...item,
                        icon: typeof item.icon === 'string' ? iconMap[item.icon] || Sparkles : (item.icon || Sparkles)
                    }));
                }
                setStrategyData(strategy);
            }

            if (allPages && allArticles) {
                const projectPages = allPages.filter((p: any) => String(p.projectId) === String(id));
                const projectArts = allArticles.filter((a: any) => projectPages.some((p: any) => String(p.id) === String(a.pageId)));
                setLinkedArticles(projectArts);
            }

            const currentPlanName = user.planLimits?.planName || 'starter';
            const sortedPlans = Array.isArray(plansData) ? [...plansData].sort((a, b) => a.priceMonthly - b.priceMonthly) : [];
            const currentIndex = sortedPlans.findIndex(p => p.slug === currentPlanName);
            if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) setNextPlan(sortedPlans[currentIndex + 1]);

        } catch (error: any) {
            console.error("[Core Load Error]:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadCoreData(); }, [id, user.planLimits]);

    const handleGenerateStrategy = async () => {
        setGenerating(true);
        try {
            await api.generateProjectStrategyFull(id);
            await loadCoreData();
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        } finally {
            setGenerating(false);
        }
    };

    const chartData = useMemo(() => {
        if (!strategyData || !strategyData.meta || !strategyData.meta.projection) return [];
        const names = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const fullNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const today = new Date();
        const start = today.getMonth();
        return strategyData.meta.projection.map((income, i) => {
            const idx = (start + i) % 12;
            const year = today.getFullYear() + Math.floor((start + i) / 12);
            return {
                month: names[idx], 
                income: income || 0,
                fullDate: `${fullNames[idx]} de ${year}`
            };
        });
    }, [strategyData]);

    const handleTooltipHover = (e: React.MouseEvent, content: string[]) => {
        setTooltipState({ visible: true, x: e.clientX + 15, y: e.clientY + 15, content });
    };

    const handleTooltipLeave = () => setTooltipState(prev => ({ ...prev, visible: false }));

    const toggleArticleSelection = (index: number, isSingle: boolean = false) => {
        if (isSingle) {
            setSelectedArticles([index]);
            return;
        }
        if (selectedArticles.includes(index)) setSelectedArticles(prev => prev.filter(i => i !== index));
        else if (selectedArticles.length < (user.planLimits?.maxArticles || 2)) setSelectedArticles(prev => [...prev, index]);
        else { alert("Límite de artículos alcanzado."); setShowUpgradeModal(true); }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-400">Cargando estrategia...</p>
            </div>
        </div>
    );

    if (!strategyData) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-in fade-in">
            <h2 className="text-3xl font-black mb-4 text-center">Datos incompletos</h2>
            <button onClick={handleGenerateStrategy} disabled={generating} className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-xl flex items-center gap-4">
                {generating ? <Loader2 className="animate-spin" /> : <RefreshCw />} Regenerar Estrategia
            </button>
        </div>
    );

    return (
        <div id="psd-page-root" className="min-h-screen bg-black text-gray-200 pb-20 font-sans relative">
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                user={user}
                userId={user.id}
                currentPlan={user.planLimits?.planName} 
            />

            {tooltipState.visible && (
                <div className="fixed z-[100] w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-5 rounded-2xl shadow-2xl pointer-events-none" style={{ top: tooltipState.y, left: tooltipState.x }}>
                    {tooltipState.content.map((text, i) => <p key={i} className="text-sm text-gray-300">{text}</p>)}
                </div>
            )}

            <ProjectStrategy_Header projectName={strategyData.meta?.projectName || "Proyecto"} onBack={() => navigate('/dashboard/projects')} />

            <div className="max-w-full mx-auto py-6 px-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 relative">
                <div className="lg:col-span-3">
                    <ProjectStrategy_Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                </div>
                <div className="lg:col-span-9 min-w-0">
                    <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
                        {activeSection === 'summary' && <ProjectStrategy_Summary strategyData={strategyData} description={projectDescription} activeHeaderItem={activeHeaderItem} setActiveHeaderItem={setActiveHeaderItem} handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} />}
                        {activeSection === 'growth' && <ProjectStrategy_BusinessGrowth chartData={chartData} commissionValue={(strategyData.meta?.price || 0) * (strategyData.meta?.commissionRate || 0)} commissionRate={strategyData.meta?.commissionRate || 0} />}
                        {activeSection === 'blueprint' && <ProjectStrategy_Blueprint handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} />}
                        {activeSection === 'avatar' && <ProjectStrategy_AvatarDiagnosis avatars={strategyData.avatars} psychology={strategyData.psychology} benefitsItems={strategyData.modules?.web?.landingPageTabs?.benefits?.items || []} />}
                        {activeSection === 'psychology' && <ProjectStrategy_Psychology psychology={strategyData.psychology} benefitsItems={strategyData.modules?.web?.landingPageTabs?.benefits?.items || []} />}
                        {activeSection === 'hooks' && <ProjectStrategy_Hooks strategyData={strategyData} activeHook={activeHook} setActiveHook={setActiveHook} handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} />}
                        {activeSection === 'testimonials' && <ProjectStrategy_Testimonials strategyData={strategyData} />}
                        {activeSection === 'web' && <ProjectStrategy_WebSystem projectId={id} lpTabsData={strategyData.modules?.web?.landingPageTabs} tyTabsData={strategyData.modules?.web?.thankYouPageTabs} selectedLpTab={selectedLpTab} setSelectedLpTab={setSelectedLpTab} selectedTyTab={selectedTyTab} setSelectedTyTab={setSelectedTyTab} handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} onEditPage={(pid: string) => navigate(`/dashboard/editor/${pid}`)} pageCount={globalPageCount} planLimits={user.planLimits} onUpgrade={() => setShowUpgradeModal(true)} nextPlan={nextPlan} isSimulating={isSimulating} />}
                        {activeSection === 'content' && <ProjectStrategy_Content contentData={strategyData.modules.content} activeArticle={activeArticle} setActiveArticle={setActiveArticle} selectedArticles={selectedArticles} toggleArticleSelection={toggleArticleSelection} handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} articleCount={globalArticleCount} planLimits={user.planLimits} onUpgrade={() => setShowUpgradeModal(true)} nextPlan={nextPlan} isSimulating={isSimulating} />}
                        {activeSection === 'email' && <ProjectStrategy_Email emailData={strategyData.modules.emails.nurture} avatars={strategyData.avatars} activeEmail={activeEmail} setActiveEmail={setActiveEmail} features={user.planLimits?.features} onUpgrade={() => setShowUpgradeModal(true)} planLimits={user.planLimits} nextPlan={nextPlan} isSimulating={isSimulating} />}
                        {activeSection === 'evergreen' && <ProjectStrategy_Evergreen evergreenData={strategyData.modules.emails.evergreen} avatars={strategyData.avatars} activeEvergreenEmail={activeEvergreenEmail} setActiveEvergreenEmail={setActiveEvergreenEmail} features={user.planLimits?.features} onUpgrade={() => setShowUpgradeModal(true)} planLimits={user.planLimits} nextPlan={nextPlan} linkedArticles={linkedArticles} />}
                        {activeSection === 'whatsapp' && <ProjectStrategy_WhatsApp activeWaScript={activeWaScript} setActiveWaScript={setActiveWaScript} onUpgrade={() => setShowUpgradeModal(true)} projectId={id} isSimulating={isSimulating} planLimits={user.planLimits} strategyData={strategyData} />}
                    </Suspense>
                </div>
            </div>
        </div>
    );
};