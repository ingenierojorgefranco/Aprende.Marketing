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

  const handleUpgrade = async (plan: Plan) => {
    setProcessing(plan.slug);
    console.log(`[UpgradeModal] Iniciando proceso de pago para plan: ${plan.slug} vía ${activePaymentMethod}`);

    try {
      if (activePaymentMethod === 'hotmart') {
        if (plan.hotmartId) {
          const finalUserId = user?.id || userId || localStorage.getItem('plataformadeventacom_user_id') || '0';
          const hotmartProductId = plan.hotmartId;
          const baseUrl = `https://pay.hotmart.com/${hotmartProductId}`;
          const params = new URLSearchParams();
          
          if (plan.hotmartOffer) {
            params.set('off', plan.hotmartOffer);
          }
          if (plan.hotmartCheckoutMode) {
            params.set('checkoutMode', plan.hotmartCheckoutMode);
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
    <div className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto custom-scrollbar flex">
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="w-full min-h-screen bg-[#050505] text-white flex flex-col"
      >
        {/* Sticky Header styled after Image 2 */}
        <header className="bg-[#0b0b0d]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-[110] w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between gap-4">
            {/* Branding Logo */}
            <div className="flex items-center gap-2.5">
              <span className="bg-[#FF5A1F] text-white text-[11px] font-black px-2 py-0.5 rounded-lg tracking-tight font-mono shadow-md">A.MKT</span>
              <span className="text-base md:text-lg font-bold text-white tracking-tight">
                Aprende.<span className="text-[#FF5A1F]">Marketing</span>
              </span>
            </div>

            {/* Back Arrow button */}
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white text-sm flex items-center gap-2 font-bold transition-all py-2.5 px-4 rounded-xl hover:bg-white/5 active:scale-95 group"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF5A1F] transition-transform group-hover:-translate-x-1" />
              <span>Volver a mi proyecto</span>
            </button>

            {/* Account Icon dropdown mockup */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5A1F] to-amber-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-[#FF5A1F]/15">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'B'}
              </div>
              <span className="text-sm font-semibold text-gray-300 hidden sm:flex items-center gap-1">
                {user?.name || 'Mi cuenta'}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 flex-1 flex flex-col gap-12">
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4 py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#FF5A1F]" />
              <p className="font-bold uppercase tracking-widest text-xs font-mono">Sincronizando Planes...</p>
            </div>
          ) : (
            <>
              {/* Dual Column Layout: Left Overview + Right Focus Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                
                {/* 1. Left Column: Account Details & Limits */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                  
                  {/* Item 1: Lo que ya construiste */}
                  <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
                    <h3 className="text-white text-base font-extrabold tracking-tight">Lo que ya construiste</h3>
                    
                    <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl items-center">
                      <div className="w-12 h-12 bg-[#FF5A1F]/10 rounded-xl border border-[#FF5A1F]/20 flex items-center justify-center font-bold text-[#FF5A1F] shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-white text-sm font-extrabold tracking-tight truncate">
                          {project?.name || "Curso Profesional de Microblading de Cejas"}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-emerald-400 text-[11px] font-bold">Página publicada</span>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3.5">
                      {[
                        "Estrategia preparada",
                        "Página de captación publicada",
                        "3 de 3 reels utilizados",
                        "1 proyecto activo"
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm items-center text-gray-300 font-semibold">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/10">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Item 2: Límites del plan gratuito */}
                  <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
                    <h3 className="text-white text-base font-extrabold tracking-tight">Has alcanzado los límites de tu plan gratuito</h3>
                    <div className="space-y-1">
                      {[
                        { name: 'Proyectos activos', val: '1 de 1', accent: true },
                        { name: 'Reels utilizados', val: '3 de 3', accent: true },
                        { name: 'Artículos disponibles este mes', val: '1 de 1', accent: true },
                        { name: 'Email marketing', val: 'No incluido', accent: false },
                        { name: 'Secuencias de WhatsApp', val: 'No incluido', accent: false }
                      ].map((lim, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-3 border-b border-white/[0.03] last:border-0">
                          <span className="text-gray-300 flex items-center gap-2.5">
                            <Lock className="w-4 h-4 text-gray-600 shrink-0" />
                            {lim.name}
                          </span>
                          <span className={`${lim.accent ? 'text-amber-500 font-extrabold' : 'text-gray-600 hover:text-gray-500 transition-colors'}`}>{lim.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Item 3: Tu siguiente oportunidad */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#121215] to-[#08080a] border border-white/5 p-6 rounded-3xl shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A1F]/5 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="flex gap-4 relative z-10">
                      <div className="w-10 h-10 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 rounded-xl flex items-center justify-center text-[#FF5A1F] shrink-0 mt-0.5 shadow-md">
                        <Zap className="w-5 h-5 fill-[#FF5A1F]/10" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <h4 className="text-sm font-extrabold text-white tracking-tight">Tu siguiente oportunidad</h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                          Tu página ya puede captar registros. Con Pro podrás hacer seguimiento automático a esas personas y convertirlas en clientes con emails, WhatsApp y automatizaciones.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Right Column: Plan conversion center card */}
                <div className="lg:col-span-8 bg-[#0c0c0e] border-2 border-[#FF5A1F]/30 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden flex flex-col gap-8 shadow-2xl shadow-[#FF5A1F]/5">
                  {/* Recommended Ribbon */}
                  <div className="text-center">
                    <span className="bg-[#FF5A1F] text-white text-[10px] font-black px-4.5 py-1.5 rounded-full uppercase tracking-widest inline-block shadow-md shadow-[#FF5A1F]/20 border border-white/10 font-mono">
                      RECOMENDADO PARA CONTINUAR
                    </span>
                  </div>

                  {/* Title and pitch */}
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                      Aprende Marketing <span className="text-[#FF5A1F]">Pro</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
                      Automatiza el seguimiento, mantén tu contenido activo y gestiona hasta tres proyectos desde una sola plataforma.
                    </p>
                  </div>

                  {/* Switch Monthly vs Yearly */}
                  <div className="space-y-6">
                    <div className="p-1.5 bg-black/50 border border-white/5 rounded-2xl grid grid-cols-2 max-w-md mx-auto relative shadow-inner">
                      <button 
                        type="button"
                        onClick={() => setBillingPeriod('monthly')}
                        className={`py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${billingPeriod === 'monthly' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'}`}
                      >
                        <span className="text-sm font-bold tracking-tight">Mensual</span>
                        <span className={`text-xs mt-0.5 font-semibold ${billingPeriod === 'monthly' ? 'text-white/80' : 'text-gray-500'}`}>USD 39 / mes</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setBillingPeriod('yearly')}
                        className={`py-3.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative ${billingPeriod === 'yearly' ? 'bg-[#FF5A1F] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'}`}
                      >
                        <span className="absolute -top-3.5 right-2 bg-emerald-500 text-black text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                          Ahorra 2 meses
                        </span>
                        <span className="text-sm font-bold tracking-tight">Anual</span>
                        <span className={`text-xs mt-0.5 font-semibold ${billingPeriod === 'yearly' ? 'text-white/80' : 'text-gray-500'}`}>USD 390 / año</span>
                      </button>
                    </div>

                    {/* Prominent Pricing display */}
                    <div className="text-center space-y-1">
                      <div className="flex items-baseline justify-center gap-1.5">
                        <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                          {billingPeriod === 'monthly' ? 'USD 39' : 'USD 390'}
                        </span>
                        <span className="text-lg text-gray-400 font-bold uppercase tracking-wider">/{billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-semibold tracking-wide">Cancela en cualquier momento.</p>
                    </div>
                  </div>

                  {/* Circular Icon cards rows */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {[
                      {
                        title: "Haz seguimiento a cada registro",
                        desc: "Secuencia de conversión, correos de nutrición, mensajes de WhatsApp e integración con Systeme.io.",
                        icon: Mail,
                      },
                      {
                        title: "Mantén activo tu tráfico",
                        desc: "Hasta 30 reels y 15 artículos mensuales adaptados a tus proyectos. Hooks, guiones, textos y CTA listos para publicar.",
                        icon: Video,
                      },
                      {
                        title: "Amplía tu operación",
                        desc: "Hasta 3 proyectos activos, gestión y segmentación de contactos, automatizaciones avanzadas y más.",
                        icon: Layers,
                      }
                    ].map((ben, idx) => {
                      const BenIcon = ben.icon;
                      return (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl flex flex-col gap-4 text-center items-center shadow-lg hover:border-white/10 transition-colors">
                          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center shadow-inner">
                            <BenIcon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-extrabold text-white tracking-tight">{ben.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">{ben.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Immediate values checklist */}
                  <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                    <h4 className="text-xs font-black text-[#FF5A1F] uppercase tracking-wider">Al activar Pro hoy:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Activarás el seguimiento automático de tu proyecto actual.",
                        "Tendrás acceso a las secuencias de conversión y nutrición.",
                        "Podrás preparar hasta 30 reels durante el mes.",
                        "Podrás crear hasta 15 artículos durante el mes.",
                        "Podrás crear 2 proyectos adicionales asociados."
                      ].map((chk, idx) => (
                        <div key={idx} className="flex gap-3 text-sm items-start font-semibold text-gray-300">
                          <div className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="leading-snug">{chk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary CTA Orange Button */}
                  <div className="pt-4 space-y-4">
                    <button
                      onClick={() => {
                        // Selección de plan premium de forma inteligente
                        const targetPlan = plans.find(p => p.slug !== 'starter' && p.slug.includes('pro')) || 
                                           plans.find(p => p.slug !== 'starter' && p.isRecommended) ||
                                           plans.find(p => p.slug !== 'starter') || 
                                           plans[0];
                        if (targetPlan) {
                          handleUpgrade(targetPlan);
                        }
                      }}
                      disabled={!!processing}
                      className="w-full bg-[#FF5A1F] hover:bg-[#E54E18] active:scale-[0.99] font-black text-lg py-5 px-8 rounded-2xl transition-all shadow-xl shadow-[#FF5A1F]/15 flex items-center justify-center gap-3 disabled:opacity-50 text-white"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Procesando pago seguro...</span>
                        </>
                      ) : (
                        <>
                          <span>Activar Pro por {billingPeriod === 'monthly' ? 'USD 39 al mes' : 'USD 390 al año'}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Sello de confianza */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 font-bold uppercase tracking-wider font-mono">
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Activación inmediata</span>
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Cancela cuando quieras</span>
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Pago seguro</span>
                    </div>
                  </div>

                  {/* Link alternative cancel button */}
                  <div className="text-center pt-2">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-300 text-sm font-bold tracking-tight underline cursor-pointer transition-colors"
                    >
                      Seguir con el plan gratuito
                    </button>
                    <p className="text-[10px] text-gray-600 mt-1.5 font-medium">Puedes cambiar de plan en cualquier momento.</p>
                  </div>

                </div>

              </div>

              {/* 3. Bottom comparative table */}
              <div className="border border-white/5 bg-[#0c0c0e]/50 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 space-y-8 shadow-xl">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.3em]">CONOCE LA DIFERENCIA</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Gratis vs Pro</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-500 text-xs font-black uppercase tracking-wider">
                        <th className="pb-4 font-mono">Funcionalidad</th>
                        <th className="pb-4 font-mono">Gratis</th>
                        <th className="pb-4 text-[#FF5A1F] font-mono">Pro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] text-sm">
                      {[
                        { feature: "Proyectos activos", free: "1", pro: "Hasta 3" },
                        { feature: "Reels al mes", free: "3", pro: "Hasta 30" },
                        { feature: "Artículos al mes", free: "1", pro: "Hasta 15" },
                        { feature: "Email marketing", free: "No incluido", pro: "Conversión y nutrición" },
                        { feature: "Secuencias de WhatsApp", free: "No incluido", pro: "Secuencias de lanzamiento" },
                        { feature: "Automatizaciones", free: "No incluidas", pro: "Incluidas" },
                        { feature: "Integración con Systeme.io", free: "No incluida", pro: "Incluida" },
                        { feature: "Soporte prioritario", free: "No incluido", pro: "Incluido" }
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 font-bold text-gray-300">{row.feature}</td>
                          <td className="py-4 text-gray-500 font-semibold">{row.free}</td>
                          <td className="py-4 text-white font-black">{row.pro}</td>
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
                      q: "¿Perderé mi proyecto actual?", 
                      a: "No. Tu estrategia, página, reels y contactos permanecerán en tu cuenta." 
                    },
                    { 
                      q: "¿Puedo cancelar cuando quiera?", 
                      a: "Sí. Mantendrás las funciones Pro hasta finalizar el período que ya hayas pagado." 
                    },
                    { 
                      q: "¿Necesito conocimientos técnicos?", 
                      a: "No. La plataforma te guiará durante la configuración de correos, WhatsApp y automatizaciones." 
                    },
                    { 
                      q: "¿Pro garantiza que conseguiré ventas?", 
                      a: "No. Aprende Marketing proporciona estrategias, herramientas y materiales, pero los resultados dependen de tu oferta, tráfico y ejecución." 
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
