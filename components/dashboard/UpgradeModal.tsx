import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, Crown, ShieldCheck, Loader2, Star, Sparkles, Zap, Rocket, Shield, ArrowRight,
  ArrowLeft, ChevronDown, Lock, Mail, Video, Layers, HelpCircle, ChevronUp, BookOpen, CreditCard 
} from 'lucide-react';
import { api } from '../../services/api';
import { Plan, User } from '../../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  user?: User;
  currentPlan?: string;
  reason?: string;
  userId?: string;
  projectId?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  currentPlan, 
  reason, 
  userId, 
  projectId 
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePaymentMethod, setActivePaymentMethod] = useState<'stripe' | 'hotmart'>('stripe');
  const [processing, setProcessing] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const planOrder = ['starter', 'plan-max-1', 'plan-max-2', 'plan-max-3', 'plan-max-4', 'plan-max-5', 'plan-max-6', 'plan-max-7', 'plan-max-8', 'plan-max-9', 'plan-max-10'];

  useEffect(() => {
    if (isOpen) {
      console.log("UpgradeModal - Parámetros recibidos:", { currentPlan, reason, userId, projectId });
      setLoading(true);
      
      // Carga de planes públicos, método de pago activo, y proyecto actual
      Promise.all([
        api.getPublicPlans(),
        api.getActivePaymentMethod().catch(() => 'stripe'),
        api.getProjects().catch(() => [])
      ]).then(([plansData, method, projectsList]) => {
        setPlans(plansData);
        setActivePaymentMethod(method as any);

        // Intentar rescatar el proyecto que se está editando o el primero disponible
        if (projectsList && projectsList.length > 0) {
          const found = projectId ? projectsList.find(p => p.id === projectId) : projectsList[0];
          setProject(found || projectsList[0]);
        }
      })
      .catch(err => console.error("Error loading upgrade modal data", err))
      .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleUpgrade = async (planOrSlug: Plan | string) => {
    const slug = typeof planOrSlug === 'string' ? planOrSlug : planOrSlug.slug;
    setProcessing(slug);
    console.log(`[UpgradeModal] Iniciando proceso de pago para plan: ${slug} vía ${activePaymentMethod}`);

    try {
      let plan: Plan | undefined = typeof planOrSlug === 'object' 
        ? planOrSlug 
        : plans.find(p => p.slug === slug || p.slug.includes(slug));

      if (!plan) {
        plan = {
          id: slug,
          slug: slug,
          name: 'Plan Pro All-Access',
          priceMonthly: billingPeriod === 'monthly' ? 79 : 59,
          currency: 'USD',
          description: 'Acceso total ilimitado a proyectos, reels con IA, páginas, dominios propios y soporte VIP.',
          limitsConfig: {} as any,
          uiFeatures: [],
          isActive: true,
          isRecommended: true
        } as unknown as Plan;
      }

      if (activePaymentMethod === 'hotmart') {
        const isAnnual = billingPeriod === 'yearly';
        // Si el usuario seleccionó facturación anual, usar los parámetros anuales (o fallback a los mensuales si no están definidos)
        const targetHotmartId = isAnnual ? (plan.hotmartIdAnnual || plan.hotmartId) : plan.hotmartId;
        const targetHotmartOffer = isAnnual ? (plan.hotmartOfferAnnual || plan.hotmartOffer) : plan.hotmartOffer;
        const targetHotmartCheckoutMode = isAnnual ? (plan.hotmartCheckoutModeAnnual || plan.hotmartCheckoutMode) : plan.hotmartCheckoutMode;

        if (targetHotmartId) {
          const finalUserId = user?.id || userId || localStorage.getItem('plataformadeventacom_user_id') || '0';
          const baseUrl = `https://pay.hotmart.com/${targetHotmartId}`;
          const params = new URLSearchParams();
          
          if (targetHotmartOffer) {
            params.set('off', targetHotmartOffer);
          }
          if (targetHotmartCheckoutMode) {
            params.set('checkoutMode', targetHotmartCheckoutMode);
          }
          
          const srcValue = projectId ? `${finalUserId}-${projectId}` : finalUserId;
          params.set('src', srcValue);
          
          const hotmartUrl = `${baseUrl}?${params.toString()}`;
          window.open(hotmartUrl, '_blank');
        } else {
          alert("⚠️ Error: El administrador no ha configurado un ID de Hotmart para este plan.");
        }
      } else {
        // Redirección directa para Stripe Checkout
        const response = await api.createCheckoutSession(plan.slug);
        if (response && response.url) {
          if (response.url === '#') {
            alert("⚠️ MODO OFFLINE DETECTADO\n\nEstás usando la versión Demo/Offline. La redirección a Stripe está simulada.");
          } else {
            window.open(response.url, '_blank');
          }
        } else {
          alert("Error: El servidor no devolvió una URL de pago válida.");
        }
      }
    } catch (error: any) {
      console.error("[UpgradeModal] Payment error critical:", error);
      alert(`❌ Error al iniciar el pago:\n${error.message || JSON.stringify(error)}`);
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end overflow-hidden" id="upgrade-modal-backdrop">
      {/* Semi-transparent dark overlay backdrop that closes the modal on click */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        id="upgrade-modal-overlay"
      />

      {/* Main Slide-over Panel pulling from the right - Widened for 3-plan Ecomhunt layout */}
      <motion.div
        initial={{ x: '100%', opacity: 0.8 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.8 }}
        transition={{ type: 'spring', damping: 30, stiffness: 180 }}
        className="relative w-full max-w-[98vw] lg:max-w-[95vw] xl:max-w-[92vw] 2xl:max-w-[1600px] h-full bg-[#050505] text-white flex flex-col border-l border-white/5 overflow-y-auto custom-scrollbar z-10 shadow-2xl"
        id="upgrade-modal-panel"
      >
        {/* Sticky Header styled after Image 2 */}
        <header className="bg-[#0b0b0d]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-[110] w-full py-4 px-6 md:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Minimal Back Button */}
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white text-xs md:text-sm flex items-center gap-2 font-bold transition-all py-2.5 px-4 bg-zinc-900 border border-zinc-850 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 group shadow-sm"
              id="back-to-project-btn"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF5A1F] transition-transform group-hover:-translate-x-1" />
              <span>Volver a mi proyecto</span>
            </button>

            {/* Circular Close Button (X) */}
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all shadow-md hover:bg-zinc-850 hover:scale-105 active:scale-95"
              title="Cerrar ventana"
              id="close-upgrade-panel-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="max-w-[1500px] mx-auto w-full px-4 md:px-8 py-8 md:py-12 flex-1 flex flex-col gap-10">
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4 py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#FF5A1F]" />
              <p className="font-bold uppercase tracking-widest text-xs font-mono">Sincronizando Planes...</p>
            </div>
          ) : (
            <>
              {/* Context Banner: Estado de tu cuenta y proyecto actual */}
              <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#FF5A1F]/10 rounded-xl border border-[#FF5A1F]/20 flex items-center justify-center font-bold text-[#FF5A1F] shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white text-sm font-extrabold tracking-tight truncate max-w-md">
                        {project?.name || "Curso Profesional"}
                      </h4>
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Página activa
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                      Plan actual: <span className="text-gray-200 font-bold">Free (1 proyecto activo)</span> · 3 reels utilizados
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Has alcanzado el límite de 1 proyecto del plan gratuito</span>
                </div>
              </div>

              {/* Heading & Billing Switch (Ecomhunt style) */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Elige el plan ideal para ti
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-semibold">
                  Escala tu negocio digital con las herramientas adecuadas. Cancela o cambia de plan en cualquier momento.
                </p>

                {/* Switch Mensual vs Anual */}
                <div className="pt-2 flex items-center justify-center">
                  <div className="p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl inline-flex items-center shadow-inner">
                    <button
                      type="button"
                      onClick={() => setBillingPeriod('monthly')}
                      className={`py-2 px-5 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer ${billingPeriod === 'monthly' ? 'bg-[#FF5A1F] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      Mensual
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod('yearly')}
                      className={`py-2 px-5 rounded-xl text-sm font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${billingPeriod === 'yearly' ? 'bg-[#FF5A1F] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                      <span>Anual</span>
                      <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Ahorra 2 meses
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2 Plan Cards Grid (Free vs Pro $79 All-Access) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full max-w-5xl mx-auto">
                
                {/* 1. PLAN FREE */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl relative hover:border-white/10 transition-colors">
                  <div className="space-y-5">
                    <div className="border-b border-white/5 pb-5">
                      <span className="text-xs font-mono font-black text-gray-400 uppercase tracking-widest">Plan Básico Inicial</span>
                      <h3 className="text-2xl font-black text-white mt-1">FREE</h3>
                      <div className="flex items-baseline gap-1 mt-3">
                        <span className="text-4xl font-black text-white">$0</span>
                        <span className="text-sm font-bold text-gray-500">/mes</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Totalmente gratuito para siempre</p>
                    </div>

                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      Diseñado para probar la plataforma y poner en marcha tu primer proyecto de marketing digital.
                    </p>

                    <div className="space-y-3 pt-2">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider font-mono">Incluye:</p>
                      <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>1 proyecto</strong> activo</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>1 página de captación</strong> publicada</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>3 reels al mes</strong> con IA (prueba de hooks y guiones)</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>1 artículo mensual</strong> de blog con IA</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Acceso a la Academia básica</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-gray-600">
                          <X className="w-4 h-4 text-gray-600 shrink-0" />
                          <span className="line-through">Dominios personalizados propios</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-gray-600">
                          <X className="w-4 h-4 text-gray-600 shrink-0" />
                          <span className="line-through">Email marketing y secuencias automatizadas</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-gray-600">
                          <X className="w-4 h-4 text-gray-600 shrink-0" />
                          <span className="line-through">Secuencias y lanzamientos de WhatsApp</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-gray-600">
                          <X className="w-4 h-4 text-gray-600 shrink-0" />
                          <span className="line-through">Múltiples proyectos y productos</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-gray-600">
                          <X className="w-4 h-4 text-gray-600 shrink-0" />
                          <span className="line-through">Mentorías grupales semanales</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-gray-600">
                          <X className="w-4 h-4 text-gray-600 shrink-0" />
                          <span className="line-through">Soporte VIP prioritario 1 a 1</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-4 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold text-sm cursor-not-allowed text-center"
                    >
                      Tu Plan Actual
                    </button>
                  </div>
                </div>

                {/* 2. PLAN PRO ($79/mes - Todo Ilimitado) - RECOMENDADO & POPULAR */}
                <div className="bg-gradient-to-b from-[#1c120c] via-[#100d0a] to-[#070708] border-2 border-[#FF5A1F] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-[0_0_50px_rgba(255,90,31,0.22)] relative transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,90,31,0.32)]">
                  {/* Badge Popular / Recomendado */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-gradient-to-r from-amber-500 to-[#FF5A1F] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 fill-current" /> ★ ACCESO TOTAL ILIMITADO
                    </span>
                  </div>

                  <div className="space-y-5">
                    <div className="border-b border-white/10 pb-5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black text-[#FF5A1F] uppercase tracking-widest flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-[#FF5A1F]" /> Plan Pro All-Access
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          Sin Restricciones
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
                        PRO ILIMITADO <Sparkles className="w-5 h-5 text-[#FF5A1F]" />
                      </h3>

                      <div className="flex items-baseline gap-1 mt-3">
                        <span className="text-4xl sm:text-5xl font-black text-white">
                          {billingPeriod === 'monthly' ? '$79' : '$59'}
                        </span>
                        <span className="text-base font-bold text-gray-400">/mes</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 font-medium">
                        {billingPeriod === 'monthly' 
                          ? 'Facturado $79 al mes · Cancela cuando quieras' 
                          : 'Facturado $708 al año · ¡Ahorras $240 (2 meses gratis)!'}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
                      Desbloquea todo el poder de la plataforma sin límites: crea <strong className="text-[#FF5A1F]">productos ilimitados, reels ilimitados y páginas ilimitadas</strong> para escalar al máximo.
                    </p>

                    <div className="space-y-3 pt-2">
                      <p className="text-[11px] font-black text-[#FF5A1F] uppercase tracking-wider font-mono">Todo lo que incluye sin límites:</p>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-white font-medium">
                        <li className="flex items-center gap-2.5 bg-[#FF5A1F]/10 p-2.5 rounded-xl border border-[#FF5A1F]/20">
                          <Rocket className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                          <span><strong className="text-white">Proyectos y Productos ILIMITADOS</strong> (crea sin límites)</span>
                        </li>
                        <li className="flex items-center gap-2.5 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span><strong className="text-white">Reels con IA ILIMITADOS</strong> (guiones, hooks y llamadas a la acción)</span>
                        </li>
                        <li className="flex items-center gap-2.5 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong className="text-white">Páginas de Captación y Embudos ILIMITADOS</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Dominios Personalizados ILIMITADOS</strong> (conecta tus propios dominios)</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Artículos de Blog para SEO ILIMITADOS</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Email Marketing Automatizado ILIMITADO</strong> (nutrición y venta)</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Secuencias y Lanzamientos de WhatsApp ILIMITADOS</strong></span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Mentorías grupales en vivo</strong> todas las semanas</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Sin marca de agua</strong> en todas tus páginas y embudos</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span><strong>Soporte Prioritario VIP 1 a 1</strong> por chat y WhatsApp</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Acceso anticipado a todas las nuevas herramientas de IA</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleUpgrade('pro')}
                      disabled={processing === 'pro'}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#ff7e47] hover:from-[#E04E1A] hover:to-[#FF5A1F] text-white font-black text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-[#FF5A1F]/30 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {processing === 'pro' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Procesando pago seguro...</span>
                        </>
                      ) : (
                        <>
                          <span>Desbloquear Plan Pro Ilimitado</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Sello de confianza */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-400 font-bold uppercase tracking-wider font-mono pt-2">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Activación inmediata</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Cancela en cualquier momento</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Pago 100% cifrado y seguro</span>
              </div>

              {/* Detailed Comparison Table (2-Column Free vs Pro $79) */}
              <div className="border border-white/5 bg-[#0c0c0e]/60 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 space-y-6 shadow-xl max-w-5xl mx-auto w-full">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.25em] font-mono">COMPARATIVA DETALLADA</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Plan Gratuito vs. Plan Pro All-Access</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[550px]">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs font-black uppercase tracking-wider">
                        <th className="pb-4 font-mono w-1/2">Funcionalidad</th>
                        <th className="pb-4 font-mono text-center w-1/4">PLAN FREE ($0)</th>
                        <th className="pb-4 font-mono text-center w-1/4 text-[#FF5A1F]">PLAN PRO ($79/mes) ★</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-sm">
                      {[
                        { feature: "Proyectos y Productos activos", free: "1 proyecto", pro: "ILIMITADOS" },
                        { feature: "Páginas de captación y embudos", free: "1 página activa", pro: "ILIMITADAS" },
                        { feature: "Dominios propios personalizados", free: "Subdominio compartido", pro: "ILIMITADOS con SSL" },
                        { feature: "Reels con IA generados al mes", free: "3 de prueba", pro: "ILIMITADOS (Uso Justo)" },
                        { feature: "Artículos de blog para SEO", free: "1 al mes", pro: "ILIMITADOS" },
                        { feature: "Hooks y guiones persuasivos", free: "Básicos", pro: "ILIMITADOS VIP" },
                        { feature: "Email marketing automatizado", free: "—", pro: "Secuencias Ilimitadas" },
                        { feature: "Secuencias y lanzamientos WhatsApp", free: "—", pro: "Lanzamientos Ilimitados" },
                        { feature: "Mentorías grupales en vivo", free: "—", pro: "Semanales en vivo" },
                        { feature: "Sin marca de agua en páginas", free: "Marca visible", pro: "100% Marca Blanca" },
                        { feature: "Integración Systeme.io y Webhooks", free: "—", pro: "Totalmente incluida" },
                        { feature: "Nivel de soporte técnico", free: "Comunidad", pro: "VIP Prioritario 1 a 1" }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 font-bold text-gray-300">{row.feature}</td>
                          <td className="py-4 text-center text-gray-500 font-semibold">{row.free}</td>
                          <td className="py-4 text-center text-[#FF5A1F] font-black text-base">{row.pro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Help desk FAQs Accordion */}
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Preguntas frecuentes</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      q: "¿Qué incluye exactamente el acceso Ilimitado?", 
                      a: "Con el Plan Pro de $79/mes puedes crear proyectos y productos ilimitados, embudos y páginas ilimitadas, dominios propios ilimitados y generación de reels con IA sin bloqueos de cuota, bajo una política de uso justo." 
                    },
                    { 
                      q: "¿Perderé mi proyecto actual?", 
                      a: "No. Tu estrategia, página, reels y contactos permanecerán en tu cuenta y se desbloquearán todas las funciones Pro." 
                    },
                    { 
                      q: "¿Puedo cancelar cuando quiera?", 
                      a: "Sí, sin compromisos ni contratos de permanencia. Mantendrás las funciones Pro hasta finalizar el período que ya hayas pagado." 
                    },
                    { 
                      q: "¿Necesito conocimientos técnicos?", 
                      a: "No. La plataforma te guía paso a paso durante la configuración de páginas, correos, dominios y automatizaciones." 
                    }
                  ].map((faq, idx) => {
                    const isFaqOpen = openFaq === idx;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setOpenFaq(isFaqOpen ? null : idx)}
                        className="border border-white/5 bg-[#0c0c0e] hover:bg-[#121216] p-6 rounded-2xl cursor-pointer transition-all space-y-3.5 select-none"
                      >
                        <div className="flex justify-between items-center gap-4">
                          <h4 className="text-sm font-bold text-white tracking-tight flex-1">{faq.q}</h4>
                          <div className={`p-1 rounded-lg bg-white/5 text-gray-400 transition-transform duration-300 ${isFaqOpen ? 'rotate-180 text-[#FF5A1F]' : ''}`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                        
                        <AnimatePresence initial={false}>
                          {isFaqOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs text-gray-400 leading-relaxed font-semibold pt-2 border-t border-white/5">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Clean footer logos block */}
              <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left mb-10">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-extrabold text-white tracking-tight">Pago 100% seguro</h5>
                    <p className="text-xs text-gray-500 mt-0.5 font-semibold">Tus datos y pagos están protegidos con cifrado de nivel bancario.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/[0.01] border border-white/5 p-2 rounded-2xl">
                  {["Visa", "Mastercard", "American Express", "Stripe Seguro"].map((brand, bIdx) => (
                    <span 
                      key={bIdx} 
                      className="text-[10px] font-black text-gray-400 uppercase bg-black/40 px-3 py-1.5 rounded-lg font-mono border border-white/5 shadow-inner"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

            </>
          )}

        </main>
      </motion.div>
    </div>
  );
};
