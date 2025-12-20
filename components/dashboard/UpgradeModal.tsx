
import React, { useEffect, useState } from 'react';
import { X, Check, Crown, ShieldCheck, Loader2, Zap, CreditCard } from 'lucide-react';
import { api } from '../../services/api';
import { Plan, User } from '../../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentPlan?: string;
  reason?: string;
  user?: User; // Opcional si viene de context
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, currentPlan, reason, user }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string>('stripe');

  useEffect(() => {
      if (isOpen) {
          setLoading(true);
          Promise.all([
              api.getPublicPlans(),
              api.getActivePaymentProvider()
          ]).then(([plansData, provider]) => {
              setPlans(plansData);
              setActiveProvider(provider);
          }).catch(err => console.error("Error loading plans", err))
            .finally(() => setLoading(false));
      }
  }, [isOpen]);

  const handleUpgrade = async (plan: Plan) => {
      setProcessing(plan.slug);
      
      try {
          if (activeProvider === 'hotmart') {
              // Lógica Hotmart: Redirigir directamente al Hotlink con el ID de usuario en parámetro xc
              const userId = user?.id || 'anonymous';
              const baseUrl = plan.hotmartUrl;
              if (!baseUrl) {
                  alert("Este plan no tiene link de Hotmart configurado.");
                  return;
              }
              const separator = baseUrl.includes('?') ? '&' : '?';
              const checkoutUrl = `${baseUrl}${separator}xc=${userId}`;
              window.open(checkoutUrl, '_blank');
          } else {
              // Lógica Stripe actual
              const response = await api.createCheckoutSession(plan.slug);
              if (response && response.url) {
                  window.location.href = response.url;
              }
          }
      } catch (error: any) {
          alert(`Error al iniciar el pago: ${error.message}`);
      } finally {
          setProcessing(null);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {onClose && <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition"><X className="w-5 h-5" /></button>}

        <div className="md:w-1/3 bg-black p-8 border-r border-gray-800 flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-2 text-yellow-500 font-bold bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20">
                <Crown className="w-4 h-4 fill-current" /> Sube de Nivel
            </div>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">Escala tu Negocio</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">{reason || "Desbloquea todo el potencial de la IA para tus ventas."}</p>
            <div className="flex flex-col gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-green-500" /> Pagos seguros vía {activeProvider === 'stripe' ? 'Stripe' : 'Hotmart'}</div>
            </div>
        </div>

        <div className="flex-1 p-8 bg-[#0a0a0a]">
            {loading ? <div className="flex h-full items-center justify-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin" /></div> : (
                <div className="flex flex-col md:flex-row gap-4">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`flex-1 rounded-2xl border p-6 flex flex-col relative transition ${plan.isRecommended ? 'border-orange-500 bg-gray-900 shadow-xl' : 'border-gray-800 bg-gray-900/50'}`}>
                            <h3 className="font-bold text-gray-300 mb-2">{plan.name}</h3>
                            <div className="text-3xl font-black text-white mb-4">${plan.priceMonthly}<span className="text-xs text-gray-500">/mes</span></div>
                            <ul className="space-y-3 text-xs text-gray-400 mb-8 flex-1">
                                {(plan.uiFeatures || []).map((feat, idx) => (
                                    <li key={idx} className="flex gap-2"><Check className="w-3 h-3 text-green-500 flex-shrink-0" /> {feat}</li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => handleUpgrade(plan)}
                                disabled={!!processing || currentPlan === plan.slug}
                                className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${plan.isRecommended ? 'bg-orange-600 text-white' : 'bg-white text-black'} disabled:opacity-50`}
                            >
                                {processing === plan.slug && <Loader2 className="w-4 h-4 animate-spin" />}
                                {currentPlan === plan.slug ? 'Tu Plan Actual' : 'Seleccionar Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
