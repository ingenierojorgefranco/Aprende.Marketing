
import React, { useState } from 'react';
import { X, AlertTriangle, Send, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

interface DeletionRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  userEmail: string;
  userName: string;
}

export const DeletionRestrictionModal: React.FC<DeletionRestrictionModalProps> = ({
  isOpen,
  onClose,
  itemName,
  userEmail,
  userName
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await api.submitSupportTicket({ itemName, reason });
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
    } catch (error) {
        alert("Error al enviar la solicitud. Por favor intenta de nuevo.");
        setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-[#161616] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Línea de acento naranja */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-orange-600"></div>
        
        <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-r from-[#FF5A1F]/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF5A1F]/20 rounded-2xl flex items-center justify-center text-[#FF5A1F] shadow-[0_0_20px_rgba(255,90,31,0.2)]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Acción Restringida</h3>
              <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">Límites del Plan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {success ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black text-white uppercase">Solicitud Enviada</h4>
              <p className="text-gray-400 font-medium">Nuestro equipo analizará tu solicitud de eliminación manual y te responderá por correo electrónico.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <p className="text-white text-lg font-medium leading-relaxed">
                  Por limitaciones estratégicas en tu plan actual, <span className="text-[#FF5A1F] font-bold">no es posible eliminar elementos</span> una vez han sido procesados por la IA.
                </p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-gray-400 text-sm leading-relaxed italic">
                  "Esta medida asegura la integridad de los créditos del sistema. Puedes editar el elemento libremente para ajustarlo a tu nueva estrategia."
                </div>
                <p className="text-gray-500 text-sm">
                  Si por fuerza mayor necesitas borrar "{itemName}", envía una solicitud detallando el motivo:
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tu Nombre</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={userName} 
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-gray-600 text-sm outline-none cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tu Email</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={userEmail} 
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-gray-600 text-sm outline-none cursor-not-allowed" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Motivo de Fuerza Mayor</label>
                  <textarea 
                    required 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explica por qué necesitas eliminar este activo..."
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF5A1F] outline-none transition h-24 resize-none text-sm placeholder:text-gray-700" 
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !reason.trim()}
                  className="w-full py-4 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF5A1F]/20 flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                  Enviar Solicitud
                </button>
              </form>
            </>
          )}
        </div>
        
        <div className="p-6 bg-black/40 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Protocolo de Seguridad — Aprende.Marketing v2.9</p>
        </div>
      </div>
    </div>
  );
};
