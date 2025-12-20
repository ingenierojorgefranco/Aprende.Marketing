
import React, { useEffect, useState } from 'react';
import { User, PlanLimits, Plan, UserUsageStats } from '../../../types';
import { api } from '../../../services/api';
/* Fix: Import Settings from lucide-react */
import { Loader2, Shield, Users, Edit, Trash2, Check, X, Save, AlertTriangle, Eye, ChevronDown, ChevronUp, Folder, FileText, Globe, Link as LinkIcon, User as UserIcon, Mail, Calendar, Upload, BarChart, RefreshCw, CreditCard, ExternalLink, Zap, Settings } from 'lucide-react';

export const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [tempPlanLimits, setTempPlanLimits] = useState<PlanLimits | null>(null);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [paymentProvider, setPaymentProvider] = useState('stripe');
    const [loadingSettings, setLoadingSettings] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, plansData, settingsData, providerData] = await Promise.all([
                api.getUsers(),
                api.getPlans(),
                api.getLoginRedirect().catch(() => '/dashboard'),
                api.getActivePaymentProvider().catch(() => 'stripe')
            ]);
            setUsers(usersData);
            setPlans(plansData);
            setRedirectUrl(settingsData || '/dashboard');
            setPaymentProvider(providerData);
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
                api.updateSystemSetting('after_login_url', redirectUrl),
                api.updateSystemSetting('active_payment_provider', paymentProvider)
            ]);
            alert("Configuración actualizada.");
        } catch (e) {
            alert("Error al guardar configuración.");
        } finally {
            setLoadingSettings(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-500" /> Panel de Administración
            </h1>

            {/* Configuración Global de Pagos */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" /> Configuración Global
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">URL de Redirección (Post-Login)</label>
                        <input 
                            type="text" 
                            value={redirectUrl}
                            onChange={(e) => setRedirectUrl(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primary transition"
                            placeholder="/dashboard"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider">Pasarela de Pagos Activa</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setPaymentProvider('stripe')}
                                className={`flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border font-bold transition ${paymentProvider === 'stripe' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-black border-gray-700 text-gray-500'}`}
                            >
                                <CreditCard className="w-5 h-5" /> Stripe
                            </button>
                            <button 
                                onClick={() => setPaymentProvider('hotmart')}
                                className={`flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border font-bold transition ${paymentProvider === 'hotmart' ? 'bg-orange-600/10 border-orange-500 text-orange-400' : 'bg-black border-gray-700 text-gray-500'}`}
                            >
                                <Zap className="w-5 h-5" /> Hotmart
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Selecciona el proveedor que verán los usuarios al intentar actualizar su plan.</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                    <button 
                        onClick={handleSaveSettings}
                        disabled={loadingSettings}
                        className="bg-primary hover:bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
                    >
                        {loadingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Configuración
                    </button>
                </div>
            </div>

            {/* Resto del Panel de Administración... */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg p-6">
                <p className="text-gray-400">Total Usuarios: {users.length}</p>
                {/* Tabla de usuarios simplificada aquí... */}
            </div>
        </div>
    );
};
