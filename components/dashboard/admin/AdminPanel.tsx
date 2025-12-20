
import React, { useEffect, useState } from 'react';
import { User, PlanLimits, Plan, UserUsageStats } from '../../../types';
import { api } from '../../../services/api';
import { Loader2, Shield, Users, Edit, Trash2, Check, X, Save, AlertTriangle, Eye, ChevronDown, ChevronUp, Folder, FileText, Globe, Link as LinkIcon, User as UserIcon, Mail, Calendar, Upload, BarChart, RefreshCw, CreditCard, ExternalLink, Zap } from 'lucide-react';

// --- Sub-component for viewing user resources (Lazy Loaded) ---
const UserContentModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const [loadedData, setLoadedData] = useState<{
        projects: any[] | null;
        pages: any[] | null;
        articles: any[] | null;
    }>({ projects: null, pages: null, articles: null });

    const [expandedSection, setExpandedSection] = useState<'projects' | 'pages' | 'articles' | null>(null);
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

    const toggleSection = async (section: 'projects' | 'pages' | 'articles') => {
        if (expandedSection === section) {
            setExpandedSection(null);
            return;
        }

        setExpandedSection(section);

        // Lazy Load if data is null
        if (loadedData[section] === null) {
            setLoadingSection(section);
            try {
                const data = await api.getAdminUserResources(user.id, section);
                setLoadedData(prev => ({ ...prev, [section]: data }));
            } catch (error) {
                console.error(`Error loading ${section}`, error);
            } finally {
                setLoadingSection(null);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[80vh]">
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
                                                <th className="pb-2">Nombre</th>
                                                <th className="pb-2">Nicho</th>
                                                <th className="pb-2">Objetivo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.projects.map((p: any) => (
                                                <tr key={p.id}>
                                                    <td className="py-2 font-medium">{p.name}</td>
                                                    <td className="py-2">{p.niche}</td>
                                                    <td className="py-2 text-blue-400">{p.main_goal}</td>
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
                                                <th className="pb-2">Nombre</th>
                                                <th className="pb-2">Subdominio</th>
                                                <th className="pb-2 text-right">Visitas</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.pages.map((p: any) => (
                                                <tr key={p.id}>
                                                    <td className="py-2 font-medium">{p.name}</td>
                                                    <td className="py-2 text-gray-400">{p.subdomain}</td>
                                                    <td className="py-2 text-right font-mono">{p.visits}</td>
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
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition text-left"
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
                                                <th className="pb-2">Título</th>
                                                <th className="pb-2">Estado</th>
                                                <th className="pb-2 text-right">SEO</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.articles.map((a: any) => (
                                                <tr key={a.id}>
                                                    <td className="py-2 font-medium truncate max-w-[200px]">{a.title}</td>
                                                    <td className="py-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${a.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                            {a.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 text-right font-mono">{a.seo_score}</td>
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

                </div>
            </div>
        </div>
    );
};

export const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null); 
    const [tempPlanLimits, setTempPlanLimits] = useState<PlanLimits | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    
    const [userStats, setUserStats] = useState<UserUsageStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'plan' | 'usage' | 'payments'>('profile');

    const [redirectUrl, setRedirectUrl] = useState('');
    const [activeProvider, setActiveProvider] = useState<'stripe' | 'hotmart'>('stripe');
    const [loadingSettings, setLoadingSettings] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, plansData, redirectData, providerData] = await Promise.all([
                api.getUsers(),
                api.getPlans(),
                api.getLoginRedirect().catch(() => '/dashboard'),
                api.getActivePaymentProvider().catch(() => 'stripe')
            ]);
            setUsers(usersData);
            setPlans(plansData);
            setRedirectUrl(redirectData || '/dashboard');
            setActiveProvider(providerData as any);
        } catch (error) {
            console.error("Error loading admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setLoadingSettings(true);
        try {
            await Promise.all([
                api.updateLoginRedirect(redirectUrl),
                api.updatePaymentProvider(activeProvider)
            ]);
            alert("Configuración actualizada.");
        } catch (e) {
            alert("Error al guardar configuración.");
        } finally {
            setLoadingSettings(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setTempPlanLimits(JSON.parse(JSON.stringify(user.planLimits || {
            planName: 'starter',
            maxProjects: 1,
            maxLandings: 3,
            maxDomains: 1,
            maxArticles: 2,
            features: {
                whatsappBot: false,
                blogGenerator: false,
                emailMarketing: false,
                removeBranding: false,
                emailStrategy: false,
                evergreenStrategy: false
            }
        })));
        setActiveTab('profile'); 
        setUserStats(null); 
        setPaymentHistory([]);
    };

    const handleTabChange = async (tab: 'profile' | 'plan' | 'usage' | 'payments') => {
        setActiveTab(tab);
        if (tab === 'usage' && editingUser && !userStats) {
            setLoadingStats(true);
            try {
                const stats = await api.getUserUsageStats(editingUser.id);
                setUserStats(stats);
            } catch (e) { console.error(e); } finally { setLoadingStats(false); }
        } else if (tab === 'payments' && editingUser && paymentHistory.length === 0) {
            setLoadingPayments(true);
            try {
                const payments = await api.getUserPayments(editingUser.id);
                setPaymentHistory(payments);
            } catch (e) { console.error(e); } finally { setLoadingPayments(false); }
        }
    };

    const handleSaveUser = async () => {
        if (!editingUser || !tempPlanLimits) return;
        try {
            await api.updateUser(editingUser.id, {
                role: editingUser.role || 'user',
                planLimits: tempPlanLimits,
                isActive: true,
                name: editingUser.name,
                email: editingUser.email,
                avatarUrl: editingUser.avatarUrl,
                birthDate: editingUser.birthDate,
                customRedirectUrl: editingUser.customRedirectUrl
            } as any); 
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, planLimits: tempPlanLimits } : u));
            setEditingUser(null);
            setTempPlanLimits(null);
        } catch (error) { alert("Error al guardar cambios"); }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await api.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setShowDeleteConfirm(null);
        } catch (error) { alert("Error eliminando usuario"); }
    };

    const applyTemplate = (plan: Plan) => {
        setTempPlanLimits({
            planName: plan.slug,
            maxProjects: plan.limitsConfig.maxProjects,
            maxLandings: plan.limitsConfig.maxLandings,
            maxDomains: plan.limitsConfig.maxDomains || 1,
            maxArticles: plan.limitsConfig.maxArticles || 0,
            features: { ...plan.limitsConfig.features }
        });
    };

    const getFeatureLabel = (key: string) => {
        const labels: Record<string, string> = {
            whatsappBot: 'Bot de WhatsApp',
            blogGenerator: 'Generador de Blog',
            emailMarketing: 'Email Marketing',
            removeBranding: 'Quitar Branding',
            emailStrategy: 'Estrategia 7 Días',
            evergreenStrategy: 'Estrategia 30 Días'
        };
        return labels[key] || key.replace(/([A-Z])/g, ' $1').trim();
    };

    const UsageBar = ({ label, current, max }: { label: string, current: number, max: number }) => {
        const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;
        let color = 'bg-green-500';
        if (percent > 60) color = 'bg-yellow-500';
        if (percent >= 90) color = 'bg-red-500';
        return (
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1"><span>{label}</span><span className="font-mono">{current} / {max}</span></div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"><div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }}></div></div>
            </div>
        );
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-red-500" /> Panel de Administración
                </h1>
                <div className="text-sm text-gray-400">Total Usuarios: <span className="font-bold text-white">{users.length}</span></div>
            </div>

            {/* Configuración Global */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-primary" /> Configuración Global
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Redirect Setting */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider text-xs">URL de Redirección Global</label>
                        <input 
                            type="text" 
                            value={redirectUrl}
                            onChange={(e) => setRedirectUrl(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
                            placeholder="/dashboard"
                        />
                        <p className="text-[10px] text-gray-500 mt-2">Redirección predeterminada tras el Login exitoso.</p>
                    </div>

                    {/* Payment Provider Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider text-xs">Pasarela de Pagos Activa</label>
                        <div className="flex gap-2 p-1 bg-black rounded-xl border border-gray-700 w-fit">
                            <button 
                                onClick={() => setActiveProvider('stripe')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeProvider === 'stripe' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <CreditCard className="w-3.5 h-3.5" /> Stripe (Tarjetas)
                            </button>
                            <button 
                                onClick={() => setActiveProvider('hotmart')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeProvider === 'hotmart' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <Zap className="w-3.5 h-3.5" /> Hotmart (Postback)
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">Define qué botones y enlaces verá el usuario al intentar mejorar su plan.</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                    <button 
                        onClick={handleSaveSettings}
                        disabled={loadingSettings}
                        className="bg-primary hover:bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {loadingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Configuración de Sistema
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-gray-800"><h2 className="text-xl font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Usuarios Registrados</h2></div>
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <tr><th className="p-4">Usuario</th><th className="p-4">Rol</th><th className="p-4">Plan Actual</th><th className="p-4">Límites (Proy / Landings)</th><th className="p-4 text-right">Acciones</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition">
                                <td className="p-4"><div className="font-bold text-white">{user.name}</div><div className="text-gray-500">{user.email}</div></td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-900/30 text-red-400 border border-red-900' : 'bg-blue-900/30 text-blue-400 border border-blue-900'}`}>{user.role?.toUpperCase()}</span></td>
                                <td className="p-4"><span className="text-gray-300 capitalize">{user.planLimits?.planName || 'N/A'}</span></td>
                                <td className="p-4 text-gray-400">{user.planLimits?.maxProjects} / {user.planLimits?.maxLandings}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => setViewingUser(user)} className="p-2 hover:bg-purple-900/30 text-purple-400 rounded transition"><Eye className="w-4 h-4" /></button>
                                    <button onClick={() => handleEditClick(user)} className="p-2 hover:bg-blue-900/30 text-blue-400 rounded transition"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => setShowDeleteConfirm(user.id)} className="p-2 hover:bg-red-900/30 text-red-400 rounded transition"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {viewingUser && <UserContentModal user={viewingUser} onClose={() => setViewingUser(null)} />}

            {editingUser && tempPlanLimits && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold text-white">Editar Usuario: {editingUser.name}</h3>
                            <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex border-b border-gray-800 bg-gray-900">
                            <button onClick={() => handleTabChange('profile')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'profile' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Perfil</button>
                            <button onClick={() => handleTabChange('plan')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'plan' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Plan</button>
                            <button onClick={() => handleTabChange('usage')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'usage' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Consumo</button>
                            <button onClick={() => handleTabChange('payments')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'payments' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Pagos</button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-[400px]">
                            {activeTab === 'profile' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label><input type="text" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"/></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"/></div>
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rol</label><select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"><option value="user">Usuario</option><option value="admin">Admin</option></select></div>
                                </div>
                            )}
                            {activeTab === 'plan' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plantillas de Plan</label>
                                        <div className="flex flex-wrap gap-2">{plans.map(plan => (<button key={plan.id} onClick={() => applyTemplate(plan)} className={`px-3 py-1.5 border rounded text-xs font-bold ${tempPlanLimits.planName === plan.slug ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>{plan.name}</button>))}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 bg-black/40 p-5 rounded-2xl border border-gray-800">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Proyectos</label><input type="number" value={tempPlanLimits.maxProjects} onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxProjects: parseInt(e.target.value) || 0})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"/></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Landings</label><input type="number" value={tempPlanLimits.maxLandings} onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxLandings: parseInt(e.target.value) || 0})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"/></div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'usage' && (
                                <div className="space-y-6 animate-in fade-in">{loadingStats ? <Loader2 className="w-8 h-8 animate-spin mx-auto"/> : userStats ? <div className="space-y-4"><UsageBar label="Proyectos" current={userStats.projects} max={tempPlanLimits.maxProjects} /><UsageBar label="Landings" current={userStats.landings} max={tempPlanLimits.maxLandings} /></div> : null}</div>
                            )}
                        </div>
                        <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-end gap-3 shrink-0"><button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-400">Cancelar</button><button onClick={handleSaveUser} className="px-6 py-2 bg-primary text-white rounded-lg font-bold flex items-center gap-2"><Save className="w-4 h-4" /> Guardar</button></div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-red-900/50 p-6 rounded-xl max-w-sm w-full text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Usuario?</h3>
                        <div className="flex justify-center gap-3 mt-6"><button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-700 rounded text-gray-300">Cancelar</button><button onClick={() => handleDeleteUser(showDeleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded font-bold">Eliminar</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};
