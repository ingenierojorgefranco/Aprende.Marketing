
import React, { useState, useEffect } from 'react';
import { Plan, PlanLimits } from '../../../types';
import { api } from '../../../services/api';
/* Added LayoutTemplate to fix the 'Cannot find name LayoutTemplate' error - 25/05/2025 18:45 */
import { Loader2, Plus, Edit, Trash2, CheckCircle, XCircle, Save, X, Star, CreditCard, Tag, Sparkles, LayoutTemplate } from 'lucide-react';

const DEFAULT_LIMITS: PlanLimits = {
    planName: 'custom',
    maxProjects: 1,
    maxLandings: 1,
    maxArticles: 1,
    maxDomains: 1,
    maxEmailSequences: 1,
    maxWhatsAppLaunches: 1, // Añadido para corregir error de propiedad faltante en PlanLimits
    features: {
        whatsappBot: false,
        blogGenerator: false,
        emailMarketing: false,
        removeBranding: false,
        emailStrategy: false,
        evergreenStrategy: false
    }
};

export const AdminPlans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'limits' | 'features'>('general');

    useEffect(() => {
        loadPlans();
    }, []);

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
            ////////// Fin de actualización - 24/05/2025 10:30 //////////
            ////////// Nuevo campo hotmartOffer inicializado vacío - 25/05/2025 15:30 //////////
            hotmartOffer: '',
            ////////// Fin de actualización - 25/05/2025 15:30 //////////
            ////////// Nuevo campo hotmartCheckoutMode inicializado vacío - 25/05/2025 18:45 //////////
            hotmartCheckoutMode: '',
            ////////// Fin de actualización - 25/05/2025 18:45 //////////
            limitsConfig: { ...DEFAULT_LIMITS },
            uiFeatures: [],
            isActive: true,
            isRecommended: false
        });
        setActiveTab('general');
    };

    const handleEdit = (plan: Plan) => {
        // Ensure defaults if missing properties
        const safeLimits = { ...DEFAULT_LIMITS, ...plan.limitsConfig, features: { ...DEFAULT_LIMITS.features, ...plan.limitsConfig.features } };
        if (safeLimits.maxDomains === undefined) safeLimits.maxDomains = 1;
        if (safeLimits.maxEmailSequences === undefined) safeLimits.maxEmailSequences = 1;
        if (safeLimits.maxWhatsAppLaunches === undefined) safeLimits.maxWhatsAppLaunches = 1;

        setEditingPlan({ ...plan, limitsConfig: safeLimits });
        setActiveTab('general');
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
                            <p>Secuencias Email: <strong>{plan.limitsConfig.maxEmailSequences || 0}</strong></p>
                            <p>Lanzamientos WA: <strong>{plan.limitsConfig.maxWhatsAppLaunches || 0}</strong></p>
                            <p>Features: {Object.values(plan.limitsConfig.features).filter(Boolean).length} activas</p>
                            {plan.stripePriceId && <p className="text-xs text-blue-400 truncate mt-2">Stripe: {plan.stripePriceId}</p>}
                            {/* ////////// Visualización de Hotmart ID, Oferta y Modo en la lista - 25/05/2025 18:45 ////////// */}
                            {plan.hotmartId && (
                                <div className="text-xs text-orange-400 truncate mt-1 space-y-0.5">
                                    <p>ID Hotmart: {plan.hotmartId}</p>
                                    {(plan.hotmartOffer || plan.hotmartCheckoutMode) && (
                                        <p className="opacity-80">
                                            {plan.hotmartOffer ? `off: ${plan.hotmartOffer}` : ''} 
                                            {plan.hotmartCheckoutMode ? ` | mode: ${plan.hotmartCheckoutMode}` : ''}
                                        </p>
                                    )}
                                </div>
                            )}
                            {/* ////////// Fin de actualización - 25/05/2025 18:45 ////////// */}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(plan)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 transition">
                                <Edit className="w-4 h-4" /> Editar
                            </button>
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
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* STRIPE PRICE ID INPUT */}
                                        <div>
                                            <label className="block text-xs font-bold text-blue-400 uppercase mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Stripe Price ID</label>
                                            <input 
                                                type="text" 
                                                value={editingPlan.stripePriceId || ''}
                                                onChange={(e) => setEditingPlan({...editingPlan, stripePriceId: e.target.value})}
                                                className="w-full bg-black border border-blue-900/50 rounded px-3 py-2 text-blue-100 font-mono placeholder-gray-600 focus:border-blue-500"
                                                placeholder="Ej: price_1SdGw..."
                                            />
                                        </div>

                                        {/* ////////// Campo para Hotmart Product ID - 24/05/2025 ////////// */}
                                        <div>
                                            <label className="block text-xs font-bold text-orange-400 uppercase mb-1 flex items-center gap-1"><Tag className="w-3 h-3"/> Hotmart Product ID</label>
                                            <input 
                                                type="text" 
                                                value={editingPlan.hotmartId || ''}
                                                onChange={(e) => setEditingPlan({...editingPlan, hotmartId: e.target.value})}
                                                className="w-full bg-black border border-orange-900/50 rounded px-3 py-2 text-orange-100 font-mono placeholder-gray-600 focus:border-orange-500"
                                                placeholder="Ej: 2458123"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* ////////// Campo para Código de Oferta Hotmart (off) - 25/05/2025 15:30 ////////// */}
                                        <div>
                                            <label className="block text-xs font-bold text-orange-400 uppercase mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Código Oferta (off)</label>
                                            <input 
                                                type="text" 
                                                value={editingPlan.hotmartOffer || ''}
                                                onChange={(e) => setEditingPlan({...editingPlan, hotmartOffer: e.target.value})}
                                                className="w-full bg-black border border-orange-900/50 rounded px-3 py-2 text-orange-100 font-mono placeholder-gray-600 focus:border-orange-500"
                                                placeholder="Ej: udz8rafl"
                                            />
                                        </div>
                                        {/* ////////// Fin de actualización - 25/05/2025 15:30 ////////// */}

                                        {/* ////////// Nuevo campo para Modo de Checkout Hotmart (checkoutMode) - 25/05/2025 18:45 ////////// */}
                                        <div>
                                            <label className="block text-xs font-bold text-orange-400 uppercase mb-1 flex items-center gap-1"><LayoutTemplate className="w-3 h-3"/> Modo Checkout (checkoutMode)</label>
                                            <input 
                                                type="text" 
                                                value={editingPlan.hotmartCheckoutMode || ''}
                                                onChange={(e) => setEditingPlan({...editingPlan, hotmartCheckoutMode: e.target.value})}
                                                className="w-full bg-black border border-orange-900/50 rounded px-3 py-2 text-orange-100 font-mono placeholder-gray-600 focus:border-orange-500"
                                                placeholder="Ej: 6 o 10"
                                            />
                                        </div>
                                        {/* ////////// Fin de actualización - 25/05/2025 18:45 ////////// */}
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
                                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50 mb-4">
                                        <p className="text-xs text-blue-300">Estos límites se aplican automáticamente en la lógica del sistema.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Máx Proyectos</label>
                                            <input 
                                                type="number" 
                                                value={editingPlan.limitsConfig.maxProjects} 
                                                onChange={(e) => setEditingPlan({
                                                    ...editingPlan, 
                                                    limitsConfig: { ...editingPlan.limitsConfig!, maxProjects: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Máx Landings</label>
                                            <input 
                                                type="number" 
                                                value={editingPlan.limitsConfig.maxLandings} 
                                                onChange={(e) => setEditingPlan({
                                                    ...editingPlan, 
                                                    limitsConfig: { ...editingPlan.limitsConfig!, maxLandings: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* NEW: Max Domains & Articles & Email Sequences & WA Launches Input */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Máx Dominios Personalizados</label>
                                            <input 
                                                type="number" 
                                                value={editingPlan.limitsConfig.maxDomains || 0} 
                                                onChange={(e) => setEditingPlan({
                                                    ...editingPlan, 
                                                    limitsConfig: { ...editingPlan.limitsConfig!, maxDomains: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 outline-none"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Dominios propios (ej: .com).</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Máx Artículos SEO</label>
                                            <input 
                                                type="number" 
                                                value={editingPlan.limitsConfig.maxArticles || 0} 
                                                onChange={(e) => setEditingPlan({
                                                    ...editingPlan, 
                                                    limitsConfig: { ...editingPlan.limitsConfig!, maxArticles: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-purple-500 outline-none"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Límite mensual de generación IA.</p>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Máx Secuencias Email</label>
                                            <input 
                                                type="number" 
                                                value={editingPlan.limitsConfig.maxEmailSequences || 0} 
                                                onChange={(e) => setEditingPlan({
                                                    ...editingPlan, 
                                                    limitsConfig: { ...editingPlan.limitsConfig!, maxEmailSequences: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-500 outline-none"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Límite de secuencias activas.</p>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Máx Lanzamientos WhatsApp</label>
                                            <input 
                                                type="number" 
                                                value={editingPlan.limitsConfig.maxWhatsAppLaunches || 0} 
                                                onChange={(e) => setEditingPlan({
                                                    ...editingPlan, 
                                                    limitsConfig: { ...editingPlan.limitsConfig!, maxWhatsAppLaunches: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-emerald-500 outline-none"
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">Cupos para lanzamientos de grupos.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-gray-800 mt-4">
                                        <h4 className="text-sm font-bold text-white mb-3">Feature Flags</h4>
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
        </div>
    );
};
