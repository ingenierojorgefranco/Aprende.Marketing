import React, { useEffect, useState } from 'react';
import { User, PlanLimits, Plan, UserUsageStats, SupportTicket } from '../../../types';
import { api } from '../../../services/api';
import { Loader2, Shield, Users, Edit, Trash2, Save, AlertTriangle, RefreshCw, CreditCard, ExternalLink, Zap, Eye, X, Rocket, Layout, MessageCircle, Clock, CheckCircle, Wand2 } from 'lucide-react';

////////// Actualización: Implementación de Lazy Load para el componente de auditoría - 05/06/2025 21:30 //////////
const UserContentModal = React.lazy(() => import('./UserContentModal'));
////////// Fin de actualización - 05/06/2025 21:30 //////////

// FIX: Added missing Input component definition
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input className={`w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition ${className || ''}`} {...props} />
);

export const AdminPanel: React.FC = () => {
    const [viewMode, setViewMode] = useState<'users' | 'tickets'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Edit User State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState<string>('');
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
    ////////// Estado para el método de pago activo - 24/05/2025 10:30 //////////
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'hotmart'>('stripe');
    ////////// Fin de actualización - 24/05/2025 10:30 //////////
    
    ////////// Estado para el modo del sistema - 08/06/2025 //////////
    const [systemMode, setSystemMode] = useState<'production' | 'launch'>('production');
    ////////// Fin de actualización //////////

    ////////// Estado para el modo del Wizard //////////
    const [wizardEnabled, setWizardEnabled] = useState<boolean>(true);
    ////////// Fin de actualización //////////
    
    const [loadingSettings, setLoadingSettings] = useState(false);

    useEffect(() => {
        loadData();
    }, [viewMode]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (viewMode === 'users') {
                const [usersData, plansData, settingsData, pMethodData, modeData, wizardData] = await Promise.all([
                    api.getUsers(),
                    api.getPlans(),
                    api.getLoginRedirect().catch(() => '/dashboard'),
                    api.getActivePaymentMethod().catch(() => 'stripe'),
                    api.getSystemMode().catch(() => 'production'),
                    api.getWizardMode().catch(() => true)
                ]);
                setUsers(usersData);
                setPlans(plansData);
                setRedirectUrl(settingsData || '/dashboard');
                setPaymentMethod(pMethodData as any);
                setSystemMode(modeData as any);
                setWizardEnabled(wizardData);
            } else {
                const ticketsData = await api.getAdminSupportTickets();
                setTickets(ticketsData);
            }
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
            ////////// Se guarda la configuración del método de pago activo - 24/05/2025 10:30 //////////
            await api.updateActivePaymentMethod(paymentMethod);
            ////////// Se guarda la configuración del modo del sistema - 08/06/2025 //////////
            await api.updateSystemMode(systemMode);
            ////////// Se guarda la configuración del modo del Wizard //////////
            await api.updateWizardMode(wizardEnabled);
            ////////// Fin de actualización - 24/05/2025 10:30 //////////
            alert("Configuración actualizada.");
        } catch (e) {
            alert("Error al guardar configuración.");
        } finally {
            setLoadingSettings(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setNewPassword('');
        const currentLimits: PlanLimits = user.planLimits ? {
            ...user.planLimits,
            maxHooks: user.planLimits.maxHooks || 10 // Ensure maxHooks exists
        } : {
            planName: 'starter',
            maxProjects: 1,
            maxLandings: 3,
            maxDomains: 1,
            maxArticles: 2,
            maxEmailSequences: 1,
            maxEmailSequencesNurturing: 15,
            maxWhatsAppLaunches: 1,
            maxHooks: 10,
            features: {
                whatsappBot: false,
                blogGenerator: false,
                emailMarketing: false,
                removeBranding: false,
                emailStrategy: false,
                evergreenStrategy: false
            }
        };
        
        // Asegurar la propiedad maxWhatsAppLaunches y maxHooks si faltan por migración parcial
        if (currentLimits.maxWhatsAppLaunches === undefined) currentLimits.maxWhatsAppLaunches = 1;
        if (currentLimits.maxEmailSequencesNurturing === undefined) currentLimits.maxEmailSequencesNurturing = 15;
        if (currentLimits.maxHooks === undefined) currentLimits.maxHooks = 10;
        
        setTempPlanLimits(JSON.parse(JSON.stringify(currentLimits)));
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
                maxHooks: editingUser.maxHooks,
                isActive: true, // Assuming active for now
                name: editingUser.name,
                email: editingUser.email,
                avatarUrl: editingUser.avatarUrl,
                birthDate: editingUser.birthDate,
                customRedirectUrl: editingUser.customRedirectUrl,
                password: newPassword ? newPassword : undefined
            } as any); 

            // Refresh list
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { 
                ...editingUser, 
                planLimits: tempPlanLimits,
                maxHooks: editingUser.maxHooks
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
            maxEmailSequences: plan.limitsConfig.maxEmailSequences || 1,
            maxEmailSequencesNurturing: plan.limitsConfig.maxEmailSequencesNurturing || 15,
            maxWhatsAppLaunches: plan.limitsConfig.maxWhatsAppLaunches || 1,
            maxHooks: plan.limitsConfig.maxHooks || 10,
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
            emailStrategy: 'Secuencia 7 días',
            evergreenStrategy: 'Secuencia 30 días'
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

    if (loading && users.length === 0 && tickets.length === 0) {
        return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-red-500" /> Panel de Administración
                </h1>
                
                {/* Selector de Vista Principal */}
                <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 shadow-inner">
                    <button 
                        onClick={() => setViewMode('users')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'users' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Users className="w-4 h-4 inline mr-2" /> Usuarios y Configuración
                    </button>
                    <button 
                        onClick={() => setViewMode('tickets')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'tickets' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        <MessageCircle className="w-4 h-4 inline mr-2" /> Tickets de Soporte
                    </button>
                </div>
            </div>

            {viewMode === 'users' ? (
                <>
                    {/* System Configuration Section */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-primary font-bold">#</span> Configuración Global
                        </h2>
                        <div className="max-w-2xl space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">URL de Redirección (Login/Registro Exitoso)</label>
                                <Input 
                                    type="text" 
                                    value={redirectUrl}
                                    onChange={(e) => setRedirectUrl(e.target.value)}
                                    placeholder="/dashboard"
                                />
                                <p className="text-xs text-gray-500 mt-2">Define a dónde van los usuarios inmediatamente después de iniciar sesión por defecto.</p>
                            </div>

                            {/* ////////// Selector visual para el método de pago activo global - 24/05/2025 10:30 ////////// */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Método de Pago Activo (Global)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setPaymentMethod('stripe')}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === 'stripe' ? 'bg-primary/20 border-primary text-white shadow-lg' : 'bg-black border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                    >
                                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'stripe' ? 'text-primary' : ''}`} />
                                        <div className="text-left">
                                            <p className="font-bold text-sm">Stripe</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-widest">Suscripciones</p>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('hotmart')}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === 'hotmart' ? 'bg-orange-500/20 border-orange-500 text-white shadow-lg' : 'bg-black border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                    >
                                        <ExternalLink className={`w-6 h-6 ${paymentMethod === 'hotmart' ? 'text-orange-500' : ''}`} />
                                        <div className="text-left">
                                            <p className="font-bold text-sm">Hotmart</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-widest">Pago Único/Recurrente</p>
                                        </div>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 italic">* El método seleccionado se aplicará a todos los usuarios que intenten comprar un plan.</p>
                            </div>
                            {/* ////////// Fin de actualización - 24/05/2025 10:30 ////////// */}

                            {/* ////////// Nueva Sección: Estado del Sistema (Modo Lanzamiento) ////////// */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Estado del Sistema</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setSystemMode('production')}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${systemMode === 'production' ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg' : 'bg-black border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                    >
                                        <Layout className={`w-6 h-6 ${systemMode === 'production' ? 'text-emerald-500' : ''}`} />
                                        <div className="text-left">
                                            <p className="font-bold text-sm">En Producción</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-widest">Modo Normal</p>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setSystemMode('launch')}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${systemMode === 'launch' ? 'bg-blue-500/20 border-blue-500 text-white shadow-lg' : 'bg-black border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                    >
                                        <Rocket className={`w-6 h-6 ${systemMode === 'launch' ? 'text-blue-500' : ''}`} />
                                        <div className="text-left">
                                            <p className="font-bold text-sm">En Lanzamiento</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-widest">Modo Lista de Espera</p>
                                        </div>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 italic">* El Modo Lanzamiento restringe el acceso de usuarios normales a una lista de espera.</p>
                            </div>
                            {/* ////////// Fin de actualización ////////// */}

                            {/* ////////// Nueva Sección: Configuración del Wizard ////////// */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Estado del Wizard de Inicio</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setWizardEnabled(true)}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${wizardEnabled === true ? 'bg-primary/20 border-primary text-white shadow-lg' : 'bg-black border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                    >
                                        <Wand2 className={`w-6 h-6 ${wizardEnabled === true ? 'text-primary' : ''}`} />
                                        <div className="text-left">
                                            <p className="font-bold text-sm">Wizard Activo</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-widest">Ejecutar tras encuesta</p>
                                        </div>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setWizardEnabled(false)}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${wizardEnabled === false ? 'bg-gray-500/20 border-gray-500 text-white shadow-lg' : 'bg-black border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                    >
                                        <X className={`w-6 h-6 ${wizardEnabled === false ? 'text-gray-400' : ''}`} />
                                        <div className="text-left">
                                            <p className="font-bold text-sm">Desactivado</p>
                                            <p className="text-[10px] opacity-70 uppercase tracking-widest">Redirección directa</p>
                                        </div>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-3 italic">* Si está activo, el usuario verá el asistente de estrategia IA después de completar su perfil inicial. Si está desactivado, el sistema permitirá que el usuario llene la encuesta pero no se ejecutará el wizard y redirigirá al usuario normalmente.</p>
                            </div>
                            {/* ////////// Fin de actualización ////////// */}

                            <button 
                                onClick={handleSaveSettings}
                                disabled={loadingSettings}
                                className="bg-primary hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 w-full md:w-auto"
                            >
                                {loadingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Guardar Cambios del Sistema
                            </button>
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
                </>
            ) : (
                /* VISTA: TICKETS DE SOPORTE */
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">Solicitudes de Eliminación Manual</h2>
                                <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">Gestiona los tickets de soporte enviados por los usuarios</p>
                            </div>
                            <button 
                                onClick={loadData}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[#FF5A1F]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="p-6">Usuario</th>
                                        <th className="p-6">Activo a Eliminar</th>
                                        <th className="p-6">Motivo de Solicitud</th>
                                        <th className="p-6">Fecha</th>
                                        <th className="p-6 text-center">Estado</th>
                                        <th className="p-6 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tickets.length > 0 ? tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6">
                                                <p className="text-white font-bold">{ticket.userName}</p>
                                                <p className="text-xs text-gray-500 font-medium">{ticket.userEmail}</p>
                                            </td>
                                            <td className="p-6 text-orange-400 font-bold">
                                                {ticket.itemName}
                                            </td>
                                            <td className="p-6">
                                                <p className="text-gray-400 text-sm leading-relaxed max-w-xs italic">"{ticket.reason}"</p>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(ticket.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${ticket.status === 'pending' ? 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30' : 'bg-emerald-900/20 text-emerald-400 border-emerald-900/30'}`}>
                                                    {ticket.status === 'pending' ? 'Pendiente' : 'Resuelto'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 bg-[#FF5A1F]/10 hover:bg-[#FF5A1F] text-[#FF5A1F] hover:text-white rounded-lg transition-all" title="Resolver Ticket">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 bg-red-900/10 hover:bg-red-900 text-red-500 hover:text-white rounded-lg transition-all" title="Eliminar Permanente">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="p-20 text-center text-gray-600 font-medium italic">
                                                No hay solicitudes de eliminación pendientes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ////////// Actualización: Integración de Suspense para UserContentModal Lazy - 05/06/2025 21:30 ////////// */}
            <React.Suspense fallback={null}>
                {viewingUser && (
                    <UserContentModal user={viewingUser} onClose={() => setViewingUser(null)} />
                )}
            </React.Suspense>
            {/* ////////// Fin de actualización - 05/06/2025 21:30 ////////// */}

            {/* Edit User Modal */}
            {editingUser && tempPlanLimits && (
                <div 
                    onClick={() => setEditingUser(null)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
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
                                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="space-y-4 pb-6 border-b border-gray-800">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                                            <span className="text-primary font-bold">#</span> Datos Personales
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
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nueva Contraseña (Dejar vacío para mantener la actual)</label>
                                            <input 
                                                type="password" 
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Ingresa una nueva contraseña para este usuario"
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                            />
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
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Límite Individual Ganchos (Prioritario)</label>
                                                <input 
                                                    type="number" 
                                                    value={editingUser.maxHooks || ''} 
                                                    onChange={(e) => setEditingUser({...editingUser, maxHooks: parseInt(e.target.value) || undefined})}
                                                    placeholder="Ej: 50"
                                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-orange-400 placeholder-gray-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: PLAN */}
                            {activeTab === 'plan' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
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
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Máx Secuencias Email</label>
                                            <input 
                                                type="number" 
                                                value={tempPlanLimits.maxEmailSequences || 0}
                                                onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxEmailSequences: parseInt(e.target.value) || 0})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-primary transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Máx Lanzamientos WhatsApp</label>
                                            <input 
                                                type="number" 
                                                value={tempPlanLimits.maxWhatsAppLaunches || 0}
                                                onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxWhatsAppLaunches: parseInt(e.target.value) || 0})}
                                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-primary transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Máx Ganchos IA</label>
                                            <input 
                                                type="number" 
                                                value={tempPlanLimits.maxHooks || 0}
                                                onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxHooks: parseInt(e.target.value) || 0})}
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
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                        <RefreshCw className="w-4 h-4 text-orange-400" /> Consumo Mensual Actual
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
                                            <UsageBar 
                                                label="Ganchos Creados" 
                                                current={userStats.hooks} 
                                                max={tempPlanLimits.maxHooks} 
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
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
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
                                                            <span className={`text-sm font-bold ${payment.status === 'succeeded' ? 'text-emerald-400' : 'text-red-400'}`}>
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
                <div 
                    onClick={() => setShowDeleteConfirm(null)}
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-red-900/50 p-6 rounded-xl max-w-sm w-full text-center"
                    >
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Usuario?</h3>
                        <p className="text-gray-400 text-sm mb-6">Esta acción borrará permanentemente al usuario y todos sus datos.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-700 rounded text-gray-300">Cancelar</button>
                            <button onClick={() => handleDeleteUser(showDeleteConfirm!)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold">Sí, Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
