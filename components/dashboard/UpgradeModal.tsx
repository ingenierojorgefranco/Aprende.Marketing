import React, { useEffect, useState } from 'react';
import { X, Check, Crown, ShieldCheck, Loader2, Star, Sparkles, Zap, Rocket, Shield, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Plan } from '../../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentPlan?: string;
  reason?: string;
  ////////// Se añade userId y projectId opcional a las props para tracking SRC - 25/05/2025 11:30 //////////
  userId?: string;
  projectId?: string;
  ////////// Fin de actualización - 25/05/2025 11:30 //////////
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, currentPlan, reason, userId, projectId }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  ////////// Estado para el método de pago activo del sistema - 24/05/2025 10:30 //////////
  const [activePaymentMethod, setActivePaymentMethod] = useState<'stripe' | 'hotmart'>('stripe');
  ////////// Fin de actualización - 24/05/2025 10:30 //////////
  const [processing, setProcessing] = useState<string | null>(null);

  // ////////// Nuevo estado para el plan seleccionado e información persuasiva - 01/06/2025 10:00 //////////
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string | null>(null);

  const planOrder = ['starter', 'plan-max-1', 'plan-max-2', 'plan-max-3', 'plan-max-4', 'plan-max-5', 'plan-max-6', 'plan-max-7', 'plan-max-8', 'plan-max-9', 'plan-max-10'];

  const planPitchMap: Record<string, string> = {
      'starter': "Perfecto para validar tu nicho sin costes fijos.",
      'plan-max-1': "Desbloquea tu primer proyecto profesional con dominios y potencia total.",
      'plan-max-2': "Escala a tu segundo proyecto independiente con todas las funciones activas.",
      'default': "Potencia adicional para escalar tus proyectos simultáneamente sin barreras."
  };
  // ////////// Fin de actualización - 01/06/2025 10:00 //////////

  useEffect(() => {
      if (isOpen) {
          setLoading(true);
          ////////// Se cargan los planes públicos y el método de pago activo - 24/05/2025 10:30 //////////
          Promise.all([
              api.getPublicPlans(),
              api.getActivePaymentMethod().catch(() => 'stripe')
          ]).then(([plansData, method]) => {
              setPlans(plansData);
              setActivePaymentMethod(method as any);
              
              // ////////// Selección inteligente del siguiente plan en la secuencia - 25/02/2026 //////////
              const currentIndex = planOrder.indexOf(currentPlan || 'starter');
              const nextSlug = currentIndex < planOrder.length - 1 ? planOrder[currentIndex + 1] : null;
              if (nextSlug) setSelectedPlanSlug(nextSlug);
              else if (plansData.length > 0) setSelectedPlanSlug(plansData[0].slug);
              // ////////// Fin de actualización //////////
          })
          .catch(err => console.error("Error loading upgrade modal data", err))
          .finally(() => setLoading(false));
          ////////// Fin de actualización - 24/05/2025 10:30 //////////
      }
  }, [isOpen]);

  const handleUpgrade = async (plan: Plan) => {
      setProcessing(plan.slug);
      console.log(`[UpgradeModal] Iniciando proceso de pago para plan: ${plan.slug} vía ${activePaymentMethod}`);

      try {
          ////////// Lógica de redirección dinámica según el método configurado - 24/05/2025 10:30 //////////
          if (activePaymentMethod === 'hotmart') {
              if (plan.hotmartId || plan.slug !== 'starter') {
                  ////////// Obtención robusta del userId para el tracking SRC - 25/05/2025 11:30 //////////
                  // Priorizamos la prop userId, si no existe buscamos en localStorage (formato compatible con auth.ts)
                  const finalUserId = userId || localStorage.getItem('plataformadeventacom_user_id') || '0';
                  
                  ////////// Nueva lógica para construcción de URL de Hotmart con Oferta y CheckoutMode - 25/05/2025 18:45 //////////
                  // Si no hay hotmartId configurado en el plan, usamos uno por defecto para la demo
                  const hotmartProductId = plan.hotmartId || '2983743';
                  const baseUrl = `https://pay.hotmart.com/${hotmartProductId}`;
                  const params = new URLSearchParams();
                  
                  // Si el plan tiene un código de oferta configurado, lo añadimos como 'off'
                  if (plan.hotmartOffer) {
                      params.set('off', plan.hotmartOffer);
                  }
                  
                  // Si el plan tiene un modo de checkout personalizado, lo usamos. 
                  if (plan.hotmartCheckoutMode) {
                      params.set('checkoutMode', plan.hotmartCheckoutMode);
                  } else {
                      params.set('checkoutMode', '10');
                  }
                  
                  // El parámetro SRC ahora incluye userId y projectId para identificar qué proyecto actualizar
                  const srcValue = projectId ? `${finalUserId}-${projectId}` : finalUserId;
                  params.set('src', srcValue);
                  
                  const hotmartUrl = `${baseUrl}?${params.toString()}`;
                  ////////// Fin de actualización - 25/05/2025 18:45 //////////
                  
                  ////////// Se abre Hotmart en una pestaña nueva - 25/05/2025 19:30 //////////
                  window.open(hotmartUrl, '_blank');
                  ////////// Fin de actualización - 25/05/2025 19:30 //////////
              } else {
                  alert("⚠️ Error: El administrador no ha configurado un ID de Hotmart para este plan.");
              }
          } else {
              // Lógica original de Stripe Checkout
              const response = await api.createCheckoutSession(plan.slug);
              if (response && response.url) {
                  if (response.url === '#') {
                      alert("⚠️ MODO OFFLINE DETECTADO\n\nEstás usando la versión Demo/Offline. La redirección a Stripe está simulada.\n\nPara probar pagos reales, asegúrate de iniciar sesión en modo 'Base de Datos'.");
                  } else {
                      ////////// Se abre Stripe en una pestaña nueva - 25/05/2025 19:30 //////////
                      window.open(response.url, '_blank');
                      ////////// Fin de actualización - 25/05/2025 19:30 //////////
                  }
              } else {
                  alert("Error: El servidor no devolvió una URL de pago válida.");
              }
          }
          ////////// Fin de actualización - 24/05/2025 10:30 //////////
      } catch (error: any) {
          console.error("[UpgradeModal] Payment error critical:", error);
          alert(`❌ Error al iniciar el pago:\n${error.message || JSON.stringify(error)}`);
      } finally {
          setProcessing(null);
      }
  };

  if (!isOpen) return null;

  // ////////// Lógica para obtener el plan actualmente enfocado/seleccionado - 27/05/2025 15:30 //////////
  const selectedPlanData = plans.find(p => p.slug === selectedPlanSlug);
  // ////////// Fin de actualización - 27/05/2025 15:30 //////////

  return (
    <div 
      ////////// Actualización: Cierre de modal al hacer clic en fondo - 28/05/2025 15:30 //////////
      onClick={() => onClose && onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
    >
      {/* ////////// Actualización: Evitar propagación del clic al contenido de la modal - 28/05/2025 15:30 ////////// */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-7xl bg-gray-900 border border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        
        {onClose && (
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 z-30 p-3 bg-gray-800/80 text-gray-400 rounded-full hover:text-white hover:bg-gray-700 transition backdrop-blur-md"
            >
                <X className="w-6 h-6" />
            </button>
        )}

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar / Header Info */}
            <div className="md:w-1/4 bg-gradient-to-br from-gray-900 via-[#0b0b0b] to-black p-10 border-r border-white/5 flex flex-col justify-center text-center md:text-left shrink-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <Zap className="w-64 h-64 text-indigo-500 absolute -top-10 -left-10" />
                </div>

                <div className="relative z-10">
                    <div className="mb-8 inline-flex items-center justify-center md:justify-start gap-2 text-[#FF5A1F] font-black bg-[#FF5A1F]/10 px-5 py-2 rounded-full border border-[#FF5A1F]/20 self-center md:self-start text-xs uppercase tracking-[0.2em]">
                        <Crown className="w-4 h-4 fill-current" /> Plan Estratégico
                    </div>
                    {/* ////////// Actualización de titulares y sellos de confianza para mayor persuasión de venta - 01/06/2025 10:00 ////////// */}
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                        Impulsa tu <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">Éxito Digital</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
                        {reason ? "Desbloquea el siguiente nivel de tu negocio. Elige la potencia necesaria para escalar tus resultados en Hotmart." : "Desbloquea el siguiente nivel de tu negocio. Elige la potencia necesaria para escalar tus resultados en Hotmart."}
                    </p>
                    
                    <div className="space-y-4 pt-10 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-4">Confianza Máxima</p>
                        <div className="flex flex-col gap-3 text-gray-400 text-sm">
                            <div className="flex items-center gap-3 font-medium"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Compra 100% segura en Hotmart®</div>
                            <div className="flex items-center gap-3 font-medium"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Garantía incondicional de 7 días</div>
                            <div className="flex items-center gap-3 font-medium"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Activación automática e inmediata</div>
                            <div className="flex items-center gap-3 font-medium"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Soporte VIP Prioritario</div>
                        </div>
                    </div>
                    {/* ////////// Fin de actualización - 01/06/2025 10:00 ////////// */}
                </div>
            </div>

            {/* Pricing Columns */}
            <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar relative">
                {/* Visual Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none"></div>

                <div className="p-8 md:p-12 relative z-10 flex flex-col flex-1">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-[#FF5A1F]" />
                            <p className="font-bold uppercase tracking-widest text-xs">Sincronizando Planes...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto w-full">
                                {plans
                                  .filter(p => {
                                      const currentIndex = planOrder.indexOf(currentPlan || 'starter');
                                      const nextSlug = currentIndex < planOrder.length - 1 ? planOrder[currentIndex + 1] : null;
                                      return p.slug === (currentPlan || 'starter') || p.slug === nextSlug;
                                  })
                                  .sort((a, b) => planOrder.indexOf(a.slug) - planOrder.indexOf(b.slug))
                                  .map((plan) => {
                                    const isCurrent = currentPlan === plan.slug || (!currentPlan && plan.slug === 'starter');
                                    const isSelected = selectedPlanSlug === plan.slug;

                                    const cardClasses = `
                                        relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer flex flex-col gap-4 group
                                        ${isSelected ? 'scale-105 z-20' : 'scale-100 z-10'}
                                        ${isCurrent 
                                            ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                                            : 'border-[#FF5A1F]/50 bg-gray-900 shadow-[0_0_60px_rgba(255,90,31,0.15)]'}
                                        ${isSelected && !isCurrent ? 'ring-4 ring-[#FF5A1F]/20' : ''}
                                        ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}
                                    `;
                                    // ////////// Fin de actualización - 27/05/2025 15:30 //////////

                                    return (
                                        <div 
                                            key={plan.id}
                                            onClick={() => setSelectedPlanSlug(plan.slug)}
                                            className={cardClasses}
                                        >
                                            {/* Badges de Estado */}
                                            {isCurrent && (
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                                    Tu Plan Actual
                                                </div>
                                            )}
                                            {!isCurrent && (
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF5A1F] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                                                    Siguiente Nivel
                                                </div>
                                            )}
                                            
                                            <div className="text-center">
                                                <h3 className={`font-black text-xl mb-1 ${isCurrent ? 'text-emerald-400' : 'text-[#FF5A1F]'}`}>{plan.name}</h3>
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-4xl font-black text-white tracking-tighter">
                                                        {plan.priceMonthly === 0 ? '$0' : `$${plan.priceMonthly}`}
                                                    </span>
                                                    <span className="text-sm text-gray-500 font-bold uppercase">/mes</span>
                                                </div>
                                            </div>

                                            <div className="h-px bg-white/5 w-full my-2"></div>

                                            <ul className="space-y-4 flex-1">
                                                {(plan.uiFeatures || []).slice(0, 5).map((feat, idx) => (
                                                    <li key={idx} className="flex gap-3 text-sm font-medium items-center text-gray-300">
                                                        <div className={`p-1 rounded-full ${isCurrent ? 'bg-emerald-500/20 text-emerald-500' : 'bg-[#FF5A1F]/20 text-[#FF5A1F]'}`}>
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                        {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                            
                                            <div className="pt-4">
                                                <div className={`w-full py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'bg-white/10 text-white border border-white/20' : 'text-gray-600'}`}>
                                                    {isSelected ? 'Seleccionado' : 'Hacer clic para ver detalles'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ////////// Reemplazo de estadísticas técnicas por argumentos de venta persuasivos en el panel de detalles - 01/06/2025 10:00 ////////// */}
                            {selectedPlanData && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gray-900/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                            {selectedPlanData.slug === 'max' ? <Rocket className="w-48 h-48 text-white" /> : <Shield className="w-48 h-48 text-white" />}
                                        </div>

                                        <div className="grid md:grid-cols-12 gap-12 items-center relative z-10">
                                            <div className="md:col-span-8 space-y-6">
                                                <div>
                                                    <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.3em] mb-2 block">Análisis del Plan {selectedPlanData.name}</span>
                                                    <h4 className="text-3xl font-black text-white leading-tight">
                                                        {planPitchMap[selectedPlanData.slug] || planPitchMap['default']}
                                                    </h4>
                                                </div>

                                                <div className="p-8 rounded-2xl bg-black/40 border border-white/5">
                                                    <p className="text-gray-300 text-lg leading-relaxed font-medium">
                                                    {selectedPlanData.slug === 'starter' && "Inicia tu camino hoy mismo validando tus ofertas con la potencia de la IA sin riesgos innecesarios."}
                                                    {selectedPlanData.slug.startsWith('plan-max-') && `Lleva tu proyecto ${selectedPlanData.slug.split('-').pop()} al estándar profesional con dominios propios, mayor capacidad de landing pages y todas las herramientas de conversión activadas.`}
                                                    {!selectedPlanData.slug.startsWith('plan-max-') && selectedPlanData.slug !== 'starter' && "Diseñado para agencias y productores de alto impacto. Control total, activos ilimitados y la máxima prioridad en nuestros servidores de generación."}
                                                </p>
                                                </div>
                                            </div>

                                            <div className="md:col-span-4 flex flex-col gap-4">
                                                <button 
                                                    onClick={() => handleUpgrade(selectedPlanData)}
                                                    disabled={!!processing || currentPlan === selectedPlanData.slug}
                                                    className={`w-full py-6 rounded-2xl font-black text-xl transition-all shadow-2xl transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 ${
                                                        currentPlan === selectedPlanData.slug 
                                                            ? 'bg-gray-800 text-gray-500 cursor-default opacity-50' 
                                                            : 'bg-[#FF5A1F] hover:bg-[#D94A1E] text-white shadow-[#FF5A1F]/20'
                                                    }`}
                                                >
                                                    {processing === selectedPlanData.slug ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                                                    {currentPlan === selectedPlanData.slug ? 'Tu Plan Actual' : `Activar ${selectedPlanData.name}`}
                                                    <ArrowRight className="w-6 h-6" />
                                                </button>
                                                <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                    Acceso instantáneo tras el pago
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* ////////// Fin de actualización - 01/06/2025 10:00 ////////// */}
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};