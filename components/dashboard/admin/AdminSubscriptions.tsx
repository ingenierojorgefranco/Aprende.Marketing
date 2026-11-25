import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../../services/api';
import { 
    RefreshCw, CreditCard, Users, Calendar, DollarSign, Search, 
    ChevronDown, ChevronUp, ExternalLink, Loader2, Sparkles, Check, 
    AlertCircle, Layers, XCircle, Plus, Info, Filter, ArrowRight, Crown,
    Edit3, X, Clock, ShieldCheck
} from 'lucide-react';

const PAYMENT_METHODS = [
    'Transferencia bancaria',
    'Zelle',
    'PayPal',
    'Nequi / Bancolombia',
    'Efectivo',
    'Link de pago externo',
    'Beca / Cortesía',
    'Otro'
];

const getTodayDateInput = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const addDaysToDateInput = (dateStr: string, days: number) => {
    const base = /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : getTodayDateInput();
    const [y, m, d] = base.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    dt.setUTCDate(dt.getUTCDate() + days);
    return dt.toISOString().slice(0, 10);
};

const toDateInputValue = (val: any) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
};

const diffDaysBetween = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 0;
    const [sy, sm, sd] = startStr.split('-').map(Number);
    const [ey, em, ed] = endStr.split('-').map(Number);
    const startMs = Date.UTC(sy, sm - 1, sd);
    const endMs = Date.UTC(ey, em - 1, ed);
    return Math.round((endMs - startMs) / 86400000);
};

const parseTracking = (raw: any): Record<string, any> => {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch { return {}; }
};

const isSubscriptionAnnual = (sub: any) => {
    const per = String(sub?.periodicity || '').toLowerCase();
    const slug = String(sub?.planSlug || '').toLowerCase();
    const days = Number(sub?.planDays || 0);
    return per === 'anual' || days >= 300 || slug.includes('anual');
};

const isSubscriptionManual = (sub: any) => {
    const tracking = parseTracking(sub?.trackingParameters);
    return tracking?.source === 'manual' || String(sub?.hotmartPurchaseId || '').startsWith('MANUAL-');
};

