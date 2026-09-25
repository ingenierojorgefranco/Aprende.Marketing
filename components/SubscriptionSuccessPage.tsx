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
  Globe,
  Layers,
  GraduationCap,
  MessageSquare,
  Lock,
  Mail,
  User as UserIcon,
  HelpCircle,
  ExternalLink,
  Loader2,
  Flame,
  Award
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
  const paramAff = queryParams.get('aff') || queryParams.get('affiliate') || '';
  const paramAprobado = queryParams.get('aprobado') || queryParams.get('status') || '1';
  const paramPlan = queryParams.get('plan') || queryParams.get('plan_slug') || '';
  const paramPrice = queryParams.get('price') || queryParams.get('amount') || '';
  const paramCurrency = queryParams.get('currency') || 'USD';
  const paramSrc = queryParams.get('src') || '';
  const paramProduct = queryParams.get('product') || queryParams.get('product_id') || queryParams.get('prod') || '';
  const paramOffer = queryParams.get('off') || queryParams.get('offer') || '';
  const itmSource = queryParams.get('itm_source') || '';
  const itmMedium = queryParams.get('itm_medium') || '';
  const itmCampaign = queryParams.get('itm_campaign') || '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  // Authentication form state for unauthenticated users
  const [activeTab, setActiveTab] = useState<'activate' | 'login'>('activate');
  const [formName, setFormName] = useState(paramName);
  const [formEmail, setFormEmail] = useState(paramEmail);
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
        if (paramAff) queryObj.aff = paramAff;
        if (paramAprobado) queryObj.aprobado = paramAprobado;
        if (paramPlan) queryObj.plan = paramPlan;
        if (paramPrice) queryObj.price = paramPrice;
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
        transaction: data?.purchase?.transactionId || paramTransaction,
        plan: data?.plan?.slug || paramPlan
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

  const planName = data?.plan?.name || (paramPlan ? (paramPlan.includes('anual') || paramPlan.includes('annual') ? 'Plan Pro Anual' : paramPlan.toUpperCase()) : 'Plan Pro All-Access');
  const planDescription = data?.plan?.description || 'Acceso completo a la suite de automatización y herramientas de marketing para escalar tus ventas.';
  const transactionId = data?.purchase?.transactionId || paramTransaction || 'HP' + Date.now().toString().slice(-9);
  const amount = data?.purchase?.amount ?? (paramPrice || (data?.plan?.price ? data.plan.price : '79'));
  const currency = data?.purchase?.currency || paramCurrency || 'USD';
  const buyerEmail = user?.email || data?.buyer?.email || paramEmail || 'Registrado en Hotmart';
  const buyerName = user?.name || data?.buyer?.name || paramName;
  const affiliateCode = data?.purchase?.affiliateCode || paramAff;
  const isAnnual = (data?.plan?.interval === 'annual') || (paramPlan === 'anual' || paramPlan === 'annual' || paramPlan === 'pro-anual');

  const featuresList = (data?.plan?.uiFeatures && data.plan.uiFeatures.length > 0)
    ? data.plan.uiFeatures
    : [
        'Generador de Landing Pages con IA de Alta Conversión',
        'Estrategia de Hooks Persuasivos y Guiones Virales',
        'Embudos de Venta Ilimitados y Optimizados',
        'Secuencias Automatizadas de Email Marketing',
        'Lanzamientos Estratégicos por WhatsApp',
        'Conexión de Dominios Personalizados',
        'Acceso VIP a la Academia y Entrenamientos'
      ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-indigo-500/10 blur-[140px] rounded-full" />
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
                <ShieldCheck className="w-3.5 h-3.5" /> Pago en Efectivo Pendiente
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
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 lg:py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          {isApproved && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-inner animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-400" /> ¡Enhorabuena! Compra Exitosa en Hotmart
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                ¡Tu Suscripción está <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">100% Activa</span>!
              </h1>

              <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                Hemos procesado tu pedido de Hotmart con éxito. Tu cuenta ya cuenta con todas las herramientas desbloqueadas para que comiences a escalar de inmediato.
              </p>
            </>
          )}

          {isPendingCash && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-inner">
                <Zap className="w-4 h-4 text-amber-400" /> Orden Registrada en Hotmart
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                ¡Esperando <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">Pago en Efectivo</span>!
              </h1>

              <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                Tu solicitud de pago (Baloto, Efecty, OXXO, Boleto, etc.) ha sido emitida correctamente. En cuanto el banco acredite el pago, Hotmart nos notificará y tu suscripción se activará automáticamente.
              </p>
            </>
          )}

          {isPendingPaypal && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-inner animate-pulse">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Procesando Transacción
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                Confirmando Pago con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">PayPal</span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                Estamos recibiendo la confirmación final de pago por parte de PayPal y Hotmart. Este proceso suele tomar solo unos minutos.
              </p>
            </>
          )}
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Purchase Details & Plan Summary (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Purchase Confirmation Card */}
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    isApproved 
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
                      : (isPendingCash 
                          ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-amber-500/10'
                          : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 shadow-blue-500/10')
                  }`}>
                    {isApproved && <CheckCircle2 className="w-7 h-7" />}
                    {isPendingCash && <Zap className="w-7 h-7" />}
                    {isPendingPaypal && <ShieldCheck className="w-7 h-7" />}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Estado del Pedido</span>
                    <h3 className="text-xl font-bold text-white">
                      {isApproved && "Pago Aprobado y Confirmado"}
                      {isPendingCash && "Pendiente de Pago en Efectivo"}
                      {isPendingPaypal && "Procesando Pago con PayPal"}
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Procesado por Hotmart Seguro</span>
                </div>
              </div>

              {/* Banner informativo si es pago en efectivo */}
              {isPendingCash && (
                <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                    <Zap className="w-4 h-4" /> Instrucciones para pago en efectivo:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-gray-300 leading-relaxed">
                    <li>Utiliza el comprobante emitido por Hotmart enviado a tu correo para pagar en tu punto más cercano (Baloto, Efecty, OXXO, banco, etc.).</li>
                    <li>La acreditación bancaria suele tomar de <strong>24 a 48 horas hábiles</strong>.</li>
                    <li>En cuanto el banco confirme tu pago, tu suscripción se activará en automático sin necesidad de enviar comprobantes.</li>
                  </ol>
                </div>
              )}

              {/* Purchase Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-6 border-b border-white/10 text-sm">
                <div>
                  <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">Plan Adquirido</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-white text-base">{planName}</span>
                    {isAnnual && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ANUAL VIP
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">Monto de la Orden</span>
                  <span className="font-bold text-white text-base">
                    {amount ? `${amount} ${currency}` : 'Confirmado en Hotmart'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">ID de Transacción</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-amber-300 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20 max-w-[220px] truncate">
                      {transactionId}
                    </span>
                    <button
                      onClick={() => handleCopyTransaction(transactionId)}
                      title="Copiar código de transacción"
                      className={`p-1.5 rounded-md border transition-all ${
                        copiedTx
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {copiedTx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {copiedTx && (
                      <span className="text-[11px] text-emerald-400 font-bold animate-in fade-in">¡Copiado!</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">Email del Comprador</span>
                  <span className="font-medium text-gray-200 text-xs sm:text-sm truncate block" title={buyerEmail}>
                    {buyerEmail}
                  </span>
                </div>

                {buyerName && (
                  <div>
                    <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">Nombre Registrado</span>
                    <span className="font-medium text-gray-200 text-xs sm:text-sm truncate block">
                      {buyerName}
                    </span>
                  </div>
                )}

                {affiliateCode && (
                  <div>
                    <span className="text-gray-400 block text-xs font-semibold uppercase tracking-wider mb-1">Código de Afiliado</span>
                    <span className="font-mono text-xs text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      {affiliateCode}
                    </span>
                  </div>
                )}
              </div>

              {/* Plan Description & Features */}
              <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" /> Beneficios y Herramientas Desbloqueadas
                  </h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {isAnnual ? 'Acceso 1 Año Ilimitado' : 'Acceso Ilimitado'}
                  </span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mb-5 leading-relaxed">
                  {planDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {featuresList.map((feat: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick 3-step Getting Started Card */}
            <div className="bg-white/[0.04] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <h4 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-orange-400" /> 3 Pasos para Empezar a Facturar
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h5 className="font-bold text-white">Ingresa a tu Panel</h5>
                  <p className="text-gray-400 leading-relaxed">
                    Accede a tu panel con tu email para activar tus proyectos sin límites.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h5 className="font-bold text-white">Genera tu Landing</h5>
                  <p className="text-gray-400 leading-relaxed">
                    Utiliza la IA para redactar textos de alta conversión y tu embudo en minutos.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h5 className="font-bold text-white">Escala tus Ventas</h5>
                  <p className="text-gray-400 leading-relaxed">
                    Copia hooks virales, conecta tus enlaces de Hotmart y empieza a captar clientes.
                  </p>
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
                  ¡Hola, {user.name || 'Emprendedor'}!
                </h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Tu cuenta está activa con el correo <strong className="text-white">{user.email}</strong> y todas las características premium han quedado asociadas a tu perfil.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Ir a mi Dashboard</span>
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
                    <GraduationCap className="w-4 h-4 text-amber-400" />
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
                      Define tu contraseña para entrar de inmediato a tu panel de control con todos tus permisos desbloqueados.
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
                            placeholder="Ej. Juan Pérez"
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
