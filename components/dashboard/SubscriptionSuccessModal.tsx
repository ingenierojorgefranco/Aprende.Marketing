import React from 'react';
import { CheckCircle, Calendar, Star, X } from 'lucide-react';

interface SubscriptionSuccessModalProps {
  onClose: () => void;
  planName?: string;
}

export const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({ onClose, planName = 'Pro' }) => {
  // Calcular fecha aproximada del próximo pago (30 días)
  const nextPaymentDate = new Date();
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

  return (
    <div 
      ////////// Actualización: Cierre de modal al hacer clic en fondo - 28/05/2025 15:30 //////////
      onClick={() => onClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500"
    >
      <div 
        ////////// Actualización: Evitar propagación al contenido - 28/05/2025 15:30 //////////
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#0f1115] border border-green-500/30 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)] overflow-hidden flex flex-col md:flex-row"
      >
        
        {/* Left Side: Video & Welcome */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative bg-gradient-to-br from-gray-900 via-black to-black">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
            
            <div className="mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold uppercase tracking-wider mb-4">
                    Pago Exitoso
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                    ¡Felicidades! <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Ya eres {planName.toUpperCase()}</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Has desbloqueado todo el poder de la plataforma. Mira este video rápido de bienvenida para saber qué hacer ahora.
                </p>
            </div>

            {/* Video Placeholder */}
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl relative group cursor-pointer">
                <iframe 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0" 
                    title="Welcome Video" 
                    className="w-full h-full" 
                    allow="autoplay; encrypted-media; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        </div>

        {/* Right Side: Details & Invoice Info */}
        <div className="md:w-2/5 bg-[#16181d] p-8 border-l border-gray-800 flex flex-col relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-2 hover:bg-gray-800 rounded-full"><X className="w-6 h-6" /></button>
            
            <div className="mb-8 mt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Detalles de tu Suscripción</h3>
                
                <div className="space-y-5">
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20"><Star className="w-6 h-6 fill-current" /></div>
                        <div>
                            <p className="font-bold text-white text-lg leading-none mb-1">Plan {planName}</p>
                            <p className="text-sm text-gray-400">Suscripción Mensual Activa</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20"><Calendar className="w-6 h-6" /></div>
                        <div>
                            <p className="font-bold text-white text-lg leading-none mb-1">{nextPaymentDate.toLocaleDateString()}</p>
                            <p className="text-sm text-gray-400">Próxima renovación estimada</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Beneficios Desbloqueados:</h3>
                <ul className="space-y-3">
                    {[
                        'Proyectos Ilimitados', 
                        'Redacción de Artículos con IA', 
                        'CRM de WhatsApp Integrado', 
                        'Dominio Personalizado',
                        'Soporte Prioritario VIP'
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <button 
                onClick={onClose}
                className="w-full py-4 mt-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition transform hover:-translate-y-1 text-base tracking-wide"
            >
                Comenzar a Crear
            </button>
        </div>

      </div>
    </div>
  );
};