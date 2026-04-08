import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { LandingPage, User, Project } from '../../../types';
import { Loader2, LayoutTemplate, PenTool, Globe, Trash2, AlertTriangle, X, Zap, Crown, Settings, MessageCircle, ExternalLink, CheckCircle, PlayCircle, Briefcase, ChevronDown, ChevronUp, Info, Plus, ArrowLeft, ChevronRight } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';
import { DeletionRestrictionModal } from '../DeletionRestrictionModal';

interface DashboardContext {
  user: User;
  pageCount: number;
  isSimulating: boolean;
}

export const MyPages: React.FC = () => {
    const navigate = useNavigate();
    const { user, pageCount, isSimulating } = useOutletContext() as DashboardContext;
    const [pages, setPages] = useState<LandingPage[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageToDelete, setPageToDelete] = useState<LandingPage | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

    // Modals States
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeProjectId, setUpgradeProjectId] = useState<string | undefined>(undefined);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [selectedPageForDomain, setSelectedPageForDomain] = useState<LandingPage | null>(null);
    
    // --- Nuevo Estado para Restricción de Eliminación ---
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [pageToRestrict, setPageToRestrict] = useState<LandingPage | null>(null);
    // ----------------------------------------------------

    // Accordion State
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [pagesData, projectsData] = await Promise.all([
                api.getPages(),
                api.getProjects()
            ]);
            setPages(pagesData);
            setProjects(projectsData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublish = async (page: LandingPage) => {
        const newStatus = !page.isPublished;
        const updatedPage = { ...page, isPublished: newStatus };
        try {
            await api.updatePage(updatedPage);
            setPages(prev => prev.map(p => (p.id === page.id ? updatedPage : p)));
        } catch (error) {
            alert("No se pudo cambiar el estado de publicación.");
        }
    };

    const handleDeleteAttempt = (page: LandingPage) => {
        if (user.role !== 'admin') {
            setPageToRestrict(page);
            setShowRestrictionModal(true);
        } else {
            setPageToDelete(page);
        }
    };

    const confirmDeletePage = async () => {
        if (!pageToDelete) return;
        setDeleting(true);
        try {
            await api.deletePage(pageToDelete.id);
            setPages(prev => prev.filter(p => p.id !== pageToDelete.id));
            setPageToDelete(null);
        } catch {
            alert("Error eliminando la página.");
        } finally {
            setDeleting(false);
        }
    };

    const openDomainModal = (page: LandingPage) => {
        // Verificar si el proyecto asociado permite dominios
        const project = projects.find(p => p.id === page.projectId);
        const planSlug = project?.planSlug || user.planLimits?.planName;

        if (planSlug === 'starter' && !isRealAdmin) {
            setUpgradeProjectId(page.projectId);
            setShowUpgradeModal(true);
            return;
        }

        setSelectedPageForDomain(page);
        setShowDomainModal(true);
        setActiveAccordion(null);
    };

    const closeDomainModal = () => {
        setShowDomainModal(false);
        setSelectedPageForDomain(null);
    };

    const handleProjectSelect = (projectId: string) => {
        // Redirigir a la estrategia del proyecto en la sección de sistema web
        navigate(`/dashboard/projects/${projectId}/strategy?section=web`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p>Cargando tus páginas...</p>
            </div>
        );
    }

    // Plan Logic (Pages)
    const isRealAdmin = user.role === 'admin' && !isSimulating;
    const maxLandings = user.planLimits?.maxLandings || 1;
    const currentCount = pages.length;
    const usagePercent = Math.min(100, (currentCount / maxLandings) * 100);
    const isAtLimit = !isRealAdmin && currentCount >= maxLandings;
    
    // Plan Logic (Domains)
    const maxDomains = user.planLimits?.maxDomains || 1;
    const currentDomainsCount = pages.filter(p => p.customDomain).length;
    const domainUsagePercent = Math.min(100, (currentDomainsCount / maxDomains) * 100);

    // Color logic for bar
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = isRealAdmin ? "bg-green-500" : "bg-red-500";

    let domainProgressColor = "bg-blue-500";
    if (domainUsagePercent > 50) domainProgressColor = "bg-indigo-500";
    if (domainUsagePercent > 90) domainProgressColor = isRealAdmin ? "bg-blue-500" : "bg-red-500";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            
            {/* HERO HEADER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-6 text-center md:text-left w-full">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 shadow-sm">
                                <LayoutTemplate className="w-3 h-3 text-primary" /> Gestor de Landing Pages
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                                Activa tu Página Web Profesional <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">y captura clientes en automático</span>
                            </h1>
                            <p className="text-white pt-[0.8em] pb-[0.6em] text-[1.2rem] max-w-xl leading-[1.625]">
                                Centraliza todas tus ofertas en un solo lugar. Crea, edita y optimiza tus páginas de venta para maximizar tus conversiones.
                            </p>
                        </div>
                        
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2 text-sm">
                                    <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">{isRealAdmin ? 'Páginas (Superusuario)' : 'Páginas Web Creadas/Desbloqueadas'}</span>
                                    <span className="text-white font-bold">{currentCount} / {isRealAdmin ? '∞' : maxLandings}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${isRealAdmin ? (currentCount > 0 ? 100 : 0) : usagePercent}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2 text-sm">
                                    <span className="text-gray-300 font-medium text-[1rem] leading-[2rem]">Dominios Personalizados</span>
                                    <span className="text-white font-bold">{currentDomainsCount} / {isRealAdmin ? '∞' : maxDomains}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${domainProgressColor}`} style={{ width: `${isRealAdmin ? (currentDomainsCount > 0 ? 100 : 0) : domainUsagePercent}%` }}></div>
                                </div>
                            </div>
                            
                            {isAtLimit && (
                                <div className="mt-3 flex items-start gap-2 text-xs text-yellow-300 bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
                                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                    <span className="text-[1rem] leading-[1.5rem] text-white">Has alcanzado el límite de tu plan. Actualiza a Pro para Crear más Páginas de Captura</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 shrink-0 w-full md:w-[400px]">
                        {/* Contenedor de Video Interactivo */}
                        <div 
                            className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                        >
                            <iframe 
                                className="w-full h-full rounded-2xl"
                                src="https://www.youtube.com/embed/WUqaWRJG92c?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Botones centrados debajo del video */}
                        <div className="flex flex-col gap-3">
                            {isAtLimit ? (
                                <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02] border border-yellow-400/20 w-full"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Crown className="w-5 h-5 fill-current" /> 
                                        Límite Alcanzado: Subir a PRO
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsGeneratorOpen(true)}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden bg-primary hover:bg-indigo-600 text-white shadow-primary/25 hover:-translate-y-1 w-full"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Zap className="w-5 h-5 fill-current" /> 
                                        Crear Nueva Página
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: MIS PÁGINAS */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex items-center gap-4 border-l-4 border-primary pl-4 py-1 pb-5">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                            <LayoutTemplate className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Mis Páginas</h2>
                            <p className="text-white font-medium pt-2.5 text-[1.2em]">Gestiona tus páginas de captura fácilmente</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isGeneratorOpen ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="mx-auto bg-gray-900 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden min-h-[600px] flex flex-col relative transition-all duration-500 max-w-5xl">
                        <div className="bg-primary/10 p-8 text-center border-b border-primary/10 relative">
                            <button onClick={() => setIsGeneratorOpen(false)} className="absolute top-6 left-6 p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Generador de Landing Pages IA</h2>
                            <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Paso 0: Selecciona tu Proyecto</p>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto">
                            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center py-10">
                                <div className="max-w-2xl mx-auto">
                                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Selecciona tu Proyecto</span>
                                    </h2>
                                    <p className="text-gray-400 text-lg leading-relaxed font-medium">Para generar una página que verdaderamente venda, nuestra inteligencia artificial necesita conocer tu estrategia, avatar y producto.</p>
                                </div>

                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                                    {/* CARD: CREAR NUEVO PROYECTO */}
                                    <div 
                                        className="p-10 bg-[#0B0B0B] border-2 border-dashed border-white/10 rounded-[3rem] hover:border-primary/50 hover:bg-primary/5 transition-all text-center group flex flex-col items-center justify-center shadow-2xl relative overflow-hidden h-full cursor-pointer min-h-[400px]" 
                                        onClick={() => navigate('/dashboard/projects')}
                                    >
                                        <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-600 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-lg mb-6">
                                            <Plus className="w-10 h-10" />
                                        </div>
                                        <h4 className="text-white font-black text-2xl group-hover:text-primary transition-colors uppercase tracking-tight">Crear Nuevo Proyecto</h4>
                                        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Define un nuevo nicho para generar ganchos</p>
                                    </div>

                                    {projects.map((project) => (
                                        <div 
                                            key={project.id}
                                            onClick={() => handleProjectSelect(project.id)}
                                            className="p-10 bg-[#0B0B0B] border border-white/5 rounded-[3rem] hover:border-primary/50 hover:bg-primary/5 transition-all text-left group flex flex-col shadow-2xl cursor-pointer relative overflow-hidden h-full"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex items-center gap-5 mb-8">
                                                <div className="p-4 bg-gray-800 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors shadow-inner">
                                                    <Briefcase className="w-8 h-8" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-black text-2xl group-hover:text-primary transition-colors">{project.name}</h4>
                                                    <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black mt-2">{project.niche}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 mb-10">
                                                <p className="text-[11px] text-gray-600 font-black uppercase tracking-widest mb-3">Descripción del Proyecto</p>
                                                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                                    {project.shortDescription || (project.description ? project.description.replace(/<[^>]*>?/gm, '') : "Sin descripción estratégica.")}
                                                </p>
                                            </div>
                                            <button 
                                                className="w-full py-5 bg-primary hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-95"
                                            >
                                                Seleccionar <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : pages.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <LayoutTemplate className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Tu lienzo está en blanco</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">Aún no has creado ninguna página. Usa nuestra Inteligencia Artificial para generar tu primera estructura de ventas en segundos.</p>
                    <button 
                        onClick={() => setIsGeneratorOpen(true)}
                        className="text-primary border border-primary px-6 py-2.5 rounded-lg hover:bg-primary hover:text-white transition font-medium"
                    >
                        Empezar Ahora
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <button 
                        onClick={() => isAtLimit ? setShowUpgradeModal(true) : setIsGeneratorOpen(true)}
                        className="bg-[#111] border-2 border-dashed border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 group hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/5 transition-all duration-500 min-h-[400px] shadow-2xl"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-600 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-all shadow-lg">
                            <Plus className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-black transition-colors" style={{ color: 'white', fontSize: '2em' }}>Crear Nueva Página</h4>
                            <p className="mt-2 font-bold opacity-60" style={{ color: 'gray', paddingTop: '1em', fontSize: '1.2em' }}>
                                {isAtLimit 
                                    ? "Has alcanzado el límite de tu plan. Actualiza a Pro para Crear más Páginas de Captura."
                                    : "Diseño de alta conversión generado por IA"
                                }
                            </p>
                        </div>
                    </button>
                    {pages.map((page) => {
                        // ACTUALIZADO: El subdominio ya contiene el ID antepuesto por el backend.
                        // Limpiamos el subdominio para obtener el slug exacto para el enlace.
                        const baseSlug = page.subdomain ? page.subdomain.split(".")[0] : page.id;
                        const publicUrl = `/admin/lp/${baseSlug}`;

                        return (
                            /* Actualización: Rediseño Premium Dark con bordes redondeados [2.5rem], fondo #111 y efectos de iluminación suaves al pasar el ratón para una experiencia de usuario más sofisticada */
                            /* 22/05/2024 19:15 */
                            <div key={page.id} className="bg-[#111] rounded-[2.5rem] border border-white/5 hover:border-[#FF5A1F]/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden cursor-pointer shadow-2xl">
                                {/* Accent Line - Unificado con Email Marketing */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-600 opacity-80"></div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex flex-col items-start text-left mb-6 pt-4">
                                        <div className="mb-4">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${page.isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                                                {page.isPublished ? "Publicada" : "Borrador"}
                                            </span>
                                        </div>
                                        <div className="w-full px-4">
                                            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                                <h3 className="text-2xl font-black text-white group-hover:text-[#FF5A1F] transition-colors duration-300">{page.name}</h3>
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mb-4 bg-black/40 p-4 rounded-2xl border border-white/5 overflow-hidden">
                                        <div className="text-center p-1">
                                            <p className="text-xl font-black text-white">{page.visits}</p>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Visitas</p>
                                        </div>
                                        <Link 
                                            to={`/dashboard/crm?pageId=${page.id}&pageName=${encodeURIComponent(page.name)}`}
                                            className="text-center p-1 border-l border-white/10 hover:bg-[#FF5A1F]/10 transition-all cursor-pointer group/stat"
                                        >
                                            <p className="text-xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">{page.conversions}</p>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-[#FF5A1F] transition-colors">Leads</p>
                                        </Link>
                                    </div>

                                    <div className="mb-8 bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors">
                                            <Briefcase className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <Link 
                                            to={page.projectId ? `/dashboard/projects/${page.projectId}/strategy` : "/dashboard/projects"}
                                            target="_blank"
                                            className="text-base font-medium text-gray-400 hover:text-[#FF5A1F] transition-colors line-clamp-1"
                                        >
                                            Proyecto: {page.projectName || 'Sin Proyecto'}
                                        </Link>
                                    </div>

                                    <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
                                        <button onClick={() => navigate(`/dashboard/editor/${page.id}`)} className="w-full py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#FF5A1F]/20">
                                            <PenTool className="w-4 h-4" /> Editar Diseño
                                        </button>
                                        
                                        <button 
                                            onClick={() => openDomainModal(page)}
                                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition border ${
                                                page.customDomain 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-white" 
                                                : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white"
                                            }`}
                                        >
                                            {page.customDomain ? <CheckCircle className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                            {page.customDomain ? "Ver Dominio" : "Añadir Dominio"}
                                        </button>

                                        <div className="flex gap-2">
                                            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 border border-indigo-500/30 bg-indigo-500/10 rounded-xl text-indigo-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center gap-2 transition text-[10px] font-black uppercase tracking-widest">
                                                <LayoutTemplate className="w-3.5 h-3.5" /> Ver Online
                                            </a>
                                            <button onClick={() => handleTogglePublish(page)} className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 transition text-[10px] font-black uppercase tracking-widest ${page.isPublished ? "border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-600 hover:text-white" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white"}`}>
                                                <Globe className="w-3.5 h-3.5" /> {page.isPublished ? "Pausar" : "Publicar"}
                                            </button>
                                        </div>

                                        <button onClick={() => handleDeleteAttempt(page)} className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition rounded-xl">
                                            <Trash2 className="w-3.5 h-3.5" /> Eliminar Página
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODALS */}
            {showUpgradeModal && (
                <UpgradeModal 
                    isOpen={showUpgradeModal} 
                    onClose={() => { setShowUpgradeModal(false); setUpgradeProjectId(undefined); }} 
                    user={user}
                    currentPlan={projects.find(p => p.id === upgradeProjectId)?.planSlug || user.planLimits?.planName}
                    projectId={upgradeProjectId}
                    userId={user.id}
                    reason="El plan Starter no incluye dominios personalizados. Actualiza para profesionalizar tu marca."
                />
            )}

            {showVideoModal && (
                <div 
                    onClick={() => setShowVideoModal(false)}
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
                    >
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-primary" /> Tutorial: Creación de Páginas
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Cómo crear páginas de venta" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-6 bg-gray-900">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Aprende a utilizar el generador inteligente para crear páginas de alta conversión en segundos, optimizadas para móviles y ventas directas.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showDomainModal && selectedPageForDomain && (
                <div 
                    onClick={closeDomainModal}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl p-8 relative animate-in zoom-in-95 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        <button onClick={closeDomainModal} className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-gray-800 transition">
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
                    </div>
                </div>
            )}

            {pageToDelete && (
                <div 
                    onClick={() => setPageToDelete(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 text-red-500 font-bold text-lg">
                                <div className="p-2 bg-red-900/20 rounded-full"><AlertTriangle className="w-6 h-6" /></div>
                                Eliminar Página
                            </div>
                            <button onClick={() => setPageToDelete(null)} className="text-gray-500 hover:text-white bg-gray-800 p-1 rounded-full hover:bg-gray-700 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                            ¿Estás seguro de que quieres eliminar <b>"{pageToDelete.name}"</b>? <br />
                            Esta acción es irreversible y perderás todas las estadísticas asociadas.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setPageToDelete(null)} disabled={deleting} className="px-4 py-2.5 rounded-lg border border-gray-700 hover:bg-gray-800 text-white transition text-sm font-medium">Cancelar</button>
                            <button onClick={confirmDeletePage} disabled={deleting} className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition text-sm flex items-center gap-2 shadow-lg shadow-red-900/20">
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL RESTRICCIÓN DE ELIMINACIÓN */}
            <DeletionRestrictionModal 
                isOpen={showRestrictionModal} 
                onClose={() => setShowRestrictionModal(false)}
                itemName={pageToRestrict ? `Página: ${pageToRestrict.name}` : ''}
                userEmail={user.email}
                userName={user.name}
            />
        </div>
    );
};