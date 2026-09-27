import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../../services/api';
import { 
    RefreshCw, CreditCard, Users, Calendar, DollarSign, Search, 
    ChevronDown, ChevronUp, ExternalLink, Loader2, Sparkles, Check, 
    AlertCircle, Layers, XCircle, Plus, Info, Filter, ArrowRight, Crown 
} from 'lucide-react';

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
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState('');

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
        const annualCount = activeSubs.filter(s => String(s.planSlug || '').toLowerCase().includes('anual')).length;
        const monthlyCount = activeSubs.filter(s => !String(s.planSlug || '').toLowerCase().includes('anual')).length;

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

        setActionLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await api.adminCreateSubscription(selectedUserId, selectedPlanId);
            setSuccessMessage("¡Suscripción otorgada y límites de usuario actualizados con éxito!");
            setSelectedUserId('');
            setSelectedPlanId('');
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
                                <option value="stripe" className="bg-[#111]">Stripe</option>
                                <option value="hotmart" className="bg-[#111]">Hotmart</option>
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
                            const isCanceled = sub.status === 'canceled' || sub.status === 'expired';
                            const isAnnual = String(sub.planSlug || '').toLowerCase().includes('anual');

                            return (
                                <div 
                                    key={sub.id} 
                                    className="bg-[#111]/80 border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3.5 rounded-2xl border ${isAct ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-gray-500/10 text-gray-400 border-white/5'}`}>
                                            <Crown className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <span className="text-xs font-black uppercase text-white leading-none">{sub.userName || 'Usuario eliminado'}</span>
                                                <span className="text-[10px] text-gray-500 font-mono select-all">({sub.userEmail || 'N/A'})</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isAct ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-500 border border-white/5'}`}>
                                                    {sub.status === 'active' ? 'Activa' : sub.status === 'replaced' ? 'Reemplazada' : sub.status}
                                                </span>
                                                <span className="text-[10px] text-indigo-400 font-black uppercase flex items-center gap-1.5">
                                                    <Layers className="w-3.5 h-3.5" /> Plan: {sub.planSlug?.toUpperCase()} {isAnnual ? '👑 (ANUAL)' : '⚡ (MENSUAL)'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-400 font-semibold flex items-center md:justify-end gap-1"><Calendar className="w-4 h-4 text-gray-500" /> Creada: {new Date(sub.createdAt).toLocaleDateString()}</p>
                                        {sub.hotmartPurchaseId && (
                                            <p className="text-[10px] text-orange-400 font-mono mt-1.5 tracking-tight">Hotmart: {sub.hotmartPurchaseId}</p>
                                        )}
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
                            <h3 className="text-xl font-bold text-white">Otorgar / Forzar Plan a Usuario</h3>
                            <p className="text-gray-500 text-xs mt-0.5">Asigna una suscripción manual y actualiza los límites de consumo al instante.</p>
                        </div>
                    </div>

                    <form onSubmit={handleManualGrant} className="space-y-6">
                        {/* Selected User */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Seleccionar Usuario</label>
                            <select 
                                value={selectedUserId} 
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition cursor-pointer"
                                required
                            >
                                <option value="">-- Elige un usuario --</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id} className="bg-[#111]">
                                        {u.name} ({u.email}) - Rol: {u.role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Plan */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plan a Asignar</label>
                            <select 
                                value={selectedPlanId} 
                                onChange={(e) => setSelectedPlanId(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition cursor-pointer"
                                required
                            >
                                <option value="">-- Selecciona el Plan --</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.slug} className="bg-[#111]">
                                        {p.name} ({p.slug}) - ${p.priceMonthly} / mes
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Warnings or notices */}
                        <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-start gap-2.5 text-[11px] text-gray-400">
                            <Info className="w-4 h-4 text-[#FF5A1F] shrink-0 mt-0.5" />
                            <p>Esta acción desactivará cualquier otra suscripción activa que posea el usuario, reemplazándola por el nuevo plan de forma instantánea. Se actualizarán todos los contadores de consumo (proyectos, landings, hooks, etc.).</p>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={actionLoading}
                            className="w-full bg-[#FF5A1F] hover:bg-[#E04E15] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/25 disabled:opacity-50"
                        >
                            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            Habilitar Suscripción de Inmediato
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
