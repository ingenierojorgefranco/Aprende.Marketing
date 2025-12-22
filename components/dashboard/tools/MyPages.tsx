
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../../services/api';
import { LandingPage, User } from '../../../types';
import { Loader2, LayoutTemplate, PenTool, Globe, Trash2, AlertTriangle, X, Zap, Crown, Settings, MessageCircle, ExternalLink, CheckCircle, PlayCircle } from 'lucide-react';
import { UpgradeModal } from '../UpgradeModal';

interface DashboardContext {
  user: User;
  pageCount: number;
}

export const MyPages: React.FC = () => {
    const navigate = useNavigate();
    const { user, pageCount } = useOutletContext() as DashboardContext;
    const [pages, setPages] = useState<LandingPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageToDelete, setPageToDelete] = useState<LandingPage | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Modals States
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showDomainModal, setShowDomainModal] = useState(false);
    const [selectedPageForDomain, setSelectedPageForDomain] = useState<LandingPage | null>(null);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        try {
            const data = await api.getPages();
            setPages(data);
        } catch (error) {
            console.error("Failed to load pages", error);
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
        setSelectedPageForDomain(page);
        setShowDomainModal(true);
    };

    const closeDomainModal = () => {
        setShowDomainModal(false);
        setSelectedPageForDomain(null);
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
    const maxLandings = user.planLimits?.maxLandings || 3;
    const currentCount = pages.length;
    const usagePercent = Math.min(100, (currentCount / maxLandings) * 100);
    const isAtLimit = currentCount >= maxLandings;
    
    // Plan Logic (Domains)
    const maxDomains = user.planLimits?.maxDomains || 1;
    const currentDomainsCount = pages.filter(p => p.customDomain).length;
    const domainUsagePercent = Math.min(100, (currentDomainsCount / maxDomains) * 100);

    // Color logic for bar
    let progressColor = "bg-green-500";
    if (usagePercent > 50) progressColor = "bg-yellow-500";
    if (usagePercent > 85) progressColor = "bg-red-500";

    let domainProgressColor = "bg-blue-500";
    if (domainUsagePercent > 50) domainProgressColor = "bg-indigo-500";
    if (domainUsagePercent > 90) domainProgressColor = "bg-red-500";

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
                                Tus Páginas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Alta Conversión</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                                Centraliza todas tus ofertas en un solo lugar. Crea, edita y optimiza tus páginas de venta para maximizar tus conversiones.
                            </p>
                        </div>
                        
                        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-md shadow-inner space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2 text-sm">
                                    <span className="text-gray-300 font-medium">Páginas Creadas</span>
                                    <span className="text-white font-bold">{currentCount} / {maxLandings}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${progressColor}`} style={{ width: `${usagePercent}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2 text-sm">
                                    <span className="text-gray-300 font-medium">Dominios Personalizados</span>
                                    <span className="text-white font-bold">{currentDomainsCount} / {maxDomains}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full transition-all duration-1000 ease-out shadow-lg ${domainProgressColor}`} style={{ width: `${domainUsagePercent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                        {isAtLimit ? (
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-orange-900/20 hover:scale-[1.02] border border-yellow-400/20"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Crown className="w-5 h-5 fill-current" /> 
                                    Límite Alcanzado: Subir a PRO
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/dashboard/generator")}
                                className="group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all overflow-hidden bg-primary hover:bg-indigo-600 text-white shadow-primary/25 hover:-translate-y-1"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5 fill-current" /> 
                                    Crear Nueva Página
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        )}
                        
                        <button 
                            onClick={() => setShowVideoModal(true)}
                            className="px-8 py-3 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            <PlayCircle className="w-4 h-4" /> ¿Cómo funciona?
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {pages.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-2xl border border-dashed border-gray-700">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <LayoutTemplate className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Tu lienzo está en blanco</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">Aún no has creado ninguna página. Usa nuestra Inteligencia Artificial para generar tu primera estructura de ventas en segundos.</p>
                    <button 
                        onClick={() => navigate("/dashboard/generator")}
                        className="text-primary border border-primary px-6 py-2.5 rounded-lg hover:bg-primary hover:text-white transition font-medium"
                    >
                        Empezar Ahora
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map((page) => {
                        // ACTUALIZADO: El subdominio ya contiene el ID antepuesto por el backend.
                        // Limpiamos el subdominio para obtener el slug exacto para el enlace.
                        const baseSlug = page.subdomain ? page.subdomain.split(".")[0] : page.id;
                        const publicUrl = `/admin/lp/${baseSlug}`;

                        return (
                            <div key={page.id} className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 min-w-0 pr-3">
                                        <h3 className="font-bold text-lg text-white truncate group-hover:text-primary transition-colors">{page.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                                            <p className="text-xs text-gray-500 truncate">{page.niche}</p>
                                        </div>
                                    </div>
                                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border shadow-sm ${page.isPublished ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                                        {page.isPublished ? "Publicada" : "Borrador"}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mb-6 bg-black/40 p-3 rounded-xl border border-white/5">
                                    <div className="text-center p-1">
                                        <p className="text-lg font-bold text-white">{page.visits}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Visitas</p>
                                    </div>
                                    <div className="text-center p-1 border-l border-white/10">
                                        <p className="text-lg font-bold text-white">{page.conversions}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Leads</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5 mt-auto">
                                    <button onClick={() => navigate(`/dashboard/editor/${page.id}`)} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-medium hover:bg-white/10 hover:text-white flex items-center justify-center gap-2 transition group-hover:border-primary/30">
                                        <PenTool className="w-4 h-4" /> Editar Diseño
                                    </button>
                                    
                                    <button 
                                        onClick={() => openDomainModal(page)}
                                        className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition border ${
                                            page.customDomain 
                                            ? "bg-green-900/20 text-green-400 border-green-900/50 hover:bg-green-900/30" 
                                            : "bg-transparent text-gray-400 border-gray-700 hover:text-white hover:border-gray-500"
                                        }`}
                                    >
                                        {page.customDomain ? <CheckCircle className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        {page.customDomain ? "Ver Dominio" : "Añadir Dominio"}
                                    </button>

                                    <div className="flex gap-2">
                                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white flex items-center justify-center gap-2 transition text-xs font-medium">
                                            <LayoutTemplate className="w-3.5 h-3.5" /> Ver Online
                                        </a>
                                        <button onClick={() => handleTogglePublish(page)} className={`flex-1 py-2.5 border rounded-lg flex items-center justify-center gap-2 transition text-xs font-medium ${page.isPublished ? "border-orange-900/30 text-orange-500/80 hover:bg-orange-900/10 hover:text-orange-400" : "border-green-900/30 text-green-500/80 hover:bg-green-900/10 hover:text-green-400"}`}>
                                            <Globe className="w-3.5 h-3.5" /> {page.isPublished ? "Pausar" : "Publicar"}
                                        </button>
                                    </div>

                                    <button onClick={() => setPageToDelete(page)} className="w-full py-2 text-red-500/60 hover:text-red-400 flex items-center justify-center gap-1.5 transition text-xs hover:bg-red-900/10 rounded-lg">
                                        <Trash2 className="w-3.5 h-3.5" /> Eliminar Página
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODALS */}
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                currentPlan={user.planLimits?.planName}
                reason="Has alcanzado el límite de páginas de tu plan. Actualiza para crear más embudos."
            />

            {showVideoModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-blue-500" /> Tutorial: Creación de Páginas
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-6 h-6"/>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95">
                        <button onClick={closeDomainModal} className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-gray-800 transition">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="text-center mb-6">
                            {selectedPageForDomain.customDomain ? (
                                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-lg shadow-green-500/10">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                    <Globe className="w-8 h-8 text-blue-500" />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {selectedPageForDomain.customDomain ? "Esta web tiene dominio" : "Dominios Personalizados"}
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {selectedPageForDomain.customDomain 
                                    ? "Tu página ya está conectada y accesible." 
                                    : "Personaliza tu enlace como www.tuempresa.com. Esto aumenta la confianza y tus ventas."
                                }
                            </p>
                        </div>
                        {selectedPageForDomain.customDomain ? (
                            <div className="space-y-4">
                                <div className="bg-black/40 border border-green-500/30 rounded-xl p-4 text-center">
                                    <p className="text-xs text-green-500 font-bold uppercase tracking-wider mb-1">Dominio Configurado</p>
                                    <a href={`https://${selectedPageForDomain.customDomain}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-white hover:text-green-400 transition hover:underline">
                                        {selectedPageForDomain.customDomain}
                                    </a>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <a href={`https://${selectedPageForDomain.customDomain}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold transition shadow-lg shadow-green-900/20"><ExternalLink className="w-4 h-4" /> Visitar</a>
                                    <a href={`https://wa.me/573000000000?text=Hola, necesito soporte para cambiar el dominio de mi página ID: ${selectedPageForDomain.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white font-medium transition"><Settings className="w-4 h-4" /> Soporte</a>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <div className="flex items-start gap-3 mb-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /><p className="text-sm text-gray-300">Certificado SSL (Candado Seguro) Incluido</p></div>
                                    <div className="flex items-start gap-3"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5" /><p className="text-sm text-gray-300">Servidores CDN de Alta Velocidad</p></div>
                                </div>
                                <div className="text-center"><p className="text-xs text-blue-300 font-bold bg-blue-900/20 py-1.5 px-3 rounded-full inline-block border border-blue-500/20">ℹ️ En tu plan actual puedes añadir {maxDomains} dominios</p></div>
                                {currentDomainsCount >= maxDomains ? (
                                    <div className="space-y-3">
                                        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-red-500 shrink-0" /><p className="text-sm text-red-200">Has alcanzado el límite de dominios de tu plan.</p></div>
                                        <button onClick={() => setShowUpgradeModal(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold border border-yellow-400/20">Actualizar Plan</button>
                                    </div>
                                ) : (
                                    <a href={`https://wa.me/573000000000?text=Hola, quiero configurar un dominio personalizado para mi página ID: ${selectedPageForDomain.id}`} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"><MessageCircle className="w-5 h-5" /> Quiero configurar mi dominio</a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {pageToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
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
        </div>
    );
};
