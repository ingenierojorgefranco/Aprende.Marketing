
import React from 'react';
import { MessageCircle, Zap, Users, Search, ArrowRight, Sparkles } from 'lucide-react';

export const LaunchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-[#FF5A1F] selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF5A1F]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-5xl w-full relative z-10 text-center space-y-12">
        {/* Hero */}
        <div className="space-y-6 animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-black uppercase tracking-[0.2em] mb-4 shadow-lg shadow-[#FF5A1F]/5">
            <Sparkles className="w-4 h-4" /> Próximo Lanzamiento Oficial
          </div>
          <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tight">
            La Nueva Revolución del <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-orange-500">Marketing</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            ¡Felicidades! Tu lugar en la lista de espera ha sido reservado. Estamos a punto de liberar el sistema más potente para vender productos digitales con IA.
          </p>
        </div>

        {/* WhatsApp Button */}
        <div className="animate-in zoom-in-95 duration-700 delay-200 py-4">
          <div className="relative inline-block">
            {/* Pulse effect */}
            <div className="absolute -inset-4 bg-[#25D366]/20 rounded-[3rem] blur-xl animate-pulse"></div>
            
            <a 
              href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white px-10 py-6 rounded-[3rem] font-black text-xl md:text-2xl shadow-[0_20px_50px_-10px_rgba(37,211,102,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 z-10"
            >
              <MessageCircle className="w-8 h-8 relative z-10 fill-current" />
              <span className="relative z-10">Únete al Grupo VIP de WhatsApp</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="mt-8 text-gray-500 font-black uppercase tracking-[0.3em] text-[11px]">
            Haz clic para recibir el acceso anticipado y bonos exclusivos
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          {[
            { icon: Zap, title: "Generador Estratégico IA", desc: "Crea embudos de venta de alta conversión en menos de 60 segundos." },
            { icon: Users, title: "CRM de Ventas Pro", desc: "Gestión inteligente de prospectos para cerrar ventas en automático." },
            { icon: Search, title: "Artículos SEO Automáticos", desc: "Atrae tráfico gratuito desde Google directo a tus ofertas 24/7." }
          ].map((benefit, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-col items-center text-center gap-6 hover:border-[#FF5A1F]/30 hover:bg-white/[0.05] transition-all duration-500 group shadow-2xl">
              <div className="p-5 bg-[#FF5A1F]/10 rounded-[1.5rem] text-[#FF5A1F] border border-[#FF5A1F]/20 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all duration-300 shadow-inner">
                <benefit.icon className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h4 className="font-black text-xl tracking-tight uppercase">{benefit.title}</h4>
                <p className="text-gray-500 text-base leading-relaxed font-medium">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-20 opacity-30 border-t border-white/5">
            <p className="text-xs font-bold uppercase tracking-[0.4em]">Aprende.Marketing v2.9 — Protocolo de Lanzamiento</p>
        </div>
      </div>
    </div>
  );
};
