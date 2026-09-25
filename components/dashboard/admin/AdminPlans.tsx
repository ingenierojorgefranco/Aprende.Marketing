
import React, { useState, useEffect } from 'react';
import { Plan, PlanLimits, User, Project } from '../../../types';
import { api } from '../../../services/api';
/* Added LayoutTemplate to fix the 'Cannot find name LayoutTemplate' error - 25/05/2025 18:45 */
import { Loader2, Plus, Edit, Trash2, CheckCircle, XCircle, Save, X, Star, CreditCard, Tag, Sparkles, LayoutTemplate, User as UserIcon, Search, Power, DollarSign, Calendar, Copy, Layers, Globe, FileText, Send, MessageSquare, Zap } from 'lucide-react';

const DEFAULT_LIMITS: PlanLimits = {
    planName: 'custom',
    maxProjects: 1,
    maxLandings: 1,
    maxArticles: 1,
    maxDomains: 1,
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
    },
    annual: {
        maxProjects: 12,
        maxLandings: 12,
        maxArticles: 12,
        maxDomains: 12,
        maxEmailSequences: 3,
        maxEmailSequencesNurturing: 15,
        maxWhatsAppLaunches: 3,
        maxHooks: 36
    }
};

export const AdminPlans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'limits' | 'features'>('general');
    const [limitsSubTab, setLimitsSubTab] = useState<'monthly' | 'annual'>('monthly');

    // Helpers para gestión unificada de Límites Mensuales vs Anuales
    const getLimitValue = (field: keyof PlanLimits, defaultVal = 0): number => {
        if (!editingPlan?.limitsConfig) return defaultVal;
        if (limitsSubTab === 'monthly') {
            return (editingPlan.limitsConfig[field] as number) ?? defaultVal;
        } else {
            const annualObj = editingPlan.limitsConfig.annual as any;
            if (annualObj && annualObj[field] !== undefined && annualObj[field] !== null) {
                return annualObj[field] as number;
            }
            return (editingPlan.limitsConfig[field] as number) ?? defaultVal;
        }
    };

    const updateLimitField = (field: keyof PlanLimits, value: number) => {
        if (!editingPlan?.limitsConfig) return;
        if (limitsSubTab === 'monthly') {
            setEditingPlan({
                ...editingPlan,
                limitsConfig: {
                    ...editingPlan.limitsConfig,
                    [field]: value
                }
            });
        } else {
            setEditingPlan({
                ...editingPlan,
                limitsConfig: {
                    ...editingPlan.limitsConfig,
                    annual: {
                        ...(editingPlan.limitsConfig.annual || {}),
                        [field]: value
                    }
                }
            });
        }
    };

    const copyMonthlyToAnnual = (multiplier = 1) => {
        if (!editingPlan?.limitsConfig) return;
        const m = editingPlan.limitsConfig;
        setEditingPlan({
            ...editingPlan,
            limitsConfig: {
                ...m,
                annual: {
                    maxProjects: (m.maxProjects || 1) * multiplier,
                    maxLandings: (m.maxLandings || 1) * multiplier,
                    maxDomains: (m.maxDomains || 1) * multiplier,
                    maxArticles: (m.maxArticles || 1) * (multiplier > 1 ? 12 : 1),
                    maxEmailSequences: (m.maxEmailSequences || 1) * multiplier,
                    maxEmailSequencesNurturing: m.maxEmailSequencesNurturing || 15,
                    maxWhatsAppLaunches: (m.maxWhatsAppLaunches || 1) * multiplier,
                    maxHooks: (m.maxHooks || 10) * (multiplier > 1 ? 12 : 1)
                }
            }
        });
    };

    // --- Gestión de Proyectos de Usuarios ---
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [showPaymentsModal, setShowPaymentsModal] = useState<{ isOpen: boolean, userId: string, userName: string }>({ isOpen: false, userId: '', userName: '' });
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);

    useEffect(() => {
        loadPlans();
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        }
    };

    const loadUserProjects = async (userId: string) => {
        if (!userId) {
            setUserProjects([]);
            return;
        }
        setLoadingProjects(true);
        try {
            const projects = await api.getAdminUserResources(userId, 'projects');
            // Ensure limitsConfig is parsed if it's a string and has defaults
            const processedProjects = projects.map((p: any) => ({
                ...p,
                limitsConfig: typeof p.limits_config === 'string' ? JSON.parse(p.limits_config) : (p.limits_config || { ...DEFAULT_LIMITS }),
                isActive: !!p.is_active
            }));
            setUserProjects(processedProjects);
        } catch (error) {
            console.error("Error cargando proyectos del usuario", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    const handleUserChange = (userId: string) => {
        setSelectedUserId(userId);
        loadUserProjects(userId);
    };

    const handleUpdateProjectLimits = async (projectId: string, limits: PlanLimits, isActive: boolean) => {
        try {
            await (api as any).adminUpdateProject(projectId, { limits_config: limits, is_active: isActive });
            alert("Proyecto actualizado correctamente");
            loadUserProjects(selectedUserId);
        } catch (error) {
            alert("Error actualizando proyecto");
        }
    };

    const handleViewPayments = async (userId: string, userName: string) => {
        setShowPaymentsModal({ isOpen: true, userId, userName });
        setLoadingPayments(true);
        try {
            const payments = await api.getUserPayments(userId);
            setPaymentHistory(payments);
        } catch (error) {
            console.error("Error cargando pagos", error);
        } finally {
            setLoadingPayments(false);
        }
    };

    const loadPlans = async () => {
        setLoading(true);
        try {
            const data = await api.getPlans();
            setPlans(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingPlan({
            name: '',
            slug: '',
            description: '',
            priceMonthly: 0,
            currency: 'EUR',
            stripePriceId: '', // Default empty
            ////////// Nuevo campo hotmartId inicializado vacío - 24/05/2025 10:30 //////////
            hotmartId: '',
            hotmartOffer: '',
            hotmartCheckoutMode: '',
            hotmartIdAnnual: '',
            hotmartOfferAnnual: '',
            hotmartCheckoutModeAnnual: '',
            limitsConfig: { 
                ...DEFAULT_LIMITS,
                annual: { ...(DEFAULT_LIMITS.annual || {}) }
            },
            uiFeatures: [],
            isActive: true,
            isRecommended: false
        });
        setActiveTab('general');
        setLimitsSubTab('monthly');
    };

    const handleEdit = (plan: Plan) => {
        // Ensure defaults if missing properties
        const rawLimits = plan.limitsConfig || {};
        const rawAnnual = (rawLimits as any).annual || {};

        const safeLimits: PlanLimits = { 
            ...DEFAULT_LIMITS, 
            ...rawLimits, 
            features: { ...DEFAULT_LIMITS.features, ...(rawLimits.features || {}) },
            annual: {
                maxProjects: rawAnnual.maxProjects !== undefined ? rawAnnual.maxProjects : (rawLimits.maxProjects ? rawLimits.maxProjects * 4 : 12),
                maxLandings: rawAnnual.maxLandings !== undefined ? rawAnnual.maxLandings : (rawLimits.maxLandings ? rawLimits.maxLandings * 4 : 12),
                maxDomains: rawAnnual.maxDomains !== undefined ? rawAnnual.maxDomains : (rawLimits.maxDomains ? rawLimits.maxDomains * 4 : 12),
                maxArticles: rawAnnual.maxArticles !== undefined ? rawAnnual.maxArticles : (rawLimits.maxArticles ? rawLimits.maxArticles * 4 : 12),
                maxEmailSequences: rawAnnual.maxEmailSequences !== undefined ? rawAnnual.maxEmailSequences : (rawLimits.maxEmailSequences ?? 3),
                maxEmailSequencesNurturing: rawAnnual.maxEmailSequencesNurturing !== undefined ? rawAnnual.maxEmailSequencesNurturing : (rawLimits.maxEmailSequencesNurturing ?? 15),
                maxWhatsAppLaunches: rawAnnual.maxWhatsAppLaunches !== undefined ? rawAnnual.maxWhatsAppLaunches : (rawLimits.maxWhatsAppLaunches ?? 3),
                maxHooks: rawAnnual.maxHooks !== undefined ? rawAnnual.maxHooks : (rawLimits.maxHooks ? rawLimits.maxHooks * 4 : 36)
            }
        };
        if (safeLimits.maxDomains === undefined) safeLimits.maxDomains = 1;
        if (safeLimits.maxEmailSequences === undefined) safeLimits.maxEmailSequences = 1;
        if (safeLimits.maxEmailSequencesNurturing === undefined) safeLimits.maxEmailSequencesNurturing = 15;
        if (safeLimits.maxWhatsAppLaunches === undefined) safeLimits.maxWhatsAppLaunches = 1;
        if (safeLimits.maxHooks === undefined) safeLimits.maxHooks = 10;

        setEditingPlan({ 
            ...plan, 
            stripePriceId: plan.stripePriceId || '',
            hotmartId: plan.hotmartId || '',
            hotmartOffer: plan.hotmartOffer || '',
            hotmartCheckoutMode: plan.hotmartCheckoutMode || '',
            hotmartIdAnnual: plan.hotmartIdAnnual || '',
            hotmartOfferAnnual: plan.hotmartOfferAnnual || '',
            hotmartCheckoutModeAnnual: plan.hotmartCheckoutModeAnnual || '',
            limitsConfig: safeLimits 
        });
        setActiveTab('general');
        setLimitsSubTab('monthly');
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este plan?")) {
            try {
                await api.deletePlan(id);
                setPlans(plans.filter(p => p.id !== id));
            } catch (e) {
                alert("Error eliminando plan");
            }
        }
    };

    const handleSave = async () => {
        if (!editingPlan?.name || !editingPlan?.slug) {
            alert("Nombre y Slug son obligatorios");
            return;
        }

        try {
            await api.savePlan(editingPlan as Plan);
            await loadPlans();
            setEditingPlan(null);
        } catch (e) {
            alert("Error guardando plan");
        }
    };

    // UI Features Helpers
    const addUiFeature = () => {
        setEditingPlan(prev => ({
            ...prev,
            uiFeatures: [...(prev?.uiFeatures || []), ""]
        }));
    };

    const updateUiFeature = (index: number, value: string) => {
        const features = [...(editingPlan?.uiFeatures || [])];
        features[index] = value;
        setEditingPlan(prev => ({ ...prev, uiFeatures: features }));
    };

    const removeUiFeature = (index: number) => {
        const features = [...(editingPlan?.uiFeatures || [])];
        features.splice(index, 1);
        setEditingPlan(prev => ({ ...prev, uiFeatures: features }));
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Gestión de Planes y Precios</h1>
                <button onClick={handleCreate} className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition">
                    <Plus className="w-4 h-4" /> Nuevo Plan
                </button>
            </div>

            {/* List */}
            <div className="grid md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className={`bg-gray-900 border rounded-xl p-6 relative group ${plan.isRecommended ? 'border-primary' : 'border-gray-800'}`}>
                        {plan.isRecommended && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold uppercase">
                                Recomendado
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                <p className="text-sm text-gray-400 font-mono">{plan.slug}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white">{plan.priceMonthly} {plan.currency}</p>
                                <span className={`text-xs px-2 py-0.5 rounded ${plan.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {plan.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-2 mb-6 text-sm text-gray-300">
                            <p>Proyectos: <strong>{plan.limitsConfig.maxProjects}</strong></p>
                            <p>Landings: <strong>{plan.limitsConfig.maxLandings}</strong></p>
                            <p>Dominios: <strong>{plan.limitsConfig.maxDomains || 0}</strong></p>
                            <p>Artículos SEO: <strong>{plan.limitsConfig.maxArticles || 0}</strong></p>
                            <p>Email Conversión: <strong>{plan.limitsConfig.maxEmailSequences || 0}</strong></p>
                            <p>Email Nutrición: <strong>{plan.limitsConfig.maxEmailSequencesNurturing || 0}</strong></p>
                            <p>Lanzamientos WA: <strong>{plan.limitsConfig.maxWhatsAppLaunches || 0}</strong></p>
                            <p>Ganchos IA: <strong>{plan.limitsConfig.maxHooks || 0}</strong></p>
                            <p>Features: {Object.values(plan.limitsConfig.features).filter(Boolean).length} activas</p>
                            {plan.stripePriceId && (
                                <p className="text-xs text-blue-400 truncate mt-2 bg-blue-950/20 p-1.5 rounded border border-blue-500/20">
                                    <span className="font-semibold text-blue-300">Stripe:</span> {plan.stripePriceId}
                                </p>
                            )}
                            {plan.hotmartId && (
                                <div className="text-xs text-orange-400 truncate mt-2 space-y-1 bg-orange-950/20 p-2 rounded border border-orange-500/20">
                                    <p className="font-semibold text-orange-300">Hotmart Mensual: {plan.hotmartId}</p>
                                    {(plan.hotmartOffer || plan.hotmartCheckoutMode) && (
                                        <p className="opacity-80 text-[11px]">
                                            {plan.hotmartOffer ? `off: ${plan.hotmartOffer}` : ''} 
                                            {plan.hotmartCheckoutMode ? ` | mode: ${plan.hotmartCheckoutMode}` : ''}
                                        </p>
                                    )}
                                    {plan.hotmartOfferAnnual && (
                                        <div className="pt-1 mt-1 border-t border-orange-500/20 text-amber-300">
                                            <p className="font-semibold text-amber-300">Hotmart Anual: {plan.hotmartIdAnnual || plan.hotmartId}</p>
                                            <p className="opacity-80 text-[11px]">
                                                off: {plan.hotmartOfferAnnual}
                                                {plan.hotmartCheckoutModeAnnual ? ` | mode: ${plan.hotmartCheckoutModeAnnual}` : ''}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(plan)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 transition">
                                <Edit className="w-4 h-4" /> Editar
                            </button>
                            {/* Fix: changed handleDelete(id) to handleDelete(plan.id) - Line 194 */}
                            <button onClick={() => handleDelete(plan.id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingPlan && (
                <div 
                    onClick={() => setEditingPlan(null)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="text-xl font-bold text-white">{editingPlan.id ? 'Editar Plan' : 'Crear Plan'}</h3>
                            <button onClick={() => setEditingPlan(null)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-800 bg-gray-900">
                            <button 
                                onClick={() => setActiveTab('general')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'general' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                General
                            </button>
                            <button 
                                onClick={() => setActiveTab('limits')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'limits' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Límites Técnicos
                            </button>
                            <button 
                                onClick={() => setActiveTab('features')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'features' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                Marketing (UI)
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            {activeTab === 'general' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                                            <input 
                                                type="text" 
                                                value={editingPlan.name} 
                                                onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (ID único)</label>
                                            <input 
                                                type="text" 
                                                value={editingPlan.slug} 
                                                onChange={(e) => setEditingPlan({...editingPlan, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Mensual</label>
                                            <input 
                                                type="number" 
                                                value={editingPlan.priceMonthly} 
                                                onChange={(e) => setEditingPlan({...editingPlan, priceMonthly: parseFloat(e.target.value)})}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Moneda</label>
                                            <select 
                                                value={editingPlan.currency}
                                                onChange={(e) => setEditingPlan({...editingPlan, currency: e.target.value})}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                            >
                                                <option value="EUR">EUR (€)</option>
                                                <option value="USD">USD ($)</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                     {/* SECCIÓN STRIPE (INDEPENDIENTE) */}
                                     <div className="bg-[#0e1726]/70 border border-blue-500/25 rounded-xl p-4 space-y-2">
                                         <div className="flex items-center gap-2">
                                             <CreditCard className="w-4 h-4 text-blue-400"/>
                                             <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">Pasarela Stripe</h4>
                                         </div>
                                         <div>
                                             <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Stripe Price ID</label>
                                             <input 
                                                 type="text" 
                                                 value={editingPlan.stripePriceId || ''}
                                                 onChange={(e) => setEditingPlan({...editingPlan, stripePriceId: e.target.value})}
                                                 className="w-full bg-black/80 border border-blue-900/60 rounded-lg px-3 py-2 text-blue-100 font-mono text-sm placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                                                 placeholder="Ej: price_1SdGwIRJVKdziYWKRDtjacOl"
                                             />
                                             <span className="text-[11px] text-gray-500 mt-1 block">ID de precio o suscripción recurrente en Stripe.</span>
                                         </div>
                                     </div>

                                     {/* SECCIÓN HOTMART - PLAN MENSUAL */}
                                     <div className="bg-[#1a0f0a]/70 border border-orange-500/25 rounded-xl p-4 space-y-3">
                                         <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                 <Tag className="w-4 h-4 text-[#FF5A1F]"/>
                                                 <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wider">Hotmart — Plan Mensual</h4>
                                             </div>
                                             <span className="text-[10px] font-bold uppercase bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">Pago Mensual</span>
                                         </div>
                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                             <div>
                                                 <label className="block text-[11px] font-bold text-orange-400 uppercase mb-1 flex items-center gap-1">
                                                     <Tag className="w-3 h-3"/> Product ID
                                                 </label>
                                                 <input 
                                                     type="text" 
                                                     value={editingPlan.hotmartId || ''}
                                                     onChange={(e) => setEditingPlan({...editingPlan, hotmartId: e.target.value})}
                                                     className="w-full bg-black/80 border border-orange-900/50 rounded-lg px-3 py-2 text-orange-100 font-mono text-sm placeholder-gray-600 focus:border-orange-500 focus:outline-none"
                                                     placeholder="Ej: L43619849X"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-[11px] font-bold text-orange-400 uppercase mb-1 flex items-center gap-1">
                                                     <Sparkles className="w-3 h-3"/> Código Oferta (off)
                                                 </label>
                                                 <input 
                                                     type="text" 
                                                     value={editingPlan.hotmartOffer || ''}
                                                     onChange={(e) => setEditingPlan({...editingPlan, hotmartOffer: e.target.value})}
                                                     className="w-full bg-black/80 border border-orange-900/50 rounded-lg px-3 py-2 text-orange-100 font-mono text-sm placeholder-gray-600 focus:border-orange-500 focus:outline-none"
                                                     placeholder="Ej: 0yieku7c"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-[11px] font-bold text-orange-400 uppercase mb-1 flex items-center gap-1">
                                                     <LayoutTemplate className="w-3 h-3"/> Modo Checkout
                                                 </label>
                                                 <input 
                                                     type="text" 
                                                     value={editingPlan.hotmartCheckoutMode || ''}
                                                     onChange={(e) => setEditingPlan({...editingPlan, hotmartCheckoutMode: e.target.value})}
                                                     className="w-full bg-black/80 border border-orange-900/50 rounded-lg px-3 py-2 text-orange-100 font-mono text-sm placeholder-gray-600 focus:border-orange-500 focus:outline-none"
                                                     placeholder="Ej: 6 o 10"
                                                 />
                                             </div>
                                         </div>
                                     </div>

                                     {/* SECCIÓN HOTMART - PLAN ANUAL */}
                                     <div className="bg-[#1a140a]/70 border border-amber-500/25 rounded-xl p-4 space-y-3">
                                         <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                 <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                 <Sparkles className="w-4 h-4 text-amber-400"/>
                                                 <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Hotmart — Plan Anual</h4>
                                             </div>
                                             <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Pago Anual (-25% Dto)</span>
                                         </div>
                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                             <div>
                                                 <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1 flex items-center gap-1">
                                                     <Tag className="w-3 h-3"/> Product ID (Anual)
                                                 </label>
                                                 <input 
                                                     type="text" 
                                                     value={editingPlan.hotmartIdAnnual || ''}
                                                     onChange={(e) => setEditingPlan({...editingPlan, hotmartIdAnnual: e.target.value})}
                                                     className="w-full bg-black/80 border border-amber-900/50 rounded-lg px-3 py-2 text-amber-100 font-mono text-sm placeholder-gray-600 focus:border-amber-500 focus:outline-none"
                                                     placeholder="Mismo ID si es el mismo producto"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1 flex items-center gap-1">
                                                     <Sparkles className="w-3 h-3"/> Código Oferta Anual (off)
                                                 </label>
                                                 <input 
                                                     type="text" 
                                                     value={editingPlan.hotmartOfferAnnual || ''}
                                                     onChange={(e) => setEditingPlan({...editingPlan, hotmartOfferAnnual: e.target.value})}
                                                     className="w-full bg-black/80 border border-amber-900/50 rounded-lg px-3 py-2 text-amber-100 font-mono text-sm placeholder-gray-600 focus:border-amber-500 focus:outline-none"
                                                     placeholder="Ej: x9klp2a"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1 flex items-center gap-1">
                                                     <LayoutTemplate className="w-3 h-3"/> Modo Checkout Anual
                                                 </label>
                                                 <input 
                                                     type="text" 
                                                     value={editingPlan.hotmartCheckoutModeAnnual || ''}
                                                     onChange={(e) => setEditingPlan({...editingPlan, hotmartCheckoutModeAnnual: e.target.value})}
                                                     className="w-full bg-black/80 border border-amber-900/50 rounded-lg px-3 py-2 text-amber-100 font-mono text-sm placeholder-gray-600 focus:border-amber-500 focus:outline-none"
                                                     placeholder="Ej: 6 o 10"
                                                 />
                                             </div>
                                         </div>
                                         <p className="text-[11px] text-gray-500">
                                             Se cargará automáticamente cuando el usuario seleccione la opción de facturación anual en el modal de suscripción.
                                         </p>
                                     </div>

                                    {/* URL DE AGRADECIMIENTO POST-COMPRA */}
                                    <div className="bg-[#1a0f0a]/50 border border-orange-500/30 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                        <div>
                                            <span className="text-orange-400 font-bold block uppercase tracking-wider text-[10px]">URL de Agradecimiento (Página de Gracias en Hotmart):</span>
                                            <span className="font-mono text-gray-300 text-[11px] break-all">{typeof window !== 'undefined' ? `${window.location.origin}/suscripcion/exito` : 'https://aprende.marketing/suscripcion/exito'}</span>
                                            <span className="text-[10px] text-gray-500 block mt-0.5">Configura esta URL en Hotmart como tu página de agradecimiento. El comprador verá los detalles de su orden y plan activo.</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const url = typeof window !== 'undefined' ? `${window.location.origin}/suscripcion/exito` : 'https://aprende.marketing/suscripcion/exito';
                                                navigator.clipboard.writeText(url);
                                                alert("¡URL de agradecimiento copiada!: " + url);
                                            }}
                                            className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded-lg font-bold shrink-0 transition"
                                        >
                                            Copiar URL
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción Corta</label>
                                        <textarea 
                                            value={editingPlan.description}
                                            onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white h-20"
                                        />
                                    </div>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={editingPlan.isActive}
                                                onChange={(e) => setEditingPlan({...editingPlan, isActive: e.target.checked})}
                                                className="accent-green-500 w-4 h-4"
                                            />
                                            <span className="text-white text-sm">Plan Activo</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={editingPlan.isRecommended}
                                                onChange={(e) => setEditingPlan({...editingPlan, isRecommended: e.target.checked})}
                                                className="accent-primary w-4 h-4"
                                            />
                                            <span className="text-white text-sm flex items-center gap-1"><Star className="w-3 h-3 fill-current text-yellow-500"/> Recomendado</span>
                                        </label>
                                    </div>
                                </>
                            )}

                            {activeTab === 'limits' && editingPlan.limitsConfig && (
                                <>
                                    {/* Selector de periodo: Mensual vs Anual */}
                                    <div className="flex bg-black/50 p-1.5 rounded-2xl border border-gray-800 mb-5 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setLimitsSubTab('monthly')}
                                            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                                limitsSubTab === 'monthly'
                                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <Calendar className="w-4 h-4" /> Límites Plan Mensual (30 días)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLimitsSubTab('annual')}
                                            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                                limitsSubTab === 'annual'
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <Sparkles className="w-4 h-4 text-amber-200" /> Límites Plan Anual (365 días)
                                        </button>
                                    </div>

                                    {/* Banner contextual explicativo */}
                                    {limitsSubTab === 'monthly' ? (
                                        <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 mb-5 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-blue-300">Configurando límites para suscriptores en cobro Mensual.</p>
                                                <p className="text-[11px] text-gray-400 mt-0.5">Se aplican automáticamente cuando el cliente paga la suscripción recurrente mensual (ej: $79 USD).</p>
                                            </div>
                                            <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-blue-500/30 shrink-0">
                                                Ciclo: 30 días
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="bg-gradient-to-r from-amber-950/40 to-orange-950/40 p-4 rounded-xl border border-amber-500/40 mb-5 space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                                        <Sparkles className="w-3.5 h-3.5" /> Límites exclusivos para suscriptores en cobro Anual.
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">Se aplican cuando el cliente paga la suscripción anual completa (ej: $708 USD / 365 días).</p>
                                                </div>
                                                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-amber-500/40 shrink-0 self-start sm:self-auto">
                                                    Ciclo: 365 días
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t border-amber-500/20 flex flex-wrap gap-2 items-center">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acciones rápidas:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => copyMonthlyToAnnual(1)}
                                                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 border border-white/10"
                                                >
                                                    <Copy className="w-3 h-3 text-gray-400" /> Copiar valores de mensual
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => copyMonthlyToAnnual(4)}
                                                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border border-amber-500/30"
                                                >
                                                    <Sparkles className="w-3 h-3 text-amber-300" /> Multiplicar x4 Proyectos/Dominios
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Grid de campos técnicos */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Máx Proyectos ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxProjects', 1)} 
                                                onChange={(e) => updateLimitField('maxProjects', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500 transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Negocios digitales creados simultáneamente.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Máx Landings ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxLandings', 1)} 
                                                onChange={(e) => updateLimitField('maxLandings', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500 transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Páginas de captura y embudos de venta.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Máx Dominios Personalizados ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxDomains', 0)} 
                                                onChange={(e) => updateLimitField('maxDomains', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-green-500 outline-none transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Dominios propios (ej: .com).</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Máx Artículos SEO ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxArticles', 0)} 
                                                onChange={(e) => updateLimitField('maxArticles', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-purple-500 outline-none transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Bolsa global de artículos de blog SEO compartida entre todos los proyectos del usuario.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Secuencia Email Conversión ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxEmailSequences', 0)} 
                                                onChange={(e) => updateLimitField('maxEmailSequences', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-yellow-500 outline-none transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Límite de secuencias de conversión.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Secuencia Emails Nutrición ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxEmailSequencesNurturing', 0)} 
                                                onChange={(e) => updateLimitField('maxEmailSequencesNurturing', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-orange-500 outline-none transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Límite de secuencias de nutrición.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Máx Lanzamientos WhatsApp ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxWhatsAppLaunches', 0)} 
                                                onChange={(e) => updateLimitField('maxWhatsAppLaunches', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 outline-none transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Cupos para lanzamientos de grupos.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                                Máx Ganchos de Atracción ({limitsSubTab === 'monthly' ? 'Mensual' : 'Anual'})
                                            </label>
                                            <input 
                                                type="number" 
                                                value={getLimitValue('maxHooks', 0)} 
                                                onChange={(e) => updateLimitField('maxHooks', parseInt(e.target.value) || 0)}
                                                className="w-full bg-black border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-orange-500 outline-none transition"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Bolsa global de ganchos IA compartida entre todos los proyectos del usuario.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-5 border-t border-gray-800 mt-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-bold text-white">Feature Flags (Módulos Especiales)</h4>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Aplica a ambas modalidades</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(editingPlan.limitsConfig.features).map(([key, val]) => (
                                                <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${val ? 'bg-green-900/10 border-green-500/30' : 'bg-black border-gray-800 hover:border-gray-700'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={val}
                                                        onChange={(e) => setEditingPlan({
                                                            ...editingPlan,
                                                            limitsConfig: {
                                                                ...editingPlan.limitsConfig!,
                                                                features: { ...editingPlan.limitsConfig!.features, [key]: e.target.checked }
                                                            }
                                                        })}
                                                        className="accent-primary"
                                                    />
                                                    <span className={`text-sm font-medium transition-colors ${val ? 'text-green-300' : 'text-gray-400 group-hover:text-gray-200'} capitalize`}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'features' && (
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Lista de Características (Visual)</label>
                                        <button onClick={addUiFeature} className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Añadir
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {editingPlan.uiFeatures?.map((feat, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={feat} 
                                                    onChange={(e) => updateUiFeature(idx, e.target.value)}
                                                    className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm"
                                                    placeholder="Ej: Soporte 24/7"
                                                />
                                                <button onClick={() => removeUiFeature(idx)} className="text-red-500 hover:bg-red-900/20 p-2 rounded">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-end gap-3">
                            <button onClick={() => setEditingPlan(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2">
                                <Save className="w-4 h-4" /> Guardar Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SECCIÓN: GESTIÓN DE PROYECTOS DE USUARIOS */}
            <div className="pt-10 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                    <UserIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-white">Gestión de Proyectos de Usuarios</h2>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Seleccionar Usuario
                    </label>
                    <select 
                        value={selectedUserId}
                        onChange={(e) => handleUserChange(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition"
                    >
                        <option value="">Seleccionar un usuario...</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>
                                [{u.id}] {u.name} - {u.email}
                            </option>
                        ))}
                    </select>
                </div>

                {loadingProjects ? (
                    <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : selectedUserId && userProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {userProjects.map(project => (
                            <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                                        <p className="text-sm text-gray-500">{project.niche}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleUpdateProjectLimits(project.id, project.limitsConfig!, !project.isActive)}
                                            className={`p-2 rounded-lg transition ${project.isActive ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}
                                            title={project.isActive ? 'Desactivar Proyecto' : 'Activar Proyecto'}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleViewPayments(selectedUserId, users.find(u => u.id === selectedUserId)?.name || '')}
                                            className="p-2 bg-blue-900/20 text-blue-400 rounded-lg hover:bg-blue-900/40 transition"
                                            title="Ver Pagos del Usuario"
                                        >
                                            <DollarSign className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Landings</label>
                                        <input 
                                            type="number" 
                                            value={project.limitsConfig?.maxLandings || 0}
                                            onChange={(e) => {
                                                const newLimits = { ...project.limitsConfig!, maxLandings: parseInt(e.target.value) };
                                                setUserProjects(prev => prev.map(p => p.id === project.id ? { ...p, limitsConfig: newLimits } : p));
                                            }}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Artículos</label>
                                        <input 
                                            type="number" 
                                            value={project.limitsConfig?.maxArticles || 0}
                                            onChange={(e) => {
                                                const newLimits = { ...project.limitsConfig!, maxArticles: parseInt(e.target.value) };
                                                setUserProjects(prev => prev.map(p => p.id === project.id ? { ...p, limitsConfig: newLimits } : p));
                                            }}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Conv.</label>
                                        <input 
                                            type="number" 
                                            value={project.limitsConfig?.maxEmailSequences || 0}
                                            onChange={(e) => {
                                                const newLimits = { ...project.limitsConfig!, maxEmailSequences: parseInt(e.target.value) };
                                                setUserProjects(prev => prev.map(p => p.id === project.id ? { ...p, limitsConfig: newLimits } : p));
                                            }}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Nutr.</label>
                                        <input 
                                            type="number" 
                                            value={project.limitsConfig?.maxEmailSequencesNurturing || 0}
                                            onChange={(e) => {
                                                const newLimits = { ...project.limitsConfig!, maxEmailSequencesNurturing: parseInt(e.target.value) };
                                                setUserProjects(prev => prev.map(p => p.id === project.id ? { ...p, limitsConfig: newLimits } : p));
                                            }}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                                        <input 
                                            type="number" 
                                            value={project.limitsConfig?.maxWhatsAppLaunches || 0}
                                            onChange={(e) => {
                                                const newLimits = { ...project.limitsConfig!, maxWhatsAppLaunches: parseInt(e.target.value) };
                                                setUserProjects(prev => prev.map(p => p.id === project.id ? { ...p, limitsConfig: newLimits } : p));
                                            }}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-white text-sm"
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleUpdateProjectLimits(project.id, project.limitsConfig!, !!project.isActive)}
                                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition"
                                >
                                    <Save className="w-4 h-4" /> Guardar Cambios del Proyecto
                                </button>
                            </div>
                        ))}
                    </div>
                ) : selectedUserId ? (
                    <div className="text-center p-10 bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl">
                        <p className="text-gray-500">Este usuario no tiene proyectos creados.</p>
                    </div>
                ) : null}
            </div>

            {/* Payments Modal */}
            {showPaymentsModal.isOpen && (
                <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="text-xl font-bold text-white">Historial de Pagos: {showPaymentsModal.userName}</h3>
                            <button onClick={() => setShowPaymentsModal({ ...showPaymentsModal, isOpen: false })} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {loadingPayments ? (
                                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : paymentHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentHistory.map((p, i) => (
                                        <div key={i} className="bg-black/40 border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                                            <div>
                                                <p className="text-white font-bold">{p.amount} {p.currency}</p>
                                                <p className="text-[10px] text-gray-500">{new Date(p.created_at).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${p.status === 'succeeded' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                                    {p.status}
                                                </span>
                                                <p className="text-[10px] text-gray-500 mt-1">{p.payment_method}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-10">No se encontraron pagos para este usuario.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
