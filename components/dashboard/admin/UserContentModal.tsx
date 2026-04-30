import React, { useState } from 'react';
import { User, UserSubscription, EmailMessage, Plan } from '../../../types';
import { api } from '../../../services/api';
import { X, ChevronDown, ChevronUp, Folder, FileText, Globe, Eye, Loader2, Trash2, Mail, Smartphone, Zap, CreditCard, Power, Edit, Check, Calendar } from 'lucide-react';

////////// Actualización: Creación de archivo independiente para carga dinámica - 05/06/2025 21:30 //////////
const UserContentModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const [loadedData, setLoadedData] = useState<{
        plans: UserSubscription[] | null;
        systemPlans: Plan[] | null;
        projects: any[] | null;
        pages: any[] | null;
        articles: any[] | null;
        emails: any[] | null;
        whatsapp: any[] | null;
        hooks: any[] | null;
    }>({ plans: null, systemPlans: null, projects: null, pages: null, articles: null, emails: null, whatsapp: null, hooks: null });

    const [expandedSection, setExpandedSection] = useState<'plans' | 'projects' | 'pages' | 'articles' | 'emails' | 'whatsapp' | 'hooks' | null>(null);
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

    const formatRelativeTime = (dateInput: any) => {
        if (!dateInput) return "N/A";
        const date = new Date(dateInput);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `Hace ${diffInSeconds} segundos`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    };

    const slugify = (text: string) => text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');

    // Pagination and Filtering states
    const [selectedProjectArticles, setSelectedProjectArticles] = useState<string>('all');
    const [selectedProjectHooks, setSelectedProjectHooks] = useState<string>('all');
    const [currentPageArticles, setCurrentPageArticles] = useState(1);
    const [currentPageHooks, setCurrentPageHooks] = useState(1);
    const itemsPerPage = 10;

    // Email Messages states
    const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);
    const [sequenceMessages, setSequenceMessages] = useState<EmailMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const toggleSection = async (section: 'plans' | 'projects' | 'pages' | 'articles' | 'emails' | 'whatsapp' | 'hooks') => {
        if (expandedSection === section) {
            setExpandedSection(null);
            return;
        }

        setExpandedSection(section);

        // Lazy Load if data is null
        if (loadedData[section] === null) {
            setLoadingSection(section);
            try {
                let data;
                if (section === 'plans') {
                    const [subs, systemPlans] = await Promise.all([
                        api.getUserSubscriptions(user.id),
                        api.getPlans()
                    ]);
                    data = subs;
                    setLoadedData(prev => ({ ...prev, systemPlans }));
                } else if (section === 'articles') {
                    // Carga especial: Artículos DB + Proyectos (para extraer JSON)
                    console.log("Admin: Cargando artículos para usuario", user.id);
                    const [dbArticles, projects] = await Promise.all([
                        api.getAdminUserResources(user.id, 'articles'),
                        api.getAdminUserResources(user.id, 'projects')
                    ]);

                    console.log("Admin: Artículos en DB:", dbArticles.length);
                    console.log("Admin: Proyectos encontrados:", projects.length);

                    // Procesar artículos del JSON de cada proyecto
                    const jsonArticles: any[] = [];
                    projects.forEach((p: any) => {
                        console.log(`Admin: Procesando proyecto [${p.id}] ${p.name}`);
                        let strategy = p.strategy_json;
                        
                        // Asegurar que sea objeto (aunque ya lo haga el backend, por si acaso)
                        if (typeof strategy === 'string') {
                            try {
                                strategy = JSON.parse(strategy);
                            } catch (e) {
                                console.error(`Admin: Error al parsear strategy_json del proyecto ${p.id}`, e);
                                strategy = null;
                            }
                        }

                        // Intentar encontrar los artículos en diferentes rutas posibles
                        // El usuario indica que están en 'content' directamente o en 'modules.content'
                        const contentList = strategy?.modules?.content || strategy?.content;
                        
                        if (contentList && Array.isArray(contentList)) {
                            console.log(`Admin: Encontrados ${contentList.length} artículos en el JSON del proyecto ${p.id}`);
                            contentList.forEach((art: any) => {
                                jsonArticles.push({
                                    ...art,
                                    id: `${p.id}_${art.id || art.title}`, // ID compuesto para identificarlo
                                    projectId: p.id,
                                    isJson: true,
                                    is_generated: false,
                                    seo_score: art.seo_score || 0
                                });
                            });
                        } else {
                            console.log(`Admin: No se encontraron artículos en el JSON del proyecto ${p.id}. Estructura:`, strategy);
                        }
                    });

                    // Combinar y evitar duplicados si ya están en DB (por título)
                    const combined = [...dbArticles.map((a: any) => ({ ...a, isFromDb: true }))];
                    jsonArticles.forEach(ja => {
                        if (!combined.some(ca => ca.title === ja.title)) {
                            combined.push(ja);
                        }
                    });

                    console.log("Admin: Total artículos combinados:", combined.length);
                    data = combined;
                    // También guardamos los proyectos si no estaban cargados
                    if (loadedData.projects === null) {
                        setLoadedData(prev => ({ ...prev, projects }));
                    }
                } else if (section === 'hooks') {
                    const [hooks, projects] = await Promise.all([
                        api.getAdminUserResources(user.id, 'hooks'),
                        loadedData.projects === null ? api.getAdminUserResources(user.id, 'projects') : Promise.resolve(loadedData.projects)
                    ]);
                    data = hooks;
                    if (loadedData.projects === null) {
                        setLoadedData(prev => ({ ...prev, projects }));
                    }
                } else {
                    data = await api.getAdminUserResources(user.id, section);
                }
                setLoadedData(prev => ({ ...prev, [section]: data }));
            } catch (error) {
                console.error(`Error loading ${section}`, error);
            } finally {
                setLoadingSection(null);
            }
        }
    };

    const handleToggleSubscription = async (sub: UserSubscription) => {
        const newStatus = sub.status === 'active' ? 'inactive' : 'active';
        if (!window.confirm(`¿Estás seguro de ${newStatus === 'active' ? 'activar' : 'deshabilitar'} este plan?`)) return;

        try {
            await api.adminUpdateSubscription(sub.id, { status: newStatus });
            setLoadedData(prev => ({
                ...prev,
                plans: prev.plans?.map(s => s.id === sub.id ? { ...s, status: newStatus } : s) || null
            }));
        } catch (error) {
            alert("Error al actualizar la suscripción.");
        }
    };

    const handleActivatePlan = async (planId: string) => {
        if (!window.confirm(`¿Estás seguro de asignar el plan "${planId}" a este usuario?`)) return;
        
        setLoadingSection('plans-action');
        try {
            const newSub = await api.adminCreateSubscription!(user.id, planId);
            setLoadedData(prev => ({
                ...prev,
                plans: [...(prev.plans || []), newSub]
            }));
        } catch (error) {
            console.error("Error activating plan:", error);
            alert("Error al activar el plan.");
        } finally {
            setLoadingSection(null);
        }
    };

    const handleLoadSequenceMessages = async (sequenceId: string) => {
        if (selectedSequenceId === sequenceId) {
            setSelectedSequenceId(null);
            setSequenceMessages([]);
            return;
        }
        
        setSelectedSequenceId(sequenceId);
        setLoadingMessages(true);
        try {
            const messages = await api.getSequenceMessages(sequenceId);
            setSequenceMessages(messages);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleDeleteEmailMessage = async (messageId: string) => {
        if (!window.confirm("¿Estás seguro de eliminar este correo?")) return;
        try {
            await api.deleteEmailMessage(messageId);
            setSequenceMessages(prev => prev.filter(m => m.id !== messageId));
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Error al eliminar el correo.");
        }
    };

    const handleDeleteAsset = async (type: 'projects' | 'pages' | 'articles' | 'emails' | 'whatsapp' | 'hooks', id: string, name: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${name}" permanentemente? Esta acción no se puede deshacer.`)) return;
        
        try {
            if (type === 'pages') await api.deletePage(id);
            else if (type === 'projects') await api.deleteProject(id);
            else if (type === 'articles') {
                const article = loadedData.articles?.find(a => String(a.id) === String(id));
                if (article?.isJson) {
                    // Borrado de JSON: Actualizar el proyecto
                    const project = loadedData.projects?.find(p => String(p.id) === String(article.projectId));
                    if (project) {
                        // Asegurar que strategy_json sea un objeto
                        let strategy = project.strategy_json;
                        if (typeof strategy === 'string') {
                            try { strategy = JSON.parse(strategy); } catch (e) { console.error(e); }
                        }
                        
                        if (strategy) {
                            const newStrategy = { ...strategy };
                            const articleIdInJson = article.id.split('_')[1];
                            let foundAndRemoved = false;

                            // Intentar borrar en modules.content
                            if (newStrategy.modules?.content && Array.isArray(newStrategy.modules.content)) {
                                const initialLen = newStrategy.modules.content.length;
                                newStrategy.modules.content = newStrategy.modules.content.filter((a: any) => String(a.id || a.title) !== String(articleIdInJson));
                                if (newStrategy.modules.content.length < initialLen) foundAndRemoved = true;
                            }

                            // Intentar borrar en content (raíz) si no se borró antes
                            if (!foundAndRemoved && newStrategy.content && Array.isArray(newStrategy.content)) {
                                const initialLen = newStrategy.content.length;
                                newStrategy.content = newStrategy.content.filter((a: any) => String(a.id || a.title) !== String(articleIdInJson));
                                if (newStrategy.content.length < initialLen) foundAndRemoved = true;
                            }

                            if (foundAndRemoved) {
                                console.log("Admin: Artículo eliminado del JSON, guardando proyecto...");
                                await api.adminUpdateProject(project.id, { strategy_json: newStrategy });
                                // Actualizar cache local de proyectos
                                setLoadedData(prev => ({
                                    ...prev,
                                    projects: prev.projects?.map(p => p.id === project.id ? { ...p, strategy_json: newStrategy } : p) || null
                                }));
                            } else {
                                console.warn("Admin: No se encontró el artículo en el JSON para borrar", articleIdInJson);
                            }
                        }
                    }
                } else {
                    await api.deleteArticle(id);
                }
            }
            else if (type === 'emails') await api.deleteEmailSequence(id);
            else if (type === 'whatsapp') await api.deleteWhatsAppLaunch(id);
            else if (type === 'hooks') await api.deleteProjectHook(id);
            
            // Actualizar estado local
            setLoadedData(prev => ({
                ...prev,
                [type]: prev[type]?.filter((item: any) => String(item.id) !== String(id)) || null
            }));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error al eliminar el activo.");
        }
    };

    return (
        <div 
            onClick={() => onClose()}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[80vh]"
            >
                <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-400" /> Contenido de {user.name}
                        </h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    
                    {/* Planes Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('plans')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <CreditCard className="w-5 h-5 text-indigo-400" /> Planes
                            </div>
                            {expandedSection === 'plans' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'plans' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'plans' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2 pl-2">Id</th>
                                                <th className="pb-2">Título de Plan</th>
                                                <th className="pb-2">Fecha Creación</th>
                                                <th className="pb-2">Prox Facturación</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {/* Always show Starter plan */}
                                            <tr className="hover:bg-white/[0.02]">
                                                <td className="py-2 pl-2 font-mono text-[10px] text-gray-500">base-starter</td>
                                                <td className="py-2 font-bold text-indigo-400">Plan Starter (Registro)</td>
                                                <td className="py-2">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                <td className="py-2 text-gray-500">Gratuito / Permanente</td>
                                                <td className="py-2 text-right pr-2">
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded font-bold uppercase">Activo</span>
                                                </td>
                                            </tr>
                                            {/* System Plans management */}
                                            {loadedData.systemPlans && loadedData.systemPlans.filter(p => p.slug !== 'starter').map((plan: Plan) => {
                                                const sub = loadedData.plans?.find(s => s.planName === plan.name || String(s.id).includes(plan.slug));
                                                const isActive = sub?.status === 'active';
                                                
                                                return (
                                                    <tr key={plan.id} className="hover:bg-white/[0.02]">
                                                        <td className="py-2 pl-2 font-mono text-[10px] text-gray-500">{plan.id}</td>
                                                        <td className="py-2">
                                                            <div className="font-medium">{plan.name}</div>
                                                            <div className="text-[10px] text-gray-500">{plan.priceMonthly} {plan.currency}/mes</div>
                                                        </td>
                                                        <td className="py-2">{sub ? new Date(sub.createdAt).toLocaleDateString() : '-'}</td>
                                                        <td className="py-2">
                                                            {isActive ? (
                                                                <span className="text-blue-400">Activo</span>
                                                            ) : sub ? (
                                                                <span className="text-gray-500 italic">Inactivo</span>
                                                            ) : (
                                                                <span className="text-gray-600 italic">No asignado</span>
                                                            )}
                                                        </td>
                                                        <td className="py-2 text-right pr-2">
                                                            {loadingSection === 'plans-action' ? (
                                                                <Loader2 className="w-4 h-4 animate-spin text-gray-500 ml-auto" />
                                                            ) : sub ? (
                                                                <button 
                                                                    onClick={() => handleToggleSubscription(sub)}
                                                                    className={`px-3 py-1 rounded text-[10px] font-bold transition ${isActive ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60' : 'bg-green-900/40 text-green-400 hover:bg-green-900/60'}`}
                                                                >
                                                                    {isActive ? 'DESACTIVAR' : 'ACTIVAR'}
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleActivatePlan(plan.id)}
                                                                    className="px-3 py-1 rounded text-[10px] font-bold bg-indigo-900/40 text-indigo-400 hover:bg-indigo-900/60 transition"
                                                                >
                                                                    ASIGNAR
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Projects Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('projects')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Folder className="w-5 h-5 text-yellow-500" /> Proyectos
                            </div>
                            {expandedSection === 'projects' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'projects' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'projects' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.projects && loadedData.projects.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2 pl-2">Nombre</th>
                                                <th className="pb-2">Nicho</th>
                                                <th className="pb-2">Objetivo</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.projects.map((p: any) => (
                                                <tr key={p.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-medium">{p.name}</td>
                                                    <td className="py-2">{p.niche}</td>
                                                    <td className="py-2 text-blue-400">{p.main_goal}</td>
                                                    <td className="py-2 text-right pr-2">
                                                        <button 
                                                            onClick={() => handleDeleteAsset('projects', p.id, p.name)}
                                                            className="p-1.5 text-red-500 hover:bg-red-900/20 rounded transition"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay proyectos creados.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Landing Pages Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('pages')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Globe className="w-5 h-5 text-green-500" /> Landing Pages
                            </div>
                            {expandedSection === 'pages' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'pages' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'pages' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.pages && loadedData.pages.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2 pl-2">Nombre</th>
                                                <th className="pb-2 text-right">Visitas</th>
                                                <th className="pb-2 text-right">Leads</th>
                                                <th className="pb-2 text-center">Dominio</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.pages.map((p: any) => (
                                                <tr key={p.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-medium">{p.name}</td>
                                                    <td className="py-2 text-right font-mono">{p.visits}</td>
                                                    <td className="py-2 text-right font-mono">{p.conversions || 0}</td>
                                                    <td className="py-2 text-center">
                                                        {p.customDomain || p.custom_domain ? (
                                                            <Check className="w-4 h-4 text-green-500 mx-auto" />
                                                        ) : (
                                                            <span className="text-red-500 font-bold">x</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 text-right pr-2 flex justify-end gap-1">
                                                        <button 
                                                            onClick={() => {
                                                                const pageSlug = slugify(p.name);
                                                                window.open(`https://aprende.marketing/admin/lp/${p.id}-${pageSlug}`, '_blank');
                                                            }}
                                                            className="p-1.5 text-blue-400 hover:bg-blue-900/20 rounded transition"
                                                            title="Ver Página"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteAsset('pages', p.id, p.name)}
                                                            className="p-1.5 text-red-500 hover:bg-red-900/20 rounded transition"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay páginas creadas.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Articles Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('articles')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <FileText className="w-5 h-5 text-purple-500" /> Artículos
                            </div>
                            {expandedSection === 'articles' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'articles' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'articles' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.articles && loadedData.articles.length > 0 ? (
                                    <>
                                        {/* Project Filter */}
                                        <div className="mb-4 flex items-center gap-3">
                                            <label className="text-xs text-gray-400 uppercase font-bold">Filtrar por Proyecto:</label>
                                            <select 
                                                value={selectedProjectArticles}
                                                onChange={(e) => {
                                                    setSelectedProjectArticles(e.target.value);
                                                    setCurrentPageArticles(1);
                                                }}
                                                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="all">Todos los proyectos</option>
                                                {loadedData.projects?.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <table className="w-full text-xs text-left">
                                            <thead className="text-gray-500 uppercase">
                                                <tr>
                                                    <th className="pb-2 pl-2">Título</th>
                                                    <th className="pb-2">Procedencia</th>
                                                    <th className="pb-2">Estado</th>
                                                    <th className="pb-2">Fecha</th>
                                                    <th className="pb-2 text-right pr-2">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-300 divide-y divide-gray-800">
                                                {loadedData.articles
                                                    .filter(a => selectedProjectArticles === 'all' || String(a.project_id || a.projectId) === String(selectedProjectArticles))
                                                    .slice((currentPageArticles - 1) * itemsPerPage, currentPageArticles * itemsPerPage)
                                                    .map((a: any) => {
                                                        const isPublished = a.status === 'published' || a.is_generated;
                                                        const statusLabel = a.status === 'published' ? 'Publicado' : a.status === 'draft' ? 'Borrador' : a.status === 'scheduled' ? 'Programado' : (a.is_generated ? 'Publicado' : 'Borrador');
                                                        
                                                        return (
                                                            <tr key={a.id} className="hover:bg-white/[0.02]">
                                                                <td className="py-2 pl-2 font-medium truncate max-w-[200px]">{a.title}</td>
                                                                <td className="py-2">
                                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${a.isJson ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                                                        {a.isJson ? 'JSON' : 'Base de Datos'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2">
                                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${isPublished ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                                        {statusLabel}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 text-gray-400">{formatRelativeTime(a.created_at || a.createdAt)}</td>
                                                                <td className="py-2 text-right pr-2 flex justify-end gap-1">
                                                                    <button 
                                                                        onClick={() => {
                                                                            const pageSubdomain = a.pageSubdomain || (loadedData.pages?.find(p => String(p.id) === String(a.pageId))?.subdomain);
                                                                            if (pageSubdomain) {
                                                                                window.open(`https://${pageSubdomain}/blog/${a.slug}`, '_blank');
                                                                            } else {
                                                                                alert("No se encontró la página vinculada para este artículo.");
                                                                            }
                                                                        }}
                                                                        className="p-1.5 text-blue-400 hover:bg-blue-900/20 rounded transition"
                                                                        title="Ver Artículo"
                                                                    >
                                                                        <Eye className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteAsset('articles', a.id, a.title)}
                                                                        className="p-1.5 text-red-500 hover:bg-red-900/20 rounded transition"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>

                                        {/* Pagination */}
                                        {Math.ceil((loadedData.articles?.filter(a => selectedProjectArticles === 'all' || String(a.project_id || a.projectId) === String(selectedProjectArticles)).length || 0) / itemsPerPage) > 1 && (
                                            <div className="mt-4 flex items-center justify-between px-2">
                                                <span className="text-[10px] text-gray-500 uppercase">Página {currentPageArticles} de {Math.ceil((loadedData.articles?.filter(a => selectedProjectArticles === 'all' || String(a.project_id || a.projectId) === String(selectedProjectArticles)).length || 0) / itemsPerPage)}</span>
                                                <div className="flex gap-2">
                                                    <button 
                                                        disabled={currentPageArticles === 1}
                                                        onClick={() => setCurrentPageArticles(prev => prev - 1)}
                                                        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] text-gray-400 hover:text-white disabled:opacity-50"
                                                    >
                                                        Anterior
                                                    </button>
                                                    <button 
                                                        disabled={currentPageArticles >= Math.ceil((loadedData.articles?.filter(a => selectedProjectArticles === 'all' || String(a.project_id || a.projectId) === String(selectedProjectArticles)).length || 0) / itemsPerPage)}
                                                        onClick={() => setCurrentPageArticles(prev => prev + 1)}
                                                        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] text-gray-400 hover:text-white disabled:opacity-50"
                                                    >
                                                        Siguiente
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay artículos creados.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Hooks Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('hooks')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Zap className="w-5 h-5 text-orange-500" /> Hooks de Atracción
                            </div>
                            {expandedSection === 'hooks' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'hooks' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'hooks' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
                                ) : loadedData.hooks && loadedData.hooks.length > 0 ? (
                                    <>
                                        {/* Project Filter */}
                                        <div className="mb-4 flex items-center gap-3">
                                            <label className="text-xs text-gray-400 uppercase font-bold">Filtrar por Proyecto:</label>
                                            <select 
                                                value={selectedProjectHooks}
                                                onChange={(e) => {
                                                    setSelectedProjectHooks(e.target.value);
                                                    setCurrentPageHooks(1);
                                                }}
                                                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="all">Todos los proyectos</option>
                                                {loadedData.projects?.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <table className="w-full text-xs text-left">
                                            <thead className="text-gray-500 uppercase">
                                                <tr>
                                                    <th className="pb-2 pl-2">Título del Gancho</th>
                                                    <th className="pb-2">Procedencia</th>
                                                    <th className="pb-2">Estado</th>
                                                    <th className="pb-2">Fecha</th>
                                                    <th className="pb-2 text-right pr-2">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-300 divide-y divide-gray-800">
                                                {loadedData.hooks
                                                    .filter(h => selectedProjectHooks === 'all' || String(h.project_id || h.projectId) === String(selectedProjectHooks))
                                                    .slice((currentPageHooks - 1) * itemsPerPage, currentPageHooks * itemsPerPage)
                                                    .map((h: any) => (
                                                        <tr key={h.id} className="hover:bg-white/[0.02]">
                                                            <td className="py-2 pl-2 font-medium">{h.title}</td>
                                                            <td className="py-2">
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${h.is_json || h.master_hook_id ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                                                    {h.is_json || h.master_hook_id ? 'JSON' : 'Base de Datos'}
                                                                </span>
                                                            </td>
                                                            <td className="py-2">
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${(h.is_generated || h.isGenerated) ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                                    {(h.is_generated || h.isGenerated) ? 'Generado' : 'No Generado'}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 text-gray-400">{formatRelativeTime(h.created_at || h.createdAt)}</td>
                                                            <td className="py-2 text-right pr-2">
                                                                <button 
                                                                    onClick={() => handleDeleteAsset('hooks', h.id, h.title)}
                                                                    className="p-1.5 text-red-500 hover:bg-red-900/20 rounded transition"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>

                                        {/* Pagination */}
                                        {Math.ceil((loadedData.hooks?.filter(h => selectedProjectHooks === 'all' || String(h.project_id || h.projectId) === String(selectedProjectHooks)).length || 0) / itemsPerPage) > 1 && (
                                            <div className="mt-4 flex items-center justify-between px-2">
                                                <span className="text-[10px] text-gray-500 uppercase">Página {currentPageHooks} de {Math.ceil((loadedData.hooks?.filter(h => selectedProjectHooks === 'all' || String(h.project_id || h.projectId) === String(selectedProjectHooks)).length || 0) / itemsPerPage)}</span>
                                                <div className="flex gap-2">
                                                    <button 
                                                        disabled={currentPageHooks === 1}
                                                        onClick={() => setCurrentPageHooks(prev => prev - 1)}
                                                        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] text-gray-400 hover:text-white disabled:opacity-50"
                                                    >
                                                        Anterior
                                                    </button>
                                                    <button 
                                                        disabled={currentPageHooks >= Math.ceil((loadedData.hooks?.filter(h => selectedProjectHooks === 'all' || String(h.project_id || h.projectId) === String(selectedProjectHooks)).length || 0) / itemsPerPage)}
                                                        onClick={() => setCurrentPageHooks(prev => prev + 1)}
                                                        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] text-gray-400 hover:text-white disabled:opacity-50"
                                                    >
                                                        Siguiente
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay hooks generados.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Email Sequences Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('emails')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Mail className="w-5 h-5 text-blue-400" /> Secuencias de Email
                            </div>
                            {expandedSection === 'emails' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'emails' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'emails' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.emails && loadedData.emails.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2 pl-2">Nombre</th>
                                                <th className="pb-2">Estado</th>
                                                <th className="pb-2">Fecha</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.emails.map((e: any) => (
                                                <tr key={e.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-medium">{e.name}</td>
                                                    <td className="py-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${e.status === 'activa' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                            {e.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2">{new Date(e.created_at).toLocaleDateString()}</td>
                                                    <td className="py-2 text-right pr-2">
                                                        <button 
                                                            onClick={() => handleDeleteAsset('emails', e.id, e.name)}
                                                            className="p-1.5 text-red-500 hover:bg-red-900/20 rounded transition"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay secuencias creadas.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Correos Electrónicos Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('emails')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Mail className="w-5 h-5 text-indigo-400" /> Correos Electrónicos
                            </div>
                            {expandedSection === 'emails' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'emails' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'emails' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.emails && loadedData.emails.length > 0 ? (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-400 mb-2 italic">Selecciona una secuencia para ver sus correos:</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {loadedData.emails.map((e: any) => (
                                                <div key={`msg-seq-${e.id}`} className="border border-gray-800 rounded-lg overflow-hidden">
                                                    <button 
                                                        onClick={() => handleLoadSequenceMessages(e.id)}
                                                        className={`w-full flex items-center justify-between p-3 text-left transition ${selectedSequenceId === e.id ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-gray-900/40 hover:bg-gray-800'}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Mail className={`w-4 h-4 ${selectedSequenceId === e.id ? 'text-indigo-400' : 'text-gray-500'}`} />
                                                            <span className="text-xs font-medium text-gray-200">{e.name}</span>
                                                        </div>
                                                        {selectedSequenceId === e.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                                    </button>

                                                    {selectedSequenceId === e.id && (
                                                        <div className="p-3 bg-black/30 border-t border-gray-800">
                                                            {loadingMessages ? (
                                                                <div className="flex justify-center py-2"><Loader2 className="w-4 h-4 animate-spin text-indigo-500" /></div>
                                                            ) : sequenceMessages.length > 0 ? (
                                                                <table className="w-full text-[10px] text-left">
                                                                    <thead className="text-gray-500 uppercase">
                                                                        <tr>
                                                                            <th className="pb-2">Día</th>
                                                                            <th className="pb-2">Asunto</th>
                                                                            <th className="pb-2">Tipo</th>
                                                                            <th className="pb-2">Fecha</th>
                                                                            <th className="pb-2 text-right">Acción</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="text-gray-400 divide-y divide-gray-800/50">
                                                                        {sequenceMessages.map((msg) => (
                                                                            <tr key={msg.id} className="hover:bg-white/[0.01]">
                                                                                <td className="py-2 font-bold text-indigo-400">Día {msg.dayIndex}</td>
                                                                                <td className="py-2 max-w-[150px] truncate" title={msg.subject}>{msg.subject}</td>
                                                                                <td className="py-2 uppercase">
                                                                                    <span className={`px-1 rounded-[2px] ${msg.type === 'conversion' ? 'bg-orange-900/20 text-orange-400' : 'bg-blue-900/20 text-blue-400'}`}>
                                                                                        {msg.type === 'conversion' ? 'Conv' : 'Nutr'}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="py-2">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                                                <td className="py-2 text-right">
                                                                                    <button 
                                                                                        onClick={() => handleDeleteEmailMessage(msg.id)}
                                                                                        className="p-1 text-red-500 hover:bg-red-900/20 rounded transition"
                                                                                    >
                                                                                        <Trash2 className="w-3 h-3" />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <p className="text-[10px] text-gray-500 italic text-center py-2">No hay correos generados en esta secuencia.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay secuencias para mostrar correos.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* WhatsApp Launches Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('whatsapp')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Smartphone className="w-5 h-5 text-emerald-400" /> Lanzamientos de WhatsApp
                            </div>
                            {expandedSection === 'whatsapp' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'whatsapp' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'whatsapp' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.whatsapp && loadedData.whatsapp.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2 pl-2">Nombre</th>
                                                <th className="pb-2">Estado</th>
                                                <th className="pb-2">Fecha</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.whatsapp.map((w: any) => (
                                                <tr key={w.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-medium">{w.name}</td>
                                                    <td className="py-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${w.status === 'activa' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                            {w.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2">{new Date(w.created_at).toLocaleDateString()}</td>
                                                    <td className="py-2 text-right pr-2">
                                                        <button 
                                                            onClick={() => handleDeleteAsset('whatsapp', w.id, w.name)}
                                                            className="p-1.5 text-red-500 hover:bg-red-900/20 rounded transition"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay lanzamientos creados.</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserContentModal;