import React from 'react';
import { X, Check, Star, Zap, Crown, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentPlan?: string;
  reason?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, currentPlan, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {onClose && (
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-gray-400 rounded-full hover:text-white hover:bg-gray-700 transition"
            >
                <X className="w-5 h-5" />
            </button>
        )}

        {/* Sidebar / Header Info */}
        <div className="md:w-1/3 bg-gradient-to-br from-gray-900 to-black p-8 border-r border-gray-800 flex flex-col justify-center text-center md:text-left">
            <div className="mb-6 inline-flex items-center justify-center md:justify-start gap-2 text-yellow-500 font-bold bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 self-center md:self-start">
                <Crown className="w-4 h-4 fill-current" /> Límite Alcanzado
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Escala tu Negocio al <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Siguiente Nivel</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
                {reason || "Has alcanzado los límites de tu plan actual. Actualiza para desbloquear todo el potencial."}
            </p>
            <div className="hidden md:block">
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-4">Garantía de Confianza</p>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Cancelación fácil</div>
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Pagos seguros</div>
                </div>
            </div>
        </div>

        {/* Pricing Columns */}
        <div className="md:w-2/3 p-6 md:p-8 bg-[#0a0a0a]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                
                {/* FREE */}
                <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 flex flex-col relative opacity-70 hover:opacity-100 transition">
                    <div className="mb-4">
                        <h3 className="font-bold text-gray-300">Starter</h3>
                        <p className="text-2xl font-black text-white">0€</p>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-400 mb-6 flex-1">
                        <li className="flex gap-2"><Check className="w-4 h-4 text-gray-500" /> 1 Proyecto</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-gray-500" /> 3 Landing Pages</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-gray-500" /> Marca de Agua</li>
                    </ul>
                    <button className="w-full py-2 rounded-lg border border-gray-700 text-gray-500 text-sm font-bold cursor-default">
                        Plan Actual
                    </button>
                </div>

                {/* PRO (Highlighted) */}
                <div className="rounded-2xl border-2 border-orange-500 bg-gray-900 p-6 flex flex-col relative shadow-2xl shadow-orange-900/20 transform scale-105 z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Recomendado
                    </div>
                    <div className="mb-4 text-center">
                        <h3 className="font-bold text-orange-400 text-lg">Emprendedor</h3>
                        <p className="text-4xl font-black text-white">9,99€</p>
                        <p className="text-xs text-gray-500">/mes</p>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-1">
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-orange-500" /> <strong>5 Proyectos</strong></li>
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-orange-500" /> <strong>20 Landing Pages</strong></li>
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-orange-500" /> Dominio Propio</li>
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-orange-500" /> Bot de WhatsApp</li>
                        <li className="flex gap-2 items-center"><Zap className="w-4 h-4 text-yellow-500" /> IA Avanzada</li>
                    </ul>
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm shadow-lg transition transform hover:scale-[1.02]">
                        Elegir Plan Pro
                    </button>
                </div>

                {/* MAX */}
                <div className="rounded-2xl border border-purple-900/50 bg-gray-900/50 p-6 flex flex-col relative hover:border-purple-500/50 transition">
                    <div className="mb-4 text-center">
                        <h3 className="font-bold text-purple-400">Negocios</h3>
                        <p className="text-3xl font-black text-white">24,99€</p>
                        <p className="text-xs text-gray-500">/mes</p>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-400 mb-6 flex-1">
                        <li className="flex gap-2 items-center"><Star className="w-4 h-4 text-purple-500" /> <strong>Ilimitado*</strong> Proyectos</li>
                        <li className="flex gap-2 items-center"><Star className="w-4 h-4 text-purple-500" /> <strong>Ilimitado*</strong> Landings</li>
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-purple-500" /> Soporte Prioritario</li>
                        <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-purple-500" /> API Access</li>
                    </ul>
                    <button className="w-full py-2 rounded-lg border border-purple-700 text-purple-400 hover:bg-purple-900/20 text-sm font-bold transition">
                        Elegir Max
                    </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};