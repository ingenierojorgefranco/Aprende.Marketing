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
  Loader2,
  Terminal,
  Send,
  HelpCircle,
  Code
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

  // Webhook Test Simulation State
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookTestTab, setWebhookTestTab] = useState<'simulator' | 'hotmart_steps' | 'real_purchase' | 'curl'>('simulator');
  const [testWebhookType, setTestWebhookType] = useState<'mensual' | 'anual'>('mensual');
  const [testBuyerName, setTestBuyerName] = useState('Jorge Alberto Franco');
  const [testBuyerEmail, setTestBuyerEmail] = useState('jorgefranco@ejemplo.com');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

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
    if (!confirm("¿Deseas aprobar este pedido manualmente? Esto activará la suscripción del usuario de inmediato con las fechas calculadas")) {
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

  const handleExecuteTestWebhook = async () => {
    try {
      setTestLoading(true);
      setTestResult(null);
      const res = await api.sendHotmartWebhookTest(testWebhookType, testBuyerEmail, testBuyerName);
      setTestResult(res);
      setActionSuccess(`¡Webhook de ${testWebhookType.toUpperCase()} simulado con éxito! Se procesó la venta en tiempo real.`);
      setTimeout(() => setActionSuccess(null), 4000);
      fetchOrders();
    } catch (e: any) {
      setTestResult({ error: e.message || 'Error en envío' });
    } finally {
      setTestLoading(false);
    }
  };

  const webhookEndpointUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://aprende.marketing'}/api/hotmart/webhook`;

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowWebhookModal(true); setTestResult(null); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulador de Webhook</span>
          </button>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar Datos</span>
          </button>
        </div>
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

      {/* MODAL: Centro de Pruebas y Validación de Webhook Hotmart */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#10141E] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">Centro de Pruebas del Webhook</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      Endpoint Activo
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Verifica que Hotmart envíe datos y que el sistema procese y configure los planes correctamente.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
              
              {/* Webhook Endpoint Banner */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-orange-400" /> URL Oficial del Webhook en tu Servidor:
                  </span>
                  <span className="text-[11px] text-gray-400">Versión 2.0.0 (JSON)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookEndpointUrl}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-orange-400 font-mono text-xs select-all outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(webhookEndpointUrl);
                      setCopiedWebhookUrl(true);
                      setTimeout(() => setCopiedWebhookUrl(false), 2500);
                    }}
                    className="shrink-0 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    {copiedWebhookUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWebhookUrl ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Esta es la URL que debes registrar en el panel de Hotmart en <strong>Herramientas &gt; Webhooks (Postback)</strong>.
                </p>
              </div>

              {/* Navigation Tabs for Testing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
                <button
                  onClick={() => setWebhookTestTab('simulator')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    webhookTestTab === 'simulator'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulador 1-Clic</span>
                </button>
                <button
                  onClick={() => setWebhookTestTab('hotmart_steps')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    webhookTestTab === 'hotmart_steps'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Desde Hotmart</span>
                </button>
                <button
                  onClick={() => setWebhookTestTab('real_purchase')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    webhookTestTab === 'real_purchase'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Compra Real</span>
                </button>
                <button
                  onClick={() => setWebhookTestTab('curl')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    webhookTestTab === 'curl'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Comando cURL</span>
                </button>
              </div>

              {/* TAB 1: SIMULADOR 1-CLIC */}
              {webhookTestTab === 'simulator' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs">
                    Envía una compra simulada directamente a tu servidor con los parámetros exactos de Hotmart (nombre, periodicidad, precio, días, usuario y afiliado). Podrás comprobar cómo el backend calcula las fechas y activa la suscripción al instante.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Selector de Plan */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300">Plan a Simular:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTestWebhookType('mensual')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            testWebhookType === 'mensual'
                              ? 'bg-orange-500/20 border-orange-500 text-white'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <div className="font-bold text-xs text-orange-400">Pro Mensual</div>
                          <div className="text-sm font-black text-white mt-1">$79 USD</div>
                          <div className="text-[10px] text-gray-400">Duración: 30 días</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTestWebhookType('anual')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            testWebhookType === 'anual'
                              ? 'bg-amber-500/20 border-amber-500 text-white'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <div className="font-bold text-xs text-amber-400">Pro Anual VIP</div>
                          <div className="text-sm font-black text-white mt-1">$708 USD</div>
                          <div className="text-[10px] text-gray-400">Duración: 365 días</div>
                        </button>
                      </div>
                    </div>

                    {/* Datos del Comprador */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">Nombre del Comprador:</label>
                        <input
                          type="text"
                          value={testBuyerName}
                          onChange={(e) => setTestBuyerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-orange-500"
                          placeholder="Nombre y Apellidos"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">Email del Comprador:</label>
                        <input
                          type="email"
                          value={testBuyerEmail}
                          onChange={(e) => setTestBuyerEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-orange-500"
                          placeholder="email@ejemplo.com"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteTestWebhook}
                    disabled={testLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {testLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando Webhook y Procesando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Disparar Webhook de Compra {testWebhookType.toUpperCase()} Ahora</span>
                      </>
                    )}
                  </button>

                  {/* Resultado de la simulación */}
                  {testResult && (
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Respuesta del Servidor:
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">HTTP 200 OK</span>
                      </div>
                      <pre className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                        {JSON.stringify(testResult, null, 2)}
                      </pre>
                      <p className="text-[11px] text-gray-400">
                        ¡Listo! La orden ya fue insertada en el registro y podrás verla inmediatamente en la tabla inferior al cerrar este modal.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROBAR DESDE HOTMART (TOOLS OFICIALES) */}
              {webhookTestTab === 'hotmart_steps' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                    Hotmart tiene una herramienta nativa para enviar pruebas de Webhook sin realizar ningún cobro. Sigue estos pasos para verificar la conexión directa:
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0">1</div>
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs">Ingresa a las Herramientas de Hotmart</div>
                        <p className="text-gray-400 text-xs">
                          Inicia sesión en tu cuenta de productor en <a href="https://app.hotmart.com" target="_blank" rel="noreferrer" className="text-orange-400 underline font-semibold">app.hotmart.com</a> y ve a <strong>Herramientas (Tools) &gt; Webhooks (Postback)</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0">2</div>
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs">Registra tu URL del Webhook</div>
                        <p className="text-gray-400 text-xs">
                          Haz clic en <strong>Configurar Webhook</strong> o <strong>Registrar Webhook</strong> y pega la URL:
                        </p>
                        <code className="block p-2 rounded-lg bg-black/60 text-orange-400 font-mono text-[11px] break-all">
                          {webhookEndpointUrl}
                        </code>
                        <p className="text-gray-400 text-[11px]">
                          Versión: <strong>2.0.0</strong> | Evento principal: <strong>Compra aprobada (Purchase approved)</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0">3</div>
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs">Pestaña &quot;Pruebas / Enviar prueba de Webhook&quot;</div>
                        <p className="text-gray-400 text-xs">
                          En la misma sección de Webhook de Hotmart, haz clic en la pestaña <strong>&quot;Pruebas&quot;</strong>. Selecciona tu producto (Mensual o Anual), el evento <strong>&quot;Compra aprobada&quot;</strong> y haz clic en <strong>&quot;Enviar prueba&quot;</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">4</div>
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-400 text-xs">Comprobar Resultado</div>
                        <p className="text-gray-300 text-xs">
                          Hotmart te mostrará una confirmación con status <strong>HTTP 200 OK</strong>. Luego regresa a este panel de administración, haz clic en <strong>&quot;Actualizar Datos&quot;</strong> y verás la orden registrada con los datos enviados por Hotmart.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPRA REAL DE PRUEBA EN EL CHECKOUT */}
              {webhookTestTab === 'real_purchase' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs">
                    Para verificar el flujo completo de inicio a fin (desde que el cliente paga en la pasarela de Hotmart hasta que ve la página de confirmación con sus fechas y se activa su cuenta), puedes hacer una compra real de 2 formas:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Método A: Cupón 100% */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="font-bold text-orange-400 text-xs flex items-center gap-1.5">
                        <Tag className="w-4 h-4" /> Opción 1: Cupón 100% de Descuento
                      </div>
                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-300">
                        <li>Entra a Hotmart &gt; Productos &gt; Cupones de descuento.</li>
                        <li>Crea un cupón del <strong>100%</strong> de descuento (ej. <code className="text-orange-300">TEST100</code>).</li>
                        <li>Abre tu link de compra del plan Mensual o Anual en una <strong>ventana de incógnito</strong>.</li>
                        <li>Aplica el cupón: el total será $0. Completa la compra.</li>
                        <li>Hotmart disparará el webhook oficial y te redirigirá a <code className="text-orange-300">/subscription-success</code> con todos los parámetros.</li>
                      </ol>
                    </div>

                    {/* Método B: Compra con Reembolso Inmediato */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" /> Opción 2: Tarjeta y Reembolso en 1 Clic
                      </div>
                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-300">
                        <li>Configura una oferta temporal de $1 USD o realiza la compra con tu tarjeta de crédito en tu checkout normal.</li>
                        <li>Completa la compra: recibirás el webhook automático de Hotmart en segundos.</li>
                        <li>Comprueba que la página de agradecimiento muestra la referencia, fecha de inicio y renovación.</li>
                        <li>Ve a tu panel de Hotmart &gt; Ventas &gt; Visión general, localiza tu compra y haz clic en <strong>Reembolsar</strong> para recuperar el dinero sin comisión.</li>
                      </ol>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-gray-400 space-y-1">
                    <span className="font-bold text-white block">¿Qué verificar en la plataforma después de la compra?</span>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Que en la <strong>Página de Agradecimiento</strong> se vean la Referencia, el Plan, el Precio y la Próxima Fecha de Renovación calculada.</li>
                      <li>Que en este <strong>Panel de Administrador</strong> aparezca la orden con estado <span className="text-emerald-400 font-bold">Aprobada</span>.</li>
                      <li>Que el usuario pueda iniciar sesión con sus credenciales y tenga los límites Pro Ilimitados desbloqueados.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: COMANDO CURL */}
              {webhookTestTab === 'curl' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-300 text-xs space-y-2">
                    <span className="font-bold text-white block">Ejecuta esta petición cURL desde tu terminal:</span>
                    <p className="text-gray-400 text-xs">
                      Envía un payload estándar idéntico al que genera Hotmart cuando se aprueba una compra del plan mensual de $79 USD:
                    </p>
                    <div className="relative">
                      <pre className="p-4 rounded-2xl bg-black/80 border border-white/15 font-mono text-[11px] text-gray-300 overflow-x-auto">
{`curl -X POST "${webhookEndpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "PURCHASE_APPROVED",
    "version": "2.0.0",
    "data": {
      "product": { "id": "112233", "name": "Pro_Ilimitado Mensual" },
      "purchase": {
        "transaction": "HP${Date.now().toString().slice(-9)}",
        "status": "APPROVED",
        "price": { "value": 79.0, "currency_value": "USD" },
        "payment": { "type": "CREDIT_CARD" }
      },
      "buyer": {
        "name": "Jorge Alberto Franco",
        "email": "jorgefranco@ejemplo.com",
        "checkout_phone": "+57 300 123 4567"
      },
      "affiliate": { "code": "L43619849X" },
      "subscription": {
        "subscriber": { "code": "SUB-TEST01" }
      }
    },
    "Plan_nombre": "Pro_Ilimitado Mensual",
    "Plan_Periodicidad": "mensual",
    "Plan_Precio": 79,
    "Plan_Dias": 30
  }'`}
                      </pre>
                      <button
                        onClick={() => {
                          const curlCmd = `curl -X POST "${webhookEndpointUrl}" -H "Content-Type: application/json" -d '{"event":"PURCHASE_APPROVED","version":"2.0.0","data":{"product":{"id":"112233","name":"Pro_Ilimitado Mensual"},"purchase":{"transaction":"HP${Date.now().toString().slice(-9)}","status":"APPROVED","price":{"value":79.0,"currency_value":"USD"},"payment":{"type":"CREDIT_CARD"}},"buyer":{"name":"Jorge Alberto Franco","email":"jorgefranco@ejemplo.com","checkout_phone":"+57 300 123 4567"},"affiliate":{"code":"L43619849X"},"subscription":{"subscriber":{"code":"SUB-TEST01"}}},"Plan_nombre":"Pro_Ilimitado Mensual","Plan_Periodicidad":"mensual","Plan_Precio":79,"Plan_Dias":30}'`;
                          navigator.clipboard.writeText(curlCmd);
                          setCopiedCurl(true);
                          setTimeout(() => setCopiedCurl(false), 2500);
                        }}
                        className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCurl ? '¡Copiado!' : 'Copiar cURL'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-white/10 flex justify-between items-center bg-white/[0.01]">
              <div className="text-[11px] text-gray-500">
                Las compras procesadas se reflejan inmediatamente en la base de datos y la interfaz.
              </div>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
              >
                Cerrar Centro de Pruebas
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default AdminHotmartPanel;
