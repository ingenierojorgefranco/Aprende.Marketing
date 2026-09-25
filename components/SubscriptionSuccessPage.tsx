import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Zap,
  Rocket,
  Lock,
  Mail,
  User as UserIcon,
  HelpCircle,
  ExternalLink,
  Loader2,
  Flame,
  Award,
  Calendar,
  CreditCard,
  Clock,
  Tag,
  Hash,
  Share2,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';
import { api } from '../services/api';
import { login as authLogin } from '../services/auth';

interface SubscriptionSuccessPageProps {
  user: User | null;
  onLogin?: (user: User) => void;
}

export const SubscriptionSuccessPage: React.FC<SubscriptionSuccessPageProps> = ({ user, onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters from Hotmart redirection
  const queryParams = new URLSearchParams(location.search);
  const paramTransaction = queryParams.get('transaction') || queryParams.get('transacao') || queryParams.get('transaction_id') || '';
  const paramEmail = queryParams.get('email') || queryParams.get('buyer_email') || queryParams.get('c_email') || '';
  // Hotmart envía el nombre del comprador como 'c_name'
  const paramName = queryParams.get('c_name') || queryParams.get('name') || queryParams.get('buyer_name') || '';
  const paramPhone = queryParams.get('c_phone') || queryParams.get('phone') || queryParams.get('buyer_phone') || '';
  const paramAff = queryParams.get('aff') || queryParams.get('affiliate') || '';
  const paramAprobado = queryParams.get('aprobado') || queryParams.get('status') || '1';
  const paramPlan = queryParams.get('plan') || queryParams.get('plan_slug') || '';
  
  // Parámetros directos de Hotmart (Imagen 1 y Imagen 2)
  const paramPlanNombre = queryParams.get('Plan_nombre') || queryParams.get('plan_nombre') || queryParams.get('plan_name') || '';
  const paramPlanPeriodicidad = (queryParams.get('Plan_Periodicidad') || queryParams.get('plan_periodicidad') || queryParams.get('periodicity') || '').toLowerCase();
  const paramPlanPrecio = queryParams.get('Plan_Precio') || queryParams.get('plan_precio') || queryParams.get('price') || queryParams.get('amount') || '';
  const paramPlanDias = queryParams.get('Plan_Dias') || queryParams.get('plan_dias') || queryParams.get('days') || '';
  const paramCurrency = queryParams.get('currency') || 'USD';
  const paramSrc = queryParams.get('src') || '';
  const paramProduct = queryParams.get('product') || queryParams.get('product_id') || queryParams.get('prod') || '';
  const paramOffer = queryParams.get('off') || queryParams.get('offer') || '';
  const itmSource = queryParams.get('itm_source') || queryParams.get('utm_source') || '';
  const itmMedium = queryParams.get('itm_medium') || queryParams.get('utm_medium') || '';
  const itmCampaign = queryParams.get('itm_campaign') || queryParams.get('utm_campaign') || '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  // Authentication form state for unauthenticated users
  const [activeTab, setActiveTab] = useState<'activate' | 'login'>('activate');
  const [formName, setFormName] = useState(paramName);
  const [formEmail, setFormEmail] = useState(paramEmail);
  const [formPhone, setFormPhone] = useState(paramPhone);
  const [formPassword, setFormPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Trigger celebration confetti only when aprobado === '1' (immediate approval)
  useEffect(() => {
    if (paramAprobado === '2' || paramAprobado === '3') return;

    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF5A1F', '#F59E0B', '#10B981', '#6366F1']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF5A1F', '#F59E0B', '#10B981', '#6366F1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [paramAprobado]);

  // Fetch purchase and plan details
  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const queryObj: Record<string, string> = {};
        if (paramTransaction) queryObj.transaction = paramTransaction;
        if (paramEmail) queryObj.email = paramEmail;
        if (paramName) queryObj.c_name = paramName;
        if (paramPhone) queryObj.c_phone = paramPhone;
        if (paramAff) queryObj.aff = paramAff;
        if (paramAprobado) queryObj.aprobado = paramAprobado;
        if (paramPlan) queryObj.plan = paramPlan;
        if (paramPlanNombre) queryObj.Plan_nombre = paramPlanNombre;
        if (paramPlanPeriodicidad) queryObj.Plan_Periodicidad = paramPlanPeriodicidad;
        if (paramPlanPrecio) queryObj.Plan_Precio = paramPlanPrecio;
        if (paramPlanDias) queryObj.Plan_Dias = paramPlanDias;
        if (paramCurrency) queryObj.currency = paramCurrency;
        if (paramSrc) queryObj.src = paramSrc;
        if (paramProduct) queryObj.product = paramProduct;
        if (paramOffer) queryObj.off = paramOffer;
        if (itmSource) queryObj.itm_source = itmSource;
        if (itmMedium) queryObj.itm_medium = itmMedium;
        if (itmCampaign) queryObj.itm_campaign = itmCampaign;

        const res = await api.getSubscriptionSuccessDetails(queryObj);
        setData(res);
        if (res?.buyer?.email && !formEmail) {
          setFormEmail(res.buyer.email);
        }
        if (res?.buyer?.name && !formName) {
          setFormName(res.buyer.name);
        }
        if (res?.buyer?.phone && !formPhone) {
          setFormPhone(res.buyer.phone);
        }
        if (res?.buyer?.isRegistered && !user) {
          setActiveTab('login');
        }
      } catch (err) {
        console.error("Error loading subscription success details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [location.search, user]);

  const handleCopyTransaction = (txId: string) => {
    if (!txId) return;
    navigator.clipboard.writeText(txId);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2500);
  };

  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const res = await api.activateHotmartAccount({
        email: formEmail,
        password: formPassword,
        name: formName,
        phone: formPhone,
        transaction: data?.purchase?.transactionId || paramTransaction,
        plan: data?.plan?.slug || paramPlan,
        Plan_nombre: paramPlanNombre || data?.plan?.name,
        Plan_Periodicidad: paramPlanPeriodicidad || data?.plan?.periodicity,
        Plan_Precio: paramPlanPrecio || data?.plan?.price,
        Plan_Dias: paramPlanDias || data?.plan?.durationDays
      });

      if (res.token) {
        localStorage.setItem('plataformadeventacom_token', res.token);
      }
      if (res.user && onLogin) {
        onLogin(res.user);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Error al activar tu cuenta. Por favor verifica tus datos.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const { user: loggedInUser } = await authLogin({ email: formEmail, password: formPassword });
      const mappedUser: User = {
        id: loggedInUser.id.toString(),
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role as any,
        planLimits: (loggedInUser as any).planLimits,
        customRedirectUrl: (loggedInUser as any).customRedirectUrl
      };
      if (onLogin) {
        onLogin(mappedUser);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Credenciales inválidas. Revisa tu email o contraseña.');
    } finally {
      setFormLoading(false);
    }
  };

  const approvalCode = String(data?.approval?.code || paramAprobado || '1');
  const isApproved = approvalCode === '1';
  const isPendingCash = approvalCode === '2';
  const isPendingPaypal = approvalCode === '3';

  // Detección de periodicidad (Mensual vs Anual)
  const isAnnual = (data?.plan?.periodicity === 'anual') || 
                   (paramPlanPeriodicidad === 'anual' || paramPlanPeriodicidad === 'annual') || 
                   (paramPlanDias && parseInt(paramPlanDias) > 100) ||
                   (paramPlanPrecio && parseFloat(paramPlanPrecio) > 200) ||
                   (paramPlan && (paramPlan.includes('anual') || paramPlan.includes('annual')));

  const planName = data?.plan?.name || paramPlanNombre || (isAnnual ? 'Pro_Ilimitado Anual' : 'Pro_Ilimitado Mensual');
  const periodicityLabel = isAnnual ? 'Anual' : 'Mensual';
  const durationDays = data?.plan?.durationDays || (paramPlanDias ? parseInt(paramPlanDias) : (isAnnual ? 365 : 30));
  const planDescription = data?.plan?.description || (isAnnual 
    ? 'Acceso total durante 1 año completo (365 días) con todas las herramientas de automatización, IA y soporte VIP.' 
    : 'Acceso total durante 30 días a proyectos, reels con IA, páginas, embudos y herramientas para escalar en Hotmart.');
  
  const transactionId = data?.purchase?.transactionId || paramTransaction || 'HP1163080373';
  const amount = data?.purchase?.amount ?? (paramPlanPrecio || (isAnnual ? '708.00' : '79.00'));
  const currency = data?.purchase?.currency || paramCurrency || 'USD';
  const buyerEmail = user?.email || data?.buyer?.email || paramEmail || 'jorgefranco@ejemplo.com';
  const buyerName = user?.name || data?.buyer?.name || paramName || 'Jorge Alberto Franco';
  const affiliateCode = data?.purchase?.affiliateCode || paramAff;

  // Fechas de inicio y renovación calculadas
  const rawStartDate = data?.purchase?.startDate || data?.purchase?.date || new Date().toISOString();
  const rawRenewalDate = data?.purchase?.renewalDate || new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const formattedStartDate = new Date(rawStartDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedRenewalDate = new Date(rawRenewalDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const featuresList = (data?.plan?.uiFeatures && data.plan.uiFeatures.length > 0)
    ? data.plan.uiFeatures
    : [
        'Proyectos y Productos Ilimitados',
        'Reels con IA Ilimitados',
        'Páginas de Captación y Embudos Ilimitados',
        'Dominios Personalizados Ilimitados',
        'Email Marketing y Secuencias Ilimitadas',
        'Secuencias y Lanzamientos WhatsApp Ilimitados',
        'Mentorías Grupales en Vivo Semanales',
        'Soporte Prioritario VIP 1 a 1'
      ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[520px] bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Navigation header */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white">
                Aprende<span className="text-orange-500">.Marketing</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-widest uppercase text-gray-400">
                Plataforma de Ventas Hotmart
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isApproved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Pago 100% Verificado
              </span>
            )}
            {isPendingCash && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" /> Pago en Efectivo Pendiente
              </span>
            )}
            {isPendingPaypal && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verificando PayPal
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 lg:py-14">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          {isApproved && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-5 shadow-inner animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-400" /> ¡Enhorabuena! Compra Exitosa en Hotmart
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                ¡Tu Suscripción está <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">100% Activa</span>!
              </h1>

              <p className="text-gray-300 text-base sm:text-lg font-normal leading-relaxed">
                Hemos procesado tu pedido de Hotmart con éxito. Tu plan <strong className="text-white">{planName}</strong> ya cuenta con todas las herramientas desbloqueadas para que comiences a escalar de inmediato.
              </p>
            </>
          )}

          {isPendingCash && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-5 shadow-inner">
                <Clock className="w-4 h-4 text-amber-400" /> Orden Registrada en Hotmart
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                ¡Esperando <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">Pago en Efectivo</span>!
              </h1>

              <p className="text-gray-300 text-base sm:text-lg font-normal leading-relaxed">
                Tu solicitud de pago (Baloto, Efecty, OXXO, Boleto, etc.) ha sido emitida correctamente. En cuanto el banco acredite el pago, Hotmart nos notificará y tu suscripción se activará automáticamente.
              </p>
            </>
          )}

          {isPendingPaypal && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-5 shadow-inner animate-pulse">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Procesando Transacción
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                Confirmando Pago con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">PayPal</span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg font-normal leading-relaxed">
                Estamos recibiendo la confirmación final de pago por parte de PayPal y Hotmart. Este proceso suele tomar solo unos minutos.
              </p>
            </>
          )}
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Premium Purchase Certificate & Large Transaction Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Ultra-Premium Purchase Confirmation Card */}
            <div className="bg-gradient-to-b from-[#131722]/90 via-[#0D1017]/95 to-black border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

              {/* Header: Verified Status & Processor */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${
                    isApproved 
                      ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
                      : (isPendingCash 
                          ? 'bg-gradient-to-br from-amber-500/30 to-amber-500/10 border border-amber-500/40 text-amber-400 shadow-amber-500/10'
                          : 'bg-gradient-to-br from-blue-500/30 to-blue-500/10 border border-blue-500/40 text-blue-400 shadow-blue-500/10')
                  }`}>
                    {isApproved && <CheckCircle2 className="w-8 h-8" />}
                    {isPendingCash && <Clock className="w-8 h-8" />}
                    {isPendingPaypal && <ShieldCheck className="w-8 h-8" />}
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-widest text-gray-400 block mb-0.5">Comprobante Oficial</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {isApproved && "Compra Aprobada y Verificada"}
                      {isPendingCash && "Pendiente de Pago en Efectivo"}
                      {isPendingPaypal && "Procesando Pago con PayPal"}
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 self-start sm:self-center">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Garantía Hotmart® Safe</span>
                </div>
              </div>

              {/* Banner informativo si es pago en efectivo */}
              {isPendingCash && (
                <div className="my-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                    <Clock className="w-4.5 h-4.5" /> Instrucciones para pago en efectivo:
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-300 leading-relaxed text-xs">
                    <li>Utiliza el comprobante emitido por Hotmart enviado a tu correo para pagar en tu punto más cercano (Baloto, Efecty, OXXO, banco, etc.).</li>
                    <li>La acreditación bancaria suele tomar de <strong>24 a 48 horas hábiles</strong>.</li>
                    <li>En cuanto el banco confirme tu pago, tu suscripción se activará en automático sin necesidad de enviar comprobantes.</li>
                  </ol>
                </div>
              )}

              {/* 4 LARGE HIGHLIGHT STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                
                {/* 1. Transaction Reference (Big Data) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-orange-500/40 transition-colors relative group">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-orange-400" /> ID de Transacción
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Oficial
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="font-mono text-lg sm:text-2xl font-black text-amber-300 tracking-tight select-all">
                      {transactionId}
                    </span>
                    <button
                      onClick={() => handleCopyTransaction(transactionId)}
                      title="Copiar código de transacción"
                      className={`p-2 rounded-xl border transition-all ${
                        copiedTx
                          ? 'bg-emerald-500 text-white border-emerald-400 scale-105'
                          : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10 active:scale-95'
                      }`}
                    >
                      {copiedTx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copiedTx && (
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">¡Código copiado al portapapeles!</span>
                  )}
                </div>

                {/* 2. Amount & Currency (Big Data) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-orange-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-orange-400" /> Monto Total Facturado
                    </span>
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {currency}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      ${amount}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      {currency} / {periodicityLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 block mt-1">
                    {isAnnual ? 'Ahorro Anual Aplicado (365 Días)' : 'Acceso Mensual (30 Días)'}
                  </span>
                </div>

                {/* 3. Start Date (Big Data) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-orange-500/40 transition-colors">
                  <div className="text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Fecha de Inicio
                  </div>
                  <div className="mt-2">
                    <span className="text-base sm:text-lg font-bold text-white block">
                      {formattedStartDate}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                      Suscripción iniciada de inmediato
                    </span>
                  </div>
                </div>

                {/* 4. Renewal Date (Big Data) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-orange-500/40 transition-colors">
                  <div className="text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Próxima Renovación
                  </div>
                  <div className="mt-2">
                    <span className="text-base sm:text-lg font-bold text-amber-300 block">
                      {formattedRenewalDate}
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold block mt-0.5">
                      {durationDays} días de acceso garantizados
                    </span>
                  </div>
                </div>

              </div>

              {/* Full Specs List */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-6 text-xs sm:text-sm space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-gray-400 font-medium">Plan Suscrito</span>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-white">{planName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      {periodicityLabel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-gray-400 font-medium">Titular de la Compra</span>
                  <span className="font-bold text-white text-right">{buyerName}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-gray-400 font-medium">Email Registrado</span>
                  <span className="font-mono text-gray-300 text-right">{buyerEmail}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-gray-400 font-medium">Estado en Tiempo Real</span>
                  <span className={`font-bold inline-flex items-center gap-1.5 ${
                    isApproved ? 'text-emerald-400' : isPendingCash ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isApproved && "Aprobado (Código 1)"}
                    {isPendingCash && "Pendiente de Pago Efectivo (Código 2)"}
                    {isPendingPaypal && "Pendiente PayPal (Código 3)"}
                  </span>
                </div>

                {affiliateCode && (
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-gray-400 font-medium">Código de Afiliado</span>
                    <span className="font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {affiliateCode}
                    </span>
                  </div>
                )}

                {itmSource && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">Canal de Acceso</span>
                    <span className="font-mono text-gray-400 text-xs">{itmSource} {itmCampaign ? `(${itmCampaign})` : ''}</span>
                  </div>
                )}
              </div>

              {/* Plan Description & Features */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" /> Beneficios y Herramientas Desbloqueadas
                  </h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {isAnnual ? '365 Días Ilimitados' : '30 Días Ilimitados'}
                  </span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mb-5 leading-relaxed">
                  {planDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {featuresList.map((feat: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Access / Activation Action Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* If user is ALREADY authenticated */}
            {user ? (
              <div className="bg-gradient-to-b from-orange-500/15 via-black/40 to-black/60 border border-orange-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-4">
                  <Check className="w-3.5 h-3.5" /> Sesión Iniciada
                </div>

                <h3 className="text-2xl font-black text-white mb-2">
                  ¡Hola, {user.name || buyerName}!
                </h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Tu cuenta está activa con el correo <strong className="text-white">{user.email || buyerEmail}</strong> y el plan <strong className="text-orange-400">{planName}</strong> ({periodicityLabel}) ya se encuentra vinculado a tu perfil.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Entrar a Mi Panel Principal</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/projects/create')}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4 text-orange-400" />
                    <span>Crear Mi Primer Proyecto</span>
                  </button>

                  <button
                    onClick={() => navigate('/dashboard/training')}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Acceder a la Academia VIP</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If user is NOT authenticated -> Quick Account Activation or Login */
              <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
                <div className="flex items-center justify-between gap-2 mb-6 p-1 bg-black/40 rounded-2xl border border-white/5">
                  <button
                    onClick={() => { setActiveTab('activate'); setFormError(null); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      activeTab === 'activate'
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Activar Cuenta
                  </button>
                  <button
                    onClick={() => { setActiveTab('login'); setFormError(null); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                      activeTab === 'login'
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                </div>

                {activeTab === 'activate' ? (
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">
                      Configura tu Acceso Directo
                    </h3>
                    <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                      Crea tu contraseña para ingresar de inmediato con tu suscripción <strong className="text-orange-400">{planName}</strong> activa.
                    </p>

                    <form onSubmit={handleActivateSubmit} className="space-y-4">
                      {formError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                          {formError}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Tu Nombre Completo
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Ej. Jorge Alberto Franco"
                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Email de Compra en Hotmart
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Crea una Contraseña de Acceso
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-2"
                      >
                        {formLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>{isPendingCash ? 'Guardar Contraseña y Preparar Acceso' : 'Activar y Entrar al Dashboard'}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-black text-white mb-2">
                      Accede a tu Cuenta
                    </h3>
                    <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                      Si ya tenías una cuenta registrada en la plataforma con este email, ingresa tus credenciales.
                    </p>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {formError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                          {formError}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-2"
                      >
                        {formLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>Iniciar Sesión y Continuar</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Support Box */}
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 text-xs text-gray-400 space-y-3">
              <div className="flex items-center gap-2 font-bold text-gray-200 text-sm">
                <HelpCircle className="w-4 h-4 text-orange-400" />
                <span>¿Tienes dudas con tu suscripción?</span>
              </div>
              <p className="leading-relaxed">
                Recuerda que Hotmart también te ha enviado el recibo de compra a tu correo electrónico. Si necesitas asistencia personalizada con tu cuenta o plan, estamos a tu disposición.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/contacto"
                  className="text-orange-400 hover:text-orange-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  Contactar Soporte <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/terminos"
                  className="text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Términos de servicio
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/60 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} Aprende.Marketing. Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-gray-600">
            Hotmart® es una marca registrada de Launch Pad Tecnologia, S.A.
          </p>
        </div>
      </footer>
    </div>
  );
};
