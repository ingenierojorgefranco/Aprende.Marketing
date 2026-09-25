import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Edit2,
  Plus,
  ArrowUpRight,
  Sparkles,
  Award,
  Zap,
  Tag,
  Phone,
  Globe,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../../../services/api';
import { SubscriptionManagementRecord } from '../../../types';

export const AdminSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionManagementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [periodicityFilter, setPeriodicityFilter] = useState<'all' | 'Mensual' | 'Anual'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'canceled'>('all');

  // Modals
  const [selectedSub, setSelectedSub] = useState<SubscriptionManagementRecord | null>(null);
  const [editingSub, setEditingSub] = useState<SubscriptionManagementRecord | null>(null);
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  // Form states for Edit
  const [editStatus, setEditStatus] = useState<string>('approved');
  const [editRenewalDate, setEditRenewalDate] = useState<string>('');
  const [editDays, setEditDays] = useState<number>(30);
  const [savingEdit, setSavingEdit] = useState(false);

  // Form states for Simulation
  const [simPlanType, setSimPlanType] = useState<'monthly' | 'annual'>('monthly');
  const [simName, setSimName] = useState('Juan David Gómez');
  const [simEmail, setSimEmail] = useState('juandavid@marketingpro.com');
  const [simPhone, setSimPhone] = useState('+57 310 9876543');
  const [simCountry, setSimCountry] = useState('CO');
  const [simulating, setSimulating] = useState(false);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const data = await api.getSubscriptionsManagement();
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Error cargando suscripciones:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // KPIs
  const metrics = useMemo(() => {
    const total = subscriptions.length;
    const monthlyActive = subscriptions.filter(s => (s.periodicity === 'Mensual' || s.planSlug === 'pro_mensual') && (s.status === 'approved' || s.status === 'active')).length;
    const annualActive = subscriptions.filter(s => (s.periodicity === 'Anual' || s.planSlug === 'pro_anual') && (s.status === 'approved' || s.status === 'active')).length;
    
    // MRR proyectado: cada mensual $79 + (cada anual $708 / 12 = $59)
    const mrr = (monthlyActive * 79) + Math.round(annualActive * (708 / 12));
    const totalRevenue = subscriptions.reduce((acc, curr) => acc + (curr.amount || curr.planPrice || 0), 0);

    // Próximas renovaciones en menos de 30 días
    const now = Date.now();
    const in30Days = now + 30 * 24 * 60 * 60 * 1000;
    const upcomingRenewals = subscriptions.filter(s => {
      const renew = new Date(s.renewalDate).getTime();
      return renew > now && renew <= in30Days;
    }).length;

    return { total, monthlyActive, annualActive, mrr, totalRevenue, upcomingRenewals };
  }, [subscriptions]);

  // Filtered List
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      // Periodicity
      if (periodicityFilter !== 'all' && sub.periodicity !== periodicityFilter) {
        return false;
      }
      // Status
      if (statusFilter === 'approved' && !(sub.status === 'approved' || sub.status === 'active')) {
        return false;
      }
      if (statusFilter === 'pending' && !(sub.status.includes('pending') || sub.approvalCode === '2' || sub.approvalCode === '3')) {
        return false;
      }
      if (statusFilter === 'canceled' && !(sub.status === 'canceled' || sub.status === 'refunded')) {
        return false;
      }
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTx = sub.transactionId.toLowerCase().includes(query);
        const matchesName = sub.buyerName.toLowerCase().includes(query);
        const matchesEmail = sub.buyerEmail.toLowerCase().includes(query);
        const matchesAff = (sub.affiliateCode || '').toLowerCase().includes(query);
        const matchesPlan = (sub.planName || '').toLowerCase().includes(query) || (sub.planSlug || '').toLowerCase().includes(query);
        if (!matchesTx && !matchesName && !matchesEmail && !matchesAff && !matchesPlan) {
          return false;
        }
      }
      return true;
    });
  }, [subscriptions, periodicityFilter, statusFilter, searchTerm]);

  // Open Edit Modal
  const handleOpenEdit = (sub: SubscriptionManagementRecord) => {
    setEditingSub(sub);
    setEditStatus(sub.status);
    setEditRenewalDate(sub.renewalDate ? sub.renewalDate.slice(0, 10) : '');
    setEditDays(sub.planDays || (sub.periodicity === 'Anual' ? 365 : 30));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    try {
      setSavingEdit(true);
      await api.updateSubscriptionManagement(editingSub.id, {
        status: editStatus,
        renewalDate: editRenewalDate ? new Date(editRenewalDate).toISOString() : editingSub.renewalDate,
        planDays: editDays
      });
      await loadData();
      setEditingSub(null);
    } catch (err) {
      console.error('Error actualizando suscripción:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  // Submit Simulation
  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSimulating(true);
      await api.simulateHotmartSubscription({
        planType: simPlanType,
        buyerName: simName,
        buyerEmail: simEmail,
        buyerPhone: simPhone,
        buyerCountry: simCountry
      });
      await loadData();
      setShowSimulateModal(false);
    } catch (err) {
      console.error('Error simulando compra:', err);
    } finally {
      setSimulating(false);
    }
  };

  const formatDisplayDate = (d: string) => {
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return '-';
      return dt.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '-';
    }
  };

  const getDaysRemaining = (renewalStr: string) => {
    try {
      const now = Date.now();
      const ren = new Date(renewalStr).getTime();
      const diffDays = Math.ceil((ren - now) / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#11161B] via-[#0E1217] to-[#11161B] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Claves de Seguimiento & Conciliación Hotmart
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestión de Suscripciones
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Control integral de clientes, conciliación automática de identificadores de compra, asignación de planes mensuales ($79) y anuales ($708), y cálculo de renovaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={refreshing}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all shadow-sm"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          <button
            onClick={() => setShowSimulateModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>Simular Compra Hotmart</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Suscripciones */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-5 space-y-2 hover:border-orange-500/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Clientes</span>
            <User className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {metrics.total}
          </div>
          <p className="text-[11px] text-gray-500">Historial completo de órdenes</p>
        </div>

        {/* Suscripciones Mensuales */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-5 space-y-2 hover:border-emerald-500/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Plan Mensual</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">$79 USD / 30d</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {metrics.monthlyActive}
          </div>
          <p className="text-[11px] text-gray-500">Plan Pro con ciclo de 30 días</p>
        </div>

        {/* Suscripciones Anuales */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-5 space-y-2 hover:border-amber-500/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Plan Anual VIP</span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">$708 USD / 365d</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {metrics.annualActive}
          </div>
          <p className="text-[11px] text-gray-500">Plan Pro con ciclo de 1 año</p>
        </div>

        {/* MRR Estimado */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-5 space-y-2 hover:border-orange-500/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">MRR Proyectado</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${metrics.mrr.toLocaleString()} <span className="text-xs text-gray-400 font-normal">USD/mes</span>
          </div>
          <p className="text-[11px] text-gray-500">Ingreso mensual recurrente</p>
        </div>

        {/* Próximas Renovaciones */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-5 space-y-2 hover:border-indigo-500/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Renovaciones Próximas</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {metrics.upcomingRenewals}
          </div>
          <p className="text-[11px] text-gray-500">Dentro de los próximos 30 días</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID transacción, email, nombre, afiliado..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Periodicidad */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setPeriodicityFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                periodicityFilter === 'all' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setPeriodicityFilter('Mensual')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                periodicityFilter === 'Mensual' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensual (30d)
            </button>
            <button
              onClick={() => setPeriodicityFilter('Anual')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                periodicityFilter === 'Anual' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Anual (365d)
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cualquier Estado
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Aprobadas
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              Pendientes
            </button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-[#0B0F14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/60 border-b border-white/10 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
              <tr>
                <th className="py-4 px-5">ID Transacción</th>
                <th className="py-4 px-5">Cliente / Comprador</th>
                <th className="py-4 px-5">Plan & Periodicidad</th>
                <th className="py-4 px-5">Monto</th>
                <th className="py-4 px-5">Fechas (Inicio / Renovación)</th>
                <th className="py-4 px-5">Claves Seguimiento</th>
                <th className="py-4 px-5">Estado</th>
                <th className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
                      <span>Cargando suscripciones de Hotmart...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <AlertCircle className="w-8 h-8 text-gray-500 mb-1" />
                      <p className="font-bold text-white text-sm">No se encontraron suscripciones</p>
                      <p className="text-xs text-gray-500">
                        Prueba con otros términos de búsqueda o pulsa en <strong>"Simular Compra Hotmart"</strong> para probar la recepción de parámetros.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const isApproved = sub.status === 'approved' || sub.status === 'active';
                  const isPending = sub.status.includes('pending') || sub.approvalCode === '2' || sub.approvalCode === '3';
                  const isAnnual = sub.periodicity === 'Anual' || sub.planSlug === 'pro_anual';
                  const daysLeft = getDaysRemaining(sub.renewalDate);

                  return (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* ID Transacción */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 text-xs">
                            {sub.transactionId}
                          </span>
                          <button
                            onClick={() => handleCopy(sub.transactionId, sub.id)}
                            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Copiar ID"
                          >
                            {copiedId === sub.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {sub.affiliateCode && (
                          <span className="text-[10px] text-gray-500 block mt-1 font-mono">
                            Afiliado: {sub.affiliateCode}
                          </span>
                        )}
                      </td>

                      {/* Cliente */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
                            {sub.buyerName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate max-w-[180px]">
                              {sub.buyerName}
                            </span>
                            <span className="text-[11px] text-gray-400 block truncate max-w-[180px]" title={sub.buyerEmail}>
                              {sub.buyerEmail}
                            </span>
                            {sub.buyerPhone && (
                              <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5" /> {sub.buyerPhone} ({sub.buyerCountry || 'CO'})
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Plan & Periodicidad */}
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <Award className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span className="truncate">{sub.planName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              isAnnual
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {sub.periodicity} ({sub.planDays} días)
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              slug: {sub.planSlug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Monto */}
                      <td className="py-4 px-5">
                        <span className="font-black text-white text-sm">
                          ${sub.amount || sub.planPrice} {sub.currency || 'USD'}
                        </span>
                      </td>

                      {/* Fechas (Inicio / Renovación) */}
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <div className="text-[11px] text-gray-300 flex items-center gap-1">
                            <span className="text-gray-500 text-[10px]">Inicio:</span>
                            <span className="font-medium">{formatDisplayDate(sub.startDate)}</span>
                          </div>
                          <div className="text-[11px] flex items-center gap-1.5 flex-wrap">
                            <span className="text-gray-500 text-[10px]">Renovación:</span>
                            <span className="font-bold text-white">{formatDisplayDate(sub.renewalDate)}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              daysLeft > 10 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : daysLeft > 0 
                                  ? 'bg-amber-500/10 text-amber-400' 
                                  : 'bg-red-500/10 text-red-400'
                            }`}>
                              {daysLeft > 0 ? `${daysLeft}d` : 'Expirado'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Claves Seguimiento */}
                      <td className="py-4 px-5">
                        <div className="space-y-0.5 font-mono text-[10px]">
                          <div className="text-gray-300 truncate max-w-[140px]">
                            <span className="text-gray-500">nom:</span> {sub.trackingKeys?.Plan_nombre || 'Pro_Ilimitado'}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-gray-500">prec:</span> ${sub.trackingKeys?.Plan_Precio || sub.planPrice}
                          </div>
                          <div className="text-gray-300">
                            <span className="text-gray-500">días:</span> {sub.trackingKeys?.Plan_Dias || sub.planDays}
                          </div>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-5">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Aprobado
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                        {!isApproved && !isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-[10px]">
                            <XCircle className="w-3 h-3" />
                            {sub.status}
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Ver detalles completos del comprador"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(sub)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 transition-colors"
                            title="Editar estado o fecha de renovación"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: DETALLE COMPLETO DEL CLIENTE Y TRANSACCIÓN */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0D1117] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Detalle de Compra y Suscripción</h3>
                  <span className="font-mono text-xs text-amber-400 font-bold">{selectedSub.transactionId}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Buyer Info Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" /> Información del Comprador
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs">
                <div>
                  <span className="text-gray-500 block mb-0.5">Nombre Completo:</span>
                  <span className="font-bold text-white text-sm">{selectedSub.buyerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Correo Electrónico:</span>
                  <span className="font-bold text-white text-sm">{selectedSub.buyerEmail}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Teléfono Checkout:</span>
                  <span className="text-gray-200">{selectedSub.buyerPhone || 'No proporcionado'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">País de Compra:</span>
                  <span className="text-gray-200">{selectedSub.buyerCountry || 'Internacional'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Cuenta Plataforma:</span>
                  <span className="text-emerald-400 font-semibold">
                    {selectedSub.registeredUserId ? `Vinculada (Usuario #${selectedSub.registeredUserId})` : 'Registro post-compra'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Código de Afiliado:</span>
                  <span className="font-mono text-orange-400">{selectedSub.affiliateCode || 'Venta Directa'}</span>
                </div>
              </div>
            </div>

            {/* Subscription & Date Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" /> Vigencia y Parámetros Calculados
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs">
                <div>
                  <span className="text-gray-500 block mb-0.5">Plan Asignado:</span>
                  <span className="font-bold text-white">{selectedSub.planName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Periodicidad & Días:</span>
                  <span className="font-bold text-amber-300">{selectedSub.periodicity} ({selectedSub.planDays} días)</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Monto Cobrado:</span>
                  <span className="font-bold text-emerald-400 text-sm">${selectedSub.amount || selectedSub.planPrice} {selectedSub.currency}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Fecha de Inicio:</span>
                  <span className="text-gray-200">{formatDisplayDate(selectedSub.startDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Fecha de Renovación:</span>
                  <span className="font-bold text-white">{formatDisplayDate(selectedSub.renewalDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Días Restantes:</span>
                  <span className="font-bold text-emerald-400">{getDaysRemaining(selectedSub.renewalDate)} días de acceso</span>
                </div>
              </div>
            </div>

            {/* Hotmart Tracking Keys Table (Imágenes 1 y 2) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-400" /> Claves de Seguimiento Hotmart Conciliadas
              </h4>
              <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/5 text-gray-400 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4">Clave</th>
                      <th className="py-2.5 px-4 text-center">=</th>
                      <th className="py-2.5 px-4">Valor Recibido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2 px-4 text-orange-400">Plan_nombre</td>
                      <td className="py-2 px-4 text-center text-gray-500">=</td>
                      <td className="py-2 px-4 text-white font-bold">{selectedSub.trackingKeys?.Plan_nombre || 'Pro_Ilimitado'}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-orange-400">Plan_Periodicidad</td>
                      <td className="py-2 px-4 text-center text-gray-500">=</td>
                      <td className="py-2 px-4 text-white font-bold">{selectedSub.trackingKeys?.Plan_Periodicidad || selectedSub.periodicity}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-orange-400">Plan_Precio</td>
                      <td className="py-2 px-4 text-center text-gray-500">=</td>
                      <td className="py-2 px-4 text-white font-bold">{selectedSub.trackingKeys?.Plan_Precio || selectedSub.planPrice}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-orange-400">Plan_Dias</td>
                      <td className="py-2 px-4 text-center text-gray-500">=</td>
                      <td className="py-2 px-4 text-white font-bold">{selectedSub.trackingKeys?.Plan_Dias || selectedSub.planDays}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-orange-400">Plan_Slug</td>
                      <td className="py-2 px-4 text-center text-gray-500">=</td>
                      <td className="py-2 px-4 text-amber-300 font-bold">{selectedSub.trackingKeys?.Plan_Slug || selectedSub.planSlug}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  const s = selectedSub;
                  setSelectedSub(null);
                  handleOpenEdit(s);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-orange-400" /> Editar Datos / Renovar
              </button>

              <button
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR SUSCRIPCIÓN */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0D1117] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-black text-white">Editar Suscripción</h3>
                <span className="text-xs text-gray-400">{editingSub.buyerEmail}</span>
              </div>
              <button
                onClick={() => setEditingSub(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Estado de la Suscripción</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="approved">Aprobado / Activo</option>
                  <option value="pending_cash">Pendiente de Pago en Efectivo</option>
                  <option value="pending_paypal">Pendiente de PayPal</option>
                  <option value="canceled">Cancelado</option>
                  <option value="refunded">Reembolsado</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Días de Ciclo</label>
                <input
                  type="number"
                  value={editDays}
                  onChange={(e) => setEditDays(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Fecha de Renovación</label>
                <input
                  type="date"
                  value={editRenewalDate}
                  onChange={(e) => setEditRenewalDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all disabled:opacity-50"
                >
                  {savingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SIMULAR COMPRA HOTMART CON PARÁMETROS REALES */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0D1117] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Simular Compra Hotmart</h3>
                  <p className="text-xs text-gray-400">Prueba la recepción de parámetros de las imágenes 1 y 2</p>
                </div>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              {/* Selector de Plan */}
              <div>
                <label className="block text-gray-300 font-bold uppercase mb-2">Selecciona la Oferta / Claves:</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSimPlanType('monthly')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      simPlanType === 'monthly'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-sm block text-white mb-1">Imagen 1: Mensual</span>
                    <span className="text-[11px] block font-mono text-emerald-400 font-bold">$79 USD / 30 días</span>
                    <span className="text-[10px] text-gray-500 block font-mono mt-1">slug: pro_mensual</span>
                  </div>

                  <div
                    onClick={() => setSimPlanType('annual')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      simPlanType === 'annual'
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-black text-sm block text-white mb-1">Imagen 2: Anual</span>
                    <span className="text-[11px] block font-mono text-amber-300 font-bold">$708 USD / 365 días</span>
                    <span className="text-[10px] text-gray-500 block font-mono mt-1">slug: pro_anual</span>
                  </div>
                </div>
              </div>

              {/* Previsualización de Claves que se inyectarán */}
              <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1 font-mono text-[11px]">
                <div className="text-gray-400 font-bold text-[10px] uppercase mb-1">Parámetros que recibirá el sistema:</div>
                <div className="text-gray-300"><span className="text-orange-400">Plan_nombre</span> = Pro_Ilimitado</div>
                <div className="text-gray-300"><span className="text-orange-400">Plan_Periodicidad</span> = {simPlanType === 'annual' ? 'Anual' : 'Mensual'}</div>
                <div className="text-gray-300"><span className="text-orange-400">Plan_Precio</span> = {simPlanType === 'annual' ? '708' : '79'}</div>
                <div className="text-gray-300"><span className="text-orange-400">Plan_Dias</span> = {simPlanType === 'annual' ? '365' : '30'}</div>
                <div className="text-gray-300"><span className="text-orange-400">Plan_Slug</span> = {simPlanType === 'annual' ? 'pro_anual' : 'pro_mensual'}</div>
              </div>

              {/* Datos de Comprador */}
              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Nombre del Comprador</label>
                <input
                  type="text"
                  required
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-bold uppercase mb-1">Email del Comprador</label>
                <input
                  type="email"
                  required
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">País (ISO)</label>
                  <input
                    type="text"
                    value={simCountry}
                    onChange={(e) => setSimCountry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={simulating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold transition-all disabled:opacity-50"
                >
                  {simulating ? 'Inyectando Compra...' : 'Inyectar Compra y Calcular Fechas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
