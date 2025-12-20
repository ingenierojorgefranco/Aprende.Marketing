
import React, { useState, useEffect } from 'react';
import { Plan, PlanLimits } from '../../../types';
import { api } from '../../../services/api';
import { Loader2, Plus, Edit, Trash2, CheckCircle, XCircle, Save, X, Star, Zap, CreditCard } from 'lucide-react';

const DEFAULT_LIMITS: PlanLimits = {
    planName: 'custom',
    maxProjects: 1,
    maxLandings: 1,
    maxArticles: 1,
    maxDomains: 1,
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
            stripePriceId: '',
            hotmartUrl: '',
            hotmartId: '',
            limitsConfig: { ...DEFAULT_LIMITS },
            uiFeatures: [],
            isActive: true,
            isRecommended: false
        });
        setActiveTab('general');
    };

    const handleEdit = (plan: Plan) => {
        const safeLimits = { ...DEFAULT_LIMITS, ...plan.limitsConfig, features: { ...DEFAULT_LIMITS.features, ...plan.limitsConfig.features } };
        setEditingPlan({ ...plan, limitsConfig: safeLimits });
        setActiveTab('general');
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este plan?")) {
            try {
                await api.deletePlan(id);
                setPlans(plans.filter(p => p.id !== id));
            } catch (e) { alert("Error eliminando plan"); }
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
        } catch (e) { alert("Error guardando plan"); }
    };

    const addUiFeature = () => { setEditingPlan(prev => ({ ...prev, uiFeatures: [...(prev?.uiFeatures || []), ""] })); };
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
                <button onClick={handleCreate} className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> Nuevo Plan
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className={`bg-gray-900 border rounded-xl p-6 relative group ${plan.isRecommended ? 'border-primary' : 'border-gray-800'}`}>
                        {plan.isRecommended && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold uppercase">Recomendado</div>}
                        <div className="flex justify-between items-start mb-4">
                            <div><h3 className="text-xl font-bold text-white">{plan.name}</h3><p className="text-sm text-gray-400 font-mono">{plan.slug}</p></div>
                            <div className="text-right"><p className="text-2xl font-black text-white">{plan.priceMonthly} {plan.currency}</p><span className={`text-xs px-2 py-0.5 rounded ${plan.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{plan.isActive ? 'Activo' : 'Inactivo'}</span></div>
                        </div>
                        <div className="space-y-1 mb-6 text-sm text-gray-300">
                            <p>Proyectos: <strong>{plan.limitsConfig.maxProjects}</strong></p>
                            <p>Landings: <strong>{plan.limitsConfig.maxLandings}</strong></p>
                            {plan.stripePriceId && <p className="text-[10px] text-blue-400 truncate">Stripe: {plan.stripePriceId}</p>}
                            {plan.hotmartUrl && <p className="text-[10px] text-orange-400 truncate">Hotmart: Configurado</p>}
                        </div>
                        <div className="flex gap-2"><button onClick={() => handleEdit(plan)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 transition">Editar</button><button onClick={() => handleDelete(plan.id)} className="p-2 bg-red-900/20 text-red-400 rounded-lg transition"><Trash2 className="w-4 h-4" /></button></div>
                    </div>
                ))}
            </div>

            {editingPlan && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold text-white">{editingPlan.id ? 'Editar Plan' : 'Crear Plan'}</h3>
                            <button onClick={() => setEditingPlan(null)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="flex border-b border-gray-800 bg-gray-900">
                            <button onClick={() => setActiveTab('general')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${activeTab === 'general' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>DATOS BÁSICOS</button>
                            <button onClick={() => setActiveTab('limits')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${activeTab === 'limits' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>LÍMITES</button>
                            <button onClick={() => setActiveTab('features')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${activeTab === 'features' ? 'border-primary text-white' : 'border-transparent text-gray-500'}`}>MARKETING</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            {activeTab === 'general' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label><input type="text" value={editingPlan.name} onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"/></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (ID único)</label><input type="text" value={editingPlan.slug} onChange={(e) => setEditingPlan({...editingPlan, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white font-mono"/></div>
                                    </div>
                                    
                                    {/* PASARELAS */}
                                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                                        {/* Stripe Settings */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Configuración Stripe</h4>
                                            <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Stripe Price ID</label><input type="text" value={editingPlan.stripePriceId || ''} onChange={(e) => setEditingPlan({...editingPlan, stripePriceId: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-xs font-mono" placeholder="price_..."/></div>
                                        </div>
                                        
                                        {/* Hotmart Settings */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2"><Zap className="w-4 h-4"/> Configuración Hotmart</h4>
                                            <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Hotlink de Pago</label><input type="text" value={editingPlan.hotmartUrl || ''} onChange={(e) => setEditingPlan({...editingPlan, hotmartUrl: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-xs" placeholder="https://pay.hotmart.com/..."/></div>
                                            <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ID de Producto Hotmart</label><input type="text" value={editingPlan.hotmartId || ''} onChange={(e) => setEditingPlan({...editingPlan, hotmartId: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-xs font-mono" placeholder="2345678"/></div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-800 flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingPlan.isActive} onChange={(e) => setEditingPlan({...editingPlan, isActive: e.target.checked})} className="accent-green-500 w-4 h-4"/><span className="text-white text-sm">Plan Activo</span></label>
                                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingPlan.isRecommended} onChange={(e) => setEditingPlan({...editingPlan, isRecommended: e.target.checked})} className="accent-primary w-4 h-4"/><span className="text-white text-sm">Recomendado</span></label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'limits' && editingPlan.limitsConfig && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Proyectos</label><input type="number" value={editingPlan.limitsConfig.maxProjects} onChange={(e) => setEditingPlan({...editingPlan, limitsConfig: { ...editingPlan.limitsConfig!, maxProjects: parseInt(e.target.value) }})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"/></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Landings</label><input type="number" value={editingPlan.limitsConfig.maxLandings} onChange={(e) => setEditingPlan({...editingPlan, limitsConfig: { ...editingPlan.limitsConfig!, maxLandings: parseInt(e.target.value) }})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"/></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dominios</label><input type="number" value={editingPlan.limitsConfig.maxDomains || 0} onChange={(e) => setEditingPlan({...editingPlan, limitsConfig: { ...editingPlan.limitsConfig!, maxDomains: parseInt(e.target.value) }})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"/></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Artículos SEO</label><input type="number" value={editingPlan.limitsConfig.maxArticles || 0} onChange={(e) => setEditingPlan({...editingPlan, limitsConfig: { ...editingPlan.limitsConfig!, maxArticles: parseInt(e.target.value) }})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"/></div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'features' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="flex justify-between items-center"><label className="block text-xs font-bold text-gray-500 uppercase">Bullets del Plan</label><button onClick={addUiFeature} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">+ Añadir</button></div>
                                    <div className="space-y-2">{(editingPlan.uiFeatures || []).map((feat, idx) => (<div key={idx} className="flex gap-2"><input type="text" value={feat} onChange={(e) => updateUiFeature(idx, e.target.value)} className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm"/><button onClick={() => removeUiFeature(idx)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button></div>))}</div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-end gap-3"><button onClick={() => setEditingPlan(null)} className="px-4 py-2 text-gray-400">Cancelar</button><button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-lg font-bold flex items-center gap-2"><Save className="w-4 h-4" /> Guardar Plan</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};
