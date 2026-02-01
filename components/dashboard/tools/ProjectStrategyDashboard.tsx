import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useNavigate, useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import { 
    Users, Target, MessageCircle, FileText,
    MonitorPlay, ShoppingCart, CheckCircle2,
    BookOpen, Sparkles, Globe, Clapperboard, X, Loader2, Wand2, Rocket, AlertTriangle, RefreshCw,
    Clock, Award
} from 'lucide-react';

import { ProjectStrategy_Header } from './ProjectStrategy/ProjectStrategy_Header';
import { ProjectStrategy_Sidebar } from './ProjectStrategy/ProjectStrategy_Sidebar';

const ProjectStrategy_Summary = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Summary').then(m => ({ default: m.ProjectStrategy_Summary })));
const ProjectStrategy_AvatarDiagnosis = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_AvatarDiagnosis').then(m => ({ default: m.ProjectStrategy_AvatarDiagnosis })));
const ProjectStrategy_Psychology = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Psychology').then(m => ({ default: m.ProjectStrategy_Psychology })));
const ProjectStrategy_BusinessGrowth = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_BusinessGrowth').then(m => ({ default: m.ProjectStrategy_BusinessGrowth })));
const ProjectStrategy_Blueprint = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Blueprint').then(m => ({ default: m.ProjectStrategy_Blueprint })));
const ProjectStrategy_WebSystem = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_WebSystem').then(m => ({ default: m.ProjectStrategy_WebSystem })));
const ProjectStrategy_Content = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Content').then(m => ({ default: m.ProjectStrategy_Content })));
const ProjectStrategy_Email = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Email').then(m => ({ default: m.ProjectStrategy_Email })));
const ProjectStrategy_Evergreen = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_Evergreen').then(m => ({ default: m.ProjectStrategy_Evergreen })));
const ProjectStrategy_WhatsApp = React.lazy(() => import('./ProjectStrategy/ProjectStrategy_WhatsApp').then(m => ({ default: m.ProjectStrategy_WhatsApp })));

import { UpgradeModal } from '../UpgradeModal';
import { api } from '../../../services/api';
import { ProjectMasterStrategy } from '../../../services/strategySchema';
import { LandingPage, User, Plan, EmailSequence, Article, EmailMessage, WhatsAppLaunch } from '../../../types';

const iconMap: any = {
    BookOpen, Sparkles, Users, MessageCircle, Target
};

const WHATSAPP_LAUNCH_MOMENTS = [
    { id: 'wl1', name: 'Confirmación de Fecha', momentText: 'Día -7', objective: 'Generar expectativa y agendar al lead.', pilarType: 'Expectativa', purpose: 'Confirmar la fecha oficial de la clase y asegurar que lo agenden.' },
    { id: 'wl2', name: 'Historia de Autoridad', momentText: 'Día -5', objective: 'Crear conexión emocional con la experta.', pilarType: 'Autoridad', purpose: 'Narrar brevemente la historia de éxito del experto para generar confianza.' },
    { id: 'wl3', name: 'Temario y Promesa', momentText: 'Día -3', objective: 'Elevar el valor percibido de la clase.', pilarType: 'Valor / Curiosidad', purpose: 'Listar los 3 puntos clave que se aprenderán en la clase.' },
    { id: 'wl4', name: 'Adelanto (3 Errores)', momentText: 'Día -1', objective: 'Entregar valor previo para generar compromiso.', pilarType: 'Valor Preventivo', purpose: 'Identificar 3 errores comunes que el lead está cometiendo hoy.' },
    { id: 'wl5', name: '¡Hoy es el gran día!', momentText: 'Día Clase (AM)', objective: 'Recordatorio matutino.', pilarType: 'Urgencia Matutina', purpose: 'Anunciar que hoy es la clase y recordar los horarios.' },
    { id: 'wl6', name: 'Cuenta Regresiva (T-4h)', momentText: 'Día Clase (PM)', objective: 'Instrucciones de preparación.', pilarType: 'Preparación', purpose: 'Indicar que busquen libreta, café y un lugar tranquilo.' },
    { id: 'wl7', name: '¡Estamos en Vivo!', momentText: 'Día Clase (Link)', objective: 'Acceso directo a la transmisión.', pilarType: 'Acción Inmediata', purpose: 'Entregar el enlace directo a la transmisión.' },
    { id: 'wl8', name: 'Oferta Abierta', momentText: 'Post-Clase', objective: 'Apertura de inscripciones.', pilarType: 'Lanzamiento', purpose: 'Anunciar la apertura de inscripciones con el descuento máximo.' },
    { id: 'wl9', name: 'Bonos de Acción Rápida', momentText: 'Urgencia 1', objective: 'Presión por los regalos exclusivos.', pilarType: 'Escasez de Bonus', purpose: 'Mencionar los regalos extra para los primeros en comprar.' },
    { id: 'wl10', name: 'Tutorial de Pago', momentText: 'Soporte', objective: 'Eliminar fricción técnica en el checkout.', pilarType: 'Facilitación', purpose: 'Explicar cómo realizar la compra paso a paso.' },
    { id: 'wl11', name: 'Certificado y Garantía', momentText: 'Garantía', objective: 'Seguridad y aval profesional.', pilarType: 'Seguridad', purpose: 'Destacar la garantía de 7 días y el aval profesional.' },
    { id: 'wl12', name: 'Últimos Cupos', momentText: 'Cierre', objective: 'Escasez máxima y resolución de dudas.', pilarType: 'Escasez Final', purpose: 'Notificar que los cupos con descuento se están terminando.' },
    { id: 'wl13', name: 'Inscripciones Cerradas', momentText: 'Final', objective: 'Mantener la integridad de la oferta.', pilarType: 'Cierre de Carrito', purpose: 'Informar que el tiempo y los cupos se agotaron.' },
    { id: 'wl14', name: 'Bienvenida', momentText: 'Bienvenida', objective: 'Bienvenida a las nuevas alumnas.', pilarType: 'Onboarding', purpose: 'Dar la bienvenida oficial a la nueva comunidad de alumnos.' }
];

