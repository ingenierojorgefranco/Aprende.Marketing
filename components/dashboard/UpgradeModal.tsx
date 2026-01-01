import React, { useEffect, useState } from 'react';
import { X, Check, Crown, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Plan } from '../../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentPlan?: string;
  reason?: string;
  ////////// Se añade userId opcional a las props para tracking SRC - 25/05/2025 11:30 //////////
  userId?: string;
  ////////// Fin de actualización - 25/05/2025 11:30 //////////
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, currentPlan, reason, userId }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  ////////// Estado para el método de pago activo del sistema - 24/05/2025 10:30 //////////
  const [activePaymentMethod, setActivePaymentMethod] = useState<'stripe' | 'hotmart'>('stripe');
  ////////// Fin de actualización - 24/05/2025 10:30 //////////
  const [processing, setProcessing] = useState<string | null>(null);

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
              if (plan.hotmartId) {
                  ////////// Obtención robusta del userId para el tracking SRC - 25/05/2025 11:30 //////////
                  // Priorizamos la prop userId, si no existe buscamos en localStorage (formato compatible con auth.ts)
                  const finalUserId = userId || localStorage.getItem('plataformadeventacom_user_id') || '0';
                  const hotmartUrl = `https://pay.hotmart.com/${plan.hotmartId}?checkoutMode=10&src=${finalUserId}`;
                  ////////// Fin de actualización - 25/05/2025 11:30 //////////
                  window.location.href = hotmartUrl;
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
                      window.location.href = response.url;
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {onClose && (
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-gray-400 rounded-full hover:text-white hover:bg-gray-700 transition"
            >
                <X className="w-5 h-5" />
            </button>
        )}

        {/* Sidebar / Header Info */}
        <div className="md:w-1/4 bg-gradient-to-br from-gray-900 to-black p-8 border-r border-gray-800 flex flex-col justify-center text-center md:text-left shrink-0">
            <div className="mb-6 inline-flex items-center justify-center md:justify-start gap-2 text-yellow-500 font-bold bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 self-center md:self-start">
                <Crown className="w-4 h-4 fill-current" /> Límite Alcanzado
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                Escala tu Negocio al <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Siguiente Nivel</span>
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                {reason || "Has alcanzado los límites de tu plan actual. Actualiza para desbloquear todo el potencial."}
            </p>
            <div className="hidden md:block">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Garantía de Confianza</p>
                <div className="flex flex-col gap-2 text-gray-400 text-xs">
                    <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-green-500" /> Cancelación fácil</div>
                    {/* ////////// Texto dinámico según el procesador de pagos - 24/05/2025 10:30 ////////// */}
                    <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-green-500" /> {activePaymentMethod === 'hotmart' ? 'Pagos protegidos por Hotmart' : 'Pagos seguros por Stripe'}</div>
                    {/* ////////// Fin de actualización - 24/05/2025 10:30 ////////// */}
                </div>
            </div>
        </div>

        {/* Pricing Columns */}
        <div className="flex-1 p-6 md:p-8 bg-[#0a0a0a] overflow-x-auto">
            {loading ? (
                <div className="flex h-full items-center justify-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mr-2" /> Cargando planes...
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-4 h-full">
                    {plans.map((plan) => {
                        const isCurrent = currentPlan === plan.slug;
                        const isRecommended = plan.isRecommended;
                        const isProcessingThis = processing === plan.slug;

                        return (
                            <div 
                                key={plan.id}
                                className={`flex-1 min-w-[260px] rounded-2xl border p-6 flex flex-col relative transition ${
                                    isRecommended 
                                        ? 'border-orange-500 bg-gray-900 shadow-2xl shadow-orange-900/10 z-10 scale-105 md:scale-100 lg:scale-105' 
                                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                                } ${isCurrent ? 'opacity-70' : ''}`}
                            >
                                {isRecommended && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                                        Recomendado
                                    </div>
                                )}
                                
                                <div className="mb-4 text-center">
                                    <h3 className={`font-bold text-lg ${isRecommended ? 'text-orange-400' : 'text-gray-300'}`}>{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-3xl font-black text-white">
                                            {plan.priceMonthly === 0 ? '$0' : `$${plan.priceMonthly}`}
                                        </span>
                                        <span className="text-xs text-gray-500">/mes</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 min-h-[32px]">{plan.description}</p>
                                </div>

                                <ul className="space-y-3 text-sm text-gray-400 mb-6 flex-1">
                                    {(plan.uiFeatures || []).map((feat, idx) => (
                                        <li key={idx} className="flex gap-2 text-xs">
                                            <Check className={`w-4 h-4 flex-shrink-0 ${isRecommended ? 'text-orange-500' : 'text-gray-600'}`} /> 
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                {isCurrent ? (
                                    <button disabled className="w-full py-2.5 rounded-lg border border-gray-700 text-gray-500 text-sm font-bold cursor-default bg-gray-800/50">
                                        Plan Actual
                                    </button>
                                ) : plan.priceMonthly === 0 ? (
                                    <button disabled className="w-full py-2.5 rounded-lg border border-gray-700 text-gray-400 text-sm font-bold cursor-default">
                                        Plan Básico
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleUpgrade(plan)}
                                        disabled={!!processing}
                                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                                            isRecommended 
                                                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                                                : 'border border-gray-600 text-white hover:bg-white hover:text-black'
                                        }`}
                                    >
                                        {isProcessingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        {isProcessingThis ? 'Procesando...' : `Obtener ${plan.name}`}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};