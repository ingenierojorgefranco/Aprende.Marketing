
import React, { useState } from 'react';
import { 
  PenTool, Sparkles, Brain, Zap, Lock, 
  MessageSquare, Mail, Target, Layout, 
  ChevronRight, ArrowRight, Star, ShieldCheck,
  MousePointer2, Bot
} from 'lucide-react';

////////// Creación del sistema CopySell Pro con estética Premium Dark y capa de bloqueo "Próximamente" - 18/06/2024 10:30 //////////

export const CopySellPro: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('sales');

  const templates = [
    { id: 'sales', icon: Layout, title: 'Páginas de Venta', desc: 'Guiones estructurados para Landing Pages de alta conversión.' },
    { id: 'emails', icon: Mail, title: 'Secuencias de Email', desc: 'Estrategias de 7 y 30 días para nutrir y cerrar leads.' },
    { id: 'vsl', icon: Target, title: 'Guiones para VSL', desc: 'Estructuras persuasivas para videos de ventas de impacto.' },
    { id: 'ads', icon: Sparkles, title: 'Anuncios Ganadores', desc: 'Copy optimizado para Facebook, Instagram y TikTok Ads.' },
    { id: 'wa', icon: MessageSquare, title: 'Scripts de WhatsApp', desc: 'Guiones de cierre uno a uno para vender por chat.' }
  ];

  return (
    <div className="relative min-h-[80vh] bg-black text-white animate-in fade-in duration-700">
      {/* Header Informativo */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest mb-4">
          <Brain className="w-4 h-4" /> Inteligencia Artificial Persuasiva
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
          CopySell <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Pro</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl leading-relaxed font-light">
          El motor de escritura más avanzado para afiliados y productores. Genera guiones de venta que tocan los dolores reales de tu avatar en segundos.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Panel Lateral de Plantillas */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 ml-2">Selecciona un Motor</h3>
          {templates.map((t) => (
            <div 
              key={t.id}
              className={`p-6 rounded-2xl border transition-all duration-300 group cursor-pointer ${selectedCategory === t.id ? 'bg-purple-900/10 border-purple-500/40 shadow-lg shadow-purple-500/5' : 'bg-[#0B0B0B] border-white/5 hover:border-white/10'}`}
              onClick={() => setSelectedCategory(t.id)}
            >
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl ${selectedCategory === t.id ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'} transition-colors`}>
                  <t.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{t.title}</h4>
                  <p className="text-sm text-gray-500 leading-snug">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Área de Generación IA */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0B0B0B] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden h-full">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" /> Editor de Guiones
              </h3>
              <div className="flex gap-2">
                {['Profesional', 'Urgente', 'Cercano'].map(tone => (
                  <span key={tone} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">{tone}</span>
                ))}
              </div>
            </div>

            <div className="space-y-8 opacity-40 grayscale">
              <div className="space-y-4">
                <div className="h-4 bg-gray-800 rounded-full w-1/4"></div>
                <div className="h-12 bg-gray-900 rounded-xl border border-white/5 w-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-800 rounded-full w-1/3"></div>
                <div className="h-32 bg-gray-900 rounded-xl border border-white/5 w-full"></div>
              </div>
              <div className="h-16 bg-purple-600/20 rounded-2xl w-full border border-purple-500/20 flex items-center justify-center font-bold text-purple-300">
                GENERAR SCRIPT CON IA
              </div>
            </div>

            {/* Capa Glassmorphism de Bloqueo */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-8 z-20">
              <div className="text-center max-w-md animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-3xl font-black text-white mb-4 tracking-tight">Próximamente</h4>
                <p className="text-gray-300 text-lg mb-8 font-light">
                  Estamos entrenando nuestro motor IA con las estructuras de venta que más han facturado en Hotmart este último año.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-purple-400">
                  <Sparkles className="w-4 h-4" /> Acceso exclusivo nivel PRO/MAX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Argumentos de Venta Inferiores */}
      <div className="mt-24 grid md:grid-cols-3 gap-8 pb-20">
         {[
           { icon: ShieldCheck, title: 'Neuro-Copywriting', desc: 'Basado en gatillos mentales que reducen la fricción de compra.' },
           { icon: MousePointer2, title: 'Optimizado para CTR', desc: 'Headlines magnéticos diseñados para detener el scroll de inmediato.' },
           { icon: Bot, title: 'Entrenamiento Hotmart', desc: 'IA alimentada con las landings que más convierten en habla hispana.' }
         ].map((feat, i) => (
           <div key={i} className="p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 to-black border border-white/5">
             <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6 border border-purple-500/20">
                <feat.icon className="w-6 h-6" />
             </div>
             <h4 className="text-xl font-bold text-white mb-3">{feat.title}</h4>
             <p className="text-gray-400 leading-relaxed text-sm">{feat.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
};
////////// Fin de actualización - 18/06/2024 10:30 //////////