export const AdminSubscriptions: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Navigation and tab states
    const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'subscriptions' | 'manual'>('transactions');
    
    // Search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [gatewayFilter, setGatewayFilter] = useState('all');
    
    // Detailed expanded states
    const [expandedPaymentId, setExpandedPaymentId] = useState<any | null>(null);
    
    // Manual grant form state
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [manualPeriodicity, setManualPeriodicity] = useState<'Mensual' | 'Anual'>('Mensual');
    const [manualPrice, setManualPrice] = useState<string>('');
    const [manualStartDate, setManualStartDate] = useState<string>(getTodayDateInput());
    const [manualExpiresAt, setManualExpiresAt] = useState<string>(addDaysToDateInput(getTodayDateInput(), 30));
    const [manualPaymentMethod, setManualPaymentMethod] = useState<string>('Transferencia bancaria');
    const [recordPayment, setRecordPayment] = useState<boolean>(true);

    // Edit / Renew subscription modal state
    const [editingSub, setEditingSub] = useState<any | null>(null);
    const [editSubStatus, setEditSubStatus] = useState<string>('active');
    const [editSubPeriodicity, setEditSubPeriodicity] = useState<'Mensual' | 'Anual'>('Mensual');
    const [editSubPrice, setEditSubPrice] = useState<string>('');
    const [editSubStartDate, setEditSubStartDate] = useState<string>('');
    const [editSubExpiresAt, setEditSubExpiresAt] = useState<string>('');
    const [editSubSaving, setEditSubSaving] = useState<boolean>(false);

    const selectedPlanObj = useMemo(
        () => plans.find(p => p.slug === selectedPlanId || String(p.id) === String(selectedPlanId)) || null,
        [plans, selectedPlanId]
    );

    const isSelectedPlanFree = useMemo(() => {
        if (!selectedPlanObj) return false;
        return ['starter', 'free'].includes(String(selectedPlanObj.slug || '').toLowerCase());
    }, [selectedPlanObj]);

    const filteredUsersForSelect = useMemo(() => {
        const q = userSearchTerm.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            String(u.name || '').toLowerCase().includes(q) ||
            String(u.email || '').toLowerCase().includes(q)
        );
    }, [users, userSearchTerm]);

    const handleSelectPlanChange = (newPlanSlug: string) => {
        setSelectedPlanId(newPlanSlug);
        const plan = plans.find(p => p.slug === newPlanSlug || String(p.id) === String(newPlanSlug));
        if (!plan) return;
        const isFree = ['starter', 'free'].includes(String(plan.slug || '').toLowerCase());
        if (isFree) {
            setManualPrice('0');
            setRecordPayment(false);
        } else {
            const defaultPrice = manualPeriodicity === 'Anual'
                ? Number(plan.priceAnnual ?? plan.price_annual ?? plan.priceMonthly ?? plan.price_monthly ?? 0)
                : Number(plan.priceMonthly ?? plan.price_monthly ?? 0);
            setManualPrice(String(defaultPrice));
            setManualExpiresAt(addDaysToDateInput(manualStartDate, manualPeriodicity === 'Anual' ? 365 : 30));
            setRecordPayment(defaultPrice > 0 && manualPaymentMethod !== 'Beca / Cortesía');
        }
    };

    const handlePeriodicityChange = (newPeriodicity: 'Mensual' | 'Anual') => {
        setManualPeriodicity(newPeriodicity);
        setManualExpiresAt(addDaysToDateInput(manualStartDate, newPeriodicity === 'Anual' ? 365 : 30));
        if (selectedPlanObj && !isSelectedPlanFree) {
            const defaultPrice = newPeriodicity === 'Anual'
                ? Number(selectedPlanObj.priceAnnual ?? selectedPlanObj.price_annual ?? selectedPlanObj.priceMonthly ?? selectedPlanObj.price_monthly ?? 0)
                : Number(selectedPlanObj.priceMonthly ?? selectedPlanObj.price_monthly ?? 0);
            setManualPrice(String(defaultPrice));
        }
    };

    const handleStartDateChange = (newStart: string) => {
        setManualStartDate(newStart);
        if (newStart && !isSelectedPlanFree) {
            setManualExpiresAt(addDaysToDateInput(newStart, manualPeriodicity === 'Anual' ? 365 : 30));
        }
    };

    const handlePaymentMethodChange = (method: string) => {
        setManualPaymentMethod(method);
        if (method === 'Beca / Cortesía') {
            setManualPrice('0');
            setRecordPayment(false);
        } else if (Number(manualPrice) > 0) {
            setRecordPayment(true);
        }
    };

    const openEditSubscriptionModal = (sub: any) => {
        setEditingSub(sub);
        setEditSubStatus(sub.status || 'active');
        setEditSubPeriodicity(isSubscriptionAnnual(sub) ? 'Anual' : 'Mensual');
        setEditSubPrice(sub.price !== null && sub.price !== undefined ? String(sub.price) : '');
        const start = toDateInputValue(sub.startDate || sub.createdAt) || getTodayDateInput();
        setEditSubStartDate(start);
        const exp = toDateInputValue(sub.expiresAt || sub.renewalDate) || addDaysToDateInput(start, isSubscriptionAnnual(sub) ? 365 : 30);
        setEditSubExpiresAt(exp);
    };

    const handleSaveEditedSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSub) return;

        const isFreeSub = ['starter', 'free'].includes(String(editingSub.planSlug || '').toLowerCase());
        if (!isFreeSub && editSubStartDate && editSubExpiresAt && diffDaysBetween(editSubStartDate, editSubExpiresAt) <= 0) {
            setError('La fecha de vencimiento debe ser posterior a la fecha de inicio.');
            return;
        }

        setEditSubSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await api.adminUpdateSubscription(editingSub.id, {
                status: editSubStatus,
                periodicity: isFreeSub ? undefined : editSubPeriodicity,
                price: editSubPrice !== '' ? Number(editSubPrice) : undefined,
                startDate: editSubStartDate || undefined,
                expiresAt: isFreeSub ? undefined : (editSubExpiresAt || undefined)
            });
            setSuccessMessage(`Suscripción de ${editingSub.userName || editingSub.userEmail} actualizada correctamente.`);
            setEditingSub(null);
            await loadData();
        } catch (err: any) {
            console.error('Error actualizando suscripción', err);
            setError(err.message || 'No se pudo actualizar la suscripción.');
        } finally {
            setEditSubSaving(false);
        }
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [pList, sList, uList, plList] = await Promise.all([
                api.getAllPayments(),
                api.getAllSubscriptions(),
                api.getUsers(),
                api.getPlans()
            ]);
            setPayments(pList || []);
            setSubscriptions(sList || []);
            setUsers(uList || []);
            setPlans(plList || []);
        } catch (e: any) {
            console.error("Error cargando panel de suscripciones", e);
            setError("No se pudo cargar la información de la base de datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Clean stats calculation from live database rows
    const stats = useMemo(() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const activeSubs = subscriptions.filter(s => s.status === 'active');
        const annualCount = activeSubs.filter(s => isSubscriptionAnnual(s)).length;
        const monthlyCount = activeSubs.filter(s => !isSubscriptionAnnual(s)).length;

        // Sum up income of successful payments from current month
        const monthlyRevenue = payments
            .filter(p => {
                const isSuccess = p.status === 'succeeded' || p.status === 'approved' || p.status === 'completed';
                if (!isSuccess) return false;
                const pDate = new Date(p.created_at || p.createdAt);
                return pDate >= firstDayOfMonth;
            })
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        // Sum up historical total income
        const totalRevenue = payments
            .filter(p => p.status === 'succeeded' || p.status === 'approved' || p.status === 'completed')
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const failedPaymentsCount = payments.filter(p => p.status === 'failed' || p.status === 'rejected').length;

        return {
            monthlyRevenue,
            totalRevenue,
            activeSubsCount: activeSubs.length,
            annualCount,
            monthlyCount,
            failedPaymentsCount
        };
    }, [payments, subscriptions]);

    // Filtered transaction list
    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const matchesSearch = 
                String(p.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(p.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(p.stripe_id || p.transaction_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(p.buyer_name || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            const isSuccess = p.status === 'succeeded' || p.status === 'approved' || p.status === 'completed';
            const matchesStatus = 
                statusFilter === 'all' ? true :
                statusFilter === 'success' ? isSuccess :
                statusFilter === 'failed' ? (p.status === 'failed' || p.status === 'rejected') :
                statusFilter === 'pending' ? p.status === 'pending' : true;

            const matchesGateway = 
                gatewayFilter === 'all' ? true :
                String(p.payment_method || '').toLowerCase().includes(gatewayFilter.toLowerCase());

            return matchesSearch && matchesStatus && matchesGateway;
        });
    }, [payments, searchTerm, statusFilter, gatewayFilter]);

    // Filtered subscriptions list
    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter(s => {
            const matchesSearch = 
                String(s.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(s.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(s.planSlug || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(s.planName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(s.periodicity || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(s.hotmartPurchaseId || '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = 
                statusFilter === 'all' ? true :
                statusFilter === 'active' ? s.status === 'active' :
                statusFilter === 'canceled' ? (s.status === 'canceled' || s.status === 'expired') :
                statusFilter === 'replaced' ? s.status === 'replaced' : true;

            return matchesSearch && matchesStatus;
        });
    }, [subscriptions, searchTerm, statusFilter]);

    // Form submission for manually granting subscriptions
    const handleManualGrant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !selectedPlanId) {
            setError("Debes seleccionar un usuario y un plan.");
            return;
        }

        if (!isSelectedPlanFree) {
            if (!manualStartDate || !manualExpiresAt) {
                setError("Debes indicar la fecha de inicio y la fecha de vencimiento.");
                return;
            }
            if (diffDaysBetween(manualStartDate, manualExpiresAt) <= 0) {
                setError("La fecha de vencimiento debe ser posterior a la fecha de inicio.");
                return;
            }
        }

        setActionLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await api.adminCreateSubscription(selectedUserId, selectedPlanId, {
                periodicity: isSelectedPlanFree ? undefined : manualPeriodicity,
                price: isSelectedPlanFree ? 0 : (manualPrice !== '' ? Number(manualPrice) : undefined),
                startDate: manualStartDate || undefined,
                expiresAt: isSelectedPlanFree ? undefined : (manualExpiresAt || undefined),
                paymentMethod: manualPaymentMethod,
                recordPayment: !isSelectedPlanFree && recordPayment && Number(manualPrice || 0) > 0
            });
            setSuccessMessage(
                isSelectedPlanFree
                    ? "¡Plan gratuito asignado y límites actualizados con éxito!"
                    : `¡Suscripción ${manualPeriodicity} otorgada con vigencia hasta el ${manualExpiresAt} y límites actualizados al instante!`
            );
            setSelectedUserId('');
            setSelectedPlanId('');
            setUserSearchTerm('');
            const today = getTodayDateInput();
            setManualPeriodicity('Mensual');
            setManualPrice('');
            setManualStartDate(today);
            setManualExpiresAt(addDaysToDateInput(today, 30));
            setManualPaymentMethod('Transferencia bancaria');
            setRecordPayment(true);
            // Reload all lists
            await loadData();
        } catch (e: any) {
            console.error("Error otorgando plan", e);
            setError(e.message || "Error al otorgar suscripción manual.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-40 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#FF5A1F]" />
                <p className="text-gray-400 text-sm font-semibold tracking-wider uppercase">Cargando base de datos de suscripciones...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* TOP TITLE */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#FF5A1F]" /> Gestionar Suscripciones
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Control, auditoría y métricas de todas las pasarelas, pagos y planes de usuarios.</p>
                </div>
                <button 
                    onClick={loadData} 
                    className="p-3 bg-white/5 border border-white/5 hover:border-[#FF5A1F]/30 hover:bg-[#FF5A1F]/10 rounded-xl text-gray-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                    title="Actualizar datos"
                >
                    <RefreshCw className="w-4 h-4" /> Recargar
                </button>
            </div>

            {/* ERROR / SUCCESS NOTIFICATIONS */}
            {error && (
                <div className="bg-red-950/20 border border-red-800/40 p-4 rounded-2xl flex items-start gap-3 text-red-200 text-sm animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                    <div>
                        <p className="font-bold">Error de Operación</p>
                        <p className="text-xs text-red-300/80 mt-0.5">{error}</p>
                    </div>
                </div>
            )}
            {successMessage && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-2xl flex items-start gap-3 text-emerald-200 text-sm animate-in slide-in-from-top-2">
                    <Check className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                        <p className="font-bold">Acción Completada</p>
                        <p className="text-xs text-emerald-300/80 mt-0.5">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* METRICS DASHBOARD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Metric 1 */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-[#FF5A1F]/20 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/5 rounded-full blur-2xl group-hover:bg-[#FF5A1F]/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Facturación del Mes</span>
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shadow-lg">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white leading-none">${stats.monthlyRevenue.toFixed(2)}</h3>
                        <p className="text-[10px] text-emerald-400 uppercase font-black mt-2 tracking-wide flex items-center gap-1">
                            <Sparkles className="w-3 h-3 animate-pulse" /> Ingresos reales de este mes
                        </p>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-[#FF5A1F]/20 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/5 rounded-full blur-2xl group-hover:bg-[#FF5A1F]/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Suscripciones Activas</span>
                        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-lg">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white leading-none">{stats.activeSubsCount}</h3>
                        <p className="text-[10px] text-indigo-400 uppercase font-black mt-2 tracking-wide">
                            {stats.monthlyCount} Mensuales • {stats.annualCount} Anuales
                        </p>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-[#FF5A1F]/20 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/5 rounded-full blur-2xl group-hover:bg-[#FF5A1F]/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Planes Anuales</span>
                        <div className="p-2.5 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-xl border border-[#FF5A1F]/20 shadow-lg">
                            <Crown className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white leading-none">{stats.annualCount}</h3>
                        <p className="text-[10px] text-amber-400 uppercase font-black mt-2 tracking-wide">
                            Suscripciones de renovación anual
                        </p>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-[#FF5A1F]/20 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A1F]/5 rounded-full blur-2xl group-hover:bg-[#FF5A1F]/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Pagos Fallidos / Rechazos</span>
                        <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 shadow-lg">
                            <XCircle className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white leading-none">{stats.failedPaymentsCount}</h3>
                        <p className="text-[10px] text-red-400 uppercase font-black mt-2 tracking-wide">
                            Transacciones rechazadas o fallidas
                        </p>
                    </div>
                </div>
            </div>

            {/* INTERFACE TABS */}
            <div className="flex border-b border-white/5 bg-black/20 rounded-2xl p-1">
                <button 
                    onClick={() => { setActiveSubTab('transactions'); setStatusFilter('all'); }} 
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 ${activeSubTab === 'transactions' ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                    <CreditCard className="w-4 h-4" /> Transacciones Realizadas
                </button>
                <button 
                    onClick={() => { setActiveSubTab('subscriptions'); setStatusFilter('active'); }} 
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 ${activeSubTab === 'subscriptions' ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                    <RefreshCw className="w-4 h-4" /> Suscripciones de Usuarios
                </button>
                <button 
                    onClick={() => { setActiveSubTab('manual'); }} 
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 ${activeSubTab === 'manual' ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                    <Plus className="w-4 h-4" /> Otorgar Plan Manual
                </button>
            </div>

            {/* TAB: TRANSACTIONS / PAYMENTS */}
            {activeSubTab === 'transactions' && (
                <div className="space-y-6">
                    {/* FILTERS AND SEARCH */}
                    <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* Search input */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Buscar por usuario, email o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition"
                            />
                        </div>

                        {/* Status filter */}
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-1">
                            <Filter className="text-gray-500 w-4 h-4 shrink-0" />
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-transparent text-white text-sm py-2 outline-none cursor-pointer"
                            >
                                <option value="all" className="bg-[#111]">Todos los Estados</option>
                                <option value="success" className="bg-[#111]">Éxito / Aprobados</option>
                                <option value="pending" className="bg-[#111]">Pendientes</option>
                                <option value="failed" className="bg-[#111]">Fallidos / Rechazados</option>
                            </select>
                        </div>

                        {/* Gateway/Method filter */}
                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-1">
                            <CreditCard className="text-gray-500 w-4 h-4 shrink-0" />
                            <select 
                                value={gatewayFilter} 
                                onChange={(e) => setGatewayFilter(e.target.value)}
                                className="w-full bg-transparent text-white text-sm py-2 outline-none cursor-pointer"
                            >
                                <option value="all" className="bg-[#111]">Todas las Pasarelas</option>
                                <option value="hotmart" className="bg-[#111]">Hotmart</option>
                                <option value="manual" className="bg-[#111]">Pagos Manuales</option>
                                <option value="stripe" className="bg-[#111]">Stripe</option>
                                <option value="paypal" className="bg-[#111]">PayPal</option>
                                <option value="efectivo" className="bg-[#111]">Efectivo</option>
                            </select>
                        </div>
                    </div>

                    {/* TRANSACTIONS LIST */}
                    <div className="space-y-4">
                        {filteredPayments.length > 0 ? filteredPayments.map((payment) => {
                            const isExpanded = expandedPaymentId === payment.id;
                            const isSuccess = payment.status === 'succeeded' || payment.status === 'approved' || payment.status === 'completed' || payment.status === 'active';
                            const isFailed = payment.status === 'failed' || payment.status === 'rejected';
                            
                            return (
                                <div 
                                    key={payment.id} 
                                    onClick={() => setExpandedPaymentId(isExpanded ? null : payment.id)}
                                    className="bg-[#111]/80 hover:bg-[#111] border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4 hover:border-[#FF5A1F]/30 transition-all cursor-pointer select-none"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3.5 rounded-2xl border ${isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isFailed ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <span className="text-xs font-black uppercase text-white leading-none">{payment.userName || 'Usuario eliminado'}</span>
                                                    <span className="text-[10px] text-gray-500 font-mono select-all">({payment.userEmail || 'N/A'})</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : isFailed ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                        {payment.status === 'succeeded' || payment.status === 'completed' ? 'Éxito' : payment.status === 'approved' ? 'Aprobado' : payment.status}
                                                    </span>
                                                    <span className="text-[10px] text-gray-600 font-black uppercase flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {new Date(payment.created_at || payment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-white leading-none">${payment.amount} <span className="text-xs text-gray-500 font-bold">{payment.currency?.toUpperCase()}</span></p>
                                            <p className="text-[10px] text-gray-500 font-black uppercase mt-2 tracking-wide">{payment.payment_method || 'Stripe/Hotmart'}</p>
                                        </div>
                                    </div>

                                    {/* EXPANDED DETAILED INFO */}
                                    {isExpanded && (
                                        <div className="border-t border-white/5 pt-6 mt-2 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs animate-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-1 bg-black/35 p-4 rounded-2xl border border-white/5">
                                                <p className="text-gray-500 uppercase font-black text-[9px] tracking-widest mb-1">Identificador de Pago</p>
                                                <p className="text-gray-200 font-mono text-[11px] select-all break-all">{payment.stripe_id || payment.transaction_id || 'No disponible'}</p>
                                            </div>
                                            <div className="space-y-1 bg-black/35 p-4 rounded-2xl border border-white/5">
                                                <p className="text-gray-500 uppercase font-black text-[9px] tracking-widest mb-1">Pasarela / Método</p>
                                                <p className="text-gray-200 font-medium capitalize">{payment.payment_method || 'Sin especificar'}</p>
                                            </div>
                                            <div className="space-y-1 bg-black/35 p-4 rounded-2xl border border-white/5">
                                                <p className="text-gray-500 uppercase font-black text-[9px] tracking-widest mb-1">Fecha de Registro</p>
                                                <p className="text-gray-200 font-medium">{new Date(payment.created_at || payment.createdAt).toLocaleString()}</p>
                                            </div>
                                            {payment.buyer_name && (
                                                <div className="space-y-1 bg-black/35 p-4 rounded-2xl border border-white/5">
                                                    <p className="text-gray-500 uppercase font-black text-[9px] tracking-widest mb-1">Nombre Registrado</p>
                                                    <p className="text-gray-200 font-semibold">{payment.buyer_name}</p>
                                                </div>
                                            )}
                                            {payment.approval_code && (
                                                <div className="space-y-1 bg-black/35 p-4 rounded-2xl border border-white/5">
                                                    <p className="text-gray-500 uppercase font-black text-[9px] tracking-widest mb-1">Código de Autorización</p>
                                                    <p className="text-gray-200 font-mono select-all">{payment.approval_code}</p>
                                                </div>
                                            )}
                                            {payment.affiliate_code && (
                                                <div className="space-y-1 bg-black/35 p-4 rounded-2xl border border-white/5">
                                                    <p className="text-gray-500 uppercase font-black text-[9px] tracking-widest mb-1">Código de Afiliado</p>
                                                    <p className="text-gray-200 font-mono select-all">{payment.affiliate_code}</p>
                                                </div>
                                            )}
                                            {payment.receipt_url && (
                                                <div className="col-span-1 md:col-span-3 pt-2">
                                                    <a 
                                                        href={payment.receipt_url} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF5A1F] hover:text-white transition-colors bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-4 py-2.5 rounded-xl hover:bg-[#FF5A1F]"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Ver Comprobante Oficial <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="text-center py-20 bg-black/20 rounded-[2.5rem] border border-white/5 border-dashed">
                                <p className="text-gray-500 text-sm font-semibold italic">No se encontraron transacciones con los filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: SUBSCRIPTIONS */}
            {activeSubTab === 'subscriptions' && (
                <div className="space-y-6">
                    {/* FILTERS AND SEARCH */}
                    <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Buscar por usuario, email o plan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-1">
                            <Filter className="text-gray-500 w-4 h-4 shrink-0" />
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-transparent text-white text-sm py-2 outline-none cursor-pointer"
                            >
                                <option value="all" className="bg-[#111]">Todos los Estados</option>
                                <option value="active" className="bg-[#111]">Activas</option>
                                <option value="canceled" className="bg-[#111]">Canceladas / Expiradas</option>
                                <option value="replaced" className="bg-[#111]">Reemplazadas</option>
                            </select>
                        </div>
                    </div>

                    {/* SUBSCRIPTIONS LIST */}
                    <div className="space-y-4">
                        {filteredSubscriptions.length > 0 ? filteredSubscriptions.map((sub) => {
                            const isAct = sub.status === 'active';
                            const isAnnual = isSubscriptionAnnual(sub);
                            const isManual = isSubscriptionManual(sub);
                            const tracking = parseTracking(sub.trackingParameters);
                            const isFreeSub = ['starter', 'free'].includes(String(sub.planSlug || '').toLowerCase());
                            const expDate = sub.expiresAt || sub.renewalDate;
                            const startDateVal = sub.startDate || sub.createdAt;
                            const daysLeft = expDate ? Math.ceil((new Date(expDate).getTime() - Date.now()) / 86400000) : null;
                            const isExpiringSoon = isAct && daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
                            const isAlreadyExpired = daysLeft !== null && daysLeft < 0;

                            return (
                                <div 
                                    key={sub.id} 
                                    className="bg-[#111]/80 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                                        <div className={`p-3.5 rounded-2xl border shrink-0 ${isAct ? (isAnnual ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20') : 'bg-gray-500/10 text-gray-400 border-white/5'}`}>
                                            <Crown className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <span className="text-xs font-black uppercase text-white leading-none">{sub.userName || 'Usuario eliminado'}</span>
                                                <span className="text-[10px] text-gray-500 font-mono select-all">({sub.userEmail || 'N/A'})</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isAct ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-500 border border-white/5'}`}>
                                                    {sub.status === 'active' ? 'Activa' : sub.status === 'replaced' ? 'Reemplazada' : sub.status === 'canceled' ? 'Cancelada / Expirada' : sub.status}
                                                </span>
                                                <span className={`text-[10px] font-black uppercase flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${isAnnual ? 'bg-amber-500/10 text-amber-300 border-amber-500/25' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'}`}>
                                                    <Layers className="w-3 h-3" /> {sub.planName || sub.planSlug?.toUpperCase()} {!isFreeSub && (isAnnual ? '• ANUAL' : '• MENSUAL')}
                                                </span>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${isManual ? 'bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/25' : 'bg-purple-500/10 text-purple-300 border-purple-500/25'}`}>
                                                    {isManual ? `Manual${tracking?.paymentMethod ? ` (${tracking.paymentMethod})` : ''}` : 'Hotmart'}
                                                </span>
                                                {sub.price !== null && sub.price !== undefined && Number(sub.price) > 0 && (
                                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                                        ${Number(sub.price).toFixed(2)} USD
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-2.5 shrink-0">
                                        <div className="text-left md:text-right space-y-1">
                                            <p className="text-xs text-gray-400 font-semibold flex items-center md:justify-end gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                                Inicio: {startDateVal ? new Date(startDateVal).toLocaleDateString() : 'N/A'}
                                            </p>
                                            {expDate && !isFreeSub && (
                                                <p className={`text-xs font-bold flex items-center md:justify-end gap-1.5 ${isAlreadyExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Vence: {new Date(expDate).toLocaleDateString()}
                                                    {isAct && daysLeft !== null && (
                                                        <span className="text-[10px] opacity-80">
                                                            ({daysLeft >= 0 ? `${daysLeft}d` : 'Vencida'})
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                            {sub.hotmartPurchaseId && (
                                                <p className="text-[10px] text-gray-500 font-mono tracking-tight">Ref: {sub.hotmartPurchaseId}</p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => openEditSubscriptionModal(sub)}
                                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF5A1F]/15 border border-white/10 hover:border-[#FF5A1F]/40 text-xs font-bold text-gray-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Edit3 className="w-3.5 h-3.5 text-[#FF5A1F]" /> Editar / Renovar
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-20 bg-black/20 rounded-[2.5rem] border border-white/5 border-dashed">
                                <p className="text-gray-500 text-sm font-semibold italic">No se encontraron suscripciones con los filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: MANUAL PLAN GRANT */}
            {activeSubTab === 'manual' && (
                <div className="bg-[#111] border border-white/5 p-8 md:p-10 rounded-[2.5rem] max-w-2xl mx-auto shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <div className="p-2 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-lg">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Otorgar / Forzar Plan Manual</h3>
                            <p className="text-gray-500 text-xs mt-0.5">Asigna planes Mensuales o Anuales pagados por fuera de Hotmart con control exacto de precio y vencimiento.</p>
                        </div>
                    </div>

                    <form onSubmit={handleManualGrant} className="space-y-6">
                        {/* Selected User */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">1. Seleccionar Usuario</label>
                            <div className="relative mb-2">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input
                                    type="text"
                                    value={userSearchTerm}
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                    placeholder="Filtrar usuario por nombre o email..."
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs outline-none focus:border-[#FF5A1F] transition"
                                />
                            </div>
                            <select 
                                value={selectedUserId} 
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition cursor-pointer"
                                required
                            >
                                <option value="">-- Elige un usuario ({filteredUsersForSelect.length}) --</option>
                                {filteredUsersForSelect.map(u => (
                                    <option key={u.id} value={u.id} className="bg-[#111]">
                                        {u.name} ({u.email}) - Rol: {u.role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Plan */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">2. Plan a Asignar</label>
                            <select 
                                value={selectedPlanId} 
                                onChange={(e) => handleSelectPlanChange(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition cursor-pointer"
                                required
                            >
                                <option value="">-- Selecciona el Plan --</option>
                                {plans.map(p => {
                                    const monthly = Number(p.priceMonthly ?? p.price_monthly ?? 0);
                                    const annual = Number(p.priceAnnual ?? p.price_annual ?? 0);
                                    const isFree = ['starter', 'free'].includes(String(p.slug || '').toLowerCase());
                                    return (
                                        <option key={p.id} value={p.slug} className="bg-[#111]">
                                            {isFree
                                                ? `${p.name} (${p.slug}) — Gratuito`
                                                : `${p.name} (${p.slug}) — $${monthly}/mes${annual > 0 ? ` · $${annual}/año` : ''}`}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Paid Plan Details: Periodicity, Price, Dates, Payment Method */}
                        {selectedPlanObj && !isSelectedPlanFree && (
                            <div className="space-y-5 bg-black/30 border border-white/10 rounded-2xl p-5 animate-in fade-in duration-200">
                                {/* Periodicity Toggle */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">3. Modalidad del Plan</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handlePeriodicityChange('Mensual')}
                                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                manualPeriodicity === 'Mensual'
                                                    ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/15'
                                                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black uppercase tracking-wider">Mensual</span>
                                                <span className="text-xs font-bold text-[#FF5A1F]">
                                                    ${Number(selectedPlanObj.priceMonthly ?? selectedPlanObj.price_monthly ?? 0)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mt-1">30 días · Límites mensuales</p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handlePeriodicityChange('Anual')}
                                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                manualPeriodicity === 'Anual'
                                                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/15'
                                                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
                                                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Anual
                                                </span>
                                                <span className="text-xs font-bold text-amber-400">
                                                    ${Number(selectedPlanObj.priceAnnual ?? selectedPlanObj.price_annual ?? 0)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mt-1">365 días · Límites anuales</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Payment Method */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Precio Pagado ({selectedPlanObj.currency || 'USD'})</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={manualPrice}
                                                onChange={(e) => setManualPrice(e.target.value)}
                                                placeholder="Ej: 708"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm font-bold outline-none focus:border-[#FF5A1F] transition"
                                                required
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 ml-1">Editable si aplicaste descuento o precio especial.</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Método de Pago Manual</label>
                                        <select
                                            value={manualPaymentMethod}
                                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#FF5A1F] transition cursor-pointer"
                                        >
                                            {PAYMENT_METHODS.map(m => (
                                                <option key={m} value={m} className="bg-[#111]">{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Start & Expiration Dates */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            value={manualStartDate}
                                            onChange={(e) => handleStartDateChange(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#FF5A1F] transition"
                                            style={{ colorScheme: 'dark' }}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Vencimiento</label>
                                        <input
                                            type="date"
                                            value={manualExpiresAt}
                                            onChange={(e) => setManualExpiresAt(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#FF5A1F] transition"
                                            style={{ colorScheme: 'dark' }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Live Duration Summary */}
                                {(() => {
                                    const days = diffDaysBetween(manualStartDate, manualExpiresAt);
                                    return (
                                        <div className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                                            days > 0
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                                : 'bg-red-500/10 border-red-500/25 text-red-300'
                                        }`}>
                                            <span className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                                {days > 0
                                                    ? `Vigencia: ${days} días de acceso (${manualPeriodicity})`
                                                    : 'La fecha de vencimiento debe ser posterior a la de inicio.'}
                                            </span>
                                            {days > 0 && (
                                                <span className="text-[10px] uppercase font-black tracking-wider opacity-80">
                                                    Baja automática al vencer
                                                </span>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Record payment checkbox */}
                                <label className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={recordPayment}
                                        onChange={(e) => setRecordPayment(e.target.checked)}
                                        disabled={Number(manualPrice || 0) <= 0}
                                        className="mt-0.5 accent-[#FF5A1F] w-4 h-4 rounded cursor-pointer"
                                    />
                                    <div className="text-xs">
                                        <p className="font-bold text-white">Registrar cobro en Historial Financiero</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Suma ${Number(manualPrice || 0).toFixed(2)} a tus métricas de facturación y aparece en la pestaña Transacciones como pago manual ({manualPaymentMethod}).
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}

                        {/* Warnings or notices */}
                        <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-start gap-2.5 text-[11px] text-gray-400">
                            <Info className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                            <p>Esta acción reemplazará cualquier suscripción activa previa del usuario y actualizará sus límites técnicos al instante usando la misma estructura que Hotmart. Al cumplirse la fecha de vencimiento sin renovación, la cuenta volverá automáticamente al plan gratuito.</p>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={actionLoading}
                            className="w-full bg-[#FF5A1F] hover:bg-[#E04E15] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/25 disabled:opacity-50 cursor-pointer"
                        >
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            {selectedPlanObj && !isSelectedPlanFree
                                ? `Habilitar Plan ${manualPeriodicity} de Inmediato`
                                : 'Habilitar Suscripción de Inmediato'}
                        </button>
                    </form>
                </div>
            )}

            {/* MODAL: EDITAR / RENOVAR SUSCRIPCIÓN */}
            {editingSub && (
                <div
                    onClick={() => !editSubSaving && setEditingSub(null)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <Edit3 className="w-5 h-5 text-[#FF5A1F]" /> Editar / Renovar Suscripción
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {editingSub.userName} ({editingSub.userEmail}) — <span className="text-indigo-400 font-bold uppercase">{editingSub.planSlug}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingSub(null)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditedSubscription} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</label>
                                    <select
                                        value={editSubStatus}
                                        onChange={(e) => setEditSubStatus(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#FF5A1F]"
                                    >
                                        <option value="active" className="bg-[#111]">Activa</option>
                                        <option value="canceled" className="bg-[#111]">Cancelada / Expirada</option>
                                        <option value="inactive" className="bg-[#111]">Inactiva</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modalidad</label>
                                    <select
                                        value={editSubPeriodicity}
                                        onChange={(e) => setEditSubPeriodicity(e.target.value as 'Mensual' | 'Anual')}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#FF5A1F]"
                                    >
                                        <option value="Mensual" className="bg-[#111]">Mensual</option>
                                        <option value="Anual" className="bg-[#111]">Anual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio Pagado (USD)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editSubPrice}
                                    onChange={(e) => setEditSubPrice(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm font-bold outline-none focus:border-[#FF5A1F]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha de Inicio</label>
                                    <input
                                        type="date"
                                        value={editSubStartDate}
                                        onChange={(e) => setEditSubStartDate(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#FF5A1F]"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha de Vencimiento</label>
                                    <input
                                        type="date"
                                        value={editSubExpiresAt}
                                        onChange={(e) => setEditSubExpiresAt(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#FF5A1F]"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>
                            </div>

                            {/* Quick renewal helpers */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Extender rápido:</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const base = editSubExpiresAt && diffDaysBetween(getTodayDateInput(), editSubExpiresAt) > 0 ? editSubExpiresAt : getTodayDateInput();
                                        setEditSubExpiresAt(addDaysToDateInput(base, 30));
                                        setEditSubStatus('active');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 text-[11px] font-bold cursor-pointer"
                                >
                                    +30 días
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const base = editSubExpiresAt && diffDaysBetween(getTodayDateInput(), editSubExpiresAt) > 0 ? editSubExpiresAt : getTodayDateInput();
                                        setEditSubExpiresAt(addDaysToDateInput(base, 365));
                                        setEditSubPeriodicity('Anual');
                                        setEditSubStatus('active');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-[11px] font-bold cursor-pointer"
                                >
                                    +1 año (Anual)
                                </button>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setEditingSub(null)}
                                    disabled={editSubSaving}
                                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={editSubSaving}
                                    className="px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04E15] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF5A1F]/20 disabled:opacity-50 cursor-pointer"
                                >
                                    {editSubSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
