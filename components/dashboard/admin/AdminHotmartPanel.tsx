import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  Calendar, 
  CreditCard, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Tag, 
  Layers, 
  Eye, 
  X, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { User } from '../../../types';
import { api } from '../../../services/api';

export const AdminHotmartPanel: React.FC = () => {
  const { user } = useOutletContext() as { user: User };
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
    monthlyApprovedCount: 0,
    monthlyApprovedRevenue: 0,
    annualApprovedCount: 0,
    annualApprovedRevenue: 0,
    pendingCount: 0,
    pendingRevenue: 0
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending_cash' | 'pending_paypal'>('all');
  const [periodicityFilter, setPeriodicityFilter] = useState<'all' | 'mensual' | 'anual'>('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

  // Selected order for full parameters inspection modal
  const [inspectOrder, setInspectOrder] = useState<any | null>(null);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminHotmartOrders({
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        periodicity: periodicityFilter !== 'all' ? periodicityFilter : undefined,
        page,
        limit: 50
      });

      if (res) {
        setOrders(res.orders || []);
        if (res.stats) setStats(res.stats);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (e) {
      console.error("Error fetching admin hotmart orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, periodicityFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleApproveOrder = async (orderId: number | string) => {
    if (!confirm("¿Deseas aprobar este pedido manualmente? Esto activará la suscripción del usuario de inmediato con las fechas calculadas.")) {
      return;
    }

    try {
      setApprovingId(orderId);
      const res = await api.approveAdminHotmartOrder(orderId);
      setActionSuccess("¡Orden aprobada exitosamente! Suscripción activada.");
      setTimeout(() => setActionSuccess(null), 3500);
      fetchOrders();
    } catch (e: any) {
      alert("Error al aprobar orden: " + (e.message || "Error desconocido"));
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 selection:bg-orange-500 selection:text-white">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Administración de Ventas y Clientes
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Seguimiento de Compras y Suscripciones Hotmart
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Control integral de transacciones, periodicidades (mensual $79 vs anual $708), fechas de renovación y usuarios.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Facturación Total */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase mb-2">
            <span>Facturación Total</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${parseFloat(stats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {stats.totalOrders || 0} compras procesadas
          </span>
        </div>

        {/* KPI 2: Plan Mensual ($79) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase mb-2">
            <span>Suscripción Mensual</span>
            <Calendar className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.monthlyApprovedCount || 0} <span className="text-xs text-gray-400 font-normal">planes ($79)</span>
          </div>
          <span className="text-[11px] text-orange-400 font-semibold mt-1 block">
            ${parseFloat(stats.monthlyApprovedRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </span>
        </div>

        {/* KPI 3: Plan Anual ($708) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase mb-2">
            <span>Suscripción Anual VIP</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">
            {stats.annualApprovedCount || 0} <span className="text-xs text-gray-400 font-normal">planes ($708)</span>
          </div>
          <span className="text-[11px] text-amber-300 font-semibold mt-1 block">
            ${parseFloat(stats.annualApprovedRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </span>
        </div>

        {/* KPI 4: Pagos Pendientes (Efectivo / PayPal) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase mb-2">
            <span>Pagos Pendientes</span>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.pendingCount || 0} <span className="text-xs text-gray-400 font-normal">por conciliar</span>
          </div>
          <span className="text-[11px] text-yellow-400 font-semibold mt-1 block">
            ${parseFloat(stats.pendingRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD pendiente
          </span>
        </div>

        {/* KPI 5: Clientes Totales */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase mb-2">
            <span>Clientes Registrados</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.totalClients || 0}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
            Total compradores
          </span>
        </div>

      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por transacción, nombre, email o afiliado..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Periodicity Filter */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <span className="text-gray-400 px-2 font-medium">Plan:</span>
            <button
              onClick={() => setPeriodicityFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                periodicityFilter === 'all' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setPeriodicityFilter('mensual')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                periodicityFilter === 'mensual' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensual ($79)
            </button>
            <button
              onClick={() => setPeriodicityFilter('anual')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                periodicityFilter === 'anual' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Anual ($708)
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <span className="text-gray-400 px-2 font-medium">Estado:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'all' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'approved' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Aprobados
            </button>
            <button
              onClick={() => setStatusFilter('pending_cash')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'pending_cash' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Efectivo
            </button>
            <button
              onClick={() => setStatusFilter('pending_paypal')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'pending_paypal' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              PayPal
            </button>
          </div>
        </div>
      </div>

      {/* Main Table: Client Purchases & Tracking */}
      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Transacción</th>
                <th className="py-4 px-4">Cliente / Usuario</th>
                <th className="py-4 px-4">Plan & Periodicidad</th>
                <th className="py-4 px-4">Monto</th>
                <th className="py-4 px-4">Fechas (Inicio / Renovación)</th>
                <th className="py-4 px-4">Afiliado & Origen</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                    Cargando compras y suscripciones...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No se encontraron órdenes registradas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                orders.map((ord: any) => {
                  const isApproved = ord.approvalCode === '1' || ord.approvalStatus === 'approved';
                  const isPendingCash = ord.approvalCode === '2' || ord.approvalStatus === 'pending_cash';
                  const isPendingPaypal = ord.approvalCode === '3' || ord.approvalStatus === 'pending_paypal';
                  const isAnnual = ord.periodicity === 'anual' || ord.amount >= 200;

                  const formattedStart = ord.startDate ? new Date(ord.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
                  const formattedRenewal = ord.renewalDate ? new Date(ord.renewalDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

                  return (
                    <tr key={ord.id || ord.transactionId} className="hover:bg-white/[0.02] transition-colors">
                      
                      {/* Transacción */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300">
                            {ord.transactionId}
                          </span>
                          <button
                            onClick={() => handleCopy(ord.transactionId, `tx-${ord.id}`)}
                            title="Copiar ID de transacción"
                            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedTx === `tx-${ord.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">
                          {new Date(ord.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span>{ord.buyerName || 'Sin nombre'}</span>
                          {ord.isUserRegistered && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Registrado
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-[11px] font-mono mt-0.5">
                          {ord.buyerEmail}
                        </div>
                        {ord.buyerPhone && (
                          <div className="text-gray-500 text-[10px] flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5" /> {ord.buyerPhone}
                          </div>
                        )}
                      </td>

                      {/* Plan & Periodicidad */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Award className="w-3.5 h-3.5 text-orange-400" />
                          <span>{ord.planName}</span>
                        </div>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isAnnual 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          }`}>
                            {isAnnual ? 'ANUAL (365 DÍAS)' : 'MENSUAL (30 DÍAS)'}
                          </span>
                        </div>
                      </td>

                      {/* Monto */}
                      <td className="py-4 px-4 font-black text-white text-sm">
                        ${ord.amount} <span className="text-xs font-normal text-gray-400">{ord.currency}</span>
                      </td>

                      {/* Fechas */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-gray-300 text-[11px]">
                          <span className="text-gray-500 font-semibold">Inicio:</span> {formattedStart}
                        </div>
                        <div className="flex items-center gap-1 text-amber-300 text-[11px] font-semibold mt-0.5">
                          <span className="text-gray-500 font-semibold">Renueva:</span> {formattedRenewal}
                        </div>
                      </td>

                      {/* Afiliado & Origen */}
                      <td className="py-4 px-4">
                        {ord.affiliateCode ? (
                          <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                            {ord.affiliateCode}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-[11px]">Venta Directa</span>
                        )}
                        {ord.itmSource && (
                          <span className="text-[10px] text-gray-400 block mt-1 truncate max-w-[140px]" title={ord.itmSource}>
                            src: {ord.itmSource}
                          </span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Aprobado (1)
                          </span>
                        )}
                        {isPendingCash && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Efectivo (2)
                          </span>
                        )}
                        {isPendingPaypal && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            <Clock className="w-3 h-3" /> PayPal (3)
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Botón aprobar manual para órdenes pendientes */}
                          {(isPendingCash || isPendingPaypal) && (
                            <button
                              onClick={() => handleApproveOrder(ord.id)}
                              disabled={approvingId === ord.id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50"
                              title="Aprobar pago manualmente y activar suscripción"
                            >
                              {approvingId === ord.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                              <span>Aprobar</span>
                            </button>
                          )}

                          <button
                            onClick={() => setInspectOrder(ord)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Ver todos los parámetros y datos recibidos"
                          >
                            <Eye className="w-4 h-4" />
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

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>
              Mostrando {orders.length} de {pagination.total} órdenes
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-white">
                Página {page} de {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL: Full Parameters Inspector */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Detalle Completo de la Orden</h3>
                  <span className="font-mono text-xs text-amber-300">{inspectOrder.transactionId}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              {/* Sección 1: Datos del Plan y Periodicidad */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="font-bold text-orange-400 uppercase tracking-wider text-xs flex items-center gap-2">
                  <Award className="w-4 h-4" /> Parámetros del Plan Hotmart
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Plan_nombre</span>
                    <span className="font-bold text-white">{inspectOrder.planName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Plan_Periodicidad</span>
                    <span className="font-bold text-white uppercase">{inspectOrder.periodicity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Plan_Precio</span>
                    <span className="font-bold text-white">${inspectOrder.amount} {inspectOrder.currency}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Plan_Dias</span>
                    <span className="font-bold text-white">{inspectOrder.durationDays} días</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Fecha de Inicio</span>
                    <span className="font-medium text-gray-200">{inspectOrder.startDate ? new Date(inspectOrder.startDate).toLocaleString('es-ES') : '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Fecha de Renovación Calculada</span>
                    <span className="font-bold text-amber-300">{inspectOrder.renewalDate ? new Date(inspectOrder.renewalDate).toLocaleString('es-ES') : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Sección 2: Datos del Comprador y Usuario */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-xs flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Datos del Comprador / Titular
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Nombre del Comprador</span>
                    <span className="font-bold text-white">{inspectOrder.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <span className="font-mono text-gray-300">{inspectOrder.buyerEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Teléfono</span>
                    <span className="text-gray-300">{inspectOrder.buyerPhone || 'No proporcionado'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Cuenta en Plataforma</span>
                    <span className={`font-bold ${inspectOrder.isUserRegistered ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {inspectOrder.isUserRegistered ? `Registrado (User ID: ${inspectOrder.userId})` : 'Pendiente de activación'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sección 3: Datos de Afiliación y Tracking */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="font-bold text-blue-400 uppercase tracking-wider text-xs flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tracking, Afiliados y UTMs
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Código Afiliado (aff)</span>
                    <span className="font-mono font-bold text-orange-400">{inspectOrder.affiliateCode || 'Ninguno'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Estado Aprobado</span>
                    <span className="font-bold text-white">Código {inspectOrder.approvalCode} ({inspectOrder.approvalStatus})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">itm_source</span>
                    <span className="font-mono text-gray-300">{inspectOrder.itmSource || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">itm_medium / campaign</span>
                    <span className="font-mono text-gray-300">{inspectOrder.itmMedium || 'N/A'} {inspectOrder.itmCampaign ? `(${inspectOrder.itmCampaign})` : ''}</span>
                  </div>
                </div>
              </div>

              {/* Sección 4: Raw JSON Parameters */}
              <div className="space-y-2">
                <span className="font-bold text-gray-400 uppercase text-[11px] block">
                  Parámetros Crudos (JSON)
                </span>
                <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-[11px] text-gray-300 overflow-x-auto max-h-48">
                  {JSON.stringify(inspectOrder.rawParams, null, 2)}
                </pre>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setInspectOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default AdminHotmartPanel;