export const ProjectStrategyDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams() as { id: string };
    const { user, pageCount, articleCount, isSimulating } = useOutletContext() as any;

    const [strategyData, setStrategyData] = useState<ProjectMasterStrategy | null>(null);
    const [projectDescription, setProjectDescription] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [linkedPages, setLinkedPages] = useState<LandingPage[]>([]);
    const [linkedSequences, setLinkedSequences] = useState<EmailSequence[]>([]);
    const [realEmailMessages, setRealEmailMessages] = useState<EmailMessage[]>([]);
    const [linkedArticles, setLinkedArticles] = useState<Article[]>([]);
    const [globalDomainCount, setGlobalDomainCount] = useState(0); 
    const [resolvedWhatsAppLaunch, setResolvedWhatsAppLaunch] = useState<any[]>([]);
    const [isLaunchLocked, setIsLaunchLocked] = useState(true);
    
    // Conteos globales para límites
    const [globalEmailSequenceCount, setGlobalEmailSequenceCount] = useState(0);
    const [globalWhatsAppLaunchCount, setGlobalWhatsAppLaunchCount] = useState(0);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const activeSection = searchParams.get('section') || 'summary';
    const setActiveSection = (id: string) => setSearchParams({ section: id });

    const [nextPlan, setNextPlan] = useState<Plan | null>(null);
    const [activeWaScript, setActiveWaScript] = useState(0);
    const [activeEmail, setActiveEmail] = useState(0);
    const [activeArticle, setActiveArticle] = useState(0);
    const [selectedArticles, setSelectedArticles] = useState<number[]>([0]); 
    const [activeHeaderItem, setActiveHeaderItem] = useState<string | null>(null);
    const [activeEvergreenEmail, setActiveEvergreenEmail] = useState(0); 
    const [selectedLpTab, setSelectedLpTab] = useState<string | null>(null);
    const [selectedTyTab, setSelectedTyTab] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const [tooltipState, setTooltipState] = useState<{ visible: boolean; x: number; y: number; content: string[] }>({
        visible: false,
        x: 0,
        y: 0,
        content: []
    });

    const loadData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [strategy, projectDetails, pages, plansData, sequences, articles, waLaunchDb, allWaLaunches] = await Promise.all([
                api.getProjectStrategy(id).catch(e => { console.error("Strategy load fail", e); return null; }),
                api.getProjectById(id).catch(e => { console.error("Project details load fail", e); return null; }),
                api.getPages().catch(e => { console.error("Pages load fail", e); return []; }),
                api.getPublicPlans().catch(e => { console.error("Plans load fail", e); return []; }),
                api.getEmailSequences().catch(e => { console.error("Sequences load fail", e); return []; }),
                api.getArticles().catch(e => { console.error("Articles load fail", e); return []; }),
                api.getWhatsAppLaunchByProject(id).catch(() => null),
                api.getWhatsAppLaunches().catch(() => [])
            ]);

            setGlobalEmailSequenceCount(sequences.length);
            setGlobalWhatsAppLaunchCount(allWaLaunches.length);

            if (projectDetails) setProjectDescription(projectDetails.description || '');

            if (strategy && strategy.meta && strategy.meta.insights && strategy.avatars && strategy.psychology && strategy.modules) {
                if (strategy.meta.insights.overview?.items) {
                    strategy.meta.insights.overview.items = strategy.meta.insights.overview.items.map((item: any) => ({
                        ...item,
                        icon: typeof item.icon === 'string' ? iconMap[item.icon] || Sparkles : (item.icon || Sparkles)
                    }));
                }
                setStrategyData(strategy);
            } else {
                setStrategyData(null);
            }

            // Mapeo Dinámico de WhatsApp Launch
            let final14 = WHATSAPP_LAUNCH_MOMENTS.map(moment => ({ ...moment, content: '', isGenerated: false }));
            
            // Prioridad: 1. DB (Mensajes generados) | 2. Strategy JSON (Sugerencias IA)
            if (waLaunchDb && waLaunchDb.messages) {
                const dbMessages = waLaunchDb.messages;
                final14 = final14.map(moment => {
                    const match = dbMessages.find((m: any) => m.id === moment.id);
                    return match ? { ...moment, ...match } : moment;
                });
                setResolvedWhatsAppLaunch(final14);
                const hasGeneratedRest = dbMessages.some((m: any) => m.id !== 'wl1' && m.isGenerated);
                setIsLaunchLocked(!hasGeneratedRest);
            } else {
                if (strategy && strategy.modules && strategy.modules.whatsappLaunch && strategy.modules.whatsappLaunch.length > 0) {
                    const strategyMsgs = strategy.modules.whatsappLaunch;
                    final14 = final14.map(moment => {
                        const match = strategyMsgs.find((m: any) => m.id === moment.id);
                        if (match) {
                            return {
                                ...moment,
                                name: (match as any).name || moment.name,
                                purpose: (match as any).purpose || (match as any).objective || moment.purpose,
                                pilarType: (match as any).pilarType || moment.pilarType,
                                content: (match as any).messages?.[0]?.text || (match as any).content || '',
                                isGenerated: !!((match as any).messages?.[0]?.text || (match as any).content)
                            };
                        }
                        return moment;
                    });
                }
                setResolvedWhatsAppLaunch(final14);
                setIsLaunchLocked(true);
            }

            const projectPages = Array.isArray(pages) ? pages.filter(p => String(p.projectId) === String(id)) : [];
            setLinkedPages(projectPages);

            const projectSeqs = Array.isArray(sequences) ? sequences.filter(s => String(s.projectId) === String(id)) : [];
            setLinkedSequences(projectSeqs);
            
            if (projectSeqs.length > 0) {
                const realMessages = await api.getSequenceMessages(projectSeqs[0].id);
                setRealEmailMessages(realMessages);
            }

            const projectArts = Array.isArray(articles) ? articles.filter(a => projectPages.some(p => String(p.id) === String(a.pageId))) : [];
            setLinkedArticles(projectArts);

            setGlobalDomainCount(Array.isArray(pages) ? pages.filter(p => !!p.customDomain).length : 0);

            const currentPlanName = user.planLimits?.planName || 'starter';
            const sortedPlans = Array.isArray(plansData) ? [...plansData].sort((a, b) => a.priceMonthly - b.priceMonthly) : [];
            const currentIndex = sortedPlans.findIndex(p => p.slug === currentPlanName);
            if (currentIndex !== -1 && currentIndex < sortedPlans.length - 1) setNextPlan(sortedPlans[currentIndex + 1]);

        } catch (error: any) {
            console.error("[StrategyDashboard Error]:", error.message);
            setStrategyData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) loadData(); }, [id, user.planLimits]);

    const handleGenerateStrategy = async () => {
        setGenerating(true);
        try {
            await api.generateProjectStrategyFull(id);
            await loadData();
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

    const toggleArticleSelection = (index: number) => {
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
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} currentPlan={user.planLimits?.planName} />
            {showVideoModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <button onClick={() => setShowVideoModal(false)} className="absolute top-4 right-4 text-white z-10 bg-gray-800 p-2 rounded-full"><X /></button>
                        <iframe className="aspect-video w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" allowFullScreen></iframe>
                    </div>
                </div>
            )}

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
                        {activeSection === 'growth' && <ProjectStrategy_BusinessGrowth chartData={chartData} onOpenVideo={() => setShowVideoModal(true)} commissionValue={(strategyData.meta?.price || 0) * (strategyData.meta?.commissionRate || 0)} />}
                        {activeSection === 'blueprint' && <ProjectStrategy_Blueprint handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} onOpenVideo={() => setShowVideoModal(true)} />}
                        {activeSection === 'avatar' && <ProjectStrategy_AvatarDiagnosis avatars={strategyData.avatars} psychology={strategyData.psychology} benefitsItems={strategyData.modules.web.landingPageTabs.benefits.items} />}
                        {activeSection === 'psychology' && <ProjectStrategy_Psychology psychology={strategyData.psychology} benefitsItems={strategyData.modules.web.landingPageTabs.benefits.items} />}
                        {activeSection === 'web' && <ProjectStrategy_WebSystem projectId={id} lpTabsData={strategyData.modules.web.landingPageTabs} tyTabsData={strategyData.modules.web.thankYouPageTabs} selectedLpTab={selectedLpTab} setSelectedLpTab={setSelectedLpTab} selectedTyTab={selectedTyTab} setSelectedTyTab={setSelectedTyTab} handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} linkedPages={linkedPages} onEditPage={(pid) => navigate(`/dashboard/editor/${pid}`)} pageCount={pageCount} domainCount={globalDomainCount} planLimits={user.planLimits} onUpgrade={() => setShowUpgradeModal(true)} nextPlan={nextPlan} isSimulating={isSimulating} />}
                        {activeSection === 'content' && <ProjectStrategy_Content contentData={strategyData.modules.content} activeArticle={activeArticle} setActiveArticle={setActiveArticle} selectedArticles={selectedArticles} toggleArticleSelection={toggleArticleSelection} handleTooltipHover={handleTooltipHover} handleTooltipLeave={handleTooltipLeave} articleCount={articleCount} planLimits={user.planLimits} onUpgrade={() => setShowUpgradeModal(true)} nextPlan={nextPlan} linkedArticles={linkedArticles} isSimulating={isSimulating} />}
                        {activeSection === 'email' && <ProjectStrategy_Email emailData={strategyData.modules.emails.nurture} avatars={strategyData.avatars} activeEmail={activeEmail} setActiveEmail={setActiveEmail} features={user.planLimits?.features} onUpgrade={() => setShowUpgradeModal(true)} planLimits={user.planLimits} nextPlan={nextPlan} realMessages={realEmailMessages} isSimulating={isSimulating} sequenceCount={globalEmailSequenceCount} />}
                        {activeSection === 'evergreen' && <ProjectStrategy_Evergreen evergreenData={strategyData.modules.emails.evergreen} avatars={strategyData.avatars} activeEvergreenEmail={activeEvergreenEmail} setActiveEvergreenEmail={setActiveEvergreenEmail} features={user.planLimits?.features} onUpgrade={() => setShowUpgradeModal(true)} planLimits={user.planLimits} nextPlan={nextPlan} linkedArticles={linkedArticles} />}
                        {activeSection === 'whatsapp' && <ProjectStrategy_WhatsApp whatsappLaunch={resolvedWhatsAppLaunch} activeWaScript={activeWaScript} setActiveWaScript={setActiveWaScript} onUpgrade={() => setShowUpgradeModal(true)} isLocked={isLaunchLocked} projectId={id} isSimulating={isSimulating} planLimits={user.planLimits} launchCount={globalWhatsAppLaunchCount} />}
                    </Suspense>
                </div>
            </div>
        </div>
    );
};