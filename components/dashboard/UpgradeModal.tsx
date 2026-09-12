import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, Crown, ShieldCheck, Loader2, Star, Sparkles, Zap, Rocket, Shield, ArrowRight,
  ArrowLeft, ChevronDown, Lock, Mail, Video, Layers, HelpCircle, ChevronUp, BookOpen, CreditCard,
  Box, FileText, GraduationCap, RotateCcw, Headphones, Globe, Folder
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
          name: billingPeriod === 'monthly' ? 'Plan Pro Mensual' : 'Plan Pro Anual (5 Proyectos activos / Hasta 12 al año)',
          priceMonthly: billingPeriod === 'monthly' ? 79 : 590,
          currency: 'USD',
          description: billingPeriod === 'monthly' 
            ? 'Acceso a 1 proyecto activo con 30 reels al mes, dominio propio y embudos de venta.'
            : 'Construye y escala varios proyectos digitales durante todo el año con más capacidad y todos los beneficios Pro.',
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
              {/* Heading & Billing Switch (Diseño idéntico a imagen) */}
              <div className="text-center space-y-4 max-w-4xl mx-auto relative">
                {/* Logo Aprende.Marketing con barras */}
                <div className="flex flex-col items-center justify-center gap-1 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-end gap-1 h-5">
                      <div className="w-1.5 h-3 bg-[#FF5A1F] rounded-xs"></div>
                      <div className="w-1.5 h-4.5 bg-[#FF5A1F] rounded-xs"></div>
                      <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-xs"></div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Aprende<span className="text-[#FF5A1F]">.Marketing</span>
                    </span>
                  </div>
                  <span className="text-[11px] tracking-[0.3em] font-extrabold text-gray-400 uppercase font-mono">
                    APRENDE • IMPLEMENTA • ESCALA
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-[44px] font-black text-white tracking-tight leading-tight">
                  Tu sistema de marketing digital, en un solo lugar
                </h2>
                <p className="text-gray-300 text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
                  Ideas, herramientas y acompañamiento para que pases de la idea a resultados reales.
                </p>

                {/* Switch Mensual vs Anual */}
                <div className="pt-2 flex items-center justify-center">
                  <div className="p-1.5 bg-zinc-900/95 border border-zinc-800 rounded-full inline-flex items-center shadow-inner gap-1">
                    <button
                      type="button"
                      onClick={() => setBillingPeriod('monthly')}
                      className={`py-2 px-6 rounded-full text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer ${
                        billingPeriod === 'monthly'
                          ? 'bg-[#FF5A1F] text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Mensual
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod('yearly')}
                      className={`py-2 px-5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                        billingPeriod === 'yearly'
                          ? 'bg-[#FF5A1F] text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>Anual</span>
                      <span className="bg-[#00DF8F] text-black text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        AHORRA 2 MESES
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Plan Cards Grid con expansión animada */}
              <div className="w-full max-w-[1440px] mx-auto">
                <motion.div 
                  layout
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-stretch w-full"
                >
                  
                  {/* 1. PLAN BÁSICO - GRATIS (Se oculta animadamente en plan Anual) */}
                  <AnimatePresence mode="popLayout" initial={false}>
                    {billingPeriod === 'monthly' && (
                      <motion.div 
                        key="plan-gratis"
                        layout
                        initial={{ opacity: 0, scale: 0.94, x: -30 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.92, x: -30 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 bg-[#0c0d12] border border-white/10 rounded-3xl p-7 sm:p-9 xl:p-10 flex flex-col justify-between shadow-xl relative hover:border-white/20 transition-all"
                      >
                        <div>
                          {/* Fila Superior: Título + Badge */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-xs sm:text-sm font-mono font-bold text-gray-400 uppercase tracking-wider">PLAN BÁSICO</span>
                              <h3 className="text-4xl sm:text-5xl font-black text-white mt-1.5">GRATIS</h3>
                              <div className="flex items-baseline gap-1 mt-3">
                                <span className="text-5xl sm:text-6xl font-black text-white">$0</span>
                                <span className="text-lg sm:text-xl font-medium text-gray-400">/mes</span>
                              </div>
                            </div>
                            <span className="border border-[#00DF8F]/40 bg-[#00DF8F]/10 text-[#00DF8F] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap">
                              Ideal para comenzar
                            </span>
                          </div>

                          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mt-5 mb-8 font-normal">
                            Empieza tu primer proyecto y prueba cómo Aprende.Marketing construye contigo tu sistema de marketing.
                          </p>

                          {/* Lista de características */}
                          <div className="space-y-5">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                <Folder className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-base sm:text-lg font-bold text-white leading-snug">1 proyecto activo</h5>
                                <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">Crea tu primer producto o nicho.</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                <Globe className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-base sm:text-lg font-bold text-white leading-snug">1 sitio publicado</h5>
                                <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">En subdominio Aprende.Marketing</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                <Video className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-base sm:text-lg font-bold text-white leading-snug">3 reels con IA en total</h5>
                                <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">Hooks y guiones para tus primeras publicaciones.</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-base sm:text-lg font-bold text-white leading-snug">1 artículo de blog al mes</h5>
                                <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">Contenido optimizado con IA.</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-base sm:text-lg font-bold text-white leading-snug">Estrategia inicial con IA</h5>
                                <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">Análisis de producto, audiencia y plan de acción.</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                                <GraduationCap className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="text-base sm:text-lg font-bold text-white leading-snug">Acceso a la Academia básica</h5>
                                <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">Formación esencial para empezar.</p>
                              </div>
                            </div>
                          </div>

                          {/* No incluye */}
                          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                            <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider font-mono">NO INCLUYE:</p>
                            <ul className="space-y-2 text-sm sm:text-base text-gray-400 font-medium">
                              <li className="flex items-center gap-2.5 text-gray-400">
                                <X className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>Dominio personalizado</span>
                              </li>
                              <li className="flex items-center gap-2.5 text-gray-400">
                                <X className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>Automatizaciones avanzadas</span>
                              </li>
                              <li className="flex items-center gap-2.5 text-gray-400">
                                <X className="w-4 h-4 text-gray-500 shrink-0" />
                                <span>Academia Pro</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Botón CTA Gratis */}
                        <div className="pt-8 mt-8 border-t border-white/10">
                          <button
                            type="button"
                            disabled
                            className="w-full py-4 px-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-default"
                          >
                            <span>Empezar Gratis</span>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                          <p className="text-sm text-gray-400 text-center mt-3 font-medium">No necesitas tarjeta de crédito</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 2. PLAN PRO (Se expande animadamente a 12 columnas cuando es Anual) */}
                  <motion.div 
                    key="plan-pro"
                    layout
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={`${
                      billingPeriod === 'yearly' 
                        ? 'lg:col-span-12 p-8 sm:p-10 xl:p-12' 
                        : 'lg:col-span-7 p-7 sm:p-9 xl:p-10'
                    } bg-[#0b0c10] border-2 border-[#FF5A1F] rounded-3xl flex flex-col justify-between shadow-[0_0_50px_rgba(255,90,31,0.22)] relative`}
                  >
                  {/* Badge Superior */}
                  {billingPeriod === 'yearly' ? (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <span className="bg-gradient-to-r from-[#FF5A1F] to-[#FF4500] text-white text-xs sm:text-sm font-black px-6 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2 font-mono whitespace-nowrap shadow-[#FF5A1F]/40">
                        <Star className="w-4 h-4 fill-white text-white" /> MEJOR VALOR
                      </span>
                    </div>
                  ) : (
                    <div className="absolute -top-4 left-7 sm:left-10 z-20">
                      <span className="bg-gradient-to-r from-amber-500 to-[#FF5A1F] text-white text-xs sm:text-sm font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2 font-mono whitespace-nowrap">
                        <Crown className="w-4 h-4 fill-current text-white" /> MÁS POPULAR
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Encabezado Pro */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FF5A1F] uppercase tracking-wider font-mono">
                        <Crown className="w-4 h-4 fill-current text-[#FF5A1F]" /> PLAN PRO
                      </div>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        {billingPeriod === 'monthly' ? 'PRO MENSUAL' : 'PRO ANUAL'}
                      </h3>
                      
                      {billingPeriod === 'yearly' ? (
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-5 mt-3">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight">$590</span>
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-400">/año</span>
                              </div>
                              <p className="text-[#00DF8F] text-xl sm:text-2xl lg:text-3xl font-black mt-2.5 tracking-tight flex items-center gap-2 flex-wrap">
                                <span>Equivale a $59/mes</span>
                                <span className="text-[#00DF8F]/50">•</span>
                                <span>Ahorra $358 al año</span>
                              </p>
                            </div>

                            {/* Badge verde de Ahorro con icono de etiqueta (Exacto a Imagen 1) */}
                            <div className="border-2 border-[#00DF8F] bg-[#00DF8F]/10 rounded-2xl px-6 py-3.5 flex items-center gap-4 shadow-[0_0_30px_rgba(0,223,143,0.18)]">
                              <div className="w-11 h-11 rounded-xl bg-[#00DF8F] flex items-center justify-center text-black shrink-0 -rotate-12 shadow-sm">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8 8a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-8-8zM7 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                                </svg>
                              </div>
                              <div className="text-left font-mono">
                                <span className="text-xs font-black text-[#00DF8F] uppercase tracking-wider block">AHORRA</span>
                                <span className="text-2xl sm:text-3xl font-black text-white block leading-none my-0.5">$358</span>
                                <span className="text-[11px] font-black text-[#00DF8F] uppercase tracking-wider block">AL AÑO</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-5xl sm:text-6xl font-black text-white">$79</span>
                          <span className="text-lg sm:text-xl font-medium text-gray-400">/mes</span>
                        </div>
                      )}

                      <p className="text-base sm:text-lg text-gray-200 mt-4 max-w-3xl leading-relaxed font-normal">
                        {billingPeriod === 'monthly'
                          ? 'Construye y haz crecer tu proyecto digital con todo el sistema de marketing en un solo lugar.'
                          : 'Construye y escala varios proyectos digitales durante todo el año con más capacidad y todos los beneficios Pro.'}
                      </p>
                    </div>

                    {/* 3 Bloques destacados en fila */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-7">
                      {billingPeriod === 'yearly' ? (
                        <>
                          {/* Bloque 1 Anual */}
                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-1">
                              <Folder className="w-5 h-5" />
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-white">5 proyectos activos</h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                              Gestiona hasta 5 productos, nichos o negocios al mismo tiempo.
                            </p>
                          </div>

                          {/* Bloque 2 Anual */}
                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-1">
                              <Rocket className="w-5 h-5" />
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-white">Hasta 12 proyectos durante el año</h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                              Lanza distintas ideas durante tu suscripción anual sin limitar tu crecimiento.
                            </p>
                          </div>

                          {/* Bloque 3 Anual */}
                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-1">
                              <Video className="w-5 h-5" />
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-white">30 reels con IA cada mes</h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                              Hooks, guiones y llamadas a la acción para mantener activa tu captación.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Bloque 1 Mensual */}
                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-1">
                              <Folder className="w-5 h-5" />
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-white">1 proyecto activo</h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                              Gestiona tu nicho o negocio seleccionado con foco total.
                            </p>
                          </div>

                          {/* Bloque 2 Mensual */}
                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-1">
                              <Video className="w-5 h-5" />
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-white">30 reels con IA cada mes</h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                              Hooks, guiones y llamadas a la acción para mantener activa tu captación.
                            </p>
                          </div>

                          {/* Bloque 3 Mensual */}
                          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] mb-1">
                              <Layers className="w-5 h-5" />
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-white">Tu ecosistema completo</h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                              Páginas, embudos, blog, email marketing y WhatsApp desde un mismo lugar.
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Todo lo que incluye */}
                    <div className="space-y-4 pt-1">
                      <p className="text-xs sm:text-sm font-bold text-[#FF5A1F] uppercase tracking-wider font-mono">
                        TODO LO QUE INCLUYE:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-sm sm:text-base text-gray-100">
                        {/* Columna 1 */}
                        <div className="space-y-3.5">
                          {billingPeriod === 'yearly' ? (
                            <>
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                                <span className="font-bold text-white">Hasta 5 proyectos activos</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                                <span className="font-bold text-white">Hasta 12 proyectos durante el año</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                                <span className="font-bold text-white">Hasta 5 sitios publicados</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                                <span className="font-bold text-white">30 reels con IA cada mes</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                                <span className="font-bold text-white">1 proyecto activo desbloqueado</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                                <span className="font-bold text-white">1 sitio publicado con dominio propio</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                                <span className="font-bold text-white">30 reels con IA cada mes</span>
                              </div>
                            </>
                          )}
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Dominios personalizados</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Páginas de captación y embudos</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Artículos de blog para SEO con IA</span>
                          </div>
                        </div>

                        {/* Columna 2 */}
                        <div className="space-y-3.5">
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Email marketing automatizado</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Secuencias de WhatsApp</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Sin marca Aprende.Marketing</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Academia Pro incluida</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Soporte prioritario 1 a 1 por chat</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-[#FF5A1F] shrink-0" />
                            <span>Nuevas funcionalidades sin costo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón CTA y Subtexto */}
                  <div className="pt-8 mt-8 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleUpgrade('pro')}
                      disabled={processing === 'pro'}
                      className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-[#FF5A1F] hover:bg-[#E04E1A] text-white font-bold text-lg sm:text-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shadow-xl shadow-[#FF5A1F]/30 hover:scale-[1.01] active:scale-[0.98]"
                    >
                      {processing === 'pro' ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Procesando pago seguro...</span>
                        </>
                      ) : (
                        <>
                          <span>{billingPeriod === 'monthly' ? 'Empezar con Pro' : 'Elegir Pro Anual'}</span>
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                    <p className="text-sm sm:text-base text-gray-400 text-center mt-3 font-medium">
                      {billingPeriod === 'monthly'
                        ? 'Facturado $79 al mes · Cancela cuando quieras'
                        : 'Pago anual de $590 • Equivale a solo $59/mes (Ahorra $358 al año)'}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

              {/* Sello de confianza (Diseño idéntico a imagen) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full py-6 px-6 border-t border-b border-white/10 my-4">
                <div className="flex items-center justify-center gap-3.5 text-left">
                  <CreditCard className="w-7 h-7 text-white shrink-0" />
                  <div>
                    <p className="text-base sm:text-lg font-bold text-white">Pago 100% seguro con Stripe</p>
                    <p className="text-sm text-gray-400 font-medium">Tus datos están protegidos</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 text-left md:border-l md:border-r border-white/10 md:px-8">
                  <ShieldCheck className="w-7 h-7 text-white shrink-0" />
                  <div>
                    <p className="text-base sm:text-lg font-bold text-white">Cancela cuando quieras</p>
                    <p className="text-sm text-gray-400 font-medium">Sin permanencias</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 text-left">
                  <Headphones className="w-7 h-7 text-white shrink-0" />
                  <div>
                    <p className="text-base sm:text-lg font-bold text-white">Soporte real — Te ayudamos en todo el proceso</p>
                    <p className="text-sm text-gray-400 font-medium">De emprendedores para emprendedores</p>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison Table */}
              <div className="border border-white/5 bg-[#0c0c0e]/60 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 space-y-6 shadow-xl max-w-[1440px] mx-auto w-full">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.25em] font-mono">COMPARATIVA DETALLADA</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    Plan Gratuito vs. Plan Pro ({billingPeriod === 'monthly' ? '$79/mes' : '$790/año ($65,83/mes)'})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[550px]">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs font-black uppercase tracking-wider">
                        <th className="pb-4 font-mono w-1/2">Funcionalidad</th>
                        <th className="pb-4 font-mono text-center w-1/4">PLAN FREE ($0)</th>
                        <th className="pb-4 font-mono text-center w-1/4 text-[#FF5A1F]">
                          PLAN PRO ({billingPeriod === 'monthly' ? '$79/mes' : '$65,83/mes eq.'}) ★
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-sm">
                      {[
                        { 
                          feature: "Proyectos y Nichos activos", 
                          free: "1 proyecto de prueba", 
                          pro: billingPeriod === 'monthly' ? "1 proyecto activo" : "5 activos (hasta 12 durante el año)" 
                        },
                        { 
                          feature: "Reels con IA generados al mes", 
                          free: "3 de prueba", 
                          pro: billingPeriod === 'monthly' ? "30 al mes" : "30 al mes (360 al año)" 
                        },
                        { 
                          feature: "Dominios propios personalizados", 
                          free: "Subdominio compartido", 
                          pro: billingPeriod === 'monthly' ? "1 Dominio propio con SSL" : "Hasta 5 dominios (hasta 12 al año)" 
                        },
                        { 
                          feature: "Páginas de captación y embudos", 
                          free: "1 página activa", 
                          pro: "Embudos completos del nicho" 
                        },
                        { 
                          feature: "Artículos de blog para SEO", 
                          free: "1 al mes", 
                          pro: "Incluidos para tu nicho" 
                        },
                        { 
                          feature: "Hooks y guiones persuasivos", 
                          free: "Básicos", 
                          pro: "Persuasivos de alta conversión" 
                        },
                        { 
                          feature: "Email marketing automatizado", 
                          free: "—", 
                          pro: "Secuencias incluidas" 
                        },
                        { 
                          feature: "Secuencias y lanzamientos WhatsApp", 
                          free: "—", 
                          pro: "Estrategias incluidas" 
                        },
                        { 
                          feature: "Mentorías grupales en vivo", 
                          free: "—", 
                          pro: billingPeriod === 'monthly' ? "Acceso a grabaciones" : "En vivo todas las semanas" 
                        },
                        { 
                          feature: "Sin marca de agua en páginas", 
                          free: "Marca visible", 
                          pro: "100% Marca Blanca" 
                        },
                        { 
                          feature: "Integración Systeme.io y Webhooks", 
                          free: "—", 
                          pro: "Totalmente incluida" 
                        },
                        { 
                          feature: "Nivel de soporte técnico", 
                          free: "Comunidad", 
                          pro: "VIP Prioritario 1 a 1" 
                        }
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
                      q: "¿Cuál es la diferencia entre el Plan Mensual y el Plan Anual?", 
                      a: "El Plan Mensual ($79/mes) te permite desbloquear 1 proyecto/nicho activo con 30 reels al mes y dominio propio. El Plan Anual ($790/año, equivalente a $65,83/mes) te da acceso a 5 proyectos activos simultáneos (hasta 12 durante el año) con todos los beneficios Pro y un ahorro de $158 al año (2 meses de regalo)." 
                    },
                    { 
                      q: "¿Puedo desbloquear más de un proyecto en el Plan Mensual?", 
                      a: "El Plan Mensual está enfocado en 1 proyecto/nicho activo a la vez para garantizar foco y resultados. Si deseas diversificar y trabajar múltiples nichos a la vez, el Plan Anual te da acceso a 5 proyectos activos simultáneos y hasta 12 durante el año." 
                    },
                    { 
                      q: "¿Puedo cancelar cuando quiera?", 
                      a: "Sí, totalmente sin permanencias forzadas. Si cancelas el plan mensual, mantendrás todas las funciones Pro de tu proyecto hasta finalizar el ciclo que ya hayas abonado." 
                    },
                    { 
                      q: "¿Necesito conocimientos técnicos para publicar?", 
                      a: "No. La plataforma incluye plantillas maestras prediseñadas, integración con un clic para tus hotlinks, automatizaciones listas y soporte prioritario para asistirte." 
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
