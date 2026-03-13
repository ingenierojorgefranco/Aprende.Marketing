import React, { useState } from 'react';
import { User, UserSubscription } from '../../../types';
import { api } from '../../../services/api';
import { X, ChevronDown, ChevronUp, Folder, FileText, Globe, Eye, Loader2, Trash2, Mail, Smartphone, Zap, CreditCard, Power, Edit } from 'lucide-react';

////////// Actualización: Creación de archivo independiente para carga dinámica - 05/06/2025 21:30 //////////
const UserContentModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const [loadedData, setLoadedData] = useState<{
        plans: UserSubscription[] | null;
        projects: any[] | null;
        pages: any[] | null;
        articles: any[] | null;
        emails: any[] | null;
        whatsapp: any[] | null;
        hooks: any[] | null;
    }>({ plans: null, projects: null, pages: null, articles: null, emails: null, whatsapp: null, hooks: null });

    const [expandedSection, setExpandedSection] = useState<'plans' | 'projects' | 'pages' | 'articles' | 'emails' | 'whatsapp' | 'hooks' | null>(null);
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

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
                    data = await api.getUserSubscriptions(user.id);
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

    const handleDeleteAsset = async (type: 'projects' | 'pages' | 'articles' | 'emails' | 'whatsapp' | 'hooks', id: string, name: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${name}" permanentemente? Esta acción no se puede deshacer.`)) return;
        
        try {
            if (type === 'pages') await api.deletePage(id);
            else if (type === 'projects') await api.deleteProject(id);
            else if (type === 'articles') await api.deleteArticle(id);
            else if (type === 'emails') await api.deleteEmailSequence(id);
            else if (type === 'whatsapp') await api.deleteWhatsAppLaunch(id);
            else if (type === 'hooks') await api.deleteProjectHook(id);
            
            // Actualizar estado local
            setLoadedData(prev => ({
                ...prev,
                [type]: prev[type]?.filter((item: any) => String(item.id) !== String(id)) || null
            }));
        } catch (error) {
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
                                            {/* Other active plans */}
                                            {loadedData.plans && loadedData.plans.map((sub: UserSubscription) => (
                                                <tr key={sub.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-mono text-[10px] text-gray-500">{sub.id}</td>
                                                    <td className="py-2 font-medium">{sub.planName}</td>
                                                    <td className="py-2">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-2 text-blue-400">{sub.nextBillingAt ? new Date(sub.nextBillingAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="py-2 text-right pr-2 flex justify-end gap-1">
                                                        <button 
                                                            className="p-1.5 text-blue-400 hover:bg-blue-900/20 rounded transition"
                                                            title="Editar Suscripción"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleToggleSubscription(sub)}
                                                            className={`p-1.5 rounded transition ${sub.status === 'active' ? 'text-red-500 hover:bg-red-900/20' : 'text-green-500 hover:bg-green-900/20'}`}
                                                            title={sub.status === 'active' ? 'Deshabilitar Plan' : 'Activar Plan'}
                                                        >
                                                            <Power className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
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
                                                <th className="pb-2">Subdominio</th>
                                                <th className="pb-2 text-right">Visitas</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.pages.map((p: any) => (
                                                <tr key={p.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-medium">{p.name}</td>
                                                    <td className="py-2 text-gray-400">{p.subdomain}</td>
                                                    <td className="py-2 text-right font-mono">{p.visits}</td>
                                                    <td className="py-2 text-right pr-2">
                                                        <button 
                                                            onClick={() => handleDeleteAsset('pages', p.id, p.name)}
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
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2 pl-2">Título</th>
                                                <th className="pb-2">Procedencia</th>
                                                <th className="pb-2">Estado</th>
                                                <th className="pb-2 text-right">SEO</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.articles.map((a: any) => (
                                                <tr key={a.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-medium truncate max-w-[200px]">{a.title}</td>
                                                    <td className="py-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${a.master_article_id ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                                            {a.master_article_id ? 'JSON' : 'Base de Datos'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${a.is_generated ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                            {a.is_generated ? 'Published' : 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 text-right font-mono">{a.seo_score}</td>
                                                    <td className="py-2 text-right pr-2">
                                                        <button 
                                                            onClick={() => handleDeleteAsset('articles', a.id, a.title)}
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
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2 pl-2">Título del Gancho</th>
                                                <th className="pb-2">Estrategia</th>
                                                <th className="pb-2">Proyecto</th>
                                                <th className="pb-2 text-right pr-2">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.hooks.map((h: any) => (
                                                <tr key={h.id} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 pl-2 font-medium truncate max-w-[200px]">{h.title}</td>
                                                    <td className="py-2 truncate max-w-[200px] text-gray-400">{h.psychological_strategy}</td>
                                                    <td className="py-2 text-orange-400">{h.project_name}</td>
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