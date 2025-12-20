
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

    useEffect(() => { loadPlans(); }, []);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const data = await api.getPlans();
            setPlans(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleEdit = (plan: Plan) => { setEditingPlan({ ...plan }); };

    const handleSave = async () => {
        if (!editingPlan?.name || !editingPlan?.slug) return;
        try {
            await api.savePlan(editingPlan as Plan);
            await loadPlans();
            setEditingPlan(null);
        } catch (e) { alert("Error guardando plan"); }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Gestión de Planes y Precios</h1>
                <button onClick={() => setEditingPlan({})} className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition">
                    <Plus className="w-4 h-4" /> Nuevo Plan
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative flex flex-col h-full">
                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                        <div className="text-2xl font-black text-white mb-4">${plan.priceMonthly} / mes</div>
                        
                        <div className="space-y-2 mb-6 text-xs text-gray-500">
                            {plan.stripePriceId && <p className="text-blue-400">Stripe ID: {plan.stripePriceId}</p>}
                            {plan.hotmartUrl && <p className="text-orange-400 truncate">Hotmart: {plan.hotmartUrl}</p>}
                        </div>

                        <button onClick={() => handleEdit(plan)} className="mt-auto bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex justify-center items-center gap-2 transition">
                            <Edit className="w-4 h-4" /> Editar
                        </button>
                    </div>
                ))}
            </div>

            {editingPlan && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6">
                        <h3 className="text-xl font-bold text-white">{editingPlan.id ? 'Editar Plan' : 'Crear Plan'}</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                            <input type="text" value={editingPlan.name || ''} onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                            <input type="text" value={editingPlan.slug || ''} onChange={(e) => setEditingPlan({...editingPlan, slug: e.target.value})} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" /></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                            <div>
                                <label className="block text-xs font-bold text-blue-400 uppercase mb-1 flex items-center gap-2"><CreditCard className="w-3 h-3" /> Stripe Price ID</label>
                                <input type="text" value={editingPlan.stripePriceId || ''} onChange={(e) => setEditingPlan({...editingPlan, stripePriceId: e.target.value})} className="w-full bg-black border border-blue-900/30 rounded px-3 py-2 text-blue-100 text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-orange-400 uppercase mb-1 flex items-center gap-2"><Zap className="w-3 h-3" /> Hotmart Checkout URL</label>
                                <input type="text" value={editingPlan.hotmartUrl || ''} onChange={(e) => setEditingPlan({...editingPlan, hotmartUrl: e.target.value})} className="w-full bg-black border border-orange-900/30 rounded px-3 py-2 text-orange-100 text-xs" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setEditingPlan(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2"><Save className="w-4 h-4" /> Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
