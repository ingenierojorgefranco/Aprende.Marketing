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
    
    // Edit User State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null); 
    const [tempPlanLimits, setTempPlanLimits] = useState<PlanLimits | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    
    // Usage Stats State (Lazy Loaded)
    const [userStats, setUserStats] = useState<UserUsageStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    
    // Payment History State (Lazy Loaded)
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    
    // Tabs state for modal
    const [activeTab, setActiveTab] = useState<'profile' | 'plan' | 'usage' | 'payments'>('profile');

    // System Settings
    const [redirectUrl, setRedirectUrl] = useState('');
    const [loadingSettings, setLoadingSettings] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, plansData, settingsData] = await Promise.all([
                api.getUsers(),
                api.getPlans(),
                api.getLoginRedirect().catch(() => '/dashboard')
            ]);
            setUsers(usersData);
            setPlans(plansData);
            setRedirectUrl(settingsData || '/dashboard');
        } catch (error) {
            console.error("Error loading admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setLoadingSettings(true);
        try {
            await api.updateLoginRedirect(redirectUrl);
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
        setActiveTab('profile'); // Reset tab
        setUserStats(null); // Clear previous stats
        setPaymentHistory([]);
    };

    const handleTabChange = async (tab: 'profile' | 'plan' | 'usage' | 'payments') => {
        setActiveTab(tab);
        if (tab === 'usage' && editingUser && !userStats) {
            // Lazy load stats
            setLoadingStats(true);
            try {
                const stats = await api.getUserUsageStats(editingUser.id);
                setUserStats(stats);
            } catch (e) {
                console.error("Failed to load stats", e);
            } finally {
                setLoadingStats(false);
            }
        } else if (tab === 'payments' && editingUser && paymentHistory.length === 0) {
            // Lazy load payments
            setLoadingPayments(true);
            try {
                const payments = await api.getUserPayments(editingUser.id);
                setPaymentHistory(payments);
            } catch (e) {
                console.error("Failed to load payments", e);
            } finally {
                setLoadingPayments(false);
            }
        }
    };

    const handleSaveUser = async () => {
        if (!editingUser || !tempPlanLimits) return;

        try {
            // Update Full User Profile including Role and Plan Limits
            await api.updateUser(editingUser.id, {
                role: editingUser.role || 'user',
                planLimits: tempPlanLimits,
                isActive: true, // Assuming active for now
                name: editingUser.name,
                email: editingUser.email,
                avatarUrl: editingUser.avatarUrl,
                birthDate: editingUser.birthDate,
                customRedirectUrl: editingUser.customRedirectUrl
            } as any); 

            // Refresh list
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { 
                ...editingUser, 
                planLimits: tempPlanLimits 
            } : u));
            
            setEditingUser(null);
            setTempPlanLimits(null);
        } catch (error) {
            alert("Error al guardar cambios");
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await api.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setShowDeleteConfirm(null);
        } catch (error) {
            alert("Error eliminando usuario");
        }
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

    // Helper for Feature Label
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

    // Helper for Usage Bar
    const UsageBar = ({ label, current, max }: { label: string, current: number, max: number }) => {
        const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;
        let color = 'bg-green-500';
        if (percent > 60) color = 'bg-yellow-500';
        if (percent >= 90) color = 'bg-red-500';

        return (
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{label}</span>
                    <span className="font-mono">{current} / {max}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-red-500" /> Panel de Administración
                </h1>
                <div className="text-sm text-gray-400">
                    Total Usuarios: <span className="font-bold text-white">{users.length}</span>
                </div>
            </div>

            {/* System Configuration Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-primary" /> Configuración Global
                </h2>
                <div className="max-w-2xl">
                    <label className="block text-sm font-medium text-gray-400 mb-2">URL de Redirección (Login/Registro Exitoso)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={redirectUrl}
                            onChange={(e) => setRedirectUrl(e.target.value)}
                            className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-primary"
                            placeholder="/dashboard"
                        />
                        <button 
                            onClick={handleSaveSettings}
                            disabled={loadingSettings}
                            className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
                        >
                            {loadingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Define a dónde van los usuarios inmediatamente después de iniciar sesión por defecto.</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" /> Usuarios Registrados
                    </h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Plan Actual</th>
                            <th className="p-4">Límites (Proy / Landings)</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition">
                                <td className="p-4">
                                    <div className="font-bold text-white">{user.name}</div>
                                    <div className="text-gray-500">{user.email}</div>
                                    {user.customRedirectUrl && (
                                        <div className="text-[10px] text-blue-400 flex items-center gap-1 mt-1">
                                            <LinkIcon className="w-3 h-3" /> Redirect: {user.customRedirectUrl}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-900/30 text-red-400 border border-red-900' : 'bg-blue-900/30 text-blue-400 border border-blue-900'}`}>
                                        {user.role?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="text-gray-300 capitalize">{user.planLimits?.planName || 'N/A'}</span>
                                </td>
                                <td className="p-4 text-gray-400">
                                    {user.planLimits?.maxProjects} / {user.planLimits?.maxLandings}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button 
                                        onClick={() => setViewingUser(user)}
                                        className="p-2 hover:bg-purple-900/30 text-purple-400 rounded transition" title="Ver Contenido Generado"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="p-2 hover:bg-blue-900/30 text-blue-400 rounded transition" title="Editar Usuario"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteConfirm(user.id)}
                                        className="p-2 hover:bg-red-900/30 text-red-400 rounded transition" title="Eliminar Usuario"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Content Viewer Modal */}
            {viewingUser && (
                <UserContentModal user={viewingUser} onClose={() => setViewingUser(null)} />
            )}

            {/* Edit User Modal */}
            {editingUser && tempPlanLimits && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-850 shrink-0">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit className="w-5 h-5 text-blue-400" /> Editar Usuario: {editingUser.name}
                            </h3>
                            <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-gray-800 bg-gray-900">
                            <button onClick={() => handleTabChange('profile')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'profile' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Perfil</button>
                            <button onClick={() => handleTabChange('plan')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'plan' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Plan</button>
                            <button onClick={() => handleTabChange('usage')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'usage' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Consumo</button>
                            <button onClick={() => handleTabChange('payments')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'payments' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>Pagos</button>
                        </div>
                        
                        <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-[400px]">
                            
                            {/* TAB: PROFILE */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6 animate-in slide-in-from-left-4">
                                    <div className="space-y-4 pb-6 border-b border-gray-800">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                                            <UserIcon className="w-4 h-4 text-primary" /> Datos Personales
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                                                <input 
                                                    type="text" 
                                                    value={editingUser.name}
                                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                                <input 
                                                    type="email" 
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha Nacimiento</label>
                                                <input 
                                                    type="date" 
                                                    value={editingUser.birthDate ? new Date(editingUser.birthDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => setEditingUser({...editingUser, birthDate: e.target.value})}
                                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                                    style={{ colorScheme: 'dark' }} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Avatar URL</label>
                                                <input 
                                                    type="text" 
                                                    value={editingUser.avatarUrl || ''}
                                                    onChange={(e) => setEditingUser({...editingUser, avatarUrl: e.target.value})}
                                                    placeholder="https://..."
                                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Settings Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                                            <Shield className="w-4 h-4 text-red-400" /> Configuración de Sistema
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rol</label>
                                                <select 
                                                    value={editingUser.role} 
                                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                                >
                                                    <option value="user">Usuario Normal</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Redirección Personalizada</label>
                                                <input 
                                                    type="text" 
                                                    value={editingUser.customRedirectUrl || ''}
                                                    onChange={(e) => setEditingUser({...editingUser, customRedirectUrl: e.target.value})}
                                                    placeholder="URL prioritaria al login"
                                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-blue-300 placeholder-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: PLAN */}
                            {activeTab === 'plan' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-green-400" /> Configuración de Límites y Características
                                        </h4>
                                    </div>

                                    {/* Dynamic Plan Templates */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Aplicar Plantilla del Plan</label>
                                        <div className="flex flex-wrap gap-2">
                                            {plans.map(plan => {
                                                const isActive = tempPlanLimits.planName === plan.slug;
                                                return (
                                                    <button 
                                                        key={plan.id}
                                                        onClick={() => applyTemplate(plan)} 
                                                        className={`px-3 py-1.5 border rounded text-xs transition font-bold ${
                                                            isActive 
                                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                                                                : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500'
                                                        }`}
                                                    >
                                                        {plan.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 bg-black/40 p-5 rounded-2xl border border-gray-800">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Máx Proyectos</label>
                                            <input 
                                                type="number" 
                                                value={tempPlanLimits.maxProjects}
                                                onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxProjects: parseInt(e.target.value) || 0})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-primary transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Máx Landing Pages</label>
                                            <input 
                                                type="number" 
                                                value={tempPlanLimits.maxLandings}
                                                onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxLandings: parseInt(e.target.value) || 0})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-primary transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Máx Dominios</label>
                                            <input 
                                                type="number" 
                                                value={tempPlanLimits.maxDomains || 0}
                                                onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxDomains: parseInt(e.target.value) || 0})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-primary transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Máx Artículos SEO</label>
                                            <input 
                                                type="number" 
                                                value={tempPlanLimits.maxArticles || 0}
                                                onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxArticles: parseInt(e.target.value) || 0})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-primary transition"
                                            />
                                        </div>
                                    </div>

                                    {/* Features Toggles */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">Funcionalidades (Feature Flags)</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(tempPlanLimits.features).map(([key, value]) => (
                                                <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${value ? 'bg-green-900/10 border-green-500/30' : 'bg-black border-gray-800 hover:border-gray-700'}`}>
                                                    <div className={`w-10 h-5 rounded-full relative transition-colors ${value ? 'bg-green-600' : 'bg-gray-700'}`}>
                                                        <input 
                                                            type="checkbox" 
                                                            className="hidden"
                                                            checked={value}
                                                            onChange={(e) => setTempPlanLimits({
                                                                ...tempPlanLimits, 
                                                                features: { ...tempPlanLimits.features, [key]: e.target.checked }
                                                            })}
                                                        />
                                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform shadow-md ${value ? 'left-6' : 'left-1'}`}></div>
                                                    </div>
                                                    <span className={`text-sm font-medium transition-colors ${value ? 'text-green-300' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                        {getFeatureLabel(key)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: USAGE STATS (LAZY LOADED) */}
                            {activeTab === 'usage' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                        <BarChart className="w-4 h-4 text-orange-400" /> Consumo Mensual Actual
                                    </h4>
                                    
                                    {loadingStats ? (
                                        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                    ) : userStats ? (
                                        <div className="space-y-6 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                                            <UsageBar 
                                                label="Proyectos Generados" 
                                                current={userStats.projects} 
                                                max={tempPlanLimits.maxProjects} 
                                            />
                                            <UsageBar 
                                                label="Páginas Creadas" 
                                                current={userStats.landings} 
                                                max={tempPlanLimits.maxLandings} 
                                            />
                                            <UsageBar 
                                                label="Artículos Escritos" 
                                                current={userStats.articles} 
                                                max={tempPlanLimits.maxArticles || 2} 
                                            />
                                            
                                            <div className="pt-4 border-t border-gray-700 flex justify-end">
                                                <button 
                                                    onClick={() => handleTabChange('usage')}
                                                    className="text-xs text-blue-400 hover:text-white flex items-center gap-1"
                                                >
                                                    <RefreshCw className="w-3 h-3" /> Actualizar Datos
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">No se pudieron cargar los datos.</div>
                                    )}
                                </div>
                            )}

                            {/* TAB: PAYMENTS HISTORY (NEW) */}
                            {activeTab === 'payments' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                        <CreditCard className="w-4 h-4 text-green-400" /> Historial de Transacciones
                                    </h4>
                                    
                                    {loadingPayments ? (
                                        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                                    ) : paymentHistory.length > 0 ? (
                                        <div className="space-y-3">
                                            {paymentHistory.map((payment) => (
                                                <div key={payment.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-sm font-bold ${payment.status === 'succeeded' ? 'text-green-400' : 'text-red-400'}`}>
                                                                {payment.status === 'succeeded' ? 'Pago Exitoso' : 'Pago Fallido'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">• {new Date(payment.created_at).toLocaleString()}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                                                            ID: {payment.stripe_id}
                                                            <a href={`https://dashboard.stripe.com/payments/${payment.stripe_id}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400" title="Ver en Stripe">
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-lg font-bold ${payment.status === 'succeeded' ? 'text-white' : 'text-red-500 line-through'}`}>
                                                            {payment.amount} {payment.currency?.toUpperCase()}
                                                        </span>
                                                        {payment.payment_method && (
                                                            <p className="text-[10px] text-gray-500 uppercase">{payment.payment_method}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                                            <p className="text-gray-500 text-sm">No hay registros de pagos para este usuario.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-end gap-3 shrink-0">
                            <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-400 hover:text-white transition">Cancelar</button>
                            <button onClick={handleSaveUser} className="px-6 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 transition">
                                <Save className="w-4 h-4" /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-red-900/50 p-6 rounded-xl max-w-sm w-full text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Usuario?</h3>
                        <p className="text-gray-400 text-sm mb-6">Esta acción borrará permanentemente al usuario y todos sus datos.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-700 rounded text-gray-300">Cancelar</button>
                            <button onClick={() => handleDeleteUser(showDeleteConfirm)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold">Sí, Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};