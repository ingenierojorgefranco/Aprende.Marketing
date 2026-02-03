import React from 'react';
import { Phone, MoreVertical, Send, Smile, Star, MessageSquare, Zap, PlayCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const ProjectStrategy_Testimonials: React.FC = () => {
  const { strategyData } = useOutletContext() as any;

  // Mensajes de respuesta del experto (Fijos)
  const expertReplies = [
    "¡Qué increíble Maria! 🎉 Ese es el poder de la IA cuando tiene la estrategia correcta detrás. ¡A seguir escalando ese proyecto! 🚀",
    "Exacto Juan, la velocidad es la clave en Hotmart. Me alegra mucho que te esté ahorrando tanto tiempo. ¡A por más ventas! 💰",
    "¡Esa es la meta Ana! El tráfico gratis es el más rentable de todos. Sigue así, el sistema seguirá trabajando para ti. 💎"
  ];

  // Imágenes de avatar para el chat (Fijas)
  const avatarImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  ];

  // Datos dinámicos fusionados con la estructura estética original
  const dynamicTestimonials = strategyData?.modules?.testimonials && strategyData.modules.testimonials.length >= 3 
    ? strategyData.modules.testimonials.slice(0, 3).map((t: any, i: number) => ({
        name: t.name,
        img: avatarImages[i],
        msg: t.text,
        reply: expertReplies[i]
      }))
    : [
        { 
          name: "Maria G.", 
          img: avatarImages[0], 
          msg: "¡Chicos! No puedo creerlo. Lancé mi primera landing page con la IA ayer y ya tengo 15 registros. El copywriting es brutal, parece escrito por un experto de años.",
          reply: expertReplies[0]
        },
        { 
          name: "Juan P.", 
          img: avatarImages[1], 
          msg: "Por fin una herramienta que entiende lo que necesitamos. He generado mi web de ventas en segundos y los textos son mejores que los que yo hacía en horas.",
          reply: expertReplies[1]
        },
        { 
          name: "Ana S.", 
          img: avatarImages[2], 
          msg: "Increíble cómo optimizó mis artículos para SEO. Estoy empezando a recibir tráfico orgánico desde Google sin gastar ni un dólar en anuncios.",
          reply: expertReplies[2]
        }
      ];

  return (
    <div className="space-y-16">
      {/* CABECERA ESTRATÉGICA */}
      <div className="max-w-[70em] mx-auto text-left space-y-8 py-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
          <MessageSquare className="w-5 h-5 fill-current" /> Prueba Social Validada
        </div>
        <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 leading-tight tracking-tight max-w-4xl">
          Testimonios de Éxito
        </h3>
        
        <div className="grid md:grid-cols-2 gap-10 text-white text-[1.3rem] leading-[2.5rem] font-light">
          <p className="border-l-4 border-emerald-500 pl-8 py-2">
            La prueba social es el gatillo mental más potente para cerrar ventas. Cuando tus prospectos ven que otros ya están logrando resultados, su miedo al fracaso desaparece.
          </p>
          <p className="border-l-4 border-teal-500 pl-8 py-2">
            Utiliza estos testimonios reales de nuestra comunidad como referencia para entender el impacto que tendrá tu sistema una vez esté 100% operativo en el mercado.
          </p>
        </div>
      </div>

      {/* BLOQUE DE VIDEO: SOPORTE VISUAL ESTRATÉGICO */}
      <div className="max-w-[70em] mx-auto px-4 md:px-0">
        <div className="bg-gray-900/40 p-4 md:p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-emerald-500/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-30"></div>
          <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-inner bg-black relative">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" 
              title="Estrategia de Prueba Social" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
            <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity group-hover:opacity-0">
              <PlayCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-white text-xs font-black uppercase tracking-widest">Video: El Poder de los Testimonios</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE WHATSAPP CHATS */}
      <div className="max-w-[85em] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4">
          {dynamicTestimonials.map((chat, i) => (
            <div key={i} className="bg-[#E5DDD5] rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-[#0B0B0B] overflow-hidden shadow-2xl relative h-[600px] md:h-[700px] flex flex-col group hover:scale-[1.02] transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] p-4 md:p-6 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-white/20 overflow-hidden shadow-md">
                    <img src={chat.img} alt={chat.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-base md:text-lg leading-tight">{chat.name}</h4>
                    <p className="text-[10px] md:text-xs opacity-80 font-medium">En línea</p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 opacity-70">
                  <Phone className="w-5 md:w-6 h-5 md:h-6" />
                  <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-10">
                <div className="flex justify-start animate-in slide-in-from-left-6 duration-700">
                  <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tl-none shadow-sm max-w-[90%] relative border border-gray-100">
                    <p className="text-sm md:text-[1.1rem] text-[#0B0B0B] leading-relaxed font-medium">{chat.msg}</p>
                    <span className="text-[8px] md:text-[10px] text-gray-400 block text-right mt-2 md:mt-3 font-bold uppercase">10:45 AM</span>
                  </div>
                </div>

                <div className="flex justify-end animate-in slide-in-from-right-6 duration-1000 delay-500">
                  <div className="bg-[#DCF8C6] p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tr-none shadow-md max-w-[90%] relative border border-green-200">
                    <p className="text-sm md:text-[1.1rem] text-[#0B0B0B] leading-relaxed font-medium">{chat.reply}</p>
                    <span className="text-[8px] md:text-[10px] text-green-700 block text-right mt-2 md:mt-3 font-bold uppercase tracking-wider">10:46 AM ✓✓</span>
                  </div>
                </div>
              </div>

              {/* Input Bar */}
              <div className="bg-[#F0F0F0] p-4 md:p-5 flex items-center gap-2 md:gap-3 border-t border-gray-300 shrink-0">
                <Smile className="w-6 md:w-7 h-6 md:h-7 text-gray-500" />
                <div className="flex-1 bg-white h-10 md:h-12 rounded-full border border-gray-200 px-4 md:px-6 flex items-center text-xs md:text-sm text-gray-400 italic">Escribe...</div>
                <div className="w-10 md:w-12 h-10 md:h-12 bg-[#075E54] rounded-full flex items-center justify-center text-white shadow-lg"><Send className="w-5 md:w-6 h-5 md:h-6 fill-current ml-1" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="max-w-[70em] mx-auto text-center pt-12 border-t border-white/5 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema Estratégico v2.9 — Motor de Prueba Social Dinámica</p>
      </div>
    </div>
  );
};